// Day 1 · 作业 C 答案 —— 极坐标曼陀罗
// 与骨架的差异只有页头文案（任务 5 的门面半边）——
// main.ts 其余逐字一致：C 档的考点全在 fragment。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'C',
  title: 'POLAR MANDALA',
  tags: ['HOMEWORK', 'GLSL', 'POLAR'],
  hint: '移动扰动对称轴，点击推开涟漪',
});

// ---- 页头（任务 5：文案换成参考版，DOM 与骨架一致）--------------
const head = document.createElement('header');
head.className = 'hero-head';
head.innerHTML = `
  <h1>曼陀罗 <span class="en">MANDALA</span></h1>
  <p>一呼一吸之间，光转了一整圈</p>
`;
document.body.prepend(head);

// 页头占掉的高度，从画布那里拿回来
const stage = document.querySelector('.stage') as HTMLElement | null;
if (stage) stage.style.height = 'calc(100vh - 8rem)';

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

// ---- uniform（与骨架逐字一致）----
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uMouse = gl.getUniformLocation(program, 'u_mouse');
const uClick = gl.getUniformLocation(program, 'u_click');
const uAge = gl.getUniformLocation(program, 'u_age');

// ---- 帧循环（与骨架逐字一致）----
chrome.startLoop((nowMs) => {
  const now = nowMs / 1000;
  const age = chrome.pointer.clickTime < 0 ? 10.0 : now - chrome.pointer.clickTime;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, now);
  gl.uniform2f(uMouse, chrome.pointer.sx, chrome.pointer.sy);
  gl.uniform2f(uClick, chrome.pointer.clickX, chrome.pointer.clickY);
  gl.uniform1f(uAge, age);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
