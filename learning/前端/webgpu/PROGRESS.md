# 制作进度（执行模型每完成一批，在表格追加一行）

> 本表登记 2026-09-21 启动的用户反馈集中修复与重设计批次（09-21~22 完成，09-22 收尾登记）。质量基准：awwwards.com 获奖网站的创造力与设计层次；去同质化原则：作业是作业、课程 demo 是课程 demo——同名条目各做各的设计，课程 demo 只在作业/答案单独重做时保留原样。

| 批次 | 内容 | 状态 | 日期 | 备注 |
|------|------|------|------|------|
| 修复 · day1 | demos/day1/01-hello-triangle 打开不显示 | ✅ 完成 | 2026-09-22 | 根因修复后浏览器实测渲染点亮、帧率正常，首屏对照三角形恢复 |
| 修复 · day2 | solutions/day2/advanced-纹理与光照 运行报错 | ✅ 完成 | 2026-09-22 | 报错根除，浏览器实测通过 |
| 重设计 · day1 | homework/day1/advanced-万花筒（作业 + solutions 同名答案） | ✅ 完成 | 2026-09-22 | 原「万花筒 + 几何」形状单一缺设计感，按需求改为纯万花筒（不带几何体）；作业与答案各自独立设计，文档同步 |
| 重设计 · day1 | homework/day1/challenge-星轨动画（作业 + solutions 同名答案） | ✅ 完成 | 2026-09-22 | 星轨整体重设计，作业与答案各自独立设计，文档同步 |
| 重设计 · day2 | demos/day2/07-raymarching | ✅ 完成 | 2026-09-22 | 整体重做为有设计感的 Ray Marching 场景（main.ts + scene.wgsl + README），浏览器实测通过 |
| 去同质化 · day2 | homework/day2/basic-旋转的立方体（作业 + solutions 同名答案） | ✅ 完成 | 2026-09-22 | 作业原与 demos/day2/01-mvp-cube 一致——课程 demo 保留不动，作业/答案重做为「深空信标 CRYSTAL GYRO」（八面体水晶 × 反向旋转线框笼，实体/线框双拓扑双 draw 演深度遮挡），文档同步 |
| 去同质化 · day2 | homework + solutions 的 challenge-GPGPU粒子星系 | ✅ 完成 | 2026-09-22 | 答案原与 demos/day2/06-particle-simulation 一致——课程 demo 保留不动，作业/答案各自独立重做，文档同步 |
| 重做 · day3 | demos/day3/03-tsl-compute-particles →「TSL EXCITED STATE」 | ✅ 完成 | 2026-09-22 | 原效果与代码设计感差，整页重做为受激原子粒子仪：TSL compute 16384 粒子三能级轨道环流（1S 电子云按 sqrt(hash) 半径弥散 30%~100%、2P 经线环弥散 80%~115%、3D 四叶确定性轮廓），sizeNode 速度驱动 + opacityNode ×0.72 密度管理（加色混合防糊三件套），原子核 sizeNode uniform 脉动（决定性实验：实例 Sprite 尺寸由 sizeNode 决定、mesh.scale 不参与）；交互为鼠标探测电子云 + 按住激发束（粒子脱轨/回弹/白闪）。290 行；收尾强刷复验 60 FPS、无报错、三能级结构完整（截图） |
| 重做 · day3 | demos/day3/04-postprocessing → 星环仪 | ✅ 完成 | 2026-09-22 | 原缺少设计感，整页重做：bloom(scenePassColor, 0.65, 0.55, 0.85) 三参数柔光，鼠标纵移调 strength 0.4–0.9（画布底部最强）、横移相机视差，lerp 0.12 平滑跟随。浏览器实测：静息态（轨道环/恒星辉光/卫星光晕）与鼠标联动（辉光增强至 strength→0.9）截图均达标，60 FPS 无报错 |
| 收尾 · 全局 | 文档一致性同步 + 全量核验 + 进度登记 | ✅ 完成 | 2026-09-22 | ①文档同步 18 处（讲义 3.3 ×11：粒子数 24576→16384、1S 球壳→电子云、sizeNode 0.028/0.030、opacityNode 补 ×0.72、原子核 sizeNode uniform 机制、坑表新增 2 条反直觉经验；demo 03 README ×4；main.ts 注释 ×3），Grep 复核旧数值残留清零；②收尾核验抓出 2 类 tsc 报错共 7 处并修复——demos/day3/three-shims.d.ts 补 three/tsl 的 step/sqrt 环境声明（运行时存在、仅类型缺口），homework/day2/basic 两个引用 device 的提升函数声明改箭头常量以保留判空收窄；复跑 tsc --noEmit 零报错；③浏览器抽查：demo 03 强刷 60 FPS 无报错、demo 04 静息态 + 交互截图达标；④本 PROGRESS 建档 + 根 README 目录导航补行 |
| 去同质化 · day3 | homework + solutions 的 basic-TSL波浪网格（原涟漪场→「熔核 MOLTEN CORE」） | ✅ 完成 | 2026-09-22 | 作业原与 demo 02 行波海同构——课程 demo 保留不动，作业/答案重做为噪声置换熔核星球：Icosahedron(1.6,48) 三频 fBm 地形（0.9/2.1/3.9 倍域加权 0.55/0.3/0.15，[-1,1]→0~1 重映射）沿法线置换 + 海拔反向配色（低洼熔岩橙/炽核亮黄、高处暗岩壳）+ 蓄热状态机交互（按住注入热量隆起沸腾、松开冷却；charge uniform 指数趋近 0.03）。实测 5 轮修复：①shim 补 IcosahedronGeometry；②关键坑——varying 必须模块级直接创建，Fn 体内创建 + 模块级 let 承接会因管线编译期 Fn 重跑致 WGSL 编译失败（smoothstep 丢参），positionNode 改模块级节点链；③④⑤视觉调优（lavaMask 0.34/0.42 窄过渡、coreMask 0.3/0.4、泛光增益 0.6）。答案页五态截图验证（常温/蓄热/沸腾/冷却）+ 作业页错误面板报 TODO(day3-basic-1) 通过，60 FPS；作业 TODO 指引与 README 伪代码同步为验证过的写法与最终参数，tsc 零报错；day3 README/门户/学习地图同步 |

> 巡检入口：`cd 前端/webgpu && npm run dev`（门户 <http://localhost:5173/>）；作业页右下角「答案参考 ↗」可直达对页答案，答案页可一键返回。git 提交由用户自行完成，commit 消息使用中文。
