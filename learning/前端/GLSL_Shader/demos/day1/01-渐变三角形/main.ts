// Day 1 · Demo 01 —— 渐变三角形
// 对应讲义 1.1–1.5：这是全课程第一个可运行页面，也是所有 demo 的结构范本。
// 顶点数据走 attribute（interleaved 布局：位置 vec2 + 颜色 vec3），
// 颜色经 varying 插值交给片元——光栅化的免费服务。
// 1.6/1.7 的时间与鼠标 uniform 在这里已经就位，之后每个 demo 都是这张骨架的变体。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: '01',
  title: 'GRADIENT TRIANGLE',
  tags: ['WEBGL2', 'GLSL'],
  hint: '移动鼠标：渐变随之轻微扰动',
});

// ---- 初始化：WebGL2 context + 着色器程序 -----------------------
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

// 编译/链接错误会带行号直达页面错误面板（GLSL 课程的第一个教学设施）
const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何：三个顶点，interleaved（位置 vec2 + 颜色 vec3）-------
// stride = 20 字节（2+3 个 float）。讲义 1.4：VAO 管布局，VBO 管数据。
const vertices = new Float32Array([
  //  x      y      r      g      b
    0.00,  0.42,  1.000, 0.302, 0.427, // 顶部 · 玫红
   -0.38, -0.26,  0.298, 0.624, 0.941, // 左下 · 天青
    0.38, -0.26,  0.508, 0.464, 0.686, // 右下 · 双色各半
]);

const vao = gl.createVertexArray()!;
gl.bindVertexArray(vao);
const vbo = gl.createBuffer()!;
gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

// a_position：location=0（与 vertex.glsl 的 layout 声明对应）
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 20, 0);
// a_color：location=1，同一块 buffer 内偏移 8 字节
gl.enableVertexAttribArray(1);
gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 20, 8);

// ---- uniform：时间 / 鼠标 / 宽高比 ------------------------------
const uTime = gl.getUniformLocation(program, 'u_time');
const uMouse = gl.getUniformLocation(program, 'u_mouse');
const uAspect = gl.getUniformLocation(program, 'u_aspect');

// ---- 帧循环 ---------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000; // 秒，不是毫秒（讲义 1.6 的单位约定）

  // 每帧设置 viewport：画布尺寸可能随时被 ResizeObserver 改变
  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform1f(uTime, t);
  // 鼠标取平滑坐标（chrome.pointer.sx/sy 已 lerp、已 y 翻转——讲义 1.7 的事件桥）
  gl.uniform2f(uMouse, chrome.pointer.sx, chrome.pointer.sy);
  gl.uniform1f(uAspect, chrome.width / chrome.height);

  // 清屏色与 CSS 底色 #0B0E14 保持一致，画布与画框无缝衔接
  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLES, 0, 3); // 三个顶点，一个三角形
});
