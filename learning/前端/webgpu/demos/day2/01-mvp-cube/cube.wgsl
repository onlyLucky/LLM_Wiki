// Day 2 · Demo 01 —— MVP Cube 着色器
// 顶点：位置 + 面色（同面四个顶点同色，插值后整面恒定）
// 片元：直接输出面色 + 轻微亮度呼吸；遮挡关系交给深度测试

struct Uniforms {
  mvp: mat4x4f,  // model · view · projection 的组合，列主序
  params: vec4f, // x = time，其余留空凑齐 16 字节
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexOut {
  @builtin(position) position: vec4f, // 裁剪坐标；÷w 与视口变换由硬件接手
  @location(0) color: vec3f,         // 光栅化阶段自动做透视校正插值
};

@vertex
fn vs(
  @location(0) position: vec3f,
  @location(1) color: vec3f,
) -> VertexOut {
  var out: VertexOut;
  // 矩阵在左、列向量在右：与 JS 侧列主序手写矩阵完全一致
  out.position = u.mvp * vec4f(position, 1.0);
  out.color = color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 亮度随时间轻微呼吸（±4%），与缩放呼吸同频
  let breathe = 1.0 + 0.04 * sin(u.params.x * 0.8);
  return vec4f(color * breathe, 1.0);
}
