#version 300 es
// Day 1 · 作业 B 答案 —— 片元着色器：脉动的画布
// 关键取舍：呼吸乘在 mix 的系数上而不是颜色上——后者会过曝。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;   // 任务 1
uniform vec3 u_colorA;  // 任务 1（颜色从 JS 上传——选择权在调用侧）
uniform vec3 u_colorB;  // 任务 1

out vec4 fragColor;

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 任务 2：居中等比（讲义 1.5 三行）
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 任务 3：对角投影 → 混合系数；sin 呼吸调系数（3s、8%）
  // 分母 (aspect + 1.0)：居中域里 p.x + p.y 的理论极值正好是 ±(aspect + 1)，
  // 除完落进 [-1, 1] 再折半加半——写 2 的话宽屏上渐变会截断在半途
  float diag = (p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5;
  float breath = sin(u_time * 6.2831853 / 3.0);
  float k = clamp(diag + breath * 0.08, 0.0, 1.0);
  vec3 color = mix(u_colorA, u_colorB, k);

  // 任务 4：vignette（0–1 域的 uv——暗角关心离屏幕中心多远，不是居中域）
  color *= 1.0 - 0.18 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
