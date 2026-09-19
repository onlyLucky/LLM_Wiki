# Day 2 作业 advanced 参考答案 · 纹理与光照

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day2/advanced-纹理与光照/index.html
```

## 实现要点

- 程序化贴图（任务 1）：512 × 512「星图」——深靛底 + 双层网格 + 青色瞄准环 + 琥珀对角带 + 72 颗散布星点；远看环与对角带是可辨识图章（低 mip 的验收点），近看星点与主星有细节
- mip 链（任务 1）：`createTexture` 声明 `mipLevelCount: 10`、usage 带 `TEXTURE_BINDING | COPY_DST`；第 0 级 `copyExternalImageToTexture` 整张拷入，其余 9 级把上一级 canvas `drawImage` 缩到一半再拷入对应 `mipLevel`——**每级新建 canvas**，连续缩放同一张会累积模糊
- 三线性（任务 2）：`magFilter / minFilter / mipmapFilter` 全 `linear`，`clamp-to-edge` 防止边缘主网格线污染低级 mip；绑定组两个 entry——binding 0 挂整条 mip 链的 view（不带参数的 `createView()`），binding 1 挂 sampler
- Blinn-Phong（任务 3）：`N/L/V` 全部逐片元归一化，`H = normalize(L + V)` 半程向量，`ambient = albedo × 0.08 × lc`、`diffuse = albedo × max(dot(N, L), 0) × lc`、`specular = lc × pow(max(dot(N, H), 0), 64)`，三项相加后 `pow(color, 1/2.2)` gamma 修正；色温乘进三项——切换时是「换灯泡」不是「加滤镜」
- 色温切换（任务 4）：`currentLightColor()` 返回当前档 rgb，click 把 `tempIndex` 循环前进并 `chrome.setMeta` 显示档名；启动时也 setMeta 一次，初始档直接可见

## 与骨架的差异

- `createAlbedoTexture()`：新增 `drawTextureCanvas()` 私有辅助 + 贴图上传与 9 级降采样（任务 1）
- `createSamplerAndBindGroup()`：三线性 sampler + `@group(1)` 绑定组（任务 2）
- `textured.wgsl` 的 `fs`：占位替换为完整 Blinn-Phong（任务 3）；vs 与骨架逐字一致
- `currentLightColor()` + click 监听 + 初始 `setMeta`（任务 4）
- 其余脚手架（几何、uniform 布局、轨道相机、帧循环）与骨架逐字一致

## 视觉规格

- 贴图色板：底 `#101426`、主网格电蓝 `#4C6FFF`、瞄准环青 `#2DD4BF`、对角带琥珀 `#F59E0B`、主星白 `#E8ECF4`，每面整张铺满
- 三档色温：冷月光 `(0.72, 0.82, 1.0)` → 正午白 `(1.0, 0.97, 0.9)` → 钨丝暖 `(1.0, 0.72, 0.42)`，右下角显示档名
- 光源：绕场景 0.4 rad/s 公转、高度 2.4，亮面跟随移动；高光指数 64，拖动相机时亮斑随之走
- 立方体 0.22 rad/s 恒定自转，轨道相机拖拽可环视
- 底色：`clearValue` `#0B0E14`
