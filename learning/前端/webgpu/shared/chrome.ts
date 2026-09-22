/**
 * 共享页面 chrome：画框、角落标注、FPS 统计、错误面板。
 *
 * 为什么存在：把「让页面有设计感」和「让报错可读」这两件事
 * 从每个 demo 的学习内容里剥离出去。demo 的 main.ts 只需要：
 *
 *   import '../../../shared/demo.css';
 *   import { createChrome } from '../../../shared/chrome.ts';
 *
 *   const chrome = createChrome({
 *     day: 1, index: '01', title: 'HELLO TRIANGLE',
 *     tags: ['WEBGPU', 'WGSL'],
 *     hint: '移动鼠标，渐变随之扰动',
 *   });
 *
 *   const device = await initGPU(chrome);      // 见 initGPU 导出
 *   ...                                         // 你的图形学代码
 *   chrome.startLoop((t) => render(t));        // 帧循环 + FPS + 淡入
 */

export interface ChromeOptions {
  /** 第几天（1 / 2 / 3） */
  day: number;
  /** 当天内的编号，如 '01' */
  index: string;
  /** 页面主标题（大写英文，出现在左上角标注） */
  title: string;
  /** 右上角技术标签，如 ['WEBGPU', 'WGSL', 'COMPUTE'] */
  tags?: string[];
  /** 左下角操作提示（中文一句话） */
  hint?: string;
  /** 视口尺寸变化时回调（宽高为物理像素），demo 可在此时重建 depth texture 等 */
  onResize?: (width: number, height: number) => void;
}

export interface Chrome {
  /** 已配置好 context 的 canvas 元素（context 由 demo 自己获取与 configure） */
  readonly canvas: HTMLCanvasElement;
  readonly width: number;
  readonly height: number;
  /** 更新右下角 meta 文本；不调用则默认显示 FPS 与分辨率 */
  setMeta(text: string): void;
  /** 帧循环：内部统计 FPS、首帧后触发 800ms 淡入 */
  startLoop(update: (nowMs: number) => void): void;
  /** 在页内错误面板显示一条可读报错 */
  fail(title: string, detail: string, fix?: string): void;
  /** 挂接 GPUDevice：uncaptured validation error 会显示到错误面板 */
  attachDevice(device: GPUDevice): void;
}

const MAX_DPR = 2;

