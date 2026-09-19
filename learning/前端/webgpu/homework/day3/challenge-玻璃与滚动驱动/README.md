# Day 3 作业 challenge · 玻璃与滚动驱动

haoqi.design 的滚动叙事与 igloo.inc 的冰块材质合体成一件作品集级片段：一块悬浮的玻璃标志悬在深色空间，身后是交替发光的竖条光墙；向下滚动，相机绕着它走完 155 度，玻璃从高处入场、边下落边转身，最后一章 bloom 从光墙亮部满溢出来收尾。滚动进度是整个页面的唯一输入源——三个组件（滚动驱动相机、玻璃材质、后处理）共享它。约 2 小时。

## 目标

把讲义 3.5 工作坊的三个组件装配到同一个页面：滚动进度归一化与平滑拖动、`MeshPhysicalNodeMaterial` 的 transmission 折射参数组、`RenderPipeline` 后处理链随进度调参。做完后你对「滚动驱动」的理解会从「监听事件改参数」升级为「帧循环里消费一个归一化进度值」——这是 haoqi 与 igloo 滚动体验的技术脊柱。

## 前置讲义

- `3.5 创意网站实战工作坊`：组件一（滚动驱动相机）与组件三（玻璃与折射）的分步路线
- `3.4 后处理与性能调优`：RenderPipeline 接线、bloom 三参数的语义
- `2.2 光栅化与片元插值`（Day 2）：smoothstep 的手感（TODO 5 的 JS 手写版）

## 任务清单

1. `TODO(day3-ch-1)` 光墙：沿 x 排 11 根竖直发光条（BoxGeometry + `emissive` 电蓝/青/琥珀交替，`emissiveIntensity` 2.2–3.4），加深色地面压稳构图
2. `TODO(day3-ch-2)` 玻璃标志：RoundedBoxGeometry + `MeshPhysicalNodeMaterial`，transmission 1、thickness 1.2、ior 1.5、attenuationColor 微青冰感、`DoubleSide`
3. `TODO(day3-ch-3)` 滚动进度：`readScrollProgress()` 归一化 0–1，分母为零时返回 0
4. `TODO(day3-ch-4)` 相机映射：轨道角随进度扫过约 155 度，高度缓降，`lookAt` 盯住玻璃
5. `TODO(day3-ch-5)` 玻璃入场：先 smoothstep 压一遍进度再映射（下落 + 转身，第三章最戏剧）
6. `TODO(day3-ch-6)` 后处理链：RenderPipeline + `pass()` + bloom（strength 0.45 / radius 0.6 / threshold 0.65），帧循环改用 `pipeline.render()`
7. `TODO(day3-ch-7)` bloom 随进度升起：strength 平滑趋向 `0.15 + p * 0.7`，lerp 系数比相机慢半拍

## 验收标准

- 滚动全程相机连续平滑，无步进感（帧循环的 lerp 0.08 已给，别在 scroll 事件里做任何映射）
- 玻璃折射成立：能透过它看到身后光墙被压弯的像，不是一片均匀的灰
- 玻璃入场有戏剧性：从高处下落并转身的过程集中在滚动中段，首尾两章它的姿态基本稳定
- 第一章几乎无辉光、最后一章光墙亮部满溢，bloom 的过渡与滚动进度同步
- 章节文案与画框层叠正确（DOM 在上、canvas 钉在视口），滚动条全程可用
- 右下角稳定 60 FPS；transmission 是本作业最贵的材质，掉帧先把 `antialias` 关掉对比

## 提示

<details>
<summary>第一档 · 思路</summary>

整个页面只有一个输入源：滚动进度 p（0 到 1）。帧循环里先把它平滑（已给的 lerp），然后喂给三个纯函数：`applyCamera` 把 p 映射成轨道角与高度，`applyGlass` 映射成位置与旋转，`applyBloom` 映射成辉光强度。scroll 事件一行都不用监听——读 `scrollY` 的时机放在帧循环里，事件驱动在这个场景里只会带来撕裂感。玻璃参数组的关键是三个量的分工：transmission 是折射总开关（0 就是不透明）、thickness 控制位移量（薄玻璃像水、厚玻璃像冰）、attenuation 系列决定光在玻璃里走多深开始偏色——igloo 冰块的青色就是这么来的。
</details>

