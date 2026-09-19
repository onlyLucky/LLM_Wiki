# 第13课-高级Shader效果

> 日期：2026-08-26
> 状态：进行中
> 评分：待定

---

## 📚 课程内容

### 学习目标
1. 掌握 Dissolve（消融）效果的原理与实现——噪声阈值 + 边缘发光
2. 理解 Hologram（全息）效果的视觉构成——扫描线 + Fresnel + 闪烁
3. 深入 Fresnel 效应的物理本质与 Shader 实现
4. 学会用噪声驱动顶点/片元的 Distortion（扭曲）效果

---

## 🎯 核心概念

### 1. Dissolve（消融）效果

**原理**：用噪声作为遮罩，根据阈值决定哪些像素"消失"，消失边缘添加发光。噪声可以来自纹理采样，也可以程序生成——本课用的是 FBM 程序生成（零资产、参数即风格），这也是物料规格里把"噪声纹理"标注为备用方案的原因。

**核心流程**：
1. 计算每个像素的噪声值（本课：`fbm(vUv * 5.0 + uTime * 0.05, 4) * 0.5 + 0.5`，映射到 `[0, 1]`）
2. 如果噪声值 < 阈值（threshold），用 `discard` 丢弃该片元
3. 如果噪声值在阈值附近的边缘带内，越靠近阈值边缘越亮
4. 基础面用简单漫反射光照正常渲染

```
FBM 噪声值:      0.0 -------- 0.3 ---- 0.5 ---- 0.7 -------- 1.0
                         |       边缘带       |
                 discard区 │  发光边缘  │  正常渲染区
```

**片元着色器核心代码**（与课程 `lessons/13` 的 `dissolveFragmentShader` 一致）：
```glsl
uniform float uTime;
uniform float uThreshold;   // 0~1，消融进度
uniform float uEdgeWidth;   // 边缘发光宽度
uniform vec3 uEdgeColor;    // 边缘发光颜色
uniform vec3 uBaseColor;    // 基础颜色

varying vec2 vUv;
varying vec3 vNormal;       // 简单光照用
varying vec3 vViewDir;      // 预留：本效果暂未用到（课程代码同）

// fbm / perlinNoise / hash / random 为第 12 课定义的噪声工具函数（课程里通过字符串拼接注入）

void main() {
  // FBM 程序生成噪声遮罩：fbm 值域约 [-0.9, 0.9]，* 0.5 + 0.5 映射到约 [0, 1]
  float noise = fbm(vUv * 5.0 + uTime * 0.05, 4) * 0.5 + 0.5;

  // 1. 消融：低于阈值的像素直接丢弃
  if (noise < uThreshold) discard;

  // 2. 边缘发光：在 [threshold, threshold + edgeWidth] 窄带内，
  //    edge 从 0（阈值处）过渡到 1，越靠近阈值边缘越亮
  float edge = smoothstep(uThreshold, uThreshold + uEdgeWidth, noise);
  vec3 emissive = uEdgeColor * (1.0 - edge) * 2.0;

  // 3. 简单光照，让基础面有明暗立体感
  vec3 lightDir = normalize(vec3(1.0, 1.0, 1.0));
  float diffuse = max(dot(vNormal, lightDir), 0.0);
  vec3 color = uBaseColor * (0.2 + diffuse * 0.8) + emissive;

  gl_FragColor = vec4(color, 1.0);
}
```

顶点着色器负责把 `vUv / vNormal / vViewDir` 三个 varying 传进来（完整代码见课程 `lessons/13`）。

**为什么不用贴图**：程序生成零资产（不依赖任何图片文件）、参数即风格（改 `vUv * 5.0` 的缩放、octaves 数就能调出完全不同的消融质感），配合 `uTime * 0.05` 还能让噪声场缓慢流动，产生"活"的消融——这是静态纹理做不到的。纹理方案的优势是需要美术干预的场合（比如手绘特定形状的消融边界）。

**关键细节**：
- `discard` 会完全跳过该片元，不写入深度缓冲和颜色缓冲
- 边缘带越窄，过渡越锐利；越宽，"燃烧"感越明显
- 噪声值需要连续平滑，FBM/Perlin 最合适；白噪声太碎，消融效果不自然

---

### 2. Hologram（全息）效果

**视觉构成**：全息效果 = Fresnel 边缘透明 + 扫描线 + 随机噪点闪烁 + 半透明

