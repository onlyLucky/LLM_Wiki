#version 300 es
// Day 2 · 作业 C 答案 —— 顶点着色器（与骨架逐字一致）

layout(location = 0) in vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
