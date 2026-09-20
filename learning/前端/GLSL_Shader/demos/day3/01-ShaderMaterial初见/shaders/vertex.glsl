// Day 3 · Demo 01 —— vertex shader（three 版，GLSL1 风格）
// 与 Day 1 原生版的三处差异（讲义 3.1 的「风格差异」小节）：
// 1. 不写 #version——three 按渲染器自动注入版本头与 precision；
// 2. attribute 不用声明——position / uv / normal 是内置注入，拿来就用；
// 3. 矩阵不用手动传——projectionMatrix / modelViewMatrix 每帧自动更新。
varying vec2 v_uv;

void main() {
  v_uv = uv; // PlaneGeometry 自带的 uv attribute：左下 (0,0)，右上 (1,1)
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
