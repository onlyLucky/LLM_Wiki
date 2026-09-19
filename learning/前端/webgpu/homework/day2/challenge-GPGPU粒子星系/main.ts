// Day 2 · 作业 challenge —— GPGPU 粒子星系
// 对应讲义 2.6（计算着色器入门）/ 2.7（GPGPU 粒子与动画模拟）：
// 一万粒子的双缓冲状态机全链路，storage 直读渲染，速度映射色带。
// 五个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import particlesSim from './particles.wgsl?raw';
import particlesRender from './render.wgsl?raw';

type Vec3 = [number, number, number];

const chrome = createChrome({
  day: 2,
  index: 'C',
  title: 'PARTICLE GALAXY',
  tags: ['WEBGPU', 'COMPUTE', 'GPGPU'],
  hint: '按住鼠标聚拢粒子，松开扩散',
});

// ---- 初始化 -----------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

const COUNT = 10000;
const STRIDE = 32; // 每粒子 vec4f pos + vec4f vel（对齐教训见讲义 2.7）

// ---- TODO 1：粒子状态与双缓冲 ------------------------------------

function createParticleStates(): GPUBuffer[] {
  // TODO(day2-challenge-1): 创建两个 STORAGE buffer（各 COUNT × STRIDE 字节），
  // 返回 [a, b]。初始星系盘只写进 states[0]：三条旋臂 + 高斯散布 +
  // 切向初速度 vOrb = 0.5 / sqrt(r + 0.12)（伪代码见 README 提示三）。
  throw new Error('TODO(day2-challenge-1) 未完成：见 README');
}

// ---- TODO 2：compute 管线 -----------------------------------------
// 力场本体（噪声漂移 + 涡旋 + 鼠标引力）在 particles.wgsl 的 TODO 处。

const simModule = device.createShaderModule({ code: particlesSim });

function createComputePipeline(): GPUComputePipeline {
  // TODO(day2-challenge-2): createComputePipeline（layout 'auto'，
  // entryPoint 'update'，模块 simModule）。
  throw new Error('TODO(day2-challenge-2) 未完成：见 README');
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

// ---- TODO 3：双缓冲交换与绑定组轮换 --------------------------------

function createComputeBindGroups(states: GPUBuffer[]): GPUBindGroup[] {
  // TODO(day2-challenge-3): 两组绑定组——computeBindGroups[i] 的三个 entry：
  //   binding 0 挂 states[i]（src 只读）、binding 1 挂 states[1 - i]（dst 可写）、
  //   binding 2 挂 simBuffer。layout 用 computePipeline.getBindGroupLayout(0)。
  // 帧循环里的 cur 指针交换也属于本条（见下方 TODO 注释）。
  throw new Error('TODO(day2-challenge-3) 未完成：见 README');
}

// ---- TODO 4：storage 直读渲染 ---------------------------------------

const renderModule = device.createShaderModule({ code: particlesRender });

function createRenderPipeline(): GPURenderPipeline {
  // TODO(day2-challenge-4): 渲染管线（layout 'auto'，vs/fs 入口，
  // blend 用加法混合 one / one——星星叠星星天然辉光，且与顺序无关）。
  throw new Error('TODO(day2-challenge-4) 未完成：见 README');
}

function createRenderBindGroups(states: GPUBuffer[]): GPUBindGroup[] {
  // TODO(day2-challenge-4): 两组绑定组——renderBindGroups[i] 的两个 entry：
  //   binding 0 挂 states[i]（粒子，只读 storage）、binding 1 挂 renderBuffer。
  // layout 用 renderPipeline.getBindGroupLayout(0)。quad 的展开在 render.wgsl。
  throw new Error('TODO(day2-challenge-4) 未完成：见 README');
}

// ---- 已给全：初始化调用（TODO 未完成时这里依次报出编号）------------
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
let cur = 0; // TODO(day2-challenge-3)：双缓冲指针——本帧读 states[cur] 写 states[1-cur]
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
  // TODO(day2-challenge-3): 轮换的正确姿势——本帧挂 computeBindGroups[cur]，
  // 渲染读刚写完的 renderBindGroups[1 - cur]，帧尾 cur = 1 - cur。
  // 下方占位固定挂 [0]：不轮换时粒子每帧读旧数据，表现为静止。
  cpass.setBindGroup(0, computeBindGroups[0]);
  cpass.dispatchWorkgroups(Math.ceil(COUNT / 64));
  cpass.end();

  // 2) render：必须读刚写完的那个 buffer
  const rpass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  rpass.setPipeline(renderPipeline);
  // TODO(day2-challenge-3): 这里应该是 renderBindGroups[1 - cur]
  rpass.setBindGroup(0, renderBindGroups[0]);
  rpass.draw(6, COUNT);
  rpass.end();

  device.queue.submit([encoder.finish()]);

  // TODO(day2-challenge-3): 帧尾交换——cur = 1 - cur
});
