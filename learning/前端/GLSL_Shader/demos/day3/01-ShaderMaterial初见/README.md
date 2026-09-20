# 01 · ShaderMaterial 初见

> 对应讲义 [3.1 ShaderMaterial：从原生到 Three.js 的迁移](../../../讲义/day3-Three.js实战落地/3.1-ShaderMaterial：从原生到Three.js的迁移.md) · 交互说明：移动鼠标，徽章 ±3% 视差跟随（lerp 0.08）

## 运行

```bash
npm run dev
# 打开 http://localhost:5174/demos/day3/01-ShaderMaterial初见/
```

## 行数对账

讲义 3.1 的核心论证：**同一只徽章搬进 three，样板代码塌缩**。

| 版本 | 行数 | 说明 |
| --- | --- | --- |
| 原生 WebGL（讲义极简版） | 87 行 | context / 编译链接 / VAO / resize / 循环全手动 |
| three 极简版（讲义口径） | 34 行 | ShaderMaterial 五件套 + 循环，样板只剩骨架 |
| 本工程 main.ts | 41 行 | 极简版 + chrome 接入 + 视差 lerp + 物理像素对齐 |

工程版比讲义口径多出的行不是 three 的开销——是错误面板、DPR 管理与视差手感的成本。剥掉 chrome，剩下的就是 34 行本身。

## 关键点

- **ShaderMaterial 五件套**：`Scene + OrthographicCamera(-1,1,1,-1,0,1) + PlaneGeometry(2,2) + ShaderMaterial + 循环渲染`。正交相机配 2×2 平面，恰好铺满 NDC——这是 three 里的「全屏四边形」。
- **GLSL1 风格五差异**：不写 `#version`（three 自动注入）、不声明 precision、`position/uv` 内置 attribute、`projectionMatrix/modelViewMatrix` 内置矩阵、出口写 `gl_FragColor`。shader 正文几乎零改动。
- **渲染权交接**：chrome 管 canvas 的物理像素与 CSS 尺寸，three 只管「怎么画」——`WebGLRenderer({ canvas: chrome.canvas })` 挂上画布，`setPixelRatio(1)` 按 1:1 吃物理像素，`setSize(w, h, false)` 不碰 CSS。
- **resize 时序守卫**：chrome 的 ResizeObserver 在 createChrome 内立即触发首次 applySize，早于 renderer 赋值——`syncSize` 必须 `if (!renderer) return`，renderer 建好后手动补调一次。
- **视差三定标**：目标 `(pointer.sx - 0.5) * 0.06`（±3%）、lerp 0.08、域偏移 `p -= u_parallax * vec2(aspect, 1.0)` x 乘 aspect 保视觉等比。

## 视觉规格

- 色板：BG `#0B0E14` · ROSE `#FF4D6D` · CYAN `#4CC9F0`
- 动效：徽章呼吸 3s 周期 ±4%（乘尺寸不乘颜色）；视差 lerp 0.08
- 细节：45° 对角渐变玫红→天青；描边半宽 `fwidth(sd) * 2.0` 恒定视觉宽；vignette 15%
- 性能：单 pass 全屏 quad，DPR 封顶 2，uniform 每帧 3 个写入

## 常见报错

| 症状 | 原因 |
| --- | --- |
| 画布尺寸忽大忽小 | `setSize` 第三参没传 false，three 把 inline style 的 CSS 尺寸覆写了 |
| 徽章被横向拉伸 | `u_resolution` 传了 CSS 尺寸而非物理像素，aspect 算错 |
| 视差一卡一卡 | lerp 系数写成 1（直接赋值），丢了平滑 |
| shader 报 `position` 重定义 | 手写 `attribute vec3 position`——three 已内置注入，重复声明即报错 |
| 画布全黑且无报错 | 忘了 `renderer.render(scene, camera)`——ShaderMaterial 不会自己渲染 |
