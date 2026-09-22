// Day 3 · Demo 03 —— TSL EXCITED STATE（激发态）
// 对应讲义 3.3：TSL 计算与数据流。场景是一枚受激的原子：
// 一万六千粒子按能级在轨道上环流——1S 电子云、2P 经线环、3D 四叶；
// 鼠标是激发束，被击中的粒子脱轨、回弹、白闪。
// 教学主线与 Day 2 demo 06 一脉相承：storage 双块、Fn().compute、
// GPU 上初始化、单缓冲原地更新；buffer / 管线 / 绑定组 / 数学库
// 全部交给节点系统——哪怕换一个全新力场，脚手架也一行不用抄。

import '../../../shared/demo.css';
import { createChrome } from '../../../shared/chrome.ts';
import * as THREE from 'three/webgpu';
import {
  Fn, storage, instanceIndex, uniform, vec3, float, time,
  hash, mx_noise_float, mix, color, smoothstep, exp, If, uv,
  step, sqrt,
} from 'three/tsl';

// ---- chrome 整合模式（Day 3 统一照抄） ---------------------------
// onResize 首次触发早于 renderer 构造，两个引用都必须判空/先建
const dpr = Math.min(window.devicePixelRatio || 1, 2);
let renderer: THREE.WebGPURenderer | null = null;
const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 60);

const chrome = createChrome({
  day: 3,
  index: '03',
  title: 'TSL EXCITED STATE',
  tags: ['THREE', 'TSL', 'COMPUTE'],
  hint: '移动鼠标探测电子云，按住激发束——粒子脱轨、回弹并白闪',
  onResize: (w, h) => {
    renderer?.setPixelRatio(dpr);
    renderer?.setSize(w / dpr, h / dpr, false); // false：不改样式，chrome 已管 CSS 尺寸
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  },
});

