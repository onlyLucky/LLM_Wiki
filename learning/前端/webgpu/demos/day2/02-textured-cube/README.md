# Demo 02 · Textured Cube

对应讲义：`2.3 纹理采样与Mipmap`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day2/02-textured-cube/index.html
```

## 关键点

- canvas 2D 程序化纹理（讲义 2.3）：512×512「深空蓝图」——细网格 + 主网格 + 青色同心圆 + 琥珀对角带与角标，远看有图章、近看有细节
- `createTexture` 三 usage（讲义 2.3）：`TEXTURE_BINDING | COPY_DST | RENDER_ATTACHMENT`，最后一个是 mipmap 逐级渲染的前提
- `copyExternalImageToTexture`：canvas 直接作为 source 拷进第 0 级，格式 `rgba8unorm` 与 canvas 像素源匹配
- GPU 生成 mipmap 全链路：`mipLevelCount: 10`，每级一个 render pass——采样上一级（linear = 4 邻域平均）渲染进下一级，`createView({ baseMipLevel, mipLevelCount: 1 })` 选定单层
- 三线性采样：`minFilter: 'linear'` + `mipmapFilter: 'linear'`；`clamp-to-edge` 防止边缘细线污染低级 mip
- bind group 同时挂 texture view 与 sampler 两个 binding：数据与采样策略解耦

## 视觉规格

- 纹理色板：深空底 `#0D1322`、电蓝网格 `#4C6FFF`、青同心圆 `#2DD4BF`、琥珀带 `#F59E0B`、刻度字 `#E8ECF4`
- 交互：拖拽旋转轨道相机；滚轮缩放距离 2.1–11.0（平滑插值），拉远观察 mip 级间过渡
- 动效：立方体恒定缓慢自转（0.22 rad/s）；相机距离指数平滑
- 底色：`clearValue` 与 CSS `#0B0E14` 一致

## 常见报错

| 报错 | 原因 |
|------|------|
| `Texture usage (...) does not include RENDER_ATTACHMENT` | mipmap 生成把 mip 层当 render target，usage 少了 `RENDER_ATTACHMENT` |
| `... copySize (512x1) ... out of bounds` 之类 | `GPUExtent3D` 写错：要 `[512, 512]`（宽、高），不是 `[512]` |
| `Destination texture format ... is not copy-compatible` | 目标格式与外部图像源不匹配：canvas 上传用 `rgba8unorm` |
| 远处网格闪烁（摩尔纹） | 没建 mipmap，或 `mipmapFilter` 忘了设 `linear` |
| 贴图上下颠倒 | mip 生成 pass 里 v 没翻转（render target 的 +y 与纹理 v=0 方向相反） |
