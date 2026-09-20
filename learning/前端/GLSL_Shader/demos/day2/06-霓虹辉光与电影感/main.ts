// Day 2 · Demo 06 —— 霓虹辉光与电影感
// 对应讲义 2.6（光感）+ 2.8（配方卡）：SDF 圆环 + 法线 + 双层 glow
// + 五步收尾。键盘 1–5 逐个开关，A/B 对比每一步值多少分。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: '06',
  title: 'NEON & CINEMA',
  tags: ['GLSL', 'GLOW', 'FINISH'],
  hint: '按 1–5 切换收尾开关',
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
const uTime = gl.getUniformLocation(program, 'u_time');
const uFxGamma = gl.getUniformLocation(program, 'u_fx_gamma');
const uFxContrast = gl.getUniformLocation(program, 'u_fx_contrast');
const uFxSat = gl.getUniformLocation(program, 'u_fx_sat');
const uFxGrain = gl.getUniformLocation(program, 'u_fx_grain');
const uFxVig = gl.getUniformLocation(program, 'u_fx_vig');

// ---- 开关状态：默认全开（成片态），逐个关掉看「毛坯」------------
const fx = { gamma: 1, contrast: 1, sat: 1, grain: 1, vig: 1 };
const KEYS: Array<[string, keyof typeof fx, string]> = [
  ['1', 'gamma', 'gamma'],
  ['2', 'contrast', '对比'],
  ['3', 'sat', '饱和'],
  ['4', 'grain', 'grain'],
  ['5', 'vig', '暗角'],
];

const hintEl = document.querySelector('.tag--bl');
function renderHint() {
  if (!hintEl) return;
  const on = KEYS.map(([digit, slot, name]) => `${digit}:${name}${fx[slot] ? '●' : '○'}`).join('  ');
  hintEl.textContent = on;
}
renderHint();

window.addEventListener('keydown', (e) => {
  const hit = KEYS.find(([key]) => key === e.key);
  if (!hit) return;
  fx[hit[1]] = fx[hit[1]] ? 0 : 1;
  renderHint();
});

// ---- 帧循环 ------------------------------------------------------
chrome.startLoop(() => {
  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);
  gl.uniform1f(uFxGamma, fx.gamma);
  gl.uniform1f(uFxContrast, fx.contrast);
  gl.uniform1f(uFxSat, fx.sat);
  gl.uniform1f(uFxGrain, fx.grain);
  gl.uniform1f(uFxVig, fx.vig);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
