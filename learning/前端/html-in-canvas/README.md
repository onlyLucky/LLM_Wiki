# HTML-in-Canvas 学习指南

> 让 Canvas 原生绘制真实、可交互、可访问的 HTML 内容。
> 本文档配套 3 个渐进式 demo 与 1 个完整课后作业案例，全部位于本目录。

```text
html-in-canvas/
├── README.md                      ← 本文档
├── demos/
│   ├── 01-hello-world/            ← 基础：2D 画布绘制 HTML（5 分钟）
│   ├── 02-interactive-form/       ← 进阶：可交互表单 + transform 同步
│   └── 03-webgl-3d/               ← 高级：HTML 作为 WebGL 纹理贴到立方体
└── homework/
    └── neon-sign/                 ← 课后作业：深夜食堂霓虹招牌（对标 HTML-Light-Demo）
```

---

## 一、提案来源

HTML-in-Canvas 是由 Chrome 团队发起、在 **WICG（Web Platform Incubator Community Group）** 下孵化的 Web 标准提案，目标是打通 DOM 与像素世界：让 2D/3D `<canvas>` 直接绘制**活的** HTML 元素，而非截图或 JS 模拟。

| 信息 | 内容 |
| --- | --- |
| 提案仓库（Explainer） | <https://github.com/WICG/html-in-canvas> |
| Chrome 官方博客（Origin Trial 公告） | <https://developer.chrome.google.cn/blog/html-in-canvas-origin-trial> |
| 社区文档站（含 17 个 demo） | <https://html-in-canvas.dev/> |
| 源试用（Origin Trial） | Chrome 148–150（<https://developer.chrome.google.cn/origintrials>） |
| 体验方式 | Chrome Canary 149+ 或 Brave Stable（Chromium 147+），开启 `chrome://flags/#canvas-draw-element` |
| 标准化阶段 | Explainer / 开发者试用期，API 细节仍可能变化 |
| 其他浏览器 | Firefox 与 Safari/WebKit 尚未宣布实现计划 |

**一句话理解**：`<canvas>` 的子元素本来只是"不可见的 fallback 内容"，这个提案让它们变成"可布局、可绘制、可交互的离屏 HTML 图层"。

---

## 二、基础使用方式

### 2.1 三个核心原语

| 原语 | 归属 | 作用 |
| --- | --- | --- |
| `layoutsubtree` 属性 | `<canvas>` 元素 | 让子元素参与布局与命中测试，但不直接显示 |
| `drawElementImage()` / `texElementImage2D()` / `copyElementImageToTexture()` | 2D / WebGL / WebGPU 上下文 | 把子元素绘制进画布（2D）或上传为纹理（3D） |
| `paint` 事件 | `<canvas>` 元素 | 子元素渲染变化时触发，是所有绘制的入口 |

另有两个配套能力：`requestPaint()` 强制触发一次 paint；`captureElementImage()` 生成可转移（Transferable）的 `ElementImage` 快照供 Worker 使用。

### 2.2 三步工作流

```text
第 1 步 声明          第 2 步 绘制             第 3 步 同步
<canvas layoutsubtree>  canvas.onpaint = () => {    form.style.transform =
  <form id="form">        t = ctx.drawElementImage(    t.toString();
    ...                   form, 0, 0);               // 命中测试/无障碍
  </form>                 }
</canvas>
```

第 3 步最容易被忽略：**浏览器的事件分发、无障碍、IntersectionObserver 都依赖元素的 DOM 位置**。`drawElementImage()` 返回的 `DOMMatrix` 必须写回 `element.style.transform`，否则点击位置会错位。

### 2.3 最小可运行示例

```html
<canvas id="canvas" style="width:400px; height:200px;" layoutsubtree>
  <form id="form_element">
    <label for="name">姓名：</label>
    <input id="name" type="text">
  </form>
</canvas>
<script>
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.onpaint = () => {
    ctx.reset();
    // 把 HTML 画进 Canvas，并拿到同步矩阵
    const transform = ctx.drawElementImage(form_element, 0, 0);
    // 同步 DOM 位置，保证点击/输入/无障碍正常
    form_element.style.transform = transform.toString();
  };

  // 画布网格对齐设备像素比，防止模糊
  new ResizeObserver(([entry]) => {
    canvas.width  = entry.devicePixelContentBoxSize[0].inlineSize;
    canvas.height = entry.devicePixelContentBoxSize[0].blockSize;
  }).observe(canvas, { box: 'device-pixel-content-box' });

  canvas.requestPaint(); // 首帧触发
</script>
```

