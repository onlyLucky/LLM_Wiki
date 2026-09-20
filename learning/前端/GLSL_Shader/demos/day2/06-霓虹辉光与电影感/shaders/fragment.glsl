#version 300 es
// Day 2 · Demo 06 —— 片元着色器：霓虹辉光与电影感
// Day 2 全部手法的一页汇报：SDF 圆环 + 高度场法线 + 双层 glow
// + 配方卡五步收尾。每个环节一个开关 uniform，键盘 A/B。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_fx_gamma;    // 开关 1
uniform float u_fx_contrast; // 开关 2
uniform float u_fx_sat;      // 开关 3
uniform float u_fx_grain;   // 开关 4
uniform float u_fx_vig;     // 开关 5

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D 主环
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0 内环

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 轻微整体旋转：环缓慢自转（0.05 rad/s），画面不死板
  float ca = cos(u_time * 0.05), sa = sin(u_time * 0.05);
  vec2 pr = mat2(ca, -sa, sa, ca) * p;

  // ---- 段 1：SDF 圆环（讲义 2.1）--------------------------------
  // 环 = 到圆心距离减环心半径，再 abs 减半环宽
  float sd = abs(length(pr) - 0.42) - 0.045;

  // ---- 段 2：高度场法线 + 朗伯（讲义 2.6）------------------------
  float h = 1.0 - smoothstep(0.0, 0.05, abs(sd));
  vec3 n = normalize(vec3(dFdx(h), dFdy(h), 0.04)); // z=0.04：金属浮雕档
  float lit = clamp(dot(n, normalize(vec3(-0.4, 0.7, 0.5))), 0.0, 1.0);

  // ---- 段 3：双层 glow（讲义 2.6）--------------------------------
  float g1 = pow(0.08 / (abs(sd) + 0.08), 2.0); // 主晕：窄亮（w=0.08）
  float g2 = pow(0.12 / (abs(sd) + 0.12), 2.0); // 次晕：宽柔（w=0.12）

  vec3 col = BG;
  col += ROSE * g1 * 0.9;   // 主环玫红
  col += CYAN * g2 * 0.5;   // 内环天青
  // 环体填充：金属色 + 朗伯体积感
  float fill = 1.0 - smoothstep(0.0, fwidth(sd), abs(sd));
  col = mix(col, vec3(0.94, 0.80, 0.86) * (0.4 + 0.6 * lit), fill);

  // ---- 段 4：配方卡五步（讲义 2.8，顺序即配方）-------------------
  if (u_fx_gamma > 0.5) col = pow(col, vec3(0.4545));
  if (u_fx_contrast > 0.5) col = (col - 0.5) * 1.06 + 0.5;
  if (u_fx_sat > 0.5) col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 0.9);
  if (u_fx_grain > 0.5) col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.04;
  if (u_fx_vig > 0.5) col *= 1.0 - 0.2 * pow(length(uv - 0.5), 2.0);

  fragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
