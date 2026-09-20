// Day 3 · 作业 A · 答案 —— 顶点着色器（透传，与骨架逐字一致）
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
