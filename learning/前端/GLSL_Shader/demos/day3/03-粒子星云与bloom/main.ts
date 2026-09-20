// Day 3 · Demo 03 —— 粒子星云与bloom：Day 2 全部知识的 3D 汇报演出（3.4 + 3.5 讲义蓝本）
import '../../../shared/demo.css';
import * as THREE from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

// ---- 场景：透视相机盯住原点星云 ----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.z = 3.6; // 半高约 1.5：核心结构全在画面，外缘自然溢出

// ---- 几何：两万粒子，球壳偏内分布（出生位一次性生成、永不更新）----
const N = 20000;
const positions = new Float32Array(N * 3);
for (let i = 0; i < N; i++) {
  const dir = new THREE.Vector3().randomDirection();
  const r = 0.55 + Math.pow(Math.random(), 2.2) * 0.65; // 中心密外围疏，给配色打底
  positions.set([dir.x * r, dir.y * r, dir.z * r], i * 3);
}
const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

// ---- 材质：additive + depthWrite:false 成对出现，缺一个星云就出黑框 ----
const material = new THREE.ShaderMaterial({
  vertexShader: vsSource,
  fragmentShader: fsSource,
  transparent: true,
  blending: THREE.AdditiveBlending, // 叠加发光：密度自己画亮核心，不需要光源
  depthWrite: false,                // 配套纪律：粒子不写深度，发光体互相不遮挡
  uniforms: {
    u_time: { value: 0 },
    u_amp: { value: 0.18 },                        // 噪声位移幅度
    u_size: { value: 0.03 },                       // 基准尺寸（距离 300 处的像素直径）
    u_mouse3: { value: new THREE.Vector2(0, 0) },  // 光标在 z=0 平面的世界坐标
    u_push: { value: 0 },                          // 避让强度，lerp 渐进 0→0.3
    u_colorA: { value: new THREE.Color('#FF4D6D') }, // 玫红核心
    u_colorB: { value: new THREE.Color('#4CC9F0') }, // 天青外围
  },
});
scene.add(new THREE.Points(geometry, material));

// ---- chrome：canvas + 顶栏 + 四角标注 + 帧循环 ----
let renderer: THREE.WebGLRenderer | null = null;
let composer: EffectComposer | null = null;

function syncSize(w: number, h: number) {
  if (!renderer || !composer) return; // chrome 首次 applySize 早于 renderer 创建
  renderer.setSize(w, h, false);
  composer.setSize(w, h); // composer 有独立缓冲，必须与 renderer 同步（坑表第 1 行）
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

const chrome = createChrome({
  day: 3, index: '03', title: 'PARTICLE NEBULA', tags: ['POINTS', 'NOISE', 'BLOOM'],
  hint: '拖动鼠标：星云被搅开又自然回流', onResize: syncSize,
});

renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1);        // chrome 已按 DPR≤2 设物理像素
renderer.setClearColor(0x0b0e14);

// ---- 后期链：组装顺序即数据流向（底片 → 加工 → 印片）----
composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

// bloom 三参数手感：strength 强度 / radius 柔度 / threshold 门槛（卡 0.3–0.4）
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(chrome.width, chrome.height), 1.2, 0.6, 0.35);
composer.addPass(bloomPass);

// 配方 ShaderPass：2.8 配方卡迁移，tDiffuse 就是「上一道工序的画面」
// 只做 grain + vignette——gamma 步删掉，交给 OutputPass（否则双重校正）
const gradePass = new ShaderPass({
  uniforms: { tDiffuse: { value: null }, u_time: { value: 0 } },
  vertexShader: `varying vec2 v_uv;
    void main() { v_uv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: `
    varying vec2 v_uv;
    uniform sampler2D tDiffuse; // ShaderPass 的接力棒：上一道工序的画面，three 不代声明
    uniform float u_time;
    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123); }
    void main() {
      vec3 col = texture2D(tDiffuse, v_uv).rgb;
      col *= 1.0 - 0.2 * pow(length(v_uv - 0.5) * 1.4, 2.0);           // vignette 20%
      col += (hash(v_uv * 917.0 + fract(u_time) * 61.7) - 0.5) * 0.06; // grain ±3%
      gl_FragColor = vec4(col, 1.0);
    }`,
});
composer.addPass(gradePass);
composer.addPass(new OutputPass()); // 0.186 的 sRGB 输出 + 色调映射，链尾一句收口

syncSize(chrome.width, chrome.height);

// ---- 避让的渐进：光标进入画布才推、离开即收，lerp 0.08 渐进不是开关 ----
let pushTarget = 0;
chrome.canvas.addEventListener('pointerenter', () => { pushTarget = 1; });
chrome.canvas.addEventListener('pointerleave', () => { pushTarget = 0; });
const mouseAim = new THREE.Vector2(0, 0);  // 光标世界坐标目标
const mouseNow = new THREE.Vector2(0, 0);  // lerp 后进 shader（enter 瞬间不跳变）

// ---- 背景水印：低透明度大字，只占氛围不抢主角 ----
const style = document.createElement('style');
style.textContent = `
  .d3-bgword { position: fixed; left: 0; right: 0; bottom: 4%; text-align: center; z-index: 1;
    font: 900 clamp(56px, 11vw, 150px)/1 "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.22em; color: rgba(76,201,240,0.06); pointer-events: none; }
`;
document.head.appendChild(style);
const bgWord = document.createElement('div');
bgWord.className = 'd3-bgword';
bgWord.textContent = 'NEBULA';
document.body.appendChild(bgWord);

// ---- 帧循环：三个 uniform 更新 + composer.render() 收工 ----
chrome.startLoop((now) => {
  const s = now / 1000;
  const p = chrome.pointer;

  // 光标（nx/ny 归一 0–1 左下原点）→ z=0 平面的世界坐标
  const t = Math.tan((camera.fov / 2) * Math.PI / 180);
  const visH = 2 * t * camera.position.z;
  mouseAim.set((p.nx * 2 - 1) * (visH * camera.aspect) / 2, (p.ny * 2 - 1) * visH / 2);
  mouseNow.lerp(mouseAim, 0.1);

  const push = material.uniforms.u_push.value as number;
  material.uniforms.u_push.value = push + (pushTarget * 0.3 - push) * 0.08;
  material.uniforms.u_mouse3.value.copy(mouseNow);
  material.uniforms.u_time.value = s;
  gradePass.uniforms.u_time.value = s;

  composer!.render(); // 帧循环里 composer.render() 收工，不再直接调 renderer.render
});
