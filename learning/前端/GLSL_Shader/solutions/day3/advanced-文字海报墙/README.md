# 作业 A 答案 · 失真图卡墙

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day3/advanced-失真图卡墙/index.html`。

## 实现要点

- **状态机两条曲线用两种数学**：上升是帧驱动的指数逼近（`hover += (1 - hover) * 0.08`，跟手），下降是时间驱动的 `hoverAtLeave * (1-q)^5`（0.6s easeOutQuint 镜像，先快后极缓地停）。下降必须记「离开瞬间的值」当起点——若每帧对当前 hover 乘衰减，衰减会帧帧叠加，0.6 秒远远没到就归零了，手感完全不对。
- **波纹四因子缺一不可**：ring 决定「哪里动」（半径带 ±0.18）、fbm 决定「怎么动」（液体质感）、0.35 决定「动多深」、u_hover 决定「开多大」。忘乘 u_hover 是最常见翻车——波纹永远全开，渐进感全无。
- **视差同一输入、系数带符号**：中卡 +0.05、左右卡 -0.03、页头 ±3vw，全用同一个 `ox`（chrome 的 sx/sy 已内置 0.08 阻尼）。u_mouse 的换算用 `origX` 而不是当前 `position.x`——视差不参与光标判定，否则「卡在动、判定区跟着动」的反馈环会把 hover 抖碎。
- **色散 g 通道锚定**：r/b 沿 x 反向各撕 1.2%、绿钉在原位——三个通道总有一个不动，撕裂才读作「色差」而不是「重影」。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day3-adv-1 | main.ts | 通读，无改动 |
| day3-adv-2 | main.ts | 状态机：inside 矩形判定 + enter 记 t0 + 上升 lerp 0.08 / 下降 (1-q)^5 双段 + ripple 0.8s easeOutCubic→0.9；Card 增 `hoverAtLeave` 字段 |
| day3-adv-3 | fragment.glsl | `ring × fbm × 0.35 × u_hover` 波纹，`clamp(uv + flow, 0.001, 0.999)` 后采样 |
| day3-adv-4 | fragment.glsl | `shift = 0.012 * u_hover`，g 通道锚定 |
| day3-adv-5 | main.ts | 中卡 +5%、左右 -3% 反向（`par` 符号即方向）；页头 `translate3d(-ox·6vw, oy·3vw, 0)` |
| —（加分项） | fragment.glsl | sdBox 描边 glow × u_hover（ROSE 同色光边，带宽 0.025） |

其余逐字一致（index.html / vertex.glsl / 场景段 / 页头 DOM / cursorWorld 均未动）。

## 视觉规格

- 色板：底 `#0B0E14`、glow 玫红 `#FF4D6D`（与 ROSE 主色同源）
- 失真：波纹带宽 0.18、幅度 0.35、fbm 4 octave、`uv*6 + u_time*0.3` 液体游动
- 色散：最大 1.2%（`0.012 × u_hover`），g 通道锚定
- 视差：中卡 ±5%、左右 ±3% 反向、页头 ±3vw 反向
- 波纹时序：enter 后 0.8s easeOutCubic 扩到 0.9；离开后保持不回缩
- 性能：三卡各一次 4-octave fbm，60fps 无压力
