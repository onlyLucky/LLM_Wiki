# Demo 04 · Postprocessing

对应讲义：`3.4 后处理与性能调优`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day3/04-postprocessing/index.html
```

## 关键点

- `THREE.RenderPipeline` 是后处理容器（讲义 3.4）：r183 起 `THREE.PostProcessing` 改名为它，0.186.0 里旧名仍可用但每次加载打一条弃用警告——跟旧教程抄要认得这两个名字是同一个类
- `pass(scene, camera)`（讲义 3.4）：把「渲染这个场景」本身变成节点，`getTextureNode('output')` 拿到的纹理可以像任何 texture 节点一样参与运算——后处理的全部自由度来自这里
- `bloom(node, strength, radius, threshold)`（讲义 3.4）：threshold 是亮度阈值（0–1），只有超过它的像素进提亮部；本 demo 场景设 0.85，靠 emissiveIntensity > 1 的 HDR 值喂饱它
- 输出接线：`pipeline.outputNode = scenePassColor.add(bloomPass)`——原图加辉光，最常用的「叠加」姿势
- 帧循环只调 `pipeline.render()`（讲义 3.4）：与 `renderer.render(scene, camera)` 并存会画两遍场景，直出画面覆盖后处理结果
- 色调映射：`renderer.toneMapping = ACESFilmicToneMapping` 由 RenderPipeline 在输出节点统一应用，管线内部保持线性 HDR，bloom 拿到的是未压暗的亮度
- 交互：鼠标纵移把 bloom strength 在 0.4–0.9 间平滑联动（`bloomPass.strength.value`，它是个 uniform 节点）；中心球 emissive 呼吸让辉光随之脉动
- 类型声明：three 0.186.0 未随包发布 .d.ts，环境声明在 `../three-shims.d.ts`（对整个工程生效）

## 视觉规格

- 构图：琥珀色「星环仪」——中心发光球 + 三条不同倾角的 emissive 环 + 沿环滑动的暖白热小球 + 深色地面接住光池
- 色板：主题琥珀 `#F59E0B`、暖白 `#FFE3B3` / `#FFEDD5`、深橙 `#EA580C`，底色 `#0B0E14` 与页面画框无缝
- 动效：环缓慢进动（旋转对称的 torus 自转不可见，靠倾斜变化与热小球滑动表达运动）；中心球 0.85 rad/s 呼吸驱动辉光
- 交互：鼠标纵移调 strength 0.4–0.9，横移相机视差（±0.14 rad），幅度克制

## 常见报错

| 报错/症状 | 原因 |
|------|------|
| `PostProcessing: "PostProcessing" has been renamed to "RenderPipeline"` | 跟旧教程抄了 `new THREE.PostProcessing(...)`；0.186.0 里换成 `new THREE.RenderPipeline(...)` 即可（旧名暂时还能跑） |
| 全屏过曝、糊成一片白 | bloom 的 threshold 设成 0：所有像素（包括暗部）都进提亮部，整帧被模糊后叠加；threshold 建议 0.6–1.0，靠 HDR emissive 超阈值 |
| 辉光时有时无、画面闪烁 | 帧循环里 `pipeline.render()` 与 `renderer.render(scene, camera)` 并存：场景画了两遍，直出画面盖掉后处理 |
| 有 bloom 但完全看不出来 | 场景里没有超过 threshold 的 HDR 值：普通颜色 ≤ 1，把 emissive 材质的 `emissiveIntensity` 提到 1.5–3，或降 threshold |
| 画面发灰、对比怪 | 材质里手动做了 tone mapping，输出节点又做一遍；色调映射只交给 RenderPipeline 收尾 |
