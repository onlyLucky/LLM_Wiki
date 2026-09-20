# 作业 C · 极坐标曼陀罗

> Day 1 · C 档 · 约 90 分钟 · 前置：讲义 1.5–1.7 全部（[1.5](../../../讲义/day1-GLSL语言与WebGL2管线/1.5-数据流与全屏四边形.md) 域变换、[1.6](../../../讲义/day1-GLSL语言与WebGL2管线/1.6-时间与动画.md) 动画、[1.7](../../../讲义/day1-GLSL语言与WebGL2管线/1.7-交互输入.md) 交互桥）

## 目标

一幅作品集级的 hero 图案：十二重对称的曼陀罗持续旋转（0.1 rad/s，约一分钟一圈）、呼吸脉动（周期 4s、半径 ±6%）、鼠标横移扰动对称轴（约 ±17°）、点击荡开一圈涟漪推开花瓣——「一个页面讲完一个作品」。技术考点是 Day 1 的合成考试：极坐标换算、`mod` + 镜像的对称折叠、`sin` 调制的花瓣 SDF、时间 / 鼠标 / 点击三路输入同场编排。

## 前置讲义

1.5 的域变换（居中 → 极坐标）是地基；1.6 的 sin 动画与 1.7 的鼠标 / 点击桥是两路输入。三讲考点在本题各出现一次以上——做完它，Day 1 结业。

## 任务清单

五个 TODO 全在 `shaders/fragment.glsl`，从上到下依序完成；`main.ts` 是全脚手架（页头文案除外）：

1. **TODO(day1-ch-1)** — 极坐标换算：`length(p)` 与 `atan(p.y, p.x)`。
2. **TODO(day1-ch-2)** — 12 重对称：`mod(angle, TAU / 12.0)` 后对扇区中线 `abs` 镜像。自检：先画纯色细环 + `sin` 条纹，数一数重复次数再往下走。
3. **TODO(day1-ch-3)** — 花瓣 SDF：半径随 `sin(k * angle)` 调制（两层同心更耐看），整体旋转 `u_time * 0.1`。
4. **TODO(day1-ch-4)** — 呼吸（4s、±6%）乘在半径上；扰动加在折叠**前**：`angle += u_mouse.x * 0.3`。折叠前加是转轴，折叠后加是撕碎对称。
5. **TODO(day1-ch-5)** — 点击涟漪：波包沿径向扩散（速度参考 0.45/秒），波前推开花瓣半径；同文件顶部的页头文案换成你的（诗意标题 + 一句副标题）。

## 验收标准

- 12 重对称准确：数得出 12 个重复单元，无 11 或 13 的错位
- 旋转速率 0.1 rad/s（约一分钟一圈），图案稳定无跳变
- 鼠标扰动可见但克制：横移扫过半屏，对称轴倾斜不超过约 17°
- 点击涟漪完整衰减无残影，波前推花瓣的鼓包能被看清
- 60fps；页头两行文案与画面气质一致
- 加分项：双层花瓣反向旋转；或涟漪用琥珀（challenge 签名色）与主体撞色

## 提示

卡住 15 分钟再打开下一档。C 档是三档里唯一不卡进度的——五个 TODO 都在 fragment，错了刷新即回。

<details>
<summary>第一档 · 思路</summary>

对称 = 角度折叠：把 `atan` 出来的整圈角度用 `mod` 折进一个扇区，再对扇区中线镜像一次——之后你画的任何 `sin(angle * k)` 图案都自动重复 12 次。曼陀罗的全部秘密就这一句。花瓣 = 半径沿角度调制；涟漪 = 以点击点为圆心、随 `u_age` 扩散的环形波包，波前经过处把花瓣半径往外推一点。

</details>

<details>
<summary>第二档 · API</summary>

`atan(y, x)` / `mod(x, y)` / `abs(x)` / `sin(x)` / `exp(x)` / `distance(a, b)` / `length(v)` / `min(a, b)`（双层取近用）。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
float r = length(p);
float angle = atan(p.y, p.x) + u_mouse.x * 0.3; // 扰动在折叠前
float sector = TAU / 12.0;
angle = mod(angle - u_time * 0.1, sector); // 旋转也在折叠前
angle = abs(angle - sector * 0.5);        // 对扇区中线镜像

float breathe = 1.0 + 0.06 * sin(u_time * TAU / 4.0); // 4s ±6%
float petalR = 0.5 * breathe * (0.75 + 0.25 * sin(angle * 6.0));
float d = abs(r - petalR);               // 花瓣环的 SDF

// 涟漪：以点击点为圆心的高斯环（u_click 先换到与 p 同域）
vec2 c = u_click * 2.0 - 1.0;  c.x *= aspect;
float rippleR = u_age * 0.45;
float wave = exp(-pow((distance(p, c) - rippleR) * 7.0, 2.0)) * exp(-u_age * 1.2);
petalR += wave * 0.06;                   // 波前推开花瓣
```

</details>
