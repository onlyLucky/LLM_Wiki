// Day 2 · 作业 advanced —— 纹理与光照
// 对应讲义 2.3（纹理采样与 Mipmap）/ 2.4（着色与光照模型）：
// canvas 程序化贴图上传 GPU、三线性采样、Blinn-Phong、点击切换色温。
// 四个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './textured.wgsl?raw';

type Vec3 = [number, number, number];

// depth texture 的重建依赖 device，而 chrome 首次 onResize 早于 initGPU 完成
let gpuReady = false;

const chrome = createChrome({
  day: 2,
  index: 'A',
  title: 'TEXTURE & LIGHT',
  tags: ['WEBGPU', 'TEXTURE', 'BLINN-PHONG'],
  hint: '拖动旋转 · 点击切换色温',
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

// ---- 已给全：矩阵（列主序，约定见讲义 2.1）-----------------------
// 这份作业的学习点不在矩阵：perspective / lookAt 在 basic 里刚写过。

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
  m[10] = far / (near - far); // WebGPU 的 NDC z ∈ [0, 1]
  m[11] = -1;
  m[14] = (near * far) / (near - far);
  return m;
}

function mat4LookAt(eye: Vec3, target: Vec3, up: Vec3): Float32Array {
  let zx = eye[0] - target[0];
  let zy = eye[1] - target[1];
  let zz = eye[2] - target[2];
  let len = Math.hypot(zx, zy, zz) || 1;
  zx /= len; zy /= len; zz /= len;
  let xx = up[1] * zz - up[2] * zy;
  let xy = up[2] * zx - up[0] * zz;
  let xz = up[0] * zy - up[1] * zx;
  len = Math.hypot(xx, xy, xz) || 1;
  xx /= len; xy /= len; xz /= len;
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

// ---- TODO 1：程序化纹理 → GPU ------------------------------------

const TEXTURE_SIZE = 512;
const MIP_LEVELS = 10; // 512 → 256 → … → 1：log2(512) + 1

function createAlbedoTexture(): GPUTexture {
  // TODO(day2-advanced-1): 画一张 512×512 程序化贴图并上传 GPU：
  //   a) canvas 2D 画底色 + 网格 + 图形（内容自定，别用纯色——远看要有图章）
  //   b) createTexture：rgba8unorm、mipLevelCount: MIP_LEVELS、
  //      usage 带 TEXTURE_BINDING | COPY_DST
  //   c) 第 0 级 copyExternalImageToTexture 上传
  //   d) 其余 9 级用 canvas 逐级降采样（drawImage 到一半大小）再逐级
  //      copy 上传（destination 带 mipLevel）——「有 mipmap」的验收点。
  throw new Error('TODO(day2-advanced-1) 未完成：见 README');
}

// ---- 已给全：几何（position + uv + normal）-----------------------
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

// ---- uniform：mvp(64B) + model(64B) + 四个 vec4f = 176B ------------
const uniforms = new Float32Array(44);
const uniformBuffer = device.createBuffer({
  size: 176,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 已给全：管线与深度 ------------------------------------------
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

// TODO(day2-advanced-2): 创建三线性 sampler 并建渲染绑定组：
//   a) device.createSampler：magFilter / minFilter / mipmapFilter 全 'linear'
//   b) device.createBindGroup：layout 取 pipeline.getBindGroupLayout(1)，
//      两个 entry——binding 0 挂 texture 的 view（整条 mip 链），
//      binding 1 挂 sampler；声明对着 textured.wgsl 的 @group(1) 抄
function createSamplerAndBindGroup(texture: GPUTexture): GPUBindGroup {
  throw new Error('TODO(day2-advanced-2) 未完成：见 README');
}

let depthTexture: GPUTexture | null = null;
// const 箭头而非 function 声明（原因见 demos/day2/01-mvp-cube 的同名函数注释）
const ensureDepth = (w: number, h: number) => {
  if (depthTexture && depthTexture.width === w && depthTexture.height === h) return;
  depthTexture?.destroy();
  depthTexture = device.createTexture({
    size: [w, h],
    format: 'depth24plus',
    usage: GPUTextureUsage.RENDER_ATTACHMENT,
  });
};

// uniform 绑定组内容不变，循环外建一次就够（讲义 1.6）
const frameBindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- TODO 4：三档色温 ----------------------------------------------
// 冷月光 → 正午白 → 钨丝暖：色温是创意网站「改一个 uniform 换一种情绪」的最小样本
const COLOR_TEMPS: { name: string; rgb: Vec3 }[] = [
  { name: '冷月光', rgb: [0.72, 0.82, 1.0] },
  { name: '正午白', rgb: [1.0, 0.97, 0.9] },
  { name: '钨丝暖', rgb: [1.0, 0.72, 0.42] },
];
let tempIndex = 0;

function currentLightColor(): Vec3 {
  // TODO(day2-advanced-4): 返回 COLOR_TEMPS[tempIndex] 的 rgb；
  // 并把下方 click 监听里的切换逻辑补全（tempIndex 循环前进 +
  // chrome.setMeta 显示当前档名）。
  throw new Error('TODO(day2-advanced-4) 未完成：见 README');
}

chrome.canvas.addEventListener('click', () => {
  // TODO(day2-advanced-4)：tempIndex = (tempIndex + 1) % COLOR_TEMPS.length;
  // chrome.setMeta(`色温 ${tempIndex + 1}/3 · ${COLOR_TEMPS[tempIndex].name}`);
});

// ---- 已给全：轨道相机 ---------------------------------------------
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

// ---- 初始化纹理与绑定组（TODO 1 / 2 的 throw 在这里暴露）----------
const albedoTexture = createAlbedoTexture();
const textureBindGroup = createSamplerAndBindGroup(albedoTexture);
void currentLightColor(); // TODO 4 的预演：未完成时错误面板报出编号

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();

chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  smooth.theta += (orbit.theta - smooth.theta) * 0.15;
  smooth.phi += (orbit.phi - smooth.phi) * 0.15;
  smooth.radius += (orbit.radius - smooth.radius) * 0.12;
  const eye: Vec3 = [
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

  // 光源绕场景转：光影随光源移动的验收点
  const lightPos: Vec3 = [Math.cos(t * 0.4) * 3.2, 2.4, Math.sin(t * 0.4) * 3.2];
  const lightColor = currentLightColor();

  uniforms.set(mvp, 0);
  uniforms.set(model, 16);
  uniforms[32] = eye[0]; uniforms[33] = eye[1]; uniforms[34] = eye[2];
  uniforms[35] = t;
  uniforms[36] = lightPos[0]; uniforms[37] = lightPos[1]; uniforms[38] = lightPos[2];
  uniforms[39] = 1.0; // 光强
  uniforms[40] = lightColor[0]; uniforms[41] = lightColor[1]; uniforms[42] = lightColor[2];
  uniforms[43] = 1.0;
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
  pass.setBindGroup(0, frameBindGroup);
  pass.setBindGroup(1, textureBindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(36);
  pass.end();
  device.queue.submit([encoder.finish()]);
});
