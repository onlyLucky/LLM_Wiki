# Day 3 作业 basic · TSL 熔核星球

讲义 3.2 的 demo 02 用 TSL 写了一片线性行波海——这份作业不重复那片海。你把平面波换成**噪声置换的熔核星球**：三频噪声叠出地形、沿法线推出球面，熔岩从低谷透光；交互也换一种形态——demo 02 的鼠标是横移调频纵移推相（参数调制），这里改成**蓄热状态机**：按住鼠标注入热量，星球隆起沸腾，松开缓缓冷却。同一套节点工具（`positionNode` / `colorNode` / uniform），置换数学完全自选——demo 02 教的是「怎么用」，这份作业验收「会不会自己组织表达式树」。做完数一数行数：同样的星球用原生 WGSL 写，buffer / bind group / pipeline 一样都不少（参照 Day 2 demo 04 的 313 行式样）——引擎层价值照旧是行数。约 1 小时。

## 目标

用 TSL 造一颗熔核星球：`positionNode` 做三频噪声置换、`colorNode` 按海拔反向配色（低洼是熔岩、高处是岩壳）、一个 charge uniform 驱动「蓄热-冷却」状态机。核心配方一行：`h = (fBm(p) − 0.5) · (基础幅度 + charge · 热量加成)`——地形是噪声域的函数，不是坐标的函数。

## 前置讲义

- `3.2 TSL 节点着色语言`：Fn 与立即调用、positionNode / colorNode、varying 跨阶段传递、GLSL↔TSL 对照表
- `2.5 几何生成与顶点动画`（Day 2）：顶点置换的坐标轴意识（对照用，行数对比的论据）
- 对照 demo 03：它用 `mx_noise_float` 让**粒子**呼吸（尺寸扰动），这份作业同一颗噪声函数换一种用法——作为**地形高度场**置换球面

## 任务清单

1. `TODO(day3-basic-1)` 场景组装：`IcosahedronGeometry(1.6, 48)`（48 细分约 4.6 万三角面）挂 material 入 scene；暖白主光 + 冷蓝轮廓光 + 暗暖环境光三盏——球体背面全靠环境光兜底，别让半边死黑；相机 (0, 0.8, 5.2) 微俯视原点
2. `TODO(day3-basic-2)` 噪声置换球面：三频 fBm（0.9 / 2.1 / 3.9 倍域加权 0.55 / 0.3 / 0.15）叠出海拔；时间漂移让地形缓慢流动且 charge 越高流得越快；置换幅度基础 0.14、充满 0.42；方向用 `normalLocal`（球面上法线即径向）。⚠️ 写法约定：置换是纯节点运算，模块级直接把节点链赋给 `material.positionNode`（不必包 Fn）；海拔 varying 也必须模块级直接创建 `varying(elev, 'vElev')`——放进 Fn 体再用模块级 let 承接会因管线编译期 Fn 重跑导致 WGSL 编译失败（参考答案实测验证的坑）
3. `TODO(day3-basic-3)` 熔岩配色：`material.colorNode` 按海拔**反向**映射——低洼带 `#FF5A1F` 熔岩橙、更低洼的炽核 `#FFC86B` 亮黄、高处暗紫岩壳 `#1A1420`；两个 mask 都用 `smoothstep(edge0, edge1, e).oneMinus()` 写「低于阈值」，最后乘一档热量亮度
4. `TODO(day3-basic-4)` 蓄热交互：charge uniform 骨架已声明，pointerdown / pointerup 置 charging 布尔，帧循环里加一行指数趋近 `charge.value += ((charging ? 1 : 0) - charge.value) * 0.03`——按住约 1.5 秒充满，松开同速冷却

## 验收标准

- 星球是**噪声地形球**——山体 / 岩块 / 熔渣三个尺度可辨，而不是规则的波纹或几何体
- 熔岩在**低谷**透光、岩壳在高处凝固（海拔反向映射），与「波峰才是金色」的直觉相反
- 交互是**蓄热状态机**：按住约 1.5 秒充满（隆起加剧、裂缝渗出亮黄、流速加快），松开同速冷却——不是一次性的位置/参数映射
- 球体暗侧有冷蓝轮廓光勾边，环境光兜底不出现半边死黑
- 右下角稳定 60 FPS（4.6 万面对 GPU 是轻活）
- 代码量对比：数出你的 main.ts 行数，与 Day 2 demo 04 的 313 行放在一起

