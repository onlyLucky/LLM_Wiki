// Day 2 · 作业 basic —— 信标着色器（骨架已给全）
// 顶点色插值 + mvp 变换。水晶与线框笼共用这一份着色器：
// 拓扑（triangle-list / line-list）是管线的属性，与 vs/fs 无关。

struct Uniforms {
  mvp: mat4x4f,
  params: vec4f, // x 时间（秒）
};

@group(0) @binding(0) var<uniform> u: Uniforms;

struct VOut {
  @builtin(position) position: vec4f,
  @location(0) color: vec3f, // 顶点色，光栅化阶段自动插值
};

@vertex
fn vs(
  @location(0) position: vec3f,
  @location(1) color: vec3f,
) -> VOut {
  var out: VOut;
  out.position = u.mvp * vec4f(position, 1.0);
  out.color = color;
  return out;
}

@fragment
fn fs(@location(0) color: vec3f) -> @location(0) vec4f {
  // 轻微呼吸亮度：静态验收画面也不死板
  let breathe = 1.0 + 0.06 * sin(u.params.x * 1.4);
  return vec4f(color * breathe, 1.0);
}
