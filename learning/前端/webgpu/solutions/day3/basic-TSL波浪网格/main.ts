// Day 3 · 作业 basic —— TSL 波浪网格（参考答案）
// 对应讲义 3.2（TSL 节点着色语言）：
// Day 2 demo 04 用原生 WGSL 写同一片海花了 313 行（main.ts 216 + ocean.wgsl 97），
// 这份 TSL 答案把管线仪式全部交还引擎，只剩波浪数学——两份文件行数放在一起，
// 就是讲义 3.1「迁移策略」最直接的体感论据。
// 说明：three 0.186.0 的 npm 包不带类型声明，three/webgpu / three/tsl 两处导入
// 带 @ts-ignore（真实项目装 @types/three 补全，课程工程刻意不引入）。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
// @ts-ignore three 0.186.0 未附带 three/webgpu 的类型声明
import * as THREE from 'three/webgpu';
// @ts-ignore 同上：three/tsl
import {
  positionLocal, positionWorld, time, Fn, vec2, vec3,
  uniform, mix, sin, color, smoothstep,
} from 'three/tsl';

const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null; // onResize 首次触发早于构造，必须判空

const chrome = createChrome({
  day: 3, index: 'B', title: 'TSL WAVE GRID',
  tags: ['THREE', 'TSL', 'VERTEX'],
  hint: '完成后：移动鼠标调制波浪的频率与相位',
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
renderer.setClearColor(new THREE.Color().setHex(0x0b0e14, THREE.LinearSRGBColorSpace), 1);

// ---- 任务 1：场景组装 ----------------------------------------------
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(46, chrome.width / chrome.height, 0.1, 40);
const material = new THREE.MeshStandardNodeMaterial();
// 位移后的法线按面片重算（导数法线），波浪的受光立体感靠它；
// 不开的话标准材质的光照还是平面的 (0,1,0)，画面会像一张贴图
material.flatShading = true;

// 网格先转平再入 scene：把 y 方向整个留给波浪高度（WGSL 版是顶点里做旋转，
// 引擎层一个 rotateX 就够了——「仪式交给引擎」的第一笔账）
const grid = new THREE.Mesh(new THREE.PlaneGeometry(6, 6, 160, 160), material);
grid.rotation.x = -Math.PI / 2;
scene.add(grid);

scene.add(new THREE.AmbientLight(0xbfd0e0, 0.5));      // 环境光只抬暗部，不抢主光
const key = new THREE.DirectionalLight(0xf2f7ff, 2.0); // 方向光从斜上方打进画面
key.position.set(2.5, 4.0, 2.0);
scene.add(key);

camera.position.set(4.4, 3.3, 6.0); // 斜上方机位拉远一档：网格占画面下 2/3，上方留白给背景
camera.lookAt(0, 0.1, 0);

// ---- 任务 4（前半）：鼠标 uniform ----------------------------------
// 节点图在 Fn 立即调用时就地搭建，鼠标节点必须先于任务 2 的 Fn 声明；
// uniform() 创建一次，运行期只改 .value——重建节点图等于重建管线
// （讲义 3.2 的头号坑之二）。uniform(vec2(0,0)) 的 .value 就是真 Vector2。
const mouse = uniform(vec2(0, 0));

// ---- 任务 2 + 4（后半）：顶点波浪，鼠标折进频率与相位 --------------
// Fn 是 TSL 的「着色器函数」：闭包捕获 mouse / time / positionLocal 节点，
// 末尾 () 立即调用、把表达式树挂上材质——忘记 () 是讲义 3.2 的头号坑。
// 运算方向遵守 demo 02 的约定：JS 数字只出现在节点方法的参数位
// （node.add(1.4)），写 1.4 + node 不会得到着色器代码。
// 坐标系要点（demo 02 同款）：PlaneGeometry 局部系里 x/y 是展平方向、
// z 是法线方向（网格 rotation.x = -90° 后才指向世界上方）——
// 浪场沿 x/y 展开，波高必须写进本地 z，写进 y 会把海面压扁成水平位移。
material.positionNode = Fn(() => {
  const p = positionLocal;
  const kx = mouse.x.mul(0.2).add(1.4); // 鼠标横移：主浪频率 ±20%
  const phase = mouse.y.mul(0.2);       // 鼠标纵移：整体相位偏移，扰动 ≤ 0.2

  // 三组浪与 Day 2 demo 04 的 waveField 同构：
  // 主浪沿 x 低频大振幅、交叉浪沿 y 中频、斜向细浪沿 (x+y) 高频小振幅——
  // 斜向细浪是「海面不是搓衣板」的关键
  const h = sin(p.x.mul(kx).add(time).add(phase))
    .add(sin(p.y.mul(2.3).add(time.mul(1.3))).mul(0.5))
    .add(sin(p.x.add(p.y).mul(3.1).sub(time.mul(1.7))).mul(0.25));

  // positionNode 是「替换」不是「叠加」：返回完整的新位置
  return vec3(p.x, p.y, h.mul(0.35)); // 振幅整体 ×0.35，克制
})();

// 鼠标 NDC 换算与 Day 2 作业同一套，每帧只写 .value 不碰节点图
chrome.canvas.addEventListener('pointermove', (e) => {
  const r = chrome.canvas.getBoundingClientRect();
  mouse.value.set(
    ((e.clientX - r.left) / r.width) * 2 - 1,
    1 - ((e.clientY - r.top) / r.height) * 2,
  );
});

// ---- 任务 3：高度双色 ----------------------------------------------
// 高度直接读 positionWorld.y：positionNode 位移过的世界坐标会自动流到
// 片元阶段——WGSL 版要手写 varying + struct 字段，这里是一行节点表达式。
// 两段式调色（demo 02 同款手法）：smoothstep 收紧白的占比（只有高波峰
// 才配得上主白），再乘 0.6–1.0 的明度坡把波谷压暗——海面的重心在暗部。
const h01 = positionWorld.y.mul(1.8).add(0.3).clamp(0, 1); // 波高 ±0.61 → 归一
material.colorNode = mix(
  color(0x0f3b3a), color(0xe8ecf4),
  smoothstep(0.25, 0.95, h01),
).mul(h01.mul(0.4).add(0.6));

// ---- 帧循环（骨架已给全：resize 时保持相机比例）-------------------
chrome.startLoop(() => {
  camera.aspect = chrome.width / chrome.height;
  camera.updateProjectionMatrix();
  renderer!.render(scene, camera);
});
