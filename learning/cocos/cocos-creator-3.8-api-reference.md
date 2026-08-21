# Cocos Creator 3.8.8 API 参考文档

> 本文档基于 [Cocos Creator 3.8 官方 API 文档（中文）](https://docs.cocos.com/creator/3.8/api/zh/) 整理编写，内容覆盖 `https://docs.cocos.com/creator/3.8/api/zh/` 下全部 26 个模块总览页及其中的类、命名空间、接口、函数、枚举、变量等，并对常用重点类进行了属性与方法级的详解。目标版本为 Cocos Creator 3.8.8（文档版本 3.8）。

---

## 目录

1. [文档说明与阅读约定](#1-文档说明与阅读约定)
2. [通用调用约定](#2-通用调用约定)
3. [核心模块（core）](#3-核心模块core)
4. [数学（math）](#4-数学math)
5. [场景图（scene-graph）](#5-场景图scene-graph)
6. [2D 渲染](#6-2d-渲染)
7. [3D 渲染](#7-3d-渲染)
8. [用户界面（UI）](#8-用户界面ui)
9. [图形后端抽象（gfx）](#9-图形后端抽象gfx)
10. [渲染管线（render-pipeline）](#10-渲染管线render-pipeline)
11. [资源（asset）](#11-资源asset)
12. [输入系统（input）](#12-输入系统input)
13. [原生接口（native）](#13-原生接口native)
14. [性能监控（profiler）](#14-性能监控profiler)
15. [基础图元（primitive）](#15-基础图元primitive)
16. [动画（animation）](#16-动画animation)
17. [缓动系统（tween）](#17-缓动系统tween)
18. [音频（audio）](#18-音频audio)
19. [视频（video）](#19-视频video)
20. [WebView](#20-webview)
21. [物理系统（physics）](#21-物理系统physics)
22. [2D 物理系统](#22-2d-物理系统)
23. [粒子系统（3D）](#23-粒子系统3d)
24. [2D 粒子系统](#24-2d-粒子系统)
25. [DragonBones（龙骨）](#25-dragonbones龙骨)
26. [Spine](#26-spine)
27. [瓦片地图（TiledMap）](#27-瓦片地图tiledmap)
28. [地形（Terrain）](#28-地形terrain)
29. [附录](#29-附录)

---

## 1. 文档说明与阅读约定

- **适用范围**：本文档适用于 Cocos Creator **3.8.x** 版本（含 3.8.8）。Cocos Creator 3.x 与 2.x 的 API 并不完全兼容，查阅时请注意版本区分。
- **信息来源**：全部内容整理自 Cocos Creator 3.8 官方 API 文档（中文），来源链接为 `https://docs.cocos.com/creator/3.8/api/zh/` 及其子页面。
- **标注说明**：官方文档中不存在或抓取不到详细内容的条目，标注为 `[未获取]`，不进行内容编造。
- **类型说明**：个别官方页面存在类型标注瑕疵（如部分应为 `Vec3` 的字段标为 `Vec2`），本文档按真实语义记录，并在相应位置注明。
- **模块组织**：官方 API 按 26 个模块（readme 页）组织，每个模块页下列出命名空间、类、接口、函数、枚举、变量、类型别名等。本文档保持相同组织方式。

---

## 2. 通用调用约定

### 2.1 模块导入方式

Cocos Creator 3.8 采用 ES Module 方式导入 API，统一从 `cc` 模块导出：

```ts
// 基础导入
import { Node, Component, Vec3, director, _decorator } from 'cc';
const { ccclass, property } = _decorator;

// 命名空间式访问
import { geometry, math, js, sys, macro, tween } from 'cc';
import { AssetManager, resources } from 'cc';
import { dragonBones } from 'cc';      // 龙骨
import { sp } from 'cc';               // Spine
import { native } from 'cc';           // 原生接口
import { NATIVE } from 'cc/env';       // 平台宏
```

- 2D/3D 渲染组件（`Sprite`、`Label`、`Camera`、`MeshRenderer` 等）均从 `cc` 直接导入。
- 数学类型（`Vec2/Vec3/Vec4/Quat/Mat3/Mat4/Color/Rect/Size`）从 `cc` 导入，亦可通过 `math` 命名空间访问（如 `math.Vec3`）。
- 几何体（`geometry.AABB/Ray/Plane/Sphere/OBB` 等）从 `cc` 导入后通过 `geometry` 命名空间访问。
- 资源与加载（`Asset`、`assetManager`、`resources`、`AssetManager`）从 `cc` 导入。
- 输入（`input`、`EventKeyboard`、`EventMouse`、`EventTouch`）从 `cc` 导入。
- 引擎内置单例通过小写变量访问：`director`、`game`、`input`、`assetManager`、`resources`、`settings`、`sys`、`view`、`profiler`、`tween`、`systemEvent`、`widgetManager` 等。

### 2.2 装饰器（_decorator）

`_decorator` 命名空间提供组件与属性声明装饰器，是脚本开发的核心约定：

| 装饰器 | 说明 |
|---|---|
| `@ccclass('ClassName')` | 将类声明为 CC 类，参数为类名 |
| `@property` | 声明属性为 CCClass 属性，可在编辑器属性检查器中显示 |
| `@property(Number)` / `@property(String)` / `@property(Boolean)` / `@property(Vec3)` 等 | 标注属性类型 |
| `@executeInEditMode` | 允许组件在编辑器内执行（生命周期回调在编辑器中触发） |
| `@executionOrder(n)` | 设置组件生命周期回调执行优先级（仅影响 onLoad/onEnable/start/update/lateUpdate） |
| `@disallowMultiple` | 防止多个同类型（或子类型）组件添加到同一节点 |
| `@requireComponent(Comp)` | 添加组件时自动补充依赖组件 |
| `@menu('path')` | 将组件加入编辑器组件菜单 |
| `@help('url')` / `@icon('url')` / `@inspector('url')` | 设置帮助文档、图标、自定义属性检查器 |
| `@playOnFocus` | 选中节点时提高编辑器场景刷新频率到 60 FPS |
| `@uniquelyReferenced` | 将类标记为“被唯一引用”，序列化时避免对象引用共享 |
| `@type(Class)` | 标记属性类型 |

属性类型辅助装饰器（同 `@property` 组合使用）：`@property({ type: Number })`；`_decorator` 还提供 `boolean`、`integer`、`float`、`string`、`type` 等类型标记函数。

### 2.3 组件生命周期回调

所有继承 `Component` 的脚本按以下顺序被引擎调用（`protected`，需在子类中实现）：

| 回调 | 时机 |
|---|---|
| `onLoad()` | 节点首次激活时调用，先于 `start`，只调用一次 |
| `onEnable()` | 组件启用时调用（enabled 变为 true 且节点激活） |
| `start()` | 首次启用时、在第一次 `update` 之前调用，只调用一次 |
| `update(dt)` | 每帧调用，`dt` 为帧间隔秒 |
| `lateUpdate(dt)` | 每帧在所有 `update` 之后调用 |
| `onDisable()` | 组件禁用时调用 |
| `onDestroy()` | 组件销毁时调用 |
| `onRestore()` | （仅编辑器）撤销/重置时恢复内部状态 |
| `onFocusInEditor()` / `onLostFocusInEditor()` | （仅编辑器）获得/失去焦点回调 |
| `resetInEditor()` | （仅编辑器）初始化回调 |

### 2.4 定时器

组件内置定时器（自动绑定节点生命周期）：

```ts
this.schedule(callback, interval?, repeat?, delay?); // 循环定时
this.scheduleOnce(callback, delay?);                 // 单次定时
this.unschedule(callback_fn);
this.unscheduleAllCallbacks();
```

引擎级调度器：`director.getScheduler()`，提供 `schedule` / `scheduleUpdate` / `unschedule` / `unscheduleAllForTarget` / `pauseTarget` / `resumeTarget` / `setTimeScale` / `getTimeScale` 等（详见核心模块 Scheduler）。

### 2.5 事件系统

节点事件支持捕获、目标、冒泡三阶段：

```ts
node.on(type, callback, target?, useCapture?);
node.once(type, callback, target?, useCapture?);
node.off(type, callback?, target?);
node.emit(type, ...args);          // 派发事件
node.dispatchEvent(event);         // 派发事件对象（含冒泡）
node.targetOff(target);            // 移除 target 的所有监听
```

- 输入事件（触摸/鼠标/键盘）通过 `input.on(InputEventType.X, callback, target)` 注册。
- 节点级触摸事件使用 `Node.EventType.TOUCH_START` 等常量，通过 `node.on` 监听。
- 系统事件（键盘/重力感应）通过 `systemEvent.on(SystemEventType.X, ...)` 监听。

### 2.6 单例与全局对象速查

| 对象 | 说明 |
|---|---|
| `director` | 游戏流程管理（场景切换、主循环、调度器） |
| `game` | 游戏整体控制（帧循环、暂停、时间） |
| `input` | 输入系统单例（触摸、鼠标、键盘、手柄、加速度计等） |
| `systemEvent` | 系统事件单例（键盘、重力感应） |
| `assetManager` | 资源管理器单例（加载、释放、分包） |
| `resources` | 管理 `assets/resources` 目录下资源的 Bundle |
| `settings` | 配置模块单例（settings.json 配置读写） |
| `sys` | 平台/系统信息 |
| `view` | 全局视图单例 |
| `widgetManager` | Widget 对齐管理器 |
| `profiler` | 性能分析器单例 |
| `tween` | 缓动工具函数 |
| `macro` | 预定义常量 |

### 2.7 常用内置常量与工具

- 日志分级：`log` / `debug` / `info` / `warn` / `error`（及 `*ID` 变体，如 `errorID(id, ...)`，用 `getError(id)` 获取错误文本）。
- 断言与有效值：`assert(cond, msg)`、`isValid(obj)`、`isCCObject(obj)`。
- 数学常量：`math.EPSILON`、`math.HALF_PI`、`math.TWO_PI`。
- 平台判断：`sys.platform`、`sys.os`、`NATIVE`（来自 `cc/env`）、`EDITOR`、`BUILD`、`DEV`、`DEBUG` 等环境宏。

---

## 3. 核心模块（core）

> 官方简介：Cocos Creator 核心功能。模块页：`core-readme`。

### 3.1 命名空间

| 命名空间 | 说明 |
|---|---|
| `js` | JS 通用工具（对象属性、类注册、类型判断、废弃提示等） |
| `js.array` | 数组工具（插入、移除、拷贝、验证等） |
| `geometry` | 基础几何类型集合 |
| `geometry.distance` | 几何距离计算（点到平面/AABB/OBB 最近点等） |
| `memop` | 内存优化工具（对象池、缓存数组等） |
| `misc` | 杂项工具（clampf、角度转换、pushToMap 等） |
| `path` | 文件路径工具（basename、dirname、join 等） |
| `easing` | 缓动函数集合（quad/cubic/quart/quint/sine/expo/circ/elastic/back/bounce 各 In/Out/InOut/OutIn、linear、constant、fade、smooth 等） |
| `CCObject` | CCObject 相关命名空间 |
| `Settings` | 配置模块 |
| `sys` | 平台/系统相关 |
| `_decorator` | 装饰器集合（见第 2 章） |

### 3.2 类清单

| 类 | 说明 |
|---|---|
| `CCObject` | 大部分对象的基类 |
| `ValueType` | 所有值类型的基类 |
| `System` | 功能系统基类，由 Director 管理 |
| `Scheduler` | 定时器调度器（update 定时器与自定义定时器） |
| `Screen` | 屏幕管理单例 |
| `Settings` | settings.json 配置模块 |
| `AsyncDelegate` | 支持异步回调的代理 |
| `Gradient` | 渐变曲线控件（颜色/透明度关键帧插值） |
| `AlphaKey` / `ColorKey` | 透明度 / 颜色关键帧 |
| `RealCurve` | 实数曲线（关键帧曲线，支持常量/线性/三次插值与外推） |
| `RealKeyframeValue` | 实数关键帧值视图 |
| `QuatCurve` / `QuatKeyframeValue` | 四元数曲线及关键帧值视图 |
| `ObjectCurve` | 对象曲线 |
| `CompactValueTypeArray` | 紧凑值类型数组 |
| `js.IDGenerator` | 运行时 ID 生成器 |
| `js.array.MutableForwardIterator` | 可变正向迭代器 |
| `memop.CachedArray` | 常驻缓存数组封装（长度只增不减） |
| `memop.Pool` | 传统对象池 |
| `memop.RecyclePool` | 循环对象池（整体复用） |
| `geometry.AABB`（别名 `aabb`） | 轴对齐包围盒，中心点 + 半长宽高 |
| `geometry.Capsule`（别名 `capsule`） | 胶囊体几何 |
| `geometry.Frustum`（别名 `frustum`） | 视锥体几何 |
| `geometry.Line`（别名 `line`） | 直线几何 |
| `geometry.OBB`（别名 `obb`） | 方向包围盒 |
| `geometry.Plane`（别名 `plane`） | 平面几何（a·x + b·y + c·z - d = 0） |
| `geometry.Ray`（别名 `ray`） | 射线几何 |
| `geometry.Sphere`（别名 `sphere`） | 球几何 |
| `geometry.Spline` | 样条线几何 |
| `geometry.Triangle`（别名 `triangle`） | 三角形几何 |
| `geometry.Keyframe` | 曲线关键帧 |
| `geometry.AnimationCurve` | 三次 Hermite 插值的动画曲线 |

### 3.3 接口 / 枚举

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `CustomSerializable` | 自定义序列化接口 |
| 接口 | `ISchedulable` | 可被调度对象接口 |
| 接口 | `Macro` | 预定义常量接口声明（实际用 `macro`） |
| 接口 | `misc.Modifiable` | 可修改属性接口 |
| 接口 | `SerializationInput` / `SerializationOutput` / `SerializationMetadata` | 序列化输入/输出/元数据 |
| 接口 | `geometry.IRayMeshOptions` / `IRaySubMeshOptions` / `IRaySubMeshResult` | 射线检测参数与结果结构 |
| 枚举 | `CCObjectFlags` | CCObject 标志位 |
| 枚举 | `DebugMode` | 调试模式 |
| 枚举 | `geometry.enums` | 形状的类型值 |
| 枚举 | `geometry.ERaycastMode` | 射线检测模式 |

### 3.4 常用函数

| 函数 | 说明 |
|---|---|
| `assert(cond, msg)` / `assertID` | 断言检查，条件不为 true 输出错误 |
| `log/debug/warn/error`（及 `*ID`） | 控制台分级日志输出 |
| `isValid(obj)` / `isCCObject(obj)` | 对象有效性 / 类型判断 |
| `ccenum` / `Enum` / `BitMask` | 定义枚举 / 位掩码类型 |
| `CCClass` | 创建 CCClass |
| `Eventify` | 生成带事件接口的类 |
| `murmurhash2_32_gc` | MurmurHash2 哈希实现 |
| `removeProperty` / `replaceProperty` | 属性移除 / 替换（序列化迁移） |
| `WorldNode3DToLocalNodeUI` / `WorldNode3DToWorldNodeUI` | 非 UI 节点到 UI 节点坐标系转换 |
| `setDisplayStats` / `isDisplayStats` | 设置 / 查询是否显示 FPS 与调试信息 |
| `getSerializationMetadata` / `markAsWarning` | 序列化元数据 / 标记警告 |
| `js.*` | `extend`、`mixin`、`addon`、`copyAllProperties`、`getClassById/ByName`、`setClassName`、`getClassName`、`isChildClassOf`、`obsolete`、`obsoletes`、`clear`、`createMap`、`formatStr`、`getset`、`setClassAlias`、`unregisterClass` 等 |
| `js.array.*` | `appendObjectsAt`、`contains`、`copy`、`remove`、`removeAt`、`removeArray`、`removeIf`、`fastRemove`、`fastRemoveAt`、`fillItems`、`verifyType` 等 |
| `misc.*` | `clampf`、`degreesToRadians`、`radiansToDegrees`、`pushToMap`、`isDomNode`、`isPlainEmptyObj_DEV`、`tryCatchFunctor_EDITOR`、`callInNextTick` |
| `path.*` | `basename`、`dirname`、`extname`、`mainFileName`、`join`、`changeBasename`、`changeExtname`、`getSeperator`、`stripSep`、`_normalize` |
| `geometry.distance.*` | `point_plane`、`pt_point_aabb`、`pt_point_line`、`pt_point_obb`、`pt_point_plane` |
| `easing.*` | 各类缓动函数（constant/linear/quad/cubic/quart/quint/sine/expo/circ/elastic/back/bounce 各变体） |

### 3.5 重点类详解

#### CCObject

大部分对象的基类，提供命名、有效性检查与销毁机制。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string | 对象名称 |
| `isValid` | boolean | 对象是否可用（destroy 后下一帧起为 false） |
| `hideFlags` | Flags | 控制隐藏、锁定、序列化等功能 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `destroy()` | `destroy(): boolean` | 销毁对象并释放对其它对象的引用，延迟到当前帧渲染前执行 |

构造函数：`CCObject(name?: string)`。

#### ValueType

所有值类型的基类，规定 `toString` / `set` / `equals` / `clone` 契约（派生类必须重写）。

| 方法 | 签名 | 说明 |
|---|---|---|
| `toString()` | `toString(): string` | 返回字符串表示 |
| `set(other)` | `set(other: ValueType): void` | 赋值使与指定值相等 |
| `equals(other)` | `equals(other: ValueType): boolean` | 判断与指定值是否相等 |
| `clone()` | `clone(): ValueType` | 克隆当前值（返回对象不能是 this） |

#### Scheduler

定时器调度类（继承 `System`）。建议使用 `director.getScheduler()` 获取系统实例。支持 update 定时器（每帧、可设优先级）与自定义定时器。

| 方法 | 签名 | 说明 |
|---|---|---|
| `schedule(callback, target, interval, repeat?, delay?, paused?)` | `schedule(callback, target: ISchedulable, interval: number, ...)` | 规划新定时器 |
| `scheduleUpdate(target, priority, paused)` | `scheduleUpdate(target: ISchedulable, priority: number, paused: boolean)` | 为对象设置每帧 update 定时器（优先级低者先触发） |
| `unschedule(callback, target)` | `unschedule(callback: Function, target: ISchedulable)` | 取消指定对象的定时器 |
| `unscheduleUpdate(target)` | `unscheduleUpdate(target: ISchedulable)` | 取消 update 定时器 |
| `unscheduleAllForTarget(target)` | `unscheduleAllForTarget(target: ISchedulable)` | 取消对象的所有定时器 |
| `unscheduleAllWithMinPriority(minPriority)` | `unscheduleAllWithMinPriority(minPriority: number)` | 取消所有优先级高于指定值的定时器 |
| `unscheduleAll()` | `unscheduleAll()` | 取消所有定时器 |
| `setTimeScale(t)` / `getTimeScale()` | `(timeScale: number): void` / `(): number` | 设置/获取时间缩放 |
| `pauseTarget(target)` / `resumeTarget(target)` | `(target: ISchedulable): void` | 暂停/恢复对象定时器 |
| `isTargetPaused(target)` | `isTargetPaused(target: ISchedulable): boolean` | 查询暂停状态 |
| `isScheduled(callback, target)` | `isScheduled(callback: Function, target: ISchedulable): boolean` | 检查定时器是否存在 |
| `enableForTarget(target)` | `static enableForTarget(target: ISchedulable)` | 为对象启用调度支持 |

#### Settings

配置模块，获取 `settings.json` 配置信息并支持运行时覆盖。通过 `settings` 单例访问。

| 方法 | 签名 | 说明 |
|---|---|---|
| `querySettings(category, name)` | `querySettings<T>(category: string, name: string): null \| T` | 查询指定分组中的配置值 |
| `overrideSettings(category, name, value)` | `overrideSettings<T>(category: string, name: string, value: T): void` | 覆盖配置数据 |
| `init(path?, overrides?)` | `init(path?: string, overrides?: Record<string, any>): Promise<void>` | 初始化配置模块 |

#### Screen

`screen` 单例对象，提供屏幕管理方法。

| 属性 | 类型 | 说明 |
|---|---|---|
| `windowSize` | Size | 当前窗口物理像素尺寸（仅 Web 支持设置） |
| `supportsFullScreen` | boolean | 是否支持全屏 |
| `resolution` | Size | 当前游戏分辨率（只读） |
| `devicePixelRatio` | number | 设备物理像素与 CSS 像素之比 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `requestFullScreen()` | `requestFullScreen(): Promise<void>` | 请求进入全屏（需在用户交互回调中触发） |
| `exitFullScreen()` | `exitFullScreen(): Promise<any>` | 退出全屏 |
| `fullScreen()` | `fullScreen(): boolean` | 当前是否全屏 |
| `on/once/off(type, callback, target?)` | `(type: PalScreenEvent, callback, target?): void` | screen 事件注册/注销 |

#### System

功能系统的基类，由 `Director` 管理。

| 属性 | 类型 | 说明 |
|---|---|---|
| `priority` | number | 系统优先级 |
| `id` | string | 系统 ID |
| `Priority`（静态） | 对象 `{ HIGH, LOW, MEDIUM, SCHEDULER }` | 优先级常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `update(dt)` | `update(dt: number): void` | 帧更新（组件 update 与 lateUpdate 之间） |
| `postUpdate(dt)` | `postUpdate(dt: number): void` | 帧后处理（lateUpdate 后、渲染前） |
| `init()` | `init(): void` | 注册时由 Director 调用 |
| `destroy()` | `destroy(): void` | 销毁 |
| `sortByPriority(a, b)` | `static sortByPriority(a: System, b: System): number` | 系统间排序 |

#### geometry.AABB

轴对齐包围盒，用中心点（center）与半长宽高（halfExtents）描述。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | number | 形状类型（SHAPE_AABB） |
| `center` | Vec3 | 本地坐标中心点 |
| `halfExtents` | Vec3 | 长宽高的一半 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `AABB(px?, py?, pz?, hw?, hh?, hl?)` | 用中心与半尺寸构造 |
| `transform(m, pos, rot, scale, out)` | `transform(m: Mat4, pos: null\|Vec3, rot: null\|Quat, scale: null\|Vec3, out: AABB): void` | 用 4x4 矩阵变换 |
| `getBoundary(minPos, maxPos)` | `getBoundary(minPos: IVec3Like, maxPos: IVec3Like): void` | 获取最小点与最大点 |
| `mergePoint(point)` / `mergePoints(points)` / `mergeFrustum(frustum)` | `...: void` | 合并顶点/视锥体 |
| `copy(a)` / `clone()` | `copy(a: AABB): AABB` / `clone(): AABB` | 复制/克隆（无临时对象） |
| 静态 `create/set/copy/clone/fromPoints/merge/transform/toBoundingSphere` | `static ...` | 创建、设置、复制、克隆、两点创建、合并、矩阵变换、转包围球 |

#### geometry.Ray

射线几何，由起点（o）与方向（d）定义。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | number | 形状类型（SHAPE_RAY） |
| `o` | Vec3 | 起点 |
| `d` | Vec3 | 方向 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Ray(ox?, oy?, oz?, dx?, dy?, dz?)` | 构造射线 |
| `computeHit(out, distance)` | `computeHit(out: IVec3Like, distance: number): void` | 根据距离计算射线上的点 |
| 静态 `set/fromPoints/create/copy/clone` | `static ...` | 设置、两点创建、创建、复制、克隆 |

#### geometry.Plane

平面几何（平面方程 a·x + b·y + c·z - d = 0）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `n` | Vec3 | 法线向量 |
| `d` | number | 原点到平面的距离 |
| `type` | number | 形状类型（SHAPE_PLANE） |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Plane(nx?, ny?, nz?, d?)` | 构造平面 |
| `transform(mat)` | `transform(mat: Mat4): void` | 用 4x4 矩阵变换 |
| 静态 `set/normalize/fromPoints/fromNormalAndPoint/create/copy/clone` | `static ...` | 设置、归一化、三点/法线+点创建、创建、复制、克隆 |

#### geometry.Sphere

球几何。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | number | 形状类型（SHAPE_SPHERE） |
| `center` | Vec3 | 球心 |
| `radius` | number | 半径 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Sphere(cx?, cy?, cz?, r?)` | 构造球 |
| `translateAndRotate(m, rot, out)` | `translateAndRotate(m: Mat4, rot: Quat, out: Sphere): void` | 矩阵+四元数变换 |
| `transform(m, pos, rot, scale, out)` | `transform(...): void` | RTS 变换 |
| `setScale(scale, out)` | `setScale(scale: Vec3, out: Sphere): void` | 缩放 |
| `mergePoint(point)` / `mergePoints(points)` / `mergeAABB(a)` | `...: void` | 合并点/AABB |
| `getBoundary(minPos, maxPos)` | `getBoundary(minPos: Vec3, maxPos: Vec3): void` | 获取边界点 |
| `copy(a)` / `clone()` / `destroy()` | `...` | 复制/克隆/销毁 |
| 静态 `set/fromPoints/create/copy/clone` | `static ...` | 创建、两点创建、设置、复制、克隆 |

#### geometry.OBB

方向包围盒。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | number | 形状类型（SHAPE_OBB） |
| `center` | Vec3 | 本地坐标中心点 |
| `halfExtents` | Vec3 | 长宽高的一半 |
| `orientation` | Mat3 | 方向矩阵 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `OBB(cx?, cy?, cz?, hw?, hh?, hl?, ox_1...oz_3?)` | 中心、半尺寸与方向矩阵构造 |
| `translateAndRotate(m, rot, out)` / `transform(m, pos, rot, scale, out)` / `setScale(scale, out)` | `...: void` | 变换系列 |
| `getBoundary(minPos, maxPos)` | `getBoundary(minPos: Vec3, maxPos: Vec3): void` | 获取最小/最大点 |
| 静态 `set/create/fromPoints/copy/clone` | `static ...` | 设置、创建、两点创建、复制、克隆 |

#### geometry.Capsule

胶囊体几何（球 + 圆柱组合）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `radius` | number | 球部半径 |
| `halfHeight` | number | 中心点到球部圆心的距离 |
| `axis` | number | 本地朝向轴 [0,1,2] => [x,y,z] |
| `center` / `rotation` / `ellipseCenter0` / `ellipseCenter1` | Vec3 / Quat / Vec3（只读） | 原点、旋转、两端球心 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Capsule(radius?, halfHeight?, axis?)` | 构造胶囊体 |
| `transform(m, pos, rot, scale, out)` | `transform(m: Mat4, pos: IVec3Like, rot: IQuatLike, scale: IVec3Like, out: Capsule): void` | RTS 变换 |
| `updateCache()` / `updateLocalCenter()` | `(): void` | 更新缓存 / 中心点 |

#### RealCurve

实数曲线，关键帧曲线的一种，支持常量、线性、三次（贝塞尔/埃尔米特）插值与前后向外推。

| 属性 | 类型 | 说明 |
|---|---|---|
| `preExtrapolation` / `postExtrapolation` | ExtrapolationMode | 前向/后向外推模式，默认 CLAMP |

| 方法 | 签名 | 说明 |
|---|---|---|
| `evaluate(time)` | `evaluate(time: number): number` | 计算指定时间的曲线值 |
| `isConstant(tolerance)` | `isConstant(tolerance: number): boolean` | 是否为常量曲线 |
| 继承 `addKeyFrame(time, value)` / `removeKeyframe(index)` / `clear()` | `...` | 关键帧增删清空 |
| 继承 `getKeyframeTime(index)` / `getKeyframeValue(index)` / `indexOfKeyframe(time)` / `updateTime(index, time)` | `...` | 关键帧访问与修改 |
| 继承 `keyFramesCount` / `rangeMin` / `rangeMax` | number | 关键帧数量 / 时间范围 |

#### Gradient

渐变曲线控件，包含颜色关键帧（colorKeys）与透明度关键帧（alphaKeys）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `mode` | number | 混合模式（Blend 插值 / Fixed 固定取最近帧） |
| `colorKeys` | ColorKey[] | 颜色关键帧列表 |
| `alphaKeys` | AlphaKey[] | 透明度关键帧列表 |
| `Mode`（静态） | `{ Blend, Fixed }` | 取色模式 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `sortKeys()` | `sortKeys(): void` | 对关键帧排序 |
| `setKeys(colorKeys, alphaKeys)` | `setKeys(colorKeys: ColorKey[], alphaKeys: AlphaKey[]): void` | 设置关键帧 |
| `evaluateFast(out, time)` | `evaluateFast(out: Color, time: number): Color` | 插值计算颜色与透明度（推荐） |
| `getRandomColor(out)` | `getRandomColor(out: Color): Color` | 随机生成颜色和透明度 |
| `getAlpha(time)` | `getAlpha(time: number): number` | 取透明度 |
| `getRGB(out, time)` | `getRGB(out: Color, time: number): Color` | 取 RGB |

#### AsyncDelegate

支持异步回调的代理，可注册异步/同步回调并在对应时机派发。

| 方法 | 签名 | 说明 |
|---|---|---|
| `add(callback)` | `add(callback: T): void` | 添加异步或同步回调 |
| `remove(callback)` | `remove(callback: T): void` | 移除回调 |
| `hasListener(callback)` | `hasListener(callback: T): boolean` | 查询是否已注册 |
| `dispatch(...args)` | `dispatch(...args: Parameters<T>): Promise<void[]>` | 派发代理事件（顺序不保证） |

---

## 4. 数学（math）

> 官方简介：数学库，包含 2D 与 3D 维度下的向量和矩阵运算，与其他一些相关数学类型。模块页：`math-readme`。

### 4.1 命名空间

| 命名空间 | 说明 |
|---|---|
| `math` | 数学库主命名空间 |
| `math.bits` | 位运算工具 |

### 4.2 类清单

| 类 | 说明 |
|---|---|
| `math.AffineTransform` | 二维仿射变换矩阵，描述平移、旋转和缩放 |
| `math.Color` | RGBA 颜色（各通道 [0,255] 整数） |
| `math.Mat3` | 3x3 矩阵 |
| `math.Mat4` | 4x4 矩阵 |
| `math.MathBase` | 数学基类 |
| `math.Quat` | 四元数 |
| `math.Rect` | 二维矩形（左下角 x、y + 宽高） |
| `math.Size` | 二维尺寸 |
| `math.Vec2` | 二维向量 |
| `math.Vec3` | 三维向量 |
| `math.Vec4` | 四维向量 |

### 4.3 接口 / 变量

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `math.IColorLike` | 颜色结构 |
| 接口 | `math.IMat3Like` / `IMat4Like` | 3x3 / 4x4 矩阵结构 |
| 接口 | `math.IQuatLike` | 四元数结构 |
| 接口 | `math.IRectLike` / `ISizeLike` | 矩形 / 尺寸结构 |
| 接口 | `math.IVec2Like` / `IVec3Like` / `IVec4Like` | 2/3/4 维向量结构 |
| 变量 | `math.EPSILON` | 浮点极小量 |
| 变量 | `math.HALF_PI` / `TWO_PI` | 半 / 二倍圆周率 |
| 变量 | `math.MATH_FLOAT_ARRAY` | 数学浮点数组相关 |
| 变量 | `math.bits.INT_BITS` / `INT_MAX` / `INT_MIN` | 整型位宽与极值 |

### 4.4 常用函数

| 函数 | 说明 |
|---|---|
| `math.absMax` / `absMaxComponent` | 返回绝对值最大的值 / 分量 |
| `math.approx` / `equals` | 近似相等判断（绝对 / 相对容差） |
| `math.clamp` / `clamp01` | 数值范围限制 |
| `math.lerp` / `inverseLerp` | 线性插值 / 逆插值 |
| `math.toDegree` / `toRadian` | 弧度与角度互转 |
| `math.repeat` / `pingPong` | 取余 / 乒乓时间 |
| `math.random` / `randomRange` / `randomRangeInt` / `pseudoRandom*` / `setRandGenerator` | 随机数生成 |
| `math.floatToHalf` / `halfToFloat` | 半精度浮点转换 |
| `math.v2/v3/v4/quat/mat4/rect/size/color` | 快速构造工具（如 `v3(x,y,z)` 等价 `new Vec3(x,y,z)`） |
| `math.bits.*` | `abs`、`min`、`max`、`sign`、`popCount`、`countTrailingZeros`、`isPow2`、`nextPow2`、`prevPow2`、`log2`、`log10`、`interleave2/3`、`deinterleave2/3`、`nextCombination`、`parity`、`reverse` |
| `rendering.packRGBE` | RGB 打包为 RGBA(RE) 格式 |

### 4.5 重点类详解

#### Vec2

二维向量（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` / `y` | number | x / y 分量 |
| 静态 `ZERO` / `ONE` / `NEG_ONE` / `UNIT_X` / `UNIT_Y` | Readonly\<Vec2\> | 常用常量向量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Vec2(other)` / `Vec2(x?, y?)` | 拷贝 / 分量构造 |
| `add(other)` / `add2f(x, y)`、`subtract` / `subtract2f`、`multiply` / `multiply2f`、`divide` / `divide2f` | `...: Vec2` | 向量四则运算 |
| `dot(other)` / `cross(other)` | `(other: Vec2): number` | 点乘 / 叉乘 |
| `length()` / `lengthSqr()` | `(): number` | 长度 / 长度平方 |
| `normalize()` | `normalize(): Vec2` | 归一化 |
| `lerp(to, ratio)` | `lerp(to: Vec2, ratio: number): Vec2` | 线性插值 |
| `angle(other)` / `signAngle(other)` | `(other: Vec2): number` | 夹角 / 有符号夹角 (-PI, PI] |
| `rotate(rad)` | `rotate(rad: number): Vec2` | 旋转（逆时针为正） |
| `project(other)` | `project(other: Vec2): Vec2` | 投影向量 |
| `clampf(minInclusive, maxInclusive)` | `...: Vec2` | 分量范围限制 |
| `strictEquals(other)` / `equals2f` | `...: boolean` | 精确 / 近似相等 |
| `negative()` | `negative(): Vec2` | 各分量取反 |
| `transformMat4(matrix)` | `transformMat4(matrix: Mat4): Vec2` | 矩阵变换 |
| `toVec3()` | `toVec3(): Vec3` | 转为 z=0 的 Vec3 |
| 静态（大量） | `static add/subtract/multiply/divide/dot/cross/lerp/angle/distance/normalize/transformMat3/transformMat4/toArray/fromArray/copy/clone/...` | glMatrix 风格静态工具，形如 `static (out, a, b...): Out` |

#### Vec3

三维向量（继承 `ValueType`）。为 3D 开发中使用最频繁的向量类型。

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` / `y` / `z` | number | 分量 |
| 静态 `ZERO` / `ONE` / `NEG_ONE` / `UP` / `RIGHT` / `FORWARD` / `UNIT_X` / `UNIT_Y` / `UNIT_Z` | Readonly\<Vec3\> | 常用常量向量 |
| 静态 `slerp` | 函数 | 向量球面插值 |
| 静态 `signedAngle` | 函数 | 有符号夹角（按参考向量 normal 判定方向） |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Vec3(v)` / `Vec3(x?, y?, z?)` | 拷贝 / 分量构造 |
| `add` / `add3f`、`subtract` / `subtract3f`、`multiply` / `multiply3f`、`divide` / `divide3f` | `...: Vec3` | 向量四则运算 |
| `dot(other)` | `dot(other: Vec3): number` | 点乘 |
| `cross(other)` | `cross(other: Vec3): Vec3` | 叉乘 |
| `length()` / `lengthSqr()` | `(): number` | 长度 / 长度平方 |
| `normalize()` / `negative()` | `...: Vec3` | 归一化 / 取反 |
| `lerp(to, ratio)` | `lerp(to: Vec3, ratio: number): Vec3` | 线性插值 |
| `clampf` / `equals3f` / `strictEquals` / `strictEquals3f` | `...` | 范围限制 / 相等判断 |
| `transformMat4(matrix)` | `transformMat4(matrix: Mat4): Vec3` | 矩阵变换 |
| `toVec2()` | `toVec2(): Vec2` | 转为 Vec2 |
| 静态（大量） | `static zero/transformRTS/transformQuat/transformMat4/transformMat4Normal/transformMat3/transformInverseRTS/transformAffine/rotateX/rotateY/rotateZ/rotateN/project/projectOnPlane/moveTowards/generateOrthogonal/...` | glMatrix 风格静态工具 |

#### Vec4

四维向量（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` / `y` / `z` / `w` | number | 分量 |
| 静态 `ZERO` / `ONE` / `NEG_ONE` / `UNIT_X` / `UNIT_Y` / `UNIT_Z` / `UNIT_W` | Readonly\<Vec4\> | 常用常量向量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Vec4(other)` / `Vec4(x?, y?, z?, w?)` | 拷贝 / 分量构造 |
| `add` / `add4f`、`subtract` / `subtract4f`、`multiply` / `multiply4f`、`divide` / `divide4f` | `...: Vec4` | 四则运算 |
| `dot` / `cross(vector)` | `...: number / Vec4`（cross 已弃用） | 点乘 / 叉乘 |
| `length()` / `lengthSqr()` | `(): number` | 长度 / 长度平方 |
| `normalize()` / `negative()` / `lerp(to, ratio)` | `...: Vec4` | 归一化 / 取反 / 插值 |
| `transformMat4(matrix)` | `transformMat4(matrix: Mat4): Vec4` | 矩阵变换 |
| 静态（大量） | `static transformQuat/transformMat4/fromColor/toArray/fromArray/lerp/random/normalize/...` | glMatrix 风格静态工具 |

#### Quat

四元数，用于 3D 旋转（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` / `y` / `z` / `w` | number | 四元数分量 |
| 静态 `IDENTITY` | Readonly\<Quat\> | 单位四元数 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Quat(other)` / `Quat(x?, y?, z?, w?)` | 拷贝 / 分量构造 |
| `slerp(to, ratio)` | `slerp(to: Quat, ratio: number): Quat` | 球面插值 |
| `lerp(to, ratio)` | `lerp(to: Quat, ratio: number): Quat` | 线性插值 |
| `length()` / `lengthSqr()` | `(): number` | 长度 / 长度平方 |
| `strictEquals(other)` | `(other: Quat): boolean` | 精确相等 |
| `getEulerAngles(out)` | `getEulerAngles(out: Vec3): Vec3` | 转为欧拉角（x-y-z） |
| 静态（大量） | `static fromEuler/fromAxisAngle/fromAxes/fromAngleZ/fromMat3/fromViewUp/getAxisAngle/identity/invert/conjugate/multiply/slerp/sqlerp/rotateX/Y/Z/rotateAround/rotationTo/normalize/toEuler/toEulerInYXZOrder/toArray/fromArray/copy/clone/...` | 四元数静态工具（含欧拉角顺序 YZX/YXZ 说明） |

#### Mat3

3x3 矩阵（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `m00`~`m08` | number | 矩阵元素（m00 第0列第0行） |
| 静态 `IDENTITY` | Readonly\<Mat3\> | 单位矩阵 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Mat3(other)` / `Mat3(m00?...m08?)` | 拷贝 / 元素构造 |
| `add(mat)` / `subtract(mat)` | `...: Mat3` | 矩阵加 / 减 |
| `multiply(mat)` / `multiplyScalar(scalar)` | `...: Mat3` | 矩阵乘 / 数乘 |
| `scale(vec)` / `rotate(rad)` / `transpose()` | `...: Mat3` | 缩放、旋转、转置 |
| `invert()` | `invert(): Mat3` | 求逆（不可逆返回全 0） |
| `identity()` | `identity(): Mat3` | 设为单位矩阵 |
| `fromQuat(q)` | `fromQuat(q: Quat): Mat3` | 由四元数重置 |
| `determinant()` | `determinant(): number` | 行列式 |
| `strictEquals(other)` | `(other: Mat3): boolean` | 精确相等 |
| 静态（大量） | `static add/subtract/multiply/scale/rotate/translate/transpose/invert/inverseTransposeMat4/identity/fromTranslation/fromScaling/fromRotation/fromQuat/fromMat4/fromViewUp/toEuler/toArray/fromArray/copy/clone/...` | glMatrix 风格静态工具 |

#### Mat4

4x4 矩阵（继承 `ValueType`），用于 3D 变换与投影。

| 属性 | 类型 | 说明 |
|---|---|---|
| `m00`~`m15` | number | 矩阵元素（m15 第3列第3行） |
| 静态 `IDENTITY` | Readonly\<Mat4\> | 单位矩阵 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Mat4(other)` / `Mat4(m00?...m15?)` | 拷贝 / 元素构造 |
| `add(mat)` / `subtract(mat)` | `...: Mat4` | 矩阵加 / 减 |
| `multiply(mat)` / `multiplyScalar(scalar)` | `...: Mat4` | 矩阵乘 / 数乘 |
| `scale(vec)` / `rotate(rad, axis)` / `translate(vec)` / `transform(vec)` | `...: Mat4` | 缩放、旋转、平移、变换 |
| `invert()` | `invert(): Mat4` | 求逆（不可逆返回全 0） |
| `identity()` | `identity(): Mat4` | 设为单位矩阵 |
| `getTranslation(out)` / `getScale(out)` / `getRotation(out)` | `...: Vec3 / Vec3 / Quat` | 提取位移 / 缩放 / 旋转 |
| `fromSRT(pos, rot, scale)` / `fromRTS(...)` / `fromQuat(q)` | `...: Mat4` | 由 SRT / RTS / 四元数重置 |
| `determinant()` / `transpose()` / `zero()` | `...` | 行列式 / 转置 / 零矩阵 |
| `strictEquals(other)` | `(other: Mat4): boolean` | 精确相等 |
| 静态（大量） | `static perspective/ortho/frustum/lookAt/toSRT/toRTS/toEuler/getTranslation/getScaling/getRotation/fromTranslation/fromScaling/fromRotation/fromXRotation/fromYRotation/fromZRotation/fromSRT/fromRTS/fromQuat/multiply/translate/transform/scale/rotate/invert/inverseTranspose/identity/zero/transpose/toArray/fromArray/copy/clone/...` | 矩阵静态工具（含透视 / 正交 / 视图矩阵） |

#### Color

RGBA 颜色，各通道为 [0,255] 整数（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `r` / `g` / `b` / `a` | number | 红 / 绿 / 蓝 / 透明度通道 |
| 静态 `BLACK` / `WHITE` / `GRAY` / `RED` / `GREEN` / `BLUE` / `CYAN` / `MAGENTA` / `YELLOW` / `TRANSPARENT` | Readonly\<Color\> | 预置颜色常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Color(other)` / `Color(hexString)` / `Color(r?, g?, b?, a?)` | 拷贝 / 十六进制字符串 / 分量构造 |
| `toRGBValue()` | `toRGBValue(): number` | 转 RGB 整数值 |
| `toHSV()` | `toHSV(): {h, s, v}` | 转 HSV |
| `toHEX(fmt?)` | `toHEX(fmt?: '#rrggbb' \| '#rrggbbaa' \| '#rgb'): string` | 转十六进制字符串 |
| `toCSS(opt?)` | `toCSS(opt?: 'rgba' \| 'rgb' \| '#rrggbb' \| '#rrggbbaa'): string` | 转 CSS 格式 |
| `fromHSV(h, s, v)` / `fromHEX(hex)` | `...: Color` | 从 HSV / 十六进制读入 |
| `multiply(other)` / `lerp(to, ratio)` | `...: Color` | 相乘 / 颜色插值 |
| `getModifiableProperties()` | `getModifiableProperties(): string[]` | 可修改属性列表 |
| 静态（大量） | `static toVec4/toUint32/toArray/fromVec4/fromUint32/fromHEX/fromArray/add/subtract/multiply/divide/scale/lerp/hex/copy/clone/...` | 颜色静态工具 |

#### Rect

二维矩形，由左下角 (x, y) 与宽高定义（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` / `y` | number | 矩形最小点坐标 |
| `width` / `height` | number | 宽度 / 高度 |
| `xMin` / `xMax` / `yMin` / `yMax` | number | 四边界（可读写） |
| `center` | Vec2 | 中心点坐标 |
| `origin` | Vec2 | x 和 y 坐标 |
| `size` | Size | 矩形尺寸 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Rect(other)` / `Rect(x?, y?, width?, height?)` | 拷贝 / 参数构造 |
| `contains(point)` / `containsRect(other)` | `(p: Vec2): boolean` / `(other: Rect): boolean` | 包含点 / 包含矩形 |
| `intersects(other)` | `intersects(other: Rect): boolean` | 是否相交 |
| `lerp(to, ratio)` | `lerp(to: Rect, ratio: number): Rect` | 矩形插值 |
| `transformMat4(mat)` / `transformMat4ToPoints(mat, out_lb, out_lt, out_rt, out_rb)` | `...` | 矩阵变换 |
| 静态 `union` / `intersection` / `fromMinMax` / `lerp` / `equals` | `static ...` | 并集、交集、两点创建、插值、相等 |

#### Size

二维尺寸（继承 `ValueType`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` / `height` | number | 宽 / 高 |
| `x` / `y` | number | 与 width/height 同值 |
| 静态 `ZERO` / `ONE` | Readonly\<Size\> | 常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Size(other)` / `Size(width?, height?)` | 拷贝 / 参数构造 |
| `lerp(to, ratio)` | `lerp(to: Size, ratio: number): Size` | 尺寸插值 |
| 静态 `lerp` / `equals` | `static ...` | 插值、相等 |

#### AffineTransform

二维仿射变换矩阵，描述平移、旋转和缩放。`[未获取]`：官方详情页返回 404，未获取到属性/方法详情。

---

## 5. 场景图（scene-graph）

> 官方简介：游戏由场景组成，场景由节点组成，节点之间是树状组织关系，每个节点可有多个子节点。模块页：`scene-graph-readme`。

### 5.1 命名空间

| 命名空间 | 说明 |
|---|---|
| `Layers` | 节点层管理器 |
| `Prefab` | 预制体命名空间 |
| `Prefab._utils` | 预制体内部工具命名空间 |

### 5.2 类清单

| 类 | 说明 |
|---|---|
| `Node` | 场景中的所有节点类（层级关系、持有组件、3D 变换） |
| `Component` | 所有附加到节点的组件基类（由引擎创建，禁止自传构造参数） |
| `Scene` | Scene 是 Node 子类，代表可运行的整体环境，由 Director 管理 |
| `Prefab` | 预制资源类 |
| `PrivateNode` | 私有节点 |
| `Layers` | 节点层管理器（掩码存储于 Node.layer） |
| `NodeActivator` | 节点与组件的激活 / 停用管理器 |
| `EventHandler` | 场景事件回调设置类（目标节点 + 组件名 + 方法名，通过 emit 调用） |
| `SceneGlobals` | 各类场景级渲染参数 |
| `AmbientInfo` / `FogInfo` / `ShadowsInfo` / `SkyboxInfo` / `PostSettingsInfo` / `OctreeInfo` / `LightProbeInfo` / `SkinInfo` | 场景级光照 / 雾 / 阴影 / 天空盒 / 后处理 / 八叉树 / 光照探针 / 皮肤设置 |
| `Prefab._utils.CompPrefabInfo` / `PrefabInfo` / `PrefabInstance` / `MountedChildrenInfo` / `MountedComponentsInfo` / `PropertyOverrideInfo` / `TargetInfo` / `TargetOverrideInfo` | 预制体内部数据类 |

### 5.3 接口 / 枚举 / 变量

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `ILightProbeNode` | 光照探针节点接口 |
| 接口 | `Prefab._utils.TargetMap` | 目标映射接口 |
| 枚举 | `NodeEventType` | 所有 Node 可能派发的事件类型 |
| 枚举 | `NodeSpace` | 节点的坐标空间 |
| 枚举 | `TransformBit` | 节点的空间变换位标记 |
| 变量 | `DEFAULT_OCTREE_DEPTH` / `DEFAULT_WORLD_MAX_POS` / `DEFAULT_WORLD_MIN_POS` | 默认八叉树深度 / 世界坐标极值 |
| 变量 | `MobilityMode` | 节点的移动性 |
| 函数 | `utils.find(path)` | 通过路径从节点树查找节点（大小写敏感，`/` 分隔，可找到未启用节点） |
| 函数 | `Prefab._utils.*` | `applyMountedChildren`、`applyPropertyOverrides`、`createNodeWithPrefab`、`expandPrefabInstanceNode` 等预制体内部函数 |

### 5.4 重点类详解

#### Node

Cocos Creator 场景中的所有节点类（继承 `CCObject`），具有层级关系、持有组件、维护 3D 空间变换。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string | 节点名称 |
| `active` | boolean | 自身激活状态（父节点不激活则无效） |
| `activeInHierarchy` | boolean | 在场景中是否实际激活 |
| `parent`（get/set） | Node \| null | 父节点 |
| `children` | Node[] | 所有子节点 |
| `components` | Component[] | 附加到节点的所有组件 |
| `position` | Vec3（只读） | 本地坐标 |
| `worldPosition` / `worldPositionX/Y/Z` | Vec3 / number | 世界坐标及分量 |
| `rotation` / `worldRotation` | Quat（只读） | 本地 / 世界旋转 |
| `eulerAngles` | Vec3（只读） | 本地旋转（欧拉角） |
| `angle` | number | 限定 Z 轴的本地旋转角 |
| `scale` / `worldScale` | Vec3（只读） | 本地 / 世界缩放 |
| `matrix` / `worldMatrix` | Mat4（只读） | 本地 / 世界变换矩阵 |
| `layer` | number | 节点所属层（掩码，影响射线检测、物理碰撞） |
| `uuid` | string | 编辑器用的 uuid（构建后变为自增 id） |
| `up` / `right` / `forward` | Vec3 | 世界空间朝上 / 朝右 / 朝前方向 |
| `hasChangedFlags` | number | 当前帧空间变换是否变化 |
| `scene` | Scene | 节点所属场景 |
| `EventType` / `NodeSpace` / `TransformBit`（静态） | 枚举 | 节点事件类型 / 空间坐标系 / 变换位标记 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Node(name?: string)` | 创建节点 |
| `addComponent(classConstructor/className)` | `addComponent<T>(...): T \| null` | 添加组件 |
| `getComponent(...)` / `getComponents(...)` / `getComponentInChildren(...)` / `getComponentsInChildren(...)` | `...` | 获取组件（含递归） |
| `removeComponent(comp)` | `removeComponent(comp: Component): void`（deprecated，建议 destroy） | 移除组件 |
| `setParent(value, keepWorldTransform?)` | `setParent(value: Node, keepWorldTransform?: boolean): void` | 设置父节点 |
| `addChild` / `removeChild(child)` / `removeAllChildren()` / `removeFromParent()` / `insertChild(child, siblingIndex)` | `...: void` | 子节点增删管理 |
| `setSiblingIndex(index)` / `getSiblingIndex()` | `...: void / number` | 设置 / 获取兄弟索引 |
| `getChildByName(name)` / `getChildByPath(path)` / `getChildByUuid(uuid)` | `...: Node \| null` | 查找子节点 |
| `isChildOf(parent)` / `getParent()` | `...: boolean / Node` | 父子关系查询 |
| `getPathInHierarchy()` | `getPathInHierarchy(): string` | 层级中的完整路径 |
| `setPosition(pos)` / `getPosition(out?)`、`setWorldPosition` / `getWorldPosition` | `...: Vec3` | 本地 / 世界坐标 |
| `setRotation(q)` / `getRotation(out?)`、`setWorldRotation` / `getWorldRotation` | `...: Quat` | 本地 / 世界旋转 |
| `setRotationFromEuler(euler)` | `setRotationFromEuler(euler: Vec3): void` | 欧拉角设置旋转 |
| `setScale(s)` / `getScale(out?)`、`setWorldScale` / `getWorldScale` | `...: Vec3` | 本地 / 世界缩放 |
| `setRTS(rot, pos, scale)` | `setRTS(rot, pos, scale): void` | 一次性设置全部局部变换 |
| `getWorldMatrix(out?)` / `getWorldRT(out?)` / `getWorldRS(out?)` | `...: Mat4` | 获取世界变换矩阵 |
| `lookAt(pos, up?)` | `lookAt(pos: Vec3, up?: Vec3): void` | 面向目标位置（默认前方 -z） |
| `inverseTransformPoint(out, p)` | `inverseTransformPoint(out: Vec3, p: Vec3): Vec3` | 世界坐标转本地坐标 |
| `on/once/off/emit/dispatchEvent/targetOff/hasEventListener` | `(type, callback, target?, useCapture?): ...` | 节点事件系统（捕获 / 目标 / 冒泡三阶段） |
| `walk(preFunc, postFunc?)` | `walk(preFunc: (node) => void, postFunc?): void` | 遍历子树（非递归栈实现） |
| `pauseSystemEvents(recursive)` / `resumeSystemEvents(recursive)` | `...: void` | 暂停 / 恢复系统事件 |
| `isTransformDirty()` / `invalidateChildren(dirtyBit)` | `...` | 变换脏标记相关 |
| `destroyAllChildren()` | `destroyAllChildren(): void` | 销毁所有子节点 |
| `attr(attrs)` | `attr(attrs: any): void` | 属性批量配置 |

#### Director

管理游戏逻辑流程的单例对象（使用 `director` 实例），创建并处理主窗口、管理场景切换与主循环。

| 属性 | 类型 | 说明 |
|---|---|---|
| `instance`（静态） | Director | Director 单例 |
| `root` | Root \| null | 根渲染对象 |
| 事件常量（静态） | `EVENT_INIT` / `EVENT_RESET` / `EVENT_BEGIN_FRAME` / `EVENT_END_FRAME` / `EVENT_BEFORE_UPDATE` / `EVENT_AFTER_UPDATE` / `EVENT_BEFORE_PHYSICS` / `EVENT_AFTER_PHYSICS` / `EVENT_BEFORE_DRAW` / `EVENT_AFTER_DRAW` / `EVENT_BEFORE_RENDER` / `EVENT_AFTER_RENDER` / `EVENT_BEFORE_COMMIT` / `EVENT_BEFORE_SCENE_LOADING` / `EVENT_BEFORE_SCENE_LAUNCH` / `EVENT_AFTER_SCENE_LAUNCH` | 主循环 / 场景生命周期事件 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `tick(dt)` | `tick(dt: number): void` | 运行主循环 |
| `runScene(scene, onBeforeLoadScene?, onLaunched?)` | `...: void` | 运行指定场景 |
| `runSceneImmediate(scene, ...)` | `...: void` | 立即运行场景 |
| `loadScene(sceneName, onLaunched?, onUnloaded?)` | `loadScene(sceneName: string, ...): boolean` | 通过场景名称加载场景 |
| `preloadScene(sceneName, onProgress?, onLoaded?)` | `preloadScene(sceneName: string, ...): void` | 预加载场景资源 |
| `getScene()` | `getScene(): Scene \| null` | 获取当前逻辑场景 |
| `getScheduler()` / `setScheduler(scheduler)` | `...` | 获取 / 设置调度器 |
| `pause()` / `resume()` / `isPaused()` | `...: void / boolean` | 暂停 / 恢复 / 查询暂停状态 |
| `startAnimation()` / `stopAnimation()` | `...: void` | 开始 / 停止游戏逻辑执行 |
| `end()` / `reset()` / `purgeDirector()` | `...` | 结束 / 重置 / 清除 director |
| `addPersistRootNode(node)` / `removePersistRootNode(node)` / `isPersistRootNode(node)` | `...: void / boolean` | 常驻根节点管理 |
| `registerSystem(name, sys, priority)` / `unregisterSystem(sys)` / `getSystem(name)` | `...: void / System` | 系统注册与获取 |
| `getTotalFrames()` / `getTotalTime()` / `getDeltaTime()` | `...: number` | 帧数与时间信息 |
| `getAnimationManager()` | `...: any`（deprecated） | 改用 `getSystem(AnimationManager.ID)` |
| `setupRenderPipelineBuilder()` | `...: void` | 设置渲染管线构建器 |

#### Component

所有附加到节点的组件基类（继承 `CCObject`）。注意：组件由引擎创建，不允许为组件子类传入构造参数。

| 属性 | 类型 | 说明 |
|---|---|---|
| `node` | Node | 组件被附加到的节点 |
| `enabled` | boolean | 组件自身是否启用 |
| `enabledInHierarchy` | boolean | 组件是否启用且节点激活 |
| `uuid` | string | 组件的 uuid |

| 方法 | 签名 | 说明 |
|---|---|---|
| `schedule(callback, interval?, repeat?, delay?)` | `schedule(callback, interval?, repeat?, delay?): void` | 循环定时 |
| `scheduleOnce(callback, delay?)` | `scheduleOnce(callback, delay?): void` | 单次定时 |
| `unschedule(callback_fn)` / `unscheduleAllCallbacks()` | `...: void` | 取消调度 |
| `getComponent(...)` / `getComponents(...)` / `getComponentInChildren(...)` / `getComponentsInChildren(...)` / `addComponent(...)` | 同 Node | 组件查找 / 添加 |
| `onLoad()` / `start()` / `update(dt)` / `lateUpdate(dt)` / `onEnable()` / `onDisable()` / `onDestroy()` | `...`（protected） | 生命周期回调（见第 2 章） |
| `resetInEditor()` / `onRestore()` / `onFocusInEditor()` / `onLostFocusInEditor()` | `...`（仅编辑器） | 编辑器相关回调 |

#### Scene

`Scene` 是 `Node` 的子类，代表游戏中可运行的某个整体环境，由 `Director` 管理。

| 属性 | 类型 | 说明 |
|---|---|---|
| `globals` | SceneGlobals | 场景级渲染参数 |
| `renderScene` | RenderScene | 渲染层场景 |
| `autoReleaseAssets` | boolean | 场景切换后是否自动释放静态引用资源 |
| （其余继承 Node） | — | 名称、变换、层、事件等 |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Scene(name: string)` | 创建场景 |
| `destroy()` | `destroy(): void` | 销毁场景中所有节点（不销毁资源） |
| `addComponent(...)` | `...: Component \| null` | 仅为兼容保留 |
| （其余继承 Node） | — | walk、事件、变换、组件查找等 |

#### Prefab

预制资源类（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `data` | Node（any） | Prefab 的根节点 |
| `optimizationPolicy` | number | 实例化优化策略，默认 AUTO |
| `persistent` | boolean | 是否常驻，默认 false |
| `OptimizationPolicy`（静态） | `{ AUTO, MULTI_INSTANCE, SINGLE_INSTANCE }` | 优化策略枚举 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `compileCreateFunction()` | `compileCreateFunction(): void` | 将预制数据转换为最小化代码（首次实例化前自动调用） |
| `createNode(cb)` | `createNode(cb: (err, node) => void): void` | 由预制创建节点 |
| `validate()` / `onLoaded()` / `initDefault(uuid?)` | `...` | 校验 / 加载回调 / 默认初始化 |
| （继承 Asset） | `uuid/refCount/nativeUrl/nativeAsset/addRef/decRef/...` | 资源生命周期 |

#### Layers

节点层管理器。层数据以掩码方式存储于 `Node.layer`，用于射线检测、物理碰撞和自定义脚本逻辑，支持「包含式」与「排除式」两种检测。

| 方法 | 签名 | 说明 |
|---|---|---|
| `addLayer(name, bitNum)` | `static addLayer(name: string, bitNum: number): void` | 添加新层（用户可编辑 0-19 位） |
| `deleteLayer(bitNum)` | `static deleteLayer(bitNum: number): void` | 移除一个层 |
| `makeMaskInclude(includes)` | `static makeMaskInclude(includes: number[]): number` | 创建包含式层检测掩码 |
| `makeMaskExclude(excludes)` | `static makeMaskExclude(excludes: number[]): number` | 创建排除式层检测掩码 |
| `nameToLayer(name)` | `static nameToLayer(name: string): number` | 层名称 -> 层索引 |
| `layerToName(bitNum)` | `static layerToName(bitNum: number): string` | 层数值 -> 层名称 |
| `init()` | `static init(): void` | 初始化 |

---

## 6. 2D 渲染

> 官方简介：2D 渲染相关的组件与资源。模块页：`2d-rendering-readme`。

### 6.1 类清单

| 类 | 说明 |
|---|---|
| `Sprite` | 渲染精灵组件，支持九宫格、填充（FILLED）等渲染方式 |
| `SpriteFrame` | 精灵帧资源，支持矩形、九宫格、网格三种类型 |
| `SpriteAtlas` | 精灵图集资源类 |
| `Label` | 文字标签组件（系统字体 / 位图字体 / TTF） |
| `LabelAtlas` / `BitmapFont` / `Font` / `TTFFont` | 字体相关资源类 |
| `LabelOutline` | 描边效果组件（只能用于系统字体） |
| `LabelShadow` | 阴影效果组件（系统字体 / ttf 字体） |
| `Graphics` | 自定义图形类 |
| `Mask` | 遮罩组件 |
| `RichText` | 富文本组件 |
| `HtmlTextParser` | Html 文本解析器 |
| `Canvas` | UI 根节点，提供对齐视窗与屏幕适配策略（UI 视距范围 -999 ~ 1000） |
| `RenderRoot2D` | 2D 对象数据收集的入口节点 |
| `UIRenderer` | 所有支持渲染的 UI 组件的基类 |
| `UIComponent` | 旧的 2D 渲染组件基类（请用 UIRenderer 替代） |
| `UITransform` | UI 变换组件（宽高、锚点、坐标变换） |
| `UIOpacity` | UI 透明度设置组件 |
| `UIStaticBatch` | UI 静态合批组件（子节点须为精灵和文本） |
| `UIMeshRenderer` | UI 模型基础组件（UI 中放置模型或粒子时必须添加） |
| `SpriteRenderer` | 2D 渲染基础组件，提供精灵渲染在 3D 空间中的能力 |
| `DynamicAtlasManager` | 动态合图管理器（主要用于 UI 渲染） |
| `StencilManager` | 模板状态管理器 |
| `MeshBuffer` / `MeshRenderData` / `QuadRenderData` / `RenderData` / `UIDrawBatch` / `LRUCache` | 渲染数据内部类 |
| `UI` | UI 渲染流程 |

### 6.2 接口 / 枚举 / 变量

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `IAssembler` / `IAssemblerManager` / `IRenderData` / `IUV` | 渲染装配接口 |
| 接口 | `IHtmlTextParserResultObj` / `IHtmlTextParserStack` | HTML 文本解析结果 / 栈 |
| 接口 | `ISpriteFrameInitInfo` | 初始化 SpriteFrame 资源的对象接口 |
| 枚举 | `CacheMode` | 文本图集缓存类型 |
| 枚举 | `HorizontalTextAlignment` / `VerticalTextAlignment` | 文本水平 / 垂直对齐类型 |
| 枚举 | `Overflow` | 文本溢出行为类型 |
| 枚举 | `SpriteFrameEvent` | 精灵帧事件 |
| 枚举 | `InstanceMaterialType` | 实例化材质的着色器属性类型 |
| 变量 | `dynamicAtlasManager` | DynamicAtlasManager 单例 |
| 变量 | `vfmt` / `vfmtPosColor` / `vfmtPosUvColor` / `vfmtPosUvColor4B` / `vfmtPosUvTwoColor` / `vfmtPosUvTwoColor4B` | 各类顶点格式定义 |
| 变量 | `spriteAssembler` / `labelAssembler` / `graphicsAssembler` | 渲染装配器实例 |
| 变量 | `BASELINE_RATIO` / `MIDDLE_RATIO` | 文本基线比例常量 |
| 函数 | `getAttributeStride` / `getComponentPerVertex` | 顶点属性步进 / 分量数 |
| 函数 | `fragmentText` / `safeMeasureText` / `getSymbolAt` / `getSymbolCodeAt` / `getSymbolLength` / `isUnicodeCJK` / `isUnicodeSpace` / `getBaselineOffset` | 文本排版辅助 |

### 6.3 重点类详解

#### Sprite

渲染精灵组件（继承 `UIRenderer`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | SpriteType | 精灵渲染类型 |
| `trim` | boolean | 是否使用裁剪模式 |
| `spriteFrame` | null \| SpriteFrame | 精灵帧 |
| `spriteAtlas` | null \| SpriteAtlas | 精灵图集 |
| `sizeMode` | SizeMode | 精灵尺寸调整模式 |
| `grayscale` | boolean | 是否灰度渲染 |
| `fillType` / `fillStart` / `fillRange` / `fillCenter` | FillType / number / number / Vec2 | 填充参数（仅 FILLED 有效） |
| 静态 `Type` / `SizeMode` / `FillType` / `EventType` | 枚举 | 类型常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `changeSpriteFrameFromAtlas(name)` | `changeSpriteFrameFromAtlas(name: string): void` | 使用图集中的其他精灵 |
| `changeMaterialForDefine()` | `changeMaterialForDefine(): void` | （deprecated） |

#### Label

文字标签组件（继承 `UIRenderer`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `string` | string | 标签显示的文本内容 |
| `useSystemFont` | boolean | 是否使用系统字体 |
| `fontSize` / `fontFamily` / `font` | number / string / null \| Font | 字体相关 |
| `lineHeight` / `spacingX` | number | 行高 / 字符间距（BMFont） |
| `horizontalAlign` / `verticalAlign` | HorizontalTextAlignment / VerticalTextAlignment | 对齐方式 |
| `overflow` | Overflow | 溢出处理方式 |
| `enableWrapText` | boolean | 是否自动换行 |
| `cacheMode` | CacheMode | 文本缓存模式（仅系统字体） |
| `enableOutline` / `outlineWidth` / `outlineColor` | boolean / number / Rect | 描边参数 |
| `enableShadow` / `shadowOffset` / `shadowColor` / `shadowBlur` | boolean / Vec2 / Rect / number | 阴影参数 |
| `isUnderline` / `isItalic` / `isBold` | boolean | 下划线 / 斜体 / 加粗 |
| `underlineHeight` | number | 下划线高度 |
| `actualFontSize` | number | SHRINK 模式下实际渲染字号 |
| 静态 `VerticalAlign` / `Overflow` / `HorizontalAlign` / `CacheMode` | 枚举 | 类型常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `updateRenderData()` | `updateRenderData(): void` | 更新渲染数据 |
| `destroyLetterTexture()` | `destroyLetterTexture(): void` | 销毁字符纹理 |
| `destroyTtfSpriteFrame()` | `destroyTtfSpriteFrame(): void` | 销毁 TTF 精灵帧 |

#### Graphics

自定义图形类。`[未获取]`：官方详情页返回 404。

#### Mask

遮罩组件。`[未获取]`：官方详情页返回 404。

#### SpriteFrame

精灵帧资源（继承 `Asset`），支持矩形、九宫格、网格。

| 属性 | 类型 | 说明 |
|---|---|---|
| `texture` | TextureBase | 贴图对象资源 |
| `width` / `height` | number | 像素宽 / 高 |
| `rect` | Size | 纹理矩形区域 |
| `pivot` | Vec2 | 生成 mesh 时本地坐标原点 |
| `offset` | Vec2 | 精灵帧偏移量 |
| `originalSize` | Size | 修剪前的原始大小 |
| `packable` | boolean | 是否允许参与自动合图 |
| `rotated` | boolean | 是否旋转 |
| `flipUVX` / `flipUVY` | boolean | 翻转 UV |
| `insetTop` / `insetRight` / `insetLeft` / `insetBottom` | number | 九宫格内边距 |
| `mesh` | null \| Mesh | mesh 信息（使用前调用 ensureMeshData） |
| `vertices` | null \| IVertices | 网格精灵帧顶点 |
| `uv` / `uvSliced` | number[] / IUV[] | 矩形 / 九宫格顶点 UV |
| `atlasUuid` | string | 图集 uuid |

| 方法 | 签名 | 说明 |
|---|---|---|
| `textureLoaded()` | `textureLoaded(): boolean` | 是否已加载 |
| `setRect(rect)` / `getRect()` | `...` | 设置 / 获取纹理矩形 |
| `setRotated(rotated)` / `isRotated()` | `...` | 设置 / 获取旋转 |
| `setOriginalSize(size)` / `getOriginalSize()` | `...` | 设置 / 获取原始大小 |
| `setOffset(offset)` / `getOffset()` | `...` | 设置 / 获取偏移 |
| `reset()` | `reset(): void` | 重置数据 |
| `getSamplerInfo()` / `getGFXSampler()` | `...` | 获取采样器 |
| `getGFXTexture()` / `getHash()` | `...` | 获取 GFX 贴图 / 哈希 |
| `ensureMeshData()` | `ensureMeshData(): void` | 确保 mesh 可用 |
| `clone()` | `clone(): SpriteFrame` | 克隆 |
| `checkRect(rect)` | `checkRect(rect: Rect): void` | 判断矩形是否越界 |

#### UIOpacity

UI 透明度设置组件，影响后续渲染节点的透明度。

| 属性 | 类型 | 说明 |
|---|---|---|
| `opacity` | number | 透明度 |

#### UITransform

UI 变换组件，提供宽高、锚点、尺寸和坐标变换 API。

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` / `height` | number | 组件宽 / 高 |
| `contentSize` | Readonly\<Size\> | 内容尺寸 |
| `anchorX` / `anchorY` / `anchorPoint` | number / number / Readonly\<Vec2\> | 锚点 |
| `cameraPriority` | number | 查找被渲染相机的渲染优先级 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setContentSize(size)` | `setContentSize(size: Size): void` | 设置原始大小 |
| `setAnchorPoint(point)` | `setAnchorPoint(point: Vec2): void` | 设置锚点百分比 |
| `isHit(point)` / `hitTest(point)` | `(point: Vec2): boolean` | UI / 屏幕空间点击测试 |
| `getComputeAABB()` | `getComputeAABB(): Readonly\<AABB\>` | 世界空间 AABB |
| `getBoundingBoxToWorld()` | `getBoundingBoxToWorld(): Readonly\<Rect\>` | 世界坐标系包围盒 |
| `getBoundingBoxTo(target)` | `getBoundingBoxTo(target: Node): Rect` | 目标节点坐标系包围盒 |
| `getBoundingBox()` | `getBoundingBox(): Rect` | 父节点坐标系包围盒 |
| `convertToWorldSpaceAR(point)` | `convertToWorldSpaceAR(point: Vec3): Vec3` | 节点坐标转世界坐标 |
| `convertToNodeSpaceAR(worldPoint)` | `convertToNodeSpaceAR(worldPoint: Vec3): Vec3` | 世界坐标转节点坐标 |

#### LabelOutline

字体描边组件（只能用于系统字体）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` | number | （deprecated，since v3.8.2，改用 outlineWidth）描边宽度 |
| `color` | Readonly\<Color\> | （deprecated，since v3.8.2，改用 outlineColor）描边颜色 |

#### LabelShadow

字体阴影组件（系统字体 / ttf 字体）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `offset` | Vec2 | （deprecated，since v3.8.2，改用 shadowOffset）阴影偏移 |
| `color` | Readonly\<Color\> | （deprecated，since v3.8.2，改用 shadowColor）阴影颜色 |
| `blur` | number | （deprecated，since v3.8.2，改用 shadowBlur）阴影模糊 |

#### UIStaticBatch

UI 静态合批组件。放在需静态合批的根节点上，子节点须为精灵和文本，子节点下不要放置 Mask、Graphics、UI 模型或粒子。

| 属性 | 类型 | 说明 |
|---|---|---|
| `drawBatchList` | DrawBatch2D[] | 静态合批数据列表 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `markAsDirty()` | `markAsDirty(): void` | 重新采集数据，下一帧开始使用固定数据渲染 |

---

## 7. 3D 渲染

> 官方简介：3D 渲染相关的组件与资源。模块页：`3d-rendering-readme`。

### 7.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `createMesh` / `Mesh` / `MeshRenderer` / `Light` / `utils` | 网格创建 / 网格 / 渲染器 / 光照 / 工具命名空间 |

| 类 | 说明 |
|---|---|
| `Camera` | 相机组件，决定渲染视角、投影、裁剪、清除、曝光等 |
| `Mesh` | 网格资源，可含多个子网格，提供顶点、索引等数据 |
| `MeshRenderer` | 通用模型渲染的网格渲染器组件 |
| `SkinnedMeshRenderer` | 蒙皮网格渲染器组件 |
| `SkinnedMeshBatchRenderer` | 蒙皮网格合批组件（合并共享骨骼的蒙皮网格） |
| `SkeletalAnimation` | 骨骼动画组件（预烘焙 / 实时计算模式，提供 socket 挂点） |
| `SkeletalAnimationState` | 骨骼动画状态控制对象 |
| `Skeleton` | 骨骼资源（记录关节路径与绑定姿势矩阵） |
| `SkelAnimDataHub` | 骨骼动画数据转换中心 |
| `Socket` | 骨骼动画挂点 |
| `Light` | 光源组件基类 |
| `DirectionalLight` | 平行光源（一个场景仅允许一个实时平行光） |
| `RangedDirectionalLight` | 范围平行光（一个场景可多个） |
| `PointLight` / `SphereLight` / `SpotLight` | 点 / 球面 / 聚光灯光源 |
| `ReflectionProbe` / `ReflectionProbeManager` | 反射探针组件 / 管理器 |
| `LOD` / `LODGroup` | LOD 层级及组组件 |
| `BatchingUtility` | 3D 模型静态合批工具类 |
| `MeshUtils` | 网格工具类（创建网格） |

### 7.2 接口 / 枚举 / 函数

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `ICreateInfo` | 网格创建信息 |
| 接口 | `IDynamicInfo` / `IDynamicStruct` | 动态网格信息 / 结构 |
| 接口 | `IStruct` | 网格结构 |
| 接口 | `ISubMesh` | 子网格 |
| 接口 | `IVertexBundle` | 顶点块（交错排列的顶点属性） |
| 接口 | `Morph` / `MorphTarget` / `SubMeshMorph` | 网格形变数据结构 |
| 接口 | `IBufferView` / `IMeshCluster` / `IOptions` | 缓冲视图 / 网格簇 / 选项 |
| 枚举 | `ReflectionProbeType` | 反射探针类型 |
| 函数 | `createMesh` / `readMesh` / `readBuffer` / `writeBuffer` / `mapBuffer` / `toPPM` | 网格与缓冲读写工具 |

### 7.3 重点类详解

#### Camera

相机组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `visibility` | number | 可见性掩码（当前相机可见的节点层级集合） |
| `projection` | CameraProjection | 投影类型 |
| `priority` | number | 渲染优先级（值越小越先渲染） |
| `fov` / `fovAxis` | number / CameraFovAxis | 视角大小 / 固定轴向 |
| `orthoHeight` | number | 正交模式视角高度 |
| `near` / `far` | number | 近 / 远裁剪距离 |
| `rect` | Rect | 最终渲染到屏幕的视口位置和大小 |
| `clearFlags` / `clearColor` / `clearDepth` / `clearStencil` | ClearFlagBit / Readonly\<Color\> / number / number | 缓冲清除设置 |
| `targetTexture` | null \| RenderTexture | 渲染输出目标（空则直接渲染到屏幕） |
| `screenScale` | number | 内部缓冲尺寸缩放值 |
| `usePostProcess` / `postProcess` | boolean / null \| PostProcess | 后处理开关 / 组件 |
| `aperture` / `iso` / `shutter` | CameraAperture / number / CameraISO | 曝光参数 |
| `trackingType` / `cameraType` | CameraType | 相机类型 |
| `camera` | Camera | 渲染场景中的相机对象 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `worldToScreen(worldPos)` | `worldToScreen(worldPos: Vec3): Vec3` | 世界坐标转屏幕坐标（左下角原点） |
| `screenToWorld(screenPos)` | `screenToWorld(screenPos: Vec3): Vec3` | 屏幕坐标转世界坐标 |
| `screenPointToRay(screenPos)` | `screenPointToRay(screenPos: Vec3): geomUtils.Ray` | 屏幕坐标转射线 |
| `convertToUINode(worldPoint, uiNode)` | `convertToUINode(worldPoint: Vec3, uiNode: Node): Vec3` | 世界坐标转 UI 本地节点坐标 |

#### MeshRenderer

通用模型渲染的网格渲染器组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `mesh` | null \| Mesh | 网格数据 |
| `model` | null \| Model | 渲染场景中的模型对象 |
| `shadowCastingMode` | number | 阴影投射方式 |
| `receiveShadow` | number | 是否接受阴影 |
| `shadowBias` / `shadowNormalBias` | number | 阴影偏移 |
| `enableMorph` | boolean | 是否启用形变网格渲染 |
| `bakeSettings` | ModelBakeSettings | 全局光照烘焙配置 |
| `isGlobalStandardSkinObject` | boolean | 是否为全局 4s 标准模型组件 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setWeight(subMeshIndex, shapeIndex, weight)` / `getWeight(...)` | `...` | 设置 / 获取形变目标权重 |
| `setWeights(subMeshIndex, weights)` | `setWeights(subMeshIndex: number, weights: number[]): void` | 设置所有形变目标权重 |
| `setInstancedAttribute(name, value)` | `setInstancedAttribute(name: string, value): void` | 设置实例化属性 |
| `onUpdateReceiveDirLight(b)` | `onUpdateReceiveDirLight(b: boolean): void` | 是否接收平行光 |
| `updateReflectionProbeId(id)` / `updateReflectionProbeBlendWeight(weight)` / `updateProbeCubemap(texture)` 等 | `...` | 反射探针相关更新 |

#### SkinnedMeshRenderer

蒙皮网格渲染器组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `skinningRoot` | null \| Node | 骨骼根节点引用 |
| `skeleton` | null \| Skeleton | 骨骼资源 |
| `associatedAnimation` | null \| SkeletalAnimation | 关联的骨骼动画组件 |
| `model` | null \| SkinningModel \| BakedSkinningModel | 渲染模型对象 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `uploadAnimation(animation)` | `uploadAnimation(animation: AnimationClip): void` | 上传骨骼动画数据 |
| `setUseBakedAnimation(baked)` | `setUseBakedAnimation(baked: boolean): void` | 设置预烘焙动画模式 |

#### Material

材质资源（继承 `Asset`），封装 EffectAsset 与 shader 的 uniform 参数。

| 属性 | 类型 | 说明 |
|---|---|---|
| `technique` | number | 当前 technique 索引 |
| `passes` | Pass[] | 当前使用的 pass 数组 |
| `parent` | null \| Material | 父材质 |
| `owner` | null \| RenderableComponent | 归属渲染组件 |
| `hash` | number | 材质哈希 |
| `effectName` / `effectAsset` | string / null \| EffectAsset | 使用的 Effect 资源 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setProperty(name, val, passIdx?)` | `setProperty(name: string, val, passIdx?: number): void` | 设置 uniform（每帧更新建议用 setUniform） |
| `getProperty(name, passIdx?)` | `getProperty(name: string, passIdx?: number): any` | 获取 uniform 值 |
| `resetUniforms()` | `resetUniforms(): void` | 重置所有 uniform 为默认值 |
| `reset(info?)` / `initialize(info)` | `...` | 重置 / 初始化材质 |
| `recompileShaders(macros, passIdx?)` | `recompileShaders(macros: MacroRecord, passIdx?: number): void` | 用预处理宏重编译 shader |
| `overridePipelineStates(states, passIdx?)` | `overridePipelineStates(states: RenderStateChangeSet, passIdx?: number): void` | 重载管线状态 |
| `copy(material, info?)` | `copy(material: Material, info?): void` | 复制材质 |

#### Mesh

网格资源（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `struct` | Mesh.IStruct | 网格结构 |
| `renderingSubMeshes` | RenderingSubMesh[] | 渲染子网格 |
| `data` | Uint8Array | 网格数据 |
| `hash` | number | 哈希值 |
| `allowDataAccess` | boolean | 数据是否可存取 |
| `morphRendering` | null \| MorphRendering | 形变渲染数据 |
| `jointBufferIndices` | number[] | 关节索引集合 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `initialize(info)` | `initialize(info: ICreateInfo): void` | 网格初始化 |
| `reset()` / `assign(createInfo)` / `releaseData()` | `...` | 重置 / 赋值 / 释放数据 |
| `merge(mesh)` / `validateMergingMesh(mesh)` | `...: boolean` | 合并 / 验证可合并 |
| `readIndices(subMeshIndex)` / `readAttribute(...)` / `readAttributeFormat(...)` / `copyIndices(...)` / `copyAttribute(...)` | `...` | 读取子网格数据 |
| `getBoneSpaceBounds(subMeshIndex)` | `getBoneSpaceBounds(subMeshIndex: number): Readonly\<AABB\>` | 骨骼空间 AABB |
| `updateSubMesh(subMeshIndex)` | `updateSubMesh(subMeshIndex: number): void` | 更新动态子网格 |
| `destroyRenderingMesh()` | `destroyRenderingMesh(): void` | 释放 GPU 资源 |

#### Model

`[未获取]`：官方详情页返回 404（Model 属渲染场景内部对象）。

#### Light

光源组件基类。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | LightType | 光源类型 |
| `color` | Readonly\<Color\> | 光源颜色 |
| `useColorTemperature` / `colorTemperature` | boolean / number | 色温开关 / 色温 |
| `visibility` | number | 光照可见性掩码 |
| `staticSettings` | StaticLightSettings | 静态灯光设置 |
| `baked` | boolean | 是否被烘焙 |

#### LODGroup

多细节层次（LOD）组件，根据物体在屏幕占比切换不同精度 LOD。

| 属性 | 类型 | 说明 |
|---|---|---|
| `lodCount` | number | LOD 层级数 |
| `LODs` | readonly LOD[] | LOD 数组 |
| `objectSize` | number | 当前包围盒大小 |
| `localBoundaryCenter` | Readonly\<Vec3\> | 模型 AABB 中心点 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setLOD(index, lod)` / `getLOD(index)` | `...` | 设置 / 获取指定 LOD |
| `insertLOD(index, lod)` / `eraseLOD(index)` | `...` | 插入 / 删除 LOD |
| `forceLOD(lodIndex)` / `forceLODs(lodIndexArray)` | `...`（仅编辑器） | 强制指定 LOD |
| `resetObjectSize()` / `recalculateBounds()` | `...` | 重置 / 重算包围盒 |

---

## 8. 用户界面（UI）

> 官方简介：Cocos Creator 中强大而灵活的 UI 系统。模块页：`ui-readme`。

### 8.1 类清单

| 类 | 说明 |
|---|---|
| `Button` | 按钮组件（支持颜色 / 精灵 / 缩放过渡与事件绑定） |
| `Canvas` | 画布 / UI 根节点（继承 RenderRoot2D，锚点仅支持 (0.5, 0.5)） |
| `Layout` | 容器组件，自动对子节点统一排版 |
| `ScrollView` | 滚动视图组件 |
| `ScrollBar` | 滚动条组件 |
| `PageView` / `PageViewIndicator` | 页面视图 / 页面标记组件 |
| `EditBox` | 输入框组件 |
| `ProgressBar` | 进度条组件 |
| `Slider` | 滑动器组件 |
| `Toggle` / `ToggleContainer` | 复选框 / ToggleGroup 管理器 |
| `RichText` | 富文本组件 |
| `Widget` | 对齐适配组件（相对父节点边距） |
| `SafeArea` | 异形屏安全区域适配组件 |
| `BlockInputEvents` | 输入拦截组件（阻止输入穿透到下层节点） |
| `SubContextView` | 微信小游戏开放数据域视窗控制 |
| `UICoordinateTracker` | 3D 节点坐标转 UI 节点坐标组件 |
| `ViewGroup` / `View` / `UIReorderComponent` | 视图与排序相关组件 |
| `ResolutionPolicy` | 适配策略根策略类 |
| 变量 | `view` / `widgetManager` | 全局视图单例 / widget 管理器 |

### 8.2 重点类详解

#### Button

按钮组件，可被按下或点击，支持 Transition 过渡与事件绑定。

| 属性 | 类型 | 说明 |
|---|---|---|
| `transition` | Transition | 过渡方式（NONE / COLOR / SPRITE / SCALE） |
| `interactable` | boolean | 是否响应事件 |
| `target` | Node | 过渡目标节点 |
| `normalColor` / `pressedColor` / `hoverColor` / `disabledColor` | Readonly\<Color\> | 各状态颜色 |
| `normalSprite` / `pressedSprite` / `hoverSprite` / `disabledSprite` | null \| SpriteFrame | 各状态精灵 |
| `duration` | number | 过渡时长 |
| `zoomScale` | number | 缩放过渡目标值 |
| `clickEvents` | Component.EventHandler[] | 点击事件列表 |
| 静态 `Transition` / `EventType` | 枚举 | 过渡类型 / 事件类型 |

#### Canvas

UI 根节点（继承 `RenderRoot2D`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `cameraComponent` | null \| Camera | 与此 canvas 对齐的相机 |
| `alignCanvasWithScreen` | boolean | 是否使用屏幕对齐画布 |
| `renderMode` | number（deprecated） | 请用 priority 控制相机重叠 |

#### Layout

自动布局容器。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | LayoutType | 布局类型 |
| `resizeMode` | LayoutResizeMode | 缩放模式 |
| `spacingX` / `spacingY` | number | 水平 / 垂直间距 |
| `padding` / `paddingTop/Right/Left/Bottom` | number | 内边距 |
| `horizontalDirection` / `verticalDirection` | LayoutHorizontalDirection / LayoutVerticalDirection | 排列方向 |
| `startAxis` | LayoutAxisDirection | 起始轴（仅 GRID 有效） |
| `constraint` / `constraintNum` | LayoutConstraint / number | 布局约束 |
| `cellSize` | Readonly\<Size\> | 格子大小（仅 GRID 有效） |
| `alignHorizontal` / `alignVertical` / `affectedByScale` | boolean | 对齐 / 缩放影响 |
| 静态 `Type` / `ResizeMode` / `Constraint` / `AxisDirection` / `HorizontalDirection` / `VerticalDirection` | 枚举 | 类型常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `updateLayout(force?)` | `updateLayout(force?: boolean): void` | 立即执行布局更新 |

#### ScrollView

滚动视图组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `content` | null \| Node | 可滚动内容节点 |
| `horizontal` / `vertical` | boolean | 水平 / 垂直滚动开关 |
| `horizontalScrollBar` / `verticalScrollBar` | null \| ScrollBar | 滚动条 |
| `inertia` | boolean | 滚动惯性 |
| `elastic` | boolean | 是否允许越界回弹 |
| `brake` | number | 惯性停止快慢（0 永不停，1 立刻停） |
| `bounceDuration` | number | 回弹持续时间 |
| `scrollEvents` | Component.EventHandler[] | 滚动事件回调 |
| `cancelInnerEvents` | boolean | 滚动时是否取消子节点触摸事件 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `scrollTo(anchor, timeInSecond?, attenuated?)` | `scrollTo(anchor: Vec2, timeInSecond?, attenuated?): void` | 滚动到指定百分比 |
| `scrollToTop/Left/Right/Bottom/TopLeft/TopRight/BottomLeft/BottomRight(...)` | `...: void` | 滚动到边界位置 |
| `scrollToPercentHorizontal/PercentVertical(percent, time?, attenuated?)` | `...: void` | 滚动到百分比 |
| `scrollToOffset(offset, time?, attenuated?)` | `scrollToOffset(offset: Vec2, timeInSecond?, attenuated?): void` | 滚动到偏移位置 |
| `stopAutoScroll()` | `stopAutoScroll(): void` | 停止自动滚动 |
| `isScrolling()` / `isAutoScrolling()` | `(): boolean` | 拖拽 / 惯性滚动状态 |
| `getScrollOffset()` | `getScrollOffset(): Vec2` | 获取滚动偏移 |
| `getMaxScrollOffset()` | `getMaxScrollOffset(): Vec2` | 最大可滚动偏移 |

#### EditBox

输入框组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `string` | string | 输入内容（空时显示占位符） |
| `placeholder` / `placeholderLabel` | string / null \| Label | 占位符 |
| `textLabel` | null \| Label | 输入文本 Label |
| `maxLength` | number | 最大字符数 |
| `inputMode` | InputMode | 输入模式（ANY 多行 / 其它单行） |
| `inputFlag` | InputFlag | 输入标志（密码 / 首字母大写） |
| `returnType` | KeyboardReturnType | 移动端回车按钮样式 |
| `backgroundImage` | null \| SpriteFrame | 背景图 |
| `textChanged` / `editingReturn` / `editingDidEnded` / `editingDidBegan` | Component.EventHandler[] | 编辑事件回调 |
| 静态 `KeyboardReturnType` / `InputMode` / `InputFlag` / `EventType` | 枚举 | 类型常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setFocus()` / `focus()` | `...: void` | 获得焦点 |
| `blur()` | `blur(): void` | 失去焦点 |
| `isFocused()` | `isFocused(): boolean` | 是否获得焦点（仅 Web） |

#### ProgressBar

进度条组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `barSprite` | null \| Sprite | 显示进度的 Sprite |
| `mode` | Mode | 进度条模式 |
| `progress` | number | 进度值（0-1） |
| `totalLength` | number | 总长度 |
| `reverse` | boolean | 是否反向变化 |
| 静态 `Mode` | 枚举 | 模式常量 |

#### Slider

滑动器组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `handle` | null \| Sprite | 滑块按钮 |
| `direction` | number | 滑动方向 |
| `progress` | number | 进度值（0-1） |
| `slideEvents` | Component.EventHandler[] | 滑动事件回调 |
| 静态 `Direction` | 枚举 | 方向常量 |

#### Toggle

Toggle 是 CheckBox，与 ToggleContainer 一起使用时可变为 RadioButton（继承 `Button`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `isChecked` | boolean | 是否选中 |
| `checkMark` | null \| Sprite | 选中状态显示图片 |
| `checkEvents` | Component.EventHandler[] | 点击事件列表 |
| 静态 `EventType` | 枚举 | toggle 事件类型 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setIsCheckedWithoutNotify(value)` | `setIsCheckedWithoutNotify(value: boolean): void` | 设置选中但不触发回调 |
| `playEffect()` | `playEffect(): void` | （deprecated） |

#### ToggleContainer

ToggleGroup，非可见组件，管理一组 Toggle 的行为，同一时刻只能有一个处于选中状态。

| 属性 | 类型 | 说明 |
|---|---|---|
| `toggleItems` | Toggle[] | 管理的 toggle 数组引用（只读） |
| `allowSwitchOff` | boolean | 是否允许全部取消选中 |
| `checkEvents` | Component.EventHandler[] | 点击事件列表 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `notifyToggleCheck(toggle, emitEvent?)` | `notifyToggleCheck(toggle: Toggle, emitEvent?: boolean): void` | 刷新 toggle 状态 |
| `ensureValidState()` | `ensureValidState(): void` | 确保状态有效 |
| `anyTogglesChecked()` | `anyTogglesChecked(): boolean` | 是否有任意选中 |
| `activeToggles()` | `activeToggles(): Toggle[]` | 当前激活的 toggle 数组 |

#### RichText

`[未获取]`：官方详情页返回 404（总览页说明为"富文本组件"）。

#### Widget

对齐适配组件，自动调整节点相对父节点的坐标与宽高。

| 属性 | 类型 | 说明 |
|---|---|---|
| `target` | null \| Node | 对齐目标（只能是父节点，空表示父节点） |
| `alignMode` | AlignMode | 对齐模式（何时刷新） |
| `alignFlags` | number | 对齐标志位 |
| `isAlignTop/Bottom/Left/Right/HorizontalCenter/VerticalCenter` | boolean | 各方向对齐开关 |
| `isAbsoluteTop/...` | boolean | 偏移 / 边距是否为绝对像素 |
| `top/bottom/left/right/horizontalCenter/verticalCenter` | number | 各方向边距 / 偏移值 |
| `isStretchWidth` / `isStretchHeight` | boolean | 是否拉伸 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `updateAlignment()` | `updateAlignment(): void` | 立刻执行对齐 |
| `setDirty()` | `setDirty(): void` | 标记需要重新对齐 |

#### PageView

页面视图组件（继承 `ScrollView`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `sizeMode` | SizeMode | 页面大小类型 |
| `direction` | PageViewDirection | 滚动类型 |
| `scrollThreshold` | number | 翻页临界值 |
| `autoPageTurningThreshold` | number | 快速滑动翻页临界值 |
| `pageTurningSpeed` | number | 翻页所需时间 |
| `pageTurningEventTiming` | number | PageTurning 事件发送时机 |
| `curPageIdx` | number | 当前页面索引 |
| `indicator` | null \| PageViewIndicator | 页面指示器 |
| `pageEvents` | Component.EventHandler[] | 页面事件回调 |
| 静态 `SizeMode` / `Direction` / `EventType` | 枚举 | 类型常量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `addPage(page)` / `insertPage(page, index)` / `removePage(page)` / `removePageAtIndex(index)` / `removeAllPages()` | `...: void` | 页面增删 |
| `scrollToPage(idx, timeInSecond?)` | `scrollToPage(idx: number, timeInSecond?: number): void` | 滚动到指定页 |
| `setCurrentPageIndex(index)` / `getCurrentPageIndex()` | `...` | 设置 / 获取当前页 |
| `getPages()` | `getPages(): Node[]` | 获取所有页面 |

#### SafeArea

将节点布局适配到异形屏安全区域内（内部通过 `sys.getSafeAreaRect()` + Widget 实现）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `symmetric` | boolean | 是否对称适配 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `updateArea()` | `updateArea(): void` | 立即适配安全区域 |

#### BlockInputEvents

拦截所属节点尺寸内的所有输入事件，防止输入穿透到下层节点。无 API 接口，直接添加即可生效。

#### ViewGroup

`[未获取]`：官方页面未提供用途描述与公开成员（仅继承 Component）。

---

## 9. 图形后端抽象（gfx）

> 官方简介：图形后端抽象类，用于抹平不同渲染后端 API 差异。模块页：`gfx-readme`。

### 9.1 命名空间

| 命名空间 | 说明 |
|---|---|
| `gfx` | 图形后端抽象类集合（通过 `import { gfx } from 'cc'` 访问） |

### 9.2 类清单（核心部分）

| 类 | 说明 |
|---|---|
| `gfx.Device` | GFX 设备，后端资源工厂与命令提交入口 |
| `gfx.DeviceManager` / `DeviceCaps` / `DeviceInfo` / `DeviceOptions` | 设备管理器 / 能力 / 信息 / 选项 |
| `gfx.Buffer` | GFX 缓冲（顶点 / 索引 / uniform 数据） |
| `gfx.Texture` | GFX 纹理 |
| `gfx.Sampler` | GFX 采样器 |
| `gfx.Shader` | GFX 着色器 |
| `gfx.RenderPass` | GFX 渲染过程 |
| `gfx.Swapchain` | GFX 交换链 |
| `gfx.Queue` | GFX 队列 |
| `gfx.CommandBuffer` | GFX 命令缓冲 |
| `gfx.InputAssembler` | GFX 输入汇集器 |
| `gfx.PipelineState` / `PipelineLayout` | 管线状态 / 管线布局 |
| `gfx.DescriptorSet` / `DescriptorSetLayout` | 描述符集 / 布局 |
| `gfx.Framebuffer` | 帧缓冲 |
| `gfx.GeneralBarrier` / `TextureBarrier` / `BufferBarrier` | 内存屏障 |
| `gfx.BlendState` / `DepthStencilState` / `RasterizerState` / `DynamicStates` | 渲染状态 |
| `gfx.Attribute` | 顶点属性描述 |
| `gfx.Uniform` / `UniformBlock` / `UniformSampler` / `UniformTexture` / `UniformBuffer` 等 | uniform 系列 |
| `gfx.IndirectBuffer` / `Viewport` / `Rect` / `Extent` / `Offset` / `Size` / `Color` | 绘制辅助结构 |
| `gfx.MemoryStatus` / `FormatInfo` / `BindingMappingInfo` | 设备信息结构 |
| `gfx.EmptyDevice` | 空设备 |
| `gfx.GFXObject` | GFX 基类对象 |
| 变量 `deviceManager` | 设备管理器单例 |

### 9.3 枚举（常用）

| 枚举 | 说明 |
|---|---|
| `gfx.API` | 图形 API 类型 |
| `gfx.Format` | 纹理格式 |
| `gfx.TextureType` / `TextureUsageBit` / `TextureFlagBit` | 纹理类型 / 用途 / 标志位 |
| `gfx.BufferUsageBit` / `BufferFlagBit` / `MemoryUsageBit` | 缓冲用途 / 标志 / 内存用途 |
| `gfx.Filter` / `Address` | 纹理过滤 / 寻址模式 |
| `gfx.SampleCount` | 采样数 |
| `gfx.PrimitiveMode` | 图元模式 |
| `gfx.CullMode` / `PolygonMode` / `ShadeModel` | 剔除 / 多边形 / 着色模型 |
| `gfx.BlendFactor` / `BlendOp` / `ColorMask` | 混合因子 / 运算 / 颜色掩码 |
| `gfx.ComparisonFunc` / `StencilOp` / `StencilFace` | 深度比较 / 模板操作 / 模板面 |
| `gfx.LoadOp` / `StoreOp` | 加载 / 存储操作 |
| `gfx.AccessFlagBit` / `BarrierType` / `MemoryAccessBit` | 内存屏障相关 |
| `gfx.ClearFlagBit` | 清除标志位 |
| `gfx.DynamicStateFlagBit` | 动态状态标志位 |
| `gfx.Feature` / `FormatFeatureBit` | 设备特性 / 格式特性 |
| `gfx.QueueType` / `CommandBufferType` / `PassType` / `PipelineBindPoint` | 队列 / 命令缓冲 / 通道 / 管线绑定点 |
| `gfx.VsyncMode` / `SurfaceTransform` / `DescriptorType` / `QueryType` | 垂直同步 / 表面变换 / 描述符 / 查询 |
| `gfx.Type` / `FormatType` | 数据类型 / 格式类型 |

### 9.4 重点类详解

#### gfx.Device

GFX 设备，后端资源工厂与命令提交入口。

| 属性 | 类型 | 说明 |
|---|---|---|
| `gfxAPI` | gfx.API | 当前使用的渲染 API |
| `queue` | gfx.Queue | 默认队列 |
| `commandBuffer` | gfx.CommandBuffer | 默认命令缓冲 |
| `capabilities` | gfx.DeviceCaps | 设备能力 |
| `bindingMappingInfo` | gfx.BindingMappingInfo | 绑定槽位映射 |
| `memoryStatus` | gfx.MemoryStatus | 内存状态 |
| `numDrawCalls` / `numInstances` / `numTris` | number | 绘制统计 |
| `vendor` / `renderer` | string | 厂商 / 渲染器描述 |
| `canvas`（静态） | HTMLCanvasElement | 关联的画布 |
| `swapchainFormat` | gfx.Format | 当前 swapchain 格式 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `initialize(info)` | `initialize(info: Readonly\<DeviceInfo\>): boolean \| Promise\<boolean\>` | 初始化设备 |
| `hasFeature(feature)` | `hasFeature(feature: Feature): boolean` | 是否具备特性 |
| `createBuffer(info)` / `createTexture(info)` / `createShader(info)` / `createSampler(info)` | `...` | 创建各类资源 |
| `createSwapchain(info)` / `createFramebuffer(info)` / `createRenderPass(info)` / `createQueue(info)` | `...` | 创建交换链 / 帧缓冲 / 渲染过程 / 队列 |
| `createPipelineState(info)` / `createPipelineLayout(info)` / `createInputAssembler(info)` | `...` | 创建管线与输入汇集器 |
| `createDescriptorSetLayout(info)` / `createDescriptorSet(info)` / `createCommandBuffer(info)` | `...` | 创建描述符集与命令缓冲 |
| `getGeneralBarrier(info)` / `getTextureBarrier(info)` / `getBufferBarrier(info)` | `...` | 创建内存屏障 |
| `getSampler(info)` | `getSampler(info: Readonly\<SamplerInfo\>): Sampler` | 创建采样器 |
| `getFormatFeatures(format)` | `getFormatFeatures(format: Format): FormatFeatureBit` | 格式支持程度 |
| `getMaxSampleCount(format, usage, flags)` | `...: SampleCount` | 最大采样数 |
| `acquire(swapchains)` / `present()` | `...` | 获取交换链缓冲 / 上屏 |
| `flushCommands(cmdBuffs)` / `enableAutoBarrier(en)` | `...` | 命令提交 / 自动 barrier |
| `copyBuffersToTexture(...)` / `copyTextureToBuffers(...)` / `copyTexImagesToTexture(...)` | `...` | 缓冲与纹理拷贝 |
| `destroy()` | `destroy(): void` | 销毁设备 |

#### gfx.Buffer

GFX 缓冲。

| 属性 | 类型 | 说明 |
|---|---|---|
| `usage` | gfx.BufferUsageBit | 缓冲用途 |
| `memUsage` | gfx.MemoryUsageBit | 内存用途 |
| `flags` | gfx.BufferFlagBit | 标志位 |
| `stride` / `size` / `count` | number | 步长 / 大小 / 条目数 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `update(buffer, size?)` | `update(buffer: Readonly\<Uint8Array\>, size?: number): void` | 更新缓冲内容 |
| `resize(size)` | `resize(size: number): void` | 重置缓冲大小 |
| `initialize(info)` / `destroy()` | `...` | 初始化 / 销毁 |

#### gfx.Texture

GFX 纹理。

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` / `height` / `depth` | number | 纹理宽 / 高 / 深 |
| `format` | gfx.Format | 纹理格式 |
| `type` | gfx.TextureType | 纹理类型 |
| `usage` | gfx.TextureUsageBit | 用途 |
| `flags` | gfx.TextureFlagBit | 标志位 |
| `samples` | gfx.SampleCount | 采样数 |
| `levelCount` / `layerCount` | number | mip 层级 / 数组层数 |
| `isTextureView` | boolean | 是否为纹理视图 |
| `info` / `viewInfo` | Readonly\<TextureInfo\> / Readonly\<TextureViewInfo\> | 纹理信息 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getLevelCount(width, height)` | `static getLevelCount(width: number, height: number): number` | 计算 mip 层级数 |
| `resize(width, height)` | `resize(width: number, height: number): void` | 重置纹理大小 |
| `getTextureHandle()` | `getTextureHandle(): number` | 获取纹理句柄 |
| `initialize(info)` / `destroy()` | `...` | 初始化 / 销毁 |

#### gfx.Sampler

GFX 采样器，封装纹理采样状态。

| 属性 | 类型 | 说明 |
|---|---|---|
| `info` | Readonly\<SamplerInfo\> | 采样器信息 |
| `hash` | number | 采样器哈希 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `unpackFromHash(hash)` | `static unpackFromHash(hash: number): SamplerInfo` | 从哈希还原采样器信息 |
| `computeHash(info)` | `static computeHash(info: Readonly\<SamplerInfo\>): number` | 计算采样器哈希 |

#### gfx.Shader

GFX 着色器。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string | 着色器名称 |
| `stages` | gfx.ShaderStage[] | 着色器阶段 |
| `attributes` | gfx.Attribute[] | 顶点属性 |
| `blocks` | gfx.UniformBlock[] | uniform 块 |
| `samplers` | gfx.UniformSampler[] | 采样器 uniform |

| 方法 | 签名 | 说明 |
|---|---|---|
| `initialize(info)` / `destroy()` | `...` | 初始化 / 销毁 |

#### gfx.RenderPass

GFX 渲染过程，描述渲染通道的颜色 / 深度附件与子通道。

| 属性 | 类型 | 说明 |
|---|---|---|
| `colorAttachments` | readonly gfx.ColorAttachment[] | 颜色附件 |
| `depthStencilAttachment` | null \| Readonly\<DepthStencilAttachment\> | 深度模板附件 |
| `subPasses` | readonly gfx.SubpassInfo[] | 子通道 |
| `hash` | number | 哈希 |

#### gfx.Swapchain

GFX 交换链，管理呈现到屏幕的帧缓冲。

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` / `height` | number | 交换链宽 / 高 |
| `surfaceTransform` | gfx.SurfaceTransform | 表面变换 |
| `colorTexture` / `depthStencilTexture` | gfx.Texture | 颜色 / 深度模板缓冲 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `resize(width, height, surfaceTransform)` | `resize(width, height, surfaceTransform): void` | 调整尺寸与表面变换 |
| `initialize(info)` / `destroy()` | `...` | 初始化 / 销毁 |

---

## 10. 渲染管线（render-pipeline）

> 官方简介：RenderPipeline 用于控制场景的渲染流程，包括光照管理、物体剔除、渲染物体排序、渲染目标切换等。模块页：`render-pipeline-readme`。

### 10.1 命名空间

| 命名空间 | 说明 |
|---|---|
| `pipeline` | 渲染管线相关 |
| `rendering` | 渲染图（render graph）相关 |
| `postProcess` | 后处理相关 |

### 10.2 类清单（核心部分）

| 类 | 说明 |
|---|---|
| `RenderPipeline` | 渲染管线对象，决定引擎对场景下所有渲染对象的完整渲染流程（继承 Asset） |
| `RenderFlow` | 渲染流程，是管线的一个子过程，将任务派发到渲染阶段执行 |
| `RenderStage` | 渲染阶段，实质上的渲染执行者 |
| `ForwardPipeline` / `ForwardFlow` / `ForwardStage` | 前向渲染管线 / 流程 / 阶段 |
| `DeferredPipeline` / `MainFlow` / `LightingStage` / `GbufferStage` | 延迟渲染管线 / 流程 / 光照阶段 / GBuffer 阶段 |
| `ShadowFlow` / `ShadowStage` | 阴影贴图绘制流程 / 阶段 |
| `ReflectionProbeFlow` / `ReflectionProbeStage` | 反射探针渲染流程 / 阶段 |
| `PostProcess` / `PostProcessSetting` / `PostProcessBuilder` / `PostProcessStage` | 后处理组件 / 设置 / 构建器 / 阶段 |
| `Bloom` / `BloomPass` / `BloomStage` | 泛光后处理 |
| `ColorGrading` / `ColorGradingPass` | 颜色分级后处理 |
| `DOF` / `DofPass` | 景深后处理 |
| `FSR` / `FSRPass` | FSR 超分辨率后处理 |
| `TAA` / `TAAPass` | 时间抗锯齿后处理 |
| `FxaaPass` | FXAA 抗锯齿通道 |
| `HBAO` | HBAO 环境光遮蔽 |
| `BlitScreen` / `BlitScreenPass` | 全屏 blit 后处理 |
| `BasePass` / `ForwardPass` / `ForwardTransparencyPass` / `SkinPass` / `ShadowPass` / `SettingPass` / `PostFinalPass` / `ForwardFinalPass` 等 | 各类渲染通道 |
| `GeometryRenderer` | 几何渲染器 |
| `PipelineSceneData` / `PipelineStateManager` / `PipelineEventProcessor` / `PipelineCapabilities` | 管线数据 / 状态管理 / 事件处理 / 能力 |
| `DebugView` | 渲染调试控制类 |
| `InstancedBuffer` / `PipelineInputAssemblerData` | 实例化缓冲 / 输入汇集器数据 |
| `UBOCamera` / `UBOGlobal` / `UBOLocal` / `UBOForwardLight` / `UBODeferredLight` / `UBOShadow` / `UBOCSM` / `UBOSkinning` / `UBOMorph` / `UBOSH` / `UBOWorldBound` / `UBOUILocal` 等 | 各类 UBO 绑定布局 |

### 10.3 枚举 / 接口 / 函数

| 类别 | 名称 | 说明 |
|---|---|---|
| 枚举 | `PipelineType` | 管线类型（不同管线具有不同硬件能力与接口） |
| 枚举 | `PipelineEventType` | 管线事件类型 |
| 枚举 | `RenderPassStage` / `RenderPriority` | 预设渲染阶段 / 优先级 |
| 枚举 | `LightingMode` / `AccessType` / `AttachmentType` / `ClearValueType` / `ResourceDimension` / `ResourceFlags` / `ResourceResidency` / `ResolveFlags` / `QueueHint` / `TaskType` / `UpdateFrequency` / `ParameterType` / `SceneFlags` / `SetIndex` / `ModelLocalBindings` / `PipelineGlobalBindings` / `SubpassCapabilities` | 渲染图相关枚举（rendering） |
| 枚举 | `UBOCameraEnum` / `UBOGlobalEnum` / `UBOLocalEnum` / `UBOForwardLightEnum` / `UBOShadowEnum` 等 | 各 UBO 偏移枚举 |
| 接口 | `Pipeline` / `PipelineBuilder` / `RenderNode` / `RenderPassBuilder` / `RenderQueueBuilder` / `RenderSubpassBuilder` / `ComputePassBuilder` / `ComputeQueueBuilder` / `ComputeSubpassBuilder` / `SceneBuilder` / `Setter` / `IRenderPass` / `IRenderQueueDesc` / `IRenderBatch` / `IRenderObject` / `IRenderNode` 等 | 渲染图构建接口（rendering） |
| 接口 | `BasicPipeline` / `BasicRenderPassBuilder` / `BasicMultisampleRenderPassBuilder` / `MultisampleRenderPassBuilder` / `MultisampleRenderSubpassBuilder` | 基础管线构建接口 |
| 函数 | `createDefaultPipeline` / `createCustomPipeline` / `getCustomPipeline` / `setCustomPipeline` / `getPassID` / `getPhaseID` / `getSubpassID` / `getDefaultShadowTexture` / `getShadowMapSampler` | 管线创建与 ID 获取 |
| 函数 | `supportsR16HalfFloatTexture` / `supportsR32FloatTexture` / `supportsRGBA16HalfFloatTexture` / `supportsRGBA32FloatTexture` | 设备浮点贴图能力查询 |
| 函数 | `loadCopyPair/saveCopyPair`、`loadLightInfo/saveLightInfo` 等 | 渲染图归档读写（rendering） |
| 变量 | `globalDescriptorSetLayout` / `localDescriptorSetLayout` / `bindingMappingInfo` | 描述符集布局与绑定映射 |
| 变量 | `PIPELINE_FLOW_FORWARD` / `PIPELINE_FLOW_MAIN` / `PIPELINE_FLOW_SHADOW` / `PIPELINE_FLOW_SMAA` / `PIPELINE_FLOW_TONEMAP` | 渲染流程名 |
| 变量 | `UNIFORM_DIFFUSEMAP_BINDING` / `UNIFORM_SHADOWMAP_BINDING` / `UNIFORM_SPRITE_TEXTURE_BINDING` / `UNIFORM_REFLECTION_PROBE_*` 等 | 各类 uniform 绑定点常量 |
| 变量 | `CAMERA_DEFAULT_MASK` / `CAMERA_EDITOR_MASK` / `MODEL_ALWAYS_MASK` | 相机 / 模型掩码 |

### 10.4 重点类详解

#### ForwardPipeline

前向渲染管线。

| 属性 | 类型 | 说明 |
|---|---|---|
| `postRenderPass` | null \| RenderPass | 后处理渲染通道 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `initialize(info)` | `initialize(info: IRenderPipelineInfo): boolean` | 初始化管线 |
| `activate(swapchain)` | `activate(swapchain: Swapchain): boolean` | 激活管线 |
| `destroy()` | `destroy(): boolean` | 销毁管线 |

#### RenderPipeline

渲染管线基类（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tag` | number | 管线标签 |
| `shadingScale` | number | 着色缩放比例 |
| `device` | Device | 图形设备 |
| `flows` | RenderFlow[] | 渲染流程列表 |
| `pipelineSceneData` | PipelineSceneData | 管线场景数据 |
| `pipelineUBO` | PipelineUBO | 管线 UBO |
| `globalDSManager` | GlobalDSManager | 全局描述符集管理器 |
| `macros` | MacroRecord | 全局宏定义 |
| `constantMacros` | string | 常量宏字符串 |
| `descriptorSetLayout` / `descriptorSet` | DescriptorSetLayout / DescriptorSet | 描述符集 |
| `commandBuffers` | CommandBuffer[] | 命令缓冲列表 |
| `clusterEnabled` / `bloomEnabled` | boolean | cluster 光照 / Bloom 开关 |
| `geometryRenderer` | null \| GeometryRenderer | （deprecated，请用 camera.geometryRenderer） |

| 方法 | 签名 | 说明 |
|---|---|---|
| `render(cameras)` | `render(cameras: Camera[]): void` | 对指定相机执行所有渲染流程 |
| `setMacroString/Int/Bool(name, value)` | `...` | 设置宏 |
| `getMacroString/Int/Bool(name)` | `...` | 获取宏 |
| `generateViewport(camera, out?)` / `generateScissor(camera, out?)` / `generateRenderArea(camera, out)` | `...` | 生成视口 / 裁剪 / 渲染区域 |
| `getRenderPass(clearFlags, fbo)` | `getRenderPass(clearFlags, fbo): RenderPass` | 获取渲染通道 |
| `createRenderPass(clearFlags, colorFmt, depthFmt)` | `...` | 创建渲染通道 |
| `newFramebufferByRatio(dyingFramebuffer)` | `...: Framebuffer` | 按比例创建帧缓冲 |
| `onGlobalPipelineStateChanged()` | `onGlobalPipelineStateChanged(): void` | 全局管线状态变化回调 |
| `on/once/off/emit/removeAll/targetOff` | `...` | 事件监听（PipelineEventType） |
| `initialize(info)` / `activate(swapchain)` / `destroy()` | `...` | 生命周期 |

#### RenderFlow

渲染流程，是渲染管线的一个子过程，将渲染任务派发到所有渲染阶段中执行。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tag` | number | 流程标签 |
| `name` | string | 流程名 |
| `priority` | number | 优先级 |
| `stages` | RenderStage[] | 渲染阶段列表 |
| `pipeline` | RenderPipeline | 所属管线 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `render(camera)` | `render(camera: Camera): void` | 对指定视图按顺序执行所有渲染阶段 |
| `initialize(info)` / `activate(pipeline)` / `destroy()` | `...` | 生命周期 |

#### RenderStage

渲染阶段，是实质上的渲染执行者，负责收集渲染数据并执行渲染。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tag` | number | 阶段标签 |
| `name` | string | 阶段名 |
| `priority` | number | 优先级 |
| `enabled` | boolean | 是否启用 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `render(camera)` | `render(camera: Camera): void` | 渲染函数 |
| `initialize(info)` / `activate(pipeline, flow)` / `destroy()` | `...` | 生命周期 |

#### ForwardStage

前向渲染阶段（继承 `RenderStage`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `initInfo`（静态） | IRenderStageInfo | 默认初始化信息 |
| `additiveInstanceQueues` | RenderInstancedQueue[] | 叠加混合实例化队列 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `addRenderInstancedQueue(queue)` / `removeRenderInstancedQueue(queue)` | `...` | 实例化队列管理 |
| `render(camera)` / `initialize(info)` / `activate(pipeline, flow)` / `destroy()` | `...` | 渲染与生命周期 |

---

## 11. 资源（asset）

> 官方简介：资源是游戏中的重要组成部分，Cocos Creator 支持导入不同类型的资源。模块页：`asset-readme`。

### 11.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `AssetManager` | 资源管理模块（同时为类，单例通过 `assetManager` 访问） |
| `EffectAsset` | Effect 资源命名空间 |

| 类 | 说明 |
|---|---|
| `Asset` | 资源基类 |
| `AssetManager` | 管理资源的加载、释放等（单例 `assetManager`） |
| `Bundle` | 资源包，可加载、预加载、释放包内资源 |
| `Cache` | 缓存数据结构 |
| `CacheManager` | 非 WEB 平台缓存管理器（单例 `cacheManager`） |
| `CCLoader` | 资源加载管理器（单例 `loader`） |
| `DependUtil` | 管理资源依赖列表（单例 `dependUtil`） |
| `Downloader` | 管理所有下载过程（单例 `downloader`） |
| `Parser` | 解析已下载文件（单例 `parser`） |
| `Pipeline` | 加载管线，通过一系列阶段完成加载任务 |
| `RequestItem` | 请求相关信息集合 |
| `Task` | 任务，管线中运行的最小数据单位 |
| `EffectAsset` | Effect 资源（材质实例初始化模板） |
| `ImageAsset` | 图像资源，可创建任意 TextureBase |
| `Texture2D` | 二维贴图资源 |
| `TextureCube` | 立方体贴图资源 |
| `RenderTexture` | 渲染贴图（Camera / Canvas 的渲染目标） |
| `RenderingSubMesh` | 渲染子网格（含全部顶点数据） |
| `Material` | 材质资源类 |
| `BufferAsset` | 内部为内存缓冲的资源 |
| `JsonAsset` | JSON 资源（加载后直接解析为对象） |
| `TextAsset` | 文本资源 |
| `JavaScript` / `TypeScript` / `Script` | 脚本资源 |
| `SceneAsset` | 场景资源类 |
| `BuiltinResMgr` | 内置资源管理器 |
| 变量 | `assetManager` / `resources` / `loader` / `builtinResMgr` / `AssetLibrary` / `url` | 全局单例与工具 |

### 11.2 重点类详解

#### Asset

资源基类（继承 `CCObject` 与 `IEventified`）。可能需要重写 `createNode`、`_nativeAsset` 的 get/set、`Object._serialize` / `_deserialize`。

| 属性 | 类型 | 说明 |
|---|---|---|
| `uuid` | string | 资源 UUID |
| `refCount` | number | 引用数量 |
| `nativeUrl` | string | 目标平台资源 URL |
| `nativeAsset` | any | 基础资源（由加载器初始化） |
| `loaded` | boolean（deprecated） | 是否已加载 |
| `isDefault` | boolean（deprecated） | 是否为默认资源 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `addRef()` | `addRef(): Asset` | 增加引用，阻止自动释放 |
| `decRef(autoRelease?)` | `decRef(autoRelease?: boolean): Asset` | 减少引用，为 0 时自动释放 |
| `createNode(callback)` | `createNode(callback: CreateNodeCallback): void` | 用资源创建节点 |
| `deserialize(data)` | `static deserialize(data: any): any` | 反序列化 |
| `serialize()` / `toString()` | `...` | 序列化 / 字符串表示 |
| `onLoaded()` / `initDefault(uuid?)` | `...`（deprecated） | 加载回调 / 默认初始化 |

#### AssetManager

资源管理器（单例 `assetManager`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `instance`（静态） | AssetManager | 全局单例 |
| `resources` / `main` | Bundle | 内置 resources / main 包 |
| `pipeline` / `fetchPipeline` | Pipeline | 正常加载管线 / 下载管线 |
| `transformPipeline` | Pipeline | URL 转换器 |
| `presets` | Record | 可选参数预设集 |
| `downloader` / `parser` / `dependUtil` / `cacheManager` | 各管理器 | 下载 / 解析 / 依赖 / 缓存 |
| `cacheAsset` | boolean | 是否缓存已加载资源 |
| `bundles` / `assets` | ICache | 已加载 bundle / 资源集合 |
| `force` | boolean | 是否强制加载 |
| `allowImageBitmap` | boolean | 是否优先使用 image bitmap |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getBundle(name)` | `getBundle(name: string): Bundle` | 获取已加载分包 |
| `loadBundle(nameOrUrl, options?, onComplete?)` | `...: void` | 加载资源包 |
| `loadAny(requests, options, onProgress, onComplete)` | `...: void` | 通用加载接口 |
| `preloadAny(requests, options?, onProgress?, onComplete?)` | `...: void` | 通用预加载（只下载不解析） |
| `loadRemote(url, options?, onComplete?)` | `...: void` | 加载远程资源 |
| `releaseAsset(asset)` | `releaseAsset(asset: Asset): void` | 释放资源及其依赖 |
| `releaseAll()` | `releaseAll(): void` | 释放所有资源 |
| `removeBundle(bundle)` | `removeBundle(bundle: Bundle): void` | 移除包 |
| `init()` | `init(): void` | 初始化（引擎启动时自动调用） |

#### resources

`import { resources } from "cc";`，一个 `Bundle` 实例，管理 `assets/resources` 目录下的资源。

#### Bundle

资源包（`AssetManager.Bundle`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string | bundle 名称 |
| `deps` | string[] | 依赖包 |
| `base` | string | 根路径 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `load(paths, type?, onProgress?, onComplete?)` | `...: void` | 通过相对路径加载资源 |
| `loadDir(dir, type?, onProgress?, onComplete?)` | `...: void` | 加载文件夹内所有资源 |
| `loadScene(sceneName, options?, onProgress?, onComplete?)` | `...: void` | 加载场景 |
| `preload(paths, type?, onProgress?, onComplete?)` / `preloadDir(dir, ...)` / `preloadScene(sceneName, ...)` | `...: void` | 预加载系列 |
| `release(path, type?)` / `releaseAll()` | `...` | 释放资源 |
| `get(path, type?)` | `get(path, type?): Asset` | 获取已缓存资源 |
| `getAssetInfo(uuid)` / `getInfoWithPath(path)` / `getDirWithPath(dir)` / `getSceneInfo(sceneName)` | `...` | 资源信息查询 |
| `init(config)` | `init(config): void` | 初始化 |

#### Texture2D

二维贴图资源（继承 `SimpleTexture`），每个 Mipmap 层级为一张 ImageAsset。

| 属性 | 类型 | 说明 |
|---|---|---|
| `mipmaps` | ImageAsset[] | 各层级 Mipmap |
| `image` | ImageAsset \| null | 0 级 Mipmap |
| `width` / `height` / `mipmapLevel` | number（继承） | 尺寸 / 层级 |
| `isCompressed` / `isAlphaAtlas` | boolean（继承） | 压缩格式 / 压缩透明通道 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `reset(info)` | `reset(info: ITexture2DCreateInfo): void` | 重置尺寸 / 格式 / mipmap 层级 |
| `uploadData(source, level?, arrayIndex?)` / `updateImage(source, level?, arrayIndex?)` / `updateMipmaps(...)` | `...`（继承） | 上传图像数据 |
| `setWrapMode` / `setMipRange` / `setMipFilter` / `setFilters` / `setAnisotropy` | `...`（继承） | 采样参数设置 |
| `getPixelFormat` / `getGFXTexture` / `getGFXSampler` / `getHash` | `...`（继承） | 获取属性 |
| `releaseTexture()` / `destroy()` | `...` | 释放 / 销毁 |

#### ImageAsset

图像资源（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `width` / `height` | number | 像素宽 / 高 |
| `format` | PixelFormat | 像素格式 |
| `isCompressed` | boolean | 是否压缩格式 |
| `data` | HTMLCanvasElement \| HTMLImageElement \| ImageBitmap \| ArrayBufferView \| null | 图像数据 |
| `extnames`（静态） | string[] | 支持扩展名 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `reset(data)` | `reset(data: ImageSource): void` | 重置原始图像源 |
| `mergeCompressedTextureMips(files)` | `static mergeCompressedTextureMips(files): Uint8Array` | 合并压缩纹理 mip 数据 |

#### JsonAsset / TextAsset

- `JsonAsset`：JSON 资源，`json` 属性为解析后的对象。
- `TextAsset`：文本资源，`text` 属性为文本内容。

#### Pipeline / Downloader

- `Pipeline(name, funcs)`：加载管线，每个管道接收 `(task, done)`；提供 `append` / `insert` / `remove` / `async` / `sync`。
- `Downloader`：管理所有下载过程（单例 `downloader`），提供 `register(type, handler)`、`download(id, url, type, options, onComplete)` 等，属性含 `maxConcurrency`、`maxRetryCount`、`retryInterval`、`maxRequestsPerFrame`、`remoteServerAddress` 等。

---

## 12. 输入系统（input）

> 官方简介：输入系统是玩家与游戏之间交互的桥梁，开发者可获取玩家在设备上的所有操作并做出反馈。模块页：`input-system-readme`。

### 12.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `Input` | 输入相关命名空间 |
| `SystemEvent` | 系统事件命名空间 |

| 类 | 说明 |
|---|---|
| `Input` | 管理所有输入事件（触摸、鼠标、加速计、手柄、6DOF、头戴显示器、键盘），通过 `input` 获取实例 |
| `Event` | 所有事件对象的基类 |
| `EventKeyboard` | 键盘事件 |
| `EventMouse` | 鼠标事件 |
| `EventTouch` | 触摸事件 |
| `Touch` | 封装触点相关信息 |
| `Acceleration` | 重力传感器各轴数据 |
| `EventAcceleration` | 加速计事件 |
| `EventGamepad` | 手柄事件 |
| `EventHandle` | 6DOF 手柄事件 |
| `EventHMD` | 头戴显示器事件 |
| `EventHandheld` | 手持设备事件 |
| `SystemEvent` | 系统事件（按键与重力感应），通过 `systemEvent` 获取实例 |
| 枚举 | `KeyCode` | 按键码 |
| 枚举 | `SystemEventType` | 系统事件类型 / 节点事件类型 |
| 变量 | `input` / `systemEvent` | 输入单例 / 系统事件单例 |

### 12.2 重点类详解

#### Input

管理所有输入事件。

| 方法 | 签名 | 说明 |
|---|---|---|
| `on(eventType, callback, target?)` | `on<K>(eventType: EventType, callback, target?): 回调` | 注册输入事件回调 |
| `once(eventType, callback, target?)` | `once<K>(...): 回调` | 注册单次回调 |
| `off(eventType, callback?, target?)` | `off<K>(...): void` | 注销回调 |
| `setAccelerometerEnabled(isEnable)` | `setAccelerometerEnabled(isEnable: boolean): void` | 启用 / 禁用加速度计 |
| `setAccelerometerInterval(ms)` | `setAccelerometerInterval(intervalInMileSeconds: number): void` | 设置加速度计间隔（毫秒） |
| `getTouchCount()` | `getTouchCount(): number` | 当前 touch 数量 |
| `getTouch(touchID)` | `getTouch(touchID: number): Touch \| undefined` | 按 ID 获取 touch |
| `getAllTouches()` | `getAllTouches(): Touch[]` | 获取所有 touch |

常用事件注册示例：`input.on(InputEventType.TOUCH_START, this.onTouchStart, this)`。

#### EventKeyboard

键盘事件（继承 `Event`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `keyCode` | KeyCode | 按键码枚举值 |
| `isPressed` | boolean | 按键是否被按下 |
| `windowId` | number | 触发窗口 ID |
| `rawEvent` | KeyboardEvent（deprecated） | 原始 DOM 事件 |

#### EventMouse

鼠标事件（继承 `Event`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `windowId` | number | 系统窗口 ID |
| `movementX` / `movementY` | number | UI 坐标系下的移动距离 |
| `preventSwallow` | boolean | 是否阻止事件被节点吞噬 |
| 静态 `BUTTON_LEFT` / `BUTTON_MIDDLE` / `BUTTON_RIGHT` / `BUTTON_4`~`BUTTON_8` | number | 鼠标按键常量（0/1/2/3~7） |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setButton(button)` / `getButton()` | `...` | 设置 / 获取鼠标按键 |
| `setLocation(x, y)` / `getLocation(out?)` / `getLocationInView(out?)` / `getUILocation(out?)` | `...` | 位置相关 |
| `getLocationX/Y` / `getUILocationX/Y` | `(): number` | 各轴坐标 |
| `getDelta(out?)` / `getDeltaX/Y` / `getUIDelta(out?)` | `...` | 位移 |
| `setScrollData(x, y)` / `getScrollX()` / `getScrollY()` | `...` | 滚轮 |

#### EventTouch

触摸事件（继承 `Event`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `touch` | Touch \| null | 当前触点对象 |
| `simulate` | boolean | 是否模拟触摸 |
| `windowId` | number | 系统窗口 ID |
| `preventSwallow` | boolean | 是否阻止事件被节点吞噬 |
| 静态 `MAX_TOUCHES` | number（=5） | 最大触点数量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getLocation(out?)` / `getLocationInView(out?)` / `getUILocation(out?)` | `...` | 触点位置 |
| `getStartLocation(out?)` / `getUIStartLocation(out?)` | `...` | 触点落下位置 |
| `getPreviousLocation(out?)` | `...` | 上一次位置 |
| `getDelta(out?)` / `getDeltaX/Y` / `getUIDelta(out?)` | `...` | 位移 |
| `getTouches()` | `getTouches(): Touch[]` | 有变动的触摸点 |
| `getAllTouches()` | `getAllTouches(): Touch[]` | 所有触摸点 |
| `getID()` | `getID(): number \| null` | 触点标识 ID |
| `setLocation(x, y)` | `setLocation(x: number, y: number): void` | 设置触点位置 |

#### Touch

封装触点相关信息。`[未获取]`：详情页内容未能完整抓取；常用数据通过 `EventTouch` 的 `getLocation` / `getID` / `getDelta` 等方法间接获取。

---

## 13. 原生接口（native）

> 官方简介：该模块提供由原生绑定出来的 JavaScript 接口，包括文件、反射接口等。模块页：`native-interface-readme`。
> 说明：全局作用域下的 `jsb` 对象已废弃，推荐使用 `cc` 模块导出的 `native` 对象（是前者的子集）。使用前需通过 `NATIVE` 宏判断平台支持。

```js
import { native } from 'cc';
import { NATIVE } from 'cc/env';
if (NATIVE) {
  native.reflection.callStaticMethod(...args);
}
```

### 13.1 命名空间 / 类清单

| 类别 | 名称 | 说明 |
|---|---|---|
| 命名空间 | `native.reflection` | 原生反射接口（调用 Objc / Java / ArkTs 静态方法） |
| 命名空间 | `native.fileUtils` | FileUtils，处理文件操作 |
| 命名空间 | `native.jsbBridgeWrapper` | 高级 API，用于调用 Objc / JAVA 方法 |
| 命名空间 | `native.bridge` | 不使用反射机制调用 / 监听 Objc / JAVA 事件 |
| 命名空间 | `native.zipUtils` / `native.process` | 解压工具 / 进程信息 |
| 命名空间 | `native.Manifest` / `native.EventAssetsManager` / `native.AssetsManager` | 热更新相关 |
| 类 | `native.Manifest` | 热更新清单类 |
| 类 | `native.EventAssetsManager` | 热更新事件类 |
| 类 | `native.AssetsManager` | 热更新管理器类 |
| 类 | `native.Downloader` | Downloader 任务下载类 |
| 类 | `native.DebugRenderer` | 屏幕调试文字渲染器 |
| 接口 | `native.DownloaderTask` / `native.DownloadTask` / `native.DownloaderHints` | 下载任务 / 提示接口 |
| 接口 | `native.ManifestAsset` / `native.DebugTextInfo` | 清单资源 / 调试文本接口 |
| 类型别名 | `native.OnNativeEventListener` | `(arg: string) => void` |
| 属性 | `native.adpf` | Android 热特性（仅 Android API 31+） |

### 13.2 常用函数

| 函数 | 签名 | 说明 |
|---|---|---|
| `native.saveImageData` | `saveImageData(data: Uint8Array, width: number, height: number, filePath: string): Promise<void>` | 保存图片到指定路径（配合 RenderTexture.readPixels） |
| `native.garbageCollect` | `garbageCollect(): void` | 触发垃圾回收 |
| `native.copyTextToClipboard` | `copyTextToClipboard(text: string): void` | 复制文本到剪贴板 |
| `native.reflection.callStaticMethod` | `callStaticMethod(className, methodName, methodSignature, ...parameters): any` | 调用原生静态方法 |

#### native.fileUtils 常用函数

| 函数 | 说明 |
|---|---|
| `fullPathForFilename(filename)` | 通过文件名获取绝对路径 |
| `getStringFromFile(filename)` | 读取文件字符串 |
| `readTextFile(filepath, onComplete)` / `readJsonFile(filepath, onComplete)` / `readDataFile(filepath, onComplete)` | 异步读取文本 / JSON / 二进制 |
| `isFileExist(path)` / `isDirectoryExist(path)` / `isAbsolutePath(path)` | 文件 / 目录 / 绝对路径判断 |
| `getFileSize(filepath)` / `getFileExtension(filePath)` / `getFileDir(filepath)` | 文件信息 |
| `writeStringToFile` / `writeDataToFile` / `writeToFile` | 写入文件 |
| `writeValueMapToFile` / `writeValueVectorToFile` | 写入 plist |
| `removeFile(path)` / `removeDirectory(path)` / `createDirectory(dirPath)` | 删除 / 创建 |
| `listFiles(dir)` / `listFilesRecursively(dir)` | 列出文件 |
| `getWritablePath()` / `setWritablePath(path)` | 可写目录 |
| `getSearchPaths()` / `setSearchPaths(paths)` / `addSearchPath(path)` / `getOriginalSearchPaths()` | 资源搜索路径 |
| `getDefaultResourceRootPath()` / `setDefaultResourceRootPath(path)` | 默认资源根目录 |
| `normalizePath(filepath)` | 标准化路径 |
| `purgeCachedEntries()` | 清除路径缓存 |

---

## 14. 性能监控（profiler）

> 官方简介：用于查看游戏运行时性能信息。模块页：`profiler-readme`。

### 14.1 类 / 变量

| 类别 | 名称 | 说明 |
|---|---|---|
| 类 | `Profiler` | 引擎内置性能分析器（继承 System），实时监控 FPS、绘制统计等 |
| 变量 | `profiler` | Profiler 全局单例（`import { profiler } from "cc"`） |

### 14.2 Profiler

| 属性 | 类型 | 说明 |
|---|---|---|
| `stats` | IProfilerState \| null | 引擎运行性能状态 |
| `digitsData` / `offsetData` | Float32Array | 数字 / 偏移数据 |
| `lastTime` | number | 时间记录 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `showStats()` / `hideStats()` | `...: void` | 显示 / 隐藏性能统计 |
| `isShowingStats()` | `isShowingStats(): boolean` | 是否正在显示 |
| `generateStats()` / `generateNode()` / `generateCanvas()` | `...: void` | 生成统计数据 / 节点 / 画布 |
| `beforeUpdate/afterUpdate` / `beforePhysics/afterPhysics` / `beforeDraw/afterRender/afterPresent` | `(): void` | 各阶段回调 |

---

## 15. 基础图元（primitive）

> 官方简介：一些可参数化生成的基础图元。模块页：`primitive-readme`。

### 15.1 命名空间 / 类 / 接口

| 类别 | 名称 | 说明 |
|---|---|---|
| 命名空间 | `Primitive` | 基础图元命名空间 |
| 命名空间 | `primitives` | 图元生成函数命名空间（`import { primitives } from "cc"`） |
| 类 | `Primitive` | 基础图形网格（继承 Mesh），可运行时构建基础网格 |
| 接口 | `IGeometry` / `IDynamicGeometry` / `IGeometryOptions` | 几何体信息 / 参数选项 |
| 接口 | `ICreateMeshOptions` / `ICreateDynamicMeshOptions` | 创建网格参数 |

### 15.2 生成函数（primitives）

| 函数 | 说明 |
|---|---|
| `primitives.box(options?)` | 生成立方体（中心在原点） |
| `primitives.capsule(radiusTop?, radiusBottom?, height?, opts?)` | 生成胶囊体 |
| `primitives.circle(options?)` | 生成单位圆 |
| `primitives.cone(radius?, height?, opts?)` | 生成圆锥 |
| `primitives.cylinder(...)` | 生成圆柱 |
| `primitives.plane(options?)` | 生成平面（XOZ 平面，Y 轴正方向） |
| `primitives.quad(options?)` | 生成单位四边形（宽高 1，中心在原点） |
| `primitives.sphere(radius?, opts?)` | 生成球 |
| `primitives.torus(radius?, tube?, opts?)` | 生成环面 |
| `primitives.applyDefaultGeometryOptions(options?)` | 应用默认几何参数 |
| `primitives.translate(geometry, offset)` / `primitives.scale(geometry, value)` | 平移 / 缩放几何体 |
| `primitives.wireframed(geometry)` | 转为线框模式（仅三角形拓扑） |

### 15.3 Primitive 类

基础图形网格（继承 `Mesh`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | number | 基础图形网格类型（PrimitiveType，默认 BOX） |
| `info` | Record\<string, number\> | 创建参数（在 onLoaded 前设置） |

| 方法 | 签名 | 说明 |
|---|---|---|
| 构造 | `Primitive(type?: PrimitiveType)` | 创建基础图形网格 |
| `onLoaded()` | `onLoaded(): void` | 根据 type 和 info 构建网格 |
| （继承 Mesh） | `initialize` / `reset` / `assign` / `merge` / `readAttribute` / `readIndices` / `destroy` 等 | 见 3D 渲染模块 Mesh |

---

## 16. 动画（animation）

> 官方简介：Cocos Creator 内置通用动画系统，实现基于关键帧的动画。支持位移、旋转、缩放和帧动画，还支持任意组件属性与自定义属性驱动，以及可编辑的时间曲线和移动轨迹编辑。模块页：`animation-readme`。

### 16.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `Animation` | 动画组件相关枚举（如 EventType） |
| `animation` | 动画模块命名空间（含轨道、路径、动画图等） |
| `AnimationClip` | 动画剪辑命名空间 |
| `AnimationClip._legacy` | 旧版（legacy）动画数据命名空间 |

| 类 | 说明 |
|---|---|
| `Animation` | 动画组件，管理动画状态与控制播放，存储剪辑，派发播放状态事件 |
| `AnimationClip` | 动画剪辑，数据分轨道、关键帧、曲线三层 |
| `AnimationController` | 将动画图应用到组件所在节点，可设置 / 查询动画图变量 |
| `AnimationManager` | 动画管理器（全局系统） |
| `AnimationState` | 动画状态，提供底层播放控制接口 |
| `AnimCurve` | 动画曲线 |
| `Track` | 轨道，描述动画目标的路径与动画方式 |
| `TrackPath` | 描述怎样寻址动画目标 |
| `RealTrack` / `VectorTrack` / `QuatTrack` / `ColorTrack` / `SizeTrack` / `ObjectTrack` | 各类属性轨道 |
| `RatioSampler` | 比例采样器 |
| `StateMachineComponent` | 状态机组件 |
| `MorphWeightValueProxy` / `MorphWeightsValueProxy` / `MorphWeightsAllValueProxy` | 形变权重曲线值代理工厂 |
| `UniformProxyFactory` | 材质 Uniform 曲线值代理工厂 |
| `AnimationClipLegacyData` | 旧版动画剪辑数据 |
| `EventInfo` | 动画事件信息 |
| 变量 | `CubicSplineQuatValue` / `CubicSplineVec2Value` / `CubicSplineVec3Value` / `CubicSplineVec4Value` | 三次样条值构造器（deprecated，v3.5 起引擎私有） |

### 16.2 接口 / 枚举 / 函数

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `AnimationGraphRunTime` / `AnimationGraphVariantRunTime` | 动画图运行时表示 |
| 接口 | `ClipStatus` / `MotionStateStatus` / `TransitionStatus` | 动画运行状态 |
| 接口 | `IEvent`（AnimationClip.IEvent） | 动画事件接口 |
| 接口 | `ILerpable` / `IValueProxy` / `IValueProxyFactory` | 可插值 / 曲线值代理 / 代理工厂 |
| 接口 | `ICustomTargetPath` / `LegacyClipCurve` 等 | 自定义路径 / 旧版曲线结构（deprecated） |
| 枚举 | `VariableType` | 动画图变量类型 |
| 函数 | `computeRatioByType` / `sampleAnimationCurve` / `getPathFromRoot` / `getWorldTransformUntilRoot` | 动画计算辅助 |
| 类型别名 | `animation.Value` = `number \| string \| boolean` | 动画图变量值 |
| 类型别名 | `animation.Value_experimental` | 实验性变量值类型 |
| 类型别名 | `animation.TargetPath` / `PropertyPath`（deprecated） | v3.3 起改用 TrackPath |

### 16.3 重点类详解

#### Animation

动画组件（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `defaultClip` | AnimationClip | 默认剪辑（不在 clips 中会自动加入） |
| `clips` | AnimationClip[] | 管理的剪辑列表 |
| `playOnLoad` | boolean | 启动时是否自动播放默认剪辑 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play(name?)` | `play(name?: string)` | 立即切换到指定动画状态 |
| `stop()` / `pause()` / `resume()` | `...` | 停止 / 暂停 / 恢复所有状态与切换 |
| `crossFade(name, duration?)` | `crossFade(name: string, duration?: number)` | 平滑切换到指定动画状态 |
| `getState(name)` | `getState(name: string)` | 获取指定动画状态 |
| `createState(clip, name?)` | `createState(clip: AnimationClip, name?: string)` | 用剪辑创建动画状态 |
| `addClip(clip, name?)` / `removeClip(clip, force?)` / `removeState(name)` | `...` | 剪辑增删 |
| `on/once/off(type: AnimationStateEventType, callback, target?)` | `...` | 动画状态事件注册 |
| `emit(type, ...args)` | `...` | 派发事件 |

#### AnimationClip

动画剪辑资源（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `duration` | number | 动画周期（秒） |
| `sample` | number | 动画帧率（仅编辑器用） |
| `speed` | number | 播放速度 |
| `wrapMode` | WrapMode | 循环模式 |
| `tracksCount` | number | 轨道数量 |
| `tracks` | 可迭代对象 | 轨道迭代器 |
| `keys` | 数组 | 曲线引用的所有时间轴 |
| `events` | IEvent[] | 动画事件数据 |
| `curves` / `data` | 数组 / 对象 | 曲线与数据 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `createWithSpriteFrames(spriteFrames, sample)` | `static createWithSpriteFrames(spriteFrames: SpriteFrame[], sample: number)` | 用序列帧创建动画剪辑 |
| `addTrack(track)` / `removeTrack(index)` / `getTrack(index)` / `clearTracks()` | `...` | 轨道管理 |
| `range()` | `range()` | 获取所有轨道时间范围 |
| `updateEventDatas()` | `updateEventDatas()` | 提交事件数据修改（修改 events 后必须调用） |
| `addAuxiliaryCurve_experimental(name)` / `removeAuxiliaryCurve_experimental(name)` / `hasAuxiliaryCurve_experimental(name)` | `...` | 辅助曲线（实验性） |

#### AnimationState

动画状态，完全控制动画播放过程（继承 `Playable`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string | 动画名 |
| `clip` | AnimationClip | 正在播放的剪辑 |
| `wrapMode` | WrapMode | 循环方式 |
| `weight` | number | 权重 |
| `speed` | number | 播放速率 |
| `repeatCount` | number | 迭代次数 |
| `ratio` | number | 播放比例时间 |
| `time` / `current` / `duration` | number | 播放时间 / 当前进度 / 单次时长 |
| `playbackRange` | `{min, max}` | 播放范围（秒） |
| `delay` | number | 延迟播放秒数 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play()` / `pause()` / `stop()` / `resume()` | `...` | 播放控制 |
| `update(delta)` / `sample()` | `...` | 更新进度 / 手动采样 |
| `setTime(time)` | `setTime(time: number)` | 设置累计播放时间 |
| `getWrappedInfo(time, info?)` | `...` | 获取包裹时间信息 |
| `on/once/off(type, callback, target?)` | `...` | 事件监听（LastFrame 等） |

#### SkeletalAnimation

骨骼动画组件（继承 `Animation`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `useBakedAnimation` | boolean | 是否使用预烘焙动画（默认启用） |
| `sockets` | Socket[] | 挂点数组（挂载自定义节点前必须先注册） |
| `Socket`（静态） | 类型 | 挂点数据结构 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `rebuildSocketAnimations()` | `rebuildSocketAnimations()` | 重建动画并同步挂点矩阵 |
| `querySockets()` | `querySockets()` | 获取所有挂点的骨骼路径 |
| `createSocket(path)` | `createSocket(path: string)` | 创建或获取挂点同步目标节点 |
| `getUsers()` | `getUsers()` | 获取使用该组件的骨骼网格列表 |
| （继承 Animation） | `play` / `crossFade` / `addClip` / `removeClip` / `getState` / `createState` | 播放控制 |

#### AnimationManager

全局动画管理 / 调度系统（继承 `System`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `ID`（静态） | string（'animation'） | 系统 ID |
| `animationStates` | readonly 数组 | 所有动画状态 |
| `blendState` | LegacyBlendStateBuffer | 混合状态缓冲 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `addAnimation(anim)` / `removeAnimation(anim)` | `...` | 注册 / 注销动画状态 |
| `addCrossFade(fade)` / `removeCrossFade(fade)` | `...` | 交叉淡入淡出管理 |
| `addSockets(sockets)` / `removeSockets(sockets)` | `...` | 挂点管理 |
| `pushDelayEvent(fn, thisArg, args)` | `...` | 推入延迟事件 |

---

## 17. 缓动系统（tween）

> 官方简介：缓动系统是一个较简易的 API 级别动画系统，用于在一定时间内对对象的属性进行变化。模块页：`tween-readme`。

### 17.1 类 / 接口 / 函数

| 类别 | 名称 | 说明 |
|---|---|---|
| 命名空间 | `tweenProgress` | 缓动进度相关命名空间 |
| 类 | `Tween` | 提供简单灵活的方法来缓动目标 |
| 类 | `TweenAction` | 缓动动作（属性插值动作） |
| 类 | `TweenSystem` | 缓动系统（全局调度系统） |
| 接口 | `ITweenOption` | 缓动可选属性接口定义 |
| 接口 | `ITweenCustomProperty` / `ITweenCustomPropertyStartParameter` | 自定义缓动属性接口 |
| 函数 | `tween(target?)` | 帮助实例化 Tween 实例（`tween<T extends object>(target?: T): Tween<T>`） |
| 函数 | `tweenUtil(target?)` | 同 tween |
| 函数 | `tweenProgress.bezier` / `catmullRom` | 贝塞尔 / Catmull-Rom 缓动 |

### 17.2 Tween 典型用法

```ts
import { tween, Vec3 } from 'cc';
tween(this.node)
  .to(1, { scale: new Vec3(2, 2, 2), position: new Vec3(5, 5, 5) })
  .call(() => { console.log('This is a callback'); })
  .by(1, { scale: new Vec3(-1, -1, -1) }, { easing: 'sineOutIn' })
  .start();
```

### 17.3 Tween 类

| 属性 | 类型 | 说明 |
|---|---|---|
| `running` | boolean | 是否在运行 |
| `duration` | number | 缓动总时长 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `to(duration, props, opts?)` | `to(duration: number, props, opts?): Tween` | 绝对值缓动动作 |
| `by(duration, props, opts?)` | `by(duration: number, props, opts?): Tween` | 相对值缓动动作 |
| `set(props)` | `set(props): Tween` | 直接设置目标属性 |
| `call(callback)` | `call(callback): Tween` | 回调动作 |
| `delay(duration)` | `delay(duration: number): Tween` | 延时动作 |
| `update(duration, callback)` | `update(duration: number, callback): Tween` | 固定时长自定义动作 |
| `updateUntil(callback)` | `updateUntil(callback): Tween` | 不确定时长自定义动作 |
| `union(fromId?)` | `union(fromId?: number): Tween` | 整合为顺序动作 |
| `sequence(...args)` | `sequence(...args: Tween[]): Tween` | 队列动作 |
| `parallel(...args)` | `parallel(...args: Tween[]): Tween` | 并行动作 |
| `repeat(repeatTimes, embedTween?)` / `repeatForever(embedTween?)` | `...` | 重复动作 |
| `reverse()` / `reverse(id)` / `reverseTime(embedTween?)` | `...` | 反转 |
| `then(tween)` | `then(tween: Tween): Tween` | 插入 tween 到队列 |
| `start(time?)` / `stop()` / `pause()` / `resume()` | `...` | 播放控制 |
| `target(target)` / `getTarget()` | `...` | 目标设置 / 获取 |
| `tag(tag)` | `tag(tag: number): Tween` | 设置标签 |
| `timeScale(scale)` / `getTimeScale()` | `...` | 时间缩放（1 正常 / 0.5 减速 / 2 加速） |
| `show()` / `hide()` / `removeSelf()` / `destroySelf()` | `...`（target 须为节点） | 显示 / 隐藏 / 移除 |
| `clone()` | `clone(): Tween` | 克隆 |
| `bindNodeState(isBind)` | `bindNodeState(isBindNodeState: boolean)` | 关联节点状态（v3.8.7 起：激活恢复 / 禁用暂停 / 销毁销毁） |
| 静态 `stopAll()` / `stopAllByTarget(target)` / `stopAllByTag(tag)` / `getRunningCount(target)` | `...` | 批量管理 |

### 17.4 TweenSystem / TweenAction

- `TweenSystem`：缓动系统（继承 `System`），静态属性 `instance` / `ID`（'TWEEN'） / `ActionManager`。
- `TweenAction<T>`：缓动动作，继承 `ActionInterval`，构造函数 `TweenAction<T extends object>(duration: number, props: any, opts?)`，属性 `relative` 表示是否相对值动作。

---

## 18. 音频（audio）

> 官方简介：音乐是游戏中不可或缺的一部分。Cocos Creator 的音频系统支持导入并播放大多数常见音频文件格式。模块页：`audio-readme`。

### 18.1 类清单

| 类 | 说明 |
|---|---|
| `AudioClip` | 音频片段资源 |
| `AudioSource` | 音频组件，代表单个音源，提供播放、暂停、停止等基本功能 |

### 18.2 AudioSource

音频组件（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `clip` | AudioClip | 要播放的音频 |
| `volume` | number | 音量（0.0 ~ 1.0） |
| `state` | AudioState | 当前音频状态 |
| `playing` | boolean | 是否正在播放 |
| `playOnAwake` | boolean | 是否自动播放（多数平台需首次用户输入后生效） |
| `loop` | boolean | 是否循环播放 |
| `duration` | number | 音频总时长（秒） |
| `currentTime` | number | 当前播放时间（秒） |
| `EventType`（静态） | 枚举 | 音频事件类型 |
| `AudioState`（静态） | 枚举 | 音频状态枚举 |
| `maxAudioChannel`（静态） | number | 最大音频通道数 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play()` | `play(): void` | 开始播放（Web 受自动播放策略限制） |
| `pause()` / `stop()` | `...: void` | 暂停 / 停止 |
| `playOneShot(clip, volumeScale?)` | `playOneShot(clip: AudioClip, volumeScale?: number): void` | 播放一次，最终音量 = volume × volumeScale |
| `getSampleRate()` | `getSampleRate(): number` | 获取采样率（原生与 Web Audio） |
| `getPCMData(channelIndex)` | `getPCMData(channelIndex: number)` | 按通道获取 PCM 数据 |

### 18.3 AudioClip

音频片段资源（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `loadMode` | AudioLoadMode | 音频加载模式 |
| `state` | AudioState | 音频状态 |
| `AudioType`（静态） | 枚举 | 音频类型 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play()` / `pause()` / `stop()` / `playOneShot(volume?)` | `...` | 播放控制 |
| `setVolume(v)` / `getVolume()`、`setLoop(loop)` / `getLoop()`、`setCurrentTime(t)` / `getCurrentTime()`、`getDuration()` | `...` | 音频参数 |

---

## 19. 视频（video）

> 官方简介：VideoPlayer 是一种视频播放组件，可通过该组件播放本地和远程视频。模块页：`video-readme`。

### 19.1 类清单

| 类 | 说明 |
|---|---|
| `VideoClip` | 视频片段资源 |
| `VideoPlayer` | 视频播放组件（仅支持 Web、iOS 和 Android） |

### 19.2 VideoPlayer

视频播放组件（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `clip` | VideoClip | 本地视频剪辑 |
| `resourceType` | ResourceType | 视频来源（REMOTE / LOCAL） |
| `remoteURL` | string | 远程视频 URL |
| `playOnAwake` | boolean | 加载后自动播放 |
| `loop` | boolean | 是否循环 |
| `volume` | number | 音量（0.0 ~ 1.0） |
| `mute` | boolean | 是否静音 |
| `playbackRate` | number | 播放速率（0.0 ~ 10.0） |
| `keepAspectRatio` | boolean | 保持原始宽高比 |
| `fullScreenOnAwake` | boolean | 是否全屏播放 |
| `stayOnBottom` | boolean | 是否永远在游戏视图最底层（仅 Web） |
| `isPlaying` | boolean | 是否正在播放 |
| `state` | 枚举 | 视频状态 |
| `duration` / `currentTime` | number | 总时长 / 当前进度 |
| `nativeVideo` | 原生对象 | 原始视频对象 |
| `videoPlayerEvent` | 事件处理器 | 视频播放回调 |
| `ResourceType` / `EventType`（静态） | 枚举 | 资源类型 / 事件类型 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play()` / `pause()` / `stop()` / `resume()` | `...` | 播放控制 |
| `onReadyToPlay()` / `onPlaying()` / `onPaused()` / `onStopped()` / `onCompleted()` / `onError()` / `onMetaLoaded()` / `onClicked()` | `...` | 状态事件回调 |

---

## 20. WebView

> 官方简介：WebView 是一种显示网页的组件，可在游戏内集成一个小型浏览器；目前仅支持 Web、iOS 和 Android。模块页：`webview-readme`。

### 20.1 WebView

网页视图组件（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `url` | string | 加载的网址（http / https 开头） |
| `state` | 枚举 | 网页视图状态 |
| `nativeWebView` | 原生对象 | 原始网页对象 |
| `webviewEvents` | 事件处理器 | 加载中 / 完成 / 出错回调 |
| `EventType`（静态） | 枚举 | 网页视图事件类型 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setJavascriptInterfaceScheme(scheme)` | `setJavascriptInterfaceScheme(scheme: string)` | 设置 JS 接口方案（与 setOnJSCallback 配套，仅 Android/iOS） |
| `setOnJSCallback(callback)` | `setOnJSCallback(callback)` | 加载 URL 以 JS 接口方案开始时回调（仅 Android/iOS） |
| `evaluateJS(str)` | `evaluateJS(str: string)` | 执行 WebView 内部页面脚本（需自行解决跨域） |
| `onLoading()` / `onLoaded()` / `onError(...args)` | `...` | 加载中 / 完成 / 出错回调 |

---

## 21. 物理系统（physics）

> 官方简介：物理系统用于让游戏世界的物体按照现实世界进行基于物理的模拟与更新。模块页：`physics-system-readme`。

### 21.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `physics` | 物理系统主命名空间 |
| `Collider` / `RigidBody` / `Constraint` / `SimplexCollider` / `utils` | 碰撞器 / 刚体 / 约束 / 单纯形 / 工具命名空间 |

| 类 | 说明 |
|---|---|
| `PhysicsSystem` | 物理系统核心，管理物理世界、重力、模拟步进、射线 / 扫描检测 |
| `RigidBody` | 刚体组件 |
| `Collider` | 碰撞器基类 |
| `BoxCollider` / `SphereCollider` / `CapsuleCollider` / `CylinderCollider` / `ConeCollider` | 基础形状碰撞器 |
| `MeshCollider` / `PlaneCollider` / `TerrainCollider` / `SimplexCollider` | 网格 / 平面 / 地形 / 单纯形碰撞器 |
| `CharacterController` / `BoxCharacterController` / `CapsuleCharacterController` | 角色控制器 |
| `CharacterControllerContact` | 角色控制器碰撞事件信息 |
| `ConstantForce` | 每帧对刚体施加持续力的组件 |
| `PhysicsMaterial` | 物理材质 |
| `PhysicsRayResult` / `PhysicsLineStripCastResult` | 射线 / 逐线段检测结果 |
| `Constraint` | 关节约束基类（依赖刚体组件） |
| `ConfigurableConstraint` | 可配置约束组件（提供其他约束所有功能） |
| `FixedConstraint` | 固定关节 |
| `HingeConstraint` | 铰链约束 |
| `PointToPointConstraint` | 点对点约束 |

### 21.2 接口 / 枚举 / 变量

| 类别 | 名称 | 说明 |
|---|---|---|
| 接口 | `ICollisionEvent` / `ITriggerEvent` / `IContactEquation` | 碰撞 / 触发事件及接触信息 |
| 接口 | `ICollisionGroup` / `ICollisionMatrix` / `IPhysicsConfig` | 碰撞分组 / 矩阵 / 物理配置 |
| 枚举 | `ERigidBodyType` | 刚体类型（STATIC / DYNAMIC / KINEMATIC 等） |
| 枚举 | `EColliderType` / `ESimplexType` | 碰撞体 / 单形体类型 |
| 枚举 | `ECharacterControllerType` / `EAxisDirection` | 角色控制器类型 / 轴方向 |
| 枚举 | `EConstraintType` / `EConstraintMode` / `ED6Axis` / `EDriverMode` | 约束类型 / 自由度模式 / D6 六自由度 / 驱动类型 |
| 枚举 | `EPhysicsDrawFlags` / `PhysicsGroup` | 调试绘制标志 / 物理分组 |
| 变量 | `selector` | 物理选择器（注册 / 切换物理引擎后端） |
| 变量 | `CollisionEventObject` / `TriggerEventObject` / `CharacterTriggerEventObject` | 事件对象 |

### 21.3 重点类详解

#### PhysicsSystem

物理系统核心（继承 `System`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `instance`（静态） | PhysicsSystem | 物理系统实例 |
| `ID`（静态） | string（'PHYSICS'） | 系统 ID |
| `PHYSICS_PHYSX` / `PHYSICS_CANNON` / `PHYSICS_BULLET` / `PHYSICS_BUILTIN` / `PHYSICS_NONE`（静态） | boolean | 各物理后端可用性 |
| `PhysicsGroup`（静态） | typeof PhysicsGroup | 预定义物理分组 |
| `enable` | boolean | 是否启用物理系统 |
| `gravity` | Vec3 | 重力，默认 (0, -10, 0) |
| `fixedTimeStep` / `maxSubSteps` | number | 固定时间步 / 最大子步数 |
| `sleepThreshold` / `allowSleep` | number / boolean | 休眠临界值 / 是否允许休眠 |
| `autoSimulation` | boolean | 是否自动模拟 |
| `defaultMaterial` | PhysicsMaterial | 全局默认物理材质 |
| `debugDrawFlags` / `debugDrawConstraintSize` | number | 调试绘制标志 / 约束尺寸 |
| `physicsWorld` | IPhysicsWorld | 物理世界封装对象 |
| `raycastResults` / `raycastClosestResult` | PhysicsRayResult[] / PhysicsRayResult | 射线检测结果 |
| `sweepCastResults` / `sweepCastClosestResult` | PhysicsRayResult[] / PhysicsRayResult | 扫描检测结果 |
| `lineStripCastResults` / `lineStripCastClosestResult` | PhysicsLineStripCastResult[] / ... | 逐线段检测结果 |
| `collisionMatrix` | ICollisionMatrix | 碰撞矩阵 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `raycast(worldRay, mask?, maxDistance?, queryTrigger?)` | `...: boolean` | 检测所有碰撞盒（结果经 raycastResults） |
| `raycastClosest(worldRay, mask?, maxDistance?, queryTrigger?)` | `...: boolean` | 最近射线检测 |
| `sweepSphere(worldRay, radius, mask?, maxDistance?, queryTrigger?)` / `sweepSphereClosest(...)` | `...: boolean` | 球体扫描检测 |
| `sweepBox(worldRay, halfExtent, orientation, ...)` / `sweepBoxClosest(...)` | `...: boolean` | 盒体扫描检测 |
| `sweepCapsule(worldRay, radius, height, orientation, ...)` / `sweepCapsuleClosest(...)` | `...: boolean` | 胶囊体扫描检测 |
| `lineStripCast(segments, ...)` / `lineStripCastClosest(...)` | `...: boolean` | 逐线段检测 |
| `step(fixedTimeStep, deltaTime?, maxSubSteps?)` | `...: void` | 执行物理模拟步进 |
| `syncSceneToPhysics()` | `syncSceneToPhysics(): void` | 同步场景到物理世界 |
| `setDefaultPhysicsMaterial(material)` | `...: void` | 设置默认物理材质 |
| `resetConfiguration()` / `resetAccumulator(time?)` / `emitEvents()` | `...` | 配置重置 / 时间累积 / 事件触发 |
| `initDefaultMaterial()` | `...: void` | 初始化默认材质 |

#### RigidBody

刚体组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | ERigidBodyType | 刚体类型 |
| `group` | number | 分组 |
| `mass` | number | 质量 |
| `useGravity` | boolean | 是否使用重力 |
| `useCCD` | boolean | 连续碰撞检测 |
| `allowSleep` / `sleepThreshold` | boolean / number | 休眠 |
| `linearDamping` / `angularDamping` | number | 线性 / 旋转阻尼 |
| `linearFactor` / `angularFactor` | Vec3 | 速度 / 旋转因子 |
| `isStatic` / `isDynamic` / `isKinematic` | boolean | 类型判断 |
| `isAwake` / `isSleeping` / `isSleepy` | boolean | 状态查询 |
| `body` | IRigidBody | 底层封装对象 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setGroup(v)` / `getGroup()` / `addGroup(v)` / `removeGroup(v)` | `...` | 分组值操作 |
| `setMask(v)` / `getMask()` / `addMask(v)` / `removeMask(v)` | `...` | 掩码值操作 |
| `setLinearVelocity(value)` / `getLinearVelocity(out)` | `...` | 线性速度 |
| `setAngularVelocity(value)` / `getAngularVelocity(out)` | `...` | 角速度 |
| `wakeUp()` / `sleep()` | `...` | 唤醒 / 休眠 |
| `clearForces()` / `clearVelocity()` / `clearState()` | `...` | 清除力 / 速度 / 状态 |
| `applyForce(force, relativePoint?)` / `applyLocalForce(force, localPoint?)` | `...` | 施加力 |
| `applyImpulse(impulse, relativePoint?)` / `applyLocalImpulse(impulse, localPoint?)` | `...` | 施加冲量 |
| `applyTorque(torque)` / `applyLocalTorque(torque)` | `...` | 施加扭矩 |

#### Collider

所有 3D 碰撞器基类（继承 `Component`，带事件接口）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `center` | Vec3 | 本地碰撞器中心点 |
| `isTrigger` | boolean | 是否为触发器 |
| `material` / `sharedMaterial` | PhysicsMaterial | 物理材质（共享 / 实例） |
| `shape` | IBaseShape | 底层封装对象 |
| `attachedRigidBody` | RigidBody | 绑定的刚体 |
| `worldBounds` / `boundingSphere` | Readonly\<AABB\> / Readonly\<Sphere\> | 包围盒 / 包围球 |
| `needTriggerEvent` / `needCollisionEvent` | boolean | 是否需要触发 / 碰撞事件 |
| `type` | EColliderType | 碰撞器类型（只读） |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setGroup(v)` / `getGroup()` / `addGroup(v)` / `removeGroup(v)` | `...` | 分组值操作 |
| `setMask(v)` / `getMask()` / `addMask(v)` / `removeMask(v)` | `...` | 掩码值操作 |
| `on(type, callback, target?)` / `off(type, callback?, target?)` / `once(type, callback, target?)` | `...` | 触发 / 碰撞事件注册 |

#### 各形状碰撞器关键属性

| 碰撞器 | 关键属性 |
|---|---|
| `BoxCollider` | `size: Vec3` |
| `SphereCollider` | `radius: number`（默认 0.5） |
| `CapsuleCollider` | `radius`、`height`、`direction: EAxisDirection`、`cylinderHeight`、`worldHeight`（只读） |
| `CylinderCollider` | `radius`、`height`、`direction` |
| `ConeCollider` | `radius`、`height`、`direction` |
| `MeshCollider` | `mesh: Mesh`、`convex: boolean` |
| `PlaneCollider` | `normal: Vec3`、`constant: number` |
| `TerrainCollider` | `terrain: ITerrainAsset` |
| `SimplexCollider` | 支持点、线、三角形、四面体 |

#### ConstantForce

每帧对刚体施加持续力（依赖 RigidBody 组件）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `force` / `localForce` | Vec3 | 世界 / 本地坐标系下的力 |
| `torque` / `localTorque` | Vec3 | 世界 / 本地坐标系下的扭矩 |

#### CharacterController

角色控制器组件基类。

| 属性 | 类型 | 说明 |
|---|---|---|
| `group` | number | 分组 |
| `center` | Vec3 | 局部中心位置 |
| `minMoveDistance` / `stepOffset` / `slopeLimit` / `skinWidth` | number | 移动距离 / 爬台阶 / 爬坡 / 皮肤宽度 |
| `velocity` | Readonly\<Vec3\> | 速度（move 调用后更新） |
| `isGrounded` | boolean | 是否在地面（move 调用后更新） |
| `centerWorldPosition` | Readonly\<Vec3\> | 中心世界坐标 |
| `type` | ECharacterControllerType | 类型 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `move(movement)` | `move(movement: Vec3): void` | 移动角色控制器 |
| `setGroup/getGroup/addGroup/removeGroup`、`setMask/getMask/addMask/removeMask` | `...` | 分组 / 掩码操作 |
| `on/off/once(type, cb, target?)` | `...` | 触发 / 碰撞事件 |

#### PhysicsMaterial

物理材质资源（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `friction` | number | 摩擦系数（默认 0.6） |
| `rollingFriction` / `spinningFriction` | number | 滚动 / 自旋摩擦 |
| `restitution` | number | 回弹系数（默认 0.0） |
| `id` | number | 材质 ID |
| `allMaterials`（静态） | PhysicsMaterial[] | 所有材质实例 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setValues(friction, rollingFriction, spinningFriction, restitution)` | `...: void` | 设置相关系数 |
| `clone()` | `clone(): PhysicsMaterial` | 克隆 |

#### PhysicsRayResult

物理射线检测结果。

| 属性 | 类型 | 说明 |
|---|---|---|
| `hitPoint` / `hitNormal` | Vec3 | 击中点 / 法线 |
| `distance` | number | 距离 |
| `collider` | Collider | 击中的碰撞盒 |
| `closestHitFraction` | number | 最近碰撞位置百分比（仅 Bullet 引擎） |

| 方法 | 签名 | 说明 |
|---|---|---|
| `clone()` | `clone(): PhysicsRayResult` | 克隆 |

---

## 22. 2D 物理系统

> 官方简介：物理系统的 2D 版本，用于在 2D 世界下模拟物理。模块页：`physics-system-2d-readme`。

### 22.1 类清单

| 类 | 说明 |
|---|---|
| `PhysicsSystem2D` | 2D 物理系统 |
| `RigidBody2D` | 2D 刚体（Static / Kinematic / Dynamic / Animated） |
| `Collider2D` | 2D 碰撞器基类 |
| `BoxCollider2D` / `CircleCollider2D` / `PolygonCollider2D` | 2D 盒 / 圆 / 多边形碰撞器 |
| `Joint2D` | 2D 关节基类 |
| `DistanceJoint2D` / `FixedJoint2D` / `HingeJoint2D` / `SliderJoint2D` / `SpringJoint2D` / `WheelJoint2D` / `MouseJoint2D` / `RelativeJoint2D` | 各类 2D 关节 |
| `Intersection2D` | 形状相交测试辅助类 |
| 接口 | `IPhysics2DContact` / `IPhysics2DImpulse` / `IPhysics2DManifold` / `IPhysics2DManifoldPoint` / `IPhysics2DWorldManifold` / `RaycastResult2D` | 接触 / 流形 / 射线结果 |
| 枚举 | `ERigidBody2DType` / `ECollider2DType` / `EJoint2DType` / `ERaycast2DType` / `EPhysics2DDrawFlags` / `Physics2DManifoldType` / `PhysicsGroup2D` | 类型枚举 |
| 变量 | `Contact2DType` / `PhysicsGroup` / `PHYSICS_2D_PTM_RATIO` / `Physics2DUtils` / `selector` | 常量与工具 |

> 说明：3.8 中不存在 `CapsuleCollider2D`、`PhysicsMaterial2D`、`PhysicsRayCastResult2D` 独立类（2D 物理材质属性直接配置在 Collider2D 上；2D 射线结果类型为接口 `RaycastResult2D`）。

### 22.2 重点类详解

#### PhysicsSystem2D

2D 物理系统（继承 `System`，带事件接口）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `instance`（静态） | PhysicsSystem2D | 实例 |
| `ID`（静态） | string（'PHYSICS_2D'） | 系统 ID |
| `PHYSICS_NONE` / `PHYSICS_BUILTIN` / `PHYSICS_BOX2D` / `PHYSICS_BOX2D_WASM`（静态） | boolean | 各 2D 后端可用性 |
| `enable` | boolean | 是否启用 |
| `gravity` | Vec2 | 重力，默认 (0, -10) |
| `fixedTimeStep` / `maxSubSteps` / `velocityIterations` / `positionIterations` | number | 模拟参数 |
| `allowSleep` / `autoSimulation` | boolean | 休眠 / 自动模拟 |
| `debugDrawFlags` | number | 调试绘制标志 |
| `physicsWorld` | IPhysicsWorld | 物理世界 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `raycast(p1, p2, type?, mask?)` | `raycast(p1: IVec2Like, p2: IVec2Like, type?: ERaycast2DType, mask?: number): readonly RaycastResult2D[]` | 射线检测 |
| `testPoint(p)` | `testPoint(p: Vec2): readonly Collider2D[]` | 点所在碰撞体 |
| `testAABB(rect)` | `testAABB(rect: Rect): readonly Collider2D[]` | AABB 相交碰撞体 |
| `step(fixedTimeStep)` / `resetAccumulator(time?)` / `postUpdate(deltaTime)` | `...` | 模拟步进 |
| `constructAndRegister()` | `...: void` | 构造并注册单例 |

#### RigidBody2D

2D 刚体组件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `type` | ERigidBody2DType | 刚体类型（默认 Dynamic） |
| `group` | number | 分组 |
| `linearVelocity` | Vec2 | 线性速度 |
| `linearDamping` / `angularDamping` | number | 线性 / 角速度阻尼 |
| `angularVelocity` | number | 角速度（弧度 / 秒） |
| `gravityScale` | number | 重力缩放 |
| `fixedRotation` / `allowSleep` / `bullet` / `awakeOnLoad` / `enabledContactListener` | boolean | 各类开关 |
| `impl` | IRigidBody2D | 底层封装 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `wakeUp()` / `sleep()` / `isAwake()` | `...` | 唤醒 / 休眠 |
| `getMass()` / `getInertia()` | `(): number` | 质量 / 惯性 |
| `getWorldCenter(out)` / `getLocalCenter(out)` | `...: Vec2` | 质心 |
| `getWorldPoint(localPoint, out)` / `getLocalPoint(worldPoint, out)` | `...: Vec2` | 坐标转换 |
| `getWorldVector(localVector, out)` / `getLocalVector(worldVector, out)` | `...: Vec2` | 向量转换 |
| `applyForce(force, point, wake)` / `applyForceToCenter(force, wake)` | `...` | 施加力 |
| `applyLinearImpulse(impulse, point, wake)` / `applyLinearImpulseToCenter(impulse, wake)` | `...` | 施加冲量 |
| `applyTorque(torque, wake)` / `applyAngularImpulse(impulse)` | `...` | 扭矩 / 角冲量 |

#### Collider2D

所有 2D 碰撞器基类（继承 `Component`，带事件接口）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tag` | number | 标签（多碰撞组件区分） |
| `group` | number | 分组 |
| `sensor` | boolean | 传感器（产生回调但不发生物理碰撞） |
| `density` | number | 密度（默认 1.0） |
| `friction` / `restitution` | number | 摩擦 / 弹性系数 |
| `offset` | Vec2 | 位置偏移 |
| `worldAABB` | Readonly\<Rect\> | 世界包围盒 |
| `body` | RigidBody2D | 节点上的刚体 |
| `TYPE` | ECollider2DType | 碰撞器类型 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `apply()` | `apply(): void` | 应用 collider 修改（box2d 时重新生成夹具） |

#### 各 2D 形状碰撞器关键属性

| 碰撞器 | 关键属性 |
|---|---|
| `BoxCollider2D` | `size: Size`、`worldPoints: readonly Vec2[]` |
| `CircleCollider2D` | `radius`（默认 1）、`worldRadius`、`worldPosition` |
| `PolygonCollider2D` | `points: Vec2[]`、`worldPoints`、`threshold` |

#### 各 2D 关节关键属性

| 关节 | 关键属性 |
|---|---|
| `DistanceJoint2D` | `maxLength`（默认 5）、`autoCalcDistance` |
| `HingeJoint2D` | `enableLimit` / `lowerAngle` / `upperAngle`、`enableMotor` / `motorSpeed` / `maxMotorTorque` |
| `SliderJoint2D` | `angle`、`autoCalcAngle`、`enableLimit` / `lowerLimit` / `upperLimit`、`enableMotor` / `motorSpeed` / `maxMotorForce` |
| `WheelJoint2D` | `angle`（默认 90）、`enableMotor` / `motorSpeed` / `maxMotorTorque`、`frequency` / `dampingRatio` |
| `RelativeJoint2D` | `autoCalcOffset`、`linearOffset` / `angularOffset`、`correctionFactor`、`maxForce` / `maxTorque` |
| `Joint2D`（基类通用） | `anchor`、`connectedAnchor`、`connectedBody`、`collideConnected` |

---

## 23. 粒子系统（3D）

> 官方简介：粒子系统是游戏引擎特效表现的基础，可用于模拟火、烟、水、云、雪、落叶等自然现象，也可用于模拟发光轨迹、速度线等抽象视觉效果。模块页：`particle-system-readme`。

### 23.1 类清单

| 类 | 说明 |
|---|---|
| `ParticleSystem` | 粒子系统组件，含速度、受力、拖尾、噪声等模块 |
| `Burst` | 粒子发射事件，触发时很多粒子同时喷出 |
| `CurveRange` | 数据结构，包含多个常数值或曲线值，按计算模式计算最终值 |
| `GradientRange` | 数据结构，包含多个常数颜色或渐变色，按计算模式计算最终颜色 |
| `Billboard` | 广告牌渲染相关类 |
| `Line` | 线渲染相关类 |
| `ParticleUtils` | 粒子系统工具函数 |

> 说明：`ParticleSystemRenderer` 与各模块（`ColorOverLifetimeModule` / `ForceOvertimeModule` / `SizeOvertimeModule` / `VelocityOvertimeModule` / `RotationOvertimeModule` / `TextureAnimationModule` / `TrailModule` / `NoiseModule` / `LimitVelocityOvertimeModule` / `ShapeModule`）在 3.8 中无独立类详情页，仅作为 `ParticleSystem` 的属性（如 `particleSystem.colorOverLifetimeModule`）使用。

### 23.2 ParticleSystem

粒子系统组件（继承 `RenderableComponent`）。

| 属性（发射参数） | 类型 | 说明 |
|---|---|---|
| `playOnAwake` / `loop` / `prewarm` | boolean | 自动播放 / 循环 / 预播放 |
| `duration` | number | 系统运行时间 |
| `capacity` | number | 最大粒子数量 |
| `simulationSpeed` / `simulationSpace` / `scaleSpace` | number / Space / Space | 更新速度 / 坐标系 |
| `startDelay` / `startLifetime` | CurveRange | 延迟发射 / 生命周期 |
| `startColor` | GradientRange | 初始颜色 |
| `startSize3D` / `startSizeX/Y/Z` | boolean / CurveRange | 初始大小 |
| `startRotation3D` / `startRotationX/Y/Z` | boolean / CurveRange | 初始旋转 |
| `startSpeed` | CurveRange | 初始速度 |
| `gravityModifier` | number | 重力系数 |
| `rateOverTime` / `rateOverDistance` | CurveRange | 发射速率 |
| `bursts` | Burst[] | burst 发射配置 |
| `renderCulling` / `cullingMode` / `dataCulling` | boolean / ParticleCullingMode / boolean | 剔除相关 |
| `aabbHalfX/Y/Z` | number | 粒子包围盒半尺寸 |
| `time` | number | 运行时间 |
| `isEmitting` / `isPaused` / `isStopped` | boolean | 状态查询 |

| 属性（模块引用） | 说明 |
|---|---|
| `shapeModule` | 粒子发射器模块 |
| `colorOverLifetimeModule` | 颜色控制模块 |
| `sizeOvertimeModule` | 粒子大小模块 |
| `velocityOvertimeModule` | 粒子速度模块 |
| `forceOvertimeModule` | 粒子受力模块 |
| `rotationOvertimeModule` | 粒子旋转模块 |
| `textureAnimationModule` | 贴图动画模块 |
| `trailModule` | 粒子轨迹（拖尾）模块 |
| `limitVelocityOvertimeModule` | 限制速度模块（仅 CPU 粒子） |
| `noiseModule` | 噪声动画模块（仅 CPU 粒子） |
| `renderer` | 粒子系统渲染器（CPU / GPU） |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play()` / `pause()` / `stop()` / `stopEmitting()` / `clear()` | `...: void` | 播放控制 |
| `getParticleCount()` | `getParticleCount(): number` | 当前粒子数量 |
| `addBurst(burst)` / `removeBurst(burst)` | `...` | burst 管理 |
| `reset()` / `bindModule(module, ...)` | `...` | 重置 / 模块绑定 |
| `getBoundingX/Y/Z()` / `setBoundingX/Y/Z(v)` | `...` | 包围盒尺寸 |

### 23.3 Burst

粒子发射事件。

| 属性 | 类型 | 说明 |
|---|---|---|
| `time` | number | 触发时间（默认 0） |
| `repeatCount` / `repeatInterval` | number | 触发次数 / 间隔 |
| `count` | CurveRange | 发射粒子数量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `update(psys, dt)` | `update(psys: ParticleSystem, dt: number): void` | 更新触发事件 |
| `reset()` / `getMaxCount(psys)` | `...` | 重置 / 最大数量 |

---

## 24. 2D 粒子系统

> 官方简介：粒子系统的 2D 版本，用于在 2D 世界下进行特效的开发。模块页：`particle-system-2d-readme`。

### 24.1 类清单

| 类 | 说明 |
|---|---|
| `ParticleSystem2D` | 2D 粒子系统组件（支持 Particle Designer 生成的粒子） |
| `ParticleAsset` | 2D 粒子资产（plist 文件资产） |
| `MotionStreak` | 运动轨迹，在运动轨迹上实现拖尾渐隐 |
| 变量 | `ParticleSystem2DAssembler` / `MotionStreakAssemblerManager` | 渲染装配器 |

### 24.2 ParticleSystem2D

2D 粒子系统组件（继承 `UIRenderer`）。

| 属性（发射与外观） | 类型 | 说明 |
|---|---|---|
| `custom` | boolean | 使用自定义属性（而非读取粒子文件） |
| `file` | ParticleAsset | plist 粒子文件资产 |
| `spriteFrame` | SpriteFrame | 粒子显示 SpriteFrame |
| `duration` | number | 发射器运行秒数（-1 表示永远） |
| `totalParticles` / `particleCount` / `emissionRate` | number | 粒子数量与发射速率 |
| `autoRemoveOnFinish` / `playOnLoad` / `preview` / `stopped` / `active` | boolean | 各类开关与状态 |

| 属性（模式参数） | 类型 | 说明 |
|---|---|---|
| `emitterMode` | EmitterMode | GRAVITY（重力）/ RADIUS（半径） |
| `positionType` | PositionType | FREE / GROUPED / RELATIVE |
| `angle` / `angleVar`、`life` / `lifeVar`、`speed` / `speedVar` | number | 角度 / 寿命 / 速度及变化量 |
| `gravity` | Vec2 | 发射器重力 |
| `sourcePos` / `posVar` | Vec2 | 源位置及变化量 |
| `startColor` / `startColorVar`、`endColor` / `endColorVar` | Color | 起止颜色及变化量 |
| `startSize` / `startSizeVar`、`endSize` / `endSizeVar` | number | 起止大小及变化量 |
| `startSpin` / `startSpinVar`、`endSpin` / `endSpinVar` | number | 起止自旋及变化量 |
| `tangentialAccel` / `tangentialAccelVar`、`radialAccel` / `radialAccelVar` | number | 切向 / 径向加速度（仅重力模式） |
| `startRadius` / `startRadiusVar`、`endRadius` / `endRadiusVar` | number | 起止半径（仅半径模式） |
| `rotatePerS` / `rotatePerSVar` | number | 每秒绕源旋转度数（仅半径模式） |
| `rotationIsDir` | boolean | 粒子旋转等于其方向（仅重力模式） |
| `aspectRatio` | number | 粒子宽高比 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `stopSystem()` | `stopSystem(): void` | 停止发射（已发射粒子继续运行至消亡） |
| `resetSystem()` | `resetSystem(): void` | 杀死所有存活粒子 |
| `isFull()` | `isFull(): boolean` | 系统是否已满 |
| `addParticle()` | `addParticle(): boolean` | 添加一个粒子 |
| `initProperties(...)` | `initProperties(...): void` | 初始化粒子属性 |

---

## 25. DragonBones（龙骨）

> 官方简介：ArmatureDisplay 组件可以对 DragonBones（龙骨）资源进行渲染和播放。Cocos Creator 支持 DragonBones 最高到 v5.6.300。模块页：`dragonbones-readme`。

### 25.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `dragonBones` | 龙骨模块命名空间（`import { dragonBones } from 'cc'`） |

| 类 | 说明 |
|---|---|
| `dragonBones.ArmatureDisplay` | DragonBones 骨骼动画渲染组件（继承 UIRenderer） |
| `dragonBones.Armature` | 骨架，骨骼动画系统核心 |
| `dragonBones.Animation` | 动画播放器 |
| `dragonBones.Bone` | 骨骼（实现平移、旋转、缩放） |
| `dragonBones.Slot` | 插槽（控制显示对象的状态和属性） |
| `dragonBones.DragonBonesData` | 龙骨数据（含多个骨架数据） |
| `dragonBones.CCFactory` | 全局工厂实例，解析数据并创建骨架 |
| `dragonBones.CCArmatureDisplay` | 封装数据显示和事件派发 |
| `dragonBones.CCSlot` / `CCTextureAtlasData` / `CCTextureData` | 插槽 / 纹理图集数据 / 纹理数据 |
| `DragonBonesAsset` | 骨骼数据资源 |
| `DragonBonesAtlasAsset` | 骨骼纹理数据资源 |
| `DragonBoneSocket` | 骨骼挂点（随骨骼动画运动） |
| `ArmatureCache` | 骨架缓存 |
| `AttachUtil` | 挂点工具类 |
| 枚举 | `AnimationCacheMode` / `AnimationFadeOutMode` / `DragonBonesEventType` | 渲染类型 / 淡出模式 / 事件类型 |
| 变量 | `dragonBones.timeScale` | 龙骨动画播放速度（应大于 0） |

### 25.2 重点类详解

#### dragonBones.ArmatureDisplay

DragonBones 骨骼动画渲染组件（继承 `UIRenderer`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `timeScale` | number | 动画时间缩放 |
| `dragonAsset` | null \| DragonBonesAsset | 骨骼数据（可多实例共用） |
| `dragonAtlasAsset` | null \| DragonBonesAtlasAsset | 纹理图集数据 |
| `armatureName` | string | 当前 Armature 名称 |
| `animationName` | string | 当前播放的动画名称 |
| `playTimes` | number | 播放循环次数（-1 用默认 / 0 无限 / >0 循环 N 次） |
| `premultipliedAlpha` | boolean | 是否启用贴图预乘 |
| `enableBatch` | boolean | 开启合批（降低 drawcall） |
| `debugBones` | boolean | 是否显示骨骼调试信息 |
| `sockets` | DragonBoneSocket[] | 挂点数组 |
| `attachUtil` | AttachUtil | 挂载工具 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `playAnimation(animName, playTimes)` | `playAnimation(animName, playTimes)` | 播放指定动画 |
| `getArmatureNames()` / `getAnimationNames()` / `getArmatureKey()` | `...` | 数据查询 |
| `buildArmature(name)` | `buildArmature(name)` | 构建 armature 对象 |
| `armature()` | `armature()` | 获取当前 Armature 对象 |
| `setAnimationCacheMode(...)` | `setAnimationCacheMode(...)` | 切换渲染模式 |
| `updateAnimationCache()` / `updateAnimation()` | `...` | 更新动画缓存 / 序列 |
| `invalidAnimationCache()` | `invalidAnimationCache()` | 使缓存失效 |
| `isAnimationCached()` | `isAnimationCached()` | 是否缓存模式 |
| `querySockets()` / `querySocketPathByName(...)` | `...` | 挂点查询 |
| `on/once/off(...)` | `...` | 事件监听（与 addEventListener / removeEventListener 相同） |
| `initFactory()` | `initFactory()` | 初始化全局工厂 |

#### dragonBones.Armature

骨架（继承 `BaseObject`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string（只读） | 骨架名称 |
| `animation` | Animation（只读） | 动画播放器 |
| `eventDispatcher` | IEventDispatcher（只读） | 事件派发器 |
| `display` | any（只读） | 显示对象 |
| `flipX` / `flipY` | boolean | 水平 / 垂直翻转 |
| `inheritAnimation` | boolean | 是否继承动画 |
| `cacheFrameRate` | number | 缓存帧率 |
| `armatureData` | ArmatureData（只读） | 骨架数据 |
| `clock` | null \| WorldClock | 所属 WorldClock |
| `parent` | null \| Slot | 父插槽 |
| `replacedTexture` / `userData` | any | 替换纹理 / 用户数据 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getBone(name)` / `getBones()` / `getBoneByDisplay(display)` | `...` | 骨骼获取 |
| `getSlot(name)` / `getSlots()` / `getSlotByDisplay(display)` | `...` | 插槽获取 |
| `containsPoint(x, y)` / `intersectsSegment(xA,yA,xB,yB,...)` | `...` | 点 / 线段命中测试 |
| `advanceTime(passedTime)` | `...` | 更新时间 |
| `invalidUpdate(boneName?, updateSlot?)` | `...` | 强制下一帧更新 |
| `dispose()` | `dispose()` | 释放骨架（回收到对象池） |
| `addConstraint(value)` / `init(...)` / `replaceTexture(...)` | `...` | 约束 / 初始化 / 替换纹理 |

#### dragonBones.Animation

动画播放器（继承 `BaseObject`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `timeScale` | number | 动画时间缩放 |
| `isPlaying` / `isCompleted` | boolean（只读） | 播放状态 |
| `lastAnimationName` / `lastAnimationState` | string / AnimationState（只读） | 最近动画 |
| `animations` / `animationNames` | Map / string[] | 动画数据 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `play(animationName?, playTimes?)` | `play(animationName?, playTimes?)` | 播放动画 |
| `fadeIn(name, fadeInTime?, playTimes?, layer?, group?, fadeOutMode?)` | `...` | 淡入播放 |
| `stop(animationName?)` / `reset()` | `...` | 停止 / 重置 |
| `hasAnimation(animationName)` | `hasAnimation(animationName)` | 检查动画 |
| `gotoAndPlayByTime/ByFrame/ByProgress(name, time?, playTimes?)` | `...` | 从指定时间 / 帧 / 进度播放 |
| `gotoAndStopByTime/ByFrame/ByProgress(name, time?)` | `...` | 在指定时间 / 帧 / 进度停止 |
| `getStates()` / `getState(animationName)` | `...` | 状态获取 |
| `playConfig(animationConfig)` | `...` | 通过配置播放（实验阶段 API） |

#### dragonBones.Bone

骨骼（继承 `TransformObject`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string（只读） | 骨骼名称 |
| `visible` | boolean | 是否可见 |
| `offsetMode` | OffsetMode | 偏移模式 |
| `boneData` | BoneData（只读） | 骨骼数据 |
| `animationPose` | Transform（只读） | 动画姿势 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `invalidUpdate()` | `invalidUpdate()` | 强制下一帧更新 |
| `contains(value)` | `contains(value: TransformObject)` | 是否包含特定骨骼 / 插槽 |
| `init(boneData)` / `update(cacheFrameIndex)` / `updateByConstraint()` | `...` | 初始化 / 更新 |

#### dragonBones.Slot

插槽（继承 `TransformObject`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string（只读） | 插槽名称 |
| `visible` | boolean | 是否可见 |
| `displayList` | any[] | 显示对象列表 |
| `displayIndex` | number | 当前显示对象索引 |
| `displayController` | null \| string | 显示控制器 |
| `display` | any | 显示对象 |
| `childArmature` | null \| Armature | 子骨架 |
| `boundingBoxData` | null \| BoundingBoxData（只读） | 自定义边界框数据 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `invalidUpdate()` | `invalidUpdate()` | 强制下一帧更新 |
| `containsPoint(x, y)` / `intersectsSegment(...)` | `...` | 点 / 线段命中测试 |
| `setDisplay(value)` / `getDisplay()` | `...`（deprecated，改用 display 属性） | 显示对象设置 |

#### dragonBones.DragonBonesData

龙骨数据（继承 `BaseObject`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` / `version` / `frameRate` | string / string / number | 名称 / 版本 / 帧率 |
| `armatures` / `armatureNames` | Map / string[]（只读） | 骨架数据 |
| `autoSearch` | boolean | 自动搜索 |
| `binary` / `floatArray` / `frameArray` / `intArray` 等 | 数组 | 二进制 / 各类数据数组 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getArmature(name)` | `getArmature(name)` | 获取骨架数据 |
| `addArmature(value)` | `addArmature(value)` | 添加骨架数据 |
| `dispose()` | `dispose()` | （deprecated，改用 BaseFactory#removeDragonBonesData） |

---

## 26. Spine

> 官方简介：Spine Skeleton 组件支持 Spine 官方工具导出的数据格式，并对 Spine（骨骼动画）资源进行渲染和播放。模块页：`spine-readme`。

### 26.1 命名空间 / 类清单

| 命名空间 | 说明 |
|---|---|
| `sp` | Spine 组件命名空间（`import { sp } from 'cc'`） |
| `sp.spine` | Spine 核心运行时命名空间（spine-core 类型） |

| 类 | 说明 |
|---|---|
| `sp.SpineSocket` | Spine 挂点（附着在目标骨骼上随动画运动） |
| `sp.VertexEffectDelegate` | Spine 顶点动画代理 |
| `sp.spine.Skeleton` | Spine 核心运行时骨架类 |
| `sp.spine.SkeletonData` | Spine 骨架数据定义类 |
| `sp.spine.SkeletonBinary` / `SkeletonJson` / `SkeletonInstance` / `SkeletonSystem` / `AnimationState` / `AnimationStateData` / `Bone` / `Slot` / `Skin` / `Attachment` 等 | spine-core 运行时类 |
| 枚举 | `sp.AnimationEventType` | 骨骼动画事件类型 |
| 枚举 | `sp.ATTACHMENT_TYPE` | Attachment 类型（REGION / BOUNDING_BOX / MESH / SKINNED_MESH） |
| 枚举 | `sp.SpineAnimationCacheMode` / `sp.AnimationCacheMode` | 动画缓存类型 |
| 变量 | `sp.timeScale` | 动画播放速率 |
| 变量 | `sp.SPINE_VERSION` / `sp.DefaultAnimsEnum` / `sp.simpleSpineAssembler` | 版本 / 常量 / 装配器 |
| 函数 | `sp.isBinaryCompatible` / `sp.isJsonCompatible` / `sp.loadWasmModuleSpine` | 兼容性与模块加载 |

### 26.2 重点类详解

#### sp.spine.Skeleton

Spine 核心运行时骨架类，保存骨架实例的运行时状态。

| 属性 | 类型 | 说明 |
|---|---|---|
| `data` | SkeletonData | 骨架数据 |
| `bones` / `slots` / `drawOrder` | Bone[] / Slot[] / Slot[] | 骨骼 / 插槽 / 绘制顺序 |
| `ikConstraints` / `transformConstraints` / `pathConstraints` | 各约束数组 | 约束 |
| `skin` | Skin | 当前皮肤 |
| `color` | Color | 整体颜色 |
| `scaleX` / `scaleY` / `x` / `y` | number | 缩放与位置 |
| `time` | number | 时间 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `update(delta)` / `updateWorldTransform()` / `updateCache()` | `...` | 更新 |
| `setToSetupPose()` / `setSlotsToSetupPose()` / `setBonesToSetupPose()` | `...` | 恢复姿势 |
| `setSkinByName(skinName)` / `setSkin(newSkin)` | `...` | 设置皮肤 |
| `setAttachment(slotName, attachmentName)` | `...` | 设置附件 |
| `getRootBone()` | `...` | 根骨骼 |
| `getAttachmentByName(slotName, attachmentName)` / `getAttachment(slotIndex, attachmentName)` | `...` | 获取附件 |
| `findBone(name)` / `findSlot(name)` / `findIkConstraint(name)` 等 | `...` | 查找骨骼 / 插槽 / 约束 |

#### sp.spine.SkeletonData

Spine 骨架数据定义类。

| 属性 | 类型 | 说明 |
|---|---|---|
| `name` | string | 骨架名称 |
| `bones` / `slots` / `skins` / `events` / `animations` | 各类数组 | 数据集合 |
| `defaultSkin` | Skin | 默认皮肤 |
| `x` / `y` / `width` / `height` | number | 边界 |
| `version` / `hash` / `fps` | string / string / number | 版本 / 哈希 / 帧率 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `findBone(name)` / `findBoneIndex(name)` / `findSlot(name)` / `findSlotIndex(name)` | `...` | 查找骨骼 / 插槽 |
| `findSkin(name)` / `findEvent(name)` / `findAnimation(name)` | `...` | 查找皮肤 / 事件 / 动画 |
| `findIkConstraint(name)` / `findTransformConstraint(name)` / `findPathConstraint(name)` | `...` | 查找约束 |

> 说明：3.8 中不存在 `spine.SkeletonCacheMode` / `SpineAtlas` / `SpineCacheMode` / `SpineEventType` 类；对应能力为 `sp.AnimationCacheMode`（变量）、`sp.SpineAnimationCacheMode`（枚举）、`sp.spine.TextureAtlas`（纹理图集）、`sp.AnimationEventType`（枚举）。

---

## 27. 瓦片地图（TiledMap）

> 官方简介：TiledMap（地图）用于在游戏中显示 TMX 格式的地图。模块页：`tiled-map-readme`。

### 27.1 类清单

| 类 | 说明 |
|---|---|
| `TiledMap` | 在场景中渲染一个 tmx 格式的 Tile Map |
| `TiledLayer` | 渲染 TMX layer |
| `TiledTile` | 地图块组件（管理单个 tile 坐标与 gid） |
| `TiledObjectGroup` | 渲染 tmx object group |
| `TiledMapAsset` | 获取 tiled map 资源类 |
| `TiledUserNodeData` | 用户节点数据组件 |
| 接口 | `ITiledLayerCullingRect` / `TiledRenderData` | 裁剪矩形 / 渲染数据 |
| 变量 | `tiledLayerAssembler` | 瓦片层装配器 |

### 27.2 重点类详解

#### TiledMap

在场景中渲染 TMX 地图（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tmxAsset` | TiledMapAsset | TiledMap 资源 |
| `enableCulling` | boolean | 是否开启裁剪 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getMapSize()` / `getTileSize()` / `getMapOrientation()` | `...` | 地图信息 |
| `getLayers()` / `getLayer(layerName)` | `...` | 图层获取 |
| `getObjectGroups()` / `getObjectGroup(groupName)` | `...` | 对象层获取 |
| `getProperty(propertyName)` / `getProperties()` / `getPropertiesForGID(gid)` | `...` | 属性查询 |
| `enableTexelOffset(enable)` | `enableTexelOffset(enable)` | 启用 / 禁用像素偏移修正 |
| `doCleanupImageCache(texture)` | `...` | 清理图片缓存 |

#### TiledLayer

渲染 TMX layer（继承 `UIRenderer`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `layerSize` | Size | 层大小 |
| `tiles` | number[] | 瓦片 gid 数据 |
| `tiledTiles` | (null \| TiledTile)[] | 瓦片对象数组 |
| `enableCulling` / `cullingRect` | boolean / Rect | 裁剪 |
| `texGrids` | null \| TiledTextureGrids | 纹理网格 |
| `renderOrder` | RenderOrder | 渲染顺序 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getTileGIDAt(x, y, flags?)` / `getTileFlagsAt(x, y)` | `...` | 获取瓦片 gid / flags |
| `setTileGIDAt(gid, x, y)` / `setTilesGIDAt(gids, x, y, ...)` | `...` | 设置瓦片 gid |
| `getTiledTileAt(x, y, forceCreate?)` / `setTiledTileAt(x, y, tiledTile)` | `...` | 瓦片对象获取 / 替换 |
| `getLayerSize()` / `getMapTileSize()` / `getLayerOrientation()` | `...` | 层信息 |
| `getPositionAt(...)` | `...` | 指定 tile 的像素坐标 |
| `getProperty(...)` / `getProperties()` | `...` | 属性 |
| `addUserNode(...)` / `removeUserNode(...)` / `destroyUserNode(...)` | `...` | 用户节点管理 |
| `updateViewPort()` / `updateCulling()` / `setCullingDirty()` | `...` | 裁剪相关 |

#### TiledTile

地图块组件（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `x` / `y` | number | tile 横 / 纵坐标 |
| `grid` | number | tile 的 gid 值 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `updateInfo()` | `updateInfo()` | 更新信息 |

#### TiledObjectGroup

渲染 tmx object group（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `offset` | Vec2 | 组偏移 |
| `premultiplyAlpha` | boolean | 是否预乘 Alpha |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getObjects()` | `getObjects(): TMXObject[]` | 获取对象数组 |
| `getObject(objectName)` | `getObject(objectName): null \| TMXObject` | 获取指定对象 |
| `getProperty(propertyName)` / `getProperties()` | `...` | 属性 |
| `getPositionOffset()` / `getGroupName()` | `...` | 偏移 / 组名 |

#### TiledMapAsset

获取 tiled map 资源类（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tmxXmlStr` | string | TMX XML 字符串 |
| `tsxFiles` / `tsxFileNames` | TextAsset[] / string[] | TSX 文件 |
| `spriteFrames` / `spriteFrameSizes` / `spriteFrameNames` | SpriteFrame[] / Size[] / string[] | 精灵帧数据 |
| `imageLayerSpriteFrame` / `imageLayerSpriteFrameNames` | SpriteFrame[] / string[] | 图片层精灵帧 |

> 说明：3.8 中对象类型为内部类型 `TMXObject`，动画类型为内部类型 `TiledAnimationType`（无独立 `TiledObject` / `TiledAnimation` 类）。

---

## 28. 地形（Terrain）

> 官方简介：地形系统以高效方式展示山川地貌，开发者可用画刷雕刻出盆地、山脉、峡谷、平原等地貌。模块页：`terrain-readme`。

### 28.1 类清单

| 类 | 说明 |
|---|---|
| `Terrain` | 地形组件 |
| `TerrainAsset` | 地形资源 |
| `TerrainBlock` / `TerrainBlockLightmapInfo` | 地形块 / 地形块光照图信息 |
| `TerrainInfo` | 地形信息 |
| `TerrainLayer` / `TerrainLayerInfo` / `TerrainLayerBinaryInfo` | 地形纹理层 / 纹理信息 / 纹理二进制信息 |
| `HeightField` | 高度图数据类 |
| 变量 | `TERRAIN_BLOCK_TILE_COMPLEXITY` / `TERRAIN_BLOCK_VERTEX_COMPLEXITY` / `TERRAIN_BLOCK_VERTEX_SIZE` | 地形块复杂度常量 |
| 变量 | `TERRAIN_HEIGHT_BASE` / `TERRAIN_HEIGHT_FACTORY` / `TERRAIN_HEIGHT_FMAX` / `TERRAIN_HEIGHT_FMIN` | 高度编解码常量 |
| 变量 | `TERRAIN_MAX_BLEND_LAYERS` / `TERRAIN_MAX_LAYER_COUNT` / `TERRAIN_MAX_LEVELS` | 最大混合层 / 最大层数 / 最大层级 |

### 28.2 重点类详解

#### Terrain

地形组件（继承 `Component`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `size` | Size | 地形大小 |
| `tileSize` / `tileCount` | number / number[] | 栅格大小 / 数量 |
| `vertexCount` | number[] | 顶点数量 |
| `blockCount` | number[] | 地形块数量 |
| `heights` | Uint16Array | 高度缓存 |
| `weights` | Uint8Array | 权重缓存 |
| `weightMapSize` / `lightMapSize` | number | 权重图 / 光照图大小 |
| `valid` | boolean | 是否有效 |
| `usePBR` / `useNormalMap` | boolean | PBR / 法线贴图 |
| `receiveShadow` / `lodEnable` / `LodBias` | boolean / boolean / number | 阴影 / LOD |
| `info` | TerrainInfo | 地形信息 |
| `effectAsset` | null \| EffectAsset | 地形特效资源 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `setHeight(i, j, h)` / `getHeight(i, j)` / `getHeightAt(x, y)` | `...` | 高度设置 / 获取 |
| `getHeightField()` / `importHeightField(hf, heightScale)` / `exportHeightField()` | `...` | 高度场 |
| `setWeight(i, j, w)` / `getWeight(i, j)` / `getWeightAt(x, y)` | `...` | 权重 |
| `addLayer(...)` / `setLayer(i, layer)` / `removeLayer(id)` / `getLayer(id)` | `...` | 纹理层管理 |
| `getPosition(i, j)` / `getNormal(i, j)` / `getNormalAt(x, y)` | `...` | 位置 / 法线 |
| `rayCheck(start, dir, step, worldSpace?)` | `rayCheck(...): null \| Vec2` | 射线检测 |
| `rebuild(info)` / `build()` | `...` | 重建 / 构建 |
| `exportAsset()` / `exportLayerListToAsset()` / `getEffectAsset()` | `...` | 资源导出 |

#### TerrainAsset

地形资源（继承 `Asset`）。

| 属性 | 类型 | 说明 |
|---|---|---|
| `version` | number | 版本 |
| `tileSize` | number | 栅格大小 |
| `heights` | Uint16Array / `normals` | Float32Array | 高度 / 法线缓存 |
| `weights` / `weightMapSize` / `lightMapSize` | Uint8Array / number / number | 权重与贴图大小 |
| `layerInfos` / `layerBuffer` / `layerBinaryInfos` | 数组 | 纹理层信息 |
| `blockCount` | number[] | 块数量 |

| 方法 | 签名 | 说明 |
|---|---|---|
| `getVertexCountI()` / `getVertexCountJ()` | `...` | 顶点数量 |
| `getLayer(xBlock, yBlock, layerId)` | `...` | 纹理索引 |
| `getHeight(i, j)` | `...` | 高度值 |

#### TerrainLayer

地形纹理层。

| 属性 | 类型 | 说明 |
|---|---|---|
| `tileSize` | number（默认 1） | 平铺大小 |
| `roughness` | number（默认 1） | 粗糙度 |
| `metallic` | number（默认 0） | 金属性 |
| `normalMap` / `detailMap` | null \| Texture2D | 法线 / 细节纹理 |

> 说明：3.8 中高度图类名为 `HeightField`（`Terrain.importHeightField(hf: HeightField, heightScale)`）。

---

## 29. 附录

### 29.1 模块与官方页面对照

| 模块 | 官方总览页 |
|---|---|
| 核心 | `core-readme` |
| 数学 | `math-readme` |
| 场景图 | `scene-graph-readme` |
| 2D 渲染 | `2d-rendering-readme` |
| 3D 渲染 | `3d-rendering-readme` |
| 用户界面 | `ui-readme` |
| 图形后端抽象 | `gfx-readme` |
| 渲染管线 | `render-pipeline-readme` |
| 资源 | `asset-readme` |
| 输入系统 | `input-system-readme` |
| 原生接口 | `native-interface-readme` |
| 动画 | `animation-readme` |
| 缓动系统 | `tween-readme` |
| 音频 | `audio-readme` |
| 视频 | `video-readme` |
| WebView | `webview-readme` |
| 物理系统 | `physics-system-readme` |
| 2D 物理系统 | `physics-system-2d-readme` |
| 粒子系统 | `particle-system-readme` |
| 2D 粒子系统 | `particle-system-2d-readme` |
| DragonBones | `dragonbones-readme` |
| Spine | `spine-readme` |
| 瓦片地图 | `tiled-map-readme` |
| 地形 | `terrain-readme` |
| 性能监控 | `profiler-readme` |
| 基础图元 | `primitive-readme` |

### 29.2 最常用 API 速查

| 需求 | 推荐 API |
|---|---|
| 节点创建与挂载 | `new Node(name)`、`node.addComponent(Comp)`、`node.setParent(parent)` |
| 场景切换 | `director.loadScene(name)` / `director.preloadScene(name)` |
| 资源加载 | `resources.load(path, type, cb)` / `assetManager.loadBundle(name, cb)` / `assetManager.loadRemote(url, cb)` |
| 输入监听 | `input.on(InputEventType.TOUCH_START, cb, target)` / `systemEvent.on(SystemEventType.KEY_DOWN, cb, target)` |
| 定时器 | `this.schedule(cb, interval)` / `director.getScheduler().schedule(...)` |
| 缓动 | `tween(node).to(duration, props).start()` |
| 播放动画 | `anim.getComponent(Animation).play(name)` / `crossFade(name, duration)` |
| 播放音频 | `audioSource.play()` / `playOneShot(clip, vol)` |
| 物理射线检测 | `PhysicsSystem.instance.raycast(ray)` / `raycastClosest(ray)` |
| 数学快速构造 | `v3(x,y,z)` / `quat.fromEuler(out, x, y, z)` / `mat4.perspective(out, fov, aspect, near, far)` |
| 节点坐标转换 | `node.setWorldPosition(v3)` / `camera.worldToScreen(worldPos)` |
| 调试输出 | `log/warn/error`、`profiler.showStats()` |
| 平台判断 | `sys.platform`、`NATIVE`（cc/env） |

### 29.3 已知未获取项汇总

以下条目因官方文档 3.8 版本不存在或详情页返回 404，未收录详情，本文档如实标注：

| 条目 | 说明 |
|---|---|
| `math.AffineTransform` 详情 | 仅保留总览用途描述 |
| `Graphics` / `Mask` / `RichText` / `ViewGroup` / `Model` 详情 | 官方详情页 404 |
| `AnimationComponent` / `AnimationEvent` / `CrossFade` / `ClipSettings` | 3.8 中不存在独立类 |
| `Audio` / `AudioPlayEvent` | 3.8 中并入 AudioSource / AudioClip |
| `WebViewImpl` | 引擎内部实现类，未公开 |
| `ParticleSystemRenderer` 及粒子模块类详情 | 仅作为 ParticleSystem 属性使用，无独立页面 |
| `CapsuleCollider2D` / `PhysicsMaterial2D` / `PhysicsRayCastResult2D` | 3.8 中不存在 |
| `Particle2D` | 3.8 中不存在 |
| `spine.SkeletonCacheMode` / `SpineAtlas` / `SpineCacheMode` / `SpineEventType` | 对应能力见 `sp` 命名空间枚举 / 变量 |
| `dragonBones.EventData` | 事件相关见 `DragonBonesEventType` 枚举与 ArmatureDisplay 事件接口 |
| `TiledObject` / `TiledAnimation` | 对应内部类型 `TMXObject` / `TiledAnimationType` |
| `TerrainHeightField` | 实际类名为 `HeightField` |

---

## 参考来源

本文档全部内容整理自 Cocos Creator 3.8 官方 API 文档（中文）：

- [Cocos Creator 3.8 API 文档首页](https://docs.cocos.com/creator/3.8/api/zh/)
- 26 个模块总览页（`core-readme`、`math-readme`、`scene-graph-readme`、`2d-rendering-readme`、`3d-rendering-readme`、`ui-readme`、`gfx-readme`、`render-pipeline-readme`、`asset-readme`、`input-system-readme`、`native-interface-readme`、`animation-readme`、`tween-readme`、`audio-readme`、`video-readme`、`webview-readme`、`physics-system-readme`、`physics-system-2d-readme`、`particle-system-readme`、`particle-system-2d-readme`、`dragonbones-readme`、`spine-readme`、`tiled-map-readme`、`terrain-readme`、`profiler-readme`、`primitive-readme`）
- 各重点类详情页（`class/XXX`、`class/math.XXX`、`class/physics.XXX`、`class/dragonBones.XXX`、`class/sp.spine.XXX` 等）

（文档完）
