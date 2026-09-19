// Day 2 · Demo 04 —— Procedural Geometry（程序化几何与顶点动画）
// 对应讲义 2.5：JS 侧生成 128×128 格点平面，顶点着色器里做正弦波浪位移，
// 法线用解析梯度重建，鼠标位置换算到地平面作为波源。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './ocean.wgsl?raw';

const chrome = createChrome({
  day: 2,
  index: '04',
  title: 'PROCEDURAL GEOMETRY',
  tags: ['WEBGPU', 'WGSL', 'VERTEX'],
  hint: '移动鼠标扰动波峰',
});

// ---- 初始化 -----------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

// ---- 几何生成：128×128 格点平面（讲义 2.5 的参数化公式）---------
// 顶点只存 (x, z)：高度是时间函数，放进顶点着色器，网格数据保持静态。
// 顶点数 129² = 16641，索引 6·128² = 98304，uint16 刚好装得下。
const SEG = 128;
const ROW = SEG + 1;
const PLANE = 6.0; // 平面半宽：x, z ∈ [-6, 6]，远处交给雾隐藏边界

const positions = new Float32Array(ROW * ROW * 2);
for (let j = 0; j < ROW; j++) {
  for (let i = 0; i < ROW; i++) {
    const k = (j * ROW + i) * 2;
    positions[k] = ((i / SEG) * 2 - 1) * PLANE;
    positions[k + 1] = ((j / SEG) * 2 - 1) * PLANE;
  }
}

const indices = new Uint16Array(SEG * SEG * 6);
let ptr = 0;
for (let j = 0; j < SEG; j++) {
  for (let i = 0; i < SEG; i++) {
    const a = j * ROW + i;
    const b = a + 1;
    const c = a + ROW;
    const d = c + 1;
    indices[ptr++] = a; indices[ptr++] = c; indices[ptr++] = b;
    indices[ptr++] = b; indices[ptr++] = c; indices[ptr++] = d;
  }
}

const vertexBuffer = device.createBuffer({
  size: positions.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, positions);

const indexBuffer = device.createBuffer({
  size: indices.byteLength,
  usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(indexBuffer, 0, indices);

// ---- uniform：vp 矩阵 + 相机 / 光照 / 波源（128 字节）-----------
const uniforms = new Float32Array(32);
const uniformBuffer = device.createBuffer({
  size: 128,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 管线 -------------------------------------------------------
const module = device.createShaderModule({ code: shader });
const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [{
      arrayStride: 8, // 每顶点一个 vec2f
      attributes: [{ shaderLocation: 0, offset: 0, format: 'float32x2' }],
    }],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list' },
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 极简 mat4：列主序，与 WGSL 的内存布局一一对应 --------------
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
  const z = normalize3(sub3(eye, target)); // 相机 -z 朝向目标
  const x = normalize3(cross3(up, z));
  const y = cross3(z, x);
  return new Float32Array([
    x[0], y[0], z[0], 0,
    x[1], y[1], z[1], 0,
    x[2], y[2], z[2], 0,
    -dot3(x, eye), -dot3(y, eye), -dot3(z, eye), 1,
  ]);
}

// ---- 相机与鼠标：NDC → 地平面 (y=0) 的世界坐标 -------------------
const FOV = (42 * Math.PI) / 180;
const EYE: Vec3 = [0.0, 2.3, 4.8];
const TARGET: Vec3 = [0.0, -0.1, 0.0];
const UP: Vec3 = [0.0, 1.0, 0.0];

// 沿相机射线与地平面求交：不用求逆矩阵，用基向量直接拼出射线方向
function ndcToPlane(nx: number, ny: number, aspect: number): Vec3 | null {
  const fwd = normalize3(sub3(TARGET, EYE));
  const right = normalize3(cross3(fwd, UP));
  const up2 = cross3(right, fwd);
  const halfH = Math.tan(FOV / 2);
  const halfW = halfH * aspect;
  const dir = normalize3([
    fwd[0] + right[0] * nx * halfW + up2[0] * ny * halfH,
    fwd[1] + right[1] * nx * halfW + up2[1] * ny * halfH,
    fwd[2] + right[2] * nx * halfW + up2[2] * ny * halfH,
  ]);
  if (dir[1] > -0.05) return null; // 射线掠过地平面：保持旧波源
  const t = -EYE[1] / dir[1];
  return [EYE[0] + dir[0] * t, 0.0, EYE[2] + dir[2] * t];
}

let mouseWorld: Vec3 = [0.0, 0.0, 0.0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
  const ny = 1 - ((e.clientY - r.top) / r.height) * 2;
  const hit = ndcToPlane(nx, ny, r.width / r.height);
  if (hit) {
    // 平滑跟随：波源不瞬移，涟漪自然
    mouseWorld = [
      mouseWorld[0] + (hit[0] - mouseWorld[0]) * 0.14,
      0.0,
      mouseWorld[2] + (hit[2] - mouseWorld[2]) * 0.14,
    ];
  }
});

// ---- 帧循环 -----------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const aspect = chrome.width / chrome.height;
  const vp = multiply(perspective(FOV, aspect, 0.1, 40), lookAt(EYE, TARGET, UP));

  // uniforms 布局：vp(16) + camera(4) + light(4) + mouse(4) + params(4)
  uniforms.set(vp, 0);
  uniforms[16] = EYE[0]; uniforms[17] = EYE[1]; uniforms[18] = EYE[2];
  const light = normalize3([-0.35, 0.8, 0.45]);
  uniforms[20] = light[0]; uniforms[21] = light[1]; uniforms[22] = light[2];
  uniforms[24] = mouseWorld[0]; uniforms[25] = mouseWorld[2];
  uniforms[28] = t;
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(indices.length);
  pass.end();
  device.queue.submit([encoder.finish()]);
});
