# Day 2 答案 challenge · GPGPU 余烬升腾

对应作业：[challenge-GPGPU粒子星系](../../homework/day2/challenge-GPGPU粒子星系/)——先自己敲，再对照读这份参考答案。

## 实现要点

1. **初始火床**：`r = sqrt(random()) * 0.85`（sqrt 让圆盘面积均匀），角度全随机；y 从 `-1.42` 铺到 `1.48`（`-1.42 + random() * 2.9`）；初速度全部向上 `0.25 + random() * 0.45`。与星系版「三条旋臂 + 切向轨道」是两种完全相反的分布哲学
2. **力场五件套**：snoise 湍流（`p * 1.1`、时间项 `t * 0.25`、幅度 0.55）→ 浮力 `+1.25` → 烟囱束缚 `-p.xz * 0.35`（拢回轴心）→ 鼠标风 `select(0.0, 2.6, u.mouse.w > 0.5) / (dm2 + 0.40)` 沿 `(p - mouse)` 方向**外推**（与星系引力井语义相反）→ 出界重生
3. **hash11 重生**：`fract(sin(n) * 43758.5453123)`；seed = `f32(i) * 0.618 + t * 7.13`，三次采样（seed / seed+91.7 / seed+43.1）分别决定重生 x / z / 初速；重生位置 `y = -1.42`，宽 `±0.85`——粒子出烟囱口即回炉
4. **积分与限速**：半隐式欧拉 `nv = (v + accel * dt) * exp(-1.0 * dt)`（阻尼比星系版 1.6 轻，火苗需要惯性甩尾），限速 1.8——浮力终端速度 1.25 恰好冲进色带的金/白热段，核心粒子偶尔触顶限速、白热闪烁
5. **双缓冲与渲染**：compute 读 `states[cur]` 写 `states[1-cur]`，渲染读 `renderBindGroups[1 - cur]`，帧尾翻转；quad 展开（`var corners = array<vec2f, 6>` 动态索引本地数组）+ 加法混合

## 与骨架的差异

- `TODO(day2-challenge-1)`：火床三行初始化（半径 / 高度 / 初速），无旋臂公式
- `TODO(day2-challenge-2)`：`particles.wgsl` 补 `hash11` + 力场五件套；管线 `layout: 'auto'` + `entryPoint: 'update'`
- `TODO(day2-challenge-3)`：两组镜像 compute 绑定组 + 帧循环 `[cur]` / `[1 - cur]` / 帧尾翻转
- `TODO(day2-challenge-4)`：加法混合管线 + 两组渲染绑定组；`render.wgsl` quad 展开
- `TODO(day2-challenge-5)`：火色带四段 smoothstep

## 视觉规格

- 色板：`#3B0D03`（暗红）→ `#E85C1F`（炽橙，smoothstep 0–0.40）→ `#FFC24D`（金，0.38–0.85）→ `#FFF7E8`（白热，0.80–1.0）；`mask = smoothstep(1.0, 0.2, length(uv))` 做软边辉光
- 烟囱口 `y = 1.55` 出界重生，炉底线 `y = -1.42`，火床半径 `≤ 0.85`
- 相机：平视 `el = 0.34`、半径 4.2、target `(0, 0.1, 0)`；`clearValue` 暖黑 `#0D0705`
- 粒子直径 6 CSS px（`u.res.w = round(6 * dpr)`）；阻尼 `exp(-1.15·dt)`，限速 1.8
