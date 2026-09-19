// Day 3 · Demo 04 —— POSTPROCESSING
// 对应讲义 3.4：后处理与性能调优。暖光场景 + RenderPipeline + bloom，
// 鼠标纵移在 0.4–0.9 间调辉光强度。
// 注：THREE.PostProcessing 自 r183 起改名 THREE.RenderPipeline，
// 本课程锁定的 0.186.0 用新名字（控制台不会再有弃用警告）。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
import * as THREE from 'three/webgpu';
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';

// ---- chrome 整合模式（Day 3 统一照抄） ---------------------------
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null;
let pipeline: THREE.RenderPipeline | null = null;
const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 60);

const chrome = createChrome({
  day: 3,
  index: '04',
  title: 'POSTPROCESSING',
  tags: ['THREE', 'TSL', 'BLOOM'],
  hint: '上下移动鼠标调节辉光强度（0.4–0.9）',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  },
});

try {
  renderer = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await renderer.init(); // 必须在首次 render 之前
} catch (e) {
  chrome.fail(
    'RENDERER INIT FAILED',
    String(e),
    '检查浏览器是否支持 WebGPU（Chrome/Edge 113+）。WebGPURenderer 会自动回退 WebGL2，走到这里通常是 canvas 或上下文冲突。'
  );
  throw e;
}
renderer.setPixelRatio(dpr);
renderer.setSize(chrome.width / dpr, chrome.height / dpr, false);

// ---- 场景：一圈暖光「星环仪」，emissive 超过 1 才喂得饱 bloom ----
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e14); // 与页面底色一致，画布与画框无缝

const core = new THREE.Mesh(
  new THREE.SphereGeometry(0.55, 48, 48),
  new THREE.MeshStandardNodeMaterial({
    color: 0x14141a,
    emissive: 0xf59e0b, // 主题琥珀
    emissiveIntensity: 2.2, // > 1：HDR 值，bloom 的提亮部靠它
    roughness: 0.4,
  }),
);
scene.add(core);

// 每条环一个 Group：环本身 + 沿环滑动的热小球（自转看不出，滑动才动）
interface RingSet {
  group: THREE.Group;
  orbiters: THREE.Mesh[];
  radius: number;
  speeds: number[];
  phases: number[];
}
const ringSets: RingSet[] = [];

function makeRing(
  radius: number, tube: number, emissive: number, intensity: number,
  tilt: [number, number], orbiterCount: number,
): RingSet {
  const group = new THREE.Group();
  group.rotation.x = tilt[0];
  group.rotation.y = tilt[1];

  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(radius, tube, 16, 180),
    new THREE.MeshStandardNodeMaterial({ color: 0x14141a, emissive, emissiveIntensity: intensity }),
  );
  group.add(ring);

  const orbiters: THREE.Mesh[] = [];
  for (let i = 0; i < orbiterCount; i++) {
    const orb = new THREE.Mesh(
      new THREE.SphereGeometry(0.085, 24, 24),
      new THREE.MeshStandardNodeMaterial({
        color: 0x14141a,
        emissive: 0xffedd5, // 暖白热小球，最亮的部分
        emissiveIntensity: 3.2,
      }),
    );
    orbiters.push(orb);
    group.add(orb);
  }

  scene.add(group);
  const speeds = orbiters.map((_, i) => 0.35 + 0.12 * i);
  const phases = orbiters.map((_, i) => (i * Math.PI * 2) / orbiterCount);
  return { group, orbiters, radius, speeds, phases };
}

ringSets.push(makeRing(1.15, 0.035, 0xf59e0b, 1.9, [1.05, 0.10], 2));
ringSets.push(makeRing(1.62, 0.028, 0xffe3b3, 1.4, [-0.55, -0.35], 2));
ringSets.push(makeRing(2.05, 0.022, 0xea580c, 1.2, [0.30, 0.85], 1));

// 深色地面：接住点光，把构图压稳（反射可选，这里只要光池）
const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(11, 11),
  new THREE.MeshStandardNodeMaterial({ color: 0x101218, roughness: 0.85, metalness: 0.05 }),
);
ground.rotation.x = -Math.PI / 2;
ground.position.y = -1.7;
scene.add(ground);

const keyLight = new THREE.PointLight(0xf5b34c, 26, 18, 2);
keyLight.position.set(0, 0.9, 0);
scene.add(keyLight);
scene.add(new THREE.AmbientLight(0x232833, 1.6));

// ---- 后处理：三条语句接一条管线 -------------------------------
// pass(scene, camera) 把「渲染这个场景」变成节点，输出是可运算的纹理；
// bloom 从中提取亮部（threshold），多级高斯模糊后叠加回原图。
pipeline = new THREE.RenderPipeline(renderer); // r183 前：new THREE.PostProcessing(renderer)
const scenePass = pass(scene, camera);
const scenePassColor = scenePass.getTextureNode('output');
const bloomPass = bloom(scenePassColor, 0.65, 0.55, 0.85); // (node, strength, radius, threshold)
pipeline.outputNode = scenePassColor.add(bloomPass);

// 色调映射收尾：RenderPipeline 输出前统一应用，管线内部保持线性 HDR
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.15;

// ---- 鼠标：纵移调 strength（0.4–0.9），横移做相机视差 -----------
let mouseNdc: [number, number] = [0, 0];
chrome.canvas.addEventListener('pointermove', (e) => {
  const rect = chrome.canvas.getBoundingClientRect();
  mouseNdc = [
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    1 - ((e.clientY - rect.top) / rect.height) * 2,
  ];
});

// ---- 帧循环：RenderPipeline.render() 替换 renderer.render() -------
// 同一帧里两者并存会画两遍场景，后处理被直出画面覆盖（讲义 3.4 的坑位榜首）
const start = performance.now();

chrome.startLoop((now) => {
  const t = (now - start) / 1000;

  // 中心球呼吸：emissive 脉动让 bloom 跟着呼吸
  core.material.emissiveIntensity = 2.2 + Math.sin(t * 0.85) * 0.55;

  // 环进动 + 热小球沿环滑动
  ringSets[0].group.rotation.x = 1.05 + Math.sin(t * 0.21) * 0.12;
  ringSets[1].group.rotation.y = -0.35 + Math.sin(t * 0.17) * 0.15;
  ringSets[2].group.rotation.y = 0.85 + Math.sin(t * 0.13) * 0.18;
  for (const set of ringSets) {
    for (let i = 0; i < set.orbiters.length; i++) {
      const a = t * set.speeds[i] + set.phases[i];
      set.orbiters[i].position.set(
        Math.cos(a) * set.radius,
        Math.sin(a) * set.radius,
        0,
      );
    }
  }

  // 鼠标联动：纵移 0.4–0.9 平滑跟随，克制优先
  const strengthTarget = 0.4 + (0.5 - 0.5 * mouseNdc[1]) * 0.5;
  bloomPass.strength.value += (strengthTarget - bloomPass.strength.value) * 0.12;

  // 相机：缓慢漂移 + 鼠标视差（幅度克制）
  const az = 0.10 * Math.sin(t * 0.07) + mouseNdc[0] * 0.14;
  camera.position.set(
    Math.sin(az) * 4.6,
    1.15 + mouseNdc[1] * 0.18,
    Math.cos(az) * 4.6,
  );
  camera.lookAt(0, -0.1, 0);

  pipeline!.render(); // 后处理版的「render」：场景 → pass → bloom → 输出
});
