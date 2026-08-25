# 第11课-GLSL数学函数

> 日期：2026-08-19
> 状态：**已完成**
> 评分：9.85/10

---

## 课程内容

### 学习目标
1. 掌握 GLSL 内置数学函数（mix/step/smoothstep/sin/cos/pow）
2. 理解向量运算（dot/cross/normalize/length/distance）
3. 学会用数学函数画基本形状（圆形/矩形/六边形）
4. 理解坐标系变换和 UV 映射
5. 掌握 fract/mod 等周期函数

---

## 核心概念

### 1. 数学函数概览

GLSL 提供了丰富的内置数学函数，分为几大类：

**标量函数**（作用于单个值）：
| 函数 | 用途 | 公式 | 示例 |
|------|------|------|------|
| `abs(x)` | 绝对值 | \|x\| | `abs(-0.5)` = 0.5 |
| `sign(x)` | 符号 | -1/0/+1 | `sign(-3.0)` = -1.0 |
| `floor(x)` | 向下取整 | ⌊x⌋ | `floor(1.7)` = 1.0 |
| `ceil(x)` | 向上取整 | ⌈x⌉ | `ceil(1.2)` = 2.0 |
| `fract(x)` | 小数部分 | x - floor(x) | `fract(1.7)` = 0.7 |
| `mod(x, y)` | 取模 | x - y * floor(x/y) | `mod(5.0, 3.0)` = 2.0 |
| `min(a, b)` | 最小值 | min(a, b) | `min(3.0, 5.0)` = 3.0 |
| `max(a, b)` | 最大值 | max(a, b) | `max(3.0, 5.0)` = 5.0 |
| `clamp(x, a, b)` | 限制范围 | min(max(x, a), b) | `clamp(1.5, 0.0, 1.0)` = 1.0 |
| `mix(a, b, t)` | 线性插值 | a * (1-t) + b * t | `mix(0.0, 10.0, 0.5)` = 5.0 |
| `step(edge, x)` | 阶跃函数 | x < edge ? 0.0 : 1.0 | `step(0.5, 0.7)` = 1.0 |
| `smoothstep(a, b, x)` | 平滑阶跃 | Hermite 插值 | `smoothstep(0.0, 1.0, 0.5)` = 0.5 |

**三角函数**：
| 函数 | 用途 | 周期 |
|------|------|------|
| `sin(x)` | 正弦 | 2π |
| `cos(x)` | 余弦 | 2π |
| `tan(x)` | 正切 | π |
| `asin(x)` | 反正弦 | [-π/2, π/2] |
| `acos(x)` | 反余弦 | [0, π] |
| `atan(x)` / `atan(x, y)` | 反正切 | [-π/2, π/2] / [-π, π] |

**指数函数**：
| 函数 | 用途 | 示例 |
|------|------|------|
| `pow(x, n)` | 幂运算 | `pow(2.0, 3.0)` = 8.0 |
| `exp(x)` | e^x | `exp(1.0)` ≈ 2.718 |
| `log(x)` | ln(x) | `log(2.718)` ≈ 1.0 |
| `sqrt(x)` | 平方根 | `sqrt(9.0)` = 3.0 |
| `inversesqrt(x)` | 1/√x | `inversesqrt(9.0)` = 0.333 |

---

### 2. 向量函数

向量是 shader 中最常用的数据类型，GLSL 提供了强大的向量运算函数：

| 函数 | 用途 | 公式 | 示例 |
|------|------|------|------|
| `length(v)` | 向量长度 | √(x² + y² + ...) | `length(vec2(3.0, 4.0))` = 5.0 |
| `distance(a, b)` | 两点距离 | length(a - b) | `distance(vec2(0), vec2(3,4))` = 5.0 |
| `dot(a, b)` | 点积 | Σ(a[i] * b[i]) | `dot(vec3(1,0,0), vec3(0,1,0))` = 0.0 |
| `cross(a, b)` | 叉积（仅 vec3） | 垂直于 a 和 b 的向量 | `cross(vec3(1,0,0), vec3(0,1,0))` = vec3(0,0,1) |
| `normalize(v)` | 归一化 | v / length(v) | `normalize(vec2(3,4))` = vec2(0.6, 0.8) |
| `reflect(i, n)` | 反射 | i - 2 * dot(n, i) * n | 入射光 i 关于法线 n 的反射 |
| `refract(i, n, eta)` | 折射 | 斯涅尔定律 | 入射光 i 的折射方向 |

