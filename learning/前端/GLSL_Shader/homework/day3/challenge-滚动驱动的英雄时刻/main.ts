// Day 3 · 作业 C —— 滚动驱动的英雄时刻（毕业作品）
// 对应讲义 3.3、3.4、3.5：滚动时间轴 + 粒子场 + 后期收尾的三合一。
// 三段式叙事（讲义 3.3 How 段拆好的时间轴）：
//   0–0.3 粒子聚集成 hero 图形「GLSL」
//   0.3–0.7 噪声揭幕转场（背景暗紫 → 近黑）
//   0.7–1.0 文字粒子聚合定格「FIN」
// TODO 分布：
//   TODO(day3-ch-1) Lenis 接入 + u_scroll 归一化 —— 本文件帧循环
//   TODO(day3-ch-2) 粒子噪声散开 —— shaders/vertex.glsl
//   TODO(day3-ch-3) 聚集度（幅度 1.0→0.1 + 两段 mix）—— shaders/vertex.glsl
//   TODO(day3-ch-4) fbm 阈值揭幕转场 —— shaders/bg.glsl
//   TODO(day3-ch-5) bloom + 配方 ShaderPass 收尾 —— 本文件；页头与文案改上方 DOM
//   TODO(day3-ch-6) 性能自查 —— octaves / 粒子数 / DPR 三项调档结论写进 README

import '../../../shared/demo.css';
import * as THREE from 'three';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';
import bgFsSource from './shaders/bg.glsl?raw';

// 声明先于 createChrome：onResize 回调在 createChrome 内同步执行，立刻就会读 renderer
let renderer: THREE.WebGLRenderer | null = null;

const chrome = createChrome({
  day: 3,
  index: 'C',
  title: 'HERO MOMENT',
  tags: ['HOMEWORK', 'SCROLL', 'PARTICLES'],
  hint: '向下滚动：聚齐 → 揭幕 → 定格',
  onResize: syncSize,
});

// ---- 滚动舞台（脚手架，无需改动）--------------------------------
// 画布 fixed 成背景层，三个 100vh 文案屏在正常文档流里撑出 300vh 滚动轨道
// ——「画布不动，世界在滚」。shader 读的只有 u_scroll 一个数。
const stage = document.querySelector('.stage') as HTMLElement;
stage.style.position = 'fixed';
stage.style.inset = '1.5rem';
stage.style.height = 'calc(100vh - 3rem)';
stage.style.zIndex = '0';

const style = document.createElement('style');
style.textContent = `
  .scr { height: 100vh; position: relative; z-index: 1;
         display: flex; flex-direction: column; justify-content: flex-end;
         padding: 0 2rem 3rem; pointer-events: none; }
  .scr .kicker { font-size: 11px; letter-spacing: 0.3em; opacity: 0.55; margin: 0; }
  .scr h2 { font-size: 26px; font-weight: normal; letter-spacing: 0.4em; margin: 0.6rem 0 0; }
`;
document.head.appendChild(style);

// ---- 三屏文案（TODO(day3-ch-5) 的「页头与文案」：换成你的句子）----
const copy = document.createElement('div');
copy.innerHTML = `
  <section class="scr">
    <p class="kicker">SCROLL 0.0 → 0.3</p>
    <h2>一千个粒子，聚成一个词</h2>
  </section>
  <section class="scr">
    <p class="kicker">SCROLL 0.3 → 0.7</p>
    <h2>噪声掀开幕布</h2>
  </section>
  <section class="scr">
    <p class="kicker">SCROLL 0.7 → 1.0</p>
    <h2>落幕，定格</h2>
  </section>`;
document.body.appendChild(copy);

// ---- 场景：一块背景板 + 一场粒子（已就位，通读再动 shader）------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.z = 3.6; // 视锥半高约 1.5：hero 文字与定格文字都稳在画面里

