// Day 2 · Demo 07 —— Ray Marching（SDF 场景与光线步进）
// 对应讲义 2.8：一个覆盖全屏的大三角形，片元着色器里
// 逐像素构建相机射线、SDF 步进求交、软阴影与距离雾。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './scene.wgsl?raw';

const chrome = createChrome({
  day: 2,
  index: '07',
  title: 'RAYMARCHING',
  tags: ['WEBGPU', 'WGSL', 'SDF'],
  hint: '移动鼠标环视场景',
});

// ---- 初始化 -----------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

// ---- uniform：鼠标（环视） + 时间与宽高比（32 字节）--------------
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 管线：无顶点缓冲，三个顶点覆盖全屏 -------------------------
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

// ---- 鼠标：NDC 坐标，着色器里换算成环绕角 ------------------------
let mouse: [number, number] = [0, 0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse = [
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  ];
});

// ---- 帧循环 -----------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  // 布局：mouse(4) + params(4)
  uniforms[0] = mouse[0];
  uniforms[1] = mouse[1];
  uniforms[4] = t;
  uniforms[5] = chrome.width / chrome.height;
  device.queue.writeBuffer(uniformBuffer, 0, uniforms);

  const encoder = device.createCommandEncoder();
  const pass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.008, g: 0.010, b: 0.020, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.draw(3); // 就这一个三角形
  pass.end();
  device.queue.submit([encoder.finish()]);
});
