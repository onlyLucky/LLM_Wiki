# Demo 03 · Indexed Quad

对应讲义：`1.5 顶点缓冲与几何数据`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day1/03-indexed-quad/index.html
```

## 关键点

- 索引绘制：4 顶点 + `Uint16Array([0, 1, 2, 0, 2, 3])`，`drawIndexed(6)` 按下标指认三角形，`topology` 不变
- 顶点复用：对角线两端（0 与 2）只存一份，第二个三角形共享它们；顶点数越多收益越大（网格、环形）
- index buffer 的 usage 必须含 `GPUBufferUsage.INDEX`，`setIndexBuffer` 的第二个参数是索引位宽（`'uint16'` / `'uint32'`）
- 与 demo 02 的 WGSL 完全相同：索引只改变顶点的取用方式，光栅化与片元阶段毫无感知

与 demo 02 的数据账本（讲义 1.5 的核心对照）：

| | demo 02（非索引） | demo 03（索引） |
|---|---|---|
| 顶点数 | 6 | 4 |
| 顶点 buffer | 6 × 20 = 120 字节 | 4 × 20 = 80 字节 |
| 索引 buffer | 无 | 6 × 2 = 12 字节 |
| 总上传字节 | 120 | 92 |
| 共享顶点变换 | 重复计算 2 次 | 只算 1 次 |
| 后续换色板 | 改 6 处顶点数据 | 改 4 处顶点数据 |

## 视觉规格

- 色板：电蓝 `#4C6FFF` → 琥珀 `#F59E0B` 对角渐变（左下蓝、右上琥珀），与 demo 02 同构不同色
- 构图：半边长 0.48 的四边形居中，动效参数与 demo 02 完全一致（自转 ±0.06rad、漂移 0.035、视差 ±0.06）
- 交互：鼠标视差 + 横移拉动色相（上限 12%），亮度 ±5% 呼吸
- 底色：`clearValue` 与 CSS `#0B0E14` 一致

## 常见报错

| 报错 | 原因 |
|------|------|
| `Index buffer format ... doesn't match indices type` | `setIndexBuffer` 声明的位宽与数据类型不一致（`Uint32Array` 要配 `'uint32'`） |
| 错误面板出现索引越界一类验证错误 | 索引数组里出现不存在的顶点号（顶点只有 4 个，索引却写到 4+） |
| 画面只剩一个三角形 | 索引写成了 `[0, 1, 2, 0, 2, 3]` 之外的绕向错误或漏项；顺带检查 `drawIndexed` 的数量 |
| 顶点变形 / 错位 | 顶点数据按 4 顶点写、`arrayStride` 却沿用 5 元素 → 检查 stride 与 offset 算术 |
