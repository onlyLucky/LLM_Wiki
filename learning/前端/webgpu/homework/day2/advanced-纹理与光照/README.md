# Day 2 作业 advanced · 纹理与光照

同一颗立方体，这次给它皮肤与光：canvas 程序化生成贴图、上传 GPU 生成 mipmap、三线性采样、Blinn-Phong 光照，最后点击画布在三种色温之间切换。轨道相机与矩阵已给全，约 1.5 小时。

## 目标

打通「像素从哪来、光往哪去」两条链路。纹理链路覆盖 2.3 的上传与采样全流程；光照链路把 2.4 的 Blinn-Phong 公式亲手落进 WGSL；色温切换练习 uniform 的交互联动——创意网站里「点击改变场景情绪」的交互原形。

## 前置讲义

- 前置讲义 2.1（空间变换）：轨道相机的矩阵组合
- 前置讲义 2.3（纹理采样与 Mipmap）：上传、mip 链、三线性
- 前置讲义 2.4（着色与光照模型）：Blinn-Phong 公式

## 任务清单

1. `createAlbedoTexture()`——canvas 画 512×512 程序化贴图，`createTexture` + `copyExternalImageToTexture` 上传，mipmap 用 canvas 逐级降采样再逐级 copy
2. `createSamplerAndBindGroup()`——三线性 sampler + 渲染绑定组两个 binding（texture view 与 sampler，`@group(1)`）
3. `textured.wgsl` 的 `fs`——完整 Blinn-Phong：ambient + diffuse + specular（半程向量），光色乘 `u.lightColor`
4. 三档色温——`currentLightColor()` 返回当前档，点击画布循环切换并在右下角 meta 显示档名

TODO 1 / 2 / 4 的函数体是 `throw new Error('TODO(day2-advanced-n) 未完成')`，补完删 throw；TODO 3 直接改 WGSL（占位输出会先让你看到贴图与色温通道）。

## 验收标准

- 贴图清晰有 mipmap：六个面纹理完整无拉伸，相机拉远（滚轮没做就拖远视角）时贴图平滑变糊、不闪不噪
- 光影随光源移动：光源绕场景转动，立方体表面的亮面跟着走，暗部不死黑（有 ambient）
- 点击切换色温：冷月光 → 正午白 → 钨丝暖循环，三档差异一眼可辨，右下角显示档名
- 高光随视角变化：拖动相机时亮斑位置随之移动（Blinn 半程向量的效果）

## 提示

<details>
<summary>第一档：思路</summary>

贴图内容随意但别用纯色——远处的 mip 会把细节平均掉，纯色贴图看不出 mip 生效。canvas 路线：第 0 级直接 copy；第 n 级把上一级的 canvas 用 `drawImage` 缩到一半再 copy，循环到 1×1。sampler 三个过滤项都填 linear 才是三线性。Blinn-Phong 与 Phong 的差别只在高光：半程向量 H = normalize(L + V)，比反射向量便宜且高光形状更贴直觉。色温切换不用重建任何 GPU 对象——lightColor 本来就每帧写进 uniform，改的只是 JS 侧的一个索引。
</details>

<details>
<summary>第二档：API 名</summary>

`createTexture({ size: [512, 512], format: 'rgba8unorm', mipLevelCount: 10, usage: GPUTextureUsage.TEXTURE_BINDING | GPUTextureUsage.COPY_DST | GPUTextureUsage.RENDER_ATTACHMENT })`——RENDER_ATTACHMENT 不是可选项，copyExternalImageToTexture 内部要过渲染通路，缺它整条 mip 链拷贝都会验证失败；`device.queue.copyExternalImageToTexture({ source: canvas }, { texture, mipLevel: n }, [w, h])`——mipLevel 就是各级的目的地；`device.createSampler({ magFilter: 'linear', minFilter: 'linear', mipmapFilter: 'linear' })`；bind group 的 entry 直接写 `{ binding: 1, resource: sampler }`（texture 的 resource 是 `texture.createView()`，不带参数的 view 就是整条 mip 链）。Blinn-Phong 参考 demos/day2/03-phong-lighting 的 `fs`——结构一样，但作业是单光源 + 采样贴图，别整段照抄。
</details>

<details>
<summary>第三档：伪代码</summary>

```text
createAlbedoTexture:
  tex = createTexture(rgba8unorm, mipLevelCount: 10,
                      TEXTURE_BINDING | COPY_DST | RENDER_ATTACHMENT,
                      size 512)
  src = drawTextureCanvas(512)         # 底色 + 网格 + 图形
  copyExternalImageToTexture(src → tex, mipLevel: 0, [512, 512])
  for level in 1..9:
    dst = new canvas(512 >> level)
    dst2d.drawImage(src, 0, 0, dst.width, dst.height)   # 降采样
    copyExternalImageToTexture(dst → tex, mipLevel: level, [w, h])
  return tex

fs 的 Blinn-Phong:
  N = normalize(in.normal)
  L = normalize(u.light.xyz - in.worldPos)
  V = normalize(u.camera.xyz - in.worldPos)
  H = normalize(L + V)
  lc = u.lightColor.rgb
  ambient  = albedo * 0.08 * lc
  diffuse  = albedo * max(dot(N, L), 0.0) * lc
  specular = lc * pow(max(dot(N, H), 0.0), 64.0)
  color = ambient + diffuse + specular
  return vec4(pow(color, 1/2.2), 1.0)

色温切换:
  click → tempIndex = (tempIndex + 1) % 3
        → chrome.setMeta(`色温 ${tempIndex + 1}/3 · ${COLOR_TEMPS[tempIndex].name}`)
  帧循环 → uniforms[40..42] = COLOR_TEMPS[tempIndex].rgb（经 currentLightColor()）
```
</details>
