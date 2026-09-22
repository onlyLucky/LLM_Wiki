// Day 2 · 作业 challenge —— 粒子计算着色器（参考答案）
// 读 src 写 dst，两组绑定组轮换（讲义 2.7 的状态机）。
// struct 与噪声函数骨架已给全；力场五件套 + 半隐式欧拉积分 + 出界重生在 update 里。

struct Particle {
  pos: vec4f, // xyz 位置；w 未用。std430 下 vec3f 按 16 字节对齐，
  vel: vec4f, // xyz 速度；w 未用。用 vec4f 免去手写 padding
};

struct Sim {
  mouse: vec4f,  // xyz 鼠标世界坐标，w 是否按下
  params: vec4f, // x 时间, y dt, z aspect, w 未用
};

@group(0) @binding(0) var<storage, read> src: array<Particle>;
@group(0) @binding(1) var<storage, read_write> dst: array<Particle>;
@group(0) @binding(2) var<uniform> u: Sim;

// ---- simplex noise 3D（Ashima Arts / Stefan Gustavson 版，完整可抄，
// 与讲义 2.7 同款；要向量场就三次偏移采样拼 vec3f）--------------------

fn mod289v3(x: vec3f) -> vec3f {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn mod289v4(x: vec4f) -> vec4f {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}

fn permute4(x: vec4f) -> vec4f {
  return mod289v4(((x * 34.0) + 1.0) * x);
}

fn taylorInvSqrt4(r: vec4f) -> vec4f {
  return 1.79284291400159 - 0.85373472095314 * r;
}

fn snoise(v: vec3f) -> f32 {
  let C = vec2f(1.0 / 6.0, 1.0 / 3.0);
  let D = vec4f(0.0, 0.5, 1.0, 2.0);

  let i = floor(v + dot(v, C.yyy));
  let x0 = v - i + dot(i, C.xxx);

  let g = step(x0.yzx, x0.xyz);
  let l = 1.0 - g;
  let i1 = min(g.xyz, l.zxy);
  let i2 = max(g.xyz, l.zxy);
  let x1 = x0 - i1 + C.xxx;
  let x2 = x0 - i2 + C.yyy;
  let x3 = x0 - D.yyy;

  let pi = mod289v3(i);
  let p = permute4(permute4(permute4(
    pi.z + vec4f(0.0, i1.z, i2.z, 1.0)
  ) + pi.y + vec4f(0.0, i1.y, i2.y, 1.0)
  ) + pi.x + vec4f(0.0, i1.x, i2.x, 1.0));

  let n_ = 0.142857142857;
  let ns = n_ * D.wyz - D.xzx;

  let j = p - 49.0 * floor(p * ns.z * ns.z);
  let x_ = floor(j * ns.z);
  let y_ = floor(j - 7.0 * x_);

  let x = x_ * ns.x + ns.yyyy;
  let y = y_ * ns.x + ns.yyyy;
  let h = 1.0 - abs(x) - abs(y);

  let b0 = vec4f(x.xy, y.xy);
  let b1 = vec4f(x.zw, y.zw);

  let s0 = floor(b0) * 2.0 + 1.0;
  let s1 = floor(b1) * 2.0 + 1.0;
  let sh = -step(h, vec4f(0.0));

  let a0 = b0.xzyw + s0.xzyw * sh.xxyy;
  let a1 = b1.xzyw + s1.xzyw * sh.zzww;

  let g0 = vec3f(a0.xy, h.x);
  let g1 = vec3f(a0.zw, h.y);
  let g2 = vec3f(a1.xy, h.z);
  let g3 = vec3f(a1.zw, h.w);

  let norm = taylorInvSqrt4(vec4f(dot(g0, g0), dot(g1, g1), dot(g2, g2), dot(g3, g3)));
  let n0 = g0 * norm.x;
  let n1 = g1 * norm.y;
  let n2 = g2 * norm.z;
  let n3 = g3 * norm.w;

  var m = max(0.6 - vec4f(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), vec4f(0.0));
  m = m * m;
  return 42.0 * dot(m * m, vec4f(dot(n0, x0), dot(n1, x1), dot(n2, x2), dot(n3, x3)));
}

// ---- 小 hash：重生位置/初速的伪随机 --------------------------------
// GPGPU 里没有 Math.random，sin hash 一行搞定；种子带上粒子索引和时间
fn hash11(n: f32) -> f32 {
  return fract(sin(n) * 43758.5453123);
}

@compute @workgroup_size(64)
fn update(@builtin(global_invocation_id) gid: vec3u) {
  let i = gid.x;
  // 107 个 workgroup × 64 = 10688 > 10000：越界的 invocation 自己退出
  if (i >= arrayLength(&src)) { return; }

  let p = src[i].pos.xyz;
  let v = src[i].vel.xyz;

  // 1) 噪声湍流：三次偏移采样合成一个随时间流动的扰动向量
  //    频率与幅度都比星系版高——火苗要的就是摇曳
  let np = p * 1.1;
  let turb = vec3f(
    snoise(np + vec3f(0.0, 0.0, u.params.x * 0.25)),
    snoise(np + vec3f(31.4, 47.2, u.params.x * 0.25)),
    snoise(np + vec3f(-12.9, 88.3, u.params.x * 0.25)),
  ) * 0.55;

  // 2) 浮力 + 烟囱束缚：恒定上升（终端速度 1.25 / 1.0 = 1.25，
  //    恰好冲进色带的金/白热段——核心比外缘亮两档），水平方向被轻轻拢回轴心
  var accel = turb;
  accel += vec3f(0.0, 1.25, 0.0);
  accel += vec3f(-p.x * 0.35, 0.0, -p.z * 0.35);

  // 3) 鼠标风：按住时从光标往外吹（方向与引力井正好相反），松开无风
  let toP = p - u.mouse.xyz;
  let dm2 = dot(toP, toP);
  let gust = select(0.0, 2.6, u.mouse.w > 0.5) / (dm2 + 0.40);
  accel += toP / (sqrt(dm2) + 1e-4) * gust;

  // 4) 半隐式欧拉积分 + 速度阻尼 + 限速
  let dt = u.params.y;
  var nv = (v + accel * dt) * exp(-1.0 * dt);
  let sp = length(nv);
  if (sp > 1.8) { nv = nv * (1.8 / sp); }
  var np2 = p + nv * dt;

  // 5) 出界重生：飘出烟囱顶的余烬回到火床
  //    GPGPU 状态机里也能编码生命周期——重置的是 dst 这一行的位置和速度
  if (np2.y > 1.55) {
    let seed = f32(i) * 0.618 + u.params.x * 7.13;
    np2 = vec3f(
      (hash11(seed) - 0.5) * 1.7,
      -1.42,
      (hash11(seed + 91.7) - 0.5) * 1.7,
    );
    nv = vec3f(0.0, 0.28 + hash11(seed + 43.1) * 0.4, 0.0);
  }

  dst[i] = Particle(vec4f(np2, 0.0), vec4f(nv, 0.0));
}
