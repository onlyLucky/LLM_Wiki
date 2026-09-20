# 作业 C · 滚动驱动的英雄时刻（毕业作品）

> 预计 120 分钟 · 对应讲义 [3.3 滚动驱动](../../../讲义/day3-Three.js实战落地/3.3-滚动驱动shader：u_scroll、Lenis与转场遮罩.md) / [3.4 粒子场](../../../讲义/day3-Three.js实战落地/3.4-粒子场：Points、gl_PointSize与噪声粒子场.md) / [3.5 后期处理](../../../讲义/day3-Three.js实战落地/3.5-后期处理工作坊：装配作品集hero.md)

## 目标

三段式滚动叙事，讲义 3.3 How 段拆好的时间轴：

| 区间 | 段落 | shader 侧 |
|------|------|-----------|
| 0 – 0.3 | 粒子聚集成 hero 图形「GLSL」 | `t1 = smoothstep(0.0, 0.3, u_scroll)` 驱动聚集度 |
| 0.3 – 0.7 | 噪声揭幕转场（背景暗紫 → 近黑） | fbm 阈值揭幕，边缘带时间缓动 |
| 0.7 – 1.0 | 文字粒子聚合定格「FIN」 | `t3 = smoothstep(0.7, 1.0, u_scroll)` + bloom 微抬 |

「对标 awwwards SOTD 段落的毕业作品」——三天的存货在这一屏里合体：滚动时间轴、粒子场、后期收尾。

## 页面结构（脚手架已就位）

- 画布 `fixed` 成背景层，三个 100vh 文案屏在正常文档流里撑出 300vh 滚动轨道——「画布不动，世界在滚」；
- 场景里两块演员：背景板（24×14，z=-3，揭幕遮罩的画布）+ 9000 粒子；
- 粒子三个位置 attribute 已备好：`position`=出生位（球壳偏内星云）、`a_targetA`=「GLSL」采样点、`a_targetB`=「FIN」采样点——**文字采样函数 `sampleTextPoints` 已内置**（离屏 canvas 画字取像素），你只管在 shader 里用；
- 占位状态：粒子停在出生位、背景平色暗紫、滚动只滚 DOM——可跑，但没有故事。

## 任务清单

按编号完成，全局搜索 `TODO(day3-ch-` 查漏：

- `TODO(day3-ch-1)` **Lenis 接入 + u_scroll 归一化**（main.ts 帧循环）：五行集成，`lenis.raf(now)` 每帧喂，归一化后 clamp——保险丝防浮点误差穿过 1.0
- `TODO(day3-ch-2)` **粒子噪声散开**（shaders/vertex.glsl）：出生位叠加三路噪声伪向量场，`-0.5` 居中防漂移（demo 03 的教训）
- `TODO(day3-ch-3)` **聚集度**（shaders/vertex.glsl）：scroll 0→0.3 段噪声幅度 1.0→0.1，粒子 `mix` 回目标位；两段 mix（GLSL → FIN）区间首尾相接
- `TODO(day3-ch-4)` **转场遮罩**（shaders/bg.glsl）：fbm 阈值揭幕（0.3–0.7 段），`+ u_time * 0.05` 让揭幕边缘自己「游动」
- `TODO(day3-ch-5)` **bloom + 配方 ShaderPass 收尾**（main.ts）：EffectComposer 四 pass 链；页头与文案换成你的句子
- `TODO(day3-ch-6)` **性能自查**：octaves、粒子数、DPR 三项调档，结论写进本 README 末尾的调档表

## 验收标准

- 三段过渡全部 smoothstep 驱动，无跳变（区间首尾相接：0.3 / 0.7 共用边界）；
- 滚动到 0.3 处，粒子能辨认出「GLSL」字形；
- 转场揭幕边缘自然（噪声等值线 + 时间缓动，不是硬边刀切）；
- 60fps（中端 GPU）；
- 视觉规格完整：所有调过的参数写进 README 的 uniform 参数表；
- TODO(day3-ch-6) 的性能调档表填写完整（见下方模板）。

### 性能调档表（TODO(day3-ch-6) 完成后填写）

