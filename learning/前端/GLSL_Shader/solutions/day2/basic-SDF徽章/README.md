# 作业 B 答案 · SDF 徽章

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day2/basic-SDF徽章/index.html`。

## 实现要点

- **描边恒宽靠 fwidth 不靠写死**：`abs(sd) - 0.012` 里的半宽在不同分辨率下代表不同像素数——把 smoothstep 的过渡带宽换成 `fwidth(sd) * 2.0`，任何 DPR、任何缩放级别都是恒定 2px 视觉宽。「写死数值」与「屏幕空间自适应」的分界，就是本档最重要的一个习惯。
- **呼吸乘尺寸不乘颜色**：`b * breath` 让形状整体缩放 ±4%；写成 `color * breath` 会把亮色推过 1 过曝——与 Day 1 B 档「呼吸乘 mix 系数」是同一条纪律的两个面。
- **圆角的实现顺序**：`sdBox(p, b - r) - r`——先把盒缩小 r 再把距离往回收 r。两步缺一不可：只缩不收是「直角小盒」，只收不缩是「圆角胖盒」。
- **描边色提亮 35% 而不是换色**：与填充同色系的描边比撞色描边更像「一道光边」——徽章的金属感来自同色明度差，不是色相差。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day2-basic-1 | fragment | `sdBadge` 实现：圆角方（b=(0.32,0.42)、r=0.10），占位 `return 999.0` 删除 |
| day2-basic-2 | fragment | `fill = 1.0 - smoothstep(0.0, fwidth(sd), sd)` |
| day2-basic-3 | fragment | `ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.012)` |
| day2-basic-4 | fragment | `breath`（3s ±4%）；对角渐变 `mix(ROSE, CYAN, t)` |
| —（超出任务） | fragment | 描边色 `body * 1.35`、vignette 0.15 |

其余逐字一致（main.ts 完全没动）。

## 视觉规格

- 色板：填充玫红 `#FF4D6D` → 天青 `#4CC9F0` 对角 45°、描边同色系 +35% 明度、底 `#0B0E14`
- 构图：中心聚焦，徽章占屏约 32%×42%
- 动效：呼吸周期 3s、幅度 ±4%（乘尺寸）
- 细节：fwidth 抗锯齿填充与描边恒宽 2px、vignette 0.15、入场 800ms
- 性能：单 pass、无噪声无循环，60fps 成本近零
