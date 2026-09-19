// Day 1 · 作业 A —— 万花筒几何
// 顶点数据来自 vertex buffer（interleaved），三角形由索引指认；
// model 矩阵来自 uniform。你的任务：在 vs 里应用矩阵（TODO 见下）。

struct Uniforms {
  model: mat3x3f, // 字节 0–48：列主序，前两列是旋转缩放，第三列 (0, 0, 1)
  aspect: f32,    // 字节 48：画布宽高比（脚手架已在用）
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
  // TODO(day1-advanced-3): 用 model 矩阵变换顶点（替换下面这行的 position）
  //   let p = (u.model * vec3f(vin.position, 1.0)).xy;
  //   out.position = vec4f(p * vec2f(u.aspect, 1.0), 0.0, 1.0);
  out.position = vec4f(vin.position * vec2f(u.aspect, 1.0), 0.0, 1.0); // 未完成时：不旋转
  out.color = vin.color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  return vec4f(color, 1.0);
}
