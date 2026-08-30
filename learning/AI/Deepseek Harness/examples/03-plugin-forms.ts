// 03-plugin-forms.ts
// 插件的三种写法 + 资源清理与依赖注入
// 来源：官方文档 "Your first plugin"（三种形式 / Automatic cleanup / Declare dependencies）
//
// 函数形式最常用；对象形式适合把配置收拢；类形式用于向其他插件提供服务（Service）。
// ctx.effect 注册清理函数：插件卸载时自动执行，不需要手动 removeListener / clearInterval。
// inject 声明依赖：框架会等所有依赖服务就绪后才调用 apply。

import type { Context } from '@deepseek-ai/cordis'

// ---------- 形式一：函数形式（最常用） ----------
export function functionForm(ctx: Context) {
  // 需要 TCP 连接这类显式清理的资源，用 ctx.effect 提供清理器
  ctx.effect(() => {
    const timer = setInterval(() => {
      console.log('heartbeat')
    }, 5000)
    // 返回的函数在插件卸载时执行
    return () => clearInterval(timer)
  })
}

// ---------- 形式二：对象形式 ----------
export const objectForm = {
  name: 'my-plugin',
  inject: ['tools'],
  apply(ctx: Context) {
    // ctx.tools 此时已可用
    // ctx.tools.register(/* ... */)
  },
}

// ---------- 形式三：类形式（对外提供服务时使用） ----------
// import { Service } from '@deepseek-ai/cordis'
//
// export default class MyService extends Service {
//   static inject = ['tools']
//
//   constructor(ctx: Context) {
//     super(ctx, 'myService') // 其他插件通过 ctx.myService 访问
//     // 同步初始化放在构造函数里
//   }
// }
