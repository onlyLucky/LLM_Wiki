# 作业 C · 星轨动画

## 目标

六圈同心星轨同时旋转：环号越大转速越快、方向逐环反转，线色沿半径渐变，整体随鼠标产生深度视差（外环幅度更大）。全部几何静态躺在单块顶点 buffer 里，旋转、相位与视差在顶点着色器里由 `vertex_index` 与 uniform 推导——这是「数据不动、着色器算」的极简形态，也是 Day 2 程序化几何的预告片。

## 前置讲义

- `1.3 第一个三角形：渲染管线全解`：图元装配与 topology
- `1.5 顶点缓冲与几何数据`：interleaved 布局与单 buffer 数据组织
- `1.6 Uniform 与绑定组`：32 字节 uniform 布局与 `writeBuffer`

## 任务清单

1. main.ts 的 `TODO(day1-challenge-1)`：`lineTopology()` 返回线段列表的图元类型，让星轨以线段而不是三角形绘制
2. main.ts 的 `TODO(day1-challenge-2)`：`buildStarRings()` 生成 6 环 × 90 段的全部顶点（单 buffer，1080 个顶点）
3. trails.wgsl 的 `TODO(day1-challenge-3)`：顶点着色器里由 `vertex_index` 推环号，计算转速与旋转角并变换顶点
4. trails.wgsl 的 `TODO(day1-challenge-4)`：视差联动——鼠标位移按环深度给不同幅度

任务 1、2 在 main.ts 里直接 `throw`，错误面板按顺序提示；任务 3、4 在 WGSL 里，未完成时画面停在「静止的圆环」，动效逐级点亮。

## 验收标准

- 多环同时反向旋转，转速随环号递增
- 线条清晰无闪烁：90 段的圆够圆，旋转时不闪断
- 顶点色沿半径渐变（内紫外青的单向过渡）
- 鼠标移动产生分层视差，外环幅度更大
- 错误面板与控制台无报错

## 提示

<details>
<summary>第一档 · 思路</summary>

任务 1 想清楚「线段怎么数」：line-list 下每 2 个连续顶点连一条线，所以一个圆要 90 段就得放 90 对端点。任务 2 想清楚「数据怎么排」：外层循环环号、内层循环段号，每段推入角度 a 与 a + 4° 两个端点；颜色按环号在紫与青之间取插值。任务 3 想清楚「着色器怎么知道自己在哪环」：每环固定 180 个顶点，`ring = i / 180u` 一刀切出环号；旋转就是 2D 旋转公式乘上原始位置，角度 = time × speed × dir。任务 4 想清楚「纵深怎么造」：视差幅度随环号递增，鼠标一动，近环小移、远环大移。
</details>

<details>
<summary>第二档 · API 名</summary>

`'line-list'` · `Math.cos` / `Math.sin` · `Float32Array` · `@builtin(vertex_index)` · `i / 180u` · `select(-1.0, 1.0, 条件)` · `mix(VIOLET, TEAL, f32(ring) / 5.0)` · `cos(angle)` / `sin(angle)` · `u.mouse * 幅度`
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// 任务 2：环形顶点数据（main.ts）
const data = new Float32Array(6 * 90 * 2 * 5);
let w = 0; // 写入指针
for (let r = 0; r < 6; r++) {
  const radius = 0.16 + 0.13 * r;
  const c = VIOLET.map((v, i) => v + (TEAL[i] - v) * (r / 5)); // 沿半径渐变
  for (let s = 0; s < 90; s++) {
    for (const angle of [(s / 90) * Math.PI * 2, ((s + 1) / 90) * Math.PI * 2]) {
      data.set([Math.cos(angle) * radius, Math.sin(angle) * radius, ...c], w);
      w += 5;
    }
  }
}
```

```wgsl
// 任务 3 与任务 4：trails.wgsl 的 vs 里
let ring = i / 180u;                                  // 环号 0..5
let dir = select(-1.0, 1.0, (ring % 2u) == 0u);       // 逐环反转
let angle = u.time * (0.10 + 0.06 * f32(ring)) * dir; // 转速随环号递增
let c = cos(angle);
let s = sin(angle);
let p = vec2f(
  vin.position.x * c - vin.position.y * s,
  vin.position.x * s + vin.position.y * c,
);
let parallax = u.mouse * (0.01 + 0.012 * f32(ring));  // 外环幅度更大
out.position = vec4f((p + parallax) * vec2f(u.aspect, 1.0), 0.0, 1.0);
```
</details>
