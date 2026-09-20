#version 300 es
// Day 2 · Demo 01 —— 片元着色器：SDF 动物园
// 六只形状同住一个 fragment：圆 / 方 / 圆角方 / 线段 / 硬并 / 平滑并。
// 呼吸统一驱动（1.6 的相位表），滚轮切换高亮，fwidth 抗锯齿填充。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_pick; // 当前高亮格 0–5（JS 滚轮写入）

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D 高亮
const vec3 DIM  = vec3(0.290, 0.322, 0.388); // #4A5263 未选中

// ---- 形状库：讲义 2.1 的四个标准实现 ------------------------------
float sdCircle(vec2 p, float r) {
  return length(p) - r;
}

float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// ---- 每格一只形状：id 决定画什么，breath 统一呼吸 ----------------
float cellShape(vec2 cell, int id, float breath) {
  float b = breath; // 0.95–1.05，周期 3s（视觉规格）
  if (id == 0) return sdCircle(cell, 0.16 * b);
  if (id == 1) return sdBox(cell, vec2(0.15 * b));
  if (id == 2) return sdBox(cell, vec2(0.14 * b)) - 0.06; // 圆角：距离往回收
  if (id == 3) return sdSegment(cell, vec2(-0.16 * b, -0.10), vec2(0.16 * b, 0.10)) - 0.018;
  if (id == 4) return min( // 硬并：min 就是 OR
    sdCircle(cell - vec2(-0.09, 0.0), 0.12 * b),
    sdBox(cell - vec2(0.10, 0.0), vec2(0.11 * b)));
  return smin( // 平滑并：k = 0.08 的焊枪（视觉规格）
    sdCircle(cell - vec2(-0.09, 0.0), 0.12 * b),
    sdBox(cell - vec2(0.10, 0.0), vec2(0.11 * b)), 0.08);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // ---- 2×3 分格（讲义 2.2 平铺的最小版）--------------------------
  // 每格高 1.0、宽 aspect * 2.0 / 3.0：三列两行铺满屏
  vec2 grid = vec2(aspect * 2.0 / 3.0, 1.0);
  vec2 g = p / grid + vec2(1.5, 1.0); // y 偏移 = 行数一半（2 行 → 1.0），两行才都完整
  vec2 id2 = floor(g);
  vec2 cell = (fract(g) - 0.5) * grid; // 格内坐标还原居中域量纲

  int id = int(id2.x) + int(id2.y) * 3;

  // 呼吸：六格同频同相——陈列感来自统一（demo 01 的核心设计决策）
  float breath = 1.0 + 0.05 * sin(u_time * 6.2831853 / 3.0);

  float sd = cellShape(cell, id, breath);

  // ---- fwidth 抗锯齿填充（讲义 2.1 的主旋律）---------------------
  float aa = fwidth(sd);
  float fill = 1.0 - smoothstep(0.0, aa, sd);

  float isPick = id == int(u_pick) ? 1.0 : 0.0;

  // 选中格的呼吸辉光：距离的幂（讲义 2.6 的 glow 公式预演）
  float glow = pow(0.10 / (abs(sd) + 0.10), 2.0) * isPick;

  vec3 col = BG;
  col = mix(col, DIM, fill);
  col = mix(col, ROSE, fill * isPick);
  col += ROSE * glow * 0.22;

  fragColor = vec4(col, 1.0);
}
