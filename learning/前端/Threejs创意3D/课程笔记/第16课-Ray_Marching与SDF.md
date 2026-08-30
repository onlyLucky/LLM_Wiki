# 第16课-Ray_Marching与SDF

> 日期：2026-08-26
> 状态：进行中
> 评分：待定

---

## 📚 课程内容

### 学习目标
1. 理解 SDF（有符号距离场）的概念
2. 掌握 Ray Marching 的基本原理
3. 学会 SDF 基本形状（球、盒、圆环）
4. 理解 SDF 布尔运算（并集、交集、差集）

---

## 🎯 核心概念

### 1. SDF（有符号距离场）

SDF = 到最近表面的距离。**有符号**意味着区分内外：
- 正值 = 在物体**外部**
- 负值 = 在物体**内部**
- 零 = 正好在**表面**上

**类比**：闭着眼睛站在房间里，伸手摸墙——你摸到的距离就是 SDF 值。如果你在墙外面，距离为正；在墙里面，距离为负。

```glsl
float sdSphere(vec3 p, float r) {
  return length(p) - r;  // 到球心的距离减去半径
}
```

### 2. Ray Marching 原理

从相机沿光线方向**步进**，每次步进 SDF 距离（这是安全距离——不会穿过表面）。

```glsl
float rayMarch(vec3 ro, vec3 rd) {
  float t = 0.0;
  for (int i = 0; i < 100; i++) {
    vec3 p = ro + rd * t;      // 当前位置
    float d = map(p);           // 到最近表面的距离
    if (d < 0.001) break;      // 够近了 → 击中！
    t += d;                     // 安全步进
    if (t > 50.0) break;       // 太远了 → 没击中
  }
  return t;
}
```

**为什么步进 SDF 距离是安全的？**
- SDF 保证了以当前位置为球心、SDF 为半径的球内**没有任何表面**
- 所以你可以安全地前进 SDF 的距离，不会"穿过"任何东西
- 这就是 Ray Marching 的核心优化——不需要很小的固定步长

### 3. SDF 基本形状

| 形状 | SDF 函数 | 原理 |
|------|----------|------|
| 球体 | `length(p) - r` | 到球心距离减半径 |
| 盒子 | `length(max(abs(p)-b, 0))` | 到盒子边界的距离 |
| 圆环 | `length(vec2(length(p.xz)-R, p.y)) - r` | 到圆环中心线的距离 |

### 4. SDF 布尔运算

```glsl
float opUnion(float d1, float d2) { return min(d1, d2); }
float opSubtraction(float d1, float d2) { return max(-d1, d2); }
float opIntersection(float d1, float d2) { return max(d1, d2); }
```

**类比**：
- 并集（min）= 两个形状取**最近**的表面 → 合并
- 差集（max(-d1, d2)) = 从 A 中**挖掉** B
- 交集（max）= 只保留**重叠**部分

**平滑并集**（Smooth Union）：
```glsl
float opSmoothUnion(float d1, float d2, float k) {
  float h = clamp(0.5 + 0.5 * (d2 - d1) / k, 0.0, 1.0);
  return mix(d2, d1, h) - k * h * (1.0 - h);
}
```
k 控制过渡平滑度：k 越大，两个形状的交界越"融化"。

### 5. 法线计算（有限差分法）

在击点附近采样 4 次 SDF，用梯度近似法线方向：

```glsl
vec3 calcNormal(vec3 p) {
  vec2 e = vec2(0.001, 0.0);
  return normalize(vec3(
    map(p + e.xyy) - map(p - e.xyy),  // x 方向梯度
    map(p + e.yxy) - map(p - e.yxy),  // y 方向梯度
    map(p + e.yyx) - map(p - e.yyx)   // z 方向梯度
  ));
}
```

### 6. 软阴影

从击点向光源方向步进，检查是否被遮挡。k 控制柔和度。

### 7. 环境光遮蔽（AO）

在击点法线方向多次采样 SDF，距离越近 → 被遮挡越多 → 越暗。

---

## 💻 代码实现要点

### 1. 全屏 ShaderMaterial

Ray Marching 不使用 Three.js 几何体，而是用一个覆盖全屏的平面 + 片元着色器。

```typescript
const geometry = new THREE.PlaneGeometry(2, 2)  // NDC 全屏
const material = new THREE.ShaderMaterial({
  vertexShader: rayMarchVertexShader,   // 只做透传
  fragmentShader: rayMarchFragmentShader, // Ray Marching 在这里
})
```

### 2. 场景 SDF（map 函数）

定义整个 3D 场景：多个基本形状通过布尔运算组合。

### 3. Gamma 校正

```glsl
color = pow(color, vec3(0.4545));  // 1/2.2
```

---

## 📝 课后作业

暂无课后作业。

---

## 🔗 相关资源

- [Inigo Quilez — SDF 函数大全](https://iquilezles.org/articles/distfunctions/)
- [Inigo Quilez — Ray Marching](https://iquilezles.org/articles/raymarchingdfs/)
- [Shadertoy — Ray Marching 教程](https://www.shadertoy.com/view/XlGBzG)
- [The Book of Shaders — Distance Fields](https://thebookofshaders.com/)

---

## 苏格拉底问答

**Q1：Ray Marching 和传统光栅化渲染的根本区别是什么？各自适合什么场景？**

请回答。

**Q2：SDF 的值代表什么？为什么负值表示"在物体内部"？**

请回答。

**Q3：为什么 Ray Marching 适合做特效但不适合做游戏？从实时性能角度分析。**

请回答。

**Q4：opSmoothUnion 用 smin 代替 min 来实现平滑并集。如果把 k 值设得非常大（比如 5.0），两个物体会"融合"成什么形状？这在程序化建模中有什么实际应用？**

请回答。

**Q5：在 Ray Marching 中，步进次数上限（如 100 步）和最大距离（如 50.0）是硬编码的。如果场景非常复杂（比如 SDF 场景有 1000 个物体），这两个参数应该怎么调整？有没有自适应步进的优化策略？**

请回答。

---

## 费曼学习法

**概念：SDF 和 Ray Marching**

**AI 用大白话讲**：
> 想象你在一个黑暗的房间里，闭着眼睛找墙。你伸出一只手，摸到最近的墙的距离就是 SDF 值。你每次迈出的步子不会超过这个距离（因为再远就撞墙了），这就是 Ray Marching。
>
> 你一直往前走，每次迈一步（步子大小 = 到最近墙的距离），直到你的手几乎碰到墙（距离 < 0.001）——恭喜你，你"击中"了！这时候你摸摸墙的方向（法线），再看看有没有手电筒照过来（光照），就能画出这个点了。

**你的理解**：
（待回答）

**AI 诊断**：
（待诊断）
