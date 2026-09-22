# Day 2 作业 challenge · GPGPU 余烬升腾

一万颗粒子是炉膛里的余烬：底部火床向上喷出一根摇曳的火柱，噪声湍流让火苗翻卷，按住鼠标掀起一阵风把余烬吹散，松开后火柱重新聚拢。没有顶点缓冲、没有静态几何——位置每帧由 compute 算出，渲染管线直读 storage。这是 2.6 与 2.7 的全链路整合，约 2 小时；不想做粒子的话，文末有一道同等难度的 SDF 替代题。

## 目标

把讲义 2.7 的状态机从零搭一遍：粒子 struct 与对齐、双 storage buffer、compute 管线与力场、ping-pong 轮换、storage 直读渲染、速度色带。场景换成火，力场五件套里的每一件都和星系版不一样，照抄没有意义。完成后你就拥有 lusion / igloo 那类粒子效果的最小完整闭环，Day 3 的 TSL 计算节点只是换个语法重写同一套结构。

## 前置讲义

- 前置讲义 2.6（计算着色器入门）：dispatch / workgroup / storage
- 前置讲义 2.7（GPGPU 粒子与动画模拟）：双缓冲状态机、simplex、quad 展开、速度色带

## 任务清单

1. `createParticleStates()`——两个 `STORAGE` buffer（各 `COUNT × 32` 字节），初始火床写进 `states[0]`（sqrt 均匀圆盘 + 铺满烟囱高度 + 向上初速度）
2. `createComputePipeline()`——compute 管线创建 + `particles.wgsl` 里 `update` 的力场实现（噪声湍流 + 浮力 + 烟囱束缚 + 鼠标风 + 出界重生）
3. `createComputeBindGroups()` + 帧循环三处——两组「读 i 写 1−i」的绑定组；渲染读 `renderBindGroups[1 - cur]`；帧尾 `cur = 1 - cur`
4. `createRenderPipeline()` / `createRenderBindGroups()` + `render.wgsl` 的 vs——加法混合管线；两组渲染绑定组；quad 展开（`vertex_index` 取角、`instance_index` 取粒子）
5. `render.wgsl` 的 fs——速度 → 颜色映射：暗红 → 炽橙 → 金 → 白热

TODO 1–4 的函数体是 `throw new Error('TODO(day2-challenge-n) 未完成')`，补完删 throw；TODO 2 / 4 / 5 的着色器部分直接改两个 `.wgsl` 里的占位（占位能编译能跑，方便分步验收）。

## 验收标准

- 1 万粒子流畅：右下角稳定 60FPS，火柱持续升腾翻卷
- 按住鼠标掀起一阵风把余烬吹散，松开后火柱恢复柱状升腾（与星系引力井相反的交互语义）
- 双缓冲正确：无「每帧抖回旧位置」的闪烁现象
- 速度色带可辨：烟囱核心的高速粒子白热，边缘低速余烬接近暗红
- 改大 `COUNT` 到 3 万依然流畅（GPU 并行的红利，CPU 方案这时已经跪了）

## 提示

<details>
<summary>第一档：思路</summary>

初始火床用 `sqrt(random()) * 0.85` 生成半径（sqrt 让圆盘面积均匀，不是先密后疏），角度全随机；y 方向从炉底 `-1.42` 一直铺到烟囱口 `1.48`；初速度全部向上、大小 `0.25 + random() * 0.45`——画面从第一帧起就在往上冒。力场五件套按注释顺序写：湍流 → 浮力 → 烟囱束缚 → 鼠标风 → 出界重生，每写一件跑一次看效果，别一次全写完。注意鼠标风与星系版引力井方向相反：沿 `(p − mouse)` 往外推，把余烬吹开。重生需要确定性随机，用 `hash11(n) = fract(sin(n) * 43758.5453123)`，seed 混入粒子编号和时间，保证每一颗粒子重生位置都不同。绑定组轮换记一句话：「compute 读 cur 写 1−cur，渲染必须读刚写完的那个，帧尾翻转指针」。
</details>

<details>
<summary>第二档：API 名</summary>

`GPUBufferUsage.STORAGE`；`createComputePipeline({ layout: 'auto', compute: { module, entryPoint: 'update' } })`；`getBindGroupLayout(0)`；`beginComputePass` / `dispatchWorkgroups(Math.ceil(COUNT / 64))`；渲染管线 blend：`{ color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } }`。quad 角点数组是「动态索引的本地数组」——WGSL 里必须 `var corners = array<vec2f, 6>(...)` 声明（讲义 1.4 的坑）。力场骨架与双缓冲结构可以对照 demos/day2/06-particle-simulation 读，但力场五件套和色带必须自己写——照抄星系参数只会得到一团蓝色烟雾。
</details>

