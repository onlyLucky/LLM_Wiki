# 作业 A · 墨纹大理石

> Day 2 · A 档 · 约 60 分钟 · 前置：讲义 [2.4 噪声](../../../讲义/day2-片段着色器视觉算法/2.4-噪声：valuenoise到domainwarping.md)、[2.5 色彩工程](../../../讲义/day2-片段着色器视觉算法/2.5-色彩工程：余弦调色板与配色直觉.md)

## 目标

宣纸上凝出墨流：平行细纹被 fbm 揉皱成 suminagashi 脉线，拖动是搅动水面、墨脉被拉扯出回勾，松手缓慢回落——「纹样」不是「天气」，大部分画面是纸，脉才是主角。技术考点：value noise 四步、fbm 封装、warp 嵌套、调色板与 gamma、搅水向量的双半边接线。

## 前置讲义

2.4 是主战场（noise → fbm → warp 三层塔的全部代码段）；2.5 提供 palette 与 gamma 收尾。骨架的占位是「透传上一层」——每补一个任务，墨纹就长出一层，这是 Day 2 挖空设计的核心。

## 任务清单

1. **TODO(day2-adv-1)** — fragment：value noise 四步（讲义 2.4 代码段迁移）。完成后画面从灰直纹变成平缓的大弯脉。
2. **TODO(day2-adv-2)** — fragment：fbm 五倍频（振幅减半、频率加倍、旋 37° 矩阵防纺织纹）。完成后脉上长出褶皱层次。
3. **TODO(day2-adv-3)** — fragment：domain warping 一行（k=0.8）。完成后脉被揉出回勾与飞白。
4. **TODO(day2-adv-4)** — fragment：调色板（iq 余弦结构不变——`c = 0.5` 让 t 只走半圈、`d` 定相位并三通道错峰，调进纸墨区间）+ `pow(col, vec3(0.4545))` gamma 收尾。完成后宣纸上墨、墨分五色。
5. **TODO(day2-adv-5)** — 两个半边：`main.ts` 帧差写入 `u_vel`（先取差再更新 prev）；fragment 的 `flow` 加拖动偏置（`u_vel` 方向 × 0.2，x 记得乘 aspect 同域）。

## 验收标准

- 大部分画面是纸：脉是线不是云（pow 收窄档位没失守）
- 脉缘有回勾与飞白（warp 后放大看脉的缘，不是均匀平行纹）
- 拖动搅水自然，墨脉被拉扯变形，松手缓慢回落基础漂移
- gamma 后纸不刺眼、墨缘出现灰阶（墨分五色）
- 60fps（五倍频 + 单层 warp 的性能纪律）
- 加分项：角落一枚朱砂小印（sdBox 距离场 + mask）；或脉缘双层（浓墨 + 淡晕）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

按塔搭：每层只做一件事——noise 管「格子间的平滑」，fbm 管「细节分层」，warp 管「采样点被推走」，palette 管「值变颜色」。本题的新直觉是「脉线 = 相位噪声」：sin 的相位里混入 fbm，平行纹就被揉皱——fbm 不上色、只扭相位，云海感就没了。另一条纪律：「拖动是搅水」——只偏 flow（展示层），不碰 hash 的种子层。

</details>

<details>
<summary>第二档 · API</summary>

`floor / fract`（格点分解）· `mix`（双线性）· `f * f * (3 - 2 * f)`（缓动坐标）· `mat2(1.6, 1.2, -1.2, 1.6)`（37° 倍频矩阵）· `dot`（把平面坐标投影成一个相位）· `sin / pow`（脉线与收窄）· `cos`（调色板）· `pow(col, vec3(0.4545))`（gamma）。

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

vec2 q = vec2(fbm(p * 1.2 + vec2(0.0, u_time * 0.02)),
              fbm(p * 1.2 + vec2(5.2, 1.3)));
float f = fbm(p * 1.2 + flow + 0.8 * q);       // k = 0.8

// 墨脉：平行纹被 f 揉皱（脚手架已预置）
float phase = dot(p, vec2(0.55, 0.85)) * 5.0 + f * 12.0;
float vein = pow(0.5 + 0.5 * sin(phase), 7.0);
float fine = pow(0.5 + 0.5 * sin(phase * 2.7 + 1.3), 14.0);
float t = clamp(1.0 - vein * 1.15 - fine * 0.55, 0.0, 1.0);

vec3 palette(float t) { /* a + b*cos(TAU*(c*t+d))，c=0.5 走半圈 */ }
vec3 col = palette(t);
col = pow(col, vec3(0.4545));                  // gamma 收尾
```

</details>
