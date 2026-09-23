// Day 2 · Demo 01 —— 形态标本馆
// 对应讲义 2.1：六份形状标本陈列（圆/方/圆角方/线段/硬并/平滑并），
// 滚轮推动射灯，底部角标显示当前标本的公式。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: '01',
  title: 'SPECIMEN HALL',
  tags: ['GLSL', 'SDF', 'SHAPE'],
  hint: '滚动滚轮：推动射灯 · 移动鼠标：悬停预览',
});

// ---- 初始化：WebGL2 context + 着色器程序 -----------------------
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何：全屏四边形（讲义 1.5）--------------------------------
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

// ---- uniform ---------------------------------------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uPick = gl.getUniformLocation(program, 'u_pick');
const uMouse = gl.getUniformLocation(program, 'u_mouse');

// ---- 底部角标复用为「公式牌」：切换射灯时显示当前标本的公式 ----
const FORMULAS = [
  'sdCircle(p, r) = length(p) - r',
  'sdBox(p, b) = length(max(abs(p)-b, 0)) + min(max(d.x,d.y), 0)',
  'sdBox(p, b - r) - r · 圆角',
  'sdSegment(p, a, b) · 线段',
  'min(a, b) · 硬并',
  'smin(a, b, k=0.08) · 平滑并',
];
const hintEl = document.querySelector('.tag--bl');

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();
let lastPick = -1;
chrome.startLoop((now) => {
  // 滚轮累积量 → 格号：每 120 单位（约一格）切换一次，负向也循环
  const pick = ((Math.floor(chrome.pointer.wheel / 120) % 6) + 6) % 6;
  if (pick !== lastPick && hintEl) {
    hintEl.textContent = FORMULAS[pick];
    lastPick = pick;
  }

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  // 毫秒转秒（契约）；% 3600 防 float 尾数耗尽
  gl.uniform1f(uTime, ((now - start) / 1000) % 3600);
  gl.uniform1f(uPick, pick);
  gl.uniform2f(uMouse, chrome.pointer.nx, chrome.pointer.ny);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
