// Day 3 · 作业 C · 答案 —— 滚动驱动的英雄时刻（毕业作品）
// 与 homework 骨架逐字对齐；差异集中在四处：Lenis 接入（ch-1）、
// composer 后期链与 syncSize 的一行同步（ch-5）、bloom 定格微抬（ch-5）。
// shader 侧的散开 / 聚集 / 揭幕见 vertex.glsl 与 bg.glsl。

import '../../../shared/demo.css';
import * as THREE from 'three';
import Lenis from 'lenis';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { createChrome } from '../../../shared/chrome.ts';
import vsSource from './shaders/vertex.glsl?raw';
import fsSource from './shaders/fragment.glsl?raw';
import bgFsSource from './shaders/bg.glsl?raw';

// 声明先于 createChrome：onResize 回调在 createChrome 内同步执行，立刻就会读二者
let renderer: THREE.WebGLRenderer | null = null;
let composer: EffectComposer | null = null;

const chrome = createChrome({
  day: 3,
  index: 'C',
  title: 'HERO MOMENT',
  tags: ['ANSWER', 'SCROLL', 'PARTICLES'],
  hint: '向下滚动：聚齐 → 揭幕 → 定格',
  onResize: syncSize,
});

// ---- 滚动舞台（脚手架，与骨架逐字一致）------------------------
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

// ---- 三屏文案（solution 保留骨架原句；换成你自己的句子也是完成 TODO-ch-5）----
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

// ---- 场景：一块背景板 + 一场粒子（与骨架逐字一致）--------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 50);
camera.position.z = 3.6; // 视锥半高约 1.5：hero 文字与定格文字都稳在画面里

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

const N = 9000; // ≥8000 达标；性能档 6000 / 质量档 20000，见 README 性能调档表
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

// ---- 骨架提供的采样函数（脚手架，与骨架逐字一致）--------------
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

// ---- 尺寸同步：双守卫 + composer 同步（ch-5）-------------------
function syncSize(w: number, h: number) {
  if (!renderer || !composer) return; // 双守卫：chrome 首次 applySize 早于二者创建
  renderer.setSize(w, h, false);
  composer.setSize(w, h); // composer 有独立缓冲，不同步 = 「画布缩了后期没缩」的错位
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}

renderer = new THREE.WebGLRenderer({ canvas: chrome.canvas, antialias: true });
renderer.setPixelRatio(1); // 调档项：性能 1 / 平衡 1 / 质量 min(devicePixelRatio, 2)
renderer.setClearColor(0x0b0e14);

// ---- 后期链（ch-5）：组装顺序即数据流向（底片 → 加工 → 印片）----
composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));
// bloom 三参数：strength 定格时微抬到 1.2 / radius 柔度 / threshold 门槛 0.35
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(chrome.width, chrome.height), 0.9, 0.5, 0.35);
composer.addPass(bloomPass);

// 配方 ShaderPass：grain 3% + vignette 20%（demo 03 配方卡同款，gamma 交给 OutputPass）
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

// ---- Lenis（ch-1）：平滑滚动接管页面原生滚动 -------------------
const lenis = new Lenis({ lerp: 0.1 }); // 又是 0.1 的手感常数

// ---- 帧循环 ----------------------------------------------------
chrome.startLoop((now) => {
  const s = now / 1000;

  // TODO(day3-ch-1) ✔ 五行核心：喂时间 → 算进度 → clamp → 喂两个材质
  lenis.raf(now); // 每帧喂时间——忘了调就是「装了但不滚」
  const p = lenis.scroll / (document.documentElement.scrollHeight - innerHeight);
  const u = Math.min(Math.max(p, 0), 1); // clamp 是保险丝：防浮点误差穿过 1.0
  mat.uniforms.u_scroll.value = u;
  bgMat.uniforms.u_scroll.value = u;

  mat.uniforms.u_time.value = s;
  bgMat.uniforms.u_time.value = s;
  gradePass.uniforms.u_time.value = s;

  // 第三幕定格微抬 bloom：0.9 → 1.2（JS 版 smoothstep，与 shader 同公式）
  const t3 = THREE.MathUtils.smoothstep(u, 0.7, 1.0);
  bloomPass.strength = 0.9 + t3 * 0.3;

  composer.render(); // 帧循环唯一改动：renderer.render → composer.render
});
