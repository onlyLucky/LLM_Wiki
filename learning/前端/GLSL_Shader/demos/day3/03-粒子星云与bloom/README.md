# 03 · 粒子星云与bloom

> Day 3 · Demo 03 —— [3.4 粒子场](../../../讲义/day3-Three.js实战落地/3.4-粒子场：Points、gl_PointSize与噪声粒子场.md) 与 [3.5 后期处理](../../../讲义/day3-Three.js实战落地/3.5-后期处理工作坊：装配作品集hero.md) 的 How 段蓝本：Day 2 全部知识的 3D 汇报演出。

两万粒子绕原点呼吸，玫红核心、天青外围，拖动鼠标星云被搅开又自然回流——噪声（2.4）+ add 合成（2.6）+ 粒子（3.4）+ bloom（3.5）四件事的合力。**无状态动画**：每帧输入只有（出生位，u_time，u_mouse），输出与历史无关，断帧跳帧画面永远自洽。

## 五件套

| 文件 | 职责 |
|------|------|
| `index.html` | 挂载点 |
| `main.ts` | 球壳分布生成 + 后期链四 pass + 帧循环 |
| `shaders/vertex.glsl` | 三路噪声位移 + 避让 + `gl_PointSize` 透视衰减 |
| `shaders/fragment.glsl` | 裁圆软边 + 按出生半径 mix 两色 + 亮度倾斜 |
| `README.md` | 本文件 |

## 关键点

- **出生位一次性生成**：`r = 0.55 + pow(random, 2.2) * 0.65` 球壳偏内分布——中心密外围疏，给「玫红核心、天青外围」的配色打底；`pow` 的 2.2 次幂把随机数压向外圈稀疏。
- **三路 2D 噪声伪向量场**：`pos.xy*1.5+time*0.20` / `pos.yz*1.5-time*0.17` / `pos.zx*1.5+time*0.13`——三个投影面 + 故意不等的时间系数，场缓慢「错动」而不是整体平移。curl noise 需要三维噪声求偏导，两万粒子算不动，这是课程工程取舍。
- **octave 纪律**：顶点噪声 3 octave 封顶——两万粒子 × 5 倍频是帧率刺客；噪声一定算在顶点着色器（N 次）而不是片元（N × 屏幕覆盖率 次）。
- **`gl_PointSize` 透视衰减**：`u_size * (300.0 / -mvPosition.z)`，300.0 是标定常数（把典型观看距离代进去、近处粒子落在目标像素直径上）。
- **裁圆软边一行**：`smoothstep(0.5, 0.32, d)` 同时完成裁圆与渐隐——软边是 additive 发光的前提，硬边叠起来颗粒感明显。
- **additive + depthWrite:false 成对纪律**：additive 开了不关深度写入，先画的粒子写深度挡住后画的——星云出现黑洞般的遮挡黑框。发光体互相不遮挡是 additive 世界的物理直觉。
- **亮度交给密度**：additive 场景 size 宁小勿大（`u_size = 0.03`），核心的光是「数密度」自己画出来的，不需要任何光源。
- **避让不是弹开，是让路**：`exp(-d*d*6.0)` 高斯衰减只在光标邻域生效，粒子被推开后随噪声场自然回流——没有一个 if 在维护「推开状态」。
- **后期链四 pass**：RenderPass → `UnrealBloomPass(1.2, 0.6, 0.35)` → 配方 ShaderPass（grain + vignette，**gamma 删掉**）→ OutputPass；`composer.setSize` 与 `renderer.setSize` 必须同步调。

## 与讲义的两处工程出入（诚实交代）

1. **位移居中项**：讲义公式 `position + vec3(n1,n2,n3) * u_amp` 的噪声值域是 0–1，直接加会让星云整体往 (+,+,+) 漂——demo 补了 `- 0.5` 居中（`(vec3 - 0.5) * 2.0 * u_amp`），星云绕原点呼吸。
2. **u_size 的量纲**：它是「距离 300 处的像素直径」，本 demo 取 0.03 → 近景粒子约 2.8 物理px；不是直觉上的「几像素」，第一次调请先乘 10 找量级。

## 视觉规格

- 相机 z = 3.6 / fov 45：可视半高约 1.5，核心结构全在画面、外缘自然溢出。
- 配色：玫红 `#FF4D6D`（核心，r < 0.6）→ 天青 `#4CC9F0`（外围，r > 1.1），`mix(A, B, smoothstep(0.6, 1.1, r))`，按出生半径不按当下位置。
- 亮度倾斜：核心 1.25 / 外围 0.8——配合 bloom threshold 0.35，只咬核心，「核心亮、边缘收」。
- bloom：strength 1.2（低于 1.0 蒙灰、高于 1.5 过曝）/ radius 0.6 / threshold 0.35（试过 0.2 糊成灯泡）。
- 配方：grain ±3% + vignette 20%，与 Day 2 霓虹徽章同一张配方卡。
- 避让：u_push 最大 0.3，进出画布 lerp 0.08 渐进，光标世界坐标 lerp 0.1 防跳变。

## 常见报错

| 症状 | 原因 |
|------|------|
| 远近粒子一样大 | `gl_PointSize` 忘乘透视衰减——补 `u_size * (300.0 / -mvPosition.z)` |
| 粒子是方块 | 片元忘用 `gl_PointCoord` 裁圆——点精灵默认就是方形 |
| 星云出黑框 / 遮挡错乱 | additive 开了但 `depthWrite: false` 没关——深度写入挡掉叠加 |
| 帧率崩 | 顶点噪声超过 3 octave，或噪声挪到了片元着色器 |
| resize 后画面拉伸 | 只调了 `renderer.setSize` 没调 `composer.setSize`——composer 有独立缓冲 |
| 全屏一片白光 | bloom `threshold` 设了 0——门槛卡 0.3–0.4 |
| 颜色发灰 / 发暗 | 缺 `OutputPass`——0.186 线性 → sRGB 输出靠它 |
| 画面灰脏、对比丢失 | 配方 ShaderPass 里还留着 gamma 步——双重校正，删掉 |
