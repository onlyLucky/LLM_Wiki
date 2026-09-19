// Day 1 · 作业 C —— 星轨动画（参考答案）
// 顶点是静态圆上的点（buffer 提供）；环号、转速、相位与视差全部在 vs 里
// 用 vertex_index 与 uniform 推导——数据不动、着色器算。

struct Uniforms {
  time: f32,      // 字节 0：秒
  _pad: f32,      // 字节 4：对齐填充，下一个 vec2f 按 8 字节对齐
  mouse: vec2f,   // 字节 8：鼠标 NDC 坐标（-1..1）
  aspect: f32,    // 字节 16：画布宽高比
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VertexIn {
  @location(0) position: vec2f, // 静态圆上的点
  @location(1) color: vec3f,    // 沿半径渐变的顶点色
};

struct VertexOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f,
};

@vertex
fn vs(vin: VertexIn, @builtin(vertex_index) i: u32) -> VertexOut {
  // 每环 180 个顶点（90 段 × 2 端点）：整除一刀切出环号 0..5
  let ring = i / 180u;
  // 转速随环号递增（内慢外快），方向逐环反转
  let speed = 0.10 + 0.06 * f32(ring);
  let dir = select(-1.0, 1.0, (ring % 2u) == 0u);
  let angle = u.time * speed * dir;
  let c = cos(angle);
  let s = sin(angle);
  // 绕原点的 2D 旋转：数据不动，位置在这里转
  let p = vec2f(
    vin.position.x * c - vin.position.y * s,
    vin.position.x * s + vin.position.y * c,
  );
  // 视差联动：外环幅度更大——近环小移、远环大移，像更深的空间
  let parallax = u.mouse * (0.01 + 0.012 * f32(ring));

  var out: VertexOut;
  out.position = vec4f((p + parallax) * vec2f(u.aspect, 1.0), 0.0, 1.0);
  out.color = vin.color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  return vec4f(color, 1.0);
}