<details>
<summary>第二档 · API 名</summary>

`RoundedBoxGeometry` / `MeshPhysicalNodeMaterial` / `transmission` / `thickness` / `ior` / `attenuationColor` / `attenuationDistance` / `roughness` / `side` / `THREE.DoubleSide` ｜ `document.documentElement.scrollHeight` / `window.innerHeight` / `window.scrollY` ｜ `RenderPipeline` / `pass` / `bloom` / `outputNode` / `pipeline.render()` ｜ `THREE.ACESFilmicToneMapping`（已给）
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// TODO 1：光墙——值得折射的世界
for (let i = 0; i < 11; i++) {
  const h = 4.2 + Math.sin(i * 2.3) * 0.6;                  // 高度起伏
  const bar = new THREE.Mesh(
    new THREE.BoxGeometry(0.1, h, 0.1),
    new THREE.MeshStandardNodeMaterial({
      color: 0x14141a,
      emissive: [0x4c6fff, 0x2dd4bf, 0xf59e0b][i % 3],     // 三色交替
      emissiveIntensity: 2.2 + (i % 4) * 0.4,               // > 1 才喂得饱 bloom
    }),
  );
  bar.position.set(-3.6 + i * 0.72, h / 2 - 1.2, -2.6 + Math.sin(i * 1.7) * 0.4);
  scene.add(bar);
}
const floor = new THREE.Mesh(new THREE.PlaneGeometry(24, 24),
  new THREE.MeshStandardNodeMaterial({ color: 0x0d1017, roughness: 0.9 }));
floor.rotation.x = -Math.PI / 2;
floor.position.y = -2.6;
scene.add(floor);

// TODO 2：玻璃标志
glass = new THREE.Mesh(new RoundedBoxGeometry(1.7, 1.7, 0.55, 5, 0.14),
  new THREE.MeshPhysicalNodeMaterial({
    transmission: 1, thickness: 1.2, roughness: 0.08, ior: 1.5,
    attenuationColor: new THREE.Color(0x9fd8e8), attenuationDistance: 1.6,
  }));
glass.material.side = THREE.DoubleSide;
glass.position.set(0, 2.0, 1.8);
scene.add(glass);

// TODO 3：进度归一化（防除零）
function readScrollProgress(): number {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

// TODO 4：相机轨道
function applyCamera(p: number): void {
  const angle = -0.75 + p * 2.7;
  camera.position.set(Math.sin(angle) * 5.4, 2.3 - p * 1.7, Math.cos(angle) * 5.4);
  camera.lookAt(0, 0.35, 0);
}

// TODO 5：玻璃入场（smoothstep 压一遍，戏剧集中在中段）
function smoothstep(a: number, b: number, x: number): number {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1);
  return t * t * (3 - 2 * t);
}
function applyGlass(p: number): void {
  const e = smoothstep(0.35, 0.85, p);
  glass!.position.y = 2.0 - e * 1.65;
  glass!.position.z = 1.8 - e * 1.4;
  glass!.rotation.y = e * Math.PI * 0.9;
}

// TODO 6：后处理链（r183 起 PostProcessing 改名 RenderPipeline）
pipeline = new THREE.RenderPipeline(renderer);
const scenePassColor = pass(scene, camera).getTextureNode('output');
bloomPass = bloom(scenePassColor, 0.45, 0.6, 0.65);
pipeline.outputNode = scenePassColor.add(bloomPass);

// TODO 7：辉光随进度升起（比相机慢半拍）
function applyBloom(p: number): void {
  bloomPass.strength.value += (0.15 + p * 0.7 - bloomPass.strength.value) * 0.06;
}
```
</details>
