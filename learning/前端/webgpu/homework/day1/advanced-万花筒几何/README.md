# 作业 A · 万花筒几何

## 目标

一个六边形环带（内外两圈顶点构成）绕中心持续旋转，整体幅度随时间呼吸缩放。顶点数据用 interleaved 布局 + 索引绘制，变换用 uniform 里的 2D model 矩阵——这是 Day 2 手写 MVP 矩阵前的最后一级台阶。

## 前置讲义

- `1.5 顶点缓冲与几何数据`：interleaved 布局、index buffer 与 `drawIndexed`
- `1.6 Uniform 与绑定组`：uniform 里的矩阵布局与 `writeBuffer`

## 任务清单

1. main.ts 的 `TODO(day1-advanced-1)`：在 `buildHexRing()` 里生成六边形环的 12 个顶点（interleaved `[x, y, r, g, b]`）与 36 个索引
2. main.ts 的 `TODO(day1-advanced-2)`：在 `rotation2D()` 里手写 2D 旋转矩阵，返回列主序 mat3 的 9 个数
3. main.ts 的 `TODO(day1-advanced-3)` 与 hex.wgsl 的同名 TODO：把 model 矩阵写进 uniform、上传，并在顶点着色器里应用
4. main.ts 的 `TODO(day1-advanced-4)`：在 `breatheScale()` 里实现呼吸缩放系数，折进矩阵

页面按 1 → 2 → 4 → 3 的顺序提示未完成项：任务 3 消费前两者的产物，最后合龙。

## 验收标准

- 环带几何正确：12 个顶点拼出闭合的六边形环，无缺口、无重叠三角
- 旋转平滑、呼吸缩放连续，错误面板无报错
- 60 FPS（右下角标注）
- 加分：鼠标横移时环带产生轻微的色彩或亮度扰动

## 提示

<details>
<summary>第一档 · 思路</summary>

任务 1 想清楚「下标怎么编」：内圈 6 个顶点按角度 k × 60° 排一圈、外圈同样排一圈，每条边连成一个四边形，再拆成两个三角形（demo 03 的思路从四边形搬到六边形）。任务 2 想清楚「列主序」：WGSL 的 `mat3x3f` 按列存放，`u.model * vec3f(p, 1.0)` 取的是「矩阵的列 × 向量分量」的组合。任务 3 想清楚「缩放乘在哪」：均匀缩放乘进前两列即可，第三列 (0, 0, 1) 保持不动。任务 4 是一个 `sin` 的事。
</details>

<details>
<summary>第二档 · API 名</summary>

`Math.cos` / `Math.sin` · `Float32Array` / `Uint16Array` · `uniforms.set(九个数, 0)` · `device.queue.writeBuffer` · `mat3x3f` · `u.model * vec3f(vin.position, 1.0)`
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// 任务 1：顶点与索引
const verts: number[] = [], idx: number[] = [];
for (let k = 0; k < 6; k++) {
  const a = (k / 6) * Math.PI * 2;
  verts.push(Math.cos(a) * 0.25, Math.sin(a) * 0.25, ...BLUE);   // 内圈 k → 下标 2k
  verts.push(Math.cos(a) * 0.62, Math.sin(a) * 0.62, ...VIOLET); // 外圈 k → 下标 2k + 1
}
for (let k = 0; k < 6; k++) {
  const n = (k + 1) % 6;
  idx.push(2 * k, 2 * n, 2 * n + 1);  // 内 k → 内 n → 外 n
  idx.push(2 * k, 2 * n + 1, 2 * k + 1); // 内 k → 外 n → 外 k
}
```

```ts
// 任务 2 与任务 4
function rotation2D(angle: number): number[] {
  const c = Math.cos(angle), s = Math.sin(angle);
  return [c, s, 0, -s, c, 0, 0, 0, 1]; // 列 0、列 1、列 2
}
function breatheScale(t: number): number {
  return 1 + 0.05 * Math.sin(t * 1.2);
}

// 任务 3：帧循环里
uniforms.set(spin.map((v, i) => (i < 6 ? v * pulse : v)), 0); // 缩放乘前两列
device.queue.writeBuffer(uniformBuffer, 0, uniforms);
```

```wgsl
// 任务 3：hex.wgsl 的 vs 里
let p = (u.model * vec3f(vin.position, 1.0)).xy;
out.position = vec4f(p * vec2f(u.aspect, 1.0), 0.0, 1.0);
```
</details>
