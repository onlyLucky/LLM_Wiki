// Day 2 · Demo 04 —— 顶点波浪着色器
// 高度场：三组正弦叠加 + 鼠标环形波；法线用解析梯度直接算出，
// 不依赖片元导数（dpdx/dpdy）也能得到平滑光照。

struct Uniforms {
  vp: mat4x4f,   // 视图投影矩阵（列主序，JS 侧每帧写入）
  camera: vec4f, // xyz 相机世界坐标（雾与高光要用）
  light: vec4f,  // xyz 指向光源的单位向量
  mouse: vec4f,  // xy 波源在地平面上的世界坐标
  params: vec4f, // x 时间（秒）
};

@group(0) @binding(0) var<uniform> u: Uniforms;

// 波场：返回 (高度, ∂h/∂x, ∂h/∂z)。
// 把偏导一并解析算出，法线 = normalize(-dh/dx, 1, -dh/dz)，
// 这比在片元里用屏幕空间导数重建更平滑，也不怕低分辨率网格。
fn waveField(p: vec2f, t: f32) -> vec3f {
  var h = 0.0;
  var dx = 0.0;
  var dz = 0.0;

  // 主浪：沿 x 的长波
  let ph1 = p.x * 1.9 + t * 1.05;
  h += 0.10 * sin(ph1);
  dx += 0.19 * cos(ph1);

  // 交叉浪：沿 z 的中浪
  let ph2 = p.y * 3.1 - t * 1.5;
  h += 0.07 * sin(ph2);
  dz += 0.217 * cos(ph2);

  // 细浪：斜向短波
  let ph3 = (p.x + p.y) * 3.7 + t * 1.9;
  h += 0.045 * sin(ph3);
  dx += 0.1665 * cos(ph3);
  dz += 0.1665 * cos(ph3);

  // 鼠标波纹：从光标扩散的环形波，指数衰减保证只影响附近
  let d = max(distance(p, u.mouse.xy), 1e-4);
  let att = exp(-d * 1.4);
  let ph4 = d * 16.0 - t * 6.0;
  h += 0.22 * att * sin(ph4);
  let dw = 0.22 * att * (16.0 * cos(ph4) - 1.4 * sin(ph4));
  dx += dw * (p.x - u.mouse.x) / d;
  dz += dw * (p.y - u.mouse.y) / d;

  return vec3f(h, dx, dz);
}

struct VOut {
  @builtin(position) position: vec4f,
  @location(0) world: vec3f,  // 世界坐标（片元里做光照与雾）
  @location(1) normal: vec3f, // 解析法线
  @location(2) wave: f32,     // 波高，片元里映射色带
};

@vertex
fn vs(@location(0) gridXZ: vec2f) -> VOut {
  let w = waveField(gridXZ, u.params.x);
  var out: VOut;
  out.world = vec3f(gridXZ.x, w.x, gridXZ.y);
  out.normal = normalize(vec3f(-w.y, 1.0, -w.z));
  out.wave = w.x;
  out.position = u.vp * vec4f(out.world, 1.0);
  return out;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  let n = normalize(in.normal);
  let l = normalize(u.light.xyz);
  let v = normalize(u.camera.xyz - in.world);

  // Blinn 半角高光（见讲义 2.4 的光照模型）
  let h = normalize(l + v);
  let diff = max(dot(n, l), 0.0);
  let spec = pow(max(dot(n, h), 0.0), 48.0) * 0.5;
  // 菲涅尔：掠射角抬升亮度，做出「湿」的质感
  let fres = pow(1.0 - max(dot(n, v), 0.0), 3.0);

  // 色带：深海底 → 电蓝 → 青（按波高）
  let t = clamp((in.wave + 0.26) / 0.52, 0.0, 1.0);
  var col = mix(vec3f(0.016, 0.045, 0.102), vec3f(0.298, 0.435, 1.000), smoothstep(0.0, 0.58, t));
  col = mix(col, vec3f(0.176, 0.831, 0.749), smoothstep(0.58, 1.0, t));

  col = col * (0.18 + 0.82 * diff);
  col += spec * vec3f(0.75, 0.85, 1.0);
  col += fres * vec3f(0.10, 0.22, 0.30);

  // 距离雾：远处融进画布底色，把网格边界藏起来
  let dist = distance(u.camera.xyz, in.world);
  let fog = smoothstep(3.2, 8.2, dist);
  col = mix(col, vec3f(0.043, 0.055, 0.078), fog);

  return vec4f(col, 1.0);
}
