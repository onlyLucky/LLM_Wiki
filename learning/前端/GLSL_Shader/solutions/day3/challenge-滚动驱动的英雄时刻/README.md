# 作业 C 答案 · 滚动驱动的英雄时刻

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day3/challenge-滚动驱动的英雄时刻/index.html`，向下滚动到底看完整三幕。

## 实现要点

- **Lenis 五行的顺序就是依赖链**：`raf(now)` 每帧喂时间 → `scroll / (scrollHeight - innerHeight)` 算原始进度 → `clamp` 保险丝 → 同时喂 `mat` 与 `bgMat` 两个材质。`u_scroll` 全片只此一处驱动——骨架帧循环里那句「别在这里另写第二处驱动」是防止你在 shader 里再塞一个滚动逻辑。
- **三段区间首尾相接不重叠**：t1 = smoothstep(0.0, 0.3)、t2 = smoothstep(0.3, 0.7)、t3 = smoothstep(0.7, 1.0)。粒子的两段 mix 是嵌套的：`mix(scatter, a_targetA, t1)` 之后接 `mix(pos, a_targetB, t3)`——第三幕从「已聚齐的 GLSL」滑向 FIN，不是从散位起跳。
- **幅度收束比速度更关键**：`amp = mix(1.0, 0.1, t1)` 让噪声随聚集收束——粒子到位后还剩 10% 的呼吸感，画面是活的；若幅度不收束，聚齐后文字会一直「沸腾」，第三幕的「定格」就没了。
- **揭幕是阈值扫描不是透明度切换**：`smoothstep(t2 - 0.12, t2 + 0.12, n)` 让分界像墨水洇开；`+ u_time * 0.05` 让揭幕边缘自己游动——幕布是活的。JS 侧的 bloom 微抬（`0.9 + t3 * 0.3`）用 `THREE.MathUtils.smoothstep`，与 shader 同公式。
- **composer 三处同步**：创建后 `addPass` 顺序即数据流向；`syncSize` 里 `composer.setSize` 与 renderer 同步（否则「画布缩了后期没缩」）；帧循环末尾 `renderer.render` 换成 `composer.render`——全文件就这一处渲染调用。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day3-ch-1 | main.ts | `import Lenis from 'lenis'` + 帧循环五行（raf / 进度 / clamp / 双材质喂值） |
| day3-ch-2 | vertex.glsl | 三路 fbm 伪向量场（三投影面 ×1.4，时间系数 0.18/0.15/0.12）+ `-0.5` 居中 |
| day3-ch-3 | vertex.glsl | `t1/t3 = smoothstep(...)`、`amp = mix(1.0, 0.1, t1)`、两段嵌套 mix、`v_mix = max(t1, t3)` |
| day3-ch-4 | bg.glsl | `t2` 阈值扫描 + `fbm(uv*3 + t*0.05)` + `±0.12` 柔边 + vignette 0.25 |
| day3-ch-5 | main.ts | composer 四 pass 链（RenderPass → bloom 0.9/0.5/0.35 → grain+vignette → OutputPass）、syncSize 补 `composer.setSize`、bloom 定格微抬 `0.9 + t3*0.3`、`composer.render()` |
| day3-ch-6 | README | 见下方「性能调档」表 |

其余逐字一致（滚动舞台 / 三屏文案 / 场景段 / sampleTextPoints / fragment.glsl 均未动）。

## 视觉规格

- 色板：背景暗紫夜 `#1B2140` → 近黑 `#05060A` 揭幕切换；粒子散开玫红 `#FF4D6D` → 聚齐天青 `#4CC9F0`
- 三幕时间轴：0.0–0.3 聚集「GLSL」/ 0.3–0.7 噪声揭幕 / 0.7–1.0 定格「FIN」+ bloom 1.2
- 粒子：9000 点、球壳偏内出生位、additive + 关深度写入、u_size 0.035
- 构图：hero 文字横跨约 ±1.7、字面高约 1.1（视锥半高 1.5 内）
- 收尾：vignette 20% + grain ±3% + OutputPass（gamma 不在手写 shader 里做，避免双重校正）

## 性能调档

自查方法：Chrome DevTools Performance 面板录 10s 滚动，看 GPU 轨道帧时间；滚动流畅度吃紧先砍 octaves（最便宜），再砍 N，最后降 DPR（最贵、最有效）。

| 档位 | fbm octaves | 粒子数 N | DPR | 适用 |
|------|-------------|----------|-----|------|
| 性能 | 2 | 6000 | 1 | 集显 / 老核显 / 移动端 |
| 平衡（本答案默认） | 3 | 9000 | 1 | 中端独显，60fps 稳 |
| 质量 | 4 | 20000 | min(devicePixelRatio, 2) | 高刷屏 / 演示机 |

octaves 改 vertex.glsl 与 bg.glsl 各自的 `for` 循环上限；N 改 main.ts 的 `N` 常量；DPR 改 `renderer.setPixelRatio(...)`。

## 装配对照表

对照讲义 3.5 的装配清单六层——「一个作品一个主角，其余全部降透明度」：

| 3.5 清单层 | 本作对应 | 克制处理 |
|------------|----------|----------|
| 背景氛围 | bg.glsl 的 fbm 揭幕 + vignette | 双色近黑系，不给粒子抢戏 |
| 前景主体 | 粒子场（GLSL → FIN 两段聚集） | 唯一主角，色彩最亮 |
| 图卡模块 | —（本作无图卡，A 档专责） | 不硬塞 |
| 叙事驱动 | u_scroll + Lenis 三段时间轴 | 一个 uniform 驱动全片 |
| 点睛粒子 | 粒子场本身即点睛（additive 微光） | 关深度写入防排序闪烁 |
| 全局收尾 | bloom 定格微抬 + grain 3% + vignette + OutputPass | 配方只此一层，不再叠 |
