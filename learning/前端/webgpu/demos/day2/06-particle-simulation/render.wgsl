// Day 2 · Demo 06 —— 粒子渲染：顶点着色器直读 storage
// WebGPU 没有 gl_PointSize，point 恒 1 像素；放大靠 6 顶点 quad
// 实例化，颜色按速度映射：黑 → 深蓝 → 电蓝 → 白。

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
  @location(2) depth: f32, // 视深（远处微微压暗）
};

@vertex
fn vs(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  var corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let corner = corners[vi];
  let pt = particles[ii];

  var out: VOut;
  let clip = u.vp * vec4f(pt.pos.xyz, 1.0);
  // 投影之后再加偏移，且不乘 clip.w：粒子随距离自然变小（透视尺寸）
  out.position = clip + vec4f(corner * u.res.w / u.res.xy, 0.0, 0.0);
  out.uv = corner;
  out.speed = length(pt.vel.xyz);
  out.depth = clip.w;
  return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // 柔边圆点：mask 作为亮度，配合加法混合就是辉光
  let d = length(in.uv);
  let mask = smoothstep(1.0, 0.15, d);

  // 速度色带：黑 → 深蓝 → 电蓝 → 白
  let t = clamp(in.speed / 2.0, 0.0, 1.0);
  var col = mix(vec3f(0.010, 0.016, 0.055), vec3f(0.045, 0.090, 0.420), smoothstep(0.0, 0.45, t));
  col = mix(col, vec3f(0.298, 0.435, 1.000), smoothstep(0.40, 0.85, t));
  col = mix(col, vec3f(0.965, 0.975, 1.000), smoothstep(0.80, 1.0, t));

  // 远处压一点，加深层次
  col *= exp(-0.06 * in.depth);

  return vec4f(col * mask, mask);
}
