#version 300 es
// Day 2 · 作业 C —— 片元着色器：深海回响
// 六个 TODO 三层装配：前景 SDF 构图 → 光感与辉光 → 配方卡收尾。
// 背景深海雪的 noise/fbm/palette 是脚手架给足的（2.4 不是本题考点）。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse; // 0–1 左下原点（视差素材：前景 5% / 背景 2%）

out vec4 fragColor;

const vec3 BG    = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 PING  = vec3(0.298, 0.788, 0.941); // #4CC9F0 声呐青 主 glow
const vec3 BLOOM = vec3(0.243, 0.941, 0.780); // #3EF0C7 生物光青绿 次 glow

// ---- 形状库（讲义 2.1 脚手架）----------------------------------
float sdCircle(vec2 p, float r) { return length(p) - r; }

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

// ---- 背景深海雪的函数库（脚手架，2.4 产出直接复用）--------------
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
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

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // ---- 层 0：背景深海雪（任务 4）--------------------------------
  // TODO(day2-ch-4)：背景层——fbm warp 海雪、透明度 25%、流速向下
  // （海雪是下沉的：y 分量取负），视差 2%：采样坐标加 (u_mouse - 0.5) * 0.02
  // （前景用 5%，见任务 6）
  // 占位：纯底色
  vec3 col = BG;

  // ---- 层 1：前景构图（任务 1）----------------------------------
  // TODO(day2-ch-1)：≥3 个 SDF 布尔组合，含一次 smin。
  // 建议构图：中央声呐环（abs(length - R) - w）+ 一根锚链线段 smin 焊上
  // 一枚深潜灯珠——环形 + 支线的构图最耐看；前景坐标做 5% 视差
  // （p 加 (u_mouse - 0.5) * 0.05 后再算 SDF）
  // 占位：sd = 999.0——构造物不存在，任务 1 完成后剪影点亮
  vec2 fp = p; // 前景坐标（任务 6 的视差半边在此叠加）
  float sd = 999.0; // 占位

  // ---- 层 2：光感（任务 2、3）------------------------------------
  // TODO(day2-ch-2)：高度场法线 + 朗伯一行（讲义 2.6 迁移）
  // h = 1.0 - smoothstep(0.0, 0.05, abs(sd));
  // n = normalize(vec3(dFdx(h), dFdy(h), 0.04));
  // lit = clamp(dot(n, normalize(vec3(-0.4, 0.7, 0.5))), 0.0, 1.0);

  // TODO(day2-ch-3)：双层 glow——主声呐青 w=0.08、次生物光绿 w=0.12，指数 2.0
  // 回响脉动：pulse = 0.85 + 0.15 * sin(u_time * 1.8)，只乘主 glow
  // （ping 是构造物主动发出的——呼吸；生物光是被动环境——恒定）
  // g1 = pow(0.08 / (abs(sd) + 0.08), 2.0) × 0.9 × pulse
  // g2 = pow(0.12 / (abs(sd) + 0.12), 2.0) × 0.5
  // 环体填充：深海金属青白 × (0.4 + 0.6 * lit)，fwidth 抗锯齿

  // ---- 层 3：配方卡（任务 5）------------------------------------
  // TODO(day2-ch-5)：五步收尾，顺序即配方：
  // gamma（pow 0.4545）→ 对比（±6%）→ 饱和（收 10%）→ grain（4%）
  // → vignette（0.2 平方）
  // 占位：未收尾

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
