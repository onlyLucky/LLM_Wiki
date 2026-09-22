// Day 2 · 作业 challenge —— 粒子渲染着色器（参考答案）
// 顶点着色器直读 storage（无顶点缓冲），6 顶点 quad 展开，
// 颜色按速度映射：暗红 → 炽橙 → 金 → 白热。

struct Particle {
  pos: vec4f,
  vel: vec4f,
};

struct Render {
  vp: mat4x4f,
  res: vec4f, // xy 分辨率, z aspect, w 粒子直径（物理像素）
};

@group(0) @binding(0) var<storage, read> particles: array<Particle>;
@group(0) @binding(1) var<uniform> u: Render;

struct VOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,  // quad 局部坐标 -1..1
  @location(1) speed: f32,
};

@vertex
fn vs(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  // 动态索引的本地数组必须 var 声明（讲义 1.4 的坑）
  var corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let corner = corners[vi];
  let pt = particles[ii];

  var out: VOut;
  let clip = u.vp * vec4f(pt.pos.xyz, 1.0);
  // 投影之后再加 NDC 偏移，且不乘 clip.w：粒子随距离自然变小（透视尺寸）
  out.position = clip + vec4f(corner * u.res.w / u.res.xy, 0.0, 0.0);
  out.uv = corner;
  out.speed = length(pt.vel.xyz);
  return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // 速度色带：暗红 #3B0D03 → 炽橙 #E85C1F → 金 #FFC24D → 白热 #FFF7E8
  let t = clamp(in.speed / 1.4, 0.0, 1.0);
  var col = mix(vec3f(0.231, 0.051, 0.012), vec3f(0.910, 0.361, 0.122), smoothstep(0.0, 0.40, t));
  col = mix(col, vec3f(1.000, 0.761, 0.302), smoothstep(0.38, 0.85, t));
  col = mix(col, vec3f(1.000, 0.969, 0.910), smoothstep(0.80, 1.0, t));

  // 柔边圆点：mask 作为亮度，配合加法混合就是辉光
  let mask = smoothstep(1.0, 0.2, length(in.uv));
  return vec4f(col * mask, mask);
}
