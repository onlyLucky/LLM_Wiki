#version 300 es
// Day 1 · 作业 A 答案 —— 片元着色器：暗场聚光
// 关键取舍：速度向量用「每帧差」而非「每秒差」——与 chrome 的
// 0.08 每帧 lerp 同一哲学；帧率不同的机器手感略有差异，风格化页面可接受。

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_down;
uniform vec2 u_vel;

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 LIT  = vec3(1.000, 0.757, 0.271); // #FFC145 暖琥珀
const vec3 HOT  = vec3(1.000, 0.953, 0.863); // 灯芯白热，近似 #FFF3DC

// 任务 4：讲义 1.6 原版——c1 = 1.70158 是过冲约 10% 的经典系数
// 乘法展开而非 pow(t - 1.0, 3.0)：GLSL 的 pow 负底数是 NaN（t = 0 时底数 -1.0），
// 会把整幅画面染白；x * x 恒非负、x * x * x 乘法保号，与 JS Math.pow 结果一致
float easeOutBack(float t) {
  t = clamp(t, 0.0, 1.0);
  float c1 = 1.70158;
  float c3 = c1 + 1.0;
  float x = t - 1.0;
  return 1.0 + c3 * x * x * x + c1 * x * x;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 暗场地板：网格 + 星屑（与骨架逐字一致）
  float aspect = u_resolution.x / u_resolution.y;
  vec2 gp = vec2(uv.x * aspect, uv.y) * 13.0;
  vec2 g2 = abs(fract(gp) - 0.5);
  float grid = smoothstep(0.40, 0.47, max(g2.x, g2.y));
  vec2 cell = floor(gp);
  vec2 sc = fract(gp) - 0.5;
  float star = step(0.965, fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453))
             * smoothstep(0.12, 0.04, length(sc));
  float floorTex = max(grid * 0.5, star);

  // 任务 2：居中等比，uv 与 u_mouse 同域（先居中再等比，中心才是 (0, 0)）
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= aspect;

  // 任务 4：按压收束——easeOutBack(u_down) 的过冲就是追光的「收紧再回」
  float scale = mix(1.0, 0.6, easeOutBack(u_down));

  // 任务 5：拖向甩长——局部坐标沿速度方向压缩（视觉拉长）
  vec2 v = vec2(u_vel.x * 2.0 * aspect, u_vel.y * 2.0); // 0–1 域换到居中域
  float speed = length(v);
  vec2 dir = speed > 1e-4 ? v / speed : vec2(1.0, 0.0); // 静止时给个安全方向
  float stretch = 1.0 + min(speed * 10.0, 0.7);         // 拉伸随速度，上限防飞出

  vec2 q = p - m;      // 光斑局部坐标
  float along = dot(q, dir);
  q -= dir * along * (1.0 - 1.0 / stretch); // 沿运动方向压缩
  float d = length(q) / scale;              // 任务 4 收束在此生效

  // 任务 3：pow 衰减的两层光照——lit 光池渐层、hot 灯芯白热
  float lit = pow(max(0.0, 1.0 - d / 0.47), 3.0);
  float hot = pow(max(0.0, 1.0 - d / 0.18), 2.0);

  // 收束时追光更亮（聚焦感）：scale 越小加得越多
  float gain = 1.0 + (1.0 - scale) * 0.9;

  vec3 color = BG + vec3(0.55, 0.65, 0.80) * floorTex * 0.035; // 暗态地板微光
  color += LIT * lit * 0.30 * gain;                    // 空气里的光
  color += vec3(0.65, 0.75, 0.90) * floorTex * lit * 1.15 * gain; // 地板显影
  color += mix(LIT, HOT, hot) * hot * 0.55;            // 灯芯

  // 暗角收边
  color *= 1.0 - 0.15 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
