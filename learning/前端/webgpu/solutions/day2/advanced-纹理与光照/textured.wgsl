// Day 2 · 作业 advanced —— 纹理与 Blinn-Phong 着色器（参考答案）
// vs：mvp 变换 + 世界坐标/法线/uv 传给片元；
// fs：完整 Blinn-Phong——ambient + diffuse + 半程向量 specular + gamma 修正。

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

  // 插值会改变向量长度：法线与方向必须逐片元重新归一化
  let n = normalize(in.normal);
  let l = normalize(u.light.xyz - in.worldPos);
  let v = normalize(u.camera.xyz - in.worldPos);
  // 半程向量：Blinn 对 Phong 的改进——比反射向量便宜，高光更贴直觉
  let h = normalize(l + v);
  // 光色：三档色温都乘进三项，切换时是「换灯泡」而不是「加滤镜」
  let lc = u.lightColor.rgb;

  let ambient = albedo * 0.08 * lc;               // 暗部不死黑
  let diffuse = albedo * max(dot(n, l), 0.0) * lc; // 漫反射：亮面跟着光源走
  let specular = lc * pow(max(dot(n, h), 0.0), 64.0); // 高光：随视角移动的亮斑

  let color = ambient + diffuse + specular;
  // gamma 修正：着色在线性空间算完，写回 sRGB 显示要取 1/2.2 次幂
  return vec4f(pow(color, vec3f(1.0 / 2.2)), 1.0);
}
