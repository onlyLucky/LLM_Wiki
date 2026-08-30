# DeepSeek Harness 从零开始学习笔记

> 整理时间：2026-08-26。配套代码示例在本目录的 `examples/` 文件夹下，共 6 个文件，与笔记章节一一对应。

## 它是什么

DeepSeek Harness（命令名 `dsh`）是 DeepSeek AI 于 2026 年 8 月 13 日与 DeepSeek-V4-Pro-0813 模型同步开源的智能体运行框架，采用 MIT 协议。官方对两者关系的概括是一句话：**Agent = Model + Harness**——模型负责理解、推理和生成，Harness 负责把这些能力组织成能在真实环境里持续干活的智能体，也就是"马具"：让模型能看懂环境、调用工具、跨多轮保持工作状态。

它和 Claude Code、Codex CLI 这类产品的区别在于：后者的"马具"和模型捆在一起整套售卖，而 DeepSeek 把马具单独开源出来。模型可以换成任何 OpenAI 兼容端点，能力全部由插件组合决定。

底层建筑在 Cordis 插件元框架上，设计思想来自论文《A Programming Paradigm for Spatiotemporal Composability》（北大与 DeepSeek 联署）。Cordis 只做三件事：插件的生命周期管理、依赖注入、事件总线。落到工程上的核心约束是"可逆副作用"——插件注册工具、监听事件、挂路由时同时登记清理动作，卸载或重载时全部反向撤销，不留孤儿状态。

技术栈以 TypeScript 为主（约 97%），带 Python SDK；主仓库在两个月内已有约 1.3 万次提交，25 位贡献者，目前处于开发者预览阶段（版本 0.1.0-rc.x），官方明确提示会有兼容性破坏变更。

### 来源

| 资源 | 地址 |
| --- | --- |
| 官方主页 | https://deepseek.com/harness/en/ |
| GitHub 仓库 | https://github.com/deepseek-ai/deepseek-harness |
| 开发者文档 | https://deepseek-harness.github.io/deepseek-harness/en/guide/quickstart |
| Cordis 框架 | https://github.com/cordiverse/cordis |
| 社区插件话题 | https://github.com/topics/dsh-plugin |
| Cordis 论文 | https://github.com/cordiverse/paper |
| 中文 README | https://github.com/deepseek-ai/deepseek-harness/blob/master/README.zh.md |
| Discord 社区 | https://discord.gg/Ycq5dCaS4 |

## 基础使用方式

### 环境准备

- Node.js（npm 方式运行需要）
- 或者 Python 3.10+（走 Python SDK 路线）
- 一个 DeepSeek API Key，从 https://platform.deepseek.com/ 获取

### 一条命令启动

在希望智能体工作的项目目录里执行：

```sh
npx @deepseek-ai/dsh web
```

默认在 `http://127.0.0.1:3080` 启动 Web UI 并自动打开浏览器。SSH 环境下只打印 URL（本地转发地址归 SSH 客户端管）；不想自动开浏览器加 `--no-open`。

`dsh` 进程以启动时所在目录作为默认文件系统位置，但全新的 Web UI 需要先手动添加工作区。

### 源码方式运行（开发插件前必须走这条路）

```sh
git clone https://github.com/deepseek-ai/deepseek-harness.git
cd deepseek-harness
pnpm install
pnpm run build
pnpm dsh web
```

`pnpm run build` 准备仓库构建产物；`pnpm dsh web` 复用产物不再重复构建。

### 配置模型

打开 Web UI 的 Settings -> Models，在 DeepSeek 卡片填入 API Key 保存即可，无需重启服务——模型变更在下一次请求生效。密钥是只写的：保存后页面只显示脱敏描述符，真实密钥落在 `$DSH_HOME/.credentials.yaml`，设置里只保留凭据引用。

其他接入方式：

- 目录厂商（Anthropic、OpenAI 等）：Add provider 选厂商填 key，端点、协议、模型列表由已安装的目录提供
- 原生认证厂商（Bedrock、Vertex、Azure、Codex）：要用各自的原生凭据，只填 API Key 字段配置不生效
- 自定义网关：Add a custom provider，需要小写 Provider ID、base URL、协议、凭据和至少一个模型。ID 是永久的——请求、已保存会话、默认模型、凭据引用都用它，改名等于新建一个再删旧的

