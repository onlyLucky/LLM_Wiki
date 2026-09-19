// Day 1 · Demo 03 —— Indexed Quad
// 对应讲义 1.5：索引绘制。与 demo 02 画同一个四边形，
// 顶点从 6 个减到 4 个，三角形改由索引 [0,1,2, 0,2,3] 指认。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './quad.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: '03',
  title: 'INDEXED QUAD',
  tags: ['WEBGPU', 'WGSL'],
  hint: '移动鼠标：四边形随视差漂移，色相轻微拉动',
});

// ---- 初始化 ---------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

// ---- 顶点数据：4 个顶点，每个顶点只写一次 ----------------------
const BLUE = [0.298, 0.435, 1.000];  // #4C6FFF 电蓝
const AMBER = [0.961, 0.620, 0.043]; // #F59E0B 琥珀
const MID = BLUE.map((v, i) => v * 0.5 + AMBER[i] * 0.5);
const H = 0.48;

const vertices = new Float32Array([
  // x      y     r  g  b
  -H, -H, ...BLUE,  // 0 左下
   H, -H, ...MID,   // 1 右下
   H,  H, ...AMBER, // 2 右上
  -H,  H, ...MID,   // 3 左上
]);

// 索引：两个三角形共享对角线（0 → 2）上的顶点，
// 每个 vertex buffer 顶点只存一份，drawIndexed 按下标取用
const indices = new Uint16Array([
  0, 1, 2, // 左下 → 右下 → 右上
  0, 2, 3, // 左下 → 右上 → 左上
]);

const vertexBuffer = device.createBuffer({
  size: vertices.byteLength, // 4 顶点 × 20 字节 = 80 字节（demo 02 是 120）
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertices);

const indexBuffer = device.createBuffer({
  size: indices.byteLength, // 6 索引 × 2 字节 = 12 字节
  usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(indexBuffer, 0, indices);

// ---- uniform buffer：动效与交互的驱动数据（讲义 1.6）----------
// 32 字节布局：time(字节 0) + 填充(4) + mouse(8) + aspect(16)。
// vec2f 成员按 8 字节对齐，JS 侧索引必须跳过填充槽位（讲义 1.6 的字节图）。
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 管线：布局声明与 demo 02 完全相同 -----------------------
const module = device.createShaderModule({ code: shader });

const pipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: {
    module,
    entryPoint: 'vs',
    buffers: [
      {
        arrayStride: 5 * 4, // 20 字节
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
          { shaderLocation: 1, offset: 8, format: 'float32x3' }, // color
        ],
      },
    ],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list' }, // 索引不改 topology
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
  pass.setVertexBuffer(0, vertexBuffer);
  pass.setIndexBuffer(indexBuffer, 'uint16'); // 索引格式随数据类型
  pass.drawIndexed(6); // 6 个索引 = 两个三角形
  pass.end();
  device.queue.submit([encoder.finish()]);
});
