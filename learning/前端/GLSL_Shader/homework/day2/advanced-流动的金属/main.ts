// Day 2 · 作业 A —— 流动的丝绸
// 对应讲义 2.4、2.5：噪声塔三层 + 调色板。
// 完成后：全屏丝绸质感流动背景（iq 色卡），拖动改变流向。
// 四个 fragment TODO + 一个 TS TODO（u_vel 流速向量）。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 2,
  index: 'A',
  title: 'SILK FLOW',
  tags: ['HOMEWORK', 'GLSL', 'FBM'],
  hint: '拖动鼠标：改变丝绸流向',
});

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

// ---- uniform（脚手架，无需改动）--------------------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
const uTime = gl.getUniformLocation(program, 'u_time');
const uVel = gl.getUniformLocation(program, 'u_vel');

// ---- 帧差速度：任务 5 的 TS 半边 --------------------------------
let prevX = 0.5;
let prevY = 0.5;

chrome.startLoop(() => {
  // TODO(day2-adv-5)：帧差写入 u_vel——(sx - prevX, sy - prevY)
  // 顺序纪律：先取差值，再更新 prev（顺序反了差值恒为零）
  // 提示：gl.uniform2f(uVel, vx, vy)
  gl.uniform2f(uVel, 0.0, 0.0); // 占位：无拖动——任务 5 完成后删掉这行

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);
  gl.uniform1f(uTime, performance.now() / 1000);

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
});