| 项 | 性能档 | 平衡档（默认） | 质量档 | 你的结论 |
|----|--------|----------------|--------|----------|
| fbm octaves | 2 | 3 | 4 | |
| 粒子数 N | 6000 | 9000 | 20000 | |
| DPR | min(dpr, 1) | min(dpr, 1.5) | min(dpr, 2) | |

## 提示

<details>
<summary>提示一 · 思路</summary>

**scroll 是时间轴，uniform 是轨道。** 把页面滚动进度归一化成 0–1 的 float 喂给 shader，剩下的全部是两天已学的存货：区间 smoothstep（1.3）、噪声（2.4）、lerp（1.7）。

分段不是写更多代码，是少写代码：每段一个 `smoothstep`、每段只动两三个参数，改一段不会牵动全片。三个区间进度各管一摊：

- `t1`（0–0.3）：只管粒子的聚集度与噪声幅度；
- `t2`（0.3–0.7）：只管背景的揭幕阈值；
- `t3`（0.7–1.0）：只管第二段聚集与 bloom 微抬。

两段 mix 的顺序想清楚：`pos = mix(scatter, targetA, t1)` 先聚成 GLSL，再 `pos = mix(pos, targetB, t3)` 滑向 FIN——第二行 mix 的「起点」是第一行的结果，所以定格段粒子会从 GLSL 字形平滑变形到 FIN。
</details>

<details>
<summary>提示二 · API</summary>

- Lenis 五行（包名就是 `lenis`）：

  ```ts
  import Lenis from 'lenis';
  const lenis = new Lenis({ lerp: 0.1 });
  // 帧循环内：
  lenis.raf(now);
  const p = lenis.scroll / (document.documentElement.scrollHeight - innerHeight);
  material.uniforms.u_scroll.value = Math.min(Math.max(p, 0), 1);
  ```

- 区间进度：`float t = smoothstep(u_s1, u_s2, u_scroll);`——区间 [s1, s2] 内 0→1，区间外恒 0 或 1；
- 粒子透视衰减：`gl_PointSize = u_size * (300.0 / -mvPosition.z);`；
- 后期链 import 都在 `three/addons/postprocessing/` 下：`EffectComposer` / `RenderPass` / `UnrealBloomPass` / `ShaderPass` / `OutputPass`；UnrealBloomPass 构造参数 `(resolution, strength, radius, threshold)`。
</details>

<details>
<summary>提示三 · 伪代码（先自己写，卡死再看）</summary>

vertex.glsl 主干：

```glsl
float t1 = smoothstep(0.0, 0.3, u_scroll);
float t3 = smoothstep(0.7, 1.0, u_scroll);
float amp = mix(1.0, 0.1, t1);            // 幅度收束
float n1 = fbm(position.xy * 1.4 + u_time * 0.18);
float n2 = fbm(position.yz * 1.4 - u_time * 0.15);
float n3 = fbm(position.zx * 1.4 + u_time * 0.12);
vec3 scatter = position + (vec3(n1, n2, n3) - 0.5) * 2.0 * amp;
vec3 pos = mix(scatter, a_targetA, t1);   // 聚成 GLSL
pos = mix(pos, a_targetB, t3);            // 滑向 FIN
v_mix = max(t1, t3);
```

bg.glsl 主干：

```glsl
float t2 = smoothstep(0.3, 0.7, u_scroll);
float n = fbm(v_uv * 3.0 + u_time * 0.05);
float reveal = smoothstep(t2 - 0.12, t2 + 0.12, n);
vec3 col = mix(u_bgA, u_bgB, reveal);
```

main.ts 帧循环接线（Lenis + composer 就位后）：

```ts
lenis.raf(now);
const p = lenis.scroll / (document.documentElement.scrollHeight - innerHeight);
const u = Math.min(Math.max(p, 0), 1);
mat.uniforms.u_scroll.value = u;
bgMat.uniforms.u_scroll.value = u;
bloomPass.strength = 0.9 + smoothstep(0.7, 1.0, u) * 0.3; // 定格微抬
composer.render();
```

bloom 微抬的 `smoothstep(0.7, 1.0, u)` 在 JS 侧没有内置——自己写一个三行版，或直接用 `Math.min(Math.max((u - 0.7) / 0.3, 0), 1)`。
</details>
