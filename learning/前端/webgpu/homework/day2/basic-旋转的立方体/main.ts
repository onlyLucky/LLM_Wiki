// Day 2 · 作业 basic —— 旋转的立方体
// 对应讲义 2.1（空间变换）/ 2.2（光栅化与片元插值）：
// 手写 perspective / lookAt / 模型旋转矩阵，并把深度测试三件套接通。
// 四个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './cube.wgsl?raw';

type Vec3 = [number, number, number];

// depth texture 的重建依赖 device，而 chrome 首次 onResize 早于 initGPU 完成
let gpuReady = false;

const chrome = createChrome({
  day: 2,
  index: 'B',
  title: 'SPINNING CUBE',
  tags: ['WEBGPU', 'MATRIX', 'DEPTH'],
  hint: '完成后：立方体绕斜轴缓慢自转',
  onResize: (w, h) => {
    if (gpuReady) ensureDepth(w, h);
  },
});

// ---- 初始化 -----------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

gpuReady = true;

// ---- 已给全：矩阵乘法（列主序，约定见讲义 2.1）-------------------
function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
  // 结果 = a · b（数学记号）：向量先被 b 作用，再被 a 作用
  const out = new Float32Array(16);
  for (let col = 0; col < 4; col++) {
    for (let row = 0; row < 4; row++) {
      let sum = 0;
      for (let k = 0; k < 4; k++) {
        sum += a[k * 4 + row] * b[col * 4 + k];
      }
      out[col * 4 + row] = sum;
    }
  }
  return out;
}

// ---- TODO 1–2：透视与视图矩阵 ------------------------------------

function perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  // TODO(day2-basic-1): 手写透视投影矩阵（列主序 Float32Array，16 个元素）。
  // 提醒：WebGPU 的 NDC z ∈ [0, 1]，OpenGL 教材里的矩阵不能直接抄（见 README）。
  throw new Error('TODO(day2-basic-1) 未完成：见 README');
}

function lookAt(eye: Vec3, target: Vec3, up: Vec3): Float32Array {
  // TODO(day2-basic-2): 手写 lookAt 视图矩阵（列主序）。
  // 相机 -z 朝向 target；x = normalize(up × z)；y = z × x；平移在第四列。
  throw new Error('TODO(day2-basic-2) 未完成：见 README');
}

// ---- TODO 3：深度测试三件套 --------------------------------------
// 三处改动：a) 本函数创建 depth texture；b) 下方 pipeline 的 depthStencil；
// c) 帧循环里 renderPass 的 depthStencilAttachment。

let depthTexture: GPUTexture | null = null;

function ensureDepth(w: number, h: number) {
  // TODO(day2-basic-3a): 尺寸没变就直接 return；否则 destroy 旧的，
  // 创建新的 depth texture（format: 'depth24plus'，usage: RENDER_ATTACHMENT）。
  throw new Error('TODO(day2-basic-3) 未完成：见 README');
}

// ---- TODO 4：模型矩阵随时间旋转 -----------------------------------

function modelMatrix(t: number): Float32Array {
  // TODO(day2-basic-4): 绕斜轴（如 x 与 y 各转一点，或 normalize(1,1,1)）
  // 随 t 缓慢旋转的模型矩阵；由帧循环每帧调用并 writeBuffer。
  throw new Error('TODO(day2-basic-4) 未完成：见 README');
}

// ---- 已给全：几何（24 顶点 + 36 索引，六面各一色）-----------------
// 颜色属于「面」而角点被三面共享，所以按面展开成 24 顶点（讲义 2.2）。
const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // z = -1 的四个角
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], // z = +1 的四个角
] as const;

function rgb(hex: string): Vec3 {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// ids 从外侧看逆时针：frontFace 默认 'ccw' + cullMode 'back' 才能正常剔除
const FACES = [
  { ids: [4, 5, 6, 7], color: rgb('#4C6FFF') }, // 前 +z 电蓝
  { ids: [1, 0, 3, 2], color: rgb('#8B5CF6') }, // 后 -z 紫
  { ids: [5, 1, 2, 6], color: rgb('#2DD4BF') }, // 右 +x 青
  { ids: [0, 4, 7, 3], color: rgb('#F59E0B') }, // 左 -x 琥珀
  { ids: [7, 6, 2, 3], color: rgb('#E8ECF4') }, // 上 +y 主白
  { ids: [0, 1, 5, 4], color: rgb('#8FA5FF') }, // 下 -y 浅蓝
];

const vertexData = new Float32Array(24 * 6); // 每顶点：position(3) + color(3)
const indexData = new Uint16Array(36); // 12 个三角形
FACES.forEach((face, f) => {
  face.ids.forEach((id, k) => {
    vertexData.set([...CORNERS[id], ...face.color], (f * 4 + k) * 6);
  });
  const b = f * 4; // 每面两个三角形，共享一条对角线
  indexData.set([b, b + 1, b + 2, b, b + 2, b + 3], f * 6);
});

const vertexBuffer = device.createBuffer({
  size: vertexData.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertexData);
const indexBuffer = device.createBuffer({
  size: indexData.byteLength,
  usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(indexBuffer, 0, indexData);

// ---- uniform：mvp(64B) + params(16B) = 80B ------------------------
// mat4x4f 在 uniform 地址空间天然 16 字节对齐，vec4f 收尾不用再补
const uniforms = new Float32Array(20);
const uniformBuffer = device.createBuffer({
  size: 80,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 已给全：管线骨架（深度配置在 TODO 3b 补上）-------------------
const module = device.createShaderModule({ code: shader });

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 24, // position(12B) + color(12B)
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x3' },
          { shaderLocation: 1, offset: 12, format: 'float32x3' },
        ],
      },
    ],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list', cullMode: 'back' },
  // TODO(day2-basic-3b): 补 depthStencil 配置：format 'depth24plus'、
  // depthWriteEnabled: true、depthCompare: 'less'。
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 相机参数（固定视角，立方体自己转）---------------------------
const FOV = (50 * Math.PI) / 180;
const EYE: Vec3 = [2.6, 2.0, 4.2];
const TARGET: Vec3 = [0, 0, 0];
const UP: Vec3 = [0, 1, 0];

// ---- 循环前把四个 TODO 各预演一次：未完成时错误面板报出编号，
// 而不是等帧循环里每秒刷 60 个 uncaught error ----------------------
ensureDepth(chrome.width, chrome.height);
void perspective(FOV, 1, 0.1, 40);
void lookAt(EYE, TARGET, UP);
void modelMatrix(0);

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const aspect = chrome.width / chrome.height;

  // P·V·M：向量最先被 M 作用（讲义 2.1 的组合顺序）
  const mvp = mat4Multiply(
    perspective(FOV, aspect, 0.1, 40),
    mat4Multiply(lookAt(EYE, TARGET, UP), modelMatrix(t)),
  );

  uniforms.set(mvp, 0); // 整块列主序矩阵直接拷进 uniform
  uniforms[16] = t;
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  ensureDepth(chrome.width, chrome.height);
  if (!depthTexture) return;

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        // 与 CSS 底色 #0B0E14 保持一致，画布与画框无缝衔接
        clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    // TODO(day2-basic-3c): 补 depthStencilAttachment：view 挂
    // depthTexture.createView()，depthClearValue: 1.0，
    // depthLoadOp: 'clear'，depthStoreOp: 'store'。
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(36); // 12 个三角形 × 3 个角
  pass.end();
  device.queue.submit([encoder.finish()]);
});
