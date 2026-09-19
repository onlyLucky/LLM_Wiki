// Day 3 · 作业 basic —— TSL 波浪网格
// 对应讲义 3.2（TSL 节点着色语言）：
// 用 TSL 复刻 Day 2 demo 04 的顶点波浪（原生版 main.ts 216 行 + ocean.wgsl 97 行），
// 做完数一数行数，对比就是引擎层价值的体感论据。
// 四个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。
// 说明：three 0.186.0 的 npm 包不带类型声明，three/webgpu / three/tsl 两处导入
// 带 @ts-ignore（真实项目装 @types/three 补全，课程工程刻意不引入）。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
// @ts-ignore three 0.186.0 未附带 three/webgpu 的类型声明
import * as THREE from 'three/webgpu';
// @ts-ignore 同上：three/tsl
import {
  positionLocal, positionWorld, time, Fn, vec2, vec3,
  uniform, mix, sin, color,
} from 'three/tsl';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空

const chrome = createChrome({
  day: 3, index: 'B', title: 'TSL WAVE GRID',
  tags: ['THREE', 'TSL', 'VERTEX'],
  hint: '完成后：移动鼠标调制波浪的频率与相位',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
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

// ---- 场景骨架（几何与灯在 TODO 1 组装）----------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, chrome.width / chrome.height, 0.1, 40);
const material = new THREE.MeshStandardNodeMaterial();
// 位移后的法线按面片重算（导数法线），波浪的受光立体感靠它；
// 不开的话标准材质的光照还是平面的 (0,1,0)，画面会像一张贴图
material.flatShading = true;

// TODO(day3-basic-1): 场景组装——PlaneGeometry(6, 6, 160, 160) 的网格挂上
// material 并转平（geometry.rotateX(-Math.PI / 2)，把 y 留给波浪高度），
// 环境光 + 方向光各一盏（强度参考 0.5 / 2.0，方向光从斜上方打进画面），
// 相机定位（如 (3.4, 2.8, 4.8)，lookAt 原点），以上全部 add 进 scene。
throw new Error('TODO(day3-basic-1) 未完成：见 README');

// ---- TODO 2：顶点波浪（TSL 版的 waveField）-------------------------
// TODO(day3-basic-2): material.positionNode = Fn(() => {...})()——
// 三组不同方向的 sin 叠加出高度：主浪沿 x 低频大振幅、交叉浪沿 z 中频、
// 斜向细浪沿 (x + z) 高频小振幅（对照 Day 2 demo 04 的三组浪）。
// 返回位移后的 positionLocal：vec3(p.x, h, p.z)。频率与相位先只用 time，
// 鼠标在 TODO 4 接入。
throw new Error('TODO(day3-basic-2) 未完成：见 README');

// ---- TODO 3：高度双色 ----------------------------------------------
// TODO(day3-basic-3): material.colorNode = 按高度做双色 mix——
// 波谷深青 #0F3B3A → 波峰主白 #E8ECF4（Day 2 demo 04 的三段色带换成两段，
// TSL 里 mix 一次就够）。高度读 positionWorld.y：位移后的世界坐标
// 会自动流到片元阶段，不用像 WGSL 那样手写 varying。
throw new Error('TODO(day3-basic-3) 未完成：见 README');

// ---- TODO 4：鼠标调制 ----------------------------------------------
// TODO(day3-basic-4): uniform(vec2(0, 0)) 创建鼠标节点，监听
// chrome.canvas 的 pointermove（换算到 [-1, 1]，与 Day 2 作业同一套 NDC 换算，
// 每帧只写 .value 不重建节点图）。把鼠标 x / y 折进 TODO 2 的节点图：
// x 调主浪频率、y 调相位偏移，扰动系数克制在 0.2 以内。
throw new Error('TODO(day3-basic-4) 未完成：见 README');

// ---- 帧循环（已给全：resize 时保持相机比例）-----------------------
chrome.startLoop(() => {
  camera.aspect = chrome.width / chrome.height;
  camera.updateProjectionMatrix();
  renderer!.render(scene, camera);
});
