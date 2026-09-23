#version 300 es
// Day 2 · 作业 C 答案 —— 片元着色器：深海回响
// 关键取舍：背景对比度让给前景（25% 不是美学偏好，是层级工程参数）；
// 前景视差 5% / 背景 2%——两倍差是「分层可感」的下限。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

out vec4 fragColor;

const vec3 BG    = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 PING  = vec3(0.298, 0.788, 0.941); // #4CC9F0 声呐青 主 glow
const vec3 BLOOM = vec3(0.243, 0.941, 0.780); // #3EF0C7 生物光青绿 次 glow

// ---- 形状库（骨架脚手架，任务 1 的零件）-------------------------
float sdCircle(vec2 p, float r) { return length(p) - r; }

float sdSegment(vec2 p, vec2 a, vec2 b) {
  vec2 pa = p - a, ba = b - a;
  float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);
  return length(pa - ba * h);
}

float smin(float a, float b, float k) {
  float h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// ---- 背景海雪库（骨架脚手架）------------------------------------
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

// 海雪的低对比色卡：蓝灰系（与前景主色同族不抢戏）
vec3 snowPalette(float t) {
  return vec3(0.16, 0.22, 0.28) + vec3(0.07, 0.09, 0.11) * cos(6.2831853 * (t + vec3(0.1, 0.3, 0.5)));
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // ---- 层 0：背景深海雪（任务 4）视差 2%、流速向下、透明度 25% ----
  vec2 bp = p + (u_mouse - 0.5) * 0.02;
  vec2 bq = vec2(fbm(bp * 1.3 + vec2(0.0, u_time * 0.02)),
                 fbm(bp * 1.3 + vec2(5.2, 1.3)));
  float bsnow = fbm(bp * 1.3 + vec2(u_time * 0.04, -u_time * 0.08) + 0.6 * bq);
  vec3 col = BG + snowPalette(bsnow) * 0.25;

  // ---- 层 1：前景构图（任务 1）视差 5% --------------------------
  vec2 fp = p + (u_mouse - 0.5) * 0.05;
  // 声呐环 + 锚链 smin 焊深潜灯珠——环身 + 支线的构图
  float ring = abs(length(fp) - 0.40) - 0.035;
  float seg  = sdSegment(fp, vec2(0.30, 0.28), vec2(0.55, 0.50)) - 0.015;
  float orb  = sdCircle(fp - vec2(0.58, 0.53), 0.07);
  float sd = min(ring, smin(seg, orb, 0.06));

  // ---- 层 2a：高度场法线 + 朗伯（任务 2）------------------------
  float h = 1.0 - smoothstep(0.0, 0.05, abs(sd));
  vec3 n = normalize(vec3(dFdx(h), dFdy(h), 0.04));
  float lit = clamp(dot(n, normalize(vec3(-0.4, 0.7, 0.5))), 0.0, 1.0);

  // ---- 层 2b：双层 glow + 回响脉动 + 环体填充（任务 3）-----------
  float pulse = 0.85 + 0.15 * sin(u_time * 1.8); // 声呐 ping 的心跳
  float g1 = pow(0.08 / (abs(sd) + 0.08), 2.0);
  float g2 = pow(0.12 / (abs(sd) + 0.12), 2.0);
  float fill = 1.0 - smoothstep(0.0, fwidth(sd), abs(sd));

  col += PING * g1 * 0.9 * pulse;
  col += BLOOM * g2 * 0.5;
  col = mix(col, vec3(0.78, 0.94, 0.92) * (0.4 + 0.6 * lit), fill);

  // ---- 层 3：配方卡五步（任务 5，顺序即配方）---------------------
  col = pow(col, vec3(0.4545));                                     // gamma
  col = (col - 0.5) * 1.06 + 0.5;                                  // 对比
  col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 0.9);  // 饱和
  col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.04;          // grain
  col *= 1.0 - 0.2 * pow(length(uv - 0.5), 2.0);                   // vignette

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