运行后你会看到一个**真正可输入**的 `<input>` 被绘制在 Canvas 里——这就是它与截图方案的本质区别。

### 2.4 `drawElementImage` 四种重载

与 `drawImage()` 完全同构：

| 签名 | 说明 |
| --- | --- |
| `(el, dx, dy)` | 绘制到 (dx, dy)，保持屏幕比例自动缩放 |
| `(el, dx, dy, dw, dh)` | 绘制并缩放到目标尺寸 |
| `(el, sx, sy, sw, sh, dx, dy)` | 绘制源元素的子矩形 |
| `(el, sx, sy, sw, sh, dx, dy, dw, dh)` | 源子矩形缩放到目标矩形 |

返回值一律是 `DOMMatrix`（用于第 3 步同步）。

---

## 三、注意事项（踩坑清单）

1. **实验性 API**：Chrome 148–150 处于 Origin Trial，实现细节可能变化，不要用于生产环境的核心路径。
2. **直接子元素约束**：`drawElementImage()` 的目标必须是 `<canvas>` 的**直接子元素**，且不能 `display: none`。
3. **源元素的 CSS transform 会被忽略**：绘制时只应用画布自身的 CTM；transform 仅影响命中测试。想移动画面请用画布坐标系（移动 `dx/dy` 或 `ctx.translate`）。
4. **溢出裁剪**：布局溢出与墨水溢出都会被裁剪到元素的 border box，阴影会被切掉。
5. **paint 事件中的 DOM 修改下一帧才生效**：paint 内先 `ctx` 绘制（本帧可见），再改 DOM（下帧快照）。需要"每帧驱动"时用 `requestPaint()`。
6. **多个 canvas 时 paint 按逆树序触发**：后代先于祖先，嵌套 canvas 时注意顺序。
7. **快照时序**：paint 事件外调用 `drawElementImage()` 使用的是**上一帧**快照；首次快照前调用会抛异常。
8. **跨源内容不可绘制**：跨域 iframe、已访问链接样式、自动填充内容、拼写检查标记等出于隐私保护不会渲染。
9. **滚动与动画不能独立于 JS**：画布内容由 JS 驱动，滚动无法像普通 DOM 那样由合成器线程独立完成，长滚动列表要谨慎评估性能。
10. **DPR 处理是必做项**：画布网格必须对齐 `devicePixelContentBoxSize`，否则文字发虚。
11. **`texElementImage2D` 建议配合 `LINEAR` 过滤**：`gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)`，文字渲染才平滑。

---

## 四、优缺点分析

### 4.1 优点

| 能力 | 说明 |
| --- | --- |
| 原生渲染保真 | 浏览器排版引擎直出：连字、RTL、亚像素渲染、复杂换行全部正确 |
| 无障碍内置 | 绘制元素本身就是 fallback 内容，无障碍树与屏幕内容天然一致 |
| 交互完整保留 | 表单输入、文本选择、复制粘贴、右键菜单、页内查找（Ctrl+F）在 3D 纹理上依然可用 |
| 三种上下文统一 | 一套 API 覆盖 2D / WebGL / WebGPU |
| Worker 渲染 | `ElementImage` 可转移，大型 UI 可在 OffscreenCanvas + Worker 中渲染，主线程不卡 |
| DevTools 可调试 | 可直接在 Elements 面板检查画布内元素，改 CSS 立即反映到 3D 纹理 |
| 可索引/可翻译 | 爬虫与 AI 代理可读取 3D 场景中的文本，浏览器翻译功能可用 |
| 生态已启动 | Three.js `HTMLTexture`、PlayCanvas、PixiJS `HTMLSource`、Babylon.js 均已支持 |

### 4.2 缺点与局限

