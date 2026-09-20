# 作业 B 答案 · 脉动的画布

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day1/basic-脉动的画布/index.html`。

## 实现要点

- **呼吸乘在 mix 的系数上，不是颜色上**——`color *= 1 + 0.08 * sin` 会把亮色推过 1 过曝、把暗色压进泥里；调系数只是让渐变带横移，两个端点色永远安全。这就是规格里那句取舍的完整理由。
- 对角投影的归一化分母是 `(aspect + 1.0)`：居中域里 `p.x + p.y` 的理论极值正好是 ±(aspect + 1)，除完落在 [-1, 1]，再折半加半进 0–1。分母写 2 的话宽屏上渐变会截断在半途。
- vignette 用未居中的 `uv`：暗角关心的是「离屏幕中心多远」，0–1 域里中心正好 0.5，`length(uv - 0.5)` 就是答案；换居中域要多乘一次 aspect，多余。
- `clamp` 呼吸后的 k：±8% 的摆幅数学上不会超界，但 clamp 是免费的保险——把「数学上恰好安全」和「永远安全」区分开，是工程直觉。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day1-basic-1 | fragment | 声明 `u_time` / `u_colorA` / `u_colorB` 三个 uniform |
| day1-basic-1 | main.ts | 查询三个 location；帧循环写入 uTime（t 秒）与两色（uniform3f）；删 throw |
| day1-basic-2 | fragment | 三行：`p = uv * 2 - 1` → `p.x *= aspect` |
| day1-basic-3 | fragment | 对角投影 + `sin` 呼吸 + `mix` |
| day1-basic-4 | fragment | `color *= 1.0 - 0.18 * length(uv - 0.5)` |

其余逐字一致（初始化、几何、帧循环骨架）。

## 视觉规格

- 色板：玫红 `#FF4D6D` → 天青 `#4CC9F0`（课程签名渐变），底色 `#0B0E14`
- 构图：对角 45° 渐变带横穿画面，中心聚焦
- 动效：呼吸周期 3s（`sin`），幅度 8%（调制 mix 系数）
- 细节：vignette 18%、入场 800ms 淡入
- 性能：单 pass、DPR ≤ 2，60fps（一个 mix 一个 sin，成本近零）
