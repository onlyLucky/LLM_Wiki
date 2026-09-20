// Day 3 · Demo 03 —— 片元：点精灵长什么样（裁圆、调色、软边）

uniform vec3 u_colorA; // 玫红核心
uniform vec3 u_colorB; // 天青外围

varying float v_r; // 出生半径（顶点算好传下来）

void main() {
  // gl_PointCoord：点精灵内部的 0–1 坐标（左上原点）
  float d = length(gl_PointCoord - 0.5);
  float alpha = smoothstep(0.5, 0.32, d); // 裁圆 + 软边一步到位（不是硬边 if）
  if (alpha < 0.01) discard;

  // 按出生半径 mix 两色：玫红核心 → 天青外围
  vec3 col = mix(u_colorA, u_colorB, smoothstep(0.6, 1.1, v_r));

  // 亮度倾斜：核心亮外围暗——bloom threshold 只咬核心，「核心亮、边缘收」
  col *= 1.25 - smoothstep(0.55, 1.2, v_r) * 0.45;

  gl_FragColor = vec4(col, alpha); // additive 下亮度靠密度叠加，alpha 只管自身软边
}
