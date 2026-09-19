// Day 3 · 作业 advanced —— 粒子文字成形
// 对应讲义 3.3（TSL 计算与数据流）+ 3.5 工作坊组件二：
// iyO 首页的技术脊柱。文字画进离屏画布，命中的像素成为吸附目标，
// 一池粒子被弹簧拉成字、被光标推开、被噪声吹得呼吸；点击换词，
// 换的只是目标 buffer，粒子池从头到尾不换。
// 七个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。
// 说明：three 0.186.0 的 npm 包不带类型声明，three/webgpu / three/tsl 两处导入
// 带 @ts-ignore（真实项目装 @types/three 补全，课程工程刻意不引入）。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
// @ts-ignore three 0.186.0 未附带 three/webgpu 的类型声明
import * as THREE from 'three/webgpu';
// @ts-ignore 同上：three/tsl
import {
  Fn, storage, instanceIndex, uniform, vec3, float, time, deltaTime,
  hash, mx_noise_float, mix, color, smoothstep, exp, uv,
} from 'three/tsl';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

const chrome = createChrome({
  day: 3, index: 'A', title: 'PARTICLE TYPE',
  tags: ['THREE', 'TSL', 'COMPUTE'],
  hint: '完成后：粒子聚成字 · 移动鼠标推开 · 点击换词',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  },
});

try {
  renderer = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await renderer.init();
} catch (e) {
  chrome.fail(
    'RENDERER INIT FAILED', String(e),
    '检查浏览器是否支持 WebGPU（Chrome/Edge 113+）。WebGPURenderer 会自动回退 WebGL2，走到这里通常是 canvas 或上下文冲突。',
  );
  throw e;
}
renderer.setPixelRatio(dpr);
renderer.setSize(chrome.width / dpr, chrome.height / dpr, false);

// ---- 场景与词表（已给）--------------------------------------------
const scene = new THREE.Scene();
camera.position.set(0, 0, 7.0);
camera.lookAt(0, 0, 0);

const WORDS = ['WEBGPU', 'THREE.JS', 'COMPUTE', 'BLOOM']; // 点击轮换的词表
const CANVAS_W = 768, CANVAS_H = 224;       // 离屏画布尺寸（像素）
const FONT = '900 132px ui-sans-serif, system-ui, sans-serif';
const SAMPLE_STEP = 2;    // 采样步长：2 偏密（字厚实），3 更疏（更省粒子）
const WORLD_W = 5.6;      // 画布满宽映射到的世界宽度
const COUNT = 12000;      // 粒子池大小：固定，换词不换池（iyO 同款策略）

// 画布像素 → 世界坐标（已给）：y 翻转，因为画布 y 向下、世界 y 向上
const mapToWorld = (px: number, py: number): [number, number] => [
  (px / CANVAS_W - 0.5) * WORLD_W,
  (0.5 - py / CANVAS_H) * WORLD_W * (CANVAS_H / CANVAS_W),
];

// ---- 粒子状态三块 storage（已给，demo 03 同款）--------------------
// 位置与速度全程待在显存；target 是「文字采样结果」的 GPU 侧镜像，
// TODO 2 写入、TODO 4 的弹簧读它、TODO 7 点击换词时重写它。
const positionAttr = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const velocityAttr = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const targetAttr = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const positions = storage(positionAttr, 'vec3', COUNT);
const velocities = storage(velocityAttr, 'vec3', COUNT);
const targets = storage(targetAttr, 'vec3', COUNT);

// 交互参数（已给）：鼠标世界坐标 z 初始放到远处，避免误伤字中心
const mousePos = uniform(new THREE.Vector3(0, 0, 99));
const repelStrength = uniform(0.55); // 悬停斥力，按住抬到 3.0

// 近似高斯（已给，demo 03 同款）：三个均匀随机数相加减 1.5
const gauss = (offset: number) =>
  hash(instanceIndex.add(offset))
    .add(hash(instanceIndex.add(offset + 0.37)))
    .add(hash(instanceIndex.add(offset + 0.71)))
    .sub(1.5);

// ---- TODO 1：文字采样 ---------------------------------------------
// OffscreenCanvas 上画一次字，读回像素，命中文字的格点就是目标点集。
// 讲义 3.5 组件二的步骤 1–2；getImageData 的跨域坑本课程遇不到（无外图）。
function sampleText(word: string): Float32Array {
  // TODO(day3-adv-1): 实现——
  // 1. new OffscreenCanvas(CANVAS_W, CANVAS_H)，getContext('2d')
  // 2. ctx.font = FONT；textAlign / textBaseline 居中；
  //    fillText(word, W/2, H/2, W - 24)——第 4 参 maxWidth 让超宽的词自动压扁，
  //    词表再长也不会画出画布被裁切
  // 3. getImageData(0, 0, W, H) 逐格点按 SAMPLE_STEP 双重循环扫，
  //    alpha（data[(y*W+x)*4+3]）> 128 视为命中
  // 4. 命中点 mapToWorld(x, y)（z 用 0），push 进普通数组，
  //    返回 new Float32Array(points)（拍平的 [x,y,z, x,y,z, ...]）
  throw new Error('TODO(day3-adv-1) 未完成：见 README');
}

// ---- TODO 2：目标写入 ---------------------------------------------
// 采样点数随词长变化，粒子池却是固定的 COUNT——按「第 i 颗粒子的目标 =
// 采样点[i % 采样点数]」循环分配，两边解耦。这就是 iyO「换词只换
// 目标 buffer，粒子池不换」的全部秘密。
let wordIndex = 0;

