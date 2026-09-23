#version 300 es
// Day 1 · Demo 02 —— UV 观测台
// 一块测量仪器：网格是刻度盘，鼠标是测头。
// 环外：UV 调色板 10% 暗显成「底片」；取样环内：该像素的身份色 85% 显影——
// R = uv.x、G = uv.y，环内颜色直接报出坐标。
// 注意：#version 必须是着色器源码第一行，注释只能写在它后面。
precision highp float;

uniform vec2 u_resolution; // 物理像素（与 gl_FragCoord 同域）
uniform vec2 u_mouse;      // 0-1，已翻转为左下原点——与 uv 同域，直接可比
out vec4 fragColor;

const vec3 BG   = vec3(0.043, 0.055, 0.078); // #0B0E14
const vec3 ROSE = vec3(1.000, 0.302, 0.427); // #FF4D6D
const vec3 CYAN = vec3(0.298, 0.788, 0.941); // #4CC9F0
const vec3 GRID = vec3(0.224, 0.286, 0.376); // 刻度盘暗青

const float LENS_R = 0.075; // 取样环半径（x 已做宽高比校正 → 屏幕真圆）

float gPx; // 1 物理像素对应的 uv 长度 = 1 / u_resolution.y，供描边函数抗锯齿

// 到最近网格线的距离场：n = 每行格数
float gridDist(vec2 p, float n) {
  vec2 g = abs(fract(p * n) - 0.5) / n;
  return min(g.x, g.y);
}
// 1.5px 半宽描边：在距离场 d 过零处画线
float stroke(float d) {
  return 1.0 - smoothstep(0.0, gPx * 1.5, abs(d));
}
// 1.5px 抗锯齿实心
float fill(float d) {
  return 1.0 - smoothstep(0.0, gPx * 1.5, d);
}

void main() {
  // —— UV 的来历只有一行：gl_FragCoord 左下原点物理像素 ÷ 同域分辨率 = 0-1
  vec2 uv = gl_FragCoord.xy / u_resolution;
  float aspect = u_resolution.x / u_resolution.y;
  gPx = 1.0 / u_resolution.y;

  // —— 身份色调色板：R = uv.x、G = uv.y（B 垫 0.12 免得原点全黑）
  vec3 palette = vec3(uv.x, uv.y, 0.12);

  // 测头：x 乘 aspect 校正屏幕等距——否则「圆」在宽屏被拉成椭圆（1.5 的宽高比陷阱）
  vec2 toM = (uv - u_mouse) * vec2(aspect, 1.0);
  float dM = length(toM);

  vec3 col = BG;

  // 1) 调色板底片：环外 10% 暗显，取样环内 85% 显影
  float lens = 1.0 - smoothstep(LENS_R - gPx * 3.0, LENS_R + gPx * 3.0, dM);
  col = mix(col, palette, 0.10 + 0.75 * lens);

  // 2) 刻度盘：0.1 细网格 + 0.5 主网格
  col = mix(col, GRID, stroke(gridDist(uv, 10.0)) * 0.35);
  col = mix(col, GRID * 1.5, stroke(gridDist(uv, 2.0)) * 0.80);

  // 3) 四边刻度尺：短刻每 0.1（长 1.1%）、长刻每 0.5（长 2.3%）
  float nearH = min(uv.y, 1.0 - uv.y);
  float nearV = min(uv.x, 1.0 - uv.x);
  float gX10 = abs(fract(uv.x * 10.0) - 0.5) / 10.0;
  float gX50 = abs(fract(uv.x *  2.0) - 0.5) /  2.0;
  float gY10 = abs(fract(uv.y * 10.0) - 0.5) / 10.0;
  float gY50 = abs(fract(uv.y *  2.0) - 0.5) /  2.0;
  float tick = max(
    max(stroke(gX10) * (1.0 - smoothstep(0.010, 0.012, nearH)) * 0.55,
        stroke(gX50) * (1.0 - smoothstep(0.022, 0.024, nearH)) * 0.90),
    max(stroke(gY10) * (1.0 - smoothstep(0.010, 0.012, nearV)) * 0.55,
        stroke(gY50) * (1.0 - smoothstep(0.022, 0.024, nearV)) * 0.90));
  col = mix(col, GRID * 1.8, tick);

  // 4) 游标准线：跟随测头的两条贯穿虚线（读出当前取样坐标）
  float cur = max(stroke(uv.y - u_mouse.y) * step(0.55, fract(uv.x * 70.0)),
                  stroke(uv.x - u_mouse.x) * step(0.55, fract(uv.y * 70.0)));
  col = mix(col, CYAN, cur * 0.30);

  // 5) 中心取景十字：静态参考系，中段留空像取景器
  vec2 c = uv - 0.5;
  float arm = max(
    stroke(c.y) * smoothstep(0.052, 0.058, abs(c.x)) * (1.0 - smoothstep(0.102, 0.108, abs(c.x))),
    stroke(c.x) * smoothstep(0.052, 0.058, abs(c.y)) * (1.0 - smoothstep(0.102, 0.108, abs(c.y))));
  col = mix(col, CYAN, arm * 0.40);

  // 6) 原点标记：0,0 处一枚玫红点——调色板左下角必须全黑，它就是 y 轴方向的试金石
  col = mix(col, ROSE,
            fill(length((uv - vec2(0.006, 0.006)) * vec2(aspect, 1.0)) - gPx * 1.5) * 0.9);

  // 7) 测头：取样环 + 环上四向刻 + 中心点
  col = mix(col, ROSE, stroke(dM - LENS_R) * 0.95);
  float notch = max(
    stroke(toM.y) * smoothstep(LENS_R + gPx * 2.0, LENS_R + gPx * 4.0, dM) * (1.0 - smoothstep(0.014, 0.016, dM)),
    stroke(toM.x) * smoothstep(LENS_R + gPx * 2.0, LENS_R + gPx * 4.0, dM) * (1.0 - smoothstep(0.014, 0.016, dM)));
  col = mix(col, CYAN, notch * 0.80);
  col = mix(col, ROSE, fill(dM - gPx * 1.2));

  fragColor = vec4(col, 1.0);
}
