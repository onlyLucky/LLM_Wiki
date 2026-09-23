# 作业 B · 全息卡面

> Day 2 · B 档 · 约 40 分钟 · 前置：讲义 [2.1 像素级绘画](../../../讲义/day2-片段着色器视觉算法/2.1-像素级绘画：从step到符号距离场.md)

## 目标

屏幕中央一张全息收藏卡：对角渐变卡面、恒宽描边、一道衍射亮带沿对角线缓缓扫过、随时间呼吸缩放——「shader 化的闪卡」，售价 999 的全息 foil 内核件。技术考点：`sdBox` 圆角化、`smoothstep + fwidth` 抗锯齿填充、`abs(sd)` 二次 SDF 描边、呼吸与流光的相位参数化。

## 前置讲义

2.1 一讲覆盖前三个任务：形状库（sdBox 与圆角版）、填充行（fwidth 主旋律）、描边（`abs(sd) - w`）；流光与呼吸的相位公式回看 1.6 相位表。骨架 `main.ts` 是全脚手架——四个 TODO 全在 fragment。

## 任务清单

`main.ts` 无需改动，按序补 `shaders/fragment.glsl`，每补一段刷新一次：

1. **TODO(day2-basic-1)** — `sdCard`：讲义 2.1 的 `sdBox` 迁移 + 圆角参数（`sdBox(p, b - r) - r`）。完成后画面出现圆角方剪影（纯色）。
2. **TODO(day2-basic-2)** — 填充 + 对角渐变：`fill` 用 fwidth 一行；基色 `t = clamp((p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5, 0, 1)`，`body = mix(ROSE, CYAN, t)`，方向斜向 45°（验收条款）。
3. **TODO(day2-basic-3)** — 描边：`abs(sd) - 0.01` 的二次 SDF 再填充；半宽换 `fwidth(sd) * 2.0` 得恒定 2px 视觉宽。
4. **TODO(day2-basic-4)** — 呼吸（3s、±4% 乘尺寸）+ 全息流光：`pow(0.5 + 0.5 * sin((p.x + p.y) * 12.0 - u_time * 2.0), 6.0)` 收窄成一道亮带，加色叠进卡面、乘 `fill` 限制在卡内。

## 验收标准

- 边缘无锯齿（fwidth 的功劳，贴屏看）
- 描边恒定 2px 视觉宽（不随位置变粗变细）
- 渐变方向斜向 45°，宽屏不变形
- 流光是一道窄亮带匀速扫过，不是满屏频闪（pow 次数太低会糊成波浪）
- 呼吸节奏稳定无跳帧，周期目测 3 秒
- 60fps
- 加分项：流光带随呼吸同步增亮；或卡面内部再叠一圈内缩描边线（`abs(sd) - 0.02` 的进阶用法）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

卡面 = 三个通道的叠加：填充通道（形状内部 1、外部 0）、描边通道（边界带内 1）、卡面色（填充内部按位置取色）+ 一个流光通道（卡内沿对角线随时间移动的窄亮带）。通道全从同一个 `sd` 与同一组坐标推导——这就是「一个距离场养活全家」：先有 SDF，再谈一切。

</details>

<details>
<summary>第二档 · API</summary>

`sdBox(p, b)`（讲义 2.1）· `smoothstep(a, b, x)` · `fwidth(x)` · `mix(a, b, t)` · `abs(x)` · `sin(x)` · `pow(x, y)`。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
float sdCard(vec2 p, float breath) {
  vec2 b = vec2(0.32, 0.42) * breath;
  float r = 0.10;
  vec2 d = abs(p) - (b - r);              // sdBox 的内芯，b 先减圆角
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

float breath = 1.0 + 0.04 * sin(u_time * 6.2831853 / 3.0);
float sd = sdCard(p, breath);
float fill = 1.0 - smoothstep(0.0, fwidth(sd), sd);
float ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.01);

float t = clamp((p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5, 0.0, 1.0);
vec3 body = mix(ROSE, CYAN, t);           // 对角渐变做卡面基色
float shimmer = pow(0.5 + 0.5 * sin((p.x + p.y) * 12.0 - u_time * 2.0), 6.0);

col = mix(col, body, fill);
col += vec3(0.85, 0.95, 1.0) * shimmer * fill;  // 流光是加色，不是 mix
col = mix(col, body * 1.35, ring);
```

</details>
