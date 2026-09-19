// Day 1 · 作业 B —— 呼吸的渐变
// 对应讲义 1.5 / 1.6：顶点色渐变（数据已给），
// 你的任务是加一块 uniform buffer，让两组颜色随时间呼吸交换。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './quad.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'B',
  title: 'BREATHING GRADIENT',
  tags: ['WEBGPU', 'WGSL'],
  hint: '完成 TODO 后：四边形在两组颜色间呼吸交换',
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

// ---- 顶点数据（已给）：对角渐变的四边形，interleaved 布局 -------
// 每顶点 [x, y, r, g, b]，颜色沿对角线从紫（左下）渐到青（右上）。
const VIOLET = [0.545, 0.361, 0.965]; // #8B5CF6 紫
const TEAL = [0.176, 0.831, 0.749];   // #2DD4BF 青
const MID = VIOLET.map((v, i) => v * 0.5 + TEAL[i] * 0.5);
const H = 0.48;

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
  size: vertices.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertices);

// ---- uniform：呼吸交换的驱动数据（讲义 1.6）--------------------
// TODO(day1-basic-1): 创建 uniform 的数据与 uniformBuffer
//   数据：new Float32Array(8)（32 字节，16 的倍数；布局参考 demo 01 的 32 字节方案）
//   buffer：device.createBuffer({ size: ..., usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })
//   写好后 return { data, buffer }，下方管线与绑定组会接住它们
function setupUniform(): { data: Float32Array; buffer: GPUBuffer } {
  throw new Error('TODO(day1-basic-1) 未完成：见 README');
}
const { data: uniforms, buffer: uniformBuffer } = setupUniform();

// ---- 管线与绑定组（脚手架，无需改动）--------------------------
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
  primitive: { topology: 'triangle-list' },
});

// 提示：quad.wgsl 的任务 2 完成前，着色器里没有任何 @group 声明，
// layout:'auto' 推不出第 0 组——getBindGroupLayout(0) 会报错，这是任务 2 未完成的信号
const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 鼠标交互（加分项用：传进 uniform 做轻微色彩扰动或视差）----
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
  // TODO(day1-basic-3): 每帧把时间写进 uniform 并上传
  //   uniforms[0] = t;（32 字节方案的话，[2][3] 写 mouse、[4] 写 aspect）
  //   device.queue.writeBuffer(uniformBuffer, 0, uniforms);
  throw new Error('TODO(day1-basic-3) 未完成：见 README');

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
  pass.draw(6); // 两个三角形共 6 个顶点
  pass.end();
  device.queue.submit([encoder.finish()]);
});
