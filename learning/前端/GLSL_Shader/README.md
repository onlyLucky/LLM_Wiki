# GLSL Shader 三天实战课程

为五年经验的前端工程师设计的 GLSL 速成路线：第一天把 GLSL ES 3.00 与原生 WebGL2 管线吃透，第二天练满 fragment shader 的视觉算法（SDF / 噪声 / 调色 / 光感），第三天把这套语言搬进 Three.js 工程。终点很具体——读懂 awwwards 获奖网站里 fragment shader 的每一行，并从零写出同级别的完整作品片段。

webgpu 课教「GPU 怎么工作」，本课教「GLSL 怎么画出东西」：视觉算法、动画、交互，以及把这套语言搬进 Three.js 的完整路径。课程假设你已在同一知识库完成《WebGPU 三天实战课程》，GPU 架构、管线对象模型、bind group 已经有肌肉记忆——讲义里的「理论对照」栏会不断回到那些概念，本课不再重复。

## 三天路线

| 天 | 主题 | 你会得到什么 |
|----|------|--------------|
| Day 1 | GLSL 语法与 WebGL2 管线 | 语法两讲、原生 WebGL2 最小闭环、全屏四边形、时间动画、交互输入——能从空白页面手写一个「会动、会响应光标」的 shader 画布 |
| Day 2 | 片段着色器视觉算法 | SDF、voronoi、fbm 与域扭曲、余弦调色板、伪 3D 光感、纹理、电影感配方——fragment shader 的完整视觉算法箱 |
| Day 3 | Three.js 实战落地 | ShaderMaterial、图片失真与视差、滚动驱动、粒子场、后期处理工作坊——把 GLSL 搬进 Three.js 工程，写出作品集级的 hero 片段 |

每天上午偏概念、下午偏动手，讲授与实操大约四六开。每个模块都有配套 demo（完整参考实现，带视觉规格），每天收尾有三档作业：basic / advanced / challenge，做不完可以降级，做完了去 `solutions/` 对照——作业页右下角的「答案参考 ↗」一键直达对页，答案页也能一键返回。

## 快速开始

```bash
cd 前端/GLSL_Shader
npm install
npm run dev
```

打开 <http://localhost:5174/>，从门户页进入任意 demo。每个 demo 页面自带深色画框、四角标注、GLSL 编译错误面板与实时 FPS——编译错误会带行号显示在页面上，这是本课的第一教学设施。讲义是纯 Markdown，在 Obsidian、VS Code 或 GitHub 里阅读均可；核心图示在 `assets/diagrams/`。

浏览器与 Node 的要求见 [01-环境准备.md](01-环境准备.md)，开课前 10 分钟过一遍即可。

## 目录导航

```
├── 00-课程计划与学习地图.md      先读这个：三天时刻表、作业递进与结营标准
├── 01-环境准备.md               开课前 10 分钟读完，跑一遍环境检查
├── index.html                   门户页：15 个 demo 与 9 份作业的入口
├── 讲义/                        20 篇讲义，按天分目录（7 + 8 + 5）
├── demos/                       15 个完整可运行的参考实现
├── homework/                    9 份分层作业骨架（TODO 挖空式）
├── solutions/                   参考答案，做完再看
├── assets/diagrams/             12 张深色底 SVG 核心图示
├── shared/                      所有页面共享的视觉外壳（chrome.ts + demo.css）
├── 参考资料.md                  权威资源五层分级清单
└── 实例网站清单.md               值得逐帧拆解的创意网站与三步观察法
```

demo 是这门课的主角：讲义负责讲清为什么，demo 负责给你一份能跑、能改、能拆的完整实现。作业骨架与 demo 共享同一套视觉外壳——你交付的每个页面从第一天起就该是有设计感的作品。

## 这套课程与你的其他笔记如何配合

理论推导不在这里重复。GPU 架构与管线对象模型见《WebGPU 三天实战课程》（`前端/webgpu/`）；变换矩阵与着色模型的数学见《GAMES101 图形学笔记》（`计算机图形学/GAMES101/`，第 3 章变换、第 5 章着色）；Three.js 场景与材质 API 见《Three.js 创意 3D 课程笔记》（`前端/Threejs创意3D/课程笔记/`，第 10–16 课正好覆盖 GLSL 与 shader 效果）。本课每篇讲义开头标注「理论对照」，把两边接起来。

## 通关标准

三天结束时，你应该能不查资料完成这些事：

- 从空白文件手写一个 GLSL ES 3.00 的 fragment：SDF 形状 + fbm 流动 + 余弦调色板 + `u_time` / `u_mouse` 响应，一遍跑通
- 画出 attribute / uniform / varying 三条数据通路的接线图，说清每条通路在什么时候起作用
- 把原生 shader 迁进 Three.js 的 ShaderMaterial，说清框架替你注入了哪些内置 uniform 与 attribute
- 用 EffectComposer 组装「渲染 → bloom → 调色 → 输出」的后期链，并解释 bloom 强度如何改变画面情绪
- 打开 lusion.co 或 igloo.inc 的任意一个片段，能判断它用了哪层视觉算法、对应本课哪一讲，以及你会从哪里下刀复刻
