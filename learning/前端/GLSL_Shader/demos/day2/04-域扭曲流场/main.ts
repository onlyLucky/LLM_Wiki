// Day 2 · Demo 04 —— 域扭曲流场
// 对应讲义 2.4 塔顶：fbm(p + fbm(p)·k)。
// JS 侧唯一的工作：按拖动速度维护 warp 强度（0.3 → 1.2），
// 轻拖丝绸、猛拖熔岩——k 三档表变成可玩的交互。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: '04',
  title: 'DOMAIN WARP',
  tags: ['GLSL', 'FBM', 'WARP'],
  hint: '拖动鼠标：搅动流场',
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
const uWarp = gl.getUniformLocation(program, 'u_warp');

// ---- warp 强度：帧差速度驱动，lerp 平滑（手感红线）--------------
// 基线 0.3（丝绸微澜），拖动越快越接近 1.2（熔岩），松手回落
let warp = 0.3;
let prevX = 0.5;
let prevY = 0.5;

chrome.startLoop(() => {
  // 平滑坐标的帧差 = 当前「搅动速度」（0–1 域）
  const vx = chrome.pointer.sx - prevX;
  const vy = chrome.pointer.sy - prevY;
  prevX = chrome.pointer.sx;
  prevY = chrome.pointer.sy;
  const speed = Math.hypot(vx, vy);

  // 目标 = 基线 + 速度贡献（×8 灵敏度，上限 0.9）；lerp 0.05 过渡
  const goal = Math.min(0.3 + speed * 8.0, 1.2);
  warp += (goal - warp) * 0.05;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);
  gl.uniform1f(uWarp, warp);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
