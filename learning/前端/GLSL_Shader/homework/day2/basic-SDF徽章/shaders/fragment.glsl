#version 300 es
// Day 2 · 作业 B —— 片元着色器：SDF 徽章
// 四个 TODO 从上到下：圆角方 SDF → 填充 → 描边 → 呼吸与渐变。
// 骨架可编译（占位画面 = 纯底色），补全一段刷新一次。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D 描边
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0 渐变起点

// TODO(day2-basic-1)：圆角方 SDF——讲义 2.1 的 sdBox 迁移 + 圆角参数
// 提示：sdRoundBox(p, b, r) = sdBox(p, b - r) - r；
// 建议 b ≈ (0.32, 0.42)、r ≈ 0.10；b 记得乘 breath（任务 4 的呼吸乘尺寸）
float sdBadge(vec2 p, float breath) {
  return 999.0; // 占位：形状不存在——任务 1 完成后徽章点亮，删掉这行
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // TODO(day2-basic-4)：呼吸——周期 3s、幅度 ±4%
  // 提示：breath = 1.0 + 0.04 * sin(u_time * 6.2831853 / 3.0)；
  // 乘在 sdBadge 的尺寸上，不是颜色上（乘颜色会过曝）
  float breath = 1.0; // 占位：静止

  float sd = sdBadge(p, breath);

  // TODO(day2-basic-2)：填充——smoothstep + fwidth 抗锯齿一行
  // fill = 1.0 - smoothstep(0.0, fwidth(sd), sd)
  float fill = 0.0; // 占位：无填充

  // TODO(day2-basic-3)：描边——abs(sd) 的二次 SDF
  // ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.01)
  // 0.01 是描边半宽；换 fwidth(sd) * 2.0 得到恒定 2px 视觉宽（验收条款）
  float ring = 0.0; // 占位：无描边

  // TODO(day2-basic-4)：内部对角渐变——(p.x + p.y) 归一化到 0–1 后
  // mix(ROSE, CYAN, t) 作为填充色；方向斜向 45°（验收条款）。
  // 归一化分母参考讲义 1.5 的 Day 1 B 档：aspect + 1.0

  vec3 col = BG;
  // 组装顺序（任务 2/3/4 完成后在此合成）：
  // col = mix(col, 对角渐变色, fill);
  // col = mix(col, ROSE, ring);

  fragColor = vec4(col, 1.0);
}
