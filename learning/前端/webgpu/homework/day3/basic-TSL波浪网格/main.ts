// Day 3 · 作业 basic —— TSL 熔核星球
// 对应讲义 3.2（TSL 节点着色语言）：
// demo 02 用 TSL 写了一片线性行波海——这份作业不重复那片海，把平面波换成
// 噪声置换的熔核星球：三频噪声叠出地形，沿法线推出球面，熔岩从低谷透光。
// 交互也换一种形态：demo 02 的鼠标是横移调频纵移推相（参数调制），这里改成
// 蓄热状态机——按住鼠标注入热量，星球隆起沸腾，松开缓缓冷却。
// 同一套节点工具（positionNode / colorNode / uniform），置换数学完全自选——
// demo 02 教的是「怎么用」，这份作业验收「会不会自己组织表达式树」。
// 做完数一数行数：同样的星球用原生 WGSL 写，buffer / bind group / pipeline
// 一样都不少（参照 Day 2 demo 04 的 313 行式样）——引擎层价值照旧是行数。
// 四个 TODO 见 README 任务清单，未完成时页面错误面板会报出编号。
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
  hint: '完成后：按住鼠标注入热量——熔核隆起沸腾',
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

// ---- 场景骨架（几何与灯在 TODO 1 组装）----------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, chrome.width / chrome.height, 0.1, 40);
const material = new THREE.MeshStandardNodeMaterial();
// 位移后的法线按面片重算（导数法线），岩壳的受光立体感靠它；
// 不开的话标准材质的光照还是原始球面法线，置换地形会像一张贴图
material.flatShading = true;

// ---- 任务 4（前半，骨架已给）：热量 uniform ------------------------
// uniform() 创建一次，运行期只写 .value——重建节点图等于重建管线。
// 声明必须先于下面的置换节点链：模块级节点图按书写顺序就地搭建，后面要捕获它。
// charge ∈ [0, 1]：0 常温凝固，1 熔核沸腾——置换幅度与熔岩亮度都挂在这一个值上
const charge = uniform(0);

// TODO(day3-basic-1): 场景组装——IcosahedronGeometry(1.6, 48) 挂 material 入
// scene（48 细分约 4.6 万三角面，噪声地形够细又不重）；三盏灯：
//   暖白主光一盏（如 0xffe2c4 / 1.5，从 (2.5, 3, 4) 打亮岩壳受光面）
//   冷蓝轮廓光一盏（如 0x6a86ff / 0.9，从 (-3, -1.5, -4) 勾住星球暗侧边缘）
//   暗暖环境光一盏（如 0x2a1a14 / 1.8——球体背面全靠它兜底，别让半边死黑）
// 相机 (0, 0.8, 5.2) 微俯视原点——半径 1.6 + 沸腾置换最大约 2.0，别贴太近
throw new Error('TODO(day3-basic-1) 未完成：见 README');

// ---- TODO 2：噪声置换球面（三频 fBm）-------------------------------
// TODO(day3-basic-2): 三频叠加（fBm 配方）：同一颗 mx_noise_float 取三种
// 频率的噪声域（如 0.9 / 2.1 / 3.9 倍）加权 0.55 / 0.3 / 0.15——大尺度山体、
// 中尺度岩块、小尺度熔渣。时间漂移让地形缓慢流动：charge 越高流得越快。
// 置换幅度挂在 charge 上：基础 0.14，充满 0.42——常温凝固、沸腾隆起。
// 置换方向用 normalLocal（球面上法线即径向）：p.add(normalLocal.mul(h))——
// positionNode 是替换不是叠加，返回位移后的完整位置。
// ⚠️ 写法实测约定（0.186.0）：置换是纯节点运算，直接在模块级把节点链
// 赋给 material.positionNode 即可，不必包 Fn；海拔 varying 也必须在模块级
// 直接创建——const e01 = varying(elev, 'vElev')。若把 varying 放进 Fn 体
// 再用模块级 let 承接，管线编译期 Fn 体重跑会让片元侧拿到旧节点，WGSL
// 直接编译失败（参考答案实测踩过的坑）。
// 另注意 mx_noise_float 返回 [-1, 1] 而非 [0, 1]——阈值配色前先重映射。
throw new Error('TODO(day3-basic-2) 未完成：见 README');

// ---- TODO 3：熔岩配色（海拔反向映射）-------------------------------
// TODO(day3-basic-3): material.colorNode = 按海拔 mix 暗紫岩壳与熔岩橙——
// 与直觉相反：海拔低处才是熔岩（裂缝里透光），高处是凝固岩壳。
// 两段式：低洼带 #FF5A1F 熔岩橙 → 更低洼的炽核 #FFC86B 亮黄，
// 两个 mask 都用 smoothstep(edge0, edge1, e).oneMinus() 写「低于阈值」。
// 最后乘一档热量亮度：charge 从 0 到 1，整体亮度抬升约三分之一——
// 蓄热时星球泛光发热。海拔用 TODO 2 varying 出来的那个值。
throw new Error('TODO(day3-basic-3) 未完成：见 README');

// ---- TODO 4：蓄热交互（后半）---------------------------------------
// TODO(day3-basic-4): charge uniform 已由骨架声明（见上方），这里接上状态机——
// pointerdown（挂 chrome.canvas）置 charging = true，pointerup（挂 window，
// 防止移出画布后卡在「按住」态）置回 false；再到下方帧循环里加一行指数趋近：
//   charge.value += ((charging ? 1 : 0) - charge.value) * 0.03
// 按住约 1.5 秒充满、松开同速冷却。每帧只写 .value，节点图一个字节不动。
throw new Error('TODO(day3-basic-4) 未完成：见 README');

// ---- 帧循环（骨架已给全：resize 时保持相机比例）---------------------
// 任务 4 需要在这里新增一行 charge 的指数趋近——见 TODO 4 的指引
chrome.startLoop(() => {
  camera.aspect = chrome.width / chrome.height;
  camera.updateProjectionMatrix();
  renderer!.render(scene, camera);
});
