// Day 2 · Demo 06 —— Particle Simulation（GPGPU 粒子）
// 对应讲义 2.7：一万粒子的位置-速度双缓冲状态机。
// compute 读 src 写 dst（ping-pong 轮换），渲染的顶点着色器
// 直读刚写完的 storage buffer——数据全程待在显存里。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import particlesSim from './particles.wgsl?raw';
import particlesRender from './render.wgsl?raw';

const chrome = createChrome({
  day: 2,
  index: '06',
  title: 'PARTICLE SIMULATION',
  tags: ['WEBGPU', 'COMPUTE', 'GPGPU'],
  hint: '按住鼠标吸引粒子',
});

// ---- 初始化 -----------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

const COUNT = 10000;
const STRIDE = 32; // 每粒子 vec4f pos + vec4f vel

// ---- 双缓冲：两组完整状态，ping-pong 轮换 -----------------------
const states: GPUBuffer[] = [0, 1].map(() =>
  device.createBuffer({
    size: COUNT * STRIDE,
    // COPY_DST：初始状态要用 queue.writeBuffer 写入（讲义 2.6 的 usage 清单）
    usage: GPUBufferUsage.STORAGE | GPUBufferUsage.COPY_DST,
  }),
);

// 初始星系盘只在 state[0] 写一次：三条旋臂 + 高斯散布 + 开普勒初速度
const init = new Float32Array(COUNT * 8);
const gauss = () => Math.random() + Math.random() + Math.random() - 1.5;
for (let i = 0; i < COUNT; i++) {
  const r = Math.pow(Math.random(), 0.62) * 1.75 + 0.04;
  const theta = (i % 3) * ((Math.PI * 2) / 3) + r * 2.2 + gauss() * 0.16;
  const k = i * 8;
  init[k] = Math.cos(theta) * r + gauss() * 0.05;                    // x
  init[k + 1] = gauss() * 0.045 * (1.1 - Math.min(r * 0.35, 0.7));   // y
  init[k + 2] = Math.sin(theta) * r + gauss() * 0.05;                // z
  const vOrb = 0.5 / Math.sqrt(r + 0.12); // 近快远慢的切向初速度
  init[k + 4] = -Math.sin(theta) * vOrb;
  init[k + 6] = Math.cos(theta) * vOrb;
}
device.queue.writeBuffer(states[0], 0, init);

// ---- 两组 uniform：模拟参数与渲染参数 ---------------------------
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

// ---- 计算管线与两组绑定组：A 读 0 写 1，B 读 1 写 0 -------------
const simModule = device.createShaderModule({ code: particlesSim });
const computePipeline = device.createComputePipeline({
  layout: 'auto',
  compute: { module: simModule, entryPoint: 'update' },
});
const computeBindGroups = [0, 1].map((i) =>
  device.createBindGroup({
    layout: computePipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: states[i] } },       // src：只读
      { binding: 1, resource: { buffer: states[1 - i] } },   // dst：可写
      { binding: 2, resource: { buffer: simBuffer } },
    ],
  }),
);

// ---- 渲染管线：小 quad 实例化，加法混合发光 ----------------------
const renderModule = device.createShaderModule({ code: particlesRender });
const renderPipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module: renderModule, entryPoint: 'vs' },
  fragment: {
    module: renderModule,
    entryPoint: 'fs',
    targets: [{
      format,
      // 加法混合：星星叠星星，天然辉光，且与绘制顺序无关（无需深度）
      blend: {
        color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
        alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' },
      },
    }],
  },
  primitive: { topology: 'triangle-list' },
});
const renderBindGroups = [0, 1].map((i) =>
  device.createBindGroup({
    layout: renderPipeline.getBindGroupLayout(0),
    entries: [
      { binding: 0, resource: { buffer: states[i] } },
      { binding: 1, resource: { buffer: renderBuffer } },
    ],
  }),
);

// ---- 极简 mat4（与 demo 04 相同的列主序实现）---------------------
type Vec3 = [number, number, number];

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

// 沿相机射线与星系平面 (y=0) 求交，拿到鼠标的世界坐标
function ndcToPlane(
  nx: number, ny: number, eye: Vec3, fwd: Vec3, right: Vec3, up2: Vec3,
  halfW: number, halfH: number,
): Vec3 | null {
  const dir = normalize3([
    fwd[0] + right[0] * nx * halfW + up2[0] * ny * halfH,
    fwd[1] + right[1] * nx * halfW + up2[1] * ny * halfH,
    fwd[2] + right[2] * nx * halfW + up2[2] * ny * halfH,
  ]);
  if (dir[1] > -0.05) return null;
  const t = -eye[1] / dir[1];
  return [eye[0] + dir[0] * t, 0.0, eye[2] + dir[2] * t];
}

// ---- 鼠标：位置 + 按下状态 --------------------------------------
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

// ---- 帧循环：ping-pong 的完整一轮 --------------------------------
const FOV = (50 * Math.PI) / 180;
const start = performance.now();
let last = start;
let cur = 0; // 本帧读 states[cur]，写 states[1 - cur]
const dpr = Math.min(window.devicePixelRatio || 1, 2);

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  // 相机：缓慢漂移 + 鼠标视差（幅度克制）
  const aspect = chrome.width / chrome.height;
  const az = -0.25 + 0.22 * Math.sin(t * 0.06) + mouseNdc[0] * 0.28;
  const el = 0.62 + mouseNdc[1] * 0.14;
  const eye: Vec3 = [
    Math.sin(az) * Math.cos(el) * 3.8,
    Math.sin(el) * 3.8,
    Math.cos(az) * Math.cos(el) * 3.8,
  ];
  const target: Vec3 = [0.0, 0.05, 0.0];
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

  // 模拟参数：mouse(xyz + 按下标志) + params(时间 / dt / aspect)
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
  renderUniforms[19] = Math.round(7 * dpr); // 粒子直径：CSS 像素 × DPR
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
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  rpass.setPipeline(renderPipeline);
  rpass.setBindGroup(0, renderBindGroups[1 - cur]);
  rpass.draw(6, COUNT);
  rpass.end();

  device.queue.submit([encoder.finish()]);

  // 3) 交换：下一帧读刚写完的那个
  cur = 1 - cur;
});
