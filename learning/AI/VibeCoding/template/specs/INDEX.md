# 规格文档总索引

> **给 AI**：这是所有规格文档的**导航图**。进入任务时先读本文件，按「读取优先级」决定加载哪些文档，避免一次性读入全部上下文导致过载。

| 阶段 | 优先级 | 状态 | 负责人 | 最后更新 |
|------|--------|------|--------|----------|
| 全程 | 极高 | 进行中 | [@维护者] | YYYY-MM-DD |

## 读取优先级说明

| 级别 | 含义 |
|------|------|
| 极高 | 每次任务必读 |
| 高 | 涉及对应阶段时必读 |
| 中高 | 涉及对应操作时读取 |
| 中 | 需要时查阅 |

## 文档清单

| 路径 | 用途 | 阶段 | 读取优先级 | 状态 |
|------|------|------|-----------|------|
| `01-product/brief.md` | 项目简报：为什么做、为谁做 | 01 | 高 | 草稿 |
| `01-product/scope.md` | 范围定义：做什么、不做什么 | 01 | 高 | 草稿 |
| `01-product/prd.md` | 产品需求：功能清单与验收标准 | 01 | 高 | 草稿 |
| `01-product/user-stories.md` | 用户故事 | 01 | 高 | 草稿 |
| `01-product/acceptance-criteria.md` | 验收标准：可判定的验收项 | 01 | 高 | 草稿 |
| `02-design/architecture.md` | 技术架构、模块划分 | 02 | 高 | 草稿 |
| `02-design/data-model.md` | 数据模型 | 02 | 高 | 草稿 |
| `02-design/api-contract.md` | 接口契约 | 02 | 高 | 草稿 |
| `02-design/design-system.md` | UI 设计规范 | 02 | 高 | 草稿 |
| `02-design/environments.md` | 环境与变量配置 | 02 | 中高 | 草稿 |
| `02-design/adr/` | 架构决策记录 | 02 | 中 | 草稿 |
| `03-execution/tasks.md` | 任务清单 | 03 | 极高 | 草稿 |
| `03-execution/milestones.md` | 里程碑 | 03 | 中高 | 草稿 |
| `03-execution/dev-log.md` | 开发日志 | 03 | 高 | 草稿 |
| `04-quality/test-strategy.md` | 测试策略 | 04 | 高 | 草稿 |
| `04-quality/test-cases.md` | 测试用例 | 04 | 高 | 草稿 |
| `04-quality/acceptance-evidence.md` | 验收证据映射 | 04 | 高 | 草稿 |
| `04-quality/security-checklist.md` | 安全清单 | 04 | 高 | 草稿 |
| `04-quality/performance.md` | 性能报告 | 04 | 中高 | 草稿 |
| `05-operations/deployment.md` | 部署文档 | 05 | 中高 | 草稿 |
| `05-operations/ci-cd.md` | CI/CD 说明 | 05 | 中高 | 草稿 |
| `05-operations/monitoring.md` | 监控与告警 | 05 | 中高 | 草稿 |
| `05-operations/runbook.md` | 运行手册 | 05 | 中高 | 草稿 |
| `05-operations/rollback.md` | 回滚方案 | 05 | 中高 | 草稿 |
| `06-iteration/changelog.md` | 变更记录 | 06 | 中 | 草稿 |
| `06-iteration/roadmap.md` | 路线图 | 06 | 中 | 草稿 |
| `06-iteration/feedback.md` | 用户反馈 | 06 | 中 | 草稿 |
| `06-iteration/retrospective.md` | 复盘 | 06 | 中 | 草稿 |

## 维护约定

- 新增 / 删除文档后**必须同步更新本索引**
- 文档状态取值：`草稿` / `评审中` / `已冻结` / `已废弃`
- 「已冻结」的契约文档（如 `api-contract.md`）修改需走评审，见 `AGENTS.md` 质量门禁