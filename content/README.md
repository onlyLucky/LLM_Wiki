# Wiki 内容输出结构规划

> 目标：以 wiki 为中心，建立「内容工厂」，统一创作，多平台分发
> 版本：v2.0 | 2026-06-10

---

## 一、整体结构

```
~/wiki/
├── index.md                    # 首页/导航
├── log.md                      # 更新日志
│
├── daily/                      # 每日笔记（已有）
├── reading/                    # 读书笔记（已有）
├── learning/                   # 学习笔记（已有）
│
├── content/                    # 【新增】内容创作中心
│   ├── README.md               # 本文件，内容创作指南
│   │
│   ├── topics/                 # 选题库
│   │   └── topic-pool.md       # 选题列表
│   │
│   ├── references/             # 参考资料
│   │   └── sop.md              # 内容创作SOP
│   │
│   ├── drafts/                 # 草稿区（统一存放，用 tags 区分类型）
│   │
│   ├── xiaohongshu/            # 小红书内容（已发布）
│   ├── wechat/                 # 公众号内容（已发布）
│   ├── bilibili/               # B站内容（已发布）
│   │
│   └── templates/              # 内容模板
│       ├── outline-template.md     # 大纲模板
│       ├── xiaohongshu-template.md # 小红书模板
│       ├── wechat-template.md      # 公众号模板
│       └── bilibili-template.md    # B站模板
│
└── assets/                     # 素材库
    ├── images/                 # 文章配图
    ├── screenshots/            # 截图素材
    └── code/                   # 代码片段
```

---

## 二、内容分类体系

### 2.1 按平台分目录

| 平台 | 目录 | 内容形式 | 特点 |
|------|------|---------|------|
| 小红书 | content/xiaohongshu/ | 图文笔记 | 1000字内，实用干货，关键截图 |
| 公众号 | content/wechat/ | 长图文 | 3000字，深度论述，代码展示 |
| B站 | content/bilibili/ | 视频+专栏 | 5-10分钟，口播稿，画面分镜 |

### 2.2 用 Tags 标记内容类型

在文档头部用 YAML frontmatter 标记：

```yaml
---
title: "文章标题"
date: 2026-06-10
tags: [ai, coding-tools, productivity]  # 内容类型标签
status: published
---
```

**可用标签**：
- 内容类型：`ai` / `dev` / `game` / `growth`
- 细分方向：`coding-tools` / `web-dev` / `unity` / `learning-methods` 等
- 内容形式：`tutorial` / `review` / `sharing` / `pitfalls` 等

### 2.3 搜索方式

| 需求 | 方法 |
|------|------|
| 找某平台内容 | 直接进对应目录（xiaohongshu/wechat/bilibili） |
| 找某类型内容 | 用 Obsidian 搜索 tags（如搜索 `ai` 找所有AI相关内容） |
| 找某篇内容 | 按文件名搜索（YYYY-MM-DD-标题.md） |

---

## 三、文件命名规范

### 3.1 草稿文件

```
格式：YYYY-MM-DD-简短标题.md
示例：
  - 2026-06-10-ai-coding-tools-review.md
  - 2026-06-12-citymemory-project-showcase.md
  - 2026-06-15-react-form-state-pitfalls.md
```

### 3.2 已发布文件

```
格式：YYYY-MM-DD-简短标题.md
示例：
  - 2026-06-10-ai-coding-tools-review.md（小红书版）
  - 2026-06-10-ai-coding-tools-review.md（公众号版）
  - 2026-06-10-ai-coding-tools-review.md（B站版）
```

**注意**：同一篇内容在不同平台可以有相同文件名，因为目录不同。

---

## 四、单篇内容结构

### 4.1 标准文档结构

```yaml
---
title: "文章标题"
date: 2026-06-10
tags: [ai, coding-tools, tutorial]
status: draft/published
platform: xiaohongshu/wechat/bilibili
---

# 文章标题

## 核心观点（一句话总结）

## 正文内容
...

## 关键要点
- 要点1
- 要点2
- 要点3

## 代码/截图
...

## 参考资料
- [链接1](url)
- [链接2](url)
```

---

## 五、内容创作流程

### 5.1 流程步骤

```
Step 1: 记录想法
  └─ content/drafts/ 下创建草稿文件
  └─ 用 tags 标记内容类型

Step 2: 收集素材
  └─ 在草稿中添加链接、截图、代码片段
  └─ 素材存放到 assets/ 对应目录

Step 3: 设计大纲
  └─ 使用 templates/outline-template.md

Step 4: 撰写正文
  └─ 在草稿中完成初稿

Step 5: 多平台适配
  └─ 将内容适配到各平台目录
  └─ xiaohongshu/：1000字内图文版
  └─ wechat/：3000字深度版
  └─ bilibili/：视频脚本版

Step 6: 发布
  └─ 更新 status 为 published
  └─ 更新 log.md 记录

Step 7: 复盘
  └─ 记录数据反馈，优化下一篇
```

### 5.2 内容流转

```
content/drafts/（草稿）
      │
      ↓ 适配完成
content/xiaohongshu/  ─→ 发布到小红书
content/wechat/       ─→ 发布到公众号
content/bilibili/     ─→ 发布到B站
```

---

## 六、目录结构详解

### 6.1 content/topics/（选题库）

```
content/topics/
└── topic-pool.md       # 统一选题列表，按类型分类
```

**选题来源**：
- 日常开发遇到的问题
- 学习笔记和技术总结
- 热点追踪和趋势分析

### 6.2 content/references/（参考资料）

```
content/references/
└── sop.md              # 内容创作SOP和方法论
```

**参考内容**：
- 平台运营策略
- 写作技巧和公式
- 素材收集方法

