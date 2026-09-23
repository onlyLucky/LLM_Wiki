// Day 3 · 作业 basic · 参考答案 —— TSL 熔核星球
// 三频噪声置换球面：山体 / 岩块 / 熔渣三层 fBm 叠出地形，熔岩从低谷透光。
// 与 demo 02 的行波海核心差异一句话：波是「坐标的函数」，地形是「噪声域的函数」；
// 鼠标从参数调制换成蓄热状态机——按住注入热量，星球隆起沸腾、松开冷却。
// 同样的星球用原生 WGSL 写参照 Day 2 demo 04 的 313 行式样——
// buffer / bind group / pipeline 一样不少。
// 说明：three 0.186.0 的 npm 包不带类型声明，three/webgpu / three/tsl 两处导入
// 带 @ts-ignore（真实项目装 @types/three 补全，课程工程刻意不引入）。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
// @ts-ignore three 0.186.0 未附带 three/webgpu 的类型声明
import * as THREE from 'three/webgpu';
// @ts-ignore 同上：three/tsl
import {
  positionLocal, normalLocal, time, Fn, vec3, uniform, mix, color,
  smoothstep, mx_noise_float, varying,
} from 'three/tsl';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空

const chrome = createChrome({
  day: 3, index: 'B', title: 'MOLTEN CORE',
  tags: ['THREE', 'TSL', 'VERTEX'],
  hint: '按住鼠标注入热量——熔核隆起沸腾，松开缓缓冷却',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
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
renderer.setClearColor(new THREE.Color().setHex(0x0b0709, THREE.LinearSRGBColorSpace), 1);

// ---- 任务 1：场景组装 ----------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, chrome.width / chrome.height, 0.1, 40);
const material = new THREE.MeshStandardNodeMaterial();
// 位移后的法线按面片重算（导数法线），岩壳的受光立体感靠它；
// 不开的话标准材质的光照还是原始球面法线，置换地形会像一张贴图
material.flatShading = true;

// 48 细分约 4.6 万三角面：噪声地形够细，对 GPU 仍是轻活
const geometry = new THREE.IcosahedronGeometry(1.6, 48);
scene.add(new THREE.Mesh(geometry, material));

// 暖白主光打亮岩壳受光面；冷蓝轮廓光勾住暗侧边缘；
// 暗暖环境光兜底球体背面——半边死黑会吞掉熔岩的层次
const key = new THREE.DirectionalLight(0xffe2c4, 1.5);
key.position.set(2.5, 3, 4);
scene.add(key);
const rim = new THREE.DirectionalLight(0x6a86ff, 0.9);
rim.position.set(-3, -1.5, -4);
scene.add(rim);
scene.add(new THREE.AmbientLight(0x2a1a14, 1.8));

// 半径 1.6 + 沸腾置换最大约 2.0：距离 5.2 微俯视刚好收进画面
camera.position.set(0, 0.8, 5.2);
camera.lookAt(0, 0, 0);

// ---- 任务 4（前半，骨架已给）：热量 uniform ------------------------
// uniform() 创建一次，运行期只写 .value——重建节点图等于重建管线。
const charge = uniform(0);

// ---- 任务 2：噪声置换球面（三频 fBm）--------------------------------
// 同一颗 mx_noise_float 取三种频率加权 0.55 / 0.3 / 0.15——
// 大尺度山体、中尺度岩块、小尺度熔渣。运算方向遵守约定：JS 数字只出现在
// 节点方法的参数位（node.mul(2)，不写 2 * node）。
// 顶点置换是纯节点运算，直接写模块级节点链即可（不必包 Fn）；
// varying 也必须在模块级创建——TSL 的 varying(value) 自动把 value 的求值
// 放进顶点阶段、在片元阶段生成同名 varying 读取，跨阶段一行搞定；
// 若在 Fn 体内创建再靠外部变量承接，管线编译期 Fn 体重跑会让片元侧
// 拿到旧节点，WGSL 直接编译失败（smoothstep 丢参数）。
const flow = time.mul(charge.mul(0.12).add(0.03));
const q = positionLocal.mul(0.9).add(vec3(flow, flow.mul(0.6), flow.mul(-0.4)));

const n1 = mx_noise_float(q);
const n2 = mx_noise_float(q.mul(2.1).add(17.3));
const n3 = mx_noise_float(q.mul(3.9).add(43.7));
// mx_noise_float 返回 [-1, 1]，三频加权后仍是 [-1, 1]——
// 重映射到 0 ~ 1：0.5 是平均海平面，低洼透熔岩、高处凝岩壳
const elev = n1.mul(0.55).add(n2.mul(0.3)).add(n3.mul(0.15)).mul(0.5).add(0.5);

// 海拔标量 varying 出去给任务 3 调色（WGSL 版的手写 varying 消失了）
const e01 = varying(elev, 'vElev');

// 置换幅度挂在 charge：基础 0.14，充满 0.42——常温凝固、沸腾隆起；
// 沿法线推出（球面上法线即径向）；positionNode 是替换不是叠加
const h = elev.sub(0.5).mul(2).mul(charge.mul(0.28).add(0.14));
material.positionNode = positionLocal.add(normalLocal.mul(h));

// ---- 任务 3：熔岩配色（海拔反向映射）--------------------------------
// 与直觉相反：海拔低处才是熔岩（裂缝里透光），高处是凝固岩壳。
// 两段式 mask 都用 smoothstep(edge0, edge1, e).oneMinus() 写「低于阈值」，
// 炽核再乘一档热量：蓄热越满，亮黄从最深的裂缝里渗得越广；
// 最后整档热量亮度——蓄热时星球泛光发热。
const lavaMask = smoothstep(0.34, 0.42, e01).oneMinus();  // 低洼带：熔岩橙（窄过渡=裂缝边缘锐利）
const coreMask = smoothstep(0.3, 0.4, e01).oneMinus();    // 更低洼：炽核亮黄（橙斑中心再亮一层）
const c = mix(color(0x1a1420), color(0xff5a1f), lavaMask);
material.colorNode = mix(
  c, color(0xffc86b),
  coreMask.mul(charge.mul(0.4).add(0.6)),
).mul(charge.mul(0.6).add(1));

// ---- 任务 4（后半）：蓄热状态机 --------------------------------------
// pointerdown 切「注入」，pointerup 挂 window（移出画布也能松开）；
// 每帧的指数趋近写在下方帧循环里。每帧只写 .value，节点图一个字节不动。
let charging = false;
chrome.canvas.addEventListener('pointerdown', () => { charging = true; });
window.addEventListener('pointerup', () => { charging = false; });

// ---- 帧循环（骨架已给全：resize 时保持相机比例）---------------------
chrome.startLoop(() => {
  // 指数趋近：按住约 1.5 秒充满、松开同速冷却（帧率相关，演示足够）
  charge.value += ((charging ? 1 : 0) - charge.value) * 0.03;
  camera.aspect = chrome.width / chrome.height;
  camera.updateProjectionMatrix();
  renderer!.render(scene, camera);
});
