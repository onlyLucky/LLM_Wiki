#version 300 es
// Day 1 · 作业 A —— 片元着色器：追光的萤火
// 任务 2–5 全在这：坐标域 → 主体 glow → 按压回弹 → 拖向拉伸。
// 骨架可编译（uniform 已声明、效果段保守占位），补全一段刷新一次。

precision highp float;

uniform vec2 u_resolution;
uniform vec2 u_mouse;  // 平滑鼠标（0–1，左下原点，chrome 已翻转）
uniform float u_down;  // 按压进度（0–1 线性，0.6s——曲线是任务 4 的事）
uniform vec2 u_vel;    // 每帧位移（0–1 域，任务 5 的速度向量）

out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 CYAN = vec3(0.298, 0.624, 0.941); // #4CC9F0
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D

// TODO(day1-adv-4)：easeOutBack 从讲义 1.6 原样抄进来
// （四行：clamp → c1 = 1.70158 → c3 = c1 + 1.0 → 过冲公式）

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // TODO(day1-adv-2)：坐标域换算——uv 与 u_mouse 各自变到居中等比域
  // （* 2.0 - 1.0 后 x 乘 aspect），产出 p / m。两处必须同域，距离场才有
  // 几何意义。注意中心必须在 (0, 0)：先居中再等比，顺序反了中心会跑偏。
  // y 的翻转 chrome 已在事件桥里完成（左下原点）——自己手写事件监听时
  // 最容易漏的就是这步（讲义 1.5 常见坑第 4 行）。
  // 占位：直接用原始 uv / u_mouse——任务 3 会先看到椭圆的萤火，
  // 那正是 aspect 缺席的证词。
  vec2 p = uv;
  vec2 m = u_mouse;

  // TODO(day1-adv-3)：萤火主体——distance(p, m) 距离场 + pow 衰减的
  // 径向 glow。半径基准 0.18（居中域），外圈天青渐层、核心白热偏暖。
  // 占位：无主体
  vec3 color = BG;

  // TODO(day1-adv-4)：按压收缩——半径等效乘 mix(1.0, 0.6, easeOutBack(u_down))。
  // 实现提示：距离除以 scale，等价于半径乘 scale，而且不用改 glow 公式；
  // easeOutBack 的过冲就是你要的「回弹一下再落定」。
  // 占位：无收缩

  // TODO(day1-adv-5)：拖向拉伸——p 相对 m 的偏移在 u_vel 方向压缩。
  // 思路：偏移分解为「沿速度方向」与「垂直方向」两个分量，沿速度方向
  // 的距离除以大于 1 的拉伸系数（速度越快拉得越长），垂直方向不动——
  // 椭圆主轴自然对齐运动方向，静止时 u_vel 趋于 0 恢复正圆。
  // 注意 u_vel 是 0–1 域的，先换算到居中域（乘 2、x 乘 aspect）。
  // 占位：无拉伸

  // 暗角收边（脚手架，无需改动）
  color *= 1.0 - 0.15 * length(uv - 0.5);

  fragColor = vec4(color, 1.0);
}
