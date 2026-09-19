// Day 3 · Demo 01 —— WebGPURenderer Basic
// 对应讲义 3.1：three/webgpu 的最小可运行场景。
// 与 Day 1/2 的分水岭：不再手写 device / pipeline / bindGroup / encoder，
// WebGPURenderer 接管整条管线，main.ts 里只剩场景、相机、材质与灯。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
import * as THREE from 'three/webgpu';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空
let camera: THREE.PerspectiveCamera | null = null;
const chrome = createChrome({
  day: 3,
  index: '01',
  title: 'WEBGPU RENDERER BASIC',
  tags: ['THREE', 'WEBGPU'],
  hint: '移动鼠标：相机做轨道微视差',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  },
});

// ---- 渲染器：接管 adapter / device / context 与每帧的 pass 编排 ----
try {
  const r = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await r.init(); // 必须在首次 render 之前（无 WebGPU 时此处自动回退 WebGL2）
  renderer = r;
} catch (e) {
  chrome.fail(
    'RENDERER INIT FAILED',
    String(e),
    '检查浏览器是否支持 WebGPU（Chrome/Edge 113+）。WebGPURenderer 会自动回退 WebGL2，走到这里通常是 canvas 或上下文冲突。',
  );
  throw e;
}
renderer!.setPixelRatio(dpr);
renderer!.setSize(chrome.width / dpr, chrome.height / dpr, false);
renderer!.toneMapping = THREE.ACESFilmicToneMapping; // 高光滚降，两盏灯的层次更耐看

// 画布底色与 CSS #0B0E14 对齐。clearValue 不走 outputColorSpace 的 sRGB
// 编码、直接写工作色空间数值，因此把色值按「已是工作色空间」原样传入
renderer!.setClearColor(new THREE.Color().setHex(0x0b0e14, THREE.LinearSRGBColorSpace), 1);

// ---- 场景：旋转的 Torus + 两盏灯 ---------------------------------
const scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(42, chrome.width / chrome.height, 0.1, 40);
camera.position.set(0, 0.85, 3.4);
camera.lookAt(0, 0, 0);

const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.85, 0.32, 64, 200),
  new THREE.MeshStandardNodeMaterial({
    color: 0x4c6fff, // 电蓝：Day 3 首个 demo 的主题色
    metalness: 0.45,
    roughness: 0.22,
  }),
);
scene.add(torus);

// 主光：偏冷白的平行光，从右上打出形体
const key = new THREE.DirectionalLight(0xf4f6ff, 2.2);
key.position.set(2.5, 3, 2);
scene.add(key);

// 轮光：紫色点光，从左后勾出边缘（decay=2 物理衰减，强度按 candela 给）
const rim = new THREE.PointLight(0x8b5cf6, 30, 0, 2);
rim.position.set(-2.6, -0.6, -2.2);
scene.add(rim);

// ---- 鼠标：NDC 坐标（-1..1，y 向上）驱动相机微视差 ---------------
let mouse = [0, 0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse = [
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  ];
});

// ---- 帧循环：只剩场景更新与一次 render ---------------------------
const RADIUS = 3.4;
chrome.startLoop((nowMs) => {
  const t = nowMs / 1000;

  torus.rotation.x = 0.42 + t * 0.13;
  torus.rotation.y = t * 0.21;

  // 相机轨道：慢漂移 + 鼠标微视差（幅度克制：±0.12 / ±0.08 rad）
  const az = 0.18 * Math.sin(t * 0.12) + mouse[0] * 0.12;
  const el = 0.24 + 0.05 * Math.sin(t * 0.09) + mouse[1] * 0.08;
  const r = RADIUS + 0.05 * Math.sin(t * 0.35); // 轻微呼吸
  camera!.position.set(
    Math.sin(az) * Math.cos(el) * r,
    Math.sin(el) * r,
    Math.cos(az) * Math.cos(el) * r,
  );
  camera!.lookAt(0, 0, 0);

  renderer!.render(scene, camera);
});
