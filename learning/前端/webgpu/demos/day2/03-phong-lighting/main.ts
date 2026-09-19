// Day 2 · Demo 03 —— Phong Lighting
// 对应讲义 2.4：Blinn-Phong 双光源、逆转置法线矩阵、gamma 修正。
// 场景：悬浮的立方体 + 淡出格点地面 + 自发光光源标记，
// 鼠标驱动暖色主光绕场景移动，冷色补光固定在高位。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './phong.wgsl?raw';

let gpuReady = false;

const chrome = createChrome({
  day: 2,
  index: '03',
  title: 'PHONG LIGHTING',
  tags: ['WEBGPU', 'BLINN-PHONG', 'GAMMA'],
  hint: '移动鼠标改变光源',
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

// ---- 手写 mat4：列主序（同 demo 01/02）---------------------------
// 约定见 demos/day2/01-mvp-cube/main.ts 与讲义 2.1

function mat4Multiply(a: Float32Array, b: Float32Array): Float32Array {
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
  const f = 1 / Math.tan(fovY / 2);
  const m = new Float32Array(16);
  m[0] = f / aspect;
  m[5] = f;
  m[10] = far / (near - far);
  m[11] = -1;
  m[14] = (near * far) / (near - far);
  return m;
}

function mat4LookAt(
  eye: readonly number[],
  target: readonly number[],
  up: readonly number[],
): Float32Array {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len;
  zy /= len;
  zz /= len;
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
  m[0] = xx; m[1] = yx; m[2] = zx; m[3] = 0;
  m[4] = xy; m[5] = yy; m[6] = zy; m[7] = 0;
  m[8] = xz; m[9] = yz; m[10] = zz; m[11] = 0;
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
  m[0] = c; m[2] = -s;
  m[5] = 1;
  m[8] = s; m[10] = c;
  m[15] = 1;
  return m;
}

function mat4Translate(x: number, y: number, z: number): Float32Array {
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

// 法线矩阵：model 左上 3×3 的逆转置（伴随矩阵 / det）。
// 均匀缩放 + 旋转时它等于 model 本身；非均匀缩放时必须用它，
// 否则法线方向会被掰歪（讲义 2.4 的重点坑）
function mat4NormalFromModel(model: Float32Array): Float32Array {
  const a00 = model[0], a01 = model[4], a02 = model[8];
  const a10 = model[1], a11 = model[5], a12 = model[9];
  const a20 = model[2], a21 = model[6], a22 = model[10];

  const c00 = a11 * a22 - a12 * a21;
  const c01 = a12 * a20 - a10 * a22;
  const c02 = a10 * a21 - a11 * a20;
  const det = a00 * c00 + a01 * c01 + a02 * c02 || 1;
  const inv = 1 / det;

  const m = new Float32Array(16);
  m[0] = c00 * inv;
  m[1] = (a02 * a21 - a01 * a22) * inv;
  m[2] = (a01 * a12 - a02 * a11) * inv;
  m[4] = c01 * inv;
  m[5] = (a00 * a22 - a02 * a20) * inv;
  m[6] = (a02 * a10 - a00 * a12) * inv;
  m[8] = c02 * inv;
  m[9] = (a01 * a20 - a00 * a21) * inv;
  m[10] = (a00 * a11 - a01 * a10) * inv;
  m[15] = 1;
  return m;
}

// ---- 几何 --------------------------------------------------------
// 立方体：24 顶点（position + normal + material），36 索引；
// 光源标记复用同一份缓冲，只是换了管线与 model 矩阵
const CORNERS = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1],
] as const;

const FACES = [
  { ids: [4, 5, 6, 7], normal: [0, 0, 1] },   // 前 +z
  { ids: [1, 0, 3, 2], normal: [0, 0, -1] },  // 后 -z
  { ids: [5, 1, 2, 6], normal: [1, 0, 0] },   // 右 +x
  { ids: [0, 4, 7, 3], normal: [-1, 0, 0] },  // 左 -x
  { ids: [7, 6, 2, 3], normal: [0, 1, 0] },   // 上 +y
  { ids: [0, 1, 5, 4], normal: [0, -1, 0] },  // 下 -y
];

const cubeVertices = new Float32Array(24 * 7);
const cubeIndices = new Uint16Array(36);
FACES.forEach((face, f) => {
  face.ids.forEach((id, k) => {
    cubeVertices.set([...CORNERS[id], ...face.normal, 0], (f * 4 + k) * 7); // material 0
  });
  const b = f * 4;
  cubeIndices.set([b, b + 1, b + 2, b, b + 2, b + 3], f * 6);
});

// 地面：4 顶点大盘，顶点直接烘焙在世界坐标（model 恒为单位阵）
const GROUND_Y = -1.35;
const groundVertices = new Float32Array([
  -16, GROUND_Y, -16, 0, 1, 0, 1,
  16, GROUND_Y, -16, 0, 1, 0, 1,
  16, GROUND_Y, 16, 0, 1, 0, 1,
  -16, GROUND_Y, 16, 0, 1, 0, 1,
]);
const groundIndices = new Uint16Array([0, 2, 1, 0, 3, 2]); // 从上方看逆时针

// 以下工具函数全部用 const 箭头而非 function 声明（原因见 demo 01 的注释）：
// 它们捕获 device，箭头函数在判空之后创建，TS 的空值收窄才能跟进去
const createVertexBuffer = (data: Float32Array): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
};
const createIndexBuffer = (data: Uint16Array): GPUBuffer => {
  const buffer = device.createBuffer({
    size: data.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(buffer, 0, data);
  return buffer;
};

const cubeVB = createVertexBuffer(cubeVertices);
const cubeIB = createIndexBuffer(cubeIndices);
const groundVB = createVertexBuffer(groundVertices);
const groundIB = createIndexBuffer(groundIndices);

// ---- uniform：帧级 + 每物体一份 ----------------------------------
// Frame = vp(64) + lights(2×16) + cameraPos(16) = 112 字节
const frameData = new Float32Array(28);
const frameBuffer = device.createBuffer({
  size: 112,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// Obj = model(64) + normalMatrix(64) = 128 字节
const createObjBuffer = (): GPUBuffer => {
  return device.createBuffer({
    size: 128,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
};
const cubeObj = createObjBuffer();
const groundObj = createObjBuffer();
const markerObj = createObjBuffer();

// 地面不动画：单位阵写一次就不再动
{
  const identity = new Float32Array(32);
  identity[0] = 1;
  identity[5] = 1;
  identity[10] = 1;
  identity[16] = 1;
  identity[21] = 1;
  identity[26] = 1;
  identity[31] = 1;
  device.queue.writeBuffer(groundObj, 0, identity);
}

// ---- 管线：光照 / 光源标记共用模块与顶点布局 -----------------------
const module = device.createShaderModule({ code: shader });

const vertexLayout: GPUVertexBufferLayout = {
  arrayStride: 28, // position(12B) + normal(12B) + material(4B)
  attributes: [
    { shaderLocation: 0, offset: 0, format: 'float32x3' },
    { shaderLocation: 1, offset: 12, format: 'float32x3' },
    { shaderLocation: 2, offset: 24, format: 'float32' },
  ],
};

const depthStencil: GPUDepthStencilState = {
  format: 'depth24plus',
  depthWriteEnabled: true,
  depthCompare: 'less',
};

const litPipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module, entryPoint: 'vs', buffers: [vertexLayout] },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list', cullMode: 'back' },
  depthStencil,
});
const markerPipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module, entryPoint: 'vs', buffers: [vertexLayout] }, // 同一顶点入口
  fragment: { module, entryPoint: 'fsMarker', targets: [{ format }] },
  primitive: { topology: 'triangle-list', cullMode: 'none' }, // 标记小到无需剔除
  depthStencil,
});

