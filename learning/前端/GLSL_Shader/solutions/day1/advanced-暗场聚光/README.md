# 作业 A 答案 · 暗场聚光

## 运行

`npm run dev` 后访问 `http://localhost:5174/solutions/day1/advanced-暗场聚光/index.html`。

## 实现要点

- **光照是乘法，不是画一个亮圈**——地板 mask `floorTex` 在脚手架先行铺好，答案里只出现三处乘积：`LIT × lit`（空气散射）、`地板色 × floorTex × lit`（地板显影）、`mix(LIT, HOT, hot) × hot`（灯芯）。光池挪走，地板回到全黑——这是「被照物」与「光」的正确分工，也是与发光点跟随之类效果的本质区别。
- **收束是「距离除以 scale」，不是「改光照公式的半径」**——数学上等价，但一处除法让 lit 与 hot 两层衰减同步缩放，光照公式本身一行不动。聚焦加亮也只用一行 `gain = 1 + (1 - scale) × 0.9`——追光收紧时光圈变小、照度变高，剧场里就是这个物理。
- easeOutBack 的过冲就是回弹本身：`mix(1.0, 0.6, e)` 在 e 冲过 1 时让 scale 一度低于 0.6 再回落——不需要手写任何回弹逻辑，曲线自带。松手时 u_down 沿同一条曲线倒放，观感是「先收一下再弹开」，比线性缩回有生命感。
- 甩长用「沿运动方向压缩局部坐标」而非旋转矩阵：把 `q = p - m` 分解为沿 dir 与垂直两个分量，只压缩沿方向的——比构造旋转矩阵少两行，速度为零时自动退化为正圆。
- u_vel 是每帧差不是每秒差，与 chrome.pointer 的 0.08 每帧 lerp 同一哲学——60fps 与 144fps 的机器手感略有差异，风格化页面可接受；要严格帧率无关就除以 dt 再统一 clamp。
- 速度向量要先换算到居中域（乘 2、x 乘 aspect）再当方向用——0–1 域的差值直接上，宽屏上甩长角度会偏。
- `pow` 的底数全部套了 `max(0.0, ...)`：pow 负底数未定义，讲义 1.3 的坑表里它排第一。

## 与骨架的差异

| TODO | 文件 | 改动 |
|------|------|------|
| day1-adv-1 | main.ts | 查询 u_mouse / u_down / u_vel；帧循环写入 sx/sy 与 press；删 throw |
| day1-adv-2 | fragment | p / m 各自 `* 2 - 1` 后 `x *= aspect` |
| day1-adv-3 | fragment | lit / hot 两层 pow 衰减 + 空气散射 + 地板显影 + 灯芯 |
| day1-adv-4 | fragment | 抄入 easeOutBack；`d /= mix(1.0, 0.6, easeOutBack(u_down))` + gain 加亮 |
| day1-adv-5 | main.ts | 帧差写入 u_vel，写完更新 prev |
| day1-adv-5 | fragment | 局部坐标沿 dir 压缩 stretch 倍 |

其余逐字一致（初始化、几何、press 推进、暗场地板、暗角）。

## 视觉规格

- 色板：光池暖琥珀 `#FFC145`、灯芯白热（近似 `#FFF3DC`）、暗态地板冷灰蓝、底 `#0B0E14`
- 构图：光池即焦点，暗场全屏留黑；地板网格 13 格（正方形），3.5% 格子有星点
- 动效：跟随阻尼 0.08（chrome 内建）；按压推进 0.6s 线性 + easeOutBack 过冲约 10%；收束加亮 `1 + (1 − scale) × 0.9`；甩长系数 `1 + min(speed × 10, 0.7)`
- 细节：暗角 15%、暗态地板微光 3.5%、入场 800ms 淡入
- 性能：单 pass、DPR ≤ 2，60fps
