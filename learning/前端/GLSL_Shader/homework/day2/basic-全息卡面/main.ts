// Day 2 · 作业 B —— 全息卡面
// 对应讲义 2.1：圆角方 SDF、fwidth 抗锯齿、描边通道、呼吸与流光参数化。
// 完成后：屏幕中央一张全息收藏卡——对角渐变卡面、恒宽描边、
// 一道衍射亮带沿对角线缓缓扫过，呼吸缩放。
// main.ts 是全脚手架：四个 TODO 全在 fragment。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: 'B',
  title: 'HOLO CARD',
  tags: ['HOMEWORK', 'GLSL', 'SDF'],
  hint: '圆角方卡面：渐变 + 描边 + 流光 + 呼吸',
});

// ---- 初始化：WebGL2 context + 着色器程序（脚手架，无需改动）----
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何：全屏四边形（脚手架，无需改动）------------------------
const vertices = new Float32Array([
  -1.0, -1.0,
   1.0, -1.0,
  -1.0,  1.0,
   1.0,  1.0,
]);

const vao = gl.createVertexArray()!;
gl.bindVertexArray(vao);
const vbo = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

// ---- uniform（脚手架，无需改动）--------------------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');

// ---- 帧循环（脚手架，无需改动）----------------------------------
chrome.startLoop(() => {
  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
