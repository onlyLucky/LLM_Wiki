// Day 2 · Demo 07 —— Ray Marching：熔核图腾（SDF 场景与光线步进）
// vs 输出覆盖屏幕的大三角形；fs 里逐像素构建相机射线、步进求交。
// 场景设计：黑曜石球链图腾 + 内部熔核透光（伪次表面散射）+
// 反射地面（平面伪镜面）+ 青金双色分级。GLSL 版思路见《Three.js 创意 3D》第 16 课。

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
  // 大三角形：三个顶点在 NDC 外围，光栅化裁剪后恰好覆盖全屏
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

// 圆环：主体半径 t.x、管径 t.y
fn sdTorus(p: vec3f, t: vec2f) -> f32 {
  let q = vec2f(length(p.xz) - t.x, p.y);
  return length(q) - t.y;
}

// smooth min：k 控制两个形状的「融化」宽度
fn smin(a: f32, b: f32, k: f32) -> f32 {
  let h = clamp(0.5 + 0.5 * (b - a) / k, 0.0, 1.0);
  return mix(b, a, h) - k * h * (1.0 - h);
}

// ---- 场景 ---------------------------------------------------------
// 材质编号：0 地面 / 1 图腾与悬浮环（同一黑曜石材质）
// 图腾 = 五颗球沿垂直轴堆叠 + smin 融合；球心水平漂移、半径呼吸，
// 全部是缓慢的低频动画——SDF 本身保持光滑解析，步进绝不会穿透。

fn map(p: vec3f) -> vec2f {
  var d = p.y; // 无限地面
  var m = 0.0;
  let bt = u.params.x;

  // 图腾珠链：自下而上逐颗缩小，缩腰分节——五颗黑曜石珠串成的图腾
  // 水平漂移刻意压小（0.06~0.10）：珠心贴近中轴，熔核透光带才会在正面可见
  let s1 = sdSphere(p - vec3f( 0.08 * sin(bt * 0.52 + 0.8), 0.42, 0.08 * cos(bt * 0.47 + 1.2)), 0.46 + 0.03 * sin(bt * 0.80 + 0.5));
  let s2 = sdSphere(p - vec3f(-0.09 * sin(bt * 0.44 + 2.1), 0.92, 0.09 * cos(bt * 0.51 + 0.4)), 0.40 + 0.03 * sin(bt * 0.70 + 2.0));
  let s3 = sdSphere(p - vec3f( 0.10 * sin(bt * 0.49 + 4.0), 1.38, 0.10 * cos(bt * 0.43 + 2.8)), 0.36 + 0.03 * sin(bt * 0.90 + 3.5));
  let s4 = sdSphere(p - vec3f(-0.08 * sin(bt * 0.55 + 1.4), 1.80, 0.08 * cos(bt * 0.46 + 3.3)), 0.31 + 0.03 * sin(bt * 0.60 + 1.2));
  let s5 = sdSphere(p - vec3f( 0.06 * sin(bt * 0.42 + 5.2), 2.16, 0.06 * cos(bt * 0.53 + 4.1)), 0.24 + 0.02 * sin(bt * 0.75 + 4.8));
  var s = smin(s1, s2, 0.10);
  s = smin(s, s3, 0.09);
  s = smin(s, s4, 0.08);
  s = smin(s, s5, 0.07);

  // 悬浮细环：绕图腾中上部，整体缓慢摇摆（绕 x 轴微倾）
  let q = p - vec3f(0.0, 1.62, 0.0);
  let sway = 0.10 * sin(bt * 0.40);
  let qt = vec3f(q.x, cos(sway) * q.y - sin(sway) * q.z, sin(sway) * q.y + cos(sway) * q.z);
  let tor = sdTorus(qt, vec2f(0.95, 0.035));
  s = min(s, tor); // 环悬浮在图腾外围不接触，硬 min 语义更清晰

  if (s < d) { d = s; m = 1.0; }
  return vec2f(d, m);
}

