#version 300 es
// Day 2 · 作业 B 答案 —— 片元着色器：全息卡面
// 关键取舍：流光是加色不是 mix；呼吸乘尺寸不乘颜色；
// 恒定视觉宽靠 fwidth 不靠写死半宽。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D 渐变起点
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0 渐变终点
const vec3 HOLO = vec3(0.850, 0.950, 1.000); // 流光白青

// 任务 1：圆角方 SDF——sdBox 的 b 先减圆角、距离再往回收
float sdCard(vec2 p, float breath) {
  vec2 b = vec2(0.32, 0.42) * breath; // 任务 4：呼吸乘尺寸
  float r = 0.10;
  vec2 d = abs(p) - (b - r);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 任务 4：呼吸（3s、±4%）
  float breath = 1.0 + 0.04 * sin(u_time * 6.2831853 / 3.0);

  float sd = sdCard(p, breath);

  // 任务 2：填充 + 对角渐变（45°，分母 aspect + 1.0 归一化）
  float fill = 1.0 - smoothstep(0.0, fwidth(sd), sd);
  float t = clamp((p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5, 0.0, 1.0);
  vec3 body = mix(ROSE, CYAN, t);

  // 任务 3：描边——abs(sd) 的二次 SDF；
  // 半宽用 fwidth(sd) * 2.0：任何分辨率、任何位置都是恒定 2px 视觉宽
  float ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.012);

  // 任务 4：全息流光——两道相位错开的窄亮带更像 foil：
  // pow 6 的宽带铺底，pow 24 的窄线做高光棱线，相位差 2.6 错开
  float s1 = pow(0.5 + 0.5 * sin((p.x + p.y) * 12.0 - u_time * 2.0), 6.0);
  float s2 = pow(0.5 + 0.5 * sin((p.x + p.y) * 12.0 - u_time * 2.0 + 2.6), 24.0);
  float shimmer = s1 + s2 * 0.7;

  // 加分项：内框线——abs(sd) - 0.035 再收窄成细线
  float inner = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(abs(sd) - 0.035) - 0.003);

  vec3 col = BG;
  col = mix(col, body, fill);
  // 流光加色（不是 mix）：强度随呼吸同步呼吸（加分项）
  col += HOLO * shimmer * fill * (0.55 + 0.12 * sin(u_time * 6.2831853 / 3.0));
  // 描边微提亮 35%——同色系光边（设计细节，非任务要求）
  col = mix(col, body * 1.35, ring);
  // 内框线压暗 25%——像卡面的压印框（加分项）
  col = mix(col, body * 0.75, inner * fill * 0.6);

  // vignette 收边（非任务要求，成片感的顺手一刀）
  col *= 1.0 - 0.15 * pow(length(uv - 0.5), 2.0);

  fragColor = vec4(col, 1.0);
}
