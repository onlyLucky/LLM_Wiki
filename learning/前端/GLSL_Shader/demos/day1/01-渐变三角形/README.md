# Demo 01 · 渐变三角形

对应讲义：`1.1 为什么前端要学 GLSL` → `1.5 数据流与全屏四边形`（时间与鼠标 uniform 的用法在 `1.6` / `1.7` 展开）

## 运行

```bash
npm run dev
# http://localhost:5174/demos/day1/01-渐变三角形/index.html
```

## 关键点

- 顶点数据走 interleaved attribute（位置 vec2 + 颜色 vec3，stride 20 字节）：一块 buffer 装下两个语义，`layout(location=N)` 与 `vertexAttribPointer` 的 N 一一对应
- 颜色经 varying 插值：vertex 的 `out vec3 v_color` 与 fragment 的 `in vec3 v_color` 同名——链接器的接头暗号，逐字相同（讲义 1.5）
- `createProgram` 把编译/链接错误带行号投进页面错误面板：改错一个分号，刷新看报错——这是本课程最重要的学习设施
- 鼠标取 `chrome.pointer.sx/sy`：事件更新状态、帧循环消费状态，lerp 平滑与 y 翻转都由 chrome 完成（讲义 1.7 的事件桥）

## 视觉规格

- 色板：玫红 `#FF4D6D` → 天青 `#4CC9F0` 双色渐变，顶点色 / 右下双色各半，中心聚焦构图
- 交互：鼠标横移在双色间拉动色相（上限 15%），lerp 阻尼 0.08
- 动效：整体 0.8s 相位的呼吸（亮度 ±6%），与 CSS 入场淡入叠加
- 细节：无 grain / 暗角（Day 1 教学页保持素颜，2.8 讲开始上收尾配方）
- 性能：单 draw call、DPR ≤ 2，预计 60fps

## 常见报错

| 报错 | 原因 |
|------|------|
| `ERROR: 0:1: ... #version` | `#version 300 es` 之前有空行或注释——必须是文件第一行 |
| `unresolved symbol` / 链接失败 | vertex 的 `out` 与 fragment 的 `in` 名字不一致 |
| 页面全黑无报错 | 检查是否忘了 `gl.drawArrays`，或 `clearColor` 后没画 |
| 三角形拉伸变形 | `u_aspect` 没传或没乘进 `gl_Position` |
