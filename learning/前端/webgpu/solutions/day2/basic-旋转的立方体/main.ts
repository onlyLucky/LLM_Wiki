// Day 2 · 作业 basic —— 旋转的立方体 / 深空信标（参考答案）
// 对应讲义 2.1（空间变换）/ 2.2（光栅化与片元插值）：
// 手写 perspective / lookAt / 模型旋转矩阵，并把深度测试三件套接通。
// 场景：青紫渐变的八面体水晶，在反向旋转的线框立方笼里自转——
// 实体与线框两种拓扑、两批 draw，让深度测试的「遮挡」看得见摸得着。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './beacon.wgsl?raw';

type Vec3 = [number, number, number];

// depth texture 的重建依赖 device，而 chrome 首次 onResize 早于 initGPU 完成
let gpuReady = false;

const chrome = createChrome({
  day: 2,
  index: 'B',
  title: 'CRYSTAL GYRO',
  tags: ['WEBGPU', 'MATRIX', 'DEPTH'],
  hint: '参考答案：水晶在反向旋转的线框笼中自转',
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

// ---- 已给全：两个旋转矩阵（列主序）-------------------------------
// 读法：第 i 列就是「第 i 个基向量旋转后去了哪」——列主序最直观的证据
function mat4RotateY(angle: number): Float32Array {
  // 绕 Y 轴：x 基 → (c, 0, -s)，z 基 → (s, 0, c)，y 基不动
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m = new Float32Array(16);
  m[0] = c; m[2] = -s; // 第 1 列
  m[5] = 1;
  m[8] = s; m[10] = c; // 第 3 列
  m[15] = 1;
  return m;
}

function mat4RotateX(angle: number): Float32Array {
  // 绕 X 轴：y 基 → (0, c, s)，z 基 → (0, -s, c)，x 基不动
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  const m = new Float32Array(16);
  m[0] = 1;
  m[5] = c; m[6] = s; // 第 2 列
  m[9] = -s; m[10] = c; // 第 3 列
  m[15] = 1;
  return m;
}

// ---- 任务 1：透视投影矩阵 ----------------------------------------

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

// ---- 任务 2：视图矩阵 --------------------------------------------

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

// ---- 任务 3：深度测试三件套 --------------------------------------
// a) 本函数创建 depth texture；b) 下方两个 pipeline 各补
// depthStencil（实体与线框都要）；c) renderPass 的 depthStencilAttachment。

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

// ---- 任务 4：水晶的模型矩阵随时间旋转 -----------------------------

function modelMatrix(t: number): Float32Array {
  // 两个轴各转一点 = 绕斜轴旋转；周期刻意不同步（0.5 / 0.23），轨迹不呆板
  return mat4Multiply(mat4RotateX(t * 0.23), mat4RotateY(t * 0.5));
}

// ---- 已给全：线框笼的模型矩阵 -------------------------------------
// 固定倾斜 0.32 rad 后绕 Y 反向慢转：转轴与水晶的斜轴错开，才有「陀螺仪」内外环感
function cageMatrix(t: number): Float32Array {
  return mat4Multiply(mat4RotateX(0.32), mat4RotateY(-t * 0.16));
}

// ---- 已给全：几何 A —— 八面体水晶（6 顶点 + 24 索引）--------------
// 讲义 2.2 的活对照：立方体面色要展开 24 顶点，因为「颜色属于面」；
// 这里渐变色只依赖角点高度 y——颜色属于「角点」，6 个顶点共享即可，
// 插值跨面连续，一道渐变从顶贯穿到底。
const CRYSTAL = [
  [1, 0, 0], // 0 右
  [-1, 0, 0], // 1 左
  [0, 1, 0], // 2 上
  [0, -1, 0], // 3 下
  [0, 0, 1], // 4 前
  [0, 0, -1], // 5 后
] as const;

// 底 #1B1440 → 赤道 #3E7BD6 → 顶 #8FF0FF：h = (y+1)/2 归一化后三段插值
function crystalColor(y: number): Vec3 {
  const lo: Vec3 = [0.106, 0.078, 0.251];
  const mid: Vec3 = [0.243, 0.482, 0.839];
  const hi: Vec3 = [0.561, 0.941, 1.0];
  const h = (y + 1) / 2;
  if (h < 0.5) {
    const k = h * 2;
    return [lo[0] + (mid[0] - lo[0]) * k, lo[1] + (mid[1] - lo[1]) * k, lo[2] + (mid[2] - lo[2]) * k];
  }
  const k = h * 2 - 1;
  return [mid[0] + (hi[0] - mid[0]) * k, mid[1] + (hi[1] - mid[1]) * k, mid[2] + (hi[2] - mid[2]) * k];
}

// 8 个面 × 3 角，从外侧看逆时针（frontFace 默认 'ccw' + cullMode 'back'）
const CRYSTAL_FACES = [
  [2, 4, 0], [2, 1, 4], [2, 5, 1], [2, 0, 5], // 上四面
  [3, 0, 4], [3, 4, 1], [3, 1, 5], [3, 5, 0], // 下四面（绕序反过来）
];

const crystalVertexData = new Float32Array(6 * 6); // 每顶点：position(3) + color(3)
const crystalIndexData = new Uint16Array(24); // 8 个三角形
CRYSTAL.forEach((p, i) => {
  crystalVertexData.set([...p, ...crystalColor(p[1])], i * 6);
});
CRYSTAL_FACES.forEach((face, f) => {
  crystalIndexData.set(face, f * 3);
});

// ---- 已给全：几何 B —— 线框立方笼（8 顶点 + 24 索引）--------------
// line-list 拓扑画 12 条边：线没有「内外面」，天生不怕背面剔除，只怕深度
const CAGE_SIZE = 1.5;
const CAGE = [
  [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1], // z = -1 的四个角
  [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1], // z = +1 的四个角
] as const;

const CAGE_EDGES = [
  0, 1, 1, 2, 2, 3, 3, 0, // z = -1 面的四条边
  4, 5, 5, 6, 6, 7, 7, 4, // z = +1 面的四条边
  0, 4, 1, 5, 2, 6, 3, 7, // 四条竖边
];

const cageColor: Vec3 = [0.365, 0.498, 0.659]; // #5D7FA8 暗青灰：笼是配角
const cageVertexData = new Float32Array(8 * 6);
const cageIndexData = new Uint16Array(CAGE_EDGES);
CAGE.forEach((p, i) => {
  cageVertexData.set([p[0] * CAGE_SIZE, p[1] * CAGE_SIZE, p[2] * CAGE_SIZE, ...cageColor], i * 6);
});

function makeBuffers(vd: Float32Array, id: Uint16Array) {
  const vb = device.createBuffer({
    size: vd.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(vb, 0, vd);
  const ib = device.createBuffer({
    size: id.byteLength,
    usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
  });
  device.queue.writeBuffer(ib, 0, id);
  return { vb, ib };
}

const crystal = makeBuffers(crystalVertexData, crystalIndexData);
const cage = makeBuffers(cageVertexData, cageIndexData);

// ---- uniform：mvp(64B) + params(16B) = 80B，水晶与笼各一份 --------
// mat4x4f 在 uniform 地址空间天然 16 字节对齐，vec4f 收尾不用再补
function makeUniforms() {
  const data = new Float32Array(20);
  const buffer = device.createBuffer({
    size: 80,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  return { data, buffer };
}

const crystalUniforms = makeUniforms();
const cageUniforms = makeUniforms();

// ---- 管线 ×2：同一个着色器，两种拓扑 ------------------------------
const module = device.createShaderModule({ code: shader });

const vertexLayout: GPUVertexBufferLayout = {
  arrayStride: 24, // position(12B) + color(12B)
  attributes: [
    { shaderLocation: 0, offset: 0, format: 'float32x3' },
    { shaderLocation: 1, offset: 12, format: 'float32x3' },
  ],
};

// 实体水晶：三角形 + 背面剔除
const crystalPipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module, entryPoint: 'vs', buffers: [vertexLayout] },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list', cullMode: 'back' },
  // 深度测试三件套之二：管线声明深度格式、开写入、'less' 比较
  depthStencil: {
    format: 'depth24plus',
    depthWriteEnabled: true,
    depthCompare: 'less', // 深度值更小（离相机更近）才能通过
  },
});

// 线框笼：line-list 拓扑，其余与水晶管线一致
const cagePipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module, entryPoint: 'vs', buffers: [vertexLayout] },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'line-list' },
  // 线同样要参与深度测试，否则画不出「穿过」的遮挡关系
  depthStencil: {
    format: 'depth24plus',
    depthWriteEnabled: true,
    depthCompare: 'less',
  },
});

