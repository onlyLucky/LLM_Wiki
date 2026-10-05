# 质量门禁（Gate）— [项目名称]

> **给 AI**：本文档定义阶段之间的**检查点（Gate）**。进入下一阶段前，必须确认当前 Gate 已通过；未通过不得继续。人类保留最终决策权。

| 阶段 | 优先级 | 状态 | 负责人 | 最后更新 |
|------|--------|------|--------|----------|
| 03 计划、任务与门禁 | 高 | 草稿 | [@角色] | YYYY-MM-DD |

**上游**：[prd.md](../product/prd.md)、[acceptance-criteria.md](../product/acceptance-criteria.md) ｜ **下游**：[plans/template.md](../../plans/template.md)、[tasks/template.md](../../tasks/template.md)

## 门禁总览

| Gate | 节点 | 通过后方可进入 |
|------|------|----------------|
| Gate 1 | 需求评审 | 阶段二 架构与设计 |
| Gate 2 | 设计评审 | 阶段三 开发与执行 |
| Gate 3 | 开发评审 | 阶段四 测试与质量 |
| Gate 4 | 发布评审 | 阶段五 部署与上线 |

## Gate 1：需求评审

- [ ] `brief.md` / `scope.md` / `prd.md` 完成并评审通过
- [ ] 验收标准可操作、可验证（无"体验良好"类表述）
- [ ] 非目标（Non-Goals）已明确

## Gate 2：设计评审

- [ ] `architecture.md` / `data-model.md` / `api-contract.md` 完成
- [ ] 接口契约已冻结
- [ ] 关键技术决策已登记 ADR

## Gate 3：开发评审

- [ ] 任务清单全部完成
- [ ] 代码通过 Lint / 类型检查
- [ ] 关键模块通过独立评审

## Gate 4：发布评审

- [ ] 测试策略执行完毕，验收证据齐全
- [ ] 安全清单通过
- [ ] 回滚方案就绪

## 待解决问题

- [ ] [门禁标准待定问题]