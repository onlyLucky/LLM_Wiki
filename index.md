# Wiki Index

> Content catalog. Every wiki page listed under its type with a one-line summary.
> Read this first to find relevant pages for any query.
> Last updated: 2026-09-20 | Total pages: 37

---

## 📂 目录结构

```
wiki/
├── SCHEMA.md        ← 规范定义（命名、标签、格式、阈值）
├── index.md         ← 本文件，总目录
├── log.md           ← 操作日志（追加记录，超 500 条轮转）
├── daily/           ← 📅 每日对话汇总（自动生成）
├── entities/        ← 🏢 实体：人物、公司、产品
├── concepts/        ← 💡 概念：技术知识、理论、方法论
├── comparisons/     ← ⚖️ 对比：方案评估、工具选型
├── queries/         ← 🔍 查询：问题追踪、待解事项
├── raw/             ← 📄 原始资料：文章、文档、摘录
├── reading/         ← 📚 读书笔记
├── learning/        ← 📖 学习笔记
├── content/         ← 📝 内容创作中心
│   ├── README.md           ← 内容创作指南
│   ├── topics/             ← 选题库
│   ├── references/         ← 参考资料
│   ├── drafts/             ← 草稿区
│   ├── xiaohongshu/        ← 小红书内容
│   ├── wechat/             ← 公众号内容
│   ├── bilibili/           ← B站内容
│   └── templates/          ← 内容模板
├── assets/          ← 📦 素材库 笔记中的资源都放置在这里
├── templates/       ← 📝 模板
└── _archive/        ← 🗄️ 归档：已过时的页面
```

### 标签体系

`daily` `project` `tech` `research` `meeting` `decision` `todo` `discovery` `error` `config` `ai` `tool` `person` `company` `comparison` `timeline` `controversy` `prediction` `reading` `content` `xiaohongshu` `wechat` `bilibili`

---

## 📅 Daily Summaries
<!-- 每日对话汇总，按日期倒序排列 -->
- [[daily/2026-09-13]] — webHugo博客一天3次部署(每次sudo备份只留一份) + 360/搜狗/神马站长验证上线 + 神马验证文件远端直改
- [[daily/2026-09-09]] — Wiki分类提交push(闭环09-08待跟进) + 双机器人模型切换glm-5.3-flash并重启gateway + webHugo博客部署(4 commits上线,全200)
- [[daily/2026-09-08]] — Wiki分类提交并push远端：09-03/07每日汇总 + GAMES101第6讲配图补齐（daily+reading两commit，闭环09-07待跟进）
- [[daily/2026-09-07]] — GAMES101第6讲「几何」Obsidian直接编辑：补充21张配图+笔记通俗化完善（无Hermes会话，文件时间戳回退重建）
- [[daily/2026-09-03]] — Wiki每日汇总提交push + AwardWebsites打包部署腾讯云（Next.js静态导出双坑：bind mount inode + demo目录补index.html），部署skill整合
- [[daily/2026-09-02]] — Wiki本地更新分类提交并push（Three.js第12课完成/GAMES101第5讲/neon-sign修复），git提交规则记忆确认
- [[daily/2026-08-31]] — Three.js第12课「噪声函数」苏格拉底问答完成（5道，平均9.92/10）+ 费曼学习法（10/10），第12课标记已完成（9.93/10）
- [[daily/2026-08-30]] — GAMES101第5讲「着色」博客部署、assistant飞书机器人不回复排查与Coding Plan配置切换、Three.js第12课噪声函数问答出题
- [[daily/2026-08-25]] — Three.js第11课「GLSL数学函数」博客生成、代码校验修正、线上部署、Wiki元数据更新
- [[daily/2026-08-16]] — Three.js第11课准备、飞书Gateway多Profile multiplex冲突排查、sessions.json残留清理
- [[daily/2026-08-12]] — Hermes 多 Profile 模型配置排查、default profile 切换至 agnes-2.5-flash、assistant profile 配置冲突修复
- [[daily/2026-08-09]] — Hugo frontmatter损坏修复（games101-transformations.md重复拼接）、GAMES101第3讲SVG封面重新设计、gzh-design skill SVG内嵌方案更新
- [[daily/2026-08-05]] — Three.js 第10课「GLSL 基础」开始（三个ShaderMaterial示例、控制面板、课程笔记和进度跟踪更新）
- [[daily/2026-08-01]] — 飞书网关故障排查（launchd兼容性+消息权限修复）、双Profile网关启动、Three.js课程飞书连接验证
- [[daily/2026-07-30]] — Three.js 第9课动画系统完成（评分9.8/10）、AnimationObjectGroup坑修复、飞书WebSocket连接问题排查
- [[daily/2026-07-29]] — Three.js 第8课问答扩写（消除模糊描述）、第9课「动画系统」完整创建（代码+笔记+作业）
- [[daily/2026-07-28]] — Three.js 第8课「GLTF 模型加载实战」公众号文章与封面制作、课后作业补充
- [[daily/2026-07-27]] — Three.js 课程进度查询与复习、第7课微信公众号文章生成、第8课「模型加载」开始
- [[daily/2026-07-26]] — 飞书网关启动配置、消息路由重启、macOS 26 launchd 兼容性问题
- [[daily/2026-07-24]] — Three.js 06课公众号文章完善、WebHugo博客部署、Wiki提交推送、Flutter入门咨询
- [[daily/2026-07-23]] — Three.js课程笔记结构清理（第5/6课）、第6课课后作业重新设计启动、第7课场景图与变换开始
- [[daily/2026-07-22]] — 英文版Series描述修复部署、GAMES101第2课博客文章、静态资源清理
- [[daily/2026-07-21]] — Hugo英文国际化修复、GAMES101第2课博客、Fast Render修复、部署规范确立
- [[daily/2026-07-19]] — Hugo博客部署到腾讯云、第5课课后作业文档整合、学习进度日期修正
- [[daily/2026-07-16]] — Three.js 第4课资源问题解决、Suzanne模型上传与GLTFLoader升级、静态资源存放规范
- [[daily/2026-07-10]] — Three.js 课程进度查询、前两课核心知识点复习
- [[daily/2026-07-08]] — 飞书群聊免@配置、Three.js 第2/3课教学、代码参数注释规范
- [[daily/2026-07-07]] — Three.js 课程讲义格式规范化、第1课/第2课讲义重写、学习笔记体系梳理
- [[daily/2026-07-06]] — GAMES101 笔记推送、AI加速学习六种方法文档、Three.js+GLSL 4周学习计划、threejs_creative_3d 项目搭建
- [[daily/2026-06-30]] — Wiki Git 提交规范制定（Conventional Commits）、GAMES101 齐次坐标笔记优化推送
- [[daily/2026-06-29]] — 读书笔记扩写（《奇妙的JavaScript》973行/43K字）、飞书Gateway停运3天修复、微信读书API鉴权失败
- [[daily/2026-06-22]] — animejs.com 离线复刻：wget 全站爬取、本地服务器搭建、GLB 3D 模型补齐、Draco 解码器本地化
- [[daily/2026-06-16]] — 前端部署上线流程（域名/备案/HTTPS）、域名基础知识、ICP 备案详解、CityMemory 项目冻结
- [[daily/2026-06-15]] — 飞书任务 API 脚本工程化（token 自动续期）、离线网站存储迁移到 AwardWebsites、3 个飞书任务完成
- [[daily/2026-06-14]] — 离线网站复刻工程：follow.art 智能回退服务器、shader.se 3D+Draco 本地化、igloo.inc Three.js 冰屋场景（10 个 git 提交）
- [[daily/2026-06-10]] — 内容创作体系搭建：SOP学习、Wiki内容中心创建、选题库建立（27题）、游戏开发全流程速通大纲+小红书图文版
- [[daily/2026-06-08]] — Playwright 自动化能力咨询、飞书会话继续、Cron 汇总任务正常执行
- [[daily/2026-06-07]] — 周日休息，无用户会话（仅 Cron 自动汇总执行）
- [[daily/2026-06-06]] — 工作日无用户会话（仅 Cron 自动汇总执行）
- [[daily/2026-06-05]] — 读书笔记工作流优化、Hermes 知识库 Skill、橙皮书精读、Token 优化策略、看板 UI 更新
- [[daily/2026-06-04]] — macOS 辅助功能权限、Agent Skills 橙皮书精读笔记、飞书消息无响应排查
- [[daily/2026-06-03]] — Hermes 安装配置、Wiki 搭建、飞书 Markdown 渲染、多 Agent 设置

