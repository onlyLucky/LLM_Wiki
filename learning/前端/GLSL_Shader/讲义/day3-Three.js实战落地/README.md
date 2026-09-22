# Day 3 · Three.js 实战落地

第三天只回答一个问题：**两天的 GLSL 怎么进真实工程栈。**

手写的脚手架交给 Three.js，算法一行不重学——Day 3 的五篇讲义是「迁移与装配」的完整路径：图卡失真、滚动叙事、粒子星云、后期辉光，全部长在 three@0.186.0 的工程栈上：

| # | 讲义 | 主题 | 一句话 |
|---|------|------|--------|
| 3.1 | [ShaderMaterial：从原生到 Three.js 的迁移](3.1-ShaderMaterial：从原生到Three.js的迁移.md) | 迁移 | 脚手架交出去、算法留下来：内置注入表 + 五件套 + 行数对账 87→34 |
| 3.2 | [图片失真与鼠标视差](3.2-图片失真与鼠标视差.md) | 图卡 | 获奖站图卡的下沉手法：噪声→UV 偏移→采样三行链路 + hover 是强度不是开关 |
| 3.3 | [滚动驱动 shader：u_scroll、Lenis 与转场遮罩](3.3-滚动驱动shader：u_scroll、Lenis与转场遮罩.md) | 滚动 | 把叙事交给滚轮：归一化 float + 分段 smoothstep + 噪声当 mask、progress 当阈值 |
| 3.4 | [粒子场：Points、gl_PointSize 与噪声粒子场](3.4-粒子场：Points、gl_PointSize与噪声粒子场.md) | 粒子 | Day 2 噪声的 3D 化身：无状态顶点动画 + 透视衰减 + additive 星云 |
| 3.5 | [后期处理工作坊：装配作品集 hero](3.5-后期处理工作坊：装配作品集hero.md) | 装配 | 从画面到作品的最后一层：composer 四 pass + bloom 三参数 + 装配清单与克制原则 |

一天的主线是一条装配线：**迁移（3.1）→ 单件交互（3.2）→ 全页叙事（3.3）→ 空间层（3.4）→ 全局收尾（3.5）**。前四讲产出零件，3.5 把三天存货拼上货架——作业的毕业作品「滚动驱动的英雄时刻」用的正是这条装配线。

Day 3 的 GLSL 与前两天有一处分界：ShaderMaterial 内不写 `#version`、输出用 `gl_FragColor`、采样用 `texture2D`（three 自动转译）——完整对照表见 3.1 的「3.1 版 GLSL 风格差异」小节，从 Day 2 抄函数体时按表换口。

图表资产位于 [assets/diagrams](../../assets/diagrams/)，本日引用 2 张：uniform 注入映射（threejs-uniform-mapping）、后期链路（postprocess-chain）。

> Day 3 的三份 demo（ShaderMaterial 初见 / hover 失真图卡 / 粒子星云与 bloom）与三档作业将在下一批内容中就位。
