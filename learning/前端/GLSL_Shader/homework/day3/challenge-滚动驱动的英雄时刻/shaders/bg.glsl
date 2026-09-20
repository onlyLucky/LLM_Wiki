// Day 3 · 作业 C · 背景 fragment —— TODO(day3-ch-4) 转场遮罩的战场
// 这块板子 24×14、z=-3，永远在粒子后面铺满画面。
// 占位状态：平色暗紫——接完 TODO 后它会随滚动「揭幕」换到近黑。

uniform float u_time;
uniform float u_scroll;
uniform vec3 u_bgA; // 暗紫夜（第一幕）
uniform vec3 u_bgB; // 近黑（第二幕）
varying vec2 v_uv;

// ---- 标准件（2.4 存货，与 vertex.glsl 各持一份）----------------
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  // TODO(day3-ch-4)：噪声揭幕转场（0.3–0.7 段，讲义 3.3 第 4 节原文公式）——
  //   float t2 = smoothstep(0.3, 0.7, u_scroll);           // 第二幕进度
  //   float n = fbm(v_uv * 3.0 + u_time * 0.05);           // +time：揭幕边缘自己「游动」
  //   float reveal = smoothstep(t2 - 0.12, t2 + 0.12, n);  // 柔边：阈值 ±0.12 像墨水洇开
  //   vec3 col = mix(u_bgA, u_bgB, reveal);
  //   再叠一层 vignette 压四角（demo 03 配方卡的存货），幕布感更足：
  //     float vig = 1.0 - 0.25 * distance(v_uv, vec2(0.5));
  //     col *= vig;
  vec3 col = u_bgA; // 占位：平色暗紫
  gl_FragColor = vec4(col, 1.0);
}
