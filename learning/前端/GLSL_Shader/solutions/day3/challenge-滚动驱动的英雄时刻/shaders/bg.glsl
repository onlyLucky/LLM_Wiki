// Day 3 · 作业 C · 答案 · 背景 fragment —— ch-4 噪声揭幕转场
// 标准件与骨架逐字一致；main 里的占位平色替换为揭幕公式 + vignette。

uniform float u_time;
uniform float u_scroll;
uniform vec3 u_bgA; // 暗紫夜（第一幕）
uniform vec3 u_bgB; // 近黑（第二幕）
varying vec2 v_uv;

// ---- 标准件（2.4 存货，与骨架逐字一致）------------------------
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
  // 揭幕转场（0.3–0.7，讲义 3.3 第 4 节公式）：
  // 阈值随 t2 扫过噪声场，±0.12 柔边让分界像墨水洇开而不是一条硬线；
  // + u_time * 0.05 让揭幕边缘自己「游动」——幕布是活的
  float t2 = smoothstep(0.3, 0.7, u_scroll);
  float n = fbm(v_uv * 3.0 + u_time * 0.05);
  float reveal = smoothstep(t2 - 0.12, t2 + 0.12, n);
  vec3 col = mix(u_bgA, u_bgB, reveal);

  // vignette 压四角（demo 03 配方卡存货），幕布感更足
  float vig = 1.0 - 0.25 * distance(v_uv, vec2(0.5));
  col *= vig;

  gl_FragColor = vec4(col, 1.0);
}
