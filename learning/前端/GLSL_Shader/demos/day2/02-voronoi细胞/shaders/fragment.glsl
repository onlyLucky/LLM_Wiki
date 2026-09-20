#version 300 es
// Day 2 · Demo 02 —— 片元着色器：voronoi 细胞
// 3×3 遍历找最近领主；F2-F1 画细胞壁；胜者 hash 决定细胞身份。
// 鼠标视差：格子域整体微偏，细胞随光标轻倾。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse; // 0–1 左下原点（chrome 已翻转平滑）

out vec4 fragColor;

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14

// ---- hash 家族（讲义 2.3）---------------------------------------
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

vec2 hash22(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(vec2(p.x * p.y, p.x + p.y) * 998.0);
}

// ---- 余弦调色板：低饱和档（讲义 2.5 蓝橙卡降振幅）----------------
vec3 palette(float t) {
  vec3 a = vec3(0.42, 0.44, 0.48);
  vec3 b = vec3(0.16, 0.16, 0.18); // 振幅压低：莫兰迪感
  vec3 c = vec3(1.0, 1.0, 1.0);
  vec3 d = vec3(0.0, 0.33, 0.67);
  return a + b * cos(6.2831853 * (c * t + d));
}

// ---- voronoi：F1 最近、F2 次近、胜者编号（讲义 2.3 的三件产出）---
vec3 voronoi(vec2 g) {
  vec2 id = floor(g);
  float f1 = 8.0;
  float f2 = 8.0;
  vec2 winner = vec2(0.0);

  // 3×3 遍历：2D 的完整安全域；不写 break——分支展开更贵（讲义 2.3 坑表）
  for (int y = -1; y <= 1; y++)
  for (int x = -1; x <= 1; x++) {
    vec2 o = vec2(float(x), float(y));
    vec2 h = hash22(id + o);            // 领主在格内的随机位置
    vec2 point = id + o + h;
    float d = length(g - point);
    if (d < f1) { f2 = f1; f1 = d; winner = id + o; }
    else if (d < f2) { f2 = d; }
  }
  return vec3(f1, f2, winner.x * 7.0 + winner.y * 13.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 格子域 + 鼠标视差 3%（视觉规格）：格子整体随光标微偏
  vec2 g = p * 3.0 + (u_mouse - 0.5) * 0.06;

  vec3 v = voronoi(g);
  float f1 = v.x, f2 = v.y, win = v.z;

  // 细胞身份色：胜者编号二次 hash 当 t——领地感（讲义 2.3 How 段）
  float cellH = hash21(vec2(win, win * 0.37));
  vec3 tint = palette(cellH * 0.7 + 0.15);

  // F1 径向明暗：核亮缘沉——细胞的体积错觉
  vec3 cell = tint * (0.85 + 0.15 * smoothstep(0.5, 0.0, f1));

  // 细胞壁：F2 - F1 趋于零处是边境线；宽度 fwidth 自适应
  float wallT = f2 - f1;
  float wall = 1.0 - smoothstep(0.0, fwidth(wallT) * 2.0 + 0.01, wallT);

  vec3 col = BG;
  col = mix(cell, vec3(0.05, 0.06, 0.09), wall * 0.8);

  // grain ±1.5%（视觉规格）
  col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.015;

  fragColor = vec4(col, 1.0);
}
