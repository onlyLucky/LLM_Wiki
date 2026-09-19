// Day 2 · Demo 05 —— 计算着色器：64×64 点阵的状态更新
// 同一个模块两个入口：init 摆好初始格点，update 每帧积分。
// state buffer 在 compute 里 read_write，渲染的顶点着色器 read-only。

const GRID: u32 = 64u;

struct Sim {
  mouse: vec4f,  // xy 模拟空间光标（[-1,1]²）
  params: vec4f, // x 时间, y 步长 dt, z aspect, w 未用
};

@group(0) @binding(0) var<storage, read_write> pts: array<vec4f>;
@group(0) @binding(1) var<uniform> u: Sim;

// 二维 value noise：hash + smoothstep 插值（《Three.js 创意 3D》第 12 课的 WGSL 版）
fn hash21(p: vec2f) -> f32 {
  var p3 = fract(vec3f(p.x, p.y, p.x) * 0.1031);
  p3 = p3 + dot(p3, p3.yzx + vec3f(33.33));
  return fract((p3.x + p3.y) * p3.z);
}

fn vnoise(p: vec2f) -> f32 {
  let i = floor(p);
  let f = fract(p);
  let w = f * f * (3.0 - 2.0 * f);
  let a = hash21(i);
  let b = hash21(i + vec2f(1.0, 0.0));
  let c = hash21(i + vec2f(0.0, 1.0));
  let d = hash21(i + vec2f(1.0, 1.0));
  return mix(mix(a, b, w.x), mix(c, d, w.x), w.y) * 2.0 - 1.0;
}

// 格点 → [-1, 1]² 的「家」位置（模拟空间，不随画布宽高比变形）
fn homeOf(g: vec2u) -> vec2f {
  return (vec2f(g) / f32(GRID - 1u) - vec2f(0.5)) * 2.0;
}

@compute @workgroup_size(8, 8)
fn init(@builtin(global_invocation_id) gid: vec3u) {
  // 维度与 dispatch 不整除时，越界的 invocation 必须自己兜底
  if (gid.x >= GRID || gid.y >= GRID) { return; }
  let i = gid.y * GRID + gid.x;
  pts[i] = vec4f(homeOf(gid.xy), 0.0, 0.0);
}

@compute @workgroup_size(8, 8)
fn update(@builtin(global_invocation_id) gid: vec3u) {
  if (gid.x >= GRID || gid.y >= GRID) { return; }
  let i = gid.y * GRID + gid.x;
  let home = homeOf(gid.xy);

  let s = pts[i];
  var pos = s.xy;
  var vel = s.zw;

  // 弹簧：被驱散的点被拉回家
  var acc = (home - pos) * 16.0;

  // 噪声漂移：两张噪声图给一个缓慢游动的加速度场
  let t = u.params.x;
  acc += vec2f(
    vnoise(home * 2.1 + vec2f(t * 0.16, 0.0)),
    vnoise(home * 2.1 + vec2f(37.7, t * 0.14) + vec2f(11.3, 91.1)),
  ) * 0.6;

  // 鼠标斥力：光标附近的点被推开，越近越猛
  let dm = pos - u.mouse.xy;
  let d2 = dot(dm, dm) + 0.01;
  let d1 = sqrt(d2);
  acc += dm / d1 * (2.4 / (1.0 + d2 * 14.0));

  // 半隐式欧拉积分 + 阻尼（讲义 2.7 的同款状态机）
  let dt = u.params.y;
  vel = (vel + acc * dt) * exp(-4.5 * dt);
  pos = pos + vel * dt;

  pts[i] = vec4f(pos, vel);
}
