# Day 2 作业 basic 参考答案 · 旋转的立方体

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day2/basic-旋转的立方体/index.html
```

## 实现要点

- `perspective`（任务 1）：WebGPU 版只有两个元素与 OpenGL 教材不同——`m[10] = far / (near - far)`、`m[14] = (near * far) / (near - far)`，把 z 压进 [0, 1]；`m[11] = -1` 让 `w = -z_view`，「相机前方」变成正 w，透视除法后近大远小
- `lookAt`（任务 2）：基变换——`z = normalize(eye - target)`（相机后方）、`x = normalize(up × z)`（右方）、`y = z × x`（真正上方向）写成前三列，平移的负值 `-(x·eye, y·eye, z·eye)` 写进第四列
- 深度三件套（任务 3）：`ensureDepth` 创建与画布物理像素同尺寸的 `depth24plus` 纹理（尺寸变了先 destroy 再建）；pipeline 声明 `depthStencil: { format, depthWriteEnabled: true, depthCompare: 'less' }`；renderPass 挂 `depthStencilAttachment` 并 `depthClearValue: 1.0`——1 是最远，'less' 下「更近」才通过
- `modelMatrix`（任务 4）：`multiply(rotX(t * 0.23), rotY(t * 0.5))` 两个轴各转一点即绕斜轴；周期刻意不同步（0.5 vs 0.23），自转轨迹不会周期性重复

## 与骨架的差异

- `perspective()` / `lookAt()` / `ensureDepth()` / `modelMatrix()`：四个 `throw` 全部替换为实现（任务 1–4）
- 新增 `mat4RotateX()` / `mat4RotateY()` 两个私有辅助函数（任务 4 需要它们，骨架未提供）
- pipeline 补 `depthStencil` 配置（任务 3b），renderPass 补 `depthStencilAttachment`（任务 3c）
- `cube.wgsl` 与骨架逐字一致——本作业的着色器骨架已给全，学习点全在 main.ts

## 视觉规格

- 色板：前 +z 电蓝 `#4C6FFF`、后 −z 紫 `#8B5CF6`、右 +x 青 `#2DD4BF`、左 −x 琥珀 `#F59E0B`、上 +y 主白 `#E8ECF4`、下 −y 浅蓝 `#8FA5FF`
- 相机：FOV 50°、eye (2.6, 2.0, 4.2) 俯视固定，立方体绕斜轴自转（Y 轴 0.5 rad/s、X 轴 0.23 rad/s）
- 深度：面与面交叠处干净无 z-fighting；背面剔除下永远看不到「里子」
- 动效：整颗立方体 ±4% 呼吸亮度（fs 里的 `sin`），自转连续无跳变
