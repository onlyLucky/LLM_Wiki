// Day 1 · 作业 C —— 星轨动画
// 顶点是静态弧上的点（buffer 提供）；旋转、视差、渐隐、闪烁全部在 vs
// 里由 attribute 与 uniform 推导。流星与极星星芒已写好——填完 TODO
// 就能看到完整画面。你的任务见两处 TODO。

struct Uniforms {
  time: f32,      // 字节 0：秒
  _pad: f32,      // 字节 4：对齐填充，下一个 vec2f 按 8 字节对齐
  mouse: vec2f,   // 字节 8：鼠标 NDC 坐标（-1..1）
  aspect: f32,    // 字节 16：画布宽高比
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexIn {
  @location(0) position: vec2f, // 弧上的点（半屏高单位：1 = 半屏高，x 除以 aspect 才是 NDC）
  @location(1) color: vec3f,    // 星的基色（内带暖金 → 外带冷蓝，逐星微扰）
  @location(2) arcT: f32,       // 弧内归一化位置 0..1（头尾渐隐用）
  @location(3) band: f32,       // 轨道带号 0..4；5 = 极星光芒
  @location(4) seed: f32,       // 每颗星一个种子：闪烁频率与相位；-1 = 流星
}

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
  @location(1) alpha: f32,      // 渐隐后的亮度，fs 里混回底色
}

// 深空底色——与 main.ts 的 clearValue 逐字一致，渐隐才像「融进夜空」
const BG = vec3f(0.027, 0.039, 0.071); // #070A12
// 极点（半屏高单位）：偏心构图是星轨摄影的经典——极点放在画面右上 1/3
const POLE = vec2f(0.30, 0.18);

// 半屏高单位 → NDC：x 除以 aspect。除而不是乘，半径在 x、y 两个方向
// 换算成像素才等距——星轨绕天极的圆投在画面上才是正圆，不是椭圆。
// 所有几何（弧、星芒、流星）都在半屏高单位空间里推导，最后过这一个出口。
fn toNdc(p: vec2f) -> vec2f {
  return vec2f(p.x / u.aspect, p.y);
}

@vertex
fn vs(vin: VertexIn, @builtin(vertex_index) i: u32) -> VertexOut {
  var out: VertexOut;
  out.color = vin.color;
  out.alpha = 0.0;

  // ---- 流星（已写好）：buffer 里只有一条对角线段，位置与出没完全由时间定义 ----
  // 教学点：顶点的最终位置不必与 buffer 里的位置有任何关系——
  // 着色器可以拿时间把一条静止线段「变成」一颗划过天际的流星。
  if (vin.seed < -0.5) {
    let a = vec2f(-1.90, -0.75);
    let b = vec2f(1.50, 0.65);
    let prog = fract(u.time / 9.0);          // 9 秒一个周期
    let fly = clamp(prog / 0.14, 0.0, 1.0);  // 前 14% 时间飞完全程
    let head = mix(a, b, fly);               // 流星头
    let tail = mix(a, b, max(fly - 0.16, 0.0)); // 拖尾
    let isHead = (i % 2u) == 0u;
    let p = select(tail, head, isHead);
    out.position = vec4f(toNdc(p), 0.0, 1.0);
    out.color = vec3f(0.80, 0.90, 1.00);
    out.alpha = step(0.01, prog) * (1.0 - smoothstep(0.12, 0.14, prog))
              * select(0.25, 1.0, isHead);   // 头亮尾暗
    return out;
  }

  // ---- 极星光芒（已写好）：绕极点慢旋的八向星芒，长度与亮度同呼吸 ----
  if (vin.band > 4.5) {
    let isDiag = vin.seed >= 4.0;            // seed 0..7：前四正交长芒、后四斜向短芒
    let len = select(0.085, 0.042, isDiag) * (0.85 + 0.15 * sin(u.time * 1.3));
    let dirA = vin.seed * 0.7853982 + u.time * 0.05; // 每 45° 一芒，整体慢旋
    let r0 = 0.004;                          // 星芒几乎从极心长出，中心读作一颗亮星
    let t = vin.arcT;                        // 0 = 根部，1 = 尖端
    let p = POLE + vec2f(cos(dirA), sin(dirA)) * (r0 + len * t);
    out.position = vec4f(toNdc(p), 0.0, 1.0);
    out.color = vec3f(1.00, 0.92, 0.75);     // 金白
    let breathe = 0.65 + 0.35 * pow(0.5 + 0.5 * sin(u.time * 1.3), 2.0);
    out.alpha = mix(0.95, 0.18, t) * breathe; // 根部亮尖端暗
    return out;
  }

  // ---- 星轨弧：你的任务 ----
  // TODO(day1-challenge-3): 绕极点旋转
  //   旋转在半屏高单位空间做（等距空间，轨道才是屏幕上的正圆）：
  //   spin = u.time * (0.05 + 0.028 * (4.0 - vin.band))
  //   rel = vin.position - POLE，标准 2D 旋转（cs = (cos, sin)），
  //   world = POLE + 旋转后的 rel，出口 out.position = vec4f(toNdc(world), 0.0, 1.0)
  // TODO(day1-challenge-4): 分层视差 + 长曝光渐隐 + 闪烁
  //   视差：world += u.mouse * depth * 0.055，depth = 0.3 + 0.7 * vin.band / 4.0
  //   渐隐：fade = smoothstep(0.0, 0.22, vin.arcT) * (1.0 - smoothstep(0.78, 1.0, vin.arcT))
  //   闪烁：tw = 0.72 + 0.28 * sin(u.time * (0.5 + fract(vin.seed * 7.31) * 1.7) + vin.seed * 6.2832)
  //   out.alpha = fade * tw * (1.0 - 0.22 * vin.band / 4.0)——外带略暗，纵深压一档
  // 未完成占位：静止的弧（填完 TODO 3 弧开始转，填完 TODO 4 全面点亮）：
  out.position = vec4f(toNdc(vin.position), 0.0, 1.0);
  out.alpha = 0.45;
  return out;
}

@fragment
fn fs(in: VertexOut) -> @location(0) vec4f {
  // alpha 混回底色：线交叉处亮星自然压过暗星，前后层次分明
  return vec4f(mix(BG, in.color, clamp(in.alpha, 0.0, 1.0)), 1.0);
}
