# 作业 A 答案 · 追光的萤火

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day1/advanced-追光的萤火/index.html`。

## 实现要点

- **收缩是「距离除以 scale」，不是「改 glow 公式的半径」**——数学上等价，但一处除法让 halo 与 core 两层衰减同步缩放，glow 公式本身一行不动。任务 4 的题面写的是「尺度收缩」，落笔时选便宜的写法。
- easeOutBack 的过冲就是回弹本身：`mix(1.0, 0.6, e)` 在 e 冲过 1 时让 scale 一度低于 0.6 再回落——不需要手写任何回弹逻辑，曲线自带。松手时 u_down 沿同一条曲线倒放，观感是「先吸一下再弹开」，比线性缩回有生命感。
- 拉伸用「沿运动方向压缩局部坐标」而非旋转矩阵：把 `q = p - m` 分解为沿 dir 与垂直两个分量，只压缩沿方向的——比构造旋转矩阵少两行，速度为零时自动退化为正圆。
- u_vel 是每帧差不是每秒差，与 chrome.pointer 的 0.08 每帧 lerp 同一哲学——60fps 与 144fps 的机器手感略有差异，风格化页面可接受；要严格帧率无关就除以 dt 再统一 clamp。
- 速度向量要先换算到居中域（乘 2、x 乘 aspect）再当方向用——0–1 域的差值直接上，宽屏上拉伸角度会偏。
- `pow` 的底数全部套了 `max(0.0, ...)`：pow 负底数未定义，讲义 1.3 的坑表里它排第一。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day1-adv-1 | main.ts | 查询 u_mouse / u_down / u_vel；帧循环写入 sx/sy 与 press；删 throw |
| day1-adv-2 | fragment | p / m 各自 `* 2 - 1` 后 `x *= aspect` |
| day1-adv-3 | fragment | halo / core 两层 pow 衰减 + 白热核心 |
| day1-adv-4 | fragment | 抄入 easeOutBack；`d /= mix(1.0, 0.6, easeOutBack(u_down))` |
| day1-adv-5 | main.ts | 帧差写入 u_vel，写完更新 prev |
| day1-adv-5 | fragment | 局部坐标沿 dir 压缩 stretch 倍 |

其余逐字一致（初始化、几何、press 推进、暗角）。

## 视觉规格

- 色板：外圈天青 `#4CC9F0`（45% 强度）、核心白热偏暖（近似 `#FFEDD9`）、底 `#0B0E14`
- 构图：光点即焦点，全屏留暗场
- 动效：跟随阻尼 0.08（chrome 内建）；按压推进 0.6s 线性 + easeOutBack 过冲约 10%；拉伸系数 `1 + min(speed × 10, 0.7)`
- 细节：暗角 15%、入场 800ms 淡入
- 性能：单 pass、DPR ≤ 2，60fps
