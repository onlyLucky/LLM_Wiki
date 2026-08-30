// 01-hello-plugin.ts
// 第一个 DeepSeek Harness 插件：验证插件加载机制
// 来源：官方文档 "Your first plugin"（docs/user/develop/basic/index.md）
//
// 用法：放到仓库外任意目录（如 scratch-plugin/src/），
// 通过 cordis.yml overlay 注册后启动：
//   pnpm dsh web --patch ./scratch-plugin/cordis.yml
// 终端打印 [hello-plugin] plugin loaded! 即加载成功

import type { Context } from '@deepseek-ai/cordis'

export const name = 'hello-plugin'

export function apply(ctx: Context) {
  // 依赖的服务在 apply 运行前就已就绪
  console.log('[hello-plugin] plugin loaded!')
}
