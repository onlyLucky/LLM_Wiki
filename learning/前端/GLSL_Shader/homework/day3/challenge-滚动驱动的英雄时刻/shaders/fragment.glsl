// Day 3 · 作业 C · 粒子 fragment —— 已就位，无需改动
// 裁圆软边（3.4）+ 按聚集度混双色 + 加一点亮度倾向。

uniform vec3 u_colorA; // 散开时：玫红
uniform vec3 u_colorB; // 聚齐后：天青
varying float v_mix;   // 顶点侧算好的聚集度（0 散开 → 1 聚齐）

void main() {
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.32, d); // 裁圆 + 软边一步
  if (alpha < 0.01) discard;

  vec3 col = mix(u_colorA, u_colorB, v_mix);
  col *= 1.15; // 轻微提亮，让 bloom 有东西可咬
  gl_FragColor = vec4(col, alpha);
}
