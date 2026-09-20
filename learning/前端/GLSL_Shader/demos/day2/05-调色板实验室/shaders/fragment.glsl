#version 300 es
// Day 2 · Demo 05 —— 片元着色器：调色板实验室
// 九宫格 = 三种信号源（fbm / SDF / voronoi F1）× 三种 t 分布
// （原值 / smoothstep / pow）。a/b/c/d 四 uniform 由 JS 实时调——
// 同一套配色在九种 t 命运下的对比，就是本 demo 的全部内容。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec3 u_a;
uniform vec3 u_b;
uniform vec3 u_c;
uniform vec3 u_d;

out vec4 fragColor;

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14

// ---- 余弦调色板（讲义 2.5 的公式）--------------------------------
vec3 palette(float t) {
  return u_a + u_b * cos(6.2831853 * (u_c * t + u_d));
}

// ---- 三个信号源（2.4 / 2.1 / 2.3 的产出复用）--------------------
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i), hash21(i + vec2(1, 0)), u.x),
            mix(hash21(i + vec2(0, 1)), hash21(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 4; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

float voronoiF1(vec2 g) {
  vec2 id = floor(g);
  float f1 = 8.0;
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 h = vec2(hash21(id + o), hash21(id + o + 19.19));
    f1 = min(f1, length(g - id - o - h));
  }
  return f1;
}

// 行信号：col=0 fbm，1 SDF，2 voronoi——各自产出 0–1
float signalAt(vec2 cell, int row) {
  if (row == 0) return clamp(fbm(cell * 2.5 + vec2(u_time * 0.1, 0.0)) * 1.4 - 0.2, 0.0, 1.0);
  if (row == 1) return 1.0 - clamp(length(cell) * 1.6, 0.0, 1.0); // SDF 距离：离中心越近越亮
  return 1.0 - clamp(voronoiF1(cell * 3.0) * 1.4, 0.0, 1.0);      // F1：细胞核亮
}

// 列再分布：col=0 原值，1 smoothstep 压缩，2 pow 压暗
float redistribute(float t, int col) {
  if (col == 1) return smoothstep(0.3, 0.7, t);
  if (col == 2) return pow(t, 2.0);
  return t;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 3×3 分格
  vec2 grid = vec2(aspect * 2.0 / 3.0, 2.0 / 3.0);
  vec2 g = p / grid + vec2(1.5, 1.5);
  vec2 id2 = floor(g);
  vec2 cell = (fract(g) - 0.5) * grid;

  int row = int(id2.y);              // 0–2：信号源（下到上）
  int col = int(id2.x);              // 0–2：t 分布（左到右）

  float t = redistribute(signalAt(cell, row), col);
  vec3 col3 = palette(t);

  // 分格细缝：极细深线标出九宫格，不抢内容
  vec2 fw = fwidth(p);
  float seam = smoothstep(0.006, 0.0, min(
    abs(fract(g.x) - 0.5) * grid.x - 0.5 * grid.x + 0.004,
    abs(fract(g.y) - 0.5) * grid.y - 0.5 * grid.y + 0.004));
  col3 = mix(col3, BG, seam * 0.6);

  fragColor = vec4(col3, 1.0);
}
