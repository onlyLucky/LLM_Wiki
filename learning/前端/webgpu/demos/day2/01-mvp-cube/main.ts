// Day 2 · Demo 01 —— MVP Cube
// 对应讲义 2.1（空间变换）/ 2.2（光栅化与片元插值）：
// 手写列主序 mat4，透视 + lookAt + 轨道相机，深度测试全链路。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './cube.wgsl?raw';

// depth texture 的重建依赖 device，而 chrome 首次 onResize 早于 initGPU 完成
let gpuReady = false;

const chrome = createChrome({
  day: 2,
  index: '01',
  title: 'MVP CUBE',
  tags: ['WEBGPU', 'WGSL', 'DEPTH'],
  hint: '拖动旋转视角',
  // 画布尺寸变化时 depth texture 必须跟着重建（逐像素与画布一致）
  onResize: (w, h) => {
    if (gpuReady) ensureDepth(w, h);
  },
});

const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

gpuReady = true;

// ---- 手写 mat4：列主序 -------------------------------------------
// Float32Array 的 0–3 号元素是矩阵第 1 列，12–14 号是平移量，
// 与 WGSL 的 mat4x4f 内存布局、与 u.mvp * vec4f(p, 1.0) 的乘法方向一致。
// 不引外部数学库是刻意的教学决定：列主序正是这个 demo 要看清的东西。

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

function mat4Perspective(fovY: number, aspect: number, near: number, far: number): Float32Array {
  // WebGPU 的 NDC z ∈ [0, 1]（OpenGL 是 [-1, 1]），直接抄 OpenGL
  // 教材里的矩阵会导致深度关系整体错乱，这一份是 WebGPU 版
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = far / (near - far);
  m[11] = -1; // w = -z_view：把「相机前方」变成正的 w
  m[14] = (near * far) / (near - far);
  return m;
}

function mat4LookAt(
  eye: readonly number[],
  target: readonly number[],
  up: readonly number[],
): Float32Array {
  // 右手系 view：把相机搬到原点、转向 -z。列向量推导见 GAMES101 笔记 3.9
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len;
  zy /= len;
  zz /= len;
  // x = up × z（相机的右方向），再 y = z × x（与 up 正交的真正上方向）
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len;
  xy /= len;
  xz /= len;
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

function mat4RotateY(angle: number): Float32Array {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m = new Float32Array(16);
  m[0] = c; m[2] = -s; // 第 1 列
  m[5] = 1;
  m[8] = s; m[10] = c; // 第 3 列
  m[15] = 1;
  return m;
}

function mat4Translate(x: number, y: number, z: number): Float32Array {
  // 平移量住在第 4 列（下标 12–14）：列主序最直观的证据
  const m = new Float32Array(16);
  m[0] = 1;
  m[5] = 1;
  m[10] = 1;
  m[15] = 1;
  m[12] = x;
  m[13] = y;
  m[14] = z;
  return m;
}

function mat4Scale(s: number): Float32Array {
  const m = new Float32Array(16);
  m[0] = s;
  m[5] = s;
  m[10] = s;
  m[15] = 1;
  return m;
}

// ---- 几何：8 个角点展开成 24 顶点 --------------------------------
// 颜色属于「面」，而每个角点被三个面共享，所以只存 8 个顶点装不下面色；
// 同面 4 个角点给同一种色、展开成 24 顶点，插值后整面恒定（讲义 2.2）。
const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // z = -1 的四个角
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], // z = +1 的四个角
] as const;

// ids 从外侧看逆时针：frontFace 默认 'ccw' + cullMode 'back' 才能正常剔除
const FACES = [
  { ids: [4, 5, 6, 7], color: rgb('#4C6FFF') }, // 前 +z 电蓝
  { ids: [1, 0, 3, 2], color: rgb('#8B5CF6') }, // 后 -z 紫
  { ids: [5, 1, 2, 6], color: rgb('#2DD4BF') }, // 右 +x 青
  { ids: [0, 4, 7, 3], color: rgb('#F59E0B') }, // 左 -x 琥珀
  { ids: [7, 6, 2, 3], color: rgb('#E8ECF4') }, // 上 +y 主白
  { ids: [0, 1, 5, 4], color: rgb('#8FA5FF') }, // 下 -y 浅蓝
];

