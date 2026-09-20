// Day 3 · 作业 B 答案 —— 片元着色器
// 三件事：对角渐变（45° 恒定）+ 呼吸（3s ±6%）+ 鼠标视差（±3%）。

uniform float u_time;
uniform vec2 u_mouse;
uniform vec3 u_colorA;
uniform vec3 u_colorB;
varying vec2 v_uv;

void main() {
  // 视差：0–1 → ±0.03，加在渐变进度上（chrome 的 ny 已翻成左下原点，与 v_uv 同向）
  float par = (u_mouse.x - 0.5) * 0.06;

  // 宽高比修正：plane 6×7.5，x 方向压 0.8，等值线 t(x,y)=x+y 才是真 45°
  // （不修正的话对角线会被拉成「看起来更陡」的斜线）
  vec2 p = vec2((v_uv.x - 0.5) * 0.8, v_uv.y - 0.5);

  // 呼吸：乘坐标不乘颜色——幅度 ±6%、周期 3s（6.2831853 = 2π）
  float breath = 1.0 + 0.06 * sin(u_time * 6.2831853 / 3.0);

  // 对角渐变：t = x + y（等值线即 45° 斜线），clamp 收进 0–1
  float t = clamp((p.x + p.y) * breath + par, 0.0, 1.0);
  vec3 col = mix(u_colorA, u_colorB, t);
  gl_FragColor = vec4(col, 1.0);
}
