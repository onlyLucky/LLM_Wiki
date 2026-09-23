#version 300 es
precision highp float;

// Day 1 · Demo 03 —— 时间仪器馆
// 对应讲义 1.6：u_time 是唯一的输入，四台仪器各自演示一条动画曲线。
// 核心公式：相位 = fract(u_time / 周期)——除法把秒换成圈数，
// fract 去整存零，一切循环动画都回到 [0,1] 这个一维跑道上。

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

const float TAU = 6.2831853;                 // 一整圈的弧度，2π
const vec3 BG   = vec3(0.055, 0.070, 0.105); // 仪器馆底色
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0
const vec3 FACE = vec3(0.078, 0.094, 0.137); // 表盘面

// ---- 四条动画曲线（讲义 1.6）：都吃 [0,1] 的相位，吐 [0,1] 的值 ----

// 呼吸：sin 值域天生 [-1,1]，0.5 + 0.5x 拉回 [0,1] 才能当系数用
float breathe(float t) {
  return 0.5 + 0.5 * sin(t * TAU);
}

// 三角波：fract 给出锯齿，abs 把斜坡对折一次成对称三角
float triangleWave(float t) {
  return abs(fract(t) * 2.0 - 1.0);
}

// 缓动（课程标准实现，讲义 1.6 定稿）：前半程立方加速、后半程立方减速
float easeInOutCubic(float t) {
  t = clamp(t, 0.0, 1.0);
  return t < 0.5
    ? 4.0 * t * t * t
    : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
}

// 弹性（课程标准实现）：指数衰减外壳套住正弦内核——冲过头，再弹回来
float easeOutElastic(float t) {
  t = clamp(t, 0.0, 1.0);
  if (t == 0.0 || t == 1.0) return t; // 端点精确归位，否则收尾有残影
  float c4 = 2.0943951;               // 震荡频率：1 内恰好三个整周期
  return pow(2.0, -10.0 * t) * sin((t * 10.0 - 0.75) * c4) + 1.0;
}

// hash 噪声：胶片颗粒的原料
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float gPx; // 1 物理像素（uv 域长度），供描边函数抗锯齿
float stroke(float d) { return 1.0 - smoothstep(0.0, gPx * 1.5, abs(d)); }
float fill(float d)   { return 1.0 - smoothstep(0.0, gPx * 1.5, d); }
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

// 环形刻度盘：ang（0..TAU）角向 n 等分，刻度画在 [r0, r1] 径向带内
float dialTicks(float ang, float r, float n, float r0, float r1) {
  float aDist = abs(fract(ang / TAU * n + 0.5) - 0.5) * TAU / n;
  return stroke(aDist * r) * smoothstep(r0 - 0.006, r0, r) * (1.0 - smoothstep(r1, r1 + 0.006, r));
}

// ---- 左下 · 呼吸灯：灯芯半径随 breathe 胀缩，外圈 8 刻度参考环 ----
vec3 panelBreathe(vec2 p, float phase, vec3 accent) {
  vec3 col = FACE;
  float r = length(p);
  float lampR = 0.08 + 0.20 * breathe(phase);          // 灯芯半径 = 相位的正弦呼吸
  col = mix(col, accent, fill(r - lampR) * 0.85);      // 灯芯
  float glow = pow(clamp(1.0 - r / (lampR + 0.14), 0.0, 1.0), 2.0);
  col = mix(col, accent, glow * 0.22);                 // 灯晕：贴着灯芯二次衰减
  col = mix(col, accent, stroke(r - 0.34) * 0.30);     // 静态参考环
  float a = atan(p.x, p.y);                            // 从顶部起、顺时针为正
  col = mix(col, accent, dialTicks(a, r, 8.0, 0.36, 0.40) * 0.5);
  return col;
}

// ---- 右下 · 示波器：三角波向右滚动，中央读数点读当前值 ----
vec3 panelScope(vec2 guv, float phase, vec3 accent) {
  vec3 col = FACE;
  vec2 g = abs(fract(guv * 4.0) - 0.5) / 4.0;          // 屏面 0.25 细网格
  col = mix(col, accent, stroke(min(g.x, g.y)) * 0.08);
  float wave = triangleWave(guv.x * 2.0 - phase * 2.0); // x 上 2 个周期，随相位滚动
  float wy = mix(0.22, 0.78, wave);
  col = mix(col, accent, stroke(guv.y - wy) * 0.90);   // 波形线
  float readX = 0.5;                                    // 中央读数点：波形流过它
  float waveY = mix(0.22, 0.78, triangleWave(readX * 2.0 - phase * 2.0));
  col = mix(col, vec3(1.0), stroke(guv.x - readX) * 0.10);
  col = mix(col, vec3(1.0), fill(length(guv - vec2(readX, waveY)) - gPx * 1.5));
  return col;
}

