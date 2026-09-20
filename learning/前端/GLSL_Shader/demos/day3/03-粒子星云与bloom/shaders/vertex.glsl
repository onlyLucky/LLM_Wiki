// Day 3 · Demo 03 —— 顶点：无状态动画（输入只有出生位与时间，输出与历史无关）

uniform float u_time;
uniform float u_amp;    // 噪声位移幅度
uniform float u_size;   // 基准尺寸（距离 300 处的像素直径）
uniform vec2  u_mouse3; // 光标在 z=0 平面的世界坐标
uniform float u_push;   // 避让强度（JS 侧 lerp 渐进）

varying float v_r; // 出生半径 → 片元按它 mix 两色

// ---- Day 2 标准件：hash / value noise / fbm（按 3.1 风格表原样换口）----
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
float fbm(vec2 p) { // 顶点噪声纪律：3 octave 封顶（两万粒子 × 5 倍频是帧率刺客）
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 3; i++) {
    v += a * noise(p);
    p *= 2.0;
    a *= 0.5;
  }
  return v;
}

void main() {
  vec3 pos = position; // position 里存的是出生位（一次性生成、永不更新）

  // 三路 2D 噪声伪向量场：xy / yz / zx 三个投影面，时间系数故意不等（0.20/0.17/0.13）
  // 场缓慢「错动」而不是整体平移；-0.5 居中让星云绕原点呼吸
  float n1 = fbm(pos.xy * 1.5 + u_time * 0.20);
  float n2 = fbm(pos.yz * 1.5 - u_time * 0.17);
  float n3 = fbm(pos.zx * 1.5 + u_time * 0.13);
  pos += (vec3(n1, n2, n3) - 0.5) * 2.0 * u_amp;

  // 鼠标避让：高斯衰减推力——光标邻域让路，随噪声场自然回流（没有一个 if 维护状态）
  float d = distance(pos.xy, u_mouse3);
  float push = exp(-d * d * 6.0) * u_push;
  pos.xy += normalize(pos.xy - u_mouse3 + 1e-4) * push;

  v_r = length(position); // 出生半径（不含位移）——配色按「出身」不按当下位置

  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = u_size * (300.0 / -mvPosition.z); // 近大远小，300.0 是标定常数
  gl_Position = projectionMatrix * mvPosition;
}
