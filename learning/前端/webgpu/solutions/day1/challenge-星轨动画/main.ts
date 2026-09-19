// Day 1 · 作业 C —— 星轨动画（参考答案）
// 对应讲义 1.3 / 1.5 / 1.6：line-list 图元 + 6 环 × 90 段的星轨。
// 几何全部静态躺在单块 vertex buffer 里；环号、相位与视差在着色器里
// 由 vertex_index 与 uniform 推导——「数据不动、着色器算」的极简形态。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './trails.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'C',
  title: 'STAR TRAILS',
  tags: ['WEBGPU', 'WGSL'],
  hint: '多环反向旋转 · 鼠标产生分层视差',
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
// line-list：每 2 个连续顶点连一条线段——一个 90 段的圆需要 90 对端点
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
        arrayStride: 5 * 4, // 20 字节
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position
          { shaderLocation: 1, offset: 8, format: 'float32x3' }, // color
        ],
      },
    ],
  },
  fragment: { module, entryPoint: 'fs', targets: [{ format }] },
  primitive: { topology: lineTopology() },
});

// ---- 星轨几何：6 环 × 90 段，全部进一块 buffer -----------------
// 半径 0.16 起步、每环 +0.13（最外 0.81）；每段线段 2 个端点顶点，
// 每顶点 [x, y, r, g, b]；颜色沿半径从紫 #8B5CF6 渐到青 #2DD4BF；
// 顶点全部取静态圆上的点——旋转是着色器的事。
function buildStarRings(): Float32Array {
  const VIOLET = [0.545, 0.361, 0.965]; // #8B5CF6
  const TEAL = [0.176, 0.831, 0.749];   // #2DD4BF
  const SEGMENTS = 90;
  const data = new Float32Array(6 * SEGMENTS * 2 * 5);
  let w = 0; // 写入指针（float 计）
  for (let r = 0; r < 6; r++) {
    const radius = 0.16 + 0.13 * r;
    // 颜色按环号在紫与青之间取插值：内紫外青的单向过渡
    const c = VIOLET.map((v, i) => v + (TEAL[i] - v) * (r / 5));
    for (let s = 0; s < SEGMENTS; s++) {
      // 每段两个端点：角度 a 与 a + 4°（90 段 × 4° = 360°）
      const angles = [(s / SEGMENTS) * Math.PI * 2, ((s + 1) / SEGMENTS) * Math.PI * 2];
      for (const a of angles) {
        data.set([Math.cos(a) * radius, Math.sin(a) * radius, ...c], w);
        w += 5;
      }
    }
  }
  return data;
}
const ringData = buildStarRings();

const vertexBuffer = device.createBuffer({
  size: ringData.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, ringData);

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
      clearValue: { r: 0.043, g: 0.055, b: 0.078, a: 1 },
      loadOp: 'clear',
      storeOp: 'store',
    }],
  });
  pass.setPipeline(pipeline);
  pass.setBindGroup(0, bindGroup);
  pass.setVertexBuffer(0, vertexBuffer);
  pass.draw(ringData.length / 5); // 1080 个顶点 = 540 段线段
  pass.end();
  device.queue.submit([encoder.finish()]);
});
