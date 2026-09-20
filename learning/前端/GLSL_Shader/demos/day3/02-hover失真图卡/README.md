# 02 · hover 失真图卡

> 对应讲义 [3.2 图片失真与鼠标视差](../../../讲义/day3-Three.js实战落地/3.2-图片失真与鼠标视差.md) · 交互说明：悬停图卡，波纹从光标扩散（0.8s easeOutCyclic）；移开缓动回零

## 运行

```bash
npm run dev
# 打开 http://localhost:5174/demos/day3/02-hover失真图卡/
```

## 关键点

- **纹理一行上传**：Day 1 的五步仪式（createTexture → pixelStorei → texImage2D → 采样参数 → 绑定 uniform）在 three 里压成一个 `CanvasTexture` / `TextureLoader`。但两件事必须手动：`tex.colorSpace = THREE.SRGBColorSpace`（0.152+ 贴图默认按线性数据，不设照片发灰）、`tex.anisotropy = renderer.capabilities.getMaxAnisotropy()`（斜视角清晰度）。
- **hover 是强度，不是开关**：`u_hover` 永远是 lerp 0.08 的渐进值。失真量、RGB shift、边缘微光全部乘它——「shift 常驻是坏屏，shift 乘 hover 是按下快门的呼吸感」。
- **波纹两组件**：`ring` 是几何（半径随时间扩张的失真场，JS 侧 easeOutCubic 驱动 `u_ripple`），`fbm` 是液体（环带边缘不规则）。`flow = normalize(uv - u_mouse + 1e-4) * ring * fbm * 0.35 * u_hover`——离开后 `u_ripple` 保持不再扩张，失真随 hover 淡出，潮水退去。
- **RGB shift 三行**：shift = `0.012 * u_hover`，g 通道取中心采样作锚——三个通道总要有一个钉在原位，色散才不糊。
- **三层视差**：同一份鼠标输入、系数带符号——图卡内容 +5%（shader `u_parallax`）、页头标题 -3%（DOM translate3d）、底部水印 +2%（DOM）。速度差就是层次本身。chrome 的 `sx/sy` 已内置 0.08 阻尼，无需再手写 lerp。
- **hover 判定的数学等价**：光标换算到图卡局部 uv 后做矩形判断，效果与图卡 DOM 的 mouseenter/leave 一致——raycaster 属 Threejs创意3D 的领地，本课不碰。

## 视觉规格

- 图卡：`PlaneGeometry(3, 3.75)` 严格 4:5 居中，fov 45 下长边占视口 72%（窄屏按宽算）；纹理为程序化 canvas 海报 1024×1280（夜空 + 月晕 + 山脊 + 大字，不引外床）
- 波纹：0.8s easeOutCubic 扩至 90% 半径，软边带宽 0.18，flow 强度 0.35，fbm 3 octave
- 色差：RGB shift 最大 1.2%，水平方向，g 通道锚定
- 微光：内侧 sdBox glow，亮度 `(0.5 + u_hover * 0.5)`
- 收尾：vignette 12% + grain 3%（2.8 配方卡的图卡版，两步足够）
- 色板：BG `#0B0E14` · CYAN `#4CC9F0` · 月 `#DFF3FF`
- 性能：单 plane 单材质，fbm 只在图卡像素上跑，DPR 封顶 2

## 常见报错

| 症状 | 原因 |
| --- | --- |
| hover 一闪而过、生硬 | `u_hover` 直接 0/1 切换——必须 lerp，进 shader 的永远是浮点强度 |
| 图片平时就有细碎扭曲 | 失真量没乘 `u_hover`——常驻失真像坏屏 |
| 图被拉扁 | plane 宽高比与纹理宽高比不一致——plane 尺寸按图片比例定 |
| 图片上下颠倒 | three 的 flipY 默认 true，正着用别动它；从原生迁来的直觉会说反 |
| 照片发灰 | 忘设 `tex.colorSpace = THREE.SRGBColorSpace` |
| 波纹是椭圆不是圆 | 距离计算忘了 `ac()` 宽高比修正 |
| 波纹不动 | hover 时没记 `t0`，或 ripple 忘乘最大半径 0.9 |
| 边缘拉丝 | 视差/失真采样越界——对采样坐标 clamp，或给纹理设 ClampToEdge |
