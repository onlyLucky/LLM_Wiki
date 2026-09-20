// Day 3 · 作业 C · 答案 · 粒子 vertex —— ch-2 散开 + ch-3 聚集
// 与骨架一致的部分：标准件（hash/noise/fbm 3 octave）、varying、attribute、透视缩放。

uniform float u_time;
uniform float u_scroll;
uniform float u_size;
varying float v_mix; // 聚集度：0 散开 → 1 聚齐，片元按它混双色

attribute vec3 a_targetA;
attribute vec3 a_targetB;

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
  // 散开（ch-2）：三路 2D 噪声伪向量场——三个投影面、时间系数故意不等，
  // 粒子才不会像一块布整体平移；-0.5 居中别忘（噪声值域 0–1，直接加会整体漂移）
  float n1 = fbm(position.xy * 1.4 + u_time * 0.18);
  float n2 = fbm(position.yz * 1.4 - u_time * 0.15);
  float n3 = fbm(position.zx * 1.4 + u_time * 0.12);

  // 区间进度（ch-3）：首尾相接不重叠，讲义 3.3 的三段式
  float t1 = smoothstep(0.0, 0.3, u_scroll); // 第一幕：聚成「GLSL」
  float t3 = smoothstep(0.7, 1.0, u_scroll); // 第三幕：聚成「FIN」

  // 噪声幅度随 t1 收束 1.0 → 0.1：粒子到位后只剩一丝呼吸感，不是死板钉死
  float amp = mix(1.0, 0.1, t1);
  vec3 scatter = position + (vec3(n1, n2, n3) - 0.5) * 2.0 * amp;

  // 两段 mix：散位 → GLSL → FIN（第二段从「已聚齐的 GLSL」滑向 FIN，不是从散位起跳）
  vec3 pos = mix(scatter, a_targetA, t1);
  pos = mix(pos, a_targetB, t3);

  v_mix = max(t1, t3); // 两段任一进行中都算「聚」，片元据此从玫红滑向天青

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = u_size * (300.0 / -mvPosition.z); // 近大远小（3.4 的透视衰减）
  gl_Position = projectionMatrix * mvPosition;
}
