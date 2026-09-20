#version 300 es
precision highp float;

// Day 1 · Demo 05 —— 片元着色器：点击的涟漪
// 对应讲义 1.7：click 瞬间只留下三个数（时刻/位置/颜色），
// 之后每一帧涟漪的形状都是 u_age（点击年龄）的函数——
// 波前扩散、环宽展宽、亮度衰减，全部由年龄推演，shader 无状态。

uniform vec2 u_resolution;
uniform vec2 u_click;    // 最近一次点击位置（归一化 0-1，左下原点）
uniform float u_age;     // 点击年龄（秒）；从未点击时 JS 喂一个大数
uniform float u_hue;     // 0 = 玫红，1 = 天青——JS 侧每次点击翻转

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // aspect 修正：距离场先拉平，涟漪才是圆的（demo 04 同款陷阱）
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = vec2(uv.x * aspect, uv.y);
  vec2 c = vec2(u_click.x * aspect, u_click.y);

  // 波前半径：0.45/秒 的扩散速度，约 3 秒走完大半个画面
  float r = u_age * 0.45;
  float d = distance(p, c);

  // 波环：|d - r| 落在环宽内的像素亮起；环越走越宽，亮度越走越弱
  float width = 0.015 + u_age * 0.02;         // 环宽 1.5% 起步，每秒展宽 2%
  float ring  = smoothstep(width, 0.0, abs(d - r));
  float fade  = exp(-u_age * 1.2);            // 指数衰减：约 3 秒消散

  // 水面质感：环内叠一圈正弦细纹（频率 80），随波前一起走
  float ripple = (sin((d - r) * 80.0) * 0.5 + 0.5) * ring * fade * 0.35;

  vec3 accent = mix(ROSE, CYAN, u_hue);

  vec3 color = BG;
  color += accent * ring * fade;
  color += accent * ripple;

  // 落点余晖：中心一点光，比环身熄灭得更快
  float ember = exp(-d * 18.0) * exp(-u_age * 3.0);
  color += accent * ember * 0.6;

  fragColor = vec4(color, 1.0);
}
