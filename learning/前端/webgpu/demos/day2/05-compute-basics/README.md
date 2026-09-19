# Demo 05 · Compute Basics

对应讲义：`2.6 计算着色器入门`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day2/05-compute-basics/index.html
```

## 关键点

- 计算管线三件套（讲义 2.6）：`createComputePipeline` + `beginComputePass` + `dispatchWorkgroups(8, 8)`，配 `@workgroup_size(8, 8)` 正好覆盖 64×64 点阵
- 同一模块两个入口：`init` 只在启动时跑一次摆好格点，`update` 每帧跑一次做积分——两个管线、两组绑定组各自 `getBindGroupLayout(0)`
- storage buffer 是计算与渲染的汇合点：compute 里 `var<storage, read_write>` 读写，渲染的顶点着色器里 `var<storage, read>` 只读，同一个 encoder 里先 compute 后 render 一次提交
- 状态机是弹簧 + 噪声 + 鼠标斥力 + 半隐式欧拉积分（阻尼 `exp(-4.5·dt)`），是 2.7 粒子系统的最小原型
- 点的放大：WebGPU point-list 恒为 1 像素，用 6 顶点 quad × `instanceCount` 展开（讲义 2.6 引、2.7 详解）

## 视觉规格

- 构图：64×64 青色点阵铺满画布，噪声场让阵面缓慢起伏呼吸，鼠标扫过时点被驱散再弹回
- 色板：静息青 `#2DD4BF`（压暗 50%），被扰动的点往电蓝 `#4C6FFF` 跑并提亮
- 点直径 6 CSS 像素（×DPR），柔边圆点（`smoothstep` 平方 + 预乘 alpha 混合）
- 交互：斥力 `2.4 / (1 + 14d²)`，弹簧刚度 16、阻尼 4.5——被推开的点带一点过冲地荡回家

## 常见报错

| 报错 | 原因 |
|------|------|
| `Buffer usage (0x20) does not contain allowed usage flags (0x80)` | 建绑定组时 buffer 没带 `GPUBufferUsage.STORAGE`（0x80） |
| 页面报 `TypeError: Cannot read properties of undefined`（readBuffer） | compute 之后立刻 `mapAsync` 读结果：`submit` 是异步的，要等 `onSubmittedWorkDone` |
| 点阵只剩左上角一块 | 越界 invocation 没做 guard（`gid.x >= GRID`），读写了别人的内存 |
| `Entry point 'init' doesn't exist` | 入口字符串与 WGSL 的 `fn` 名不一致；本 demo 有 `init` / `update` 两个入口 |
