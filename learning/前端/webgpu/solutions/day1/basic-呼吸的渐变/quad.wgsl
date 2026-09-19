// Day 1 · 作业 B —— 呼吸的渐变（参考答案）
// 顶点色（buffer 提供）沿对角线从紫渐到青；
// fs 用 uniform time 让两组颜色呼吸交换，加分项：aspect 防拉伸 + 鼠标色彩扰动。

// 32 字节布局，与 demo 01 同款：time@0、填充@4、mouse@8、aspect@16
struct Uniforms {
  time: f32,      // 字节 0：秒
  _pad: f32,      // 字节 4：对齐填充，下一个 vec2f 按 8 字节对齐
  mouse: vec2f,   // 字节 8：鼠标 NDC 坐标（-1..1）
  aspect: f32,    // 字节 16：画布宽高比
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// 两组颜色的端点：与 main.ts 顶点数据里的 VIOLET / TEAL 一致
const C_LOW: vec3f = vec3f(0.545, 0.361, 0.965);  // 紫 #8B5CF6（左下的颜色）
const C_HIGH: vec3f = vec3f(0.176, 0.831, 0.749); // 青 #2DD4BF（右上的颜色）

// 输入布局与 main.ts 里 buffers.attributes 一一对应
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
  var out: VertexOut;
  // 加分项：宽屏下 x 乘 aspect 抵消画布拉伸，任意窗口比例四边形都是正方形
  out.position = vec4f(vin.position * vec2f(u.aspect, 1.0), 0.0, 1.0);
  out.color = vin.color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 呼吸交换：k 在 0 → 1 → 0 之间平滑循环，周期约 7 秒
  let k = 0.5 + 0.5 * sin(u.time * 0.9);
  // 反向渐变的颜色：对角线上对称位置的颜色，无需重算位置插值
  let swapped = C_LOW + C_HIGH - color;
  var mixed = mix(color, swapped, k);

  // 加分项：鼠标轻微色彩扰动——横移在冷暖色温之间微调，纵移微调亮度
  let warm = vec3f(1.05, 0.99, 0.92);
  let cool = vec3f(0.92, 0.99, 1.05);
  let tint = mix(warm, cool, u.mouse.x * 0.5 + 0.5);
  let shade = 1.0 + 0.08 * u.mouse.y;
  mixed *= tint * shade;

  return vec4f(mixed, 1.0);
}
