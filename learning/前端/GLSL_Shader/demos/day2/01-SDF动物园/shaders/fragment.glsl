#version 300 es
// Day 2 · Demo 01 —— 片元着色器：形态标本馆
// 六份几何标本（圆/方/圆角方/线段/硬并/平滑并）装进展卡陈列，
// 滚轮推动射灯，暖光下读形；fwidth 抗锯齿填标本，gPx 抗锯齿描卡框。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_pick;  // 射灯对准的格 0–5（JS 滚轮写入）
uniform vec2  u_mouse; // 鼠标 UV（0-1，左下原点），悬停预览用

out vec4 fragColor;

const vec3 BG    = vec3(0.043, 0.055, 0.078); // #0B0E14 展厅夜色
const vec3 CARD  = vec3(0.075, 0.088, 0.128); // #131621 卡纸
const vec3 DIM   = vec3(0.290, 0.322, 0.388); // #4A5263 未打光标本
const vec3 ROSE  = vec3(1.000, 0.302, 0.427); // #FF4D6D 标本本色
const vec3 AMBER = vec3(1.000, 0.757, 0.271); // #FFC145 射灯暖光
const float TAU  = 6.2831853;

float gPx;
float stroke(float d) { return 1.0 - smoothstep(0.0, gPx * 1.5, abs(d)); }
float fillS(float d)  { return 1.0 - smoothstep(0.0, gPx * 1.5, d); }

// ---- 标本库：讲义 2.1 的四个标准实现 ------------------------------
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

// ---- 每格一份标本：id 决定画什么，breath 统一呼吸 ----------------
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
  gPx = 1.0 / u_resolution.y;

  // ---- 2×3 分格（讲义 2.2 平铺的最小版）--------------------------
  // 每格高 1.0、宽 aspect * 2.0 / 3.0：三列两行铺满屏
  vec2 grid = vec2(aspect * 2.0 / 3.0, 1.0);
  vec2 g = p / grid + vec2(1.5, 1.0); // y 偏移 = 行数一半（2 行 → 1.0），两行才都完整
  vec2 id2 = floor(g);
  vec2 cell = (fract(g) - 0.5) * grid; // 格内坐标还原居中域量纲

  int id = int(id2.x) + int(id2.y) * 3;
  int pick = int(u_pick + 0.5);
  float isPick = id == pick ? 1.0 : 0.0;

  // ---- 悬停格：同一套分格变换喂给鼠标 UV -------------------------
  vec2 mp = u_mouse * 2.0 - 1.0;
  mp.x *= aspect;
  vec2 mg = floor(mp / grid + vec2(1.5, 1.0));
  float inBound = step(0.0, mg.x) * step(mg.x, 2.0) * step(0.0, mg.y) * step(mg.y, 1.0);
  float mId = mg.x + mg.y * 3.0;
  float isHover = (abs(mId - float(id)) < 0.5 ? 1.0 : 0.0) * inBound * (1.0 - isPick);

  // ---- 展卡：格内内缩的卡纸 + 细内框 ------------------------------
  vec2 cardHalf = grid * 0.5 - vec2(0.020);
  float dCard = sdBox(cell, cardHalf);
  vec3 col = mix(BG, CARD, fillS(dCard));

  // ---- 铭牌条：左上小牌，牌上 id+1 颗编号点 ----------------------
  vec2 plateC = vec2(-cardHalf.x + 0.075, cardHalf.y - 0.022);
  float dPlate = sdBox(cell - plateC, vec2(0.045, 0.009));
  col = mix(col, vec3(0.185, 0.212, 0.278), fillS(dPlate) * 0.85 * fillS(dCard));
  float dots = 0.0;
  for (int i = 0; i <= 5; i++) {
    float dx = -0.030 + 0.012 * float(i);
    dots = max(dots, fillS(length(cell - (plateC + vec2(dx, 0.0))) - 0.0035) * step(float(i), float(id)));
  }
  col = mix(col, mix(vec3(0.42, 0.46, 0.54), AMBER, isPick), dots);

  // ---- 标本底座阴影：形心下方的软带 -------------------------------
  float shadow = exp(-abs(cell.y + 0.22) * 26.0) * exp(-abs(cell.x) * 5.0);
  col = mix(col, vec3(0.020, 0.026, 0.042), clamp(shadow, 0.0, 1.0) * 0.55 * fillS(dCard));

  // ---- 标本体：fwidth 抗锯齿填充（讲义 2.1 的主旋律）-------------
  float breath = 1.0 + 0.05 * sin(u_time * TAU / 3.0);
  float sd = cellShape(cell, id, breath);
  float aa = fwidth(sd);
  float fill = 1.0 - smoothstep(0.0, aa, sd);

  vec3 ink = mix(DIM, ROSE, isPick);           // 打光=本色，否则灰蓝
  ink = mix(ink, mix(DIM, ROSE, 0.35), isHover); // 悬停：微染本色
  col = mix(col, ink, fill);

  // ---- 射灯（仅选中格）：灯具 + 光锥 + 地面光池 ------------------
  float ly = clamp((cell.y + cardHalf.y) / (cardHalf.y * 2.0), 0.0, 1.0); // 0 底 1 顶
  float lampW = mix(cardHalf.x * 0.95, 0.10, ly); // 顶部窄、底部宽的光锥
  float beam = pow(ly, 1.8) * smoothstep(lampW, lampW - 0.05, abs(cell.x)) * isPick;
  col += AMBER * beam * 0.28;

  float pool = exp(-length((cell - vec2(0.0, 0.30)) * vec2(1.0, 2.1)) * 9.0);
  col += AMBER * pool * isPick * 0.16;

  float dLamp = length(cell - vec2(0.0, cardHalf.y - 0.010)) - 0.016;
  col = mix(col, mix(vec3(0.16, 0.18, 0.24), AMBER, isPick), fillS(dLamp) * fillS(dCard));

  // ---- 卡框线：常态深灰，选中琥珀 ---------------------------------
  vec3 frame = mix(vec3(0.155, 0.180, 0.240), AMBER * 0.85, isPick);
  col = mix(col, frame, stroke(dCard) * (0.55 + 0.45 * max(isPick, isHover)));

  // ---- 胶片颗粒 ----------------------------------------------------
  float n = fract(sin(dot(gl_FragCoord.xy, vec2(127.1, 311.7))) * 43758.5453);
  col += (n - 0.5) * 0.02;

  fragColor = vec4(col, 1.0);
}
