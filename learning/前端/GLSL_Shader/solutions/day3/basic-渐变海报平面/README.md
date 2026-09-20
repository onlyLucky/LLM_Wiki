# 作业 B 答案 · 渐变海报平面

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day3/basic-渐变海报平面/index.html`。

## 实现要点

- **45° 靠坐标系修正，不靠调斜率**：plane 是 6×7.5，直接用 `uv.x + uv.y` 画等值线，斜线在屏幕上会被拉陡——把 x 压进同一量纲 `p = vec2((uv.x - 0.5) * 0.8, uv.y - 0.5)` 后，`t = p.x + p.y` 的等值线才是真 45°。凡是「非正方形坐标系里画角度」，先修宽高比再画。
- **呼吸乘坐标不乘颜色**：`breath` 乘在 `(p.x + p.y)` 上，等值线位置整体摆动 ±6%；乘在颜色上会把亮端推过 1 过曝——与 Day 2 B 档「呼吸乘尺寸」是同一条纪律的第三个面。
- **视差加在进度上，不加在坐标上**：`par` 加到渐变进度 t 里，渐变整体平移；加到 uv 上会把宽高比修正一起挪歪（x、y 视差不同步）。
- **u_mouse 只用 x**：对角渐变只有一维进度，y 视差加进去会把等值线搅斜——有纪律地少用输入，比多用输入更像设计。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day3-basic-1 | main.ts | 通读场景段，无改动 |
| day3-basic-2 | vertex.glsl | `v_uv = uv` + `gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0)` |
| day3-basic-3 | fragment.glsl | 宽高比修正 + 对角渐变 + 呼吸 + 视差（见上） |
| day3-basic-4 | main.ts | 帧循环两行：`u_time.value = s`、`u_mouse.value.set(p.nx, p.ny)` |

main.ts 其余逐字一致。

## 视觉规格

- 色板：深蓝夜 `#1B2140` → 玫红 `#FF4D6D`，45° 对角
- 构图：满屏海报（plane 6×7.5，任一纵横比不露底）
- 动效：呼吸周期 3s、幅度 ±6%（乘坐标）；视差 ±3%（乘进度）
- 细节：无 grain 无 vignette——B 档是「迁移热身」，配方卡留给后面的作业用
- 性能：单 pass 单 mesh，60fps 成本近零
