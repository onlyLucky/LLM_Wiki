// Day 1 · Demo 02 —— 全屏四边形与 UV
// 对应讲义 1.5：TRIANGLE_STRIP 四顶点铺满屏幕，fragment 里用
// gl_FragCoord / u_resolution 拿到每个像素的身份证——UV。
// 这块「UV 仪表盘」是你之后调试一切 shader 的第一件工具。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: '02',
  title: 'FULLSCREEN QUAD',
  tags: ['WEBGL2', 'GLSL', 'UV'],
  hint: '移动鼠标：参考点跟随，读出 UV 坐标',
});

// ---- 初始化：WebGL2 context + 着色器程序 -----------------------
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何：TRIANGLE_STRIP 四顶点，直通 clip space（讲义 1.5）----
// 顺序：左下 → 右下 → 左上 → 右上。条带自动连成两个三角形，
// 比 TRIANGLES 的 6 顶点省 1/3 数据，且顺序不会错。
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

// 只有位置一个属性：stride 8 字节（2 个 float），没有 interleaved
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

// ---- uniform：分辨率 / 鼠标 ------------------------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uMouse = gl.getUniformLocation(program, 'u_mouse');

// ---- 帧循环：静态仪表盘，只随鼠标更新 ---------------------------
chrome.startLoop(() => {
  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  // 物理像素尺寸：gl_FragCoord 也是物理像素，两边同域才能除出 0-1
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform2f(uMouse, chrome.pointer.sx, chrome.pointer.sy);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