try {
  renderer = new THREE.WebGPURenderer({ canvas: chrome.canvas, antialias: true });
  await renderer.init(); // 必须在首次 compute / render 之前
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

// ---- 粒子状态：两块 storage，全程待在显存 ------------------------
// Day 2 要手写 GPUBuffer + 32 字节 struct + std430 对齐账；这里
// StorageInstancedBufferAttribute(COUNT, 3) 一行一块，vec3 的布局
// 由节点系统替你算——「vec3f 按 16 字节对齐」的坑从源头消失。
const COUNT = 16384; // 密度与亮度的平衡点：加色混合下数量越多，中心高密度区越容易糊成一片
const positionBuffer = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const velocityBuffer = new THREE.StorageInstancedBufferAttribute(COUNT, 3);
const positions = storage(positionBuffer, 'vec3', COUNT);
const velocities = storage(velocityBuffer, 'vec3', COUNT);

// 模拟参数：uniform 节点，JS 侧改 .value 即可，绑定组由节点系统管理
const dt = uniform(1 / 60); // 秒，帧循环里写入
const mousePos = uniform(new THREE.Vector3(50, 50, 50)); // 水平面上的世界坐标；初值远离场景——束流只在鼠标进场后存在
const exciteStrength = uniform(0.9); // 悬停轻扰，按住发射激发束

// 近似高斯：三个以编号为种子的均匀随机数相加减 1.5（同帧可复现）
const gauss = (offset: number) =>
  hash(instanceIndex.add(offset))
    .add(hash(instanceIndex.add(offset + 0.37)))
    .add(hash(instanceIndex.add(offset + 0.71)))
    .sub(1.5);

// ---- 能级与轨道：确定性派生，两个 kernel 共用 ---------------------
// 粒子按 instanceIndex/COUNT 分三档能级，档位用 step 硬切——
// 每颗粒子的轨道（半径/角速度/刚度/花瓣）从编号确定性推出，
// initKernel 与 updateKernel 各调一次，参数永远对得上。
//   1S（u<0.60）：球面均匀分布的圆环族，半径弥散后叠成体积电子云
//   2P（u<0.85）：环平面全部过 z 轴的经线环，粒子沿经线流动
//   3D（其余）  ：半径按 cos(4θ) 起伏的四叶玫瑰线，四瓣躺平
function deriveOrbit() {
  const u = float(instanceIndex).div(COUNT);
  const sel1 = step(0.60, u);
  const sel3 = step(0.85, u);
  const pick = (a: number, b: number, c: number) =>
    mix(float(a), mix(float(b), float(c), sel3), sel1);

  // 轨道半径 / 进动角速度 / 弹簧刚度 / 花瓣幅度（0 = 纯圆环）
  const R0 = pick(0.62, 1.18, 1.72);
  const omg = pick(1.15, 0.78, 0.52);
  const stiff = pick(8.0, 6.5, 5.0);
  const petal = pick(0.0, 0.0, 0.22);

  // 半径弥散：薄壳投影的中心密度是数学必然（球面投影中心最高、
  // 经线环在两极汇聚），加色混合下必然过饱和成白斑白线——
  //   1S：体积化，sqrt(hash) 填充 30%~100% 半径的云，电子云意象
  //   2P：环半径 80%~115% 随机，两极汇聚点散开成轴向短区
  //   3D：保持四叶玫瑰线的确定性轮廓
  const rSpread = hash(instanceIndex.add(0.83));
  const r1s = R0.mul(float(0.30).add(float(0.70).mul(rSpread.sqrt())));
  const r2p = R0.mul(float(0.80).add(float(0.35).mul(rSpread)));
  const R = mix(r1s, mix(R0, r2p, sel3.oneMinus()), sel1).toVar();

  // 3D 档的四叶瓣方位：i.mod(4)·90° + 小散布，四瓣各归各位
  const phiD = float(instanceIndex.mod(4)).mul(Math.PI / 2)
    .add(hash(instanceIndex.add(0.43)).mul(0.5));
  const phi0 = mix(float(0), mix(float(0), phiD, sel3), sel1);

  // 三档候选法向，硬切选择：1S 球面均匀 / 2P 经线 / 3D 近躺平
  const phiS = hash(instanceIndex.add(0.11)).mul(Math.PI * 2);
  const cosP = hash(instanceIndex.add(0.23)).mul(2).sub(1);
  const sinP = sqrt(float(1).sub(cosP.mul(cosP)));
  const aS = vec3(sinP.mul(phiS.cos()), cosP, sinP.mul(phiS.sin()));
  const phiP = hash(instanceIndex.add(0.37)).mul(Math.PI * 2);
  const aP = vec3(phiP.cos(), 0.0, phiP.sin());
  const azD = hash(instanceIndex.add(0.53)).mul(Math.PI * 2);
  const tilt = hash(instanceIndex.add(0.61)).mul(0.22);
  const aD = vec3(tilt.sin().mul(azD.cos()), tilt.sin().mul(azD.sin()), tilt.cos());
  const axis = mix(aS, mix(aP, aD, sel3), sel1).toVar();

  // 由法向构造正交基（ref 的选择同样用 step 硬切，零分支）
  const ref = mix(vec3(0, 1, 0), vec3(1, 0, 0), step(0.9, axis.y.abs()));
  const ex = axis.cross(ref).normalize();
  const ey = axis.cross(ex).normalize();

  // 锚点相位随时间进动，旋向按粒子随机——环流动感由此而来
  const dir = hash(instanceIndex.add(0.07)).step(0.5).mul(2).sub(1);
  const thetaA = hash(instanceIndex).mul(Math.PI * 2).add(dir.mul(omg).mul(time));
  const phase = thetaA.sub(phi0);
  const rMod = R.mul(float(1).sub(petal).add(petal.mul(phase.mul(4).cos())));
  const pRef = ex.mul(thetaA.cos()).add(ey.mul(thetaA.sin())).mul(rMod);

  return { pRef, thetaA, omg, R, dir, ex, ey, stiff };
}

// ---- 初始化：GPU 上生成三能级轨道 --------------------------------
// Day 2 的初始盘在 JS 里算好再 writeBuffer 上传；这里 initKernel
// 启动时跑一次，两块 buffer 从出生起就没被 CPU 碰过。
const initKernel = Fn(() => {
  const orb = deriveOrbit();

  // 出生即在锚点附近；初速取锚点切向，近快远慢由 ω·R 自然给出
  positions.element(instanceIndex).assign(
    orb.pRef.add(vec3(gauss(0.20), gauss(0.30), gauss(0.40)).mul(0.045)),
  );
  velocities.element(instanceIndex).assign(
    orb.ex.mul(orb.thetaA.sin().negate())
      .add(orb.ey.mul(orb.thetaA.cos()))
      .mul(orb.omg.mul(orb.R).mul(orb.dir))
      .add(vec3(gauss(0.50), gauss(0.60), gauss(0.70)).mul(0.08)),
  );
})().compute(COUNT);

// ---- 更新：弹簧 + 抖动 + 激发，原地读写自己名下的元素 -------------
const updateKernel = Fn(() => {
  const position = positions.element(instanceIndex);
  const velocity = velocities.element(instanceIndex);
  const orb = deriveOrbit();

  // 1) 轨道弹簧：粒子拴在跑动的锚点上（刚度按能级，外层更松更飘逸）
  const accel = orb.pRef.sub(position).mul(orb.stiff).toVar();

  // 2) 量子抖动：噪声场三次偏移采样，幅度压小——是闪烁不是乱流
  const np = position.mul(1.3);
  const nt = time.mul(0.22);
  accel.addAssign(vec3(
    mx_noise_float(np.add(vec3(0.0, 0.0, nt))),
    mx_noise_float(np.add(vec3(31.4, 47.2, nt))),
    mx_noise_float(np.add(vec3(-12.9, 88.3, nt))),
  ).mul(0.30));

  // 3) 激发束：鼠标附近的粒子被推开，平方衰减；回弹交给弹簧
  const fromMouse = position.sub(mousePos);
  const dm2 = fromMouse.dot(fromMouse);
  accel.addAssign(fromMouse.div(dm2.add(1e-4).sqrt())
    .mul(exciteStrength.div(dm2.add(0.18))));

  // 4) 半隐式欧拉 + 指数阻尼 + 限速：与 Day 2 的积分器完全一致
  const nv = velocity.add(accel.mul(dt)).mul(exp(float(-1.9).mul(dt))).toVar();
  const sp = nv.length().toVar();
  If(sp.greaterThan(3.0), () => {
    nv.mulAssign(float(3.0).div(sp));
  });
  position.addAssign(nv.mul(dt));
  velocity.assign(nv);
})().compute(COUNT);

// ---- 渲染：storage 直接喂顶点，材质只描述「长什么样」 ------------
// toAttribute()：渲染管线把这块 buffer 当实例属性读。若直接把
// storage 节点给 positionNode，顶点阶段就是 storage 读取，要额外
// 申请 maxStorageBuffersInVertexStage；toAttribute 走属性通道，无此限制。
const speed01 = velocities.toAttribute().length().mul(0.42).clamp(0.0, 1.0);
// 巡航电子 ω·R ≈ 0.7~0.9 → 蓝青段；激发/回弹峰值 ≈ 3.0 → 白
// 外层电子轨道更快、色带更亮——颜色和物理自洽

const material = new THREE.PointsNodeMaterial();
material.positionNode = positions.toAttribute(); // 粒子去哪，storage 说了算
material.sizeNode = float(0.028).add(speed01.mul(0.030)); // 快的粒子略大；配合透明度压低，高密度区不再连成实线
material.colorNode = mix(
  mix(
    mix(color(0x0A1B3F), color(0x2E7CF6), smoothstep(0.0, 0.45, speed01)), // 深藏蓝 → 亮蓝
    color(0x35E0D0), // 中速段转青
    smoothstep(0.42, 0.78, speed01),
  ),
  color(0xF2FBFF), // 激发态白闪
  smoothstep(0.75, 1.0, speed01),
);
// 柔边圆点：公式与 Day 2 render.wgsl 的 fs 相同，现在是材质上的一行
material.opacityNode = smoothstep(1.0, 0.15, uv().sub(0.5).mul(2.0).length()).mul(0.72); // 加色混合下压低单粒贡献——极点/球心的高密度区才不会瞬间过饱和成白
material.transparent = true;
material.depthWrite = false;
material.blending = THREE.AdditiveBlending; // 电子叠电子，天然辉光

// Sprite + count：一次实例化 draw 画完全部粒子
// （WebGPU 的 point 恒 1 像素，Day 2 手写 6 顶点 quad，Day 3 交给材质）
const particles = new THREE.Sprite(material);
particles.count = COUNT;
particles.frustumCulled = false; // 位置在 GPU 上，CPU 侧包围盒必然算错

// 原子核：一粒缓动的柔光，不参与 compute——纯材质表达
const coreMat = new THREE.PointsNodeMaterial();
coreMat.colorNode = color(0xD9E9FF);
coreMat.opacityNode = smoothstep(1.0, 0.38, uv().sub(0.5).mul(2.0).length());
coreMat.transparent = true;
coreMat.depthWrite = false;
coreMat.blending = THREE.AdditiveBlending;
const coreSize = uniform(0.30);
coreMat.sizeNode = coreSize; // 决定性实验：实例化 Sprite 的 quad 尺寸由材质 sizeNode 决定（世界单位+透视），mesh.scale 不参与
const core = new THREE.Sprite(coreMat);
core.count = 1;
core.frustumCulled = false;

const scene = new THREE.Scene();
scene.add(particles);
scene.add(core);

// 初始化只跑一次（renderer.init 已在上面 await）
renderer.compute(initKernel);

// ---- 鼠标：Raycaster 打到水平面 ----------------------------------
// Day 2 为此手写了 ndcToPlane（射线求交 + 视场半角）约 30 行
const raycaster = new THREE.Raycaster();
const pointer = new THREE.Vector2(10, 10); // NDC 初始在画布外：未进场时平面交点落在远处，中心粒子不受扰动
const hPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0); // y = 0
const mouseTarget = new THREE.Vector3(0, 0, 0);
let mouseNdc: [number, number] = [0, 0];

