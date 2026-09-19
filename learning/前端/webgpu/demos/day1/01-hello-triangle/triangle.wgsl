// Day 1 · Demo 01 —— 三角形着色器
// 顶点：用 @builtin(vertex_index) 直接生成三个顶点（无顶点缓冲）
// 片元：顶点色插值 + 时间呼吸 + 鼠标色彩扰动

struct Uniforms {
  time: f32,      // 秒
  mouse: vec2f,   // 鼠标 NDC 坐标（-1..1）
  aspect: f32,    // 画布宽高比，用于把等腰三角形拉回视觉等边
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// 色板：电蓝 → 紫（课程 Day 1 主题双色渐变）
const BLUE: vec3f = vec3f(0.298, 0.435, 1.000); // #4C6FFF
const VIOLET: vec3f = vec3f(0.545, 0.361, 0.965); // #8B5CF6

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f, // 顶点色，光栅化阶段自动插值
};

@vertex
fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
  // 三个顶点画在以原点为中心的等腰三角形上
  var positions = array<vec2f, 3>(
    vec2f(0.00, 0.42),
    vec2f(-0.38, -0.26),
    vec2f(0.38, -0.26),
  );
  // 顶点色：上电蓝、左下紫、右下蓝紫各半
  var colors = array<vec3f, 3>(BLUE, VIOLET, mix(BLUE, VIOLET, 0.5));

  let breathe = 1.0 + 0.02 * sin(u.time * 0.8); // 缓慢的整体呼吸
  let parallax = u.mouse * 0.03; // 鼠标视差，克制在小范围内

  var out: VertexOut;
  out.position = vec4f(
    (positions[i] * breathe + parallax) * vec2f(u.aspect, 1.0) * 0.9,
    0.0, 1.0,
  );
  out.color = colors[i];
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 鼠标横向移动在蓝紫之间轻微拉动整体色相（上限 15%）
  let pull = mix(VIOLET, BLUE, u.mouse.x * 0.5 + 0.5);
  let shifted = mix(color, pull, 0.15);
  // 亮度呼吸与顶点同步，幅度 ±6%
  let breathe = 1.0 + 0.06 * sin(u.time * 0.8);
  return vec4f(shifted * breathe, 1.0);
}
