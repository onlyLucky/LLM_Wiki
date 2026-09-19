# Day 3 作业 advanced 参考答案 · 粒子文字成形

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day3/advanced-粒子文字成形/index.html
```

## 实现要点

- 文字采样（任务 1）：`OffscreenCanvas(768, 224)` 上 `fillText(word, W/2, H/2, W - 24)`——第 4 参 maxWidth 让超宽的词自动压扁；`getImageData` 按 `SAMPLE_STEP = 2` 双重循环扫 alpha 通道，`> 128` 命中后 `mapToWorld` 转世界坐标（y 翻转：画布向下、世界向上），返回拍平的 `Float32Array`
- 目标写入（任务 2）：采样点数随词长变、粒子池恒 12000——`target = pts[i % n]` 循环分配让两边彻底解耦；写完 `targetAttr.array` 后 `needsUpdate = true`，storage buffer 走版本号更新通道重传，节点图不重建
- 初始化 kernel（任务 3）：`Fn(() => {...})().compute(COUNT)` 里 `position.assign(方向 × (9 + 5·hash))`——粒子从半径 9–14 的球壳随机散布，入场即「四面八方聚成字」；`renderer.compute(initKernel)` 只跑一次
- 更新 kernel（任务 4 + 5）：力场三件套累加到 `toVar` 的 `accel` 上——弹簧 `target − position` × 26（刚度决定成形快慢）、噪声呼吸 `mx_noise_float` 三偏移采样 × 0.5（坐标混入 `time·0.4` 让场流动）、光标斥力 `toMouse·(−1)·repelStrength / (dm² + 0.35)`（平方衰减）；积分 `(v + a·dt) · exp(−3.2·dt)`，阻尼比 demo 03 的 1.6 强一倍——字要停得住
- 渲染（任务 6）：`positions.toAttribute()` 喂 `positionNode`（属性通道，避开 maxStorageBuffersInVertexStage 限制）；速度就是免费的语义通道——`speed01 = length(v)·1.8`，就位主白 `#E8ECF4`、飞驰亮紫 `#8B5CF6`；`Sprite` + `count = 12000` + `frustumCulled = false`
- 换词（任务 7）：click 里只调 `fillTargets`——弹簧只知道「拉向 target」，target 换了力场就换，旧字揉碎、新字聚成，全程无节点图重建、无闪断

## 与骨架的差异

- `sampleText()`：`throw` 替换为 OffscreenCanvas 绘字 + alpha 步长扫描（任务 1）
- `fillTargets()`：`throw` 替换为循环分配 + `needsUpdate`（任务 2）
- 任务 3 的 `throw` 替换为 `initKernel` 定义与一次性 `renderer.compute`（任务 3）
- `updateKernel = null` 赋值为完整力场 kernel（任务 4 成形 + 任务 5 呼吸与斥力）
- 任务 6 的 `throw` 替换为 `PointsNodeMaterial` 五通道配置 + `Sprite` 入 scene（任务 6）
- 任务 7 的 `throw` 替换为 click 监听（任务 7）
- 其余（三块 storage、鼠标射线管线、帧循环）与骨架逐字一致；导入表未增删

## 视觉规格

- 字形：步长 2 + 池 12000，笔画厚实清晰；`fillStyle #fff` 只用 alpha 通道判定
- 入场：球壳（半径 9–14）约两秒聚成「WEBGPU」，阻尼 3.2 保证成形后无漂移
- 呼吸：噪声扰动 0.5、场随 `time·0.4` 流动——字轻微起伏但结构不散
- 交互：悬停斥力 0.55 犁开一道口、按住 3.0 明显推开、松开回位；斥力点 `lerp 0.25` 平滑跟随
- 换词：白字瞬间炸紫（速度激增）→ 揉碎 → 聚成新词回白；点击轮换 WEBGPU → THREE.JS → COMPUTE → BLOOM
- 帧率：12000 粒子 compute + 一次实例化 draw，右下角稳定 60 FPS
