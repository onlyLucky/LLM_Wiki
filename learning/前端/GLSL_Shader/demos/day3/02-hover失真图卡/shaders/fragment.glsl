// Day 3 · Demo 02 —— fragment：波纹失真 + RGB shift + 内发光 + 收尾两步
// 链路（3.2 讲义 How 段）：视差采样 → 波纹 flow 掰弯 uv → RGB shift → 收尾
// 风格照 3.1 对照表：不写 #version、不声明 precision、出口写 gl_FragColor。

varying vec2 v_uv; // 顶点透传的图卡局部坐标——varying 是接头暗号，两侧都得自己声明

uniform sampler2D u_tex;
uniform float u_time;
uniform vec2  u_mouse;    // 图卡局部 uv（0–1；光标在图卡外时距离照算，场自然趋零）
uniform float u_hover;    // 渐进强度 0→1（不是开关）
uniform float u_ripple;   // 波纹半径（JS 侧 easeOutCubic 驱动，最大 0.9）
uniform vec2  u_parallax; // 内容视差（图卡局部 uv 单位，最大 ±2.5%）

// ac：4:5 宽高比修正——距离计算前把 x 压回物理等比，否则波纹是椭圆
vec2 ac(vec2 p) { p.x *= 0.8; return p; }

float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}
float fbm(vec2 p) {          // 3 octave：环带边缘的液体感，够用且便宜
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 3; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; }
  return v;
}
float sdBox(vec2 p, vec2 b) {
  vec2 d = abs(p) - b;
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
}

void main() {
  vec2 uv = v_uv;

  // ① 视差采样：内容跟随鼠标偏移 5%（clamp 防边缘露底拉丝）
  vec2 suv = clamp(uv - u_parallax, 0.001, 0.999);

  // ② 波纹失真：失真场（几何：半径随时间扩张）× fbm（液体：边缘不规则）
  float d = distance(ac(uv), ac(u_mouse));
  float ring = smoothstep(u_ripple, u_ripple - 0.18, d) * step(d, u_ripple);
  vec2 flow = normalize(uv - u_mouse + 1e-4)
            * ring * fbm(uv * 6.0 + u_time * 0.3) * 0.35 * u_hover;
  vec2 distortedUv = clamp(suv + flow, 0.001, 0.999);

  // ③ RGB shift：最大 1.2%，g 通道取中心采样作锚——色散才读作镜头色散而不是糊
  float shift = 0.012 * u_hover;
  float r = texture2D(u_tex, distortedUv + vec2(shift, 0.0)).r;
  float g = texture2D(u_tex, distortedUv).g;
  float b = texture2D(u_tex, distortedUv - vec2(shift, 0.0)).b;
  vec3 col = vec3(r, g, b);

  // ④ 内侧边缘微光（2.6 手法）：sdBox glow，亮度与 hover 联动
  vec2 q = vec2((uv.x - 0.5) * 1.6, (uv.y - 0.5) * 2.0);
  float sd = sdBox(q, vec2(0.72, 0.92));
  float glow = exp(-abs(sd) * 26.0) * (0.5 + u_hover * 0.5);
  col += vec3(0.298, 0.624, 0.941) * glow * 0.35;

  // ⑤ 收尾两步（2.8 配方卡的图卡版）：vignette 12% + grain 3%
  col *= 1.0 - 0.12 * pow(length(uv - 0.5) * 1.4, 2.0);
  col += (hash(gl_FragCoord.xy + fract(u_time) * 61.7) - 0.5) * 0.06;

  gl_FragColor = vec4(col, 1.0);
}
