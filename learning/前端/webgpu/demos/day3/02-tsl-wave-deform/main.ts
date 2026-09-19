// Day 3 · Demo 02 —— TSL Wave Deform
// 对应讲义 3.2：Day 2 demo 04 的同一个正弦波场，改用 TSL 节点图表达。
// positionNode 做顶点位移、normalNode 挂解析法线、colorNode 按波高做
// 青→白双色 mix——没有 WGSL 字符串，没有 struct 布局与 location 契约，
// 鼠标参数也不需要手写 uniform buffer 与绑定组。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
import * as THREE from 'three/webgpu';
import {
  Fn, color, cos, mix, positionLocal, sin, smoothstep, time, uniform, vec3, varying,
} from 'three/tsl';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空
let camera: THREE.PerspectiveCamera | null = null;
const chrome = createChrome({
  day: 3,
  index: '02',
  title: 'TSL WAVE DEFORM',
  tags: ['THREE', 'TSL', 'VERTEX'],
  hint: '移动鼠标：横移调频率，纵移推相位',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    if (camera) {
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    }
  },
});

// ---- 渲染器（chrome 整合模式，与 demo 01 相同）--------------------
try {
  const r = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await r.init();
  renderer = r;
} catch (e) {
  chrome.fail(
    'RENDERER INIT FAILED',
    String(e),
    '检查浏览器是否支持 WebGPU（Chrome/Edge 113+）。WebGPURenderer 会自动回退 WebGL2，走到这里通常是 canvas 或上下文冲突。',
  );
  throw e;
}
renderer!.setPixelRatio(dpr);
renderer!.setSize(chrome.width / dpr, chrome.height / dpr, false);
renderer!.setClearColor(new THREE.Color().setHex(0x0b0e14, THREE.LinearSRGBColorSpace), 1);

// ---- 鼠标 → uniform 节点：横移调制频率（±20%），纵移整体推相位 ----
// uniform() 返回一个 JS 侧可写的节点，渲染器自动生成 buffer 与绑定组
const mouse = uniform(new THREE.Vector2(0, 0));
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse.value.set(
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  );
});

// ---- 波场：三组正弦行波叠加，解析梯度一并算出 ----------------------
// 与 Day 2 demo 04 的 waveField 同构：Fn 是 TSL 的「着色器函数」，
// 返回 (高度, ∂h/∂x, ∂h/∂y)。注意运算方向：JS 数字只能出现在节点
// 方法的参数位（node.mul(2)），写 2 * node 不会得到着色器代码。
const waveField = Fn(([p, t]: any[]) => {
  const freq = mouse.x.mul(0.2).add(1.0); // 鼠标横移：空间频率 ±20%
  const phase = mouse.y.mul(1.6);         // 鼠标纵移：整体相位推移

  // 主浪（沿 x 长波）、交叉浪（沿 y 中浪）、细浪（斜向短波）
  const ph1 = p.x.mul(1.35).mul(freq).add(t.mul(1.1)).add(phase);
  const ph2 = p.y.mul(2.6).mul(freq).sub(t.mul(1.6)).add(phase);
  const ph3 = p.x.add(p.y).mul(4.1).mul(freq).add(t.mul(2.2)).sub(phase);

  const h = sin(ph1).mul(0.3).add(sin(ph2).mul(0.18)).add(sin(ph3).mul(0.1));

  // d(a·sin(k·x))/dx = a·k·cos(k·x)：梯度与波同源，法线平滑不抖
  const dx = cos(ph1).mul(0.405).add(cos(ph3).mul(0.41)).mul(freq);
  const dy = cos(ph2).mul(0.468).add(cos(ph3).mul(0.41)).mul(freq);

  return vec3(h, dx, dy);
});

// 顶点阶段调用一次：波高插值到片元（varying 等价于 WGSL 的 @location 输出）
const wave = waveField(positionLocal.xy, time);
const waveH = varying(wave.x);

// ---- 材质：三个节点通道，各管一段 --------------------------------
const material = new THREE.MeshStandardNodeMaterial({
  color: 0x2dd4bf, // 青：作为 colorNode 的底色锚点
  metalness: 0,
  roughness: 0.38,
});

// positionNode 是「替换」不是「叠加」：必须把 positionLocal 加回来，
// 只写位移项整张网格会塌到平面上
material.positionNode = positionLocal.add(vec3(0, 0, wave.x));

// 平面局部系：x/y 是展平方向、z 是法线方向（网格旋转 -90° 后指向世界上方）
material.normalNode = vec3(wave.y.negate(), wave.z.negate(), 1).normalize();

// 波高 → 青 → 主白 双色 mix，谷底再整体压暗一档（0.55–1.0）
const hNorm = waveH.mul(0.86).add(0.5).clamp();
material.colorNode = mix(color(0x2dd4bf), color(0xe8ecf4), smoothstep(0.3, 0.95, hNorm))
  .mul(hNorm.mul(0.45).add(0.55));

// ---- 场景：128×128 网格平面 + 主光 + 暗青补光 ---------------------
const scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera(46, chrome.width / chrome.height, 0.1, 40);
camera.position.set(0, 3.2, 5);
camera.lookAt(0, -0.1, 0);

const ocean = new THREE.Mesh(new THREE.PlaneGeometry(8, 8, 128, 128), material);
ocean.rotation.x = -Math.PI / 2; // XY 平面躺平成 XZ 海面
scene.add(ocean);

const key = new THREE.DirectionalLight(0xf2f7ff, 1.6);
key.position.set(2.5, 4, 2.5);
scene.add(key);

const fill = new THREE.AmbientLight(0x16323a, 1.2); // 暗部带一点主题色，避免纯黑
scene.add(fill);

// ---- 帧循环 -----------------------------------------------------
chrome.startLoop((nowMs) => {
  const t = nowMs / 1000;

  // 相机缓慢漂移，给静态机位一点呼吸；波浪本身由 time 节点驱动
  camera.position.x = 0.18 * Math.sin(t * 0.1);
  camera.position.y = 3.2 + 0.08 * Math.sin(t * 0.14);
  camera.lookAt(0, -0.1, 0);

  renderer!.render(scene, camera);
});
