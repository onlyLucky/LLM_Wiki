// Day 2 · Demo 05 —— 点阵渲染：顶点着色器直读 storage buffer
// WebGPU 的 point 恒为 1 像素，放大显示用 6 顶点小 quad（instancing）。

const GRID: u32 = 64u;

struct Render {
  res: vec4f, // xy 物理像素分辨率, z aspect, w 点直径（物理像素）
};

@group(0) @binding(0) var<storage, read> pts: array<vec4f>;
@group(0) @binding(1) var<uniform> u: Render;

fn homeOf(g: vec2u) -> vec2f {
  return (vec2f(g) / f32(GRID - 1u) - vec2f(0.5)) * 2.0;
}

struct VOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,   // quad 局部坐标 -1..1
  @location(1) energy: f32, // 离家距离 + 速度 → 激活度
};

@vertex
fn vs(@builtin(vertex_index) vi: u32, @builtin(instance_index) ii: u32) -> VOut {
  // 动态索引的本地数组必须 var 声明（let 不行，讲义 1.4 的坑）
  var corners = array<vec2f, 6>(
    vec2f(-1.0, -1.0), vec2f(1.0, -1.0), vec2f(-1.0, 1.0),
    vec2f(-1.0, 1.0), vec2f(1.0, -1.0), vec2f(1.0, 1.0),
  );
  let corner = corners[vi];

  let s = pts[ii];
  // 模拟空间 → NDC：保证点阵始终是正方形，四周留 12% 边距
  let a = u.res.z;
  let scale = vec2f(min(1.0, 1.0 / a), min(1.0, a)) * 0.88;
  let center = s.xy * scale;

  var out: VOut;
  // NDC 偏移 = corner · 直径 / 分辨率：物理像素级的恒定尺寸
  out.position = vec4f(center + corner * u.res.w / u.res.xy, 0.0, 1.0);
  out.uv = corner;

  // 激活度 = 被驱散的程度（离家距离）+ 当前速度
  let home = homeOf(vec2u(ii % GRID, ii / GRID));
  out.energy = clamp(distance(s.xy, home) * 2.4 + length(s.zw) * 0.6, 0.0, 1.0);
  return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  let d = length(in.uv);
  var alpha = smoothstep(1.0, 0.35, d);
  alpha = alpha * alpha; // 边缘再柔一点

  // 静息是青，被扰动后往电蓝跑
  let teal = vec3f(0.176, 0.831, 0.749);
  let blue = vec3f(0.298, 0.435, 1.000);
  var col = mix(teal * 0.5, mix(teal, blue, 0.7), in.energy);
  col += in.energy * 0.12;

  let a = alpha * (0.55 + 0.45 * in.energy);
  // 预乘 alpha 输出，配合 one / one-minus-src-alpha 混合
  return vec4f(col * a, a);
}