| 局限 | 影响 |
| --- | --- |
| 仅 Chromium 系可用 | Firefox/Safari 未表态，跨浏览器项目需 polyfill（如 `three-html-render`）或降级方案 |
| 实验阶段 | API 签名、行为细节仍可能调整，跟进成本高 |
| 需要手动同步 transform | 尤其 3D 场景中 MVP 矩阵转 CSS transform 的数学较繁琐 |
| 滚动性能模型 | 画布内滚动由 JS 驱动，大列表性能不如原生 DOM 滚动 |
| 跨源限制 | 跨域 iframe / 媒体等不可绘制 |
| 打破心智模型 | "CSS transform 不参与绘制"等规则与直觉相反，学习曲线存在 |

---

## 五、带给前端开发者的帮助

1. **图表/可视化**：legend、多行坐标轴标签、富文本 tooltip 直接用 HTML+CSS 写，不再手撕 Canvas 文本排版；无障碍图表成为可能。
2. **游戏 UI 与 HUD**：用 DOM 写游戏菜单、终端、对话框，渲染进 WebGL/WebGPU 场景，原生支持手柄无关的键盘导航与屏幕阅读器。
3. **创意营销页**：网页整体"碎裂""折射""CRT 化"等 shader 效果可以作用于**活的**页面（参考 Compiz Web、PixiJS HTML Laser）。
4. **设计工具与文档应用**：Figma/Google Docs 类应用的画布内组件获得原生无障碍与页内查找，减少自绘 UI 的包体积。
5. **媒体导出**：海报生成、分享卡片、视频帧导出从"截图库"变成原生 API 路线（Remotion 已提供 `<HtmlInCanvas>` 组件）。
6. **3D/WebXR 界面**：VR 浮空面板、AR 贴地 UI 使用真实 DOM 构建，复杂排版免费获得。
7. **技能视角**：这是 Web 渲染模型的一次升级——HTML 成为 GPU 渲染管线的一等公民。掌握它意味着你在"DOM 与像素世界之间架桥"这一新范式上先人一步，`html2canvas`/`foreignObject` 截图类方案的知识可以逐步迁移。

---

## 六、进阶使用

### 6.1 动画驱动：requestPaint

`paint` 只在子元素渲染变化时触发。想做持续动画（如旋转 HTML 标签），主动申请重绘：

```js
canvas.onpaint = (e) => {
  ctx.reset();
  ctx.save();
  ctx.translate(200, 100);
  ctx.rotate(theta);            // 画布 CTM 参与绘制，CSS transform 不参与
  const t = ctx.drawElementImage(el, -el.offsetWidth / 2, -el.offsetHeight / 2);
  el.style.transform = t.toString();
  ctx.restore();
  theta += 0.01;
  canvas.requestPaint();        // 链式触发下一帧
};
canvas.requestPaint();          // 启动
```

### 6.2 交互闭环（表单场景完整模板）

```js
canvas.onpaint = (e) => {
  ctx.reset();
  // 只重绘变化的元素，其余用上一帧快照也可见
  for (const el of e.changedElements) {
    ctx.drawElementImage(el, 0, 0);
  }
};
```

用户在画布中输入 → 子元素渲染变化 → `paint` 自动触发 → 重绘。输入框光标、选区高亮都会自动出现在画布上，这就是"活的 HTML"。

### 6.3 WebGL 纹理上传

```js
const gl = canvas.getContext('webgl');
const tex = gl.createTexture();

canvas.onpaint = () => {
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texElementImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, form_element);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
};
```

之后把 `tex` 当普通纹理用：贴到立方体、平面、甚至经过自定义 shader 处理（CRT 滤镜、折射、扭曲）。

### 6.4 WebGPU 纹理上传

```js
canvas.onpaint = () => {
  device.queue.copyElementImageToTexture(element, { texture: gpuTexture });
};
```

配合典型 WebGPU 渲染管线（如 jelly-slider demo：果冻折射效果下的真实 `<input type=range>`）。

---

## 七、高级使用方式

### 7.1 Worker + OffscreenCanvas 渲染

核心：`ElementImage` 是 `Transferable` 对象，可零拷贝转移给 Worker。

