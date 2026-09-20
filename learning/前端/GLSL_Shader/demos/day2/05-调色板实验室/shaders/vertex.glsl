#version 300 es
// Day 2 · Demo 05 —— 顶点着色器
// 全屏四边形：4 顶点 TRIANGLE_STRIP，clip space 直通（讲义 1.5）

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
