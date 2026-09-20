# 作业 B · 渐变海报平面

> Day 3 · B 档 · 约 45 分钟 · 前置：讲义 [3.1 ShaderMaterial：从原生到 Three.js 的迁移](../../../讲义/day3-Three.js实战落地/3.1-ShaderMaterial：从原生到Three.js的迁移.md)

## 目标

满屏两色对角渐变（深蓝夜 → 玫红），随时间呼吸（周期 3s ±6%），鼠标轻微视差（3%）——「迁移热身」。技术考点：three 五件套最小闭环、varying 透传、uniform 接线、宽高比修正下保持 45° 渐变。

## 前置讲义

3.1 一讲覆盖全部四个任务：五件套对应关系、内置注入表、GLSL 风格差异（不写 `#version`、attribute 用内置名）。骨架 `main.ts` 的场景段已就位（TODO-1 只需通读），你的活儿集中在帧循环一处 + 两个 shader。

## 任务清单

1. **TODO(day3-basic-1)** — 通读 `main.ts` 场景段：Scene / PerspectiveCamera / PlaneGeometry / ShaderMaterial / WebGLRenderer 各归其位。对照 1.6 的原生写法，感受 40 行脚手架去哪了。
2. **TODO(day3-basic-2)** — `vertex.glsl`：varying 声明 + uv 透传 + `projectionMatrix * modelViewMatrix` 管线。完成后画面从「占位异常」恢复成整块纯色。
3. **TODO(day3-basic-3)** — `fragment.glsl`：宽高比修正 → 对角渐变 `mix` → 呼吸（周期 3s ±6%）→ 视差（3%）。
4. **TODO(day3-basic-4)** — `main.ts` 帧循环：u_time（秒）与 u_mouse（`p.nx/p.ny`，y 已翻转）接进 uniforms。1.7 的 DPR 与 y 翻转老坑在 three 里的下落，注释里写明了。

## 验收标准

- 渐变方向恒 45°（拉伸窗口验证——不做宽高比修正的话一拉就歪）
- 呼吸稳定，周期目测 3 秒，幅度 ±6%
- 视差平滑无跳变（chrome 的 pointer 已带 0.08 阻尼，直接用不需要再 lerp）
- 60fps
- 加分项：渐变两端颜色随呼吸向色板第三色（天青 #4CC9F0）微调 5%；或视差系数改成随 y 反向（内容「迎着」光标走）

## 提示

卡住 15 分钟再打开下一档。

<details>
<summary>第一档 · 思路</summary>

三个 uniform 各司其职：u_time 只管呼吸（正弦的相位），u_mouse 只管视差（减 0.5 变成 -0.5~0.5 的偏移向量），两个颜色 uniform 组成 mix 的两端。渐变的「对角」本质是一个标量场 t(x, y) = (p.x + p.y) 的等值线——45° 观感的全部秘密在于 p 的两个分量在屏幕上等尺度，这就是宽高比修正。

</details>

<details>
<summary>第二档 · API</summary>

`THREE.ShaderMaterial`（`vertexShader / fragmentShader / uniforms` 三参数）· `uniforms.u_time.value`（JS 侧更新口）· GLSL 侧：`varying` / `mix(a, b, t)` / `sin()` / `fract()`。

</details>

<details>
<summary>第三档 · 伪代码</summary>

```glsl
// fragment
vec2 uv = v_uv + (u_mouse - 0.5) * 0.06;          // 视差 3%
vec2 p = vec2((uv.x - 0.5) * 0.8, uv.y - 0.5);    // 宽高比修正（6/7.5 = 0.8）
float t = clamp(p.x + p.y, -1.0, 1.0) * 0.5 + 0.5; // 对角标量场归一
vec3 col = mix(u_colorA, u_colorB, t);
col *= 1.0 + 0.06 * sin(u_time * 6.2831853 / 3.0); // 呼吸 3s ±6%
gl_FragColor = vec4(col, 1.0);
```

```ts
// main.ts 帧循环
material.uniforms.u_time.value = s;
material.uniforms.u_mouse.value.set(p.nx, p.ny);
```

</details>
