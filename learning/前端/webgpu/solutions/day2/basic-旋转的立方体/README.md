# Day 2 作业 basic 参考答案 · 深空信标（旋转的立方体）

## 运行

```bash
npm run dev
# http://localhost:5173/solutions/day2/basic-旋转的立方体/index.html
```

## 实现要点

- `perspective`（任务 1）：WebGPU 版只有两个元素与 OpenGL 教材不同——`m[10] = far / (near - far)`、`m[14] = (near * far) / (near - far)`，把 z 压进 [0, 1]；`m[11] = -1` 让 `w = -z_view`，「相机前方」变成正 w，透视除法后近大远小
- `lookAt`（任务 2）：基变换——`z = normalize(eye - target)`（相机后方）、`x = normalize(up × z)`（右方）、`y = z × x`（真正上方向）写成前三列，平移的负值 `-(x·eye, y·eye, z·eye)` 写进第四列
- 深度三件套（任务 3）：`ensureDepth` 创建与画布物理像素同尺寸的 `depth24plus` 纹理（尺寸变了先 destroy 再建）；**两条** pipeline 各声明 `depthStencil: { format, depthWriteEnabled: true, depthCompare: 'less' }`——线框没有「内外面」，但它照样要和实体比深度；renderPass 挂 `depthStencilAttachment` 并 `depthClearValue: 1.0`——1 是最远，'less' 下「更近」才通过
- `modelMatrix`（任务 4）：`multiply(rotX(t * 0.23), rotY(t * 0.5))` 两个轴各转一点即绕斜轴；周期刻意不同步（0.5 vs 0.23），自转轨迹不会周期性重复

## 与骨架的差异

- `perspective()` / `lookAt()` / `ensureDepth()` / `modelMatrix()`：四个 `throw` 全部替换为实现（任务 1–4）
- 水晶管线与线框管线各补一份 `depthStencil`（任务 3b），renderPass 补 `depthStencilAttachment`（任务 3c）——骨架注释里已提示「两个 pipeline 各补一份」
- `beacon.wgsl` 与骨架逐字一致——本作业的着色器骨架已给全，学习点全在 main.ts

## 场景与视觉规格

- **水晶**：八面体（6 顶点 / 8 面 / 24 索引）。渐变色只依赖角点高度 y——颜色属于「角点」，6 个顶点共享即可，插值跨面连续；与课程 demo 的立方体（颜色属于「面」，须展开 24 顶点）互为讲义 2.2 的正反对照
- 色板：底 `#1B1440` → 赤道 `#3E7BD6` → 顶 `#8FF0FF`，`h = (y+1)/2` 归一化后三段插值
- **线框笼**：立方体（8 顶点 / 12 边 / 24 索引），`topology: 'line-list'`、`CAGE_SIZE = 1.5`、色 `#5D7FA8` 暗青灰（笼是配角）。线没有内外面，不怕背面剔除，只靠深度测试与水晶互相遮挡
- 动效：水晶自转 `rotX(t·0.23) · rotY(t·0.5)`；笼固定倾斜 0.32 rad 后反向慢转 `rotY(-t·0.16)`——转轴错开，陀螺仪内外环感；整体 ±6% 呼吸亮度（fs 里的 `sin`）
- 相机：FOV 50°、eye (2.9, 1.9, 4.9) 俯视固定；同一 renderPass 两批 `drawIndexed(24)`（8 三角形 / 12 条边），深度测试自动处理遮挡
- 深度：水晶棱穿过笼横杆处遮挡干净无 z-fighting；背面剔除下永远看不到水晶「里子」
