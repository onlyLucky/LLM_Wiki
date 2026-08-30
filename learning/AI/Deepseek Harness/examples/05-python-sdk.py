# 05-python-sdk.py
# Python SDK 最小可用程序：脱离 Web UI，在脚本/CI 里跑一个 agent 任务
# 来源：官方文档 "Get started with the Python SDK"（docs/user/guide/python-sdk.md）
#
# 前置条件：Python 3.10+；Linux x64/arm64 或 macOS 14+ (arm64)
# 安装：python -m pip install deepseek-harness-sdk
# 环境变量：
#   export DEEPSEEK_API_KEY=sk-xxx
#   export DEEPSEEK_BASE_URL=http://127.0.0.1:8000/v1   # 可选，OpenAI 兼容代理
#
# 注意：minimal 组合使用 danger-full-access 权限，只在一次性 checkout
# 或容器里运行；该组合依赖 POSIX 终端，不支持 Windows。

from pathlib import Path

from deepseek_harness import DeepSeekHarness

config = Path("examples/jsonrpc-agent/minimal.cordis.yml").resolve()
workspace = Path("/absolute/path/to/workspace").resolve()
sessions = Path("/absolute/path/to/sessions").resolve()

with DeepSeekHarness(
    provider="deepseek-official",
    model="deepseek-v4-flash",
    max_tokens=49_152,
    cwd=str(workspace),          # agent 可操作的工作区
    session_root=str(sessions),  # 会话日志（JSONL）与状态存放目录
    cordis=str(config),          # 组合配置（Cordis primer 语法）
) as harness:
    result = harness.run(
        "Inspect the repository and fix the failing tests.",
        session_id="example-001",  # 复用 id 会延续同一会话（含持久 bash 状态）
    )
    print(result.final_response)

# DeepSeekHarness 惰性启动捆绑的运行时，并在上下文管理器退出前复用它。
# 复用同一 harness + session id 会保留会话专属的 bash 进程
# （工作目录、导出变量、shell 函数）；独立任务请换新的 session id。