## 📚 Reading Notes
<!-- 读书笔记，按阅读日期倒序排列 -->
- [[reading/Agent-Skills-橙皮书]] — Agent Skills 完全指南：SKILL.md 结构、6 种设计模式、Goldilocks Zone、Skills 经济、实战案例 | 花叔 | 2026-06-05
- [[reading/罗辑思维]] — 从认知、历史、商业、人物、人文五维度升级认知：刺猬与狐狸、策略性同理心、品牌共识、网络小说三公式 | 罗振宇 | 2026-06-14

## 📖 Learning
<!-- 学习笔记 -->
- [[learning/内容创作全流程SOP_从0到1到100]] — 内容创作全流程SOP：选题策划→大纲设计→文案撰写→脚本分镜→画面生成→话本稿→多平台输出 | 2026-06-10
- [[learning/计算机图形学/GAMES101/README]] — GAMES101 现代计算机图形学课程笔记：8 章完整笔记（闫令琪 | UCSB） | 2026-07-05
- [[learning/前端/GLSL_Shader/README]] — GLSL Shader 三天实战课程（全部完成）：三天从原生 WebGL2/GLSL 语法到 SDF·噪声·调色视觉算法再到 Three.js ShaderMaterial 实战，20 篇讲义 + 15 demo + 9 作业（含答案）+ 12 张 SVG 图解，npm run dev 即学 | 2026-09-20

## 📝 Content Creation
<!-- 内容创作中心 -->
- [[content/README]] — 内容创作指南：目录结构、分类体系、创作流程、多平台适配策略 | 2026-06-10
- [[content/topics/topic-pool]] — 选题库：AI工具、全栈开发、游戏开发、学习成长四大类选题 | 2026-06-10
- [[content/references/sop]] — 内容创作参考资料：平台运营、写作技巧、素材收集 | 2026-06-10

## 🛠️ Skills
<!-- 自定义 Skills -->
- [[skills/reading-notes]] — 读书笔记技能：从书籍、文章中提取关键信息，创建结构化读书笔记 | 2026-06-04

## 🏢 Entities
<!-- 人物、公司、产品等 -->

## 💡 Concepts
<!-- 技术概念、知识点、方法论 -->

## ⚖️ Comparisons
<!-- 方案对比、工具选型、优劣分析 -->

## 🔍 Queries
<!-- 问题追踪、待解事项、调研任务 -->

## 📚 Learning