### 6.3 content/drafts/（草稿区）

所有草稿统一存放，用 tags 区分类型：

```
content/drafts/
├── 2026-06-10-ai-coding-tools.md       # tags: [ai, coding-tools]
├── 2026-06-12-citymemory-showcase.md    # tags: [dev, web-dev]
├── 2026-06-15-react-best-practices.md   # tags: [dev, react]
├── 2026-06-18-unity-vs-godot.md         # tags: [game, engine]
└── 2026-06-20-learning-methods.md       # tags: [growth, learning]
```

### 6.4 content/xiaohongshu/（小红书）

```
content/xiaohongshu/
├── 2026-06-10-ai-coding-tools.md
├── 2026-06-12-citymemory-showcase.md
├── 2026-06-15-react-best-practices.md
└── index.md  # 内容索引
```

### 6.5 content/wechat/（公众号）

```
content/wechat/
├── 2026-06-10-ai-coding-tools.md
├── 2026-06-12-citymemory-showcase.md
└── index.md
```

### 6.6 content/bilibili/（B站）

```
content/bilibili/
├── 2026-06-10-ai-coding-tools.md
├── 2026-06-12-citymemory-showcase.md
└── index.md
```

### 6.7 content/templates/（模板）

```
content/templates/
├── outline-template.md         # 大纲模板
├── xiaohongshu-template.md     # 小红书图文模板
├── wechat-template.md          # 公众号长文模板
├── bilibili-template.md        # B站视频模板
└── README.md                   # 模板使用说明
```

### 6.8 assets/（素材库）

```
assets/
├── images/                     # 文章配图
│   ├── 2026-06-10-ai-coding-tools-01.png
│   └── 2026-06-12-citymemory-demo.jpg
│
├── screenshots/                # 截图素材
│   ├── cursor-interface.png
│   └── citymemory-screenshot.png
│
└── code/                       # 代码片段
    ├── react-form-example.tsx
    └── koa-api-example.ts
```

---

## 七、多平台适配策略

### 7.1 内容复用逻辑

```
原始内容（drafts/草稿）
    │
    ├──→ xiaohongshu/：提取核心要点，1000字内
    │     └─ 重点：实用干货、关键截图、话题标签
    │
    ├──→ wechat/：扩写深度内容，3000字
    │     └─ 重点：完整论述、代码展示、数据支撑
    │
    └──→ bilibili/：转化为视频脚本，5-10分钟
          └─ 重点：口播稿、画面分镜、节奏设计
```

### 7.2 适配检查清单

**小红书版本**：
- [ ] 标题含关键词，有数字/痛点
- [ ] 前30字有强钩子
- [ ] 内容分段清晰，多用emoji分隔
- [ ] 结尾有CTA（收藏/关注）
- [ ] 添加3-5个话题标签

**公众号版本**：
- [ ] 标题有深度感（为什么/如何/揭秘）
- [ ] 开头用SCQA模型
- [ ] 正文金字塔结构，结论先行
- [ ] 代码片段格式化
- [ ] 结尾有互动引导

**B站版本**：
- [ ] 前3秒有强钩子
- [ ] 每5秒一个信息点
- [ ] 标注节奏点和转场
- [ ] 准备封面图概念
- [ ] 结尾有三连引导

---

## 八、与现有结构的整合

### 8.1 现有目录用途

| 目录 | 用途 | 与内容输出的关系 |
|------|------|-----------------|
| daily/ | 每日记录 | 可从中提取内容灵感 |
| reading/ | 读书笔记 | 可作为内容素材来源 |
| learning/ | 学习笔记 | 可转化为教程内容 |

### 8.2 内容流转

```
daily/reading/learning/
         │
         ↓ 提取有价值的内容
    content/drafts/
         │
         ↓ 整理、适配
    content/xiaohongshu/  ─→ 发布到小红书
    content/wechat/       ─→ 发布到公众号
    content/bilibili/     ─→ 发布到B站
```

---

## 九、执行建议

### 9.1 创建目录结构

```bash
mkdir -p ~/wiki/content/{drafts,xiaohongshu,wechat,bilibili,templates,topics,references}
mkdir -p ~/wiki/assets/{images,screenshots,code}
```

### 9.2 创建模板文件

- 大纲模板
- 小红书模板
- 公众号模板
- B站模板

### 9.3 开始创作

1. 在 content/topics/topic-pool.md 中选择选题
2. 在 drafts/ 下创建草稿文件
3. 用 tags 标记内容类型
4. 使用大纲模板设计结构
5. 撰写内容
6. 适配到各平台目录
7. 发布到各平台

---

## 十、注意事项

1. **版本控制**：所有内容都在 git 管控下，修改后记得 commit
2. **备份重要**：定期推送到远程仓库
3. **标签系统**：善用 tags 方便后续检索
4. **链接互联**：在内容中添加 wiki 内部链接，形成知识网络
5. **持续迭代**：根据发布后的数据反馈，优化内容策略

---

## 十一、搜索示例

### 场景1：找所有AI相关内容
在 Obsidian 中搜索 `tag:ai`

### 场景2：找所有小红书内容
直接浏览 `content/xiaohongshu/` 目录

### 场景3：找某篇具体内容
按文件名搜索，如 `2026-06-10-ai-coding-tools`

### 场景4：找某个平台的AI内容
在 `content/xiaohongshu/` 目录中搜索 `tag:ai`

---

## 十二、相关链接

- [[learning/内容创作全流程SOP_从0到1到100]] — 完整SOP
- [[content/topics/topic-pool]] — 选题库
- [[content/references/sop]] — 参考资料
- [[index]] — Wiki 总目录
