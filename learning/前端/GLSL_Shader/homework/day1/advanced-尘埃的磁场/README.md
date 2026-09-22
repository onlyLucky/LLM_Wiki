# 作业 A · 追光的萤火

> Day 1 · A 档 · 约 60 分钟 · 前置：讲义 [1.7 交互输入](../../../讲义/day1-GLSL语言与WebGL2管线/1.7-交互输入.md)（1.5、1.6 是弹药）

## 目标

一枚萤火光点丝滑追随鼠标，按下时收缩到 60% 并带一次回弹，拖动时沿运动方向轻微拉伸——视差 hero 的交互核心件。技术考点是事件桥全链路：`chrome.pointer` 状态采样 → uniform 打包 → shader 消费，加上居中等比坐标域、距离场 glow、`easeOutBack` 回弹、帧差速度向量。

## 前置讲义

1.7 是主线：事件桥的五个环节就是本题的数据流。1.5 的居中三行（任务 2）与 1.6 的 `easeOutBack`（任务 4）直接抄用——讲义写好的轮子，本题考的是你能不能装上。

## 任务清单

1. **TODO(day1-adv-1)** — `main.ts` 帧循环：查询三个 location 后，`u_mouse` ← `chrome.pointer.sx / sy`（平滑坐标，0–1 左下原点）、`u_down` ← `press`（骨架已维护的按压进度）。写完删 `throw`。
2. **TODO(day1-adv-2)** — fragment：uv 与 u_mouse 各自换算到居中等比域，产出 `p` / `m`。两处必须同域。
3. **TODO(day1-adv-3)** — fragment：萤火主体。`distance(p, m)` 距离场 + `pow` 衰减的径向 glow，半径基准 18%，外圈天青渐层、核心白热偏暖。
4. **TODO(day1-adv-4)** — fragment：抄讲义 1.6 的 `easeOutBack` 进来；按压时距离除以 `mix(1.0, 0.6, easeOutBack(u_down))`——半径等效收缩 60%，带一次回弹。
5. **TODO(day1-adv-5)** — 两个半边：`main.ts` 写 `u_vel`（当前 `sx / sy` 减上一帧 `prevX / prevY`，写完更新 prev）；fragment 把 `p - m` 的偏移在速度方向压缩——椭圆主轴沿运动方向。

## 验收标准

- 萤火永远比鼠标「慢半拍」（chrome.pointer 的 0.08 阻尼），无生硬贴脸
- 按压收缩 60% 后松手回弹一次，无过冲抖动残留
- 拖动时拉伸方向与运动方向一致，静止时恢复正圆
- 常开 30 秒 60fps
- 加分项：glow 颜色沿半径做双色过渡（外天青内玫红）；或一枚比主体更慢的拖尾光点（demo 04 的 tail 手法迁移过来）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

事件桥的纪律：JS 管状态（哪一帧、按下没有、上一帧在哪），shader 管纯函数（给我距离我给你颜色）。所以速度向量在 JS 侧算好（两帧坐标相减）再广播，shader 里只做几何：把「萤火局部坐标」沿速度方向压扁一点——压扁等价于那个方向变长，拉伸就出来了。

</details>

<details>
<summary>第二档 · API</summary>

`chrome.pointer.sx / sy / isDown` / `distance(a, b)` / `length(v)` / `dot(a, b)`（分解分量用）/ `mix(a, b, t)` / `pow(x, y)` / `clamp(x, lo, hi)` / `easeOutBack(t)`（讲义 1.6）。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
// 任务 2：居中等比，两处同域
float aspect = u_resolution.x / u_resolution.y;
vec2 p = uv * 2.0 - 1.0;  p.x *= aspect;
vec2 m = u_mouse * 2.0 - 1.0;  m.x *= aspect;

// 任务 4：收缩（距离除以 scale = 半径乘 scale）
float scale = mix(1.0, 0.6, easeOutBack(u_down));

// 任务 5：速度方向压缩局部坐标
vec2 v = vec2(u_vel.x * 2.0 * aspect, u_vel.y * 2.0); // 换到居中域
float speed = length(v);
vec2 dir = speed > 1e-4 ? v / speed : vec2(1.0, 0.0);
float stretch = 1.0 + min(speed * 10.0, 0.7);
vec2 q = p - m;
float along = dot(q, dir);
q -= dir * along * (1.0 - 1.0 / stretch);  // 沿速度方向压缩
float d = length(q) / scale;

// 任务 3：pow 衰减的两层 glow
float halo = pow(max(0.0, 1.0 - d / 0.47), 3.0);
float core = pow(max(0.0, 1.0 - d / 0.18), 2.0);
```

</details>
