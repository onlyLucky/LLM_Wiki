#version 300 es
// Day 1 · 作业 A —— 片元着色器：暗场聚光
// 任务 2–5 全在这：坐标域 → 光池照亮 → 按压收束 → 拖向甩长。
// 骨架可编译（uniform 已声明、暗场地板已预置），补全一段刷新一次。

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;  // 平滑鼠标（0–1，左下原点，chrome 已翻转）
uniform float u_down;  // 按压进度（0–1 线性，0.6s——曲线是任务 4 的事）
uniform vec2 u_vel;    // 每帧位移（0–1 域，任务 5 的速度向量）

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 LIT  = vec3(1.000, 0.757, 0.271); // #FFC145 暖琥珀，追光的颜色
const vec3 HOT  = vec3(1.000, 0.953, 0.863); // 灯芯白热，近似 #FFF3DC

// TODO(day1-adv-4)：easeOutBack 从讲义 1.6 原样抄进来
// （四行：clamp → c1 = 1.70158 → c3 = c1 + 1.0 → 过冲公式）

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // ---- 暗场地板（脚手架，无需改动）--------------------------------
  // 网格与星屑先铺好、几乎全黑——光照是乘法，任务 3 的光池一来，
  // floorTex 乘上 lit 才显形。这就是「被照物」与「光」的分工。
  // 变量名用 aspect0：给任务 2 的 aspect 让位，避免重名编译错。
  float aspect0 = u_resolution.x / u_resolution.y;
  vec2 gp = vec2(uv.x * aspect0, uv.y) * 13.0;          // 正方形格子
  vec2 g2 = abs(fract(gp) - 0.5);
  float grid = smoothstep(0.40, 0.47, max(g2.x, g2.y)); // 格线 mask
  vec2 cell = floor(gp);
  vec2 sc = fract(gp) - 0.5;
  float star = step(0.965, fract(sin(dot(cell, vec2(127.1, 311.7))) * 43758.5453))
             * smoothstep(0.12, 0.04, length(sc));      // 3.5% 的格子有星点
  float floorTex = max(grid * 0.5, star);

  // TODO(day1-adv-2)：坐标域换算——uv 与 u_mouse 各自变到居中等比域
  // （* 2.0 - 1.0 后 x 乘 aspect），产出 p / m。两处必须同域，距离场才有
  // 几何意义。注意中心必须在 (0, 0)：先居中再等比，顺序反了中心会跑偏。
  // y 的翻转 chrome 已在事件桥里完成（左下原点）——自己手写事件监听时
  // 最容易漏的就是这步（讲义 1.5 常见坑第 4 行）。
  // 占位：直接用原始 uv / u_mouse——任务 3 会先看到椭圆的光池，
  // 那正是 aspect 缺席的证词。
  vec2 p = uv;
  vec2 m = u_mouse;

  // TODO(day1-adv-3)：聚光灯光池——distance(p, m) 距离场 + pow 衰减的两层
  // 光照。半径基准 0.18（居中域）：外圈 lit 光池渐层、核心 hot 灯芯白热。
  // 光要落在东西上才看得见：先 color += LIT * lit * 0.30（空气散射），
  // 再 color += 地板色 * floorTex * lit * 1.15（网格星屑显形），
  // 最后 color += mix(LIT, HOT, hot) * hot * 0.55（灯芯）。
  // 占位：无光照，只剩暗态地板 3.5% 微光
  vec3 color = BG + vec3(0.55, 0.65, 0.80) * floorTex * 0.035;

  // TODO(day1-adv-4)：按压收束——距离除以 mix(1.0, 0.6, easeOutBack(u_down))。
  // 实现提示：距离除以 scale，等价于半径乘 scale，而且不用改光照公式；
  // easeOutBack 的过冲就是你要的「收过头再弹回」的追光手感。收束时
  // 更亮（追光聚焦）：亮度乘 1.0 + (1.0 - scale) * 0.9。
  // 占位：无收束

  // TODO(day1-adv-5)：拖向甩长——p 相对 m 的偏移在 u_vel 方向压缩。
  // 思路：偏移分解为「沿速度方向」与「垂直方向」两个分量，沿速度方向
  // 的距离除以大于 1 的拉伸系数（速度越快甩得越长），垂直方向不动——
  // 光斑主轴自然对齐甩动方向，静止时 u_vel 趋于 0 恢复正圆。
  // 注意 u_vel 是 0–1 域的，先换算到居中域（乘 2、x 乘 aspect）。
  // 占位：无拉伸

  // 暗角收边（脚手架，无需改动）
  color *= 1.0 - 0.15 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
