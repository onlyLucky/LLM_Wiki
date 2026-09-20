#version 300 es
precision highp float;

// Day 1 · Demo 03 —— 片元着色器：时间的画面
// 对应讲义 1.6：u_time 是唯一的输入，四条动画曲线各自解释它。
// 核心公式：相位 = fract(u_time / 周期)——除法把秒换成圈数，
// fract 去整存零，一切循环动画都回到 [0,1] 这个一维跑道上。

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

const float TAU = 6.2831853;                 // 一整圈的弧度，2π
const vec3 BG   = vec3(0.063, 0.082, 0.122); // #10151F 四格底色
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

// ---- 四条动画曲线：都吃 [0,1] 的相位，吐 [0,1] 的值 ------------

// 呼吸：sin 值域天生 [-1,1]，0.5 + 0.5x 拉回 [0,1] 才能当系数用
float breathe(float t) {
  return 0.5 + 0.5 * sin(t * TAU);
}

// 三角波：fract 给出锯齿，abs 把斜坡对折一次成对称三角
float triangleWave(float t) {
  return abs(fract(t) * 2.0 - 1.0);
}

// 缓动：smoothstep 内部就是这条三次曲线，展开写出便于看清形状
float easeInOut(float t) {
  return t * t * (3.0 - 2.0 * t);
}

// 弹性：指数衰减外壳套住正弦内核——冲过头，再弹回来
// p 是振荡周期占相位的比例；t 的两端必须提前返回，否则起点会闪
float elasticOut(float t) {
  if (t <= 0.0) return 0.0;
  if (t >= 1.0) return 1.0;
  const float p = 0.3;
  return pow(2.0, -10.0 * t) * sin((t - p / 4.0) * TAU / p) + 1.0;
}

// hash 噪声：胶片颗粒的原料
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 2x2 分格：cell 记格编号（0 或 1），guv 是格内 0-1 坐标
  vec2 cell = floor(uv * 2.0);
  vec2 guv  = fract(uv * 2.0);

  // 相位归一化：主节奏 3 秒一圈
  float phase = fract(u_time / 3.0);

  // 挑格子：左下呼吸 / 右下三角波 / 左上弹性 / 右上缓动，双色交替
  float v;
  vec3 accent;
  if (cell.y < 0.5) {
    if (cell.x < 0.5) { v = breathe(phase);      accent = ROSE; }
    else              { v = triangleWave(phase); accent = CYAN; }
  } else {
    if (cell.x < 0.5) { v = elasticOut(phase);   accent = CYAN; }
    else              { v = easeInOut(phase);    accent = ROSE; }
  }

  // 当前值位置画一条亮带；扫过的区域留痕迹（痕迹亮度按次节奏 4.5s 呼吸）
  float trailPulse = 0.5 + 0.5 * sin(u_time * TAU / 4.5);
  float bar   = smoothstep(0.035, 0.02, abs(guv.y - v));
  float trail = step(guv.y, v) * (0.04 + 0.04 * trailPulse);

  vec3 color = BG + accent * trail;
  color = mix(color, accent, bar * 0.85);

  // 格间暗缝：格内坐标贴边 0.6% 的位置压暗
  vec2 edge = min(guv, 1.0 - guv);
  float seam = step(edge.x, 0.006) + step(edge.y, 0.006);
  color = mix(color, vec3(0.02), clamp(seam, 0.0, 1.0) * 0.9);

  // 底部进度条：与四格共用同一相位，走到哪一目了然（对表用）
  float progress = step(uv.y, 0.012) * step(uv.x, phase);
  color = mix(color, vec3(1.0), progress * 0.25);

  // 背景 6s 极慢呼吸：整体 ±2% 亮度摆动，几乎察觉不到但画面是活的
  float slow = 0.5 + 0.5 * sin(u_time * TAU / 6.0);
  color *= 1.0 + 0.02 * (slow - 0.5);

  // 胶片颗粒 ±1%：每像素每帧独立噪声，压住大面积纯色的塑料感
  color += (hash(gl_FragCoord.xy) - 0.5) * 0.02;

  fragColor = vec4(color, 1.0);
}
