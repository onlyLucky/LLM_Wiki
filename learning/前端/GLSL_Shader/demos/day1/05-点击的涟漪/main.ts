// Day 1 · Demo 05 —— 点击的涟漪
// 对应讲义 1.7：chrome.pointer 的 click 三兄弟——clickTime / clickX / clickY。
// 事件只负责「记账」（何时、何地），涟漪的整段生命史都在 shader 里
// 由 u_age（点击年龄）推演。双涟漪需要 uniform 数组，Day 2 展开。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: '05',
  title: 'CLICK RIPPLE',
  tags: ['WEBGL2', 'GLSL', 'INTERACTION'],
  hint: '点击画布：涟漪从落点扩散，交替双色',
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
const uClick = gl.getUniformLocation(program, 'u_click');
const uAge = gl.getUniformLocation(program, 'u_age');
const uHue = gl.getUniformLocation(program, 'u_hue');

// ---- 双色交替：自己再挂一个 click 监听数奇偶 ---------------------
// chrome 内部也监听 click（记账用），两者并存互不干扰；
// 先翻再画：首击 hue 变 0 = 玫红
let hue = 1.0;
chrome.canvas.addEventListener('click', () => { hue = 1.0 - hue; });

// ---- 帧循环：唯一的新量是「点击年龄」----------------------------
chrome.startLoop((nowMs) => {
  const now = nowMs / 1000; // clickTime 与之同基准（秒）
  // clickTime 初始 -1（从未点击）：喂一个大年龄，exp 衰减让画面自然安静，
  // shader 里不需要任何 if
  const age = chrome.pointer.clickTime < 0 ? 10.0 : now - chrome.pointer.clickTime;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform2f(uClick, chrome.pointer.clickX, chrome.pointer.clickY);
  gl.uniform1f(uAge, age);
  gl.uniform1f(uHue, hue);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
