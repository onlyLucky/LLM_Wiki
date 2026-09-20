// Day 1 · Demo 06 —— 滚轮的浪潮
// 对应讲义 1.7：wheel 事件桥 + 弹簧惯性模型。
// lerp 是过阻尼——永远追不回头；回弹感需要速度项：
// v += (目标 - 位置) × k，再 v ×= 阻尼——欠阻尼参数自然弹出
// easeOutElastic 手感。步进顺序不能反，反了能量凭空多出来。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: '06',
  title: 'WHEEL WAVE',
  tags: ['WEBGL2', 'GLSL', 'INTERACTION'],
  hint: '滚动滚轮：条纹波浪推进，反向滚动回退',
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
const uScroll = gl.getUniformLocation(program, 'u_scroll');
const uSpeed = gl.getUniformLocation(program, 'u_speed');
const uTime = gl.getUniformLocation(program, 'u_time');

// ---- 弹簧：滚轮的惯性模型 ---------------------------------------
// chrome.pointer.wheel 是未加工的像素累积量（向下为正）：
// 归一化系数 0.04 → 滚一格（约 100px）推进 4 条纹；
// k = 0.015（刚度）、阻尼 0.90：欠阻尼——停下前回弹两三次。
let scrollPos = 0.0;
let scrollVel = 0.0;
let speedSmooth = 0.0;

const start = performance.now();
chrome.startLoop((nowMs) => {
  const t = (nowMs - start) / 1000;

  // 弹簧步进：先加速度、再耗散、再位移——顺序不能反
  const target = chrome.pointer.wheel * 0.04;
  scrollVel += (target - scrollPos) * 0.015;
  scrollVel *= 0.90;
  scrollPos += scrollVel;

  // 速度滑动平均：瞬时 |v| 毛刺太重，0.1 系数抹成「势」
  speedSmooth += (Math.abs(scrollVel) - speedSmooth) * 0.1;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uScroll, scrollPos);
  gl.uniform1f(uSpeed, speedSmooth);
  gl.uniform1f(uTime, t);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
