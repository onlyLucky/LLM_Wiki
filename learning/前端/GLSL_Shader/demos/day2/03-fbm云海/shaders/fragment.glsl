#version 300 es
// Day 2 · Demo 03 —— 片元着色器：fbm 云海
// 噪声塔的第一二层：value noise → fbm 五倍频 → 调色板映射 + 边缘 glow。
// 熔岩色卡改造：深蓝底 → 天青亮部（讲义 2.4 How 段的蓝本）。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse; // 云层随光标漂移

out vec4 fragColor;

const vec3 BG  = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

// ---- hash → value noise → fbm（讲义 2.4 的三层塔）---------------
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f); // smoothstep 缓动：格子无缝的关键
  float a = hash21(i);
  float b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1));
  float d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6); // 旋 37° 再放大：倍频错轴（讲义 2.4）
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

// ---- 调色板：熔岩卡改造（暗部压蓝、亮部转天青）-------------------
vec3 palette(float t) {
  vec3 a = vec3(0.18, 0.22, 0.30);              // 基线压暗偏蓝
  vec3 b = vec3(0.26, 0.24, 0.22);              // 振幅略降
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.10, 0.22, 0.42);              // 相位整体后移——天青取向
  return a + b * cos(6.2831853 * (c * t + d));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 流动：流速 0.15（视觉规格），鼠标漂移 ±5% 偏置
  vec2 flow = vec2(u_time * 0.15, u_time * 0.05);
  flow += (u_mouse - 0.5) * 0.10;

  // fbm 采样 + 呼吸 k=0.6：噪声幅度整体起伏（视觉规格）
  float breathe = 1.0 + 0.6 * sin(u_time * 0.4);
  float n = fbm(p * 1.2 + flow) * breathe;

  // t 再分布：fbm 挤在 0.35–0.65，乘 1.6 减 0.3 铺满 0–1（讲义 2.4 How）
  float t = clamp(n * 1.6 - 0.3, 0.0, 1.0);
  vec3 col = palette(t);

  // 云的银边：高值区 pow 提亮——「边缘 glow」（视觉规格）
  col += CYAN * pow(smoothstep(0.55, 0.95, t), 2.0) * 0.35;

  // vignette 0.18（视觉规格）+ grain
  col *= 1.0 - 0.18 * pow(length(uv - 0.5), 2.0);
  col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.012;

  fragColor = vec4(col, 1.0);
}
