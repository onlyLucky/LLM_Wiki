// Day 2 · Demo 02 —— Textured Cube
// 对应讲义 2.3：canvas 2D 程序化生成纹理 → copyExternalImageToTexture
// 上传第 0 级 → GPU 逐级渲染出 mipmap → 三线性采样。
// 滚轮把立方体拉远，观察网格线在 mip 级之间的平滑过渡。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './textured.wgsl?raw';
import mipShader from './mip.wgsl?raw';

let gpuReady = false;

const chrome = createChrome({
  day: 2,
  index: '02',
  title: 'TEXTURED CUBE',
  tags: ['WEBGPU', 'TEXTURE', 'MIPMAP'],
  hint: '拖动旋转 · 滚轮缩放',
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

// ---- 手写 mat4：列主序（同 demo 01）------------------------------
// 约定见 demos/day2/01-mvp-cube/main.ts 与讲义 2.1，此处只用到四个

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

// ---- 程序化纹理：512 × 512 的「深空蓝图」---------------------------
// 深底 + 电蓝网格 + 青色同心圆 + 琥珀对角带与四角取景框：远看有图章、
// 近看有细节，各级 mip 都有可辨识的结构，而不是随机噪点
function createTextureSource(): HTMLCanvasElement {
  const size = 512;
  const c = document.createElement('canvas');
  c.width = size;
  c.height = size;
  const g = c.getContext('2d');
  if (!g) throw new Error('无法创建 2D context');

  g.fillStyle = '#0D1322';
  g.fillRect(0, 0, size, size);

  // 32px 细网格（低透明度）
  g.strokeStyle = 'rgba(76, 111, 255, 0.13)';
  g.lineWidth = 1;
  for (let i = 0; i <= 16; i++) {
    g.beginPath(); g.moveTo(i * 32 + 0.5, 0); g.lineTo(i * 32 + 0.5, size); g.stroke();
    g.beginPath(); g.moveTo(0, i * 32 + 0.5); g.lineTo(size, i * 32 + 0.5); g.stroke();
  }

  // 128px 主网格（电蓝）
  g.strokeStyle = 'rgba(76, 111, 255, 0.55)';
  g.lineWidth = 2;
  for (let i = 0; i <= 4; i++) {
    g.beginPath(); g.moveTo(i * 128, 0); g.lineTo(i * 128, size); g.stroke();
    g.beginPath(); g.moveTo(0, i * 128); g.lineTo(size, i * 128); g.stroke();
  }

  // 中心十字与同心圆（青）：给远距离的低 mip 一个可辨识的图章
  g.strokeStyle = '#2DD4BF';
  g.lineWidth = 3;
  g.beginPath(); g.arc(256, 256, 118, 0, Math.PI * 2); g.stroke();
  g.lineWidth = 1.5;
  g.beginPath(); g.arc(256, 256, 96, 0, Math.PI * 2); g.stroke();
  g.beginPath(); g.moveTo(256 - 140, 256); g.lineTo(256 + 140, 256); g.stroke();
  g.beginPath(); g.moveTo(256, 256 - 140); g.lineTo(256, 256 + 140); g.stroke();

  // 琥珀对角窄带
  g.strokeStyle = 'rgba(245, 158, 11, 0.75)';
  g.lineWidth = 5;
  g.beginPath(); g.moveTo(0, size); g.lineTo(size, 0); g.stroke();

  // 四角取景框角标
  const bracket = (x: number, y: number, sx: number, sy: number) => {
    g.beginPath();
    g.moveTo(x + sx * 44, y);
    g.lineTo(x, y);
    g.lineTo(x, y + sy * 44);
    g.stroke();
  };
  bracket(26, 26, 1, 1);
  bracket(size - 26, 26, -1, 1);
  bracket(26, size - 26, 1, -1);
  bracket(size - 26, size - 26, -1, -1);

  // 边缘刻度数字（蓝图味）
  g.fillStyle = 'rgba(232, 236, 244, 0.55)';
  g.font = '16px ui-monospace, Menlo, monospace';
  for (let i = 0; i <= 4; i++) {
    g.fillText(String(i * 128), i * 128 + 6, 22);
    g.fillText(String(i * 128), 6, i * 128 + 20);
  }
  return c;
}

// ---- 纹理：rgba8unorm · 10 级 mip 链 ------------------------------
const TEXTURE_SIZE = 512;
const MIP_LEVELS = 10; // 512 → 256 → … → 1：log2(512) + 1

const texture = device.createTexture({
  size: [TEXTURE_SIZE, TEXTURE_SIZE],
  format: 'rgba8unorm', // 与 canvas 像素源天然匹配（8bit 无符号归一化）
  mipLevelCount: MIP_LEVELS,
  // RENDER_ATTACHMENT：每一级 mip 都要被「渲染进去」，少这个标志
  // mipmap 生成会直接 validation error
  usage:
    GPUTextureUsage.TEXTURE_BINDING |
    GPUTextureUsage.COPY_DST |
    GPUTextureUsage.RENDER_ATTACHMENT,
});

// canvas 直接拷进第 0 级：copyExternalImageToTexture 吃 canvas/ImageBitmap
device.queue.copyExternalImageToTexture(
  { source: createTextureSource() },
  { texture },
  [TEXTURE_SIZE, TEXTURE_SIZE],
);

// ---- 在 GPU 上生成 mipmap：逐级降采样 ------------------------------
// WebGPU 不会自动生成 mip：把上一级当输入采样、渲染进下一级，
// linear 过滤恰好就是「4 邻域取平均」的盒式降采样
const mipModule = device.createShaderModule({ code: mipShader });
const mipPipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module: mipModule, entryPoint: 'vs' },
  // 目标格式是纹理自己的 rgba8unorm，不是画布格式
  fragment: { module: mipModule, entryPoint: 'fs', targets: [{ format: 'rgba8unorm' }] },
});
const mipSampler = device.createSampler({ minFilter: 'linear' });

