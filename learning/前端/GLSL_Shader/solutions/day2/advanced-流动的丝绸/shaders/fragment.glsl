#version 300 es
// Day 2 · 作业 A 答案 —— 片元着色器：流动的丝绸
// 关键取舍：占位透传（每层占位 = 上一层的产出直接用）让任务逐级点亮；
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

// 任务 4：iq 熔岩卡（暗红→金，讲义 2.5 三张卡之一）
vec3 palette(float t) {
  vec3 a = vec3(0.5, 0.5, 0.5);
  vec3 b = vec3(0.5, 0.5, 0.5);
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.0, 0.10, 0.20);
  return a + b * cos(6.2831853 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 任务 5：流速向量——基础流向 + 拖动方向偏置 × 0.2
  // u_vel 是 0–1 域帧差：x 乘 2*aspect 换到居中域量纲再定标
  vec2 drag = u_vel * vec2(2.0 * aspect, 2.0) * 0.2;
  vec2 flow = vec2(u_time * 0.12, u_time * 0.06) + drag;

  // 任务 3：domain warping（k = 0.8 丝绸档）
  vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, u_time * 0.06)),
               fbm(p * 1.2 + vec2(5.2, 1.3)));
  float f = fbm(p * 1.2 + flow + 0.8 * q);

  // t 再分布 + 上色（任务 4）
  float t = clamp(f * 1.6 - 0.3, 0.0, 1.0);
  vec3 col = palette(t);

  // 任务 4：gamma 收尾
  col = pow(col, vec3(0.4545));

  // vignette（脚手架）
  col *= 1.0 - 0.15 * pow(length(uv - 0.5), 2.0);

  fragColor = vec4(col, 1.0);
}
