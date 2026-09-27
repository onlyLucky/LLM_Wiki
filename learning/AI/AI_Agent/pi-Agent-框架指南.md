# pi Agent 框架指南

> 依据 pi.dev 官方文档（docs/latest）整理，核对日期 2026-09-26。所有命令与配置均来自官方页面；pi 迭代较快，使用前建议对照 [官方文档](https://pi.dev/docs/latest) 确认版本差异。

## 1. pi 是什么

pi 是 Earendil Works 开发的极简终端编程 Agent（minimal agent harness），npm 包名 `@earendil-works/pi-coding-agent`，MIT 开源。由 libGDX 作者 Mario Zechner 于 2025 年 11 月发布，Flask 与 Jinja 作者 Armin Ronacher 参与开发。

官网首页把它的立场一句话讲透：

> "There are many agent harnesses, but this one is yours."
> ——极简 Agent harness，让工具适应你的工作流，而不是反过来。

它的核心设计哲学只有一条：**内核小到能被一个人完整理解**。模型默认只拿到四个工具，会话是一棵可回溯的 JSONL 树，其余一切能力（MCP、子 Agent、计划模式、权限确认……）都不进内核——要么明确不做，要么做成可插拔的扩展。

## 2. 核心概念速览

| 概念 | 一句话说明 |
|---|---|
| Agent harness | 包裹模型的执行环境：管理会话、注册工具、渲染界面、注入上下文 |
| 四件套 | 默认给模型的四个工具：`read` / `write` / `edit` / `bash` |
| 会话树 | 单文件 JSONL，每条记录带 `id` 与 `parentId`，形成可回跳、可分叉的树 |
| Compaction | 接近上下文上限时自动把旧消息摘要压缩，原始记录仍留在会话树中 |
| 上下文文件 | `AGENTS.md` / `CLAUDE.md` 项目指令，`SYSTEM.md` 控制系统提示 |
| 扩展 | 一个 TypeScript 模块，用几个注册面挂进 Agent 生命周期 |
| Skills | 实现 Agent Skills 开放标准的 SKILL.md 能力包，渐进式披露 |
| Pi Package | 把扩展、技能、模板、主题打包，经 npm / git 分发 |

**刻意不内置的能力**（[官方主页](https://pi.dev/) "What we didn't build"）：

| 能力 | 官方立场 |
|---|---|
| MCP | 明确不实现——官方建议优先用带 README 的 CLI 工具或 Skills，确需 MCP 时自建扩展接入 |
| Sub-agents | 不内置；可用 tmux 派生 pi 实例，或用官方示例扩展 `subagent/` |
| Plan mode | 不内置；官方示例扩展 `plan-mode/` 提供 Claude Code 式 `/plan` |
| 权限弹窗 | 不内置；官方示例 `permission-gate.ts` 等实现危险命令确认 |
| 内置 TODO | 不内置，用 TODO.md；官方示例 `todo.ts` 提供工具化版本 |
| 进程内沙盒 | 不内置；官方建议容器隔离（见第 17 节） |

## 3. 安装与快速上手

### 3.1 安装

```bash
# macOS / Linux
curl -fsSL https://pi.dev/install.sh | sh
# Windows PowerShell
powershell -c "irm https://pi.dev/install.ps1 | iex"
# 包管理器（--ignore-scripts 是官方推荐参数）
npm install -g --ignore-scripts @earendil-works/pi-coding-agent
pnpm add -g --ignore-scripts @earendil-works/pi-coding-agent
bun add -g --ignore-scripts @earendil-works/pi-coding-agent
```

卸载用对应包管理器即可；`~/.pi/agent/` 中的设置、凭据、会话与已装包会保留。

### 3.2 认证（两种方式）

```bash
# 方式一：订阅登录（交互模式中运行 /login，选择 provider）
#   内置支持：Claude Pro/Max、ChatGPT Plus/Pro (Codex)、GitHub Copilot
#   凭据存入 ~/.pi/agent/auth.json

# 方式二：API key 环境变量（或 /login 时选择 API-key provider 持久保存）
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-...
export GEMINI_API_KEY=...
export DEEPSEEK_API_KEY=...
```

auth.json 中还支持 `!command` 前缀从命令读取 key（如 macOS `security find-generic-password`、1Password `op read`），输出缓存在进程生命周期内。

命令行校验：`pi auth check`（返回 ready / not_ready / invalid，退出码 0 / 1 / 2）、`pi auth print-api-key`。

### 3.3 三步跑通第一次 Agent 循环

```bash
cd /path/to/project && pi     # 1. 进入项目目录启动
/login                        # 2. 首次运行选择登录方式
# 3. 直接输入请求，例如：
#    "Summarize this repository and tell me how to run its checks"
#    观察 read / write / edit / bash 的调用循环与终止条件
```

项目级指令写入项目根目录的 `AGENTS.md`，随每次会话自动注入；修改后 `/reload` 生效。

## 4. 架构：四个包各管一层

pi 是一个 monorepo，四层职责切开，每层都小到可以一次读完：

| 包 | 职责 |
|---|---|
| `pi-ai` | 统一 LLM API：只抽象 openai-completions、openai-responses、anthropic-messages、google-generative-ai 四种底层 API；多 provider、流式、工具调用（TypeBox schema 校验）、thinking 跨 provider 交接、token 与成本追踪 |
| `pi-agent-core` | agent loop：处理用户消息 → 执行工具调用 → 结果回传模型，循环直到模型不再调工具；刻意不设最大步数 |
| `pi-tui` | 差分渲染的极简终端界面框架 |
| `pi-coding-agent` | CLI：会话管理、扩展 / 技能 / 模板 / 主题装载、上下文文件 |

阅读顺序建议：先读作者博客《What I learned building an opinionated and minimal coding agent》做导读，再按 `packages/ai`（agent-loop.ts）→ `packages/agent`（Agent 类）→ `packages/coding-agent`（system-prompt 与扩展装载）通读源码。

## 5. 会话管理

### 5.1 存储与结构

- 位置：`~/.pi/agent/sessions/--<path>--/<timestamp>_<session-id>.jsonl`，按工作目录分组（路径中的 `/` `\` `:` 替换为 `-`）
- 结构：每行一个 JSON 对象；除 SessionHeader 外所有条目含 `id` 与 `parentId`，构成树；当前叶子决定活跃分支
- 覆盖存储位置：`--session-dir`（CLI）> `PI_CODING_AGENT_SESSION_DIR`（环境变量）> `sessionDir`（settings）

### 5.2 分支三命令

| 命令 | 效果 |
|---|---|
| `/tree` | 在**同一文件内**移动到任意历史节点；选中用户消息会放回编辑器，改完提交即创建新分支 |
| `/fork` | 从更早的用户消息创建**新会话** |
| `/clone` | 把当前活跃分支复制到新会话 |

CLI 侧等价操作：`pi --continue`（继续最近）、`pi --resume`（选择器）、`pi --session <path|id>`、`pi --fork`、`--no-session`（内存会话）、`--name`。离开分支时 pi 可自动生成分支摘要（BranchSummaryEntry）。

### 5.3 Compaction（自动摘要压缩）

- 触发条件：`contextTokens > contextWindow - reserveTokens`（`reserveTokens` 默认 16384，`keepRecentTokens` 默认 20000）
- 手动：`/compact [instructions]`，可给摘要指示
- 过程：从最新往回找**合法切点**（用户消息、assistant 消息、BashExecution、custom 消息；绝不切在 tool result 上）→ LLM 生成结构化摘要（Goal / Constraints / Progress / Key Decisions / Next Steps / Critical Context + 已读/已改文件清单）→ 追加 CompactionEntry → 上下文重建为"摘要 + 保留段"；**原始条目仍留在会话树中**
- 单个 turn 超过 keepRecentTokens 时会"split turn"，生成两份摘要合并
- 相关设置：`compaction.enabled`（默认 true）、`reserveTokens`、`keepRecentTokens`、`modelOverrides`（按 `provider/modelId` 精确匹配指定压缩模型）
- 扩展钩子：`session_before_compact`（可取消或提供自定义摘要）、`session_compact_failed`、`session_before_tree`

## 6. 上下文工程（AGENTS.md / SYSTEM.md）

加载层级（自上而下合并）：

1. `~/.pi/agent/AGENTS.md`——全局用户指令
2. 父目录与当前目录中的 `AGENTS.md` 或 `CLAUDE.md`
3. 同一目录存在 `AGENTS.override.md` 时，加载它**代替**该目录的 AGENTS.md / CLAUDE.md

系统提示控制（放 `~/.pi/agent/` 或受信任的项目 `.pi/` 目录）：

| 文件 | 作用 |
|---|---|
| `SYSTEM.md` | 整体替换默认系统提示 |
| `APPEND_SYSTEM.md` | 向系统提示追加指令 |

项目文件优先于 agent 目录同名文件（同名不合并）。CLI 一次性注入：`--system-prompt <text|path>`、`--append-system-prompt`（可重复）；`--no-context-files` 禁用全部发现。修改后用 `/reload` 重载。

## 7. 模型与 Provider

### 7.1 内置 Provider

约 30 家：订阅直连（Claude Pro/Max、ChatGPT、GitHub Copilot）+ API key 直连（Anthropic、OpenAI、Azure、Google Gemini/Vertex、Bedrock、DeepSeek、Mistral、Groq、Cerebras、xAI、OpenRouter、Hugging Face、Kimi、MiniMax、Moonshot、Qwen、小米 MiMo、Fireworks、Together、NVIDIA、Vercel AI Gateway 等）。

### 7.2 切换与思考级别

| 操作 | 命令 / 快捷键 |
|---|---|
| 打开模型选择器 | `/model` 或 `Ctrl+L` |
| 保存为启动默认 | 选择器内 `Ctrl+S` |
| 切换思考级别 | `/thinking` 或 `Shift+Tab` |
| 循环切换 | `Ctrl+P` / `Shift+Ctrl+P` |
| 限定候选范围 | `/scoped-models`、CLI `--models`、settings `enabledModels` / `scopedModels` |

### 7.3 自定义模型（~/.pi/agent/models.json）

```json
{
  "providers": {
    "ollama": {
      "baseUrl": "http://localhost:11434/v1",
      "api": "openai-completions",
      "apiKey": "ollama",
      "compat": { "supportsDeveloperRole": false, "supportsReasoningEffort": false },
      "models": [
        {
          "id": "llama3.1:8b",
          "name": "Llama 3.1 8B (Local)",
          "reasoning": false,
          "input": ["text"],
          "contextWindow": 128000,
          "maxTokens": 32000,
          "cost": { "input": 0, "output": 0, "cacheRead": 0, "cacheWrite": 0 }
        }
      ]
    }
  }
}
```

要点：

- 支持的 `api` 类型：`openai-completions`、`openai-responses`、`anthropic-messages`、`google-generative-ai`（扩展级 custom provider 另支持 azure-openai-responses、openai-codex-responses、mistral-conversations、google-vertex、bedrock-converse-stream）
- 每个模型只有 `id` 必填；`thinkingLevelMap` 可把 pi 的 off/minimal/low/medium/high/xhigh/max 级别映射到 provider 值
- `apiKey` 与 `headers` 值支持三种写法：`!command` 前缀执行 shell 命令取 stdout；`$ENV_VAR` / `${ENV_VAR}` 环境变量插值；纯字面量
- 只写 `baseUrl` 即可为内置 provider 走代理且保留内置模型；带 `models` 数组时按 `id` upsert（同 id 替换内置）
- 文件在每次打开 `/model` 时自动重载，改完不用重启

### 7.4 llama.cpp 本地模型

```bash
# router 模式启动（不带 --model）
llama-server --models-dir ~/models --no-models-autoload --jinja \
  --host 127.0.0.1 --port 8080 -ngl 999 -c 32768
```

pi 侧：`/login llama.cpp`（默认地址 `http://127.0.0.1:8080`）；`/llama` 管理模型加载 / 卸载 / 从 Hugging Face 下载。环境变量 `LLAMA_BASE_URL`、`LLAMA_API_KEY`。Ollama / vLLM / LM Studio 等 OpenAI 兼容端点则走 models.json 的 `openai-completions`。

## 8. 工具系统

### 8.1 默认四件套与可选工具

| 工具 | 行为 |
|---|---|
| `read` | 读文件与支持的图片 |
| `write` | 创建 / 覆盖文件 |
| `edit` | 对现有文件做精确文本替换 |
| `bash` | 运行 shell 命令（Windows 为 `powershell`） |
| `grep` | 搜索文件内容（可选） |
| `find` | glob 模式查找路径（可选） |
| `ls` | 列目录（可选） |

### 8.2 启用与禁用

```bash
pi --tools read,grep,find,ls --print "Review this project"   # -t 替换默认选择
pi -xt bash          # --exclude-tools 排除指定工具
pi -nbt              # --no-builtin-tools 只留扩展/自定义工具
pi -nt               # --no-tools 全部禁用
```

settings 中 `defaultTools`（string[]，默认 `["read","bash","edit","write"]`，空数组 = 无内置但保留扩展工具）。

## 9. 扩展开发

### 9.1 文件位置与加载

- 用户级：`~/.pi/agent/extensions/`
- 项目级：`.pi/extensions/`（需 project trust）
- 形态：直接 `.ts` / `.js` 文件，或含 `index.ts` / `index.js` 的子目录
- 使用 jiti 加载，本地 TypeScript 无需编译；`pi --extension ./hello.ts` 开发期临时挂载（可重复）
- 重载：`/reload`

### 9.2 最小示例

```typescript
import type { ExtensionAPI } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
  pi.registerCommand("hello", {
    description: "Show a greeting",
    handler: async (name, ctx) => {
      ctx.ui.notify(`Hello, ${name || "world"}!`, "info");
    },
  });
}
```

### 9.3 ExtensionAPI 注册面

| 能力 | API |
|---|---|
| 观察 / 修改生命周期 | `pi.on()` |
| 添加模型可调用工具 | `pi.registerTool()` |
| 添加斜杠命令 | `pi.registerCommand()` |
| 添加快捷键 / CLI 旗标 | `pi.registerShortcut()` / `pi.registerFlag()` |
| 发送用户或自定义消息 | `pi.sendUserMessage()` / `pi.sendMessage()` |
| 持久化非上下文会话数据 | `pi.appendEntry()` |
| 更改活跃工具 / 会话名 | `pi.setActiveTools()` 等会话控制方法 |
| 注册模型 provider | `pi.registerProvider()` / `pi.unregisterProvider()` |
| 终端渲染 | Renderer 注册与 `ctx.ui` |
| 扩展间通信 | `pi.events` |

事件钩子（从文档各页收集，完整清单以源码 `packages/coding-agent/src/core/extensions/types.ts` 导出声明为权威）：

- 生命周期：`project_trust`、`session_start`、`session_shutdown`、`before_agent_start`、`agent_end`、`agent_before_settle`（最后可行动边界，可追加条目并请求一次延续）、`agent_settled`（最终、仅通知）、`turn_start`、`turn_end`
- 消息：`message_end`（可替换已定稿消息）
- 工具：`tool_call`（可变更输入或阻止）、`tool_result`（处理器链式，逐个看到前序修改）
- Provider：`provider_stream_event`（只读原始流事件）、`cache_warming_decision`
- 上下文：`context`（转换对话消息）、`context_with_system`（需自持完整 transcript）
- Shell：`user_bash`
- 压缩 / 树 / 切换：`session_before_compact`、`session_compact_failed`、`session_before_tree`、`session_before_switch`
- 资源：`resources_discover`

### 9.4 定义自定义工具（TypeBox schema）

```typescript
import { Type } from "typebox";
import { StringEnum } from "@earendil-works/pi-ai";

pi.registerTool({
  name: "greet",
  label: "Greeting",
  description: "Generate a greeting",
  parameters: Type.Object({
    name: Type.String({ description: "Name to greet" }),
    // 字符串枚举必须用 StringEnum（Google API 兼容性要求）
    action: StringEnum(["list", "add"] as const),
  }),
  async execute(toolCallId, params, signal, onUpdate, ctx) {
    return {
      content: [{ type: "text", text: `Hello, ${params.name}!` }],
      details: {},   // 渲染与状态重建用；无结构化详情时用 undefined
    };
  },
});
```

执行语义：

- `execute()` 抛出异常 = 失败的工具结果；正常返回对象不算错误
- `terminate: true` 表示请求 agent 跳过自动后续（当批全部工具同意终止时生效）
- 动态工具：全部注册但保持 inactive，用 loader 工具在运行时 `pi.setActiveTools()` 激活
- 文件修改类工具应包 `withFileMutationQueue()`；嵌套模型调用要把 `usage` 计入结果（用 `ctx.modelRegistry.streamSimple()`）

### 9.5 ctx.ui 渲染 API

- 交互：`ctx.ui.select()`、`confirm()`、`input()`、`editor()`
- 反馈：`ctx.ui.notify()`、`setStatus()`（非阻塞）
- 持久区域：`ctx.ui.setWidget()`、`setFooter()`、`setHeader()`、`setEditorComponent()`
- 全屏 / 覆盖层：`ctx.ui.custom()`（`overlay: true` 画在现有内容之上）
- 模式守卫：`ctx.mode === "tui"`、`ctx.hasUI`——JSON / print 模式没有 UI，需判空

TUI 组件库（`@earendil-works/pi-tui`）：`Text`、`Markdown`、`Image`、`TruncatedText`、`Container`、`VStack`、`HStack`、`Box`、`Spacer`、`Input`、`Editor`、`SelectList`、`SettingsList`、`ScrollView`、`Loader`、`CancellableLoader`、`MouseRegion`，工具函数 `visibleWidth()`、`truncateToWidth()` 等。

## 10. Skills（技能）

pi 实现的是 [Agent Skills 开放标准](https://agentskills.io)（agentskills.io），大部分违规只警告仍加载；允许 name 与目录名不同（方便共享技能目录）。

### 10.1 目录位置

- 全局：`~/.pi/agent/skills/`、`~/.agents/skills/`
- 项目：`.pi/skills/`、`.agents/skills/`（cwd 及祖先目录直到 git 根，需 trust）
- 其他来源：包内 skills、settings `skills` 数组、CLI `--skill <path>`（可重复）

### 10.2 SKILL.md frontmatter

| 字段 | 必填 | 说明 |
|---|---|---|
| `name` | 是 | 最长 64 字符，小写字母 / 数字 / 连字符 |
| `description` | 是 | 最长 1024 字符，决定何时被加载 |
| `license` | 否 | 许可证名或文件引用 |
| `compatibility` | 否 | 最长 500 字符，环境要求 |
| `metadata` | 否 | 任意键值 |
| `allowed-tools` | 否 | 空格分隔的预批准工具（实验性） |
| `disable-model-invocation` | 否 | true 时从系统提示隐藏，只能 `/skill:name` 显式调用 |

### 10.3 渐进式披露

启动时只扫描 name + description，系统提示中只有技能清单；模型判断任务匹配后，用 `read` 工具（不可用时用 `bash`）加载完整 SKILL.md；技能内用相对路径引用 `scripts/`、`references/`、`assets/`。缺 description 的技能不加载；同名冲突保留先找到的。

### 10.4 命令与复用

```text
/skill:brave-search              # 显式调用
/skill:pdf-tools extract a.pdf   # 参数以 "User: <args>" 追加到技能内容
```

直接复用 Claude Code 与 Codex 的技能目录——在 `~/.pi/agent/settings.json` 中加：

```json
{ "skills": ["~/.claude/skills", "~/.codex/skills"] }
```

技能仓库参考：[anthropics/skills](https://github.com/anthropics/skills)、[badlogic/pi-skills](https://github.com/badlogic/pi-skills)（含 web 搜索、浏览器自动化、Google APIs、转录）。

## 11. 提示词模板

- 位置：全局 `~/.pi/agent/prompts/*.md`；项目 `.pi/prompts/*.md`（需 trust）；包内 `prompts/`；CLI `--prompt-template <path>`；`--no-prompt-templates` 禁用
- 文件名即命令名（`review.md` → `/review`）；frontmatter 可选 `description` 与 `argument-hint`（`<必选>` / `[可选]`）
- 变量语法（注意是 `$` 位置参数，不是花括号插值）：

| 写法 | 含义 |
|---|---|
| `$1` `$2` | 位置参数 |
| `$@` / `$ARGUMENTS` | 全部参数 |
| `${1:-default}` | 带默认值 |
| `${@:N}` / `${@:N:L}` | 从第 N 个起 / 取 L 个 |

调用示例：`/component Button "click handler"`。

## 12. 主题

- 内置 `dark` / `light`；`/settings` 选择，或 `"theme": "light"` 跟随终端明暗；一次性 `--use-theme light`
- 自定义：JSON 文件放 `~/.pi/agent/themes/my-theme.json`（文件名 = 主题名），含 `$schema`、`name`（必填唯一）、`vars`、`colors`（必填，按角色）
- 颜色四种写法：`"#00aaff"` 六位 hex、`0-255` ANSI 索引、变量引用 `"primary"`、`""` 终端默认
- 色彩组：`accent`、`border*`、`text`、`muted`、`success`、`error`、`warning`、`userMessage*`、`md*`、`toolDiff*`、`syntax*`、`thinking*` 等
- 活跃用户主题热重载，其余来源 `/reload`

## 13. Pi Packages（扩展分发）

### 13.1 命令

```bash
pi install npm:@foo/bar@1.0.0     # npm 源（带版本 = 固定 pin，更新时跳过）
pi install git:github.com/user/repo@v1   # git 源（ref 为 pinned tag/commit）
pi install https://github.com/user/repo   # 裸 URL 也可以
pi install ./relative/path/to/package     # 本地路径
pi install -l npm:@foo/bar         # 写入项目 settings（.pi/settings.json，可团队共享）
pi remove npm:@foo/bar             # pi uninstall 是别名
pi list                            # 列出已装包
pi update --all                    # 更新 pi + 包 + 对账 pinned git refs
pi update --extensions             # 只更新包
pi -e npm:@foo/bar                 # 临时试装（仅本次运行）
```

用户级装到 `~/.pi/agent/npm/`、`~/.pi/agent/git/`；项目级 `.pi/npm/`、`.pi/git/`。项目 settings 声明的包在 trust 后启动时自动安装缺失项。

### 13.2 包清单

`package.json` 加 `pi` 键 + 关键词 `pi-package`：

```json
{
  "keywords": ["pi-package"],
  "pi": {
    "extensions": ["extensions/*.ts", "!extensions/legacy.ts"],
    "skills": ["skills/"],
    "prompts": ["prompts/"],
    "themes": ["themes/"]
  }
}
```

无清单时按约定目录自动发现：`extensions/`（.ts/.js）、`skills/`、`prompts/`（.md）、`themes/`（.json）。核心依赖（`pi-ai`、`pi-agent-core`、`pi-coding-agent`、`pi-tui`、`typebox`）列 `peerDependencies: "*"`。`pi config` 命令可逐项启用 / 禁用包内资源。

## 14. 脚本化与自动化

四种运行模式：

| 模式 | 接口 | 生命周期 |
|---|---|---|
| Interactive | 终端 UI | 直到用户退出 |
| Print | stdout 最终文本 | 单次调用 |
| JSON | stdout JSONL 事件流 | 单次调用 |
| RPC | stdin 命令 / stdout 响应+事件 | 长驻 |

### 14.1 Print 模式

```bash
pi -p "Summarize this codebase"
cat README.md | pi -p "Summarize this text"      # 管道 stdin 预置到首条 prompt
pi -p @screenshot.png "What's in this image?"    # @file 附件
git diff | pi --print "Review this change"
```

stdin / stdout 任一被重定向且未选 JSON / RPC 时自动进入 print 模式；最终消息 stopReason 为 `error` 或 `aborted` 时返回非零退出码。

### 14.2 JSON 事件流

`pi --mode json "prompt" > events.jsonl`——首行 session header，随后 `agent_start`、`turn_start`、`message_start`、`message_update`（仅增量）、`message_end`（权威消息）、`tool_execution_*`、`turn_end`、`agent_end`、`agent_settled` 等事件。

### 14.3 RPC 模式

`pi --mode rpc`——stdin 逐行 JSON 命令，stdout 严格 LF 分帧。命令包括 `prompt`（支持 `streamingBehavior: "steer" | "followUp"`）、`steer`、`follow_up`、`abort`、`new_session`、`get_state`、`get_messages`、`set_model`、`set_thinking_level`、`compact`、`set_auto_compaction`、`bash`、`get_session_stats` 等。Node / TS 集成推荐用 SDK 内置 `RpcClient`。

### 14.4 SDK

```bash
npm install @earendil-works/pi-coding-agent
```

核心是 `createAgentSession()`（选项含 cwd、model、thinkingLevel、scopedModels、tools、extensions、skills 等），返回 `AgentSession`（`prompt()` / `steer()` / `followUp()` / `subscribe()` / `setModel()` / `compact()` / `navigateTree()` / `abort()` / `dispose()`）；多会话管理用 `createAgentSessionRuntime()`。

### 14.5 bash 工具内的环境变量

模型调用的 bash / powershell 工具内可用：`PI_SESSION_ID`、`PI_SESSION_FILE`、`PI_PROVIDER`、`PI_MODEL`、`PI_REASONING_LEVEL`（不注入用户 `!` / `!!` 命令）。进程标记：`AI_AGENT=pi`、`PI_CODING_AGENT=true`。

## 15. 命令与快捷键速查

### 15.1 内置斜杠命令

| 分组 | 命令 |
|---|---|
| 模型与设置 | `/settings` `/model` `/thinking` `/scoped-models` `/login` `/logout` `/llama` |
| 会话与上下文 | `/new` `/resume` `/name` `/session` `/tree` `/fork` `/clone` `/compact` `/import` |
| 导出与分享 | `/copy` `/export` `/share` `/bug` |
| 运行时与项目 | `/trust` `/reload` `/hotkeys` `/changelog` `/quit` |
| 资源 | 扩展命令、各提示词模板名、各技能 `/skill:name` |

### 15.2 核心快捷键

| 快捷键 | 作用 |
|---|---|
| `Enter` / `Shift+Enter`（`Ctrl+J`） | 提交 / 换行 |
| `Ctrl+G` | 外部编辑器 |
| `Ctrl+V`（Windows `Alt+V`） | 粘贴图片 |
| `Escape` | 中止 |
| `Alt+Enter`（Windows `Ctrl+Q`） | 追加 follow-up |
| `Alt+Up`（Windows `Alt+Q`） | 取回排队消息 |
| `Ctrl+O` / `Ctrl+T` | 展开/折叠工具输出 / 思考块切换 |
| `Ctrl+L` | 模型选择器（内 `Ctrl+S` 存默认） |
| `Ctrl+P` / `Shift+Ctrl+P` / `Shift+Tab` | 循环模型 / 循环思考级别 |
| `!command` / `!!command` | 输出进上下文 / 不进上下文 |
| `Ctrl+C` / `Ctrl+D` | 清空编辑器再退出 / 直接退出 |

完整可定制清单（60+ 动作）见官方 Keybindings 页；自定义文件 `~/.pi/agent/keybindings.json`，改后 `/reload`，仓库提供 Emacs 与 Vim 配置示例。

## 16. 配置目录结构

`~/.pi/agent/`（`PI_CODING_AGENT_DIR` 可覆盖）：

| 路径 | 职责 |
|---|---|
| `settings.json` | 用户级设置（含包声明） |
| `keybindings.json` | 自定义快捷键 |
| `models.json` | 兼容端点 / 模型 / 模型覆盖 |
| `auth.json` | API key 与 OAuth 凭据 |
| `AGENTS.md` / `CLAUDE.md` | 全局用户指令（`AGENTS.override.md` 覆盖） |
| `SYSTEM.md` / `APPEND_SYSTEM.md` | 替换 / 追加系统提示 |
| `extensions/` `skills/` `prompts/` `themes/` | 用户资源 |
| `sessions/` | 会话 JSONL |
| `trust.json` | 项目信任决定 |
| `npm/` `git/` | 包安装目录 |

项目 `.pi/` 目录：`settings.json`、`SYSTEM.md`、`APPEND_SYSTEM.md`、`extensions/`、`skills/`、`prompts/`、`themes/`（均需 project trust）。关键环境变量：`PI_CODING_AGENT_DIR`、`PI_CODING_AGENT_SESSION_DIR`、`PI_OFFLINE`、`PI_TELEMETRY`、`HTTP_PROXY` / `HTTPS_PROXY`、`VISUAL` / `EDITOR`。

## 17. 安全与容器化

- pi 以当前用户完整权限运行，**没有内置权限系统**：不弹确认框、无进程内沙盒，沙箱化是使用者自己的责任
- project trust 只控制"是否加载项目本地资源"（扩展、技能、模板、上下文文件）：`/trust` 保存决定到 `~/.pi/agent/trust.json`；非交互模式的 `defaultProjectTrust` 设置（ask / always / never，默认 ask）；`-a` / `-na` 单次覆盖
- 官方容器化方案（见 [Containerization 文档](https://pi.dev/docs/latest/containerization)）：Gondolin micro-VM 路由内置工具、Plain Docker、OpenShell、Docker Sandboxes
- 官方示例扩展兜底：`permission-gate.ts`（危险 bash 命令确认）、`confirm-destructive.ts`、`protected-paths.ts`（阻止写 `.env` / `.git` 等）、`timed-confirm.ts`
- 第三方 Pi Package 本质是可执行代码，引入前按"可执行开发依赖"级别审查

## 18. 官方示例扩展生态

仓库 `packages/coding-agent/examples/extensions/` 下有 50 余个示例，每一个都对应一类"内核没做"的能力，也是写扩展的最佳范本：

| 示例 | 说明 |
|---|---|
| `subagent/` | 把任务委派给专门 subagent，隔离上下文窗口 |
| `plan-mode/` | Claude Code 风格 `/plan`、只读探索、步骤跟踪 |
| `permission-gate.ts` | 危险命令（rm -rf、sudo）前确认 |
| `todo.ts` | todo 工具 + `/todos` 命令 |
| `handoff.ts` | `/handoff <goal>` 上下文转移 |
| `ssh.ts` | 远程工具委派 |
| `git-checkpoint.ts` | git 检查点 |
| `structured-output.ts` | 结构化输出 |
| `custom-compaction.ts` | 自定义压缩策略 |
| `preset.ts` / `tools.ts` | `--preset` 预设 / `/tools` 开关工具 |

## 19. 学习路径建议

结合《AI-Agent-动画短剧工具-学习路线-完整版》第 14 章的使用建议：

1. **第一步：用起来**——跑通默认四件套循环，观察 `read / write / edit / bash` 的调用顺序与停止条件，体验 `/tree` 回跳与 `/compact` 摘要
2. **第二步：读内核**——按 `packages/ai`（agent-loop.ts）→ `packages/agent`（Agent 类）→ `packages/coding-agent`（system-prompt.ts）通读源码，对照作者博客导读；`agent_before_settle` 与 `turn_end` 的边界设计值得细看
3. **第三步：写扩展**——从最小 `registerCommand` 示例起步，再写一个 `registerTool` 工具（TypeBox schema + content/details 返回结构），挂 `tool_call` / `turn_end` 钩子打日志
4. **第四步：打包分享**——把扩展打成 Pi Package（`pi` 键清单 + `pi-package` 关键词），用 `pi install ./path` 本地验证
5. **迁移到自研工具**——pi 的"内核 + 数据契约 + 全扩展化"结构正是节点式工作流引擎的参照：先把最小完备集做对，一切进阶能力做成可插拔件

## 参考链接

- 官方文档：https://pi.dev/docs/latest
- Quickstart：https://pi.dev/docs/latest/quickstart
- 扩展开发：https://pi.dev/docs/latest/extensions
- Skills：https://pi.dev/docs/latest/skills
- GitHub 仓库：https://github.com/earendil-works/pi
- 作者博客导读：https://mariozechner.at/posts/2025-11-30-pi-coding-agent/
- 中文社区指南：https://pi-agent.org/
- Agent Skills 开放标准：https://agentskills.io/

