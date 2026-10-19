/**
 * shader-learn 案例预览运行时（classic script，全局 SLRuntime）。
 *
 * 设计取舍（对照原站 shader-learn.com）：
 * - 原站有完整「编辑器 + 运行/重置/提交 + 编译错误面板」；本课按需求
 *   「不添加 GLSL 编译器」：单一舞台画布，正确预览（参考代码）与当前
 *   预览（练习代码）通过顶部 pill 切换；代码修改通过独立 .frag 文件
 *   （页面轮询监听，~1.5s 自动应用），没有运行按钮、没有错误面板——
 *   编译失败时静默保留上一次画面，仅在「当前预览」按钮上亮红点。
 * - 顶点着色器固定：全屏四边形 + varying vec2 vUv（与站点案例代码约定一致）。
 * - 统一注入 uniform：u_time / u_resolution / u_mouse / u_delta（用了才生效，
 *   没用到的 uniform 保持默认值，不报错）。
 * - WebGL2 上下文优先（本课主线），不可用时回落 WebGL1；两类上下文都能
 *   编译 GLSL ES 1.00 的案例代码。
 * - 案例代码抽离为独立 .frag 文件（glsl/<part>/<slug>.frag 练习、
 *   .answer.frag 参考）：页面加载文件内容并每 1.5s 轮询，在编辑器/IDE
 *   里改文件即可让当前预览自动更新（本页空闲时才应用，避免覆盖输入）。
 */
