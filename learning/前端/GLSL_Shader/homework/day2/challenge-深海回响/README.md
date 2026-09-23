# 作业 C · 深海回响

> Day 2 · C 档 · 约 90 分钟 · 作品集级 · 前置：讲义 [2.1](../../../讲义/day2-片段着色器视觉算法/2.1-像素级绘画：从step到符号距离场.md)、[2.6](../../../讲义/day2-片段着色器视觉算法/2.6-光的错觉：伪3D光感的手法.md)、[2.8](../../../讲义/day2-片段着色器视觉算法/2.8-电影感配方：grain、vignette与合成模式.md) 全部

## 目标

深海声呐 hero 画面：前景 SDF 构图（声呐环 + 锚链焊接深潜灯）、高度场光感、双层辉光与回响脉动、深海雪背景层、电影感配方收尾、页头与双层视差——「可以直接放进作品集的一屏」，深海/科考类站点的核心画面。技术考点：多 SDF 布尔组合（含 smin）、法线光照、glow 双层、背景层混合、配方卡顺序、视差分层。

## 前置讲义

三讲的合体考试：2.1 给形状零件、2.6 给光感配方、2.8 给收尾顺序。背景深海雪的 `noise/fbm` 是骨架脚手架（2.4 不是本题前置，函数直接复用）。

## 任务清单

1. **TODO(day2-ch-1)** — fragment 前景：≥3 个 SDF 布尔组合，含一次 `smin`。建议构图：声呐环（`abs(length - R) - w`）+ 锚链线段 `smin` 焊一枚深潜灯珠。
2. **TODO(day2-ch-2)** — fragment：高度场法线 + 朗伯一行（讲义 2.6 三行迁移）。
3. **TODO(day2-ch-3)** — fragment：双层 glow——主声呐青 w=0.08 ×0.9×pulse、次生物光绿 w=0.12 ×0.5，指数 2.0；回响脉动 `pulse = 0.85 + 0.15 * sin(u_time * 1.8)` 只乘主 glow；环体深海金属青白填充（`0.4 + 0.6 * lit`，fwidth 抗锯齿）。
4. **TODO(day2-ch-4)** — fragment 背景：深海雪层（fbm warp、透明度 25%、流速向下、视差 2%）。
5. **TODO(day2-ch-5)** — fragment 收尾：配方卡五步（gamma → 对比 → 饱和 → grain → vignette）。
6. **TODO(day2-ch-6)** — `main.ts` 页头文案换成你的；fragment 前景坐标加视差 5%（`(u_mouse - 0.5) * 0.05`，与背景 2% 拉开层次）。

## 验收标准

- 前景轮廓清晰、光晕有层次无过曝（clamp 收尾）
- 回响脉动只呼吸主 glow——ping 是主动的，生物光是被动的（两层一起呼吸就是整幅画在抖）
- 背景不与前景抢对比度（25% 透明度是纪律不是建议）
- 配方五步顺序正确（grain 在 gamma 后、vignette 在最后）
- 视差 lerp 平滑（chrome 的 0.08 阻尼白送），前后 5% / 2% 分层可感
- 设计质量六条全过（视觉规格、页头、微文案……）；60fps
- 加分项：环上叠一次断裂（`max(sd, 断口 SDF)` 做差）；或灯珠位置加一枚局部暖光点

## 提示

卡住 15 分钟再打开下一档。C 档建议按任务序推进，每层完成刷新看一次——三层是叠出来的，不是一次写完的。

<details>
<summary>第一档 · 思路</summary>

画面三层各管一摊：背景层管「氛围」（海雪慢沉、低对比）、前景层管「主体」（SDF 构图 + 光感 + 辉光）、收尾层管「成片感」（配方卡顺序）。层间的纪律只有一条：背景的对比度必须让给前景——25% 透明度不是美学偏好，是视觉层级的工程参数。「回响」的动效只需一行：主 glow 乘一个 sin 呼吸，声呐 ping 的心跳就有了。

</details>

<details>
<summary>第二档 · API</summary>

`sdCircle / sdSegment / smin`（骨架已给）· `abs(length(p) - R) - w`（圆环）· `dFdx / dFdy`（法线）· `pow(w / (abs(sd) + w), 2.0)`（glow）· `sin`（回响脉动）· 配方卡五行（2.8）。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
// 层 0：背景（脚手架 fbm）
vec2 bqp = p + (u_mouse - 0.5) * 0.02;         // 视差 2%
float bsnow = fbm(bqp * 1.3 + vec2(u_time * 0.04, -u_time * 0.08)); // 流速向下
vec3 col = BG + snowPalette(bsnow) * 0.25;    // 透明度 25%

// 层 1：前景构图（含 smin）
vec2 fp = p + (u_mouse - 0.5) * 0.05;          // 视差 5%
float ring = abs(length(fp) - 0.40) - 0.035;
float seg  = sdSegment(fp, vec2(0.30, 0.28), vec2(0.55, 0.50)) - 0.015;
float orb  = sdCircle(fp - vec2(0.58, 0.53), 0.07);
float sd = min(ring, smin(seg, orb, 0.06));    // 声呐环 + 锚链焊接灯珠

// 层 2：光感
float h = 1.0 - smoothstep(0.0, 0.05, abs(sd));
vec3 n = normalize(vec3(dFdx(h), dFdy(h), 0.04));
float lit = clamp(dot(n, normalize(vec3(-0.4, 0.7, 0.5))), 0.0, 1.0);
float pulse = 0.85 + 0.15 * sin(u_time * 1.8); // 回响脉动
float g1 = pow(0.08 / (abs(sd) + 0.08), 2.0);
float g2 = pow(0.12 / (abs(sd) + 0.12), 2.0);
col += PING * g1 * 0.9 * pulse + BLOOM * g2 * 0.5;
col = mix(col, vec3(0.78, 0.94, 0.92) * (0.4 + 0.6 * lit),
          1.0 - smoothstep(0.0, fwidth(sd), abs(sd)));

// 层 3：配方卡（顺序即配方）
col = pow(col, vec3(0.4545));
col = (col - 0.5) * 1.06 + 0.5;
col = mix(vec3(dot(col, vec3(0.299, 0.587, 0.114))), col, 0.9);
col += (hash21(gl_FragCoord.xy + u_time) - 0.5) * 0.04;
col *= 1.0 - 0.2 * pow(length(uv - 0.5), 2.0);
```

</details>
