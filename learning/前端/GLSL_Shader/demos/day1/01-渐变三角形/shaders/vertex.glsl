#version 300 es
// Day 1 · Demo 01 —— 顶点着色器
// 位置与颜色来自 attribute（main.ts 的 interleaved buffer），
// 颜色经 varying 插值交给片元——光栅化阶段的免费服务（讲义 1.5）

layout(location = 0) in vec2 a_position; // location 与 main.ts 的 vertexAttribPointer 对应
layout(location = 1) in vec3 a_color;

uniform float u_aspect; // 宽高比：把等腰三角形拉回视觉等边

out vec3 v_color; // varying：片元里同名 in，接头暗号逐字相同

void main() {
  v_color = a_color;
  // clip space 直接输出（-1..1），全屏效果不需要 MVP 矩阵（讲义 1.5）
  gl_Position = vec4(a_position * vec2(u_aspect, 1.0) * 0.9, 0.0, 1.0);
}
