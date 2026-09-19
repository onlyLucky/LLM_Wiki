// Day 1 · 作业 A —— 万花筒几何
// 对应讲义 1.5 / 1.6：interleaved 顶点 + drawIndexed + 2D model 矩阵。
// 六边形环（内外两圈各 6 个顶点）随时间旋转与呼吸缩放。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './hex.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'A',
  title: 'KALEIDOSCOPE',
  tags: ['WEBGPU', 'WGSL'],
  hint: '完成 TODO 后：六边形环持续旋转并呼吸缩放',
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

// ---- 几何：六边形环 -------------------------------------------
// 布局建议：内圈半径 0.25、外圈 0.62，顶点角度按 60° 步进；
// 每顶点 [x, y, r, g, b]，内圈电蓝 #4C6FFF、外圈紫 #8B5CF6（径向渐变）；
// 索引：每条边一个四边形 → 2 个三角形，共 12 个三角形、36 个索引。

// TODO(day1-advanced-1): 生成六边形环的顶点与索引
//   返回：vertices 共 12 个顶点（interleaved），indices 共 36 个下标
function buildHexRing(): { vertices: Float32Array; indices: Uint16Array } {
  throw new Error('TODO(day1-advanced-1) 未完成：见 README');
}
const { vertices, indices } = buildHexRing();

const vertexBuffer = device.createBuffer({
  size: vertices.byteLength,
  usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(vertexBuffer, 0, vertices);

const indexBuffer = device.createBuffer({
  size: indices.byteLength,
  usage: GPUBufferUsage.INDEX | GPUBufferUsage.COPY_DST,
});
device.queue.writeBuffer(indexBuffer, 0, indices);

// ---- uniform：model 矩阵 + aspect（讲义 1.6）-------------------
// 64 字节：mat3x3f 占字节 0–48（对齐 16），aspect 落在字节 48，
// 尾部补到 64。前 9 个索引给矩阵（列主序），索引 12 是 aspect。
const uniforms = new Float32Array(16);
const uniformBuffer = device.createBuffer({
  size: uniforms.byteLength,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

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
  primitive: { topology: 'triangle-list' }, // 索引不改 topology
});

const bindGroup = device.createBindGroup({
  layout: pipeline.getBindGroupLayout(0),
  entries: [{ binding: 0, resource: { buffer: uniformBuffer } }],
});

// ---- 矩阵与动画的 TODO ----------------------------------------
// TODO(day1-advanced-2): 手写 2D 旋转矩阵
//   返回列主序 mat3x3 的 9 个数：c = cos(angle)、s = sin(angle) 时
//   列 0 = (c, s, 0)、列 1 = (-s, c, 0)、列 2 = (0, 0, 1)
function rotation2D(angle: number): number[] {
  throw new Error('TODO(day1-advanced-2) 未完成：见 README');
}

// TODO(day1-advanced-4): 呼吸缩放系数
//   1 + 0.05 * sin(t * 1.2) 一类的缓慢脉动
function breatheScale(t: number): number {
  throw new Error('TODO(day1-advanced-4) 未完成：见 README');
}

// ---- 帧循环 ---------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  const spin = rotation2D(t * 0.6); // 任务 2 的产物在这里被使用
  const pulse = breatheScale(t);    // 任务 4 的产物在这里被使用

  uniforms[12] = chrome.width / chrome.height; // aspect → 字节 48（脚手架已在用）

  // TODO(day1-advanced-3): 把 model 矩阵写进 uniform 并上传
  //   uniforms.set(旋转 × 缩放后的 9 个数, 0)——缩放乘进前两列、第三列保持 (0,0,1)
  //   device.queue.writeBuffer(uniformBuffer, 0, uniforms);
  //   （WGSL 侧的应用在 hex.wgsl 的同名 TODO 里）
  throw new Error('TODO(day1-advanced-3) 未完成：见 README');

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
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(indices.length); // 36 个索引 = 12 个三角形
  pass.end();
  device.queue.submit([encoder.finish()]);
});
