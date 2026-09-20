// Day 3 · 作业 B —— 渐变海报平面
// 对应讲义 3.1：ShaderMaterial 最小闭环——原生 WebGL 的「五件套」在 three 里各归其位。
// 完成后：满屏两色对角渐变，随时间呼吸，鼠标轻微视差——「迁移热身」。
// TODO 分布：TODO(day3-basic-1) 通读下方场景段（已就位）；TODO(day3-basic-4) 帧循环；
//           TODO(day3-basic-2) vertex.glsl；TODO(day3-basic-3) fragment.glsl。

import '../../../shared/demo.css';
import * as THREE from 'three';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

// 声明先于 createChrome：onResize 回调在 createChrome 内同步执行，立刻就会读 renderer
let renderer: THREE.WebGLRenderer | null = null;

const chrome = createChrome({
  day: 3,
  index: 'B',
  title: 'GRADIENT POSTER',
  tags: ['HOMEWORK', 'THREE', 'GRADIENT'],
  hint: '对角渐变 + 呼吸 + 视差',
  onResize: syncSize,
});

// ---- TODO(day3-basic-1)：three 五件套搭场景（已就位，通读一遍再动 shader）----
// 对照 1.6：原生 WebGL 的 buffer / 编译 / link 全部消失，五件套各归其位——
//   Scene（舞台）/ PerspectiveCamera（机位）/ PlaneGeometry（演员）
//   / ShaderMaterial（皮肤）/ WebGLRenderer（放映机）。
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.z = 2.4;

// 背景板思路：plane 足够大（6×7.5），任一窗口纵横比都满屏不露底
const material = new THREE.ShaderMaterial({
  vertexShader: vsSource,
  fragmentShader: fsSource,
  uniforms: {
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) }, // 归一 0–1，左下原点
    u_colorA: { value: new THREE.Color('#1B2140') }, // 深蓝夜
    u_colorB: { value: new THREE.Color('#FF4D6D') }, // 玫红
  },
});
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(6, 7.5), material));

function syncSize(w: number, h: number) {
  if (!renderer) return; // chrome 首次 applySize 早于 renderer 创建
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1); // chrome 已按 DPR≤2 设物理像素
renderer.setClearColor(0x0b0e14);
syncSize(chrome.width, chrome.height);

// ---- 帧循环 ----
chrome.startLoop((now) => {
  const s = now / 1000;
  const p = chrome.pointer;

  // TODO(day3-basic-4)：uniforms 接 u_time / u_mouse
  // chrome 已替你踩平两个老坑：
  //   u_time 用秒（now / 1000）；
  //   u_mouse 用 p.nx / p.ny——归一 0–1 且 y 已翻转成左下原点。
  // 1.7 的 DPR 与 y 翻转在 three 里没有消失，只是换了住处：
  //   DPR 进了 setPixelRatio(1) 的物理像素画布，y 翻转在 chrome 的 pointer 里。
  // 写法：
  //   material.uniforms.u_time.value = s;
  //   material.uniforms.u_mouse.value.set(p.nx, p.ny);

  renderer!.render(scene, camera);
});
