// Day 2 · 作业 challenge —— 粒子渲染着色器（骨架）
// 顶点着色器直读 storage（无顶点缓冲），quad 展开与速度色带是你的 TODO。

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
  let pt = particles[ii];
  let clip = u.vp * vec4f(pt.pos.xyz, 1.0);

  // TODO(day2-challenge-4): 把每个粒子展开成 6 顶点 quad（讲义 2.7）：
  //   var corners = array<vec2f, 6>(六个角，两行三列那种排法)
  //   out.position = clip + vec4f(corners[vi] * u.res.w / u.res.xy, 0.0, 0.0)
  //   ——投影之后加 NDC 偏移且不乘 clip.w，粒子随距离自然变小
  //   out.uv = corners[vi]
  // 占位：不展开，粒子是 1 像素点——完成前肉眼几乎不可见，属预期。
  var out: VOut;
  out.position = clip;
  out.uv = vec2f(0.0);
  out.speed = length(pt.vel.xyz);
  return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // TODO(day2-challenge-5): 速度 → 颜色映射（结构同讲义 2.7，色带换成火）：
  //   t = clamp(in.speed / 1.4, 0.0, 1.0)
  //   四段 smoothstep：暗红 #3B0D03 → 炽橙 #E85C1F → 金 #FFC24D → 白热 #FFF7E8
  //   mask = smoothstep(1.0, 0.2, length(in.uv)) 作为亮度（配合加法混合即辉光）
  // 占位：统一余烬暖橙。
  let mask = smoothstep(1.0, 0.15, max(length(in.uv), 0.0));
  return vec4f(vec3f(0.9, 0.4, 0.12) * mask, mask);
}