常见坑：网关 key 和地址都对却全部请求被拒，通常是请求形状和 OpenAI 不一致。最常见两种：推理模型的系统提示词按 `role: "developer"` 发送被网关拒绝；输出上限发 `max_completion_tokens` 而服务器只认 `max_tokens`。修正方法见 `examples/06-custom-provider-settings.yaml` 场景二。

### 第一个任务

选择工作区（Choose workspace，添加启动 dsh 的项目目录），开一个会话发送：

```
Summarize this repository and identify its main packages.
```

智能体可以读写工作区文件、跑命令、派发子任务、维护计划。权限策略下的敏感操作，Web UI 会先征求确认。

### 常用命令速查

| 命令 | 作用 |
| --- | --- |
| `npx @deepseek-ai/dsh web` | 启动 Web UI（等价于 `--profile web`） |
| `dsh --profile headless "任务"` | 无头模式一次性跑任务，打印最终答案后退出，适合脚本与 CI |
| `dsh plugin --profile <p>` | 管理某个 profile 的插件 |
| `dsh --profile web --dump-config` | 查看实际启动的完整配置树 |
| `dsh web --patch ./cordis.yml` | 以补丁方式叠加本地插件配置 |

## 优缺点与使用建议

### 和同类框架怎么比

| 特性 | DeepSeek Harness | lm-evaluation-harness / OpenCompass | Claude Code / Codex CLI |
| --- | --- | --- | --- |
| 定位 | 智能体运行框架 | 模型评测框架 | 封闭的整套产品 |
| 核心理念 | Agent = Model + Harness | 跑分、能力评测 | 模型 + 自家马具捆绑 |
| 模型可换 | 任意 OpenAI 兼容端点 | 支持多种后端 | 绑定自家模型 |
| 架构 | 一切皆插件（Cordis） | 模块化 | 黑盒 |
| 协议 | MIT | 各自开源 | 闭源产品 |
| 中文生态 | 良好（官方双语文档） | OpenCompass 内置 C-Eval/CMMLU | 无 |

一句话区分：评测框架是"考场"，Harness 是"工作台"。前者测模型能考多少分，后者让模型能在真实仓库里干活。

### 优势在哪里

- 模型和框架解耦。不被任何一家厂商锁定，换模型是改一行配置的事
- 一切皆插件。模型、工具、技能、会话、沙箱、存储、循环、调度、UI 全部可插拔，能力组合通过配置完成，不改源码
- 可追溯性强。会话日志只追加不删除：系统提示词、思维链、工具调用与结果、子智能体调度、每一次上下文注入全被记录。上下文压缩不删原始历史，只是用替换事件改变模型此后看到的表象
- 事件流复用。恢复（resume）、分叉（fork）、搜索、回放（replay）全部基于同一条事件流
- 热插拔不留脏状态。可逆副作用让插件卸载后注册全部回滚，适合频繁实验
- 官方内置四种运行模式，极简模式两件套（bash + str_replace_editor）专门用来跑分，V4 Pro 官方成绩就是这个模式跑出来的
- TypeScript 为主，前端背景的人上手成本低；Python SDK 覆盖脚本和 CI 场景

### 劣势与局限

- 开发者预览阶段，官方明示会有兼容性破坏变更，生产环境要锁版本
- 生态年轻。社区插件爆发式增长但质量参差，需要自己甄别
- 插件体系要理解 Cordis 的服务和事件概念，有一定的学习曲线
- 网关兼容性问题零散（developer role、max_tokens 字段、模态声明都是"声明式"的，框架不探测端点，错声明要靠报错反推）
- Windows 支持不完整：Python SDK 的 minimal 组合依赖 POSIX 终端（持久 PTY），不支持 Windows agent
- Minimal/Python 组合默认 `danger-full-access` 权限，Bash 和编辑器可以改运行时进程可见的任意路径

### 注意事项

