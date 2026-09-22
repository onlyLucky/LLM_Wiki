// Day 1 · 作业 C —— 星轨动画（参考答案）
// 长曝光星轨摄影：对应讲义 1.3 / 1.5 / 1.6——line-list 图元 + 单块静态
// vertex buffer。80 余颗星的弧段围绕偏心极点排布，旋转、视差、闪烁、
// 流星全部在着色器里推导；JS 侧只负责把「一张星图」一次性写进 buffer。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './trails.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'C',
  title: 'STAR TRAILS',
  tags: ['WEBGPU', 'WGSL'],
  hint: '长曝光星轨 · 鼠标分层视差 · 静候流星',
});

// ---- 初始化（脚手架，无需改动）--------------------------------
// 判空后把 device / context 定型成非空常量：TODO 函数体与 throw 之后的
// 代码里，strict 的收窄不会自动跟进去，定型一次处处可用
const maybeDevice = await initGPU(chrome);
if (!maybeDevice) throw new Error('WebGPU 初始化失败，详情见页面错误面板');
const device: GPUDevice = maybeDevice;

const maybeContext = chrome.canvas.getContext('webgpu');
if (!maybeContext) throw new Error('无法获取 webgpu context');
const context: GPUCanvasContext = maybeContext;
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

const module = device.createShaderModule({ code: shader });

// ---- 管线 -----------------------------------------------------
// line-list：每 2 个连续顶点连一条线段——一段弧是「段数 × 2 个端点」
function lineTopology(): GPUPrimitiveTopology {
  return 'line-list';
}

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 8 * 4, // 32 字节
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position（单位坐标）
          { shaderLocation: 1, offset: 8, format: 'float32x3' }, // color
          { shaderLocation: 2, offset: 20, format: 'float32' },  // arcT 弧内位置 0..1
          { shaderLocation: 3, offset: 24, format: 'float32' },  // band 轨道带号
          { shaderLocation: 4, offset: 28, format: 'float32' },  // seed 每星种子
        ],
      },
    ],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: lineTopology() },
});

// ---- 星轨几何：5 条轨道带 × 每带 12~20 颗星，每星一段弧 ---------
// 每顶点 [x, y, r, g, b, arcT, band, seed]；position 是「半屏高单位」
// （1 = 半屏高），着色器里 x 除以 aspect 才是 NDC——半径换算成像素
// 在 x、y 两向等距，轨道是屏幕上的正圆。
// 固定种子的 PRNG：每次刷新构图完全一致，像同一张长曝光照片。
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POLE = [0.30, 0.18];            // 与 WGSL 里的 POLE 逐字一致（半屏高单位）
const WARM = [1.0, 0.82, 0.58];       // 内带：老星的暖金
const COOL = [0.48, 0.66, 1.0];       // 外带：年轻星的冷蓝

function buildStarTrails(): Float32Array {
  const rng = mulberry32(20240601);
  const v: number[] = [];
  const push = (x: number, y: number, c: readonly number[], arcT: number, band: number, seed: number) =>
    v.push(x, y, c[0], c[1], c[2], arcT, band, seed);

  const bandRadius = [0.10, 0.22, 0.34, 0.46, 0.58];
  const starsPerBand = [12, 14, 16, 18, 20]; // 外带星更多——真实星空的密度感

  for (let band = 0; band < 5; band++) {
    for (let s = 0; s < starsPerBand[band]; s++) {
      const radius = bandRadius[band] + (rng() - 0.5) * 0.03; // 带内轻微抖动
      const startA = rng() * Math.PI * 2;                     // 随机起角
      // 弧长双峰：80% 短弧（扫过即逝的暗星）+ 20% 长弧（曝光最久的主星），
      // 节奏有断有连，避免「规整圆环」的机械感
      const arcTurns = rng() < 0.2 ? 0.45 + rng() * 0.25 : 0.08 + rng() * 0.14;
      const arcLen = arcTurns * Math.PI * 2;
      const bright = rng() < 0.18;                            // 18% 是亮星
      // 色温：按带从暖金滑向冷蓝，每颗星再微扰一点；亮星往白里混
      const k = Math.min(Math.max(band / 4 + (rng() - 0.5) * 0.08, 0), 1);
      const c = WARM.map((wv, ci) => wv + (COOL[ci] - wv) * k)
        .map((cv) => (bright ? cv + (1 - cv) * 0.55 : cv));
      const seed = Math.floor(rng() * 1000) / 1000 + band * 10; // 每星唯一
      // 段数按弧长配平（约每 0.02 单位一段），折线在 1080p 下圆滑无折角
      const segs = Math.max(6, Math.round((arcLen * radius) / 0.02));
      for (let g = 0; g < segs; g++) {
        for (const t of [g / segs, (g + 1) / segs]) {
          const a = startA + arcLen * t;
          push(POLE[0] + Math.cos(a) * radius, POLE[1] + Math.sin(a) * radius, c, t, band, seed);
        }
      }
    }
  }

  // 极星：八向星芒（4 长 4 短），band = 5；arcT 0 = 根部、1 = 尖端
  for (let m = 0; m < 8; m++) {
    const dirA = (m * Math.PI) / 4;
    const len = m < 4 ? 0.085 : 0.042;
    const r0 = 0.004;
    push(POLE[0] + Math.cos(dirA) * r0, POLE[1] + Math.sin(dirA) * r0,
      [1.0, 0.92, 0.75], 0, 5, m);
    push(POLE[0] + Math.cos(dirA) * (r0 + len), POLE[1] + Math.sin(dirA) * (r0 + len),
      [1.0, 0.92, 0.75], 1, 5, m);
  }

  // 流星：一条对角线段（半屏高单位），seed = -1 标记——位置与出没全在着色器里算
  push(-1.90, -0.75, [0.8, 0.9, 1.0], 0, 0, -1);
  push(1.50, 0.65, [0.8, 0.9, 1.0], 1, 0, -1);

  return Float32Array.from(v);
}
const trailData = buildStarTrails();

const vertexBuffer = device.createBuffer({
  size: trailData.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, trailData);

// ---- uniform：时间与鼠标（32 字节布局，与 demo 04 相同）--------
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 鼠标交互：NDC 坐标（-1..1，y 向上）-----------------------
let mouse = [0, 0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse = [
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  ];
});

// ---- 帧循环 ---------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  uniforms[0] = t; // time        → 字节 0
  uniforms[2] = mouse[0]; // mouse.x → 字节 8（索引 1 是填充槽）
  uniforms[3] = mouse[1]; // mouse.y → 字节 12
  uniforms[4] = chrome.width / chrome.height; // aspect → 字节 16
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.027, g: 0.039, b: 0.071, a: 1 }, // #070A12，与 WGSL 的 BG 一致
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.draw(trailData.length / 8); // 每顶点 8 个 float
  pass.end();
  device.queue.submit([encoder.finish()]);
});