const crystalBindGroup = device.createBindGroup({
  layout: crystalPipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: crystalUniforms.buffer } }],
});
const cageBindGroup = device.createBindGroup({
  layout: cagePipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: cageUniforms.buffer } }],
});

// ---- 相机参数（固定视角，信标自己转）-----------------------------
const FOV = (50 * Math.PI) / 180;
const EYE: Vec3 = [2.9, 1.9, 4.9];
const TARGET: Vec3 = [0, 0, 0];
const UP: Vec3 = [0, 1, 0];

// ---- 循环前把四个 TODO 各预演一次（与骨架保持同构，便于 diff）-----
ensureDepth(chrome.width, chrome.height);
void perspective(FOV, 1, 0.1, 40);
void lookAt(EYE, TARGET, UP);
void modelMatrix(0);

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const aspect = chrome.width / chrome.height;

  const proj = perspective(FOV, aspect, 0.1, 40);
  const view = lookAt(EYE, TARGET, UP);

  // P·V·M：向量最先被 M 作用（讲义 2.1 的组合顺序）
  const mvpCrystal = mat4Multiply(proj, mat4Multiply(view, modelMatrix(t)));
  const mvpCage = mat4Multiply(proj, mat4Multiply(view, cageMatrix(t)));

  crystalUniforms.data.set(mvpCrystal, 0);
  crystalUniforms.data[16] = t;
  cageUniforms.data.set(mvpCage, 0);
  cageUniforms.data[16] = t;
  device.queue.writeBuffer(crystalUniforms.buffer, 0, crystalUniforms.data);
  device.queue.writeBuffer(cageUniforms.buffer, 0, cageUniforms.data);

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
  // 同一个 renderPass 里两批 draw：实体与线框靠深度测试互相遮挡
  pass.setPipeline(crystalPipeline);
  pass.setBindGroup(0, crystalBindGroup);
  pass.setVertexBuffer(0, crystal.vb);
  pass.setIndexBuffer(crystal.ib, 'uint16');
  pass.drawIndexed(24); // 8 个三角形 × 3 个角

  pass.setPipeline(cagePipeline);
  pass.setBindGroup(0, cageBindGroup);
  pass.setVertexBuffer(0, cage.vb);
  pass.setIndexBuffer(cage.ib, 'uint16');
  pass.drawIndexed(24); // 12 条边 × 2 个端点
  pass.end();
  device.queue.submit([encoder.finish()]);
});
