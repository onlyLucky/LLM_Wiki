// Day 1 · 作业 A 答案 —— 追光的萤火
// 与骨架的差异在任务 1（u_mouse / u_down 接线）与任务 5 的 TS 半边
// （u_vel 帧差），其余逐字一致。GLSL 侧 2–5 段全亮。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'A',
  title: 'FIREFLY CHASE',
  tags: ['HOMEWORK', 'GLSL', 'INTERACTION'],
  hint: '移动、按下、拖动：萤火追随，按压收缩，拖向拉伸',
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
const uMouse = gl.getUniformLocation(program, 'u_mouse');
const uDown = gl.getUniformLocation(program, 'u_down');
const uVel = gl.getUniformLocation(program, 'u_vel');

// ---- 状态（与骨架逐字一致）--------------------------------------
let press = 0.0;
let prevX = 0.5;
let prevY = 0.5;

let lastMs = 0;
chrome.startLoop((nowMs) => {
  const dt = Math.min((nowMs - lastMs) / 1000, 0.05);
  lastMs = nowMs;

  press += (chrome.pointer.isDown ? 1.0 : -1.0) * (dt / 0.6);
  press = Math.min(1.0, Math.max(0.0, press));

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);

  // 任务 1：交互双输入打包（事件桥的终点）
  gl.uniform2f(uMouse, chrome.pointer.sx, chrome.pointer.sy);
  gl.uniform1f(uDown, press);

  // 任务 5：帧差速度（0–1 域）——写完更新 prev
  const vx = chrome.pointer.sx - prevX;
  const vy = chrome.pointer.sy - prevY;
  gl.uniform2f(uVel, vx, vy);
  prevX = chrome.pointer.sx;
  prevY = chrome.pointer.sy;

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
