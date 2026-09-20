#version 300 es
// Day 1 · 作业 C 答案 —— 片元着色器：极坐标曼陀罗
// 关键取舍：旋转与扰动都加在折叠【前】——折叠前加是转轴（对称保持），
// 折叠后加等于给每个扇区不同偏移，12 重对称当场撕碎。
// 涟漪推的是花瓣半径不是亮度——「推开花瓣」比「闪一下」更接近水的记忆。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec2 u_click;
uniform float u_age;

out vec4 fragColor;

const float TAU = 6.2831853;
const vec3 BG   = vec3(0.043, 0.055, 0.078);   // #0B0E14
const vec3 AMBER = vec3(1.000, 0.757, 0.271); // #FFC145 challenge 签名色
const vec3 CYAN = vec3(0.298, 0.624, 0.941);   // #4CC9F0

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 居中等比（骨架脚手架）
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 任务 1：极坐标
  float r = length(p);
  float angle = atan(p.y, p.x);

  // 任务 4 的扰动 + 任务 3 的旋转：都在折叠前（本题最重要的一处取舍）
  angle += u_mouse.x * 0.3; // 对称轴随鼠标横移倾斜，约 ±17°
  angle -= u_time * 0.1;    // 0.1 rad/s，约 62.8s 一圈

  // 任务 2：12 重对称——折进扇区后对中线镜像
  float sector = TAU / 12.0;
  angle = mod(angle, sector);
  angle = abs(angle - sector * 0.5);

  // 任务 4 的呼吸：乘在花瓣半径上（4s、±6%）
  float breathe = 1.0 + 0.06 * sin(u_time * TAU / 4.0);

  // 任务 5：涟漪波包——以点击点为圆心、0.45/秒 径向扩散的高斯环
  vec2 c = u_click * 2.0 - 1.0;
  c.x *= aspect; // 与 p 同域
  float rippleR = u_age * 0.45;
  float wave = exp(-pow((distance(p, c) - rippleR) * 7.0, 2.0)) * exp(-u_age * 1.2);

  // 任务 3：花瓣 SDF，两层同心（内密外疏）
  float rInner = 0.30 * breathe * (0.70 + 0.30 * sin(angle * 9.0));
  float rOuter = 0.62 * breathe * (0.78 + 0.22 * sin(angle * 5.0));
  // 波前经过处花瓣向外鼓——「推开花瓣」
  rInner += wave * 0.05;
  rOuter += wave * 0.08;

  float dInner = abs(r - rInner);
  float dOuter = abs(r - rOuter);

  // 双色分工：内环琥珀（challenge 签名）、外环天青（课程辅色）——撞色不抢
  vec3 color = BG;
  color += CYAN * exp(-dOuter * 45.0) * 0.55;
  color += AMBER * exp(-dInner * 55.0) * 0.80;

  // 涟漪可见性：波前一圈微光（水痕），推瓣之外的余韵
  color += AMBER * wave * 0.10;

  // 暗角收边（骨架脚手架）
  color *= 1.0 - 0.15 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
