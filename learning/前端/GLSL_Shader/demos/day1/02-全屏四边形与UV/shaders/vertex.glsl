#version 300 es
// Day 1 · Demo 02 —— 顶点着色器
// 全屏四边形：4 顶点 TRIANGLE_STRIP，clip space 直通，不需要 MVP 矩阵（讲义 1.5）

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
