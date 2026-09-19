// Day 2 · Demo 02 —— mipmap 生成着色器
// 采样上一级（linear 平均 4 邻域）渲染进下一级，一级一级降采样

@group(0) @binding(0) var srcTexture: texture_2d<f32>;
@group(0) @binding(1) var srcSampler: sampler;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,
};

@vertex
fn vs(@builtin(vertex_index) i: u32) -> VertexOut {
  // 一个大三角形盖满整个 render target（比 4 顶点少一半顶点着色）
  var pos = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0),
  );
  var out: VertexOut;
  let p = pos[i];
  out.position = vec4f(p, 0.0, 1.0);
  // v 要翻转：render target 的 +y 在上方，而纹理的 v = 0 在上方，
  // 两个「上」方向相反，不翻会把每级 mip 上下颠倒着传下去
  out.uv = vec2f(p.x * 0.5 + 0.5, 0.5 - p.y * 0.5);
  return out;
}

@fragment
fn fs(@location(0) uv: vec2f) -> @location(0) vec4f {
  return textureSample(srcTexture, srcSampler, uv);
}