- 别在有重要文件的项目里直接跑默认权限的 agent，先在一次性 checkout 或容器里试
- 密钥只写一次。保存后页面只给脱敏描述符，丢了就得重填
- 自定义 Provider ID 永久生效，规划好命名再创建
- DeepSeek 官方 chat-completions 路由是纯文本的，不能通过配置加图片输入；视觉模型走自定义 provider 并声明 `input: [text, image]`
- 声明式的坑：`input` 和 `compat` 开关描述的是"端点长什么样"而不是去检查它。声明了端点实际不支持的能力，请求会被端点拒绝
- compat 开关必须给值，留空的 key（`supportsDeveloperRole:`）会直接被拒绝而不是被忽略，因为空值会抹掉目录已知的信息
- 图片被拒后要开新会话：附件留在会话日志里，同一个会话会反复重发同一个失败请求

### 带给我的帮助

- 提供了一个可以完全拆开研究的开源智能体运行时。Claude Code 的 harness 是黑盒，dsh 是白盒，想弄清 agent loop 怎么组织、上下文怎么压缩、子智能体怎么调度，都能读源码
- 插件化设计让"做一个自己的 agent 工具"从改框架变成写一个几十行的模块。对有 TypeScript 基础的人，这是参与智能体基础设施建设门槛最低的入口
- append-only 事件流对调试价值很大：模型到底看到了什么、哪一步开始跑偏，Trajectory 视图里逐条可查，而不是猜
- 无头模式 + Python SDK 把它变成 CI 里的一个环节（自动修测试、批量仓库分析），不只是交互式聊天工具
- 四种预设模式本身就是学习材料：极简模式回答"跑分最少需要哪些工具"，标准模式回答"日常开发要哪些工具"，对照着读能理解每个插件为什么存在

## 进阶使用

进阶的核心不是"用更多功能"，而是从使用者变成开发者：写插件、定义工具、把 agent 嵌进自己的程序。

### 写第一个插件

插件就是一个导出 `apply` 函数的 TypeScript 模块，框架加载时调用 `apply` 并传入 `ctx` 上下文，能力注册都通过 `ctx` 完成：

```ts
import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  console.log('[hello-plugin] plugin loaded!')
}
```

注册要靠 overlay 文件 `cordis.yml`（插件路径必须是绝对路径，补丁不改变模块解析目录）：

```yaml
- insert:
    - id: hello
      name: '/absolute/path/to/deepseek-harness/scratch-plugin/src/my-plugin.ts'
```

然后带补丁启动：`pnpm dsh web --patch ./scratch-plugin/cordis.yml`，终端打印加载日志即成功。

三个关键机制：

- **自动清理**：凡是通过 `ctx` 注册的（事件监听器、工具、计时器）在插件卸载时自动清理；网络连接这类需要显式释放的资源，用 `ctx.effect()` 返回清理函数
- **依赖声明**：`export const inject = ['tools']` 声明依赖后，框架会等 tools 服务就绪才加载插件，`ctx.tools` 在 `apply` 里直接可用
- **三种形式**：函数形式够用于大多数场景；对象形式收拢配置；类形式（继承 `Service`）用于向其他插件提供服务

完整代码在 `examples/01-hello-plugin.ts` 和 `examples/03-plugin-forms.ts`。

### 定义一个工具

工具是智能体的"手"。`defineTool` DSL 一处声明入参、出参和渲染：

```ts
import { defineTool } from '@deepseek-ai/dsh-tools'

ctx.tools.register(
  defineTool({
    name: 'greet',
    description: 'Greet someone by name.',
    parameters: {
      name: { type: 'string', required: true, description: 'The name to greet' },
    },
    output: {
      schema: { type: 'string' },
      render: (_args, value) => [{ type: 'text', text: value }],
    },
    async execute(args) {
      return `Hello, ${args.name}!`
    },
  }),
)
```

分工值得记：`parameters` 声明入参 schema（`defineTool` 据此推断并校验 `args`）；`output.schema` 声明 `execute` 的规范返回值；`output.render` 把规范值转换成模型可见的内容块。完整示例在 `examples/02-greet-tool.ts`，启动后在 Web UI 里说 "Use the greet tool to greet Ada." 即可验证。

想再进一层：嵌套 schema、后台任务、策略钩子、Code Mode 集成、UI 卡片，看官方 Tool authoring reference（cookbook/adding-a-tool）。