## 提示

<details>
<summary>第一档 · 思路</summary>

fBm（分形布朗运动）的全部秘密就是「同一颗噪声、多种频率、加权相加」：`mx_noise_float` 取 0.9 倍域得到大尺度山体，2.1 倍域得到中尺度岩块，3.9 倍域得到小尺度熔渣，按 0.55 / 0.3 / 0.15 加权——大特征权重高、小细节权重低，这就是自然地形的观感。置换方向用 `normalLocal`：球面未变形时法线就是径向，`p.add(normalLocal.mul(h))` 沿半径推出。海拔从顶点传到片元用 `varying(elev, 'vElev')`——必须在**模块级直接创建**：顶点侧的求值自动进顶点阶段、片元侧自动读同名 varying，WGSL 版的手写 varying 声明消失了。（⚠️ 别把 varying 放进 Fn 体里再靠模块级 `let` 承接——管线编译期 Fn 体重跑，片元侧拿到旧节点，WGSL 直接编译失败，0.186.0 实测踩过的坑。）配色反着来：`smoothstep(edge0, edge1, e).oneMinus()` 写「低于阈值」，低洼才是熔岩。蓄热状态机只需一个布尔 + 帧循环里一行指数趋近 `charge.value += (target - charge.value) * 0.03`：每帧向目标靠拢 3%，按住约 1.5 秒充满，松开同速冷却——uniform 只写 `.value`，节点图一个字节不动。
</details>

<details>
<summary>第二档 · API 名</summary>

`Fn` · `positionLocal` · `normalLocal` · `time` · `mx_noise_float` · `varying` · `vec3` · `mix` · `color` · `smoothstep` · `uniform` ｜ `material.positionNode` / `material.colorNode` ｜ `new THREE.IcosahedronGeometry(1.6, 48)` ｜ `THREE.AmbientLight` / `THREE.DirectionalLight` ｜ `chrome.canvas.addEventListener('pointerdown', ...)` + `window.addEventListener('pointerup', ...)`
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// TODO 2：三频 fBm 置换——模块级节点链直接赋值，不包 Fn
const flow = time.mul(charge.mul(0.12).add(0.03));           // 越热流越快
const q = positionLocal.mul(0.9).add(vec3(flow, flow.mul(0.6), flow.mul(-0.4)));
const n1 = mx_noise_float(q);
const n2 = mx_noise_float(q.mul(2.1).add(17.3));
const n3 = mx_noise_float(q.mul(3.9).add(43.7));
const elev = n1.mul(0.55).add(n2.mul(0.3)).add(n3.mul(0.15))
  .mul(0.5).add(0.5);                        // mx_noise_float 是 [-1,1]，重映射 0~1
const e01 = varying(elev, 'vElev');          // ⚠️ 必须模块级直接创建，勿放进 Fn
const h = elev.sub(0.5).mul(2).mul(charge.mul(0.28).add(0.14)); // 幅度挂 charge
material.positionNode = positionLocal.add(normalLocal.mul(h)); // 沿法线（径向）推出

// TODO 3：海拔反向映射——低洼是熔岩，高处是岩壳
const lavaMask = smoothstep(0.34, 0.42, e01).oneMinus();  // 低于阈值 → 熔岩（窄过渡=裂缝边缘锐利）
const coreMask = smoothstep(0.3, 0.4, e01).oneMinus();    // 更低洼 → 炽核
const c = mix(color(0x1a1420), color(0xff5a1f), lavaMask);
material.colorNode = mix(c, color(0xffc86b),
  coreMask.mul(charge.mul(0.4).add(0.6)),                 // 热量让亮黄渗得更广
).mul(charge.mul(0.6).add(1));                            // 蓄热整体泛光

// TODO 4：蓄热状态机 + 帧循环一行趋近
let charging = false;
chrome.canvas.addEventListener('pointerdown', () => { charging = true; });
window.addEventListener('pointerup', () => { charging = false; });
// chrome.startLoop(() => {
//   charge.value += ((charging ? 1 : 0) - charge.value) * 0.03;  // ← 新增这行
//   ...骨架原有的 aspect / updateProjectionMatrix / render
// });
```
</details>