**点积的几何意义**：
- `dot(a, b) = |a| * |b| * cos(θ)`，其中 θ 是两向量夹角
- 当 a 和 b 都是单位向量时，`dot(a, b) = cos(θ)`
- 用途：计算光照（法线与光线方向的夹角）、Fresnel（视线与法线的夹角）

**叉积的几何意义**：
- `cross(a, b)` 返回一个垂直于 a 和 b 的向量
- 长度 = `|a| * |b| * sin(θ)`
- 方向遵循右手定则

---

### 3. step 和 smoothstep 的区别

**step(edge, x)**：硬边界，二选一
```glsl
float result = step(0.5, x);
// x < 0.5 → result = 0.0
// x >= 0.5 → result = 1.0
```

**smoothstep(edge0, edge1, x)**：平滑边界，渐变过渡
```glsl
float result = smoothstep(0.3, 0.7, x);
// x < 0.3 → result = 0.0
// x > 0.7 → result = 1.0
// 0.3 < x < 0.7 → result = 平滑过渡（Hermite 插值）
```

**视觉对比**：
- step：锐利的线条，适合硬边界（如消融效果的边缘）
- smoothstep：柔和的渐变，适合平滑过渡（如渐变、阴影边缘）

**smoothstep 的内部实现**：
```glsl
// Hermite 插值公式
float t = clamp((x - edge0) / (edge1 - edge0), 0.0, 1.0);
float result = t * t * (3.0 - 2.0 * t);
```

---

### 4. 用数学函数画基本形状

#### 4.1 圆形

**原理**：到圆心的距离 < 半径 → 在圆内

```glsl
float circle(vec2 uv, vec2 center, float radius) {
  float d = distance(uv, center);
  return step(d, radius);  // d < radius → 1.0（白色），否则 0.0（黑色）
}

// 或者用 smoothstep 做柔和边缘
float circleSmooth(vec2 uv, vec2 center, float radius, float softness) {
  float d = distance(uv, center);
  return smoothstep(radius, radius - softness, d);
}
```

#### 4.2 矩形

**原理**：四个边界条件同时满足

```glsl
float rectangle(vec2 uv, vec2 center, vec2 size) {
  vec2 d = abs(uv - center);  // 对称到第一象限
  float result = step(d.x, size.x * 0.5) * step(d.y, size.y * 0.5);
  return result;
}
```

#### 4.3 六边形

**原理**：六边形的 SDF（有符号距离场）

```glsl
float hexagon(vec2 uv, vec2 center, float radius) {
  vec2 d = abs(uv - center);
  float result = max(
    dot(d, normalize(vec2(1.0, 1.73))),  // 1.73 ≈ √3
    d.x
  );
  return smoothstep(radius, radius - 0.01, result);
}
```

---

### 5. fract 和 mod 的常见用法

**fract(x)**：取小数部分，返回 [0, 1) 的值

**常见用途**：
1. **重复图案**：
   ```glsl
   // 让 UV 坐标在 [0, 1] 范围内重复
   vec2 repeatedUV = fract(uv * 5.0);  // 5x5 的网格重复
   ```

2. **周期性动画**：
   ```glsl
   // 配合 time 实现循环动画
   float cycle = fract(time * 0.5);  // 每 2 秒循环一次
   ```

3. **噪声函数的基础**：
   ```glsl
   // 伪随机数生成
   float random(vec2 st) {
     return fract(sin(dot(st, vec2(12.9898, 78.233))) * 43758.5453);
   }
   ```

**mod(x, y)**：取模，返回 x 除以 y 的余数

**与 fract 的关系**：
- `fract(x) = mod(x, 1.0)`
- `mod(x, y) = y * fract(x / y)`

---

### 6. 坐标系变换

#### 6.1 UV 坐标系

- 默认 UV 范围：[0, 1]
- (0, 0) = 左下角，(1, 1) = 右上角
- 可以通过变换改变原点位置

```glsl
// 将原点移到中心
vec2 centeredUV = uv - 0.5;  // 范围 [-0.5, 0.5]

// 或者用 -1 到 1 的范围
vec2 normalizedUV = uv * 2.0 - 1.0;  // 范围 [-1, 1]
```

#### 6.2 极坐标系

- r = length(uv)：到原点的距离
- θ = atan(uv.y, uv.x)：角度（范围 [-π, π]）

```glsl
vec2 centeredUV = uv - 0.5;
float r = length(centeredUV);
float theta = atan(centeredUV.y, centeredUV.x);

// 用极坐标做径向图案
float pattern = sin(theta * 8.0) * 0.5 + 0.5;  // 8 个花瓣
```

