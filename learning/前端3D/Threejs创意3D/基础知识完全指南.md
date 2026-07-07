# Three.js 基础知识完全指南

> Three.js 官网：https://threejs.org
> 官方文档：https://threejs.org/docs
> 官方示例：https://threejs.org/examples
> GitHub：https://github.com/mrdoob/three.js

---

## 目录

1. [简介与环境搭建](#1-简介与环境搭建)
2. [三大核心组件](#2-三大核心组件)
3. [几何体 Geometry](#3-几何体-geometry)
4. [材质 Material](#4-材质-material)
5. [灯光 Light](#5-灯光-light)
6. [纹理 Texture](#6-纹理-texture)
7. [控制器与交互](#7-控制器与交互)
8. [模型加载](#8-模型加载)
9. [动画系统](#9-动画系统)
10. [后处理 Post Processing](#10-后处理-post-processing)
11. [着色器 Shader](#11-着色器-shader)
12. [性能优化](#12-性能优化)

---

## 1. 简介与环境搭建

### 1.1 Three.js 是什么

Three.js 是运行在浏览器中的 3D 渲染库，基于 WebGL/WebGPU 封装，提供了场景管理、相机、几何体、材质、灯光、纹理、模型加载、动画、交互和后处理等完整功能。

### 1.2 安装与初始化

```bash
# 创建项目
pnpm create vite threejs-demo --template vanilla
cd threejs-demo
pnpm install three
```

### 1.3 第一个场景

```javascript
import * as THREE from 'three'

// 1. 场景
const scene = new THREE.Scene()

// 2. 相机
const camera = new THREE.PerspectiveCamera(
  75,                                     // FOV 视野角度
  window.innerWidth / window.innerHeight, // 宽高比
  0.1,                                    // 近裁剪面
  1000                                    // 远裁剪面
)
camera.position.z = 3

// 3. 渲染器
const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

// 4. 添加物体
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// 5. 动画循环
function animate() {
  requestAnimationFrame(animate)
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01
  renderer.render(scene, camera)
}
animate()
```

---

## 2. 三大核心组件

### 2.1 场景 Scene

场景是所有 3D 对象的容器，相当于一个 3D 世界。

```javascript
const scene = new THREE.Scene()

// 设置背景色
scene.background = new THREE.Color(0x222222)

// 添加雾效
scene.fog = new THREE.Fog(0xcccccc, 10, 50)

// 添加物体到场景
scene.add(mesh)
scene.add(light)

// 移除物体
scene.remove(mesh)
```

### 2.2 相机 Camera

**透视相机 PerspectiveCamera** - 模拟人眼，近大远小，最常用。

```javascript
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far)

// fov   - 垂直视野角度，单位度，推荐 45-75
// aspect - 宽高比，通常 window.innerWidth / window.innerHeight
// near  - 近裁剪面，比此距离近的不渲染
// far   - 远裁剪面，比此距离远的不渲染

camera.position.set(0, 2, 5) // 相机位置
camera.lookAt(0, 0, 0)       // 看向原点
```

**正交相机 OrthographicCamera** - 无透视效果，适合 2D 或等距视图。

```javascript
const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)

// 通常设置为屏幕尺寸的一半
const aspect = window.innerWidth / window.innerHeight
const frustumSize = 10
const camera = new THREE.OrthographicCamera(
  frustumSize * aspect / -2,
  frustumSize * aspect / 2,
  frustumSize / 2,
  frustumSize / -2,
  0.1,
  1000
)
```

### 2.3 渲染器 Renderer

```javascript
const renderer = new THREE.WebGLRenderer({
  antialias: true,      // 抗锯齿
  alpha: true,          // 透明背景
  powerPreference: 'high-performance'
})

renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio) // 高清屏适配
document.body.appendChild(renderer.domElement)

// 窗口自适应
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
```

---

## 3. 几何体 Geometry

### 3.1 内置几何体一览

```javascript
// 立方体
new THREE.BoxGeometry(width, height, depth, widthSeg, heightSeg, depthSeg)

// 球体
new THREE.SphereGeometry(radius, widthSegments, heightSegments)

// 圆柱体
new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments)

// 平面
new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)

// 圆环
new THREE.TorusGeometry(radius, tube, radialSegments, tubularSegments)

// 圆锥
new THREE.ConeGeometry(radius, height, radialSegments)

// 圆形
new THREE.CircleGeometry(radius, segments)

// 圆环面（甜甜圈）
new THREE.TorusKnotGeometry(radius, tube, tubularSegments, radialSegments)

// 胶囊
new THREE.CapsuleGeometry(radius, length, capSegments, radialSegments)

// 十二面体
new THREE.DodecahedronGeometry(radius, detail)

// 二十面体
new THREE.IcosahedronGeometry(radius, detail)

// 八面体
new THREE.OctahedronGeometry(radius, detail)

// 四面体
new THREE.TetrahedronGeometry(radius, detail)
```

### 3.2 自定义几何体 BufferGeometry

```javascript
const geometry = new THREE.BufferGeometry()

// 顶点数据
const vertices = new Float32Array([
  -1, -1, 0,  // 顶点 0
   1, -1, 0,  // 顶点 1
   0,  1, 0,  // 顶点 2
])
geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3))

// 索引数据（复用顶点）
const indices = new Uint16Array([0, 1, 2])
geometry.setIndex(new THREE.BufferAttribute(indices, 1))

// 法线数据
const normals = new Float32Array([
  0, 0, 1,
  0, 0, 1,
  0, 0, 1,
])
geometry.setAttribute('normal', new THREE.BufferAttribute(normals, 3))

// UV 数据（纹理映射）
const uvs = new Float32Array([
  0, 0,
  1, 0,
  0.5, 1,
])
geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2))
```

---

## 4. 材质 Material

### 4.1 常用材质类型

```javascript
// 基础材质 - 不受光照影响
const basic = new THREE.MeshBasicMaterial({
  color: 0xff0000,
  wireframe: false,
  transparent: true,
  opacity: 0.8
})

// 标准材质 - PBR，最常用
const standard = new THREE.MeshStandardMaterial({
  color: 0x00ff00,
  roughness: 0.5,    // 粗糙度 0-1
  metalness: 0.5,    // 金属度 0-1
  flatShading: false // 平面着色
})

// 物理材质 - PBR 增强版
const physical = new THREE.MeshPhysicalMaterial({
  color: 0x0000ff,
  clearcoat: 1.0,           // 清漆层
  clearcoatRoughness: 0.1,  // 清漆粗糙度
  transmission: 0.9,        // 透射（玻璃效果）
  ior: 1.5                  // 折射率
})

// Phong 材质 - 经典光照，有高光
const phong = new THREE.MeshPhongMaterial({
  color: 0xff00ff,
  shininess: 100,       // 高光强度
  specular: 0x444444    // 高光颜色
})

// Lambert 材质 - 无高光，性能好
const lambert = new THREE.MeshLambertMaterial({
  color: 0xffff00
})

// 法线材质 - 可视化法线方向
const normal = new THREE.MeshNormalMaterial()

// 深度材质 - 可视化深度
const depth = new THREE.MeshDepthMaterial()
```

### 4.2 材质属性对比表

| 材质 | 受光照 | 高光 | PBR | 性能 | 适用场景 |
|:---:|:---:|:---:|:---:|:---:|:---|
| Basic | × | × | × | ★★★★★ | 线框、2D |
| Lambert | ✓ | × | × | ★★★★ | 无高光物体 |
| Phong | ✓ | ✓ | × | ★★★ | 经典光照 |
| Standard | ✓ | ✓ | ✓ | ★★★ | 通用 PBR |
| Physical | ✓ | ✓ | ✓★ | ★★ | 玻璃、清漆 |

---

## 5. 灯光 Light

### 5.1 灯光类型

```javascript
// 环境光 - 均匀照亮所有面，无方向
const ambient = new THREE.AmbientLight(0xffffff, 0.5)
scene.add(ambient)

// 方向光 - 平行光线，模拟太阳，支持阴影
const directional = new THREE.DirectionalLight(0xffffff, 1)
directional.position.set(5, 10, 5)
scene.add(directional)

// 点光源 - 从一个点向四周发射，支持阴影
const point = new THREE.PointLight(0xffffff, 1, 100, 2)
// color, intensity, distance, decay
point.position.set(0, 5, 0)
scene.add(point)

// 聚光灯 - 锥形光束，支持阴影
const spot = new THREE.SpotLight(0xffffff)
spot.position.set(0, 10, 0)
spot.angle = Math.PI / 4      // 光束角度
spot.penumbra = 0.3            // 边缘柔和度
spot.decay = 2                 // 衰减
scene.add(spot)

// 半球光 - 模拟天空+地面环境光
const hemisphere = new THREE.HemisphereLight(
  0xffffbb, // 天空颜色
  0x080820, // 地面颜色
  0.5       // 强度
)
scene.add(hemisphere)

// 矩形区域光 - 模拟窗户等面光源
const rectArea = new THREE.RectAreaLight(0xffffff, 2, 4, 4)
rectArea.position.set(0, 5, 0)
rectArea.lookAt(0, 0, 0)
scene.add(rectArea)
```

### 5.2 阴影配置

```javascript
// 1. 渲染器启用阴影
renderer.shadowMap.enabled = true
renderer.shadowMap.type = THREE.PCFSoftShadowMap // 柔和阴影

// 2. 光源启用投射阴影
directional.castShadow = true

// 3. 配置阴影相机（方向光）
directional.shadow.mapSize.width = 2048   // 阴影贴图分辨率
directional.shadow.mapSize.height = 2048
directional.shadow.camera.near = 0.5
directional.shadow.camera.far = 50
directional.shadow.camera.left = -10
directional.shadow.camera.right = 10
directional.shadow.camera.top = 10
directional.shadow.camera.bottom = -10

// 4. 物体投射阴影
mesh.castShadow = true

// 5. 物体接收阴影
plane.receiveShadow = true
```

---

## 6. 纹理 Texture

### 6.1 图片纹理

```javascript
import { TextureLoader } from 'three'

const textureLoader = new TextureLoader()

// 加载纹理
const texture = textureLoader.load('/textures/color.jpg')

// 设置纹理参数
texture.wrapS = THREE.RepeatWrapping  // 水平重复
texture.wrapT = THREE.RepeatWrapping  // 垂直重复
texture.repeat.set(2, 2)              // 重复次数

// 应用到材质
const material = new THREE.MeshStandardMaterial({
  map: texture
})
```

### 6.2 PBR 纹理贴图

```javascript
const material = new THREE.MeshStandardMaterial({
  map: colorTexture,              // 颜色贴图 (albedo)
  normalMap: normalTexture,       // 法线贴图 - 凹凸细节
  roughnessMap: roughTexture,     // 粗糙度贴图
  metalnessMap: metalTexture,     // 金属度贴图
  aoMap: aoTexture,               // 环境光遮蔽
  displacementMap: heightTexture, // 位移贴图
  displacementScale: 0.1,         // 位移强度
  emissiveMap: emissiveTexture,   // 自发光贴图
  emissive: 0x000000,             // 自发光颜色
  emissiveIntensity: 1            // 自发光强度
})
```

### 6.3 环境贴图

```javascript
import { CubeTextureLoader, RGBELoader } from 'three'

// 立方体贴图
const cubeTextureLoader = new CubeTextureLoader()
const envMap = cubeTextureLoader.load([
  'px.jpg', 'nx.jpg', // 右 左
  'py.jpg', 'ny.jpg', // 上 下
  'pz.jpg', 'nz.jpg'  // 前 后
])

// HDR 环境贴图（更常用）
const rgbeLoader = new RGBELoader()
rgbeLoader.load('environment.hdr', (texture) => {
  texture.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = texture  // 所有 PBR 材质自动使用
  scene.background = texture   // 作为背景
})
```

---

## 7. 控制器与交互

### 7.1 OrbitControls

```javascript
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'

const controls = new OrbitControls(camera, renderer.domElement)

// 基础配置
controls.enableDamping = true   // 阻尼（惯性）
controls.dampingFactor = 0.05
controls.enableZoom = true      // 允许缩放
controls.enablePan = true       // 允许平移
controls.enableRotate = true    // 允许旋转

// 限制范围
controls.minDistance = 2        // 最小缩放距离
controls.maxDistance = 20       // 最大缩放距离
controls.maxPolarAngle = Math.PI / 2  // 限制垂直角度

// 自动旋转
controls.autoRotate = true
controls.autoRotateSpeed = 2

// 在动画循环中更新
function animate() {
  requestAnimationFrame(animate)
  controls.update() // 必须调用
  renderer.render(scene, camera)
}
```

### 7.2 射线拾取 Raycaster

```javascript
const raycaster = new THREE.Raycaster()
const mouse = new THREE.Vector2()

// 监听点击
window.addEventListener('click', (event) => {
  // 计算归一化设备坐标 (-1 到 +1)
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1

  // 更新射线
  raycaster.setFromCamera(mouse, camera)

  // 检测交点
  const intersects = raycaster.intersectObjects(scene.children, true)

  if (intersects.length > 0) {
    const hit = intersects[0]
    console.log('点击物体:', hit.object.name)
    console.log('交点坐标:', hit.point)
    console.log('距离:', hit.distance)

    // 高亮效果
    hit.object.material.color.set(0xff0000)
  }
})

// 持续检测（鼠标移动 hover 效果）
window.addEventListener('mousemove', (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1
  mouse.y = -(event.clientY / window.innerHeight) * 2 + 1
})
```

### 7.3 鼠标/键盘事件

```javascript
// 鼠标事件
renderer.domElement.addEventListener('click', onClick)
renderer.domElement.addEventListener('dblclick', onDoubleClick)
renderer.domElement.addEventListener('contextmenu', onRightClick)
renderer.domElement.addEventListener('mousemove', onMouseMove)
renderer.domElement.addEventListener('mousedown', onMouseDown)
renderer.domElement.addEventListener('mouseup', onMouseUp)
renderer.domElement.addEventListener('wheel', onWheel)

// 键盘事件
window.addEventListener('keydown', (e) => {
  switch (e.code) {
    case 'Space':
      // 空格键
      break
    case 'ArrowUp':
      // 方向键上
      break
  }
})
```

---

## 8. 模型加载

### 8.1 GLTF/GLB（推荐格式）

```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'

// 基础加载
const gltfLoader = new GLTFLoader()

gltfLoader.load(
  '/models/character.glb',
  (gltf) => {
    const model = gltf.scene
    scene.add(model)

    // 遍历模型，启用阴影
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true
        child.receiveShadow = true
      }
    })
  },
  (progress) => {
    console.log('加载进度:', progress.loaded / progress.total * 100 + '%')
  },
  (error) => {
    console.error('加载错误:', error)
  }
)

// DRACO 压缩加载（更小文件）
const dracoLoader = new DRACOLoader()
dracoLoader.setDecoderPath('/draco/')
gltfLoader.setDRACOLoader(dracoLoader)

// 异步加载
async function loadModel() {
  const gltf = await gltfLoader.loadAsync('/models/scene.glb')
  scene.add(gltf.scene)
}
```

### 8.2 播放模型动画

```javascript
let mixer = null

gltfLoader.load('/models/character.glb', (gltf) => {
  scene.add(gltf.scene)

  // 创建动画混合器
  mixer = new THREE.AnimationMixer(gltf.scene)

  // 播放第一个动画
  const action = mixer.clipAction(gltf.animations[0])
  action.play()

  // 或播放指定动画
  const walkAnim = THREE.AnimationClip.findByName(gltf.animations, 'Walk')
  if (walkAnim) {
    const walkAction = mixer.clipAction(walkAnim)
    walkAction.play()
  }
})

// 在动画循环中更新
const clock = new THREE.Clock()
function animate() {
  requestAnimationFrame(animate)
  const delta = clock.getDelta()
  if (mixer) mixer.update(delta) // 更新动画
  renderer.render(scene, camera)
}
```

### 8.3 OBJ 加载

```javascript
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js'
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js'

// 先加载材质，再加载模型
const mtlLoader = new MTLLoader()
mtlLoader.load('/models/model.mtl', (materials) => {
  materials.preload()

  const objLoader = new OBJLoader()
  objLoader.setMaterials(materials)
  objLoader.load('/models/model.obj', (obj) => {
    scene.add(obj)
  })
})
```

---

## 9. 动画系统

### 9.1 基础动画循环

```javascript
function animate() {
  requestAnimationFrame(animate)

  // 旋转
  mesh.rotation.x += 0.01
  mesh.rotation.y += 0.01

  // 移动
  mesh.position.x = Math.sin(Date.now() * 0.001) * 2

  // 缩放
  mesh.scale.set(1.5, 1.5, 1.5)

  // 渲染
  renderer.render(scene, camera)
}
animate()
```

### 9.2 Clock 时间控制

```javascript
const clock = new THREE.Clock()

function animate() {
  requestAnimationFrame(animate)

  const elapsedTime = clock.getElapsedTime() // 总经过时间
  const deltaTime = clock.getDelta()         // 两帧间隔

  // 基于时间的动画（帧率无关）
  mesh.position.y = Math.sin(elapsedTime) * 2
  mesh.rotation.z = elapsedTime * 0.5

  renderer.render(scene, camera)
}
```

### 9.3 GSAP 动画库集成

```javascript
import gsap from 'gsap'

// 位置动画
gsap.to(mesh.position, {
  x: 3,
  duration: 2,
  ease: 'power2.inOut'
})

// 旋转动画
gsap.to(mesh.rotation, {
  y: Math.PI * 2,
  duration: 3,
  ease: 'bounce.out'
})

// 时间线
const tl = gsap.timeline()
tl.to(mesh.position, { x: 2, duration: 1 })
tl.to(mesh.position, { y: 2, duration: 1 }, '-=0.5') // 重叠 0.5 秒
tl.to(mesh.scale, { x: 2, y: 2, z: 2, duration: 0.5 })
```

---

## 10. 后处理 Post Processing

### 10.1 基础配置

```javascript
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js'
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js'
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js'
import { GammaCorrectionShader } from 'three/addons/shaders/GammaCorrectionShader.js'

// 创建合成器
const composer = new EffectComposer(renderer)

// 渲染 Pass
composer.addPass(new RenderPass(scene, camera))

// 泛光效果
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5,  // 强度
  0.4,  // 半径
  0.85  // 阈值
)
composer.addPass(bloomPass)

// 伽马校正（颜色修正）
const gammaPass = new ShaderPass(GammaCorrectionShader)
composer.addPass(gammaPass)

// 窗口自适应
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
})

// 动画循环使用 composer
function animate() {
  requestAnimationFrame(animate)
  composer.render() // 替代 renderer.render()
}
```

### 10.2 常用后处理效果

```javascript
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js'
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js'
import { DotScreenPass } from 'three/addons/postprocessing/DotScreenPass.js'
import { GlitchPass } from 'three/addons/postprocessing/GlitchPass.js'
import { OutlinePass } from 'three/addons/postprocessing/OutlinePass.js'
import { SMAAPass } from 'three/addons/postprocessing/SMAAPass.js'

// 泛光
composer.addPass(new UnrealBloomPass(resolution, strength, radius, threshold))

// 胶片效果
composer.addPass(new FilmPass(noiseIntensity, scanlinesIntensity, scanlinesCount, grayscale))

// 点阵效果
composer.addPass(new DotScreenPass(center, angle, scale))

// 故障效果
composer.addPass(new GlitchPass())

// 描边效果
const outlinePass = new OutlinePass(resolution, scene, camera)
outlinePass.selectedObjects = [mesh] // 要描边的物体
composer.addPass(outlinePass)

// SMAA 抗锯齿
composer.addPass(new SMAAPass(resolution.x, resolution.y))
```

---

## 11. 着色器 Shader

### 11.1 GLSL 基础语法

```glsl
// 数据类型
float a = 1.0;           // 浮点数
int b = 1;               // 整数
bool c = true;           // 布尔
vec2 d = vec2(1.0, 2.0); // 二维向量
vec3 e = vec3(1.0);      // 三维向量 (颜色 RGB / 坐标 XYZ)
vec4 f = vec4(1.0);      // 四维向量 (颜色 RGBA)
mat4 g = mat4(1.0);      // 4x4 矩阵
sampler2D h;             // 2D 纹理采样器

// 常用函数
float result = sin(x);        // 正弦
float result = cos(x);        // 余弦
float result = abs(x);        // 绝对值
float result = clamp(x, 0.0, 1.0); // 限制范围
float result = mix(a, b, t);  // 线性插值
float result = step(edge, x); // 阶跃
float result = smoothstep(a, b, x); // 平滑阶跃
float result = length(v);     // 向量长度
vec3 result = normalize(v);   // 归一化
float result = dot(a, b);     // 点积
vec3 result = cross(a, b);    // 叉积
```

### 11.2 ShaderMaterial 实战

```javascript
// 顶点着色器
const vertexShader = `
  uniform float uTime;
  uniform float uFrequency;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    vUv = uv;
    
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // 波浪效果
    float elevation = sin(modelPosition.x * uFrequency + uTime) * 0.1;
    elevation += sin(modelPosition.z * uFrequency + uTime) * 0.1;
    modelPosition.y += elevation;
    vElevation = elevation;
    
    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;
    
    gl_Position = projectedPosition;
  }
`

// 片元着色器
const fragmentShader = `
  uniform float uTime;
  uniform vec3 uColor;
  uniform sampler2D uTexture;
  
  varying vec2 vUv;
  varying float vElevation;
  
  void main() {
    // 基于高度的颜色混合
    vec3 color = mix(uColor, vec3(1.0, 1.0, 1.0), vElevation * 5.0);
    
    // 纹理采样
    // vec4 textureColor = texture2D(uTexture, vUv);
    
    gl_FragColor = vec4(color, 1.0);
  }
`

// 创建材质
const shaderMaterial = new THREE.ShaderMaterial({
  vertexShader,
  fragmentShader,
  uniforms: {
    uTime: { value: 0 },
    uFrequency: { value: 10 },
    uColor: { value: new THREE.Color(0x00ff00) }
  },
  side: THREE.DoubleSide
})

// 在动画循环中更新 uniform
function animate() {
  requestAnimationFrame(animate)
  shaderMaterial.uniforms.uTime.value = clock.getElapsedTime()
  renderer.render(scene, camera)
}
```

### 11.3 内置 Uniform 变量

Three.js 自动传入以下变量，无需手动声明：

```glsl
// 顶点着色器可用
attribute vec3 position;  // 顶点位置
attribute vec3 normal;    // 顶点法线
attribute vec2 uv;        // 纹理坐标

uniform mat4 modelMatrix;       // 模型矩阵
uniform mat4 viewMatrix;        // 视图矩阵
uniform mat4 projectionMatrix;  // 投影矩阵
uniform mat4 modelViewMatrix;   // modelMatrix * viewMatrix
uniform mat3 normalMatrix;      // 法线变换矩阵

// 片元着色器可用
uniform vec3 cameraPosition;    // 相机位置
```

---

## 12. 性能优化

### 12.1 按需渲染

```javascript
// 只在需要时渲染，而非每帧
let needsRender = true

controls.addEventListener('change', () => {
  needsRender = true
})

function animate() {
  requestAnimationFrame(animate)
  
  if (needsRender) {
    renderer.render(scene, camera)
    needsRender = false
  }
}
```

### 12.2 合并几何体

```javascript
import { mergeGeometries } from 'three/addons/utils/BufferGeometryUtils.js'

// 大量相同材质的物体，合并为一个
const geometries = []
for (let i = 0; i < 1000; i++) {
  const box = new THREE.BoxGeometry(1, 1, 1)
  box.translate(Math.random() * 50, 0, Math.random() * 50)
  geometries.push(box)
}

const mergedGeometry = mergeGeometries(geometries)
const material = new THREE.MeshStandardMaterial({ color: 0x00ff00 })
const mergedMesh = new THREE.Mesh(mergedGeometry, material)
scene.add(mergedMesh)
```

### 12.3 实例化渲染 InstancedMesh

```javascript
// 大量相同几何体和材质，不同变换
const geometry = new THREE.BoxGeometry(1, 1, 1)
const material = new THREE.MeshStandardMaterial()
const count = 10000

const instancedMesh = new THREE.InstancedMesh(geometry, material, count)

const dummy = new THREE.Object3D()
const color = new THREE.Color()

for (let i = 0; i < count; i++) {
  dummy.position.set(
    Math.random() * 100 - 50,
    Math.random() * 100 - 50,
    Math.random() * 100 - 50
  )
  dummy.updateMatrix()
  instancedMesh.setMatrixAt(i, dummy.matrix)
  
  // 可选：每个实例不同颜色
  color.setHSL(Math.random(), 1, 0.5)
  instancedMesh.setColorAt(i, color)
}

instancedMesh.instanceMatrix.needsUpdate = true
scene.add(instancedMesh)
```

### 12.4 LOD 细节层级

```javascript
const lod = new THREE.LOD()

// 不同距离使用不同精度模型
const highDetail = new THREE.SphereGeometry(1, 64, 64)   // 近距离
const midDetail = new THREE.SphereGeometry(1, 32, 32)    // 中距离
const lowDetail = new THREE.SphereGeometry(1, 16, 16)    // 远距离

lod.addLevel(new THREE.Mesh(highDetail, material), 0)    // 0-50 使用
lod.addLevel(new THREE.Mesh(midDetail, material), 50)    // 50-100 使用
lod.addLevel(new THREE.Mesh(lowDetail, material), 100)   // 100+ 使用

scene.add(lod)
```

### 12.5 资源释放 dispose

```javascript
// 释放几何体
geometry.dispose()

// 释放材质
material.dispose()

// 释放纹理
texture.dispose()

// 释放渲染器
renderer.dispose()

// 遍历场景释放所有资源
function disposeScene(scene) {
  scene.traverse((object) => {
    if (object.geometry) object.geometry.dispose()
    if (object.material) {
      if (Array.isArray(object.material)) {
        object.material.forEach(material => material.dispose())
      } else {
        object.material.dispose()
      }
    }
  })
}
```

### 12.6 其他优化建议

```javascript
// 1. 设置像素比（不要超过 2）
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

// 2. 使用 BufferGeometry（非已废弃的 Geometry）

// 3. 使用 Object3D.matrixAutoUpdate = false 对于静态物体
staticMesh.matrixAutoUpdate = false

// 4. 使用 frustumCulled = true（默认）剔除视锥外物体

// 5. 使用合适的阴影贴图分辨率
directionalLight.shadow.mapSize.set(1024, 1024) // 非必要不用 2048+

// 6. 避免在动画循环中创建对象
const tempVec = new THREE.Vector3() // 循环外创建
```

---

## 附录：常用工具函数

```javascript
// 窗口自适应
function onWindowResize(camera, renderer) {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
}

// 全屏切换
function toggleFullscreen() {
  if (!document.fullscreenElement) {
    renderer.domElement.requestFullscreen()
  } else {
    document.exitFullscreen()
  }
}

// 截图
function takeScreenshot(renderer) {
  renderer.render(scene, camera)
  const dataUrl = renderer.domElement.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = 'screenshot.png'
  link.href = dataUrl
  link.click()
}

// 坐标转换：屏幕坐标 -> 3D 坐标
function screenToWorld(x, y, camera, targetZ = 0) {
  const vec = new THREE.Vector3()
  vec.set(
    (x / window.innerWidth) * 2 - 1,
    -(y / window.innerHeight) * 2 + 1,
    0.5
  )
  vec.unproject(camera)
  const dir = vec.sub(camera.position).normalize()
  const distance = (targetZ - camera.position.z) / dir.z
  return camera.position.clone().add(dir.multiplyScalar(distance))
}
```