chrome.canvas.addEventListener('pointermove', (e) => {
  const rect = chrome.canvas.getBoundingClientRect();
  mouseNdc = [
    ((e.clientX - rect.left) / rect.width) * 2 - 1,
    1 - ((e.clientY - rect.top) / rect.height) * 2,
  ];
  pointer.set(mouseNdc[0], mouseNdc[1]);
});
chrome.canvas.addEventListener('pointerdown', () => { exciteStrength.value = 3.0; });
chrome.canvas.addEventListener('pointerup', () => { exciteStrength.value = 0.9; });
chrome.canvas.addEventListener('pointerleave', () => { exciteStrength.value = 0.9; });

// ---- 帧循环：先 compute 后 render，中间零胶水 --------------------
const start = performance.now();
let last = start;

chrome.startLoop((now) => {
  const t = (now - start) / 1000;
  dt.value = Math.min((now - last) / 1000, 1 / 30);
  last = now;

  // 原子核缓慢脉动：实例 quad 的尺寸走 sizeNode，JS 侧改 uniform 即可
  coreSize.value = 0.30 * (1 + 0.06 * Math.sin(t * 2.2));

  // 相机：环绕漂移 + 鼠标视差（幅度克制），斜俯 30° 看全三档轨道
  const az = 0.35 + 0.10 * Math.sin(t * 0.05) + mouseNdc[0] * 0.22;
  const el = 0.50 + mouseNdc[1] * 0.14;
  camera.position.set(
    Math.sin(az) * Math.cos(el) * 4.6,
    Math.sin(el) * 4.6,
    Math.cos(az) * Math.cos(el) * 4.6,
  );
  camera.lookAt(0, 0, 0);

  // 鼠标世界坐标：射线与水平面求交，平滑跟随
  raycaster.setFromCamera(pointer, camera);
  if (raycaster.ray.intersectPlane(hPlane, mouseTarget)) {
    mousePos.value.lerp(mouseTarget, 0.2);
  }

  renderer!.compute(updateKernel); // 全部粒子一步更新
  renderer!.render(scene, camera); // 画刚算完的状态，同帧内零拷贝
});
