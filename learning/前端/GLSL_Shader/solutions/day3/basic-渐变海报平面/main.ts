// Day 3 · 作业 B 答案 —— 渐变海报平面
// 对应讲义 3.1：ShaderMaterial 最小闭环。与 homework 骨架的差异只在
// vertex.glsl / fragment.glsl 的补全与 main.ts 帧循环两行接线。

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
  tags: ['ANSWER', 'THREE', 'GRADIENT'],
  hint: '对角渐变 + 呼吸 + 视差',
  onResize: syncSize,
});

// ---- three 五件套（与骨架逐字一致）------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.z = 2.4;

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
  if (!renderer) return;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1);
renderer.setClearColor(0x0b0e14);
syncSize(chrome.width, chrome.height);

// ---- 帧循环（答案：uniforms 接线两行）--------------------------
chrome.startLoop((now) => {
  const s = now / 1000;
  const p = chrome.pointer;

  material.uniforms.u_time.value = s;
  material.uniforms.u_mouse.value.set(p.nx, p.ny);

  renderer!.render(scene, camera);
});
