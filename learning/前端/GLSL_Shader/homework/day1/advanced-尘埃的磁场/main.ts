// Day 1 · 作业 A —— 追光的萤火
// 对应讲义 1.7：事件桥全链路。chrome.pointer 每帧采样 → uniform 打包 →
// shader 消费：居中等比坐标域、距离场 glow、easeOutBack 回弹、速度拉伸。
// 完成后：一枚萤火丝滑追随鼠标，按压收缩回弹，拖动方向拉伸——
// 视差 hero 的交互核心件。

import '../../../shared/demo.css';
import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const chrome = createChrome({
  day: 1,
  index: 'A',
  title: 'FIREFLY CHASE',
  tags: ['HOMEWORK', 'GLSL', 'INTERACTION'],
  hint: '移动、按下、拖动：萤火追随，按压收缩，拖向拉伸',
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

// ---- uniform：分辨率给足，交互的三个你自己接 --------------------
const uResolution = gl.getUniformLocation(program, 'u_resolution');
// TODO(day1-adv-1)：查询 u_mouse / u_down / u_vel 三个 location
// u_mouse（vec2，uniform2f）/ u_down（float，uniform1f）/ u_vel（vec2，uniform2f）

// ---- 状态：按压进度与上一帧位置（任务 1 / 5 的原料）--------------
// 按压进度 0..1：isDown 时 0.6s 推进到 1，松手 0.6s 退回 0。进度是线性的，
// 回弹曲线在 GLSL 里（讲义 1.7：动画在 JS 侧算好，shader 只消费——
// 这里「算好」的只是时间轴，曲线留给任务 4 练手）
let press = 0.0;
let prevX = 0.5; // 上一帧的平滑位置：任务 5 的速度基准
let prevY = 0.5;

let lastMs = 0;
chrome.startLoop((nowMs) => {
  // dt：两帧间隔（秒），上限 50ms 防标签页休眠后的大步跳变
  const dt = Math.min((nowMs - lastMs) / 1000, 0.05);
  lastMs = nowMs;

  // 按压推进（脚手架，无需改动）——方向由 isDown 决定
  press += (chrome.pointer.isDown ? 1.0 : -1.0) * (dt / 0.6);
  press = Math.min(1.0, Math.max(0.0, press));

  gl.viewport(0, 0, chrome.width, chrome.height);

  gl.useProgram(program);
  gl.uniform2f(uResolution, chrome.width, chrome.height);

  // TODO(day1-adv-1)：在此写入 u_mouse ← chrome.pointer.sx / sy（平滑坐标，0–1 左下原点）
  //                   与 u_down ← press
  // TODO(day1-adv-5)：在此写入 u_vel ← (sx - prevX, sy - prevY)，写完后更新 prevX / prevY
  // 都插在 drawArrays 之前——绘制前的最后一件事，就是喂饱 uniform

  gl.clearColor(0.043, 0.055, 0.078, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

  // 任务 1 完成后删掉下面这行——错误面板消失，就是完成信号
  throw new Error('TODO(day1-adv-1) 未完成：见 README 任务 1');
});
