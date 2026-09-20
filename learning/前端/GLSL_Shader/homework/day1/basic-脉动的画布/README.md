# 作业 B · 脉动的画布

> Day 1 · B 档 · 约 30 分钟 · 前置：讲义 [1.5 数据流与全屏四边形](../../../讲义/day1-GLSL语言与WebGL2管线/1.5-数据流与全屏四边形.md)、[1.6 时间与动画](../../../讲义/day1-GLSL语言与WebGL2管线/1.6-时间与动画.md)

## 目标

一面会呼吸的 hero 背景：两色渐变沿 45° 对角铺开，混合位置以 3 秒周期缓慢摆动 8%，四角轻微压暗收边——挂在任何落地页顶部都能用，这是 B 档的交付标准。技术考点是 Day 1 的最小闭环：uniform 三件套（时间与颜色从 JS 广播进 shader）、居中等比坐标域、`mix` 插值、`sin` 呼吸调制、vignette 一行流。

## 前置讲义

1.6 是主线：「时间 → 正弦 → 混合系数」这条链路就是本题的全部动画逻辑。1.5 提供坐标底座——居中三行与 aspect 修正，任务 2 原样要用。

## 任务清单

按序完成，每补一段刷新一次：

1. **TODO(day1-basic-1)** — 三处接线：`shaders/fragment.glsl` 声明 `u_time` / `u_colorA` / `u_colorB`；`main.ts` 查询三个 location；帧循环写入（时间用骨架给的 `t`，颜色用你选的一对）。写完删掉 `main.ts` 里的 `throw`。
2. **TODO(day1-basic-2)** — fragment：uv 居中化 + aspect 修正（讲义 1.5 三行），产出 `p`。完成后画面暂无变化——`p` 要等任务 3 消费。
3. **TODO(day1-basic-3)** — fragment：`mix` 两色，混合系数取 `p` 的对角投影（折算到 0–1），`sin` 呼吸调制系数（周期 3s、幅度 8%）。呼吸乘在混合系数上，不是颜色上——乘颜色会过曝。
4. **TODO(day1-basic-4)** — fragment：vignette 一行，用 0–1 域的 `uv`。

## 验收标准

- 呼吸节奏稳定无跳帧，周期目测 3 秒左右
- 渐变方向斜向 45°，宽屏上不变形（aspect 修正的证据）
- vignette 可感知但不抢戏：四角暗、中心亮
- 常开一分钟不掉帧（60fps）
- 加分项：呼吸相位叠一层半频正弦出「双起伏」手感；或双色带（对角线两次 mix）

## 提示

卡住 15 分钟再打开下一档。直接翻到第三档，这道题就白做了。

<details>
<summary>第一档 · 思路</summary>

时间除以周期得「圈数」，`sin` 把圈数变成 -1 到 1 的一维摆动，摆动乘进 `mix` 的第三个参数。对角渐变的关键是「投影」：居中域变量 `p` 点乘对角方向单位向量，得到的标量沿 45° 单调变化——这比 `uv.x + uv.y` 之类的野路子好在宽屏上不截断、不溢出。

</details>

<details>
<summary>第二档 · API</summary>

`mix(a, b, t)`（线性插值）/ `sin(x)` / `clamp(x, lo, hi)` / `length(v)` / `dot(a, b)`（投影用）/ `normalize(v)`。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
float aspect = u_resolution.x / u_resolution.y;
vec2 p = uv * 2.0 - 1.0;   // 居中
p.x *= aspect;             // 等比：x 方向物理跨度更长

// 对角投影归一化到 0–1（想想分母为什么是 aspect + 1.0）
float diag = (p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5;
float breath = sin(u_time * 6.2831853 / 3.0);   // 周期 3s
float k = clamp(diag + breath * 0.08, 0.0, 1.0); // 呼吸调系数

vec3 color = mix(u_colorA, u_colorB, k);
color *= 1.0 - 0.18 * length(uv - 0.5);         // vignette（0–1 域）
```

</details>