```js
// 主线程
canvas.onpaint = () => {
  const img = canvas.captureElementImage(form_element);   // 快照
  worker.postMessage({ elementImage: img }, [img]);        // 转移到 Worker
};
worker.onmessage = ({ data }) => {
  form_element.style.transform = data.transform.toString(); // 同步回 DOM
};

// Worker 内
self.onmessage = (e) => {
  if (e.data.elementImage) {
    octx.reset();
    const t = octx.drawElementImage(e.data.elementImage, 100, 0);
    self.postMessage({ transform: t });
  }
};
```

适合：大型可视化大屏、游戏 UI 等主线程敏感场景。动态位置需要在主线程计算并同时更新 `element.style.transform`，再把 `ElementImage` 发给 Worker。

### 7.2 3D 场景的 transform 同步（矩阵推导）

WebGL/WebGPU 中元素屏幕位置由你的 MVP 矩阵决定，无法从上下文推断。官方推荐用 `canvas.getElementTransform()` 兜底，内部公式：

```text
T_css = T_origin⁻¹ · S_css→grid⁻¹ · T_draw · S_css→grid · T_origin
```

手工构造（MVP → DOMMatrix）分四步：

```js
// 1. MVP 矩阵 → DOMMatrix
const mvpDOM = new DOMMatrix(Array.from(mvp));

// 2. 元素像素 → 单位正方形（归一化 + 翻转 Y）
const w = el.offsetWidth, h = el.offsetHeight;
const cssToUnit = new DOMMatrix()
  .scale(1 / w, -1 / h, 1)
  .translate(-w / 2, -h / 2);

// 3. 裁剪空间 → 画布视口（重缩放 + 翻转 Y）
const clipToViewport = new DOMMatrix()
  .translate(canvas.width / 2, canvas.height / 2)
  .scale(canvas.width / 2, -canvas.height / 2, 1);

// 4. 相乘并交给 getElementTransform 校准
const screen = clipToViewport.multiply(mvpDOM).multiply(cssToUnit);
el.style.transform = canvas.getElementTransform(el, screen).toString();
```

注意两处 Y 轴翻转：WebGL 向上为正，CSS 向下为正。

### 7.3 框架/引擎集成（推荐生产路线）

| 框架 | API | 文档 |
| --- | --- | --- |
| Three.js | `THREE.HTMLTexture` | <https://threejs.org/docs/#HTMLTexture>（实验性，PR #31233） |
| PlayCanvas | `pc.Texture` + `setSource(htmlElement)` | <https://developer.playcanvas.com/user-manual/graphics/advanced-rendering/html-in-canvas/> |
| PixiJS | `rendering.HTMLSource` | <https://pixijs.download/release/docs/rendering.HTMLSource.html> |
| Babylon.js | `DynamicTexture` / HTML Texture | <https://doc.babylonjs.com/features/featuresDeepDive/materials/using/htmlTexture/> |
| Remotion | `<HtmlInCanvas>` 组件 | <https://www.remotion.dev/docs/html-in-canvas> |
| CanvasUI | 组件库（React/Vue/Solid/原生） | <https://canvasui.dev/> |

Three.js 用法示例：

```js
const material = new THREE.MeshBasicMaterial();
material.map = new THREE.HTMLTexture(uiElement);   // 传入 DOM 元素
const mesh = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), material);
scene.add(mesh);
```

### 7.4 Polyfill 跨浏览器策略

