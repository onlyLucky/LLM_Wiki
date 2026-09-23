// Day 1 · Demo 03 —— 时间仪器馆
// 对应讲义 1.6：u_time 是唯一的输入，四台仪器各自演示一条动画曲线。
// 相位 = fract(u_time / 周期)：除法把秒换成圈数，fract 去整存零，
// 一切循环动画都回到 [0,1] 这个一维跑道上。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: '03',
  title: 'TIME INSTRUMENTS',
  tags: ['WEBGL2', 'GLSL', 'ANIMATION'],
  hint: '四台仪器共用同一相位：呼吸灯 · 示波器 · 弹簧摆 · 进度弧',
});

// ---- 初始化：WebGL2 context + 着色器程序 -----------------------
const gl = initGL(chrome);
if (!gl) throw new Error('WebGL2 初始化失败，详情见页面错误面板');

const program = createProgram(gl, vsSource, fsSource, chrome);
if (!program) throw new Error('着色器编译失败，详情见页面错误面板');

// ---- 几何：与 Demo 02 相同的全屏四边形（讲义 1.5）--------------
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

// ---- uniform：分辨率 / 时间（没有鼠标——这是一个纯时间驱动的 demo）
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');

// ---- 帧循环：每帧只喂秒数，全部动画逻辑都在 shader 里 -----------
const start = performance.now();
chrome.startLoop((now) => {
  // 毫秒转秒（契约）；% 3600 防 float 尾数耗尽，且 3600 是 3/4.5/6 的公倍数，回卷无跳变
  const t = ((now - start) / 1000) % 3600;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, t);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
