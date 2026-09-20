// Day 3 · Demo 02 —— hover 失真图卡：波纹从光标扩散（3.2 讲义 How 段的蓝本）
import '../../../shared/demo.css';
import * as THREE from 'three';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';

// ---- 程序化海报：1024×1280 严格 4:5，离屏 canvas 直出（不引外床）----
function makePoster(): HTMLCanvasElement {
  const c = document.createElement('canvas');
  c.width = 1024; c.height = 1280;
  const g = c.getContext('2d')!;
  const sky = g.createLinearGradient(0, 0, 0, 1280);       // 夜空底
  sky.addColorStop(0, '#1B2140');
  sky.addColorStop(0.55, '#2A1B3D');
  sky.addColorStop(1, '#0E1020');
  g.fillStyle = sky; g.fillRect(0, 0, 1024, 1280);
  const halo = g.createRadialGradient(760, 320, 30, 760, 320, 260); // 月亮光晕
  halo.addColorStop(0, 'rgba(120,200,255,0.55)');
  halo.addColorStop(1, 'rgba(120,200,255,0)');
  g.fillStyle = halo; g.fillRect(0, 0, 1024, 1280);
  g.fillStyle = '#DFF3FF';
  g.beginPath(); g.arc(760, 320, 92, 0, Math.PI * 2); g.fill();
  for (let i = 0; i < 240; i++) {                          // 星点
    g.fillStyle = `rgba(255,255,255,${0.15 + Math.random() * 0.5})`;
    g.fillRect(Math.random() * 1024, Math.random() * 820, 2, 2);
  }
  const ridge = (base: number, amp: number, color: string) => { // 山脊两层
    g.fillStyle = color; g.beginPath(); g.moveTo(0, 1280);
    for (let x = 0; x <= 1024; x += 16) {
      g.lineTo(x, base + Math.sin(x * 0.004 + base) * amp + Math.sin(x * 0.013 + base * 2) * amp * 0.4);
    }
    g.lineTo(1024, 1280); g.closePath(); g.fill();
  };
  ridge(880, 90, '#131627');
  ridge(1010, 70, '#0A0C16');
  g.fillStyle = '#F2F5FA';                                 // 大标题（失真时字缘最出戏）
  g.font = '700 118px "Helvetica Neue", Arial, sans-serif';
  g.fillText('NEBULA', 96, 620);
  g.fillStyle = 'rgba(242,245,250,0.55)';
  g.font = '400 34px "Helvetica Neue", Arial, sans-serif';
  g.fillText('HOVER · RIPPLE · SHIFT', 96, 690);
  g.fillRect(96, 730, 220, 4);
  return c;
}

// ---- 场景：透视相机 + 4:5 图卡（plane 尺寸按图片比例定，从根上避开拉伸坑）----
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);

const texture = new THREE.CanvasTexture(makePoster());
texture.colorSpace = THREE.SRGBColorSpace; // 照片类贴图必设，0.152+ 默认按线性处理会发灰

const material = new THREE.ShaderMaterial({
  vertexShader: vsSource,
  fragmentShader: fsSource,
  uniforms: {
    u_tex: { value: texture },
    u_time: { value: 0 },
    u_mouse: { value: new THREE.Vector2(0.5, 0.5) },  // 图卡局部 uv（0–1）
    u_hover: { value: 0 },                            // 渐进强度 0→1，不是开关
    u_ripple: { value: 0 },                           // 波纹半径，JS easeOutCubic 驱动
    u_parallax: { value: new THREE.Vector2(0, 0) },   // 内容视差（图卡局部 uv 单位）
  },
});
scene.add(new THREE.Mesh(new THREE.PlaneGeometry(3, 3.75), material)); // 严格 4:5

let renderer: THREE.WebGLRenderer | null = null;
// fov 45 下图卡长边占视口 72%：z 由视口反推（窄屏按宽算）
function fitCamera() {
  camera.aspect = chrome.width / chrome.height;
  const t = Math.tan((camera.fov / 2) * Math.PI / 180);
  const FIT = 0.72;
  camera.position.z = Math.max((3.75 / FIT / 2) / t, (3 / FIT / 2) / (t * camera.aspect));
  camera.updateProjectionMatrix();
}
function syncSize(w: number, h: number) {
  if (!renderer) return; // chrome 首次 applySize 早于 renderer 创建
  renderer.setSize(w, h, false);
  fitCamera();
}

