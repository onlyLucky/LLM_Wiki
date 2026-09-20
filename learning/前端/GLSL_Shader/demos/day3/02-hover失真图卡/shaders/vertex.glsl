// Day 3 · Demo 02 —— vertex：透传 uv（GLSL1 风格，内置注入照常生效）
varying vec2 v_uv;

void main() {
  v_uv = uv; // PlaneGeometry 自带 uv：左下 (0,0)——纹理坐标与图卡局部坐标同一套
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
