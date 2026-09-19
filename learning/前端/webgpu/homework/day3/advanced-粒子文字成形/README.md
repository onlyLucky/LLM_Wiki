# Day 3 作业 advanced · 粒子文字成形

iyO 首页的招牌：一池粒子先散在空间里，被弹簧拉成一句话，光标扫过犁开一道口，点击换词时旧字揉碎、同一批粒子再聚成新字——从头到尾没有一次淡入淡出（据 awwwards 官方案例复盘，原站用 GPGPU 跑到 160 万粒）。本作业用 TSL compute 复刻这条技术脊柱：文字画进离屏画布、读出暗像素当吸附目标、弹簧加阻尼做成形动画。约 1.5 小时。

## 目标

跑通「CPU 采样一次、GPU 每帧吸附」的完整数据流：OffscreenCanvas 绘字与像素采样、三块 storage 的分工（位置 / 速度 / 目标）、弹簧-阻尼积分器、噪声呼吸与光标斥力，最后是 iyO 式换词——只重写目标 buffer，节点图与粒子池都不动。做完它，实例清单里 iyO 首页对你就从魔术变成了工程。

## 前置讲义

- `3.3 TSL 计算与数据流`：storage 与 element(instanceIndex)、compute 的执行时机、storage 直读渲染
- `2.7 GPGPU 粒子与动画模拟`（Day 2）：半隐式欧拉、指数阻尼、鼠标力场（把引力改成斥力）
- `3.5 创意网站实战工作坊` 组件二：六步路线表与采样骨架

## 任务清单

1. `TODO(day3-adv-1)` 文字采样：OffscreenCanvas 绘字 → `getImageData` 按步长扫描 → 命中格点 `mapToWorld` 转世界坐标，返回 `Float32Array`
2. `TODO(day3-adv-2)` 目标写入：采样点按 `i % n` 循环分配给固定大小的粒子池，写入 `targetAttr.array` 并置 `needsUpdate`
3. `TODO(day3-adv-3)` 初始化 kernel：粒子在半径 9–14 的球壳上随机散布（入场即「四面八方聚成字」），只跑一次
4. `TODO(day3-adv-4)` 更新 kernel 之成形：弹簧拉向目标（刚度 26）、指数阻尼（比 demo 03 强，字要停得住）、deltaTime 积分
5. `TODO(day3-adv-5)` 更新 kernel 之生命感：噪声呼吸（time 混进噪声坐标）+ 光标斥力（平方衰减）
6. `TODO(day3-adv-6)` 渲染：`positions.toAttribute()` 喂 positionNode、速度双色（就位白 / 飞驰紫）、柔边圆点、加色混合
7. `TODO(day3-adv-7)` 点击换词：复用 TODO 2 的 `fillTargets`，观察旧字揉碎再聚成新字的过渡

## 验收标准

- 入场动画成立：粒子从远处球壳飞入，约两秒内聚成词表第一词，成形后没有持续漂移
- 字形清晰可读：采样步长与粒子数匹配，不糊成一团也不稀疏掉字（参考值：步长 2，池 12000）
- 静止的字有呼吸感：噪声扰动幅度克制，字在轻微起伏但结构不散
- 光标扫过字面能犁开一道口，松开后粒子回位；按住时斥力明显更强
- 点击换词：旧字散开-汇聚成新字，全程同一批粒子，无闪断（帧循环与节点图未重建）
- 右下角稳定 60 FPS（12000 粒子的 compute 对 GPU 是轻活，掉帧先查是不是忘了把 `sizeNode` 里塞了昂贵节点）

## 提示

<details>
<summary>第一档 · 思路</summary>

数据流分两侧看。CPU 侧只发生两件事：启动时采样一次初始词、点击时采样下一个词——采样的输入是画布像素，输出是一串目标坐标，写进 target 这块 storage 的数组，置 `needsUpdate` 让版本号顶上去，GPU 下一帧就能读到。GPU 侧每帧跑一个 kernel：读自己的位置、速度、目标，算三个力（弹簧、噪声、斥力），积分写回。弹簧的「刚度」与阻尼是一对：刚度越大成形越快，阻尼越强越快停下；阻尼太小字会永远晃，太大飞行过程像糖浆。换词之所以免费，是因为弹簧只知道「把我拉向 target」——target 的内容变了，力场就变了，粒子池与节点图对此一无所知。
</details>

<details>
<summary>第二档 · API 名</summary>