const chrome = createChrome({
  day: 3, index: '02', title: 'HOVER DISTORT', tags: ['THREE', 'TEXTURE', 'INTERACTION'],
  hint: '悬停图卡：波纹从光标扩散', onResize: syncSize,
});
renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1);           // chrome 已按 DPR≤2 设物理像素
renderer.setClearColor(0x0b0e14);    // 图卡外的环境即 BG
texture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // 斜视角清晰度，一行别省
syncSize(chrome.width, chrome.height);

// ---- 三层视差的 DOM 两层：页头标题 -3%、底部水印 +2%（图卡内容 +5% 在 shader）----
const style = document.createElement('style');
style.textContent = `
  .d3-title { position: fixed; left: 0; right: 0; top: 7%; text-align: center; z-index: 1;
    font: 300 clamp(14px, 1.5vw, 20px)/1.5 "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.5em; color: rgba(242,245,250,0.6); pointer-events: none; }
  .d3-bgword { position: fixed; left: 0; right: 0; bottom: 5%; text-align: center; z-index: 1;
    font: 900 clamp(56px, 11vw, 150px)/1 "Helvetica Neue", Arial, sans-serif;
    letter-spacing: 0.22em; color: rgba(76,201,240,0.07); pointer-events: none; }
`;
document.head.appendChild(style);
const heroTitle = document.createElement('div');
heroTitle.className = 'd3-title';
heroTitle.textContent = 'HOVER · DISTORT';
document.body.appendChild(heroTitle);
const bgWord = document.createElement('div');
bgWord.className = 'd3-bgword';
bgWord.textContent = 'RIPPLE';
document.body.appendChild(bgWord);

// ---- 帧循环：u_mouse 换算 + hover 状态机 + 波纹 + 三层视差 ----
let hovered = false;   // 等价于图卡 DOM 的 mouseenter/leave——raycaster 属 Threejs创意3D 领地
let t0 = -1;           // 波纹起点时刻
let hover = 0;         // 进 shader 的渐进强度

chrome.startLoop((now) => {
  const s = now / 1000;
  const p = chrome.pointer;

  // 光标（nx/ny 归一 0–1 左下原点）→ 世界 → 图卡局部 uv
  const t = Math.tan((camera.fov / 2) * Math.PI / 180);
  const visH = 2 * t * camera.position.z;
  const wx = (p.nx * 2 - 1) * (visH * camera.aspect) / 2;
  const wy = (p.ny * 2 - 1) * visH / 2;
  const mu = wx / 3 + 0.5, mv = wy / 3.75 + 0.5;
  material.uniforms.u_mouse.value.set(mu, mv);

  // hover 状态机：光标落在图卡 uv 范围内即 enter，离开即 leave
  const inside = mu >= 0 && mu <= 1 && mv >= 0 && mv <= 1;
  if (inside && !hovered) { hovered = true; t0 = s; }  // 记下 t0，波纹从此刻扩散
  if (!inside) hovered = false;

  // 波纹：0.8s easeOutCubic，最大扫过 90% 半径；离开后保持不再扩张
  if (t0 >= 0) {
    const pr = Math.min((s - t0) / 0.8, 1);
    material.uniforms.u_ripple.value = (1 - Math.pow(1 - pr, 3)) * 0.9;
  }

  // hover 强度 lerp 0.08——「hover 是强度，不是开关」
  hover += ((hovered ? 1 : 0) - hover) * 0.08;
  material.uniforms.u_hover.value = hover;
  material.uniforms.u_time.value = s;

  // 三层视差：同一输入、系数带符号（内容 +5% / 标题 -3% / 水印 +2%）
  // chrome 的 sx/sy 已内置 0.08 阻尼，等价于讲义里的手写 lerp
  const ox = p.sx - 0.5, oy = p.sy - 0.5;
  material.uniforms.u_parallax.value.set(ox * 0.05, oy * 0.05);
  heroTitle.style.transform = `translate3d(${(-ox * 6).toFixed(3)}vw, ${(oy * 3).toFixed(3)}vw, 0)`;
  bgWord.style.transform = `translate3d(${(ox * 4).toFixed(3)}vw, ${(-oy * 2).toFixed(3)}vw, 0)`;

  renderer!.render(scene, camera);
});
