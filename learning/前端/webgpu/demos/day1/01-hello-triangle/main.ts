// Day 1 · Demo 01 —— Hello Triangle
// 对应讲义 1.1–1.4：这是全课程第一个可运行页面。
// 顶点不经过顶点缓冲，直接在着色器里用 vertex_index 生成，
// 目的是让你先看清「管线」本身，1.5 再引入真正的顶点数据。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './triangle.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: '01',
  title: 'HELLO TRIANGLE',
  tags: ['WEBGPU', 'WGSL'],
  hint: '移动鼠标：颜色与位置随之轻微扰动',
});

// ---- 初始化：adapter → device → canvas context ----------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

// ---- uniform buffer：时间 / 鼠标 / 宽高比 -----------------------
// 8 个 float = 32 字节。uniform 地址空间要求 struct 按 16 字节对齐，
// 这里把 4 个有效字段填进 32 字节，第 1.6 讲会解释为什么留这么多。
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 着色器模块与渲染管线 -------------------------------------
const module = device.createShaderModule({ code: shader });

const pipeline = device.createRenderPipeline({
  layout: 'auto', // 讲义 1.6：让管线从着色器自动推导绑定组布局
  vertex: { module, entryPoint: 'vs' },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: 'triangle-list' },
});

// 绑定组：uniform buffer 挂到 @group(0) @binding(0)
const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 鼠标交互：记录 NDC 坐标（-1..1，y 向上） ------------------
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
  uniforms[0] = t; // time
  uniforms[1] = mouse[0]; // mouse.x
  uniforms[2] = mouse[1]; // mouse.y
  uniforms[3] = chrome.width / chrome.height; // aspect
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      // 与 CSS 底色 #0B0E14 保持一致，画布与画框无缝衔接
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.draw(3); // 三个顶点，一个三角形
  pass.end();
  device.queue.submit([encoder.finish()]);
});
