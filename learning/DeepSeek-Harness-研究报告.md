# DeepSeek Harness 开源智能体运行框架研究报告

## 执行摘要

DeepSeek Harness（dsh）是 DeepSeek AI 于 2026 年 8 月 13 日开源的智能体运行框架，采用 MIT 协议发布。该项目基于"Agent = Model + Harness"的核心理念，将智能体分为模型和运行框架两部分，通过"一切皆插件"的架构设计，为大语言模型提供标准化的运行环境[cite:1][cite:2]。

## 主要发现

### 1. 核心定位

DeepSeek Harness 定位为智能体运行框架，而非单纯的评测工具。与传统的评测框架（如 lm-evaluation-harness）不同，DeepSeek Harness 更注重为智能体提供完整的运行环境，包括工具调用、文件操作、代码执行等能力[cite:1][cite:4]。

### 2. 技术架构

#### 2.1 Cordis 插件系统

DeepSeek Harness 基于 Cordis 插件元框架构建，该框架的设计思想源于论文《A Programming Paradigm for Spatiotemporal Composability》。Cordis 主要负责三件事[cite:1][cite:2]：
- **插件生命周期管理**：加载、初始化、卸载
- **依赖注入**：插件按依赖顺序启动
- **事件总线**：插件通过服务和类型化事件协作

#### 2.2 "一切皆插件"理念

DeepSeek Harness 的核心设计理念是"一切皆插件"，所有能力都是插件，包括[cite:1][cite:3]：
- 模型适配器
- 工具集
- 技能包
- 会话管理
- 沙箱环境
- 存储系统
- 循环调度
- 用户界面

### 3. 功能特性

#### 3.1 多种运行模式

DeepSeek Harness 提供四种预设运行模式[cite:1][cite:4]：

| 模式 | 功能 | 适用场景 |
|------|------|----------|
| **标准模式** | 文件读写、终端执行、联网搜索全套工具 | 日常开发、长任务 |
| **代码模式** | 模型写代码批量调用工具 | 流水线、批量清洗、自动化测试 |
| **极简模式** | 只有 shell 工具 + 文件编辑工具 | 跑分、测试（V4 Pro 官方成绩使用此模式） |
| **创建者模式** | 运行时检查、插件实验、预设创作 | 自定义智能体预设开发 |

#### 3.2 可追溯性

DeepSeek Harness 采用只追加（append-only）的会话日志，完整记录模型看到的一切信息[cite:1][cite:3]：
- 系统提示词
- 思维链
- 工具调用与结果
- 子智能体调度
- 上下文注入

#### 3.3 技术栈

- **主要语言**：TypeScript（97.1%）
- **支持语言**：Python SDK
- **开源协议**：MIT
- **部署方式**：npm 安装、源码编译[cite:1][cite:2]

### 4. 应用场景

#### 4.1 大模型评测与测试

DeepSeek Harness 可用于大语言模型的系统化能力评估、性能测试和回归验证[cite:4][cite:5]。

#### 4.2 智能体开发与部署

作为智能体运行框架，DeepSeek Harness 支持多智能体协作，可用于开发和部署各种智能体应用[cite:1][cite:3]。

#### 4.3 投研分析

实测显示，DeepSeek Harness 能够通过 Skills 调用绘图、信息检索、个股分析和基金评价等专业能力，支持多智能体协同完成复杂投研任务[cite:5]。

#### 4.4 测试开发

在测试开发五环节中，DeepSeek Harness 的实际替代能力约为 50%-67%，擅长重复劳动，但不替代判断力[cite:3]。

### 5. 与其他框架比较

| 特性 | DeepSeek Harness | lm-evaluation-harness | OpenCompass |
|------|------------------|----------------------|-------------|
| **定位** | 智能体运行框架 | 模型评测框架 | 模型评测框架 |
| **核心理念** | Agent = Model + Harness | 模型能力评测 | 模型能力评测 |
| **架构设计** | 一切皆插件 | 模块化设计 | 模块化设计 |
| **社区生态** | 新兴项目，快速发展 | 国际社区主流 | 国内常用 |
| **中文支持** | 良好 | 需手动添加 | 内置 C-Eval、CMMLU 等 |
| **易用性** | 配置灵活 | 命令行简洁 | 配置文件丰富 |

### 6. 发展现状

截至 2026 年 8 月 19 日，DeepSeek Harness 在 GitHub 上已获得近 10 万 star，项目仍在快速迭代中，目前处于开发者预览阶段[cite:1][cite:2]。项目负责人崔添翼（前 Jane Street 工程师）于 2026 年 3 月加入 DeepSeek，项目于 2026 年 5 月立项[cite:2]。

## 结论

DeepSeek Harness 作为开源智能体运行框架，通过"一切皆插件"的架构设计，为大语言模型提供了标准化的运行环境。与传统的评测框架不同，DeepSeek Harness 更注重智能体的实际运行能力，支持多种运行模式和丰富的插件生态。该项目采用 MIT 协议开源，具有良好的可扩展性和可定制性，适用于大模型评测、智能体开发、投研分析等多种应用场景。

## 参考来源

1. [DeepSeek 把模型的"马具"开源了:拆解 Harness - CSDN博客](https://blog.csdn.net/qq_41684621/article/details/163759217)
2. [DeepSeek Harness :一切皆插件的 AI Agent 编程框架 - 掘金](https://juejin.cn/post/7673522589587177526)
3. [实测DeepSeek Harness:AI到底能替测试开发做多少工作? - 华为云](https://bbs.huaweicloud.com/blogs/c06c368690314de1aac539df3b4fa4e5)
4. [DeepSeek Harness 实战指南:从零搭建 LLM 评测与测试框架 - DeepSeek技术社区](https://deepseek.csdn.net/6a82b497662f9a54cb9dc4c5.html)
5. [大模型赋能投研系列之二十九:从模型走向智能化框架，DeepSeek Harness部署教程与投研全方位评测 - 慧博投研资讯](http://wwwtest.hibor.net/wap_detail.aspx?id=5189490)
