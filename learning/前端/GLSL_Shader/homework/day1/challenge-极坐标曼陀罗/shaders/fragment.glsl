#version 300 es
// Day 1 · 作业 C —— 片元着色器：极坐标曼陀罗
// 五段 TODO 从上到下：极坐标 → 对称折叠 → 花瓣 → 呼吸扰动 → 涟漪。
// 骨架可编译（uniform 全部声明、效果段保守占位），
// 每补全一段刷新一次，图案长出一层。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;  // 秒（与 clickTime 同基准，demo 05 同款约定）
uniform vec2 u_mouse;  // 平滑鼠标（0–1，左下原点）——扰动对称轴
uniform vec2 u_click;  // 最近一次点击（0–1，左下原点）
uniform float u_age;   // 点击年龄（秒）；从未点击时 JS 喂大数

out vec4 fragColor;

const float TAU = 6.2831853;
const vec3 BG   = vec3(0.043, 0.055, 0.078);  // #0B0E14
const vec3 AMBER = vec3(1.000, 0.757, 0.271); // #FFC145——challenge 档签名色

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 居中等比（脚手架，无需改动——A 档任务 2 的成品形态）
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // TODO(day1-ch-1)：极坐标换算——r = length(p)、angle = atan(p.y, p.x)。
  // 讲义 1.5 域变换的收尾；讲义 2.2 会把极坐标正式展开，这里先用手感。

  // TODO(day1-ch-2)：12 重对称——angle = mod(angle, TAU / 12.0) 后
  // 对扇区中线镜像（abs(angle - sector * 0.5)）。折叠后的角度只在
  // 半个扇区内活动，sin(angle * k) 的图案自动重复 12 次。
  // 自检技巧：先画一圈纯色细环 + sin 条纹，数一数重复次数再往下走。

  // TODO(day1-ch-3)：花瓣 SDF——半径随 sin(k * angle) 调制形成瓣形，
  // 整体旋转 u_time * 0.1（rad/s，约一分钟一圈）。建议两层同心
  // （内环细密、外环舒展）——曼陀罗的「满」从层次来。
  // 占位：无图案
  vec3 color = BG;

  // TODO(day1-ch-4)：呼吸（周期 4s、半径 ±6%）乘在花瓣半径上；
  // 鼠标扰动——angle 在折叠【前】加 u_mouse.x * 0.3（约 ±17°）：
  // 折叠前加是整体转轴（对称保持），折叠后加会撕碎 12 重对称。
  // 占位：无呼吸无扰动

  // TODO(day1-ch-5)：点击涟漪推开花瓣——波包（exp 衰减的环）沿径向
  // 扩散（速度参考 demo 05 的 0.45/秒），波前经过处花瓣半径向外
  // 鼓起再回落。u_age 喂大数时 exp 衰减自动安静，不需要任何 if。
  // 提示：u_click 要先换算到与 p 同域（居中 + x 乘 aspect）。
  // 占位：无涟漪

  // 暗角收边（脚手架，无需改动）
  color *= 1.0 - 0.15 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
