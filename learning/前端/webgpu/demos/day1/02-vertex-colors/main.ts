// Day 1 · Demo 02 —— Vertex Colors
// 对应讲义 1.5：顶点数据第一次从 CPU 走进 GPU。
// 四边形 6 个顶点，每顶点 [x, y, r, g, b]：位置与颜色穿插在同一块 buffer。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './quad.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: '02',
  title: 'VERTEX COLORS',
  tags: ['WEBGPU', 'WGSL'],
  hint: '移动鼠标：四边形随视差漂移，色相轻微拉动',
});

// ---- 初始化：与 demo 01 完全一致 -------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

// ---- 顶点数据：interleaved（位置与颜色穿插） -------------------
const TEAL = [0.176, 0.831, 0.749];   // #2DD4BF 青
const VIOLET = [0.545, 0.361, 0.965]; // #8B5CF6 紫
const MID = TEAL.map((v, i) => v * 0.5 + VIOLET[i] * 0.5); // 对角中点色
const H = 0.48; // 半边长；乘 aspect 后约占屏宽 85%

// 两个三角形拼成四边形；颜色沿对角线渐变：左下紫 → 右上青。
// 左下与右上各被写两遍——顶点复制的代价，demo 03 用索引消除。
const vertices = new Float32Array([
  // x      y     r  g  b
  -H, -H, ...VIOLET, // 左下（第 1 个三角形）
   H, -H, ...MID,    // 右下
   H,  H, ...TEAL,   // 右上
  -H, -H, ...VIOLET, // 左下（第 2 个三角形）
   H,  H, ...TEAL,   // 右上
  -H,  H, ...MID,    // 左上
]);

const vertexBuffer = device.createBuffer({
  size: vertices.byteLength, // 6 顶点 × 20 字节 = 120 字节
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertices);

// ---- uniform buffer：动效与交互的驱动数据（讲义 1.6）----------
// 32 字节布局：time(字节 0) + 填充(4) + mouse(8) + aspect(16)。
// vec2f 成员按 8 字节对齐，JS 侧索引必须跳过填充槽位（讲义 1.6 的字节图）。
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 管线：vertex 段多了 buffers 布局声明 ---------------------
const module = device.createShaderModule({ code: shader });

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 5 * 4, // 20 字节：跨过一个顶点的全部数据
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
          { shaderLocation: 1, offset: 8, format: 'float32x3' }, // color
        ],
      },
    ],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list' },
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 鼠标交互：NDC 坐标（-1..1，y 向上） ----------------------
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
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer); // 0 对应 vertex.buffers[0]
  pass.draw(6); // 两个三角形共 6 个顶点
  pass.end();
  device.queue.submit([encoder.finish()]);
});
