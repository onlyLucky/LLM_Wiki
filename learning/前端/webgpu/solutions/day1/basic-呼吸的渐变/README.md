# 作业 B 参考答案 · 呼吸的渐变

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day1/basic-呼吸的渐变/index.html
```

## 实现要点

- uniform 走 32 字节完整方案（`Float32Array(8)` + `GPUBufferUsage.UNIFORM | COPY_DST`）：`time@0`、填充@4、`mouse@8`、`aspect@16`，一次把两个加分项的字段也备齐（讲义 1.6 的 A1 字节图）
- 交换算法是「插值方向反转」：当前颜色沿对角线由 `C_LOW` 插到 `C_HIGH`，反向颜色直接由 `C_LOW + C_HIGH - color` 得到——对角线上对称位置的镜像值，省掉重算位置
- `k = 0.5 + 0.5 * sin(u.time * 0.9)` 在 0 → 1 → 0 间平滑循环，`mix(color, swapped, k)` 全程连续、无跳变
- 每帧只写 32 字节：`uniforms[0] = t` 后 `writeBuffer` 整块上传，动画参数全部住在数据里

## 与骨架的差异

- `setupUniform()`：`Float32Array(8)` + 32 字节 buffer 创建并返回（任务 1）
- 帧循环：每帧写 `time` / `mouse` / `aspect` 三个槽位并 `writeBuffer`（任务 3）——骨架只要求 `time`，答案把加分项一起上传
- `quad.wgsl`：声明 `struct Uniforms` 与 `var<uniform>`，fs 实现呼吸交换（任务 2）；vs 把 `vin.position` 乘上 `vec2f(u.aspect, 1.0)` 防宽屏拉伸（加分项）；fs 尾部追加鼠标色温与亮度扰动（加分项，幅度 ≤ 8%）
- 其余脚手架（顶点数据、管线、绑定组、鼠标监听）与骨架逐字一致

## 视觉规格

- 色板：紫 `#8B5CF6` ↔ 青 `#2DD4BF` 沿对角线互为镜像，约 7 秒一个呼吸周期
- 加分项：鼠标横移在暖色温（+5% R / −8% B）与冷色温之间拉动，纵移给 ±8% 亮度
- 底色：`clearValue` `#0B0E14` 与 CSS 底色一致，画布与画框无缝
