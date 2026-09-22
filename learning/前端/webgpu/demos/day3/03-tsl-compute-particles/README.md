# 03 · TSL EXCITED STATE（激发态）

对应讲义 3.3「TSL 计算与数据流」。场景是一枚受激的原子：一万六千粒子按能级在轨道上环流——1S 电子云、2P 经线环、3D 四叶玫瑰线；鼠标是激发束，被击中的粒子脱轨、回弹、白闪。教学主线与 Day 2 demo 06 一脉相承，但力场是全新写的——省下的脚手架一行都不用再抄。

```bash
npm run dev
# http://localhost:5173/demos/day3/03-tsl-compute-particles/index.html
```

## 关键点

- **storage 双块**：`StorageInstancedBufferAttribute(COUNT, 3)` × 2 + `storage(buffer, 'vec3', COUNT)`，布局由节点系统接管，std430 对齐账从源头消失
- **一条链一个 kernel**：`Fn(() => {...})().compute(COUNT)`，越界 guard 由引擎自动插入，`instanceIndex` 寻址自己名下的元素
- **GPU 上初始化**：`initKernel` 启动时跑一次，三能级轨道在 GPU 上生成，buffer 从出生起没被 CPU 碰过
- **单缓冲原地更新**：每个 invocation 只读写自己名下的元素，没有跨粒子依赖——Day 2 的双缓冲轮换整个消失；弹簧力场自带收敛，连出界重生都不需要
- **`mx_noise_float` 一行顶 80 行**：三次偏移采样做量子抖动，幅度压小——是闪烁不是乱流
- **能级派生共用**：`deriveOrbit()` 组合子在 initKernel 与 updateKernel 各调一次，档位用 `step` 硬切、零分支，参数永远对得上
- **`toAttribute()` 走属性通道**：直接挂 storage 会吃 `maxStorageBuffersInVertexStage` 配额，转实例属性无此限制
- **Sprite + count 一次实例化 draw**：`frustumCulled = false` 必须关（CPU 侧包围盒看不见 GPU 位置）
- **Raycaster 两行**：`setFromCamera` + `intersectPlane` 顶替 Day 2 约 30 行的 ndcToPlane

## 视觉规格

- 能级三档（按 `instanceIndex/COUNT` 硬切）：1S 60%，基准半径 0.62、角速度 1.15，半径按 `sqrt(hash)` 弥散 30%~100% 涨成体积电子云；2P 25%，基准半径 1.18、经线环，环半径弥散 80%~115% 散开两极汇聚点；3D 15%，半径 1.72、四叶玫瑰线（花瓣幅度 0.22）
- 速度色带：深藏蓝 `#0A1B3F` → 亮蓝 `#2E7CF6`（smoothstep 0→0.45）→ 青 `#35E0D0`（0.42→0.78）→ 白 `#F2FBFF`（0.75→1.0），归一分母 2.4——巡航电子落在蓝青段，激发/回弹冲顶白闪；外层电子更快更亮，颜色和物理自洽
- 交互：悬停激发 0.9（轻扰），按住 3.0（激发束）；弹簧刚度按能级 8.0/6.5/5.0，外层更松更飘逸
- 密度管理：加色混合下 COUNT 16384 + `opacityNode ×0.72` + `sizeNode 0.028~0.058` 三管齐下，高密度区不糊成白斑白线
- 原子核：独立 Sprite，sizeNode 走 `coreSize` uniform、JS 每帧写 `.value` 脉动，不参与 compute——实例 Sprite 的 quad 尺寸由 sizeNode 决定，`mesh.scale` 不参与
- 相机：斜俯 0.50 rad 环绕漂移 + 鼠标视差，底色跟随 chrome 深空底

## 常见报错

| 现象 / 报错 | 原因 |
|-------------|------|
| `Renderer: ".compute()" called before the backend is initialized.` | compute / render 在 `await renderer.init()` 之前调用。init 排在最前；偶发场景可改 `computeAsync()` |
| 画面中央一团亮点、其余全黑 | initKernel 没跑（或初始化失败被吞），粒子停在原点零值。GPU 上的初始轨道不是免费的，忘了调度就没有 |
| 一半粒子不动 | `.compute(count)` 的 count 小于 storage 元素数：guard 只防越界不补数量，尾部粒子分不到 invocation |
| 控制台 storage / vertex stage 相关 validation error | positionNode 直接挂了 storage 节点，顶点阶段 storage 读取超出配额；改用 `.toAttribute()` |
| 粒子数据错乱、坐标间隔串位 | `StorageInstancedBufferAttribute` 的 itemSize 与 `storage(buffer, 'vec3', COUNT)` 声明不一致——对齐由节点系统接管的前提是两边自洽 |
| 相机一转整片粒子消失 | `frustumCulled` 没关：three 的剔除用 CPU 侧包围盒，storage 里的位置它看不见 |
