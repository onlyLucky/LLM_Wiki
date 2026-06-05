# Wiki Schema

## Domain
个人知识库 — 记录日常对话、研究笔记、技术发现和工作汇总。

## Conventions
- File names: lowercase, hyphens, no spaces (e.g., `transformer-architecture.md`)
- Every wiki page starts with YAML frontmatter (see below)
- Use `[[wikilinks]]` to link between pages (minimum 2 outbound links per page)
- When updating a page, always bump the `updated` date
- Every new page must be added to `index.md` under the correct section
- Every action must be appended to `log.md`
- **Provenance markers:** On pages that synthesize 3+ sources, append `^[raw/articles/source-file.md]`
  at the end of paragraphs whose claims come from a specific source.

## Frontmatter
  ```yaml
  ---
  title: Page Title
  created: YYYY-MM-DD
  updated: YYYY-MM-DD
  type: entity | concept | comparison | query | summary | daily
  tags: [from taxonomy below]
  sources: [raw/articles/source-name.md]
  confidence: high | medium | low
  contested: true
  contradictions: [other-page-slug]
  ---
  ```

## Tag Taxonomy
- **daily**: 每日汇总
- **project**: 项目相关
- **tech**: 技术知识
- **research**: 研究笔记
- **meeting**: 会议记录
- **decision**: 决策记录
- **todo**: 待办事项
- **discovery**: 新发现
- **error**: 问题和解决方案
- **config**: 配置相关
- **ai**: AI/ML 相关
- **tool**: 工具使用
- **person**: 人物
- **company**: 公司/组织
- **comparison**: 对比分析
- **timeline**: 时间线
- **controversy**: 争议
- **prediction**: 预测

## Page Thresholds
- **Create a page** when an entity/concept appears in 2+ sources OR is central to one source
- **Add to existing page** when a source mentions something already covered
- **DON'T create a page** for passing mentions, minor details, or things outside the domain
- **Split a page** when it exceeds ~200 lines — break into sub-topics with cross-links
- **Archive a page** when its content is fully superseded — move to `_archive/`, remove from index

## Daily Summary Format
每日汇总文件保存在 `daily/` 目录，格式为 `YYYY-MM-DD.md`，包含：
- 当日对话主题汇总
- 完成的任务
- 关键决策和发现
- 待跟进事项
- 来源平台统计

## Update Policy
When new information conflicts with existing content:
1. Check the dates — newer sources generally supersede older ones
2. If genuinely contradictory, note both positions with dates and sources
3. Mark the contradiction in frontmatter: `contradictions: [page-name]`
4. Flag for user review in the lint report
