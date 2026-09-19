# Demo 03 · Phong Lighting

对应讲义：`2.4 着色与光照模型`

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day2/03-phong-lighting/index.html
```

## 关键点

- Blinn-Phong 三分量（讲义 2.4）：`ambient + kd · diffuse + specular`，半程向量 `H = normalize(L + V)`，高光指数 90 保证高光集中
- 法线矩阵 = model 左上 3×3 的逆转置（`mat4NormalFromModel`，伴随矩阵除以行列式）：旋转 + 均匀缩放时恰好等于 model，非均匀缩放时缺它会「融化」
- 逐片元 `normalize(normal)`：插值只保方向不保长度，不归一化高光会拉丝
- 多光源 uniform 数组的对齐陷阱：`array<vec4f, 2>` 而非 `array<vec3f, 2>`——vec3f 数组按 16 字节步进存取，vec4f 的 w 分量装强度刚好免 padding
- 两个绑定组分工：`@group(0)` 帧级（相机 + 光源，所有物体共享），`@group(1)` 物体级（model + normalMatrix，每物体一份）
- 双管线复用同一顶点入口：`fs` 算光照，`fsMarker` 自发光（光源标记不需要被照亮）
- gamma 修正输出：`pow(color, vec3f(1.0 / 2.2))`
- 地面格点用 `fwidth` 做屏幕空间抗锯齿，向远处 `mix` 回底色藏住边界

## 视觉规格

- 光照：琥珀主光 `#F59E0B`（鼠标驱动，绕立方体滑弧、高度随鼠标 y）+ 冷补光 `#4C6FFF`（固定高位背侧、强度 0.16）——单侧强光的雕塑打光感
- 材质：立方体石墨灰（kd 约 `#616B85`）高光集中；地面深色格点，暖光在地面上形成淡淡的光池
- 动效：立方体缓慢自转 + 悬浮起伏；相机 ±0.2 内极缓慢漂移；光源标记烛光式微闪
- 底色：`clearValue` 与 CSS `#0B0E14` 一致

## 常见报错

| 报错 | 原因 |
|------|------|
| （无报错）高光拉丝、忽明忽暗 | 法线插值后未 `normalize`，长度漂移 |
| （无报错）非均匀缩放后光照错乱 | 拿 model 当法线矩阵，法线被缩放掰歪 |
| （无报错）高光处白块爆掉 / 黑块 | `pow` 前没 `max(dot, 0.0)`，负底数结果未定义 |
| 光源数据串位、颜色怪异 | vec3f 数组按 16 字节步进而 JS 侧按 12 字节打包，改用 vec4f |
