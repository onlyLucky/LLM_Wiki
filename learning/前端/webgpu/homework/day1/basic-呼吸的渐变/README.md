# 作业 B · 呼吸的渐变

## 目标

四边形的顶点色沿对角线从紫渐到青（数据已给）。你要加一块 uniform buffer，把时间传进着色器，让两组颜色随时间呼吸交换：某一刻是「紫在左下、青在右上」，半个周期后是「青在左下、紫在右上」，循环往复、平滑无跳变。

## 前置讲义

- `1.5 顶点缓冲与几何数据`：interleaved 布局与 attribute 声明（本题顶点数据已给）
- `1.6 Uniform 与绑定组`：本题主线——32 字节布局、`var<uniform>`、`writeBuffer`

## 任务清单

1. main.ts 的 `TODO(day1-basic-1)`：在 `setupUniform()` 里创建 uniform 数据（`Float32Array`）与 `uniformBuffer` 并 return
2. quad.wgsl 的 `TODO(day1-basic-2)`：声明 `struct Uniforms` 与 `var<uniform>`，片元里实现两组颜色的呼吸交换
3. main.ts 的 `TODO(day1-basic-3)`：帧循环里每帧把时间写进 uniform 并 `writeBuffer` 上传

任务顺序建议 1 → 2 → 3：只完成任务 1 时，着色器里还没有 `var<uniform>`，`layout:'auto'` 推不出第 0 组，`getBindGroupLayout(0)` 会报错——这不是你写错了，是任务 2 未完成的信号（讲义 1.6 的「按用法反推」）。

## 验收标准

- 四边形在两组颜色间平滑循环，无跳变、无闪烁
- 错误面板与控制台无报错
- 加分：把 `aspect` 一起传进 uniform，任意窗口比例下四边形不变形；再用 `mouse` 做一点轻微的色彩扰动

## 提示

<details>
<summary>第一档 · 思路</summary>

任务 1 想清楚「数据放哪、多大」：uniform buffer 尺寸要凑成 16 的倍数，最省事的是照抄 demo 01 的 32 字节方案。任务 2 想清楚「交换怎么算」：当前颜色沿对角线从 C_LOW 插到 C_HIGH，交换就是把插值方向反过来——反向的颜色可以由 `C_LOW + C_HIGH - color` 直接得到，不需要再算一遍位置。任务 3 想清楚「时间从哪来」：帧循环的 `t` 每帧都在，写进数组第 0 槽，整块上传。
</details>

<details>
<summary>第二档 · API 名</summary>

`new Float32Array(8)` · `device.createBuffer({ size, usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST })` · `struct Uniforms` · `@group(0) @binding(0) var<uniform>` · `sin` · `mix` · `device.queue.writeBuffer(uniformBuffer, 0, uniforms)`
</details>

<details>
<summary>第三档 · 伪代码</summary>

```wgsl
// quad.wgsl —— 任务 2（最小方案；要拿 aspect 加分就用 32 字节布局）
struct Uniforms { time: f32 }
@group(0) @binding(0) var<uniform> u: Uniforms;

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  let k = 0.5 + 0.5 * sin(u.time * 0.9); // 0 → 1 → 0 循环
  let swapped = C_LOW + C_HIGH - color;   // 反向渐变的颜色
  return vec4f(mix(color, swapped, k), 1.0);
}
```

```ts
// main.ts —— 任务 1 与任务 3
function setupUniform() {
  const data = new Float32Array(8); // 32 字节
  const buffer = device.createBuffer({
    size: 32,
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST,
  });
  return { data, buffer };
}

// 帧循环里：
uniforms[0] = t;
device.queue.writeBuffer(uniformBuffer, 0, uniforms);
```
</details>