export function createChrome(opts: ChromeOptions): Chrome {
  // ---- 页面骨架 -------------------------------------------------
  const stage = document.createElement('main');
  stage.className = 'stage';

  const canvas = document.createElement('canvas');
  stage.appendChild(canvas);

  const label = (cls: string, html: string) => {
    const el = document.createElement('div');
    el.className = `tag ${cls}`;
    el.innerHTML = html;
    stage.appendChild(el);
    return el;
  };

  label('tag--tl', `DAY ${opts.day} · <em>${opts.index}</em> — ${opts.title}`);
  label('tag--tr', (opts.tags ?? ['WEBGPU']).join(' / '));
  if (opts.hint) label('tag--bl', opts.hint);
  const metaEl = label('tag--br', '— FPS');

  // ---- 作业 ↔ 答案互跳：homework 与 solutions 同构目录树，按当前 URL 自动推断对页 ----
  // 做完作业想对照答案，不该手动改地址栏；答案页也对称地能一步回作业。
  // 存在性用 HEAD 验证（dev server / 静态托管均可；file:// 静默降级——没有导航不影响作业本身）。
  const navMatch = location.pathname.match(/\/(homework|solutions)\/(day\d\/[^/]+)\/index\.html?$/);
  if (navMatch) {
    const from = navMatch[1];
    const to = from === 'homework' ? 'solutions' : 'homework';
    const target = location.pathname.replace(`/${from}/`, `/${to}/`);
    fetch(target, { method: 'HEAD' }).then((r) => {
      if (!r.ok) return;
      const a = document.createElement('a');
      a.className = 'tag tag--sol';
      a.href = target;
      a.innerHTML = from === 'homework'
        ? '答案参考 <span class="arr">↗</span>'
        : '返回作业 <span class="arr">↗</span>';
      stage.appendChild(a);
    }).catch(() => { /* 静默降级 */ });
  }

  const panel = document.createElement('div');
  panel.className = 'error-panel';
  stage.appendChild(panel);

  document.body.appendChild(stage);

  // ---- 全局错误捕获：未完成的 TODO、着色器错误直达错误面板 ----
  window.addEventListener('error', (e) => {
    if (panel.classList.contains('show')) return; // 已有更具体的报错
    failInternal('UNCAUGHT ERROR', e.message, '作业骨架未完成时会出现这个面板：按 README 任务清单补全 TODO 后刷新。');
  });
  window.addEventListener('unhandledrejection', (e) => {
    if (panel.classList.contains('show')) return;
    failInternal('UNHANDLED REJECTION', String(e.reason));
  });
  function failInternal(title: string, detail: string, fix?: string) {
    // 直接写 panel 而不经 chrome 转发：createChrome 执行期间若抛错
    // （如 onResize 读到尚未初始化的变量），chrome 还在暂时性死区里，
    // 经它转发会把「报错面板」自身也炸掉——初始化期的错误就永远看不见。
    panel.innerHTML =
      `<h2>${escapeHtml(title)}</h2>` +
      `<pre>${escapeHtml(detail)}</pre>` +
      (fix ? `<div class="fix">${escapeHtml(fix)}</div>` : '');
    panel.classList.add('show');
    stage.classList.add('ready');
  }

  // ---- 尺寸 -----------------------------------------------------
  let width = 1;
  let height = 1;
  const applySize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    width = Math.max(1, Math.floor(canvas.clientWidth * dpr));
    height = Math.max(1, Math.floor(canvas.clientHeight * dpr));
    canvas.width = width;
    canvas.height = height;
    opts.onResize?.(width, height);
  };
  new ResizeObserver(applySize).observe(canvas);
  applySize();

  // ---- meta / FPS ----------------------------------------------
  let customMeta = '';
  let fpsSamples: number[] = [];
  let lastSample = 0;

  const renderMeta = (fps: number | null) => {
    if (customMeta) {
      metaEl.innerHTML = customMeta;
    } else {
      const fpsText = fps === null ? '—' : String(Math.round(fps));
      metaEl.innerHTML = `${fpsText} FPS · ${width}×${height}`;
    }
  };
  renderMeta(null);

  // ---- 帧循环 ----------------------------------------------------
  const chrome: Chrome = {
    canvas,
    get width() { return width; },
    get height() { return height; },
    setMeta(text: string) {
      customMeta = text;
      renderMeta(null);
    },
    startLoop(update: (nowMs: number) => void) {
      let ready = false;
      const tick = (now: number) => {
        update(now);
        if (!ready) {
          ready = true;
          stage.classList.add('ready');
        }
        // FPS：滚动窗口内的帧间隔均值，每 0.5s 刷新一次显示
        if (lastSample !== 0) {
          const dt = now - lastSample;
          if (dt > 0 && dt < 1000) {
            fpsSamples.push(dt);
            if (fpsSamples.length > 40) fpsSamples.shift();
          }
        }
        lastSample = now;
        if (fpsSamples.length > 4) {
          const avg = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
          renderMeta(1000 / avg);
        }
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    },
    fail(title: string, detail: string, fix?: string) {
      panel.innerHTML =
        `<h2>${escapeHtml(title)}</h2>` +
        `<pre>${escapeHtml(detail)}</pre>` +
        (fix ? `<div class="fix">${escapeHtml(fix)}</div>` : '');
      panel.classList.add('show');
      stage.classList.add('ready');
    },
    attachDevice(device: GPUDevice) {
      device.addEventListener('uncapturederror', (e) => {
        const err = (e as GPUUncapturedErrorEvent).error;
        this.fail(
          `UNCAPTURED ${err.constructor.name.replace('GPU', '')} ERROR`,
          err.message,
          '这类错误几乎都来自资源创建或管线描述符：检查对齐、布局、usage 标志与 await 遗漏。'
        );
      });
    },
  };
  return chrome;
}

/**
 * 统一的 WebGPU 初始化：能力检测 → adapter → device → canvas context。
 * 失败时通过 chrome 的错误面板给出可读指引。
 */
export async function initGPU(chrome: Chrome): Promise<GPUDevice | null> {
  if (!('gpu' in navigator)) {
    chrome.fail(
      'WEBGPU NOT AVAILABLE',
      'navigator.gpu 不存在：当前浏览器不支持 WebGPU。',
      'Chrome / Edge 113+（桌面）或 Safari 26+ 可用；旧环境请升级浏览器。也可以在无 GPU 的机器上使用软件适配器（见讲义 01-环境准备）。'
    );
    return null;
  }

  let adapter: GPUAdapter | null;
  try {
    adapter = await navigator.gpu.requestAdapter();
  } catch (e) {
    chrome.fail('REQUEST ADAPTER FAILED', String(e));
    return null;
  }
  if (!adapter) {
    chrome.fail(
      'NO ADAPTER',
      'requestAdapter() 返回 null：没有可用的 GPU 适配器。',
      '检查浏览器是否禁用了硬件加速；或改用 requestAdapter({ forceSoftware: true }) 走软件渲染（讲义 01-环境准备）。'
    );
    return null;
  }

  const device = await adapter.requestDevice();
  chrome.attachDevice(device);
  device.lost.then((info) => {
    if (info.reason !== 'destroyed') {
      chrome.fail(
        'DEVICE LOST',
        `GPUDevice 丢失（${info.reason}）：${info.message}`,
        '设备丢失后所有 GPU 资源失效，需要整页重建。教学环境里最常见原因是系统休眠或 GPU 驱动重置，刷新页面即可。'
      );
    }
  });
  return device;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
