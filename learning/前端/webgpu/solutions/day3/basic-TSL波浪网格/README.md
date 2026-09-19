# Day 3 作业 basic 参考答案 · TSL 波浪网格

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day3/basic-TSL波浪网格/index.html
```

## 实现要点

- 场景组装（任务 1）：`PlaneGeometry(6, 6, 160, 160)` 挂 material 后 `rotateX` 同款的一行 `grid.rotation.x = -Math.PI / 2`——WGSL 版要在顶点着色器里手工旋转平面，引擎层一个属性搞定；环境光 0.5 只抬暗部、方向光 2.0 从 (2.5, 4, 2) 斜上方打入，相机 (3.4, 2.8, 4.8) 俯视原点
- 顶点波浪（任务 2）：`material.positionNode = Fn(() => {...})()`——三组浪与 Day 2 demo 04 的 `waveField` 同构：主浪 `sin(x·1.4 + t)`、交叉浪 `sin(z·2.3 + 1.3t)·0.5`、斜向细浪 `sin((x+z)·3.1 − 1.7t)·0.25`，振幅整体 ×0.35；Fn 返回完整新位置 `vec3(p.x, h·0.35, p.z)`（positionNode 是替换不是叠加）
- 高度双色（任务 3）：`mix(color(0x0F3B3A), color(0xE8ECF4), positionWorld.y·1.6 + 0.35 → clamp 0..1)`——高度读 `positionWorld.y`，位移过的世界坐标自动流到片元阶段，WGSL 版的手写 varying 消失了；振幅 ±0.61 乘 1.6 加 0.35 后恰好铺满 0–1 色带
- 鼠标调制（任务 4）：`uniform(vec2(0, 0))` 创建一次（`.value` 是真 Vector2），`pointermove` 里按 NDC 换算写 `.value`；x 折进主浪频率（±20%）、y 折进整体相位（系数 0.2），节点图一个字节没动

## 与骨架的差异

- 任务 1 的 `throw` 替换为：网格创建 + 转平 + 入 scene、两盏灯、相机定位
- 任务 2 + 4：`throw` 替换为 `mouse` uniform 声明（置于 Fn 之前——节点图在 Fn 立即调用时就地搭建，闭包要捕获它）、`positionNode` 节点图、`pointermove` 监听
- 任务 3 的 `throw` 替换为 `colorNode` 的双色 mix
- 其余（chrome 整合、renderer.init、帧循环）与骨架逐字一致；导入表未增删——`float` 等数字常量直接写在方法参数位，无需节点化

## 视觉规格

- 色带：波谷深青 `#0F3B3A` → 波峰主白 `#E8ECF4`，flatShading 导数法线让受光面呈现立体的碎片感
- 波浪：三组浪叠加（振幅 0.35 / 0.175 / 0.0875），斜向细浪消掉「搓衣板」感；`time` 节点驱动，无 JS 侧每帧写入
- 鼠标：横移改变主浪疏密、纵移整体推浪（幅度克制，扰动系数 0.2）
- 帧率：16 万顶点网格 + 两个节点通道，右下角稳定 60 FPS
- 行数对照：本答案 main.ts 约 110 行 vs Day 2 demo 04 的 313 行——省掉的 200 行全是管线仪式