(function () {
  'use strict';

  var VERT = [
    'attribute vec2 a_position;',
    'varying vec2 vUv;',
    'void main() {',
    '  vUv = a_position * 0.5 + 0.5;',
    '  gl_Position = vec4(a_position, 0.0, 1.0);',
    '}'
  ].join('\n');

  function createShader(gl, type, src) {
    var s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      gl.deleteShader(s);
      return null;
    }
    return s;
  }

  function createProgram(gl, fragSrc) {
    var vs = createShader(gl, gl.VERTEX_SHADER, VERT);
    var fs = createShader(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return null;
    var p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    gl.deleteShader(vs);
    gl.deleteShader(fs);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) return null;
    return p;
  }

  /**
   * 一块预览画布。
   * @param canvas   HTMLCanvasElement
   * @param opts     { code, fpsEl, onStatus(ok) }
   */
  function createPreview(canvas, opts) {
    opts = opts || {};
    var gl = canvas.getContext('webgl2', { antialias: false, alpha: false, depth: false, stencil: false })
          || canvas.getContext('webgl', { antialias: false, alpha: false, depth: false, stencil: false })
          || canvas.getContext('experimental-webgl');
    var api = {
      canvas: canvas,
      gl: gl,
      ok: !!gl,
      setCode: function () {},
      resize: function () {},
      dispose: function () {}
    };
    if (!gl) {
      if (opts.onError) opts.onError('WebGL 不可用');
      return api;
    }

    // 全屏四边形
    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
      -1, -1, 1, -1, -1, 1,
      -1, 1, 1, -1, 1, 1
    ]), gl.STATIC_DRAW);

    var program = createProgram(gl, opts.code || '');
    var loc = {
      position: program ? gl.getAttribLocation(program, 'a_position') : -1,
      time: program ? gl.getUniformLocation(program, 'u_time') : null,
      resolution: program ? gl.getUniformLocation(program, 'u_resolution') : null,
      mouse: program ? gl.getUniformLocation(program, 'u_mouse') : null,
      delta: program ? gl.getUniformLocation(program, 'u_delta') : null
    };

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var mouse = { x: 0, y: 0 };
    var startTime = performance.now();
    var lastTime = startTime;
    var rafId = 0;
    var frames = 0, fpsMark = startTime;
    var dead = false;
    var shown = false;

    // 舞台外框与角标时钟：首帧成功渲染后点亮
    var stage = canvas.closest ? canvas.closest('.preview') : null;
    var clockEl = stage ? stage.querySelector('[data-clock]') : null;
    var lastClockMs = 0;

    function applySize() {
      var w = Math.max(1, Math.round(canvas.clientWidth * dpr));
      var h = Math.max(1, Math.round(canvas.clientHeight * dpr));
      // 课程代码按正方形 UV 空间书写（vUv 圆 / SDF 球均无宽高比校正），
      // 宽画布会把圆拉成椭圆。统一使用方形绘制缓冲，配合 CSS
      // object-fit: contain 在画框内居中呈现（黑色衬垫为有意的黑边装裱）。
      var s = Math.min(w, h);
      if (canvas.width !== s || canvas.height !== s) {
        canvas.width = s;
        canvas.height = s;
        gl.viewport(0, 0, s, s);
      }
    }

    function bindPosition(p) {
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      var a = gl.getAttribLocation(p, 'a_position');
      if (a >= 0) {
        gl.enableVertexAttribArray(a);
        gl.vertexAttribPointer(a, 2, gl.FLOAT, false, 0, 0);
      }
    }

    function frame(nowMs) {
      if (dead) return;
      rafId = requestAnimationFrame(frame);
      applySize();
      if (!program) return;
      var t = (nowMs - startTime) / 1000;
      var dt = Math.min(0.1, (nowMs - lastTime) / 1000);
      lastTime = nowMs;
      gl.useProgram(program);
      bindPosition(program);
      if (loc.time) gl.uniform1f(loc.time, t);
      if (loc.delta) gl.uniform1f(loc.delta, dt);
      if (loc.resolution) gl.uniform2f(loc.resolution, canvas.width, canvas.height);
      if (loc.mouse) gl.uniform2f(loc.mouse, mouse.x * dpr, mouse.y * dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
      // 首帧渲染成功：点亮 stage 入场（淡入 + 上浮就位）
      if (!shown) {
        shown = true;
        if (stage) stage.classList.add('ready');
      }
      // 角标 u_time 时钟（约 4 次/秒刷新，省性能）
      if (clockEl && nowMs - lastClockMs > 240) {
        lastClockMs = nowMs;
        clockEl.textContent = 'u_time ' + t.toFixed(1) + 's';
      }
      // FPS 统计（每 500ms 刷新一次）
      frames++;
      if (nowMs - fpsMark >= 500) {
        var fps = Math.round(frames * 1000 / (nowMs - fpsMark));
        if (opts.fpsEl) opts.fpsEl.textContent = fps + ' fps';
        frames = 0;
        fpsMark = nowMs;
      }
    }

    // 鼠标 / 触摸：y 轴翻转为 GL 习惯（左下原点）。
    // 画布用 object-fit: contain 居中方形内容区，指针坐标需换算进内容区
    // （黑边区域钳制到边缘），单位与 gl_FragCoord 一致（设备像素）。
    function pointer(clientX, clientY) {
      var r = canvas.getBoundingClientRect();
      var scale = Math.min(r.width / canvas.width, r.height / canvas.height) || 1;
      var ox = (r.width - canvas.width * scale) / 2;
      var oy = (r.height - canvas.height * scale) / 2;
      var cx = (clientX - r.left - ox) / scale;
      var cy = (clientY - r.top - oy) / scale;
      mouse.x = Math.min(Math.max(cx, 0), canvas.width);
      mouse.y = canvas.height - Math.min(Math.max(cy, 0), canvas.height);
    }
    canvas.addEventListener('pointermove', function (e) { pointer(e.clientX, e.clientY); });
    canvas.addEventListener('pointerdown', function (e) { pointer(e.clientX, e.clientY); });

    // 尺寸自适应
    if (typeof ResizeObserver !== 'undefined') {
      var ro = new ResizeObserver(applySize);
      ro.observe(canvas);
    } else {
      window.addEventListener('resize', applySize);
    }

    api.setCode = function (code) {
      var p = createProgram(gl, code);
      var ok = !!p;
      // 编译状态回调（LIVE / ERROR）
      if (opts.onStatus) opts.onStatus(ok);
      if (!p) return false;
      if (program) gl.deleteProgram(program);
      program = p;
      loc = {
        position: gl.getAttribLocation(program, 'a_position'),
        time: gl.getUniformLocation(program, 'u_time'),
        resolution: gl.getUniformLocation(program, 'u_resolution'),
        mouse: gl.getUniformLocation(program, 'u_mouse'),
        delta: gl.getUniformLocation(program, 'u_delta')
      };
      return true;
    };
    api.resize = applySize;
    api.dispose = function () {
      dead = true;
      if (rafId) cancelAnimationFrame(rafId);
    };

    rafId = requestAnimationFrame(frame);
    return api;
  }

  /* ============================================================
   * 轻量 GLSL 代码高亮（无需编译器，仅做词法着色）。
   * 把原始 GLSL 文本转成带 <span class="tok-*"> 的 HTML，供教程与
   * 参考答案里的 <pre><code> 使用；实时同步 .answer.frag 时也会重新着色。
   * ============================================================ */
  function escapeHtml(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  var HL_KEY = {
    'void': 1, 'const': 1, 'struct': 1, 'if': 1, 'else': 1, 'for': 1,
    'while': 1, 'return': 1, 'break': 1, 'continue': 1, 'discard': 1,
    'in': 1, 'out': 1, 'inout': 1
  };
  var HL_TYPE = {
    'float': 1, 'int': 1, 'bool': 1, 'vec2': 1, 'vec3': 1, 'vec4': 1,
    'mat2': 1, 'mat3': 1, 'mat4': 1, 'sampler2D': 1, 'samplerCube': 1
  };
  var HL_QUAL = {
    'uniform': 1, 'attribute': 1, 'varying': 1, 'precision': 1,
    'highp': 1, 'mediump': 1, 'lowp': 1
  };
  var HL_BUILTIN = {
    'gl_FragColor': 1, 'gl_FragCoord': 1, 'gl_Position': 1,
    'gl_PointSize': 1, 'gl_PointCoord': 1, 'gl_VertexID': 1
  };

  function hlClass(word) {
    if (HL_KEY[word]) return 'tok-key';
    if (HL_TYPE[word]) return 'tok-type';
    if (HL_QUAL[word]) return 'tok-qual';
    if (HL_BUILTIN[word]) return 'tok-builtin';
    return null;
  }

  function highlightGLSL(src) {
    if (!src) return '';
    var re = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|(#[^\n]*)|([A-Za-z_]\w*)|(\d*\.\d+(?:[eE][+-]?\d+)?|\d+\.?(?:[eE][+-]?\d+)?)|([\s\S])/g;
    var out = '';
    var m;
    while ((m = re.exec(src)) !== null) {
      if (m[1]) {
        out += '<span class="tok-comment">' + escapeHtml(m[1]) + '</span>';
      } else if (m[2]) {
        out += '<span class="tok-preproc">' + escapeHtml(m[2]) + '</span>';
      } else if (m[3]) {
        var w = m[3];
        var rest = src.slice(re.lastIndex);
        var isCall = /^\s*\(/.test(rest);
        var cls = hlClass(w) || (isCall ? 'tok-func' : null);
        out += cls ? '<span class="' + cls + '">' + escapeHtml(w) + '</span>' : escapeHtml(w);
      } else if (m[4]) {
        out += '<span class="tok-num">' + escapeHtml(m[4]) + '</span>';
      } else {
        out += escapeHtml(m[5]);
      }
    }
    return out;
  }

  /**
   * 页面入口：由详情页底部内联脚本调用。
   * @param cfg { correct, current, editor, resetBtn, referenceCode, exerciseCode, fpsCorrect, fpsCurrent, dotCurrent }
   */
  /**
   * 轮询监听一个 .frag 源文件（供「直接改 glsl 文件 → 预览即时更新」）。
   * 首次成功加载与之后每次检测到内容变化都回调 onChange(text, isFirst)；
   * 是否应用由调用方决定（练习侧需避开用户正在输入的时机）。
   */
  function watchFile(url, onChange) {
    var last = null;
    var inFlight = false;
    function tick() {
      if (inFlight || document.hidden || typeof fetch !== 'function') return;
      inFlight = true;
      fetch(url + '?t=' + Date.now(), { cache: 'no-store' })
        .then(function (r) { return r.ok ? r.text() : Promise.reject(new Error(r.status)); })
        .then(function (text) {
          inFlight = false;
          if (last !== null && text === last) return;
          var isFirst = last === null;
          last = text;
          onChange(text, isFirst);
        })
        .catch(function () { inFlight = false; });
    }
    tick();
    setInterval(tick, 1500);
  }

  /**
   * 页面入口：由详情页底部内联脚本调用。
   * @param cfg {
   *   canvas        单一预览画布（正确/当前预览通过模式切换共用）
   *   modeBtns      模式切换按钮组（.mode-btn[data-mode="reference|current"]）
   *   stage         舞台 figure（用于按模式切换 RESET 显隐等 body class）
   *   statusEl      「当前预览」按钮（内含 .st-dot 与 .st-label，LIVE/ERROR）
   *   resetBtn      重置 pill（恢复练习文件最新内容，仅当前预览模式显示）
   *   answerCodeEl  答案 Tab 的 <code>（参考文件变更时同步）
   *   fpsEl         FPS 角标
   *   referenceCode / exerciseCode  页面内嵌兜底代码
   *   referenceSrc  / exerciseSrc     .frag 源文件地址（轮询监听）
   * }
   */
  function boot(cfg) {
    var codes = {
      reference: cfg.referenceCode || '',
      current: cfg.exerciseCode || ''
    };
    var mode = 'reference';

    var stage = createPreview(cfg.canvas, {
      code: codes[mode],
      fpsEl: cfg.fpsEl,
      onStatus: function (ok) {
        // 编译状态只反映「当前预览」的代码
        if (!cfg.statusEl || mode !== 'current') return;
        cfg.statusEl.classList.toggle('err', !ok);
        var lbl = cfg.statusEl.querySelector('.st-label');
        if (lbl) lbl.textContent = ok ? 'LIVE' : 'ERROR';
        cfg.statusEl.title = ok ? '' : '编译失败：显示上一次正确画面';
      }
    });

    function setMode(m) {
      if (m === mode) return;
      mode = m;
      if (cfg.modeBtns && cfg.modeBtns.length) {
        Array.prototype.forEach.call(cfg.modeBtns, function (b) {
          var on = b.dataset.mode === m;
          b.classList.toggle('active', on);
          b.setAttribute('aria-selected', on ? 'true' : 'false');
        });
      }
      if (cfg.stage) cfg.stage.classList.toggle('mode-reference', m === 'reference');
      stage.setCode(codes[m]);
    }
    if (cfg.modeBtns && cfg.modeBtns.length) {
      Array.prototype.forEach.call(cfg.modeBtns, function (b) {
        b.addEventListener('click', function () { setMode(b.dataset.mode); });
      });
    }

    if (cfg.resetBtn) {
      cfg.resetBtn.addEventListener('click', function () {
        codes.current = exerciseFileText;
        if (mode === 'current') stage.setCode(codes.current);
      });
    }

    // ---- 源文件抽离：glsl/<part>/<slug>.frag（练习）与 .answer.frag（参考）----
    // 直接在编辑器/IDE 里改 .frag 文件，预览会在 ~1.5s 内自动更新，无需刷新页面。
    var exerciseFileText = codes.current;   // 练习文件最新内容（RESET 目标）
    if (cfg.exerciseSrc) {
      watchFile(cfg.exerciseSrc, function (text, isFirst) {
        codes.current = text;
        exerciseFileText = text;
        // 处于当前预览模式（或首次加载）才立即重编译；否则等切换时再编译
        if (mode === 'current' || isFirst) stage.setCode(text);
      });
    }
    if (cfg.referenceSrc) {
      watchFile(cfg.referenceSrc, function (text, isFirst) {
        codes.reference = text;
        if (mode === 'reference' || isFirst) stage.setCode(text);
        // 参考答案实时同步后重新着色（此前是 textContent，会丢失高亮 span）
        if (cfg.answerCodeEl) cfg.answerCodeEl.innerHTML = highlightGLSL(text);
      });
    }

    // ---- GLSL 代码高亮：教程介绍里的代码块 + 参考答案完整代码 ----
    Array.prototype.forEach.call(document.querySelectorAll('#tab-intro pre code'), function (el) {
      el.innerHTML = highlightGLSL(el.textContent);
    });
    if (cfg.answerCodeEl) cfg.answerCodeEl.innerHTML = highlightGLSL(cfg.answerCodeEl.textContent);
    // 说明：页面切到后台时浏览器会自动暂停 rAF，无需手动停表；
    // 因此这里不做 visibility 重建（重建会重复绑定指针事件）。
  }

  window.SLRuntime = { boot: boot, createPreview: createPreview, highlightGLSL: highlightGLSL };
})();