**片元着色器**（与课程 `lessons/13` 的 `holoFragmentShader` 一致）：
```glsl
uniform float uTime;
uniform float uFresnelPower;   // Fresnel 衰减指数（课程默认 2.0）
uniform float uScanSpeed;      // 扫描线移动速度（课程默认 3.0）
uniform float uScanDensity;    // 扫描线密度（课程默认 80.0）

varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vViewDir;

// random 为第 12 课定义的噪声工具函数（课程里通过字符串拼接注入）

void main() {
  // 1. Fresnel 边缘发光：正对时 dot ≈ 1，掠射时 dot ≈ 0，边缘越亮
  float fresnel = pow(1.0 - abs(dot(vNormal, vViewDir)), uFresnelPower);

  // 2. 扫描线：水平条纹随时间移动，smoothstep 让线条更清晰
  float scan = sin(vUv.y * uScanDensity - uTime * uScanSpeed) * 0.5 + 0.5;
  scan = smoothstep(0.3, 0.7, scan) * 0.3;

  // 3. 闪烁：随机噪点——step(0.98, ...) 只有小概率位置被点亮，
  //    第二个参数 uTime * 10.0 让噪点每帧换位置，模拟信号干扰的"卡顿"
  float flicker = step(0.98, random(vec2(vUv.x * 100.0, uTime * 10.0))) * 0.15;

  // 4. 合成：青色全息，透明度由三层叠加（+0.05 保证整体隐约可见）
  vec3 holoColor = vec3(0.0, 0.9, 1.0);
  float alpha = fresnel * 0.6 + scan + flicker + 0.05;
  vec3 color = holoColor * (fresnel + scan + flicker);

  gl_FragColor = vec4(color, alpha);
}
```

**各层贡献**：
| 层 | 效果 | 变化频率 |
|----|------|----------|
| Fresnel | 边缘亮、中间暗 | 随视角变化 |
| 扫描线 | 水平亮暗条纹上移 | 随时间匀速 |
| 闪烁 | 随机噪点点亮 | 每帧随机位置 |
| 半透明 | 透过去看到背面 | — |

**两种闪烁写法的取舍**：全局正弦闪烁（`sin(uTime * 10.0) * 0.1 + 0.9`）让整个画面同步变亮变暗，节奏均匀显得"假"；随机噪点闪烁（本课写法）只在少数位置、少数帧点亮，更像真实全息投影的信号干扰。

---

### 3. Fresnel 效应

**物理本质**：光在两种介质交界处同时发生反射和折射，反射/折射的比例取决于**入射角**。

```
入射角 θ = 0°（正对）  → 折射为主，反射很少（玻璃正看是透明的）
入射角 θ → 90°（掠射） → 反射为主（玻璃斜看像镜子）
```

**菲涅尔方程（简化 Schlick 近似）**：
```
F(θ) = F₀ + (1 - F₀) × (1 - cosθ)⁵
```
- `F₀`：垂直入射时的反射率（玻璃约 0.04，金属约 0.5~1.0）
- `cosθ`：视线方向与法线的点积
- 指数 5 控制衰减速度

**Shader 实现**：
```glsl
// vNormal: 世界空间法线（已归一化）
// vViewDir: 视线方向（从表面指向相机，已归一化）
float fresnel = pow(1.0 - dot(vNormal, vViewDir), 3.0);
// 或者用 Schlick 近似
float F0 = 0.04;
float fresnel = F0 + (1.0 - F0) * pow(1.0 - dot(vNormal, vViewDir), 5.0);
```

**Fresnel 在不同材质中的表现**：
| 材质 | F₀ | 效果 |
|------|-----|------|
| 玻璃/水 | 0.02~0.05 | 正面几乎全透明，边缘强反射 |
| 塑料 | 0.04 | 边缘微亮 |
| 金属（铁） | 0.5~0.7 | 正面也明显反射 |
| 金属（金） | 0.9+ | 几乎全反射 |

---

### 4. Distortion（扭曲）效果

**原理**：在顶点着色器中，用噪声函数偏移顶点位置，产生有机的变形动画。

**顶点着色器**：
```glsl
uniform float uTime;
uniform float uDistortionStrength;

varying vec3 vNormal;
varying vec2 vUv;

void main() {
  vec3 pos = position;

  // 用噪声偏移法线方向
  float displacement = sin(pos.x * 5.0 + uTime) *
                       sin(pos.y * 5.0 + uTime * 0.7) *
                       sin(pos.z * 5.0 + uTime * 1.3);
  pos += normal * displacement * uDistortionStrength;

  vNormal = normalMatrix * normal;
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
```

**进阶：用 3D 噪声做更自然的扭曲**：
```glsl
// 用 FBM 噪声替代简单 sin 叠加
float n = fbm(pos * 3.0 + uTime * 0.5, 4);
pos += normal * n * uDistortionStrength;
```

**扭曲方向**：
- 沿法线方向偏移 → 物体"呼吸"、膨胀收缩
- 沿固定方向偏移 → 波浪、飘动
- 沿切线方向偏移 → 扭转、拧毛巾

---

## 💻 代码实现要点

### 1. Dissolve 效果要点

