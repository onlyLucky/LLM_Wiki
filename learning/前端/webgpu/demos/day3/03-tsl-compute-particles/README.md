# Demo 03 · TSL Compute Particles

对应讲义：`3.3 TSL计算与数据流`（Day 2 对照版本：`demos/day2/06-particle-simulation/`）

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day3/03-tsl-compute-particles/index.html
```

## 关键点

- storage 声明状态（讲义 3.3）：`new StorageInstancedBufferAttribute(COUNT, 3)` + `storage(buffer, 'vec3', COUNT)`，两块 buffer（位置/速度）全程待在显存，std430 对齐账由节点系统接管
- `Fn(() => {...})().compute(COUNT)` 一条链生成 ComputeNode（讲义 3.3）：`instanceIndex >= count` 的越界 guard 由引擎自动插入，Day 2 的 `if (i >= arrayLength(&src)) return` 不用再手写
- 两个 kernel（讲义 3.3）：`initKernel` 启动时 `renderer.compute` 跑一次（GPU 上生成三旋臂初始盘），`updateKernel` 每帧跑——单缓冲原地更新，每个 invocation 只读写自己名下的元素，Day 2 的双缓冲轮换状态机整个消失
- 力场与 Day 2 demo 06 逐行对应：`mx_noise_float` 三次偏移采样（替换 80 行手抄 simplex）、切向涡旋 + 向心束缚、鼠标引力井（力度走 `uniform().value`）、半隐式欧拉 + 指数阻尼 + 限速
- 渲染（讲义 3.3）：`material.positionNode = positions.toAttribute()` 把 storage 当实例属性读；`THREE.Sprite` + `.count = COUNT` 一次实例化 draw 画完两万，Day 2 手写的 6 顶点 quad 展开由材质接管
- `particles.frustumCulled = false`：粒子位置在 GPU 上，CPU 侧包围盒必然算错，不关会被整帧剔除
- 鼠标：`THREE.Raycaster` + `ray.intersectPlane` 求星系平面交点（Day 2 手写了约 30 行 `ndcToPlane`）
- 类型声明：three 0.186.0 未随包发布 .d.ts，环境声明在 `../three-shims.d.ts`（对整个工程生效）

## 视觉规格

- 构图：三条旋臂的星系薄盘，开普勒式初速度让画面一开始就在转；相机缓慢漂移 + 鼠标视差（±0.2 rad）
- 色板：速度映射 深空紫 `#0F0A1E` → 主题紫 `#8B5CF6` → 主白 `#E8ECF4`，柔边圆点 + 加法混合叠出辉光
- 交互：鼠标悬停即弱引力井（0.18），按住增强到 1.8，平方衰减；粒子直径约 5–9 厘米世界单位，快的粒子略大
- 底色：画布透明清屏由 renderer 管理，页面底色 `#0B0E14`

## 常见报错

| 报错/症状 | 原因 |
|------|------|
| 画面中央一团亮点、其余全黑 | `renderer.compute(initKernel)` 没跑（或忘了 `await renderer.init()`），全部粒子停在原点的初始零值 |
| `Renderer: ".compute()" called before the backend is initialized` | 忘记 `await renderer.init()` 就调 `renderer.compute()`；或改用 `renderer.computeAsync()` |
| 一半粒子不动 | `.compute(count)` 的 count 小于 storage 元素数：guard 只防越界，不替你补数量，尾部粒子拿不到 invocation |
| 控制台 storage / vertex stage 相关 validation error | `positionNode` 直接挂了 storage 节点（顶点阶段 storage 读取需要 `requiredLimits: { maxStorageBuffersInVertexStage: 1 }`）；改用 `.toAttribute()` 走实例属性 |
| 粒子数据错乱 / 间隔读位 | `StorageInstancedBufferAttribute(COUNT, 3)` 的 itemSize 与 `storage(buffer, 'vec3', COUNT)` 声明的类型不一致（如数组按 vec4 打包却声明 vec3） |
| 一转头整片粒子消失 | `frustumCulled` 没关：three 用 CPU 侧包围盒剔除，storage 驱动的位置它看不见 |
