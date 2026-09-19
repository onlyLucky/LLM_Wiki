// Day 3 · 作业 advanced —— 粒子文字成形（参考答案）
// 对应讲义 3.3（TSL 计算与数据流）+ 3.5 工作坊组件二：
// iyO 首页的技术脊柱。文字画进离屏画布，命中的像素成为吸附目标，
// 一池粒子被弹簧拉成字、被光标推开、被噪声吹得呼吸；点击换词，
// 换的只是目标 buffer，粒子池从头到尾不换。
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
// 任务 2 写入、任务 4 的弹簧读它、任务 7 点击换词时重写它。
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

// ---- 任务 1：文字采样（CPU 侧，启动时 + 每次换词各跑一次）---------
// OffscreenCanvas 上画一次字，读回像素，命中文字的格点就是目标点集。
// 讲义 3.5 组件二的步骤 1–2；getImageData 的跨域坑本课程遇不到（无外图）。
function sampleText(word: string): Float32Array {
  const canvas = new OffscreenCanvas(CANVAS_W, CANVAS_H);
  const ctx = canvas.getContext('2d')!;
  ctx.font = FONT;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#fff'; // 只关心 alpha，颜色随意
  // 第 4 参 maxWidth 让超宽的词自动压扁，词表再长也不会画出画布被裁切
  ctx.fillText(word, CANVAS_W / 2, CANVAS_H / 2, CANVAS_W - 24);

  const data = ctx.getImageData(0, 0, CANVAS_W, CANVAS_H).data;
  const pts: number[] = [];
  for (let y = 0; y < CANVAS_H; y += SAMPLE_STEP) {
    for (let x = 0; x < CANVAS_W; x += SAMPLE_STEP) {
      if (data[(y * CANVAS_W + x) * 4 + 3] > 128) { // alpha > 128 视为命中文字
        const [wx, wy] = mapToWorld(x, y);
        pts.push(wx, wy, 0);
      }
    }
  }
  return new Float32Array(pts); // 拍平的 [x,y,z, x,y,z, ...]
}

// ---- 任务 2：目标写入 ---------------------------------------------
// 采样点数随词长变化，粒子池却是固定的 COUNT——按「第 i 颗粒子的目标 =
// 采样点[i % 采样点数]」循环分配，两边解耦。这就是 iyO「换词只换
// 目标 buffer，粒子池不换」的全部秘密。
let wordIndex = 0;

function fillTargets(word: string): void {
  const pts = sampleText(word);
  const n = pts.length / 3;
  for (let i = 0; i < COUNT; i++) {
    const src = (i % n) * 3; // 循环分配：粒子数与采样点数彻底解耦
    targetAttr.array[i * 3] = pts[src];
    targetAttr.array[i * 3 + 1] = pts[src + 1];
    targetAttr.array[i * 3 + 2] = pts[src + 2];
  }
  // storage buffer 走同样的版本号更新通道：改数组后置位即重传，
  // 节点图不用重建（讲义 3.3 的 storage 数据流）
  targetAttr.needsUpdate = true;
}
fillTargets(WORDS[wordIndex]); // 初始词（已给）

// ---- 任务 3：初始化 kernel（GPU 上算一次初值）---------------------
// 位置与速度的初值在 GPU 上算（demo 03 同款思路）：粒子从半径 9–14 的
// 球壳向内飞，入场就是「四面八方聚成一个字」的动画，不用 JS writeBuffer。
const initKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const dir = vec3(gauss(0.1), gauss(0.2), gauss(0.3)).normalize();
  // 半径 9 + 5·hash：球壳上随机散布，厚度差让入场有纵深感
  position.assign(dir.mul(float(9.0).add(hash(instanceIndex.add(0.5)).mul(5.0))));
  velocities.element(instanceIndex).assign(vec3(0, 0, 0));
})().compute(COUNT);
renderer.compute(initKernel); // 只跑这一次（renderer.init 已在上面 await）

