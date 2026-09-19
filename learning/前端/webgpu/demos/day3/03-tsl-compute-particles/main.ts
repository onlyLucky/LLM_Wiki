// Day 3 · Demo 03 —— TSL COMPUTE PARTICLES
// 对应讲义 3.3：TSL 计算与数据流。两万粒子的星系，
// 与 Day 2 demo 06 同一套物理（噪声 + 涡旋 + 引力井），
// 但 buffer / 管线 / 绑定组 / 数学库全部交给节点系统。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
import * as THREE from 'three/webgpu';
import {
  Fn, storage, instanceIndex, uniform, vec2, vec3, float, time,
  hash, mx_noise_float, mix, color, smoothstep, exp, If, uv,
} from 'three/tsl';

// ---- chrome 整合模式（Day 3 统一照抄） ---------------------------
// onResize 首次触发早于 renderer 构造，两个引用都必须判空/先建
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null;
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

const chrome = createChrome({
  day: 3,
  index: '03',
  title: 'TSL COMPUTE PARTICLES',
  tags: ['THREE', 'TSL', 'COMPUTE'],
  hint: '移动鼠标在星系平面形成引力井，按住引力更强',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  },
});

try {
  renderer = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await renderer.init(); // 必须在首次 compute / render 之前
} catch (e) {
  chrome.fail(
    'RENDERER INIT FAILED',
    String(e),
    '检查浏览器是否支持 WebGPU（Chrome/Edge 113+）。WebGPURenderer 会自动回退 WebGL2，走到这里通常是 canvas 或上下文冲突。'
  );
  throw e;
}
renderer.setPixelRatio(dpr);
renderer.setSize(chrome.width / dpr, chrome.height / dpr, false);

// ---- 粒子状态：两块 storage，全程待在显存 ------------------------
// Day 2 要手写 GPUBuffer + 32 字节 struct + std430 对齐账；这里
// StorageInstancedBufferAttribute(COUNT, 3) 一行一块，vec3 的布局
// 由节点系统替你算——「vec3f 按 16 字节对齐」的坑从源头消失。
const COUNT = 20480;
const positionBuffer = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const velocityBuffer = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const positions = storage(positionBuffer, 'vec3', COUNT);
const velocities = storage(velocityBuffer, 'vec3', COUNT);

// 模拟参数：uniform 节点，JS 侧改 .value 即可，绑定组由节点系统管理
const dt = uniform(1 / 60); // 秒，帧循环里写入
const mousePos = uniform(new THREE.Vector3(0, 0, 0)); // 星系平面上的世界坐标
const pullStrength = uniform(0.18); // 悬停弱吸引，按住抬到 1.8

// 三个均匀随机数相加减 1.5：便宜的近似高斯（Day 2 在 JS 侧用的同款技巧）
const gauss = (offset: number) =>
  hash(instanceIndex.add(offset))
    .add(hash(instanceIndex.add(offset + 0.37)))
    .add(hash(instanceIndex.add(offset + 0.71)))
    .sub(1.5);

// ---- 初始化 kernel：三旋臂星系盘，只在启动时跑一次 --------------
// Day 2 的初始布局在 JS 里算好再 writeBuffer；这里 GPU 一次跑完，
// JS 从此不碰这块 buffer。
const initKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);

  // 半径 0.62 次幂：内密外疏；theta 沿臂展开 + 高斯散布
  const r = hash(instanceIndex).pow(0.62).mul(1.75).add(0.05);
  const theta = float(instanceIndex.mod(3)).mul((Math.PI * 2) / 3)
    .add(r.mul(2.2))
    .add(gauss(0.10).mul(0.16));

  position.assign(vec3(
    theta.cos().mul(r).add(gauss(0.20).mul(0.05)),
    gauss(0.30).mul(0.045),
    theta.sin().mul(r).add(gauss(0.40).mul(0.05)),
  ));

  // 开普勒式切向初速度：近快远慢，画面一开始就在转
  const vOrb = float(0.5).div(r.add(0.12).sqrt());
  velocity.assign(vec3(
    theta.sin().negate().mul(vOrb),
    0,
    theta.cos().mul(vOrb),
  ));
})().compute(COUNT); // compute(COUNT)：生成 ComputeNode，越界 guard 自动加

