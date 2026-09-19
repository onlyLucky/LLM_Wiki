# Day 3 作业 basic · TSL 波浪网格

Day 2 demo 04 用原生 WGSL 写了一片海：main.ts 216 行 + ocean.wgsl 97 行，共 313 行，其中真正的波浪数学不到 30 行，其余是管线仪式——buffer、bind group、pipeline、encoder。今天用 TSL 把同一片海重写一遍，仪式交给引擎，只留数学。约 1 小时。

## 目标

用 TSL 复刻三组浪叠加的顶点波浪：`positionNode` 做位移、`colorNode` 按高度做双色、鼠标 uniform 调制频率与相位。做完数一数你的 main.ts 行数，与 Day 2 的 313 行对比——这个数字差就是讲义 3.1「迁移策略」最直接的论据，也回答了「引擎层到底省了什么」。

## 前置讲义

- `3.2 TSL 节点着色语言`：Fn 与立即调用、positionNode / colorNode、GLSL↔TSL 对照表
- `2.5 几何生成与顶点动画`（Day 2）：三组浪的叠加配方与法线策略（对照用）

## 任务清单

1. `TODO(day3-basic-1)` 场景组装：转平的 PlaneGeometry 网格、环境光 + 方向光、相机定位，全部入 scene
2. `TODO(day3-basic-2)` 顶点波浪：`material.positionNode` 挂三组 sin 叠加的位移节点图
3. `TODO(day3-basic-3)` 高度双色：`material.colorNode` 按位移后的高度 mix 深青与主白
4. `TODO(day3-basic-4)` 鼠标调制：`uniform(vec2(0, 0))` + pointermove，折进波浪的频率与相位

## 验收标准

- 波浪有「三组浪」的维度感——斜向细浪让海面不再是一个方向的搓衣板
- 高度双色可辨：波谷深青 `#0F3B3A`、波峰主白 `#E8ECF4`
- 鼠标移动时频率 / 相位有可感知但克制的变化（扰动系数 ≤ 0.2）
- 右下角稳定 60 FPS（16 万顶点的网格对 GPU 是轻活）
- 代码量对比：数出你的 main.ts 行数，与 Day 2 demo 04 的 313 行放在一起

## 提示

<details>
<summary>第一档 · 思路</summary>

TSL 里没有着色器字符串，一切是 JS 表达式树：`positionLocal` 是顶点局部坐标节点，对它的分量做 `mul` / `add` / `sin` 就是在写顶点着色器，`Fn(() => {...})()` 把表达式包成可挂载的节点图——忘记末尾的 `()` 是 3.2 讲的头号坑。三组浪的配方沿用 Day 2：主浪 `sin(x·k₁ + t)`、交叉浪 `sin(z·k₂ + 1.3t)·0.5`、细浪 `sin((x+z)·k₃ − 1.7t)·0.25`，振幅整体乘 0.35 控制在克制的范围。颜色通道直接读 `positionWorld.y`：positionNode 位移过的世界坐标会自动流到片元阶段，这正是引擎替你省掉的 varying 手工活。鼠标 uniform 创建一次，事件里只改 `.value`——节点图在渲染前构建完毕，运行期换节点图等于换管线。
</details>

<details>
<summary>第二档 · API 名</summary>

`Fn` · `positionLocal` · `positionWorld` · `time` · `sin` · `vec3` · `mix` · `color` · `uniform` · `vec2` ｜ `material.positionNode` / `material.colorNode` ｜ `new THREE.PlaneGeometry(6, 6, 160, 160)` + `geometry.rotateX(-Math.PI / 2)` ｜ `THREE.AmbientLight` / `THREE.DirectionalLight` ｜ `chrome.canvas.getBoundingClientRect()`（NDC 换算与 Day 2 作业相同）
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// TODO 2 + 4：三组浪（mouse 是 uniform(vec2(0, 0))，扰动 ≤ 0.2）
material.positionNode = Fn(() => {
  const p = positionLocal;
  const kx = 1.4 + mouse.x.mul(0.2);          // 频率微调
  const phase = mouse.y.mul(0.2);             // 相位微调
  const h = sin(p.x.mul(kx).add(time).add(phase))
    .add(sin(p.z.mul(2.3).add(time.mul(1.3))).mul(0.5))
    .add(sin(p.x.add(p.z).mul(3.1).sub(time.mul(1.7))).mul(0.25));
  return vec3(p.x, h.mul(0.35), p.z);
})();

// TODO 3：高度双色（位移后的世界高度自动流到片元）
material.colorNode = mix(
  color(0x0f3b3a), color(0xe8ecf4),
  positionWorld.y.mul(1.6).add(0.35).clamp(0, 1),
);

// TODO 4：鼠标 NDC → uniform.value
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse.value.set(((e.clientX - r.left) / r.width) * 2 - 1,
                  1 - ((e.clientY - r.top) / r.height) * 2);
});
```
</details>
