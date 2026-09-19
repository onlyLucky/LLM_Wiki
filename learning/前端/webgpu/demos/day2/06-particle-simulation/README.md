# Demo 06 · Particle Simulation

对应讲义：`2.7 GPGPU 粒子与动画模拟`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day2/06-particle-simulation/index.html
```

## 关键点

- 双缓冲状态机（讲义 2.7）：`states[2]` 各装 `Particle { pos: vec4f, vel: vec4f }`；compute 读 `src` 写 `dst`，两组绑定组 `computeBindGroups[i]`（读 i 写 1-i）轮换
- 交换的正确姿势：本帧 `cur` 计算、渲染读 `1 - cur`（刚写完的那个）、帧尾 `cur = 1 - cur`——渲染绑定组必须跟着换，这是最常见的翻车点
- struct 全用 `vec4f`：`vec3f` 在 storage（std430）下按 16 字节对齐，JS 侧按 12 字节打包会静默错位
- compute 里 `dispatchWorkgroups(ceil(10000 / 64))` = 107 × 64 = 10688 个 invocation，多出来的靠 `if (i >= arrayLength(&src)) return` 兜底
- 顶点着色器 `var<storage, read>` 直读粒子，无顶点缓冲、无拷贝；力场 = simplex 噪声 + 切向涡旋 + 向心束缚 + 鼠标引力（`select` 切换吸引/排斥）
- 粒子放大用 6 顶点 quad × `instanceCount`：WebGPU 没有 `gl_PointSize`；投影后加 NDC 偏移且不乘 `clip.w`，透视上远处更小

## 视觉规格

- 构图：三条旋臂的星系薄盘，开普勒式初速度让画面一开始就在转；相机缓慢漂移并响应鼠标视差（±0.28 rad）
- 色带：速度映射 黑 `#030411` → 深蓝 `#0B176B` → 电蓝 `#4C6FFF` → 白 `#F6F9FF`
- 粒子直径 7 CSS 像素（×DPR），柔边圆点 + 加法混合（`one / one`）叠出天然辉光
- 交互：按住鼠标在星系平面上形成引力井（力度 1.7），松开轻微排斥（-0.10）；速度阻尼 `exp(-1.6·dt)` 拖出丝滑尾迹感

## 常见报错

| 报错 | 原因 |
|------|------|
| 粒子每帧「抖回」上上帧的位置 | 双缓冲交换了，渲染绑定组没跟着换（读到了旧 buffer） |
| 粒子炸成一团乱码、控制台无报错 | JS 按 `vec3f`×2=24 字节打包，WGSL 侧 struct 实际步长 32——用 `vec4f` 或手动补 padding |
| 一半粒子永远不动 | `dispatchWorkgroups` 只给了 workgroup 数没除 `@workgroup_size`，总 invocation 只有 157 个 |
| 画面全白糊成一片 | 加法混合下亮度溢出：降低粒子亮度或直径，速度色带末端别直接给 1.0 |