// 背景板：转场遮罩的画布。TODO(day3-ch-4) 在 bg.glsl 里做 fbm 阈值揭幕。
const bgMat = new THREE.ShaderMaterial({
  uniforms: {
    u_time: { value: 0 },
    u_scroll: { value: 0 },                          // 全片时间轴
    u_bgA: { value: new THREE.Color('#1B2140') },    // 暗紫夜（第一幕）
    u_bgB: { value: new THREE.Color('#05060A') },    // 近黑（第二幕）
  },
  vertexShader: `varying vec2 v_uv;
    void main() { v_uv = uv; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
  fragmentShader: bgFsSource,
});
const bg = new THREE.Mesh(new THREE.PlaneGeometry(24, 14), bgMat);
bg.position.z = -3;
scene.add(bg);

// 粒子场：N 个点，三个位置 attribute（数据就位，用法见 vertex.glsl 的 TODO）
const N = 9000; // ≥8000 达标；中端 GPU 的甜点区，TODO(day3-ch-6) 的调档项之一
const birth = new Float32Array(N * 3);   // 出生位：噪声散开的起点（球壳偏内，3.4 存货）
const targetA = new Float32Array(N * 3); // 目标位 A：「GLSL」采样点（第一段聚集）
const targetB = new Float32Array(N * 3); // 目标位 B：「FIN」采样点（第三段聚集）

for (let i = 0; i < N; i++) {
  const dir = new THREE.Vector3().randomDirection();
  const r = 0.9 + Math.pow(Math.random(), 2.2) * 1.1; // 中心密外围疏
  birth[i * 3] = dir.x * r;
  birth[i * 3 + 1] = dir.y * r;
  birth[i * 3 + 2] = dir.z * r * 0.4; // 压扁一点，星云别糊到相机脸上
}
sampleTextPoints('GLSL', N, targetA);
sampleTextPoints('FIN', N, targetB);

const geometry = new THREE.BufferGeometry();
geometry.setAttribute('position', new THREE.BufferAttribute(birth, 3)); // position = 出生位
geometry.setAttribute('a_targetA', new THREE.BufferAttribute(targetA, 3));
geometry.setAttribute('a_targetB', new THREE.BufferAttribute(targetB, 3));

const mat = new THREE.ShaderMaterial({
  transparent: true,
  blending: THREE.AdditiveBlending, // 3.4 的成对纪律：additive 必须关深度写入
  depthWrite: false,
  uniforms: {
    u_time: { value: 0 },
    u_scroll: { value: 0 },
    u_size: { value: 0.035 }, // 距离 300 处的像素直径（同 demo 03 的量纲）
    u_colorA: { value: new THREE.Color('#FF4D6D') }, // 散开时：玫红
    u_colorB: { value: new THREE.Color('#4CC9F0') }, // 聚齐后：天青
  },
  vertexShader: vsSource,
  fragmentShader: fsSource,
});
scene.add(new THREE.Points(geometry, mat));

// ---- 骨架提供的采样函数（脚手架，无需改动）----------------------
// 离屏 canvas 画字 → 收集不透明像素 → 均匀随机抽 N 个 → 映射到世界坐标。
// 文字横跨约 [-1.7, 1.7]、字面高约 1.1——视锥半高 1.5，稳稳在画面里。
function sampleTextPoints(text: string, count: number, out: Float32Array): void {
  const W = 512, H = 256;
  const cv = document.createElement('canvas');
  cv.width = W; cv.height = H;
  const ctx = cv.getContext('2d')!;
  ctx.fillStyle = '#fff';
  ctx.font = '900 190px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, W / 2, H / 2);
  const data = ctx.getImageData(0, 0, W, H).data;
  const hits: number[] = [];
  for (let y = 0; y < H; y++)
    for (let x = 0; x < W; x++)
      if (data[(y * W + x) * 4 + 3] > 128) hits.push(x, y);
  const n = hits.length / 2;
  if (n === 0) throw new Error(`采样失败：文字「${text}」没有落在画布里`);
  for (let i = 0; i < count; i++) {
    const k = (Math.random() * n) | 0;
    out[i * 3] = ((hits[k * 2] / W) - 0.5) * 3.4 + (Math.random() - 0.5) * 0.012;
    out[i * 3 + 1] = (0.5 - hits[k * 2 + 1] / H) * 1.7;
    out[i * 3 + 2] = (Math.random() - 0.5) * 0.08; // 一点厚度，别像纸片
  }
}

// ---- 尺寸同步（同 demo 03 的双守卫）----------------------------
function syncSize(w: number, h: number) {
  if (!renderer) return; // chrome 首次 applySize 早于 renderer 创建
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
  // TODO(day3-ch-5)：接入 composer 后，这里补一行 composer.setSize(w, h)
  // —— composer 有独立缓冲，不同步就会出现「画布缩了后期没缩」的错位
}

renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1); // chrome 已按 DPR≤2 设物理像素（DPR 也是 TODO(day3-ch-6) 的调档项）
renderer.setClearColor(0x0b0e14);
syncSize(chrome.width, chrome.height);

// ---- 帧循环 ----------------------------------------------------
chrome.startLoop((now) => {
  const s = now / 1000;

  // TODO(day3-ch-1)：Lenis 五行接入（讲义 3.3 第 2 节，import 放文件顶部）——
  //   import Lenis from 'lenis';
  //   const lenis = new Lenis({ lerp: 0.1 });        // 又是 0.1 的手感常数
  //   lenis.raf(now);                                 // 每帧喂时间——忘了调就是「装了但不滚」
  //   const p = lenis.scroll / (document.documentElement.scrollHeight - innerHeight);
  //   const u = Math.min(Math.max(p, 0), 1);          // clamp 是保险丝：防浮点误差穿过 1.0
  //   mat.uniforms.u_scroll.value = u;
  //   bgMat.uniforms.u_scroll.value = u;
  // 没接 Lenis 前：页面能原生滚（DOM 在滚），但 u_scroll 恒 0，画面停在第一幕起点。

  mat.uniforms.u_time.value = s;
  bgMat.uniforms.u_time.value = s;
  // u_scroll 占位 0——接完 TODO(day3-ch-1) 由 Lenis 喂，别在这里另写第二处驱动

  // TODO(day3-ch-5)：后期链收尾（import 都在 three/addons/postprocessing/ 下）——
  //   EffectComposer → RenderPass(scene, camera)
  //   → UnrealBloomPass(resolution, 0.9, 0.5, 0.35)  // 第三段定格时微抬：0.9 + t3 * 0.3
  //   → 你的配方 ShaderPass（grain 3% + vignette，gamma 别写，交给 OutputPass）
  //   → OutputPass
  //   帧循环末尾 renderer.render(...) 换成 composer.render()

  renderer!.render(scene, camera); // 接 composer 后换成 composer.render()
});