{
  const encoder = device.createCommandEncoder();
  for (let level = 1; level < MIP_LEVELS; level++) {
    // bind group 挂「上一级」的视图：createView 选定单个 mip 层
    const bindGroup = device.createBindGroup({
      layout: mipPipeline.getBindGroupLayout(0),
      entries: [
        {
          binding: 0,
          resource: texture.createView({ baseMipLevel: level - 1, mipLevelCount: 1 }),
        },
        { binding: 1, resource: mipSampler },
      ],
    });
    const pass = encoder.beginRenderPass({
      colorAttachments: [
        {
          // 本级作为 render target；viewport 默认就是整张附件
          view: texture.createView({ baseMipLevel: level, mipLevelCount: 1 }),
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: 'clear',
          storeOp: 'store',
        },
      ],
    });
    pass.setPipeline(mipPipeline);
    pass.setBindGroup(0, bindGroup);
    pass.draw(3); // 大三角形铺满当前级
    pass.end();
  }
  device.queue.submit([encoder.finish()]);
}

// ---- 几何：8 个角点 → 24 顶点（position + uv + normal）------------
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

// 每面铺满整张纹理：ids 顺序从外侧看是「左下 → 右下 → 右上 → 左上」
const QUAD_UV = [
  [0, 1], [1, 1], [1, 0], [0, 0],
] as const;

const vertexData = new Float32Array(24 * 8);
const indexData = new Uint16Array(36);
FACES.forEach((face, f) => {
  face.ids.forEach((id, k) => {
    vertexData.set([...CORNERS[id], ...QUAD_UV[k], ...face.normal], (f * 4 + k) * 8);
  });
  const b = f * 4;
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

// ---- uniform 与管线 ----------------------------------------------
const uniforms = new Float32Array(32); // mvp(64B) + model(64B)
const uniformBuffer = device.createBuffer({
  size: 128,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const module = device.createShaderModule({ code: shader });

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 32, // position(12B) + uv(8B) + normal(12B)
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x3' },
          { shaderLocation: 1, offset: 12, format: 'float32x2' },
          { shaderLocation: 2, offset: 20, format: 'float32x3' },
        ],
      },
    ],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list', cullMode: 'back' },
  depthStencil: {
    format: 'depth24plus',
    depthWriteEnabled: true,
    depthCompare: 'less',
  },
});

// 三线性采样器：minFilter 在两级 mip 内各自线性，mipmapFilter 在两级之间线性
const viewSampler = device.createSampler({
  magFilter: 'linear',
  minFilter: 'linear',
  mipmapFilter: 'linear',
  // 蓝图纹理的边缘有细线，repeat 会把对边卷进来污染低级 mip
  addressModeU: 'clamp-to-edge',
  addressModeV: 'clamp-to-edge',
});

// bind group：uniform + sampler + texture（不带参数的 view = 整条 mip 链）
const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [
    { binding: 0, resource: { buffer: uniformBuffer } },
    { binding: 1, resource: viewSampler },
    { binding: 2, resource: texture.createView() },
  ],
});

// ---- depth texture ------------------------------------------------
let depthTexture: GPUTexture | null = null;
// const 箭头而非 function 声明（原因见 demo 01 同名函数的注释）
const ensureDepth = (w: number, h: number) => {
  if (depthTexture && depthTexture.width === w && depthTexture.height === h) return;
  depthTexture?.destroy();
  depthTexture = device.createTexture({
    size: [w, h],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
};

// ---- 轨道相机 + 滚轮缩放 -----------------------------------------
const orbit = { theta: 0.75, phi: 1.1, radius: 4.6 };
const smooth = { theta: 0.75, phi: 1.1, radius: 4.6 };
let dragging = false;
let lastX = 0;
let lastY = 0;

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
});
const endDrag = () => {
  dragging = false;
};
chrome.canvas.addEventListener('pointerup', endDrag);
chrome.canvas.addEventListener('pointercancel', endDrag);

// 滚轮改变相机距离：拉远正是观察 mipmap 过渡的方式
chrome.canvas.addEventListener(
  'wheel',
  (e) => {
    e.preventDefault();
    orbit.radius = clamp(orbit.radius * Math.exp(e.deltaY * 0.0012), 2.1, 11.0);
  },
  { passive: false },
);

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();

chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  smooth.theta += (orbit.theta - smooth.theta) * 0.15;
  smooth.phi += (orbit.phi - smooth.phi) * 0.15;
  smooth.radius += (orbit.radius - smooth.radius) * 0.12;
  const eye: [number, number, number] = [
    smooth.radius * Math.sin(smooth.phi) * Math.cos(smooth.theta),
    smooth.radius * Math.cos(smooth.phi),
    smooth.radius * Math.sin(smooth.phi) * Math.sin(smooth.theta),
  ];

  const model = mat4RotateY(t * 0.22); // 立方体恒定缓慢自转
  const view = mat4LookAt(eye, [0, 0, 0], [0, 1, 0]);
  const proj = mat4Perspective(
    (50 * Math.PI) / 180,
    chrome.width / chrome.height,
    0.1,
    100,
  );
  const mvp = mat4Multiply(proj, mat4Multiply(view, model));

  uniforms.set(mvp, 0);
  uniforms.set(model, 16);
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

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
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(36);
  pass.end();
  device.queue.submit([encoder.finish()]);
});
