#version 300 es
// Day 1 · Demo 01 —— 片元着色器
// 顶点色插值 + 时间呼吸 + 鼠标色彩扰动（讲义 1.5–1.7 的三个考点合体）

precision highp float; // 片元着色器必须显式声明 float 精度（讲义 1.2）

uniform float u_time;  // 秒
uniform vec2 u_mouse;  // 平滑跟随的鼠标（0-1，y 左下原点）

in vec3 v_color; // 与 vertex.glsl 的 out 同名——链接器的接头暗号

out vec4 fragColor; // GLSL ES 3.00 无 gl_FragColor，必须自己声明输出

// 色板：玫红 → 天青（GLSL 课程主题双色渐变）
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

void main() {
  // 鼠标横向移动在玫红/天青之间轻微拉动整体色相（上限 15%）
  vec3 pull = mix(CYAN, ROSE, u_mouse.x);
  vec3 shifted = mix(v_color, pull, 0.15);

  // 亮度呼吸：与顶点同步，约 8 秒一个完整周期，幅度 ±6%
  float breathe = 1.0 + 0.06 * sin(u_time * 0.8);

  fragColor = vec4(shifted * breathe, 1.0);
}
