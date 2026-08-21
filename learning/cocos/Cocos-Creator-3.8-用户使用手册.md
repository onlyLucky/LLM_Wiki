# Cocos Creator 3.8 用户使用手册

> 本手册基于 [Cocos Creator 3.8 官方用户手册](https://docs.cocos.com/creator/3.8/manual/zh/) 整理编写，内容与官方文档保持一致，涵盖全部主要模块。所有链接与图片均使用官方文档中的原始地址。
>
> 官方文档入口：[https://docs.cocos.com/creator/3.8/manual/zh/](https://docs.cocos.com/creator/3.8/manual/zh/)

---

## 目录

- [前言](#前言)
- [第一章 新手入门](#第一章-新手入门)
- [第二章 案例与教程](#第二章-案例与教程)
- [第三章 编辑器基础](#第三章-编辑器基础)
- [第四章 场景制作](#第四章-场景制作)
- [第五章 资源系统](#第五章-资源系统)
- [第六章 脚本指南及事件系统](#第六章-脚本指南及事件系统)
- [第七章 图形渲染](#第七章-图形渲染)
- [第八章 2D 渲染](#第八章-2d-渲染)
- [第九章 UI 系统](#第九章-ui-系统)
- [第十章 动画系统](#第十章-动画系统)
- [第十一章 声音系统](#第十一章-声音系统)
- [第十二章 缓动系统](#第十二章-缓动系统)
- [第十三章 物理系统](#第十三章-物理系统)
- [第十四章 粒子系统](#第十四章-粒子系统)
- [第十五章 地形系统](#第十五章-地形系统)
- [第十六章 发布跨平台游戏](#第十六章-发布跨平台游戏)
- [第十七章 扩展编辑器](#第十七章-扩展编辑器)
- [第十八章 本地化](#第十八章-本地化)
- [第十九章 进阶主题](#第十九章-进阶主题)
- [附录 升级指南](#附录-升级指南)

---

## 前言

欢迎使用 Cocos Creator 3.8！

Cocos Creator 既是一款高效、轻量、免费开源的跨平台 2D&3D 图形引擎，也是一个实时 2D&3D 数字内容创作平台。拥有 **高性能**、**低功耗**、**流式加载**、**跨平台** 等诸多优点，您可以用它来创作 **游戏**、**车机**、**XR**、**元宇宙** 等领域的项目。

本手册包括详尽的使用说明、面向不同职能用户的工作流程和新手教程，可以帮您快速掌握如何使用 Cocos Creator 以及其相关服务。

您可以将此文档从头读到尾，也可以在有需要的时候用来查阅。

如果您是第一次使用 Cocos Creator，可以从 [新手入门](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/) 和 [示例与教程](https://docs.cocos.com/creator/3.8/manual/zh/cases-and-tutorials/) 开始。

如果您已经熟悉其他引擎如 Unity，可以查看 [Unity 开发者入门 Cocos Creator 快速指南](https://docs.cocos.com/creator/3.8/manual/zh/guide/unity/) 来快速上手 Cocos Creator。

### v3.8 新增功能

- 此版本中增加了 **程序化动画**、**高精度文本**、**全新的可定制渲染管线**、**角色控制器** 等全新特性。
- 完整的更新列表请前往 [发布说明](https://www.cocos.com/creator-download)。
- 采用 Cocos Creator 旧版本的项目升级请参考 [升级指南](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/)。

### 用户手册主要模块

| 模块 | 官方链接 |
| --- | --- |
| 场景制作 | [concepts/scene](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/) |
| 资源系统 | [asset](https://docs.cocos.com/creator/3.8/manual/zh/asset/) |
| 脚本指南及事件系统 | [scripting](https://docs.cocos.com/creator/3.8/manual/zh/scripting/) |
| 发布跨平台游戏 | [editor/publish](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/) |
| 图形渲染 | [module-map/graphics](https://docs.cocos.com/creator/3.8/manual/zh/module-map/graphics.html) |
| 2D 渲染 | [2d-object/2d-render](https://docs.cocos.com/creator/3.8/manual/zh/2d-object/2d-render/) |
| UI 系统 | [2d-object/ui-system](https://docs.cocos.com/creator/3.8/manual/zh/2d-object/ui-system/) |
| 动画系统 | [animation](https://docs.cocos.com/creator/3.8/manual/zh/animation/) |
| 声音系统 | [audio-system/overview](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/overview.html) |
| 物理系统 | [physics](https://docs.cocos.com/creator/3.8/manual/zh/physics/) |
| 粒子系统 | [particle-system](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/) |
| 缓动系统 | [tween](https://docs.cocos.com/creator/3.8/manual/zh/tween/) |
| 地形系统 | [editor/terrain](https://docs.cocos.com/creator/3.8/manual/zh/editor/terrain/) |
| 资源管理 | [asset/asset-manager](https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-manager.html) |
| 本地化 | [editor/l10n/overview](https://docs.cocos.com/creator/3.8/manual/zh/editor/l10n/overview.html) |
| 扩展编辑器 | [editor/extension/readme](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/readme.html) |
| 进阶主题 | [advanced-topics](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/) |

### 更多内容

- [Cocos 官方论坛](https://forum.cocos.org/) 可以提问、查找问题答案、与其他开发者交流
- [案例与教程](https://docs.cocos.com/creator/3.8/manual/zh/cases-and-tutorials/) 可以获得教程和官方示例项目
- [Cocos Store](https://store.cocos.com/) 可以获得更多素材、学习案例以及源码

### 产品线简介

Cocos（雅基软件）多年来不断发展，已经发布了多个与 Cocos Creator 密切相关的产品线：

- **Cocos Creator 3.x**：发布于 2021 年初，是当前 Cocos Creator 的最新版本，已经过大量商业项目验证。3.x 完全摒弃了 Cocos2d-x 底层，采用全新高性能跨平台 3D 内核，标志着 Cocos Creator 正式发展为全面的泛移动端 3D 游戏引擎。
- **Cocos Creator 2.x**：发布于 2018 年，2023 年停止更新。所有能力已被 Cocos Creator 3.x 继承，因此建议新项目使用 [最新的 Cocos Creator 3.x](https://www.cocos.com/creator-download)。
- **Cocos Creator 3D**：2017 年立项，2019 年底以 Cocos Creator 3D 的身份在中国进行了一年多的小规模测试，后正式合并至 Cocos Creator 3.0。
- [**Cocos2d-x**](https://www.cocos.com/cocos2d-x)：发布于 2010 年，2019 年停止更新。这是 Cocos2d 社区最活跃的分支，Cocos Creator 2.x 最初采用的底层运行时便是升级过后的 Cocos2d-x。
- **Cocos**：当 Cocos 作为引擎的名字单独出现时，通常代表 Cocos Creator 3.x，而不是 Cocos2d-x。

> 注意：Cocos Creator 3.x 与 Cocos Creator 2.x 在用法上已经有所不同，二者的 API 也不完全兼容。在查阅文档、API 和教程时，请开发者注意辨别目标版本是 2.x 还是 3.x，以免因版本不一致导致错误。

---

## 第一章 新手入门

> 官方入口：[getting-started](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/)

### 1.1 关于 Cocos Creator

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/introduction/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/introduction/)

Cocos Creator 是一个完整的游戏开发解决方案，包含轻量高效的跨平台游戏引擎和一体化编辑器，支持 2D/3D 游戏开发。产品定位为以内容创作为核心，实现了脚本化、组件化和数据驱动的游戏开发工具，涵盖从设计、开发、预览、调试到发布的全工作流。

**核心工作流程**：创建或导入资源 → 搭建场景 → 添加组件脚本实现交互 → 一键预览和发布。支持 Web、iOS、Android、PC 客户端、各类小游戏等多平台发布。

**架构特色**：编辑器由 Electron 驱动，引擎提供统一接口和组件。支持设计师和程序员的完美分工合作——设计师搭建场景视觉表现，程序员开发功能组件。

**功能特性**：
- 脚本中声明可编辑的数据属性
- 智能画布适配 UI 系统
- 动画系统
- 动态语言脚本开发（JavaScript/TypeScript）
- C++ 内核 + JS 双内核架构
- 开放式插件系统

### 1.2 安装和启动

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/install/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/install/)

Cocos Creator 从 v2.3.2 开始接入全新的 Dashboard 系统，作为统一下载器和启动入口，支持多版本引擎和项目统一管理。

- **Windows 安装**：安装程序为 `.exe` 文件，默认安装路径 `C:\CocosDashboard`。需注意：同名版本无法自动覆盖安装；CAB 签名错误需管理员权限安装；旧系统可能缺失 dll 需安装 Microsoft 通用 C 运行时补丁（KB2999226）。
- **Mac 安装**：dmg 镜像文件，将 `CocosDashboard.app` 拖拽到应用程序文件夹。如遇"来自身份不明的开发者"提示，需在"系统偏好设置 -> 安全性与隐私"中点击"仍要打开"。
- **操作系统要求**：Mac OS X 10.9+，Windows 7 64 位+。
- 启动后需使用 Cocos 开发者帐号登录，可通过 [https://auth.cocos.com/#/sign_up/register](https://auth.cocos.com/#/sign_up/register) 注册。

### 1.3 使用 Dashboard

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/dashboard/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/dashboard/)

Dashboard 窗口包含左侧导航栏：

- **首页**：产品动态、最近项目、编辑器快捷安装
- **项目**：项目列表、新建/导入项目
- **安装**：编辑器版本管理
- **商城**：Cocos Store
- **动态**：新闻和更新日志
- **学习**：官方教程
- **账号**：账户管理

**项目页功能**：双击项目打开；支持按名称搜索、按时间排序、选择其他已安装版本打开项目。操作菜单支持：打开项目、在 Finder/资源管理器中显示、从列表中移除、选择项目图标（支持 BMP/PNG/GIF/JPG）、重命名项目、设置项目描述。

**新建项目**：选择 Empty 等模板，设置项目名称（仅支持 a-z, A-Z, 0-9, _, -）和路径，点击"创建并打开"即可在编辑器中打开。

**安装页**：支持"添加本地版本"（拖拽已有编辑器）和"安装编辑器"（下载安装新版本）。

### 1.4 Hello World 项目

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/helloworld/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/helloworld/)

- 在 Dashboard 的"项目"选项卡中点击"新建"，选择 **Empty** 模板，设置项目名称和路径，点击"创建并打开"创建空项目。
- 在资源管理器中右键创建新 Scene，在层级管理器中右键创建 3D 对象 -> Cube 立方体。
- 创建 TypeScript 脚本 `HelloWorld`，添加 `start()` 函数输出 "Hello world"，将脚本挂载到 Cube 节点上。
- 点击"预览"按钮使用浏览器或模拟器预览场景，查看控制台日志输出。
- 调整 Camera（Main Camera 节点）的 Position 属性或拖动 Gizmo，使立方体在视口中显示更明显。

**关键步骤**：新建项目 → 新建场景 → 创建物体 → 添加脚本 → 绑定脚本 → 预览 → 调整 Camera。

### 1.5 项目结构

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/project-structure/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/project-structure/)

项目文件夹结构：

| 目录 | 说明 |
| --- | --- |
| `assets` | 资源目录，存放所有本地资源、脚本、第三方库 |
| `build` | 构建目录，构建后生成 |
| `library` | 导入的资源目录，删除后重新打开项目会重新生成 |
| `local` | 本机配置信息 |
| `profiles` | 编辑器配置，含各平台构建配置 |
| `settings` | 项目设置，需加入版本控制同步 |
| `temp` | 临时缓存 |
| `extensions` | 自定义扩展插件 |
| `package.json` | 项目合法性验证标志 |

`assets` 中的每个文件导入后生成同名 `.meta` 文件，需一并提交到版本控制系统。版本控制建议：只需提交 `assets`、`extensions`、`settings`、`package.json`，其他由 `.gitignore` 自动排除。

### 1.6 编辑器界面

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/](https://docs.cocos.com/creator/3.8/manual/zh/editor/)

编辑器由多个面板组成，可自由移动组合。默认布局包含六大核心面板：

- **A 层级管理器**（Hierarchy）：树状列表展示场景节点层级关系，与场景编辑器同步。
- **B 资源管理器**（Assets）：显示 `assets` 文件夹中所有资源，支持拖拽导入。
- **C 场景编辑器**（Scene）：展示和编辑场景可视内容，所见即所得。
- **D 动画编辑器**（Animation）：编辑和存储动画数据。
- **E 属性检查器**（Inspector）：查看和编辑选中节点及组件属性。
- **F 项目预览**（Preview）：在 Web 或原生平台预览游戏效果。

其他重要面板：控制台（Console，显示报错/警告/日志）、偏好设置（Preferences，全局设置）、项目设置（Project Settings，项目特定配置）、服务（Cocos Service，集成技术服务）。

### 1.7 快速上手：制作第一个游戏

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/first-game/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/first-game/)

本教程制作一款名为"一步两步"的魔性跳跃游戏，考验玩家根据路况选择跳一步还是跳两步的反应能力。

核心步骤包括：添加主角（胶囊体先生/女士）、添加角色动画、跑道升级、跟随相机、增加开始菜单、增加游戏状态逻辑、添加游戏结束逻辑、步数显示、总结。

涵盖 Cocos Creator 的多个核心特性：3D 对象创建、动画系统、相机跟随、UI 菜单、游戏状态机、事件处理等。

### 1.8 进阶篇：添加阴影、光照和动画

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/first-game/advance.html](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/first-game/advance.html)

在"一步两步"游戏原型基础上，添加光影效果：在场景节点中启用 `shadows`，将角色 Body 的 `ShadowCastingMode` 设为 `ON`，调整 Main Light 方向使阴影显示在合适位置。添加主角模型：使用第三方 3D 模型资源替换默认胶囊体。

### 1.9 获取帮助和支持

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/support.html](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/support.html)

- 官方媒体：Cocos 引擎官方微信公众号、B 站官方频道（不定期直播和视频教程）。
- 提交问题：Cocos 论坛社区（[https://forum.cocos.org/c/58](https://forum.cocos.org/c/58)）、Cocos 技术支持（[https://www.cocos.com/assistant](https://www.cocos.com/assistant)）。
- 第三方工具推荐：VS Code、WebStorm（代码编辑）、TexturePacker（图集）、Glyph Designer/Hiero/BMFont/snowb-bmf（位图字体）、Spine/Spriter/DragonBones（2D 骨骼动画）、Particle Designer/Particle2dx（粒子特效）。

### 1.10 注意事项

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/getting-started/attention/](https://docs.cocos.com/creator/3.8/manual/zh/getting-started/attention/)

Cocos Creator 3.0 全面支持 ES6 和 TypeScript，只支持 ES6 和 TS 的 class 语法。旧版 Cocos Creator v2.x 的 cc.Class 语法（ES5 风格）已不再支持。

---

## 第二章 案例与教程

> 官方入口：[cases-and-tutorials](https://docs.cocos.com/creator/3.8/manual/zh/cases-and-tutorials/)

### 2.1 示例项目

| 项目名称 | GitHub/Gitee 链接 | Cocos Store | 简介 |
| --- | --- | --- | --- |
| 一步两步 | [tutorial-mind-your-step-3d](https://github.com/cocos/tutorial-mind-your-step-3d) | - | "快速上手"教程中分步讲解制作的游戏 |
| 材质展示 Demo | [cocos-example-materials](https://github.com/cocos/cocos-example-materials) | - | 展示引擎内置和自定义材质效果，包括标准 PBR、卡通渲染、皮肤、头发、眼球、树叶等高级材质 |
| 渲染管线 Demo | [cocos-example-render-pipeline](https://github.com/cocos/cocos-example-render-pipeline) | - | 展示内置后处理渲染管线及各种后处理特性的开启效果 |
| 物理范例集合 | [cocos-example-physics](https://github.com/cocos/cocos-example-physics) | - | 包含 2D & 3D 物理测试例工程，以及吞噬黑洞、简化小车、坠落小球等物理小游戏 |
| Marionette 动画系统范例 | [cocos-example-marionette](https://github.com/cocos/cocos-example-marionette) | - | 全方位展示 Marionette 动画系统：动画状态机、事件处理、姿态图、反向动力学 IK 等 |
| UI 展示 Demo | [cocos-example-ui](https://github.com/cocos/cocos-example-ui/) | [2799](https://store.cocos.com/app/detail/2799) | 各类 UI 组件组合使用的演示 Demo |
| 部分功能范例 | [cocos-example-projects](https://github.com/cocos/cocos-example-projects) / [gitee](https://gitee.com/cocos/example-projects) | - | 包含引擎网络、NPM 模块等功能的独立示例 |
| 模块展示集合 | [cocos-test-projects](https://github.com/cocos/cocos-test-projects) | - | 引擎各功能范例项目，基本覆盖大部分功能模块 |
| 实用解决方案 | [cocos-awesome-tech-solutions](https://github.com/cocos/cocos-awesome-tech-solutions) | - | 官方技术支持团队分享的一系列实用技术解决方案 |
| 弹弹乐 3D | [cocos-example-ball](https://github.com/cocos/cocos-example-ball) | [2802](https://store.cocos.com/app/detail/2802) | 制作弹弹球游戏的项目 |
| 快上车 3D | [cocos-tutorial-taxi-game](https://github.com/cocos/cocos-tutorial-taxi-game) | [2796](https://store.cocos.com/app/detail/2796) | 基于物理的游戏制作 demo，制作快上车游戏 |

所有 GitHub 项目均跟随版本更新，主分支对应最新 Cocos Creator 版本。

### 2.2 教程

**游戏开发类**：

| 教程名称 | URL | 简介 |
| --- | --- | --- |
| Cocos Creator 零基础教程：3D 跑酷游戏开发 | [B站系列教程](https://space.bilibili.com/491120849/channel/collectiondetail?sid=842152) | B站系列教程 |
| Cocos Creator 零基础教程：3D 俯视角 RPG 割草游戏 | [B站系列教程](https://space.bilibili.com/5981196/channel/collectiondetail?sid=902461) | B站系列教程 |
| 鹰击长空 3D 射击游戏开发 | [B站视频](https://www.bilibili.com/video/BV1HY411H7V5) | B站视频 |
| 快上车 3D 游戏开发 | [B站视频](https://www.bilibili.com/video/BV1AE411j7L9/) | B站视频 |

**图形渲染类**：

| 教程名称 | URL | 简介 |
| --- | --- | --- |
| 图形学与 Shader 渲染实战系列 | [B站系列教程](https://space.bilibili.com/634931989/channel/collectiondetail?sid=967750) | B站系列教程 |
| Cocos Creator Shader 入门基础系列 | [B站视频](https://www.bilibili.com/video/BV1Cq4y1d726) | B站视频 |
| 烘焙\|粒子\|皮肤\|车漆 | [B站系列教程](https://space.bilibili.com/491120849/channel/collectiondetail?sid=741263) | B站系列教程 |

### 2.3 实用方案分享（官方技术支持团队）

| 方案名称 | URL |
| --- | --- |
| CocosCreator 3.x 技术方案分享 第一期 | [论坛](https://forum.cocos.org/t/topic/124637) |
| CocosCreator 3.x 技术方案分享 第二期 | [论坛](https://forum.cocos.org/t/topic/128862) |
| CocosCreator 3.x 技术方案分享 第三期 | [论坛](https://forum.cocos.org/t/topic/134725) |
| CocosCreator 3.x 技术方案分享 第四期 | [论坛](https://forum.cocos.org/t/topic/139736) |
| CocosCreator 3.x 自定义渲染材质方案分享 第一期 | [论坛](https://forum.cocos.org/t/topic/131501) |
| CocosCreator 3.x 自定义渲染材质方案分享 第二期 | [论坛](https://forum.cocos.org/t/topic/137605) |
| CocosCreator 3.x 自定义渲染材质方案分享 第三期 | [论坛](https://forum.cocos.org/t/topic/140525) |
| Cocos Creator 3.x 学习资料整理 | [论坛](https://forum.cocos.org/t/topic/122399) |

### 2.4 更多资源

- Cocos 官方论坛：[https://forum.cocos.org/](https://forum.cocos.org/) — 提问、查找答案、与其他开发者交流
- Cocos Store：[http://store.cocos.com/](http://store.cocos.com/) — 各类美术资源、插件、源码、学习 DEMO
- 哔哩哔哩 Cocos 官方：[https://space.bilibili.com/491120849/dynamic](https://space.bilibili.com/491120849/dynamic) — 不定期直播和官方视频教程

## 第三章 编辑器基础

> 官方入口：[editor](https://docs.cocos.com/creator/3.8/manual/zh/editor/)

### 3.1 编辑器界面介绍

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/](https://docs.cocos.com/creator/3.8/manual/zh/editor/)

Cocos Creator 编辑器由多个面板组成，面板可以自由移动、组合，以适应不同项目和开发者的需要。默认编辑器布局中包含以下核心面板：

![编辑器界面](https://aka.doubaocdn.com/s/64GrN6HthC)

- **（A）层级管理器**：以树状列表的形式展示场景中的所有节点和它们的层级关系，所有在场景编辑器中看到的内容都可以在层级管理器中找到对应的节点条目，在编辑场景时这两个面板的内容会同步显示。详情见 [层级管理器](https://docs.cocos.com/creator/3.8/manual/zh/editor/hierarchy/)。
- **（B）资源管理器**：显示了项目资源文件夹（`assets`）中的所有资源，以树状结构显示文件夹并自动同步操作系统中对项目资源文件夹内容的修改。详情见 [资源管理器](https://docs.cocos.com/creator/3.8/manual/zh/editor/assets/)。
- **（C）场景编辑器**：用于展示和编辑场景中可视内容的工作区域，通过搭建场景即可获得所见即所得的场景预览。详情见 [场景编辑器](https://docs.cocos.com/creator/3.8/manual/zh/editor/scene/)。
- **（D）动画编辑器**：用于编辑并存储动画数据。详情见 [动画系统](https://docs.cocos.com/creator/3.8/manual/zh/animation/)。
- **（E）属性检查器**：用于查看并编辑当前选中节点和组件属性的工作区域。详情见 [属性检查器](https://docs.cocos.com/creator/3.8/manual/zh/editor/inspector/)。
- **（F）项目预览**：在场景搭建完成之后，在 Web 或原生平台预览游戏的运行效果。详情见 [预览调试](https://docs.cocos.com/creator/3.8/manual/zh/editor/preview/)。

其他重要面板/功能：

- **控制台**：显示报错、警告或其他编辑器和引擎生成的日志信息。详情见 [控制台](https://docs.cocos.com/creator/3.8/manual/zh/editor/console/)。
- **偏好设置**：提供各种编辑器个性化的全局设置，包括原生开发环境、游戏预览、其他扩展的全局设置等。详情见 [偏好设置](https://docs.cocos.com/creator/3.8/manual/zh/editor/preferences/)。
- **项目设置**：提供各种项目特定的个性化设置，包括分组管理、功能裁剪、项目预览、自定义引擎等。详情见 [项目设置](https://docs.cocos.com/creator/3.8/manual/zh/editor/project/)。
- **服务（Cocos Service）**：集成在 Cocos Creator 内的服务面板，甄选优质技术方案商提供高性价比服务接入。详情见 [Cocos Service 简介](https://service.cocos.com/document/zh/)。

### 3.2 偏好设置

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/preferences/](https://docs.cocos.com/creator/3.8/manual/zh/editor/preferences/)

点击编辑器主菜单栏中的 **Cocos Creator/File -> 偏好设置** 即可打开。偏好设置由多个分页组成，修改之后会自动保存：

- **通用设置**：编辑器语言（中文/英文）、本机预览 IP 地址、预览服务器端口号、数值默认步长。
- **外部程序**：配置 WeChat 开发者工具、Android NDK、Android SDK、HarmonyOS NDK、HarmonyOS SDK、默认脚本编辑器、默认浏览器。
- **设备管理器**：管理使用模拟器或者浏览器预览时的设备分辨率，支持手动添加/修改/删除自定义分辨率。
- **引擎管理器**：配置自定义引擎，包括使用内置 TypeScript 引擎/原生引擎，或自定义引擎路径。详情见 [引擎定制工作流程](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/engine-customization.html)。
- **资源数据库**：设置资源管理器中的资源数据库信息，包括日志等级、忽略文件（Glob）、自动刷新资源、默认资源导入类型配置等。
- **控制台**：设置控制台输出的日志，包括显示日期和文字大小。
- **属性检查器**：设置离开编辑自动保存功能。
- **预览**：设置保存场景自动刷新预览、模拟器自动清除缓存、模拟器调试面板、HTTPS 相关配置等。
- **动画编辑器**：设置动画即时缓存功能、缓存间隔时间、缓存文件数量最大值。
- **构建发布**：设置日志文件打开方式、缓存资源的序列化 JSON、缓存编译后的引擎、缓存纹理压缩资源等。
- **实验室**：不定期提供一些新的技术方案或实验性质的功能，包括延迟渲染管线、场景即时缓存、动画嵌入播放器、开启姿态图功能、开启烘焙功能等。实验室功能在未来版本可能合并、修改甚至取消，使用前请严格测试。

### 3.3 项目设置

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/project/](https://docs.cocos.com/creator/3.8/manual/zh/editor/project/)

点击编辑器主菜单栏中的 **项目 -> 项目设置** 即可打开，设置会保存在项目的 `settings/packages` 文件夹中，如需在开发者间同步请将 `settings` 目录加入版本控制。项目设置由以下分页组成：

- **项目数据**：设置默认 Canvas 的设计分辨率、适配屏幕宽/高、高画质模式（3D HQ 模板）、渲染管线（builtin-forward 前向渲染管线 / builtin-deferred 延迟渲染管线）。
- **Layers**：用于设置节点的可见性层级，可自定义第 0~19 个 Layer，后 12 个为引擎内置不可修改。节点的 Layer 属性匹配相机的 Visibility 属性。
- **排序图层**：自定义 2D UI 以及 3D 物体的渲染排序，通过添加 Sorting2D / Sorting 组件实现。
- **物理**：配置物理的各项参数，详情见 [物理配置](https://docs.cocos.com/creator/3.8/manual/zh/editor/project/physics-configs.html)。
- **脚本**：设置类字段语义、允许声明类字段、宽松模式、导入映射（Import Map）、预览浏览器列表、导出条件，以及插件脚本排序。
- **模型**：智能材质转换。
- **骨骼贴图布局设置**：配置项目内的骨骼贴图布局，参考 [骨骼贴图布局设置](https://docs.cocos.com/creator/3.8/manual/zh/animation/joint-texture-layout.html)。
- **Macro Config（引擎宏配置）**：修改宏配置的快捷方式，包括 `ENABLE_TILEDMAP_CULLING`、`TOUCH_TIMEOUT`、`ENABLE_TRANSPARENT_CANVAS`、`ENABLE_WEBGL_ANTIALIAS`、`ENABLE_ANTIALIAS_FXAA`、`ENABLE_BLOOM`、`CLEANUP_IMAGE_CACHE`、`ENABLE_MULTI_TOUCH`、`MAX_LABEL_CANVAS_POOL_SIZE`、`ENABLE_WEBGL_HIGHP_STRUCT_VALUES`、`BATCHER2D_MEM_INCREMENT` 以及自定义宏。
- **功能裁剪**：针对发布时引擎中使用的模块进行裁剪，达到减小发布版引擎包体的效果。列表中未选中的模块在打包、预览时将会被裁剪掉，建议打包后进行完整测试。
- **压缩纹理**：配置纹理压缩预设，可添加多个预设，针对不同平台制定配置细则。目前支持 Web、iOS、Mini Game、Android 平台。内置的 `default` 和 `transparent` 两个预设不可修改/删除。

### 3.4 场景编辑器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/scene/](https://docs.cocos.com/creator/3.8/manual/zh/editor/scene/)

**场景编辑器** 是内容创作的核心工作区域，用于选择和摆放场景图像、角色、特效、UI 等各类游戏元素，可选中并通过变换工具修改节点的位置、旋转和缩放等属性，并获得所见即所得的场景效果预览。

#### 视图介绍

场景编辑器包括 **3D** 和 **2D** 两种视图，3D 视图用于 3D 场景编辑（透视相机），2D 视图主要用于 UI 节点等 2D 元素的编辑（正交相机）。

**3D 视图操作**：鼠标左键 + Alt 旋转视图；鼠标中键平移；空格键 + 拖拽平移；鼠标滚轮缩放；鼠标右键 + WASD 摄像机漫游；**F** 聚焦到选中节点。

**2D 视图操作**：鼠标中键/右键平移；鼠标滚轮以鼠标悬停位置为中心缩放；**F** 聚焦到选中节点。

#### 变换工具

| 工具 | 快捷键 | 说明 |
| --- | --- | --- |
| 移动变换工具 | W | 红绿蓝箭头沿 X/Y/Z 轴移动节点；红绿蓝方块在 Y-Z/X-Z/X-Y 平面上移动节点 |
| 旋转变换工具 | E | 三个正交红绿蓝圆环，按住圆环拖动分别绕 X/Y/Z 轴旋转 |
| 缩放变换工具 | R | 红绿蓝正方体分别在 X/Y/Z 轴缩放；灰色正方体在三个轴上同时缩放 |
| 矩形变换工具 | T | 仅适用于 UI 节点，由四个顶点控制点、四个边控制点、一个中心控制点组成 |

此外还支持：

- **增量吸附工具**：在移动/旋转/缩放变换工具时按设定的步长操作，可在使用时按住 Ctrl/Command 触发，或开启自动吸附。仅 3D 视图下生效。
- **矩形工具吸附**：默认开启智能参考线对齐，可设置吸附检测阈值。
- **对齐和分布**：2D 视图独有工具，用于 2D/UI 多节点的对齐（至少两个节点）和均匀分布（至少三个节点）。
- **吸附操作**：3D 视图中支持 **顶点吸附**（快捷键 v）和 **表面吸附**（Ctrl/Command + Shift）。
- **绘制模式**：支持基础绘制模式（Shaded）和渲染调试两种模式，可用于调试表面着色器。
- **渲染输出目标分辨率设置**：选择场景相机的渲染输出目标分辨率。
- **场景灯光设置**：设置场景编辑时是否使用场景灯光，若场景无灯光时切换为编辑器自动创建的隐藏平行光。
- **视图相机 / 参考图 / 场景 Gizmo**：设置场景相机属性、导入参考图（UI 设计参考）、开关坐标轴 Gizmo。

### 3.5 层级管理器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/hierarchy/](https://docs.cocos.com/creator/3.8/manual/zh/editor/hierarchy/)

**层级管理器** 面板主要包括 **工具栏** 和 **节点列表** 两部分，用于展现当前场景中可编辑节点之间的关系。你可以单选、多选、创建、复制、移动、删除和重命名节点，任意节点都可创建子节点，子节点的坐标相对于父级节点，跟随父级节点移动。

主要功能与快捷键：

- **新建节点**：点击左上角 **+** 按钮或右键创建，可创建空节点、3D 对象、UI 节点、Prefab 节点等。创建 UI 节点时若不符合规则会自动创建 Canvas 节点作为根节点。
- **搜索节点**：支持搜索名称或 UUID、搜索 UUID、搜索 Path、搜索组件名称、搜索资源 UUID。
- **更改显示顺序**：通过拖拽节点上下移动更改排序，或拖拽到目标节点上作为其子节点。
- **重命名节点**：右键选择重命名，或使用 Enter/F2，Esc 取消。
- **其他操作**：复制/粘贴（Ctrl/Cmd + C/V）、生成副本（Ctrl/Cmd + D）、删除（Delete）、全选、复制并打印 UUID/PATH、锁定节点（从 v3.5.0 开始默认级联锁定父子节点，按住 Alt 仅锁定当前节点）。

### 3.6 资源管理器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/assets/](https://docs.cocos.com/creator/3.8/manual/zh/editor/assets/)

**资源管理器** 面板是访问和管理项目资源的重要工作区域，主要分为 **工具栏** 和 **资源列表** 两部分。资源列表默认包括 **assets**（项目资源库）和 **internal**（内置资源库，只读，可作为模板拖拽到 assets 中新建项目资源）两个基本资源库。

主要功能：

- **创建资源**：点击左上角 **+** 按钮或右键选择 **创建**，可创建 Scene、材质、脚本等资源。
- **选择/移动资源**：单击选中、Ctrl/Cmd 多选、Shift 连选；拖拽可移动资源；将资源拖拽到场景编辑器/层级管理器可生成节点（支持 `cc.Prefab`、`cc.Mesh`、`cc.SpriteFrame`）；从系统文件管理器拖拽文件到资源管理器可导入资源；从层级管理器拖拽节点到资源管理器可将节点保存为 `cc.Prefab`。
- **排序/折叠/搜索**：支持按名称/类型排序；搜索支持限定类型和指定搜索字段（名称或 UUID、UUID、URL、查找 UUID 的使用）。
- **右击菜单**：复制/剪切/粘贴、生成副本、重命名、删除（会保留在系统回收站）、在文件夹中查找、查找 UUID 的使用、导入/导出资源包、在浏览器中预览此场景、在 Finder 中显示、重新导入资源、UUID/URL/PATH 复制等。

### 3.7 属性检查器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/inspector/](https://docs.cocos.com/creator/3.8/manual/zh/editor/inspector/)

**属性检查器** 是查看并编辑当前选中节点、节点组件和资源的工作区域。在场景编辑器或层级管理器中选中节点，或在资源管理器中选中资源，即可在属性检查器中显示并编辑属性。

面板大致分为 **工具栏** 和 **属性设置** 两部分：

- **工具栏**：左上角两个箭头是编辑历史记录，可前进/后退选中过的节点/资源；右上角锁图标可锁定面板。
- **节点属性**：包括节点名称、激活开关，以及位置（Position）、旋转（Rotation）、缩放（Scale）三大变换属性。
- **组件属性**：节点上挂载的所有组件的属性；组件设置按钮可执行重置、删除、上移、下移、复制组件、粘贴组件值、粘贴成为新组件等操作。
- **添加组件**：点击 **添加组件** 按钮弹出组件列表（系统组件和自定义脚本组件），也可将脚本从资源管理器直接拖拽到属性检查器生成脚本组件。

**属性类型**分为值类型（数值、向量、字符串、布尔、枚举、颜色）和引用类型（节点、组件、资源）。批量操作支持同时选中多个同类型资源/节点进行批量设置，Material 资源不支持批量设置。

### 3.8 控制台

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/console/](https://docs.cocos.com/creator/3.8/manual/zh/editor/console/)

**控制台** 输出编辑器或引擎信息，信息类型包括 **log 日志**（灰色）、**warn 警告**（黄色）和 **error 报错**（红色）。顶部工具栏支持清空日志、模糊搜索、正则搜索、选择日志类型、打开备份日志文件。控制台的参数可在 **偏好设置 -> 控制台** 中配置（显示日期、文字大小）。

此外支持在 **开发者 -> 开发人员工具** 中自定义输出到控制台的日志，目前支持根据 URL 跳转链接、显示图片、定位到资源/节点、定位脚本文件、输出多语言文案等。

### 3.9 动画编辑器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/](https://docs.cocos.com/creator/3.8/manual/zh/animation/)

**动画编辑器** 面板用于编辑和预览当前所选节点的动画剪辑，可通过主菜单 **面板 -> 动画 -> 动画编辑器** 打开。面板主要分为以下部分：

1. **菜单工具栏**：播放/暂停/停止动画、添加事件帧、保存动画、退出编辑等。
2. **节点列表**：显示/设置当前选中节点及其子节点。
3. **动画时间轴与关键帧预览**：显示/设置事件帧以及所有动画属性上关键帧的预览。
4. **动画属性列表**：显示/设置当前编辑动画剪辑中包含的所有动画属性。
5. **动画属性关键帧预览**：显示/设置各动画属性上的关键帧。
6. **动画剪辑属性**：设置播放模式（WrapMode）、帧率（Sample）、播放速度（Speed）和时长（Duration）。

常用快捷键：Ctrl/Cmd + E 进入/退出动画编辑器、Ctrl/Cmd + S 保存、K 添加关键帧、P 播放/暂停等。时间轴刻度支持 **时间：0-00**、**帧：0**、**时间（s）：0 s** 三种显示方式。

### 3.10 项目预览与调试

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/preview/](https://docs.cocos.com/creator/3.8/manual/zh/editor/preview/)

通过编辑器窗口正上方的 **预览** 按钮可随时看到游戏运行效果，支持 **编辑器内**、**浏览器** 和 **模拟器** 三种预览方式。

- **浏览器预览**：在默认桌面浏览器中运行游戏的网页版本，推荐使用 Chrome。可通过浏览器开发者工具查看运行日志、打断点调试、分析资源加载和性能。
- **编辑器预览**：在编辑器内预览，支持暂停、单步运行、显示统计信息、设置最大帧率、选择分辨率、横竖屏切换等。
- **模拟器预览**：使用 Cocos Simulator（桌面模拟器）运行游戏场景，脚本日志和报错信息会显示在控制台面板中。
- **手机端预览**：扫描预览二维码，或直接在手机浏览器中输入预览地址（手机与电脑需在同一网段）。

**注意**：必须双击打开场景才能预览游戏内容；使用模拟器运行的效果与最终发布到原生平台可能会有差别，重要功能请以构建发布后的版本做最终测试。

### 3.11 主菜单与快捷键

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/mainMenu/index.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/mainMenu/index.html)

Cocos Creator 顶部主菜单栏包括 **文件**、**编辑**、**节点**、**项目**、**面板**、**扩展**、**开发者** 和 **帮助** 8 个菜单项。

| 菜单 | 主要功能 |
| --- | --- |
| 文件 | 新建/打开/保存场景、新建项目、偏好设置、布局、快捷键、导入 Cocos Creator 2.x 项目 |
| 编辑 | 撤销（Ctrl/Cmd+Z）、重做（Ctrl/Cmd+Shift+Z）、剪切、复制、粘贴、全选 |
| 节点 | 视角对齐（Ctrl/Cmd+Shift+F）、取消关联 Prefab、创建空节点/3D 对象/2D 对象/UI 组件/光线/特效/摄像机/地形 |
| 项目 | 项目设置、光照贴图、运行预览（Ctrl/Cmd+P）、刷新预览（Ctrl/Cmd+Shift+P）、构建发布（Ctrl/Cmd+Shift+B） |
| 面板 | 打开控制台（Ctrl/Cmd+0）、场景编辑器（Ctrl/Cmd+1）、资源管理器（Ctrl/Cmd+2）、属性检查器（Ctrl/Cmd+3）、层级管理器（Ctrl/Cmd+4）、预览（Ctrl/Cmd+5）、动画（Ctrl/Cmd+6）、节点预制库（Ctrl/Cmd+7）、服务（Ctrl/Cmd+8） |
| 扩展 | 扩展管理器、商城、创建扩展 |
| 开发者 | 编译引擎（Ctrl/Cmd+F7）、消息调试工具、重新加载（Ctrl/Cmd+R）、开关开发人员工具（Ctrl/Cmd+Shift+I）等 |
| 帮助 | 使用手册、API 文档、论坛、软件许可、更新日志、引擎仓库 |

---

## 第四章 场景制作

> 官方入口：[concepts/scene](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/)

### 4.1 场景制作工作流程

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/)

场景是游戏中的环境因素的抽象集合，是创建游戏环境的局部单位，我们可以在编辑器中制作一个场景来表现游戏中的一部分世界内容。

Cocos Creator 通过 **节点树** 和 **节点组件系统** 实现自由的场景结构。其中 Node 负责管理节点树的父子关系以及空间矩阵变换 Transform；组件系统赋予了节点各种高级功能，如模型渲染（MeshRenderer）、动画（Animation）、光源（Light）、地形（Terrain）等。3D 场景中的必要元素是 Camera 组件，代表游戏中的玩家视角，没有 Camera 就什么也看不见，因此创建场景时 Creator 会默认创建一个挂载了 Camera 组件的节点。

场景制作相关的工作流程：

- [场景资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/scene.html)
- [节点和组件](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/node-component.html)
- [坐标系和节点属性变换](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/coord.html)
- [节点层级和显示顺序](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/node-tree.html)
- [使用场景编辑器搭建场景](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/scene-editing.html)
- [天空盒](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/skybox.html)
- [全局雾](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/fog.html)
- [阴影](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/shadow.html)

### 4.2 场景资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/scene.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/scene.html)

游戏场景（Scene）是游戏开发时组织游戏内容的中心，也是呈现给玩家所有游戏内容的载体。场景文件本身也作为游戏资源存在，并保存了游戏的大部分信息。

**注意**：请尽量避免多人同时修改同一个场景资源，否则可能会导致冲突，且无法通过 `git` 合并解决冲突。

**创建场景**的方式：

1. 在资源管理器中右键点击想要放置场景文件的文件夹，选择 **创建 -> Scene**（强烈推荐）。
2. 在资源管理器中点击左上角 **+** 创建按钮，选择 **Scene**。
3. 在顶部菜单栏选择 **文件 -> 新建场景**，直接在场景编辑器中创建新场景，但需在保存时手动保存为 `.scene` 文件。

**保存场景**：使用快捷键 Ctrl + S（Windows）/Command + S（MacOS），或菜单 **文件 -> 保存场景**。

**切换场景**：在资源管理器中双击场景文件打开；游戏过程中可通过 [director.loadScene](https://docs.cocos.com/creator/3.8/api/zh/class/Director?id=loadscene) 等 API 动态加载及切换场景。

**场景属性**：选中 `scene` 节点后可在属性检查器中设置场景是否自动释放，以及环境光、阴影、全局雾、天空盒等场景相关属性。

**场景资源自动释放策略**：如果项目中的场景很多，随着新场景的切换内存占用会不断上升。启用场景自动释放后，切换场景时会自动释放该场景直接或间接引用到的所有资源；如果脚本中保存了对资源的"特殊引用"（全局变量、单例、闭包、动态资源等），可以使用 [Asset.addRef](https://docs.cocos.com/creator/3.8/api/zh/class/Asset?id=addRef) 增加引用计数来锁住这些资源。

### 4.3 节点和组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/node-component.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/node-component.html)

Cocos Creator 3.0 的工作流程以组件式开发为核心，也称作 **实体—组件架构**（Entity-Component System），即以组合而非继承的方式构建游戏元素。

**节点（Node）** 是承载组件的实体，是场景的基础组成单位，节点之间是树状的组织关系。节点包含基础属性（位移、旋转、缩放），节点间通过相对变换关系组织，子节点的更新依赖父节点、跟随父节点变换。

**节点属性**除位置、旋转、缩放外还拥有：

- **Mobility（可移动性）**：不同的可移动性会导致节点在光照上有不同的特性和表现。
  - 对于光源组件：Static 静态光源会烘焙直接光与间接光；Stationary 固定光源只烘焙间接光；Movable 可移动光源不参与烘焙。
  - 对于 MeshRenderer：Static & Stationary 静态物体可使用光照贴图；Movable 动态物体可使用光照探针。
- **Layer（可见性层级）**：节点的 Layer 属性包含在相机的 Visibility 属性中时节点才可被相机看见，支持 3D 组件与 2D 组件的混合渲染。

**组件（Component）**：通过 **添加组件** 按钮可给节点添加各种功能组件。例如给 Sphere 节点添加 DirectionalLight 平行光组件，调整颜色后球体模型的颜色会随之变化。

**注意**：一个节点上只能添加一个渲染组件，渲染组件包括 **MeshRenderer**、**Sprite**、**Label**、**Graphics**、**Mask**、**RichText**、**UIStaticBatch** 等。

### 4.4 坐标系和节点变换属性

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/coord.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/coord.html)

**世界坐标系（World Coordinate）**：也叫绝对坐标系，表示场景空间内的统一坐标体系。Creator 3.0 的世界坐标系采用笛卡尔右手坐标系，默认 x 向右，y 向上，z 向外，使用 -z 轴为正前方朝向。

**本地坐标系（Local Coordinate）**：也叫相对坐标系，是和节点相关联的坐标系。节点的 `Position` 属性设定的是该节点相对于父节点的本地坐标系位置，绘制整个场景时 Creator 会把这些本地坐标映射成世界坐标系坐标。

**变换属性**包括：

- **位置（Position）**：由 X、Y、Z 组成，默认为 `(0, 0, 0)`。子节点的 Position 以父节点的 Position 为坐标系原点；父节点改变 Position，子节点会跟着改变世界坐标，但子节点的 Position 属性不变化。
- **旋转（Rotation）**：由 X、Y、Z 组成，默认为 `(0, 0, 0)`。属性值为正时节点逆时针旋转，为负时顺时针旋转，旋转属性会影响到子节点。**注意**：节点的四元数 `rotation` 与属性检查器中的欧拉角 `eulerAngles` 是两个不同属性，脚本中可通过 `Node.eulerAngles` 获取 Rotation 的值。
- **缩放（Scale）**：由 X、Y、Z 组成，默认为 `(1, 1, 1)`。子节点上设置的缩放会与父节点的缩放叠加（相乘作用）；缩放不会影响当前节点的位置和旋转，但会影响子节点的位置。

### 4.5 节点层级和渲染顺序

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/node-tree.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/node-tree.html)

节点之间的完整逻辑关系叫做 **节点树**。在层级管理器中，显示在上层的叫父节点，显示在下层的叫子节点。因为 Creator 3.0 的 UI 节点需要其任意上级节点至少得有一个含有 UITransform 组件，创建时若不符合规则会自动添加 Canvas 节点作为它的父级，所以通常将 UI 节点统一放在 Canvas 节点下。

**节点渲染顺序**：3D 节点的渲染与距离相机的 Z 坐标值、透明度等有关。UI 节点的渲染和遮挡关系受节点树影响，在层级管理器中按照节点排列顺序从上到下依次渲染，显示在列表上面的节点在场景中会被下面的节点遮盖，因此子节点永远都会遮盖住父节点。详情见 [UI 渲染排序规则](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/priority.html)。

**性能考虑**：节点数量过多时场景加载速度会受影响，应避免出现大量无意义的节点，尽可能合并相同功能的节点。

### 4.6 使用场景编辑器搭建场景

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/scene-editing.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/scene-editing.html)

- **空节点**：不包含任何组件，可作为组织其他节点的容器，或挂载开发者编写的逻辑和控制组件。
- **3D 对象**：包括立方体、圆柱体、球体、胶囊、圆锥体、圆环体、平面和四方形等基础静态模型。
- **UI 节点**：创建 UI 节点时若不符合规则会自动创建 Canvas 节点作为父级，每个 UI 节点本身带有 UITransform 组件。Canvas 是 UI 渲染的**渲染根节点**，能提供多分辨率自适应缩放，并以屏幕中心作为坐标系原点。
- **逻辑节点的归属**：建议在场景根目录设置一些节点只负责挂载脚本执行游戏逻辑，放置在场景根层级与 Canvas 节点并列，方便协作时快速定位。

**提高效率的技巧**：在层级管理器中选中节点后按 F 聚焦；Ctrl/Cmd + D 复制并粘贴相同节点；按住 Ctrl/Cmd 依次点击多选、Shift 连选；2D 视图下可用对齐/分布按钮（顶对齐、垂直居中、底对齐、左对齐、水平居中、右对齐，以及六种分布方式）快速排列节点。

### 4.7 层级（Layer）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/layer.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/layer.html)

节点的 Layer 属性是一个无符号 32 位的整数，最多支持 32 个不同类型的 Layer。开发者可自定义第 0~19 个 Layer，剩下 12 个为引擎内置。相机的 Visibility 属性通过位操作符（`|` 和 `&`）判断节点的 Layer 是否应被观察到。

引擎内置的层级包括：

| 属性 | 说明 | 值 |
| --- | --- | --- |
| NONE | 设置全都不可见 | 0 |
| IGNORE_RAYCAST | 设置忽略射线检测 | 1 << 20 |
| GIZMOS | 设置配置信息可见 | 1 << 21 |
| EDITOR | 设置编辑器可见 | 1 << 22 |
| UI_3D | 设置 3D UI 节点可见 | 1 << 23 |
| SCENE_GIZMO | 设置场景配置节点可见 | 1 << 24 |
| UI_2D | 设置 2D UI 节点可见 | 1 << 25 |
| PROFILER | 设置分析工具节点可见 | 1 << 28 |
| DEFAULT | 设置默认节点可见 | 1 << 30 |
| ALL | 设置所有节点可见 | 0xffffffff |

### 4.8 天空盒

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/skybox.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/skybox.html)

天空盒是一个包裹整个场景的立方体，可以很好地渲染并展示整个场景环境，在基于 PBR 的工作流中天空盒还能贡献非常重要的 IBL 环境光照。

**开启天空盒**：在层级管理器中选中场景根节点，在属性检查器的 **Skybox** 组件中勾选 **Enabled** 属性。Skybox 组件主要属性包括：Enabled、Env Lighting Type（环境光类型）、UseHDR（HDR/LDR 模式切换）、Envmap（环境贴图，TextureCube 类型）、Reflection Convolution（反射卷积烘焙）、SkyboxMaterial（自定义天空盒材质）。

**设置环境贴图**：支持 TextureCube 类型单张贴图（Cube Cross 图片、PNG 或 HDR 格式）、图片文件形式的 CubeMap、以及由六张贴图手动组合的 CubeMap。可通过 **资源管理器 -> internal** 使用引擎内置的 TextureCube 资源。

**SkyIllum 参数**：位于场景根节点的 ambient 组件中，默认值为 20000。当 SkyIllum 小于 300 时天空盒的环境贴图无法正常显示；5000 时相当于月夜的光照强度。若运行后环境贴图未生效，需将 Camera 组件的 ClearFlag 修改为 **SKYBOX**。

**HDR/LDR 模式**：HDR（高动态范围）模式下所有光源强度变成光度学物理单位，环境光立方体贴图应使用 HDR 格式图片；LDR（低动态范围）模式下光源强度无单位，可使用 PNG 等格式图片。

### 4.9 全局雾

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/fog.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/fog.html)

全局雾用于模拟室外环境中的雾效果，也可用于隐藏摄像机远剪切平面外的模型来提高渲染性能。开启方法为在场景根节点的 **Fog** 组件中勾选 **Enabled**。

全局雾包括 **线性雾（LINEAR）**、**指数雾（EXP）**、**指数平方雾（EXP_SQUARED）**、**层雾（LAYERED）** 四种类型：

| 类型 | 说明 | 关键属性 |
| --- | --- | --- |
| 线性雾 | 雾效混合因子 f = (FogEnd - Cam_dis) / (FogEnd - FogStart) | FogStart、FogEnd |
| 指数雾 | f = e^(-max(0, distance-fogStart) * fogDensity) | FogDensity、FogStart、FogAtten |
| 指数平方雾 | f = e^(-max(0, distance-fogStart) * fogDensity)² | FogDensity、FogStart、FogAtten |
| 层雾 | 平行于水平面，具有一定高度，通过 FogTop 确定雾的高低 | FogAtten、FogTop、FogRange |

从 v3.4 开始增加 **Accurate** 选项用于开启基于像素的精确雾效计算，解决顶点数较少而体积较大物体上异常的雾效过渡。升级到 v3.4 时，所有调用到 `CC_APPLY_FOG` 的 Shader 代码都需要增加第二个参数 `worldPos`，例如 `CC_APPLY_FOG(finalColor, v_position.xyz)`。

### 4.10 阴影

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/shadow.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/shadow.html)

Creator 3.0 目前支持 **Planar** 和 **ShadowMap** 两种阴影类型。

**开启阴影**的步骤：

1. 选中 **Scene**，在属性检查器的 shadows 组件中勾选 **Enabled**。
2. 选中 **Light**，在 **Dynamic Shadow Settings** 组件中勾选 **Shadow Enabled**。
3. 选中需要显示阴影的 3D 节点，在 MeshRenderer 组件中将 **Cast Shadows** 设置为 **ON**；若阴影类型是 ShadowMap，还需将 **Receive Shadows** 设置为 **ON**。

**Planar 阴影**：一般用于较为简单的场景，只有投射在平面上才能正常显示，不会投射在物体上，ReceiveShadow 属性无效。属性包括 Saturation（阴影饱和度，建议 1.0）、ShadowColor、Normal、Distance。

**ShadowMap 阴影**：以光源为视点渲染场景，用于光影效果真实且较复杂的场景。属性包括 MaxReceived（最多支持产生阴影的光源数量，默认 4）、ShadowMapSize（阴影贴图分辨率：Low_256x256、Medium_512x512、High_1024x1024、Ultra_2048x2048）。支持 PCF 软阴影（HARD、SOFT、SOFT_2X、SOFT_4X）。平行光和聚光灯支持 ShadowMap，球形光不支持。

**注意**：从 v3.3 开始，阴影的 Linear、Packing 项被移除，Creator 将自动判断硬件能力并选用最优方式进行阴影渲染；从 v3.5 开始，平行光阴影和聚光灯光阴影从场景设置面板中独立出来。

### 4.11 相机

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/components/camera-component.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/camera-component.html)

相机是用来捕捉场景画面的主要工具，可视范围通过 6 个平面组成一个 **视锥体（Frustum）**，近裁剪面和远裁剪面控制近处和远处的可视距离与范围。

**相机组件属性**：

| 属性 | 说明 |
| --- | --- |
| Priority | 相机的渲染优先级，值越小越优先渲染 |
| Visibility | 可见性掩码，声明在当前相机中可见的节点层级集合 |
| ClearFlags | 缓冲清除标志位：DONT_CLEAR、DEPTH_ONLY、SOLID_COLOR、SKYBOX |
| ClearColor / ClearDepth / ClearStencil | 清空颜色/深度/模板缓冲值 |
| Projection | 投影模式：透视投影（PERSPECTIVE）和正交投影（ORTHO） |
| FovAxis / Fov | 视角固定轴向 / 视角大小 |
| OrthoHeight | 正交模式下的视角 |
| Near / Far | 近/远裁剪距离 |
| Aperture / Shutter / Iso | 相机光圈/快门/感光度，影响曝光参数（仅 HDR 下生效） |
| Rect | 相机最终渲染到屏幕上的视口位置和大小 |
| TargetTexture | 相机的渲染输出目标贴图，默认为空直接渲染到屏幕 |

**分组渲染**：通过相机组件的 Visibility 属性配合节点的 Layer 属性共同决定。当 Visibility 勾选多个 Layer 时，属性值通过多个 Layer 的值执行 `|` 操作计算得出。相机 culling 时每个节点的 layer 值会与相机执行 `&` 操作，如果相机的 Visibility 包含该 Layer，则节点可见。**注意**：从 Cocos Creator 3.0 开始，2D 元素（例如 Sprite）的渲染也遵从 Layer 与 Visibility 的判断。

### 4.12 光照

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/)

Creator 中光照的实现模拟了光对真实世界的影响，在场景中添加光源可以使场景产生相应的光照和阴影效果。Creator 支持的光源类型包括：

- [平行光（Directional Light）](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightType/dir-light.html)：最常用，模拟无限远处光源，常用于实现太阳光。光照效果不受光源位置影响，但旋转会影响照射方向。**注意**：Creator 目前只支持一个平行光，若同时添加多个则以最后一个为准；新建场景时默认自动创建一个 `Main Light` 平行光节点。
- [球面光（Sphere Light）](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightType/sphere-light.html)：类似 v2.x 的点光源，向所有方向均匀发散光线，用于模拟火把、蜡烛、灯泡等。
- [聚光灯（Spot Light）](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightType/spot-light.html)：由一点向一个方向发射锥形光线，类似手电筒或舞台照明灯，多了 `SpotAngle` 属性调整光照范围。
- [环境光（Ambient）](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightType/ambient.html)：均匀照亮场景中所有物体，用于解决模型背光面全黑的问题。由于没有方向，不能产生阴影。属性包括 SkyLightingColor、SkyIllum、GroundLightingColor。

相关文档：[基于物理的光照（PBR）](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/pbr-lighting.html)、[光源类型](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightType/)、[基于多 Pass 的多光源支持](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/additive-per-pixel-lights.html)、[阴影](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/shadow.html)、[光照贴图](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightmap.html)。

---

## 第五章 资源系统

> 官方入口：[asset](https://docs.cocos.com/creator/3.8/manual/zh/asset/)

### 5.1 资源工作流

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-workflow.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-workflow.html)

**导入资源**有三种方式：通过资源管理器面板的创建按钮新建；将资源文件复制到项目资源文件夹后刷新；从操作系统的文件管理器中拖拽文件到资源管理器。

**同步资源**：资源管理器中的资源和操作系统文件管理器中看到的项目资源文件是同步的，移动、重命名和删除会双向同步。

**`.meta` 配置文件**：所有资源文件导入时都会生成一份同名的 `.meta` 后缀配置文件，提供该资源在项目中的唯一标识 **UUID** 以及其他配置信息。对资源的重命名、移动、删除都会由编辑器自动同步对应的 `.meta` 文件，以确保 UUID 等配置信息保持不变，不影响现有引用。在操作系统文件管理器中操作资源时，建议连同 `.meta` 文件一起处理。

**Library 中的资源**：资源导入后会生成一份面向引擎的新数据存放在项目的 Library 文件夹中。当 library 丢失或损坏时，删除整个 library 文件夹再打开项目即可重新生成。

**定位资源**：每个资源有唯一的 uuid 定位，也可以通过 **Database URL**（如 `db://assets/prefabs/fire.prefab`）直观定位。

### 5.2 资源管理注意事项（meta 文件）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/meta.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/meta.html)

Cocos Creator 会为 assets 目录下的每一个文件和目录生成一个同名的 meta 文件。**UUID** 是 Creator 用来管理游戏资源的唯一标识符，引擎不是通过"路径 + 文件名"而是通过 UUID 来引用文件，因此可以在资源管理器中随意删除、移动文件而不破坏引用。

**meta 文件更新时机**：打开项目时、更新资源时（在资源管理器中操作，或从系统文件管理器修改后切回编辑器）都会触发生成缺失的 meta 文件。

**meta 文件出错情况及解决**：

- **UUID 冲突**：通常是在系统文件管理器中误将剪切/粘贴操作成了复制/粘贴并复制了 meta 文件，或多人协作时更新资源遇到相同 UUID。解决：关闭 Creator 后删除其中一个 meta 文件，或通过版本管理工具还原。
- **UUID 变化**：新增资源未生成 meta 文件就提交到版本管理，导致不同开发者生成的 UUID 各不相同。解决：提交前检查是否有新增文件及对应 meta 文件，拉取时检查 meta 文件是否成对，注意不要提交自己误生成的 meta 文件。

### 5.3 常见资源类型

Cocos Creator 中的主要资源类型包括：

- [场景资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/scene.html)
- [图像资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/image.html)（含[纹理贴图](https://docs.cocos.com/creator/3.8/manual/zh/asset/texture.html)、[精灵帧](https://docs.cocos.com/creator/3.8/manual/zh/asset/sprite-frame.html)、[立方体贴图](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/skybox.html)、[图集](https://docs.cocos.com/creator/3.8/manual/zh/asset/atlas.html)、[渲染纹理](https://docs.cocos.com/creator/3.8/manual/zh/asset/render-texture.html)）
- [预制资源（Prefab）](https://docs.cocos.com/creator/3.8/manual/zh/asset/prefab.html)
- [脚本资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/script.html)
- [字体资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/font.html)
- [音频资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/audio.html)
- [材质资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/material.html)
- [模型资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/model/mesh.html)
- [动画资源（动画剪辑）](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-clip.html)
- [Spine 骨骼动画资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/spine.html)
- [DragonBones 骨骼动画资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/dragonbones.html)
- [TiledMap 瓦片图资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/tiledmap.html)
- [JSON 资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/json.html)
- [文本资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/text.html)

#### 图像资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/image.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/image.html)

图像资源是游戏中绝大部分图像渲染的数据源，支持 **JPG**、**PNG**、**BMP**、**TGA**、**HDR**、**WEBBP**、**PSD**、**TIFF** 等格式。将图像资源直接拖拽到资源管理器即可导入。

图像资源的 **Type** 属性支持以下类型：

- **raw**：原始图片类型。
- **texture**：图像资源类型（默认），即 Texture2D 纹理资源。
- **normal map**：法线贴图，常用于渲染 3D 模型，可在模型材质中勾选 `USE NORMAL MAP` 属性使用。
- **sprite-frame**：精灵帧资源，用于 2D/UI 制作。
- **texture cube**：立方贴图，使用在全景图上，常用于制作天空盒。

#### 纹理贴图资源（Texture）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/texture.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/texture.html)

Texture2D 是纹理贴图资源的一种，通常用于 3D 模型的渲染。其属性包括：

- **Anisotropy**：各向异性值。
- **Filter Mode**：过滤模式，包括 Nearest（None）、Bilinear、Bilinear with mipmaps、Trilinear with mipmaps 以及 Advanced。
- **Wrap Mode**：寻址模式，包括 Repeat、Clamp、Mirror 以及 Advanced。
- **Generate Mipmaps**：生成 mipmap（多层纹理），加快 3D 场景渲染速度、减少图像锯齿，但额外占用约三分之一内存。可通过 `texture.setMipRange(minLevel, maxLevel)` 在运行时动态选择 mipmap 范围。

**注意**：在 WebGL1.0 平台，当贴图宽高不是二次幂时，`repeat` 寻址模式无效，运行时会自动切换为 `clamp-to-edge`。

#### 精灵帧资源（SpriteFrame）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/sprite-frame.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/sprite-frame.html)

SpriteFrame 是 UI 渲染基础图形的容器，本身管理图像的裁剪和九宫格信息，默认持有一个与其同级的 Texture2D 资源引用。将图像资源类型设置为 **sprite-frame** 后，Creator 会自动在图像资源下创建 spriteFrame 子资源。

主要属性：Packable（是否参与动态合图及自动图集构建）、Trim Type（裁剪类型：Auto 自动/Custom 自定义/None 无）、Trim Threshold（透明度阈值）、Trim X/Y/Width/Height（自定义裁剪框）、Border（九宫格图边距）。

#### 图集资源（Atlas）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/atlas.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/atlas.html)

图集（Atlas / Sprite Sheet）是通过专门工具将多张图片合并成一张大图，并通过 **plist** 等格式索引的资源。使用图集可以去除图片周围的空白区域、减少包体和内存占用，多个 Sprite 渲染同一图集的图片时可以使用同一个渲染批次，大幅提高运行效率。

推荐的图集制作软件是 [TexturePacker 4.x](https://www.codeandweb.com/texturepacker)，生成时选择 cocos2d-x 格式的 plist 文件。将 **plist** 和 **png** 文件同时拖拽到资源管理器即可生成图集资源，展开后可以看到其中包含很多类型为 SpriteFrame 的子资源。

**注意**：Cocos Creator 3.x 不支持 TexturePacker 4.x 以下的图集格式。

#### 自动图集资源（Auto Atlas）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/auto-atlas.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/auto-atlas.html)

**自动图集**是 Cocos Creator 自带的合图功能，可将指定的一系列碎图打包成一张大图。在资源管理器中点击 **+** 创建按钮，选择 **自动图集配置** 即可新建一个 **auto-atlas.pac** 资源。自动图集以当前文件夹下的所有 SpriteFrame 作为碎图资源，在构建过程中打包成一个大的 Sprite Atlas。

配置项包括最大宽度/高度、间距、允许旋转、输出大小为正方形、Power of Two、算法（MaxRects）、扩边（Extrude）、剔除未使用的图片等。配置完成后可点击 **预览** 查看打包结果。构建项目时才会真正生成图集。

#### 预制资源（Prefab）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/prefab.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/prefab.html)

预制件用于存储一些可以复用的场景对象，可包含节点、组件以及组件上的数据。由预制件生成的实例既可以继承模板的数据，又可以有自己定制化的数据修改。

**创建预制件**有两种方法：将场景中编辑好的节点从层级管理器拖到资源管理器；或点击资源管理器左上方的 **+** 按钮选择 **Node Prefab**。创建完成后原节点自动变为该预制件的实例。

**使用预制件**：将预制件资源从资源管理器拖拽到层级管理器或场景编辑器即可在场景中生成一个预制件实例。实例的数据默认同步预制件资源，对实例的修改存储在该实例中，不会影响资源和其它实例。

**预制件编辑模式**：双击预制件资源进入编辑模式，编辑完成后点击 **保存** 按钮保存，再点击 **关闭** 返回场景编辑模式。

**限制**：不允许在预制件实例中删除从预制件资源中创建的节点、不允许更改从预制件资源中创建的节点的层级关系、不允许预制件嵌套自己。**注意**：请尽量避免多人同时修改同一个 Prefab 资源。

#### 字体资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/font.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/font.html)

游戏中可使用三类字体资源：**系统字体**、**动态字体**（TTF 格式）和 **位图字体**（由 **fnt** 字体文件和 **png** 图片组成）。位图字体可由 Glyph Designer、Hiero、BMFont 等软件生成，导入位图字体时请务必将 fnt 和 png 文件同时拖拽到资源管理器，并需要将 png 文件的类型更改为 **sprite-frame**，否则位图字体无法正常使用。

字体资源通过 **Label 组件** 渲染，可将字体资源拖拽到 Label 组件的 Font 属性中使用，或将字体文件直接拖拽到层级管理器创建自动使用该字体的文字节点。

#### 音频资源（AudioClip）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/audio.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/audio.html)

Cocos Creator 支持导入大多数常见音频文件格式，目前支持 `.ogg`、`.mp3`、`.wav`、`.mp4`、`.m4a` 格式。Creator 通过 **AudioSource 组件** 控制播放不同的音频资源来实现游戏内的背景音乐和音效，详情见 [AudioSource 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audiosource.html)。

#### 材质资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/material.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/material.html)

在资源管理器中右键选择 **创建 -> 材质** 即可创建材质资源。材质控制着每个模型最终的着色，由着色器（Effect）构成。材质资源的主要属性：

- **Effect（着色器）**：当前材质使用的着色器，默认是内置 PBR 着色器 builtin-standard.effect。
- **Technique**：当前着色器中所有的 Technique，每个适用于不同情况。
- **USE INSTANCING**：是否启用动态 Instancing，只在场景中有大量相同模型实例时启用。
- **Pass**：当前 Technique 中所有的 Pass，可分别设置属性和定义。

3D 模型通过网格渲染器组件上的 `Materials` 属性指定材质；2D/UI 渲染组件通过 `Custom Material` 下拉框选择材质；粒子系统通过渲染模块 Renderer 中的 ParticleMaterial 和 TrailMaterial 属性设置。

#### 模型资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/model/mesh.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/model/mesh.html)

Creator 支持 **FBX**（FBX 2020 及更早）和 **glTF**（glTF 2.0 及更早）两种格式的模型文件。模型导入后，可在资源管理器中展开看到 `.material`（材质）、`.mesh`（模型）、`.texture`（贴图）、`.animation`（动画）、`.skeleton`（骨骼）、`.prefab`（自动生成的预制件）等资源。

选中模型资源文件后，属性检查器中有四个标签：**模型（Model）**、**动画（Animation）**、**材质（Material）**、**FBX**。

- **模型（Model）**：设置法线（Normals）、切线（Tangents）的导入方式，以及网格优化（顶点缓存、顶点提取、过度绘制）、网格简化、网格切块、网格压缩、LODS 等选项。
- **动画（Animation）**：查看和编辑模型动画片段，支持添加/删除动画文件并进行帧数裁剪。
- **材质（Material）**：提取材质、设置材质提取目录、使用顶点色、混合模式下的深度写入。
- **FBX**：与 1.x 版本兼容、动画烘焙速率、提升单一根节点、优先使用文件时间范围。

关于 glTF 模型的详细转换关系（场景→预制体、网格→网格、蒙皮→骨骼、材质→材质、贴图→贴图、图像→图像、动画→动画剪辑），见 [glTF 模型](https://docs.cocos.com/creator/3.8/manual/zh/asset/model/glTF.html)。

### 5.4 资源管理（Asset Manager）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-manager.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-manager.html)

**Asset Manager** 是 Creator 在 v2.4 推出的资源管理模块，用于替代之前的 `loader`，具备加载资源、查找资源、销毁资源、缓存资源、Asset Bundle 等功能。所有函数和方法可通过 `assetManager` 访问。

**动态加载资源**有两种方式：将资源放在 `resources` 目录下配合 `resources.load` 等 API 加载；或将资源制作为 Asset Bundle，通过 Bundle 的 `load` 系列 API 加载。所有加载到的资源都会被缓存在 `assetManager` 中。

**预加载**：`assetManager` 和 Asset Bundle 的每一个加载接口都提供对应的预加载版本（`preload` / `preloadDir` / `preloadScene`），预加载只会下载必要资源，不做反序列化和初始化工作，性能消耗更小。

**释放资源**：`assetManager.releaseAsset` 释放单个资源，引擎会自动释放其依赖资源。Creator 还提供引用计数机制（`addRef` / `decRef`）帮助开发者控制资源的引用和释放。

**缓存管理器**：在所有存在文件系统的平台上提供缓存管理器 `assetManager.cacheManager`，支持查询缓存（getCache）、查询临时文件（getTemp）、清除缓存（removeCache / clearCache / clearLRU）等操作。

**可选参数**：`assetManager` 和 Asset Bundle 的部分接口提供 `options` 参数，可配置引擎内置参数或自定义参数，用于扩展引擎加载功能。

**加载管线**：Asset Manager 底层使用 **管线与任务**、**下载与解析** 机制完成资源加载，开发者可以通过 `assetManager.pipeline`、`assetManager.downloader`、`assetManager.parser` 进行扩展。

#### 动态加载资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/dynamic-load-resources.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/dynamic-load-resources.html)

需要动态加载的资源必须放置在 `resources` 文件夹或它的子文件夹下，`resources` 文件夹需要在 assets 根目录下手动创建。加载时传入相对 resources 的路径，路径结尾**不能**包含文件扩展名。

```typescript
// 加载 Prefab
resources.load("test_assets/prefab", Prefab, (err, prefab) => {
    const newNode = instantiate(prefab);
    this.node.addChild(newNode);
});

// 加载 SpriteFrame
resources.load("test_assets/image/spriteFrame", SpriteFrame, (err, spriteFrame) => {
    this.node.getComponent(Sprite).spriteFrame = spriteFrame;
});
```

**注意**：直接加载 `test_assets/image` 得到的是 ImageAsset，必须指定路径到具体的子资源（如 `image/spriteFrame`、`image/texture`）才能加载到对应类型。如果资源仅被 resources 中的其它资源依赖而不需要直接加载，请不要放在 resources 文件夹中。

**加载远程资源和设备资源**：通过 `assetManager.loadRemote` 方法加载远程贴图、音频、文本等原生资源，或加载设备存储内的资源（如相册）。远程加载不支持 SpriteFrame、SpriteAtlas、TiledMap 等资源的直接加载；Web 端远程加载受浏览器的 [CORS 跨域策略](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS) 限制。

#### 资源释放

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/release-manager.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/release-manager.html)

资源之间是互相依赖的，释放资源会销毁资源的所有内部属性并移出缓存，从而释放内存和显存。

- **自动释放**：可在编辑器中勾选场景的 **自动释放资源** 选项，切换场景时自动释放该场景所有依赖资源。所有 `Asset` 实例拥有 `addRef` 和 `decRef` 成员函数，引用计数为零时 Creator 会对资源进行自动释放。
- **释放检查**：自动释放前会进行一系列检查：引用计数为 0 则直接释放；否则进行循环引用检查，通过后才释放。
- **手动释放**：调用 `assetManager.releaseAsset` 接口手动释放资源。`release` 系列接口会直接释放资源，不会进行释放检查。
- **引用计数统计**：Asset Manager 只自动统计资源之间的**静态引用**（编辑器中配置的引用关系），**动态引用**（代码加载并设置到组件上）需要开发者通过 `addRef` / `decRef` 手动控制。

#### Asset Bundle

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/bundle.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/bundle.html)

**Asset Bundle** 是资源模块化工具，允许开发者按照项目需求将贴图、脚本、场景等资源划分在多个 Asset Bundle 中，在运行时按需求加载，减少启动时需要加载的资源数量。

**内置 Asset Bundle**包括 `main`（参与构建的场景及依赖）、`resources`（resources 目录下的资源）、`start-scene`（初始场景分包）、`internal`（引擎内置默认资源）。

**配置方法**：以文件夹为单位，选中资源管理器中的文件夹，在属性检查器中勾选 **配置为 Bundle**，可配置 Bundle 名称、优先级（开放 20 个优先级，构建时按从大到小顺序）、目标平台、压缩类型（合并依赖、无压缩、合并所有 JSON、小游戏分包、Zip）、配置为远程包、Bundle 资源过滤等。

**加载 Asset Bundle**：通过统一的 API `assetManager.loadBundle` 加载，加载时需要传入 Bundle 名称或 url。加载完成后返回 `AssetManager.Bundle` 类的实例，可通过其 `load`、`loadDir`、`loadScene` 方法加载 Bundle 中的资源，通过 `preload` / `preloadDir` 预加载，通过 `release` / `releaseAll` 释放资源，通过 `assetManager.getBundle` 获取已加载的 Bundle，通过 `assetManager.removeBundle` 移除 Bundle。

### 5.5 压缩纹理

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/compress-texture.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/compress-texture.html)

Cocos Creator 可以直接在编辑器中设置纹理需要的压缩方式，在项目发布时自动对纹理进行压缩，支持同一平台同时导出多种图片格式，引擎将根据设备对压缩纹理格式的支持情况加载合适的压缩纹理。

- 对于 png、jpg、webp 等压缩纹理，可在构建时压缩纹理像素数据减少资源体积，提高资源下载速度。
- 对于 astc、etc1、etc2、pvrtc 等 GPU 压缩纹理，可直接在 GPU 内存中使用，无需运行时解压，显著减少内存占用、降低带宽需求。

各平台支持的压缩格式可参考下表（节选）：

| 平台 | 支持的压缩格式 |
| --- | --- |
| Web Mobile | ASTC / ETC1 / ETC2 / PVR / WEBP |
| WeChat Mini Game | ASTC / ETC1 / ETC2 / PVR |
| iOS | ASTC / ETC1 / ETC2 / PVR / WEBP |
| Android / Huawei AGC | ASTC / ETC1 / ETC2 / WEBP |

**配置方法**：在资源管理器中选中图片或自动图集，在属性检查器中勾选 `useCompressTexture`，再在 `presetId` 中选择纹理压缩预设。可通过 **项目设置 -> 压缩纹理** 面板添加/编辑压缩纹理预设。构建时引擎会根据实际构建平台以及图片纹理的透明通道情况对配置的纹理格式做智能剔除和优先级选择。

## 第六章 脚本指南及事件系统

> 官方入口：[scripting](https://docs.cocos.com/creator/3.8/manual/zh/scripting/)

### 6.1 脚本概述与语言支持

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/](https://docs.cocos.com/creator/3.8/manual/zh/scripting/)

Cocos Creator 脚本用于实现用户定义的（游戏）行为，支持 **TypeScript** 和 **JavaScript** 两种编程语言。通过编写脚本组件并将其挂载到场景节点上，即可驱动场景中的物体。在组件脚本中可以通过声明属性，将需要调节的变量映射到属性检查器中，便于策划和美术进行调整；也可以通过注册特定的回调函数，帮助初始化、更新甚至销毁节点。

- **TypeScript**：Cocos Creator 支持 TypeScript 4.1.0，编译时 `tsconfig.json` 不会被读取（每个项目隐含着 target ES2015、module ES2015、isolatedModules、experimentalDecorators 等选项），但可配合 IDE 使用 tsconfig 做类型检查。
- **JavaScript**：支持 ES6 语言规范，并以插件脚本（外部脚本）的形式导入使用。不支持 CommonJS 模块系统，应使用标准模块语法 `import`/`export`。
- **脚本运行环境**：引擎 API 都存在于模块 `cc` 中，使用标准 ES6 模块导入语法导入。`cc` 是保留标识符，不应将 `cc` 用作任何全局对象的名称。

### 6.2 创建脚本

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/setup.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/setup.html)

- 在资源管理器空白位置或文件夹下右键选择 **Create > TypeScript > NewComponent**，或点击左上角 **+** 按钮创建组件脚本。
- 新建的初始脚本默认是一个 `NewComponent` 组件，代码结构如下：

```ts
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('say_hello')
export class say_hello extends Component {
    start() {

    }

    update(deltaTime: number) {

    }
}
```

- **注意**：项目中所有脚本的类名（`@ccclass` 中的名称）不允许重复；脚本文件名称和类名不同，重命名文件不会改变代码中的类名。
- **添加脚本到场景节点**：将脚本拖拽到节点的属性检查器中，或点击 **添加组件** 选择 **自定义脚本**，即为节点添加脚本组件。
- **编辑脚本**：可在 **偏好设置 -> 外部程序** 中设置默认脚本编辑器，双击脚本资源即可用指定程序打开。保存后回到编辑器会自动检测改动并重新编译。
- **脚本模板**：从 v3.3 开始支持在 `.creator/asset-template/typescript` 目录管理自定义脚本模板，支持 `<%UnderscoreCaseClassName%>`、`<%CamelCaseClassName%>`、`<%Author%>`、`<%DateTime%>` 等预定义变量。

### 6.3 配置代码编辑环境（VS Code）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/coding-setup.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/coding-setup.html)

推荐使用 **Visual Studio Code** 作为代码编辑器。Creator 新建项目时会自动生成 `tsconfig.json`，用 VS Code 打开项目编写代码时便会自动提示 Cocos Creator 引擎 API。

- **智能提示数据**：删除引擎 `bin` 目录下的 `cache` 文件夹，并在引擎目录执行 `npm run build-declaration` 可刷新 API 智能提示。
- **设置文件显示和搜索过滤**：通过 VS Code 设置排除 `library/`、`local/`、`temp/`、`build/`、`**/*.meta` 等自动生成的路径。
- **VS Code 工作流**：Creator 在 **开发者 -> VS Code 工作流** 中集成了 **添加编译任务**（通过 cURL 向预览服务器发送请求激活脚本编译）和 **添加 Chrome Debug 配置**（调试网页版游戏）功能。

### 6.4 装饰器（属性和类装饰器）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/decorator.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/decorator.html)

将装饰器 `ccclass` 应用在类上时，此类称为 **cc 类**。cc 类注入了额外的信息以控制序列化、编辑器展示等。未声明 `ccclass` 的组件类无法作为组件添加到节点上。类名不应该以 `cc.`、`internal.` 作为前缀（保留类名前缀）。

**组件类装饰器**：

| 装饰器 | 说明 |
| --- | --- |
| `executeInEditMode` | 允许组件在编辑器模式下运行，默认 false |
| `requireComponent` | 指定当前组件的依赖组件，缺失时引擎自动添加 |
| `executionOrder` | 指定生命周期回调的执行优先级，数值小的先执行 |
| `disallowMultiple` | 同一节点上只允许添加一个同类型（含子类）组件 |
| `menu(path)` | 将组件添加到属性检查器的添加组件菜单中 |
| `help(url)` | 指定组件的帮助文档 URL |

**属性装饰器 `property`**：用于控制编辑器中对属性的序列化和属性检查器中的展示。常用参数包括：

- `type`：指定属性的 cc 类型，基础类型为 CCInteger、CCFloat、CCBoolean、CCString，cc 类型需显式指定，数组类型如 `[Node]`。
- `visible`：是否在属性检查器中显示（属性名以 `_` 开头默认隐藏）。
- `serializable`：是否序列化（默认 true）。
- `override`：子类覆盖父类同名属性时需显式设置。
- `group`：对属性进行分组、排序，支持 tab 和 section 样式。
- `displayName`、`tooltip`、`multiline`、`readonly`、`min`、`max`、`step`、`slide` 等。

常用快捷装饰器：`@type(t)`、`@integer`、`@float`。

### 6.5 生命周期回调

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/life-cycle-callbacks.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/life-cycle-callbacks.html)

Cocos Creator 为组件脚本提供了生命周期回调函数，开发者只需定义特定的回调函数，Creator 就会在特定时期自动执行。按触发先后顺序排列：

- **onLoad**：节点首次激活时触发（场景载入或节点激活），总是会在任何 start 前执行，适合初始化操作。
- **onEnable**：组件 `enabled` 或节点 `active` 从 false 变为 true 时触发；节点第一次创建且 enabled 为 true 时在 onLoad 之后、start 之前调用。
- **start**：组件第一次激活前、第一次执行 update 之前触发，用于初始化中间状态数据。
- **update(deltaTime)**：每帧渲染前执行，用于更新物体的行为、状态和方位。
- **lateUpdate(deltaTime)**：在所有动画更新后执行，适合在动效更新后做额外操作。
- **onDisable**：组件 `enabled` 或节点 `active` 从 true 变为 false 时触发。
- **onDestroy**：组件或节点调用 `destroy()` 后触发，当帧结束时统一回收。

### 6.6 访问节点和组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/access-node-component.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/access-node-component.html)

- **获得组件所在节点**：在组件方法中访问 `this.node`。
- **获得其它组件**：使用 `getComponent` API（可传入组件类或类名字符串），组件和节点上都有此方法；若找不到组件会返回 null，需判断后再访问。
- **利用属性检查器设置节点/组件**：在脚本中声明 type 为 Node 或组件类的属性，即可在属性检查器中拖拽对象赋值。
- **查找子节点**：`this.node.children`、`getChildByName`、`find("path", this.node)`；`find` 只传入第一个参数时从场景根节点开始查找。
- **通过模块访问**：使用 `import` 实现脚本跨文件操作，可导出静态成员共享数据。

### 6.7 常用节点和组件接口

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/basic-node-api.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/basic-node-api.html)

- **激活/关闭节点**：设置 `this.node.active = false/true`。关闭时所有组件及子节点都被禁用；`activeInHierarchy` 表示节点当前是否已激活（取决于父节点）。
- **更改父节点**：`this.node.parent = parentNode;` 或 `removeFromParent()` + `parentNode.addChild(this.node)`。
- **索引子节点**：`this.node.children`、`this.node.children.length`。
- **更改位置**：`setPosition(100, 50, 100)` 或 `this.node.position = new Vec3(...)`。
- **更改旋转**：`setRotation(90, 90, 90)` 或 `setRotationFromEuler(90, 90, 90)`。
- **更改缩放**：`setScale(2, 2, 2)`。
- **组件常用接口**：`this.node`、`this.enabled`、`update(deltaTime)`、`onLoad()`、`start()`。
- **开发注意事项（只读属性）**：`position`、`rotation`、`scale`、`worldPosition`、`worldRotation`、`worldScale`、`eulerAngles`、`worldMatrix` 等是只读属性，不建议直接通过 `add` 等方法修改，应通过中间变量赋值，参考 [只读属性](https://docs.cocos.com/creator/3.8/manual/zh/scripting/readonly.html)。

### 6.8 创建和销毁节点

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/create-destroy.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/create-destroy.html)

- **创建新节点**：`let node = new Node('box');`，创建后不会主动添加到场景，需通过 `director.getScene().addChild(node)` 或设置 `node.parent`。
- **克隆已有节点**：`let node = instantiate(this.target);`。
- **创建预制节点**：设置 Prefab 资源属性后通过 `instantiate(prefab)` 生成节点。
- **销毁节点**：`node.destroy()`，销毁不会立刻执行，在当前帧逻辑更新结束后统一执行；可通过 `isValid` 判断节点是否已销毁。
- **destroy 与 removeFromParent 的区别**：调用 `removeFromParent` 后不会从内存释放，可能导致内存泄漏。**如果一个节点不再使用，请直接调用 `destroy`**。

### 6.9 使用计时器（组件调度）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/scheduler.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/scheduler.html)

Cocos Creator 为组件提供了方便的计时器，比 `setTimeout` 和 `setInterval` 更强大灵活且与组件结合更好：

- `this.schedule(callback, interval)`：每隔 interval 秒执行一次。
- `this.schedule(callback, interval, repeat, delay)`：delay 秒后开始计时，每 interval 秒执行一次，重复 repeat+1 次。
- `this.scheduleOnce(callback, delay)`：只执行一次。
- `this.unschedule(callback)` / `this.unscheduleAllCallbacks()`：取消计时器。

**注意**：组件的计时器回调会将 `this` 指定为组件本身；`Node` 不包含计时器相关 API；如需每帧执行请直接在组件中添加 `update` 函数。

### 6.10 组件和组件执行顺序

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/component.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/component.html)

所有继承自 `Component` 的类都称为组件类，组件类必须是 cc 类。组件不能由构造函数创建，必须由节点创建：`node.addComponent(MyComponent)`；不再需要时调用 `node.removeComponent(myComponent)` 移除并销毁。

控制组件执行顺序的几种方式：

- 使用统一的控制脚本来初始化其他脚本（在 `Game.ts` 的 `onLoad` 中调用各脚本的 `init` 方法）。
- 在 `update` 中用自定义方法控制更新顺序。
- 控制同一个节点上的组件顺序：通过属性检查器中组件的排列顺序（Move Up / Move Down）控制。
- 设置 `executionOrder` 装饰器：数值越小越先执行，只对 onLoad、onEnable、start、update、lateUpdate 有效。

### 6.11 获取和加载资源

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/load-assets.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/load-assets.html)

所有继承自 `Asset` 的类型都统称资源，如 Texture2D、SpriteFrame、AnimationClip、Prefab 等。它们的加载是统一且自动化的，相互依赖的资源能够被自动预加载。

- **资源属性的声明**：在脚本中通过 `@property({ type: SpriteFrame })` 声明资源属性，即可在属性检查器中直接设置资源。
- **动态加载**：详见 [动态加载资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/dynamic-load-resources.html)。

### 6.12 脚本进阶（继承与实例化）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/reference-class.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/reference-class.html)

- **实例化**：通过 `new` 直接创建对象实例；实例方法在原型对象中声明。
- **判断类型**：使用 TypeScript 原生的 `instanceof`。
- **静态变量和方法**：用 `static` 声明；静态成员会被子类继承（浅拷贝）。
- **继承**：不论子类是否有定义构造函数，父类构造函数都会在子类实例化前自动调用；所有成员方法都是虚方法，子类可直接重写。
- **get/set 方法**：在属性中定义 get/set 可在访问属性时触发；定义了 get 方法的属性本身是只读的，且不能被序列化。

### 6.13 事件系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/event/](https://docs.cocos.com/creator/3.8/manual/zh/engine/event/)

事件系统用于将输入行为（键盘、鼠标、触摸）以事件形式发送到应用程序，也可将游戏过程中需要其他对象关注的事情通过事件回应（如游戏胜利后打开结算界面）。

#### 监听和发射事件（EventTarget）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-emit.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-emit.html)

引擎提供 `EventTarget` 类实现自定义事件的监听和发射，使用时需要实例化一个 EventTarget 对象。**注意**：虽然 Node 也实现了 EventTarget 接口，但不推荐通过 Node 对象做自定义事件的监听和发射。

- **监听事件**：`eventTarget.on(type, func, target?)`；`once` 监听在响应后自动关闭。
- **取消监听**：`eventTarget.off(type, func, target)`，参数需与 on 一一对应。
- **事件发射**：`eventTarget.emit(type, ...args)`，最多支持 5 个事件参数。

#### 输入事件系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-input.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-input.html)

全局输入事件与节点树无关，由 `input` 对象统一派发（v3.4.0 起 `systemEvent` 对象已废弃）。支持的事件类型包括：

| 输入事件 | type 类型 |
| --- | --- |
| 鼠标事件 | MOUSE_DOWN、MOUSE_MOVE、MOUSE_UP、MOUSE_WHEEL |
| 触摸事件 | TOUCH_START、TOUCH_MOVE、TOUCH_END、TOUCH_CANCEL |
| 键盘事件 | KEY_DOWN、KEY_PRESSING、KEY_UP |
| 设备重力传感事件 | DEVICEMOTION |

使用示例：

```ts
import { _decorator, Component, input, Input, EventTouch } from 'cc';
const { ccclass } = _decorator;

@ccclass("Example")
export class Example extends Component {
    onLoad () {
        input.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    onDestroy () {
        input.off(Input.EventType.TOUCH_START, this.onTouchStart, this);
    }
    onTouchStart(event: EventTouch) {
        console.log(event.getLocation()); // Location on screen space
    }
}
```

3D 物体的触摸检测需要通过射线检测实现：通过渲染 3D 物体的 Camera 到触点的屏幕坐标生成射线，判断射线是否穿过目标对象。

#### 节点事件系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-node.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-node.html)

`Node` 实现了 EventTarget 接口，提供与 UI 节点树相关的鼠标和触摸事件，使用 `node.on(Node.EventType.XXX, callback, this)` 注册。2D UI 节点的触摸事件监听依赖于 `UITransform` 组件。

**鼠标事件**：MOUSE_DOWN、MOUSE_ENTER、MOUSE_MOVE、MOUSE_LEAVE、MOUSE_UP、MOUSE_WHEEL（PC 端触发）。

**触摸事件**：TOUCH_START、TOUCH_MOVE、TOUCH_END、TOUCH_CANCEL（移动端和 PC 端都会触发，支持多点触摸）。

**节点事件派发**：通过 `node.dispatchEvent()` 派发的事件会经历 **捕获 -> 目标 -> 冒泡** 三个阶段，可通过 `event.propagationStopped = true` 中断传递。v3.0 移除了 Event.EventCustom 类，派发自定义事件需继承 Event 类。若需注册在捕获阶段，给 `on` 接口传第四个参数 `true`。

**触摸事件的传递**：
- 触摸事件支持节点树冒泡，子节点 C 的触摸事件会传递给父节点 B、A。
- 同级节点间触点归属于顶层的节点；v3.4.0 起可通过 `event.preventSwallow = true` 阻止事件被吞噬实现穿透派发。
- 不同 Canvas 之间的触点拦截根据 Canvas 默认自带 Camera 节点的 `priority` 属性决定。
- 节点带有 Button、Toggle 或 BlockInputEvents 组件时会停止事件冒泡（事件拦截）。

**Node 的其它事件**：3D 节点事件 TRANSFORM_CHANGED（变换属性修改）；2D 节点事件 SIZE_CHANGED、ANCHOR_CHANGED、COLOR_CHANGED、CHILD_ADDED、CHILD_REMOVED、PARENT_CHANGED、NODE_DESTROYED 等。

#### 屏幕事件系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-screen.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/event/event-screen.html)

v3.8.0 引入了 `screen` 对象（实现 EventTarget 接口）用于注册全局系统屏幕事件：`window-resize`（窗口大小变化）、`orientation-change`（屏幕方向变化）、`fullscreen-change`（全屏变化）。

### 6.14 模块规范与导入映射

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/](https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/)

所有代码文件大致分为 **插件脚本** 和 **模块** 两种。模块是 TypeScript/JavaScript 代码的一种组织方式，除插件脚本外所有代码都以模块形式组织，包括项目代码、[引擎模块](https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/engine.html)（`'cc'` 模块）和第三方 npm 模块。

Cocos Creator 原生支持并推荐使用 **ECMAScript 模块（ESM）**格式，也支持 CommonJS 模块格式。支持相对说明符、绝对说明符（如 `db://assets/...`）和裸说明符（应用 [导入映射](https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/import-map.html) 和 Node.js 模块解析算法）。

从 v3.3 开始实验性支持 [导入映射（Import maps）](https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/import-map.html)，可在 **项目设置 -> 脚本** 中指定导入映射文件路径，实现别名映射和目录映射。

使用 npm 模块：在项目根目录执行 `npm install --save 包名`，将 `package.json` 和 `package-lock.json` 纳入版本控制，`node_modules` 目录一般不纳入版本控制。案例见 [外部模块使用案例](https://docs.cocos.com/creator/3.8/manual/zh/scripting/modules/example.html)。

### 6.15 插件脚本（外部脚本）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/scripting/external-scripts.html](https://docs.cocos.com/creator/3.8/manual/zh/scripting/external-scripts.html)

当脚本资源在属性检查器中设置了 **导入为插件**，该脚本便称为 **插件脚本**（目前仅支持 JavaScript）。插件脚本通常用于引入第三方库，Creator 不会修改其内容，但会屏蔽全局变量 `module`、`exports`、`define`。

导入选项包括：**全局变量别名**（模拟 window、global、self 等）、**执行环境**（允许 Web 平台加载、允许编辑器加载、允许 Native 平台加载、允许小游戏平台加载）和 **执行顺序**（从 3.8.3 起可在项目设置中指定插件脚本优先级）。

**注意**：Cocos Creator 3.x 推荐使用模块代替插件脚本；插件脚本几乎原封不动拷贝到构建目录，可用性与跨平台性不受 Creator 保障（如依赖 DOM API 的插件无法发布到原生平台）；插件脚本与非插件脚本无法以导入形式交互。

---

## 第七章 图形渲染

> 官方入口：[module-map/graphics](https://docs.cocos.com/creator/3.8/manual/zh/module-map/graphics.html)

### 7.1 图形渲染模块总览

Cocos Creator 提供了丰富的图形功能，包括：

- [渲染管线](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/overview.html)
- [相机](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/camera-component.html)
- [光照和阴影](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light.html)
- [网格](https://docs.cocos.com/creator/3.8/manual/zh/module-map/mesh/)
- [纹理](https://docs.cocos.com/creator/3.8/manual/zh/module-map/texture/)
- [材质](https://docs.cocos.com/creator/3.8/manual/zh/material-system/overview.html)
- [着色器](https://docs.cocos.com/creator/3.8/manual/zh/shader/)
- [2D 渲染排序](https://docs.cocos.com/creator/3.8/manual/zh/engine/rendering/sorting-2d.html)
- [3D 渲染排序](https://docs.cocos.com/creator/3.8/manual/zh/engine/rendering/sorting.html)
- [粒子](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/overview.html)
- [天空盒](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/skybox.html)
- [全局雾](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/fog.html)

### 7.2 渲染管线

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/overview.html](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/overview.html)

RenderPipeline 用于控制场景的渲染流程，包括光照管理、物体剔除、渲染物体排序、渲染目标切换等。Cocos Creator 3.8.4 之后拥有两套渲染管线：

- **新渲染管线（CRP - Customizable Render Pipeline）**：3.8.4 推出，引擎内置管线基于 CRP 管线构建，开发者能够在不修改引擎源码的情况下编写全平台兼容的渲染流程，通过 RenderGraph 渲染架构复用、增加渲染流程。相关文档：[使用内置渲染管线](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/use-builtin-pipeline.html)、[使用后期效果](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/use-post-process.html)、[编写渲染管线](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/write-render-pipeline.html)。
- **旧渲染管线**：从 3.0 开始，内置前向渲染、延迟渲染，不支持自定义渲染流程和后期效果。**会在下一个大版本移除，推荐新项目使用新渲染管线**。

**兼容机制**：3.8.4+ 新建项目默认使用新管线；旧项目未使用自定义管线则在升级后使用原渲染管线；旧项目使用了自定义管线则在升级后使用新渲染管线。

#### 内置渲染管线（新管线）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/use-builtin-pipeline.html](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/use-builtin-pipeline.html)

在 **项目设置 -> 图形设置** 中选择新渲染管线，默认的渲染管线为内置渲染管线 **Builtin**。支持前向渲染、多重采样抗锯齿（MSAA）、实时阴影、后处理（Bloom、Color Grading、FXAA、FSR 等）。可为每个摄像机节点添加 `BuiltinPipelineSettings` 组件控制渲染输出行为和后期效果。

#### 内置渲染管线（旧管线）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/builtin-pipeline.html](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/builtin-pipeline.html)

旧版内置渲染管线包括 **builtin-forward**（前向渲染管线，引擎默认）和 **builtin-deferred**（延迟渲染管线），通过 **项目 -> 项目设置 -> 项目数据 -> 渲染管线** 设置。

- **前向渲染管线**：包含 ShadowFlow（预先绘制阴影贴图）和 ForwardFlow（按 非透明 -> 光照 -> 透明 -> UI 顺序绘制）两个阶段。目前场景只支持一个平行光，最大光照数量 16。
- **延迟渲染管线**：包含 ShadowFlow 和 MainFlow（GBufferStage、LightingStage、BloomStage、PostProcessStage）。依赖 GPU 的 Multiple Render Targets 特性；对卡通材质（如 builtin-toon）无法正常绘制。

### 7.3 模型组件（MeshRenderer）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/renderable/model-component.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/renderable/model-component.html)

MeshRenderer（网格渲染器）组件用于显示静态 3D 模型，通过 **Mesh** 属性设置模型网格，通过 **Materials** 属性控制显示外观（多个子网格对应材质数组）。

**动态阴影配置**：Shadow Bias（阴影偏移）、Shadow Normal Bias（阴影法线偏移）、Shadow Casting Mode（是否投射阴影）、Receive Shadow（是否接收阴影，仅 ShadowMap 类型生效）。

**烘焙配置**：光照贴图（Bakeable、Cast Shadow、Receive Shadow、Lightmap Size）、光照探针（Use Light Probe、Bake To Light Probe）、反射探针（Reflection Probe：PLANNAR_REFLECTION、CUBE_REFLECTION、BLEND_PROBES、BLEND_PROBES_AND_SKYBOX）。

**静态合批**：运行时静态合批，通过 `BatchingUtility.batchStaticModel` 合并节点下所有 MeshRenderer 的 Mesh。要求子节点只含 MeshRenderer、顶点数据结构一致、材质相同。

**动态合批**：提供 instancing 动态合批功能，在材质中勾选 `USE_INSTANCING` 即可开启。合批限制：透明模型绘制顺序无法保证、带非均一缩放模型法线不准确、只支持普通 3D 模型和预烘焙骨骼动画控制的蒙皮模型。合并 VB 合批功能在 3.6.2 已移除。

**合批最佳实践**：静态合批 > instancing 合批。

### 7.4 材质与着色器（Cocos Shader）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/shader/](https://docs.cocos.com/creator/3.8/manual/zh/shader/)

Cocos Creator 基于 GLSL 封装了一套着色器 —— **Cocos Shader**，用于书写基于顶点（Vertex）和片元（Fragment）的代码片段。

主要目录：

- [创建与使用](https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-inspector.html)
- [内置着色器](https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-builtin.html)：基于物理的光照模型 [PBR](https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-builtin-pbr.html)、[卡通渲染](https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-builtin-toon.html)、[无光照](https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-builtin-unlit.html)
- [着色器语法](https://docs.cocos.com/creator/3.8/manual/zh/shader/effect-syntax.html)
- [表面着色器 - Surface Shader](https://docs.cocos.com/creator/3.8/manual/zh/shader/surface-shader.html)
- [传统着色器 - Legacy Shader](https://docs.cocos.com/creator/3.8/manual/zh/shader/legacy-shader/legacy-shader.html)
- [自定义着色器](https://docs.cocos.com/creator/3.8/manual/zh/shader/write-effect-overview.html)
- [内置全局 Uniform](https://docs.cocos.com/creator/3.8/manual/zh/shader/uniform.html)
- [公共函数库](https://docs.cocos.com/creator/3.8/manual/zh/shader/common-functions.html)
- [VSCode 着色器插件](https://docs.cocos.com/creator/3.8/manual/zh/shader/vscode-plugin.html)

材质系统入口见 [材质系统概述](https://docs.cocos.com/creator/3.8/manual/zh/material-system/overview.html)。

### 7.5 后处理（Post Process）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/post-process/](https://docs.cocos.com/creator/3.8/manual/zh/render-pipeline/post-process/)

全屏特效后处理是指在相机绘制完成整个画面后，对画面再次进行一次或多次图像处理。Cocos Creator 在 v3.8 新增了全屏特效后处理流程，内置了一系列常用效果。

**使用步骤**：开启自定义管线并切换至前向渲染管线 → 创建空节点并添加 PostProcess 组件（会自动挂载）→ 选择后效组件 → 设置相机（需勾选 **Use Post Process**）。

**内置后效**包括：

- **TAA（时间性抗锯齿）**：将历史帧数据混合到缓冲区使画面更平滑，性能消耗较大，推荐中高端机型使用。
- **FSR（AMD FidelityFX Super Resolution）**：从低分辨率输入产生高分辨率渲染结果，性能大幅提升。
- **FXAA（快速近似抗锯齿）**：以极低代价降低场景中的锯齿。
- **Bloom**：在场景高亮区形成泛光和光晕，让光源或强烈反射材质更真实。
- **Color Grading**：使用颜色查找表（LUT）对场景颜色做美术向校正。
- **HBAO（基于地平线的环境光遮蔽）**：计算全局照明中的环境光遮蔽，提升场景层次感。

### 7.6 光照贴图（烘焙）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightmap.html](https://docs.cocos.com/creator/3.8/manual/zh/concepts/scene/light/lightmap.html)

烘焙系统会对光源稳定的静态物体所受到的光照和阴影等进行预先计算，结果存放在一张 **光照贴图** 中，运行时自动处理使用。在光源固定的场景中使用光照贴图代替实时光照计算，可减少资源消耗、提高运行效率。

通过编辑器菜单栏的 **项目 -> 光照贴图** 打开光照贴图面板，包括 **Scene**（配置参数：MSAA、Resolution、Gamma、GIScale、GISamples、AOLevel、AOStrength、AORadius、AOColor）和 **Baked**（展示生成的光照贴图及信息）两个页面。

**生成步骤**：选中光源节点设置 StaticSettings（EditorOnly、CastShadow）→ 选中模型节点在 Light Map Settings 中勾选 Bakeable → 点击 **生成光照贴图** 按钮并指定存放文件夹（必须在 assets 目录下）。模型资源需包含额外的光照贴图 UV，且光照贴图 UV 不能重叠。

### 7.7 渲染排序（3D）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/rendering/sorting.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/rendering/sorting.html)

对于半透明物体等特殊情况，可使用 **渲染排序组件（Sorting）** 手动排序。该组件只对持有 **MeshRenderer** 和 **SpriteRenderer** 组件的节点生效。属性包括 Sorting Layer（排序图层，需在项目设置中配置）和 Sorting Order（相同图层内的排序优先级）。

```ts
import { _decorator, Component, Sorting, SortingLayers } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('SortingSample')
export class SortingSample extends Component {
  @property(Sorting)
  sorting: Sorting | null = null;

  start() {
    this.sorting.sortingLayer = SortingLayers.getLayerIndexByName("Sorting Layer 1");
    this.sorting.sortingOrder = 1;
  }
}
```

### 7.8 动态合图（Dynamic Atlas）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/dynamic-atlas.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/dynamic-atlas.html)

动态合图功能能在项目运行时动态地将贴图合并到一张大贴图中，从而将相邻的 DrawCall 合并为一个（合批）。当禁用 `CLEANUP_IMAGE_CACHE` 参数时动态合图默认开启；小游戏和原生平台默认禁用（占用额外内存）。

- **强制开启**：`macro.CLEANUP_IMAGE_CACHE = false; DynamicAtlasManager.instance.enabled = true;`（写在脚本最外层）。
- **强制禁用**：`dynamicAtlasManager.enabled = false;`。
- **贴图限制**：默认只有宽高都小于 512 的贴图才能进入动态合图，可通过 `dynamicAtlasManager.maxFrameSize = 512` 修改。

---

## 第八章 2D 渲染

> 官方入口：[2d-object/2d-render](https://docs.cocos.com/creator/3.8/manual/zh/2d-object/2d-render/)

### 8.1 2D 渲染对象

引擎中所有不拥有 model 的渲染对象都为 2D 渲染对象。与 3D 对象不同，2D 对象本身不拥有 model 信息，其顶点信息由 UITransform 组件的 Rect 信息持有并由引擎创建。2D 渲染对象需要为 RenderRoot 节点（带有 RenderRoot2D/Canvas 组件的节点）的子节点才能完成数据收集操作。

**2D 渲染对象的渲染要求**：

1. 自身带有 UITransform 组件。
2. 需要为带有 RenderRoot2D/Canvas 组件节点的子节点。

**可见性说明**：2D 渲染对象在 Camera 的可见性判断上和 3D 渲染节点并无区别，需自己控制节点的 layer 属性并设置 Camera 的 Visibility 来配合分组渲染。

### 8.2 2D 渲染组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/render-component.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/render-component.html)

本身拥有渲染能力的组件称为 2D 渲染组件，包括：

- [Sprite 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/sprite.html)
- [Label 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/label.html)
- [Mask 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/mask.html)
- [Graphics 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html)
- [RichText 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/richtext.html)
- [UIStaticBatch 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/ui-static.html)
- [TiledMap 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/tiledmap.html)
- [TiledTile 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/tiledtile.html)
- [Spine（骨骼动画）Skeleton 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/spine.html)
- [DragonBones（龙骨）ArmatureDisplay 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/dragonbones.html)
- [MotionStreak 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/motion-streak.html)

**注意**：每个节点上只能添加一个渲染组件，重复添加会导致报错。

### 8.3 Sprite 精灵组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/sprite.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/sprite.html)

Sprite（精灵）是 2D/3D 游戏最常见的显示图像方式，通过 **添加组件 -> 2D/Sprite** 添加。

**主要属性**：

| 属性 | 功能说明 |
| --- | --- |
| Type | 渲染模式：普通（Simple）、九宫格（Sliced）、平铺（Tiled）、填充（Filled） |
| CustomMaterial | 自定义材质 |
| Grayscale | 灰度模式 |
| Color | 图片颜色 |
| Sprite Atlas / Sprite Frame | 图集资源 / 渲染使用的精灵帧资源 |
| Size Mode | Trimmed（裁剪透明像素后尺寸）、Raw（未裁剪）、Custom（自定义） |
| Trim | 是否渲染原始图像周围的透明像素区域 |

**填充模式（Filled）**：Fill Type 支持 HORIZONTAL（横向）、VERTICAL（纵向）、RADIAL（扇形）三种，常用于进度条的动态展示。

### 8.4 Label 文本组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/label.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/label.html)

Label 组件用来显示一段文字，文字可以是系统字体、TrueType 字体、BMFont 字体或艺术数字，并具有排版功能。

**主要属性**：Color、String、HorizontalAlign（水平对齐）、VerticalAlign（垂直对齐）、FontSize、FontFamily、LineHeight、Overflow（排版方式）、EnableWrapText、Font、UseSystemFont、CacheMode（文本缓存类型）、IsBold、IsItalic、IsUnderline。

**排版方式（Overflow）**：

- **CLAMP**：文字尺寸不随 Content Size 缩放，超出部分不显示。
- **SHRINK**：文字尺寸随 Content Size 自动缩放（不会放大）。
- **RESIZE_HEIGHT**：Content Size 随文字排版适配，高度由内部算法自动计算。

**文本缓存类型（Cache Mode）**：

- **NONE**：整段文本生成一张位图（默认）。
- **BITMAP**：整段文本生成位图并尽量参与动态合图，只能用于文本不常更新的 Label。
- **CHAR**：以"字"为单位将文本缓存到全局共享位图中（类似 BMFont），支持频繁修改，但只能用于字体样式和字号固定的 Label，Overflow 不支持 SHRINK，不能参与动态合图，暂不支持粗体/斜体/下划线。

### 8.5 Mask 遮罩组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/mask.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/mask.html)

Mask 用于规定子节点可渲染的范围，所有子节点都会依据遮罩裁剪，范围外的不会渲染。**注意该组件不能添加到有其他渲染组件（如 Sprite、Label 等）的节点上**。

Type 支持四种遮罩类型：**RECT**（矩形遮罩）、**ELLIPSE**（椭圆遮罩）、**GRAPHICS_STENCIL**（自定义图形遮罩）、**SPRITE_STENCIL**（自定义图片遮罩）。添加 Mask 后会自动添加 Graphics 组件（SPRITE_STENCIL 时会添加 Sprite 组件），请勿删除。

### 8.6 Graphics 绘图组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/graphics.html)

Graphics 组件提供一系列绘画接口（参考 Canvas 绘画接口实现），包括路径绘制方法：moveTo、lineTo、bezierCurveTo、quadraticCurveTo、arc、ellipse、circle、rect、close、stroke、fill、clear。属性包括 LineWidth、LineJoin、LineCap、StrokeColor、FillColor、MiterLimit 等。

### 8.7 2D 粒子系统（ParticleSystem2D）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/2d-particle/2d-particle.html](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/2d-particle/2d-particle.html)

2D 粒子组件（ParticleSystem2D）用于读取粒子资源数据，并对其进行播放、暂停、销毁等操作。粒子资源支持 `plist` 文件和图片。

主要属性：File（Plist 格式的粒子配置文件）、Custom（自定义粒子属性）、SpriteFrame（自定义粒子贴图）、Duration、EmissionRate、Life、TotalParticle、StartColor、EndColor、Angle、StartSize、EndSize、StartSpin、EndSpin、PosVar、PositionType（FREE/RELATIVE/GROUPED）、EmitterMode（GRAVITY/RADIUS）等。

### 8.8 TiledMap 组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/components/tiledmap.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/components/tiledmap.html)

TiledMap（地图）用于在游戏中显示 TMX 格式的地图。属性包括 Tmx Asset（指定 `.tmx` 格式的地图资源，需将 `.tmx` 和 `.tsx` 放置于同一文件夹）和 EnableCulling（是否启用裁剪）。

添加 Tmx Asset 后会自动添加与地图中 Layer 对应的节点（带 TiledLayer 组件），请勿删除。TiledLayer 组件可将添加到地图层的节点坐标转化为地图块行列坐标，实现节点与地图层相互遮挡。

### 8.9 2D 渲染排序（Sorting2D）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/engine/rendering/sorting-2d.html](https://docs.cocos.com/creator/3.8/manual/zh/engine/rendering/sorting-2d.html)

使用 Sorting2D 组件可以在不影响节点原有层级关系时自定义 2D 渲染对象的渲染顺序，可用于解决相邻渲染对象使用不同材质导致的 DrawCall 增加问题。属性包括 sortingLayer（排序层级）和 sortingOrder（排序层级下的顺序）。

---

## 第九章 UI 系统

> 官方入口：[2d-object/ui-system](https://docs.cocos.com/creator/3.8/manual/zh/2d-object/ui-system/)

### 9.1 UI 系统总览

Cocos Creator 提供了强大而灵活的 UI（用户界面）系统，通过组合不同 UI 组件来生产能够适配多种分辨率屏幕、通过数据动态生成和更新显示内容、支持多种排版布局方式的 UI 界面。

**UI 入门要点**：

- 界定 UI 和 2D 渲染对象的区别主要在于 **适配和交互**，所有的 UI 需要在 **Canvas 节点** 下，以做出适配行为。Canvas 组件本身继承自 RenderRoot2D 组件，是数据收集的入口。
- 开始制作 UI 时，首先需确定设计内容显示区域大小（**设计分辨率**），在 **项目 -> 项目设置 -> 项目数据** 面板中设置。
- 可在层级管理器点击左上 **+** 按钮选择 **UI Component -> Canvas** 创建 Canvas 节点。**注意**：Canvas 节点不应该嵌套在另一个 Canvas 节点或其子节点下；Canvas 组件并非和 camera 一一对应，渲染与否取决于 node 的 layer 和 camera 的 Visibility。
- 必要的 UI 元素：Sprite（精灵图）、Label（文字）、Mask（遮罩）、Layout（布局）、Widget（对齐）。

### 9.2 多分辨率适配方案

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/multi-resolution.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/multi-resolution.html)

Cocos Creator 沿用一套资源适配多种分辨率屏幕的方案，通过 **Canvas**（画布）、**Widget**（对齐挂件）、**Label**（文字）和 **Sliced Sprite**（九宫格精灵图）完成多分辨率适配。

**适配模式**：

1. 设计分辨率和屏幕分辨率宽高比相同：直接放大适配。
2. 设计宽高比 > 屏幕：使用 **适配高度（Fit Height）** 模式，屏幕两边裁剪部分背景但无黑边。
3. 设计宽高比 < 屏幕：使用 **适配宽度（Fit Width）** 模式，裁剪上下部分背景。
4. 完整显示所有内容允许黑边：同时开启适配高度和适配宽度，可能出现黑边或穿帮。
5. 根据宽高比自动选择：不开启任何适配模式时自动判断。

设计分辨率和适配方案通过 **项目 -> 项目设置 -> 项目数据** 统一配置。

### 9.3 对齐策略（Widget）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/widget-align.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/widget-align.html)

通过 **Widget（对齐挂件）** 实现 UI 元素对屏幕边界的智能感知：

- **贴边对齐**：在元素节点上添加 Widget 组件，开启 Left/Bottom 等对齐并设置边距。
- **嵌套对齐**：Widget 默认对齐参照物是父节点，可以添加不同节点层级，每级节点都使用自动对齐。
- **自动缩放**：同时勾选相反方向（如 Left 和 Right）时，Widget 获得根据对齐需要修改节点尺寸的能力。
- **百分比对齐**：可输入百分比数值，以父节点相应轴向宽/高乘以百分比计算边距。
- **运行时优化**：属性 `alignOnce` 确保 Widget 只在初始化时执行对齐定位；AlignMode 设为 ONCE 或 ON_WINDOW_RESIZE 可避免每帧重复定位，提高运行性能。

### 9.4 Widget 组件参考

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/widget.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/widget.html)

Widget（对齐挂件）使当前节点自动对齐到父物体任意位置或约束尺寸，方便适配不同分辨率。主要选项：Top、Bottom、Left、Right、HorizontalCenter、VerticalCenter、Target（对齐目标，默认父级节点）、AlignMode（ALWAYS 每帧对齐 / ONCE 仅初始化对齐 / ON_WINDOW_RESIZE 窗口变动时更新）。

通过脚本代码修改对齐距离：

```ts
const widget = this.getComponent(Widget);
widget.bottom = 50;
widget.top = 50;
widget.isAbsoluteTop = false;
widget.isAbsoluteBottom = false;
widget.bottom = 0.1; // 10%
widget.top = 0.1; // 10%
```

### 9.5 Layout 布局组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/layout.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/layout.html)

Layout 是一种容器组件，开启自动布局功能，自动按规范排列所有子物体，方便制作列表、翻页等功能。

**主要属性**：

| 属性 | 功能说明 |
| --- | --- |
| Type | 布局类型：NONE、HORIZONTAL、VERTICAL、GRID |
| ResizeMode | 缩放模式：NONE、CHILDREN（子物体随容器变化）、CONTAINER（容器随子物体变化） |
| PaddingLeft/Right/Top/Bottom | 子物体相对容器边框距离 |
| SpacingX / SpacingY | 子物体间水平/垂直间距 |
| HorizontalDirection / VerticalDirection | 排版起始方向 |
| CellSize | 仅 GRID 布局 + CHILDREN 缩放模式存在，网格元素大小 |
| StartAxis | 仅 GRID 布局存在，网格元素排版起始方向轴 |
| Constraint | 布局约束：NONE、FIXED_ROW（固定行数）、FIXED_COL（固定列数） |

**注意**：Layout 设置结果要到下一帧才更新，除非设置后手动调用 `updateLayout` API。

### 9.6 渲染排序规则

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/priority.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/priority.html)

- **2D 渲染节点排序**：在 Canvas 下的节点参考 UI 节点排序；不在 Canvas 下的节点可通过自定义材质开启深度检测实现与 3D 物体的遮挡显示。
- **UI 节点排序**：UI 节点的混合严格按照节点树排序，采用深度优先排序方式，可通过设置节点的 `siblingIndex` 改变渲染顺序。子节点永远遮盖父节点。
- **注意事项**：遇到 UI 渲染出错、花屏、闪屏等现象时，首先检查场景里所有相机的 ClearFlag，确保**场景里必须有一个相机执行 Solid_Color 清屏操作**。

### 9.7 UI 合批

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/ui-batch.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/ui-batch.html)

**合批条件**：节点的 Layer 相同；使用的材质相同（Creator 使用材质实例化机制，设置材质 uniform 后材质会实例化，实例化后无法合批）；渲染组件材质 BlendState 和 DepthStencilState 属性设置相同；渲染组件顶点信息在同一个 buffer 上传；贴图源及贴图采样相同。

**无法合批的组件**：Mask、Graphics 和 UIMeshRenderer；TiledMap、Spine 和 DragonBones（遵循自己的内部合批机制）。Sprite 和 Label 可通过静态合图、动态合图和 Bitmap 缓存方法实现合批。

### 9.8 UITransform 组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/ui-transform.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/ui-transform.html)

UITransform 定义了 UI 上的矩形信息，包括矩形的尺寸（ContentSize）和锚点位置（AnchorPoint），一般用于渲染、点击事件计算、界面布局及屏幕适配。`priority` 属性在 v3.1 中弃用，可通过 `setSiblingIndex` 设置节点树顺序调整渲染顺序。

### 9.9 Canvas 组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/canvas.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/canvas.html)

**Canvas** 组件继承自 **RenderRoot2D**，是 2D 渲染组件数据收集的入口。场景中 Canvas 节点可以有多个，所有 2D 渲染元素都必须作为 RenderRoot2D 的子节点才能被渲染。Canvas 还是屏幕适配的重要组件，设计分辨率和适配方案统一通过项目设置配置。

Canvas 属性：CameraComponent（Canvas 关联的相机）、AlignCanvasWithScreen（Canvas 关联的相机是否要与 Canvas 对齐）。

### 9.10 Button 按钮组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/button.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/button.html)

Button 组件响应用户点击操作，点击时自身有状态变化，还可让用户在完成点击后响应自定义行为。

**主要属性**：Target（发生 Transition 时相应修改 Target 节点的 SpriteFrame、颜色或 Scale）、Interactable（false 时进入禁用状态）、Transition（NONE、COLOR、SPRITE、SCALE 四种状态表现）、Click Event（点击事件列表）。

**点击事件结构**：每个事件由 Target（节点引用）、Component（组件名称）、Handler（回调函数）和 CustomEventData（自定义字符串参数）组成。Button 只支持 Click 事件，用户点击并释放时才触发回调。

### 9.11 其他常用 UI 组件

| 组件 | 官方链接 | 说明 |
| --- | --- | --- |
| RichText 富文本 | [richtext](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/richtext.html) | 通过 BBCode 标签设置样式：color、size、outline、b、i、u、br、img、on，支持嵌套 |
| EditBox 输入框 | [editbox](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/editbox.html) | 文本输入组件，支持密码、多行输入、占位符等 |
| ScrollView 滚动视图 | [scrollview](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/scrollview.html) | 带滚动功能的容器，通常与 Mask 组件配合使用 |
| ScrollBar 滚动条 | [scrollbar](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/scrollbar.html) | 通过拖动滑块滚动图片，与 ScrollView 配合使用 |
| ProgressBar 进度条 | [progress](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/progress.html) | 显示操作进度，支持 HORIZONTAL、VERTICAL、FILLED 三种模式 |
| Slider 滑动条 | [slider](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/slider.html) | 滑动器组件，常用于调节数值（如音量） |
| Toggle 开关 | [toggle](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/toggle.html) | CheckBox，与 ToggleContainer 一起使用可变成 RadioButton |
| ToggleContainer | [toggleContainer](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/toggleContainer.html) | 修改一组 Toggle 组件的行为，同一容器内任何时候只能有一个 Toggle 选中 |
| PageView 页面视图 | [pageview](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/pageview.html) | 页面视图容器，支持缓慢滑动和快速滑动翻页 |

### 9.12 UI 3D 渲染（UIMeshRenderer）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/ui-model.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/editor/ui-model.html)

UIMeshRenderer 是一个将 3D 模型从 3D 渲染管线转换到 2D 渲染管线的带转换功能的渲染组件，支持 3D 模型和粒子在 UI 上的显示。没有这个组件，即使模型和粒子节点在 UI 里也不会被渲染。

### 9.13 文字排版

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/label-layout.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/label-layout.html)

文字组件（Label）的排版基于 UITransform 组件的尺寸信息（约束框）。决定文字在约束框中位置的属性是 Horizontal Align（水平对齐）和 Vertical Align（垂直对齐）。排版模式（Overflow）包括 NONE、CLAMP（截断）、SHRINK（自动缩小）、RESIZE_HEIGHT（自动适应高度）。

**自动换行（Enable Wrap Text）**：开启后文字根据约束框宽度自动换行；只在截断和自动缩小模式下才有，自动适应高度模式下强制开启。英文以单词为单位换行，中文以字为单位换行。

### 9.14 制作动态生成内容的列表

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/list-with-data.html](https://docs.cocos.com/creator/3.8/manual/zh/ui-system/components/engine/list-with-data.html)

UI 界面常需由一组数据动态生成多个元素组成面板（选人界面、物品栏、选关卡等），制作流程包括：

1. **准备数据**：定义自定义数据类存放展示数据（该类不继承 Component，但可被组件使用）。
2. **制作表现**：制作一个运行时实例化的 Prefab 模板，绑定模板组件。
3. **根据数据生成列表内容**：在 `onLoad` 中遍历数据，以 Prefab 为模板 `instantiate` 生成新节点，调用 `init` 更新表现。
4. **添加 Layout 组件**：为列表所在节点添加 Layout（如 Type 为 HORIZONTAL、ResizeMode 为 CONTAINER）自动排列节点元素，通常还会配合 ScrollView 在有限空间内展示大量内容。

---

## 第十章 动画系统

> 官方入口：[animation](https://docs.cocos.com/creator/3.8/manual/zh/animation/)

### 10.1 动画系统总览

Cocos Creator 内置了通用的动画系统用以实现基于关键帧的动画。除了支持标准的位移、旋转、缩放动画和帧动画之外，还支持任意组件属性和用户自定义属性的驱动，再加上可任意编辑的时间曲线和创新的移动轨迹编辑功能，能够让内容生产人员不写一行代码就制作出细腻的各种动态效果。

**注意**：Cocos Creator 自带的动画编辑器适用于制作不太复杂的、需要与逻辑进行联动的动画（如 UI 动画）。如果要制作复杂的特效、角色动画、嵌套动画等，可考虑使用 Spine、DragonBones 或 3D 模型骨骼动画编辑器。

### 10.2 动画剪辑（Animation Clip）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-clip.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-clip.html)

动画剪辑（Animation Clip）是一份动画的声明数据，即包含动画数据的资源，是动画系统的核心之一。将动画剪辑挂载到动画组件上，就能将这份动画数据应用到动画组件所在的节点上。

- **Creator 内部创建的动画**：通过动画编辑器直接创建全新的动画剪辑，或通过脚本创建（程序化编辑动画剪辑）。
- **外部导入的骨骼动画**：第三方美术工具生产的骨骼动画，或模型导入后附带的骨骼动画。**注意**：外部导入的骨骼动画不支持在动画编辑器中查看和编辑，各节点是锁住状态，只能在外部美术工具中进行编辑。

### 10.3 动画组件（Animation）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-comp.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-comp.html)

Animation（动画）组件可以以动画方式驱动所在节点和子节点上的节点和组件属性，包括用户自定义脚本中的属性。

**动画组件属性**：

| 属性 | 功能说明 |
| --- | --- |
| Clips | 添加的动画剪辑资源，默认为空，支持添加多个 |
| DefaultClip | 默认的动画剪辑 |
| PlayOnLoad | 若勾选，动画加载完成后会自动播放 Default Clip 的内容 |

如果一个动画需要包含多个节点，一般会新建一个节点作为动画的**根节点**，再将动画组件挂载到根节点上，则这个根节点下的其他子节点都会自动进入到这个动画剪辑中。

**注意**：动画组件/骨骼动画组件不能和动画控制器组件挂载在同一个节点上（Marionette 动画系统与旧式动画系统不可同时使用）。

### 10.4 使用动画编辑器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/animation.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation.html)

只有在 **动画编辑模式** 下才可以编辑动画剪辑中的动画数据。在动画编辑模式下，无法对节点进行添加/删除/重命名等操作，没有记录在动画关键帧内的属性修改在退出编辑模式后会被还原。

- **进入编辑模式**：选中带有 Animation 组件且包含 clip 的节点，点击 **进入动画编辑模式** 按钮，或按快捷键 Ctrl/Cmd + E。
- **保存动画数据**：点击保存按钮 / 场景编辑器左上角保存按钮 / Ctrl/Cmd + S。
- **退出编辑模式**：点击退出按钮 / 场景编辑器左上角关闭按钮 / Ctrl/Cmd + E。

### 10.5 骨骼动画（Skeletal Animation）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/skeletal-animation.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/skeletal-animation.html)

导入带有动画文件的模型资源后，若模型网格中带有蒙皮信息，SkeletalAnimation 组件便会自动添加到模型节点上。

**骨骼动画组件属性**：Clips、DefaultClip、PlayOnLoad（与动画组件一致）、Sockets（将外部节点挂到指定的骨骼关节上）、useBakedAnimation（切换使用预烘焙骨骼动画或实时计算骨骼动画）。

Creator 提供了两套骨骼动画系统：

- **预烘焙骨骼动画系统**（useBakedAnimation 为 true）：所有动画数据按照指定帧率提前预采样、烘焙到全局复用的骨骼动画贴图合集上，在 GPU 上完成蒙皮。压倒性目的是性能。目前所有模型资源导入后默认使用预烘焙系统。
- **实时计算骨骼动画系统**（useBakedAnimation 为 false）：所有动画数据根据当前全局时间动态插值计算，动画数据输出到场景的骨骼节点树中。压倒性目的是表现力，支持 blendshape、任意数量动画片段混合和 masking、IK、二级物理影响等。

**蒙皮算法**：内置了 LBS（线性混合蒙皮，默认）和 DQS（双四元数蒙皮）两种标准蒙皮算法。

**挂点系统**：如果需将外部节点挂到指定骨骼关节上，需使用挂点系统（Sockets）。对于预烘焙系统，将物体直接挂载在骨骼节点上是无效的，必须使用挂点系统。

**关于动态 Instancing**：基于预烘焙系统可以支持蒙皮模型的 instancing，但需要确保同一个 Drawcall 内的各个模型使用的骨骼贴图是同一张，可通过 **骨骼贴图布局设置** 面板手动指定每张骨骼贴图的数据分配方式。

### 10.6 Marionette 动画系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/marionette/](https://docs.cocos.com/creator/3.8/manual/zh/animation/marionette/)

Cocos Creator 3.4 引入了全新的 **Marionette 动画系统**，通过状态机控制对象的骨骼动画，实现了自动化、可复用的动画流程。

**新旧动画系统的区别**：

- **旧式动画系统**：以动画组件、动画状态为核心，手动简单控制动画剪辑的播放暂停等。动画剪辑支持编辑器创建的 Animation Clip 和外部导入的骨骼动画。
- **Marionette 动画系统**：以动画控制器组件、动画图为核心，通过状态机自动控制动画剪辑的播放和切换。动画剪辑只支持外部导入的骨骼动画（`.fbx`、`.gltf` 和 `.glb`）。

**核心概念**：动画图资源（存储整个动画流程数据）、动画控制器组件（引用动画图资源并应用于对象）、动画图面板（组合动画流程）、状态（播放特定动画剪辑的动作）、状态过渡（状态之间的切换）、动画状态机（可视化管理状态及过渡的流程图）。

**动画图资源**：在资源管理器中点击 **+** 选择 **动画图（Animation Graph）** 创建，通过动画控制器组件的 Graph 属性应用。动画图可以有多个层级（Layers），层级之间同时运行并可混合，支持动画遮罩（Mask）、层级权重（Weight）。

**状态过渡**：普通过渡（源头为入口或子状态机，仅能指定条件）和动画过渡（源头为状态或任意，可控制过渡周期使动画平滑切换）。过渡条件支持布尔条件、数值条件、触发条件，可同时指定多个条件（全部满足才过渡）。自 3.8.0 开始状态机支持多过渡。

**程序化动画**（v3.8 新增，实验性）：以类似流程图的形式表达姿态的生成和变化，通过姿态图实现 IK（逆向动力学）等复杂骨骼动画。启用方式：在 **偏好设置 -> 实验室** 中开启动画辅助曲线和开启姿态图功能，在 **项目设置 -> 功能剪裁** 中启用程式化动画。

### 10.7 动画事件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-event.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-event.html)

通过在动画时间轴的指定帧调用 **动画事件** 函数可以充实动画剪辑。在时间轴某一帧上添加 **事件帧** 后，动画系统会在动画执行到该帧时，根据事件帧中设置的触发函数名称去匹配动画根节点中对应的函数方法并执行。事件帧支持编辑、删除、复制粘贴（支持跨编辑器 v3.x），参数支持 String、Number、Boolean 三种类型。

### 10.8 程序化编辑动画剪辑

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/use-animation-curve.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/use-animation-curve.html)

除了在动画编辑器中创建动画剪辑，还可以通过脚本模块程序化地创建动画剪辑，核心概念包括：

- **动画属性轨道**（`animation.Track`）：描述某一对象上的某一动画属性随时间推移而发生的变化。轨道类型包括数值轨道、向量轨道（2/3/4 维）、四元数轨道、颜色轨道、尺寸轨道、对象轨道。
- **轨道路径**（`animation.TrackPath`）：指定在运行时如何从当前节点对象寻址到目标对象。
- **值代理**：在目标对象没有"属性设置"接口时（如材质通过 `setProperty` 设置），通过值代理自定义赋值方式。
- **循环模式**：`WrapMode.Normal`（播放到结尾停止）、`Loop`（循环播放）、`PingPong`（往返播放）等。

### 10.9 程序化控制动画

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-component.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-component.html)

动画组件管理了一组动画状态，用于控制各动画的播放、暂停、继续、停止、切换等：

- **播放动画**：`animationComponent.play('idle')`；未指定动画且设置了 defaultClip 则播放 defaultClip。
- **切换动画**：`play` 会立即停止其他动画播放；使用 `crossFade('run', 0.3)` 可在指定周期内平滑完成切换（淡入淡出）。
- **帧事件**：通过 `AnimationClip.events` 在脚本中直接添加帧事件，每个事件包含 `frame`（触发时间点，秒）、`func`（回调函数名称）、`params`（传入参数）。
- **动画事件**：支持 PLAY、STOP、PAUSE、RESUME、LASTFRAME、FINISHED 等回调事件，定义在 `Animation.EventType` 枚举内。

### 10.10 动画状态（Animation State）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-state.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-state.html)

动画状态（由类 `AnimationState` 管理）用于控制在某个对象上使用的动画剪辑，提供调速、设置循环模式等更为细致的控制：

- **设置播放速度**：通过 `animationComponent.getState('idle').speed = 2.0` 设置。
- **播放时间**：`time` 字段获取累计播放时间，`current` 字段获取进度时间（只读）。
- **循环模式**：Normal、Loop、PingPong 及对应的 Reverse、LoopReverse、PingPongReverse。
- **播放控制**：`play()`、`pause()`、`resume()`、`stop()` 方法，以及 `isPlaying`、`isPaused`、`isMotionless` 字段。

### 10.11 嵌入播放器（实验性）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/animation/embedded-player.html](https://docs.cocos.com/creator/3.8/manual/zh/animation/embedded-player.html)

嵌入播放器允许在动画剪辑的制作时同时绑定粒子特效或其他动画，用于实现挥动武器出现刀光、脚踩地面出现烟尘等功能。支持 **动画播放器** 和 **粒子播放器** 两种轨道，可设置同步速度（与当前动画剪辑保持一致的播放速率）和子节点。v3.6 中该功能为实验性功能，需在 **偏好设置 -> 实验室** 中启用。

---

## 第十一章 声音系统

> 官方入口：[audio-system/overview](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/overview.html)

### 11.1 声音系统总览

音乐是游戏中不可或缺的一部分，好的音乐能让游戏更加真实、富有沉浸感。Cocos Creator 的音频系统支持导入并播放大多数常见的音频文件格式。相关内容：[音频资源](https://docs.cocos.com/creator/3.8/manual/zh/asset/audio.html)、[AudioSource 组件参考](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audiosource.html)、[AudioSource 播放示例](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioExample.html)、[兼容性说明](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioLimit.html)。

### 11.2 AudioSource 组件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audiosource.html](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audiosource.html)

AudioSource 组件用于控制音乐和音效的播放，在 **属性检查器** 中选择 **添加组件 -> Audio -> AudioSource** 即可添加。

**AudioSource 属性**：

| 属性 | 说明 |
| --- | --- |
| Clip | 添加的用于播放的音频资源 |
| Loop | 是否循环播放 |
| PlayOnAwake | 是否在游戏运行（组件激活）时自动播放音频 |
| Volume | 音量大小，范围在 0~1 之间 |

**播放方式**：

- **通过编辑器播放**：将音频资源拖拽到 AudioSource 组件的 Clip 属性框中，再设置其他属性即可。
- **通过脚本播放**：调用 `audioSource.play()`、`pause()` 等 API 控制音频播放。
- **音效播放**：使用 `playOneShot` 接口播放短音效，播放后的音效无法暂停或停止，也无法监听播放结束事件。

**监听音频播放事件**（v3.3.0 开始支持）：通过 `AudioSource.EventType.STARTED`、`ENDED` 监听播放开始和结束事件。

**注意**：Cocos Creator 3.x 移除了 v2.x 中的 `audioEngine` API，统一使用 AudioSource 组件播放音频。Web 平台需要遵守浏览器的 Audio Play Policy，即使设置了 PlayOnAwake，也需要在第一次用户点击事件发生后才会播放。

### 11.3 音频播放管理器示例

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioExample.html](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioExample.html)

在实际项目开发中通常需要一个方便随时调用的音频播放管理器（单例类）。思路：创建一个常驻节点（`director.addPersistRootNode`）并添加 AudioSource 组件，通过 `playOneShot` 播放短音效、通过 `play` 播放长音频（背景音乐）。

### 11.4 兼容性说明

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioLimit.html](https://docs.cocos.com/creator/3.8/manual/zh/audio-system/audioLimit.html)

Web 平台支持两种音频加载方式：

- **Web Audio**：以 audio buffer 形式缓存，兼容性好，问题较少（默认方式）。
- **DOM Audio**：通过标准 audio 元素播放，在某些浏览器可能遇到兼容性问题（如 iOS 上不支持调整音量大小）。

如果检测到当前浏览器不支持 Web Audio，会切换使用 DOM Audio 方式加载。如需强制使用 DOM Audio，可通过 `assetManager.loadRemote` 并传入 `{ audioLoadMode: AudioClip.AudioType.DOM_AUDIO }` 动态加载。

---

## 第十二章 缓动系统

> 官方入口：[tween](https://docs.cocos.com/creator/3.8/manual/zh/tween/)

### 12.1 缓动系统总览

缓动系统被广泛应用于游戏开发中，其主要目的是解决离线动画无法满足需求时的动态动画问题。在 Cocos Creator 中，缓动除了可以用于变换位置、旋转、缩放和颜色等常规动画信息，还支持延迟、队列、并行等动作行为。缓动以脚本 API（`tween()` 工具函数 + `Tween` 类）形式使用，无需挂载组件。

### 12.2 缓动接口

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/tween/tween-interface.html](https://docs.cocos.com/creator/3.8/manual/zh/tween/tween-interface.html)

**主要接口**：

| 接口 | 功能说明 |
| --- | --- |
| tag | 为当前缓动添加一个数值类型的标签 |
| to | 添加一个对属性进行**绝对值**计算的间隔动作 |
| by | 添加一个对属性进行**相对值**计算的间隔动作 |
| set | 添加一个直接设置目标属性的瞬时动作 |
| delay | 添加一个延迟时间的瞬时动作 |
| call | 添加一个调用回调的瞬时动作 |
| target | 添加一个直接设置缓动目标的瞬时动作 |
| union | 将之前所有的动作打包成一个 |
| then | 插入一个新缓动到缓动队列中 |
| repeat / repeatForever | 执行几次 / 一直重复执行 |
| update | 添加一个自定义动作 |
| id | 设置前一个动作的标识，常与 reverse、union 配套使用 |
| reverse | 翻转缓动中的动作 |
| timeScale | 设置缓动的缩放时间因子 |
| sequence | 添加一个顺序执行的缓动 |
| parallel | 添加一个同时进行的缓动 |
| start / stop / pause / resume | 启动 / 停止 / 暂停 / 恢复缓动 |
| clone | 克隆缓动 |
| show / hide / removeSelf / destroySelf | 节点相关操作（缓动目标需为 Node） |

**静态接口**：`Tween.stopAll()`、`Tween.stopAllByTag(tag)`、`Tween.stopAllByTarget(target)`、`Tween.pauseAllByTarget(target)`、`Tween.resumeAllByTarget(target)`。

**基本用法**：

```ts
tween(this.node)
    .to(1.0, { position: new Vec3(0, 10, 0) }, { easing: 'backIn' })
    .by(1.0, { position: new Vec3(0, -10, 0) })
    .delay(1.0)
    .call(() => { console.log("call"); })
    .start();
```

### 12.3 缓动函数

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/tween/tween-function.html](https://docs.cocos.com/creator/3.8/manual/zh/tween/tween-function.html)

引擎实现了一系列不同类型的缓动函数，主要用于 `Tween.to` 和 `Tween.by` 接口。内置缓动函数包括 linear、smooth、fade、constant、quadIn/Out/InOut/OutIn、cubicIn/Out/InOut/OutIn、quart、quint、sine、expo、circ、elastic、back、bounce 等系列。通过 `ITweenOption` 接口的 `easing` 参数可指定缓动函数（也可传入自定义函数），同时支持 `onStart`、`onUpdate`、`onComplete`、`progress` 等回调。

### 12.4 缓动示例

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/tween/tween-example.html](https://docs.cocos.com/creator/3.8/manual/zh/tween/tween-example.html)

常见用法包括：

- **链式 API**：大部分动作相关接口返回 this，可链式调用组合。
- **绑定不同对象**：可绑定 Node、任意对象（如自定义的 BindTarget 类）。
- **整合多个缓动**：`union` 将当前所有动作合并；`sequence` 将传入的缓动转化为队列；`parallel` 将传入的缓动转化为并行；`then` 插入新缓动。
- **延迟执行**：`delay` 在当前位置后添加延时，位置不同造成完全不同的结果。
- **重复执行**：`repeat(次数)` 默认重复最后一个动作，也可通过第二个参数指定要重复的缓动。
- **显示/隐藏/删除节点**：`show`、`hide`、`removeSelf`。
- **停止缓动**：实例 `stop()` 或静态 `stopAll` / `stopAllByTag` / `stopAllByTarget`。
- **销毁**：从 v3.8.4 开始，缓动目标为 Node 时会监听销毁事件自动销毁；切换场景时 v3.8.4 之后引擎会自动处理。

---

## 第十三章 物理系统

> 官方入口：[physics](https://docs.cocos.com/creator/3.8/manual/zh/physics/)

### 13.1 物理系统总览

Cocos Creator 的物理系统提供了高效的组件化工作流程和便捷的使用方法，支持刚体、碰撞组件、触发和碰撞事件、物理材质、射线检测等特性。内置了 [2D 物理系统](https://docs.cocos.com/creator/3.8/manual/zh/physics-2d/physics-2d.html) 和 [3D 物理系统](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics.html)，可在 **项目 -> 项目设置 -> 功能裁剪** 中配置。

### 13.2 3D 物理系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics.html)

**支持的物理引擎**：

| 引擎 | 说明 |
| --- | --- |
| Bullet | 默认物理引擎，Bullet 物理引擎的 asm.js/wasm 版本，具备碰撞检测和物理模拟 |
| builtin | 内置物理引擎，仅用于碰撞检测的轻量引擎 |
| cannon.js | 具有碰撞检测和物理模拟的物理引擎（约 141KB） |
| PhysX | NVIDIA 开发的游戏物理引擎（约 5MB），发布到原生平台（尤其 iOS）时推荐使用 |

通过 **项目 -> 项目设置 -> 功能裁剪** 中的 3D 物理系统选择物理引擎，默认使用 **Bullet（ammo.js）**。

**物理世界流程**：当所有组件完成 `lateUpdate` 之后，引擎将持有物理属性的节点同步到物理世界，驱动物理引擎进行模拟，模拟完成后再将结果同步到场景的各个节点上。

**添加物理元素**：新建节点 → 添加碰撞组件（如 BoxCollider）→ 添加刚体 RigidBody 组件。

### 13.3 碰撞组件（Collider）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-collider.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-collider.html)

碰撞组件用于定义需要进行物理碰撞的物体形状，主要包括：

- **基础碰撞体**：盒碰撞器（BoxCollider）、球碰撞器（SphereCollider）、圆柱碰撞器（CylinderCollider）、圆锥碰撞器（ConeCollider）、胶囊碰撞器（CapsuleCollider）。
- **复合碰撞体**：在一个节点上添加一个或多个基础碰撞体，简易模拟游戏对象形状。
- **网格碰撞体（MeshCollider）**：根据物体网格信息生成碰撞体，Convex 功能（凸包）目前仅 ammo.js 后端支持，开启后可支持动力学。
- **单纯形碰撞体（SimplexCollider）**：提供点、线、三角面、四面体碰撞。
- **平面碰撞体（PlaneCollider）**：代表无限平面或半空间，只能用于静态物体。
- **地形碰撞体（TerrainCollider）**：用于凹地形的特殊支持。

**碰撞组件共有属性**：Attached（碰撞器所绑定的刚体）、Material（物理材质）、IsTrigger（是否为触发器，触发器不会产生物理反馈）。

**注意**：碰撞体间定义碰撞发生的可能性是通过刚体的 Group 属性，而非 Node 的 Layer 属性。避免使用比例很高的尺寸（建议低于 1000），以免浮点数计算不准确。

### 13.4 刚体组件（RigidBody）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-rigidbody.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-rigidbody.html)

刚体是组成物理世界的基本对象，可以使游戏对象的运动方式受物理控制。刚体类型包括：

- **STATIC（静态刚体）**：零质量零速度，不会受重力或速度影响，可用于建筑物等始终停留在一个地方的物体。
- **DYNAMIC（动力学刚体）**：刚体碰撞完全由物理引擎模拟，可通过力的作用运动物体（如斯诺克母球）。
- **KINEMATIC（运动学刚体）**：可直接移动刚体对象的变换属性，但不会响应力和碰撞，通常用于表达电梯这类平台运动的物体。

**刚体属性**（DYNAMIC 类型生效）：Group（分组）、Mass（质量）、AllowSleep（允许休眠）、LinearDamping/AngularDamping（线/角阻尼）、UseGravity（使用重力）、LinerFactor/AngularFactor（线/角因子）。

**控制刚体**：

```ts
rigidBody.applyForce(new math.Vec3(200, 0, 0));     // 施加力
rigidBody.applyTorque(new math.Vec3(200, 0, 0));    // 施加扭矩
rigidBody.applyImpulse(new math.Vec3(5, 0, 0));     // 施加冲量
rigidBody.setLinearVelocity(new math.Vec3(5, 0, 0));  // 改变线性速度
rigidBody.setAngularVelocity(new math.Vec3(5, 0, 0)); // 改变旋转速度
```

### 13.5 物理材质

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-material.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-material.html)

物理材质是一种资源，记录了物体的物理属性，用于计算碰撞物体受到的摩擦力和弹力等。属性包括：Friction（摩擦系数）、RollingFriction（滚动摩擦系数）、SpinningFriction（自旋摩擦系数）、Restitution（回弹系数）。

物理材质以碰撞体为单位进行设置，每个 Collider 都具有一个 Material 属性（不设置时引用物理系统默认材质）。物理材质拥有共享材质（sharedMaterial）和独享材质两种状态。

### 13.6 物理约束（Joint）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-constraint.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-constraint.html)

在物理引擎中，**约束** 用于模拟物体间的连接情况，如连杆、绳子、弹簧或者布娃娃等。约束依赖刚体组件，若节点无刚体组件，添加约束时引擎会自动添加刚体组件。目前约束仅在物理引擎为 Bullet、PhysX 或 Cannon.js 时生效。

支持的约束类型：

- **铰链约束（HingeConstraint）**：将连接物体的运动约束在某一个轴上，模拟门的合页或电机转动。
- **点对点约束（PointToPointConstraint）**：将两个对象或一个对象与坐标系中一点连接，连接对象可相对自由旋转。
- **固定约束（FixedConstraint）**：锁定两个刚体之间的相对位置和旋转，不允许相对移动。
- **可配置约束（ConfigurableConstraint）**：对 6 个自由度分别进行控制（free、limited、locked 模式），支持线性/角度限制、线性/角度马达。

### 13.7 物理事件

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-event.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-event.html)

碰撞组件的 **IsTrigger** 属性决定了组件为触发器还是碰撞器。触发器只用于碰撞检测和触发事件，会被物理引擎忽略。

**触发事件**（触发器生成）：`onTriggerEnter`（触发开始）、`onTriggerStay`（触发保持）、`onTriggerExit`（触发结束）。

**碰撞事件**（碰撞器生成，根据碰撞数据）：`onCollisionEnter`（碰撞开始）、`onCollisionStay`（碰撞保持）、`onCollisionExit`（碰撞结束）。

**注意**：接收到触发事件的前提是两者都必须带有碰撞组件，并且至少有一个是触发器类型；接收到碰撞事件的前提是两者都带有碰撞组件、至少有一个是非静态刚体并且使用非 builtin 物理引擎。

**连续碰撞检测（CCD）**：用于避免高速运动物体在离散运动时出现穿透现象，通过 `rigidBody.useCCD = true` 开启。目前仅支持动力学刚体、凸类形状物体，不支持解决旋转穿透问题。

### 13.8 射线检测

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-raycast.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-raycast.html)

射线检测是对一条射线和另一个形状进行相交性判断。构造射线的方式包括：起点 + 方向（`new geometry.Ray`）、起点 + 射线上的另一点（`Ray.fromPoints`）、用相机构造从相机原点到屏幕某点的射线（`camera.screenPointToRay`）。

接口由 PhysicsSystem 提供：

- `raycast`：检测所有碰撞体，结果通过 `PhysicsSystem.instance.raycastResults` 获取。
- `raycastClosest`：检测与射线距离最短的碰撞体，结果通过 `raycastClosestResult` 获取。

```ts
if (PhysicsSystem.instance.raycastClosest(ray, mask, maxDistance, queryTrigger)) {
    const result = PhysicsSystem.instance.raycastClosestResult;
    const hitPoint = result.hitPoint;
    const hitNormal = result.hitNormal;
    const collider = result.collider;
    const distance = result.distance;
}
```

自 v3.7 起支持线段/采样点检测（`lineStripCast`、`lineStripCastClosest`）；自 v3.8 起支持几何投射检测（扫掠），包括盒形、球形、胶囊体扫掠。

### 13.9 物理系统配置

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-configs.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/physics-configs.html)

通过 **项目设置 -> 物理配置** 可以对物理系统进行相关配置，包括：Gravity（重力矢量）、AllowSleep（允许休眠）、SleepThreshold（休眠临界值）、AutoSimulation（自动模拟）、FixedTimeStep（固定时间步长）、MaxSubSteps（最大子步数）、DefualtMaterial（默认物理材质）、CollisionMatrix（碰撞矩阵）。

**碰撞矩阵**用于初始化物理元素的分组和掩码，点击 **+** 可新增分组（Index 范围为 `[0, 31)`，不可重复）。分组可以理解为碰撞对象所处的分组，掩码可以理解为该碰撞对象需要与哪些分组对象进行碰撞。对象间允许碰撞的计算方式为 `(GroupA & MaskB) && (GroupB & MaskA)`。

### 13.10 角色控制器

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics/character-controller/index.html](https://docs.cocos.com/creator/3.8/manual/zh/physics/character-controller/index.html)

自 v3.8 开始提供角色控制器，为游戏添加简单易用的角色控制功能。提供两种类型：**盒控制器（BoxCharacterController）** 和 **胶囊控制器（CapsuleCharacterController）**，均继承自 `CharacterController`。仅支持 **Bullet** 以及 **PhysX** 物理后端。

通用属性：Group（物理分组）、Min Move Distance（最小移动距离）、Center（中心）、Step Offset（最大自动爬台阶高度）、Slope Limit（最大爬坡角度）、Skin Width（皮肤宽度）。

**驱动角色控制器**：使用 `move` 方法移动（内部使用 sweep 算法检测，会考量行进路线中的碰撞体）；通过 `isGrounded` 判断是否在地面上；发生碰撞时派发 `onControllerColliderHit` 事件；与触发器碰撞时触发 `onControllerTriggerEnter`/`Stay`/`Exit` 事件。

### 13.11 2D 物理系统

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/physics-2d/physics-2d.html](https://docs.cocos.com/creator/3.8/manual/zh/physics-2d/physics-2d.html)

Cocos Creator 支持内置的轻量 **Builtin** 物理系统和强大的 **Box2D** 物理系统。Builtin 只提供碰撞检测功能；Box2D 提供了更完善的交互接口和刚体、关节等预设组件。通过 **项目 -> 项目设置 -> 功能裁剪** 切换。

**2D 刚体组件（RigidBody2D）**：类型包括 Static（静态）、Dynamic（动态）、Kinematic（运动）、Animated（动画，从 Kinematic 衍生，用于刚体与动画编辑结合使用）。属性包括 Group、EnabledContactListener（开启碰撞监听）、Bullet、Type、AllowSleep、GravityScale、LinearDamping、AngularDamping、LinearVelocity、AngularVelocity、FixedRotation 等。

**2D 碰撞组件**：盒碰撞组件（BoxCollider2D）、圆形碰撞组件（CircleCollider2D）、多边形碰撞组件（PolygonCollider2D）。共同属性包括 Editing、Tag、Group、Sensor、Density、Friction、Restitution、Offset。

**2D 碰撞回调**：`BEGIN_CONTACT`、`END_CONTACT`（Builtin 模块只发送这两种）；Box2D 模块还包括 `PRESOLVE`、`POSTSOLVE`。可通过单个碰撞体注册，也可通过 `PhysicsSystem2D.instance` 注册全局回调。

**2D 物理关节**：距离关节（DistanceJoint2D）、固定关节（FixedJoint2D）、铰链关节（HingeJoint2D）、相对关节（RelativeJoint2D）、滑动关节（SliderJoint2D）、弹簧关节（SpringJoint2D）、轮子关节（WheelJoint2D）。关节组件在 Builtin 2D 物理模块中无效。

---

## 第十四章 粒子系统

> 官方入口：[particle-system](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/)

### 14.1 粒子系统总览

粒子系统是游戏引擎特效表现的基础，可用于模拟火、烟、水、云、雪、落叶等自然现象，也可用于模拟发光轨迹、速度线等抽象视觉效果。Creator 目前支持 2D/3D 粒子系统。

**基本结构**：粒子系统由发射器（创建并初始化粒子）、影响器（更新粒子属性）、渲染器（渲染粒子）、粒子类（存储属性）、粒子系统类（管理模块）组成。每一帧粒子系统执行：产生新粒子并初始化 → 删除超过生命周期的粒子 → 更新粒子动态属性 → 渲染所有有效粒子。

**添加 3D 粒子系统**：在属性检查器中点击 **添加组件** 添加粒子，或在层级管理器右键选择 **创建 -> 特效 -> 粒子系统**。

### 14.2 粒子系统模块

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/module.html](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/module.html)

粒子系统使用模块来组织功能，包括：

| 模块 | 说明 |
| --- | --- |
| Node | 粒子节点，设置发射器位置、方向、大小、渲染层级等 |
| ParticleSystem（主模块） | 存储在属性检查器中显示的所有数据，管理粒子生成、更新、销毁，控制播放 |
| ShapeModule（发射器模块） | 控制粒子发射，包括发射方向与速度 |
| AnimatorModule（状态模块） | 控制粒子发射后的状态更新，包括噪声、速度、加速、大小、旋转、颜色、贴图动画、限速、拖尾模块 |
| Renderer | 生成粒子渲染所需的数据 |

### 14.3 主模块（ParticleSystem）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/main-module.html](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/main-module.html)

主要属性：Duration（运行总时间）、Capacity（最大粒子数量）、Loop（是否循环播放）、PlayOnAwake（加载后自动播放）、Prewarm（预热）、SimulationSpace（坐标计算所在坐标系）、SimulationSpeed（更新速度）、StartDelay（延迟发射）、StartLifetime（生命周期）、StartColor（初始颜色）、StartSize3D/StartSize（初始大小）、StartSpeed（初始速度）、StartRotation3D/StartRotation（初始旋转）、GravityModifier（重力系数）、RateOverTime（每秒发射粒子数）、RateOverDistance（每移动单位距离发射数）、Bursts（指定时间发射指定数量粒子）。

v3.4 新增 **RenderCulling**（粒子剔除）选项，根据发射器包围盒是否在摄像机可见范围内剔除粒子发射器，适合耗时的特效。

### 14.4 发射器模块（ShapeModule）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/emitter.html](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/emitter.html)

发射器模块用于设置粒子发射器形状、发射方向和速度。**ShapeType** 支持：盒子（Box）、圆形（Circle）、锥体（Cone）、球（Sphere）、半球（Hemisphere）。

通用属性：Position（发射器位置）、Rotation（发射器旋转）、Scale（发射器缩放）、AlignToDirection（根据发射初始方向决定粒子移动方向）、RandomDirectionAmount（方向随机混合）、SphericalDirectionAmount、RandomPositionAmount。

### 14.5 状态模块

粒子发射后的状态更新由 AnimatorModule 控制，已支持的功能模块包括：

- **速度模块（VelocityOvertimeModule）**：控制粒子在生命周期内的速度。
- **加速度模块（ForceOvertimeModule）**：对粒子进行加速，模拟类似风的效果。
- **大小模块（SizeOvertimeModule）**：设置粒子在其生命周期内的大小。
- **旋转模块（RotationOvertimeModule）**：设置粒子运行时在移动中旋转。
- **颜色模块（ColorOvertimeModule）**：设置粒子颜色及生命周期内的颜色变化。
- **贴图动画模块（TextureAnimationModule）**：将粒子材质指定的贴图纹理作为动画帧动态播放。
- **限速模块（LimitVelocityOvertimeModule）**：设置粒子的速度在生命周期内逐渐减缓。
- **拖尾模块（TrailModule）**：在粒子尾部添加轨迹效果。
- **噪声模块（NoiseModule）**：增强粒子运动的效果，勾选 UseGPU 时不生效。

### 14.6 粒子渲染模块（Renderer）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/renderer.html](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/renderer.html)

**主要属性**：

| 属性 | 说明 |
| --- | --- |
| RenderMode | 粒子面片生成方式：Billboard（始终面向摄像机）、StretchedBillboard、HorizontalBillboard、VerticalBillboard、Mesh |
| VelocityScale / LengthScale | StretchedBillboard 模式下的拉伸参数 |
| Mesh | Mesh 模式下指定网格资源 |
| ParticleMaterial | 粒子渲染材质（CPU 用 builtin-particle，GPU 用 builtin-particle-gpu） |
| TrailMaterial | 拖尾渲染材质（仅支持 builtin-particle-trail） |
| UseGPU | 是否使用 GPU 渲染器（默认 CPU 渲染器） |
| AlignSpace | 粒子对齐方向空间：View（视角空间）、World（世界空间）、Local（局部空间） |

**粒子渲染器**分为 CPU 渲染器（默认，通过对象池维护粒子，生成 VB、IB 数据）和 GPU 渲染器（CPU 端生成粒子，模块计算在 GPU 端进行，减少 CPU 压力）。GPU 渲染器暂不支持拖尾模块和限速模块。

### 14.7 粒子属性编辑

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/editor/](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/editor/)

Creator 提供了 **粒子控制面板**、**曲线编辑器** 和 **渐变色编辑器** 用于控制粒子播放及编辑粒子属性：

- **粒子控制面板**：选中粒子节点时显示在场景编辑器右下角，支持播放、暂停、重新播放、停止、调整播放速度、显示粒子数量等。
- **粒子曲线编辑器**：支持属性值随时间变化的曲线编辑，编辑形式包括 Constant、Curve、TwoCurves、TwoConstant；支持前后循环模式（Loop、Ping Pong、Clamp）和预设曲线模板。
- **渐变色编辑器**：支持颜色随时间渐变，编辑模式包括 Color、Gradient、TwoColors、TwoGradients、RandomColor。

### 14.8 2D 粒子系统（ParticleSystem2D）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/particle-system/2d-particle/2d-particle.html](https://docs.cocos.com/creator/3.8/manual/zh/particle-system/2d-particle/2d-particle.html)

2D 粒子组件（ParticleSystem2D）用于读取粒子资源数据（支持 plist 文件和图片），并对其进行播放、暂停、销毁等操作。主要属性：File（Plist 配置文件）、Custom（自定义粒子属性）、SpriteFrame、Duration、EmissionRate、Life、TotalParticle、StartColor、EndColor、Angle、StartSize、EndSize、StartSpin、EndSpin、PosVar、PositionType（FREE/RELATIVE/GROUPED）、EmitterMode（GRAVITY/RADIUS）等。

---

## 第十五章 地形系统

> 官方入口：[editor/terrain](https://docs.cocos.com/creator/3.8/manual/zh/editor/terrain/)

### 15.1 地形系统总览

地形系统以一种高效的方式来展示大自然的山川地貌。开发者可以很方便地使用画刷来雕刻出盆地、山脉、峡谷、平原等地貌。

### 15.2 创建地形

创建地形需要以下步骤：

1. 在 **层级管理器** 右击菜单中选择 **创建 -> 地形** 创建地形节点（地形节点可移动，但不支持旋转与缩放）。
2. 在 **资源管理器** 右击菜单中选择 **创建 -> 地形** 创建地形资源。
3. 选中地形节点，将创建好的地形资源拖拽到属性检查器中 `cc.Terrain` 地形组件的 `Asset` 属性框。

**地形组件属性**：Asset（地形资源）、Effect Asset（地形特效资源）、Receive Shadow（是否接受阴影）、Use Normal Map（是否使用法线贴图）、Use PBR（是否使用物理材质）、Lod Enable（是否启用地形 Lod，可减少渲染面数提升性能）、Lod Bias（Lod 起始距离）。

### 15.3 编辑场景地形

选中地形节点后，场景编辑器会显示地形节点的可编辑面板，包括 **管理**（Manage）、**雕塑**（Sculpt）、**涂料**（Paint）和 **选择**（Select）几个部分。

**管理（Manage）**：用于调整地形参数。Tile 是地形的最小单位，Tile 组成地形块（Block），目前一个 Block 由 32x32 个 Tile 组成，一个地形至少由 1 个 Block 组成。参数包括 Tile Size、Weight Map Size、Light Map Size、Block Count。

**雕塑（Sculpt）**：用于改变地形的形状。参数包括 Brush Size（画刷大小）、Brush Strength（画刷力度）、Brush Mode（画刷类型）、Brush Height（画刷高度）、Brush（自定义画刷样式）、Brush Rotation（画刷旋转）。画刷模式包括 Bulge（隆起）、Sunken（下凹）、Smooth（平滑）、Flatten（整平）、Set Height（设置高度）。通过鼠标左键雕刻地形，Bulge 模式下 Shift + 鼠标左键可下凹。

**涂料（Paint）**：用于描绘地形纹理。参数包括 Terrain Layer、Brush Size、Brush Strength、Brush Falloff（画刷衰减度）、Brush。Layer 编辑支持添加/删除 Layer（最多 4 层），每个 Layer 可设置纹理、法线贴图（需勾选 Use Normal Map）、金属特性（Metallic）、粗糙程度（Roughness）、纹理平铺大小（Tile Size）。

**选择（Select）**：选中地形块后显示当前地形块的信息，包括 Index（索引）、Layers（纹理列表）、Wight（权重图）。

## 第十六章 发布跨平台游戏

> 官方入口：[editor/publish](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/)

### 16.1 跨平台发布总览

得益于 Cocos Creator 的双内核引擎架构（C++ 内核用于原生平台，TS 内核用于 Web 和小游戏平台），使用 Cocos Creator 制作的项目可以在原生平台、Web 平台和小游戏平台上都运行良好，真正实现一次开发、全平台运行。

**支持的发布平台**：

- [发布 iOS 应用](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/ios/)
- [发布 Android 应用](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/android/)
- [发布 HUAWEI AppGallery Connect 应用程序](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-huawei-agc.html)
- [发布 HUAWEI HarmonyOS 应用](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-huawei-ohos.html)
- [发布 HarmonyOS Next 应用](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-openharmony.html)
- [发布到 Google Play](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/google-play/build-example-google-play.html)
- [发布到 Google Play On Games](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/google-play-games/)
- [发布 Windows 应用](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/windows/)
- [发布 macOS 应用](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/mac/)
- [发布 Web 移动端 - H5](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-web.html)
- [发布 Web 桌面端](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-web.html)
- [发布 Facebook Instant Games](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-fb-instant-games.html)
- [发布微信小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html)
- [发布淘宝小程序创意互动](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-taobao-creative-app.html)
- [发布抖音小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-bytedance-mini-game.html)
- [发布 OPPO 小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-oppo-mini-game.html)
- [发布华为快游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-huawei-quick-game.html)
- [发布 vivo 小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-vivo-mini-game.html)
- [发布荣耀小游戏](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-honor-mini-game.html)

### 16.2 构建发布面板

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/build-panel.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/build-panel.html)

点击编辑器主菜单中的 **项目 -> 构建发布** 或使用快捷键 `Ctrl/Cmd + Shift + B` 打开 **构建发布** 面板。v3.0 各个平台的构建以构建任务的形式进行，类似于下载任务。

**构建任务页面**：可查看当前平台的构建进度及构建结果（构建中显示蓝色、成功显示绿色、失败显示红色）。上方有三个按钮：新建构建任务、打开构建调试工具、清空构建缓存。构建任务左下方的按钮包括：打开文件夹、编辑、查看配置、日志；右下方的按钮用于各平台构建完成后的生成、运行、上传等发布流程。

**注意**：

1. 构建没有场景的项目是没有意义的，打开构建发布面板时若项目没有场景会提示先创建场景。
2. 构建之前请确保当前场景已保存。

### 16.3 通用构建选项

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/build-options.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/build-options.html)

**发布路径**：指定项目的发布路径（支持绝对路径 file 和相对路径 project），以及构建任务名称和发布包名称。发布路径中不允许包含空格、非法字符以及中文。

其他通用构建选项：

- **初始场景 / 参与构建场景**：设置打开游戏后进入的第一个场景，以及选择参与构建的场景（减少包体）。
- **Bundles**：自 v3.8 起可决定某个 Bundle 是否参与构建。
- **MD5 缓存**：为构建后的所有资源文件名加上 MD5 信息，解决 CDN 或浏览器资源缓存问题。
- **主包压缩类型 / 配置主包为远程包 / 资源服务器地址**：设置主包压缩类型，配置远程包及远程资源下载地址。
- **调试模式**：不勾选为发布模式（压缩和混淆脚本），勾选为调试模式（可配合 Source Maps 调试）。
- **Source Maps**：生成 sourcemap，便于调试时定位源代码。
- **替换插屏**：可手动指定插屏图片路径。
- **引擎模块配置**（自 3.8.3 起）：允许在构建面板上配置部分引擎模块配置，包括物理后端（2D/3D）、WebGL 2.0、CLEANUP_IMAGE_CACHE、原生代码打包模式等。

### 16.4 发布到 Web 平台

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-web.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-web.html)

Cocos Creator 提供了两种 Web 平台的页面模板：**Web Mobile**（默认将游戏视图撑满整个浏览器窗口）和 **Web Desktop**（可指定游戏视图分辨率）。

**Web Desktop 构建选项**：资源服务器地址、WEBGPU（是否启用 WebGPU 作为渲染后端）、预览分辨率（默认 1280x960）、Polyfills。

**Web Mobile 构建选项**：资源服务器地址、设备方向（Auto/Landscape/Portrait）、Polyfills（async Functions 和 coreJs）、vConsole（插入调试工具）、预览二维码、预览 URL。

**浏览器兼容性**：测试的桌面浏览器包括 Chrome、Firefox 和 QQ 浏览器；移动设备上测试的浏览器包括 Safari（iOS）、Chrome（Android）、QQ 浏览器（Android）和 UC 浏览器（Android）。自 v3.6.2 起支持 WebGPU（仅支持指定版本的 chromium 浏览器）。

### 16.5 发布到微信小游戏

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-wechatgame.html)

微信小游戏的运行环境是微信小程序环境的扩展，在小程序环境的基础上提供了 WebGL 接口的封装。引擎框架适配微信小游戏 API，纯游戏逻辑层面用户不需要任何额外的修改。

**环境配置**：下载微信开发者工具，在 **偏好设置 -> 外部程序** 中设置微信开发者工具路径，登录微信公众平台找到 AppID。

**发布流程**：构建发布面板选择 **微信小游戏** → 配置构建选项 → 点击 **构建** → 点击 **运行** 打开微信开发者工具。

**主包设置**：初始场景分包、资源服务器地址。**引擎设置**：CLEANUP_IMAGE_CACHE、物理系统、WebGL 2.0、原生代码打包模式、Wasm 3D 物理系统、引擎原生代码分包、启用 WASM Brotli 压缩。

**资源管理**：小游戏的主包体积不能超过 **4MB**，额外资源必须通过网络请求下载；小游戏环境内的资源不是按需加载的，而是一次性加载所有包内资源；不可以从远程服务器下载脚本文件。

### 16.6 发布到抖音小游戏

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-bytedance-mini-game.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-bytedance-mini-game.html)

抖音小游戏是基于一种不需要用户下载、点开即玩的全新游戏类型。准备工作包括下载抖音开发者工具、在抖音开发者平台完成账号注册并申请小游戏、获取 AppID。

**构建选项**：初始场景分包、资源服务器地址、生成开放数据域工程模板、AppID、设备方向、引擎原生代码分包、开发者工具打开方式。

**分包加载**：未配置分包时代码包总大小上限为 **20MB**；配置分包后整体包不超过 20MB、单个主包不超过 4MB、单个分包不超过 20MB。

### 16.7 发布到其他小游戏平台

- **华为快游戏**：环境配置需要华为快应用加载器（Android Phone 6.0 以上）和 nodejs。构建选项包括游戏包名、桌面图标、游戏版本名称、游戏版本号、支持的最小平台版本号（必须大于等于 1035）、自定义 manifest 文件路径、屏幕方向、密钥库、签名文件等。rpk 包在 `build/huawei-quick-game/dist` 目录下。代码包总大小限制为 **10MB**。
- **OPPO 小游戏**：环境配置需要 OPPO 小游戏调试器和 nodejs。构建选项类似华为快游戏，支持分离引擎功能。主包包体限制为 **4MB**。rpk 运行到手机需拷贝到 `/内部存储/games` 目录。
- **vivo 小游戏**：环境配置需要快应用 & vivo 小游戏调试器和 vivo 小游戏引擎，全局安装 `@vivo-minigame/cli`。支持二维码安装、本地安装、打包工具生成网址和二维码三种运行方式。主包包体限制为 **4MB**。
- **淘宝小程序创意互动**：从 v2.4.11 开始支持。构建生成 `taobao` 文件夹，使用淘宝开发者工具打开。包体限制超过 **2MB** 的额外资源必须通过网络请求下载。暂不支持 VideoPlayer、WebView、自定义字体、资源分包，暂只支持竖屏应用。

### 16.8 发布到 iOS / Android / 原生平台

**官方链接**：[原生平台通用构建选项](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/native-options.html)

目前可选择的原生平台包括 Android、iOS、HarmonyOS、Mac 和 Windows。iOS、Mac 只在 macOS 电脑上才能选择，Windows 只在 Windows 电脑上才能选择。

**原生平台通用构建选项**：加密脚本（生成 jsc 加密文件）、原生引擎（展示当前使用的内置/定制引擎）、任务调度系统、自动执行下一步（构建/生成/运行三按钮可通过链接按钮自动执行）。

**iOS 构建选项**：可执行文件名、应用 ID 名称（Bundle Identifier）、跳过 Xcode 工程的更新、屏幕方向（Portrait/Landscape Left/Landscape Right）、目标系统（iPhone OS / iOS Simulator）、渲染后端（METAL）、开发者、目标版本（默认 12.0）。

**Android 构建选项**：平滑帧率（Enable Swappy）、渲染后端（VULKAN/GLES3/GLES2，默认 GLES3）、应用 ID 名称、Target API Level、APP ABI（armeabi-v7a/arm64-v8a/x86/x86_64）、使用调试密钥库、屏幕方向、Google Play Instant、生成 App Bundle（Google Play）。

**安装配置原生开发环境**：下载 Java SDK（JDK 17）、下载 Android Studio、下载 Android SDK 和 NDK、安装 Windows 的 Visual Studio 2019/2022 或 Mac 的 Xcode 14 及以上版本，并在 **偏好设置** 中配置 Android SDK 与 NDK 路径。

### 16.9 构建流程简介与常见错误处理

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/build-guide.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/build-guide.html)

通用构建流程包括：构建选项初始化 → 构建数据整理 → 将构建后的资源写入文件系统 → 整理 settings.json/config.json 数据 → config.json 中的 UUID 压缩与文件写入。每个 Bundle 都会经过脚本构建、自动图集处理、纹理压缩、引擎脚本编译、json 构建、普通资源拷贝、md5 处理、application.js 文件生成等资源处理流程。

**常见问题**：

- **资源加载 404**：通常是在脚本内动态加载了没有放在 Bundle 中的资源、加载的资源导入有问题或资源丢失。可通过重新导入资源、将资源移动至 Bundle 文件夹下解决。
- **脚本资源加载报错**：根据报错内容修改脚本，可通过报错调用栈中的 UUID 在资源管理器中定位。
- **引擎编译失败**：检查安装包是否完整、内置引擎代码是否正确、自定义引擎路径是否正确。

### 16.10 定制项目的构建模版与自定义构建流程

**定制项目的构建模版**：在项目路径下添加 `build-templates` 目录，里面按照平台扩展名称划分子目录。构建结束后，`build-templates/[platform]` 目录下所有文件会自动按照对应目录结构复制到对应平台构建生成的工程中。支持 ejs 类型（可自动同步编辑器构建模板更新）和 json 类型（融合处理）。

**自定义构建流程**：通过 **项目 -> 新建构建扩展包** 生成构建扩展模板。在扩展的 `package.json` 中添加 `contributions.builder` 字段指向自定义构建脚本。支持自定义构建面板选项（options 自动渲染配置或 panel 自定义面板）、参数校验规则（verifyRuleMap）、钩子函数（onBeforeBuild、onBeforeCompressSettings、onAfterCompressSettings、onAfterBuild）和自定义纹理压缩处理（assetHandlers）。

### 16.11 命令行发布项目

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-in-command-line.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/publish/publish-in-command-line.html)

命令行发布项目可以帮助开发者构建自己的自动化构建流程。例如构建 web-desktop 平台、Debug 模式：

```
/Applications/CocosCreator/Creator/3.0.0/CocosCreator.app/Contents/MacOS/CocosCreator --project projectPath --build "platform=web-desktop;debug=true"
```

**进程退出码**：32 表示构建参数不合法，34 表示构建过程出错失败，36 表示构建成功。

**常用构建参数**：`--project`（必填，指定项目路径）、`--engine`（选填，指定自定义引擎路径）、`--build`（指定构建项目使用的参数，包括 configPath、stage、platform、debug、md5Cache、scenes、buildPath 等）。

### 16.12 热更新

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update.html)

资源热更新主要源于 Cocos 引擎中 **AssetsManager 模块** 对热更新的支持。其核心特点是：**服务端和本地均保存完整版本的游戏资源**，热更新过程中通过比较服务端和本地版本的差异来决定更新哪些内容，天然支持跨版本更新。

**注意**：资源热更新只适用于原生发布版本（WEB 版本可通过服务器直接进行版本更新）。

**热更新流程**：基于原生打包目录中的 assets 和 src 目录生成本地 Manifest 文件 → 创建热更新组件负责热更新逻辑 → 游戏发布后生成远程版本资源（含 assets 目录、src 目录和 Manifest 文件）部署到服务端 → 热更新组件检测到服务端 Manifest 版本不一致时开始热更新。

更多关于热更新管理器（AssetsManager）的细节，请参考 [热更新管理器文档](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update-manager.html)。

---

## 第十七章 扩展编辑器

> 官方入口：[editor/extension/readme](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/readme.html)

### 17.1 扩展编辑器总览

Cocos Creator 编辑器基于 GitHub 的 **Electron** 内核开发，由主进程和渲染进程组成。Cocos Creator 编辑器沿用了 Electron 的主进程和渲染进程的结构设计：扩展定义的 `main` 在主进程启动，`panels` 定义的面板在渲染进程启动。扩展内拥有完整的 Node.js 环境，可以很方便地使用 npm 市场上的大量工具。

主要章节包括：[扩展管理器面板](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/extension-manager.html)、[入门示例-菜单](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/first.html)、[入门示例-面板](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/first-panel.html)、[入门示例-扩展间通信](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/first-communication.html)、[安装与分享](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/install.html)、[上架扩展到商店](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/store/upload-store.html)、[增强已有功能](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/contributions.html)、[扩展系统详解](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/basic.html)。

### 17.2 创建扩展

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/create-extension.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/create-extension.html)

在编辑器主菜单上选择 **扩展 -> 创建扩展** 菜单打开新建面板。Cocos Creator 提供了 4 种扩展模板：**Blank**（空扩展）、**HTML Panel**、**Vue2.x Panel**、**Vue3.x Panel**。

**扩展位置**：将扩展包应用到指定的 Cocos Creator 项目，项目路径为 `${你的项目地址}/extensions`。创建完成后需执行 `npm install` 安装依赖模块，再执行 `npm run build` 编译。

### 17.3 扩展定义文件（package.json）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/define.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/define.html)

每个扩展都需要有一份 `package.json` 文件用于描述扩展的用途，主要字段包括：

- `package_version`：扩展的版本号（必填）。
- `version`：扩展的版本号字符串（推荐使用 semver 格式）。
- `name`：扩展名称，全局唯一，需与扩展文件夹一一对应。
- `title` / `description`：显示标题 / 描述，支持 i18n 多语言配置。
- `author`：作者。
- `editor`：支持的 Cocos Creator 编辑器版本。
- `main`：入口程序文件，扩展启动时执行。
- `panels`：扩展内定义的面板信息。
- `contributions`：提供与编辑器各功能系统交互的能力。

### 17.4 扩展面板

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/panel.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/panel.html)

扩展默认情况下没有界面显示，如果需要实现界面交互，需要使用面板系统。在 `package.json` 的 `panels` 字段定义一个或多个面板（title、main、icon、type、flags、size 等字段）。

编写面板：在扩展根目录建立 `src/panels/default/index.ts` 文件，通过 `Editor.Panel.define` 定义面板的 listeners、template、style、$、methods、ready、beforeClose、close 等属性。使用 `Editor.Panel.open('扩展名.面板名')` 打开面板。扩展与面板之间的交互通过进程间通信（IPC / 消息系统）实现。

### 17.5 扩展间通信与增强已有功能

**扩展间通信**：通过 `Editor.Message.send(extensionName, message, ...args)` 向指定扩展发送消息实现定向通信；通过 `Editor.Message.broadcast(message, ...args)` 广播消息，由其他扩展监听处理。

**增强已有功能（contributions）**：统一在 `package.json` 的 `contributions` 字段中定义，支持的功能包括：

- `builder` - 自定义构建流程
- `assets` - 增强资源管理器面板
- `profile` - 定义扩展需要用到的配置
- `scene` - 编写需要和引擎、项目脚本交互的脚本
- `inspector` - 自定义属性检查器面板
- `menu` - 定义扩展需要新增的菜单信息
- `messages` - 定义扩展需要用到的消息列表
- `shortcuts` - 定义扩展需要用到的快捷键
- `preferences` - 自定义偏好设置
- `project` - 自定义项目设置

### 17.6 安装与分享扩展

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/install.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/install.html)

扩展存放地址为 `${你的项目地址}/extensions`。可通过三种方式获得扩展：其他开发者打包分享、从 Dashboard 商城下载、从 Cocos Store 资源商城下载。在 **扩展管理器** 中选择 **项目** 选项卡点击导入按钮即可导入扩展压缩包。

**打包扩展**：进入扩展根目录，选择 `dist`、`i18n`、`node_modules`、`package.json`、`static` 等文件（缺一不可）压缩成 zip 包，分享给其他人或上传 Cocos Store。

**上架扩展到商店**：访问 Cocos 开发者中心，进入商店栏目点击 **发布新资源**，按资源类别、资源介绍、定价、上传资源、提交审核等流程完成。

### 17.7 UI 组件（自定义 UI 组件）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/ui.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/extension/ui.html)

编辑器内提供了许多预设的 UI 组件（可在 **开发者 -> UI 组件** 查看），包括输入框（ui-num-input）、滑动条（ui-slider）、复选框（ui-checkbox）、选择列表（ui-select）等，可用于扩展面板的配置。

---

## 第十八章 本地化

> 官方入口：[editor/l10n/overview](https://docs.cocos.com/creator/3.8/manual/zh/editor/l10n/overview.html)

### 18.1 本地化总览

多语言本地化（L10N）是 Cocos Creator 3.6 推出的功能，整合了第三方译文服务商的翻译服务，同时将文本、音频和图片等资源的本地化功能整合到引擎内，并支持一键发布到不同语言。

在引擎顶部菜单中选择 **面板 -> 本地化编辑器** 即可打开本地化编辑器面板，首次启动时需手动启用 L10N 功能。面板提供 **关闭 L10N**（数据保留）和 **卸载数据**（数据清除，无法恢复）两项功能。

主要流程：配置译文服务商 → 收集并统计项目内需要翻译的文本 → 语言编译（翻译/变体/预览/导出）→ 发布（选择使用的语言、默认语言、备用语言）。

### 18.2 L10nLabel 组件（本地化文本）

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/editor/l10n/l10n-label.html](https://docs.cocos.com/creator/3.8/manual/zh/editor/l10n/l10n-label.html)

L10nLabel 是可以根据内容进行定制化翻译的组件，配合文本组件使用，可对文本组件的内容进行翻译。**注意**：L10nLabel 必须搭配 Label 组件才可以使用，如果节点上没有 Label 组件，则会自动创建一个。

**属性**：String（Label 组件内文本，不可编辑）、Count（变体数量）、Key（本地化的键值）。

**变体数量**：用于解决翻译时遇到的复数问题（如英语的 one/apple 和 two/apples），不同语言的变体数量与当地语言有关（英语 2 种、俄语 3 种、阿拉伯语 5 种等），可通过国际规则（Unicode CLDR Project）查看。

### 18.3 译文服务商与收集统计

**译文服务商**：引擎整合了多家译文服务商的翻译服务，目前支持 [有道智云平台](https://ai.youdao.com/gw.s#/) 和 [Google Cloud](https://cloud.google.com/)，需输入 AppKey 和 AppSecret。选择 None 则无法使用自动翻译功能，但手动翻译不受影响。

**收集并统计**：收集功能会将项目内文本、TypeScript 脚本、场景资源、预制体、视频、引擎和图片等文件搜集起来。可配置本地开发语言（作为源语言提供给译文服务商翻译）、从资源文件中收集（可添加收集组、指定搜索目录、扩展名、排除路径）。

### 18.4 语言编译与发布

**语言编译**：开发者可以选择目标版本的语言（本地开发语言 + 目标国家/地区语言）。操作栏提供 **补全**（记录原文，仅本地开发语言）、**翻译**（使用译文服务商翻译）、**变体**、**预览**、**导出**（导出为 PO 文件）、**删除** 等功能。非文本资源（画在图片上的文字、不同语种配音的视频音频）可通过 **导入** 按钮配置本地化，支持智能匹配。

**脚本使用示例**：通过 `import l10n from 'db://localization-editor/core/L10nManager'` 导入，可动态切换语言（`l10n.changeLanguage('zh-Hans-CN')`）、根据键获取值（`l10n.t('this_is_apple')`）、查询键是否存在、获取当前语言和所有可用语言等。

**发布**：完成翻译后可在发布界面一键发布，包括使用的语言、默认语言（项目启动时使用的语言）、备用语言（默认语言出现问题后使用的备用语言）。

---

## 第十九章 进阶主题

> 官方入口：[advanced-topics](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/)

### 19.1 进阶主题总览

进阶主题模块包含以下内容：

- [如何向 Cocos 提交代码](https://docs.cocos.com/creator/3.8/manual/zh/submit-pr/submit-pr.html)
- [存储和读取用户数据](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/data-storage.html)
- [自定义加载 Wasm/Asm 文件与模块](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/wasm-asm-load.html)
- [使用 Emscripten 将原生代码转化为 Wasm/Asm 文件](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/wasm-asm-create.html)
- [引擎定制工作流程](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/engine-customization.html)
- [网页预览定制工作流程](https://docs.cocos.com/creator/3.8/manual/zh/editor/preview/browser.html)
- [i18n 游戏多语言支持](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/i18n.html)
- [动态合图](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/dynamic-atlas.html)
- [压缩引擎内部属性](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/mangle-properties.html)
- [热更新范例教程](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update.html)
- [热更新管理器](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update-manager.html)
- [HTTP 请求](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/http.html)
- [WebSocket](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/websocket-introduction.html)

### 19.2 引擎定制工作流程

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/engine-customization.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/engine-customization.html)

Cocos Creator 拥有两套引擎内核，**C++ 内核**（用于原生平台）和 **TypeScript 内核**（用于 Web 和小游戏平台）。在引擎内核之上，是用 TypeScript 编写的引擎框架层，用以统一两套内核的差异。

**获取引擎源码**：从 Cocos 引擎官方开源仓库（[GitHub](https://github.com/cocos/cocos-engine/) | [Gitee](https://gitee.com/mirrors_cocos-creator/engine/)）获取，选择对应版本的稳定分支（Tags）或最新的 develop 分支。

**配置环境**：将引擎源码放到指定目录 → 获取 external（原生引擎编译依赖的库，可通过 git 命令、引擎自带脚本或下载 ZIP 包获取）→ 安装编译依赖（NodeJS v12.0 以上、gulp、npm install）→ 在 **偏好设置 -> 引擎管理器** 中修改引擎路径（重启编辑器生效）。

**修改 TypeScript 引擎**：修改完成后在编辑器菜单栏点击 **开发者 -> 编译引擎** 即可。

**修改原生（C++）引擎**：需确保引擎管理器中 Native Module 的 Use Custom 被选中，在构建发布面板点击 **构建** 后再点击 **编译**，或使用 IDE 编译。

### 19.3 动态合图

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/dynamic-atlas.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/dynamic-atlas.html)

动态合图（Dynamic Atlas）功能能在项目运行时动态地将贴图合并到一张大贴图中，从而将相邻的 DrawCall 合并为一个（合批）。当禁用 `CLEANUP_IMAGE_CACHE` 参数时动态合图默认开启；小游戏和原生平台默认禁用（占用额外内存）。

- **强制开启**：`macro.CLEANUP_IMAGE_CACHE = false; DynamicAtlasManager.instance.enabled = true;`（写在项目脚本最外层）。
- **贴图限制**：默认只有宽高都小于 512 的贴图才能进入动态合图，可通过 `dynamicAtlasManager.maxFrameSize = 512` 修改。

### 19.4 原生场景剔除

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/native-scene-culling.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/native-scene-culling.html)

Creator 从 v3.4.0 开始支持原生场景剔除，包括 **八叉树场景剔除** 和 **遮挡查询剔除**，仅对原生平台生效。

- **八叉树场景剔除**：通过八叉树快速剔除不在视锥内的模型。在场景根节点的属性检查器中勾选 **Octree Scene Culling** 下的 Enabled 开启，可配置 World MinPos、World MaxPos、Depth 等属性。
- **遮挡查询剔除**：通过图形 API 进行遮挡查询，若物体被遮挡则只使用简化包围盒及材质渲染。通过 `director.root.pipeline.setOcclusionQueryEnabled(true)` 开启。GLES 2.0 不支持遮挡查询剔除。

**性能优化建议**：如果场景中大部分物体都可见，建议不要开启这两项剔除功能。

### 19.5 程序化创建网格

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/asset/model/scripting-mesh.html](https://docs.cocos.com/creator/3.8/manual/zh/asset/model/scripting-mesh.html)

当由 DCC 软件制作或引擎内地形编辑器制作的模型无法满足需求时，可以通过 API 创建网格。引擎支持两种网格：

- **静态网格**：通过 `utils.MeshUtils.createMesh` 创建，创建成功后网格内的几何体不可编辑。
- **动态网格**：通过 `utils.MeshUtils.createDynamicMesh` 创建，创建成功后网格内的几何体仍可修改。

返回值为 Mesh 组件，可将其赋值给 MeshRenderer 的 mesh 属性显示到屏幕上。

### 19.6 热更新（详见第十六章）

资源热更新的详细内容已在本手册第十六章 16.12 节介绍，包括热更新教程（[hot-update.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update.html)）和热更新管理器（[hot-update-manager.html](https://docs.cocos.com/creator/3.8/manual/zh/advanced-topics/hot-update-manager.html)）。

---

## 附录 升级指南

> 官方入口：[release-notes](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/)

### A.1 升级指南总览

升级指南模块包含以下内容：

- [Cocos Creator 3.0 升级指南](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-guide-v3.0.html)
- [v3.0 材质升级指南](https://docs.cocos.com/creator/3.8/manual/zh/material-system/effect-2.x-to-3.0.html)
- [v3.1 材质升级指南](https://docs.cocos.com/creator/3.8/manual/zh/material-system/Material-upgrade-documentation-for-v3.0-to-v3.1.html)
- [v3.3 动画剪辑数据升级指南](https://docs.cocos.com/creator/3.8/manual/zh/animation/animation-clip-migration-3.3.x.html)
- [v3.5 材质升级指南](https://docs.cocos.com/creator/3.8/manual/zh/material-system/effect-upgrade-documentation-for-v3.4.2-to-v3.5.html)
- [资源分包升级指南](https://docs.cocos.com/creator/3.8/manual/zh/asset/subpackage-upgrade-guide.html)
- [资源管理模块升级指南](https://docs.cocos.com/creator/3.8/manual/zh/asset/asset-manager-upgrade-guide.html)
- [v3.6 构建模板与 settings.json 升级指南](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/build-template-settings-upgrade-guide-v3.6.html)
- [v3.8 Android 工程升级](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-3.8-android.html)

### A.2 Cocos Creator 3.0 升级指南

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-guide-v3.0.html](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-guide-v3.0.html)

Cocos Creator 3.0 集成了原有 2D 和 3D 两套产品的所有功能，带来诸多重大更新。

**版本说明**：Cocos Creator 2.x 的 v2.4 作为 LTS（长期支持）版本提供后续两年持续更新，现有的 v2.x 项目可以安心继续开发，无需强制升级到 v3.0；新项目建议使用 v3.0 版本开发。

**迁移 Cocos Creator 2.x 项目**：点击主菜单 **文件 -> 导入 Cocos Creator 2.x 项目**，选择 v2.x 项目根目录（旧项目推荐先升级到 v2.4.3 或以上版本）。导入插件会先将 JavaScript 转换成 TypeScript，再进行代码迁移，组件在场景中的引用得到保留，函数内部代码以注释形式迁移。

**旧版本开发者快速上手（关键 API 变更）**：

- 节点 UI 相关接口：坐标变换接口（size、anchor）需先获取 `UITransform` 组件再使用；`color` 需先获取渲染组件；`group` 变更为 `layer`；`zIndex` 变更为 UITransform 中的 priority（v3.1 起已弃用，请使用 `setSiblingIndex`）。
- 动态加载资源：加载 sprite-frame 或 texture 时需将路径指定到具体子资源（如 `resources.load('background/spriteFrame', SpriteFrame)`）。
- 全局变量变更：`CC_BUILD` → `BUILD`、`CC_EDITOR` → `EDITOR`、`CC_DEBUG` → `DEBUG` 等。
- sys 平台变量变更：`BAIDU_GAME` → `BAIDU_MINI_GAME`、`VIVO_GAME` → `VIVO_MINI_GAME` 等。
- tween、动画、相机、音频、材质等模块的 API 均有所变更，详见官方升级指南。

### A.3 v3.6 构建模板与 settings.json 升级指南

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/release-notes/build-template-settings-upgrade-guide-v3.6.html](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/build-template-settings-upgrade-guide-v3.6.html)

Cocos Creator 3.6 为优化引擎包体、更好维护引擎业务代码、提供更多定制空间，重构了引擎启动流程并提供新的 settings 配置模块。对美术策划无影响；对程序与插件开发者，主要影响体现在定制的构建模板和 settings.json 需调整为新的方式。

- **application.ejs 迁移**：提供了更简单的 Application 类型定义（`init(cc)` 和 `start()` 两个生命周期回调），引擎启动流程相关逻辑迁移到引擎中，可通过监听引擎启动事件（onPreBaseInitDelegate、onPostBaseInitDelegate 等）和 `game.init` 传入的 `overrideSettings` 执行定制逻辑。
- **settings.json 升级**：配置数据结构改为 Category 与 Property 的两层结构（engine、physics、rendering、assets、plugins、launch、screen、splashScreen 等），新增 screen 下的 frameRate 字段、profiling 下的 showFPS 字段等。

### A.4 v3.8 Android 工程升级

**官方链接**：[https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-3.8-android.html](https://docs.cocos.com/creator/3.8/manual/zh/release-notes/upgrade-3.8-android.html)

从 v3.8 开始，构建产出的 Android 工程默认支持新版本的 Android Studio（Flamingo | 2022.2.1），需要将 JDK 升级到 17，同时升级 Android Studio 到 Flamingo 版本。

如果没有对构建生成的 Android 工程进行配置，可以直接删除 `native/engine/android` 目录和 `build/android` 目录后重新构建（有风险，请谨慎操作）。对于现有原生 Android 工程的升级步骤包括：备份当前工程 → 升级 Gradle 插件版本（8.0.2）→ 移除 package 字段（改为 namespace）→ 升级 Gradle 版本（8.0.2）→ 更新 Proguard Rules → 安装 JDK 17 → 升级 Android Studio。

---


