#version 300 es
// Day 1 · 作业 A 答案 —— 片元着色器：追光的萤火
// 关键取舍：速度向量用「每帧差」而非「每秒差」——与 chrome 的
// 0.08 每帧 lerp 同一哲学；帧率不同的机器手感略有差异，风格化页面可接受。

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;
uniform float u_down;
uniform vec2 u_vel;

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0
const vec3 HOT  = vec3(1.000, 0.930, 0.850); // 白热偏暖，近似 #FFEDD9

// 任务 4：讲义 1.6 原版——c1 = 1.70158 是过冲约 10% 的经典系数
float easeOutBack(float t) {
  t = clamp(t, 0.0, 1.0);
  float c1 = 1.70158;
  float c3 = c1 + 1.0;
  return 1.0 + c3 * pow(t - 1.0, 3.0) + c1 * pow(t - 1.0, 2.0);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // 任务 2：居中等比，uv 与 u_mouse 同域（先居中再等比，中心才是 (0, 0)）
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;
  vec2 m = u_mouse * 2.0 - 1.0;
  m.x *= aspect;

  // 任务 4：按压收缩——easeOutBack(u_down) 的过冲就是回弹本身
  float scale = mix(1.0, 0.6, easeOutBack(u_down));

  // 任务 5：拖向拉伸——局部坐标沿速度方向压缩（视觉拉长）
  vec2 v = vec2(u_vel.x * 2.0 * aspect, u_vel.y * 2.0); // 0–1 域换到居中域
  float speed = length(v);
  vec2 dir = speed > 1e-4 ? v / speed : vec2(1.0, 0.0); // 静止时给个安全方向
  float stretch = 1.0 + min(speed * 10.0, 0.7);         // 拉伸随速度，上限防飞出

  vec2 q = p - m;      // 萤火局部坐标
  float along = dot(q, dir);
  q -= dir * along * (1.0 - 1.0 / stretch); // 沿运动方向压缩
  float d = length(q) / scale;              // 任务 4 收缩在此生效

  // 任务 3：径向 glow——pow 衰减两层，外圈天青、核心白热
  float radius = 0.18;
  float halo = pow(max(0.0, 1.0 - d / (radius * 2.6)), 3.0);
  float core = pow(max(0.0, 1.0 - d / radius), 2.0);

  vec3 color = BG;
  color += CYAN * halo * 0.45;
  color += mix(CYAN, HOT, core) * core;

  // 暗角收边
  color *= 1.0 - 0.15 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
