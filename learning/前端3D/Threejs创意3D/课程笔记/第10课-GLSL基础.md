# 第10课-GLSL基础

> 日期：2026-08-05
> 状态：进行中
> 评分：待定

---

## 📚 课程内容

### 学习目标
1. 理解 Vertex Shader / Fragment Shader 的结构和执行流程
2. 掌握 `gl_Position` / `gl_FragColor` 的作用
3. 区分 `uniform` / `varying` / `attribute` 三种变量类型
4. 理解 `ShaderMaterial` vs `RawShaderMaterial` 的区别
5. 掌握坐标系变换（模型→世界→观察→裁剪）

---

## 🎯 核心概念

### 1. 渲染管线与着色器

GPU 渲染管线（简化版）：
```
顶点数据 → [Vertex Shader] → 图元装配 → 光栅化 → [Fragment Shader] → 帧缓冲
```

- **Vertex Shader（顶点着色器）**：每个顶点执行一次，计算顶点在屏幕上的最终位置
- **Fragment Shader（片元着色器）**：每个像素执行一次，计算像素最终显示的颜色
- 两者都是用 GLSL（OpenGL Shading Language）编写的程序

### 2. gl_Position — 裁剪空间坐标

顶点着色器必须给 `gl_Position` 赋值，表示顶点在裁剪空间（Clip Space）中的位置。

坐标变换链：
```
模型空间 → [modelMatrix] → 世界空间 → [viewMatrix] → 观察空间 → [projectionMatrix] → 裁剪空间
```

Three.js 提供的内置变量：
| 变量 | 等价于 | 说明 |
|------|--------|------|
| `modelMatrix` | — | 模型→世界（位置/旋转/缩放） |
| `viewMatrix` | — | 世界→观察（相机位置/朝向） |
| `projectionMatrix` | — | 观察→裁剪（透视/正交投影） |
| `modelViewMatrix` | `viewMatrix × modelMatrix` | 预计算的快捷变量 |

标准写法：
```glsl
gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
```

### 3. gl_FragColor — 像素颜色

片元着色器必须给 `gl_FragColor` 赋值，表示像素的 RGBA 颜色。

```glsl
gl_FragColor = vec4(r, g, b, a);  // 分量范围 [0, 1]
```

### 4. 三种变量类型

| 类型 | 作用域 | 数据来源 | 典型用途 |
|------|--------|----------|----------|
| `attribute` | 每个顶点不同 | Three.js 自动传入 | position、normal、uv |
| `uniform` | 所有顶点/像素共享 | JS 手动传入 | 时间、颜色、矩阵 |
| `varying` | 顶点→片元（插值） | 顶点着色器赋值 | UV 坐标、法线、颜色 |

**varying 的插值机制**：
- 顶点着色器给 varying 赋值（每个顶点一个值）
- 光栅化阶段，GPU 在三角形内部自动做线性插值
- 片元着色器拿到的是「插值后」的值（每个像素不同）

### 5. ShaderMaterial vs RawShaderMaterial

| 特性 | ShaderMaterial | RawShaderMaterial |
|------|---------------|-------------------|
| 内置 uniform | ✅ 自动注入（projectionMatrix 等） | ❌ 不注入 |
| 内置 attribute | ✅ 自动声明（position、uv 等） | ❌ 不声明 |
| 精度声明 | ✅ 自动添加 | ❌ 需手动声明 |
| 适用场景 | 快速开发 | 完全自定义 |

ShaderMaterial 代码更简洁（不用手动声明内置变量），RawShaderMaterial 更灵活（完全控制 shader 头部）。

### 6. 常见 GLSL 内置函数

| 函数 | 用途 | 示例 |
|------|------|------|
| `mix(a, b, t)` | 线性插值 | `mix(red, blue, 0.5)` → 紫色 |
| `sin(x)` / `cos(x)` | 周期性波动 | 颜色流动、顶点波浪 |
| `pow(x, n)` | 幂运算 | Fresnel 衰减曲线 |
| `normalize(v)` | 归一化向量 | 法线、光照方向 |
| `dot(a, b)` | 点积 | 光照计算、Fresnel |
| `max(a, b)` | 取最大值 | 防止负值 |
| `clamp(x, min, max)` | 限制范围 | 防止溢出 |
| `step(edge, x)` | 阶跃函数 | 硬边界 |
| `smoothstep(a, b, x)` | 平滑阶跃 | 柔和边界 |

---

## 💻 代码实现要点

### 1. 渐变球体 — 基础 ShaderMaterial

演示：uniform 传时间、varying 传 UV、mix() 混合颜色

```glsl
// Vertex Shader
varying vec2 vUv;
void main() {
  vUv = uv;  // 把 UV 传给片元着色器
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}

// Fragment Shader
uniform float uTime;
uniform vec3 uColorA;
uniform vec3 uColorB;
varying vec2 vUv;
void main() {
  float wave = sin(vUv.y * 6.2831 + uTime) * 0.5 + 0.5;
  vec3 color = mix(uColorA, uColorB, wave);
  gl_FragColor = vec4(color, 1.0);
}
```

### 2. 波浪变形 — 顶点动画

演示：在 Vertex Shader 中修改 position、法线变换、漫反射光照

```glsl
// Vertex Shader
uniform float uTime;
uniform float uAmplitude;
uniform float uFrequency;
varying vec3 vNormal;
varying float vDisplacement;

void main() {
  float displacement = sin(position.x * uFrequency + uTime) * uAmplitude;
  vec3 newPosition = position + normal * displacement;
  vNormal = normalMatrix * normal;
  vDisplacement = displacement;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
```

### 3. Fresnel 效果 — 边缘发光

演示：世界空间法线变换、视线方向计算、pow() 衰减曲线

```glsl
// Fragment Shader
uniform vec3 uCameraPosition;
uniform float uFresnelPower;
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;

void main() {
  vec3 viewDir = normalize(uCameraPosition - vWorldPosition);
  vec3 normal = normalize(vWorldNormal);
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), uFresnelPower);
  vec3 finalColor = uColor + vec3(1.0) * fresnel;
  gl_FragColor = vec4(finalColor, 1.0);
}
```

---

## 🔗 相关资源
- [The Book of Shaders](https://thebookofshaders.com)
- [Three.js ShaderMaterial 文档](https://threejs.org/docs/#api/en/materials/ShaderMaterial)
- [Shadertoy](https://www.shadertoy.com)
- [Inigo Quilez — 文章集合](https://iquilezles.org)
