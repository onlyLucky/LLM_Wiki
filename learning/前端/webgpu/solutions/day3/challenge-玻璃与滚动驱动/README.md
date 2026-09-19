# Day 3 作业 challenge 参考答案 · 玻璃与滚动驱动

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day3/challenge-玻璃与滚动驱动/index.html
```

## 实现要点

- 光墙（任务 1）：11 根 `BoxGeometry(0.1, h, 0.1)` 竖条沿 x 从 −3.6 排到 3.6，高度 `4.2 + sin(i·2.3)·0.6`、进深 `sin(i·1.7)·0.4` 双重正弦起伏——折射像有韵律而非栅栏；`emissive` 电蓝/青/琥珀三色轮换，`emissiveIntensity = 2.2 + (i % 4)·0.4`（**> 1 才是 HDR，才喂得饱 bloom**）；`24×24` 深色地面 `y = −2.6` 压稳构图
- 玻璃标志（任务 2）：`RoundedBoxGeometry(1.7, 1.7, 0.55, 5, 0.14)` + `MeshPhysicalNodeMaterial` 参数组——`transmission: 1` 折射总开关、`thickness: 1.2` 位移量、`roughness: 0.08` 揉散折射像、`ior: 1.5`、`attenuationColor 0x9FD8E8` + `attenuationDistance 1.6` 微青冰感、`side: DoubleSide` 给厚度感；起手 `position (0, 2.0, 1.8)` 悬在高处
- 滚动进度（任务 3）：`max = scrollHeight − innerHeight`，`max > 0 ? scrollY / max : 0`——分母为零（页面没撑开）必须防，否则 NaN 顺着 lerp 污染整条链
- 相机映射（任务 4）：轨道角 `−0.75 + p·2.7` 扫过约 155°，`position = (sin·5.4, 2.3 − p·1.7, cos·5.4)`，`lookAt(0, 0.35, 0)` 盯住玻璃落点
- 玻璃入场（任务 5）：JS 手写 `smoothstep(0.35, 0.85, p)` 先压一遍进度——下落（2.0 → 0.35）、后收（1.8 → 0.4）、转身（`rotation.y = e·π·0.9`）全部集中在滚动中段，首尾两章姿态稳定
- 后处理链（任务 6）：`RenderPipeline`（r183 起改名）+ `pass(scene, camera).getTextureNode('output')` + `bloom(..., 0.45, 0.6, 0.65)`，`outputNode = scenePassColor.add(bloomPass)`；帧循环只调 `pipeline.render()`——`renderer.render` 与它并存会画两遍场景（讲义 3.4 坑位榜首）
- bloom 升起（任务 7）：`strength.value += (0.15 + p·0.7 − strength) · 0.06`——lerp 系数 0.06 比相机的 0.08 慢半拍，光比镜头迟一步到位

## 与骨架的差异

- 任务 1 的 `throw` 替换为光墙 for 循环（含 `GLOW` 色表）+ 地面（任务 1）
- 任务 2 的 `throw` 替换为 `glass` 的创建与入 scene（任务 2）
- `readScrollProgress` / `applyCamera` / `applyGlass` 三个空函数补全（任务 3 / 4 / 5）
- 新增 `smoothstep()` 私有辅助函数（任务 5 需要，骨架未提供）
- `pipeline` / `bloomPass` 两个 `null` 占位赋值为完整后处理链（任务 6）
- `applyBloom` 空函数补全（任务 7）
- 其余（DOM 滚动层、章节文案、场景骨架、帧循环）与骨架逐字一致

## 视觉规格

- 色板：背景 `#0B0E14` 与页面底色无缝；光墙三色 `#4C6FFF` / `#2DD4BF` / `#F59E0B`，HDR 亮度 2.2–3.4；地面 `#0D1017`
- 滚动叙事：四章 108vh 占位——Float（悬浮）→ Orbit（绕行）→ Refract（折射）→ Bloom（满溢），文案左右交替
- 相机：滚动一轮绕行约 155°，高度 2.3 → 0.6，全程 `lerp 0.08` 平滑无步进
- 玻璃：中段入场（进度 35%–85%），下落 1.65、后收 1.4、转身 162°；透过它可见光墙被 1.5 折射率压弯的像
- bloom：strength 0.15 → 0.85 随进度升起，阈值 0.65 只收 HDR 亮部；收尾时光墙亮部满溢
- 帧率：transmission 是最贵的材质，右下角 60 FPS；掉帧先关 `antialias` 对比
