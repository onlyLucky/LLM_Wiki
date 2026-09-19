// Day 2 · 作业 advanced —— 纹理与 Blinn-Phong 着色器
// vs：mvp 变换 + 世界坐标/法线/uv 传给片元；
// fs：TODO(day2-advanced-3) 在占位处实现完整 Blinn-Phong。

struct Uniforms {
  mvp: mat4x4f,
  model: mat4x4f,
  camera: vec4f,     // xyz 相机位置，w 时间
  light: vec4f,      // xyz 光源位置，w 光强
  lightColor: vec4f, // xyz 色温
};

@group(0) @binding(0) var<uniform> u: Uniforms;
@group(1) @binding(0) var albedoTex: texture_2d<f32>;
@group(1) @binding(1) var albedoSamp: sampler;

struct VOut {
  @builtin(position) position: vec4f,
  @location(0) worldPos: vec3f,
  @location(1) normal: vec3f,
  @location(2) uv: vec2f,
};

@vertex
fn vs(
  @location(0) position: vec3f,
  @location(1) uv: vec2f,
  @location(2) normal: vec3f,
) -> VOut {
  var out: VOut;
  out.position = u.mvp * vec4f(position, 1.0);
  out.worldPos = (u.model * vec4f(position, 1.0)).xyz;
  // 立方体只有旋转（无非均匀缩放），model 直接当法线矩阵用；
  // w = 0 让平移量失效，只剩方向部分
  out.normal = (u.model * vec4f(normal, 0.0)).xyz;
  out.uv = uv;
  return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  let albedo = textureSample(albedoTex, albedoSamp, in.uv).rgb;

  // TODO(day2-advanced-3): 把占位替换成完整 Blinn-Phong（公式见讲义 2.4）：
  //   ambient  ≈ albedo * 0.08 * lightColor
  //   diffuse  = albedo * max(dot(N, L), 0) * lightColor
  //   specular = pow(max(dot(N, H), 0), 64) * lightColor
  // 其中 N = normalize(in.normal)，L 指向光源 u.light.xyz，H 是半程向量。
  // 三项相加后做 gamma 修正：pow(color, 1/2.2)。
  // 完成前用占位（只有环境光），贴图与色温通道可以先验收。
  return vec4f(pow(albedo * 0.25 * u.lightColor.rgb, vec3f(1.0 / 2.2)), 1.0);
}
