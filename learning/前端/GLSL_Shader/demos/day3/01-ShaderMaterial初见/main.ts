// Day 3 · Demo 01 —— ShaderMaterial 初见：Day 2 徽章迁入 three（行数对账表见 README）
import '../../../shared/demo.css';
import * as THREE from 'three';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

const scene = new THREE.Scene();
const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1); // 正交 + 全屏平面 = three 版「全屏四边形」
const material = new THREE.ShaderMaterial({
  vertexShader: vsSource, fragmentShader: fsSource,
  uniforms: {
    u_time: { value: 0 },
    u_resolution: { value: new THREE.Vector2(1, 1) },
    u_parallax: { value: new THREE.Vector2(0, 0) }, // 视差偏移，TS 侧 lerp 后写入
  },
});
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

let renderer: THREE.WebGLRenderer | null = null;
function syncSize(w: number, h: number) {
  if (!renderer) return; // chrome 首次 applySize 早于 renderer 创建，跳过
  renderer.setSize(w, h, false); material.uniforms.u_resolution.value.set(w, h); // 物理像素直写
}

const chrome = createChrome({
  day: 3, index: '01', title: 'SHADERMATERIAL', tags: ['THREE', 'GLSL', 'MIGRATE'],
  hint: '移动鼠标：徽章视差跟随', onResize: syncSize,
});
renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1); syncSize(chrome.width, chrome.height); // chrome 已把画布设为物理像素

// 视差 3% + lerp 0.08（awwwards 手感默认档）；uniform 每帧写入后渲染
let px = 0, py = 0;
chrome.startLoop((now) => {
  px += ((chrome.pointer.sx - 0.5) * 0.06 - px) * 0.08;
  py += ((chrome.pointer.sy - 0.5) * 0.06 - py) * 0.08;
  material.uniforms.u_time.value = now / 1000;
  material.uniforms.u_parallax.value.set(px, py);
  renderer!.render(scene, camera);
});