// ---- 左上 · 弹簧摆：滑块冲过目标线、回弹归位（easeOutElastic）----
vec3 panelSpring(vec2 p, float phase, vec3 accent) {
  vec3 col = FACE;
  float bx = (easeOutElastic(phase) - 0.5) * 0.62;      // 滑块位置 -0.31..0.31
  col = mix(col, accent, stroke(p.y) * (1.0 - smoothstep(0.30, 0.32, abs(p.x))) * 0.45); // 轨道
  float tickX = abs(fract((p.x + 0.31) / 0.155) - 0.5) * 0.155; // 5 档刻度
  float tick = stroke(tickX)
             * smoothstep(0.014, 0.016, abs(p.y)) * (1.0 - smoothstep(0.032, 0.034, abs(p.y)))
             * (1.0 - smoothstep(0.32, 0.33, abs(p.x)));
  col = mix(col, accent, tick * 0.5);
  float goal = stroke(p.x - 0.31) * step(0.5, fract(p.y * 24.0)) * (1.0 - smoothstep(0.05, 0.06, abs(p.y)));
  col = mix(col, vec3(1.0), goal * 0.30);               // 右端目标线（虚线）
  col = mix(col, accent, fill(sdBox(p - vec2(bx, 0.0), vec2(0.030, 0.024)) - 0.008) * 0.95); // 圆角滑块
  return col;
}

// ---- 右上 · 进度弧：easeInOutCubic 让指针先加速后减速扫过一整圈 ----
vec3 panelDial(vec2 p, float phase, vec3 accent) {
  vec3 col = FACE;
  float sweep = easeInOutCubic(phase) * TAU;            // 缓动角速度
  float a = atan(p.x, p.y);                             // 从顶部起、顺时针为正
  float aN = fract(a / TAU);                            // 归一 0..1（顶部 0）
  float r = length(p);
  col = mix(col, accent, stroke(r - 0.26) * 0.12);      // 暗轨道
  col = mix(col, accent, stroke(r - 0.26) * step(aN, sweep / TAU) * 0.95); // 已扫亮弧
  vec2 tipPos = vec2(sin(sweep), cos(sweep)) * 0.26;    // 端点亮点
  col = mix(col, vec3(1.0), fill(length(p - tipPos) - gPx * 2.0));
  col = mix(col, accent, dialTicks(a, r, 12.0, 0.30, 0.34) * 0.5); // 12 刻度表盘
  col = mix(col, accent, fill(r - gPx * 1.5) * 0.6);    // 轴心
  return col;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  gPx = 1.0 / u_resolution.y;

  // 2x2 分格：cell 记格编号（0 或 1），guv 是格内 0-1 坐标
  vec2 cell = floor(uv * 2.0);
  vec2 guv  = fract(uv * 2.0);
  vec2 p = (guv - 0.5) * vec2(aspect, 1.0); // 格内中心坐标，x 校正屏幕等距

  // 相位归一化：主节奏 3 秒一圈——四台仪器共用同一相位（对表）
  float phase = fract(u_time / 3.0);

  // 挑格子：左下呼吸灯 / 右下示波器 / 左上弹簧摆 / 右上进度弧，双色交替
  vec3 col;
  if (cell.y < 0.5) {
    if (cell.x < 0.5) { col = panelBreathe(p, phase, ROSE); }
    else              { col = panelScope(guv, phase, CYAN); }
  } else {
    if (cell.x < 0.5) { col = panelSpring(p, phase, CYAN); }
    else              { col = panelDial(p, phase, ROSE); }
  }

  // 当前格的 accent（铭牌用）
  vec3 accent = (cell.x != cell.y) ? CYAN : ROSE;

  // 面板边框：内缩 1.8% 的矩形描边
  vec2 edge = min(guv, 1.0 - guv);
  col = mix(col, vec3(0.17, 0.21, 0.28), stroke(min(edge.x, edge.y) - 0.018) * 0.5);

  // 左上铭牌：accent 短横条（四台仪器的「编号牌」）
  col = mix(col, accent, fill(sdBox(guv - vec2(0.055, 0.935), vec2(0.045, 0.010))) * 0.9);

  // 格间暗缝：格内坐标贴边 0.4% 的位置压暗
  float seam = step(edge.x, 0.004) + step(edge.y, 0.004);
  col = mix(col, vec3(0.02), clamp(seam, 0.0, 1.0) * 0.9);

  // 底部公共进度条：与四台仪器共用相位，走到哪一目了然（对表用）
  float progress = step(uv.y, 0.012) * step(uv.x, phase);
  col = mix(col, vec3(1.0), progress * 0.25);

  // 仪器馆 6s 极慢呼吸：整体 ±2% 亮度摆动，几乎察觉不到但画面是活的
  float slow = 0.5 + 0.5 * sin(u_time * TAU / 6.0);
  col *= 1.0 + 0.02 * (slow - 0.5);

  // 胶片颗粒 ±1%：每像素每帧独立噪声，压住大面积纯色的塑料感
  col += (hash(gl_FragCoord.xy + fract(u_time) * 7.13) - 0.5) * 0.02;

  fragColor = vec4(col, 1.0);
}
