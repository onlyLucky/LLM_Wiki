// Day 3 · 作业 challenge —— 玻璃与滚动驱动
// 对应讲义 3.4（后处理）+ 3.5 工作坊组件一与组件三：
// haoqi.design 与 igloo.inc 的合体。一块悬浮的玻璃标志，滚动驱动相机绕行，
// 玻璃折射身后的发光墙，bloom 在亮部收尾——三个组件共享同一条后处理链，
// 滚动进度是唯一的输入源。这一档的完成品可以直接当作品集片段。
// 七个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。
// 说明：three 0.186.0 的 npm 包不带类型声明，three/webgpu / three/tsl 两处导入
// 带 @ts-ignore（真实项目装 @types/three 补全，课程工程刻意不引入）。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
// @ts-ignore three 0.186.0 未附带 three/webgpu 的类型声明
import * as THREE from 'three/webgpu';
// @ts-ignore 同上：three/tsl
import { pass } from 'three/tsl';
import { bloom } from 'three/addons/tsl/display/BloomNode.js';
// @ts-ignore 同上：three/addons 的圆角盒几何扩展
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空
const camera = new THREE.PerspectiveCamera(46, 1, 0.1, 60);

const chrome = createChrome({
  day: 3, index: 'C', title: 'GLASS & SCROLL',
  tags: ['THREE', 'TSL', 'SCROLL'],
  hint: '完成后：向下滚动——相机绕行、玻璃入场、bloom 升起',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  },
});

try {
  renderer = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await renderer.init();
} catch (e) {
  chrome.fail(
    'RENDERER INIT FAILED', String(e),
    '检查浏览器是否支持 WebGPU（Chrome/Edge 113+）。WebGPURenderer 会自动回退 WebGL2，走到这里通常是 canvas 或上下文冲突。',
  );
  throw e;
}
renderer.setPixelRatio(dpr);
renderer.setSize(chrome.width / dpr, chrome.height / dpr, false);
// 色调映射收尾（已给，demo 04 同款）：管线内部保持线性 HDR，输出前统一压回
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.12;

// ---- DOM 滚动层（已给，组件一步骤 1）------------------------------
// 画框钉死在视口，滚动高度由章节占位撑出；文案是叙事层，
// 滚动进度是三个组件共享的唯一输入源（讲义 3.5 的 M6 组件图）。
const stage = chrome.canvas.parentElement as HTMLElement;
Object.assign(stage.style, {
  position: 'fixed',
  top: '1.5rem', left: '1.5rem', right: '1.5rem', bottom: '1.5rem',
  height: 'auto', width: 'auto',
});

const CHAPTERS: Array<[string, string]> = [
  ['01 · Float', '一块玻璃标志悬浮在深色空间，电蓝的光墙立在它身后。'],
  ['02 · Orbit', '滚动是唯一的时间轴——相机绕过玻璃，光墙的全貌慢慢展开。'],
  ['03 · Refract', 'transmission 开启：光穿过 1.5 的折射率，被厚度压弯、被粗糙度揉散。'],
  ['04 · Bloom', '阈值之上的亮度开始溢出。收尾，也是三天课程的交付物。'],
];

const storyStyle = document.createElement('style');
storyStyle.textContent = `
  .story { position: relative; z-index: 1; }
  .story section {
    height: 108vh; display: flex; flex-direction: column;
    justify-content: center; max-width: 21rem; pointer-events: none;
  }
  .story section:nth-child(even) { margin-left: auto; }
  .story h2 { font: 700 13px/1.6 var(--mono); letter-spacing: 0.14em;
              text-transform: uppercase; color: var(--ink); }
  .story p { font: 12.5px/1.9 var(--mono); color: var(--ink-dim); margin-top: 0.75rem; }
`;
document.head.appendChild(storyStyle);

const story = document.createElement('div');
story.className = 'story';
for (const [title, copy] of CHAPTERS) {
  const section = document.createElement('section');
  const h2 = document.createElement('h2');
  h2.textContent = title;
  const p = document.createElement('p');
  p.textContent = copy;
  section.append(h2, p);
  story.appendChild(section);
}
document.body.appendChild(story);

// ---- 场景骨架（已给）----------------------------------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0e14); // 与页面底色一致，画布与画框无缝
const keyLight = new THREE.DirectionalLight(0xf5ede2, 1.6);
keyLight.position.set(3, 4, 2.5);
scene.add(keyLight, new THREE.AmbientLight(0x232833, 1.2));

// ---- TODO 1：可折射的光墙 -----------------------------------------
// 玻璃后面必须有内容：折射到空背景色的玻璃是一片均匀的灰
// （讲义 3.5 常见坑第 3 条）。光墙就是「值得折射的世界」。
// TODO(day3-ch-1): 沿 x 从 -3.6 到 3.6 排 11 根竖直发光条——
// BoxGeometry(0.1, 高度 4.2–5.4 随 i 变化, 0.1)，z = -2.6 附近 ± 0.4 抖动，
// MeshStandardNodeMaterial：color 深色（如 0x14141a），emissive 在
// 电蓝 0x4C6FFF / 青 0x2DD4BF / 琥珀 0xF59E0B 间交替，
// emissiveIntensity 2.2–3.4（> 1 才是 HDR，才喂得饱 bloom）。
// 再加一块深色地面（PlaneGeometry 转 -90°，y = -2.6）把构图压稳。全部入 scene。
throw new Error('TODO(day3-ch-1) 未完成：见 README');

