// Day 3 · 作业 B 答案 —— 顶点着色器
// 最小透传：把 uv 交给片元，把投影矩阵接上（three 注入的内置 attribute/uniform）。

varying vec2 v_uv;

void main() {
  v_uv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
