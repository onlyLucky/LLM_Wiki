#version 300 es
// Day 2 · 作业 A —— 片元着色器：流动的丝绸
// 噪声塔逐层点亮：noise → fbm → warp → palette → gamma。
// 每层的占位是「透传上一层」，补全一段，丝绸长出一层。

precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_vel; // 拖动速度向量（0–1 域帧差，任务 5 的 TS 半边写入）

out vec4 fragColor;

const vec3 BG = vec3(0.043, 0.055, 0.078); // #0B0E14

// ---- hash：脚手架给足（讲义 2.3）--------------------------------
float hash21(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

// TODO(day2-adv-1)：value noise 四步（讲义 2.4 代码段迁移）
// 格点 hash → 四角值 → smoothstep 缓动 → 双线性 mix。
// 占位：return 0.5——均匀灰，任务 1 完成后出现大团块
float noise(vec2 p) {
  return 0.5; // 占位：删掉这行，写你的四步
}

// TODO(day2-adv-2)：fbm 五倍频封装
// 振幅减半、频率加倍（旋 37° 的矩阵 m，讲义 2.4 的防纺织纹版本）
// 占位：透传 noise——任务 2 完成后细节分层出现
float fbm(vec2 p) {
  return noise(p); // 占位：删掉这行，写你的五倍频
}

// TODO(day2-adv-4)：调色板——a/b/c/d 抄讲义 2.5 的 iq 经典卡
// 熔岩卡（暗红→金）或蓝橙卡（电影感）二选一，改 d 微调
// 占位：灰度透传——任务 4 完成后画面上色
vec3 palette(float t) {
  return vec3(t); // 占位：删掉这行，写你的余弦调色板
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  vec2 p = uv * 2.0 - 1.0;
  p.x *= aspect;

  // TODO(day2-adv-5)：流速向量——基础流向 + 拖动方向偏置
  // 提示：基础流向 (0.12, 0.06)；拖动偏置 = u_vel 的方向 × 0.2
  // （u_vel 已是帧差，直接加即可；记得 x 乘 aspect 保持同域）
  vec2 flow = vec2(u_time * 0.12, u_time * 0.06); // 占位：只有基础流向

  // TODO(day2-adv-3)：domain warping 一行（k = 0.8 丝绸档）
  // q = vec2(fbm(p + 错相偏移), fbm(p + 另一错相))，再 f = fbm(p + k * q)
  // 占位：直接采 fbm——任务 3 完成后丝绸出现
  float f = fbm(p * 1.2 + flow); // 占位：无 warp

  // t 再分布（讲义 2.4 的教训：fbm 挤在 0.35–0.65）
  float t = clamp(f * 1.6 - 0.3, 0.0, 1.0);
  vec3 col = palette(t);

  // TODO(day2-adv-4)：gamma 收尾——pow(col, vec3(0.4545))
  // 占位：未校正

  // vignette（脚手架，无需改动）
  col *= 1.0 - 0.15 * pow(length(uv - 0.5), 2.0);

  fragColor = vec4(col, 1.0);
}
