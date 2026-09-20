// Day 3 · 作业 A —— 片元着色器
// 标准件已备好（hash / noise / fbm / ac），你的活儿：波纹失真（TODO-3）+ RGB shift（TODO-4）。

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

void main() {
  vec2 uv = v_uv;

  // TODO(day3-adv-3)：波纹失真——ring（几何）× fbm（液体），从光标局部扩散
  //   float d = distance(ac(uv), ac(u_mouse));
  //   float ring = smoothstep(u_ripple, u_ripple - 0.18, d) * step(d, u_ripple);
  //   vec2 flow = normalize(uv - u_mouse + 1e-4) * ring
  //             * fbm(uv * 6.0 + u_time * 0.3) * 0.35 * u_hover;
  //   uv = clamp(uv + flow, 0.001, 0.999);

  // TODO(day3-adv-4)：RGB shift 联动 hover（最大 1.2%，g 通道锚定）
  //   float shift = 0.012 * u_hover;
  //   col = vec3(texture2D(u_tex, uv + vec2(shift, 0.0)).r,
  //              texture2D(u_tex, uv).g,
  //              texture2D(u_tex, uv - vec2(shift, 0.0)).b);

  vec3 col = texture2D(u_tex, uv).rgb; // 占位：无失真直采
  gl_FragColor = vec4(col, 1.0);
}
