// Day 3 · Demo 01 —— fragment shader：Day 2 作业 B 的全息卡面，GLSL1 风格重铸
// 风格对照（讲义 3.1）：不写 #version、不声明 precision（three 注入）、
// 输出写进 gl_FragColor（不再声明 out 变量）。
// 卡面视觉与 Day 2 作业 B 答案逐行同源：同一只圆角方、同一套色板、同一个呼吸与流光。
// v_uv 本页透传未用——卡面域换算仍走 gl_FragCoord；uv 要到 demo 02 的图卡上才当主角。

uniform float u_time;
uniform vec2  u_resolution;
uniform vec2  u_parallax;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0
const vec3 HOLO = vec3(0.850, 0.950, 1.000); // 流光白青

// Day 2 同款圆角方 SDF：b 先收进圆角，距离再往回补
float sdCard(vec2 p, float breath) {
  vec2 b = vec2(0.32, 0.42) * breath;
  float r = 0.10;
  vec2 d = abs(p) - (b - r);
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

void main() {
  // gl_FragCoord 在 three 里照常可用：1.5 节的坐标学原封不动
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // 视差：整体域偏移 3%，x 乘 aspect 保持视觉等比（TS 侧已 lerp 0.08 平滑）
  p -= u_parallax * vec2(aspect, 1.0);

  // 呼吸：3s 周期 ±4%，乘尺寸不乘颜色（乘颜色会过曝）
  float breath = 1.0 + 0.04 * sin(u_time * 6.2831853 / 3.0);

  float sd = sdCard(p, breath);
  float fill = 1.0 - smoothstep(0.0, fwidth(sd), sd);
  // 描边：abs(sd) 的二次 SDF，半宽 fwidth×2 恒定视觉宽
  float ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.012);

  // 45° 对角渐变：玫红 → 天青
  float t = clamp((p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5, 0.0, 1.0);
  vec3 body = mix(ROSE, CYAN, t);

  // 全息流光：pow 6 宽带铺辉 + pow 24 窄线棱光，相位差 2.6 错开
  float s1 = pow(0.5 + 0.5 * sin((p.x + p.y) * 12.0 - u_time * 2.0), 6.0);
  float s2 = pow(0.5 + 0.5 * sin((p.x + p.y) * 12.0 - u_time * 2.0 + 2.6), 24.0);
  float shimmer = s1 + s2 * 0.7;

  // 内框线：abs(sd) - 0.035 的等距线再收窄成细线
  float inner = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(abs(sd) - 0.035) - 0.003);

  vec3 col = BG;
  col = mix(col, body, fill);
  // 流光加色不是 mix：亮部推向过曝白才是 foil；强度随呼吸同步
  col += HOLO * shimmer * fill * (0.55 + 0.12 * sin(u_time * 6.2831853 / 3.0));
  col = mix(col, body * 1.35, ring); // 描边提亮，与填充同色系但跳出来
  col = mix(col, body * 0.75, inner * fill * 0.6); // 压印内框
  col *= 1.0 - 0.15 * pow(length(uv - 0.5), 2.0);

  gl_FragColor = vec4(col, 1.0); // three 版出口：内置变量，不用声明
}
