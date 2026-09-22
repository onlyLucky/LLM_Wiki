# Day 2 作业 challenge · GPGPU 粒子星系

一万颗粒子组成星系：噪声与涡旋让盘面流动，按住鼠标出现引力井把粒子聚拢，松开后散开。没有顶点缓冲、没有静态几何——位置每帧由 compute 算出，渲染管线直读 storage。这是 2.6 与 2.7 的全链路整合，约 2 小时；不想做粒子的话，文末有一道同等难度的 SDF 替代题。

## 目标

把讲义 2.7 的状态机从零搭一遍：粒子 struct 与对齐、双 storage buffer、compute 管线与力场、ping-pong 轮换、storage 直读渲染、速度色带。完成后你就拥有 lusion / igloo 那类粒子效果的最小完整闭环，Day 3 的 TSL 计算节点只是换个语法重写同一套结构。

## 前置讲义

- 前置讲义 2.6（计算着色器入门）：dispatch / workgroup / storage
- 前置讲义 2.7（GPGPU 粒子与动画模拟）：双缓冲状态机、simplex、quad 展开、速度色带

## 任务清单

1. `createParticleStates()`——两个 `STORAGE` buffer（各 `COUNT × 32` 字节），初始星系盘写进 `states[0]`（三条旋臂 + 高斯散布 + 切向初速度）
2. `createComputePipeline()`——compute 管线创建 + `particles.wgsl` 里 `update` 的力场实现（噪声漂移 + 涡旋 + 鼠标引力 + 半隐式欧拉）
3. `createComputeBindGroups()` + 帧循环三处——两组「读 i 写 1−i」的绑定组；渲染读 `renderBindGroups[1 - cur]`；帧尾 `cur = 1 - cur`
4. `createRenderPipeline()` / `createRenderBindGroups()` + `render.wgsl` 的 vs——加法混合管线；两组渲染绑定组；quad 展开（`vertex_index` 取角、`instance_index` 取粒子）
5. `render.wgsl` 的 fs——速度 → 颜色映射：黑 → 深蓝 → 电蓝 → 白

TODO 1–4 的函数体是 `throw new Error('TODO(day2-challenge-n) 未完成')`，补完删 throw；TODO 2 / 4 / 5 的着色器部分直接改两个 `.wgsl` 里的占位（占位能编译能跑，方便分步验收）。

## 验收标准

- 1 万粒子流畅：右下角稳定 60FPS，星系盘持续流转
- 按住鼠标粒子聚拢到光标处，松开后扩散回盘面（引力/斥力切换）
- 双缓冲正确：无「每帧抖回旧位置」的闪烁现象
- 速度色带可辨：盘心与被鼠标加速的粒子发白/发蓝，静息外缘接近黑
- 改大 `COUNT` 到 3 万依然流畅（GPU 并行的红利，CPU 方案这时已经跪了）

## 提示

<details>
<summary>第一档：思路</summary>

初始盘用极坐标生成：半径 `r = pow(random(), 0.62) * 1.75 + 0.04`（外疏内密），角度 `theta = (i % 3) * (2π/3) + r * 2.2 + 高斯扰动`（三条对数旋臂），y 方向薄薄一层高斯散布。初速度沿切向、大小 `0.5 / sqrt(r + 0.12)`——近快远慢，画面从第一帧起就在转。力场四件套按讲义 2.7 的注释顺序写，每写一件跑一次看看效果，别一次全写完。绑定组轮换记一句话：「compute 读 cur 写 1−cur，渲染必须读刚写完的那个，帧尾翻转指针」。
</details>

<details>
<summary>第二档：API 名</summary>

`GPUBufferUsage.STORAGE`；`createComputePipeline({ layout: 'auto', compute: { module, entryPoint: 'update' } })`；`getBindGroupLayout(0)`；`beginComputePass` / `dispatchWorkgroups(Math.ceil(COUNT / 64))`；渲染管线 blend：`{ color: { srcFactor: 'one', dstFactor: 'one', operation: 'add' }, alpha: { srcFactor: 'one', dstFactor: 'one', operation: 'add' } }`。quad 角点数组是「动态索引的本地数组」——WGSL 里必须 `var corners = array<vec2f, 6>(...)` 声明（讲义 1.4 的坑）。同款完整实现可以对照 demos/day2/06-particle-simulation 读，但自己敲——这份作业的价值全在手上敲过的每一行。
</details>

<details>
<summary>第三档：伪代码</summary>

```text
createParticleStates:
  a = createBuffer(COUNT * 32, STORAGE); b = createBuffer(COUNT * 32, STORAGE)
  init = new Float32Array(COUNT * 8)
  gauss = () => rand()+rand()+rand() - 1.5
  for i in 0..COUNT:
    r = pow(rand(), 0.62) * 1.75 + 0.04
    theta = (i % 3) * (2π/3) + r * 2.2 + gauss() * 0.16
    k = i * 8
    init[k..k+2] = (cosθ·r + gauss()·0.05, gauss()·0.045·薄盘系数, sinθ·r + gauss()·0.05)
    vOrb = 0.5 / sqrt(r + 0.12)
    init[k+4], init[k+6] = -sinθ·vOrb, cosθ·vOrb
  writeBuffer(a, init); return [a, b]

computeBindGroups: computeBindGroups[i] = {0: states[i], 1: states[1-i], 2: simBuffer}

update（WGSL 力场）:
  drift = vec3(snoise(p*0.85 + 偏移1), snoise(p*0.85 + 偏移2), snoise(p*0.85 + 偏移3)) * 0.4
  r = length(p.xz); tangent = (-p.z, 0, p.x) / r; radial = -(p.x, 0, p.z) / r
  accel = drift + tangent * (0.55/(0.3+r)) + radial * (0.45/(0.35+r²))
  accel += (0, -p.y * 1.1, 0)                        # 压回盘面
  toM = u.mouse.xyz - p; dm2 = dot(toM, toM)
  pull = select(-0.10, 1.7, u.mouse.w > 0.5) / (dm2 + 0.30)
  accel += toM / sqrt(dm2 + 1e-4) * pull
  nv = (v + accel * dt) * exp(-1.6 * dt); 限速 2.4
  dst[i] = Particle(p + nv * dt 打包 vec4f, nv 打包 vec4f)

vs 的 quad:
  corners = [(-1,-1),(1,-1),(-1,1),(-1,1),(1,-1),(1,1)]
  out.position = clip + vec4f(corners[vi] * u.res.w / u.res.xy, 0, 0)

fs 的色带:
  t = clamp(speed / 2.0, 0, 1)
  col = mix(#030411, #0B176B, smoothstep(0, 0.45, t))
  col = mix(col, #4C6FFF, smoothstep(0.40, 0.85, t))
  col = mix(col, #F6F9FF, smoothstep(0.80, 1.0, t))
  mask = smoothstep(1.0, 0.15, length(uv))
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
