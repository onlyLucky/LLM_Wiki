/**
 * 共享页面 chrome：画框、角落标注、FPS 统计、错误面板、交互状态桥。
 *
 * 为什么存在：把「让页面有设计感」「让报错可读」「把浏览器事件翻译成
 * shader 输入」这三件事从每个 demo 的学习内容里剥离出去。
 * demo 的 main.ts 只需要：
 *
 *   import '../../../shared/demo.css';
 *   import { createChrome, initGL, createProgram } from '../../../shared/chrome.ts';
 *
 *   const chrome = createChrome({
 *     day: 1, index: '01', title: 'GRADIENT TRIANGLE',
 *     tags: ['WEBGL2', 'GLSL'],
 *     hint: '移动鼠标：渐变随之轻微扰动',
 *   });
 *
 *   const gl = initGL(chrome);                    // WebGL2 context（失败自动进错误面板）
 *   const program = createProgram(gl, vsSrc, fsSrc, chrome); // GLSL 编译错误直达错误面板
 *   ...
 *   chrome.startLoop((nowMs) => render(nowMs));  // 帧循环 + FPS + 淡入 + pointer 平滑
 *
 * 交互状态桥（讲义 1.7 的配套基础设施）：
 *   chrome.pointer —— 鼠标 / 拖动 / 滚轮 / 点击的状态对象，每帧由
 *   startLoop 自动刷新（含 lerp 平滑坐标）。事件更新状态，帧循环消费状态。
 */

export interface ChromeOptions {
  /** 第几天（1 / 2 / 3） */
  day: number;
  /** 当天内的编号，如 '01' */
  index: string;
  /** 页面主标题（大写英文，出现在左上角标注） */
  title: string;
  /** 右上角技术标签，如 ['WEBGL2', 'GLSL', 'SDF'] */
  tags?: string[];
  /** 左下角操作提示（中文一句话） */
  hint?: string;
  /** 视口尺寸变化时回调（宽高为物理像素） */
  onResize?: (width: number, height: number) => void;
}

/**
 * 交互状态桥：浏览器事件 → 状态对象 → 每帧写入 uniform。
 *
 * 坐标域约定（讲义 1.5 / 1.7 反复出现的那张地图）：
 * - x / y        CSS 像素，画布内，左上原点（DOM 习惯）
 * - nx / ny      归一化 0–1；ny 已翻转为左下原点（GL 习惯）——手写时最容易漏的就是这步翻转
 * - sx / sy      lerp 平平滑后的归一化坐标（阻尼 0.08，awwwards 手感的默认档）
 */
export interface PointerState {
  x: number;
  y: number;
  nx: number;
  ny: number;
  sx: number;
  sy: number;
  /** 是否按住（pointerdown → true，pointerup / 离开画布 → false） */
  isDown: boolean;
  /** 滚轮累积量（向下为正，像素单位，未 clamp——demo 自行归一化） */
  wheel: number;
  /** 最近一次点击时刻（秒；与 startLoop 的时间同基准；初始 -1 表示从未点击） */
  clickTime: number;
  /** 最近一次点击位置（归一化 0–1，ny 同样左下原点） */
  clickX: number;
  clickY: number;
}

export interface Chrome {
  /** canvas 元素（context 由 initGL 获取） */
  readonly canvas: HTMLCanvasElement;
  /** 画布物理像素宽高（DPR 已乘，上限 2） */
  readonly width: number;
  readonly height: number;
  /** 交互状态桥（每帧由 startLoop 刷新平滑坐标） */
  readonly pointer: PointerState;
  /** 更新右下角 meta 文本；不调用则默认显示 FPS 与分辨率 */
  setMeta(text: string): void;
  /** 帧循环：内部统计 FPS、刷新 pointer 平滑坐标、首帧后触发 800ms 淡入 */
  startLoop(update: (nowMs: number) => void): void;
  /** 在页内错误面板显示一条可读报错 */
  fail(title: string, detail: string, fix?: string): void;
}

