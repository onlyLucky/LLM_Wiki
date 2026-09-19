// Day 1 · Demo 04 —— uniform 驱动的三角环
// 9 个顶点 = 3 个轨道 × 3 个顶角，全部由 vertex_index 推导；
// 半径、转速、色相相位也由环号推导。动画的唯一来源是每帧
// 更新的 uniform：着色器代码本身一行不改。

struct Uniforms {
  time: f32,      // 字节 0：秒
  _pad: f32,      // 字节 4：对齐填充，下一个 vec2f 按 8 字节对齐
  mouse: vec2f,   // 字节 8：鼠标 NDC 坐标（-1..1）
  aspect: f32,    // 字节 16：画布宽高比
};

@group(0) @binding(0) var<uniform> u: Uniforms;

const BLUE: vec3f = vec3f(0.298, 0.435, 1.000); // #4C6FFF 电蓝
const TEAL: vec3f = vec3f(0.176, 0.831, 0.749); // #2DD4BF 青
const TAU: f32 = 6.28318530718;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f, // 三角形三顶角同色，插值后仍为纯色
};

@vertex
fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
  let ring = i / 3u;   // 轨道号 0..2，决定半径、转速与色相相位
  let corner = i % 3u; // 三角形的三个顶角

  // 单位等边三角形（以自身中心为原点，顶点朝上）
  var tri = array<vec2f, 3>(
    vec2f(0.000, 1.000),
    vec2f(-0.866, -0.500),
    vec2f(0.866, -0.500),
  );

  // 自转：内环快外环慢；公转：三轨道相位错开 120°
  let spin = u.time * (0.55 - 0.12 * f32(ring));
  let orbit = u.time * 0.22 + f32(ring) * (TAU / 3.0);
  let radius = 0.18 + 0.28 * f32(ring);
  let size = 0.13;

  let c = cos(spin);
  let s = sin(spin);
  let local = vec2f(
    tri[corner].x * c - tri[corner].y * s,
    tri[corner].x * s + tri[corner].y * c,
  ) * size;
  let center = vec2f(cos(orbit), sin(orbit)) * radius;
  let parallax = u.mouse * 0.05;

  // 色相在电蓝 ↔ 青之间循环，各轨道相位错开，形成流动感
  let phase = u.time * 0.6 + f32(ring) * (TAU / 3.0);
  let hue = 0.5 + 0.5 * sin(phase);

  var out: VertexOut;
  out.position = vec4f(
    (local + center + parallax) * vec2f(u.aspect, 1.0),
    0.0, 1.0,
  );
  out.color = mix(BLUE, TEAL, hue);
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 亮度呼吸 ±6%，与色相循环共用同一时间轴
  let breathe = 1.0 + 0.06 * sin(u.time * 0.6);
  return vec4f(color * breathe, 1.0);
}
