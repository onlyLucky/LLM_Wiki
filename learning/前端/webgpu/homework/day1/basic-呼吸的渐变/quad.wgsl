// Day 1 · 作业 B —— 呼吸的渐变
// 顶点色（buffer 提供）沿对角线从紫渐到青；
// 你的任务在 fs：用 uniform time 让两组颜色呼吸交换（TODO 见下）。

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
  // 未完成时先画静态四边形；完成 fs 的任务后，有余力可在这里
  // 乘 vec2f(u.aspect, 1.0) 防止宽屏下拉伸
  out.position = vec4f(vin.position, 0.0, 1.0);
  out.color = vin.color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // TODO(day1-basic-2): 声明 uniform 并实现呼吸交换
  //   1. struct Uniforms { time: f32 } 起步即可（完整方案抄 demo 01 的 32 字节布局）
  //   2. @group(0) @binding(0) var<uniform> u: Uniforms;
  //   3. 交换的算法：
  //      let k = 0.5 + 0.5 * sin(u.time * 0.9);   // 0 → 1 → 0 循环
  //      let swapped = C_LOW + C_HIGH - color;     // 反向渐变的颜色
  //      return vec4f(mix(color, swapped, k), 1.0);
  return vec4f(color, 1.0); // 未完成时：静态顶点色
}
