#version 300 es
// Day 1 · Demo 03 —— 顶点着色器
// 与 Demo 02 完全相同的全屏四边形：4 顶点 TRIANGLE_STRIP，clip space 直通。
// 这个 demo 的全部戏剧都发生在 fragment 里——顶点着色器退居幕后。

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
