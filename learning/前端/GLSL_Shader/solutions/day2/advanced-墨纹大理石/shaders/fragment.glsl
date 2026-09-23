#version 300 es
// Day 2 · 作业 A 答案 —— 片元着色器：墨纹大理石
// 关键取舍：fbm 不上色、只扭相位——「纹样」不是「天气」；
// 拖动偏置只加在 flow（展示层），不动 hash 的种子层。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_vel;

out vec4 fragColor;

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// 任务 1：value noise 四步
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep 缓动：无缝的关键
  float a = hash21(i);
  float b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1));
  float d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// 任务 2：fbm 五倍频（旋 37° 矩阵防纺织纹）
float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// 任务 4：iq 余弦调色板，参数调进纸墨区间
// c = 0.5：t 只走半圈——palette(1) 是纸（暖白）、palette(0) 是墨（青黑）；
// d 三通道错峰：纸偏暖、墨偏青（宣纸与墨的物理色偏）
vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(0.5, 0.5, 0.5);
  vec3 d = vec3(0.50, 0.52, 0.56);
  return a + b * cos(6.2831853 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 任务 5：搅水向量——基础漂移 + 拖动方向偏置 × 0.2
  // u_vel 是 0–1 域帧差：x 乘 2*aspect 换到居中域量纲再定标
  vec2 drag = u_vel * vec2(2.0 * aspect, 2.0) * 0.2;
  vec2 flow = vec2(u_time * 0.03, u_time * 0.02) + drag;

  // 任务 3：domain warping（k = 0.8 墨流档）
  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, u_time * 0.02)),
               fbm(p * 1.2 + vec2(5.2, 1.3)));
  float f = fbm(p * 1.2 + flow + 0.8 * q);

  // 墨脉相位（脚手架）：平行纹被 f 揉皱
  float phase = dot(p, vec2(0.55, 0.85)) * 5.0 + f * 12.0;
  float vein = pow(0.5 + 0.5 * sin(phase), 7.0);              // 主脉
  float fine = pow(0.5 + 0.5 * sin(phase * 2.7 + 1.3), 14.0); // 支脉飞白
  float t = clamp(1.0 - vein * 1.15 - fine * 0.55, 0.0, 1.0); // 脉处 t→墨
  vec3 col = palette(t);

  // 任务 4：gamma 收尾——暗部抬亮，脉缘浮出灰阶（墨分五色）
  col = pow(col, vec3(0.4545));

  // vignette（脚手架）——纸面的旧感
  col *= 1.0 - 0.15 * pow(length(uv - 0.5), 2.0);

  fragColor = vec4(col, 1.0);
}
