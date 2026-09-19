# Demo 04 · Uniform Animation

对应讲义：`1.6 Uniform 与绑定组`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day1/04-uniform-animation/index.html
```

## 关键点

- uniform 是「一次绑定、全着色器可见」的只读数据：`@group(0) @binding(0) var<uniform> u: Uniforms`
- 32 字节布局与 demo 01 相同：`time` / `mouse` / `aspect`，每帧一次 `writeBuffer` 全量上传
- 几何永不更新：9 个顶点由 `vertex_index` 推导（轨道号 = i / 3，顶角 = i % 3），动画只来自 uniform——这是「数据驱动动画」的最小形态
- `layout: 'auto'` + `pipeline.getBindGroupLayout(0)`：管线从 WGSL 的 `@group/@binding` 用法自动推导布局，Day 2 起会改用显式布局
- 帧循环的成本账：每帧 1 次 `writeBuffer`（32 字节）+ 1 个命令缓冲 + 1 次 `draw(9)`

## 视觉规格

- 色板：电蓝 `#4C6FFF` ↔ 青 `#2DD4BF` 循环，三轨道相位错开 120°
- 构图：三个等边三角形（边心 0.13）在半径 0.18 / 0.46 / 0.74 的轨道上公转（角速度 0.22rad/s），各自反向自转（内环 0.55rad/s，外环递减）
- 交互：鼠标视差（±0.05 NDC）
- 动效：亮度 ±6% 呼吸，与色相同用 0.6 周期
- 底色：`clearValue` 与 CSS `#0B0E14` 一致

## 常见报错

| 报错 | 原因 |
|------|------|
| `Binding sizes ... are not multiples of 16 bytes` | uniform buffer 尺寸不是 16 的倍数 |
| 画面静止不动 | 帧循环里忘了 `writeBuffer`，或 uniform 数组与 struct 布局错位（偏移对不上） |
| `Entry point 'vs' doesn't exist` | entryPoint 字符串与 WGSL 的 `fn` 名不一致 |
| 颜色插值出现意外条纹 | 顶点输出 `@location(0)` 与片元输入的 `@location` 不一一对应 |
