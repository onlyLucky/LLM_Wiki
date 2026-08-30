# Godot 引擎 - 关于


> 本文档内容抓取自 [Godot 官方文档](https://docs.godotengine.org/zh-cn/4.x/) (docs.godotengine.org)

> 抓取日期: 2026-08-26


---


## 目录


1. [介绍](#介绍)
2. [特性列表](#特性列表)
3. [系统需求](#系统需求)
4. [常见问题](#常见问题)
5. [遵守许可证](#遵守许可证)
6. [发布策略](#发布策略)
7. [文档变更日志](#文档变更日志)

---


# 介绍


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/introduction.html](https://docs.godotengine.org/zh-cn/4.x/about/introduction.html)



**GDScript:**

```
func_ready():print("Hello world!")
```

**C#:**

```
publicoverridevoid_Ready(){GD.Print("Hello world!");}
```

欢迎使用Godot 引擎的官方文档，这是一款自由开源、由社区驱动的 2D 和 3D 游戏引擎！在这句拗口的文字背后，你将会发现一个功能强大且用户友好的工具，你可以使用它来开发任何类型的适用于任何平台的游戏，并且没有任何使用限制。


本页对引擎和本文档进行了广泛的概述，以便让初学者知道从哪里开始，或者当需要有关特定功能的信息时，知道从哪里查找。


## 在开始之前


教程与资源页列出了由社区贡献的视频教程。如果你更喜欢视频而非文本，这些可能值得一看。否则，参考《入门》会是一个很好的起点。


如果你在某个教程或项目中遇到了问题，你可以在各个社区频道中找到帮助，特别是 Godot 的Discord社区和论坛。


## 关于 Godot 引擎


游戏引擎是一种复杂的工具，很难用三言两语说清。以下是一份简短的概要，如果你需要快速撰写一篇有关 Godot 引擎的文章，可以自由复用：


> Godot 引擎是一款功能丰富的跨平台游戏引擎，可以通过统一的界面创建 2D 和 3D 游戏。它提供了一套全面的通用工具，因此用户可以专注于制作游戏，而无需重新发明轮子。游戏可以一键导出到多个平台，包括主流的桌面平台（Linux、macOS、Windows）、移动平台（Android、iOS）、基于 Web 的平台以及主机平台。Godot 在宽松的 MIT 许可证下完全自由且开源。没有附加条件、没有抽成、什么都没有。用户的游戏乃至引擎的每一行代码，都归用户自己所有。Godot 的开发完全独立且由社区驱动，允许用户为满足期望而重塑引擎。它受到非盈利的Godot 基金会的支持。


## 文档的结构


本文档分为几个部分：


- 关于包含了此简介以及有关引擎、其历史、许可、作者等的信息。它还包含常见问题。
- 入门包含使用引擎开发游戏所需的所有信息。它从 所有新用户的起点介绍章节开始。如果你是新手，这里就是最佳起点！
- 手册可根据需要以任何顺序阅读或参考。它包含特定功能的教程和文档。
- 引擎细节包含的是面向高阶用户和贡献者的章节，包括引擎编译、编辑器开发、C++ 模块开发相关的信息。
- 社区旨在关注 Godot 社区的生活，包含了推荐的第三方教程和资料，这些内容位于本手册之外。它还提供了关于资产库的详细信息。之前它也列出了 Godot 社区，但现在这些信息已转移至Godot 网站。
- 类参考作为最后的一部分，记录的是完整的 Godot API，也可以直接在引擎的脚本编辑器中查看。你可以在这里找到关于所有类、函数、信号等相关的信息。


除了本文档之外，你可能还想看看各种Godot 演示项目。


## 关于本文档


Godot 引擎社区的成员不断编写、更正、编辑和改进本文档。我们一直在寻求更多的帮助。你也可以通过打开 Github 问题或将文档翻译成你的语言来做出贡献。如果你有兴趣提供帮助，请参阅《贡献方法》和《编写文档》，或在Godot 贡献者聊天中与文档团队交流。


除非另有说明，所有内容均在宽松的知识共享署名 3.0（CC-BY 3.0）许可下，并归属于“Juan Linietsky、Ariel Manzur 和 Godot 引擎社区”。


请享受阅读和使用 Godot 引擎制作游戏的乐趣！



---


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/list_of_features.html](https://docs.godotengine.org/zh-cn/4.x/about/list_of_features.html)



# 特性列表


本页旨在列出 Godot 当前支持的所有特性。


> **备注**
> 此页面列出了当前稳定版本的 Godot 所支持的功能。部分功能在3.x 版本系列中不可用。


## 平台


> **参见**
> 软硬件版本需求见系统需求。


> **备注**
> 主机支持的更多信息参考Godot 网站。


可以运行编辑器以及导出项目的：


- Windows (x86 和 ARM, 64位 和 32位).
- macOS（x86 和 ARM，仅 64 位）。
- Linux（x86 和 ARM，64 位和 32 位）。二进制文件是静态链接的，并且如果在足够旧的基本发行版上进行编译，则可以在任何发行版上运行。官方二进制文件是使用Godot Engine buildroot编译的，从而生成可在常见 Linux 发行版上运行的二进制文件。
- Android（编辑器支持是实验性的）。
- Web 浏览器。在 4.0 中是实验性的，当针对 HTML5 时，建议改用 Godot 3.x。


> **备注**
> Linux 支持 rv64（RISC-V）、ppc64 和 ppc32（PowerPC）以及 loongarch64 架构。但你需要自行编译该平台的编辑器（以及导出模板），目前不提供官方预编译版本。RISC-V 的编译说明可查阅为 Linux、*BSD 平台编译页面。


运行导出的项目：


- iOS。


Godot 的目标是尽可能地独立于平台，并且可以相对轻松地移植到新平台。


> **备注**
> 在 Godot 4 中用 C# 编写的项目目前无法导出到 Web 平台。如果要在该平台上使用 C#，请考虑使用 Godot 3。（C# 的）Android 和 iOS 平台支持从 Godot 4.2 开始提供，但仍处于实验阶段，并且存在一些限制。


## 编辑器


特性：


- 场景树编辑器。
- Built-in script editor. Also supports editing text files and using custom
syntax highlighters.
- 支持 Visual Studio Code、Vim 等外部文本编辑器。
- GDScript调试器。Supports debugging in threads.
- 可视化（性能）分析器，能指出在渲染管线中 CPU 与 GPU 在每个步骤花费的时间。
- 性能监视工具，包括自定义性能监视器。
- Supportstracing profilerslikeTracyandPerfettofor deeper optimization tasks.
- Any script can berun in the editorand provide custom functionality such as clickable buttons in the inspector,
without needing to create an editor plugin.
- 脚本热重载。
- 场景热编辑。Changeswillreflect in the editor andwillbe kept after closing the running project.
- Live camera replication (disabled by default).移动编辑器中的相机，并在正在运行的项目中查看结果。
- 远程检查器。Changeswon'treflect in the editor andwon'tbe kept after closing the running project.
- Run multiple simultaneous project instances from a single editor instance
(useful for client/server testing).
- Optionalgame embeddingto run the project in a panel within the editor.Select 2D and 3D nodes in the project's viewport to inspect them in the editor.Move the camera within the project using the 2D and 3D camera overrides.Supports time scale adjustments, pausing, and frame advance.Supports muting the project.
- Ruler tool to measure distances in 2D and 3D.
- Vertex snapping support in 3D.
- Support for following the selection as it moves in 3D by using Focus Selection twice.
- 内置离线类参考文档。
- 使用由社区贡献的支持数十种语言的编辑器。


插件：


- 可以从资产库下载编辑器插件，扩展编辑器的功能。
- 使用 GDScript 来创建属于自己的插件，从而为引擎添加新功能或加速你的工作流。
- 在项目管理器中，从资产库下载项目并直接导入。


## 渲染


Godot 4 包含三个渲染器：


- Forward+。最先进的渲染器，仅适合桌面平台，桌面平台默认使用。该渲染器使用Vulkan、Direct3D 12或Metal作为渲染驱动，使用RenderingDevice后端。
- Mobile（移动）。特性更少，但渲染简单场景的速度更快。适用于移动平台和桌面平台。移动平台默认使用该渲染器。该渲染器使用Vulkan、Direct3D 12或Metal作为渲染驱动，使用RenderingDevice后端。
- Compatibility（兼容），有时被称作GL Compatibility（GL 兼容）。最低级的渲染器，适合低端桌面和移动平台。在 Web 平台上默认使用。此渲染器使用OpenGL作为渲染后端。


> **参见**
> 请参阅渲染器概述以获取详细的渲染方法比较。


## 2D 图形


- 精灵、多边形和线条渲染。用于绘制线和多边形的高级工具，例如Polygon2D和Line2D，支持纹理。
- AnimatedSprite2D 辅助制作动画精灵。
- 视差层。伪 3D 支持，可在编辑器中进行预览。
- 带有法线贴图和镜面反射贴图的2D 光照。2D 点光源（全向灯/聚光灯）和定向光源。硬阴影或软阴影（可根据每个光源进行调整）。自定义着色器可以访问一个基于LightOccluder2D节点的，由实时SDF表示的 2D 场景，它可以用于改进 2D 照明效果，包括 2D 全局光源。
- 字体渲染使用位图，光栅化使用 FreeType 或多通道有符号距离场（MSDF）。位图字体可以使用 BMFont 等工具导出，也可以从图像导入（仅适用于等宽字体）。动态字体支持单色字体以及彩色字体（例如用于表情符号）。支持的格式有 TTF、OTF、WOFF1 和 WOFF2。动态字体支持宽度和颜色可调的可选字体轮廓。动态字体支持可变字体和 OpenType 功能，包括连字（ligatures）。当字体文件缺少粗体和斜体样式时，动态字体支持模拟这些样式。动态字体支持超采样, 以在更高的分辨率下保持字体的清晰度.动态字体支持亚像素定位（subpixel positioning），使字体在小尺寸下更清晰。动态字体支持 LCD 亚像素优化，使字体在小尺寸下更加清晰。带符号距离场字体可以按任意分辨率缩放，而无需重新光栅化。与单色带符号距离场字体相比，利用多通道可使带符号距离场字体能够更好地缩小到较小的大小。
- 使用DPITexture导入类型时，针对 SVG 图像的Oversampling功能。 这允许在运行时将 SVG 源图像重新光栅化为新的分辨率，从而在放大纹理时获得更清晰的结果。过采样功能可以选择性地将单个CanvasItem（2D 画布项）的缩放比例考虑在内，以便在缩放节点时获得更清晰的渲染效果。
- 基于 GPU 的粒子，支持自定义粒子着色器。
- 基于 CPU 的粒子。
- 用于更好的辉光功能的可选2D HDR 渲染。
- Optional debanding to reduce banding artifacts in gradients.
- HDR outputon supported platforms and renderers.


## 2D 工具


- TileMap用于由 2D 图块构建的关卡设计。
- 2D 相机，拥有内置平滑和拖动边距。
- Path2D 节点，用于代表 2D 空间中的一条路径。可以在编辑器中绘制或者程序化生成。PathFollow2D 节点，用于使节点跟随一个 Path2D。
- 2D 几何辅助类。


## 2D 物理


物理体：


- 静态物体。
- 可动画物体（用于仅通过脚本或动画移动的物体，如门和平台）。
- 刚体。
- 角色体。
- 关节。
- 区域，用以检测实体进入或离开。
- Physics interpolation.


碰撞检测：


- 内置形状：线条、框体、圆圈、胶囊、世界边界（无限平面）。
- 碰撞多边形（可以人工绘制，或者在编辑器中根据精灵生成）。


## 3D 图形


- Linear HDR internal lighting calculations.
- Optional debanding to reduce banding artifacts in gradients.
- HDR outputon supported platforms and renderers.
- 透视、正交以及视锥偏移摄像机。
- 使用 Forward+ 渲染器时，通过深度预渲染来提高复杂场景中的性能，从而减少过度绘制的成本。
- 在 Forward+ 和 Mobile 渲染器中，支持的 GPU 上可以使用可变速率着色。


基于物理的渲染（内置材质特性）：


- 遵循迪士尼 PBR 模型。
- 支持 Burley、Lambert、Lambert Wrap（half-Lambert）、Toon 漫反射着色模式。
- 支持 Schlick-GGX、Toon 和 Disabled 镜面反射着色模式。
- 使用粗糙度金属度工作流，支持 ORM 纹理。
- 使用地平线镜面反射遮蔽（Filament 模型）提升材质外观。
- 法线贴图。
- 具有基于距离的自动细节层次的视差/浮雕贴图。
- 反照率及法线贴图的细节贴图。
- 次表面散射和透射率。
- 支持材质粗糙度的屏幕空间折射（产生模糊折射）。
- 近处渐隐（也叫柔化粒子）和远处渐隐。
- 距离淡出可以使用透明度混合或抖动以避免穿过透明管线。
- 抖动可以根据每个像素或每个对象来确定。


实时光照：


- Directional lights(sun/moon).
- Omnidirectional lights.
- Spot lightswith adjustable cone angle and attenuation.
- Rectangular area lightswith an optional texture
to determine the shape and color.
- 镜面反射、间接光和体积雾能量可以根据每个光源进行调整。
- Adjustable light "size" for spherical omni and disc spot lights (will also make shadows
blurrier with variable penumbra).
- 可选的距离淡化系统（distance fade system）可以淡化远处的灯光及其阴影，从而提高性能。
- 使用 Forward+ 渲染器（桌面平台默认）时，光源通过集群前向优化渲染，以减少其单独的成本。集群渲染还消除了对网格上可使用的光源数量的任何限制。
- When using the Mobile renderer, up to 8 omni lights, 8 spot lights, and 8 area lights can
be displayed per mesh resource. Baked lighting can be used to overcome this limit
if needed.


阴影贴图：


- DirectionalLight3D:Orthogonal (fastest), PSSM 2-split and 4-split.
Supports blending between splits.
- OmniLight3D:Dual paraboloid (fast) or cubemap (slower but more accurate).
Supports colored projector textures in the form of panoramas.
- SpotLight3D:Single texture. Supports colored projector textures.
- AreaLight3D:Single texture with dual paraboloid distortion to approximate
the light's shape.
- 要缓解可见的阴影失真和阴影悬浮的情况，可以调整阴影的法线偏移量偏置以及阴影压平。
- PCSS-like shadow blur based on the
light size and distance from the surface the shadow is cast on. Supported for
all light types.
- 根据每个灯光调整阴影模糊。


具有间接照明的全局光照：


- 烘焙光照贴图（快速，但无法在运行时更新）。支持仅烘焙间接光照，或者同时烘焙直接和间接光照。可以根据每个灯光调整烘焙模式，以允许混合光照烘焙设置。支持使用自动和手动放置的探针照明动态物体。Optionally supports directional lighting based on spherical harmonics.Optionally supports baking a shadowmask for distant static directional shadows.Optional supersampling at bake-time to improve quality and reduce light leaking
at the cost of increased bake times and memory usage during baking.Lightmaps are baked on the GPU using compute shaders (much faster than
CPU lightmapping). Baking can only be performed from the editor, not in
exported projects.Supports GPU-baseddenoisingwith JNLM out of the box, or higher-quality CPU/GPU-based denoising with
OIDN (requires downloading OIDN separately).Lightmaps are rendered with bicubic filtering to reduce scaling artifacts.
- 基于体素的 GI 探针。支持动态灯光和动态遮挡器，同时还支持反射。需要执行快速烘焙步骤，该步骤可在编辑器中或运行时（包括从导出的项目中）执行。
- 为大型开放世界设计的有符号距离场 GI。支持动态光照，不支持动态遮挡器。支持反射。无需烘焙。
- 以半分辨率或全分辨率进行的屏幕空间间接光照（SSIL）。完全实时并支持任何类型的自发光光源（包括贴花）。
- VoxelGI 和 SDFGI 使用延迟渲染通道，可以在半分辨率下渲染全局光照，以提高性能（同时还支持 MSAA 抗锯齿）。


反射：


- 基于体素的反射（使用 GI 探针时）和基于 SDF 的反射（使用符号距离场 GI 时）。基于体素的反射在透明表面上可见，而基于粗糙 SDF 的反射在透明表面上可见。
- 使用 ReflectionProbe 实现较快的烘焙反射或较慢的实时反射。可以选择启用视差盒校正。
- 支持材料粗糙度的屏幕空间反射。
- 可以混用反射技术，以获得更高的准确性或可扩展性。
- 使用 Forward+ 渲染器（桌面平台默认）时，反射探针通过集群前向优化渲染，以减少其单独的成本。集群渲染还消除了对网格上可使用的反射探针数量的任何限制。
- 使用移动渲染器时，每个网格资源最多可以显示 8 个反射探针。使用兼容渲染器时，每个网格资源最多可以显示 2 个反射探针。


贴花：


- 支持反照率、自发光、ORM和法线贴图。
- 纹理通道平滑地叠加在底层材质之上，并支持普通/仅 ORM 贴花。
- 支持法线淡化，以根据入射角度来淡化贴花。
- 不依赖于实时网格生成。这意味着即使贴花每帧都在移动，也可以在复杂的蒙皮网格上使用贴花，而不会影响性能。
- 支持最近邻、双线性、三线性、各向异性纹理过滤（全局设置）。
- 可选的距离淡化系统（distance fade system）以淡化远处的贴花，提高性能。
- 使用 Forward+ 渲染器（桌面平台默认）时，贴花通过集群前向优化渲染，以减少其单独的成本。集群渲染还消除了对网格上可使用的贴花数量的任何限制。
- 使用移动渲染器时，每个网格资源最多可以显示 8 个贴花。


天空:


- 全景天空（使用 HDRI）。
- 程序天空和基于物理的天空，用于响应场景中的定向光。
- 支持可以动画化的自定义天空着色器。
- 取决于所选的质量设置，用于环境光和镜面反射光的辐射图可以实时更新。


雾：


- 指数深度雾。
- 指数高度雾。
- 支持根据天空颜色自动调整雾的颜色（使用大气透视）。
- 支持雾中的太阳散射。
- 支持控制雾的渲染对天空的影响程度，对传统的雾和体积雾进行单独控制。
- 支持使特定材质忽略雾。


体积雾：


- 对光影做出反应的全局体积雾。
- 在使用 VoxelGI 或 SDFGI 时体积雾可以受间接光影响。
- 可以放置雾体积节点以向特定区域添加雾（或从特定区域去除雾）。支持的形状包括盒状、椭圆形、圆锥体、圆柱体和基于 3D 纹理的密度图。
- 每个雾体积都可以有自己的自定义着色器。
- 可与传统雾一起使用。


粒子：


- 基于 GPU 的粒子，支持子发射器（2D + 3D）、尾迹（2D + 3D）、吸引器（仅 3D）和碰撞（2D + 3D）。支持 3D 粒子吸引器形状：盒状、球体和 3D 向量场。支持 3D 粒子碰撞形状：盒状、球体、烘焙带符号距离场和实时高度图（适用于开放世界天气效果）。2D 粒子碰撞是使用基于场景中的LightOccluder2D节点实时生成的带符号距离场来处理的。尾迹可以使用内置的带状尾迹和管状尾迹网格，也可以使用带有骨架的自定义网格。支持手动发射的自定义粒子着色器。
- 基于 CPU 的粒子。


后期处理：


- 色调映射（线性、Reinhard、Filmic、ACES、AgX）。
- 根据视口亮度自动调整曝光（或使用手动曝光覆盖）。
- 可以通过景深的远近调节对焦外散斑的模拟（方框、六边形、圆形）。
- 半分辨率或全分辨率的屏幕空间环境光遮蔽（SSAO）。
- 辉光/泛光，可以使用可选的双三次放大和多种混合模式：滤色（Screen）、柔光（Soft Light）、添加（Add）、替换（Replace）、融合（Mix）。
- 辉光可以使用彩色污渍贴图纹理，实现镜头脏污效果。
- 辉光可用作屏幕空间模糊效果。
- 使用一维渐变或 3D LUT 纹理进行颜色校正。
- 可减少镜面反射锯齿的影响的粗糙度限幅器。
- 亮度，对比度和饱和度调整。


纹理过滤：


- 最近邻、双线性、三线性、各向异性过滤。
- 过滤选项是根据每个用途定义的，而不是根据每个纹理定义的。


Texture VRAM compression:


- BPTC (for high-quality compression targeting desktop platforms).
- ASTC (for high-quality compression targeting mobile platforms).
- ETC2 (for fast compression targeting mobile platforms).
- S3TC (for fast compression targeting desktop platforms).
- Basis Universal (slow, but only requires one encoding for all platforms).


抗锯齿：


- 时间抗锯齿（TAA）。
- AMD FidelityFX Super Resolution 2.2抗锯齿（FSR2）可在原始分辨率下用作高质量的时间抗锯齿。
- 多重采样抗锯齿（ MSAA ），同时适用于2D 抗锯齿和3D 抗锯齿。
- 快速近似抗锯齿（FXAA）。
- 使用双线性三维缩放和高于 1.0 的三维分辨率比例进行超采样抗锯齿 (SSAA)。
- 在每种材质基础上的 Alpha 抗锯齿、基于多重采样（MSAA）的 Alpha 覆盖（Alpha-To-Coverage）和 Alpha 哈希。


分辨率缩放：


- 支持以较低分辨率渲染 3D，同时保持原始比例的 2D 渲染。 这可用于提高低端系统的性能或改善高端系统的视觉效果。
- Resolution scaling uses nearest-neighbor filtering, bilinear filtering,
AMD FidelityFX Super Resolution 1.0 (FSR1), or AMD FidelityFX Super Resolution 2.2.1
(FSR2).
- 多级渐远纹理 LOD 偏置会自动调整，以提高较低分辨率比例下的质量。也可以通过手动偏移进行修改。


上述效果中的大多数都可以进行调整，从而提升性能、提高质量。这在使用 Godot 进行脱机渲染时非常有用。


## 3D 工具


- 内置网格：立方体、圆柱体/圆锥体、（半）球体、棱柱体、平面、四边形、圆环面、条带、管状。
- GridMaps用于由 3D 图块构建的关卡设计。
- 构造实体几何（用于原型制作）。
- 程序式几何体生成工具。
- Path3D 节点表示 3D 空间中的路径。可以在编辑器中绘制或者程序化生成。PathFollow3D 节点使节点沿 Path3D 运动。
- 3D 几何体辅助类。
- 支持在编辑器中、或在导出项目的运行时中，将当前场景导出为 glTF 2.0 文件。


## 3D 物理学


物理体：


- 静态物体。
- 可动画物体（用于仅通过脚本或动画移动的物体，如门和平台）。
- 刚体。
- 角色体。
- 车身（用于街机物理，而非模拟）。
- 关节。
- 软体。
- 布娃娃。
- 区域，用以检测实体进入或离开。
- Physics interpolation.


碰撞检测：


- 内置形状：立方体、球体、胶囊体、圆柱体、世界边界（无限平面）。
- 从编辑器中为任意网格生成三角形碰撞形状。
- 从编辑器中为任意网格生成一个或多个凸碰撞形状。


## 着色器


- 2D：自定义顶点、片段和灯光着色器。
- 3D:Custom vertex, fragment, light, sky, and fog shaders.
- Custom shaders can procedurally generate and modify textures in real-time usingDrawableTexture2D.
- 基于文本的着色器，使用由 GLSL 启发的着色器语言。
- Syntax highlighting is provided on GitHub by usinggdshaderas the language name in a Markdown code block.
- 可视化着色器编辑器。支持可视化着色器插件。


## 脚本


常规：


- 具有脚本扩展节点的面向对象设计模式。
- 用于脚本之间通信的信号和组。
- 支持跨语言脚本编程。
- 多种 2D、3D 以及 4D 线性代数数据类型，比如向量和变换。


GDScript:


- 高级解释型语言支持可选静态类型.
- 语法受 Python 启发。但是，GDScript并不基于 Python。
- Syntax highlighting is provided on GitHub by usinggdscriptas the language name in a Markdown code block.
- 使用线程执行异步操作或使用多个处理器内核。


C#:


- 打包成单个单独的二进制文件，以降低文件大小和依赖关系。
- 支持 .NET 8 及更高版本。完全支持 C# 12.0 语法和特性。
- 支持 Windows、Linux 和 macOS。从 Godot 4.2 开始，也提供对 Android 和 iOS 的实验性支持。在 iOS 平台上仅支持部分架构：arm64。目前不支持 Web 平台。要在该平台上使用 C# ，请考虑改用 Godot 3。
- 建议使用外部编辑器以从 IDE 功能中获益。


GDExtension（C、C++、Rust、D……）：


- 按需链接到本机库以获得更高的性能和第三方集成。对于编写游戏逻辑脚本，如果性能合适，建议使用 GDScript 或 C#。
- 用于C和C++的官方 GDExtension 绑定。使用你希望的任意构建系统和语言特性。
- 社区提供的积极开发中的 GDExtension 绑定包括D、Swift和Rust。 （这些绑定中的一些可能是实验性的，尚不适用于生产环境）。


## 音频


特性：


- 单声道、立体声、5.1 和 7.1 输出。
- 2D 和 3D 的非定位和定位播放。2D 或 3D 中可选的多普勒效应。
- 支持可重路由的音频总线和包含数十种效果的效果。
- Support for polyphony (playing several sounds from a singleAudioStreamPlayernode).
- 支持随机音量和音高。
- 支持实时音高缩放。
- 支持顺序 / 随机采样，包括在随机采样时的重复预防。
- AudioListener2DandAudioListener3Dnodes to listen from a position
different from the camera.
- 支持程序式音频生成。
- 录制麦克风的音频输入。
- 文本转语音使用平台提供的文本转语音引擎.
- MIDI 输入。尚不支持 MIDI 输出。


使用的 API：


- Windows：WASAPI。
- macOS：CoreAudio。
- Linux：PulseAudio 或 ALSA。


## 导入


- 支持自定义导入插件。


格式：


- 图片：见导入图像。
- 音频：WAV with optionalQOAor IMA-ADPCM compression.Ogg Vorbis。MP3。
- 3D 场景：见导入 3D 场景。glTF 2.0（推荐）。.blend（通过透明调用 Blender 的 glTF 导出功能）。FBX （通过透明调用FBX2glTF）。Collada（.dae）。Wavefront OBJ（仅静态场景，可直接被加载为网格或导入为 3D 场景）。
- 支持在运行时以及导出项目中加载 glTF 2.0 场景。
- 在导入时使用Mikktspace为 3D 网格生成切线，保证与 Blender 等其他 3D 应用的一致性。


## 输入


- 输入映射系统使用硬编码的输入事件或可重映射的输入动作。轴值可以映射到具有可配置死区的两个不同的动作。使用相同的代码来支持键盘和游戏手柄。
- 键盘输入。按键可以以“物理”模式映射，以独立于键盘布局。
- 鼠标输入。鼠标光标可以是可见的、隐藏的、被捕获的或被限制在窗口内的。The mouse cursor's appearance can be changed to a custom image or one of the
system cursors.When captured, raw input is used on Windows and Linux to sidestep the OS'
mouse acceleration settings.
- Gamepad input(up to 8 simultaneous controllers).Support forchanging the LED coloron supported controllers.Support forreading motion sensorson supported controllers (used to implement gyro aiming).
- Pen/tablet input with pressure and tilt support.


## 导航


- A* 算法在2D和3D里。
- 具有动态避障功能的导航网格在2D和3D里。
- 在编辑器内或运行时（包括导出项目）生成导航网格。


## 网络


- 使用StreamPeer和TCPServer进行低阶 TCP 网络通信。
- 使用PacketPeer和UDPServer进行低阶 UDP 网络通信。
- 使用HTTPClient进行低阶 HTTP 请求。
- 使用HTTPRequest进行高阶 HTTP 请求。使用捆绑证书支持开箱即用的 HTTPS。
- 使用 UDP 和 ENet 的高级联机API。使用远程过程调用（RPC）进行自动复制。支持不可靠、可靠和有序传输。
- WebSocket客户端和服务器，全平台可用。
- WebRTC客户端和服务器，全平台可用。
- 当在 NAT 后托管服务器时，支持使用UPnP来避免转发端口的需求。


## 国际化


- 完全支持 Unicode，包括表情符号。
- 只有 Windows、macOS、以及 Linux 支持加载系统字体。默认情况下，系统字体会作为后备字体用于显示不受支持的字符。这使得无需在项目中打包体积较大的字体文件，也能正确显示多语言文本。
- 使用CSV或gettext存储本地化字符串。支持从编辑器中生成 gettext POT 和 PO 文件。
- 在你的项目中自动在 GUI 元素中或通过使用tr()函数使用本地化的字符串。
- 支持复数形式和翻译上下文。
- 支持双向排版、文本整形和 OpenType 本地化表单。
- 用于从右到左区域设置的自动 UI 镜像。
- Support forpseudolocalizationto test your project
for i18n-friendliness.


## 窗口功能与操作系统整合


- 在单个进程中生成多个独立窗口。
- 移动、调整大小、最小化和最大化由项目产生的窗口。
- 更改窗口标题和图标。
- 创建可用作叠加层的透明窗口，并支持基于多边形的鼠标穿透（点击穿透）功能。
- 吸引注意（在大多数平台上表现为标题栏闪烁）。
- 全屏模式。在 Windows 上，默认情况下使用无边框全屏进行快速切换，但也可以选择使用独占全屏来减少输入滞后。
- 无边框窗口（全屏或非全屏）。
- 窗口置顶功能。
- 让一个窗口忽略焦点（窗口叠加时很有用）。
- 将窗口声明为弹出窗口（在任务切换器中隐藏），或声明为独占窗口（阻止与同一进程中的其他窗口进行交互）。
- 支持使用系统原生文件窗口的有 Windows、macOS、Linux 和 Android。
- 支持在 Windows 和 macOS 上使用托盘图标。
- macOS 上的全局菜单整合。
- 在 macOS 上支持客户端装饰（CSD）。
- 以阻塞或非阻塞方式执行命令（包括运行同一项目的多个实例）。
- 使用默认或自定义（已在系统上注册）协议处理程序打开文件路径和 URL。
- 解析自定义命令行参数。
- 支持 Windows、macOS 和 Linux 上的屏幕阅读器。
- 通过用--headless命令行参数启动它，任何 Godot 二进制文件（编辑器或导出的项目）都可以用作无头服务器。这允许在没有 GPU 或显示服务器的情况下运行引擎。


> **参见**
> 有关这些功能的使用细节，请参阅创建应用程序。


## 移动端


- Virtual joystickandbuttonsfor touch input.
- 在Android和iOS上的应用内购。
- 支持使用第三方模块的广告。
- Support for picture-in-picture mode on Android.


## XR 支持（AR 和 VR）


- 开箱即用的OpenXR 支持。包括对流行的桌面 VR 头显的支持，例如 Valve Index、WMR 头显和 Quest over Link。
- 通过插件，使用 OpenXR 支持基于 Android 的头显。Including support for popular standalone headsets like the Meta Quest 1/2/3 and Pro, Pico 4, Magic Leap 2, and Lynx R1.
- 对 Apple visionOS 头戴式设备的开箱即用支持有限。目前仅支持导出一个在头显内部的平面上使用的应用程序，不支持沉浸式体验。
- 通过 XR 插件结构支持的其他设备。
- 可以使用各种高级工具包来实现 XR 应用程序所需的常见功能。


## GUI 系统


Godot 的 GUI 也是使用与用于在 Godot 中制作游戏相同的 Control 节点构建的。编辑器 UI 可以使用插件以多种方式轻松扩展。


节点：


- 按钮。
- 复选框、复选按钮、单选按钮。
- Text entry usingLineEdit(single line),TextEdit(multiple lines), andCodeEdit(supports syntax highlighting,
line numbers, and more).
- Dropdown menus usingPopupMenuandOptionButtonwith support for an optional search bar.
- 滚动条。
- 标签。
- 用于使用 BBCode 的格式化文本的 RichTextLabel，支持自定义动画效果。
- 树（也可用于显示表格）。
- Color picker with RGB, HSV, and OKHSL modes, as well as custom color palettes.
- 控件可以被旋转和缩放。
- Drag-and-drop support.


调整大小：


- 锚点将 GUI 元素保持在特定的角落、边缘或中心。
- 容器按照特定规则自动放置 GUI 元素。堆叠布局。网格布局。流式布局（类似于文本自动折行）。边距、居中和纵横比布局。可拖拽分割器布局。Foldable sectionlayouts.
- 使用canvas_items或viewport拉伸模式，缩放至多种分辨率。
- 使用锚点和expand拉伸比例，支持任意纵横比。


主题：


- 内置主题编辑器。根据当前的编辑器主题设置生成主题。
- 使用StyleBoxFlat进行基于向量的程序式主题设计。支持圆角/斜角、阴影、各边框宽度、抗锯齿。
- 使用StyleBoxTexture进行基于纹理的主题设计。


Godot 较小的发行包大小，使其适合成为 Electron 或 Qt 等框架的替代品。


## 动画


- 正向运动学与反向运动学。
- 支持使用可自定义插值动画化任意属性。
- 支持在动画轨道中调用方法。
- 支持在动画轨道中播放声音。
- 支持在动画中使用贝塞尔曲线。


## 文件格式


- 场景和资源可保存为文本或二进制格式。基于文本的格式易于阅读，并且对版本控制更友好。二进制格式保存/加载大型场景/资源的速度更快。
- 使用FileAccess读写文本或二进制文件。可选择使用压缩或加密。
- 读写JSON文件。
- 使用ConfigFile读写 INI 样式的配置文件。可以（反）序列化任何 Godot 数据类型，包括 Vector2/3、Color 等。
- 使用XMLParser读取 XML 文件。
- 无需通过 Godot 的导入系统， 即可在导出的项目中加载和保存图像、音频/视频、字体和 ZIP 存档。
- 将游戏数据打包到 PCK 文件（针对快速搜索优化的自定义格式）、ZIP 存档或直接打包到可执行文件中以进行单文件分发。
- 导出额外的 PCK 文件，引擎可以读取这些文件以支持 mod 和 DLC。


## 杂项


- 视频播放内置支持 Ogg Theora。
- Movie Maker 模式可从正在运行的项目中录制视频，并具有同步音频和完美的帧同步。
- 对服务器的低级别访问，能够在必要时绕过场景树的开销。
- 使用命令行接口进行自动化。使用持续集成平台导出和部署项目。适用于 Bash、zsh 和 fish 的Shell 补全脚本。在所有平台使用print_rich将彩色文本打印至标准输出。
- 编辑器可以检测项目所用到的功能并建立一个编译配置，该配置可用于创建关闭了多余功能、二进制文件体积更小的导出模板。
- 支持将C++ 模块静态链接到引擎二进制文件中。大多数引擎内置功能模块均可在编译时禁用，以减少自行编译版本的二进制文件体积，详情请参阅为尺寸优化构建页面。
- 引擎和编辑器以 C++17 编写。可使用 GCC、Clang、MSVC 进行编译。同样支持 MinGW。对打包者友好。通常情况下，可以使用系统库代替 Godot 提供的库。构建系统不会下载任何东西。构建完全可重现。
- 使用宽松的 MIT 许可。开放的开发过程，欢迎贡献。


> **参见**
> Godot 提案库列出了社区要求的、可能在未来 Godot 版本中实现的功能。



---


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/system_requirements.html](https://docs.godotengine.org/zh-cn/4.x/about/system_requirements.html)



# 系统需求


本页面包含了编辑器以及导出后项目的系统需求。这些数据仅供参考。如果你打算为了使用 Godot 而搭建或升级系统，也可以参考这些数据。


## Godot 编辑器


以下数据是运行 Godot 编辑器开发简单 2D 和 3D 项目的最低规格需求：


### 台式机和笔记本 PC - 最低配置


| CPU | Windows：支持 SSE2 指令的 x86_32 CPU、x86_64 CPU、ARMv8 CPU示例：Intel Core 2 Duo E8200、AMD FX-4100、Snapdragon X ElitemacOS：x86_64 或 ARM CPU（Apple Silicon）示例：Intel Core 2 Duo SU9400、Apple M1Linux:支持 SSE2 指令的 x86_32 CPU、x86_64 CPU、ARMv7 或 ARMv8 CPU示例：Intel Core 2 Duo E8200、AMD Athlon XE BE-2300、Raspberry Pi 4 |
| --- | --- |
| GPU | Forward+ 渲染器：完整支持 Vulkan 1.0 的集成显卡示例：Intel HD Graphics 510 (Skylake)、AMD Radeon R5 Graphics (Kaveri)移动渲染器：完整支持 Vulkan 1.0 的集成显卡示例：Intel HD Graphics 510 (Skylake)、AMD Radeon R5 Graphics (Kaveri)兼容渲染器：完整支持 OpenGL 3.3 的集成显卡示例：Intel HD Graphics 2500 (Ivy Bridge)、AMD Radeon R5 Graphics (Kaveri) |
| 内存 | 原生编辑器：4 GBWeb 编辑器：8 GB |
| 存储 | 200 MB（用于可执行文件、项目文件、缓存）。导出项目需要单独下载导出模板（安装后为 1.3 GB）。 |
| 操作系统 | 原生编辑器：Windows 10、macOS 10.13（兼容渲染器）、macOS 10.15（Forward+/移动渲染器）、2018 年之后的 Linux 发行版网站编辑器:最近版本的主流浏览器: Firefox及基于其开源项目的浏览器 (包括ESR), Chrome和基于Chromium开源项目的浏览器, Safari和基于WebKit开源项目的浏览器。 |


> **备注**
> 如果你的x86_64架构的CPU不支持SSE4.2，你仍然可以运行32位的只有对SSE2要求的Godot可执行程序（所有x86_64的架构CPU都支持SSE2）。
当在Linux上运行，我们没有给出官方对于在rv64 (RISC-V)、ppc64 、ppc32 (PowerPC)和loongarch64上运行的最低要求。所以你需要单独编译用于这些平台的的编辑器（包括导出模板），当前不提供官方下载。 RISC-V 平台的编译说明来源页面为 Linux、*BSD 平台编译。


### 移动设备（智能手机、平板）- 最低配置


| CPU | Android：芯片使用任何 32 位/64 位 ARM 或 x86 CPU示例：Qualcomm Snapdragon 430、Samsung Exynos 5 Octa 5430iOS：无法运行编辑器 |
| --- | --- |
| GPU | Forward+ 渲染器：适用于搭载完整支持 Vulkan 1.0 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 505、Mali-G71 MP2移动渲染器：适用于搭载完整支持 Vulkan 1.0 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 505、Mali-G71 MP2兼容性渲染器：适用于搭载完整支持 OpenGL ES 3.0 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 306、Mali-T628 MP6 |
| 内存 | 原生编辑器：3 GBWeb 编辑器：6 GB |
| 存储 | 200 MB（用于可执行文件、项目文件、缓存）。导出项目需要单独下载导出模板（安装后为 1.3 GB） |
| 操作系统 | 原生编辑器：Android 7.0（兼容渲染器）、Android 9.0（Forward+/移动渲染器）网站编辑器:最近版本的主流浏览器: Firefox及基于其开源项目的浏览器 (包括ESR), Chrome和基于Chromium开源项目的浏览器, Safari和基于WebKit开源项目的浏览器。 |


以下数据是流畅运行 Godot 编辑器开发简单 2D 和 3D 项目的推荐需求：


### 台式机和笔记本 PC - 推荐配置


| CPU | Windows：支持 SSE4.2 指令集的4 核或更多物理核心的 x86_64 CPU，或 ARMv8 CPU示例：Intel Core i5-6600K、AMD Ryzen 5 1600, Snapdragon X ElitemacOS：x86_64 或 ARM CPU（Apple Silicon）示例：Intel Core i5-8500、Apple M1Linux：支持 SSE2 指令的 x86_32 CPU、x86_64 CPU、ARMv7 或 ARMv8 CPU示例：Intel Core i5-6600K、AMD Ryzen 5 1600、超频 Raspberry Pi 5 |
| --- | --- |
| GPU | Forward+ 渲染器：完整支持 Vulkan 1.2 的独立显卡示例：NVIDIA GeForce GTX 1050 (Pascal)、AMD Radeon RX 460 (GCN 4.0)移动渲染器：完整支持 Vulkan 1.2 的独立显卡示例：NVIDIA GeForce GTX 1050 (Pascal)、AMD Radeon RX 460 (GCN 4.0)兼容渲染器：完整支持 OpenGL 4.6 的独立显卡示例：NVIDIA GeForce GTX 650 (Kepler)、AMD Radeon HD 7750 (GCN 1.0) |
| 内存 | 原生编辑器：8 GBWeb 编辑器：12 GB |
| 存储 | 1.5 GB（用于可执行文件、项目文件、所有导出模板、缓存） |
| 操作系统 | 原生编辑器：Windows 10、macOS 10.15、2020 年之后的 Linux 发行版Web 编辑器：最新版本的 Firefox、Chrome、Edge、Safari、Opera |


### 移动设备（智能手机、平板）- 推荐配置


| CPU | Android：芯片使用 64 位 ARM 或 x86 CPU，至少有 3 个“性能”核心示例：Qualcomm Snapdragon 845、Samsung Exynos 9810iOS：无法运行编辑器 |
| --- | --- |
| GPU | Forward+ 渲染器：适用于搭载完整支持 Vulkan 1.2 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 630、Mali-G72 MP18移动渲染器：适用于搭载完整支持 Vulkan 1.2 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 630、Mali-G72 MP18兼容渲染器：适用于搭载完整支持 OpenGL ES 3.2 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 630、Mali-G72 MP18 |
| 内存 | 原生编辑器：6 GBWeb 编辑器：8 GB |
| 存储 | 1.5 GB（用于可执行文件、项目文件、所有导出模板、缓存） |
| 操作系统 | 原生编辑器：Android 11.0Web 编辑器：最新版本的 Firefox、Chrome、Edge、Safari、Opera、Samsung Internet |


## 导出的 Godot 项目


> **警告**
> 下面列出的是简单2D 和 3D 项目的基本要求，能够支撑基础的脚本和少量的视觉效果。CPU、GPU、内存、存储等方面的需求与项目的规模、渲染方法、视口分辨率、所选的图形设置等关系很大。运行项目时，系统中运行的其他程序也会争抢内存、显存等资源。
强烈建议在低端硬件上自己进行测试，确保项目能够在需要的速度下运行。为了更好地支持低端硬件，你可能还会需要在项目中添加图形选项菜单。


以下数据是运行 Godot 导出的简单 2D 和 3D 项目的最低需求：


### 台式机和笔记本 PC - 最低配置


| CPU | Windows：支持 SSE2 指令的 x86_32 CPU、x86_64 CPU、ARMv8 CPU示例：Intel Core 2 Duo E8200、AMD FX-4100、Snapdragon X ElitemacOS：x86_64 或 ARM CPU（Apple Silicon）示例：Intel Core 2 Duo SU9400、Apple M1Linux:支持 SSE2 指令的 x86_32 CPU、x86_64 CPU、ARMv7 或 ARMv8 CPU示例：Intel Core 2 Duo E8200、AMD Athlon XE BE-2300、Raspberry Pi 4 |
| --- | --- |
| GPU | Forward+ 渲染器：完整支持 Vulkan 1.0、Metal 3（macOS）或 Direct3D 12（12_0 特性级别，Windows）的集成显卡示例：Intel HD Graphics 510 (Skylake)、AMD Radeon R5 Graphics (Kaveri)移动渲染器：完整支持 Vulkan 1.0、Metal 3（macOS）或 Direct3D 12（12_0 特性级别，Windows）的集成显卡示例：Intel HD Graphics 510 (Skylake)、AMD Radeon R5 Graphics (Kaveri)兼容渲染器：完整支持 OpenGL 3.3 或 Direct3D 111（Windows）的集成显卡。示例：Intel HD Graphics 2500 (Ivy Bridge)、AMD Radeon R5 Graphics (Kaveri) |
| 内存 | 原生导出：2 GBWeb 导出：4 GB |
| 存储 | 150 MB（用于可执行文件、项目文件、缓存） |
| 操作系统 | 原生导出：Windows 10、macOS 10.15（Forward+/移动，Vulkan）、macOS 13.0（Forward+/移动，Metal）、2020 年后发布的 Linux 发行版网站编辑器:最近版本的主流浏览器: Firefox及基于其开源项目的浏览器 (包括ESR), Chrome和基于Chromium开源项目的浏览器, Safari和基于WebKit开源项目的浏览器。 |


### 移动设备（智能手机、平板）- 最低配置


| CPU | Android：芯片使用任何 32 位/64 位 ARM 或 x86 CPU示例：Qualcomm Snapdragon 430、Samsung Exynos 5 Octa 5430iOS：芯片使用任何 64 位 ARM CPU示例：Apple A7（iPhone 5S） |
| --- | --- |
| GPU | Forward+ 渲染器：配备支持 Vulkan 1.0 或 Metal 3（iOS/iPadOS）的 GPU 的系统级芯片（SoC）示例 (Vulkan)： Qualcomm Adreno 505、Mali-G71 MP2、Apple A12 (iPhone XR/XS示例（Metal）：Apple A12（iPhone XR/XS）移动渲染器：适用于搭载完整支持 Vulkan 1.0 的 GPU 的系统级芯片（SoC），或支持 Metal 3 的设备（iOS/iPadOS）示例 (Vulkan)： Qualcomm Adreno 505、Mali-G71 MP2、Apple A12 (iPhone XR/XS示例（Metal）：Apple A12（iPhone XR/XS）兼容性渲染器：适用于搭载完整支持 OpenGL ES 3.0 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 306、Mali-T628 MP6、Apple A7（iPhone 5S） |
| 内存 | 原生导出：1 GBWeb 导出：2 GB |
| 存储 | 150 MB（用于可执行文件、项目文件、缓存） |
| 操作系统 | 原生导出：Android 7.0（兼容渲染器）、Android 9.0（Forward+/移动渲染器）、iOS 12.0（Forward+/移动渲染器, Vulkan）, iOS 16.0（Forward+/移动渲染器, Metal）网站编辑器:最近版本的主流浏览器: Firefox及基于其开源项目的浏览器 (包括ESR), Chrome和基于Chromium开源项目的浏览器, Safari和基于WebKit开源项目的浏览器。 |


以下数据是流畅运行 Godot 导出的简单 2D 和 3D 项目的推荐需求：


### 台式机和笔记本 PC - 推荐配置


| CPU | Windows：支持 SSE4.2 指令集的4 核或更多物理核心的 x86_64 CPU，或 ARMv8 CPU示例：Intel Core i5-6600K、AMD Ryzen 5 1600, Snapdragon X ElitemacOS：x86_64 或 ARM CPU（Apple Silicon）示例：Intel Core i5-8500、Apple M1Windows：支持 SSE4.2 指令集的4 核或更多物理核心的 x86_64 CPU，或 ARMv8 CPU示例：Intel Core i5-6600K、AMD Ryzen 5 1600、超频 Raspberry Pi 5 |
| --- | --- |
| GPU | Forward+ 渲染器：全面支持 Vulkan 1.2、Metal 3（macOS）或 Direct3D 12（12_0 特性级别，Windows） 的独立显卡示例：NVIDIA GeForce GTX 1050 (Pascal)、AMD Radeon RX 460 (GCN 4.0)移动渲染方法：专用图形，支持完整的 Vulkan 1.2、Metal 3（macOS）或 Direct3D 12（12_0 特性级别）（Windows）支持示例：NVIDIA GeForce GTX 1050 (Pascal)、AMD Radeon RX 460 (GCN 4.0)兼容渲染器：完整支持 OpenGL 4.6 的独立显卡示例：NVIDIA GeForce GTX 650 (Kepler)、AMD Radeon HD 7750 (GCN 1.0) |
| 内存 | 原生导出：4 GBWeb 导出：8 GB |
| 存储 | 150 MB（用于可执行文件、项目文件、缓存） |
| 操作系统 | 原生导出：Windows 10、macOS 10.15（Forward+/移动，Vulkan）、macOS 13.0（Forward+/移动，Metal）、2020 年后发布的 Linux 发行版Web 导出：最新版本的 Firefox、Chrome、Edge、Safari、Opera |


### 移动设备（智能手机、平板）- 推荐配置


| CPU | Android：芯片使用 64 位 ARM 或 x86 CPU，至少有 3 个“性能”核心示例：Qualcomm Snapdragon 845、Samsung Exynos 9810iOS：芯片使用 64 位 ARM CPU示例：Apple A14（iPhone 12） |
| --- | --- |
| GPU | Forward+ 渲染器：配备支持 Vulkan 1.2 或 Metal 3（iOS/iPadOS）的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 630、Mali-G72 MP18、Apple A14（iPhone 12）移动渲染器：配备支持 Vulkan 1.2 或 Metal 3（iOS/iPadOS）的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 630、Mali-G72 MP18、Apple A14（iPhone 12）兼容渲染器：适用于搭载完整支持 OpenGL ES 3.2 的 GPU 的系统级芯片（SoC）示例：Qualcomm Adreno 630、Mali-G72 MP18、Apple A14（iPhone 12） |
| 内存 | 原生导出：2 GBWeb 导出：4 GB |
| 存储 | 150 MB（用于可执行文件、项目文件、缓存） |
| 操作系统 | 原生导出：Android 9.0、iOS 14.1（Forward+/移动渲染器，Vulkan）、iOS 16.0 （Forward+/移动渲染器, Metal）Web 导出：最新版本的 Firefox、Chrome、Edge、Safari、Opera、Samsung Internet |


> **备注**
> Godot 不会使用 OpenGL 3.3/OpenGL ES 3.0 之后的 OpenGL/OpenGL ES 扩展，但是通常支持更高版本 OpenGL/OpenGL ES 的 GPU 在驱动方面的问题更少。



---


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/faq.html](https://docs.godotengine.org/zh-cn/4.x/about/faq.html)



# 常见问题


## 可以用 Godot 做什么？需要花多少钱？有哪些许可条款？


Godot 是在OSI 认可的MIT 许可证下可用的自由和开源软件。这意味着它不仅可以自由使用，也可以免费获取。


简而言之：


- 你可以自由下载和使用 Godot，用于个人、非营利、商业等任何目的。
- 无论出于任何原因，商业还是非商业，你都可以根据自己的心之所向，自由地对 Godot 进行修改、分发、再分发、改版。


本随附文档的所有内容均在宽松的知识共享署名 3.0（CC-BY 3.0）许可下发布，署名为“Juan Linietsky、Ariel Manzur 和 Godot 引擎社区。”


徽标和图标均在相同的 CC 知识共享协议（Creative Commons License）下。注意，Godot 的源代码中包含的某些第三方库可能具有不同的许可。


详情请看COPYRIGHT.txt以及LICENSE.txt和logo LICENSE.txtGodot 仓库中的文件.


还可以查阅Godot 网站上的许可页面。


## Godot 支持哪些平台？


编辑器：


- Windows
- macOS
- Linux、*BSD
- Android（实验性）
- Web（实验性）


导出游戏：


- Windows
- macOS
- Linux、*BSD
- Android
- iOS
- Web


在有意义的情况下，支持 32 位和 64 位二进制文件，默认为 64 位。官方 macOS 版本原生支持 Apple Silicon 以及 x86_64。


一些用户还报告在基于 ARM 的 Linux 系统（如树莓派）上成功构建和使用 Godot。


主机支持的更多信息参考Godot 网站。


有关这方面的更多信息，请参阅《导出》和《编译 Godot》章节。


> **备注**
> Godot 3 还支持通用 Windows 平台（UWP）。但由于该平台端口缺乏维护并已被 Microsoft 弃用，它已在 Godot 4 中移除。对于感兴趣的用户来说，它仍然可以在当前的 Godot 3 稳定版本中使用。


## Godot 支持哪些编程语言？


Godot 官方支持的语言是 GDScript、C# 和 C++，详细请参阅《编写脚本》章节中各个语言的子类别章节。


如果你刚开始接触 Godot 或一般的游戏开发，推荐学习并使用 GDScript 语言，它是 Godot 的原生语言。虽从长远来看，脚本语言的性能往往不如低级语言，但对于原型设计、开发最小可行产品（MVP）以及关注上市时间（TTM）而言，GDScript 可提供一种快速、友好且功能强大的游戏开发方式。


请注意，加入 C# 支持的时间相对较短，因此你可能会遇到一些问题。Web 平台目前也缺少 C# 支持。我们友好而勤奋的开发社区随时准备解决出现的新问题，但由于这是一个开源项目，我们建议你先自己进行一些评估。通过搜索关于未解决问题的讨论来进行故障排除。


对于新语言，可以通过第三方使用 GDExtension 获得支持（请参阅下面关于插件的问题）。目前工作正在进行，例如，Godot 与Python和Nim的非官方绑定。


## GDScript 是什么？为什么要使用它？


GDScript 是 Godot 所集成的脚本语言。它是从头开始构建的，目标是用最少的代码让 Godot 的潜力最大化，使新手和专业开发人员都能尽可能快地利用 Godot 的优势。如果你曾经用类似 Python 这样的语言写过任何东西，那么你会感到得心应手。如果你想了解关于 GDScript 的示例以及完整的功能介绍，请查看GDScript 脚本指南。


使用 GDScript 有多个理由，但最显著的原因是整体简化复杂度。


为 Godot 创建一个紧密集成的自定义脚本语言的初衷有两点：首先，它减少了启动和运行 Godot 所需的时间，让开发人员可以快速接触引擎并专注于提高工作效率；其次，它减轻了总体维护负担，降低了问题的维度，并允许引擎开发人员专注于修复错误和改进与引擎核心相关的功能，而不是花费大量时间尝试让一小部分增量功能在一大堆语言中生效。


由于 Godot 是一个开源项目，从一开始我们就决定优先提供更为集成和流畅的体验，而不是通过支持更熟悉的编程语言来吸引更多用户，尤其是当支持这些语言会导致体验变差时。如果你更倾向于在 Godot 中使用其他语言（请参考上面的支持语言列表），我们完全理解。不过，如果你还没有尝试过 GDScript，建议你试用三天。就像 Godot 一样，一旦你体验到它的强大功能和开发效率的提升，我们相信你会喜欢上 GDScript。


有关熟悉 GDScript 或动态类型语言的更多信息，请参阅《GDScript：动态语言入门》教程。


## 创建 GDScript 背后的动机是什么？


引擎早期使用的是Lua脚本语言。Lua 由于 LuaJIT 的帮助可以达到很快的速度，但是（通过使用回退）创建面向对象系统的绑定既复杂又缓慢，并且需要大量代码。使用Python进行了一些实验后，也证明了要嵌入 Python 确实很难。


为 Godot 创建自定义脚本语言的主要原因有：


1. Godot 使用多线程，而大多数脚本虚拟机对线程的支持不佳（Lua、Python、Squirrel、JavaScript、ActionScript 等）。
2. 大多数脚本语言的虚拟机没有很好地支持类扩展，适配 Godot 的效率极低（Lua、Python、JavaScript）。
3. 许多现有语言的 C++ 绑定接口都非常糟糕，会产生大量代码、错误、瓶颈，而且效率普遍低下（例如 Lua、Python、Squirrel、JavaScript 等）。我们希望专注于打造出色的引擎，而不是大量的集成。
4. 没有原生的向量类型（Vector3、Transform3D 等），导致使用自定义类型时性能大大降低（Lua、Python、Squirrel、JavaScript、ActionScript 等）。
5. 垃圾收集器导致停顿或不必要的大内存使用（Lua、Python、JavaScript、ActionScript 等）。
6. 难以与代码编辑器集成从而提供代码补全、实时编辑等功能（全部如此）。


GDScript 的设计目的就是为了减少上述问题，甚至更多问题。


## 哪种编程语言最快？


在大多数游戏中，脚本语言本身并不是性能问题的根源。相反，性能下降通常是由于低效的算法（这些算法在所有语言中都慢）、GPU 性能瓶颈，或是常见的 C++ 引擎代码（如物理引擎或导航）造成的。Godot 支持的所有语言在一般用途的脚本编写上都足够快。你应该根据其他因素选择语言，比如易用性、熟悉度、平台支持或语言特性。


一般来说，C# 和 GDScript 的性能处于同一量级，而 C++ 比两者都更快。


将 GDScript 的性能与 C# 进行比较是有难度的，因为在某些特定情况下，C# 可能更快。C#语言本身往往比 GDScript 更快，这意味着在调用 Godot 引擎代码较少的情况下，C# 可能会更快。然而，当进行大量 Godot API 调用时，由于marshalling的开销，C# 可能会比 GDScript 更慢。C# 的性能还可能受到垃圾回收的影响，垃圾回收发生在随机和不可预测的时刻。这可能导致复杂项目中的卡顿问题，而且这种情况并非 Godot 独有。


C++，使用GDExtension，几乎总是比 C# 或 GDScript 更快。然而，C++ 的使用难度大于 C# 或 GDScript，开发速度也较慢。


你还可以在一个项目中使用多种语言，方法是通过cross-language scripting，或将 GDExtension 和脚本语言一起使用。需要注意的是，使用这种方式会带来一些复杂性。


## Godot 支持哪些 3D 模型格式？


你可以在《导入 3D 场景》文档中找到有关支持的格式、如何从 3D 建模软件导出以及如何导入 Godot 的详细信息。


## Godot 会支持【如 FMOD、GameWorks 等闭源 SDK】吗？


Godot 的目标是创建一个自由开源、MIT 许可、模块化和可扩展的引擎。核心引擎开发社区没有计划支持任何第三方、闭源或专有 SDK，因为集成这些 SDK 会违背 Godot 的精神。


正因为 Godot 是开源和模块化的，所以没有什么能阻止你或其他任何感兴趣的人将这些库添加为模块，并以开源或闭源的方式在你的游戏中使用他们。


要了解如何继续提供对你选择的 SDK 的支持，请查看下面的插件问题。


如果你知道 Godot 尚不支持但提供自由和开源集成的第三方SDK，请考虑自己开始集成工作。Godot 不属于个人；它属于社区，它与像你一样雄心勃勃的社区贡献者一起成长。


## 如何扩展 Godot？


要扩展 Godot，比如创建 Godot 编辑器插件或添加对其他语言的支持，请参阅编辑器插件和工具脚本。


另外，请参阅有关 GDExtension 的官方博客文章，GDExtension 是为 Godot 开发原生扩展的一种方法：


- GDNative 的继任者，GDExtension 来了！


你还可以查看 GDScript 的实现，Godot 模块以及 Godot 的Jolt 物理引擎集成。这将是了解另一个第三方库如何与 Godot 集成的良好起点。


## 如何在我的系统上安装 Godot 编辑器（进行桌面集成）？


Godot 实际并不需要在你的系统上进行安装就能够运行，因此不会自动进行桌面集成。解决方法有两种。你可以通过Steam（全平台）、Scoop（Windows）、Homebrew（macOS）、Flathub（Linux）来安装 Godot。这样就会自动执行桌面集成所需的步骤。


另外你也可以手动执行安装文件会帮你执行的步骤：


### Windows


- 将 Godot 可执行文件移动到稳定的位置（即 Downloads 文件夹之外），这样你就不会在将来意外移动它并破坏快捷方式了。
- 右键单击 Godot 可执行文件，选择创建快捷方式。
- 将创建的快捷方式移动到%APPDATA%\Microsoft\Windows\StartMenu\Programs。这是针对用户的快捷方式存放位置，它会显示在开始菜单中。你也可以将 Godot 固定在任务栏上，右键单击可执行文件并选择固定至任务栏即可。


### macOS


将解压出的 Godot 应用拖拽至/Applications/Godot.app，如果需要的话还可以再拖到 Dock 栏上。只要 Godot 在/Applications或~/Applications中，“聚焦”就能找到它。


### Linux


- 将 Godot 二进制文件移动到稳定的位置（即你的 Downloads 文件夹之外），这样你就不会在将来意外移动它并破坏快捷方式了。
- 将 Godot 二进制文件进行重命名，然后移动到处于PATH环境变量中的某个位置。通常是/usr/local/bin/godot或者/usr/bin/godot。这个操作需要管理员权限，不过能够让你通过输入godot直接从命令行运行 Godot 编辑器。如果你无法将 Godot 编辑器二进制文件移动到受保护的位置，你可以将它保存在你的家目录中的某个位置，然后修改下方链接的.desktop文件中的Path=行，让它包含指向 Godot 二进制文件的完整绝对路径。
- 将这个 .desktop 文件保存到$HOME/.local/share/applications/。如果你有管理员权限，你还可以把这个.desktop文件保存到/usr/local/share/applications中，这样所有用户就都能够使用这个快捷方式了。


## Godot 编辑器是绿色应用吗？


默认配置下，Godot 是半绿色的。从任何位置运行都可以运行它的可执行文件（包括无法写入的位置），无须管理员权限。


不过，配置文件会写入到针对用户的配置或数据目录。通常来说，这是不错的做法，但也意味着将包含 Godot 可执行文件的文件夹复制到另一台机器上是无法带走配置文件的。更多信息请参阅《Godot 项目中的文件路径》。


如果希望实现真正的便携操作（例如放到 U 盘上使用），请按照《自包含模式》中的步骤操作。


## 为什么 Godot 旨在保持其核心功能集较小？


Godot 有意不包含可以通过附加组件实现的功能，除非它们非常常用。不经常使用的一个例子是高级人工智能功能。


这有几个原因：


- 代码维护和 bug 表面。每次我们在 Godot 仓库中接受新的代码时，现有的贡献者往往会承担起维护它的责任。一些贡献者在合并他们的代码后并不总是坚持下去，这会使我们难以维护有问题的代码。这可能会导致维护不善的功能会带有从未修复的错误。最重要的是，需要测试和检查回归的“API 表面”随着时间的推移不断增加。
- 易于贡献。通过保持代码库小而整洁，可以保持快速、轻松地从源代码编译。这使得新贡献者更容易入门 Godot，无需他们购买高端硬件。
- 为编辑器保持较小的二进制大小。并非每个人都拥有快速的 Internet 连接。确保每个人都可以在 5 分钟内下载、解压缩并运行 Godot 编辑器，这使得所有国家/地区的开发人员都可以更轻松地访问 Godot。
- 保持导出模板的二进制大小较小。这直接影响到 Godot 导出的项目的大小。在移动和 Web 平台上，保持文件大小较小对于确保在性能不足的设备上快速安装和加载非常重要。同样，许多国家/地区无法轻松获得高速互联网。此外，这些国家/地区通常会实施严格的数据使用上限。


基于上述所有原因，我们必须谨慎选择哪些功能可以作为 Godot 的核心功能。这就是为什么我们计划在未来版本的 Godot 中，将一些核心功能移至官方支持的附加组件中。就二进制大小而言，这也具有让你只需为项目中实际使用的功能付费的优势。（与此同时，你可以编译自定义导出模板并禁用未使用的功能来优化项目的分发大小。）


## 应如何创建资产来处理多种分辨率和纵横比？


这个问题很常见，可能要归功于苹果公司。苹果一开始将它们的设备分辨率加倍，让人觉得不同分辨率使用相同的资产是个好主意，所以很多人就这么做下去了。起初只有苹果设备这么做，但 Android 和后来的苹果设备又有了不同的分辨率和宽高比，它们的大小和 DPI 变得多种多样。


最常见和最恰当的处理方法是，为游戏使用单一基本分辨率，并仅处理不同的屏幕宽高比。主要是 2D 游戏需要这么做，在 3D 游戏中它只是相机的垂直或水平 FOV 的问题。


1. 为游戏选择单一的基础分辨率。即使有分辨率高达 1440p 的设备和低至 400p 的设备，设备中的常规硬件扩展也可以在很少或没有性能成本的情况下解决这个问题。分辨率最常见的选择是接近 1080p (1920x1080) 或 720p (1280x720)。请记住，分辨率越高，资产越大，所需的内存就越多，加载所需的时间也就越长。
2. 使用 Godot 中的拉伸选项；画布项目在保持宽高比时拉伸效果最好。请参阅教程《多分辨率》来学习如何实现。
3. 确定最小分辨率，然后决定是否希望游戏垂直或水平拉伸以获得不同的宽高比，或者如果有一个宽高比并且你希望显示黑条。这也在《多分辨率》中有所解释。
4. 对于用户界面，请使用锚定来确定控件应停留和移动的位置。如果 UI 更复杂，请考虑学习 Container（容器）。


就是这样！你的游戏应该能够以多种分辨率运行了。


## Godot 的下一个版本什么时候发布？


当它准备好的时候！详情见《下一个版本什么时候发布？》。


## 新项目应该使用哪个版本的 Godot？


我们建议在新项目中使用 Godot 4.x，但是取决于你所需的功能，也许使用 3.x 更好。具体可参阅《新项目应该使用哪个版本？》。


## 我是否应该升级我的项目以使用新版本的 Godot？


某些新版本在某些方面更安全。一般来说，是否应该升级取决于你的项目的情况。详见《我是否应该升级我的项目以使用新的引擎版本？》。


## 我应该使用 Forward+、移动还是兼容渲染器？


你可以在渲染器概述中找到渲染器的详细比较。


## 我想要贡献！ 该如何开始？


太棒了！作为一个开源项目，Godot 的发展得益于像你这样的开发者的创新和雄心。


开始为 Godot 做出贡献的最佳方式是使用它并报告你可能遇到的任何问题。一份带有清晰重现步骤的好 bug 报告可以帮助其他贡献者快速有效地修复 bug。你也可以在在线文档中报告你发现的问题。


如果你准备提交你的第一个 PR，请从上面的链接之一中选择你感兴趣的任何一个问题，并尝试解决它。你将需要学习如何从源代码编译引擎，或如何构建文档。你还需要熟悉 Git，这是 Godot 开发人员使用的版本控制系统。


我们在《贡献者文档》中解释了如何使用引擎源代码、如何编辑文档以及其他形式的贡献方式。


## 我有个关于 Godot 的好主意，该如何分享它？


我们一直在寻找关于如何改进引擎的建议。用户的反馈是我们决策过程背后的主要驱动力，你在为自己的项目工作时可能遇到的限制是我们在考虑如何增强引擎时的重要依据。


如果你遇到可用性问题，或者当前版本的 Godot 缺少一项功能，请首先与我们的社区讨论。社区成员可能会提出其他更好的方法来实现期望的结果。你可以了解其他用户是否遇到过同样的问题，并一起找出一个好的解决方案。


如果你对引擎有一个明确的改进想法，请随意打开一个提案 issue。在描述你的问题和建议的解决方案时，尽量具体和明确——只有可行的建议才会被考虑。这不是必须的，但如果你想自己实现它，我们会非常感激！


如果你只有一个大致的想法，没有具体的细节，你可以开启一个提案讨论。讨论可以包含你想要的任何内容，并允许自由形式的讨论以寻求解决方案。一旦找到了一个解决方案，就可以打开提案 issue。


在创建提案之前，请阅读自述文件，以了解有关该过程的更多信息。


## 是否能用 Godot 创建非游戏应用？


是的！Godot 具有广泛的内置 UI 系统，其较小的软件包可以使它成为 Electron 或 Qt 等框架的合适替代品。


更多信息请参阅创建应用程序。


## 是否能将 Godot 作为库使用？


如果你打算用 Godot 制作游戏，请记住 Godot 是为配合其编辑器使用而设计的。我们建议你尝试一下，因为从长远来看，这很可能会为你节省时间。


对于更专业的应用，考虑将Godot作为库来使用是有意义的。自Godot 4.6版本起，已开始实验性地支持将 Godot 作为静态库或共享库使用，即 LibGodot。目前，这已在Windows、macOS和Linux上得到支持。Android 和 iOS 的支持计划在未来的版本中推出。


你可以在 <https://github.com/migeran/libgodot_project> GitHub 存储库中找到使用 Godot 作为库的示例应用程序。


## Godot 使用的用户界面工具包是什么？


Godot 不使用 GTK、Qt、wxWidgets 等标准的GUI工具包，而是使用自己的用户界面工具包，并且始终使用硬件加速进行渲染。尽管可以使用在 CPU 上模拟图形 API 的外部解决方案，但是没有内置的软件渲染回退。


这个工具包以 Control 节点的形式暴露出来，用于渲染编辑器（用 C++ 编写）。这些 Control 节点也可以在 Godot 支持的任何脚本语言的项目中使用。


这个定制的工具包使它能获益于硬件加速，并在全平台上拥有一致的外观。最重要的是，它不必处理 GTK 或 Qt 所带来的 LGPL 许可注意事项。最后，这意味着 Godot 在“自产自用”，因为编辑器本身就是 Godot UI 系统中最复杂的用例之一。


这个自定义 UI 工具包可以嵌入其他应用程序（实验性），但是更推荐通过使用 Godot 编辑器来创建非游戏应用程序。


## 为什么 Godot 使用 SCons 构建系统？


Godot 使用SCons构建系统。近期没有改用其他构建系统的计划。我们选择 SCons 而不是其他构建系统的原因有很多，例如：


- Godot 可以针对多种不同的平台进行编译：所有 PC 平台、所有移动平台、各种游戏主机、WebAssembly。
- 开发者们经常需要同时将代码编译到多个平台上，或者同一个平台的不同架构上，但他们负担不起每次都要重新配置和重构项目。SCons 可以毫不费力地完成此任务，而不会破坏构建。
- 无论对项目做出多少修改、配置、增加、删除之类的事情，SCons都不会把构建工作搞砸。
- Godot 的构建过程并不简单。一些文件由代码生成（绑定器），另一些文件需要解析（着色器），而还有一些文件则需要提供定制（模块）。这需要复杂的逻辑，而该逻辑更容易用实际的编程语言（如Python）编写，而不是使用基于宏且仅限于构建过程的语言。
- Godot 的构建过程大量使用了交叉编译工具。每个平台都有特定的检测过程，需要为各个平台编写特殊代码，将这些作为特殊情况处理。


如果你想要自己构建 Godot，放宽心态， 并至少稍微熟悉一下 SCons。


## 为什么 Godot 不使用 STL（标准模板库）？


像许多其他库一样（Qt 就是一个例子），Godot 没有使用 STL（除了线程原语等少数例外）。我们相信 STL 是一个强大的通用库，但我们对用于Godot上的库有特殊的要求。


- STL 模板会创建大量符号，产生巨型的调试二进制文件。我们使用一些名称很短的模板来代替。
- 我们的大多数容器都是针对特定需求设计的，例如 Vector 使用写时复制，我们用它来传递数据，而 RID 系统则需要 O(1) 访问时间来提高性能。同样，我们的哈希表实现旨在与内部引擎类型无缝集成。
- 我们的容器内置了内存跟踪，有助于更好地跟踪内存的使用情况。
- 对于大型数组，我们使用内存池，它可以被映射到预先分配的缓冲区或虚拟内存。
- 我们使用自定义字符串类型，因为 STL 提供的版本过于基础，并且缺乏适当的国际化支持。


为了更多方案查找Godot's container types。


## 为什么 Godot 不使用异常？


我们相信，无论如何，游戏都不应该崩溃。如果发生意外情况，Godot 将打印一条错误（甚至可以追溯到脚本），但随后它将尝试尽可能优雅地恢复并继续运行。


此外，异常会显著增加可执行文件的二进制大小，并且导致编译时间增加。


## Godot 使用 ECS（实体组件系统）吗？


Godot不使用 ECS，而是依赖于继承。虽然没有普遍更好的方法，但我们发现使用基于继承的方法可以获得更好的可用性，同时对于大多数用例来说速度仍然足够快。


也就是说，没有什么能阻止你通过创建带有单独的脚本的子节点，来在项目中使用组合。这些节点稍后可以在运行时中添加和移除，以动态添加和删除某些行为。


可以在这篇文章中找到更多有关 Godot 设计抉择的信息。


## 为什么 Godot 不强制用户实现 DOD（面向数据设计）？


尽管 Godot 的内部实现中尽可能的使用了缓存一致性，但我们认为不应该强迫用户使用 DOD。


DOD 主要是一种缓存一致性优化，只有在每帧需要处理数以万计的对象，且几乎不做任何修改时，才能够提供显著的性能提升。假如你每帧要移动的精灵或敌人只有几百个，那么 DOD 并不会带来有意义的性能提升。在这种情况下，你应该考虑别的优化手段。


绝大多数游戏都不需要这个，并且 Godot 提供了方便的辅助工具来完成大多数情况下的工作。


如果游戏的确需要处理如此巨量的对象，那么建议使用 C++ 和 GDExtensions 处理那些需要高性能的部分，使用 GDScript（或 C#）来负责游戏的其它部分。


## 如何支持 Godot 开发或做出贡献？


见《贡献方法》。


## 谁在为 Godot 工作？如何联系？


见Godot 官网上的相应页面。



---


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/complying_with_licenses.html](https://docs.godotengine.org/zh-cn/4.x/about/complying_with_licenses.html)



# 遵守许可证


> **警告**
> 本页中的建议不是法律建议。它们是出于善意提供的，以帮助用户了解许可证归属要求。


## 什么是许可证？


Godot 是根据MIT 许可证创建并分发的。它没有单一的所有者，因为每个向项目提交代码的贡献者都是在相同的许可证下进行，并保留其贡献的所有权。


许可证是你（或你的公司）使用和分发软件（以及衍生项目，包括用它制作的游戏）的法律要求。你的游戏或项目可以具有不同的许可证，但仍需要遵守原始许可证。


> **备注**
> 本节从用户的角度介绍了许可证合规性。 如果你作为贡献者对许可证合规性感兴趣，可以在这里找到指南说明。


> **小技巧**
> 除了 Godot 许可证文本之外，还请记得列出你正在使用的资产的第三方声明，例如纹理、模型、声音、音乐和字体。这包括免费资产，因为它们通常附带需要署名的许可证。


## 需求


对于 MIT 许可证，唯一的要求是将许可证文本包含在你的游戏或衍生项目的某处。


文本内容如下：


```
This game uses Godot Engine, available under the following license:

Copyright (c) 2014-present Godot Engine contributors.
Copyright (c) 2007-2014 Juan Linietsky, Ariel Manzur.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```


除了它自己的 MIT 许可证外，Godot 还包括来自许多第三方库的代码。有关详细信息，请参见《第三方许可证》。


> **备注**
> 你的游戏无需遵循相同的许可证。你可以选择任意许可证自由地发布自己的 Godot 项目，以及使用该引擎创建商业游戏。


## 包含


必须向用户提供许可证文本。许可证并未指定如何包含文本，但以下是最常见的方法（只需实现其中一种，无需全部实现）。


### 制作人员画面


将上述许可证文本包含在制作人员画面的某个位置。它可以位于显示其余制作人员后的底部。大多数大型工作室都使用这种方法来获得开源许可证。


### 许可证画面


有些游戏有专门的菜单（通常在设置中）来显示许可证。该菜单通常通过名为第三方许可证或开源许可证的按钮访问。


### 输出日志


在全局输出日志可读的平台上，使用print()函数打印许可证文本可能就足够了。适用于桌面平台、Android 和 HTML5（但不适用于 iOS）。


### 随附文件


如果游戏是在桌面平台上发行的，则可以将包含许可证文本的文件添加到安装到用户电脑的软件中。


### 印刷手册


如果游戏包含印刷手册，则可以将许可证文本包含在其中。


### 许可证链接


Godot 引擎开发者认为，在你游戏的文档或者制作人员信息中加入指向godotengine.org/license的链接是满足许可条款的可接受方式。


> **小技巧**
> Godot 提供了多种方法来获取Engine单例中的许可证信息。 这将允许你直接从引擎二进制文件中获取许可证信息，从而防止更新引擎版本时信息过时。
对于引擎自己：
Engine.get_license_text
对于引擎使用的第三方部件：
Engine.get_license_infoEngine.get_copyright_info


## 第三方许可证


Godot 本身包含由第三方编写的软件，这些软件与 Godot 的 MIT 许可证兼容，但不受其约束。


许多这些依赖项都是在宽松的开源许可证下分发的，这些许可证要求通过在最终产品的文档中明确引用其版权声明和许可证文本来署名。


考虑到 Godot 项目的规模，要彻底做到这一点相当困难。对于 Godot 编辑器，第三方版权和许可证的完整文档在COPYRIGHT.txt文件中提供。


对于最终用户来说，记录第三方许可证的一个好方法是将此文件包含在项目的分发中，例如，你可以将它重命名为GODOT_COPYRIGHT.txt以防止与你自己代码和资产混淆。



---


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/release_policy.html](https://docs.godotengine.org/zh-cn/4.x/about/release_policy.html)


# Godot 发布策略


Godot 的发布政策是在不断改进的。以下内容提供了大致的预期结果，但实际会发生什么取决于核心贡献者的选择，以及社区在特定时期的需求。


## Godot 版本


Godot 松散地遵循了语义化版本，采用了major.minor.patch的版本系统，不过对每个术语的解释都根据游戏引擎的复杂性进行了调整：


- major（主要）版本在发生重大兼容性破坏时会增加，这意味着项目需要大量的移植工作，才能从一个主要版本迁移另一个主要版本。例如，将 Godot 项目从 Godot 3.x 移植到 Godot 4.x 时，需要通过转换工具运行项目，然后对工具无法自动完成的工作进行进一步的手动调整。
- minor（次要）版本在不严重破坏兼容性的功能发布时增加。在次要版本中，某些特定领域可能会出现轻微兼容性破坏，但绝大多数项目不会受到影响，也不需要进行大量移植工作。这是因为 Godot 作为一款游戏引擎， 涵盖了渲染、物理和脚本等许多领域。修复某个领域的 Bug 或实现新功能，有时可能需要改变某个功能的行为，或者修改某个类的接口，即便是引擎 API 的其他部分仍然向后兼容。


> **小技巧**
> 建议所有用户升级到新的次要版本，但有必要进行一些测试，以确保你的项目仍能按照预期的方式运行。


- patch（补丁）版本是为维护版本而增加的，其重点是修复错误和安全问题，实现平台支持的新要求，以及反向移植安全可用性增强功能。补丁版本是向后兼容的。补丁版本可能包含一些不影响现有 API 的小的新功能，因此没有影响现有项目的风险。


> **小技巧**
> 因此，更新到新的补丁版本被认为是安全的，并强烈推荐给特定稳定分支的所有用户。


我们将major.minor组合称为稳定分支。每个稳定分支都从major.minor版本开始（不写为0的patch），后续维护版本的开发都位于同名的 Git 分支上（例如 4.0 稳定分支补丁更新的开发位于4.0Git 分支）。


## 发布支持时间表


对稳定分支的支持会至少持续到下一个稳定分支发布并获得第一个补丁更新。在实践中，只要稳定分支有需要维护更新的活跃用户，我们就会尽最大努力为其提供支持。


每当一个新的主要版本发布时，我们都会将之前的稳定分支作为长期支持的版本，并尽力为无法将复杂项目移植到新的主要版本的该分支用户，在遇到的问题时提供修复。2.1 分支就是如此，3.x 分支也是如此。


在给定的次要版本系列中，只有最新的补丁版本会获得支持。如果你在使用较旧的补丁版本时遇到问题，请先升级到该系列的最新补丁版本并再次测试，然后再在 GitHub 上报告问题。


| 版本 | 发布日期 | 支持级别 |
| --- | --- | --- |
| Godot 4.7（master） | 2026 年第二/三季度（预计） | 开发版。在开发过程中接收新功能、可用性和性能的改进，以及错误修复。 |
| Godot 4.6 | 2026 年 1 月 | 接受针对 Bug 和安全问题的修复，以及启用平台支持的补丁。 |
| Godot 4.5 | 2025 年 9 月 | 仅接受针对安全问题和平台支持问题的修复。 |
| Godot 4.4 | 2025 年 3 月 | 不再支持（最后更新：4.4.1）。 |
| Godot 4.3 | 2024 年 8 月 | 不再支持（最后更新：4.3）。 |
| Godot 4.2 | 2023 年 11 月 | 不再支持（最后更新：4.2.2）。 |
| Godot 4.1 | 2023 年 7 月 | 不再支持（最后更新：4.1.4）。 |
| Godot 4.0 | 2023 年 3 月 | 不再支持（最后更新：4.0.4）。 |
| Godot 3.7（3.x） | 目前没有预计时间 | 测试版。正在开发中，接收新功能、可用性和性能的改进，以及错误修复。 |
| Godot 3.6 | 2024 年 9 月 | 接受针对 Bug 和安全问题的修复，以及启用平台支持的补丁。 |
| Godot 3.5 | 2022 年 8 月 | 不再支持（最后更新：3.5.3）。 |
| Godot 3.4 | 2021 年 11 月 | 不再支持（最后更新：3.4.5）。 |
| Godot 3.3 | 2021 年 4 月 | 不再支持（最后更新：3.3.4）。 |
| Godot 3.2 | 2020 年 1 月 | 不再支持（最后更新：3.2.3）。 |
| Godot 3.1 | 2019 年 3 月 | 不再支持（最后更新：3.1.2）。 |
| Godot 3.0 | 2018 年 1 月 | 不再支持（最后更新：3.0.6）。 |
| Godot 2.1 | 2016 年 7 月 | 不再支持（最后更新：2.1.6）。 |
| Godot 2.0 | 2016 年 2 月 | 不再支持（最后更新：2.0.4.1）。 |
| Godot 1.1 | 2015 年 5 月 | 不再支持。 |
| Godot 1.0 | 2014 年 12 月 | 不再支持。 |


图例：完全支持 –部分支持 –不支持（生命结束）–开发版本


Godot 的预览版不是为生产使用准备的，仅供测试目的使用。


> **参见**
> 有关将项目从 Godot 3.x 迁移到 4.x 的说明，请参阅《从 Godot 3 升级到 Godot 4》。


## 新项目应该使用哪个版本？


我们建议在新项目中使用 Godot 4.x，因为在未来 3.x 停止接收更新后很长时间内仍将支持 Godot 4.x 系列。 需要注意的是，许多第三方文档尚未针对 Godot 4.x 进行更新。 如果你必须学习为 Godot 3.x 设计的教程，我们建议在单独的选项卡中保持《从 Godot 3 升级到 Godot 4》打开，以检查哪些方法已被重命名（如果你在尝试使用 Godot 4.x 中已被重命名的特定节点或方法时出现脚本错误）。


如果你的项目需要 4.x 版本中缺失的功能（如 GLES2/WebGL 1.0），那么你应该为新项目使用 Godot 3.x。


## 我是否应该升级我的项目以使用新的引擎版本？


> **备注**
> 在项目中途升级软件本身就有风险，所以在尝试升级之前请慎重考虑，你的项目是否能够从升级中获益。另外，请做好项目的备份或者使用版本控制系统，防止在升级出错时造成数据的丢失。
也就是说，我们尽力确保的是次要版本，尤其是补丁版本与现有项目兼容。


一般性建议是升级你的项目以跟进新的补丁版本，例如从 4.0.2 升级到 4.0.3。 这可以确保你获得错误修复、安全更新和平台支持更新（这对于移动平台来说尤其重要）。 你还可以获得持续的支持，因为只有最新的补丁版本才会在官方社区平台上获得支持。


对于次要版本，你应该根据具体情况具体分析的原则，来确定升级是否是个好主意。 我们已经付出了很大的努力来使升级过程尽可能无缝，但次要版本中可能会出现一些重大更改，并且回归的风险也更大。次要版本中包含的某些修复，也可能会根据修复某些错误的需要而更改类的预期行为。 在文档中标记为实验性的类中尤其如此。


主要版本带来了许多新功能，但它们也会移除以前有的功能，并有可能提高硬件要求。与次要版本相比，它们还需要更多的工作来升级。 因此，如果你对项目当前的运行方式感到满意，我们建议你坚持使用你开始项目时使用的主要版本。 例如，如果你的项目是从 3.5 开始的，那么我们建议升级到 3.5.2，将来也许升级到 3.6，但不要升级到 4.0+，除非你的项目确实需要 4.0+ 带来的新功能。


## 下一个版本什么时候发布？


虽然 Godot 贡献者的工作没有设置截止日期，但我们会努力相对频繁地发布次要版本。


尤其是在 4.0 经历了漫长的发布周期之后，我们正在转向更快节奏的开发工作流程，4.1 在 4.0 发布 4 个月后发布，4.2 在 4.1 发布 4 个月后发布。


频繁发布次要版本可以让我们能够更快地发布新功能（有可能是实验性的），快速获得用户反馈，并迭代以改进这些功能及其可用性。同样，通过更快的路径到达最终用户，总体的用户体验将得到更稳定的改善。


维护（补丁）版本是按需发布的，开发周期可能很短，作用是为当前稳定分支的用户提供最新的错误修复，以满足他们的生产需求。


目前没有计划发布下一个 3.x 小版本 3.7 的日期。当前的稳定版本 3.6 可能是 Godot 3.x 的最后一个稳定分支。Godot 3.x 将根据贡献者的努力继续提供支持，只要维护者仍在维护它。


## 引擎版本之间的兼容标准是怎样的？


> **备注**
> 本节旨在供贡献者使用以确定哪些更改对于给定版本是安全的。 该列表并不详尽； 它只是概述了 Godot 开发过程中遇到的最常见的情况。


补丁版本中可以接收以下更改：


- 以不会对大多数项目产生重大负面影响的方式修复一个错误，例如一个视觉或物理错误。Godot 的物理引擎不是确定性的，因此物理错误修复不被认为会破坏兼容性。如果修复一个错误会产生可能会影响很多项目的负面影响，则应将其设置为可选项（例如使用项目设置或单独的方法）。
- 向方法添加新的可选参数。
- 小规模的编辑器可用性调整。


需要注意的是，我们在每个后续的补丁发布中通常更加保守地处理允许的修复。 例如，4.0.1 可能会比 4.0.4 收到更具影响的修复。


以下更改在次要版本中是可接受的，但在补丁版本中则是不可接受的：


- 重大新特性。
- 重命名方法参数。在 C# 中，方法参数可以通过名称传递（但在 GDScript 中不行）。因此这可能会破坏一些使用 C# 的项目。
- 弃用方法、成员变量或类。 这是通过向其类参考中添加一个已弃用标志来完成的，该标志将显示在编辑器中。 当一个方法被标记为已弃用时，它将在下一个主要版本中移除。
- 影响默认项目主题视觉效果的更改。
- 某些引起了行为或输出的明显改变的错误修复，旨在更好地满足用户的期望。相比之下，在补丁版本中，我们可能倾向于保留一些错误行为，这样我们就不会破坏可能已经依赖该错误或使用了变通方法的现有项目。
- 导致了视觉变化的性能优化。


以下更改被视为破坏兼容性，并且只能在新的主要版本中执行：


- 重命名或删除方法、成员变量或类。
- 通过让节点继承不同的类来修改节点的继承树。
- 更改项目设置值的默认值，从而影响现有项目。如果只想影响新项目，项目管理器应改为编写修改后的project.godot。


由于 Godot 5.0 分支目前还没有建立，我们目前不鼓励进行此类破坏兼容性的更改。


> **备注**
> 在以任何方式修改方法签名（包括添加可选参数）时，必须创建一个 GDExtension 兼容性方法。这确保了现有的 GDExtensions 能够在补丁和次要版本更新中继续工作，从而使用户不必重新编译它们。有关更多信息，请参见《处理兼容问题》。



---


> 来源: [https://docs.godotengine.org/zh-cn/4.x/about/docs_changelog.html](https://docs.godotengine.org/zh-cn/4.x/about/docs_changelog.html)



# 文档变更日志


文档正在不断完善中。新版本加入了许多新页面、对旧版页面的修正和更新，以及对类参考手册的诸多更新。以下是自 3.0 版以来添加的新页面的列表。


> **备注**
> 本文档仅包含新页面，因此并未反映所有更改，许多页面已经大幅更新，但未反映在本文档中。


## 4.6 版本加入的新页面


### 编辑器


- 游戏嵌入


### 用户界面（UI）


- 创建应用程序


## 4.5 版本加入的新页面


### 输入


- 控制器功能


### 迁移


- 从 Godot 4.5 升级到 Godot 4.6


### 平台相关


- 解决 Android 系统上的崩溃问题
- Wayland/X11


### 脚本


- 核心函数与类型


## 4.4 版本加入的新页面


### 编辑器


- 使用引擎编译配置编辑器


### GDExtension


- GDExtension C 示例


### 迁移


- 从 Godot 4.4 升级到 Godot 4.5


### 脚本


- 日志


## 4.3 版本加入的新页面


### 2D


- 2D 简介


### 3D


- 带弹簧臂的第三人称相机


### 调试


- 输出面板


### 编辑器


- 使用 XR 编辑器


### 迁移


- 从 Godot 4.3 升级到 Godot 4.4


### 性能


- 减少着色器（管线）编译导致的卡顿


### 物理


- 物理插值
- 快速入门指南
- 介绍
- 使用物理插值
- 高级物理插值
- 2D 和 3D 物理插值


### 渲染


- 渲染器概述


### 着色器


- 内置函数


## 4.1 版本加入的新页面


### 关于


- 系统需求


### 2D


- 2D 视差


### 贡献


- 处理兼容问题


### GDExtension


- .gdextension 文件
- 添加文档


### 迁移


- 从 Godot 4.2 升级到 Godot 4.3


### 渲染


- 合成器


### XR


- 更好的 XR 启动脚本
- 增强现实（ AR ）与透视
- 接下来该做什么
- OpenXR 设置
- OpenXR 合成层
- OpenXR 身体跟踪


## 4.1 版本加入的新页面


### C#


- C# 诊断


### 开发


- 2D 坐标系与 2D 变换


### 迁移


- 从 Godot 4.1 升级到 Godot 4.2


### I/O


- 运行时文件加载和保存


### 平台相关


- Godot Android 库


## 4.0 版本加入的新页面


### 开发


- 内部渲染架构
- 使用 Sanitizer


### 迁移


- 从 Godot 4.0 升级到 Godot 4.1


### 物理


- 物理问题的故障排除


## 3.6 版本加入的新页面


### 2D


- 2D 抗锯齿


### 3D


- 3D 抗锯齿
- 伪造全局光照
- 全局光照简介
- 网格的细节级别（LOD）
- 遮挡剔除
- 带符号距离场全局光照（SDFGI）
- 使用贴花
- 可见范围（HLOD）
- 体积雾和雾体积
- 可变速率着色
- 物理灯光和相机单位


### 动画


- 创建电影


### 资产管线


- 3D 骨架重定向


### 开发


- 自定义平台的移植


### 迁移


- 从 Godot 3 升级到 Godot 4


### 物理


- 大世界坐标


### 脚本


- 自定义性能监视器
- C# 集合
- C# 全局类
- C# Variant


### 着色器


- 使用计算着色器


### XR


- XR 工具简介
- XR 动作映射
- 部署到 Android


## 3.5 版本加入的新页面


无。


## 3.4 版本加入的新页面


### 3D


- 3D 文本


### 动画


- 播放视频


### 编辑器


- 管理编辑器功能


## 3.3 版本加入的新页面


### GDScript


- GDScript 文档注释


## 3.2 版本加入的新页面


### 3D


- 3D 渲染的局限性


### 关于


- 故障排除
- 特性列表
- Godot 发布策略


### 最佳实践


- 版本控制系统


### 开发


- 错误宏
- 验证层
- 配置 IDE：Code::Blocks


### 编辑器


- 编辑器默认快捷键
- 使用 Web 编辑器


### 导出


- 为专用服务器导出


### 输入


- 控制器、手柄和摇杆


### 数学


- 随机数生成


### 平台相关


- 创建 iOS 插件
- HTML5 shell 类参考


### 物理


- 碰撞形状（2D）
- 碰撞形状（3D）


### 着色器


- 着色器风格指南


### 脚本


- 调试器面板
- 创建脚本模板
- 表达式求值
- GDExtension 是什么？
- GDScript 警告系统（拆分自GDScript 静态类型编程）


### 用户界面（UI）


- 控件节点一览


## 3.1 版本加入的新页面


### 项目工作流程


- Android 的 Gradle 构建


### 2D


- 2D 精灵动画


### 音频


- 使用麦克风录音
- 将游戏玩法与音频和音乐同步


### 数学


- 贝塞尔、曲线和路径
- 插值


### 输入


- 输入示例


### 国际化


- 使用 gettext（PO 文件）进行本地化


### 着色


- 你的第一个着色器系列：着色器简介你的第一个 2D 着色器你的第一个 3D 着色器你的第二个 3D 着色器
- 使用 VisualShader


### 网络


- WebRTC


### 插件


- Godot Android 插件
- 检查器插件
- 可视化着色器插件


### 多线程


- 使用多线程


### 创建内容



**程序式几何体系列：**
: 程序式几何体使用 ArrayMesh使用 SurfaceTool使用 MeshDataTool使用 ImmediateMesh


### 优化


- 使用 MultiMesh 进行优化
- 使用服务器进行优化


### 法律相关


- 遵守许可证


## 3.0 版本加入的新页面


### 渐进式教程


- 使用信号
- 导出


### 脚本


- GDScript 静态类型编程


### 项目工作流程


最佳实践：


- 介绍
- 在 Godot 中应用面向对象原则
- 场景组织
- 何时使用场景与脚本
- 自动加载与常规节点
- 何时以及如何避免为任何事情使用节点
- Godot 接口
- Godot 通知
- 数据偏好
- 逻辑偏好


### 2D


- 2D 灯光和阴影
- 2D 网格


### 3D


- 使用 CSG 设计关卡原型
- 使用 MultiMeshInstance3D 动画化成千上万条鱼
- 用粒子控制数千条鱼


### 物理


- 布娃娃系统
- 使用 SoftBody3D


### 动画


- 2D 骨骼
- 使用 AnimationTree


### GUI


- 使用容器


### 视口


- 使用 SubViewport 作为纹理
- 自定义后期处理


### 着色


- 将 GLSL 转换为 Godot 着色器
- 高级后期处理


着色参考：


- 着色器简介
- 着色语言
- Spatial 着色器
- CanvasItem 着色器
- 粒子着色器


### 插件


- 制作主屏幕插件
- 3D 小工具插件


### 平台相关


- 用于 Web 导出的自定义 HTML 页面


### 多线程


- 线程安全的 API


### 创建内容


- 树木的制作


### 杂项


- 修复抖动、卡顿和输入延迟
- 在编辑器中运行代码
- 手动更改场景


### 编译


- 为尺寸优化构建
- 使用 PCK 加密密钥编译


### 引擎开发


- 绑定到外部库



---

