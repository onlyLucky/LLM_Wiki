// Day 2 · 作业 challenge —— GPGPU 余烬升腾（参考答案）
// 对应讲义 2.6（计算着色器入门）/ 2.7（GPGPU 粒子与动画模拟）：
// 一万颗余烬的双缓冲状态机全链路，storage 直读渲染，速度映射色带。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import particlesSim from './particles.wgsl?raw';
import particlesRender from './render.wgsl?raw';

type Vec3 = [number, number, number];

const chrome = createChrome({
  day: 2,
  index: 'C',
  title: 'EMBER RISE',
  tags: ['WEBGPU', 'COMPUTE', 'GPGPU'],
  hint: '按住鼠标掀起一阵风',
});

// ---- 初始化 -----------------------------------------------------
// 先判空再赋给显式非空类型的 device：function 声明会被提升，
// TS 的空值收窄进不了函数体（各 create 工厂里 device 又变回可空）
const maybeDevice = await initGPU(chrome);
if (!maybeDevice) throw new Error('WebGPU 初始化失败，详情见页面错误面板');
const device: GPUDevice = maybeDevice;

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

const COUNT = 10000;
const STRIDE = 32; // 每粒子 vec4f pos + vec4f vel（对齐教训见讲义 2.7）

// ---- 粒子状态与双缓冲 --------------------------------------------

function createParticleStates(): GPUBuffer[] {
  const states: GPUBuffer[] = [0, 1].map(() =>
    device.createBuffer({
      size: COUNT * STRIDE,
      // COPY_DST：states[0] 的初始数据由 queue.writeBuffer 写入
      usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
    }),
  );
  // 初始火床只写进 states[0]：底部圆盘 + 高度铺满烟囱 + 向上初速
  const init = new Float32Array(COUNT * 8);
  for (let i = 0; i < COUNT; i++) {
    // sqrt 均匀盘：火床半径 0.85；高度直接铺满烟囱，首帧就是烧起来的样子
    const rr = Math.sqrt(Math.random()) * 0.85;
    const a = Math.random() * Math.PI * 2;
    const k = i * 8;
    init[k] = Math.cos(a) * rr;          // x
    init[k + 1] = -1.42 + Math.random() * 2.9; // y：-1.42 .. 1.48
    init[k + 2] = Math.sin(a) * rr;      // z
    // 初速度向上：有的粒子刚点燃，有的已经升到半空
    init[k + 5] = 0.25 + Math.random() * 0.45;
  }
  device.queue.writeBuffer(states[0], 0, init);
  return states;
}

// ---- compute 管线 -------------------------------------------------
// 力场本体（噪声湍流 + 浮力 + 烟囱束缚 + 鼠标风 + 出界重生）在 particles.wgsl 的 update 里。

const simModule = device.createShaderModule({ code: particlesSim });

function createComputePipeline(): GPUComputePipeline {
  return device.createComputePipeline({
    layout: 'auto',
    compute: { module: simModule, entryPoint: 'update' },
  });
}

// ---- 两组 uniform：模拟参数与渲染参数 ------------------------------
const simUniforms = new Float32Array(8); // mouse(4) + params(4)
const simBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
const renderUniforms = new Float32Array(20); // vp(16) + res(4)
const renderBuffer = device.createBuffer({
  size: 80,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 双缓冲交换与绑定组轮换 ----------------------------------------

function createComputeBindGroups(states: GPUBuffer[]): GPUBindGroup[] {
  // 第 i 组：读 states[i] 写 states[1 - i]——两组互为镜像
  return [0, 1].map((i) =>
    device!.createBindGroup({
      layout: computePipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: states[i] } },     // src：只读
        { binding: 1, resource: { buffer: states[1 - i] } }, // dst：可写
        { binding: 2, resource: { buffer: simBuffer } },
      ],
    }),
  );
}

// ---- storage 直读渲染 ---------------------------------------------

const renderModule = device.createShaderModule({ code: particlesRender });

function createRenderPipeline(): GPURenderPipeline {
  return device!.createRenderPipeline({
    layout: 'auto',
    vertex: { module: renderModule, entryPoint: 'vs' },
    fragment: {
      module: renderModule,
      entryPoint: 'fs',
      targets: [{
        format,
        // 加法混合：余烬叠余烬，天然辉光，且与绘制顺序无关（无需深度）
        blend: {
          color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
          alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
        },
      }],
    },
    primitive: { topology: 'triangle-list' },
  });
}

function createRenderBindGroups(states: GPUBuffer[]): GPUBindGroup[] {
  return [0, 1].map((i) =>
    device!.createBindGroup({
      layout: renderPipeline.getBindGroupLayout(0),
      entries: [
        { binding: 0, resource: { buffer: states[i] } },
        { binding: 1, resource: { buffer: renderBuffer } },
      ],
    }),
  );
}

// ---- 已给全：初始化调用 -------------------------------------------
const states = createParticleStates();
const computePipeline = createComputePipeline();
const computeBindGroups = createComputeBindGroups(states);
const renderPipeline = createRenderPipeline();
const renderBindGroups = createRenderBindGroups(states);

// ---- 已给全：矩阵（列主序，约定见讲义 2.1）-----------------------
const sub3 = (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const cross3 = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const dot3 = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const normalize3 = (a: Vec3): Vec3 => {
  const l = Math.hypot(a[0], a[1], a[2]) || 1;
  return [a[0] / l, a[1] / l, a[2] / l];
};

function multiply(a: Float32Array, b: Float32Array): Float32Array {
  const out = new Float32Array(16);
  for (let c = 0; c < 4; c++) {
    for (let r = 0; r < 4; r++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) sum += a[k * 4 + r] * b[c * 4 + k];
      out[c * 4 + r] = sum;
    }
  }
  return out;
}

function perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  const f = 1 / Math.tan(fovY / 2);
  const nf = 1 / (near - far);
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, far * nf, -1,
    0, 0, far * near * nf, 0,
  ]);
}

function lookAt(eye: Vec3, target: Vec3, up: Vec3): Float32Array {
  const z = normalize3(sub3(eye, target));
  const x = normalize3(cross3(up, z));
  const y = cross3(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot3(x, eye), -dot3(y, eye), -dot3(z, eye), 1,
  ]);
}

// 沿相机射线与 y=0 平面求交，拿到鼠标的世界坐标（风的作用锚点）
function ndcToPlane(
  nx: number, ny: number, eye: Vec3, fwd: Vec3, right: Vec3, up2: Vec3,
  halfW: number, halfH: number,
): Vec3 | null {
  const dir = normalize3([
    fwd[0] + right[0] * nx * halfW + up2[0] * ny * halfH,
    fwd[1] + right[1] * nx * halfW + up2[1] * ny * halfH,
    fwd[2] + right[2] * nx * halfW + up2[2] * ny * halfH,
  ]);
  if (dir[1] > -0.05) return null; // 射线掠过平面：保持上一次的世界坐标
  const t = -eye[1] / dir[1];
  return [eye[0] + dir[0] * t, 0.0, eye[2] + dir[2] * t];
}

// ---- 鼠标：位置 + 按下状态 ----------------------------------------
let mouseNdc: [number, number] = [0, 0];
let pressed = false;
let mouseWorld: Vec3 = [0.0, 0.0, 0.0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouseNdc = [
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  ];
});
chrome.canvas.addEventListener('pointerdown', () => { pressed = true; });
chrome.canvas.addEventListener('pointerup', () => { pressed = false; });
chrome.canvas.addEventListener('pointerleave', () => { pressed = false; });

// ---- 帧循环 ------------------------------------------------------
const FOV = (50 * Math.PI) / 180;
const start = performance.now();
let last = start;
let cur = 0; // 双缓冲指针：本帧读 states[cur] 写 states[1-cur]
const dpr = Math.min(window.devicePixelRatio || 1, 2);

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  // 相机：低角度平视烟囱 + 缓慢漂移 + 鼠标视差（幅度克制）
  const aspect = chrome.width / chrome.height;
  const az = -0.10 + 0.14 * Math.sin(t * 0.05) + mouseNdc[0] * 0.22;
  const el = 0.34 + mouseNdc[1] * 0.10;
  const eye: Vec3 = [
    Math.sin(az) * Math.cos(el) * 4.2,
    Math.sin(el) * 4.2,
    Math.cos(az) * Math.cos(el) * 4.2,
  ];
  const target: Vec3 = [0.0, 0.1, 0.0];
  const up: Vec3 = [0.0, 1.0, 0.0];
  const vp = multiply(perspective(FOV, aspect, 0.1, 40), lookAt(eye, target, up));

  // 相机基 + 视野半角：给鼠标射线求交用
  const fwd = normalize3(sub3(target, eye));
  const right = normalize3(cross3(fwd, up));
  const up2 = cross3(right, fwd);
  const halfH = Math.tan(FOV / 2);
  const halfW = halfH * aspect;
  const hit = ndcToPlane(mouseNdc[0], mouseNdc[1], eye, fwd, right, up2, halfW, halfH);
  if (hit) {
    mouseWorld = [
      mouseWorld[0] + (hit[0] - mouseWorld[0]) * 0.2,
      0.0,
      mouseWorld[2] + (hit[2] - mouseWorld[2]) * 0.2,
    ];
  }

  simUniforms[0] = mouseWorld[0];
  simUniforms[1] = mouseWorld[1];
  simUniforms[2] = mouseWorld[2];
  simUniforms[3] = pressed ? 1 : 0;
  simUniforms[4] = t;
  simUniforms[5] = dt;
  simUniforms[6] = aspect;
  device.queue.writeBuffer(simBuffer, 0, simUniforms);

  renderUniforms.set(vp, 0);
  renderUniforms[16] = chrome.width;
  renderUniforms[17] = chrome.height;
  renderUniforms[18] = aspect;
  renderUniforms[19] = Math.round(6 * dpr); // 粒子直径：CSS 像素 × DPR
  device.queue.writeBuffer(renderBuffer, 0, renderUniforms);

  const encoder = device.createCommandEncoder();

  // 1) compute：读 cur 写 1-cur，107 个 workgroup × 64 invocation
  const cpass = encoder.beginComputePass();
  cpass.setPipeline(computePipeline);
  cpass.setBindGroup(0, computeBindGroups[cur]);
  cpass.dispatchWorkgroups(Math.ceil(COUNT / 64));
  cpass.end();

  // 2) render：必须读刚写完的 1-cur——双缓冲交换时绑定组要跟着换
  const rpass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.051, g: 0.027, b: 0.020, a: 1 }, // 暖黑 #0D0705
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  rpass.setPipeline(renderPipeline);
  rpass.setBindGroup(0, renderBindGroups[1 - cur]);
  rpass.draw(6, COUNT);
  rpass.end();

  device.queue.submit([encoder.finish()]);

  // 3) 交换：下一帧读刚写完的那个——读旧写新、渲染读新，闭环成立
  cur = 1 - cur;
});
