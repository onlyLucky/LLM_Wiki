// Day 3 · 作业 C · 粒子 vertex —— TODO(day3-ch-2) 与 TODO(day3-ch-3) 的主战场
// 数据侧已就位（main.ts）：position = 出生位（球壳偏内星云）、
//   a_targetA =「GLSL」采样点、a_targetB =「FIN」采样点。
// 你要做的：散开（噪声流动）→ 聚集（两段 mix）→ 透视缩放。
// 占位状态：粒子停在出生位一动不动——可跑，但没有故事。

uniform float u_time;
uniform float u_scroll;
uniform float u_size;
varying float v_mix; // 聚集度：0 散开 → 1 聚齐，片元按它混双色

attribute vec3 a_targetA;
attribute vec3 a_targetB;

// ---- 标准件（2.4 存货）----------------------------------------
// octave 数是 TODO(day3-ch-6) 的调档项：默认 3，滚动流畅度吃紧先砍它
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
  // TODO(day3-ch-2)：散开——出生位叠加噪声流动（星云感）
  //   三路 2D 噪声伪向量场（demo 03 手法：三个投影面、时间系数故意不等）：
  //     float n1 = fbm(position.xy * 1.4 + u_time * 0.18);
  //     float n2 = fbm(position.yz * 1.4 - u_time * 0.15);
  //     float n3 = fbm(position.zx * 1.4 + u_time * 0.12);
  //   别忘了 -0.5 居中（demo 03 的教训：噪声值域 0–1，直接加会整体漂移）：
  //     float amp = 1.0; // TODO(day3-ch-3)：幅度要随聚集收束，见下
  //     vec3 scatter = position + (vec3(n1, n2, n3) - 0.5) * 2.0 * amp;
  vec3 pos = position;

  // TODO(day3-ch-3)：聚集——区间进度 + 两段 mix（区间首尾相接，讲义 3.3）
  //   float t1 = smoothstep(0.0, 0.3, u_scroll); // 第一幕：聚成「GLSL」
  //   float t3 = smoothstep(0.7, 1.0, u_scroll); // 第三幕：聚成「FIN」
  //   噪声幅度 1.0 → 0.1 随 t1 收束（规格原文），把它乘进散开项：
  //     float amp = mix(1.0, 0.1, t1);
  //   聚集：先散位 → GLSL，再滑向 FIN——
  //     pos = mix(scatter, a_targetA, t1);
  //     pos = mix(pos, a_targetB, t3);
  //   顺手把聚集度传给片元（fragment.glsl 已在用 v_mix）：
  //     v_mix = max(t1, t3);

  v_mix = 0.0; // 占位：完成 TODO(day3-ch-3) 后替换成 max(t1, t3)

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = u_size * (300.0 / -mvPosition.z); // 近大远小（3.4 的透视衰减）
  gl_Position = projectionMatrix * mvPosition;
}
