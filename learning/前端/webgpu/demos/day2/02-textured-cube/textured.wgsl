// Day 2 · Demo 02 —— 纹理立方体着色器
// 三线性采样：minFilter 'linear' + mipmapFilter 'linear'（讲义 2.3）

struct Uniforms {
  mvp: mat4x4f,  // P·V·M 的组合，列主序
  model: mat4x4f, // 只有旋转：用 w=0 变换法线，得到世界空间朝向
};

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(0) @binding(1) var texSampler: sampler;
@group(0) @binding(2) var cubeTexture: texture_2d<f32>;

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) uv: vec2f,   // 会被硬件透视校正插值
  @location(1) shade: f32,  // 固定方向的微弱漫反射调子
};

@vertex
fn vs(
  @location(0) position: vec3f,
  @location(1) uv: vec2f,
  @location(2) normal: vec3f,
) -> VertexOut {
  var out: VertexOut;
  out.position = u.mvp * vec4f(position, 1.0);
  out.uv = uv;
  // 法线变换的完整版是逆转置矩阵（demo 03 / 讲义 2.4）；
  // 这里 model 只有旋转，左乘即可，w = 0 抵消平移分量
  let worldNormal = (u.model * vec4f(normal, 0.0)).xyz;
  let L = normalize(vec3f(0.35, 0.75, 0.55));
  out.shade = 0.62 + 0.38 * max(dot(normalize(worldNormal), L), 0.0);
  return out;
}

@fragment
fn fs(@location(0) uv: vec2f, @location(1) shade: f32) -> @location(0) vec4f {
  // uv 越远（滚轮拉远）采样到越小的 mip 级，网格线平滑糊掉而不是闪烁
  let texel = textureSample(cubeTexture, texSampler, uv);
  return vec4f(texel.rgb * shade, 1.0);
}
