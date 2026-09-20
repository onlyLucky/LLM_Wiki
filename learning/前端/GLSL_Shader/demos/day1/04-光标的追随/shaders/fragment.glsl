#version 300 es
precision highp float;

// Day 1 · Demo 04 —— 片元着色器：光标的追随
// 对应讲义 1.7：u_mouse 用 chrome.pointer.sx/sy（已 lerp、已 y 翻转），
// 拖尾 u_tail 与按压 u_press 的惯性在 JS 侧维护——shader 只管画。

uniform vec2 u_resolution;
uniform vec2 u_mouse;   // lerp 0.08 的平滑坐标（chrome 提供）
uniform vec2 u_tail;    // lerp 0.03 的更慢坐标——拖尾（main.ts 自维护）
uniform float u_press;  // 按压强度 0-1，JS 侧已做惯性

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // aspect 修正：x 方向先拉平，距离场才是「圆形的」——宽屏不修就是椭圆
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p    = vec2(uv.x * aspect, uv.y);
  vec2 m    = vec2(u_mouse.x * aspect, u_mouse.y);
  vec2 tail = vec2(u_tail.x * aspect,  u_tail.y);

  // 按压反馈：半径 12% → 7% 收缩，亮度 ×1.4
  float radius = mix(0.12, 0.07, u_press);
  float boost  = 1.0 + 0.4 * u_press;

  // 主光晕：exp 衰减——中心亮、边缘无限柔，比 smoothstep 的平肩自然
  float dMain = distance(p, m);
  float glow  = exp(-dMain / radius * 3.0);

  // 拖尾光晕：更慢的坐标 + 更低强度，两层叠加产生「跟不太上」的丝滑层次
  float dTail = distance(p, tail);
  float wake  = exp(-dTail / (radius * 1.6) * 3.0) * 0.35;

  vec3 color = BG;
  color += CYAN * wake * boost;
  color += ROSE * glow * boost;

  // 白热核心：中心一点过曝，避免大面积糊红
  float core = exp(-dMain / radius * 12.0);
  color += vec3(1.0) * core * 0.5 * boost;

  fragColor = vec4(color, 1.0);
}
