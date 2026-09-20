// Day 1 · Demo 04 —— 光标的追随
// 对应讲义 1.7：事件桥的完整消费示范。
// 三重惯性：光晕主体 lerp 0.08（chrome.pointer.sx/sy 现成的）、
// 拖尾 lerp 0.03（更慢所以「跟不太上」）、按压强度 lerp 0.12——
// 任何状态都可以有惯性，不止位置。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: '04',
  title: 'CURSOR FOLLOW',
  tags: ['WEBGL2', 'GLSL', 'INTERACTION'],
  hint: '移动鼠标与拖动：光晕丝滑跟随，按压时收缩',
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
const uMouse = gl.getUniformLocation(program, 'u_mouse');
const uTail = gl.getUniformLocation(program, 'u_tail');
const uPress = gl.getUniformLocation(program, 'u_press');

// ---- 拖尾与按压的惯性：在 JS 侧维护，每帧向目标值滑动 -----------
// 光晕主体的 lerp 0.08 由 chrome.pointer.sx/sy 提供；
// 拖尾用更小的系数 0.03——「跟不太上」才看得见层次。
let tailX = 0.5;
let tailY = 0.5;
let press = 0.0;

chrome.startLoop(() => {
  // 拖尾：向平滑坐标再滑一步，系数越小惯性越大
  tailX += (chrome.pointer.sx - tailX) * 0.03;
  tailY += (chrome.pointer.sy - tailY) * 0.03;
  // 按压：目标是瞬时的 0/1，但过渡必须是渐变的——半径不能跳变
  press += ((chrome.pointer.isDown ? 1.0 : 0.0) - press) * 0.12;

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform2f(uMouse, chrome.pointer.sx, chrome.pointer.sy);
  gl.uniform2f(uTail, tailX, tailY);
  gl.uniform1f(uPress, press);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
