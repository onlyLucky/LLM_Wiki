# Demo 02 · 全屏四边形与UV

对应讲义：`1.5 数据流与全屏四边形`（TRIANGLE_STRIP 与坐标域）· `1.7 交互输入`（鼠标 uniform）

## 运行

```bash
npm run dev
# http://localhost:5174/demos/day1/02-全屏四边形与UV/index.html
```

## 关键点

- 全屏四边形只需 4 顶点 + `TRIANGLE_STRIP`：条带按 左下→右下→左上→右上 连成两个三角形，顶点直接写 clip space（-1..1），省掉 MVP 矩阵（讲义 1.5）
- UV 的来历只有一行：`uv = gl_FragCoord.xy / u_resolution`——gl_FragCoord 是物理像素、左下原点，除以同域的画布尺寸才得到 0–1
- 调色板即仪表盘：R 通道 = uv.x、G 通道 = uv.y，画面任何一个像素的颜色都在报出自己的坐标；左下角必须是黑的，它是 y 轴方向的试金石
- 鼠标取 `chrome.pointer.sx/sy`（已 lerp、已 y 翻转），与 uv 同在 0–1 域，`distance()` 直接可比——坐标系对齐了， shader 里才不需要换算

## 视觉规格

- 色板：底色 `#0B0E14` 上叠加 UV 调色板（透明度 35%），中心聚焦构图
- 参考系：画布中心十字参考线（天青 `#4CC9F0`，线宽约 0.15%），鼠标标点半径 1.5% + 外环 2.8%（玫红 `#FF4D6D`）
- 动效：无——这是一块静态仪表盘，唯一的变量是鼠标
- 细节：无 grain / 暗角（教学仪表盘保持素颜）
- 性能：单 draw call、DPR ≤ 2，预计 60fps

## 常见报错

| 报错 | 原因 |
|------|------|
| 调色板左上角是黑的 | y 轴没翻转或翻转了两次：gl_FragCoord 左下原点，鼠标事件左上原点 |
| 渐变在宽屏被横向拉伸 | 正常——这是 uv 的宽高比陷阱（讲义 1.5），等比公式见 `p.x *= aspect` |
| `u_resolution` 除出来不是 0–1 | JS 侧传了 CSS 尺寸而 gl_FragCoord 是物理像素（含 DPR） |
| `ERROR: 0:1: ... #version` | `#version 300 es` 之前有空行或注释——必须是文件第一行 |
