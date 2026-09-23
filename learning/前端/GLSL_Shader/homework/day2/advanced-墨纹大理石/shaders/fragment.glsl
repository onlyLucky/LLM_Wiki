#version 300 es
// Day 2 · 作业 A —— 片元着色器：墨纹大理石
// 噪声塔逐层点亮：noise → fbm → warp → palette → gamma。
// 每层的占位是「透传上一层」，补全一段，墨纹长出一层。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_vel; // 拖动速度向量（0–1 域帧差，任务 5 的 TS 半边写入）

out vec4 fragColor;

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14（脚手架预留，本题画面即纸色）

// ---- hash：脚手架给足（讲义 2.3）--------------------------------
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// TODO(day2-adv-1)：value noise 四步（讲义 2.4 代码段迁移）
// 格点 hash → 四角值 → smoothstep 缓动 → 双线性 mix。
// 占位：return 0.5——均匀灰直纹，任务 1 完成后出现平缓的大弯脉
float noise(vec2 p) {
  return 0.5; // 占位：删掉这行，写你的四步
}

// TODO(day2-adv-2)：fbm 五倍频封装
// 振幅减半、频率加倍（旋 37° 的矩阵 m，讲义 2.4 的防纺织纹版本）
// 占位：透传 noise——任务 2 完成后脉上长出褶皱层次
float fbm(vec2 p) {
  return noise(p); // 占位：删掉这行，写你的五倍频
}

// TODO(day2-adv-4)：调色板——iq 余弦结构不变，参数调进纸墨区间
// 关键是 c：c = 0.5 让 t 只走半圈（纸→墨单向过渡）；d 定相位并三通道错峰
// 占位：灰度透传——任务 4 完成后宣纸上墨
vec3 palette(float t) {
  return vec3(t); // 占位：删掉这行，写你的余弦调色板
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // TODO(day2-adv-5)：搅水向量——基础漂移 + 拖动方向偏置
  // 提示：基础漂移 (0.03, 0.02)——墨在水里是慢的；拖动偏置 = u_vel
  // 的方向 × 0.2（u_vel 已是帧差，直接加即可；记得 x 乘 aspect 保持同域）
  vec2 flow = vec2(u_time * 0.03, u_time * 0.02); // 占位：只有基础漂移

  // TODO(day2-adv-3)：domain warping 一行（k = 0.8 墨流档）
  // q = vec2(fbm(p + 错相偏移), fbm(p + 另一错相))，再 f = fbm(p + k * q)
  // 占位：直接采 fbm——任务 3 完成后脉被揉出回勾
  float f = fbm(p * 1.2 + flow); // 占位：无 warp

  // ---- 墨脉相位（脚手架，无需改动）：平行纹被 f 揉皱----
  // sin 的相位里混入 fbm：f 平滑时是缓弯，有 warp 后是回勾与飞白——
  // 「纹样」不是「天气」：脉是线，纸面天然留白
  float phase = dot(p, vec2(0.55, 0.85)) * 5.0 + f * 12.0;
  float vein = pow(0.5 + 0.5 * sin(phase), 7.0);              // 主脉
  float fine = pow(0.5 + 0.5 * sin(phase * 2.7 + 1.3), 14.0); // 支脉飞白
  float t = clamp(1.0 - vein * 1.15 - fine * 0.55, 0.0, 1.0); // 脉处 t→墨
  vec3 col = palette(t);

  // TODO(day2-adv-4)：gamma 收尾——pow(col, vec3(0.4545))
  // 占位：未校正

  // vignette（脚手架，无需改动）——纸面的旧感
  col *= 1.0 - 0.15 * pow(length(uv - 0.5), 2.0);

  fragColor = vec4(col, 1.0);
}
