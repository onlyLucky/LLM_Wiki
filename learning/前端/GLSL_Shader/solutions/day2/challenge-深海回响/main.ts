// Day 2 · 作业 C 答案 —— 深海回响
// 与骨架的差异只有页头文案（任务 6 的门面半边）——
// main.ts 其余逐字一致：视差素材 u_mouse 骨架已喂。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: 'C',
  title: 'ECHO DEPTHS',
  tags: ['HOMEWORK', 'GLSL', 'GLOW'],
  hint: '移动鼠标：潜望视角，前后景 5% / 2% 视差',
});

// ---- 页头（任务 6：参考版文案）----------------------------------
const head = document.createElement('header');
head.className = 'hero-head';
head.innerHTML = `
  <h1>深海回响 <span class="en">ECHO DEPTHS</span></h1>
  <p>ping 的一声荡开，整片深海侧耳倾听</p>
`;
document.body.prepend(head);

const stage = document.querySelector('.stage') as HTMLElement | null;
if (stage) stage.style.height = 'calc(100vh - 8rem)';

// ---- 初始化（与骨架逐字一致）------------------------------------
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
const uMouse = gl.getUniformLocation(program, 'u_mouse');

chrome.startLoop(() => {
  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);
  gl.uniform2f(uMouse, chrome.pointer.sx, chrome.pointer.sy);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
