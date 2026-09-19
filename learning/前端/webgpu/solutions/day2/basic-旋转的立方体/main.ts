// Day 2 · 作业 basic —— 旋转的立方体（参考答案）
// 对应讲义 2.1（空间变换）/ 2.2（光栅化与片元插值）：
// 手写 perspective / lookAt / 模型旋转矩阵，并把深度测试三件套接通。

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
// 先判空再赋给显式非空类型的 device：function 声明会被提升，
// TS 的空值收窄进不了函数体（ensureDepth 里 device 又变回可空）
const maybeDevice = await initGPU(chrome);
if (!maybeDevice) throw new Error('WebGPU 初始化失败，详情见页面错误面板');
const device: GPUDevice = maybeDevice;

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

// ---- 透视与视图矩阵 ----------------------------------------------

function perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  // WebGPU 的 NDC z ∈ [0, 1]（OpenGL 是 [-1, 1]）：
  // m[11] = -1 让 w = -z_view（相机前方变成正 w）；
  // m[10] / m[14] 这一对把 z 压进 [0, 1]，与 OpenGL 版的差异全在两个元素
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect; // x 缩放
  m[5] = f;          // y 缩放
  m[10] = far / (near - far);
  m[11] = -1;
  m[14] = (near * far) / (near - far);
  return m;
}

function lookAt(eye: Vec3, target: Vec3, up: Vec3): Float32Array {
  // 基变换：新坐标系的三个轴（右、上、后方）写成前三列，
  // 相机平移量的负值写进第四列——相机被搬到原点、朝向 -z
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len; zy /= len; zz /= len;
  // x = up × z（相机的右方向），再 y = z × x（与 up 正交的真正上方向）
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len; xy /= len; xz /= len;
  const yx = zy * xz - zz * xy;
  const yy = zz * xx - zx * xz;
  const yz = zx * xy - zy * xx;

  const m = new Float32Array(16);
  m[0] = xx; m[1] = yx; m[2] = zx; m[3] = 0; // 第 1 列 = 相机 x 轴
  m[4] = xy; m[5] = yy; m[6] = zy; m[7] = 0; // 第 2 列 = 相机 y 轴
  m[8] = xz; m[9] = yz; m[10] = zz; m[11] = 0; // 第 3 列 = 相机 z 轴（后方）
  m[12] = -(xx * eye[0] + xy * eye[1] + xz * eye[2]);
  m[13] = -(yx * eye[0] + yy * eye[1] + yz * eye[2]);
  m[14] = -(zx * eye[0] + zy * eye[1] + zz * eye[2]);
  m[15] = 1;
  return m;
}

// ---- 深度测试三件套 ----------------------------------------------
// a) 本函数创建 depth texture；b) 下方 pipeline 的 depthStencil；
// c) 帧循环里 renderPass 的 depthStencilAttachment。

let depthTexture: GPUTexture | null = null;

function ensureDepth(w: number, h: number) {
  // 尺寸没变直接复用；变了先销毁旧的再按新画布物理像素重建
  if (depthTexture && depthTexture.width === w && depthTexture.height === h) return;
  depthTexture?.destroy();
  depthTexture = device.createTexture({
    size: [w, h],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
}

// ---- 模型矩阵随时间旋转 -------------------------------------------

// 绕 X 轴：列 1 = (0, c, s)、列 2 = (0, -s, c)
function mat4RotateX(angle: number): Float32Array {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m = new Float32Array(16);
  m[0] = 1;
  m[5] = c; m[6] = s;
  m[9] = -s; m[10] = c;
  m[15] = 1;
  return m;
}

// 绕 Y 轴：列 0 = (c, 0, -s)、列 2 = (s, 0, c)
function mat4RotateY(angle: number): Float32Array {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m = new Float32Array(16);
  m[0] = c; m[2] = -s;
  m[5] = 1;
  m[8] = s; m[10] = c;
  m[15] = 1;
  return m;
}

function modelMatrix(t: number): Float32Array {
  // 两个轴各转一点 = 绕斜轴旋转；周期刻意不同步（0.5 / 0.23），轨迹不呆板
  return mat4Multiply(mat4RotateX(t * 0.23), mat4RotateY(t * 0.5));
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

// ---- 管线：背面剔除 + 深度测试 ------------------------------------
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
  // 深度测试三件套之二：管线声明深度格式、开写入、'less' 比较
  depthStencil: {
    format: 'depth24plus',
    depthWriteEnabled: true,
    depthCompare: 'less', // 深度值更小（离相机更近）才能通过
  },
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
    // 深度测试三件套之三：附件挂 depth texture 的 view，clear 到 1.0（最远）
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(36); // 12 个三角形 × 3 个角
  pass.end();
  device.queue.submit([encoder.finish()]);
});
