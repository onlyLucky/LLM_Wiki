// Day 1 · 作业 A 参考实现 —— 万花筒（片元侧）
// 与作业版骨架完全一致，三个函数全部实现：
//   toPolar：直角 → 极坐标
//   fold：八重镜像折叠（筒壁）
//   mandala：三层宝石阵（细钻 / 主石 / 大 Gem）+ 镜壁亮线 + 中心辉光 + 外缘线
//            鼠标横移调色温，纵移开合花瓣
// 关键技巧：在折叠后的极坐标上撒珠、每行按弧长配平格数——
//   任何以折叠后坐标为输入的图案，都随镜筒镜像自动严格无缝。

struct U {
  time: f32,     // 字节 0    ← JS 侧 uniforms[0]
  mouse: vec2f,  // 字节 8/12 ← JS 侧 uniforms[2]/[3]（1 号槽是填充洞）
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

// 直角坐标 → 极坐标：r 到中心的距离，theta 是方位角
fn toPolar(uv: vec2f) -> vec2f {
  return vec2f(length(uv), atan2(uv.y, uv.x));
}

// 八重镜像：把任意角度折进一个楔形切片 [0, π/segments]。
//   abs：取模后的负半边镜像折正
//   min(a, period - a)：超过半周期折回去
fn fold(theta: f32, segments: f32) -> f32 {
  let period = 6.28318530718 / segments;
  let a = abs(theta % period);
  return min(a, period - a);
}

// 2D hash：撒珠用（每颗珠的偏移 / 半径 / 闪烁相位都由它决定）
fn hash22(p: vec2f) -> vec2f {
  var p3 = fract(vec3f(p.xyx) * vec3f(0.1031, 0.1030, 0.0973));
  p3 += dot(p3, p3.yzx + 33.33);
  return fract((p3.xx + p3.yz) * p3.zy);
}

// 一层宝石：极坐标撒珠——径向按 rowStep 分行，每行按弧长配平角向格数，
// cell 近正方形（中心行自动收窄成环绕花蕊的单珠，外圈珠渐大，自相似成阵）。
// keep 是保留率：部分格子空置，让画面有深空呼吸的留白。
// 输入是折叠后的极坐标——图案随镜筒镜像自动严格无缝。
fn beadRing(rr: f32, theta: f32, rowStep: f32, seed: f32, keep: f32, maxRad: f32, t: f32) -> f32 {
  let PI8 = 0.39269908;                          // π/8：折叠域的方位角值域
  let row = floor(rr / rowStep);
  let rC = (row + 0.5) * rowStep;                // 行中心半径
  let n = max(1.0, round(PI8 * rC / rowStep));   // 该行角向格数（弧长配平 → cell 近正方形）
  let aC = PI8 / n;                              // 角向格宽
  let ia = floor(theta / aC);
  let h = hash22(vec2f(row, ia) + seed);
  // 出没率：空置格子留白（外圈保留率同步下降，与珠径缩小一起让边缘收敛）
  if (fract(h.x * 13.7 + seed) > keep * (1.0 - 0.5 * smoothstep(0.55, 0.95, rr))) { return 0.0; }
  let bcR = rC + (h.x - 0.5) * rowStep * 0.5;    // 珠心径向偏移 ±0.25 行，不跨行
  let bcA = (ia + 0.5) * aC;                     // 珠心放角向格中央，不跨镜壁
  let dr = rr - bcR;
  let da = theta - bcA;
  let dd = vec2f(dr, rC * da);                   // 屏幕空间近似向量（珠在屏上是圆的）
  let d = length(dd);
  // 珠径：两个方向 cell 较小者约束（防中心行重叠成环带）+ 层内上限（防外圈巨珠）
  // 外圈珠渐小：像消失在镜筒深处——画面边缘收敛、视线聚焦中央
  let rad = min(min(rowStep, rC * aC) * (0.30 + 0.12 * h.y), maxRad)
          * (1.0 - 0.45 * smoothstep(0.55, 0.95, rr));
  // 陈列灯光式闪光：底亮偶闪——pow 把正弦压尖，像宝石切面偶尔反光
  let tw = 0.65 + 0.35 * pow(0.5 + 0.5 * sin(t * (0.8 + h.y * 1.6) + h.x * 6.28), 3.0);
  let body = 1.0 - smoothstep(rad * 0.85, rad, d);                  // 珠体（锐利收边）
  let spec = pow(clamp(1.0 - length(dd - vec2f(-0.35, 0.35) * rad) / (rad * 0.45), 0.0, 1.0), 3.0);
  return (body * 0.85 + spec * 0.7) * tw;                           // 偏移高光：光源一致的玻璃珠
}

// 花纹本体。theta 是折叠后的方位角 ∈ [0, π/8]（八重楔形）。
// 金色点睛珠：折叠域内确定性两颗——镜像后成 8+16 颗金珠环，
// 尺寸与主石珠同级（避免巨珠炸屏），绕主环外圈与蓝色交替成陈列节奏
fn gemPetals(rr: f32, theta: f32, t: f32) -> f32 {
  let PI8 = 0.39269908;
  var acc = 0.0;
  // 主金珠：r=0.24 中线，呼吸脉动 + 陈列式闪光
  let rad0 = 0.030 * (1.0 + 0.10 * sin(t * 1.1));
  let d0 = length(vec2f(rr - 0.24, 0.24 * (theta - PI8 * 0.5)));
  acc += (1.0 - smoothstep(rad0 * 0.8, rad0, d0)) * (0.7 + 0.3 * pow(0.5 + 0.5 * sin(t * 1.7), 3.0));
  // 副金珠：r=0.33 偏离中线（镜像后 16 颗）
  let d1 = length(vec2f(rr - 0.33, 0.33 * (theta - PI8 * 0.26)));
  acc += (1.0 - smoothstep(0.014, 0.019, d1)) * 0.75;
  // 自带起圈与外圈渐隐
  return acc * smoothstep(0.16, 0.22, rr) * (1.0 - smoothstep(0.45, 0.65, rr));
}

fn mandala(r: f32, theta: f32, t: f32, m: vec2f) -> vec3f {
  // 色温：横移从深空电蓝滑向品红金——默认停在最冷端，
  // 右半屏渐暖（单向滑杆，mix 中点不是默认态）
  let warm = clamp(m.x, 0.0, 1.0);
  let cool = vec3f(0.20, 0.55, 1.00);
  let hot  = vec3f(1.00, 0.45, 0.75);
  let tint = mix(cool, hot, warm);
  let gold = vec3f(1.00, 0.80, 0.45);

  // 呼吸：整体尺度随时间缓慢起伏
  let breathe = 1.0 + 0.05 * sin(t * 0.8);
  let rr = r / breathe;

  // 花瓣调制：纵移开合（乘在珠亮度上，给出角向节奏）
  let petals = 0.25 + 0.75 * pow(0.5 + 0.5 * cos(theta * 16.0), 1.0 + 2.0 * (m.y * 0.5 + 0.5));

  // 三层宝石陈列（极坐标分行 + 出没率留白）：
  // 三层宝石陈列：细钻密行 / 主石中行 / 确定性金瓣
  let fine = beadRing(rr, theta, 0.07, 7.0,  0.55, 0.045, t);
  let main = beadRing(rr, theta, 0.24, 31.0, 0.65, 0.095, t);
  let gem  = gemPetals(rr, theta, t);

  // 中心渐入 + 外圈渐隐（渐隐大幅提前：外圈深空留白，视线聚焦中央陈列区）
  let beadMask = smoothstep(0.10, 0.35, rr) * (1.0 - smoothstep(0.42, 0.70, rr));

  // 镜筒壁亮线：楔形边界处碎屑堆积的反光（folded 的两个端点 θ=0 与 θ=π/8）
  let wall = pow(1.0 - sin(3.14159265 * theta / 0.39269908), 8.0) * 0.035;

  // 弱径向年轮（背景节奏，亮度让位给珠）
  let rings = pow(1.0 - abs(sin(rr * 9.0 - t * 0.9)), 20.0) * 0.05;

  var col = vec3f(0.012, 0.02, 0.05);
  col += mix(tint, vec3f(1.0), 0.55) * fine * petals * beadMask * 0.38; // 细钻：偏白碎光
  col += tint * main * petals * beadMask * 0.95;                        // 主石：主题色阵列
  col += mix(gold, hot, 0.3 * warm) * gem * 1.05;                       // 金瓣：金为主，暖端偏品红金（自带起圈渐隐）
  col += tint * (rings + wall) * petals * (1.0 - smoothstep(0.75, 0.95, rr)); // 年轮 + 镜筒壁（外圈收敛）

  // 中心辉光 + 外缘细线
  let core = pow(1.0 - smoothstep(0.0, 0.16, rr), 2.0);
  col += tint * core * 0.38 + gold * core * core * core * (0.1 + 0.6 * warm);
  let rim = pow(smoothstep(0.97, 1.0, rr), 2.0) * 0.4;
  col += rim * tint;
  return col;
}

@fragment
fn fs(in: VOut) -> @location(0) vec4f {
  // aspect 校正 + 半径归一：角落处 r 恰好为 1，
  // 画布拉成任何宽高比，中心圆都是圆。
  let uv = vec2f(in.uv.x * u.aspect, in.uv.y) / length(vec2f(u.aspect, 1.0));

  // 筒身慢旋：整幅万花筒缓缓转动（在折叠之前旋转，楔形结构保持不变）
  let rot = u.time * 0.12;
  let cs = vec2f(cos(rot), sin(rot));
  let uv2 = vec2f(uv.x * cs.x - uv.y * cs.y, uv.x * cs.y + uv.y * cs.x);

  let p = toPolar(uv2);
  let folded = fold(p.y, 8.0);
  var col = mandala(p.x, folded, u.time, u.mouse);
  col = pow(col, vec3f(1.0 / 2.2));   // gamma 提亮，深色不发灰
  return vec4f(col, 1.0);
}
