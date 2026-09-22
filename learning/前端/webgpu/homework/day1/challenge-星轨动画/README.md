# 作业 C · 星轨动画

## 目标

复刻一张「长曝光星轨摄影」：80 余颗星围绕画面右上 1/3 处的**极点**划出同心弧，弧线**头尾渐隐**（长曝光的起止感），内带暖金、外带冷蓝（色温纵深），极点处一颗金色极星舒展八向星芒，每隔 9 秒一颗流星斜穿画幅。全部几何静态躺在单块顶点 buffer 里——旋转、视差、闪烁、流星位置全部在着色器里由 attribute 与 uniform 推导，数据不动、着色器算。

彩蛋先行：流星与极星星芒的着色器分支**已经写好**——你只要在任务 2 把数据喂进去，它们就会点亮。

## 前置讲义

- `1.3 第一个三角形：渲染管线全解`：图元装配与 topology
- `1.5 顶点缓冲与几何数据`：interleaved 布局与单 buffer 数据组织
- `1.6 Uniform 与绑定组`：32 字节 uniform 布局与 `writeBuffer`

## 任务清单

1. main.ts 的 `TODO(day1-challenge-1)`：`lineTopology()` 返回线段列表的图元类型，让星轨以线段而不是三角形绘制
2. main.ts 的 `TODO(day1-challenge-2)`：`buildStarTrails()` 生成全部顶点数据——5 条轨道带 × 每带 12~20 颗星，每顶点 8 个 float：`[x, y, r, g, b, arcT, band, seed]`
3. trails.wgsl 的 `TODO(day1-challenge-3)`：星轨弧绕极点旋转，转速内带快外带慢（漩涡层次）
4. trails.wgsl 的 `TODO(day1-challenge-4)`：分层视差 + 长曝光渐隐（arcT 头尾淡出）+ 按种子闪烁

任务 1、2 在 main.ts 里直接 `throw`，错误面板按顺序提示；任务 3、4 在 WGSL 里，未完成时弧停在静止状态，动效逐级点亮。

## 验收标准

- 星轨绕偏心极点整体旋转，内带转得快、外带转得慢
- 每条弧头尾渐隐，像长曝光照片的起止轨迹，而不是闭合的圆
- 颜色从内带暖金滑向外带冷蓝，弧线上有约 18% 的亮星
- 鼠标移动产生分层视差，外带幅度更大
- 极点有八向星芒的极星缓慢呼吸；每隔 9 秒一颗流星从左下划向右上
- 错误面板与控制台无报错

## 提示

<details>
<summary>第一档 · 思路</summary>

任务 1 想清楚「线段怎么数」：line-list 下每 2 个连续顶点连一条线，一段弧要 N 段就放 N 对端点。任务 2 想清楚「数据怎么排」：外层循环带号、中层循环星、内层循环弧段；每颗星先抽参数（半径微扰、起角、弧长、色温、种子），再按弧长配平段数逐段推入 8 个 float。弧上的点 = 极点 + (cos a, sin a) × 半径。任务 3 想清楚「绕点旋转怎么写」：先把向量平移到极点为原点，套标准 2D 旋转，再平移回去——直接转位置会绕屏幕原点转圈。任务 4 想清楚「纵深怎么造」：视差幅度、透明度都和 band 挂钩，渐隐用 arcT 两端的 smoothstep，闪烁让每颗星有自己的频率与相位（种子派生）。
</details>

<details>
<summary>第二档 · API 名</summary>

`'line-list'` · `mulberry32`（固定种子 PRNG）· `Math.cos` / `Math.sin` · `Float32Array` · `smoothstep(a, b, x)` · `fract` · `select(假值, 真值, 条件)` · `mix(A, B, t)` · `toNdc(...)`（骨架已给的单位→NDC 出口，x **除以** aspect）· `u.mouse * depth * 0.055` · `vin.band` / `vin.arcT` / `vin.seed`
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// 任务 2：星轨顶点数据（main.ts）
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const POLE = [0.30, 0.18];                    // 与 WGSL 的 POLE 逐字一致
const WARM = [1.0, 0.82, 0.58], COOL = [0.48, 0.66, 1.0];
const bandRadius = [0.10, 0.22, 0.34, 0.46, 0.58];
const starsPerBand = [12, 14, 16, 18, 20];
const rng = mulberry32(20240601);             // 固定种子：每次刷新构图一致
for (let band = 0; band < 5; band++) {
  for (let s = 0; s < starsPerBand[band]; s++) {
    const radius = bandRadius[band] + (rng() - 0.5) * 0.03;
    const startA = rng() * Math.PI * 2;
    // 弧长双峰：80% 短弧 + 20% 长弧，节奏有断有连，避免规整圆环
    const arcTurns = rng() < 0.2 ? 0.45 + rng() * 0.25 : 0.08 + rng() * 0.14;
    const arcLen = arcTurns * Math.PI * 2;
    const bright = rng() < 0.18;              // 18% 是亮星
    const k = /* 色温：band/4 加微扰，WARM 滑向 COOL；亮星往白里混 */;
    const segs = Math.max(6, Math.round((arcLen * radius) / 0.02));
    for (let g = 0; g < segs; g++) {
      for (const t of [g / segs, (g + 1) / segs]) {
        const a = startA + arcLen * t;
        // push(POLE[0] + cos(a)*radius, POLE[1] + sin(a)*radius, ...色, t, band, seed)
      }
    }
  }
}
// 加分项：八向极星（band = 5，每芒两个端点）+ 流星线段（seed = -1）
```

```wgsl
// 任务 3 与任务 4：trails.wgsl 的 vs 星轨弧分支
// 旋转在半屏高单位空间做（等距空间），出口统一 toNdc（x 除以 aspect）
// ——半径在 x、y 两向换算成像素等距，轨道才是屏幕上的正圆
let depth = 0.3 + 0.7 * vin.band / 4.0;
let spin = u.time * (0.05 + 0.028 * (4.0 - vin.band)); // 内带快外带慢
let cs = vec2f(cos(spin), sin(spin));
let rel = vin.position - POLE;
let rot = vec2f(rel.x * cs.x - rel.y * cs.y, rel.x * cs.y + rel.y * cs.x);
let world = POLE + rot + u.mouse * depth * 0.055;      // 分层视差
out.position = vec4f(toNdc(world), 0.0, 1.0);

let fade = smoothstep(0.0, 0.22, vin.arcT)
         * (1.0 - smoothstep(0.78, 1.0, vin.arcT));    // 头尾渐隐
let tw = 0.72 + 0.28 * sin(u.time * (0.5 + fract(vin.seed * 7.31) * 1.7)
                            + vin.seed * 6.2832);      // 按种子闪烁
out.alpha = fade * tw * (1.0 - 0.22 * vin.band / 4.0);
```
</details>