// ---- 更新 kernel：每帧跑，四段力场与 Day 2 逐行对应 --------------
const updateKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);

  // 1) 噪声场：三次偏移采样合成流动扰动
  //    Day 2 为此手抄了 80 行 simplex WGSL；节点库的 mx_noise_float 一行一个
  const np = position.mul(0.85);
  const nt = time.mul(0.18);
  const drift = vec3(
    mx_noise_float(np.add(vec3(0.0, 0.0, nt))),
    mx_noise_float(np.add(vec3(31.4, 47.2, nt))),
    mx_noise_float(np.add(vec3(-12.9, 88.3, nt))),
  ).mul(0.4);

  // 2) 星系涡旋：切向推进（近快远慢）+ 向心束缚 + 压回薄盘
  const r = vec2(position.x, position.z).length().add(1e-4);
  const tangent = vec3(position.z.negate(), 0.0, position.x).div(r);
  const radial = vec3(position.x.negate(), 0.0, position.z.negate()).div(r);
  const accel = drift.toVar(); // toVar：着色器里的可变局部量，后续 addAssign 就地累加
  accel.addAssign(tangent.mul(0.55).div(r.add(0.3)));
  accel.addAssign(radial.mul(0.45).div(r.mul(r).add(0.35)));
  accel.addAssign(vec3(0.0, position.y.mul(-1.1), 0.0));

  // 3) 鼠标引力井：平方衰减，力度由 JS 侧 uniform 控制
  const toMouse = mousePos.sub(position);
  const dm2 = toMouse.dot(toMouse);
  const pull = pullStrength.div(dm2.add(0.30));
  accel.addAssign(toMouse.div(dm2.add(1e-4).sqrt()).mul(pull));

  // 4) 半隐式欧拉 + 指数阻尼 + 限速：与 Day 2 的积分器完全一致
  const nv = velocity.add(accel.mul(dt)).mul(exp(float(-1.6).mul(dt))).toVar();
  const sp = nv.length().toVar();
  If(sp.greaterThan(2.4), () => {
    nv.mulAssign(float(2.4).div(sp));
  });
  position.addAssign(nv.mul(dt));
  velocity.assign(nv);
})().compute(COUNT);

// ---- 渲染：storage 直接喂顶点，材质只描述「长什么样」 ------------
// toAttribute()：渲染管线把这块 buffer 当实例属性读。若直接把
// storage 节点给 positionNode，顶点阶段就是 storage 读取，要额外
// 申请 maxStorageBuffersInVertexStage；toAttribute 走属性通道，无此限制。
const speed01 = velocities.toAttribute().length().mul(0.5).clamp(0.0, 1.0);

const material = new THREE.PointsNodeMaterial();
material.positionNode = positions.toAttribute(); // 粒子去哪，storage 说了算
material.sizeNode = float(0.05).add(speed01.mul(0.04)); // 快的粒子略大
material.colorNode = mix(
  mix(color(0x0F0A1E), color(0x8B5CF6), smoothstep(0.0, 0.5, speed01)), // 深空紫 → 主题紫
  color(0xE8ECF4), // 高速段提亮到主白
  smoothstep(0.55, 1.0, speed01),
);
// 柔边圆点：公式与 Day 2 render.wgsl 的 fs 相同，现在是材质上的一行
material.opacityNode = smoothstep(1.0, 0.15, uv().sub(0.5).mul(2.0).length());
material.transparent = true;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending; // 星星叠星星，天然辉光

// Sprite + count：一次实例化 draw 画完两万粒子
// （WebGPU 的 point 恒 1 像素，Day 2 手写 6 顶点 quad，Day 3 交给材质）
const particles = new THREE.Sprite(material);
particles.count = COUNT;
particles.frustumCulled = false; // 位置在 GPU 上，CPU 侧包围盒必然算错

const scene = new THREE.Scene();
scene.add(particles);

// 初始化只跑一次（renderer.init 已在上面 await）
renderer.compute(initKernel);

// ---- 鼠标：Raycaster 打到星系平面 -------------------------------
// Day 2 为此手写了 ndcToPlane（射线求交 + 视场半角）约 30 行
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2();
const galaxyPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0
const mouseTarget = new THREE.Vector3(0, 0, 0);
let mouseNdc: [number, number] = [0, 0];

chrome.canvas.addEventListener('pointermove', (e) => {
  const rect = chrome.canvas.getBoundingClientRect();
  mouseNdc = [
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    1 - ((e.clientY - rect.top) / rect.height) * 2,
  ];
  pointer.set(mouseNdc[0], mouseNdc[1]);
});
chrome.canvas.addEventListener('pointerdown', () => { pullStrength.value = 1.8; });
chrome.canvas.addEventListener('pointerup', () => { pullStrength.value = 0.18; });
chrome.canvas.addEventListener('pointerleave', () => { pullStrength.value = 0.18; });

// ---- 帧循环：先 compute 后 render，中间零胶水 --------------------
const start = performance.now();
let last = start;

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  dt.value = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  // 相机：缓慢漂移 + 鼠标视差（幅度克制）
  const az = -0.25 + 0.18 * Math.sin(t * 0.06) + mouseNdc[0] * 0.2;
  const el = 0.62 + mouseNdc[1] * 0.12;
  camera.position.set(
    Math.sin(az) * Math.cos(el) * 3.8,
    Math.sin(el) * 3.8,
    Math.cos(az) * Math.cos(el) * 3.8,
  );
  camera.lookAt(0, 0.05, 0);

  // 鼠标世界坐标：射线与星系平面求交，平滑跟随
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(galaxyPlane, mouseTarget)) {
    mousePos.value.lerp(mouseTarget, 0.2);
  }

  renderer!.compute(updateKernel); // 两万粒子一步更新
  renderer!.render(scene, camera); // 画刚算完的状态，同帧内零拷贝
});