// ---- TODO 2：玻璃标志 ---------------------------------------------
let glass: THREE.Mesh | null = null; // TODO 2 创建（applyGlass 消费它）

// TODO(day3-ch-2): 玻璃标志——
// RoundedBoxGeometry(1.7, 1.7, 0.55, 5, 0.14)（圆角盒，igloo 冰块的既视感，
// 已在文件头导入），MeshPhysicalNodeMaterial 参数组：
// transmission 1（折射的总开关）、thickness 1.2（折射位移量）、
// roughness 0.08（0 完全透明如水，给一点就够）、ior 1.5、
// attenuationColor 0x9fd8e8 + attenuationDistance 1.6（微青的冰感），
// material.side = THREE.DoubleSide（双面，厚度感靠它）。
// glass = new THREE.Mesh(...)，position.set(0, 2.0, 1.8) 起手在高处，入 scene。
throw new Error('TODO(day3-ch-2) 未完成：见 README');

// ---- 滚动驱动的三个映射（TODO 3 / 4 / 5，帧循环消费）--------------
// 三个纯函数：读进度、映射相机、映射玻璃。归一化与防除零在 TODO 3，
// 平滑拖动已给在帧循环里（lerp 0.08，讲义 3.5 同款）。

function readScrollProgress(): number {
  // TODO(day3-ch-3): max = document.documentElement.scrollHeight - innerHeight；
  // max > 0 ? scrollY / max : 0——分母为零（页面没撑开 / 视口超高）必须防
  throw new Error('TODO(day3-ch-3) 未完成：见 README');
}

function applyCamera(p: number): void {
  // TODO(day3-ch-4): 讲义 3.5 组件一的核心十行——
  // 轨道角 angle = -0.75 + p * 2.7（随进度扫过场景约 155°），
  // camera.position.set(sin(angle) * 5.4, 2.3 - p * 1.7, cos(angle) * 5.4)，
  // camera.lookAt(0, 0.35, 0)。滚动一轮，相机从右上绕到正面偏低。
  throw new Error('TODO(day3-ch-4) 未完成：见 README');
}

function applyGlass(p: number): void {
  // TODO(day3-ch-5): 玻璃入场——position.y 从 2.0 降到 0.35、
  // position.z 从 1.8 收到 0.4、rotation.y = p * Math.PI * 0.9。
  // 想要「第三章最戏剧」就先用 smoothstep(0.35, 0.85, p) 把 p 压一遍再映射
  // （JS 里手写 smoothstep 三行，Day 2 讲义 2.2 的同款函数）。
  throw new Error('TODO(day3-ch-5) 未完成：见 README');
}

// ---- TODO 6：后处理链 ---------------------------------------------
let pipeline: THREE.RenderPipeline | null = null; // TODO 6 赋值，帧循环 render 它
let bloomPass: any = null;                        // TODO 6 赋值，TODO 7 调参

// TODO(day3-ch-6): demo 04 的四行接一条管线——
// pipeline = new THREE.RenderPipeline(renderer)（r183 起 PostProcessing 改名）；
// const scenePassColor = pass(scene, camera).getTextureNode('output')；
// bloomPass = bloom(scenePassColor, 0.45, 0.6, 0.65)
//   （strength, radius, threshold——阈值 0.65 起步，0 会全屏过曝）；
// pipeline.outputNode = scenePassColor.add(bloomPass)。
// 帧循环已经改用 pipeline.render()：renderer.render 与它并存会画两遍场景
// （讲义 3.4 坑位榜首）。
throw new Error('TODO(day3-ch-6) 未完成：见 README');

// ---- TODO 7：bloom 随进度升起 -------------------------------------
function applyBloom(p: number): void {
  // TODO(day3-ch-7): bloomPass.strength.value 平滑趋向 0.15 + p * 0.7——
  // 第一章几乎无辉光，最后一章亮部满溢。lerp 系数 0.06（比相机的 0.08
  // 更慢半拍，光比镜头迟一步到位，收尾更从容）。
  throw new Error('TODO(day3-ch-7) 未完成：见 README');
}

// ---- 帧循环（已给）：读滚动 → 平滑 → 三个映射 → 管线输出 ---------
// 滚动的重活全部留在帧循环里消费，scroll 事件一行都不用监听
// （讲义 3.5：事件里只适合改标记）。
let camProgress = 0;

chrome.startLoop(() => {
  camProgress += (readScrollProgress() - camProgress) * 0.08; // 平滑拖动去步进感
  applyCamera(camProgress);
  applyGlass(camProgress);
  applyBloom(camProgress);
  pipeline!.render(); // 后处理版的「render」：场景 → pass → bloom → 输出
});