const MAX_DPR = 2;
/** lerp 平滑系数：60fps 下约 0.5s 收敛（讲义 1.7 的默认档） */
const POINTER_LERP = 0.08;

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
  label('tag--tr', (opts.tags ?? ['WEBGL2', 'GLSL']).join(' / '));
  if (opts.hint) label('tag--bl', opts.hint);
  const metaEl = label('tag--br', '— FPS');

  const panel = document.createElement('div');
  panel.className = 'error-panel';
  stage.appendChild(panel);

  document.body.appendChild(stage);

  // ---- 全局错误捕获：未完成的 TODO、运行时错误直达错误面板 ----
  window.addEventListener('error', (e) => {
    if (panel.classList.contains('show')) return; // 已有更具体的报错
    failInternal('UNCAUGHT ERROR', e.message, '作业骨架未完成时会出现这个面板：按 README 任务清单补全 TODO 后刷新。');
  });
  window.addEventListener('unhandledrejection', (e) => {
    if (panel.classList.contains('show')) return;
    failInternal('UNHANDLED REJECTION', String(e.reason));
  });
  function failInternal(title: string, detail: string, fix?: string) {
    pointerChrome.fail(title, detail, fix);
  }

  // ---- 交互状态桥：事件只更新状态，帧循环消费 -------------------
  const pointer: PointerState = {
    x: 0, y: 0,
    nx: 0.5, ny: 0.5,          // 初始放在画布中心，避免第一帧跳变
    sx: 0.5, sy: 0.5,
    isDown: false,
    wheel: 0,
    clickTime: -1,
    clickX: 0.5, clickY: 0.5,
  };

  const toNormalized = (e: PointerEvent | MouseEvent) => {
    const r = canvas.getBoundingClientRect();
    const cx = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    const cy = Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
    return { nx: cx, ny: 1 - cy }; // y 翻转：DOM 向下，GL 向上
  };

  canvas.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.nx = Math.min(Math.max((e.clientX - r.left) / r.width, 0), 1);
    pointer.ny = 1 - Math.min(Math.max((e.clientY - r.top) / r.height, 0), 1);
  });
  canvas.addEventListener('pointerdown', () => { pointer.isDown = true; });
  window.addEventListener('pointerup', () => { pointer.isDown = false; });
  canvas.addEventListener('pointerleave', () => { pointer.isDown = false; });
  canvas.addEventListener('click', (e) => {
    const { nx, ny } = toNormalized(e);
    pointer.clickTime = performance.now() / 1000;
    pointer.clickX = nx;
    pointer.clickY = ny;
  });
  // passive：不阻止页面滚动；累积量交给 demo 自行归一化
  canvas.addEventListener('wheel', (e) => { pointer.wheel += e.deltaY; }, { passive: true });

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
  const pointerChrome: Chrome = {
    canvas,
    pointer,
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
        // 交互手感：lerp 平滑在帧循环里统一做（讲义 1.7 的「事件更新状态，帧循环消费」）
        pointer.sx += (pointer.nx - pointer.sx) * POINTER_LERP;
        pointer.sy += (pointer.ny - pointer.sy) * POINTER_LERP;
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
  };
  return pointerChrome;
}

/**
 * 统一的 WebGL2 初始化。失败时通过 chrome 的错误面板给出可读指引。
 * 2026 年四大引擎均稳定支持 WebGL2——失败几乎都意味着硬件加速被禁用。
 */
export function initGL(chrome: Chrome): WebGL2RenderingContext | null {
  const gl = chrome.canvas.getContext('webgl2');
  if (!gl) {
    chrome.fail(
      'WEBGL2 NOT AVAILABLE',
      'canvas.getContext("webgl2") 返回 null：当前环境无法创建 WebGL2 上下文。',
      'Chrome / Edge / Firefox / Safari 均已多年支持 WebGL2；最常见原因是浏览器关闭了硬件加速（设置 → 系统 → 使用硬件加速），开启后重启浏览器。'
    );
    return null;
  }
  return gl;
}

/**
 * 编译并链接着色器程序——GLSL 课程的第一个教学设施：
 * 编译 / 链接错误会被完整投递到 chrome 错误面板（含行号日志），
 * 学员不需要打开 DevTools 就能看到 shader 报错。
 *
 * 报错行号是 .glsl 源文件内的行号（#version 必须是第 1 行）。
 */
export function createProgram(
  gl: WebGL2RenderingContext,
  vsSource: string,
  fsSource: string,
  chrome?: Chrome,
): WebGLProgram | null {
  const compile = (type: number, source: string, name: string): WebGLShader | null => {
    const shader = gl.createShader(type)!;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(shader) ?? '（无日志）';
      chrome?.fail(
        `GLSL COMPILE ERROR · ${name}`,
        log,
        '报错行号是 .glsl 文件内的行号。第一高频原因：#version 300 es 之前存在空行或注释（必须是文件第一行）；第二高频：float 字面量没写小数点（1 应为 1.0）。'
      );
      return null;
    }
    return shader;
  };

  const vs = compile(gl.VERTEX_SHADER, vsSource, 'vertex.glsl');
  if (!vs) return null;
  const fs = compile(gl.FRAGMENT_SHADER, fsSource, 'fragment.glsl');
  if (!fs) return null;

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program) ?? '（无日志）';
    chrome?.fail(
      'GLSL LINK ERROR',
      log,
      '链接失败最常见原因：vertex 的 out 与 fragment 的 in 名字或类型不一致——varying 是「接头暗号」，两边必须逐字相同。'
    );
    return null;
  }
  // 链接完成后 shader 对象可删（program 已持有引用），保持显存干净
  gl.deleteShader(vs);
  gl.deleteShader(fs);
  return program;
}

function escapeHtml(s: string): string {
  return s
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;');
}
