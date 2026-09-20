// Day 2 · Demo 05 —— 调色板实验室
// 对应讲义 2.5：余弦调色板 a/b/c/d 四参数实时调 + 九宫格 t 分布对比。
// 交互：点击画布切换参数槽位（a→b→c→d 循环），滚轮调当前槽位。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: '05',
  title: 'PALETTE LAB',
  tags: ['GLSL', 'COLOR'],
  hint: '点击切换 a/b/c/d，滚轮调值',
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

// ---- uniform：四参数全 uniform 化 -------------------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uA = gl.getUniformLocation(program, 'u_a');
const uB = gl.getUniformLocation(program, 'u_b');
const uC = gl.getUniformLocation(program, 'u_c');
const uD = gl.getUniformLocation(program, 'u_d');

// ---- 参数状态：iq 蓝橙卡起步（讲义 2.5 的三张卡之一）------------
const A = [0.5, 0.5, 0.5];
const B = [0.5, 0.5, 0.5];
const C = [1.0, 1.0, 1.0];
const D = [0.0, 0.33, 0.67];

let slot = 0; // 0=a 1=b 2=c 3=d
const SLOT_DESCS = [
  'a · 基线（整条亮暗）',
  'b · 振幅（对比强弱）',
  'c · 频率（循环次数）',
  'd · 相位（从哪开始）',
];

// 点击：切换槽位（chrome 的 click 与自己的监听并存，demo 05 同款）
chrome.canvas.addEventListener('click', () => { slot = (slot + 1) % 4; });

// 滚轮：调当前槽位（记录上次 wheel 值算 delta）
let lastWheel = 0;

// ---- 角标显示：右上角标复用为参数面板 ----------------------------
const panel = document.querySelector('.tag--tr') as HTMLElement | null;
const hintEl = document.querySelector('.tag--bl');
const fmt = (arr: number[]) => arr.map((v) => v.toFixed(2)).join(', ');
function renderPanel() {
  if (panel) {
    panel.innerHTML =
      `a [${fmt(A)}]<br>b [${fmt(B)}]<br>c [${fmt(C)}]<br>d [${fmt(D)}]`;
  }
  if (hintEl) hintEl.textContent = `点击切换 · 当前调 ${SLOT_DESCS[slot]}`;
}
renderPanel();

// ---- 帧循环 ------------------------------------------------------
chrome.startLoop(() => {
  // 滚轮差值：每 40 单位一步（调参的「手感齿轮比」）
  const wheel = chrome.pointer.wheel;
  const steps = Math.round((wheel - lastWheel) / 40);
  if (steps !== 0) {
    lastWheel = wheel;
    const dir = Math.sign(steps);
    if (slot === 0) for (let i = 0; i < 3; i++) A[i] = clamp(A[i] + dir * 0.02, 0.05, 0.95);
    if (slot === 1) for (let i = 0; i < 3; i++) B[i] = clamp(B[i] + dir * 0.02, 0.05, 0.95);
    if (slot === 2) for (let i = 0; i < 3; i++) C[i] = clamp(C[i] * (dir > 0 ? 1.06 : 1 / 1.06), 0.5, 4.0);
    if (slot === 3) for (let i = 0; i < 3; i++) D[i] = fract01(D[i] + dir * 0.02);
    renderPanel();
  }

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);
  gl.uniform3f(uA, A[0], A[1], A[2]);
  gl.uniform3f(uB, B[0], B[1], B[2]);
  gl.uniform3f(uC, C[0], C[1], C[2]);
  gl.uniform3f(uD, D[0], D[1], D[2]);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});

function clamp(v: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, v));
}
function fract01(v: number) {
  return v - Math.floor(v);
}