### 模型接入的深水区

模型配置的三层结构（`models` 逐个声明 -> `defaultInput` 路由回退 -> `modelOverrides` 按模型覆盖）适合接一批异构端点。两个语义要点：

- `defaultInput` 是回退不是覆盖，不会把目录里声明的视觉能力抹掉；想收窄单个模型用该模型自己的 `input`（空列表等于不写）
- 模态与 compat 都是"对端点的陈述"而非检查：写错了不会在配置阶段报错，而是请求被端点拒绝

全部开关和取值可查生成式配置目录 `dsh-llm-pi-ai`（config-catalog），由源码生成不会过期。示例配置在 `examples/06-custom-provider-settings.yaml`。

### Python SDK：把 agent 嵌进程序

`pip install deepseek-harness-sdk` 之后，几行代码就能在自己的程序里跑任务：

```python
from deepseek_harness import DeepSeekHarness

with DeepSeekHarness(
    provider="deepseek-official",
    model="deepseek-v4-flash",
    max_tokens=49_152,
    cwd=str(workspace),
    session_root=str(sessions),
    cordis=str(config),
) as harness:
    result = harness.run("Inspect the repository and fix the failing tests.",
                         session_id="example-001")
    print(result.final_response)
```

两个设计点：`DeepSeekHarness` 惰性启动捆绑运行时（不需要系统 Node.js）并在上下文管理器存活期间复用；session id 的复用有明确语义--同一个 id 延续同一会话，包括会话专属 bash 进程的目录、导出变量和 shell 函数，独立任务必须换新 id。完整示例在 `examples/05-python-sdk.py`。

注意权限：minimal 组合默认 `danger-full-access`，只在一次性 checkout 或容器里跑。

## 高级使用方式

### 四种运行模式

模式本质是四组配好的插件组合，也是理解框架的地图：

| 模式 | 装了什么 | 适用场景 |
| --- | --- | --- |
| 标准模式（Standard） | 文件编辑、shell、文件与网页搜索、技能、规划、目标、子智能体、工作流全套 | 日常开发、长任务 |
| 代码模式（Code） | 标准模式全部能力，工具通过 Code Mode SDK 暴露，模型把多步操作编排进一个 TypeScript 程序 | 流水线、批量清洗、自动化测试 |
| 极简模式（Minimal） | 持久 bash + str_replace_editor 两件工具 | 跑分与基准测试（V4 Pro 官方成绩出自此模式） |
| 创建者模式（Creator） | 标准模式全部能力 + 运行时检查、内存中做插件实验、组合出新模式、预设编写引导 | 造自己的智能体预设 |

### 多智能体协作

- 子智能体（Subagent）：主智能体把独立子任务派给后台并行的子智能体，各自有独立的上下文，完成后回传结果
- Agent Teams：仓库内有专门的 Agent Teams 目录与套餐（packages 孵化中），用于成规模的多智能体编队
- Workflow：编排大规模多智能体流水线
- Goal 工具：一次下达、多轮自主推进的长期任务；配合 Jobs 后台任务可挂起、恢复、终止

多智能体实践的常见分工是规划者拆解任务并分配、研究员搜集验证信息、执行者产出代码文档，每个角色可以用不同模型。规划与执行分离的价值在于：小模型做执行省钱，大模型做规划兜底。

### 沙箱分级

文件沙箱分三级：只读、工作区可写、完全访问。命令在受限环境中执行，降低误操作风险。仓库里另有 native 目录下的 landlock-run（Linux Landlock 系统调用实现的沙箱执行器）。

经验法则：日常用工作区可写；批量脚本和 CI 用容器兜底；只在明确需要时给完全访问。

### 会话轨迹：恢复、分叉、搜索、回放

append-only 会话日志是高级用法的基础。上下文压缩不删除原始历史，只通过替换事件改变模型此后看到的内容，所以任何时候都能还原"模型当时真实看到了什么"。Trajectory 视图按来源检查这些记录，resume / fork / search / replay 全部作用于同一条事件流。

实用场景：一次跑偏的任务从出错的步骤 fork 出去改提示词重跑，而不是从头再来；把一条成功轨迹回放，观察哪一步上下文注入起了决定性作用。

