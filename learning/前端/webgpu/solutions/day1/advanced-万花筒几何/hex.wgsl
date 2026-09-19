// Day 1 · 作业 A —— 万花筒几何（参考答案）
// 顶点数据来自 vertex buffer（interleaved），三角形由索引指认；
// model 矩阵来自 uniform，vs 里应用；加分项：鼠标亮度扰动。

struct Uniforms {
  model: mat3x3f, // 字节 0–48：列主序，前两列是旋转缩放，第三列 (0, 0, 1)
  aspect: f32,    // 字节 48：画布宽高比
  mouse: f32,     // 字节 52：鼠标横移 NDC（加分项）
};

@group(0) @binding(0) var<uniform> u: Uniforms;

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
  // 齐次坐标承接平移量（本矩阵第三列是 (0,0,1)，平移为零）；
  // 变换后再乘 aspect 抵消画布拉伸
  let p = (u.model * vec3f(vin.position, 1.0)).xy;
  out.position = vec4f(p * vec2f(u.aspect, 1.0), 0.0, 1.0);
  out.color = vin.color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 加分项：鼠标横移轻微扰动亮度（±8%），旋转的环带像被手电扫过
  let shade = 1.0 + 0.08 * u.mouse;
  return vec4f(color * shade, 1.0);
}
