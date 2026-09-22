# 作业 A · 失真图卡墙

> Day 3 · A 档 · 约 75 分钟 · 前置：讲义 [3.2 图片失真与鼠标视差](../../../讲义/day3-Three.js实战落地/3.2-图片失真与鼠标视差.md)

## 目标

3×1 图卡墙：hover 单卡波纹失真 + RGB shift 色散，卡间视差层次——「作品集项目的 hero 模块」。技术考点：TextureLoader 接线、hover 状态机（上升 lerp / 下降 easeOutQuint 双段）、fbm 波纹从光标局部扩散、色散 g 通道锚定、卡间视差的速度差层次。

## 前置讲义

3.2 一讲覆盖全部五个任务：纹理两必设（colorSpace / anisotropy）、失真 = 噪声 × 强度 × 衰减、`u_hover` 是强度不是开关、三层视差（同一输入系数带符号）。骨架场景段已就位（TODO-1 通读），占位图在 `public/`（换图只改 `CARDS` 的 src）。

## 任务清单

1. **TODO(day3-adv-1)** — 通读 `main.ts` 场景段：三张 PlaneGeometry（严格 4:5）+ 各自 TextureLoader 材质 + 独立状态对象（hover / t0 / leaveT）。
2. **TODO(day3-adv-2)** — hover 状态机：数学矩形判定（等价 DOM mouseenter，不用 raycaster）+ enter 记 t0 + 上升 lerp 0.08 + 下降 0.6s easeOutQuint 回零 + u_ripple 0.8s easeOutCubic 扩到 0.9。
3. **TODO(day3-adv-3)** — `fragment.glsl` 波纹失真：ring（几何）× fbm（液体）× 0.35 × u_hover，从光标局部扩散。
4. **TODO(day3-adv-4)** — RGB shift 联动 hover（最大 1.2%），g 通道锚定——三个通道总要有一个钉在原位。
5. **TODO(day3-adv-5)** — 三卡视差（中卡 5%、左右卡 3% 反向）+ 页头 -3% 反向——同一输入、系数带符号，速度差就是层次。

## 验收标准

- hover 渐进无跳变（上升 lerp、下降 easeOutQuint，两条曲线手感不同）
- 失真从光标位置辐射（不是从卡中心——u_mouse 是卡局部 uv）
- 离开回零 0.6s easeOutQuint，波纹扩散后保持不再回缩
- 三卡视差方向相反，页头与卡组速度不同
- 设计质量六条全过（对比、呼吸、色板、构图、性能、克制）；60fps
- 加分项：hover 卡的描边 glow 随 u_hover 增强（sdBox 一行，参考 demo 02 第 ④ 步）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

失真 = 噪声 × 强度 × 衰减：ring 决定「哪里动」（半径带），fbm 决定「怎么动」（液体质感），u_hover 决定「动多狠」（渐进强度），u_mouse 决定「从哪动」（局部原点）。四个因子相乘、缺一不可——demo 里最常见的翻车是把 u_hover 忘乘，导致波纹永远全开。

状态机的双段手感：上升要「跟手」（lerp 0.08 指数逼近），下降要「优雅」（时间驱动的 easeOutQuint，先快后极缓地停）。两段用不同数学，是「hover 是强度不是开关」的进阶版。

</details>

<details>
<summary>第二档 · API</summary>

`THREE.TextureLoader`（`load` 返回 texture，`colorSpace = THREE.SRGBColorSpace` 必设）· `performance` 时间与 `chrome.startLoop` 的 now（毫秒）· GLSL 侧：`texture2D(sampler, uv)` / `smoothstep(a, b, x)` / `step(edge, x)` / `normalize(v + 1e-4)` 防 零向量。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// hover 状态机（每卡）
const inside = mu >= 0 && mu <= 1 && mv >= 0 && mv <= 1;
if (inside && !c.hovered) { c.hovered = true; c.t0 = s; }
if (!inside && c.hovered) { c.hovered = false; c.leaveT = s; }

// 上升 lerp / 下降 easeOutQuint 双段
if (c.hovered) {
  c.hover += (1 - c.hover) * 0.08;
} else if (c.leaveT >= 0) {
  const q = Math.min((s - c.leaveT) / 0.6, 1);
  c.hover *= 1 - (1 - Math.pow(1 - q, 5)); // 从当前值乘衰减
  if (q >= 1) c.leaveT = -1;
}
c.mat.uniforms.u_hover.value = c.hover;

// 波纹：0.8s easeOutCubic 到 0.9，离开后保持
if (c.t0 >= 0) {
  const pr = Math.min((s - c.t0) / 0.8, 1);
  c.mat.uniforms.u_ripple.value = (1 - Math.pow(1 - pr, 3)) * 0.9;
}
```

```glsl
// fragment：失真 + 色散（占位行的替换体）
float d = distance(ac(uv), ac(u_mouse));
float ring = smoothstep(u_ripple, u_ripple - 0.18, d) * step(d, u_ripple);
vec2 flow = normalize(uv - u_mouse + 1e-4) * ring
          * fbm(uv * 6.0 + u_time * 0.3) * 0.35 * u_hover;
vec2 suv = clamp(uv + flow, 0.001, 0.999);
float shift = 0.012 * u_hover;
vec3 col = vec3(texture2D(u_tex, suv + vec2(shift, 0.0)).r,
                texture2D(u_tex, suv).g,
                texture2D(u_tex, suv - vec2(shift, 0.0)).b);
```

```ts
// 视差（循环外算一次）
const ox = chrome.pointer.sx - 0.5, oy = chrome.pointer.sy - 0.5;
// 循环内：中卡 +5%、左右卡 -3%（世界坐标 = uv 幅度 × 卡宽 2）
c.mesh.position.x = c.origX + ox * 0.05 * 2 * (c.origX === 0 ? 1 : -0.6);
title.style.transform = `translate3d(${(-ox * 6).toFixed(3)}vw, ${(oy * 3).toFixed(3)}vw, 0)`;
```

</details>
