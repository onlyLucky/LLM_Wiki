// Day 1 · Demo 04 —— Uniform Animation
// 对应讲义 1.6：几何不动，uniform 每帧变。
// 三个等边三角形绕同一中心公转并自转，色相在电蓝与青之间循环；
// 顶点仍由 vertex_index 生成，全片唯一的数据流是那 32 字节 uniform。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './rings.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: '04',
  title: 'UNIFORM ANIMATION',
  tags: ['WEBGPU', 'WGSL'],
  hint: '移动鼠标：三角环随视差漂移',
});

// ---- 初始化 ---------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

// ---- uniform buffer：本 demo 的全部动态数据 -------------------
// 32 字节布局：time(字节 0) + 填充(4) + mouse(8) + aspect(16)。
// vec2f 成员按 8 字节对齐，JS 侧索引必须跳过填充槽位（讲义 1.6 的字节图）。
// 几何由 vertex_index 生成且永不更新，动画只来自这块 buffer。
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 管线：无顶点缓冲，回到 demo 01 的形态 --------------------
const module = device.createShaderModule({ code: shader });

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module, entryPoint: 'vs' },
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

// ---- 帧循环：每帧只改 uniform，再提交一帧命令 ------------------
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
  pass.draw(9); // 3 个三角形 × 3 个顶点
  pass.end();
  device.queue.submit([encoder.finish()]);
});
