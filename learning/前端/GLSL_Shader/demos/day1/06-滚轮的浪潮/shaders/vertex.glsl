#version 300 es
// Day 1 · Demo 06 —— 顶点着色器
// 全屏四边形四连装收官：与 Demo 02–05 完全相同，clip space 直通。
// Day 1 交互三部曲（追随 / 涟漪 / 浪潮）到此合流。

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
