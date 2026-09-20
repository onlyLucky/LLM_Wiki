#version 300 es
// Day 1 · Demo 04 —— 顶点着色器
// 全屏四边形四连装之三：与 Demo 02/03 完全相同，clip space 直通。
// 本 demo 的主角是 fragment 里的距离场与 JS 侧的惯性模型。

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
