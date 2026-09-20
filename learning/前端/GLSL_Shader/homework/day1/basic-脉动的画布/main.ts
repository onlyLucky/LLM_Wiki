// Day 1 · 作业 B —— 脉动的画布
// 对应讲义 1.5、1.6：uniform 三件套（时间与颜色从 JS 广播进 shader）、
// 居中等比坐标域、mix 插值与 sin 呼吸。
// 完成后你会得到一面「会呼吸的 hero 背景」——挂在任何落地页顶部都能用。

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

// ---- 初始化：WebGL2 context + 着色器程序（脚手架，无需改动）----
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何：全屏四边形（脚手架，无需改动）------------------------
// TRIANGLE_STRIP 四顶点：左下 → 右下 → 左上 → 右上（讲义 1.5）
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

// 只有位置一个属性：stride 8 字节（2 个 float）
gl.enableVertexAttribArray(0);
gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 8, 0);

// ---- uniform：分辨率给足，三个学习点你自己接 --------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
// TODO(day1-basic-1)：查询 u_time / u_colorA / u_colorB 三个 location
// 提示：u_time 是 float → uniform1f；u_colorA / u_colorB 是 vec3 → uniform3f

// ---- 两色：主题色板任选，呼吸的观感 80% 取决于这对颜色 ----------
// 玫红 [1.000, 0.302, 0.427] / 天青 [0.298, 0.624, 0.941] / 琥珀 [1.000, 0.757, 0.271]
// （0–1 域；选好后在帧循环里用 uniform3f 写进 shader）

// ---- 帧循环 ------------------------------------------------------
const start = performance.now();
chrome.startLoop((now) => {
  const t = (now - start) / 1000; // 秒，不是毫秒（讲义 1.6 的单位约定）

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);

  // TODO(day1-basic-1)：在此写入 u_time（用 t）/ u_colorA / u_colorB
  // 插在 drawArrays 之前——绘制前的最后一件事，就是喂饱 uniform

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // 任务 1 完成后删掉下面这行——错误面板消失，就是完成信号
  throw new Error('TODO(day1-basic-1) 未完成：见 README 任务 1');
});
