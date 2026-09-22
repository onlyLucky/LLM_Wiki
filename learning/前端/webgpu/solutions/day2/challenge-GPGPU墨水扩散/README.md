# Day 2 作业 challenge 参考答案 · GPGPU 粒子星系

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day2/challenge-GPGPU粒子星系/index.html
```

## 实现要点

- 双缓冲（任务 1）：两个 `COUNT × 32` 的 `STORAGE` buffer；初始盘只写 `states[0]`——极坐标 `r = pow(random(), 0.62) × 1.75 + 0.04`（外疏内密），角度 `(i % 3) × 2π/3 + r × 2.2 + 高斯 × 0.16` 拼出三条对数旋臂，y 做薄薄一层高斯散布，切向初速度 `0.5 / sqrt(r + 0.12)` 让画面从第一帧就在转
- compute 管线与力场（任务 2）：`layout: 'auto'` + entryPoint `update`；力场四件套——simplex 三次偏移采样拼向量场（×0.4）、切向推进 `0.55 / (0.3 + r)` + 向心束缚 `0.45 / (0.35 + r²)`、`-p.y × 1.1` 压回盘面、鼠标力场 `select(-0.10, 1.7, 按下) / (dm2 + 0.30)`；半隐式欧拉 `(v + a·dt) × exp(-1.6·dt)` 限速 2.4
- 绑定组轮换（任务 3）：`computeBindGroups[i]` 读 `states[i]` 写 `states[1-i]`；帧循环里 compute 挂 `[cur]`、**渲染必须挂 `renderBindGroups[1 - cur]`**（刚写完的那个）、帧尾 `cur = 1 - cur`——一句话记：读旧写新、渲染读新、帧尾翻转
- storage 直读渲染（任务 4）：渲染管线 `one / one` 加法混合（星星叠星星天然辉光且与顺序无关，无需深度）；vs 里 `var corners = array<vec2f, 6>` 六顶点 quad，`vertex_index` 取角、`instance_index` 取粒子，偏移在投影之后加且不乘 `clip.w`——粒子随距离自然变小
- 速度色带（任务 5）：`t = clamp(speed / 2, 0, 1)`，四段 smoothstep 黑 `#030411` → 深蓝 `#0B176B` → 电蓝 `#4C6FFF` → 白 `#F6F9FF`；`mask = smoothstep(1.0, 0.15, length(uv))` 当亮度

## 与骨架的差异

- `createParticleStates()`：两个 STORAGE buffer + 初始星系盘写入（任务 1）
- `createComputePipeline()` / `createRenderPipeline()`：compute 与加法混合渲染管线（任务 2 / 4 的 main.ts 侧）
- `createComputeBindGroups()` / `createRenderBindGroups()`：两组镜像绑定组（任务 3 / 4 的 main.ts 侧）
- 帧循环三处：`cpass.setBindGroup(0, computeBindGroups[cur])`、`rpass.setBindGroup(0, renderBindGroups[1 - cur])`、帧尾 `cur = 1 - cur`（任务 3）
- `particles.wgsl` 的 `update`：占位搬运替换为力场 + 积分（任务 2 的 WGSL 侧），噪声函数与骨架逐字一致
- `render.wgsl`：vs 补 quad 展开（任务 4 的 WGSL 侧），fs 占位替换为速度色带（任务 5），struct 与 VOut 与骨架一致
- 其余脚手架（矩阵、鼠标射线求交、uniform 上传）与骨架逐字一致

## 视觉规格

- 色带：静息外缘近黑 `#030411`，盘心与被引力井加速的粒子依次过深蓝 `#0B176B`、电蓝 `#4C6FFF`，最快处发白 `#F6F9FF`
- 星系：三条对数旋臂、半径至 1.75，薄盘（y 高斯 ±0.045）；粒子直径约 7 CSS 像素 × DPR，柔边圆点叠出辉光
- 交互：按住鼠标粒子聚拢到光标（世界坐标由相机射线与 y=0 平面求交），松开轻微排斥扩散回盘面
- 相机：缓慢方位漂移（±0.22 rad）+ 鼠标视差，俯角 0.62 rad
- 底色：`clearValue` `#0B0E14`，加法混合下星系自发光
