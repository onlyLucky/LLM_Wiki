#version 300 es
// Day 2 · Demo 04 —— 片元着色器：域扭曲流场
// 噪声塔的塔顶：fbm(p + fbm(p)·k) 双层 warp。
// 条纹相位混入 warp 后的 fbm——条纹沿场弯曲，「流」出来。
// warp 强度 k 随拖动速度 0.3 → 1.2：轻拖丝绸，猛拖熔岩。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_warp; // JS 侧维护的 warp 强度（0.3–1.2，随拖速）

out vec4 fragColor;

const vec3 BG  = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0

float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  float a = hash21(i);
  float b = hash21(i + vec2(1, 0));
  float c = hash21(i + vec2(0, 1));
  float d = hash21(i + vec2(1, 1));
  return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) {
    v += a * noise(p);
    p = m * p;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // ---- domain warping（讲义 2.4 塔顶）---------------------------
  // 第一层：扭曲场——两个分量的 fbm 错相位采样（5.2 / 1.3 是 iq 的错相偏移）
  vec2 q = vec2(
    fbm(p * 1.4 + vec2(0.0, u_time * 0.1)),
    fbm(p * 1.4 + vec2(5.2, 1.3) + vec2(u_time * 0.08, 0.0)));

  // 第二层：在扭曲后的坐标上采样——k 由 JS 按拖速喂（视觉规格 0.3–1.2）
  float f = fbm(p + u_warp * q);

  // ---- 条纹沿场流动：相位混入 warp 后的 fbm ----------------------
  float bands = 0.5 + 0.5 * sin((f + p.x * 0.5 + u_time * 0.22) * 18.0);

  vec3 col = BG;
  col += CYAN * bands * 0.25; // 天青 25% 透明度（视觉规格）

  // 高值区一点微亮：场强的可视化，别抢条纹的戏
  col += CYAN * pow(smoothstep(0.6, 0.95, f), 2.0) * 0.10;

  // vignette + grain ±2%（视觉规格）
  col *= 1.0 - 0.16 * pow(length(uv - 0.5), 2.0);
  col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.02;

  fragColor = vec4(col, 1.0);
}
