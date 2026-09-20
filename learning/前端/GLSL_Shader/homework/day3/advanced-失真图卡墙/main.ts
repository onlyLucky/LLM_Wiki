// Day 3 · 作业 A —— 失真图卡墙
// 对应讲义 3.2：纹理失真 + hover 状态机 + RGB shift + 视差——「作品集项目的 hero 模块」。
// 完成后：3×1 图卡墙，hover 单卡波纹失真 + 色散，卡间视差层次。
// TODO 分布：TODO(day3-adv-1) 通读场景段（已就位）；TODO(day3-adv-2) hover 状态机；
//           TODO(day3-adv-3)(adv-4) fragment 波纹 / 色散；TODO(day3-adv-5) 三卡视差。

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
  tags: ['HOMEWORK', 'THREE', 'TEXTURE'],
  hint: 'hover 任意图卡：波纹从光标扩散',
  onResize: syncSize,
});

// ---- TODO(day3-adv-1)：三张图卡 + 各自 TextureLoader 材质（已就位，通读一遍）----
// 占位图在 public/（换图只改 CARDS 的 src）；plane 严格 4:5 从根上避开拉伸坑。
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
  origX: number;        // 原始位置（视差不改它，避免换算反馈）
  hover: number;        // 渐进强度 0→1
  hovered: boolean;     // 当下是否 hover
  t0: number;           // 波纹起点时刻（enter 瞬间记录）
  leaveT: number;       // 离开时刻（回零曲线用）
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
  return { mesh, mat, origX: x, hover: 0, hovered: false, t0: -1, leaveT: -1 };
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

// ---- DOM 页头（视差层次的一员，TODO(day3-adv-5) 让它动起来）----
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

// ---- 光标 → 世界坐标（脚手架：chrome 的 nx/ny 已归一且 y 翻转左下原点）----
function cursorWorld(): { x: number; y: number } {
  const p = chrome.pointer;
  const t = Math.tan((camera.fov / 2) * Math.PI / 180);
  const visH = 2 * t * camera.position.z;
  return { x: (p.nx * 2 - 1) * (visH * camera.aspect) / 2, y: (p.ny * 2 - 1) * visH / 2 };
}

chrome.startLoop((now) => {
  const s = now / 1000;
  const cw = cursorWorld();

  for (const c of cards) {
    // 光标 → 该卡局部 uv（0–1）。用 origX 换算——视差不参与，避免反馈
    const mu = (cw.x - c.origX) / 2 + 0.5;
    const mv = cw.y / 2.5 + 0.5;
    c.mat.uniforms.u_mouse.value.set(mu, mv);
    c.mat.uniforms.u_time.value = s;

    // TODO(day3-adv-2)：hover 状态机（DOM mouseenter 的等价数学判定）+ 0→1 lerp
    //   1) inside = mu/mv 落在 [0,1]²（等价于该卡的 mouseenter，不用 raycaster）
    //   2) enter 瞬间：c.hovered = true; c.t0 = s;（波纹从此刻扩散）
    //   3) 离开：c.hovered = false; c.leaveT = s;
    //   4) 上升段 lerp 0.08；下降段 0.6s easeOutQuint 回零（提示档三有写法）
    //   5) u_ripple：enter 后 0.8s easeOutCubic 扩到 0.9；离开后保持不再扩张
    //      （demo 02 同款：pr = min((s - t0) / 0.8, 1); ripple = (1 - pow(1 - pr, 3)) * 0.9）
    c.mat.uniforms.u_hover.value = 0; // 占位：替换成状态机输出

    // TODO(day3-adv-5)：三卡视差 + 页头
    //   chrome 的 sx/sy 已内置 0.08 阻尼，偏移量 ox = p.sx - 0.5, oy = p.sy - 0.5；
    //   中卡 mesh.position.x = origX + ox * 0.05（uv 幅度 5% → 世界坐标乘卡宽 2）；
    //   左右卡系数 -0.03（反向）——速度差就是层次（3.2 三层视差段）；
    //   页头反向 -3%：title.style.transform = translate3d(...)，参考 demo 02。
  }

  renderer!.render(scene, camera);
});
