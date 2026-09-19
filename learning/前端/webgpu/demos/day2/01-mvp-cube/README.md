# Demo 01 · MVP Cube

对应讲义：`2.1 2D与3D空间变换` → `2.2 光栅化与片元插值`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day2/01-mvp-cube/index.html
```

## 关键点

- 手写列主序 mat4（讲义 2.1）：`mat4Multiply` / `mat4Perspective` / `mat4LookAt` / `mat4RotateY` / `mat4Translate` / `mat4Scale`，组合顺序 `P·V·M`，与 WGSL 的 `u.mvp * vec4f(p, 1.0)` 方向一致
- WebGPU 透视矩阵：NDC 的 z ∈ [0, 1]，`m[11] = -1` 让 w = −z_view（讲义 2.1 的「别抄 OpenGL」）
- uniform 打包 80 字节：`mat4x4f`（64B）+ `vec4f`（16B），天然 16 字节对齐（讲义 1.6 的落地）
- 深度测试全链路（讲义 2.1）：`depth24plus` 纹理 + `depthStencilAttachment` + `depthWriteEnabled` + `depthCompare: 'less'`，`onResize` 里重建 depth texture
- 背面剔除（讲义 2.2）：`cullMode: 'back'`，面的角点序号从外侧看逆时针
- 每面一色的实现：颜色属于面而角点被三面共享，8 个角点展开成 24 顶点 + 36 索引（讲义 2.2）

## 视觉规格

- 色板：六面为课程色系变体——前 电蓝 `#4C6FFF` / 后 紫 `#8B5CF6` / 右 青 `#2DD4BF` / 左 琥珀 `#F59E0B` / 上 主白 `#E8ECF4` / 下 浅蓝 `#8FA5FF`
- 交互：拖拽做轨道相机（球坐标平滑插值，纵向限制极角）；无输入 2.5 秒后立方体缓慢自转
- 动效：±2% 呼吸缩放、±0.1 纵向浮动、亮度 ±4% 呼吸
- 底色：`clearValue` 与 CSS `#0B0E14` 一致，画布与画框无缝

## 常见报错

| 报错 | 原因 |
|------|------|
| `... have differing sizes ...`（depth 与 color attachment） | depth texture 尺寸与画布不一致：必须 `onResize` 重建 |
| （无报错）面片乱序穿插 | pipeline 忘配 `depthStencil`，或忘了 `depthWriteEnabled` |
| （无报错）画面全空 | near/far 反了（near 必须 < far 且为正），或 `cullMode` 与绕序不匹配 |
| 深度关系整体错乱 | 透视矩阵抄了 OpenGL 版（z ∈ [-1,1]），WebGPU 是 [0,1] |
