// Day 2 · Demo 05 —— Compute Basics（计算着色器入门）
// 对应讲义 2.6：compute pipeline + dispatchWorkgroups + storage buffer。
// 计算与渲染共享同一个 buffer：compute 每帧更新 64×64 点阵，
// 渲染管线的顶点着色器直接读它，可视化「计算 → 渲染」数据流。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import simulate from './simulate.wgsl?raw';
import points from './points.wgsl?raw';

const chrome = createChrome({
  day: 2,
  index: '05',
  title: 'COMPUTE BASICS',
  tags: ['WEBGPU', 'COMPUTE'],
  hint: '移动鼠标驱散粒子',
});

// ---- 初始化 -----------------------------------------------------
const device = await initGPU(chrome);
if (!device) throw new Error('WebGPU 初始化失败，详情见页面错误面板');

const context = chrome.canvas.getContext('webgpu');
if (!context) throw new Error('无法获取 webgpu context');
const format = navigator.gpu.getPreferredCanvasFormat();
context.configure({ device, format, alphaMode: 'opaque' });

const GRID = 64;
const COUNT = GRID * GRID; // 4096 个点

// ---- 状态 buffer：每个点一个 vec4f（x, y, vx, vy）---------------
// 只需要 STORAGE：初始化用 compute pass 完成，JS 全程不碰它。
const stateBuffer = device.createBuffer({
  size: COUNT * 16,
  usage: GPUBufferUsage.STORAGE,
});

// ---- 两组 uniform：模拟参数（compute 用）与渲染参数（render 用）--
const simUniforms = new Float32Array(8); // mouse(4) + params(4)
const simBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});
const renderUniforms = new Float32Array(8); // res(4) + 备用(4)
const renderBuffer = device.createBuffer({
  size: 32,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 计算管线：同一模块的两个入口（init / update）----------------
const simModule = device.createShaderModule({ code: simulate });
const initPipeline = device.createComputePipeline({
  layout: 'auto',
  compute: { module: simModule, entryPoint: 'init' },
});
const updatePipeline = device.createComputePipeline({
  layout: 'auto',
  compute: { module: simModule, entryPoint: 'update' },
});

// layout:'auto' 的布局按管线各自生成：init 入口不读 uniform，
// 它的自动布局只声明 binding 0，绑定组不能再多给 simBuffer
const initBindGroup = device.createBindGroup({
  layout: initPipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: stateBuffer } }],
});
const updateBindGroup = device.createBindGroup({
  layout: updatePipeline.getBindGroupLayout(0),
  entries: [
    { binding: 0, resource: { buffer: stateBuffer } },
    { binding: 1, resource: { buffer: simBuffer } },
  ],
});

// ---- 渲染管线：6 顶点小 quad × COUNT 实例 ------------------------
// WebGPU 的 point-list 恒为 1 像素，放大显示靠 quad + instancing。
const pointModule = device.createShaderModule({ code: points });
const renderPipeline = device.createRenderPipeline({
  layout: 'auto',
  vertex: { module: pointModule, entryPoint: 'vs' },
  fragment: {
    module: pointModule,
    entryPoint: 'fs',
    targets: [{
      format,
      // 预乘 alpha 混合：柔边圆点叠在深底上
      blend: {
        color: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
        alpha: { srcFactor: 'one', dstFactor: 'one-minus-src-alpha', operation: 'add' },
      },
    }],
  },
  primitive: { topology: 'triangle-list' },
});
const renderBindGroup = device.createBindGroup({
  layout: renderPipeline.getBindGroupLayout(0),
  entries: [
    { binding: 0, resource: { buffer: stateBuffer } },
    { binding: 1, resource: { buffer: renderBuffer } },
  ],
});

// ---- 鼠标：NDC → 模拟空间（与着色器里的 scale 互为逆映射）-------
let mouseSim: [number, number] = [2.5, 2.5]; // 初始放在画面外，不干扰
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
  const ny = 1 - ((e.clientY - r.top) / r.height) * 2;
  const a = r.width / r.height;
  const kx = Math.min(1, 1 / a) * 0.88;
  const ky = Math.min(1, a) * 0.88;
  mouseSim = [nx / kx, ny / ky];
});

// ---- 初始化：一次 dispatch 把点阵摆好（讲义 2.6 的 init 入口）----
{
  const encoder = device.createCommandEncoder();
  const pass = encoder.beginComputePass();
  pass.setPipeline(initPipeline);
  pass.setBindGroup(0, initBindGroup);
  pass.dispatchWorkgroups(GRID / 8, GRID / 8); // 8×8 个 workgroup
  pass.end();
  device.queue.submit([encoder.finish()]);
}

// ---- 帧循环：先计算后渲染，同一个 encoder 一次 submit ------------
const start = performance.now();
let last = start;
const dpr = Math.min(window.devicePixelRatio || 1, 2);
chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  const dt = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  simUniforms[0] = mouseSim[0];
  simUniforms[1] = mouseSim[1];
  simUniforms[4] = t;
  simUniforms[5] = dt;
  simUniforms[6] = chrome.width / chrome.height;
  device.queue.writeBuffer(simBuffer, 0, simUniforms);

  renderUniforms[0] = chrome.width;
  renderUniforms[1] = chrome.height;
  renderUniforms[2] = chrome.width / chrome.height;
  renderUniforms[3] = Math.round(6 * dpr); // 点直径：CSS 像素 × DPR
  device.queue.writeBuffer(renderBuffer, 0, renderUniforms);

  const encoder = device.createCommandEncoder();

  // 1) 计算：4096 个 invocation 各自更新一个点
  const cpass = encoder.beginComputePass();
  cpass.setPipeline(updatePipeline);
  cpass.setBindGroup(0, updateBindGroup);
  cpass.dispatchWorkgroups(GRID / 8, GRID / 8);
  cpass.end();

  // 2) 渲染：顶点着色器读同一个 storage buffer
  const rpass = encoder.beginRenderPass({
    colorAttachments: [{
      view: context.getCurrentTexture().createView(),
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  rpass.setPipeline(renderPipeline);
  rpass.setBindGroup(0, renderBindGroup);
  rpass.draw(6, COUNT);
  rpass.end();

  device.queue.submit([encoder.finish()]);
});
