#version 300 es
// Day 1 · Demo 05 —— 顶点着色器
// 全屏四边形四连装之四：与 Demo 02/03/04 完全相同，clip space 直通。

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