### 无头模式与 CI 集成

```sh
dsh --profile headless "运行当前项目的测试并修复失败用例"
```

无头模式跑一个全新会话，打印最终答案后退出（退出码 0），适合脚本与 CI。配合 Python SDK 可以做批量自动化：多个仓库逐个跑分析、夜间自动修测试、批量生成变更报告。打包的 Python 运行时已支持 MCP，可以把外部 MCP 服务接进 CI 流程。

### 定制自己的运行时

进阶路线的终点是 Creator 模式：检查当前运行时装了哪些插件、在内存里试验 Cordis 插件组合、把满意的组合固化成新预设。再往下就是读两个东西--capability layering 实践（把可替换能力拆成 Service Definition / Provider / Consumer 三层包）和 Cordis primer（组合配置语法）。

## 开源案例参考

### 社区插件生态规模

GitHub `dsh-plugin` 话题下社区插件爆发式增长。两个入口：

- Oh-My-DSH 目录：截至 2026 年 8 月 15 日收录精选插件 1117 个，监测生态仓库 1521 个，累计约 30 万 star
- awesome-dsh-plugin：社区维护的精选列表，收录 270 个可通过 `dsh plugin add` 安装的插件（均声明 `dsh.bundle` manifest），分 11 个分类

### 值得研究的具体案例

| 案例 | 地址 | 学习价值 |
| --- | --- | --- |
| dsh-TUI | https://github.com/ccch1mneyyy/dsh-TUI | dsh 最火的插件之一。官方没有 CLI/TUI，它示范了纯插件扩展出一种全新交互形态 |
| dsh-at-file | 见插件目录收录 | 给对话加 @ 文件引用能力，示范"增强输入"类插件怎么写 |
| 官方插件包 | 仓库 packages/ 目录 | 每个能力一个包（tool-fs、llm-pi-ai、llm-deepseek 等），是标准写法的权威参考 |
| 官方示例 | 仓库 examples/jsonrpc-agent | Python SDK 的组合参考：工具面、超时、压缩、文件系统如何配置 |
| Cordis 教程 | 官方文档 develop/cordis-tutorial | 每章一个可运行示例，从零搭起插件框架，不需要 API key |
| Cordis 论文 | https://github.com/cordiverse/paper | 理解"时空可组合性"的设计动机 |

研究方法：先用 `dsh plugin add` 装上体验，再读它的 manifest 和源码，最后仿写一个同类插件。官方要求插件仓库打 `dsh-plugin` 话题标签以便发现，发布自己的插件照做即可。

## 课后作业

**需求：给 DeepSeek Harness 写一个"仓库统计"工具插件，并用它完成一次真实任务。**

任务描述：在 deepseek-harness 仓库（或其他任意项目）上，开发一个名为 `repo-stats` 的插件，注册一个 `repo_stats` 工具，输入一个目录路径，输出该目录下的文件数、目录数、总代码行数、最大的三个文件，以及在 Web UI 中以易读文本形式渲染。

验收标准：

1. 插件通过 cordis.yml overlay 注册，`pnpm dsh web --patch` 启动后能在 Web UI 的工具列表中看到 `repo_stats`
2. 工具的 parameters 用 schema 声明入参（path 必填，可选的忽略规则参数加分），`defineTool` 能对非法输入报错
3. execute 返回结构化的规范值（对象或数组），由 output.render 转换为模型可读文本
4. 插件声明 `inject` 依赖正确，卸载后无残留（可以把 console 计时器故意挂上再验证 ctx.effect 清理）
5. 在 Web UI 里用自然语言让它统计一个真实目录，并在 Trajectory 视图里找到这次工具调用的完整记录（入参、返回值、渲染结果）

进阶加分项：把工具扩展成支持后台执行的大目录统计（参考官方 cookbook/adding-a-tool 的 background work 章节）；或把它发布为带 `dsh.bundle` manifest 的可安装插件并打上 `dsh-plugin` 话题。

完成标志：能独立回答三个问题--parameters 与 output.schema 的分工是什么；为什么插件路径要写绝对路径；session id 复用和 fork 各自适用什么场景。