`OffscreenCanvas` / `getContext('2d')` / `ctx.font` / `textAlign` / `textBaseline` / `fillText` / `getImageData` ｜ `THREE.StorageInstancedBufferAttribute` / `storage(..., 'vec3', COUNT)` / `.element(instanceIndex)` ｜ `Fn` / `.compute(COUNT)` / `renderer.compute(node)` ｜ `deltaTime` / `exp` / `mx_noise_float` / `hash` / `normalize()` ｜ `positions.toAttribute()` / `PointsNodeMaterial` / `THREE.Sprite` / `count` / `frustumCulled` ｜ `attribute.needsUpdate = true` ｜ `THREE.Raycaster` + `THREE.Plane`（帧循环里已给）
</details>

<details>
<summary>第三档 · 伪代码</summary>

```ts
// TODO 1：采样（步长扫描 alpha 通道）
function sampleText(word: string): Float32Array {
  const canvas = new OffscreenCanvas(CANVAS_W, CANVAS_H);
  const ctx = canvas.getContext('2d')!;
  ctx.font = FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff';
  ctx.fillText(word, CANVAS_W / 2, CANVAS_H / 2, CANVAS_W - 24); // maxWidth 防超宽
  const data = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;
  const pts: number[] = [];
  for (let y = 0; y < CANVAS_H; y += SAMPLE_STEP) {
    for (let x = 0; x < CANVAS_W; x += SAMPLE_STEP) {
      if (data[(y * CANVAS_W + x) * 4 + 3] > 128) {
        const [wx, wy] = mapToWorld(x, y);
        pts.push(wx, wy, 0);
      }
    }
  }
  return new Float32Array(pts);
}

// TODO 2：循环分配 + 版本号顶上去
function fillTargets(word: string): void {
  const pts = sampleText(word);
  const n = pts.length / 3;
  for (let i = 0; i < COUNT; i++) {
    const src = (i % n) * 3;
    targetAttr.array[i * 3] = pts[src];
    targetAttr.array[i * 3 + 1] = pts[src + 1];
    targetAttr.array[i * 3 + 2] = pts[src + 2];
  }
  targetAttr.needsUpdate = true;
}

// TODO 3：球壳散布，只跑一次
const initKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const dir = vec3(gauss(0.1), gauss(0.2), gauss(0.3)).normalize();
  position.assign(dir.mul(float(9.0).add(hash(instanceIndex.add(0.5)).mul(5.0))));
  velocities.element(instanceIndex).assign(vec3(0, 0, 0));
})().compute(COUNT);
renderer.compute(initKernel);

// TODO 4 + 5：力场全家桶（成形 → 呼吸 → 斥力）
updateKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);
  const target = targets.element(instanceIndex);

  const accel = target.sub(position).mul(26.0).toVar();          // 弹簧
  const nt = time.mul(0.4);                                       // 呼吸：场随时间流
  accel.addAssign(vec3(
    mx_noise_float(position.mul(1.8).add(vec3(0.0, 0.0, nt))),
    mx_noise_float(position.mul(1.8).add(vec3(31.4, 47.2, nt))),
    mx_noise_float(position.mul(1.8).add(vec3(-12.9, 88.3, nt))),
  ).mul(0.5));
  const toMouse = mousePos.sub(position);                         // 斥力：平方衰减
  const dm2 = toMouse.dot(toMouse);
  accel.addAssign(toMouse.div(dm2.add(1e-4).sqrt()).negate()      // 方向取反：推开
    .mul(repelStrength).div(dm2.add(0.35)));

  const nv = velocity.add(accel.mul(deltaTime))
    .mul(exp(float(-3.2).mul(deltaTime))).toVar();                // 阻尼比 demo 03 强
  position.addAssign(nv.mul(deltaTime));
  velocity.assign(nv);
})().compute(COUNT);

// TODO 6：渲染（速度双色：就位白、飞驰紫）
const speed01 = velocities.toAttribute().length().mul(1.8).clamp(0.0, 1.0);
const material = new THREE.PointsNodeMaterial();
material.positionNode = positions.toAttribute();
material.sizeNode = float(0.03).add(speed01.mul(0.015));
material.colorNode = mix(color(0xe8ecf4), color(0x8b5cf6),
  smoothstep(0.05, 0.5, speed01));
material.opacityNode = smoothstep(1.0, 0.15, uv().sub(0.5).mul(2.0).length());
material.transparent = true;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending;
const particles = new THREE.Sprite(material);
particles.count = COUNT;
particles.frustumCulled = false;
scene.add(particles);

// TODO 7：换词 = 换目标 buffer，仅此而已
chrome.canvas.addEventListener('click', () => {
  wordIndex = (wordIndex + 1) % WORDS.length;
  fillTargets(WORDS[wordIndex]);
});
```
</details>
