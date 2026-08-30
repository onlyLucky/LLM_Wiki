// 02-greet-tool.ts
// 给 Web UI 增加一个自定义工具：理解 defineTool DSL 的最小示例
// 来源：官方文档 "Build a tool"（docs/user/develop/basic/tool.md）
//
// 要点：
// - inject: ['tools'] 让 Cordis 等待工具注册表就绪后再加载本插件
// - parameters 声明入参 schema，defineTool 会据此推断和校验 args
// - output.schema 声明 execute 的返回类型（canonical value）
// - output.render 把返回值转换成模型可见的内容块
// 启动后在 Web UI 里输入：Use the greet tool to greet Ada.

import type { Context } from '@deepseek-ai/cordis'
import { defineTool } from '@deepseek-ai/dsh-tools'

export const name = 'greet-tool'
export const inject = ['tools']

export function apply(ctx: Context) {
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
}
