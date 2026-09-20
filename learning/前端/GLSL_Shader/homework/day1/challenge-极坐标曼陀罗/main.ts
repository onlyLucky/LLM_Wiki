// Day 1 · 作业 C —— 极坐标曼陀罗
// 对应讲义 1.5–1.7 全部：极坐标换算、N 重对称折叠、花瓣 SDF、
// 呼吸与鼠标扰动、点击波包推开花瓣。
// 五个 TODO 全在 fragment——main.ts 是全脚手架（页头文案除外，那是你的）。
// 完成后：十二重对称的光，在呼吸、旋转、回应你的手。

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

// ---- 页头（challenge 档配额：设计质量第 2 条）--------------------
// DOM 与布局是脚手架；两行文案是你的——诗意中文标题 + 一句副标题，
// 这是「一个页面讲完一个作品」的门面。
// TODO(day1-ch-5)：把标题与副标题换成你的（或保留这一版也行）
const head = document.createElement('header');
head.className = 'hero-head';
head.innerHTML = `
  <h1>曼陀罗 <span class="en">MANDALA</span></h1>
  <p>十二重对称的光，在呼吸、旋转、回应你的手</p>
`;
document.body.prepend(head);

// 页头占掉的高度，从画布那里拿回来
const stage = document.querySelector('.stage') as HTMLElement | null;
if (stage) stage.style.height = 'calc(100vh - 8rem)';

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

// ---- uniform：全部给足——C 档考点在 fragment，接线不是重点 ----
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uMouse = gl.getUniformLocation(program, 'u_mouse');
const uClick = gl.getUniformLocation(program, 'u_click');
const uAge = gl.getUniformLocation(program, 'u_age');

// ---- 帧循环（脚手架，无需改动）----------------------------------
// 点击的「记账」在 chrome（clickTime / clickX / clickY），
// 涟漪的生命史在 shader 里由 u_age 推演（demo 05 同款约定）。
chrome.startLoop((nowMs) => {
  const now = nowMs / 1000; // 秒，与 clickTime 同基准
  // clickTime 初始 -1（从未点击）：喂一个大年龄，exp 衰减让画面自然安静
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
