// Day 1 · 作业 A —— 万花筒（片元侧）
// 顶点只有一件事：把全屏 quad 铺满画布（vs 已写好，不用动）。
// 万花筒的花纹全部由片元折叠出来，你的任务按顺序三步：
//   toPolar → fold → mandala，每填对一层，画面点亮一层。

struct U {
  time: f32,     // 字节 0    ← JS 侧 uniforms[0]
  mouse: vec2f,  // 字节 8/12 ← JS 侧 uniforms[2]/[3]（1 号槽是填充洞，见 1.6）
  aspect: f32,   // 字节 16   ← JS 侧 uniforms[4]
}
@group(0) @binding(0) var<uniform> u: U;

struct VOut {
  @builtin(position) pos: vec4f,
  @location(0) uv: vec2f,   // 直接复用 quad 顶点坐标 [-1,1]² 当 uv
}

@vertex
fn vs(@location(0) p: vec2f) -> VOut {
  var out: VOut;
  out.pos = vec4f(p, 0.0, 1.0);
  out.uv = p;
  return out;
}

// ---------- TODO(day1-advanced-2) toPolar ----------
// 直角坐标 → 极坐标，两行：
//   r     = length(uv)
//   theta = atan2(uv.y, uv.x)   （WGSL 内建函数就叫 atan2）
fn toPolar(uv: vec2f) -> vec2f {
  // TODO: return vec2f(r, theta);
  return vec2f(0.0); // 占位
}

// ---------- TODO(day1-advanced-3) fold ----------
// 八重镜像——万花筒的「筒壁」。把任意角度折进一个楔形切片：
//   1. 周期 period = 2π / segments（segments = 8 时约 0.785）
//   2. 取模：a = theta % period   （WGSL 的 % 对负角保留符号）
//   3. abs(a) 把负半边镜像折正
//   4. 超过半周期折回去：min(a, period - a)
fn fold(theta: f32, segments: f32) -> f32 {
  // TODO: 三行
  return theta; // 占位：直接透传，先让 toPolar 的成果能流到画面上
}

// ---------- TODO(day1-advanced-4) mandala ----------
// 折叠后的楔形坐标就是「同一段花纹」，往里画什么，全局就对称成什么：
//   环：   sin(r * 密度 - t * 速度)          —— 一圈圈向外流的年轮
//   环带：  smoothstep(0.0, abs(sin(r * 稀疏 - t)))  —— 更宽的呼吸带
//   花瓣：  0.5 + 0.5 * sin(theta * 瓣数)     —— 角向明暗
//   辉光：  smoothstep(0.22, 0.0, r)          —— 中心向外衰减
//   色温：  u.mouse.x 横移，mix(冷色, 暖色, warm) 调主色
// 下面是验证态：填完 toPolar 你应该先看到同心环，填完 fold 后出现八重对称；
// 最后把它替换成你自己的曼陀罗（可参考 solutions 的分层思路，但调出你的参数）。
fn mandala(r: f32, theta: f32, t: f32, m: vec2f) -> vec3f {
  // TODO: 自由发挥——环、环带、花瓣、辉光、色温，至少各一层
  let rings = sin(r * 24.0 - t * 2.0);
  let petals = 0.5 + 0.5 * sin(theta * 24.0);
  let glow = smoothstep(1.0, 0.0, r);
  return vec3f(0.04, 0.06, 0.12)
       + vec3f(0.30, 0.45, 1.00) * (0.35 * rings + petals * rings) * glow;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // aspect 校正 + 半径归一（已写好，别再动）：角落处 r 恰好为 1，
  // 画布拉成任何宽高比，中心圆都是圆。
  let uv = vec2f(in.uv.x * u.aspect, in.uv.y) / length(vec2f(u.aspect, 1.0));

  let p = toPolar(uv);
  let folded = fold(p.y, 8.0);
  var col = mandala(p.x, folded, u.time, u.mouse);
  col = pow(col, vec3f(1.0 / 2.2));   // gamma 提亮，深色不发灰
  return vec4f(col, 1.0);
}
