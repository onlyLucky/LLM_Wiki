// Day 1 · 作业 C —— 星轨动画
// 对应讲义 1.3 / 1.5 / 1.6：line-list 图元 + 长曝光星轨。
// 几何全部静态躺在单块 vertex buffer 里；旋转、视差、闪烁、流星
// 在着色器里由 attribute 与 uniform 推导——「数据不动、着色器算」。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './trails.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'C',
  title: 'STAR TRAILS',
  tags: ['WEBGPU', 'WGSL'],
  hint: '完成 TODO 后：长曝光星轨绕极点旋转，头尾渐隐，静候流星',
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
// TODO(day1-challenge-1): 返回线段列表的图元类型
//   图元类型在讲义 1.3 的图元装配一节（GPUPrimitiveTopology）；
//   返回 'line-list' 后，每 2 个连续顶点连成一条线段
function lineTopology(): GPUPrimitiveTopology {
  throw new Error('TODO(day1-challenge-1) 未完成：见 README');
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
          { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position（半屏高单位）
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
// 在 x、y 两向等距，轨道才是屏幕上的正圆。

// TODO(day1-challenge-2): 生成全部星轨顶点数据（单 buffer）
//   结构建议：
//   1. 固定种子的 PRNG（mulberry32 一类），保证每次刷新构图一致
//   2. 外层循环 band 0..4，bandRadius = [0.10, 0.22, 0.34, 0.46, 0.58]，
//      starsPerBand = [12, 14, 16, 18, 20]（外带星更多，密度感）
//   3. 每颗星：半径 = 带半径 + 微扰、起角随机；弧长双峰分布——
//      80% 短弧 0.08~0.22 圈（扫过即逝的暗星）+ 20% 长弧 0.45~0.70 圈
//      （曝光最久的主星），节奏有断有连，避免「规整圆环」的机械感；
//      色温按带从 WARM [1.0, 0.82, 0.58] 滑向 COOL [0.48, 0.66, 1.0]，
//      亮星（约 18%）往白里混
//   4. 段数按弧长配平：segs = max(6, round(弧长 × 半径 / 0.02))，
//      每段 push 两个端点（line-list），arcT 分别记 t 与 t+1/segs
//   5. 极点 POLE = [0.30, 0.18]（半屏高单位），弧点 = POLE + (cos a, sin a) × 半径
//   加分项（可以直接抄参考答案）：八向极星星芒（band = 5）与一条
//   流星线段（seed = -1）——着色器侧已写好，数据到位就点亮
function buildStarTrails(): Float32Array {
  throw new Error('TODO(day1-challenge-2) 未完成：见 README');
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
