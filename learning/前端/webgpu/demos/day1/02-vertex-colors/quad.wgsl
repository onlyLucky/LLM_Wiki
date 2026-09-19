// Day 1 · Demo 02 —— 四边形顶点色
// 顶点数据来自 vertex buffer：position 在 @location(0)，color 在 @location(1)。
// 与 demo 01 的本质区别：颜色是数据，着色器只负责摆放它。

struct Uniforms {
  time: f32,      // 字节 0：秒
  _pad: f32,      // 字节 4：对齐填充，下一个 vec2f 按 8 字节对齐
  mouse: vec2f,   // 字节 8：鼠标 NDC 坐标（-1..1）
  aspect: f32,    // 字节 16：画布宽高比
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// 输入布局必须与 main.ts 里 buffers.attributes 一一对应
struct VertexIn {
  @location(0) position: vec2f, // 字节 0 起，float32x2
  @location(1) color: vec3f,    // 字节 8 起，float32x3
};

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f, // 交给光栅化阶段自动插值
};

@vertex
fn vs(vin: VertexIn) -> VertexOut {
  // 静态几何 + 缓慢动效：自转、漂移、视差全部由 uniform 驱动，
  // 顶点 buffer 一次写好之后不再更新
  let angle = 0.06 * sin(u.time * 0.25);
  let c = cos(angle);
  let s = sin(angle);
  let rotated = vec2f(
    vin.position.x * c - vin.position.y * s,
    vin.position.x * s + vin.position.y * c,
  );
  let drift = vec2f(0.035 * sin(u.time * 0.30), 0.030 * cos(u.time * 0.23));
  let parallax = u.mouse * 0.06;

  var out: VertexOut;
  out.position = vec4f(
    (rotated + drift + parallax) * vec2f(u.aspect, 1.0),
    0.0, 1.0,
  );
  out.color = vin.color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 鼠标横向在冷暖之间轻微拉动（上限 12%），亮度缓慢呼吸 ±5%
  let warm = vec3f(0.298, 0.435, 1.000); // 电蓝
  let cool = vec3f(0.176, 0.831, 0.749); // 青
  let pull = mix(cool, warm, u.mouse.x * 0.5 + 0.5);
  let shifted = mix(color, pull, 0.12);
  let breathe = 1.0 + 0.05 * sin(u.time * 0.9);
  return vec4f(shifted * breathe, 1.0);
}
