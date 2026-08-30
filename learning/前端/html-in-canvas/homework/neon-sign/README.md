# 课后作业：深夜食堂霓虹招牌

对标 [HTML-Light-Demo](https://github.com/jinruozai/HTML-Light-Demo)（吊灯照亮 HTML 表面）的**同级练习作品**：用 HTML-in-Canvas 把真实 DOM 招牌渲染进 Three.js 夜晚街景，配合 Verlet 物理链条摆动。

## 运行

```bash
# 方式一：静态服务器（推荐）
cd /Users/feynman/wiki/learning/前端/html-in-canvas/homework/neon-sign
python3 -m http.server 8081
# 打开 http://localhost:8081

# 方式二：直接双击 index.html（ES Module + CDN，无需构建）
```

> 零构建、零安装。原生 API 可用时（Chrome Canary Flag）自动走 `texElementImage2D` 快速路径，否则自动使用 `three-html-render` polyfill（Safari/Firefox 亦可运行），右上角徽章显示当前模式。

## 交互对照表（与 HTML-Light-Demo 同级）

| 操作 | HTML-Light-Demo（参考） | 本作业 neon-sign |
| --- | --- | --- |
| 拖拽 | 拉拽吊灯，物理摆动 | 拖拽任意招牌，Verlet 链条甩动 |
| 释放 | 惯性摆动衰减 | 惯性摆动衰减（prev 位置保留速度） |
| 双击 | 重置吊灯 | 重置两块招牌 |
| 右键/点击 | 换光色、调光束 | 点击招牌上「OPEN」徽章打烊/营业（霓虹熄灭） |
| 数据面板 | 亮度/角度数字 | 实时时钟（每秒 DOM 更新 -> 纹理自动刷新） |
| 控件面板 | 灯光控制 | 菜单「换一批」按钮 + 风力滑条（画布内 DOM） |

## 验收标准（自评清单）

- [x] 至少 2 块 HTML 招牌作为 3D 纹理渲染（`layoutsubtree` + `ThreeHTMLRenderer`）
- [x] Verlet 链条物理：重力、阻尼、阵风、12 次迭代距离约束
- [x] 拖拽交互：射线拾取 + 拖拽平面 + 惯性释放
- [x] 画布内真实 DOM 交互：按钮、滑条可点击/拖动，hover 生效
- [x] 实时内容更新：时钟每秒变化，paint 事件驱动纹理刷新
- [x] 原生 API 优先 + polyfill 兜底，双模式可运行
- [x] 氛围渲染：星空、电线（贝塞尔悬链）、反光地面、霓虹点光源

## 实现要点解析

### 架构总览

```text
<canvas id="scene" layoutsubtree>          ← Three.js 画布 == HTML-in-Canvas 画布
  <div id="signMain">…时钟/开关…</div>      ← 主招牌 DOM（原生可交互）
  <div id="signMenu">…菜单/滑条…</div>      ← 菜单招牌 DOM
</canvas>

ThreeHTMLRenderer.connect(canvas, camera, renderer)
ThreeHTMLRenderer.addObject(el, mesh)      ← DOM ↔ mesh 绑定（纹理+overlay 全自动）
每帧: 物理 -> 姿态 -> htmlRenderer.update() -> render()
```

### 1. 物理链条（对标参考的 Verlet 约束求解器）

```js
step(dt, wind) {
  for (const p of particles) {
    if (p.fixed) continue;                       // 挂点固定在电线上
    const vx = (p.x - p.px) * 0.986;             // 阻尼
    p.px = p.x;                                  // Verlet：位置差即速度
    p.x += vx + wind.x * dt * dt;                // 风
    p.y += (p.y - p.py) * 0.986 - GRAVITY * dt * dt; // 重力
  }
}
constrain() {                                    // 距离约束，迭代 12 次
  for (let i = 1; i < n; i++) {
    // 相邻粒子距离修正回 segLen；固定端不动，自由端各分担一半
  }
}
```

关键技巧--拖拽惯性：`dragTo(target)` 把末端粒子硬设为目标点，同时把 `prev` 位置错开一点，松手瞬间位置差形成速度，招牌自然甩出去。

### 2. 招牌姿态同步

```js
updateSignPose(s) {
  const end = s.chain.end;                        // 链末端 = 招牌挂点
  s.group.position.set(end.x, end.y, end.z);      // Group 原点即挂点
  s.group.rotation.z = Math.atan2(end.x - before.x, before.y - end.y); // 随链倾斜
}
```

招牌 mesh 在 Group 内向下偏移 `halfH`，物理只驱动 Group 的位置与 Z 轴旋转。

### 3. HTML 控件驱动 3D 场景

- 「换一批」按钮：JS 更新 `<li>` 文本 -> DOM 变化 -> `paint` 触发 -> 纹理刷新
- 风力滑条：`input` 事件直接改物理变量 `windStrength`
- 「打烊」徽章：toggle CSS 类 `.closed`（霓虹熄灭样式）+ 同步调暗 `PointLight.intensity`

这就是 HTML-in-Canvas 的核心价值：**3D 场景里的 UI 依然用 DOM/CSS 编写**，双向数据流一目了然。

### 4. 原生 / Polyfill 双模式

`installHtmlInCanvasPolyfill()` 内部自动检测：原生 `texElementImage2D` 可用时走快速路径，否则用 SVG `foreignObject` 栅格化兜底。代码无需感知差异。

## 扩展挑战（做完作业后的进阶方向）

1. **加第三块招牌**：挂在电线右侧，写一段滚动公告（CSS marquee 动画进纹理）
2. **OffscreenCanvas + Worker**：用 `captureElementImage()` 把招牌快照传给 Worker 渲染（文档 7.1 节）
3. **原生 API 重写**：去掉 `ThreeHTMLRenderer`，直接在 `canvas.onpaint` 中用 `texElementImage2D` + `getElementTransform` 手写纹理上传与 DOM 同步（文档 7.2 节矩阵推导）
4. **粒子雨/雪**：在霓虹招牌上加 shader 后处理（参考 CSS-to-Shader demo）
5. **音效联动**：打烊时招牌灯光熄灭 + 环境音渐弱（Web Audio）

## 常见问题

**Q：页面黑屏 / 招牌不显示？**
A：先看右上角徽章。若显示 Polyfill 模式但无内容，检查网络（CDN 资源加载）与浏览器控制台；Safari 首次加载 foreignObject 栅格化可能需要 1-2 秒。

**Q：招牌能拖动但点击按钮没反应？**
A：`pointerdown` 中已排除 `button/input`（见 `e.target.closest('button, input')`），若自定义了新控件记得同步该选择器。

**Q：想体验原生 fast-path？**
A：Chrome Canary 地址栏输入 `chrome://flags/#canvas-draw-element`，启用后重启。原生路径纹理上传延迟更低。
