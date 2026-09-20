#version 300 es
// Day 1 · Demo 02 —— 片元着色器：UV 仪表盘
// 你未来调试任何 shader 的第一块仪表盘：R 通道 = uv.x，G 通道 = uv.y。
// 看颜色就知道坐标，看坐标就知道颜色。

precision highp float; // 片元着色器必须显式声明 float 精度（讲义 1.2）

uniform vec2 u_resolution; // 画布尺寸（物理像素，与 gl_FragCoord 同域）
uniform vec2 u_mouse;      // 平滑鼠标（0-1，y 左下原点，chrome 已翻转）

out vec4 fragColor; // GLSL ES 3.00 无 gl_FragColor，必须自己声明输出

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

void main() {
  // 像素 → 归一化 UV：讲义 1.5 的第一行公式，所有 fragment 效果的起点
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // UV 调色板：R = 横向位置，G = 纵向位置，35% 叠在底色上
  // 左下角应当是黑的（0,0）——如果左上角是黑的，说明 y 翻转漏了
  vec3 palette = vec3(uv.x, uv.y, 0.12);
  vec3 color = mix(BG, palette, 0.35);

  // 画布中心十字参考线：确认 (0.5, 0.5) 落在正中
  float cross = step(abs(uv.y - 0.5), 0.0015) + step(abs(uv.x - 0.5), 0.0015);

  // 鼠标参考点：实心点 + 外圈光环（玫红）——它就是你
  float d = distance(uv, u_mouse);
  float spot = smoothstep(0.016, 0.013, d);
  float ring = smoothstep(0.004, 0.0015, abs(d - 0.028));

  color = mix(color, CYAN, clamp(cross, 0.0, 1.0) * 0.8);
  color = mix(color, ROSE, max(spot, ring));

  fragColor = vec4(color, 1.0);
}