<details>
<summary>第三档：伪代码</summary>

```text
createParticleStates:
  a = createBuffer(COUNT * 32, STORAGE); b = createBuffer(COUNT * 32, STORAGE)
  init = new Float32Array(COUNT * 8)
  for i in 0..COUNT:
    rr = sqrt(rand()) * 0.85          # sqrt 均匀盘（面积均匀）
    a  = rand() * 2π
    k  = i * 8
    init[k..k+2] = (cos(a)·rr, -1.42 + rand()·2.9, sin(a)·rr)   # y 铺满烟囱
    init[k+5] = 0.25 + rand() * 0.45  # 向上初速
  writeBuffer(a, init); return [a, b]

computeBindGroups: computeBindGroups[i] = {0: states[i], 1: states[1-i], 2: simBuffer}

update（WGSL 力场）:
  np = p * 1.1
  turb = vec3(snoise(np + 偏移1 + t*0.25), snoise(np + 偏移2 + t*0.25), snoise(np + 偏移3 + t*0.25)) * 0.55
  accel = turb
  accel += (0, 1.25, 0)                                 # 浮力
  accel += (-p.x * 0.35, 0, -p.z * 0.35)                # 烟囱束缚，拢回轴心
  toP = p - u.mouse.xyz; dm2 = dot(toP, toP)
  gust = select(0.0, 2.6, u.mouse.w > 0.5) / (dm2 + 0.40)     # 鼠标风外推
  accel += toP / (sqrt(dm2) + 1e-4) * gust
  nv = (v + accel * dt) * exp(-1.0 * dt); 限速 1.8
  np2 = p + nv * dt
  if np2.y > 1.55:                                      # 出界重生回火床
    seed = f32(i) * 0.618 + u.params.x * 7.13
    np2 = ((hash11(seed) - 0.5) * 1.7, -1.42, (hash11(seed + 91.7) - 0.5) * 1.7)
    nv  = (0, 0.28 + hash11(seed + 43.1) * 0.4, 0)
  dst[i] = Particle(np2 打包 vec4f, nv 打包 vec4f)

vs 的 quad:
  corners = [(-1,-1),(1,-1),(-1,1),(-1,1),(1,-1),(1,1)]
  out.position = clip + vec4f(corners[vi] * u.res.w / u.res.xy, 0, 0)

fs 的色带:
  t = clamp(speed / 1.4, 0, 1)
  col = mix(#3B0D03, #E85C1F, smoothstep(0, 0.40, t))
  col = mix(col, #FFC24D, smoothstep(0.38, 0.85, t))
  col = mix(col, #FFF7E8, smoothstep(0.80, 1.0, t))
  mask = smoothstep(1.0, 0.2, length(uv))
  return vec4f(col * mask, mask)
```
</details>

## 替代题：SDF 场景

不想做粒子系统的话，改做一道 2.8 风格的 raymarching 场景，难度等价、知识点互不重叠（粒子换几何、compute 换全屏 fs）。在 `homework/day2/` 下自建 `challenge-sdf-场景/` 目录，从空白 `main.ts` + `scene.wgsl` 开始（外壳照抄本作业的初始化与帧循环骨架）。

**要求**

- 全屏大三角形：顶点 `(-1,-1) (3,-1) (-1,3)`，无顶点缓冲，NDC 从 vs 插值传到 fs
- 至少两个 SDF 融合：球 + 圆角盒用 smooth min 融出有机造型，`map(p)` 返回 `(距离, 材质)`
- 软阴影：沿光源方向二次步进，`min(res, h / (k·t))` 的经典写法
- 鼠标转相机：NDC 映射到方位角/俯仰角（幅度克制，±0.5 rad 量级），相机基在 fs 里构建射线

**验收**：雕塑造型完整无穿透（步进循环上限 ≥ 90 步）、影子随光源位置变化且边缘柔和、鼠标拖动能环视、距离雾把远处融进底色。

**提示**：结构对照 demos/day2/07-raymarching 与讲义 2.8；GLSL 前置在《Three.js 创意 3D 课程笔记》第 16 课。法线用四面体差分（四次采样省过六次），命中判据用相对误差 `0.001·t` 防远处闪烁。
