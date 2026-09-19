# Day 2 作业 basic · 旋转的立方体

一颗六面各色的立方体在深空里绕斜轴自转。几何、管线、外壳、帧循环全部就位，你要补的是让它「站住」的三块地基：透视矩阵、视图矩阵、深度测试。完成后约 1 小时。

## 目标

亲手写出 MVP 三件套里缺的三件——不抄库、不求逆矩阵，用最笨的方式把列主序矩阵的每一行写对，并让深度测试在管线里全链路生效。这是 Day 3 之前一切 3D 画面的地基。

## 前置讲义

- 前置讲义 2.1（空间变换）：列主序约定、perspective / lookAt 的构造思路
- 前置讲义 2.2（光栅化与片元插值）：为什么六面颜色要 24 个顶点

## 任务清单

1. `perspective(fovY, aspect, near, far)`——手写透视投影矩阵（WebGPU 版：NDC z ∈ [0, 1]）
2. `lookAt(eye, target, up)`——手写视图矩阵（相机搬到原点、-z 朝目标）
3. 深度测试三件套——a) `ensureDepth` 创建 depth texture；b) `createRenderPipeline` 补 `depthStencil`；c) renderPass 补 `depthStencilAttachment`
4. `modelMatrix(t)`——模型矩阵随时间旋转（绕斜轴）并每帧 `writeBuffer`

每个 TODO 处脚手架直接 `throw new Error('TODO(day2-basic-n) 未完成')`，补完对应函数体（删掉 throw）即可。

## 验收标准

- 透视正确：立方体近大远小，六个面没有拉伸变形
- 六面颜色正确：电蓝 / 紫 / 青 / 琥珀 / 主白 / 浅蓝各归各面，背面剔除正常（看不到「里子」）
- 无 z-fighting：自转全程面与面交叠处干净，没有闪烁的碎斑
- 帧率稳定 60FPS（右下角 meta），画布缩放后画面不糊不裂

## 提示

<details>
<summary>第一档：思路</summary>

perspective 的本质是把视锥压成立方体：x/y 除以 z 的思路藏在第 4 列的 `-1`（w = -z_view），近远平面负责把 z 压进 [0, 1]。lookAt 的本质是基变换：新坐标系的三个轴（右、上、后方）写成矩阵的前三列，把相机平移量的负值写进第四列。深度三件套的顺序：texture 的尺寸必须与画布物理像素一致；pipeline 声明格式与比较方式；renderPass 把 texture 的 view 挂上去并 clear 到 1.0（1 = 最远）。模型矩阵可以把绕 X 轴与绕 Y 轴两个旋转 mat4Multiply 起来，斜轴旋转就出来了。
</details>

<details>
<summary>第二档：API 名</summary>

`GPUTextureUsage.RENDER_ATTACHMENT`；`depth24plus`；`depthStencil: { format, depthWriteEnabled: true, depthCompare: 'less' }`；`depthStencilAttachment: { view, depthClearValue: 1.0, depthLoadOp: 'clear', depthStoreOp: 'store' }`。矩阵参考 demos/day2/01-mvp-cube 的 `mat4Perspective` / `mat4LookAt`（注意：作业要求自己写，不要复制粘贴，照着公式敲一遍才算数）。WebGPU 透视矩阵的两个关键元素：`m[10] = far / (near - far)`、`m[14] = (near * far) / (near - far)`，与 OpenGL 版的差异点。
</details>

<details>
<summary>第三档：伪代码</summary>

```text
perspective:
  f = 1 / tan(fovY / 2)
  m = zeros(16)
  m[0] = f / aspect        # x 缩放
  m[5] = f                 # y 缩放
  m[10] = far / (near - far)   # z 压到 [0,1]（WebGPU 版）
  m[11] = -1               # w = -z_view
  m[14] = near * far / (near - far)
  return m

lookAt(eye, target, up):
  z = normalize(eye - target)      # 相机后方
  x = normalize(cross(up, z))      # 相机右方
  y = cross(z, x)                  # 真正的上方向
  m 的第 1/2/3 列 = x / y / z（各占 3 个元素）
  m 的第四列 = -(x·eye, y·eye, z·eye)
  m[15] = 1

modelMatrix(t):
  rotY = 绕 Y 轴旋转 t * 0.5
  rotX = 绕 X 轴旋转 t * 0.23（周期不同步，轨迹才不呆板）
  return multiply(rotX, rotY)   # 或再加一个绕 Z

ensureDepth(w, h):
  if depthTexture 尺寸 == (w, h): return
  depthTexture?.destroy()
  depthTexture = createTexture({ size: [w, h], format: 'depth24plus',
                                 usage: RENDER_ATTACHMENT })
```
</details>
