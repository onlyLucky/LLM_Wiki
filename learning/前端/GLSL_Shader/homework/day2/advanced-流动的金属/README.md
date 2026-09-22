# 作业 A · 流动的丝绸

> Day 2 · A 档 · 约 60 分钟 · 前置：讲义 [2.4 噪声](../../../讲义/day2-片段着色器视觉算法/2.4-噪声：valuenoise到domainwarping.md)、[2.5 色彩工程](../../../讲义/day2-片段着色器视觉算法/2.5-色彩工程：余弦调色板与配色直觉.md)

## 目标

全屏丝绸质感流动背景：iq 色卡上色、k=0.8 的 domain warping、拖动鼠标改变流向——「获奖站背景层」，lusion 式 hero 的底料。技术考点：value noise 四步、fbm 封装、warp 嵌套、调色板与 gamma、流速向量的双半边接线。

## 前置讲义

2.4 是主战场（noise → fbm → warp 三层塔的全部代码段）；2.5 提供 palette 与 gamma 收尾。骨架的占位是「透传上一层」——每补一个任务，丝绸就长出一层，这是 Day 2 挖空设计的核心。

## 任务清单

1. **TODO(day2-adv-1)** — fragment：value noise 四步（讲义 2.4 代码段迁移）。完成后画面从均匀灰变成大团块噪声。
2. **TODO(day2-adv-2)** — fragment：fbm 五倍频（振幅减半、频率加倍、旋 37° 矩阵防纺织纹）。完成后细节分层出现。
3. **TODO(day2-adv-3)** — fragment：domain warping 一行（k=0.8）。完成后团块变丝绸。
4. **TODO(day2-adv-4)** — fragment：调色板（a/b/c/d 抄 iq 卡）+ `pow(col, vec3(0.4545))` gamma 收尾。完成后灰度上色、暗部透亮。
5. **TODO(day2-adv-5)** — 两个半边：`main.ts` 帧差写入 `u_vel`（先取差再更新 prev）；fragment 的 `flow` 加拖动偏置（`u_vel` 方向 × 0.2，x 记得乘 aspect 同域）。

## 验收标准

- 流动速度均匀无「打滑」（warp 后 fbm 的时间采样点不跳变）
- warp 层次可见：放大看丝绸的褶，不是均匀云
- 色卡无脏渐变（余弦错峰，不是线性 mix）
- 拖动改变流向自然，松手回落基础流向
- 60fps（五倍频 + 单层 warp 的性能纪律）
- 加分项：调色板换你自己在 demo 05 攒的参数；或条纹版丝绸（相位混入 fbm，demo 04 手法）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

按塔搭：每层只做一件事——noise 管「格子间的平滑」，fbm 管「细节分层」，warp 管「采样点被推走」，palette 管「值变颜色」。占位都是透传上一层，所以每完成一层，画面都有可见的升级——这是检验你是否真的完成的最诚实信号。

</details>

<details>
<summary>第二档 · API</summary>

`floor / fract`（格点分解）· `mix`（双线性）· `f * f * (3 - 2 * f)`（缓动坐标）· `mat2(1.6, 1.2, -1.2, 1.6)`（37° 倍频矩阵）· `cos`（调色板）· `pow(col, vec3(0.4545))`（gamma）。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash21(i),                 hash21(i + vec2(1, 0)), u.x),
             mix(hash21(i + vec2(0, 1)),     hash21(i + vec2(1, 1)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  mat2 m = mat2(1.6, 1.2, -1.2, 1.6);
  for (int i = 0; i < 5; i++) { v += a * noise(p); p = m * p; a *= 0.5; }
  return v;
}

vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, u_time * 0.06)),
              fbm(p * 1.2 + vec2(5.2, 1.3)));
float f = fbm(p * 1.2 + flow + 0.8 * q);       // k = 0.8

vec3 palette(float t) { /* a + b*cos(TAU*(c*t+d))，抄 iq 卡 */ }
vec3 col = palette(clamp(f * 1.6 - 0.3, 0.0, 1.0));
col = pow(col, vec3(0.4545));                  // gamma 收尾
```

</details>
