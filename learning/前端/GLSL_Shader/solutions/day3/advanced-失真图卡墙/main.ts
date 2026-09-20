// Day 3 · 作业 A · 答案 —— 失真图卡墙
// 与 homework 骨架逐字对齐；差异只有三处：TODO(day3-adv-2) hover 状态机、
// TODO(day3-adv-5) 三卡视差在本文件补全，波纹 / 色散 / 描边 glow 在 fragment.glsl。
// Card 类型新增一个 hoverAtLeave 字段——下降曲线必须从「离开瞬间的值」起算。

import '../../../shared/demo.css';
import * as THREE from 'three';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

// 声明先于 createChrome：onResize 回调在 createChrome 内同步执行，立刻就会读 renderer
let renderer: THREE.WebGLRenderer | null = null;

const chrome = createChrome({
  day: 3,
  index: 'A',
  title: 'GALLERY WALL',
  tags: ['ANSWER', 'THREE', 'TEXTURE'],
  hint: 'hover 任意图卡：波纹从光标扩散',
  onResize: syncSize,
});

// ---- 三张图卡 + 各自 TextureLoader 材质（与骨架逐字一致）--------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.z = 6.0;

const loader = new THREE.TextureLoader();
const CARDS = [
  { src: './public/card-1.svg', x: -2.9 },
  { src: './public/card-2.svg', x: 0 },
  { src: './public/card-3.svg', x: 2.9 },
];

type Card = {
  mesh: THREE.Mesh;
  mat: THREE.ShaderMaterial;
  origX: number;        // 原始位置（视差与光标判定都基于它，避免换算反馈）
  hover: number;        // 渐进强度 0→1
  hovered: boolean;     // 当下是否 hover
  t0: number;           // 波纹起点时刻（enter 瞬间记录）
  leaveT: number;       // 离开时刻（回零曲线用）
  hoverAtLeave: number; // 答案新增：离开瞬间的强度，下降曲线从这个值起算
};
const cards: Card[] = CARDS.map(({ src, x }) => {
  const tex = loader.load(src);
  tex.colorSpace = THREE.SRGBColorSpace; // 照片类贴图必设，否则发灰
  const mat = new THREE.ShaderMaterial({
    vertexShader: vsSource,
    fragmentShader: fsSource,
    uniforms: {
      u_tex: { value: tex },
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0.5, 0.5) }, // 该卡局部 uv（0–1）
      u_hover: { value: 0 },   // 渐进强度，不是开关
      u_ripple: { value: 0 },  // 波纹半径，JS easeOutCubic 驱动
    },
  });
  const mesh = new THREE.Mesh(new THREE.PlaneGeometry(2, 2.5), mat); // 严格 4:5
  mesh.position.x = x;
  scene.add(mesh);
  return { mesh, mat, origX: x, hover: 0, hovered: false, t0: -1, leaveT: -1, hoverAtLeave: 0 };
});

function syncSize(w: number, h: number) {
  if (!renderer) return; // chrome 首次 applySize 早于 renderer 创建
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1);
renderer.setClearColor(0x0b0e14);
syncSize(chrome.width, chrome.height);

// ---- DOM 页头（与骨架逐字一致）--------------------------------
const style = document.createElement('style');
style.textContent = `
  .hw-title { position: fixed; left: 0; right: 0; top: 6%; text-align: center; z-index: 1;
    font: 300 clamp(13px, 1.4vw, 18px)/1.5 "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.5em; color: rgba(242,245,250,0.55); pointer-events: none; }
`;
document.head.appendChild(style);
const title = document.createElement('div');
title.className = 'hw-title';
title.textContent = 'SELECTED WORKS';
document.body.appendChild(title);

// ---- 光标 → 世界坐标（与骨架逐字一致）--------------------------
function cursorWorld(): { x: number; y: number } {
  const p = chrome.pointer;
  const t = Math.tan((camera.fov / 2) * Math.PI / 180);
  const visH = 2 * t * camera.position.z;
  return { x: (p.nx * 2 - 1) * (visH * camera.aspect) / 2, y: (p.ny * 2 - 1) * visH / 2 };
}

chrome.startLoop((now) => {
  const s = now / 1000;
  const cw = cursorWorld();

  // 视差输入：chrome 的 sx/sy 已内置 0.08 阻尼，循环外换算一次三处共用
  const ox = chrome.pointer.sx - 0.5;
  const oy = chrome.pointer.sy - 0.5;

  for (const c of cards) {
    // 光标 → 该卡局部 uv（0–1）。用 origX 换算——视差不参与，避免反馈
    const mu = (cw.x - c.origX) / 2 + 0.5;
    const mv = cw.y / 2.5 + 0.5;
    c.mat.uniforms.u_mouse.value.set(mu, mv);
    c.mat.uniforms.u_time.value = s;

    // TODO(day3-adv-2) ✔ hover 状态机：数学矩形判定，等价 DOM mouseenter
    const inside = mu >= 0 && mu <= 1 && mv >= 0 && mv <= 1;
    if (inside && !c.hovered) { c.hovered = true; c.t0 = s; } // enter：波纹从此刻扩散
    if (!inside && c.hovered) {
      c.hovered = false;
      c.leaveT = s;
      c.hoverAtLeave = c.hover; // 下降曲线的起点是「离开瞬间的值」
    }

    // 双段手感：上升 lerp 0.08 跟手；下降 0.6s easeOutQuint 镜像，先快后极缓地停
    if (c.hovered) {
      c.hover += (1 - c.hover) * 0.08;
    } else if (c.leaveT >= 0) {
      const q = Math.min((s - c.leaveT) / 0.6, 1);
      c.hover = c.hoverAtLeave * Math.pow(1 - q, 5); // (1-q)^5 = 1 - easeOutQuint
      if (q >= 1) c.leaveT = -1;
    }
    c.mat.uniforms.u_hover.value = c.hover;

    // 波纹半径：enter 后 0.8s easeOutCubic 扩到 0.9；离开后保持不再扩张
    if (c.t0 >= 0) {
      const pr = Math.min((s - c.t0) / 0.8, 1);
      c.mat.uniforms.u_ripple.value = (1 - Math.pow(1 - pr, 3)) * 0.9;
    }

    // TODO(day3-adv-5) ✔ 三卡视差：中卡 +5%、左右卡 -3% 反向（同一输入 ox）
    // uv 幅度 → 世界坐标乘卡宽 2；par 的符号就是方向，速度差就是层次
    const par = c.origX === 0 ? 0.05 : -0.03;
    c.mesh.position.x = c.origX + ox * par * 2;
  }

  // 页头 -3% 反向：与卡组速度不同，三层视差才立得起来（3.2 三层视差段）
  title.style.transform =
    `translate3d(${(-ox * 6).toFixed(3)}vw, ${(oy * 3).toFixed(3)}vw, 0)`;

  renderer!.render(scene, camera);
});
