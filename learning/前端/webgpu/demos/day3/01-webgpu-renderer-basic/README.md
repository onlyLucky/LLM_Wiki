# Demo 01 · WebGPURenderer Basic

对应讲义：`3.1 WebGPURenderer架构与迁移策略`（材质一行的伏笔在 3.2 展开）

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day3/01-webgpu-renderer-basic/index.html
```

## 关键点

- chrome 整合模式：Day 3 不再调用 `initGPU()`，`WebGPURenderer` 自己完成 adapter / device / context / 每帧 pass 编排；帧循环仍用 `chrome.startLoop`（保留 FPS 统计与 800ms 淡入）
- `await renderer.init()` 必须在首次 `render()` 之前；无 WebGPU 时 init 内部自动回退 WebGL2 后端（控制台 warn，功能照常）
- 外部直接改 `canvas.width/height`（chrome 的 ResizeObserver 就在干这事）渲染器不会感知，`onResize` 里必须显式 `setPixelRatio` + `setSize(w/dpr, h/dpr, false)`
- `MeshStandardNodeMaterial` 未挂任何节点时就是标准 PBR 材质——Node System 是「可编程增强」而非「必须写节点」
- `setClearColor` 的色值用 `setHex(hex, LinearSRGBColorSpace)` 原样传入：clearValue 不走 `outputColorSpace` 的 sRGB 编码，这样画布底色才与 CSS `#0B0E14` 无缝

## 视觉规格

- 色板：电蓝 `#4C6FFF` 主体的 torus + 紫 `#8B5CF6` 轮光 + 冷白主光，Day 3 首页基调
- 交互：鼠标横移 ±0.12 rad、纵移 ±0.08 rad 的相机轨道微视差
- 动效：torus 双轴慢旋（0.13 / 0.21 rad·s⁻¹）+ 相机 0.35 rad·s⁻¹ 呼吸，静态构图不静止
- 底色：`setClearColor` 与 CSS `#0B0E14` 一致，画布与画框无缝

## 常见报错

| 报错 | 原因 |
|------|------|
| `THREE.Renderer: .render() called before the backend is initialized. Use "await renderer.init();" before rendering.` | 忘了 `await renderer.init()`（或 init 失败后仍然 render） |
| 控制台 warn `WebGPURenderer: WebGPU is not available, running under WebGL2 backend.` | 浏览器不支持 WebGPU 时的自动回退提示，不是错误，页面照常运行 |
| 画布拉伸、模糊或只有左上角一块有画面 | 只改了 canvas 尺寸没调 `renderer.setSize`；或 `setPixelRatio` 与实际 DPR 不一致 |
| 报错里出现 `WebGLRenderer` 字样 | 混用了 `three`（经典渲染器）与 `three/webgpu` 两个入口，Day 3 统一从 `three/webgpu` 导入 |
