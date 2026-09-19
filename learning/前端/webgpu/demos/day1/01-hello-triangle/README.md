# Demo 01 · Hello Triangle

对应讲义：`1.1 GPU架构与WebGPU全景` → `1.4 WGSL语言核心`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day1/01-hello-triangle/index.html
```

## 关键点

- 顶点不经过顶点缓冲：`@builtin(vertex_index)` 在着色器内生成三个顶点，先把「管线」本身看清楚，1.5 讲再换成真正的顶点数据
- `layout: 'auto'` + `pipeline.getBindGroupLayout(0)`：让管线从着色器用法自动推导绑定组布局，讲义 1.6 会讲什么时候要显式声明
- uniform 一次 32 字节写入：`time` / `mouse` / `aspect` 三个字段，对齐规则在 1.6 展开
- 命令是「录制后提交」的：encoder 先把 draw 录进命令缓冲，`submit` 之后 GPU 才真正执行

## 视觉规格

- 色板：电蓝 `#4C6FFF` → 紫 `#8B5CF6` 双色渐变，Day 1 视觉基调
- 交互：鼠标横移在蓝紫间拉动色相（上限 15%），纵移产生轻微视差
- 动效：整体 0.8s 周期的呼吸（缩放 ±2%、亮度 ±6%），与 CSS 入场淡入叠加
- 底色：`clearValue` 与 CSS `#0B0E14` 一致，画布与画框无缝

## 常见报错

| 报错 | 原因 |
|------|------|
| `Entry point 'vs' doesn't exist` | entryPoint 字符串与 WGSL 的 `fn` 名不一致 |
| `Color attachment formats are incompatible` | `targets` 里的 format 与 `context.configure` 的不一致 |
| 页面空白且无报错 | 检查是否忘了 `pass.draw(3)` 或 `submit` |
