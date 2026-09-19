# Demo 02 · Vertex Colors

对应讲义：`1.5 顶点缓冲与几何数据`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day1/02-vertex-colors/index.html
```

## 关键点

- interleaved 布局：每顶点 `[x, y, r, g, b]` 共 20 字节，位置与颜色穿插存放，一次 `writeBuffer` 全部上传
- `arrayStride: 20` 是从一个顶点跨到下一个顶点的字节数；两个 attribute 用 `offset`（0 与 8）声明各自起点
- 颜色作为数据：与 demo 01（在着色器里算颜色）的本质区别，百万顶点的颜色可以交给 DCC 工具产出
- 顶点 buffer 的 usage 必须含 `GPUBufferUsage.VERTEX`
- `setVertexBuffer(0, vertexBuffer)` 的 0 对应 `pipeline.vertex.buffers[0]`
- 左下与右上顶点各被写入两遍——顶点复制的代价，demo 03 用索引消除

## 视觉规格

- 色板：青 `#2DD4BF` → 紫 `#8B5CF6` 对角渐变（左下紫、右上青，对角中点取双色均值）
- 构图：半边长 0.48 的四边形居中，乘 aspect 后约占屏宽 85%
- 交互：鼠标视差（±0.06 NDC）+ 横移拉动色相（上限 12%）
- 动效：±0.06rad 幅度的缓慢自转 + 0.035 幅度的漂移 + ±5% 亮度呼吸
- 底色：`clearValue` 与 CSS `#0B0E14` 一致，画布与画框无缝

## 常见报错

| 报错 | 原因 |
|------|------|
| `arrayStride must be a multiple of 4 bytes` | stride 填了元素数（5）而不是字节数（20） |
| `The sum of byteOffset and byteLength ... exceeds arrayStride` | attribute 的 `offset` 算错，越过了顶点边界 |
| 错误面板出现 `Vertex buffer 0 ... not set` 一类验证错误 | 忘了 `pass.setVertexBuffer(0, vertexBuffer)` |
| 颜色错乱成条纹 | position 的 `offset: 0` 与 color 的 `offset: 8` 混淆，或 format 写错分量数 |