function rgb(hex: string): [number, number, number] {
  const n = parseInt(hex.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

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

// ---- depth texture：与画布同尺寸，resize 时重建 --------------------
let depthTexture: GPUTexture | null = null;
// 用 const 箭头函数而非 function 声明：function 会被提升到判空之前，
// TS 的空值收窄进不了函数体，device 在里面又变回可空
const ensureDepth = (w: number, h: number) => {
  if (depthTexture && depthTexture.width === w && depthTexture.height === h) return;
  depthTexture?.destroy();
  depthTexture = device.createTexture({
    size: [w, h],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
};

// ---- 轨道相机：拖拽改球坐标，帧内平滑插值 -------------------------
const orbit = { theta: 0.9, phi: 1.15, radius: 4.4 }; // 目标球坐标
const smooth = { theta: 0.9, phi: 1.15 }; // 平滑追随值
let dragging = false;
let lastX = 0;
let lastY = 0;
let lastInteract = -1e9;

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

chrome.canvas.addEventListener('pointerdown', (e) => {
  dragging = true;
  lastX = e.clientX;
  lastY = e.clientY;
  chrome.canvas.setPointerCapture(e.pointerId);
});
chrome.canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  orbit.theta += (e.clientX - lastX) * 0.006;
  orbit.phi = clamp(orbit.phi + (e.clientY - lastY) * 0.005, 0.3, 2.65);
  lastX = e.clientX;
  lastY = e.clientY;
  lastInteract = performance.now();
});
const endDrag = () => {
  dragging = false;
};
chrome.canvas.addEventListener('pointerup', endDrag);
chrome.canvas.addEventListener('pointercancel', endDrag);

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();
let cubeAngle = 0.55;
let spin = 0.3; // 自转角速度（rad/s）：拖拽时缓停，闲置后缓起
let prev = start;

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const dt = Math.min((now - prev) / 1000, 0.1);
  prev = now;

  // 无输入 2.5 秒后自转缓缓恢复；拖拽期间完全交给用户
  const idle = now - lastInteract > 2500;
  spin += ((idle ? 0.3 : 0) - spin) * 0.05;
  cubeAngle += spin * dt;

  // 球坐标 → 相机位置：先算目标，再让相机平滑追上去
  smooth.theta += (orbit.theta - smooth.theta) * 0.15;
  smooth.phi += (orbit.phi - smooth.phi) * 0.15;
  const eye: [number, number, number] = [
    orbit.radius * Math.sin(smooth.phi) * Math.cos(smooth.theta),
    orbit.radius * Math.cos(smooth.phi),
    orbit.radius * Math.sin(smooth.phi) * Math.sin(smooth.theta),
  ];

  // 模型：自转 + 轻微呼吸浮动（漂移感）
  const bob = 0.1 * Math.sin(t * 0.6);
  const breathe = 1.0 + 0.02 * Math.sin(t * 0.8);
  const model = mat4Multiply(
    mat4Translate(0, bob, 0),
    mat4Multiply(mat4RotateY(cubeAngle), mat4Scale(breathe)),
  );
  const view = mat4LookAt(eye, [0, 0, 0], [0, 1, 0]);
  const proj = mat4Perspective(
    (50 * Math.PI) / 180,
    chrome.width / chrome.height,
    0.1,
    100,
  );
  // 组合顺序 P·V·M：向量最先被 M 作用
  const mvp = mat4Multiply(proj, mat4Multiply(view, model));

  uniforms.set(mvp, 0); // 整块列主序矩阵直接拷进 uniform
  uniforms[16] = t;
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  ensureDepth(chrome.width, chrome.height); // 兜底：错过 onResize 也能建上
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
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0, // 1 = 最远；'less' 比较下「更近」才写入
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
