# [项目名称]

> [一句话：项目做什么、给谁用、解决什么问题]

## 快速开始

```bash
# 安装依赖
[安装命令]

# 启动本地开发
[开发命令]

# 运行测试
[测试命令]
```

## 项目结构

采用「根目录入口 + `.agents/specs/` 分阶段编号 + `.agents/` Agent 上下文」结构，所有文档进 Git、与代码同仓库。

```
project-root/
├── AGENTS.md          # AI 总入口
├── README.md          # 人类入口（本文件）
├── .agents/           # Agent 专用上下文
│   ├── specs/         # 规格契约层（AI 的单一事实来源）
│   ├── plans/         # 实施计划（README 为入口）
│   ├── tasks/         # 任务清单（README 为入口）
│   └── logs/          # 开发日志（README 为入口）
├── docs/              # 非规格文档
├── src/               # 源码
├── tests/             # 测试代码
├── scripts/           # 脚本
└── .github/workflows/ # CI/CD
```

## 文档导航

- 规格总索引：[.agents/specs/INDEX.md](.agents/specs/INDEX.md)
- AI 协作入口：[AGENTS.md](AGENTS.md)
- 技术架构：[.agents/specs/02-design/architecture.md](.agents/specs/02-design/architecture.md)
- 变更记录：[.agents/specs/06-iteration/changelog.md](.agents/specs/06-iteration/changelog.md)

## 贡献指南

- 分支策略与提交规范见 [.agents/rules.md](.agents/rules.md)
- 代码变更需同步更新对应的 `.agents/specs/` 文档，文档与代码在同一 PR 中维护
- 提交信息使用约定式提交（Conventional Commits）