**噪声来源选择**：
- 本课用 FBM 程序生成（零资产、参数即风格），与第 12 课的噪声工具函数复用
- 纹理方案（Perlin Noise 灰度图）是备用方案，适合需要美术手绘特定消融形状的场合；若用纹理，256×256 或 512×512 足够
- 无论哪种来源，噪声都要连续平滑；白噪声太碎，消融效果不自然

**阈值动画**：
```javascript
// 在 animate 循环中递增阈值
material.uniforms.uThreshold.value += 0.005;
// 0 = 完全显示，1 = 完全消失
```

**`discard` 的性能影响**：
- `discard` 会打断 GPU 的 Early-Z 优化
- 大量 `discard` 时性能下降明显
- 替代方案：设置 `gl_FragColor.a = 0` + 开启 `transparent: true`，但不写深度

### 2. Fresnel 效果的方向约定

**容易犯的错**：
```glsl
// ❌ 错误：法线和视线方向不一致
float fresnel = pow(1.0 - dot(normal, viewDirection), 3.0);

// ✅ 正确：确保两者在同一空间（世界空间或视图空间）
vec3 worldNormal = normalize(mat3(modelMatrix) * normal);
vec3 worldViewDir = normalize(cameraPosition - worldPosition);
float fresnel = pow(1.0 - dot(worldNormal, worldViewDir), 3.0);
```

### 3. Hologram 的渲染设置

```javascript
const material = new THREE.ShaderMaterial({
  // ...
  transparent: true,
  side: THREE.DoubleSide,        // 全息需要看到背面
  depthWrite: false,              // 半透明物体不写深度
  blending: THREE.AdditiveBlending // 加法混合更像光效
});
```

### 4. Distortion 的法线重计算

顶点偏移后法线会"错"，两种解决方案：
- **精确**：在顶点着色器中用噪声梯度重算法线
- **近似**：用相邻顶点的差分估算（性能更好）
- **偷懒**：保持原始法线（轻微扭曲时看不出问题）

---

## 🔗 相关资源
- [The Book of Shaders — 3D Noise](https://thebookofshaders.com/13/)
- [Three.js Examples — Shader Sprite](https://threejs.org/examples/#webgl_shader_sprite)
- [Inigo Quilez — Fresnel](https://iquilezles.org/articles/fresnel/)
- [Shadertoy — Dissolve Effect](https://www.shadertoy.com/view/ldSyzV)

---

## 苏格拉底问答

**Q1：`discard` 和设置 `alpha=0` 有什么区别？哪个性能更好？为什么？**

**Q2：全息效果中 Fresnel 反射和普通镜面反射的物理区别是什么？**

**Q3：如果要让消融效果的边缘发光颜色随时间变化，你会怎么修改代码？**

**Q4：消融效果中噪声阈值从 0 到 1 递增，为什么边缘看起来在燃烧而不是整体缩小？**

**Q5：如果 Fresnel 效果和 Phong 高光同时作用在一个物体上，掠射角处它们会怎样叠加？为什么这种组合在车漆材质中很常见？**

---

## 费曼学习法

### Fresnel 效应——用生活经验理解

**生活类比：斜着看玻璃窗**

你站在房间里看窗户：
- **正对着看**（视线垂直于玻璃）→ 能清楚看到对面的风景，玻璃几乎"不存在"
- **斜着看**（视线与玻璃几乎平行）→ 对面变暗了，反而能看到自己房间的倒影，玻璃变成了镜子

这就是 Fresnel 效应：**光线在两种介质交界处，入射角越大，反射越强**。

**为什么？**

想象你往水里扔石头：
- **垂直扔**（90° 入射）→ 石头几乎全进了水里，水花很小（折射为主）
- **斜着扔**（掠射）→ 石头在水面弹了好几下，水花很大（反射为主）

光的行为类似——它在玻璃表面"犹豫"：是穿过去（折射）还是弹回来（反射）？这个"犹豫"的比例由入射角决定。

**Shader 里怎么算？**

```glsl
// 视线和法线的夹角越大（越斜），dot 越小
// 1.0 - dot 就越大，fresnel 值就越大 → 越亮
float fresnel = pow(1.0 - dot(normal, viewDir), 3.0);
```

- 正对（dot ≈ 1）→ fresnel ≈ 0 → 暗（透明）
- 掠射（dot ≈ 0）→ fresnel ≈ 1 → 亮（反射）

**三个关键参数**：
- `F₀`：正对时的反射率（玻璃只有 4%，所以正面几乎全透）
- 指数：控制从透明到反射的过渡速度（指数越大，过渡越突然）
- `dot(normal, viewDir)`：夹角的"遥控器"

**常见误区**：
- Fresnel 不是"边缘检测"——它是物理定律，只和角度有关
- 球体边缘 Fresnel 强不是因为"那是边缘"，而是因为边缘的法线和视线几乎垂直
- 金属的 F₀ 很高（0.5~1.0），所以正面也明显反射——这就是为什么金属看起来"亮"
