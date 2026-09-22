# Day 1 · A 进阶 —— 万花筒

小时候转万花筒：筒里花纹千变万化，却永远对称。原理朴素到只有一条——**碎纸片被几面镜子反复反射**。在 GPU 上复刻它甚至不需要任何几何体：一个铺满画布的全屏 quad，其余全部交给片元着色器——把每个像素的极角折叠进一个楔形切片，画出这段花纹，八重镜像就自动成立。

这份作业不再练习在顶点里拼几何，而是把图形完全下沉到片元——这是 Day 2 光纹（raymarching 前置手感）与后处理的必经之路。

## 你要做的事

管线与顶点着色器已写全，任务只有四处，按顺序填，**每填对一层，画面点亮一层**：

| # | 位置 | 任务 |
|---|------|------|
| 1 | `main.ts` → `TODO(day1-advanced-1)` | uniform 上传：time / mouse / aspect——32 字节里藏着 1.6 讲的填充槽 |
| 2 | `kaleido.wgsl` → `TODO(day1-advanced-2)` | `toPolar`：直角坐标 → 极坐标 |
| 3 | `kaleido.wgsl` → `TODO(day1-advanced-3)` | `fold`：把任意极角折进八重楔形——万花筒的「筒壁」 |
| 4 | `kaleido.wgsl` → `TODO(day1-advanced-4)` | `mandala`：花纹本身——环、环带、花瓣、辉光、色温，这一层考设计感 |

加分项已就位：鼠标位置以 `u.mouse`（[-1,1]²）传入，用它驱动色温或花瓣开合。

## 验收标准

- 全屏八重对称曼陀罗，随时间旋转呼吸；除铺屏 quad 外零几何
- 半径方向至少两种节奏（细环 + 宽环带，或环 + 中心辉光），角向至少一层花瓣
- 鼠标移动能明显改变画面（色温 / 开合 / 转速任选其一）
- 除 TODO 标注处，未改动管线其余部分

## 三档提示

<details>
<summary>提示一 · 思路</summary>

- uniform：`time` 是 f32（4 字节），`mouse` 是 vec2f——vec2f 要求 8 字节对齐，所以 time 后面有一个 4 字节的「填充洞」。JS 数组里 `[0]` 是 time、`[1]` 是洞、`[2][3]` 是 mouse、`[4]` 是 aspect。连写 `[0][1][2][3]` 会把 mouse 的一半掉进洞里，画面上就是花纹对不上鼠标。
- 万花筒：像素 → 极坐标 (r, θ) → 对 θ 按 2π/8 取周期 → 「超过半周期就折回」的镜像 → 所有角度塌进同一个楔形。在楔形里画什么，全局就对称成什么。
- 设计感从分层来：半径方向叠「细年轮 + 宽环带 + 中心辉光」三种节奏，角向叠花瓣，最后用鼠标做一点色温插值——克制的两三个颜色，别用彩虹。
</details>

<details>
<summary>提示二 · API</summary>

- 上传：`device.queue.writeBuffer(buffer, offset, array)`
- 极坐标：`length(v)`、`atan2(y, x)`（WGSL 内建，不是 `Math.atan2`）
- 折叠：`%`（取模，负角保留符号）、`abs`、`min`
- 花纹：`sin`、`smoothstep(edge0, edge1, x)`、`mix(a, b, t)`、`pow(c, vec3f(1.0/2.2))` gamma 提亮
</details>

<details>
<summary>提示三 · 伪代码</summary>

```text
// ① uniform（main.ts）
uniforms[0] = t;                              // time
// uniforms[1] 是填充洞，跳过！
uniforms[2] = mouse.x; uniforms[3] = mouse.y; // mouse
uniforms[4] = aspect;
device.queue.writeBuffer(uniformBuffer, 0, uniforms);

// ② toPolar
return vec2f(length(uv), atan2(uv.y, uv.x));

// ③ fold：取模 → abs 折正 → min 折回
period = 2π / segments
a = theta % period
a = abs(a)
return min(a, period - a)

// ④ mandala（思路，参数自己调出设计感）
rings  = sin(r * 密度 - t * 速度)              // 细年轮向外流
bands  = smoothstep(0.35, 0.0, abs(sin(r * 稀疏 - t * 慢速)))  // 宽环带
petals = pow(0.5 + 0.5 * sin(theta * 瓣数 + 开合), 2.0)
glow   = smoothstep(0.22, 0.0, r)              // 中心辉光
warm   = mouse.x * 0.5 + 0.5
tint   = mix(冷色(电蓝), 暖色(品红), warm)
color  = 底色 + tint * (bands + rings) * petals + tint * glow
```
</details>

## 自查清单

- [ ] 旋转时花纹在楔形边界处无缝衔接（fold 的镜像做对的自然结果）
- [ ] 画布拉成窄窗时，中心圆依然是圆（aspect 校正已写好，别在 mandala 里再除一次）
- [ ] 鼠标未动时（默认 0,0）画面是稳定的冷色调，不闪烁
- [ ] 填 `toPolar` 前画面是纯色 / 填完后出现同心环 / 填完 `fold` 后出现八重对称——三层点亮对得上
