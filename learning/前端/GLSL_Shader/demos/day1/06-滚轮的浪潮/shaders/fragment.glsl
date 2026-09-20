#version 300 es
precision highp float;

// Day 1 · Demo 06 —— 片元着色器：滚轮的浪潮
// 对应讲义 1.7：u_scroll 是 JS 侧弹簧模拟的输出（位置），
// u_speed 是弹簧速度的滑动平均——快滚泛白，慢滚安静。
// 反向滚动时 wheel 累积量变负，弹簧自动回退，shader 无需感知方向。

uniform vec2 u_resolution;
uniform float u_scroll; // 弹簧位置：滚轮累积量归一化后的「条纹推进量」
uniform float u_speed;  // 弹簧速度绝对值（已滑动平均）
uniform float u_time;   // idle 慢转：静止时画面也活着

out vec4 fragColor;

const float TAU = 6.2831853;
const float STRIPES = 24.0;                  // 24 条竖条纹
const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 条纹相位：x 分成 24 格，滚轮推进相位——反向滚动自然回退
  float phase  = uv.x * STRIPES - u_scroll;
  float cell   = fract(phase);
  float stripe = smoothstep(0.42, 0.5, abs(cell - 0.5)); // 中央亮带，边缘留过渡抗锯齿

  // 波浪：沿 y 的正弦调制；相位 = 条纹编号错相 + idle 慢转 + 滚动推进
  float row  = floor(phase);
  float wave = 0.5 + 0.5 * sin(uv.y * TAU * 1.5 + row * 0.6 + u_time * 0.15 + u_scroll * 0.3);

  // 双色：波谷玫红、波峰天青——滚得越远颜色流得越快
  vec3 tint = mix(ROSE, CYAN, wave);
  vec3 color = BG + tint * stripe * (0.18 + 0.5 * wave);

  // 速度感：弹簧速度越大条纹越泛白（拖影的暗示）
  float streak = clamp(u_speed * 0.08, 0.0, 0.45);
  color += vec3(1.0) * stripe * streak;

  fragColor = vec4(color, 1.0);
}
