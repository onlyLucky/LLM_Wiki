// Day 1 · 作业 A 参考实现 —— 万花筒
// 全屏 quad 上由片元着色器折叠出八重镜像对称的曼陀罗。
// 与作业版骨架完全一致：TODO(day1-advanced-1) 处已补上 uniform 上传，
// WGSL 侧三个函数（toPolar → fold → mandala）的实现在 kaleido.wgsl。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './kaleido.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'A',
  title: 'KALEIDOSCOPE',
  tags: ['WEBGPU', 'WGSL'],
  hint: '八重镜像曼陀罗旋转呼吸 · 横移调色温 · 纵移开合花瓣',
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

// ---- 几何：全屏 quad（讲义 1.5 的 indexed quad）---------------
// 万花筒不需要几何体——筒里的花纹全部由片元着色器折叠出来，
// 顶点只要把画布铺满：4 个顶点、2 个三角形、6 个索引（demo 03 同款）。
const vertices = new Float32Array([
  -1, -1, // 左下
   1, -1, // 右下
   1,  1, // 右上
  -1,  1, // 左上
]);
const indices = new Uint16Array([0, 1, 2, 0, 2, 3]);

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

// ---- uniform：time + mouse + aspect（讲义 1.6）------------------
// 32 字节布局，这里藏着 1.6 讲的「填充槽」：
//   time   → 字节 0
//   （字节 4 是填充洞：mouse 是 vec2f，必须落在 8 字节对齐上）
//   mouse  → 字节 8 / 12
//   aspect → 字节 16
//   （尾部补到 32：struct 整体按 16 字节对齐）
const uniforms = new Float32Array(8);
const uniformBuffer = device.createBuffer({
  size: uniforms.byteLength,
  usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
});

// ---- 加分项的数据源：鼠标位置 → [-1, 1]² ------------------------
let mouse = [0, 0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse = [
    ((e.clientX - r.left) / r.width) * 2 - 1,
    -(((e.clientY - r.top) / r.height) * 2 - 1),
  ];
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
        arrayStride: 2 * 4, // 8 字节
        attributes: [
          { shaderLocation: 0, offset: 0, format: 'float32x2' }, // position（NDC）
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

// ---- 帧循环 ---------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  // 跳槽写入：[0] time、[2][3] mouse、[4] aspect——1 号槽是填充洞。
  // 连写 [0][1][2][3] 会把 mouse 的一半掉进洞里，WGSL 读到垃圾值。
  uniforms[0] = t;
  uniforms[2] = mouse[0];
  uniforms[3] = mouse[1];
  uniforms[4] = chrome.width / chrome.height;
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
  pass.setIndexBuffer(indexBuffer, 'uint16');
  pass.drawIndexed(indices.length); // 6 个索引 = 2 个三角形铺满画布
  pass.end();
  device.queue.submit([encoder.finish()]);
});
