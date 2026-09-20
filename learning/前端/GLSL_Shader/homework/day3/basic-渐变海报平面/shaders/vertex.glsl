// Day 3 · 作业 B —— 顶点着色器
// ShaderMaterial 已内置注入：attribute position / uv、uniform projectionMatrix / modelViewMatrix。
// 你的活儿只有透传（TODO(day3-basic-2)）——对照 3.1 讲义「内置注入」表。

// TODO(day3-basic-2)：声明 varying
// varying vec2 v_uv;

void main() {
  // TODO(day3-basic-2)：两行补全——
  //   1) v_uv = uv;
  //   2) gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  gl_Position = vec4(position, 1.0); // 占位：可编译但画面不对，替换成上面两行
}