---

## 代码实现要点

### 1. 渐变效果 — mix + smoothstep

```glsl
// 水平渐变
float gradientH = mix(0.0, 1.0, uv.x);

// 垂直渐变
float gradientV = mix(0.0, 1.0, uv.y);

// 对角渐变
float gradientDiagonal = mix(0.0, 1.0, (uv.x + uv.y) * 0.5);

// 径向渐变（从中心向外）
vec2 centeredUV = uv - 0.5;
float gradientRadial = length(centeredUV) * 2.0;

// 使用 smoothstep 控制渐变范围
float smoothGradient = smoothstep(0.2, 0.8, uv.x);
```

### 2. 波浪效果 — sin/cos

```glsl
// 基础正弦波
float wave = sin(uv.x * 10.0 + uTime) * 0.5 + 0.5;

// 叠加多个频率（更复杂的波形）
float wave2 = sin(uv.x * 20.0 + uTime * 1.5) * 0.25;
float wave3 = sin(uv.x * 40.0 + uTime * 0.5) * 0.125;
float combinedWave = wave + wave2 + wave3;

// 径向波浪
vec2 centeredUV = uv - 0.5;
float radialWave = sin(length(centeredUV) * 20.0 - uTime * 3.0) * 0.5 + 0.5;
```

### 3. 圆形和矩形

```glsl
// 圆形
float circle(vec2 uv, vec2 center, float radius) {
  float d = distance(uv, center);
  return smoothstep(radius, radius - 0.01, d);
}

// 矩形
float rectangle(vec2 uv, vec2 center, vec2 size) {
  vec2 d = abs(uv - center);
  float result = step(d.x, size.x * 0.5) * step(d.y, size.y * 0.5);
  return result;
}

// 圆角矩形
float roundedRectangle(vec2 uv, vec2 center, vec2 size, float radius) {
  vec2 d = abs(uv - center) - size * 0.5 + radius;
  float result = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0) - radius;
  return smoothstep(0.0, 0.01, -result);
}
```

### 4. 图案重复

```glsl
// 5x5 网格重复
vec2 repeatedUV = fract(uv * 5.0);

// 每个格子内画一个圆形
float gridCircle = circle(repeatedUV, vec2(0.5), 0.3);

// 棋盘格
vec2 checker = floor(uv * 8.0);
float checkerPattern = mod(checker.x + checker.y, 2.0);

// 六边形网格
vec2 hexUV = fract(uv * 5.0);
float hex = hexagon(hexUV, vec2(0.5), 0.4);
```

---

## 相关资源
- [The Book of Shaders — Shaping Functions](https://thebookofshaders.com/05/)
- [Inigo Quilez — 2D SDF 函数](https://iquilezles.org/articles/distfunctions2d/)
- [GLSL 数学函数参考](https://www.khronos.org/registry/OpenGL-Refpages/gl4/)
- [Shadertoy — 学习和分享 shader](https://www.shadertoy.com)

---

## 复盘自测（答案）

**1. smoothstep 和 step 的区别是什么？**
- `step(edge, x)`：硬边界，x < edge 返回 0.0，x >= edge 返回 1.0，结果只有 0 或 1
- `smoothstep(edge0, edge1, x)`：平滑边界，在 edge0 和 edge1 之间做 Hermite 插值，产生平滑的渐变过渡
- 适用场景：step 用于锐利边界（消融边缘），smoothstep 用于柔和过渡（渐变、阴影）

**2. dot product 在 shader 里有什么用？**
- 光照计算：`dot(normal, lightDir)` = cos(θ)，用于 Lambert 漫反射
- Fresnel 效果：`dot(viewDir, normal)` 计算视线与法线夹角，边缘更亮
- 判断方向：点积 > 0 表示两向量同向，< 0 表示反向，= 0 表示垂直
- 投影长度：`dot(v, n) * n` 是 v 在 n 方向上的投影

**3. fract 函数的常见用法是什么？**
- 图案重复：`fract(uv * n)` 让 UV 坐标在 [0, 1] 范围内重复，实现网格/瓷砖效果
- 周期动画：`fract(time * speed)` 实现循环动画，每 1/speed 秒重复一次
- 伪随机数：`fract(sin(dot(uv, vec2(12.9898, 78.233))) * 43758.5453)` 生成伪随机数
- 取小数部分：`mod(x, 1.0)` 的等价写法，用于提取周期性信息

---