// bind group 0 = 帧级（相机 + 光源），bind group 1 = 物体级（矩阵）
const frameBind = device.createBindGroup({
  layout: litPipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: frameBuffer } }],
});
const cubeBind = device.createBindGroup({
  layout: litPipeline.getBindGroupLayout(1),
  entries: [{ binding: 0, resource: { buffer: cubeObj } }],
});
const groundBind = device.createBindGroup({
  layout: litPipeline.getBindGroupLayout(1),
  entries: [{ binding: 0, resource: { buffer: groundObj } }],
});
// 标记管线的布局各自创建，同一 buffer 挂两份 bind group
const markerFrameBind = device.createBindGroup({
  layout: markerPipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: frameBuffer } }],
});
const markerBind = device.createBindGroup({
  layout: markerPipeline.getBindGroupLayout(1),
  entries: [{ binding: 0, resource: { buffer: markerObj } }],
});

// ---- depth texture ------------------------------------------------
let depthTexture: GPUTexture | null = null;
const ensureDepth = (w: number, h: number) => {
  if (depthTexture && depthTexture.width === w && depthTexture.height === h) return;
  depthTexture?.destroy();
  depthTexture = device.createTexture({
    size: [w, h],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
};

// ---- 鼠标驱动光源 -------------------------------------------------
let mouse = [0, 0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse = [
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  ];
});

function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

// ---- 帧循环 -------------------------------------------------------
const start = performance.now();
let lightPos: [number, number, number] = [2.2, 1.8, 1.4]; // 平滑追随鼠标目标
const cubeObjData = new Float32Array(32);
const markerObjData = new Float32Array(32);

chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  // 相机：固定机位 + 极缓慢漂移（雕塑展台感）
  const eye: [number, number, number] = [
    3.6 + Math.sin(t * 0.13) * 0.18,
    2.7 + Math.sin(t * 0.09) * 0.1,
    5.6 + Math.cos(t * 0.11) * 0.15,
  ];
  const view = mat4LookAt(eye, [0, -0.1, 0], [0, 1, 0]);
  const proj = mat4Perspective(
    (46 * Math.PI) / 180,
    chrome.width / chrome.height,
    0.1,
    60,
  );
  const vp = mat4Multiply(proj, view);

  // 主光目标位置：鼠标在画布上滑出一个绕立方体的弧
  const angle = mouse[0] * 2.4;
  const radius = 2.7;
  const height = clamp(1.5 + mouse[1] * 1.8, 0.5, 3.4);
  const target: [number, number, number] = [
    Math.sin(angle) * radius,
    height,
    Math.cos(angle) * radius,
  ];
  lightPos = [
    lightPos[0] + (target[0] - lightPos[0]) * 0.09,
    lightPos[1] + (target[1] - lightPos[1]) * 0.09,
    lightPos[2] + (target[2] - lightPos[2]) * 0.09,
  ];

  // 立方体：悬浮 + 缓慢自转 + 均匀 0.9 缩放
  const model = mat4Multiply(
    mat4Translate(0, -0.35 + 0.05 * Math.sin(t * 0.7), 0),
    mat4Multiply(mat4RotateY(t * 0.22), mat4Scale(0.9)),
  );
  const normalMatrix = mat4NormalFromModel(model);

  // 光源标记：贴着光源位置的小立方体
  const markerModel = mat4Multiply(
    mat4Translate(lightPos[0], lightPos[1], lightPos[2]),
    mat4Scale(0.09),
  );

  // ---- 写 uniform：帧级 112B + 两个物体级 128B ----
  frameData.set(vp, 0);
  // 主光：位置 + 强度（带烛光式微闪）
  frameData.set([...lightPos, 0.95 + 0.05 * Math.sin(t * 9.1) * Math.sin(t * 3.7)], 16);
  // 补光：固定高位背侧 + 低强度
  frameData.set([-2.6, 3.1, -2.2, 0.16], 20);
  frameData.set([...eye, t], 24);
  device.queue.writeBuffer(frameBuffer, 0, frameData);

  cubeObjData.set(model, 0);
  cubeObjData.set(normalMatrix, 16);
  device.queue.writeBuffer(cubeObj, 0, cubeObjData);

  markerObjData.set(markerModel, 0);
  markerObjData.set(normalMatrix, 16); // 标记是自发光，法线矩阵实际未被读
  device.queue.writeBuffer(markerObj, 0, markerObjData);

  ensureDepth(chrome.width, chrome.height);
  if (!depthTexture) return;

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [
      {
        view: context.getCurrentTexture().createView(),
        clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
        loadOp: 'clear',
        storeOp: 'store',
      },
    ],
    depthStencilAttachment: {
      view: depthTexture.createView(),
      depthClearValue: 1.0,
      depthLoadOp: 'clear',
      depthStoreOp: 'store',
    },
  });

  // 光照管线：立方体 + 地面
  pass.setPipeline(litPipeline);
  pass.setBindGroup(0, frameBind);
  pass.setBindGroup(1, cubeBind);
  pass.setVertexBuffer(0, cubeVB);
  pass.setIndexBuffer(cubeIB, 'uint16');
  pass.drawIndexed(36);

  pass.setBindGroup(1, groundBind);
  pass.setVertexBuffer(0, groundVB);
  pass.setIndexBuffer(groundIB, 'uint16');
  pass.drawIndexed(6);

  // 标记管线：自发光小立方体（复用立方体几何）
  pass.setPipeline(markerPipeline);
  pass.setBindGroup(0, markerFrameBind);
  pass.setBindGroup(1, markerBind);
  pass.setVertexBuffer(0, cubeVB);
  pass.setIndexBuffer(cubeIB, 'uint16');
  pass.drawIndexed(36);

  pass.end();
  device.queue.submit([encoder.finish()]);
});
