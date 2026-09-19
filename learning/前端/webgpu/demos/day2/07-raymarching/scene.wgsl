// Day 2 · Demo 07 —— Ray Marching：全屏三角形上的 SDF 场景
// vs 输出覆盖屏幕的大三角形；fs 里逐像素构建相机射线、步进求交、
// 软阴影 + AO + 距离雾。GLSL 版思路见《Three.js 创意 3D》第 16 课。

struct Uniforms {
  mouse: vec4f,  // xy NDC（环视相机）
  params: vec4f, // x 时间, y aspect, z w 未用
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VOut {
  @builtin(position) position: vec4f,
  @location(0) ndc: vec2f,
};

@vertex
fn vs(@builtin(vertex_index) i: u32) -> VOut {
  // 大三角形：第三、三个顶点在 NDC 外围，光栅化裁剪后恰好覆盖全屏
  var p = array<vec2f, 3>(
    vec2f(-1.0, -1.0),
    vec2f(3.0, -1.0),
    vec2f(-1.0, 3.0),
  );
  var out: VOut;
  out.position = vec4f(p[i], 0.0, 1.0);
  out.ndc = p[i]; // 光栅化插值后，屏幕内的取值正好是 -1..1
  return out;
}

// ---- SDF 基元与融合 ----------------------------------------------

fn sdSphere(p: vec3f, r: f32) -> f32 {
  return length(p) - r;
}

fn sdRoundBox(p: vec3f, b: vec3f, r: f32) -> f32 {
  let q = abs(p) - b;
  return length(max(q, vec3f(0.0))) + min(max(q.x, max(q.y, q.z)), 0.0) - r;
}

// smooth min：k 控制两个形状的「融化」宽度
fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// 场景：返回 (距离, 材质)。0 地面 / 1 雕塑
fn map(p: vec3f) -> vec2f {
  var d = p.y; // 无限地面
  var m = 0.0;

  // 雕塑：圆角盒柱 + 三个球，smooth min 融出有机造型
  let col = sdRoundBox(p - vec3f(0.0, 0.60, 0.0), vec3f(0.34, 0.52, 0.34), 0.14);
  let top = sdSphere(p - vec3f(0.0, 1.30, 0.0), 0.40);
  let side = sdSphere(p - vec3f(0.44, 0.86, 0.30), 0.26);
  let back = sdSphere(p - vec3f(-0.36, 0.74, -0.34), 0.22);
  var s = smin(col, top, 0.20);
  s = smin(s, side, 0.15);
  s = smin(s, back, 0.15);

  if (s < d) { d = s; m = 1.0; }
  return vec2f(d, m);
}

// ---- 步进与着色辅助 ----------------------------------------------

fn hash31(p: vec3f) -> f32 {
  return fract(sin(dot(p, vec3f(12.9898, 78.233, 37.719))) * 43758.5453);
}

// 光线步进：每次前进「到最近表面的距离」，保证不会穿透
fn march(ro: vec3f, rd: vec3f) -> f32 {
  var t = 0.0;
  for (var i = 0; i < 90; i++) {
    let d = map(ro + rd * t).x;
    if (d < 0.001 * t) { return t; } // 足够近：命中
    t += d;
    if (t > 22.0) { break; }        // 足够远：放弃
  }
  return -1.0;
}

// 四面体差分求法线：四次采样，比六面体差分省两次
fn calcNormal(p: vec3f) -> vec3f {
  let e = 0.0016;
  let k = vec2f(1.0, -1.0);
  return normalize(
    k.xyy * map(p + k.xyy * e).x + k.yyx * map(p + k.yyx * e).x +
    k.yxy * map(p + k.yxy * e).x + k.xxx * map(p + k.xxx * e).x
  );
}

// 软阴影：沿光源方向再步进一次，中途离遮挡物越近影子越软
fn softShadow(ro: vec3f, rd: vec3f) -> f32 {
  var res = 1.0;
  var t = 0.04;
  for (var i = 0; i < 24; i++) {
    let h = map(ro + rd * t).x;
    res = min(res, h / (0.06 * t));
    t += clamp(h, 0.03, 0.35);
    if (res < 0.005 || t > 6.0) { break; }
  }
  return clamp(res, 0.0, 1.0);
}

// 环境光遮蔽：沿法线抬升采样，越贴近别的表面越暗
fn calcAO(p: vec3f, n: vec3f) -> f32 {
  var occ = 0.0;
  var sca = 1.0;
  for (var i = 0; i < 4; i++) {
    let h = 0.02 + 0.13 * f32(i) / 3.0;
    let d = map(p + n * h).x;
    occ += (h - d) * sca;
    sca *= 0.82;
  }
  return clamp(1.0 - 2.4 * occ, 0.0, 1.0);
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // 相机：鼠标环绕（幅度克制）+ 缓慢漂移
  let az = -0.55 + u.mouse.x * 0.55 + 0.05 * sin(u.params.x * 0.10);
  let el = 0.34 + u.mouse.y * 0.18;
  let ro = vec3f(sin(az) * cos(el), sin(el), cos(az) * cos(el)) * 4.4;
  let ta = vec3f(0.0, 0.70, 0.0);

  // 屏幕像素 → 世界射线（讲义 2.8 的相机基）
  let fwd = normalize(ta - ro);
  let right = normalize(cross(fwd, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, fwd);
  let halfH = tan(0.38); // 半视野角 ≈ 21.8°
  let rd = normalize(fwd + right * in.ndc.x * halfH * u.params.y + up * in.ndc.y * halfH);

  let t = march(ro, rd);
  if (t < 0.0) {
    // 深空：垂直渐变 + 细碎星点
    var sky = mix(vec3f(0.012, 0.016, 0.033), vec3f(0.043, 0.055, 0.078), smoothstep(-0.2, 0.6, rd.y));
    let star = hash31(floor(rd * 90.0));
    sky += vec3f(0.75, 0.82, 1.0) * smoothstep(0.9965, 1.0, star) * 0.5;
    return vec4f(sky, 1.0);
  }

  let p = ro + rd * t;
  let n = calcNormal(p);
  let m = map(p).y;

  // 材质：雕塑是冷白灰，地面是深蓝灰
  let albedo = select(vec3f(0.055, 0.075, 0.118), vec3f(0.62, 0.66, 0.76), m > 0.5);

  // 主光：电蓝偏白、带软阴影；补光：琥珀、无阴影
  let lDir = normalize(vec3f(3.4, 4.6, 1.6) - p);
  let shadow = softShadow(p + n * 0.01, lDir);
  let diff = max(dot(n, lDir), 0.0);

  let fDir = normalize(vec3f(-3.0, 1.4, -2.6) - p);
  let fill = max(dot(n, fDir), 0.0) * 0.30;

  let ao = calcAO(p, n);

  var col = albedo * (0.05 + 0.10 * ao);
  col += albedo * diff * shadow * vec3f(0.75, 0.85, 1.15) * 1.05;
  col += albedo * fill * vec3f(1.15, 0.85, 0.55);
  // 地面电蓝辉光环：雕塑脚下的「展台灯」
  let ring = exp(-6.0 * abs(p.y - 0.02)) * exp(-1.1 * length(p.xz));
  col += vec3f(0.10, 0.16, 0.42) * ring * 0.8;

  // 距离雾：融进深空底色
  let fog = 1.0 - exp(-0.028 * t * t);
  col = mix(col, vec3f(0.020, 0.027, 0.048), fog);

  // 伽马校正后输出
  col = pow(col, vec3f(0.4545));
  return vec4f(col, 1.0);
}
