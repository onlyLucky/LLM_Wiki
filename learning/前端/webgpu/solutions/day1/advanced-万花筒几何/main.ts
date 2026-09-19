// Day 1 · 作业 A —— 万花筒几何（参考答案）
// 对应讲义 1.5 / 1.6：interleaved 顶点 + drawIndexed + 2D model 矩阵。
// 六边形环（内外两圈各 6 个顶点）随时间旋转与呼吸缩放；加分项：鼠标亮度扰动。

import '../../../shared/demo.css';
import { createChrome, initGPU } from '../../../shared/chrome.ts';
import shader from './hex.wgsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'A',
  title: 'KALEIDOSCOPE',
  tags: ['WEBGPU', 'WGSL'],
  hint: '六边形环旋转呼吸 · 鼠标横移微调亮度',
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
// 内圈半径 0.25 电蓝、外圈 0.62 紫（径向渐变），顶点角度按 60° 步进；
// 每顶点 [x, y, r, g, b]，每条边一个四边形 → 2 个三角形，共 36 个索引。
function buildHexRing(): { vertices: Float32Array; indices: Uint16Array } {
  const BLUE = [0.298, 0.435, 1.0];   // #4C6FFF 电蓝（内圈）
  const VIOLET = [0.545, 0.361, 0.965]; // #8B5CF6 紫（外圈）
  const verts: number[] = [];
  const idx: number[] = [];
  for (let k = 0; k < 6; k++) {
    const a = (k / 6) * Math.PI * 2;
    // 下标编排：内圈 k → 2k，外圈 k → 2k + 1，同角度的内外两点相邻存放
    verts.push(Math.cos(a) * 0.25, Math.sin(a) * 0.25, ...BLUE);
    verts.push(Math.cos(a) * 0.62, Math.sin(a) * 0.62, ...VIOLET);
  }
  for (let k = 0; k < 6; k++) {
    const n = (k + 1) % 6; // n = k 的下一条边
    idx.push(2 * k, 2 * n, 2 * n + 1);     // 内 k → 内 n → 外 n
    idx.push(2 * k, 2 * n + 1, 2 * k + 1); // 内 k → 外 n → 外 k
  }
  return { vertices: new Float32Array(verts), indices: new Uint16Array(idx) };
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
// 64 字节：mat3x3f 占字节 0–48（对齐 16），aspect 落在字节 48（索引 12），
// mouse 落在字节 52（索引 13，加分项），尾部补到 64。
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

// ---- 矩阵与动画 -----------------------------------------------
// 列主序 mat3x3 的 9 个数：列 0 = (c, s, 0)、列 1 = (-s, c, 0)、列 2 = (0, 0, 1)
function rotation2D(angle: number): number[] {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  return [c, s, 0, -s, c, 0, 0, 0, 1];
}

// 缓慢脉动：±5%，与旋转共用同一时间轴
function breatheScale(t: number): number {
  return 1 + 0.05 * Math.sin(t * 1.2);
}

// ---- 加分项：鼠标横移 → 亮度扰动数据源 -------------------------
let mouseX = 0;
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouseX = ((e.clientX - r.left) / r.width) * 2 - 1;
});

// ---- 帧循环 ---------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  const spin = rotation2D(t * 0.6); // 每秒 0.6 rad 的持续旋转
  const pulse = breatheScale(t);    // 呼吸缩放

  uniforms[12] = chrome.width / chrome.height; // aspect → 字节 48
  uniforms[13] = mouseX;                      // mouse  → 字节 52（加分项）

  // mat3x3f 在 uniform 里按 16 字节列步进存放（实验实测）：
  // 9 个数必须跳着写进 0–2 / 4–6 / 8–10 号槽位，3、7、11 是空洞。
  // 直接 set 九个数到 0–8 会把列 1 的首元素掉进列 0 的洞里，整环变形。
  // 均匀缩放乘进前两列（i < 6），第三列保持 (0, 0, 1)。
  uniforms.set([
    spin[0] * pulse, spin[1] * pulse, spin[2], 0, // 列 0
    spin[3] * pulse, spin[4] * pulse, spin[5], 0, // 列 1
    spin[6], spin[7], spin[8], 0,                // 列 2
  ], 0);
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
  pass.drawIndexed(indices.length); // 36 个索引 = 12 个三角形
  pass.end();
  device.queue.submit([encoder.finish()]);
});
