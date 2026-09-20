// Day 3 · 作业 B —— 片元着色器
// 考点：对角渐变 mix + 呼吸（周期 3s ±6%）+ 视差（3%）。
// 色板：u_colorA 深蓝夜 #1B2140 → u_colorB 玫红 #FF4D6D。

varying vec2 v_uv;
uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_colorA;
uniform vec3 u_colorB;

void main() {
  // TODO(day3-basic-3)：
  //   1) 视差：uv 先加 (u_mouse - 0.5) * 0.06 的偏移（u_mouse 已带阻尼，直接用）；
  //   2) 对角渐变：t = (p.x + p.y) 归一化，mix(u_colorA, u_colorB, t)。
  //      注意 plane 是 6:7.5——uv 空间直接 (uv.x + uv.y) 在屏幕上不是 45°，
  //      先做宽高比修正 p = vec2((uv.x - 0.5) * 0.8, uv.y - 0.5)（1.3 的老朋友）；
  //   3) 呼吸：col *= 1.0 + 0.06 * sin(u_time * 6.2831853 / 3.0)。
  vec3 col = vec3(0.043, 0.055, 0.078); // 占位：BG 色，替换成渐变
  gl_FragColor = vec4(col, 1.0);
}
