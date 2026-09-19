# Demo 02 · TSL Wave Deform

对应讲义：`3.2 TSL节点着色语言`（与 Day 2 demo 04 的原生 WGSL 版逐段对照）

## 运行

```bash
npm run dev
# http://localhost:5173/demos/day3/02-tsl-wave-deform/index.html
```

## 关键点

- 同一个波场两种写法：`Fn(([p, t]) => ...)` 对应 Day 2 demo 04 的 `fn waveField`，返回 (高度, ∂h/∂x, ∂h/∂y)，解析梯度拼法线（讲义 2.5 的策略原样平移）
- `positionNode` 是替换不是叠加：表达式里必须 `positionLocal.add(位移)`，只写位移项整张网格会塌掉
- `normalNode` 收到的是物体空间法线（与几何 normal 同一坐标系），`vec3(-∂h/∂x, -∂h/∂y, 1).normalize()` 直接挂
- `varying(wave.x)` 把波高插值到片元，等价于 WGSL 的 `@location` 顶点输出——TSL 里插值是一等公民
- 鼠标参数走 `uniform(new THREE.Vector2())`：JS 侧改 `.value`，buffer 分配、绑定组、写入时机全部交给渲染器（对照 Day 1 讲义 1.6 的手工对齐）
- 运算方向：JS 数字只能出现在节点方法参数位（`t.mul(1.1)`），`1.1 * t` 会在 JS 侧求值成 `NaN`/数字，得不到着色器代码

## 视觉规格

- 色板：青 `#2DD4BF` → 主白 `#E8ECF4` 按波高双色 mix，谷底压暗至 0.55，暗部补光带主题色
- 交互：鼠标横移调制空间频率（±20%），纵移整体推相位（±1.6 rad）
- 动效：三组正弦行波叠加（长浪 0.30 / 交叉浪 0.18 / 细浪 0.10），相机 0.1 rad·s⁻¹ 缓慢漂移
- 底色：`setClearColor` 与 CSS `#0B0E14` 一致，画布与画框无缝

## 常见报错

| 报错 | 原因 |
|------|------|
| `TSL: "Fn()" was declared but not invoked. Try calling it like "Fn()( ...params )".` | `Fn(() => {...})` 定义后忘了调用：`waveField` 要写 `waveField(positionLocal.xy, time)` |
| 整张网格塌成一个平面 / 消失 | `positionNode` 只挂了位移项，忘了 `positionLocal.add(...)`（替换语义） |
| 画面静止或出现 `NaN`、雪花噪点 | JS 数字写在节点左侧（`1.1 * t`）在 JS 侧提前求值；改 `t.mul(1.1)` |
| 光照平平的，波峰波谷一样亮 | 只改了 `positionNode` 没重建法线；`normalNode` 必须挂解析梯度 |
| 波浪是「台阶」 | 分辨率低于波长：128 段对应波长 ≥ 6–8 格，波的频率调高前先加 SEG |
