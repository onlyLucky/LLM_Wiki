#version 300 es
// Day 1 · 作业 B —— 片元着色器：脉动的画布
// 四个 TODO 从上到下：uniform 声明 → 坐标域 → 渐变呼吸 → 暗角。
// 骨架可以编译、可以出画面（保守占位），补全一段刷新一次。

precision highp float; // 片元着色器必须显式声明 float 精度（讲义 1.2）

uniform vec2 u_resolution; // 画布尺寸（物理像素，与 gl_FragCoord 同域）

// TODO(day1-basic-1)：在此声明三个 uniform——u_time（float）、
// u_colorA / u_colorB（vec3）。声明了，JS 侧的写入才有接收方。

out vec4 fragColor; // GLSL ES 3.00 无 gl_FragColor，必须自己声明输出

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;

  // TODO(day1-basic-2)：uv 居中化 + aspect 修正（讲义 1.5 的三行），
  // 产出居中域变量 p。完成后画面暂时没有变化——p 要等任务 3 消费，
  // 但宽屏上「不变形的 45° 渐变」从这一步就注定了。

  // TODO(day1-basic-3)：mix 两色 + sin 呼吸。
  // 斜向 45°：混合系数取 p 在对角方向的投影（折算到 0–1）；
  // 呼吸：周期 3s、幅度 8%，调制的是 mix 的第三个参数——不是颜色本身。
  // 占位：纯底色
  vec3 color = BG;

  // TODO(day1-basic-4)：vignette——color 乘上 1.0 - 0.18 * length(uv - 0.5)。
  // 注意：暗角用 0–1 域的 uv（未居中），居中域 p 交给任务 3 的渐变。
  // 占位：无暗角

  fragColor = vec4(color, 1.0);
}
