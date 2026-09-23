# 作业 B 答案 · 全息卡面

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day2/basic-全息卡面/index.html`。

## 实现要点

- **流光是加色不是 mix**：`col += HOLO * shimmer * fill` 让亮带像光打在卡面上，亮部直接推向过曝白——foil 的高光本质是「多出来的光」，用 mix 只会在渐变色之间打转，永远到不了白。
- **两道亮带错开相位才是 foil**：`pow 6` 的宽带铺辉、`pow 24` 的窄线做棱线高光，`+ 2.6` 相位差让两道带不同步扫动——单道亮带是「扫描线」，双道错相才是「衍射膜」。pow 的次数就是亮带的「窄度旋钮」。
- **呼吸乘尺寸不乘颜色**：`b * breath` 让卡面整体缩放 ±4%；流光强度想同步呼吸，单独乘一项同相的 `sin`（加分项），别把 breath 混进颜色里。
- **描边恒宽靠 fwidth 不靠写死**：`abs(sd) - 0.012` 里的半宽在不同分辨率下代表不同像素数——把 smoothstep 的过渡带宽换成 `fwidth(sd) * 2.0`，任何 DPR、任何缩放级别都是恒定 2px 视觉宽。
- **内框线是描边的进阶**：`abs(abs(sd) - 0.035) - 0.003`——先取到「内缩 0.035 的等距线」，再收窄成细线。和描边共用同一个 `sd`，这就是二次 SDF 的复用。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day2-basic-1 | fragment | `sdCard` 实现：圆角方（b=(0.32,0.42)、r=0.10），占位 `return 999.0` 删除 |
| day2-basic-2 | fragment | `fill`（fwidth 一行）+ 对角渐变 `mix(ROSE, CYAN, t)` |
| day2-basic-3 | fragment | `ring = 1.0 - smoothstep(0.0, fwidth(sd) * 2.0, abs(sd) - 0.012)` |
| day2-basic-4 | fragment | `breath`（3s ±4%）；流光双亮带 `pow 6 + pow 24` 加色叠入 |
| 加分项 | fragment | 流光随呼吸同步增亮；内框线 `abs(abs(sd)-0.035)-0.003` |
| —（超出任务） | fragment | 描边色 `body * 1.35`、vignette 0.15 |

其余逐字一致（main.ts 完全没动）。

## 视觉规格

- 色板：卡面玫红 `#FF4D6D` → 天青 `#4CC9F0` 对角 45°、流光白青 `#D9F2FF`、描边同色系 +35% 明度、底 `#0B0E14`
- 构图：中心聚焦，卡面占屏约 32%×42%
- 动效：流光带约 2 rad/s 沿对角线扫动、双带相位差 2.6；呼吸周期 3s、幅度 ±4%（乘尺寸）
- 细节：fwidth 抗锯齿填充、描边恒宽 2px、内框压印线、vignette 0.15、入场 800ms
- 性能：单 pass、无噪声无循环，60fps 成本近零
