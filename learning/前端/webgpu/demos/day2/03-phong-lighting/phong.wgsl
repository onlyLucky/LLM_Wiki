// Day 2 · Demo 03 —— Blinn-Phong 光照着色器
// 双光源（暖主光 + 冷补光）· 逆转置法线矩阵 · gamma 修正

// 帧级数据：所有物体共享的相机与光源
struct Frame {
  vp: mat4x4f,
  // xyz = 位置，w = 强度。用 vec4f 而非 vec3f：vec3f 数组实际按
  // 16 字节步进存取，末尾 4 字节是空洞，直接用 vec4f 免去手写 padding
  lights: array<vec4f, 2>,
  cameraPos: vec4f, // xyz = 相机位置，w = 时间
};

// 物体级数据：立方体 / 地面 / 光源标记各持一份
struct Obj {
  model: mat4x4f,
  normalMatrix: mat4x4f, // model 左上 3×3 的逆转置
};

@group(0) @binding(0) var<uniform> frame: Frame;
@group(1) @binding(0) var<uniform> obj: Obj;

const WARM: vec3f = vec3f(0.961, 0.620, 0.043); // #F59E0B 琥珀主光
const COOL: vec3f = vec3f(0.298, 0.435, 1.000); // #4C6FFF 冷补光
const BG: vec3f = vec3f(0.043, 0.055, 0.078);   // #0B0E14 画布底色

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) worldPos: vec3f,
  @location(1) normal: vec3f,
  @location(2) material: f32, // 0 = 立方体，1 = 地面
};

@vertex
fn vs(
  @location(0) position: vec3f,
  @location(1) normal: vec3f,
  @location(2) material: f32,
) -> VertexOut {
  let world = obj.model * vec4f(position, 1.0);
  var out: VertexOut;
  out.position = frame.vp * world;
  out.worldPos = world.xyz;
  // 法线乘逆转置矩阵：w = 0 让平移量失效，只剩方向部分
  out.normal = (obj.normalMatrix * vec4f(normal, 0.0)).xyz;
  out.material = material;
  return out;
}

@fragment
fn fs(v: VertexOut) -> @location(0) vec4f {
  // 插值会改变向量长度：法线必须逐片元重新归一化，否则高光会拉丝
  let n = normalize(v.normal);
  let viewDir = normalize(frame.cameraPos.xyz - v.worldPos);

  // 双光源累加：漫反射 + 高光一起算（Blinn-Phong 公式见 GAMES101 笔记 5.1）
  var lightColors = array<vec3f, 2>(WARM, COOL); // 动态索引的本地数组必须 var
  var diffuse = vec3f(0.0);
  var specular = vec3f(0.0);
  for (var i = 0; i < 2; i++) {
    let lp = frame.lights[i];
    let toLight = lp.xyz - v.worldPos;
    let dist = length(toLight);
    let L = toLight / dist;
    let H = normalize(L + viewDir); // 半程向量：Blinn 对 Phong 的改进
    let atten = lp.w / (1.0 + 0.09 * dist * dist); // 平方反比的数值稳定版
    let ndl = max(dot(n, L), 0.0);
    diffuse += lightColors[i] * ndl * atten;
    specular += lightColors[i] * pow(max(dot(n, H), 0.0), 90.0) * atten;
  }

  var color: vec3f;
  // fwidth 只能在均匀控制流里调用：片元插值参与分支判断时，
  // 导数类内置函数必须先在分支外算好（WGSL uniformity 分析，见讲义 2.2）
  let uv = v.worldPos.xz * 0.5; // 每 2 个世界单位一格
  let fw = max(fwidth(uv.x), fwidth(uv.y)) + 0.001; // 屏幕空间抗锯齿宽度
  if (v.material < 0.5) {
    // 立方体：石墨灰雕塑材质，高光集中（指数 90）
    let kd = vec3f(0.38, 0.42, 0.52);
    let ambient = BG * 0.55; // 环境光分量：暗部不至于全黑
    color = ambient + kd * diffuse + specular;
  } else {
    // 地面：格点材质，向远处淡回底色藏住边界
    let d = min(abs(uv.x - round(uv.x)), abs(uv.y - round(uv.y)));
    let line = 1.0 - smoothstep(0.0, fw * 1.6, d);
    let kd = vec3f(0.055, 0.075, 0.12);
    color = kd + kd * diffuse + COOL * line * 0.35;
    let fade = 1.0 - smoothstep(7.0, 15.0, length(v.worldPos.xz));
    color = mix(BG, color, fade);
  }
  // gamma 修正：着色在线性空间算完，写回 sRGB 显示要取 1/2.2 次幂
  return vec4f(pow(color, vec3f(1.0 / 2.2)), 1.0);
}

// ---- 光源标记：不受光照、自发光的小立方体 --------------------------
// 复用 vs 与顶点布局，只换片元入口——它自己就是光源，无需被照亮
@fragment
fn fsMarker(v: VertexOut) -> @location(0) vec4f {
  let t = frame.cameraPos.w;
  let pulse = 0.85 + 0.15 * sin(t * 5.2) * sin(t * 1.7); // 烛光式微闪
  let glow = mix(WARM, vec3f(1.0), 0.45) * pulse;
  return vec4f(pow(glow, vec3f(1.0 / 2.2)), 1.0);
}