// ---- 熔核（不进 map：它永远藏在图腾内部，march 碰不到）------------
// 着色时用「表面到熔核的距离」做透光：壁越薄越亮——伪次表面散射。
fn sdCore(p: vec3f) -> f32 {
  // 恒定半径的熔核柱心 + 呼吸脉动；透光的「分珠」节奏交给 coreGlow 的权重
  let r = 0.18 + 0.03 * sin(u.params.x * 1.05);
  let y = clamp(p.y, 0.35, 2.30);
  return length(p - vec3f(0.0, y, 0.0)) - r;
}

// ---- 步进与着色辅助 ----------------------------------------------

fn hash31(p: vec3f) -> f32 {
  return fract(sin(dot(p, vec3f(12.9898, 78.233, 37.719))) * 43758.5453);
}

// 光线步进：每次前进「到最近表面的距离」，保证不会穿透。
// maxT / maxSteps 参数化：主射线走得远，反射射线省预算。
fn march(ro: vec3f, rd: vec3f, maxT: f32, maxSteps: i32) -> f32 {
  var t = 0.0;
  for (var i = 0; i < maxSteps; i++) {
    let d = map(ro + rd * t).x;
    if (d < 0.001 * t) { return t; } // 足够近：命中
    t += d;
    if (t > maxT) { break; }         // 足够远：放弃
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

// 熔核透光量 = 壁厚项 × 分珠权重 × 呼吸：
// 壁厚项 exp(-10·d) 管强度；五个珠心处的高斯权重把透光限制在每颗珠的
// 「赤道带」，珠与珠之间的缩腰处权重趋零——图腾呈现分节发光的节奏。
fn coreGlow(p: vec3f) -> f32 {
  let pulse = 0.75 + 0.25 * sin(u.params.x * 1.05);
  let w = exp(-22.0 * (p.y - 0.42) * (p.y - 0.42))
        + exp(-22.0 * (p.y - 0.92) * (p.y - 0.92))
        + exp(-22.0 * (p.y - 1.38) * (p.y - 1.38))
        + exp(-22.0 * (p.y - 1.80) * (p.y - 1.80))
        + exp(-22.0 * (p.y - 2.16) * (p.y - 2.16));
  return exp(-14.0 * max(sdCore(p), 0.0)) * min(w, 1.0) * pulse;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // 相机：低机位仰视 + 鼠标环绕 + 缓慢漂移
  let az = 0.20 + u.mouse.x * 0.45 + 0.04 * sin(u.params.x * 0.09);
  let el = 0.16 + u.mouse.y * 0.12;
  let ro = vec3f(sin(az) * cos(el), sin(el), cos(az) * cos(el)) * 5.2;
  let ta = vec3f(0.0, 1.15, 0.0);

  // 屏幕像素 → 世界射线（讲义 2.8 的相机基）
  let fwd = normalize(ta - ro);
  let right = normalize(cross(fwd, vec3f(0.0, 1.0, 0.0)));
  let up = cross(right, fwd);
  let halfH = tan(0.36); // 半视野角 ≈ 20.6°
  let rd = normalize(fwd + right * in.ndc.x * halfH * u.params.y + up * in.ndc.y * halfH);

  let t = march(ro, rd, 22.0, 90);
  if (t < 0.0) {
    // 深空：近黑渐变 + 地平线青辉 + 细碎星点（细网格圆形星，带闪烁）
    var sky = mix(vec3f(0.008, 0.010, 0.020), vec3f(0.030, 0.046, 0.072), smoothstep(-0.1, 0.7, rd.y));
    sky += vec3f(0.06, 0.16, 0.22) * exp(-6.0 * abs(rd.y + 0.02)) * 0.5;
    let sg = rd * 140.0;
    let sf = fract(sg) - 0.5;
    let sh = hash31(floor(sg));
    let star = smoothstep(0.30, 0.0, length(sf)) * step(0.992, sh);
    let twinkle = 0.6 + 0.4 * sin(u.params.x * 2.0 + sh * 40.0);
    sky += vec3f(0.75, 0.82, 1.0) * star * 0.55 * twinkle;
    return vec4f(sky, 1.0);
  }

  let p = ro + rd * t;
  let n = calcNormal(p);
  let m = map(p).y;
  var col = vec3f(0.0);

  if (m < 0.5) {
    // ---- 地面：黑镜面——反射射线把图腾与熔光「倒」进地面 ----
    let rrd = normalize(rd - 2.0 * dot(rd, n) * n); // 平面法线恒为 (0,1,0)
    let rt = march(p + n * 0.02, rrd, 9.0, 44);     // 反射射线用小预算
    if (rt > 0.0) {
      let rp = p + n * 0.02 + rrd * rt;
      let rm = map(rp).y;
      let rn = calcNormal(rp);
      // 反射里的简化着色：主光 + 熔核透光（省掉阴影与 AO）
      let rl = normalize(vec3f(3.2, 4.2, 1.8) - rp);
      var rc = vec3f(0.05, 0.06, 0.09) * max(dot(rn, rl), 0.0) * 0.9;
      rc += vec3f(1.00, 0.42, 0.14) * coreGlow(rp) * 1.6;
      if (rm < 0.5) { rc = vec3f(0.0); } // 反射到地面：按黑处理
      let fres = pow(1.0 - max(dot(-rd, n), 0.0), 3.0); // 掠射角反射更强
      col = mix(vec3f(0.012, 0.014, 0.022), rc, clamp(0.12 + 0.50 * fres, 0.0, 1.0));
    } else {
      col = vec3f(0.010, 0.012, 0.020);
    }
    // 地面离图腾越近，被熔光「烘」得越亮
    col += vec3f(0.55, 0.26, 0.10) * exp(-2.2 * length(p.xz)) * 0.28 * coreGlow(vec3f(p.x, 0.5, p.z));
  } else {
    // ---- 图腾与悬浮环：黑曜石剪影 + 冷青轮廓光 + 熔核透光 ----
    let albedo = vec3f(0.04, 0.05, 0.08);
    let lDir = normalize(vec3f(3.2, 4.2, 1.8) - p);
    let shadow = softShadow(p + n * 0.01, lDir);
    let diff = max(dot(n, lDir), 0.0);
    let ao = calcAO(p, n);

    col = albedo * (0.05 + 0.10 * ao);                      // 环境底
    col += albedo * diff * shadow * vec3f(0.85, 0.92, 1.10) * 0.55; // 冷白主光
    let hv = normalize(lDir - rd);                          // Blinn-Phong 高光：黑曜石的光泽
    col += vec3f(0.50, 0.62, 0.78) * pow(max(dot(n, hv), 0.0), 60.0) * shadow * 0.60;
    let rim = pow(1.0 - max(dot(n, -rd), 0.0), 4.5);        // 菲涅尔轮廓（窄边）
    col += vec3f(0.16, 0.62, 0.85) * rim * 0.42 * (0.4 + 0.6 * ao);
    col += vec3f(1.00, 0.42, 0.14) * coreGlow(p) * 2.0;     // 熔核透光：主角
  }

  // 距离雾：融进深空底色
  let fog = 1.0 - exp(-0.024 * t * t);
  col = mix(col, vec3f(0.012, 0.016, 0.028), fog);

  // 伽马校正 + 青金双色分级（暗部偏青、高光偏金）+ 暗角
  col = pow(col, vec3f(0.4545));
  let lum = dot(col, vec3f(0.299, 0.587, 0.114));
  col = mix(col, col * vec3f(0.82, 0.94, 1.18), (1.0 - smoothstep(0.0, 0.55, lum)) * 0.30);
  col = mix(col, col * vec3f(1.14, 1.00, 0.80), smoothstep(0.45, 1.0, lum) * 0.30);
  col *= 1.0 - 0.32 * pow(length(in.ndc * vec2f(0.75, 0.85)), 2.2);
  return vec4f(col, 1.0);
}