[`three-html-render`](https://www.npmjs.com/package/three-html-render) 实现了完整 WICG API 面：原生 `texElementImage2D` 可用时走快速路径，否则用 SVG `foreignObject` 栅格化兜底，Safari/Firefox/iOS 全覆盖，还支持 `:hover/:focus/:active` 伪类、CSS 动画、滚动、输入光标与选区渲染。

```html
<!-- CDN 引入 polyfill + Three.js 集成 -->
<script type="importmap">
{ "imports": {
    "three": "https://cdn.jsdelivr.net/npm/three@0.170.0/build/three.module.js",
    "three-html-render/polyfill": "https://cdn.jsdelivr.net/npm/three-html-render/dist/polyfill.mjs",
    "three-html-render/renderer": "https://cdn.jsdelivr.net/npm/three-html-render/dist/renderer.js"
}}
</script>
<script type="module">
  import { installHtmlInCanvasPolyfill } from 'three-html-render/polyfill';
  import { ThreeHTMLRenderer } from 'three-html-render/renderer';
  installHtmlInCanvasPolyfill();           // 原生可用则自动走原生

  const htmlRenderer = new ThreeHTMLRenderer();
  htmlRenderer.connect(canvas, camera, threeRenderer);
  htmlRenderer.addObject(document.getElementById('ui'), mesh);
  // 每帧 htmlRenderer.update() —— 纹理上传 + DOM 覆盖层定位 + 事件分发全自动
</script>
```

检测原生 API 是否可用的代码：

```js
const nativeSupported = typeof HTMLCanvasElement.prototype.drawElementImage === 'function'
  || typeof WebGLRenderingContext.prototype.texElementImage2D === 'function';
```

---

## 八、开源案例参考

### 8.1 官方与提案方

| 案例 | 说明 | 链接 |
| --- | --- | --- |
| WICG Examples | 提案仓库自带：复杂文本、饼图、WebGL 立方体、果冻滑块、文本输入 | <https://github.com/WICG/html-in-canvas/tree/main/Examples> |
| chrome.dev 演示集 | 3D 书籍、动画广告牌、流体棱镜折射文字 | <https://chrome.dev/html-in-canvas/> |
| html-in-canvas.dev | 社区 17 个 demo 画廊（2D/WebGL/WebGPU） | <https://html-in-canvas.dev/demos/> |
| 3D Room with Live Web Content | Three.js 第一人称房间，HTML 作为显示器/海报/TV 纹理 | <https://html-in-canvas.dev/demos/3d-room-live-content/> |
| CSS-to-Shader Pipeline | 表单/文章/场景 + CRT、半调、ASCII 等 shader | <https://html-in-canvas.dev/demos/css-to-shader/> |

### 8.2 生态案例（awesome-html-in-canvas 精选）

| 案例 | 亮点 | 源码 |
| --- | --- | --- |
| Duck Hunt TODO（Wes Bos） | 待办清单 + 射击游戏：表单即游戏画面 | [GitHub](https://github.com/wesbos/hot-tips/blob/main/html-in-canvas/demos/wicg/website-shatter-shooter.html) |
| Wobble Buttons（Wes Bos） | 按钮水波纹交互 | [GitHub](https://github.com/wesbos/hot-tips/blob/main/html-in-canvas/demos/wicg/ripple-buttons.html) |
| Compiz Web（Max Leiter） | shader 驱动的整页转场动画 | [GitHub](https://github.com/MaxLeiter/compiz-web) |
| HTML Cloth（fimbox） | 表单悬挂在游戏内布料上，可拖拽 | [GitHub](https://github.com/fimbox/html-in-canvas/blob/main/plugins/html-cloth.mjs) |
| PixiJS HTML Laser（Zyie） | 落地页碎裂-愈合动画 | [GitHub](https://github.com/Zyie/pixijs-html-in-canvas) |
| Quest Signal（Vav Labs） | Godot 风格可玩场景 + 无障碍 DOM 面板做世界空间纹理 | [GitHub](https://github.com/Vav-Labs/quest-signal) |
| HTML-Light-Demo（jinruozai） | **本文档的参考实现**：吊灯照亮 HTML 表面，Verlet 物理 + Three.js | [GitHub](https://github.com/jinruozai/HTML-Light-Demo) |

### 8.3 工具库

| 库 | 定位 |
| --- | --- |
| [three-html-render](https://github.com/repalash/three-html-render) | 全 API polyfill + Three.js 集成（本文档课后作业采用） |
| [CanvasUI](https://canvasui.dev/) | html-in-canvas & WebGL 组件库，多框架支持 |
| [Remotion](https://www.remotion.dev/docs/html-in-canvas) | 视频创作框架的 `<HtmlInCanvas>` 组件 |
| awesome 合集 | <https://github.com/GoogleChromeLabs/css-web-ui-demos/blob/main/html-in-canvas/awesome-html-in-canvas.md> |

---

## 九、课后作业（对标 HTML-Light-Demo）

**作业**：实现 `homework/neon-sign/` —— 一个"深夜食堂霓虹招牌"交互式 3D 场景，与 [HTML-Light-Demo](https://github.com/jinruozai/HTML-Light-Demo) 同级别：HTML-in-Canvas 渲染 + Three.js 3D + 物理模拟 + 鼠标交互。

- 作业说明与验收标准：[homework/neon-sign/README.md](homework/neon-sign/README.md)
- 参考实现已完整提供（可直接运行对照学习），核心文件为 `main.js`

| 对比项 | HTML-Light-Demo（参考） | neon-sign（本作业） |
| --- | --- | --- |
| HTML-in-Canvas 渲染 | three-html-render | three-html-render（原生 API 优先） |
| 3D 引擎 | Three.js | Three.js |
| 物理模拟 | Verlet 约束求解（吊灯摆动） | Verlet 链条约束（招牌风摆） |
| 交互 | 拖拽灯/光束角度/换色/重置 | 拖拽招牌/风力调节/点击 HTML 菜单按钮/双击重置 |
| HTML 实时内容 | 亮度/角度数字面板 | 实时时钟 + 营业状态 + 可切换菜单 |

---

## 附录 A：本地 Demo 运行指南

所有 demo 均为**零构建**纯静态页面（ES Module + CDN），推荐流程：

```bash
cd /Users/feynman/wiki/learning/前端/html-in-canvas
python3 -m http.server 8080
# 打开 http://localhost:8080/demos/01-hello-world/
```

| Demo | 主题 | 前置条件 |
| --- | --- | --- |
| `demos/01-hello-world/` | 2D 基础绘制 + DPR | 原生 API 需 Canary Flag；**不支持时自动加载 polyfill 并提示** |
| `demos/02-interactive-form/` | 交互表单 + transform 同步 + 动画 | 同上 |
| `demos/03-webgl-3d/` | WebGL 纹理 + 3D 立方体 + shader | 同上 |
| `homework/neon-sign/` | 完整综合案例 | polyfill 兜底，任意现代浏览器可跑 |

> 建议：先用 Chrome Canary（开 Flag）体验原生路径，再切 Safari/Firefox 对比 polyfill 路径，两套行为一致正是 polyfill 的价值。

## 附录 B：API 速查表

```text
HTMLCanvasElement
  ├─ layoutsubtree 属性          子元素参与布局/命中测试
  ├─ onpaint / PaintEvent        changedElements: FrozenArray<Element>
  ├─ requestPaint()              强制下一帧触发 paint
  ├─ captureElementImage(el)     → ElementImage（Transferable）
  └─ getElementTransform(el, T)  → DOMMatrix（3D 场景同步用）

CanvasRenderingContext2D / OffscreenCanvasRenderingContext2D
  └─ drawElementImage(el, dx, dy [, dw, dh] / [sx..dh])   → DOMMatrix

WebGLRenderingContext
  └─ texElementImage2D(target, level, internalformat, format, type, element)

GPUQueue
  └─ copyElementImageToTexture(source, destination)

ElementImage  (Window + Worker, Transferable)
  ├─ width / height
  └─ close()
```

## 参考资料

- [WICG/html-in-canvas 提案 Explainer](https://github.com/WICG/html-in-canvas)
- [Chrome 官方博客：HTML-in-Canvas API Origin Trial](https://developer.chrome.google.cn/blog/html-in-canvas-origin-trial)
- [html-in-canvas.dev 社区文档站](https://html-in-canvas.dev/)
- [html-in-canvas.dev API Reference](https://html-in-canvas.dev/docs/api-reference/)
- [html-in-canvas.dev Browser Support](https://html-in-canvas.dev/docs/browser-support/)
- [awesome-html-in-canvas 案例合集](https://github.com/GoogleChromeLabs/css-web-ui-demos/blob/main/html-in-canvas/awesome-html-in-canvas.md)
- [three-html-render polyfill](https://github.com/repalash/three-html-render)
- [HTML-Light-Demo 参考实现](https://github.com/jinruozai/HTML-Light-Demo)
- [Codrops: Exploring the HTML-in-Canvas Proposal](http://tympanus.net/codrops/2026/05/13/exploring-the-html-in-canvas-proposal/)
- [equero: WICG proposal 解析](https://www.equero.dev/posts/html-in-canvas-wicg-proposal-drawelementimage/)
- [Remotion HTML-in-canvas 文档](https://www.remotion.dev/docs/html-in-canvas)

> 文档整理时间：2026-08-26。HTML-in-Canvas 处于快速演进期，以 WICG 仓库为准。
