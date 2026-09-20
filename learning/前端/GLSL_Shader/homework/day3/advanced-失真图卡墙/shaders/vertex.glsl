// Day 3 · 作业 A —— 顶点着色器（透传，无需改动）
varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