function fillTargets(word: string): void {
  // TODO(day3-adv-2): 实现——
  // 1. const pts = sampleText(word)，采样点数 n = pts.length / 3
  // 2. for (let i = 0; i < COUNT; i++) 把 pts[(i % n) * 3 .. +2]
  //    三个分量写进 targetAttr.array[i * 3 .. +2]
  // 3. targetAttr.needsUpdate = true（storage buffer 走同样的
  //    版本号更新通道，改数组后置位即重传，节点图不用重建）
  throw new Error('TODO(day3-adv-2) 未完成：见 README');
}
fillTargets(WORDS[wordIndex]); // 初始词（已给）

// ---- TODO 3：初始化 kernel ----------------------------------------
// 位置与速度的初值在 GPU 上算一次（demo 03 同款思路）：粒子从远处的
// 球壳向内飞，入场就是「四面八方聚成一个字」的动画，不用 JS writeBuffer。
// TODO(day3-adv-3): 实现——
// const initKernel = Fn(() => {...})().compute(COUNT)，内部：
// 1. 取 positions / velocities 的 element(instanceIndex)
// 2. 随机方向 vec3(gauss(0.1), gauss(0.2), gauss(0.3)).normalize()，
//    半径 9 + 5 * hash(instanceIndex.add(0.5))，position.assign(方向 × 半径)
// 3. velocity.assign(vec3(0, 0, 0))
// 然后立刻 renderer.compute(initKernel) 跑一次（只跑这一次）。
throw new Error('TODO(day3-adv-3) 未完成：见 README');

// ---- TODO 4 + 5：更新 kernel（每帧跑，弹簧把粒子拉成字）-----------
// 力场分两档补全：TODO 4 先让字成形，TODO 5 再给字生命感。
// 帧循环消费的是这里的 updateKernel（已声明，TODO 4 里赋值）。
let updateKernel: any = null; // TSL 节点暂无类型声明，帧循环里 compute 它

// TODO(day3-adv-4): updateKernel = Fn(() => {...})().compute(COUNT)——
// 1. 取 position / velocity / target 三块 storage 的 element(instanceIndex)
// 2. 弹簧：加速度 a = (target - position) * 26（刚度决定成形快慢）
// 3. 积分：v += a * deltaTime；阻尼 v *= exp(-3.2 * deltaTime)
//    （比 demo 03 的 1.6 强——字要停得住）；p += v * deltaTime
// 先只做这三步，页面已经能看到粒子聚成字。
throw new Error('TODO(day3-adv-4) 未完成：见 README');

// TODO(day3-adv-5): 在 TODO 4 的 kernel 里再加两味力——
// 1. 噪声呼吸：mx_noise_float 三个偏移采样合成 vec3 扰动（demo 03 的
//    drift 同款），坐标混入 time 让场随时间流动，系数克制在 0.5 内——
//    成形后的字会持续轻微起伏，静止但不死板
// 2. 光标斥力：toMouse = mousePos - position，沿 -toMouse 方向加
//    repelStrength / (dist² + 0.35) 的推力，光标扫过字会犁开一道口
throw new Error('TODO(day3-adv-5) 未完成：见 README');

// ---- TODO 6：渲染 -------------------------------------------------
// TODO(day3-adv-6): PointsNodeMaterial + Sprite（demo 03 同款）——
// 1. material.positionNode = positions.toAttribute()（属性通道读 storage）
// 2. 速度双色：速度接近 0（已就位）主白 #E8ECF4，飞驰中亮紫 #8B5CF6，
//    smoothstep 过渡——成形后的字是白的，换词瞬间炸开一片紫
// 3. sizeNode 约 0.03 起步；opacityNode 用 uv() 柔边圆点（demo 03 同款）
// 4. transparent + depthWrite false + AdditiveBlending
// 5. new THREE.Sprite(material)，count = COUNT，frustumCulled = false，入 scene
throw new Error('TODO(day3-adv-6) 未完成：见 README');

// ---- TODO 7：点击换词 ---------------------------------------------
// TODO(day3-adv-7): chrome.canvas 的 click 监听——
// wordIndex = (wordIndex + 1) % WORDS.length，然后 fillTargets(WORDS[wordIndex])。
// 不重建节点图、不碰粒子池：弹簧会自动把旧字的形状揉碎再拉成新字，
// 中途的散开-汇聚就是 iyO 换俳句时的动画。
throw new Error('TODO(day3-adv-7) 未完成：见 README');

// ---- 鼠标管线（已给，demo 03 同款：NDC → 射线 → 文字平面）---------
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const textPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0); // z = 0 的字面
const mouseWorld = new THREE.Vector3();

chrome.canvas.addEventListener('pointermove', (e) => {
  const rect = chrome.canvas.getBoundingClientRect();
  pointer.set(
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    1 - ((e.clientY - rect.top) / rect.height) * 2,
  );
});
chrome.canvas.addEventListener('pointerdown', () => { repelStrength.value = 3.0; });
chrome.canvas.addEventListener('pointerup', () => { repelStrength.value = 0.55; });
chrome.canvas.addEventListener('pointerleave', () => { repelStrength.value = 0.55; });

// ---- 帧循环（已给：先 compute 后 render，中间零胶水）--------------
chrome.startLoop(() => {
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(textPlane, mouseWorld)) {
    mousePos.value.lerp(mouseWorld, 0.25); // 斥力点平滑跟随，去步进感
  }
  renderer!.compute(updateKernel); // 全池一步更新
  renderer!.render(scene, camera);  // 画刚算完的状态，同帧内零拷贝
});
