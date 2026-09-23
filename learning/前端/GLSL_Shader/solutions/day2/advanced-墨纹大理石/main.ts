// Day 2 · 作业 A 答案 —— 墨纹大理石
// 与骨架的差异在任务 5 的 TS 半边（帧差写入 u_vel），其余逐字一致。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: 'A',
  title: 'INK MARBLING',
  tags: ['HOMEWORK', 'GLSL', 'FBM'],
  hint: '拖动鼠标：搅动水面，墨脉被拉扯',
});

const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

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

const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uVel = gl.getUniformLocation(program, 'u_vel');

let prevX = 0.5;
let prevY = 0.5;

chrome.startLoop(() => {
  // 任务 5 的 TS 半边：先取差值，再更新 prev（顺序反了差值恒为零）
  const vx = chrome.pointer.sx - prevX;
  const vy = chrome.pointer.sy - prevY;
  prevX = chrome.pointer.sx;
  prevY = chrome.pointer.sy;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);
  gl.uniform2f(uVel, vx, vy);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
