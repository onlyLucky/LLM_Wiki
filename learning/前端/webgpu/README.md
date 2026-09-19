# WebGPU 三天实战课程

为有经验的前端工程师设计的 WebGPU 速成路线：第一天搞清楚 GPU 如何画出一个三角形，第二天把图形学理论落到渲染管线的每个阶段，第三天换上 Three.js WebGPURenderer 与 TSL，逼近 lusion.co、igloo.inc 这类创意网站的技术层次。

课程假设你有五年前端经验，会 TypeScript 与 Vite，学过 Three.js 和 GLSL 更好——讲义里准备了 GLSL↔WGSL、GLSL↔TSL 两张对照表帮你迁移。

## 三天路线

| 天 | 主题 | 你会得到什么 |
|----|------|--------------|
| Day 1 | 原生 WebGPU 基础 | 对象模型、渲染管线、WGSL、顶点缓冲、uniform 与绑定组——能从空白页面手写出一个动画三角形 |
| Day 2 | 渲染进阶与 GPU 计算 | 3D 变换、光栅化、纹理、Blinn-Phong、程序化几何、计算着色器、GPGPU 粒子、Ray Marching |
| Day 3 | Three.js / TSL 桥接 | WebGPURenderer、TSL 节点语言、compute、后处理，以及 lusion / haoqi / iyO 案例拆解与工作坊 |

每天上午偏概念、下午偏动手，讲授与实操大约四六开。每个模块都有配套 demo（完整参考实现），每天收尾有三档作业：基础、进阶、挑战，做不完可以降级，做完了去 `solutions/` 对照。

## 快速开始

```bash
cd 前端/webgpu
npm install
npm run dev
```

打开 <http://localhost:5173/>，从门户页进入任意 demo。每个 demo 页面自带深色画框、角落标注与实时 FPS——它们是课程视觉规范的一部分，作业骨架里已经接好同样的外壳。

讲义是纯 Markdown，在 Obsidian、VS Code 或 GitHub 里阅读均可；核心架构图在 `assets/diagrams/`，流程图直接内嵌在文中。

## 目录导航

```
├── 00-课程计划与学习地图.md      先读这个：三天模块表与学习路径
├── 01-环境准备与浏览器支持.md     开课前 10 分钟读完，跑一遍检测脚本
├── 讲义/                        19 篇讲义，按天分目录
├── demos/                       15 个完整可运行的参考实现
├── homework/                    9 份分层作业骨架（TODO 挖空式）
├── solutions/                   参考答案，做完再看
├── assets/diagrams/             10 张 SVG 核心架构图
├── shared/                      所有页面共享的视觉外壳
├── 参考资料.md                  权威资源分级清单
└── 实例网站清单.md               值得逐帧拆解的创意网站
```

## 这套课程与你的其他笔记如何配合

理论推导不在这里重复：空间变换、光栅化、着色的数学细节见你仓库中的《GAMES101 现代计算机图形学课程笔记》（第 3 章变换、第 4 章光栅化、第 5 章着色、第 7 章光线追踪、第 8 章动画）；GLSL 基础、噪声函数、Ray Marching 见《Three.js 创意 3D 课程笔记》（第 10–16 课）。本课程的讲义在每篇开头标注「理论对照」，把两边接起来。

## 通关标准

三天结束时，你应该能不查资料完成这些事：

- 从零搭一个 WebGPU 工程：adapter / device / context / pipeline / 帧循环
- 手写 MVP 矩阵并用 uniform 传入着色器，解释每个空间变换在做什么
- 用计算着色器写一个可交互的粒子系统（ping-pong 双缓冲）
- 用 TSL 在 50 行内复刻 Day 2 花几百行写的顶点动画，并说清框架替你做了什么
- 打开 lusion.co 时，能大致判断出每个效果背后是顶点动画、布料模拟还是后处理
