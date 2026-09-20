# 作业 B · SDF 徽章

> Day 2 · B 档 · 约 40 分钟 · 前置：讲义 [2.1 像素级绘画](../../../讲义/day2-片段着色器视觉算法/2.1-像素级绘画：从step到符号距离场.md)

## 目标

屏幕中央一枚圆角方形徽章：玫红描边、内部斜向对角渐变、随时间呼吸缩放——「shader 化的 logo 卡片」，hover 按钮的内核件。技术考点：`sdBox` 圆角化、`smoothstep + fwidth` 抗锯齿填充、`abs(sd)` 二次 SDF 描边、呼吸参数化乘尺寸。

## 前置讲义

2.1 一讲覆盖全部四个任务：形状库（sdBox 与圆角版）、填充行（fwidth 主旋律）、描边（`abs(sd) - w`）、参数化呼吸。骨架 `main.ts` 是全脚手架——四个 TODO 全在 fragment。

## 任务清单

`main.ts` 无需改动，按序补 `shaders/fragment.glsl`，每补一段刷新一次：

1. **TODO(day2-basic-1)** — `sdBadge`：讲义 2.1 的 `sdBox` 迁移 + 圆角参数（`sdBox(p, b - r) - r`）。完成后画面出现圆角方剪影（纯色）。
2. **TODO(day2-basic-2)** — 填充：`1.0 - smoothstep(0.0, fwidth(sd), sd)` 一行。
3. **TODO(day2-basic-3)** — 描边：`abs(sd) - 0.01` 的二次 SDF 再填充；半宽换 `fwidth(sd) * 2.0` 得恒定 2px 视觉宽。
4. **TODO(day2-basic-4)** — 呼吸（3s、±4% 乘尺寸）+ 内部对角渐变（`(p.x + p.y)` 归一化后 `mix(ROSE, CYAN, t)`）。

## 验收标准

- 边缘无锯齿（fwidth 的功劳，贴屏看）
- 描边恒定 2px 视觉宽（不随位置变粗变细）
- 呼吸节奏稳定无跳帧，周期目测 3 秒
- 渐变方向斜向 45°，宽屏不变形
- 60fps
- 加分项：描边色随呼吸同步微调亮度；或徽章内部再叠一枚缩小 60% 的圆角方（smin 或纯 min 组合）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

徽章 = 三个通道的叠加：填充通道（形状内部 1、外部 0）、描边通道（边界带内 1）、渐变色（填充内部按位置取色）。三个通道全从同一个 `sd` 推导——这就是「一个距离场养活全家」：先有 SDF，再谈一切。

</details>

<details>
<summary>第二档 · API</summary>

`sdBox(p, b)`（讲义 2.1）· `smoothstep(a, b, x)` · `fwidth(x)` · `mix(a, b, t)` · `abs(x)`。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
float sdBadge(vec2 p, float breath) {
  vec2 b = vec2(0.32, 0.42) * breath;
  float r = 0.10;
  vec2 d = abs(p) - (b - r);              // sdBox 的内芯，b 先减圆角
  return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - r;
}

float breath = 1.0 + 0.04 * sin(u_time * 6.2831853 / 3.0);
float sd = sdBadge(p, breath);
float fill = 1.0 - smoothstep(0.0, fwidth(sd), sd);
float ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.01);

float t = clamp((p.x + p.y) / (aspect + 1.0) * 0.5 + 0.5, 0.0, 1.0);
vec3 body = mix(ROSE, CYAN, t);           // 对角渐变做填充色
col = mix(col, body, fill);
col = mix(col, ROSE * 1.1, ring);
```

</details>
