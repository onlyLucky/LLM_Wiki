# Day 3 作业 basic 参考答案 · TSL 熔核星球

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day3/basic-TSL波浪网格/index.html
```

## 实现要点

- 场景组装（任务 1）：`IcosahedronGeometry(1.6, 48)`——48 细分约 4.6 万三角面，噪声地形够细对 GPU 仍是轻活；三盏灯分工明确：暖白主光 0xffe2c4 / 1.5 从 (2.5, 3, 4) 打亮岩壳受光面、冷蓝轮廓光 0x6a86ff / 0.9 从 (-3, -1.5, -4) 勾住暗侧边缘、暗暖环境光 0x2a1a14 / 1.8 兜底球体背面；相机 (0, 0.8, 5.2) 微俯视——半径 1.6 + 沸腾置换最大约 2.0 刚好收进画面
- 噪声置换（任务 2）：`material.positionNode = Fn(() => {...})()`，同一颗 `mx_noise_float` 取三频加权——0.9 倍域权 0.55（大尺度山体）、2.1 倍域权 0.3（中尺度岩块）、3.9 倍域权 0.15（小尺度熔渣），海拔 = 加权和 ∈ 0~1；时间漂移 `flow = time · (charge·0.12 + 0.03)` 让地形缓慢流动且越热流得越快；置换幅度 `charge·0.28 + 0.14`——常温凝固 0.14、沸腾 0.42；方向用 `normalLocal`（球面上法线即径向）`p.add(normalLocal.mul(h))`；海拔标量 `varying(elev, 'vElev')` 在 Fn 内创建、模块级 `let elevV` 承接引用，colorNode 直接读同一节点（WGSL 版的手写 varying 消失了）
- 熔岩配色（任务 3）：海拔**反向**映射——`lavaMask = smoothstep(0.3, 0.48, e01).oneMinus()` 低洼带出熔岩橙 `#FF5A1F`、`coreMask = smoothstep(0.1, 0.22, e01).oneMinus()` 更低洼出炽核亮黄 `#FFC86B`、高处凝固为暗紫岩壳 `#1A1420`；炽核 mask 乘 `charge·0.4 + 0.6`（蓄热越满亮黄渗得越广），最后整体乘 `charge·0.35 + 1` 蓄热泛光
- 蓄热交互（任务 4）：`uniform(0)` 声明前置（节点图在 Fn 立即调用时就地搭建，闭包要捕获它）；`pointerdown`（挂 chrome.canvas）置 `charging = true`、`pointerup` 挂 window（移出画布也能松开）；帧循环里一行指数趋近 `charge.value += ((charging ? 1 : 0) - charge.value) * 0.03`——按住约 1.5 秒充满、松开同速冷却，节点图一个字节不动

## 与骨架的差异

- 任务 1 的 `throw` 替换为：几何创建 + 入 scene、三盏灯、相机定位
- 任务 2 的 `throw` 替换为 `positionNode` 三频 fBm 节点图（闭包 `let elevV` 传出海拔 varying）
- 任务 3 的 `throw` 替换为两段式反向混色 + 热量亮度
- 任务 4 的 `throw` 替换为 pointerdown / pointerup 监听 + 帧循环内一行 charge 指数趋近
- 其余（chrome 整合、renderer.init、帧循环骨架）与骨架逐字一致；导入表未增删

## 视觉规格

- 配色：暗紫岩壳 `#1A1420` → 熔岩橙 `#FF5A1F` → 炽核亮黄 `#FFC86B`，flatShading 导数法线让噪声地形有立体的碎渣质感
- 地形：三频 fBm（0.9 / 2.1 / 3.9 倍域 × 0.55 / 0.3 / 0.15），时间漂移流速随热量 0.03 → 0.15
- 交互：按住约 1.5 秒充满、松开同速冷却——蓄热状态机（demo 02 是参数调制，教学差异点）
- 帧率：4.6 万面 + 两个节点通道，右下角稳定 60 FPS
- 行数对照：本答案 main.ts 约 136 行 vs Day 2 demo 04 的 313 行——省掉的全是管线仪式
