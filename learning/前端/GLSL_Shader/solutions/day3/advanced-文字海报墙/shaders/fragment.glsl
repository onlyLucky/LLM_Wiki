// Day 3 · 作业 A · 答案 —— 片元着色器
// 波纹失真（adv-3）+ RGB shift（adv-4）+ 加分项描边 glow。
// 标准件（hash / noise / fbm / ac / sdBox 前四个）与骨架逐字一致。

varying vec2 v_uv;
uniform sampler2D u_tex;
uniform float u_time;
uniform vec2 u_mouse;   // 该卡局部 uv（0–1）
uniform float u_hover;  // 0→1 渐进强度
uniform float u_ripple; // 波纹半径（JS easeOutCubic 驱动）

// ---- 标准件（3.2 讲义同款）----
float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}
float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 4; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}
vec2 ac(vec2 p) { p.x *= 0.8; return p; } // 4:5 宽高比修正——否则波纹是椭圆

// 加分项：SDF 盒（demo 02 第 ④ 步同款），画 hover 描边 glow
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = v_uv;

  // 波纹失真四因子：ring（哪里动）× fbm（怎么动）× 0.35（动多深）× u_hover（开多大）
  // ——忘乘 u_hover 是最常见翻车：波纹永远全开，hover 的渐进感全无
  float d = distance(ac(uv), ac(u_mouse));
  float ring = smoothstep(u_ripple, u_ripple - 0.18, d) * step(d, u_ripple);
  vec2 flow = normalize(uv - u_mouse + 1e-4) * ring
            * fbm(uv * 6.0 + u_time * 0.3) * 0.35 * u_hover;
  vec2 suv = clamp(uv + flow, 0.001, 0.999); // 夹住采样别越界拉边

  // RGB shift：g 通道锚定原位，r/b 沿 x 反向各撕 1.2%——
  // 三个通道总有一个钉住，撕裂才读作「色差」而不是「重影」
  float shift = 0.012 * u_hover;
  vec3 col = vec3(texture2D(u_tex, suv + vec2(shift, 0.0)).r,
                  texture2D(u_tex, suv).g,
                  texture2D(u_tex, suv - vec2(shift, 0.0)).b);

  // 加分项：hover 描边 glow 随 u_hover 增强（边框在 uv 0.5 ± 0.46）
  float edge = -sdBox(uv - 0.5, vec2(0.46));      // 内正外负，0 = 边框线
  float glow = smoothstep(0.025, 0.0, abs(edge)) * u_hover;
  col += glow * vec3(1.0, 0.302, 0.427) * 0.55;   // ROSE #FF4D6D 同色光边

  gl_FragColor = vec4(col, 1.0);
}