// ---- 任务 4 + 5：更新 kernel（每帧跑，弹簧把粒子拉成字）-----------
// 力场三件套：弹簧（成形）、噪声（呼吸）、斥力（交互）。
// 帧循环消费的是这个 updateKernel（骨架已声明，这里赋值）。
let updateKernel: any = null; // TSL 节点暂无类型声明，帧循环里 compute 它

updateKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);
  const target = targets.element(instanceIndex);

  // 1) 弹簧：刚度 26 决定成形快慢（与阻尼配对——大了太快、小了发飘）
  const accel = target.sub(position).mul(26.0).toVar();

  // 2) 噪声呼吸（任务 5）：三个偏移采样合成 vec3 扰动（demo 03 的
  //    drift 同款），坐标混入 time 让场随时间流动，系数 0.5 克制——
  //    成形后的字持续轻微起伏，静止但不死板
  const nt = time.mul(0.4);
  accel.addAssign(vec3(
    mx_noise_float(position.mul(1.8).add(vec3(0.0, 0.0, nt))),
    mx_noise_float(position.mul(1.8).add(vec3(31.4, 47.2, nt))),
    mx_noise_float(position.mul(1.8).add(vec3(-12.9, 88.3, nt))),
  ).mul(0.5));

  // 3) 光标斥力（任务 5）：沿 -toMouse 方向、平方衰减——
  //    光标扫过字会犁开一道口，松开后弹簧自动把粒子拉回
  const toMouse = mousePos.sub(position);
  const dm2 = toMouse.dot(toMouse);
  accel.addAssign(toMouse.div(dm2.add(1e-4).sqrt()).negate() // 方向取反：推开
    .mul(repelStrength).div(dm2.add(0.35)));

  // 4) 半隐式欧拉 + 指数阻尼：阻尼 3.2 比 demo 03 的 1.6 强——字要停得住
  const nv = velocity.add(accel.mul(deltaTime))
    .mul(exp(float(-3.2).mul(deltaTime))).toVar();
  position.addAssign(nv.mul(deltaTime));
  velocity.assign(nv);
})().compute(COUNT);

// ---- 任务 6：渲染 -------------------------------------------------
// 速度双色：速度接近 0（已就位）主白 #E8ECF4，飞驰中亮紫 #8B5CF6——
// 成形后的字是白的，换词瞬间炸开一片紫（速度就是免费的语义通道）
const speed01 = velocities.toAttribute().length().mul(1.8).clamp(0.0, 1.0);

const material = new THREE.PointsNodeMaterial();
material.positionNode = positions.toAttribute(); // 属性通道读 storage（demo 03 同款）
material.sizeNode = float(0.03).add(speed01.mul(0.015)); // 飞驰中的粒子略大
material.colorNode = mix(color(0xe8ecf4), color(0x8b5cf6),
  smoothstep(0.05, 0.5, speed01));
material.opacityNode = smoothstep(1.0, 0.15, uv().sub(0.5).mul(2.0).length()); // 柔边圆点
material.transparent = true;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending;

// Sprite + count：一次实例化 draw 画完 12000 粒子
const particles = new THREE.Sprite(material);
particles.count = COUNT;
particles.frustumCulled = false; // 位置在 GPU 上，CPU 侧包围盒必然算错
scene.add(particles);

// ---- 任务 7：点击换词 ---------------------------------------------
// 换的只是目标 buffer：弹簧发现 target 变了，旧字的形状被揉碎、
// 同一批粒子再拉成新字——节点图与粒子池对此一无所知
chrome.canvas.addEventListener('click', () => {
  wordIndex = (wordIndex + 1) % WORDS.length;
  fillTargets(WORDS[wordIndex]);
});

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

// ---- 帧循环（已给）：先 compute 后 render，中间零胶水--------------
chrome.startLoop(() => {
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(textPlane, mouseWorld)) {
    mousePos.value.lerp(mouseWorld, 0.25); // 斥力点平滑跟随，去步进感
  }
  renderer!.compute(updateKernel); // 全池一步更新
  renderer!.render(scene, camera);  // 画刚算完的状态，同帧内零拷贝
});
