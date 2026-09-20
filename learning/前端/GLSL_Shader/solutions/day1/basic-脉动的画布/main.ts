// Day 1 · 作业 B 答案 —— 脉动的画布
// 与骨架的差异只在任务 1 的三处接线（查询 + 写入 + 删 throw），
// 其余逐字一致。GLSL 侧四段全亮。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'B',
  title: 'BREATHING CANVAS',
  tags: ['HOMEWORK', 'GLSL', 'ANIMATION'],
  hint: '两色渐变随时间缓慢呼吸',
});

// ---- 初始化（与骨架逐字一致）----
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何（与骨架逐字一致）----
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

// ---- uniform（任务 1：三个 location 的查询）--------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uColorA = gl.getUniformLocation(program, 'u_colorA');
const uColorB = gl.getUniformLocation(program, 'u_colorB');

// 两色：玫红 → 天青（课程签名渐变）——呼吸观感的大头是这对颜色
const COLOR_A = [1.000, 0.302, 0.427]; // #FF4D6D
const COLOR_B = [0.298, 0.624, 0.941]; // #4CC9F0

// ---- 帧循环（任务 1：写入 + 删 throw）---------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000; // 秒，不是毫秒（讲义 1.6 的单位约定）

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, t);
  gl.uniform3f(uColorA, COLOR_A[0], COLOR_A[1], COLOR_A[2]);
  gl.uniform3f(uColorB, COLOR_B[0], COLOR_B[1], COLOR_B[2]);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
