# Godot 4.x API 完整参考手册

> 本文档整合自 [Godot 4.x 官方文档](https://docs.godotengine.org/zh-cn/4.x/classes/) 中所有类引用模块的完整内容。
>
> 涵盖全局类、核心基础类、节点类（2D/3D/UI/动画/音频）、资源类、数据类型、输入事件、形状资源和全局单例等 **200+** 个类的完整 API 参考。
>
> 每个类包含：继承链、描述、属性、方法、信号、枚举、常量、使用场景、示例代码和官方链接。
>
> 数据来源：[Godot 4.3 官方文档 GitHub RST 源文件](https://github.com/godotengine/godot-docs/tree/4.3/classes)
>
> 生成日期：2026-08-26

---

## 全部目录

- [第一部分：全局类与核心基础类](#第一部分全局类与核心基础类)
- [第二部分：节点类](#第二部分节点类)
- [第三部分：资源与数据类型](#第三部分资源与数据类型)

---

# 第一部分：全局类与核心基础类

> 涵盖 @GDScript、@GlobalScope、Object、Node、CanvasItem、Node2D、Node3D、Control、Viewport、Window、SceneTree、MainLoop、Engine 等核心类。

## 目录

### 全局类（Globals）
- [@GDScript](#gdscript) - GDScript 内置函数和注解
- [@GlobalScope](#globalscope) - 全局作用域

### 核心基础类
- [Object](#object)
- [RefCounted](#refcounted)
- [Node](#node)
- [CanvasItem](#canvasitem)
- [Node2D](#node2d)
- [Node3D](#node3d)
- [Control](#control)
- [Viewport](#viewport)
- [Window](#window)
- [SceneTree](#scenetree)
- [MainLoop](#mainloop)
- [Engine](#engine)

---

## @GDScript

**继承链：** 无（独立类/全局作用域）

**描述：** GDScript 内置函数、常量和注解的集合。

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `Color8` | `Color` | `r8: int, g8: int, b8: int, a8: int = 255` | - |
| `assert` | `void` | `condition: bool, message: String = ""` | - |
| `char` | `String` | `char: int` | - |
| `convert` | `Variant` | `what: Variant, type: int` | - |
| `dict_to_inst` | `Object` | `dictionary: Dictionary` | - |
| `get_stack` | `Array` | `()` | - |
| `inst_to_dict` | `Dictionary` | `instance: Object` | - |
| `is_instance_of` | `bool` | `value: Variant, type: Variant` | - |
| `len` | `int` | `var: Variant` | - |
| `load` | `Resource` | `path: String` | - |
| `preload` | `Resource` | `path: String` | - |
| `print_debug` | `void` | `...` | - |
| `print_stack` | `void` | `()` | - |
| `range` | `Array` | `...` | - |
| `type_exists` | `bool` | `type: StringName` | - |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `PI` | `3.14159265358979` | Constant that represents how many times the diameter of a circle fits around its perimeter. This is equivalent to `TAU / |
| `TAU` | `6.28318530717959` | The circle constant, the circumference of the unit circle in radians. This is equivalent to `PI * 2`, or 360 degrees in  |
| `INF` | `inf` | Positive floating-point infinity. This is the result of floating-point division when the divisor is `0.0`. For negative  |
| `NAN` | `nan` | "Not a Number", an invalid floating-point value. NAN has special properties, including that `!=` always returns `true`,  |

### 使用场景
在 GDScript 脚本中调用 `load()`、`print()`、`range()` 等函数，使用 `PI`、`TAU` 等常量，以及 `@export`、`@onready` 等注解。

### 示例代码
```gdscript
# 加载资源
var texture = load("res://icon.png")
var scene = preload("res://player.tscn")

# 使用常量
var angle = PI / 4  # 45度
var full_circle = TAU  # 360度

# 使用注解
@export var speed: float = 100.0
@onready var sprite = $Sprite2D

# 内置函数
print("Hello, Godot!")
var arr = range(0, 10, 2)  # [0, 2, 4, 6, 8]
```

### 官方链接
[@GDScript 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_%40GDScript.html)

---

## @GlobalScope

**继承链：** 无（独立类/全局作用域）

**描述：** 全局作用域，包含全局枚举、常量和函数。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `AudioServer` | `AudioServer` | `-` | - |
| `CameraServer` | `CameraServer` | `-` | - |
| `ClassDB` | `ClassDB` | `-` | - |
| `DisplayServer` | `DisplayServer` | `-` | - |
| `EditorInterface` | `EditorInterface` | `-` | - |
| `Engine` | `Engine` | `-` | - |
| `EngineDebugger` | `EngineDebugger` | `-` | - |
| `GDExtensionManager` | `GDExtensionManager` | `-` | - |
| `Geometry2D` | `Geometry2D` | `-` | - |
| `Geometry3D` | `Geometry3D` | `-` | - |
| `IP` | `IP` | `-` | - |
| `Input` | `Input` | `-` | - |
| `InputMap` | `InputMap` | `-` | - |
| `JavaClassWrapper` | `JavaClassWrapper` | `-` | - |
| `JavaScriptBridge` | `JavaScriptBridge` | `-` | - |
| `Marshalls` | `Marshalls` | `-` | - |
| `NativeMenu` | `NativeMenu` | `-` | - |
| `NavigationMeshGenerator` | `NavigationMeshGenerator` | `-` | - |
| `NavigationServer2D` | `NavigationServer2D` | `-` | - |
| `NavigationServer3D` | `NavigationServer3D` | `-` | - |
| `OS` | `OS` | `-` | - |
| `Performance` | `Performance` | `-` | - |
| `PhysicsServer2D` | `PhysicsServer2D` | `-` | - |
| `PhysicsServer2DManager` | `PhysicsServer2DManager` | `-` | - |
| `PhysicsServer3D` | `PhysicsServer3D` | `-` | - |
| `PhysicsServer3DManager` | `PhysicsServer3DManager` | `-` | - |
| `ProjectSettings` | `ProjectSettings` | `-` | - |
| `RenderingServer` | `RenderingServer` | `-` | - |
| `ResourceLoader` | `ResourceLoader` | `-` | - |
| `ResourceSaver` | `ResourceSaver` | `-` | - |
| `ResourceUID` | `ResourceUID` | `-` | - |
| `TextServerManager` | `TextServerManager` | `-` | - |
| `ThemeDB` | `ThemeDB` | `-` | - |
| `Time` | `Time` | `-` | - |
| `TranslationServer` | `TranslationServer` | `-` | - |
| `WorkerThreadPool` | `WorkerThreadPool` | `-` | - |
| `XRServer` | `XRServer` | `-` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `abs` | `Variant` | `x: Variant` | - |
| `absf` | `float` | `x: float` | - |
| `absi` | `int` | `x: int` | - |
| `acos` | `float` | `x: float` | - |
| `acosh` | `float` | `x: float` | - |
| `angle_difference` | `float` | `from: float, to: float` | - |
| `asin` | `float` | `x: float` | - |
| `asinh` | `float` | `x: float` | - |
| `atan` | `float` | `x: float` | - |
| `atan2` | `float` | `y: float, x: float` | - |
| `atanh` | `float` | `x: float` | - |
| `bezier_derivative` | `float` | `start: float, control_1: float, control_2: float, end: float, t: float` | - |
| `bezier_interpolate` | `float` | `start: float, control_1: float, control_2: float, end: float, t: float` | - |
| `bytes_to_var` | `Variant` | `bytes: PackedByteArray` | - |
| `bytes_to_var_with_objects` | `Variant` | `bytes: PackedByteArray` | - |
| `ceil` | `Variant` | `x: Variant` | - |
| `ceilf` | `float` | `x: float` | - |
| `ceili` | `int` | `x: float` | - |
| `clamp` | `Variant` | `value: Variant, min: Variant, max: Variant` | - |
| `clampf` | `float` | `value: float, min: float, max: float` | - |
| `clampi` | `int` | `value: int, min: int, max: int` | - |
| `cos` | `float` | `angle_rad: float` | - |
| `cosh` | `float` | `x: float` | - |
| `cubic_interpolate` | `float` | `from: float, to: float, pre: float, post: float, weight: float` | - |
| `cubic_interpolate_angle` | `float` | `from: float, to: float, pre: float, post: float, weight: float` | - |
| `cubic_interpolate_angle_in_time` | `float` | `from: float, to: float, pre: float, post: float, weight: float, to_t: float, pre_t: float, post_t: f` | - |
| `cubic_interpolate_in_time` | `float` | `from: float, to: float, pre: float, post: float, weight: float, to_t: float, pre_t: float, post_t: f` | - |
| `db_to_linear` | `float` | `db: float` | - |
| `deg_to_rad` | `float` | `deg: float` | - |
| `ease` | `float` | `x: float, curve: float` | - |
| `error_string` | `String` | `error: int` | - |
| `exp` | `float` | `x: float` | - |
| `floor` | `Variant` | `x: Variant` | - |
| `floorf` | `float` | `x: float` | - |
| `floori` | `int` | `x: float` | - |
| `fmod` | `float` | `x: float, y: float` | - |
| `fposmod` | `float` | `x: float, y: float` | - |
| `hash` | `int` | `variable: Variant` | - |
| `instance_from_id` | `Object` | `instance_id: int` | - |
| `inverse_lerp` | `float` | `from: float, to: float, weight: float` | - |
| `is_equal_approx` | `bool` | `a: float, b: float` | - |
| `is_finite` | `bool` | `x: float` | - |
| `is_inf` | `bool` | `x: float` | - |
| `is_instance_id_valid` | `bool` | `id: int` | - |
| `is_instance_valid` | `bool` | `instance: Variant` | - |
| `is_nan` | `bool` | `x: float` | - |
| `is_same` | `bool` | `a: Variant, b: Variant` | - |
| `is_zero_approx` | `bool` | `x: float` | - |
| `lerp` | `Variant` | `from: Variant, to: Variant, weight: Variant` | - |
| `lerp_angle` | `float` | `from: float, to: float, weight: float` | - |
| `lerpf` | `float` | `from: float, to: float, weight: float` | - |
| `linear_to_db` | `float` | `lin: float` | - |
| `log` | `float` | `x: float` | - |
| `max` | `Variant` | `...` | - |
| `maxf` | `float` | `a: float, b: float` | - |
| `maxi` | `int` | `a: int, b: int` | - |
| `min` | `Variant` | `...` | - |
| `minf` | `float` | `a: float, b: float` | - |
| `mini` | `int` | `a: int, b: int` | - |
| `move_toward` | `float` | `from: float, to: float, delta: float` | - |
| `nearest_po2` | `int` | `value: int` | - |
| `pingpong` | `float` | `value: float, length: float` | - |
| `posmod` | `int` | `x: int, y: int` | - |
| `pow` | `float` | `base: float, exp: float` | - |
| `print` | `void` | `...` | - |
| `print_rich` | `void` | `...` | - |
| `print_verbose` | `void` | `...` | - |
| `printerr` | `void` | `...` | - |
| `printraw` | `void` | `...` | - |
| `prints` | `void` | `...` | - |
| `printt` | `void` | `...` | - |
| `push_error` | `void` | `...` | - |
| `push_warning` | `void` | `...` | - |
| `rad_to_deg` | `float` | `rad: float` | - |
| `rand_from_seed` | `PackedInt64Array` | `seed: int` | - |
| `randf` | `float` | `()` | - |
| `randf_range` | `float` | `from: float, to: float` | - |
| `randfn` | `float` | `mean: float, deviation: float` | - |
| `randi` | `int` | `()` | - |
| `randi_range` | `int` | `from: int, to: int` | - |
| `randomize` | `void` | `()` | - |
| `remap` | `float` | `value: float, istart: float, istop: float, ostart: float, ostop: float` | - |
| `rid_allocate_id` | `int` | `()` | - |
| `rid_from_int64` | `RID` | `base: int` | - |
| `rotate_toward` | `float` | `from: float, to: float, delta: float` | - |
| `round` | `Variant` | `x: Variant` | - |
| `roundf` | `float` | `x: float` | - |
| `roundi` | `int` | `x: float` | - |
| `seed` | `void` | `base: int` | - |
| `sign` | `Variant` | `x: Variant` | - |
| `signf` | `float` | `x: float` | - |
| `signi` | `int` | `x: int` | - |
| `sin` | `float` | `angle_rad: float` | - |
| `sinh` | `float` | `x: float` | - |
| `smoothstep` | `float` | `from: float, to: float, x: float` | - |
| `snapped` | `Variant` | `x: Variant, step: Variant` | - |
| `snappedf` | `float` | `x: float, step: float` | - |
| `snappedi` | `int` | `x: float, step: int` | - |
| `sqrt` | `float` | `x: float` | - |
| `step_decimals` | `int` | `x: float` | - |
| ... | ... | ... | *共 114 个方法* |

### 枚举
#### Side
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SIDE_LEFT` | `0` | Left side, usually used for Control or StyleBox-derived classes. |
| `SIDE_TOP` | `1` | Top side, usually used for Control or StyleBox-derived classes. |
| `SIDE_RIGHT` | `2` | Right side, usually used for Control or StyleBox-derived classes. |
| `SIDE_BOTTOM` | `3` | Bottom side, usually used for Control or StyleBox-derived classes. |

#### Corner
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CORNER_TOP_LEFT` | `0` | Top-left corner. |
| `CORNER_TOP_RIGHT` | `1` | Top-right corner. |
| `CORNER_BOTTOM_RIGHT` | `2` | Bottom-right corner. |
| `CORNER_BOTTOM_LEFT` | `3` | Bottom-left corner. |

#### Orientation
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `VERTICAL` | `1` | General vertical alignment, usually used for Separator, ScrollBar, Slider, etc. |
| `HORIZONTAL` | `0` | General horizontal alignment, usually used for Separator, ScrollBar, Slider, etc. |

#### ClockDirection
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CLOCKWISE` | `0` | Clockwise rotation. Used by some methods (e.g. Image.rotate_90). |
| `COUNTERCLOCKWISE` | `1` | Counter-clockwise rotation. Used by some methods (e.g. Image.rotate_90). |

#### HorizontalAlignment
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `HORIZONTAL_ALIGNMENT_LEFT` | `0` | Horizontal left alignment, usually for text-derived classes. |
| `HORIZONTAL_ALIGNMENT_CENTER` | `1` | Horizontal center alignment, usually for text-derived classes. |
| `HORIZONTAL_ALIGNMENT_RIGHT` | `2` | Horizontal right alignment, usually for text-derived classes. |
| `HORIZONTAL_ALIGNMENT_FILL` | `3` | Expand row to fit width, usually for text-derived classes. |

#### VerticalAlignment
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `VERTICAL_ALIGNMENT_TOP` | `0` | Vertical top alignment, usually for text-derived classes. |
| `VERTICAL_ALIGNMENT_CENTER` | `1` | Vertical center alignment, usually for text-derived classes. |
| `VERTICAL_ALIGNMENT_BOTTOM` | `2` | Vertical bottom alignment, usually for text-derived classes. |
| `VERTICAL_ALIGNMENT_FILL` | `3` | Expand rows to fit height, usually for text-derived classes. |

#### InlineAlignment
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `INLINE_ALIGNMENT_TOP_TO` | `0` | Aligns the top of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. |
| `INLINE_ALIGNMENT_CENTER_TO` | `1` | Aligns the center of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. |
| `INLINE_ALIGNMENT_BASELINE_TO` | `3` | Aligns the baseline (user defined) of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. |
| `INLINE_ALIGNMENT_BOTTOM_TO` | `2` | Aligns the bottom of the inline object (e.g. image, table) to the position of the text specified by `INLINE_ALIGNMENT_TO_*` constant. |
| `INLINE_ALIGNMENT_TO_TOP` | `0` | Aligns the position of the inline object (e.g. image, table) specified by `INLINE_ALIGNMENT_*_TO` constant to the top of the text. |
| `INLINE_ALIGNMENT_TO_CENTER` | `4` | Aligns the position of the inline object (e.g. image, table) specified by `INLINE_ALIGNMENT_*_TO` constant to the center of the text. |
| `INLINE_ALIGNMENT_TO_BASELINE` | `8` | Aligns the position of the inline object (e.g. image, table) specified by `INLINE_ALIGNMENT_*_TO` constant to the baseline of the text. |
| `INLINE_ALIGNMENT_TO_BOTTOM` | `12` | Aligns inline object (e.g. image, table) to the bottom of the text. |
| `INLINE_ALIGNMENT_TOP` | `0` | Aligns top of the inline object (e.g. image, table) to the top of the text. Equivalent to `INLINE_ALIGNMENT_TOP_TO | INLINE_ALIGNMENT_TO_TOP`. |
| `INLINE_ALIGNMENT_CENTER` | `5` | Aligns center of the inline object (e.g. image, table) to the center of the text. Equivalent to `INLINE_ALIGNMENT_CENTER_TO | INLINE_ALIGNMENT_TO_CENT |
| `INLINE_ALIGNMENT_BOTTOM` | `14` | Aligns bottom of the inline object (e.g. image, table) to the bottom of the text. Equivalent to `INLINE_ALIGNMENT_BOTTOM_TO | INLINE_ALIGNMENT_TO_BOTT |
| `INLINE_ALIGNMENT_IMAGE_MASK` | `3` | A bit mask for `INLINE_ALIGNMENT_*_TO` alignment constants. |
| `INLINE_ALIGNMENT_TEXT_MASK` | `12` | A bit mask for `INLINE_ALIGNMENT_TO_*` alignment constants. |

#### EulerOrder
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `EULER_ORDER_XYZ` | `0` | Specifies that Euler angles should be in XYZ order. When composing, the order is X, Y, Z. When decomposing, the order is reversed, first Z, then Y, an |
| `EULER_ORDER_XZY` | `1` | Specifies that Euler angles should be in XZY order. When composing, the order is X, Z, Y. When decomposing, the order is reversed, first Y, then Z, an |
| `EULER_ORDER_YXZ` | `2` | Specifies that Euler angles should be in YXZ order. When composing, the order is Y, X, Z. When decomposing, the order is reversed, first Z, then X, an |
| `EULER_ORDER_YZX` | `3` | Specifies that Euler angles should be in YZX order. When composing, the order is Y, Z, X. When decomposing, the order is reversed, first X, then Z, an |
| `EULER_ORDER_ZXY` | `4` | Specifies that Euler angles should be in ZXY order. When composing, the order is Z, X, Y. When decomposing, the order is reversed, first Y, then X, an |
| `EULER_ORDER_ZYX` | `5` | Specifies that Euler angles should be in ZYX order. When composing, the order is Z, Y, X. When decomposing, the order is reversed, first X, then Y, an |

#### Key
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `KEY_NONE` | `0` | Enum value which doesn't correspond to any key. This is used to initialize Key properties with a generic state. |
| `KEY_SPECIAL` | `4194304` | Keycodes with this bit applied are non-printable. |
| `KEY_ESCAPE` | `4194305` | Escape key. |
| `KEY_TAB` | `4194306` | Tab key. |
| `KEY_BACKTAB` | `4194307` | Shift + Tab key. |
| `KEY_BACKSPACE` | `4194308` | Backspace key. |
| `KEY_ENTER` | `4194309` | Return key (on the main keyboard). |
| `KEY_KP_ENTER` | `4194310` | Enter key on the numeric keypad. |
| `KEY_INSERT` | `4194311` | Insert key. |
| `KEY_DELETE` | `4194312` | Delete key. |
| `KEY_PAUSE` | `4194313` | Pause key. |
| `KEY_PRINT` | `4194314` | Print Screen key. |
| `KEY_SYSREQ` | `4194315` | System Request key. |
| `KEY_CLEAR` | `4194316` | Clear key. |
| `KEY_HOME` | `4194317` | Home key. |
| `KEY_END` | `4194318` | End key. |
| `KEY_LEFT` | `4194319` | Left arrow key. |
| `KEY_UP` | `4194320` | Up arrow key. |
| `KEY_RIGHT` | `4194321` | Right arrow key. |
| `KEY_DOWN` | `4194322` | Down arrow key. |
| `KEY_PAGEUP` | `4194323` | Page Up key. |
| `KEY_PAGEDOWN` | `4194324` | Page Down key. |
| `KEY_SHIFT` | `4194325` | Shift key. |
| `KEY_CTRL` | `4194326` | Control key. |
| `KEY_META` | `4194327` | Meta key. |
| `KEY_ALT` | `4194328` | Alt key. |
| `KEY_CAPSLOCK` | `4194329` | Caps Lock key. |
| `KEY_NUMLOCK` | `4194330` | Num Lock key. |
| `KEY_SCROLLLOCK` | `4194331` | Scroll Lock key. |
| `KEY_F1` | `4194332` | F1 key. |
| `KEY_F2` | `4194333` | F2 key. |
| `KEY_F3` | `4194334` | F3 key. |
| `KEY_F4` | `4194335` | F4 key. |
| `KEY_F5` | `4194336` | F5 key. |
| `KEY_F6` | `4194337` | F6 key. |
| `KEY_F7` | `4194338` | F7 key. |
| `KEY_F8` | `4194339` | F8 key. |
| `KEY_F9` | `4194340` | F9 key. |
| `KEY_F10` | `4194341` | F10 key. |
| `KEY_F11` | `4194342` | F11 key. |
| `KEY_F12` | `4194343` | F12 key. |
| `KEY_F13` | `4194344` | F13 key. |
| `KEY_F14` | `4194345` | F14 key. |
| `KEY_F15` | `4194346` | F15 key. |
| `KEY_F16` | `4194347` | F16 key. |
| `KEY_F17` | `4194348` | F17 key. |
| `KEY_F18` | `4194349` | F18 key. |
| `KEY_F19` | `4194350` | F19 key. |
| `KEY_F20` | `4194351` | F20 key. |
| `KEY_F21` | `4194352` | F21 key. |
| `KEY_F22` | `4194353` | F22 key. |
| `KEY_F23` | `4194354` | F23 key. |
| `KEY_F24` | `4194355` | F24 key. |
| `KEY_F25` | `4194356` | F25 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F26` | `4194357` | F26 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F27` | `4194358` | F27 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F28` | `4194359` | F28 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F29` | `4194360` | F29 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F30` | `4194361` | F30 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F31` | `4194362` | F31 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F32` | `4194363` | F32 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F33` | `4194364` | F33 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F34` | `4194365` | F34 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_F35` | `4194366` | F35 key. Only supported on macOS and Linux due to a Windows limitation. |
| `KEY_KP_MULTIPLY` | `4194433` | Multiply (\*) key on the numeric keypad. |
| `KEY_KP_DIVIDE` | `4194434` | Divide (/) key on the numeric keypad. |
| `KEY_KP_SUBTRACT` | `4194435` | Subtract (-) key on the numeric keypad. |
| `KEY_KP_PERIOD` | `4194436` | Period (.) key on the numeric keypad. |
| `KEY_KP_ADD` | `4194437` | Add (+) key on the numeric keypad. |
| `KEY_KP_0` | `4194438` | Number 0 on the numeric keypad. |
| `KEY_KP_1` | `4194439` | Number 1 on the numeric keypad. |
| `KEY_KP_2` | `4194440` | Number 2 on the numeric keypad. |
| `KEY_KP_3` | `4194441` | Number 3 on the numeric keypad. |
| `KEY_KP_4` | `4194442` | Number 4 on the numeric keypad. |
| `KEY_KP_5` | `4194443` | Number 5 on the numeric keypad. |
| `KEY_KP_6` | `4194444` | Number 6 on the numeric keypad. |
| `KEY_KP_7` | `4194445` | Number 7 on the numeric keypad. |
| `KEY_KP_8` | `4194446` | Number 8 on the numeric keypad. |
| `KEY_KP_9` | `4194447` | Number 9 on the numeric keypad. |
| `KEY_MENU` | `4194370` | Context menu key. |
| `KEY_HYPER` | `4194371` | Hyper key. (On Linux/X11 only). |
| `KEY_HELP` | `4194373` | Help key. |
| `KEY_BACK` | `4194376` | Media back key. Not to be confused with the Back button on an Android device. |
| `KEY_FORWARD` | `4194377` | Media forward key. |
| `KEY_STOP` | `4194378` | Media stop key. |
| `KEY_REFRESH` | `4194379` | Media refresh key. |
| `KEY_VOLUMEDOWN` | `4194380` | Volume down key. |
| `KEY_VOLUMEMUTE` | `4194381` | Mute volume key. |
| `KEY_VOLUMEUP` | `4194382` | Volume up key. |
| `KEY_MEDIAPLAY` | `4194388` | Media play key. |
| `KEY_MEDIASTOP` | `4194389` | Media stop key. |
| `KEY_MEDIAPREVIOUS` | `4194390` | Previous song key. |
| `KEY_MEDIANEXT` | `4194391` | Next song key. |
| `KEY_MEDIARECORD` | `4194392` | Media record key. |
| `KEY_HOMEPAGE` | `4194393` | Home page key. |
| `KEY_FAVORITES` | `4194394` | Favorites key. |
| `KEY_SEARCH` | `4194395` | Search key. |
| `KEY_STANDBY` | `4194396` | Standby key. |
| `KEY_OPENURL` | `4194397` | Open URL / Launch Browser key. |
| `KEY_LAUNCHMAIL` | `4194398` | Launch Mail key. |
| `KEY_LAUNCHMEDIA` | `4194399` | Launch Media key. |
| `KEY_LAUNCH0` | `4194400` | Launch Shortcut 0 key. |
| `KEY_LAUNCH1` | `4194401` | Launch Shortcut 1 key. |
| `KEY_LAUNCH2` | `4194402` | Launch Shortcut 2 key. |
| `KEY_LAUNCH3` | `4194403` | Launch Shortcut 3 key. |
| `KEY_LAUNCH4` | `4194404` | Launch Shortcut 4 key. |
| `KEY_LAUNCH5` | `4194405` | Launch Shortcut 5 key. |
| `KEY_LAUNCH6` | `4194406` | Launch Shortcut 6 key. |
| `KEY_LAUNCH7` | `4194407` | Launch Shortcut 7 key. |
| `KEY_LAUNCH8` | `4194408` | Launch Shortcut 8 key. |
| `KEY_LAUNCH9` | `4194409` | Launch Shortcut 9 key. |
| `KEY_LAUNCHA` | `4194410` | Launch Shortcut A key. |
| `KEY_LAUNCHB` | `4194411` | Launch Shortcut B key. |
| `KEY_LAUNCHC` | `4194412` | Launch Shortcut C key. |
| `KEY_LAUNCHD` | `4194413` | Launch Shortcut D key. |
| `KEY_LAUNCHE` | `4194414` | Launch Shortcut E key. |
| `KEY_LAUNCHF` | `4194415` | Launch Shortcut F key. |
| `KEY_GLOBE` | `4194416` | "Globe" key on Mac / iPad keyboard. |
| `KEY_KEYBOARD` | `4194417` | "On-screen keyboard" key on iPad keyboard. |
| `KEY_JIS_EISU` | `4194418` | 英数 key on Mac keyboard. |
| `KEY_JIS_KANA` | `4194419` | かな key on Mac keyboard. |
| `KEY_UNKNOWN` | `8388607` | Unknown key. |
| `KEY_SPACE` | `32` | Space key. |
| `KEY_EXCLAM` | `33` | ! key. |
| `KEY_QUOTEDBL` | `34` | " key. |
| `KEY_NUMBERSIGN` | `35` | # key. |
| `KEY_DOLLAR` | `36` | $ key. |
| `KEY_PERCENT` | `37` | % key. |
| `KEY_AMPERSAND` | `38` | & key. |
| `KEY_APOSTROPHE` | `39` | ' key. |
| `KEY_PARENLEFT` | `40` | ( key. |
| `KEY_PARENRIGHT` | `41` | ) key. |
| `KEY_ASTERISK` | `42` | \* key. |
| `KEY_PLUS` | `43` | + key. |
| `KEY_COMMA` | `44` | , key. |
| `KEY_MINUS` | `45` | - key. |
| `KEY_PERIOD` | `46` | . key. |
| `KEY_SLASH` | `47` | / key. |
| `KEY_0` | `48` | Number 0 key. |
| `KEY_1` | `49` | Number 1 key. |
| `KEY_2` | `50` | Number 2 key. |
| `KEY_3` | `51` | Number 3 key. |
| `KEY_4` | `52` | Number 4 key. |
| `KEY_5` | `53` | Number 5 key. |
| `KEY_6` | `54` | Number 6 key. |
| `KEY_7` | `55` | Number 7 key. |
| `KEY_8` | `56` | Number 8 key. |
| `KEY_9` | `57` | Number 9 key. |
| `KEY_COLON` | `58` | : key. |
| `KEY_SEMICOLON` | `59` | ; key. |
| `KEY_LESS` | `60` | < key. |
| `KEY_EQUAL` | `61` | = key. |
| `KEY_GREATER` | `62` | > key. |
| `KEY_QUESTION` | `63` | ? key. |
| `KEY_AT` | `64` | @ key. |
| `KEY_A` | `65` | A key. |
| `KEY_B` | `66` | B key. |
| `KEY_C` | `67` | C key. |
| `KEY_D` | `68` | D key. |
| `KEY_E` | `69` | E key. |
| `KEY_F` | `70` | F key. |
| `KEY_G` | `71` | G key. |
| `KEY_H` | `72` | H key. |
| `KEY_I` | `73` | I key. |
| `KEY_J` | `74` | J key. |
| `KEY_K` | `75` | K key. |
| `KEY_L` | `76` | L key. |
| `KEY_M` | `77` | M key. |
| `KEY_N` | `78` | N key. |
| `KEY_O` | `79` | O key. |
| `KEY_P` | `80` | P key. |
| `KEY_Q` | `81` | Q key. |
| `KEY_R` | `82` | R key. |
| `KEY_S` | `83` | S key. |
| `KEY_T` | `84` | T key. |
| `KEY_U` | `85` | U key. |
| `KEY_V` | `86` | V key. |
| `KEY_W` | `87` | W key. |
| `KEY_X` | `88` | X key. |
| `KEY_Y` | `89` | Y key. |
| `KEY_Z` | `90` | Z key. |
| `KEY_BRACKETLEFT` | `91` | [ key. |
| `KEY_BACKSLASH` | `92` | \ key. |
| `KEY_BRACKETRIGHT` | `93` | ] key. |
| `KEY_ASCIICIRCUM` | `94` | ^ key. |
| `KEY_UNDERSCORE` | `95` | _ key. |
| `KEY_QUOTELEFT` | `96` | ` key. |
| `KEY_BRACELEFT` | `123` | { key. |
| `KEY_BAR` | `124` | | key. |
| `KEY_BRACERIGHT` | `125` | } key. |
| `KEY_ASCIITILDE` | `126` | ~ key. |
| `KEY_YEN` | `165` | ¥ key. |
| `KEY_SECTION` | `167` | § key. |

#### KeyModifierMask
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `KEY_CODE_MASK` | `8388607` | Key Code mask. |
| `KEY_MODIFIER_MASK` | `532676608` | Modifier key mask. |
| `KEY_MASK_CMD_OR_CTRL` | `16777216` | Automatically remapped to KEY_META on macOS and KEY_CTRL on other platforms, this mask is never set in the actual events, and should be used for key m |
| `KEY_MASK_SHIFT` | `33554432` | Shift key mask. |
| `KEY_MASK_ALT` | `67108864` | Alt or Option (on macOS) key mask. |
| `KEY_MASK_META` | `134217728` | Command (on macOS) or Meta/Windows key mask. |
| `KEY_MASK_CTRL` | `268435456` | Control key mask. |
| `KEY_MASK_KPAD` | `536870912` | Keypad key mask. |
| `KEY_MASK_GROUP_SWITCH` | `1073741824` | Group Switch key mask. |

#### KeyLocation
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `KEY_LOCATION_UNSPECIFIED` | `0` | Used for keys which only appear once, or when a comparison doesn't need to differentiate the `LEFT` and `RIGHT` versions. For example, when using Inpu |
| `KEY_LOCATION_LEFT` | `1` | A key which is to the left of its twin. |
| `KEY_LOCATION_RIGHT` | `2` | A key which is to the right of its twin. |

#### MouseButton
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `MOUSE_BUTTON_NONE` | `0` | Enum value which doesn't correspond to any mouse button. This is used to initialize MouseButton properties with a generic state. |
| `MOUSE_BUTTON_LEFT` | `1` | Primary mouse button, usually assigned to the left button. |
| `MOUSE_BUTTON_RIGHT` | `2` | Secondary mouse button, usually assigned to the right button. |
| `MOUSE_BUTTON_MIDDLE` | `3` | Middle mouse button. |
| `MOUSE_BUTTON_WHEEL_UP` | `4` | Mouse wheel scrolling up. |
| `MOUSE_BUTTON_WHEEL_DOWN` | `5` | Mouse wheel scrolling down. |
| `MOUSE_BUTTON_WHEEL_LEFT` | `6` | Mouse wheel left button (only present on some mice). |
| `MOUSE_BUTTON_WHEEL_RIGHT` | `7` | Mouse wheel right button (only present on some mice). |
| `MOUSE_BUTTON_XBUTTON1` | `8` | Extra mouse button 1. This is sometimes present, usually to the sides of the mouse. |
| `MOUSE_BUTTON_XBUTTON2` | `9` | Extra mouse button 2. This is sometimes present, usually to the sides of the mouse. |

#### MouseButtonMask
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `MOUSE_BUTTON_MASK_LEFT` | `1` | Primary mouse button mask, usually for the left button. |
| `MOUSE_BUTTON_MASK_RIGHT` | `2` | Secondary mouse button mask, usually for the right button. |
| `MOUSE_BUTTON_MASK_MIDDLE` | `4` | Middle mouse button mask. |
| `MOUSE_BUTTON_MASK_MB_XBUTTON1` | `128` | Extra mouse button 1 mask. |
| `MOUSE_BUTTON_MASK_MB_XBUTTON2` | `256` | Extra mouse button 2 mask. |

#### JoyButton
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `JOY_BUTTON_INVALID` | `-1` | An invalid game controller button. |
| `JOY_BUTTON_A` | `0` | Game controller SDL button A. Corresponds to the bottom action button: Sony Cross, Xbox A, Nintendo B. |
| `JOY_BUTTON_B` | `1` | Game controller SDL button B. Corresponds to the right action button: Sony Circle, Xbox B, Nintendo A. |
| `JOY_BUTTON_X` | `2` | Game controller SDL button X. Corresponds to the left action button: Sony Square, Xbox X, Nintendo Y. |
| `JOY_BUTTON_Y` | `3` | Game controller SDL button Y. Corresponds to the top action button: Sony Triangle, Xbox Y, Nintendo X. |
| `JOY_BUTTON_BACK` | `4` | Game controller SDL back button. Corresponds to the Sony Select, Xbox Back, Nintendo - button. |
| `JOY_BUTTON_GUIDE` | `5` | Game controller SDL guide button. Corresponds to the Sony PS, Xbox Home button. |
| `JOY_BUTTON_START` | `6` | Game controller SDL start button. Corresponds to the Sony Options, Xbox Menu, Nintendo + button. |
| `JOY_BUTTON_LEFT_STICK` | `7` | Game controller SDL left stick button. Corresponds to the Sony L3, Xbox L/LS button. |
| `JOY_BUTTON_RIGHT_STICK` | `8` | Game controller SDL right stick button. Corresponds to the Sony R3, Xbox R/RS button. |
| `JOY_BUTTON_LEFT_SHOULDER` | `9` | Game controller SDL left shoulder button. Corresponds to the Sony L1, Xbox LB button. |
| `JOY_BUTTON_RIGHT_SHOULDER` | `10` | Game controller SDL right shoulder button. Corresponds to the Sony R1, Xbox RB button. |
| `JOY_BUTTON_DPAD_UP` | `11` | Game controller D-pad up button. |
| `JOY_BUTTON_DPAD_DOWN` | `12` | Game controller D-pad down button. |
| `JOY_BUTTON_DPAD_LEFT` | `13` | Game controller D-pad left button. |
| `JOY_BUTTON_DPAD_RIGHT` | `14` | Game controller D-pad right button. |
| `JOY_BUTTON_MISC1` | `15` | Game controller SDL miscellaneous button. Corresponds to Xbox share button, PS5 microphone button, Nintendo Switch capture button. |
| `JOY_BUTTON_PADDLE1` | `16` | Game controller SDL paddle 1 button. |
| `JOY_BUTTON_PADDLE2` | `17` | Game controller SDL paddle 2 button. |
| `JOY_BUTTON_PADDLE3` | `18` | Game controller SDL paddle 3 button. |
| `JOY_BUTTON_PADDLE4` | `19` | Game controller SDL paddle 4 button. |
| `JOY_BUTTON_TOUCHPAD` | `20` | Game controller SDL touchpad button. |
| `JOY_BUTTON_SDL_MAX` | `21` | The number of SDL game controller buttons. |
| `JOY_BUTTON_MAX` | `128` | The maximum number of game controller buttons supported by the engine. The actual limit may be lower on specific platforms: - Android: Up to 36 button |

#### JoyAxis
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `JOY_AXIS_INVALID` | `-1` | An invalid game controller axis. |
| `JOY_AXIS_LEFT_X` | `0` | Game controller left joystick x-axis. |
| `JOY_AXIS_LEFT_Y` | `1` | Game controller left joystick y-axis. |
| `JOY_AXIS_RIGHT_X` | `2` | Game controller right joystick x-axis. |
| `JOY_AXIS_RIGHT_Y` | `3` | Game controller right joystick y-axis. |
| `JOY_AXIS_TRIGGER_LEFT` | `4` | Game controller left trigger axis. |
| `JOY_AXIS_TRIGGER_RIGHT` | `5` | Game controller right trigger axis. |
| `JOY_AXIS_SDL_MAX` | `6` | The number of SDL game controller axes. |
| `JOY_AXIS_MAX` | `10` | The maximum number of game controller axes: OpenVR supports up to 5 Joysticks making a total of 10 axes. |

#### MIDIMessage
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `MIDI_MESSAGE_NONE` | `0` | Does not correspond to any MIDI message. This is the default value of InputEventMIDI.message. |
| `MIDI_MESSAGE_NOTE_OFF` | `8` | MIDI message sent when a note is released. Note: Not all MIDI devices send this message; some may send MIDI_MESSAGE_NOTE_ON with InputEventMIDI.veloci |
| `MIDI_MESSAGE_NOTE_ON` | `9` | MIDI message sent when a note is pressed. |
| `MIDI_MESSAGE_AFTERTOUCH` | `10` | MIDI message sent to indicate a change in pressure while a note is being pressed down, also called aftertouch. |
| `MIDI_MESSAGE_CONTROL_CHANGE` | `11` | MIDI message sent when a controller value changes. In a MIDI device, a controller is any input that doesn't play notes. These may include sliders for  |
| `MIDI_MESSAGE_PROGRAM_CHANGE` | `12` | MIDI message sent when the MIDI device changes its current instrument (also called *program* or *preset*). |
| `MIDI_MESSAGE_CHANNEL_PRESSURE` | `13` | MIDI message sent to indicate a change in pressure for the whole channel. Some MIDI devices may send this instead of MIDI_MESSAGE_AFTERTOUCH. |
| `MIDI_MESSAGE_PITCH_BEND` | `14` | MIDI message sent when the value of the pitch bender changes, usually a wheel on the MIDI device. |
| `MIDI_MESSAGE_SYSTEM_EXCLUSIVE` | `240` | MIDI system exclusive (SysEx) message. This type of message is not standardized and it's highly dependent on the MIDI device sending it. Note: Getting |
| `MIDI_MESSAGE_QUARTER_FRAME` | `241` | MIDI message sent every quarter frame to keep connected MIDI devices synchronized. Related to MIDI_MESSAGE_TIMING_CLOCK. Note: Getting this message's  |
| `MIDI_MESSAGE_SONG_POSITION_POINTER` | `242` | MIDI message sent to jump onto a new position in the current sequence or song. Note: Getting this message's data from InputEventMIDI is not implemente |
| `MIDI_MESSAGE_SONG_SELECT` | `243` | MIDI message sent to select a sequence or song to play. Note: Getting this message's data from InputEventMIDI is not implemented. |
| `MIDI_MESSAGE_TUNE_REQUEST` | `246` | MIDI message sent to request a tuning calibration. Used on analog synthesizers. Most modern MIDI devices do not need this message. |
| `MIDI_MESSAGE_TIMING_CLOCK` | `248` | MIDI message sent 24 times after MIDI_MESSAGE_QUARTER_FRAME, to keep connected MIDI devices synchronized. |
| `MIDI_MESSAGE_START` | `250` | MIDI message sent to start the current sequence or song from the beginning. |
| `MIDI_MESSAGE_CONTINUE` | `251` | MIDI message sent to resume from the point the current sequence or song was paused. |
| `MIDI_MESSAGE_STOP` | `252` | MIDI message sent to pause the current sequence or song. |
| `MIDI_MESSAGE_ACTIVE_SENSING` | `254` | MIDI message sent repeatedly while the MIDI device is idle, to tell the receiver that the connection is alive. Most MIDI devices do not send this mess |
| `MIDI_MESSAGE_SYSTEM_RESET` | `255` | MIDI message sent to reset a MIDI device to its default state, as if it was just turned on. It should not be sent when the MIDI device is being turned |

#### Error
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `OK` | `0` | Methods that return Error return OK when no error occurred. Since OK has value 0, and all other error constants are positive integers, it can also be  |
| `FAILED` | `1` | Generic error. |
| `ERR_UNAVAILABLE` | `2` | Unavailable error. |
| `ERR_UNCONFIGURED` | `3` | Unconfigured error. |
| `ERR_UNAUTHORIZED` | `4` | Unauthorized error. |
| `ERR_PARAMETER_RANGE_ERROR` | `5` | Parameter range error. |
| `ERR_OUT_OF_MEMORY` | `6` | Out of memory (OOM) error. |
| `ERR_FILE_NOT_FOUND` | `7` | File: Not found error. |
| `ERR_FILE_BAD_DRIVE` | `8` | File: Bad drive error. |
| `ERR_FILE_BAD_PATH` | `9` | File: Bad path error. |
| `ERR_FILE_NO_PERMISSION` | `10` | File: No permission error. |
| `ERR_FILE_ALREADY_IN_USE` | `11` | File: Already in use error. |
| `ERR_FILE_CANT_OPEN` | `12` | File: Can't open error. |
| `ERR_FILE_CANT_WRITE` | `13` | File: Can't write error. |
| `ERR_FILE_CANT_READ` | `14` | File: Can't read error. |
| `ERR_FILE_UNRECOGNIZED` | `15` | File: Unrecognized error. |
| `ERR_FILE_CORRUPT` | `16` | File: Corrupt error. |
| `ERR_FILE_MISSING_DEPENDENCIES` | `17` | File: Missing dependencies error. |
| `ERR_FILE_EOF` | `18` | File: End of file (EOF) error. |
| `ERR_CANT_OPEN` | `19` | Can't open error. |
| `ERR_CANT_CREATE` | `20` | Can't create error. |
| `ERR_QUERY_FAILED` | `21` | Query failed error. |
| `ERR_ALREADY_IN_USE` | `22` | Already in use error. |
| `ERR_LOCKED` | `23` | Locked error. |
| `ERR_TIMEOUT` | `24` | Timeout error. |
| `ERR_CANT_CONNECT` | `25` | Can't connect error. |
| `ERR_CANT_RESOLVE` | `26` | Can't resolve error. |
| `ERR_CONNECTION_ERROR` | `27` | Connection error. |
| `ERR_CANT_ACQUIRE_RESOURCE` | `28` | Can't acquire resource error. |
| `ERR_CANT_FORK` | `29` | Can't fork process error. |
| `ERR_INVALID_DATA` | `30` | Invalid data error. |
| `ERR_INVALID_PARAMETER` | `31` | Invalid parameter error. |
| `ERR_ALREADY_EXISTS` | `32` | Already exists error. |
| `ERR_DOES_NOT_EXIST` | `33` | Does not exist error. |
| `ERR_DATABASE_CANT_READ` | `34` | Database: Read error. |
| `ERR_DATABASE_CANT_WRITE` | `35` | Database: Write error. |
| `ERR_COMPILATION_FAILED` | `36` | Compilation failed error. |
| `ERR_METHOD_NOT_FOUND` | `37` | Method not found error. |
| `ERR_LINK_FAILED` | `38` | Linking failed error. |
| `ERR_SCRIPT_FAILED` | `39` | Script failed error. |
| `ERR_CYCLIC_LINK` | `40` | Cycling link (import cycle) error. |
| `ERR_INVALID_DECLARATION` | `41` | Invalid declaration error. |
| `ERR_DUPLICATE_SYMBOL` | `42` | Duplicate symbol error. |
| `ERR_PARSE_ERROR` | `43` | Parse error. |
| `ERR_BUSY` | `44` | Busy error. |
| `ERR_SKIP` | `45` | Skip error. |
| `ERR_HELP` | `46` | Help error. Used internally when passing `--version` or `--help` as executable options. |
| `ERR_BUG` | `47` | Bug error, caused by an implementation issue in the method. Note: If a built-in method returns this code, please open an issue on `the GitHub Issue Tr |
| `ERR_PRINTER_ON_FIRE` | `48` | Printer on fire error (This is an easter egg, no built-in methods return this error code). |

#### PropertyHint
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PROPERTY_HINT_NONE` | `0` | The property has no hint for the editor. |
| `PROPERTY_HINT_RANGE` | `1` | Hints that an int or float property should be within a range specified via the hint string `"min,max"` or `"min,max,step"`. The hint string can option |
| `PROPERTY_HINT_ENUM` | `2` | Hints that an int or String property is an enumerated value to pick in a list specified via a hint string. The hint string is a comma separated list o |
| `PROPERTY_HINT_ENUM_SUGGESTION` | `3` | Hints that a String property can be an enumerated value to pick in a list specified via a hint string such as `"Hello,Something,Else"`. Unlike PROPERT |
| `PROPERTY_HINT_EXP_EASING` | `4` | Hints that a float property should be edited via an exponential easing function. The hint string can include `"attenuation"` to flip the curve horizon |
| `PROPERTY_HINT_LINK` | `5` | Hints that a vector property should allow its components to be linked. For example, this allows Vector2.x and Vector2.y to be edited together. |
| `PROPERTY_HINT_FLAGS` | `6` | Hints that an int property is a bitmask with named bit flags. The hint string is a comma separated list of names such as `"Bit0,Bit1,Bit2,Bit3"`. Whit |
| `PROPERTY_HINT_LAYERS_2D_RENDER` | `7` | Hints that an int property is a bitmask using the optionally named 2D render layers. |
| `PROPERTY_HINT_LAYERS_2D_PHYSICS` | `8` | Hints that an int property is a bitmask using the optionally named 2D physics layers. |
| `PROPERTY_HINT_LAYERS_2D_NAVIGATION` | `9` | Hints that an int property is a bitmask using the optionally named 2D navigation layers. |
| `PROPERTY_HINT_LAYERS_3D_RENDER` | `10` | Hints that an int property is a bitmask using the optionally named 3D render layers. |
| `PROPERTY_HINT_LAYERS_3D_PHYSICS` | `11` | Hints that an int property is a bitmask using the optionally named 3D physics layers. |
| `PROPERTY_HINT_LAYERS_3D_NAVIGATION` | `12` | Hints that an int property is a bitmask using the optionally named 3D navigation layers. |
| `PROPERTY_HINT_LAYERS_AVOIDANCE` | `37` | Hints that an integer property is a bitmask using the optionally named avoidance layers. |
| `PROPERTY_HINT_FILE` | `13` | Hints that a String property is a path to a file. Editing it will show a file dialog for picking the path. The hint string can be a set of filters wit |
| `PROPERTY_HINT_DIR` | `14` | Hints that a String property is a path to a directory. Editing it will show a file dialog for picking the path. |
| `PROPERTY_HINT_GLOBAL_FILE` | `15` | Hints that a String property is an absolute path to a file outside the project folder. Editing it will show a file dialog for picking the path. The hi |
| `PROPERTY_HINT_GLOBAL_DIR` | `16` | Hints that a String property is an absolute path to a directory outside the project folder. Editing it will show a file dialog for picking the path. |
| `PROPERTY_HINT_RESOURCE_TYPE` | `17` | Hints that a property is an instance of a Resource-derived type, optionally specified via the hint string (e.g. `"Texture2D"`). Editing it will show a |
| `PROPERTY_HINT_MULTILINE_TEXT` | `18` | Hints that a String property is text with line breaks. Editing it will show a text input field where line breaks can be typed. |
| `PROPERTY_HINT_EXPRESSION` | `19` | Hints that a String property is an Expression. |
| `PROPERTY_HINT_PLACEHOLDER_TEXT` | `20` | Hints that a String property should show a placeholder text on its input field, if empty. The hint string is the placeholder text to use. |
| `PROPERTY_HINT_COLOR_NO_ALPHA` | `21` | Hints that a Color property should be edited without affecting its transparency (Color.a is not editable). |
| `PROPERTY_HINT_OBJECT_ID` | `22` | Hints that the property's value is an object encoded as object ID, with its type specified in the hint string. Used by the debugger. |
| `PROPERTY_HINT_TYPE_STRING` | `23` | If a property is String, hints that the property represents a particular type (class). This allows to select a type from the create dialog. The proper |
| `PROPERTY_HINT_NODE_PATH_TO_EDITED_NODE` | `24` | Deprecated: This hint is not used by the engine. |
| `PROPERTY_HINT_OBJECT_TOO_BIG` | `25` | Hints that an object is too big to be sent via the debugger. |
| `PROPERTY_HINT_NODE_PATH_VALID_TYPES` | `26` | Hints that the hint string specifies valid node types for property of type NodePath. |
| `PROPERTY_HINT_SAVE_FILE` | `27` | Hints that a String property is a path to a file. Editing it will show a file dialog for picking the path for the file to be saved at. The dialog has  |
| `PROPERTY_HINT_GLOBAL_SAVE_FILE` | `28` | Hints that a String property is a path to a file. Editing it will show a file dialog for picking the path for the file to be saved at. The dialog has  |
| `PROPERTY_HINT_INT_IS_OBJECTID` | `29` | Deprecated: This hint is not used by the engine. |
| `PROPERTY_HINT_INT_IS_POINTER` | `30` | Hints that an int property is a pointer. Used by GDExtension. |
| `PROPERTY_HINT_ARRAY_TYPE` | `31` | Hints that a property is an Array with the stored type specified in the hint string. |
| `PROPERTY_HINT_LOCALE_ID` | `32` | Hints that a string property is a locale code. Editing it will show a locale dialog for picking language and country. |
| `PROPERTY_HINT_LOCALIZABLE_STRING` | `33` | Hints that a dictionary property is string translation map. Dictionary keys are locale codes and, values are translated strings. |
| `PROPERTY_HINT_NODE_TYPE` | `34` | Hints that a property is an instance of a Node-derived type, optionally specified via the hint string (e.g. `"Node2D"`). Editing it will show a dialog |
| `PROPERTY_HINT_HIDE_QUATERNION_EDIT` | `35` | Hints that a quaternion property should disable the temporary euler editor. |
| `PROPERTY_HINT_PASSWORD` | `36` | Hints that a string property is a password, and every character is replaced with the secret character. |
| `PROPERTY_HINT_MAX` | `38` | Represents the size of the PropertyHint enum. |

#### PropertyUsageFlags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PROPERTY_USAGE_NONE` | `0` | The property is not stored, and does not display in the editor. This is the default for non-exported properties. |
| `PROPERTY_USAGE_STORAGE` | `2` | The property is serialized and saved in the scene file (default for exported properties). |
| `PROPERTY_USAGE_EDITOR` | `4` | The property is shown in the EditorInspector (default for exported properties). |
| `PROPERTY_USAGE_INTERNAL` | `8` | The property is excluded from the class reference. |
| `PROPERTY_USAGE_CHECKABLE` | `16` | The property can be checked in the EditorInspector. |
| `PROPERTY_USAGE_CHECKED` | `32` | The property is checked in the EditorInspector. |
| `PROPERTY_USAGE_GROUP` | `64` | Used to group properties together in the editor. See EditorInspector. |
| `PROPERTY_USAGE_CATEGORY` | `128` | Used to categorize properties together in the editor. |
| `PROPERTY_USAGE_SUBGROUP` | `256` | Used to group properties together in the editor in a subgroup (under a group). See EditorInspector. |
| `PROPERTY_USAGE_CLASS_IS_BITFIELD` | `512` | The property is a bitfield, i.e. it contains multiple flags represented as bits. |
| `PROPERTY_USAGE_NO_INSTANCE_STATE` | `1024` | The property does not save its state in PackedScene. |
| `PROPERTY_USAGE_RESTART_IF_CHANGED` | `2048` | Editing the property prompts the user for restarting the editor. |
| `PROPERTY_USAGE_SCRIPT_VARIABLE` | `4096` | The property is a script variable which should be serialized and saved in the scene file. |
| `PROPERTY_USAGE_STORE_IF_NULL` | `8192` | The property value of type Object will be stored even if its value is `null`. |
| `PROPERTY_USAGE_UPDATE_ALL_IF_MODIFIED` | `16384` | If this property is modified, all inspector fields will be refreshed. |
| `PROPERTY_USAGE_SCRIPT_DEFAULT_VALUE` | `32768` | Deprecated: This flag is not used by the engine. |
| `PROPERTY_USAGE_CLASS_IS_ENUM` | `65536` | The property is an enum, i.e. it only takes named integer constants from its associated enumeration. |
| `PROPERTY_USAGE_NIL_IS_VARIANT` | `131072` | If property has `nil` as default value, its type will be Variant. |
| `PROPERTY_USAGE_ARRAY` | `262144` | The property is an array. |
| `PROPERTY_USAGE_ALWAYS_DUPLICATE` | `524288` | When duplicating a resource with Resource.duplicate, and this flag is set on a property of that resource, the property should always be duplicated, re |
| `PROPERTY_USAGE_NEVER_DUPLICATE` | `1048576` | When duplicating a resource with Resource.duplicate, and this flag is set on a property of that resource, the property should never be duplicated, reg |
| `PROPERTY_USAGE_HIGH_END_GFX` | `2097152` | The property is only shown in the editor if modern renderers are supported (the Compatibility rendering method is excluded). |
| `PROPERTY_USAGE_NODE_PATH_FROM_SCENE_ROOT` | `4194304` | The NodePath property will always be relative to the scene's root. Mostly useful for local resources. |
| `PROPERTY_USAGE_RESOURCE_NOT_PERSISTENT` | `8388608` | Use when a resource is created on the fly, i.e. the getter will always return a different instance. ResourceSaver needs this information to properly s |
| `PROPERTY_USAGE_KEYING_INCREMENTS` | `16777216` | Inserting an animation key frame of this property will automatically increment the value, allowing to easily keyframe multiple values in a row. |
| `PROPERTY_USAGE_DEFERRED_SET_RESOURCE` | `33554432` | Deprecated: This flag is not used by the engine. |
| `PROPERTY_USAGE_EDITOR_INSTANTIATE_OBJECT` | `67108864` | When this property is a Resource and base object is a Node, a resource instance will be automatically created whenever the node is created in the edit |
| `PROPERTY_USAGE_EDITOR_BASIC_SETTING` | `134217728` | The property is considered a basic setting and will appear even when advanced mode is disabled. Used for project settings. |
| `PROPERTY_USAGE_READ_ONLY` | `268435456` | The property is read-only in the EditorInspector. |
| `PROPERTY_USAGE_SECRET` | `536870912` | An export preset property with this flag contains confidential information and is stored separately from the rest of the export preset configuration. |
| `PROPERTY_USAGE_DEFAULT` | `6` | Default usage (storage and editor). |
| `PROPERTY_USAGE_NO_EDITOR` | `2` | Default usage but without showing the property in the editor (storage). |

#### MethodFlags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `METHOD_FLAG_NORMAL` | `1` | Flag for a normal method. |
| `METHOD_FLAG_EDITOR` | `2` | Flag for an editor method. |
| `METHOD_FLAG_CONST` | `4` | Flag for a constant method. |
| `METHOD_FLAG_VIRTUAL` | `8` | Flag for a virtual method. |
| `METHOD_FLAG_VARARG` | `16` | Flag for a method with a variable number of arguments. |
| `METHOD_FLAG_STATIC` | `32` | Flag for a static method. |
| `METHOD_FLAG_OBJECT_CORE` | `64` | Used internally. Allows to not dump core virtual methods (such as Object._notification) to the JSON API. |
| `METHOD_FLAGS_DEFAULT` | `1` | Default method flags (normal). |

### 使用场景
访问全局枚举（`OK`、`KEY_*`）和函数（`lerp()`、`clamp()`），使用引擎底层功能。

### 示例代码
```gdscript
# 全局枚举
if err == OK:
    print("成功")

# 全局函数
var value = lerp(0.0, 100.0, 0.5)  # 50.0
var clamped = clamp(speed, 0, MAX_SPEED)
var radians = deg_to_rad(45)

# 键盘输入常量
func _input(event):
    if event is InputEventKey:
        if event.keycode == KEY_SPACE:
            jump()
```

### 官方链接
[@GlobalScope 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_%40GlobalScope.html)

---

## Object

**继承链：** 无（独立类/全局作用域）

**描述：** 所有非基本数据类型的基类，提供信号系统、属性绑定、脚本扩展等核心功能。

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `_get` | `Variant` | `property: StringName` | - |
| `_get_property_list` | `Array\[Dictionary\]` | `()` | - |
| `_init` | `void` | `()` | - |
| `_notification` | `void` | `what: int` | - |
| `_property_can_revert` | `bool` | `property: StringName` | - |
| `_property_get_revert` | `Variant` | `property: StringName` | - |
| `_set` | `bool` | `property: StringName, value: Variant` | - |
| `_to_string` | `String` | `()` | - |
| `_validate_property` | `void` | `property: Dictionary` | - |
| `add_user_signal` | `void` | `signal: String, arguments: Array = []` | - |
| `call` | `Variant` | `method: StringName, ...` | - |
| `call_deferred` | `Variant` | `method: StringName, ...` | - |
| `callv` | `Variant` | `method: StringName, arg_array: Array` | - |
| `can_translate_messages` | `bool` | `()` | - |
| `cancel_free` | `void` | `()` | - |
| `connect` | `Error` | `signal: StringName, callable: Callable, flags: int = 0` | - |
| `disconnect` | `void` | `signal: StringName, callable: Callable` | - |
| `emit_signal` | `Error` | `signal: StringName, ...` | - |
| `free` | `void` | `()` | - |
| `get` | `Variant` | `property: StringName` | - |
| `get_class` | `String` | `()` | - |
| `get_incoming_connections` | `Array\[Dictionary\]` | `()` | - |
| `get_indexed` | `Variant` | `property_path: NodePath` | - |
| `get_instance_id` | `int` | `()` | - |
| `get_meta` | `Variant` | `name: StringName, default: Variant = null` | - |
| `get_meta_list` | `Array\[StringName\]` | `()` | - |
| `get_method_argument_count` | `int` | `method: StringName` | - |
| `get_method_list` | `Array\[Dictionary\]` | `()` | - |
| `get_property_list` | `Array\[Dictionary\]` | `()` | - |
| `get_script` | `Variant` | `()` | - |
| `get_signal_connection_list` | `Array\[Dictionary\]` | `signal: StringName` | - |
| `get_signal_list` | `Array\[Dictionary\]` | `()` | - |
| `has_meta` | `bool` | `name: StringName` | - |
| `has_method` | `bool` | `method: StringName` | - |
| `has_signal` | `bool` | `signal: StringName` | - |
| `has_user_signal` | `bool` | `signal: StringName` | - |
| `is_blocking_signals` | `bool` | `()` | - |
| `is_class` | `bool` | `class: String` | - |
| `is_connected` | `bool` | `signal: StringName, callable: Callable` | - |
| `is_queued_for_deletion` | `bool` | `()` | - |
| `notification` | `void` | `what: int, reversed: bool = false` | - |
| `notify_property_list_changed` | `void` | `()` | - |
| `property_can_revert` | `bool` | `property: StringName` | - |
| `property_get_revert` | `Variant` | `property: StringName` | - |
| `remove_meta` | `void` | `name: StringName` | - |
| `remove_user_signal` | `void` | `signal: StringName` | - |
| `set` | `void` | `property: StringName, value: Variant` | - |
| `set_block_signals` | `void` | `enable: bool` | - |
| `set_deferred` | `void` | `property: StringName, value: Variant` | - |
| `set_indexed` | `void` | `property_path: NodePath, value: Variant` | - |
| `set_message_translation` | `void` | `enable: bool` | - |
| `set_meta` | `void` | `name: StringName, value: Variant` | - |
| `set_script` | `void` | `script: Variant` | - |
| `to_string` | `String` | `()` | - |
| `tr` | `String` | `message: StringName, context: StringName = &""` | - |
| `tr_n` | `String` | `message: StringName, plural_message: StringName, n: int, context: StringName = &""` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `property_list_changed` | `-` | Emitted when notify_property_list_changed is called. |
| `script_changed` | `-` | Emitted when the object's script is changed. Note: When this signal is emitted, the new script is not initialized yet. If you need to access the new script, defer connections to this signal with... |

### 枚举
#### ConnectFlags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CONNECT_DEFERRED` | `1` | Deferred connections trigger their Callable s on idle time (at the end of the frame), rather than instantly. |
| `CONNECT_PERSIST` | `2` | Persisting connections are stored when the object is serialized (such as when using PackedScene.pack). In the editor, connections created through the  |
| `CONNECT_ONE_SHOT` | `4` | One-shot connections disconnect themselves after emission. |
| `CONNECT_REFERENCE_COUNTED` | `8` | Reference-counted connections can be assigned to the same Callable multiple times. Each disconnection decreases the internal counter. The signal fully |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_POSTINITIALIZE` | `0` | Notification received when the object is initialized, before its script is attached. Used internally. |
| `NOTIFICATION_PREDELETE` | `1` | Notification received when the object is about to be deleted. Can act as the deconstructor of some programming languages |
| `NOTIFICATION_EXTENSION_RELOADED` | `2` | Notification received when the object finishes hot reloading. This notification is only sent for extensions classes and  |

### 使用场景
创建自定义类、使用 `connect()`/`emit_signal()` 信号系统、动态属性访问、元数据存储等。

### 示例代码
```gdscript
# 信号连接
func _ready():
    button.connect("pressed", self._on_button_pressed)
    emit_signal("health_changed", current_health)

# 动态属性访问
obj.set("health", 100)
var hp = obj.get("health")

# 元数据
obj.set_meta("level", 5)
if obj.has_meta("level"):
    print(obj.get_meta("level"))
```

### 官方链接
[Object 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Object.html)

---

## RefCounted

**继承链：** Object

**描述：** 引用计数对象基类，当引用计数为零时自动释放内存。

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `get_reference_count` | `int` | `()` | - |
| `init_ref` | `bool` | `()` | - |
| `reference` | `bool` | `()` | - |
| `unreference` | `bool` | `()` | - |

### 使用场景
创建不需要手动管理内存的对象，Resource 类的基类。

### 官方链接
[RefCounted 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_RefCounted.html)

---

## Node

**继承链：** Object

**描述：** 场景树节点基类，是 Godot 场景系统的核心。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `auto_translate_mode` | `AutoTranslateMode` | ``0`` | - |
| `editor_description` | `String` | ``""`` | - |
| `multiplayer` | `MultiplayerAPI` | `-` | - |
| `name` | `StringName` | `-` | - |
| `owner` | `Node` | `-` | - |
| `physics_interpolation_mode` | `PhysicsInterpolationMode` | ``0`` | - |
| `process_mode` | `ProcessMode` | ``0`` | - |
| `process_physics_priority` | `int` | ``0`` | - |
| `process_priority` | `int` | ``0`` | - |
| `process_thread_group` | `ProcessThreadGroup` | ``0`` | - |
| `process_thread_group_order` | `int` | `-` | - |
| `\[ProcessThreadMessages\]` | `bitfield` | `process_thread_messages` | - |
| `scene_file_path` | `String` | `-` | - |
| `unique_name_in_owner` | `bool` | ``false`` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `_enter_tree` | `void` | `()` | - |
| `_exit_tree` | `void` | `()` | - |
| `_get_configuration_warnings` | `PackedStringArray` | `()` | - |
| `_input` | `void` | `event: InputEvent` | - |
| `_physics_process` | `void` | `delta: float` | - |
| `_process` | `void` | `delta: float` | - |
| `_ready` | `void` | `()` | - |
| `_shortcut_input` | `void` | `event: InputEvent` | - |
| `_unhandled_input` | `void` | `event: InputEvent` | - |
| `_unhandled_key_input` | `void` | `event: InputEvent` | - |
| `add_child` | `void` | `node: Node, force_readable_name: bool = false, internal: InternalMode = 0` | - |
| `add_sibling` | `void` | `sibling: Node, force_readable_name: bool = false` | - |
| `add_to_group` | `void` | `group: StringName, persistent: bool = false` | - |
| `atr` | `String` | `message: String, context: StringName = ""` | - |
| `atr_n` | `String` | `message: String, plural_message: StringName, n: int, context: StringName = ""` | - |
| `call_deferred_thread_group` | `Variant` | `method: StringName, ...` | - |
| `call_thread_safe` | `Variant` | `method: StringName, ...` | - |
| `can_process` | `bool` | `()` | - |
| `create_tween` | `Tween` | `()` | - |
| `duplicate` | `Node` | `flags: int = 15` | - |
| `find_child` | `Node` | `pattern: String, recursive: bool = true, owned: bool = true` | - |
| `find_children` | `Array\[Node\]` | `pattern: String, type: String = "", recursive: bool = true, owned: bool = true` | - |
| `find_parent` | `Node` | `pattern: String` | - |
| `get_child` | `Node` | `idx: int, include_internal: bool = false` | - |
| `get_child_count` | `int` | `include_internal: bool = false` | - |
| `get_children` | `Array\[Node\]` | `include_internal: bool = false` | - |
| `get_groups` | `Array\[StringName\]` | `()` | - |
| `get_index` | `int` | `include_internal: bool = false` | - |
| `get_last_exclusive_window` | `Window` | `()` | - |
| `get_multiplayer_authority` | `int` | `()` | - |
| `get_node` | `Node` | `path: NodePath` | - |
| `get_node_and_resource` | `Array` | `path: NodePath` | - |
| `get_node_or_null` | `Node` | `path: NodePath` | - |
| `get_parent` | `Node` | `()` | - |
| `get_path` | `NodePath` | `()` | - |
| `get_path_to` | `NodePath` | `node: Node, use_unique_path: bool = false` | - |
| `get_physics_process_delta_time` | `float` | `()` | - |
| `get_process_delta_time` | `float` | `()` | - |
| `get_scene_instance_load_placeholder` | `bool` | `()` | - |
| `get_tree` | `SceneTree` | `()` | - |
| `get_tree_string` | `String` | `()` | - |
| `get_tree_string_pretty` | `String` | `()` | - |
| `get_viewport` | `Viewport` | `()` | - |
| `get_window` | `Window` | `()` | - |
| `has_node` | `bool` | `path: NodePath` | - |
| `has_node_and_resource` | `bool` | `path: NodePath` | - |
| `is_ancestor_of` | `bool` | `node: Node` | - |
| `is_displayed_folded` | `bool` | `()` | - |
| `is_editable_instance` | `bool` | `node: Node` | - |
| `is_greater_than` | `bool` | `node: Node` | - |
| `is_in_group` | `bool` | `group: StringName` | - |
| `is_inside_tree` | `bool` | `()` | - |
| `is_multiplayer_authority` | `bool` | `()` | - |
| `is_node_ready` | `bool` | `()` | - |
| `is_part_of_edited_scene` | `bool` | `()` | - |
| `is_physics_interpolated` | `bool` | `()` | - |
| `is_physics_interpolated_and_enabled` | `bool` | `()` | - |
| `is_physics_processing` | `bool` | `()` | - |
| `is_physics_processing_internal` | `bool` | `()` | - |
| `is_processing` | `bool` | `()` | - |
| `is_processing_input` | `bool` | `()` | - |
| `is_processing_internal` | `bool` | `()` | - |
| `is_processing_shortcut_input` | `bool` | `()` | - |
| `is_processing_unhandled_input` | `bool` | `()` | - |
| `is_processing_unhandled_key_input` | `bool` | `()` | - |
| `move_child` | `void` | `child_node: Node, to_index: int` | - |
| `notify_deferred_thread_group` | `void` | `what: int` | - |
| `notify_thread_safe` | `void` | `what: int` | - |
| `print_orphan_nodes` | `void` | `()` | - |
| `print_tree` | `void` | `()` | - |
| `print_tree_pretty` | `void` | `()` | - |
| `propagate_call` | `void` | `method: StringName, args: Array = [], parent_first: bool = false` | - |
| `propagate_notification` | `void` | `what: int` | - |
| `queue_free` | `void` | `()` | - |
| `remove_child` | `void` | `node: Node` | - |
| `remove_from_group` | `void` | `group: StringName` | - |
| `reparent` | `void` | `new_parent: Node, keep_global_transform: bool = true` | - |
| `replace_by` | `void` | `node: Node, keep_groups: bool = false` | - |
| `request_ready` | `void` | `()` | - |
| `reset_physics_interpolation` | `void` | `()` | - |
| `rpc` | `Error` | `method: StringName, ...` | - |
| `rpc_config` | `void` | `method: StringName, config: Variant` | - |
| `rpc_id` | `Error` | `peer_id: int, method: StringName, ...` | - |
| `set_deferred_thread_group` | `void` | `property: StringName, value: Variant` | - |
| `set_display_folded` | `void` | `fold: bool` | - |
| `set_editable_instance` | `void` | `node: Node, is_editable: bool` | - |
| `set_multiplayer_authority` | `void` | `id: int, recursive: bool = true` | - |
| `set_physics_process` | `void` | `enable: bool` | - |
| `set_physics_process_internal` | `void` | `enable: bool` | - |
| `set_process` | `void` | `enable: bool` | - |
| `set_process_input` | `void` | `enable: bool` | - |
| `set_process_internal` | `void` | `enable: bool` | - |
| `set_process_shortcut_input` | `void` | `enable: bool` | - |
| `set_process_unhandled_input` | `void` | `enable: bool` | - |
| `set_process_unhandled_key_input` | `void` | `enable: bool` | - |
| `set_scene_instance_load_placeholder` | `void` | `load_placeholder: bool` | - |
| `set_thread_safe` | `void` | `property: StringName, value: Variant` | - |
| `update_configuration_warnings` | `void` | `()` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `child_entered_tree` | `node: Node` | Emitted when the child `node` enters the SceneTree, usually because this node entered the tree (see tree_entered), or add_child has been called. This signal is emitted *after* the child node's own... |
| `child_exiting_tree` | `node: Node` | Emitted when the child `node` is about to exit the SceneTree, usually because this node is exiting the tree (see tree_exiting), or because the child `node` is being removed or freed. When this signal... |
| `child_order_changed` | `-` | Emitted when the list of children is changed. This happens when child nodes are added, moved or removed. |
| `editor_description_changed` | `node: Node` | Emitted when the node's editor description field changed. |
| `ready` | `-` | Emitted when the node is considered ready, after _ready is called. |
| `renamed` | `-` | Emitted when the node's name is changed, if the node is inside the tree. |
| `replacing_by` | `node: Node` | Emitted when this node is being replaced by the `node`, see replace_by. This signal is emitted *after* `node` has been added as a child of the original parent node, but *before* all original child... |
| `tree_entered` | `-` | Emitted when the node enters the tree. This signal is emitted *after* the related NOTIFICATION_ENTER_TREE notification. |
| `tree_exited` | `-` | Emitted after the node exits the tree and is no longer active. This signal is emitted *after* the related NOTIFICATION_EXIT_TREE notification. |
| `tree_exiting` | `-` | Emitted when the node is just about to exit the tree. The node is still valid. As such, this is the right place for de-initialization (or a "destructor", if you will). This signal is emitted *after*... |

### 枚举
#### ProcessMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PROCESS_MODE_INHERIT` | `0` | Inherits process_mode from the node's parent. This is the default for any newly created node. |
| `PROCESS_MODE_PAUSABLE` | `1` | Stops processing when SceneTree.paused is `true`. This is the inverse of PROCESS_MODE_WHEN_PAUSED, and the default for the root node. |
| `PROCESS_MODE_WHEN_PAUSED` | `2` | Process only when SceneTree.paused is `true`. This is the inverse of PROCESS_MODE_PAUSABLE. |
| `PROCESS_MODE_ALWAYS` | `3` | Always process. Keeps processing, ignoring SceneTree.paused. This is the inverse of PROCESS_MODE_DISABLED. |
| `PROCESS_MODE_DISABLED` | `4` | Never process. Completely disables processing, ignoring SceneTree.paused. This is the inverse of PROCESS_MODE_ALWAYS. |

#### ProcessThreadGroup
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PROCESS_THREAD_GROUP_INHERIT` | `0` | Process this node based on the thread group mode of the first parent (or grandparent) node that has a thread group mode that is not inherit. See proce |
| `PROCESS_THREAD_GROUP_MAIN_THREAD` | `1` | Process this node (and child nodes set to inherit) on the main thread. See process_thread_group for more information. |
| `PROCESS_THREAD_GROUP_SUB_THREAD` | `2` | Process this node (and child nodes set to inherit) on a sub-thread. See process_thread_group for more information. |

#### ProcessThreadMessages
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `FLAG_PROCESS_THREAD_MESSAGES` | `1` | Allows this node to process threaded messages created with call_deferred_thread_group right before _process is called. |
| `FLAG_PROCESS_THREAD_MESSAGES_PHYSICS` | `2` | Allows this node to process threaded messages created with call_deferred_thread_group right before _physics_process is called. |
| `FLAG_PROCESS_THREAD_MESSAGES_ALL` | `3` | Allows this node to process threaded messages created with call_deferred_thread_group right before either _process or _physics_process are called. |

#### PhysicsInterpolationMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PHYSICS_INTERPOLATION_MODE_INHERIT` | `0` | Inherits physics_interpolation_mode from the node's parent. This is the default for any newly created node. |
| `PHYSICS_INTERPOLATION_MODE_ON` | `1` | Enables physics interpolation for this node and for children set to PHYSICS_INTERPOLATION_MODE_INHERIT. This is the default for the root node. |
| `PHYSICS_INTERPOLATION_MODE_OFF` | `2` | Disables physics interpolation for this node and for children set to PHYSICS_INTERPOLATION_MODE_INHERIT. |

#### DuplicateFlags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `DUPLICATE_SIGNALS` | `1` | Duplicate the node's signal connections. |
| `DUPLICATE_GROUPS` | `2` | Duplicate the node's groups. |
| `DUPLICATE_SCRIPTS` | `4` | Duplicate the node's script (also overriding the duplicated children's scripts, if combined with DUPLICATE_USE_INSTANTIATION). |
| `DUPLICATE_USE_INSTANTIATION` | `8` | Duplicate using PackedScene.instantiate. If the node comes from a scene saved on disk, re-uses PackedScene.instantiate as the base for the duplicated  |

#### InternalMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `INTERNAL_MODE_DISABLED` | `0` | The node will not be internal. |
| `INTERNAL_MODE_FRONT` | `1` | The node will be placed at the beginning of the parent's children, before any non-internal sibling. |
| `INTERNAL_MODE_BACK` | `2` | The node will be placed at the end of the parent's children, after any non-internal sibling. |

#### AutoTranslateMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `AUTO_TRANSLATE_MODE_INHERIT` | `0` | Inherits auto_translate_mode from the node's parent. This is the default for any newly created node. |
| `AUTO_TRANSLATE_MODE_ALWAYS` | `1` | Always automatically translate. This is the inverse of AUTO_TRANSLATE_MODE_DISABLED, and the default for the root node. |
| `AUTO_TRANSLATE_MODE_DISABLED` | `2` | Never automatically translate. This is the inverse of AUTO_TRANSLATE_MODE_ALWAYS. String parsing for POT generation will be skipped for this node and  |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_ENTER_TREE` | `10` | Notification received when the node enters a SceneTree. See _enter_tree. This notification is received *before* the rela |
| `NOTIFICATION_EXIT_TREE` | `11` | Notification received when the node is about to exit a SceneTree. See _exit_tree. This notification is received *after*  |
| `NOTIFICATION_MOVED_IN_PARENT` | `12` | Deprecated: This notification is no longer sent by the engine. Use NOTIFICATION_CHILD_ORDER_CHANGED instead. |
| `NOTIFICATION_READY` | `13` | Notification received when the node is ready. See _ready. |
| `NOTIFICATION_PAUSED` | `14` | Notification received when the node is paused. See process_mode. |
| `NOTIFICATION_UNPAUSED` | `15` | Notification received when the node is unpaused. See process_mode. |
| `NOTIFICATION_PHYSICS_PROCESS` | `16` | Notification received from the tree every physics frame when is_physics_processing returns `true`. See _physics_process. |
| `NOTIFICATION_PROCESS` | `17` | Notification received from the tree every rendered frame when is_processing returns `true`. See _process. |
| `NOTIFICATION_PARENTED` | `18` | Notification received when the node is set as a child of another node (see add_child and add_sibling). Note: This does * |
| `NOTIFICATION_UNPARENTED` | `19` | Notification received when the parent node calls remove_child on this node. Note: This does *not* mean that the node exi |
| `NOTIFICATION_SCENE_INSTANTIATED` | `20` | Notification received *only* by the newly instantiated scene root node, when PackedScene.instantiate is completed. |
| `NOTIFICATION_DRAG_BEGIN` | `21` | Notification received when a drag operation begins. All nodes receive this notification, not only the dragged one. Can b |
| `NOTIFICATION_DRAG_END` | `22` | Notification received when a drag operation ends. Use Viewport.gui_is_drag_successful to check if the drag succeeded. |
| `NOTIFICATION_PATH_RENAMED` | `23` | Notification received when the node's name or one of its ancestors' name is changed. This notification is *not* received |
| `NOTIFICATION_CHILD_ORDER_CHANGED` | `24` | Notification received when the list of children is changed. This happens when child nodes are added, moved or removed. |
| `NOTIFICATION_INTERNAL_PROCESS` | `25` | Notification received from the tree every rendered frame when is_processing_internal returns `true`. |
| `NOTIFICATION_INTERNAL_PHYSICS_PROCESS` | `26` | Notification received from the tree every physics frame when is_physics_processing_internal returns `true`. |
| `NOTIFICATION_POST_ENTER_TREE` | `27` | Notification received when the node enters the tree, just before NOTIFICATION_READY may be received. Unlike the latter,  |
| `NOTIFICATION_DISABLED` | `28` | Notification received when the node is disabled. See PROCESS_MODE_DISABLED. |
| `NOTIFICATION_ENABLED` | `29` | Notification received when the node is enabled again after being disabled. See PROCESS_MODE_DISABLED. |
| `NOTIFICATION_RESET_PHYSICS_INTERPOLATION` | `2001` | Notification received when reset_physics_interpolation is called on the node or its ancestors. |
| `NOTIFICATION_EDITOR_PRE_SAVE` | `9001` | Notification received right before the scene with the node is saved in the editor. This notification is only sent in the |
| `NOTIFICATION_EDITOR_POST_SAVE` | `9002` | Notification received right after the scene with the node is saved in the editor. This notification is only sent in the  |
| `NOTIFICATION_WM_MOUSE_ENTER` | `1002` | Notification received when the mouse enters the window. Implemented for embedded windows and on desktop and web platform |
| `NOTIFICATION_WM_MOUSE_EXIT` | `1003` | Notification received when the mouse leaves the window. Implemented for embedded windows and on desktop and web platform |
| `NOTIFICATION_WM_WINDOW_FOCUS_IN` | `1004` | Notification received from the OS when the node's Window ancestor is focused. This may be a change of focus between two  |
| `NOTIFICATION_WM_WINDOW_FOCUS_OUT` | `1005` | Notification received from the OS when the node's Window ancestor is defocused. This may be a change of focus between tw |
| `NOTIFICATION_WM_CLOSE_REQUEST` | `1006` | Notification received from the OS when a close request is sent (e.g. closing the window with a "Close" button or :kbd:`A |
| `NOTIFICATION_WM_GO_BACK_REQUEST` | `1007` | Notification received from the OS when a go back request is sent (e.g. pressing the "Back" button on Android). Implement |
| `NOTIFICATION_WM_SIZE_CHANGED` | `1008` | Notification received when the window is resized. Note: Only the resized Window node receives this notification, and it' |
| `NOTIFICATION_WM_DPI_CHANGE` | `1009` | Notification received from the OS when the screen's dots per inch (DPI) scale is changed. Only implemented on macOS. |
| `NOTIFICATION_VP_MOUSE_ENTER` | `1010` | Notification received when the mouse cursor enters the Viewport's visible area, that is not occluded behind other Contro |
| `NOTIFICATION_VP_MOUSE_EXIT` | `1011` | Notification received when the mouse cursor leaves the Viewport's visible area, that is not occluded behind other Contro |
| `NOTIFICATION_OS_MEMORY_WARNING` | `2009` | Notification received from the OS when the application is exceeding its allocated memory. Implemented only on iOS. |
| `NOTIFICATION_TRANSLATION_CHANGED` | `2010` | Notification received when translations may have changed. Can be triggered by the user changing the locale, changing aut |
| `NOTIFICATION_WM_ABOUT` | `2011` | Notification received from the OS when a request for "About" information is sent. Implemented only on macOS. |
| `NOTIFICATION_CRASH` | `2012` | Notification received from Godot's crash handler when the engine is about to crash. Implemented on desktop platforms, if |
| `NOTIFICATION_OS_IME_UPDATE` | `2013` | Notification received from the OS when an update of the Input Method Engine occurs (e.g. change of IME cursor position o |
| `NOTIFICATION_APPLICATION_RESUMED` | `2014` | Notification received from the OS when the application is resumed. Specific to the Android and iOS platforms. |
| `NOTIFICATION_APPLICATION_PAUSED` | `2015` | Notification received from the OS when the application is paused. Specific to the Android and iOS platforms. Note: On iO |
| `NOTIFICATION_APPLICATION_FOCUS_IN` | `2016` | Notification received from the OS when the application is focused, i.e. when changing the focus from the OS desktop or a |
| `NOTIFICATION_APPLICATION_FOCUS_OUT` | `2017` | Notification received from the OS when the application is defocused, i.e. when changing the focus from any open window o |
| `NOTIFICATION_TEXT_SERVER_CHANGED` | `2018` | Notification received when the TextServer is changed. |

### 使用场景
构建游戏场景的核心，通过 `add_child()`/`get_node()` 管理节点树，使用 `_ready()`/`_process()` 生命周期回调。

### 示例代码
```gdscript
# 节点生命周期
func _ready():
    print("节点已就绪")
    var child = get_node("Sprite2D")

func _process(delta):
    position.x += speed * delta

# 子节点管理
var new_node = Node2D.new()
add_child(new_node)
remove_child(new_node)

# 使用组
add_to_group("enemies")
get_tree().call_group("enemies", "take_damage", 10)
```

### 官方链接
[Node 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Node.html)

---

## CanvasItem

**继承链：** Node > Object

**描述：** 所有 2D 节点的基类，提供 2D 渲染和变换功能。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `clip_children` | `ClipChildrenMode` | ``0`` | - |
| `light_mask` | `int` | ``1`` | - |
| `material` | `Material` | `-` | - |
| `modulate` | `Color` | ``Color(1, 1, 1, 1)`` | - |
| `self_modulate` | `Color` | ``Color(1, 1, 1, 1)`` | - |
| `show_behind_parent` | `bool` | ``false`` | - |
| `texture_filter` | `TextureFilter` | ``0`` | - |
| `texture_repeat` | `TextureRepeat` | ``0`` | - |
| `top_level` | `bool` | ``false`` | - |
| `use_parent_material` | `bool` | ``false`` | - |
| `visibility_layer` | `int` | ``1`` | - |
| `visible` | `bool` | ``true`` | - |
| `y_sort_enabled` | `bool` | ``false`` | - |
| `z_as_relative` | `bool` | ``true`` | - |
| `z_index` | `int` | ``0`` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `_draw` | `void` | `()` | - |
| `draw_animation_slice` | `void` | `animation_length: float, slice_begin: float, slice_end: float, offset: float = 0.0` | - |
| `draw_arc` | `void` | `center: Vector2, radius: float, start_angle: float, end_angle: float, point_count: int, color: Color` | - |
| `draw_char` | `void` | `font: Font, pos: Vector2, char: String, font_size: int = 16, modulate: Color = Color(1, 1, 1, 1)` | - |
| `draw_char_outline` | `void` | `font: Font, pos: Vector2, char: String, font_size: int = 16, size: int = -1, modulate: Color = Color` | - |
| `draw_circle` | `void` | `position: Vector2, radius: float, color: Color, filled: bool = true, width: float = -1.0, antialiase` | - |
| `draw_colored_polygon` | `void` | `points: PackedVector2Array, color: Color, uvs: PackedVector2Array = PackedVector2Array(), texture: T` | - |
| `draw_dashed_line` | `void` | `from: Vector2, to: Vector2, color: Color, width: float = -1.0, dash: float = 2.0, aligned: bool = tr` | - |
| `draw_end_animation` | `void` | `()` | - |
| `draw_lcd_texture_rect_region` | `void` | `texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = Color(1, 1, 1, 1)` | - |
| `draw_line` | `void` | `from: Vector2, to: Vector2, color: Color, width: float = -1.0, antialiased: bool = false` | - |
| `draw_mesh` | `void` | `mesh: Mesh, texture: Texture2D, transform: Transform2D = Transform2D(1, 0, 0, 1, 0, 0), modulate: Co` | - |
| `draw_msdf_texture_rect_region` | `void` | `texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = Color(1, 1, 1, 1), outline: floa` | - |
| `draw_multiline` | `void` | `points: PackedVector2Array, color: Color, width: float = -1.0, antialiased: bool = false` | - |
| `draw_multiline_colors` | `void` | `points: PackedVector2Array, colors: PackedColorArray, width: float = -1.0, antialiased: bool = false` | - |
| `draw_multiline_string` | `void` | `font: Font, pos: Vector2, text: String, alignment: HorizontalAlignment = 0, width: float = -1, font_` | - |
| `draw_multiline_string_outline` | `void` | `font: Font, pos: Vector2, text: String, alignment: HorizontalAlignment = 0, width: float = -1, font_` | - |
| `draw_multimesh` | `void` | `multimesh: MultiMesh, texture: Texture2D` | - |
| `draw_polygon` | `void` | `points: PackedVector2Array, colors: PackedColorArray, uvs: PackedVector2Array = PackedVector2Array()` | - |
| `draw_polyline` | `void` | `points: PackedVector2Array, color: Color, width: float = -1.0, antialiased: bool = false` | - |
| `draw_polyline_colors` | `void` | `points: PackedVector2Array, colors: PackedColorArray, width: float = -1.0, antialiased: bool = false` | - |
| `draw_primitive` | `void` | `points: PackedVector2Array, colors: PackedColorArray, uvs: PackedVector2Array, texture: Texture2D = ` | - |
| `draw_rect` | `void` | `rect: Rect2, color: Color, filled: bool = true, width: float = -1.0, antialiased: bool = false` | - |
| `draw_set_transform` | `void` | `position: Vector2, rotation: float = 0.0, scale: Vector2 = Vector2(1, 1)` | - |
| `draw_set_transform_matrix` | `void` | `xform: Transform2D` | - |
| `draw_string` | `void` | `font: Font, pos: Vector2, text: String, alignment: HorizontalAlignment = 0, width: float = -1, font_` | - |
| `draw_string_outline` | `void` | `font: Font, pos: Vector2, text: String, alignment: HorizontalAlignment = 0, width: float = -1, font_` | - |
| `draw_style_box` | `void` | `style_box: StyleBox, rect: Rect2` | - |
| `draw_texture` | `void` | `texture: Texture2D, position: Vector2, modulate: Color = Color(1, 1, 1, 1)` | - |
| `draw_texture_rect` | `void` | `texture: Texture2D, rect: Rect2, tile: bool, modulate: Color = Color(1, 1, 1, 1), transpose: bool = ` | - |
| `draw_texture_rect_region` | `void` | `texture: Texture2D, rect: Rect2, src_rect: Rect2, modulate: Color = Color(1, 1, 1, 1), transpose: bo` | - |
| `force_update_transform` | `void` | `()` | - |
| `get_canvas` | `RID` | `()` | - |
| `get_canvas_item` | `RID` | `()` | - |
| `get_canvas_layer_node` | `CanvasLayer` | `()` | - |
| `get_canvas_transform` | `Transform2D` | `()` | - |
| `get_global_mouse_position` | `Vector2` | `()` | - |
| `get_global_transform` | `Transform2D` | `()` | - |
| `get_global_transform_with_canvas` | `Transform2D` | `()` | - |
| `get_local_mouse_position` | `Vector2` | `()` | - |
| `get_screen_transform` | `Transform2D` | `()` | - |
| `get_transform` | `Transform2D` | `()` | - |
| `get_viewport_rect` | `Rect2` | `()` | - |
| `get_viewport_transform` | `Transform2D` | `()` | - |
| `get_visibility_layer_bit` | `bool` | `layer: int` | - |
| `get_world_2d` | `World2D` | `()` | - |
| `hide` | `void` | `()` | - |
| `is_local_transform_notification_enabled` | `bool` | `()` | - |
| `is_transform_notification_enabled` | `bool` | `()` | - |
| `is_visible_in_tree` | `bool` | `()` | - |
| `make_canvas_position_local` | `Vector2` | `screen_point: Vector2` | - |
| `make_input_local` | `InputEvent` | `event: InputEvent` | - |
| `move_to_front` | `void` | `()` | - |
| `queue_redraw` | `void` | `()` | - |
| `set_notify_local_transform` | `void` | `enable: bool` | - |
| `set_notify_transform` | `void` | `enable: bool` | - |
| `set_visibility_layer_bit` | `void` | `layer: int, enabled: bool` | - |
| `show` | `void` | `()` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `draw` | `-` | Emitted when the CanvasItem must redraw, *after* the related NOTIFICATION_DRAW notification, and *before* _draw is called. Note: Deferred connections do not allow drawing through the `draw_*` methods. |
| `hidden` | `-` | Emitted when becoming hidden. |
| `item_rect_changed` | `-` | Emitted when the item's Rect2 boundaries (position or size) have changed, or when an action is taking place that may have impacted these boundaries (e.g. changing Sprite2D.texture). |
| `visibility_changed` | `-` | Emitted when the visibility (hidden/visible) changes. |

### 枚举
#### TextureFilter
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `TEXTURE_FILTER_PARENT_NODE` | `0` | The CanvasItem will inherit the filter from its parent. |
| `TEXTURE_FILTER_NEAREST` | `1` | The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps  |
| `TEXTURE_FILTER_LINEAR` | `2` | The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps n |
| `TEXTURE_FILTER_NEAREST_WITH_MIPMAPS` | `3` | The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if ProjectSettings.rendering/text |
| `TEXTURE_FILTER_LINEAR_WITH_MIPMAPS` | `4` | The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if ProjectSettings.rendering/text |
| `TEXTURE_FILTER_NEAREST_WITH_MIPMAPS_ANISOTROPIC` | `5` | The texture filter reads from the nearest pixel and blends between 2 mipmaps (or uses the nearest mipmap if ProjectSettings.rendering/textures/default |
| `TEXTURE_FILTER_LINEAR_WITH_MIPMAPS_ANISOTROPIC` | `6` | The texture filter blends between the nearest 4 pixels and blends between 2 mipmaps (or uses the nearest mipmap if ProjectSettings.rendering/textures/ |
| `TEXTURE_FILTER_MAX` | `7` | Represents the size of the TextureFilter enum. |

#### TextureRepeat
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `TEXTURE_REPEAT_PARENT_NODE` | `0` | The CanvasItem will inherit the filter from its parent. |
| `TEXTURE_REPEAT_DISABLED` | `1` | Texture will not repeat. |
| `TEXTURE_REPEAT_ENABLED` | `2` | Texture will repeat normally. |
| `TEXTURE_REPEAT_MIRROR` | `3` | Texture will repeat in a 2×2 tiled mode, where elements at even positions are mirrored. |
| `TEXTURE_REPEAT_MAX` | `4` | Represents the size of the TextureRepeat enum. |

#### ClipChildrenMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CLIP_CHILDREN_DISABLED` | `0` | Child draws over parent and is not clipped. |
| `CLIP_CHILDREN_ONLY` | `1` | Parent is used for the purposes of clipping only. Child is clipped to the parent's visible area, parent is not drawn. |
| `CLIP_CHILDREN_AND_DRAW` | `2` | Parent is used for clipping child, but parent is also drawn underneath child as normal before clipping child to its visible area. |
| `CLIP_CHILDREN_MAX` | `3` | Represents the size of the ClipChildrenMode enum. |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_TRANSFORM_CHANGED` | `2000` | The CanvasItem's global transform has changed. This notification is only received if enabled by set_notify_transform. |
| `NOTIFICATION_LOCAL_TRANSFORM_CHANGED` | `35` | The CanvasItem's local transform has changed. This notification is only received if enabled by set_notify_local_transfor |
| `NOTIFICATION_DRAW` | `30` | The CanvasItem is requested to draw (see _draw). |
| `NOTIFICATION_VISIBILITY_CHANGED` | `31` | The CanvasItem's visibility has changed. |
| `NOTIFICATION_ENTER_CANVAS` | `32` | The CanvasItem has entered the canvas. |
| `NOTIFICATION_EXIT_CANVAS` | `33` | The CanvasItem has exited the canvas. |
| `NOTIFICATION_WORLD_2D_CHANGED` | `36` | The CanvasItem's active World2D changed. |

### 使用场景
自定义 2D 绘制，重写 `_draw()` 方法调用 `draw_line()` 等绘制 API。

### 官方链接
[CanvasItem 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_CanvasItem.html)

---

## Node2D

**继承链：** CanvasItem > Node > Object

**描述：** 2D 节点基类，继承自 CanvasItem，提供 2D 变换。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `global_position` | `Vector2` | `-` | - |
| `global_rotation` | `float` | `-` | - |
| `global_rotation_degrees` | `float` | `-` | - |
| `global_scale` | `Vector2` | `-` | - |
| `global_skew` | `float` | `-` | - |
| `global_transform` | `Transform2D` | `-` | - |
| `position` | `Vector2` | ``Vector2(0, 0)`` | - |
| `rotation` | `float` | ``0.0`` | - |
| `rotation_degrees` | `float` | `-` | - |
| `scale` | `Vector2` | ``Vector2(1, 1)`` | - |
| `skew` | `float` | ``0.0`` | - |
| `transform` | `Transform2D` | `-` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `apply_scale` | `void` | `ratio: Vector2` | - |
| `get_angle_to` | `float` | `point: Vector2` | - |
| `get_relative_transform_to_parent` | `Transform2D` | `parent: Node` | - |
| `global_translate` | `void` | `offset: Vector2` | - |
| `look_at` | `void` | `point: Vector2` | - |
| `move_local_x` | `void` | `delta: float, scaled: bool = false` | - |
| `move_local_y` | `void` | `delta: float, scaled: bool = false` | - |
| `rotate` | `void` | `radians: float` | - |
| `to_global` | `Vector2` | `local_point: Vector2` | - |
| `to_local` | `Vector2` | `global_point: Vector2` | - |
| `translate` | `void` | `offset: Vector2` | - |

### 使用场景
2D 游戏元素的基础，设置 `position`、`rotation`、`scale` 进行 2D 变换。

### 示例代码
```gdscript
# 2D 变换
position = Vector2(100, 200)
rotation = deg_to_rad(45)
scale = Vector2(2, 2)

# 移动和旋转
func _process(delta):
    position += velocity * delta
    look_at(get_global_mouse_position())

# 坐标转换
var local_pos = to_local(global_pos)
var global_pos = to_global(local_pos)
```

### 官方链接
[Node2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Node2D.html)

---

## Node3D

**继承链：** Node > Object

**描述：** 3D 节点基类，提供 3D 变换。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `basis` | `Basis` | `-` | - |
| `global_basis` | `Basis` | `-` | - |
| `global_position` | `Vector3` | `-` | - |
| `global_rotation` | `Vector3` | `-` | - |
| `global_rotation_degrees` | `Vector3` | `-` | - |
| `global_transform` | `Transform3D` | `-` | - |
| `position` | `Vector3` | ``Vector3(0, 0, 0)`` | - |
| `quaternion` | `Quaternion` | `-` | - |
| `rotation` | `Vector3` | ``Vector3(0, 0, 0)`` | - |
| `rotation_degrees` | `Vector3` | `-` | - |
| `rotation_edit_mode` | `RotationEditMode` | ``0`` | - |
| `rotation_order` | `EulerOrder` | ``2`` | - |
| `scale` | `Vector3` | ``Vector3(1, 1, 1)`` | - |
| `top_level` | `bool` | ``false`` | - |
| `transform` | `Transform3D` | ``Transform3D(1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0)`` | - |
| `visibility_parent` | `NodePath` | ``NodePath("")`` | - |
| `visible` | `bool` | ``true`` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `add_gizmo` | `void` | `gizmo: Node3DGizmo` | - |
| `clear_gizmos` | `void` | `()` | - |
| `clear_subgizmo_selection` | `void` | `()` | - |
| `force_update_transform` | `void` | `()` | - |
| `get_gizmos` | `Array\[Node3DGizmo\]` | `()` | - |
| `get_parent_node_3d` | `Node3D` | `()` | - |
| `get_world_3d` | `World3D` | `()` | - |
| `global_rotate` | `void` | `axis: Vector3, angle: float` | - |
| `global_scale` | `void` | `scale: Vector3` | - |
| `global_translate` | `void` | `offset: Vector3` | - |
| `hide` | `void` | `()` | - |
| `is_local_transform_notification_enabled` | `bool` | `()` | - |
| `is_scale_disabled` | `bool` | `()` | - |
| `is_transform_notification_enabled` | `bool` | `()` | - |
| `is_visible_in_tree` | `bool` | `()` | - |
| `look_at` | `void` | `target: Vector3, up: Vector3 = Vector3(0, 1, 0), use_model_front: bool = false` | - |
| `look_at_from_position` | `void` | `position: Vector3, target: Vector3, up: Vector3 = Vector3(0, 1, 0), use_model_front: bool = false` | - |
| `orthonormalize` | `void` | `()` | - |
| `rotate` | `void` | `axis: Vector3, angle: float` | - |
| `rotate_object_local` | `void` | `axis: Vector3, angle: float` | - |
| `rotate_x` | `void` | `angle: float` | - |
| `rotate_y` | `void` | `angle: float` | - |
| `rotate_z` | `void` | `angle: float` | - |
| `scale_object_local` | `void` | `scale: Vector3` | - |
| `set_disable_scale` | `void` | `disable: bool` | - |
| `set_identity` | `void` | `()` | - |
| `set_ignore_transform_notification` | `void` | `enabled: bool` | - |
| `set_notify_local_transform` | `void` | `enable: bool` | - |
| `set_notify_transform` | `void` | `enable: bool` | - |
| `set_subgizmo_selection` | `void` | `gizmo: Node3DGizmo, id: int, transform: Transform3D` | - |
| `show` | `void` | `()` | - |
| `to_global` | `Vector3` | `local_point: Vector3` | - |
| `to_local` | `Vector3` | `global_point: Vector3` | - |
| `translate` | `void` | `offset: Vector3` | - |
| `translate_object_local` | `void` | `offset: Vector3` | - |
| `update_gizmos` | `void` | `()` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `visibility_changed` | `-` | Emitted when node visibility changes. |

### 枚举
#### RotationEditMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `ROTATION_EDIT_MODE_EULER` | `0` | The rotation is edited using Vector3 Euler angles. |
| `ROTATION_EDIT_MODE_QUATERNION` | `1` | The rotation is edited using a Quaternion. |
| `ROTATION_EDIT_MODE_BASIS` | `2` | The rotation is edited using a Basis. In this mode, scale can't be edited separately. |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_TRANSFORM_CHANGED` | `2000` | Node3D nodes receive this notification when their global transform changes. This means that either the current or a pare |
| `NOTIFICATION_ENTER_WORLD` | `41` | Node3D nodes receive this notification when they are registered to new World3D resource. |
| `NOTIFICATION_EXIT_WORLD` | `42` | Node3D nodes receive this notification when they are unregistered from current World3D resource. |
| `NOTIFICATION_VISIBILITY_CHANGED` | `43` | Node3D nodes receive this notification when their visibility changes. |
| `NOTIFICATION_LOCAL_TRANSFORM_CHANGED` | `44` | Node3D nodes receive this notification when their local transform changes. This is not received when the transform of a  |

### 使用场景
3D 游戏元素的基础，设置 3D 空间变换。

### 示例代码
```gdscript
# 3D 变换
position = Vector3(0, 1, 0)
rotation = Vector3(0, deg_to_rad(90), 0)

# 朝向目标
func _process(delta):
    look_at(target_position, Vector3.UP)
    translate(Vector3.FORWARD * speed * delta)
```

### 官方链接
[Node3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Node3D.html)

---

## Control

**继承链：** CanvasItem > Node > Object

**描述：** 所有 UI 控件基类，继承自 CanvasItem。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `anchor_bottom` | `float` | ``0.0`` | - |
| `anchor_left` | `float` | ``0.0`` | - |
| `anchor_right` | `float` | ``0.0`` | - |
| `anchor_top` | `float` | ``0.0`` | - |
| `auto_translate` | `bool` | `-` | - |
| `clip_contents` | `bool` | ``false`` | - |
| `custom_minimum_size` | `Vector2` | ``Vector2(0, 0)`` | - |
| `focus_mode` | `FocusMode` | ``0`` | - |
| `focus_neighbor_bottom` | `NodePath` | ``NodePath("")`` | - |
| `focus_neighbor_left` | `NodePath` | ``NodePath("")`` | - |
| `focus_neighbor_right` | `NodePath` | ``NodePath("")`` | - |
| `focus_neighbor_top` | `NodePath` | ``NodePath("")`` | - |
| `focus_next` | `NodePath` | ``NodePath("")`` | - |
| `focus_previous` | `NodePath` | ``NodePath("")`` | - |
| `global_position` | `Vector2` | `-` | - |
| `grow_horizontal` | `GrowDirection` | ``1`` | - |
| `grow_vertical` | `GrowDirection` | ``1`` | - |
| `layout_direction` | `LayoutDirection` | ``0`` | - |
| `localize_numeral_system` | `bool` | ``true`` | - |
| `mouse_default_cursor_shape` | `CursorShape` | ``0`` | - |
| `mouse_filter` | `MouseFilter` | ``0`` | - |
| `mouse_force_pass_scroll_events` | `bool` | ``true`` | - |
| `offset_bottom` | `float` | ``0.0`` | - |
| `offset_left` | `float` | ``0.0`` | - |
| `offset_right` | `float` | ``0.0`` | - |
| `offset_top` | `float` | ``0.0`` | - |
| `physics_interpolation_mode` | `PhysicsInterpolationMode` | ``2` (overrides Node)` | - |
| `pivot_offset` | `Vector2` | ``Vector2(0, 0)`` | - |
| `position` | `Vector2` | ``Vector2(0, 0)`` | - |
| `rotation` | `float` | ``0.0`` | - |
| `rotation_degrees` | `float` | `-` | - |
| `scale` | `Vector2` | ``Vector2(1, 1)`` | - |
| `shortcut_context` | `Node` | `-` | - |
| `size` | `Vector2` | ``Vector2(0, 0)`` | - |
| `\[SizeFlags\]` | `bitfield` | `size_flags_horizontal` | - |
| `size_flags_stretch_ratio` | `float` | ``1.0`` | - |
| `\[SizeFlags\]` | `bitfield` | `size_flags_vertical` | - |
| `theme` | `Theme` | `-` | - |
| `theme_type_variation` | `StringName` | ``&""`` | - |
| `tooltip_text` | `String` | ``""`` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `_can_drop_data` | `bool` | `at_position: Vector2, data: Variant` | - |
| `_drop_data` | `void` | `at_position: Vector2, data: Variant` | - |
| `_get_drag_data` | `Variant` | `at_position: Vector2` | - |
| `_get_minimum_size` | `Vector2` | `()` | - |
| `_get_tooltip` | `String` | `at_position: Vector2` | - |
| `_gui_input` | `void` | `event: InputEvent` | - |
| `_has_point` | `bool` | `point: Vector2` | - |
| `_make_custom_tooltip` | `Object` | `for_text: String` | - |
| `_structured_text_parser` | `Array\[Vector3i\]` | `args: Array, text: String` | - |
| `accept_event` | `void` | `()` | - |
| `add_theme_color_override` | `void` | `name: StringName, color: Color` | - |
| `add_theme_constant_override` | `void` | `name: StringName, constant: int` | - |
| `add_theme_font_override` | `void` | `name: StringName, font: Font` | - |
| `add_theme_font_size_override` | `void` | `name: StringName, font_size: int` | - |
| `add_theme_icon_override` | `void` | `name: StringName, texture: Texture2D` | - |
| `add_theme_stylebox_override` | `void` | `name: StringName, stylebox: StyleBox` | - |
| `begin_bulk_theme_override` | `void` | `()` | - |
| `end_bulk_theme_override` | `void` | `()` | - |
| `find_next_valid_focus` | `Control` | `()` | - |
| `find_prev_valid_focus` | `Control` | `()` | - |
| `find_valid_focus_neighbor` | `Control` | `side: Side` | - |
| `force_drag` | `void` | `data: Variant, preview: Control` | - |
| `get_anchor` | `float` | `side: Side` | - |
| `get_begin` | `Vector2` | `()` | - |
| `get_combined_minimum_size` | `Vector2` | `()` | - |
| `get_cursor_shape` | `CursorShape` | `position: Vector2 = Vector2(0, 0)` | - |
| `get_end` | `Vector2` | `()` | - |
| `get_focus_neighbor` | `NodePath` | `side: Side` | - |
| `get_global_rect` | `Rect2` | `()` | - |
| `get_minimum_size` | `Vector2` | `()` | - |
| `get_offset` | `float` | `offset: Side` | - |
| `get_parent_area_size` | `Vector2` | `()` | - |
| `get_parent_control` | `Control` | `()` | - |
| `get_rect` | `Rect2` | `()` | - |
| `get_screen_position` | `Vector2` | `()` | - |
| `get_theme_color` | `Color` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_constant` | `int` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_default_base_scale` | `float` | `()` | - |
| `get_theme_default_font` | `Font` | `()` | - |
| `get_theme_default_font_size` | `int` | `()` | - |
| `get_theme_font` | `Font` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_font_size` | `int` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_icon` | `Texture2D` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_stylebox` | `StyleBox` | `name: StringName, theme_type: StringName = &""` | - |
| `get_tooltip` | `String` | `at_position: Vector2 = Vector2(0, 0)` | - |
| `grab_click_focus` | `void` | `()` | - |
| `grab_focus` | `void` | `()` | - |
| `has_focus` | `bool` | `()` | - |
| `has_theme_color` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_color_override` | `bool` | `name: StringName` | - |
| `has_theme_constant` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_constant_override` | `bool` | `name: StringName` | - |
| `has_theme_font` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_font_override` | `bool` | `name: StringName` | - |
| `has_theme_font_size` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_font_size_override` | `bool` | `name: StringName` | - |
| `has_theme_icon` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_icon_override` | `bool` | `name: StringName` | - |
| `has_theme_stylebox` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_stylebox_override` | `bool` | `name: StringName` | - |
| `is_drag_successful` | `bool` | `()` | - |
| `is_layout_rtl` | `bool` | `()` | - |
| `release_focus` | `void` | `()` | - |
| `remove_theme_color_override` | `void` | `name: StringName` | - |
| `remove_theme_constant_override` | `void` | `name: StringName` | - |
| `remove_theme_font_override` | `void` | `name: StringName` | - |
| `remove_theme_font_size_override` | `void` | `name: StringName` | - |
| `remove_theme_icon_override` | `void` | `name: StringName` | - |
| `remove_theme_stylebox_override` | `void` | `name: StringName` | - |
| `reset_size` | `void` | `()` | - |
| `set_anchor` | `void` | `side: Side, anchor: float, keep_offset: bool = false, push_opposite_anchor: bool = true` | - |
| `set_anchor_and_offset` | `void` | `side: Side, anchor: float, offset: float, push_opposite_anchor: bool = false` | - |
| `set_anchors_and_offsets_preset` | `void` | `preset: LayoutPreset, resize_mode: LayoutPresetMode = 0, margin: int = 0` | - |
| `set_anchors_preset` | `void` | `preset: LayoutPreset, keep_offsets: bool = false` | - |
| `set_begin` | `void` | `position: Vector2` | - |
| `set_drag_forwarding` | `void` | `drag_func: Callable, can_drop_func: Callable, drop_func: Callable` | - |
| `set_drag_preview` | `void` | `control: Control` | - |
| `set_end` | `void` | `position: Vector2` | - |
| `set_focus_neighbor` | `void` | `side: Side, neighbor: NodePath` | - |
| `set_global_position` | `void` | `position: Vector2, keep_offsets: bool = false` | - |
| `set_offset` | `void` | `side: Side, offset: float` | - |
| `set_offsets_preset` | `void` | `preset: LayoutPreset, resize_mode: LayoutPresetMode = 0, margin: int = 0` | - |
| `set_position` | `void` | `position: Vector2, keep_offsets: bool = false` | - |
| `set_size` | `void` | `size: Vector2, keep_offsets: bool = false` | - |
| `update_minimum_size` | `void` | `()` | - |
| `warp_mouse` | `void` | `position: Vector2` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `focus_entered` | `-` | Emitted when the node gains focus. |
| `focus_exited` | `-` | Emitted when the node loses focus. |
| `gui_input` | `event: InputEvent` | Emitted when the node receives an InputEvent. |
| `minimum_size_changed` | `-` | Emitted when the node's minimum size changes. |
| `mouse_entered` | `-` | Emitted when the mouse cursor enters the control's (or any child control's) visible area, that is not occluded behind other Controls or Windows, provided its mouse_filter lets the event reach it and... |
| `mouse_exited` | `-` | Emitted when the mouse cursor leaves the control's (and all child control's) visible area, that is not occluded behind other Controls or Windows, provided its mouse_filter lets the event reach it and... |
| `resized` | `-` | Emitted when the control changes size. |
| `size_flags_changed` | `-` | Emitted when one of the size flags changes. See size_flags_horizontal and size_flags_vertical. |
| `theme_changed` | `-` | Emitted when the NOTIFICATION_THEME_CHANGED notification is sent. |

### 枚举
#### FocusMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `FOCUS_NONE` | `0` | The node cannot grab focus. Use with focus_mode. |
| `FOCUS_CLICK` | `1` | The node can only grab focus on mouse clicks. Use with focus_mode. |
| `FOCUS_ALL` | `2` | The node can grab focus on mouse click, using the arrows and the Tab keys on the keyboard, or using the D-pad buttons on a gamepad. Use with focus_mod |

#### CursorShape
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CURSOR_ARROW` | `0` | Show the system's arrow mouse cursor when the user hovers the node. Use with mouse_default_cursor_shape. |
| `CURSOR_IBEAM` | `1` | Show the system's I-beam mouse cursor when the user hovers the node. The I-beam pointer has a shape similar to "I". It tells the user they can highlig |
| `CURSOR_POINTING_HAND` | `2` | Show the system's pointing hand mouse cursor when the user hovers the node. |
| `CURSOR_CROSS` | `3` | Show the system's cross mouse cursor when the user hovers the node. |
| `CURSOR_WAIT` | `4` | Show the system's wait mouse cursor when the user hovers the node. Often an hourglass. |
| `CURSOR_BUSY` | `5` | Show the system's busy mouse cursor when the user hovers the node. Often an arrow with a small hourglass. |
| `CURSOR_DRAG` | `6` | Show the system's drag mouse cursor, often a closed fist or a cross symbol, when the user hovers the node. It tells the user they're currently draggin |
| `CURSOR_CAN_DROP` | `7` | Show the system's drop mouse cursor when the user hovers the node. It can be an open hand. It tells the user they can drop an item they're currently g |
| `CURSOR_FORBIDDEN` | `8` | Show the system's forbidden mouse cursor when the user hovers the node. Often a crossed circle. |
| `CURSOR_VSIZE` | `9` | Show the system's vertical resize mouse cursor when the user hovers the node. A double-headed vertical arrow. It tells the user they can resize the wi |
| `CURSOR_HSIZE` | `10` | Show the system's horizontal resize mouse cursor when the user hovers the node. A double-headed horizontal arrow. It tells the user they can resize th |
| `CURSOR_BDIAGSIZE` | `11` | Show the system's window resize mouse cursor when the user hovers the node. The cursor is a double-headed arrow that goes from the bottom left to the  |
| `CURSOR_FDIAGSIZE` | `12` | Show the system's window resize mouse cursor when the user hovers the node. The cursor is a double-headed arrow that goes from the top left to the bot |
| `CURSOR_MOVE` | `13` | Show the system's move mouse cursor when the user hovers the node. It shows 2 double-headed arrows at a 90 degree angle. It tells the user they can mo |
| `CURSOR_VSPLIT` | `14` | Show the system's vertical split mouse cursor when the user hovers the node. On Windows, it's the same as CURSOR_VSIZE. |
| `CURSOR_HSPLIT` | `15` | Show the system's horizontal split mouse cursor when the user hovers the node. On Windows, it's the same as CURSOR_HSIZE. |
| `CURSOR_HELP` | `16` | Show the system's help mouse cursor when the user hovers the node, a question mark. |

#### LayoutPreset
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PRESET_TOP_LEFT` | `0` | Snap all 4 anchors to the top-left of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_TOP_RIGHT` | `1` | Snap all 4 anchors to the top-right of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_BOTTOM_LEFT` | `2` | Snap all 4 anchors to the bottom-left of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_BOTTOM_RIGHT` | `3` | Snap all 4 anchors to the bottom-right of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_CENTER_LEFT` | `4` | Snap all 4 anchors to the center of the left edge of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_CENTER_TOP` | `5` | Snap all 4 anchors to the center of the top edge of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_CENTER_RIGHT` | `6` | Snap all 4 anchors to the center of the right edge of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_CENTER_BOTTOM` | `7` | Snap all 4 anchors to the center of the bottom edge of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_CENTER` | `8` | Snap all 4 anchors to the center of the parent control's bounds. Use with set_anchors_preset. |
| `PRESET_LEFT_WIDE` | `9` | Snap all 4 anchors to the left edge of the parent control. The left offset becomes relative to the left edge and the top offset relative to the top le |
| `PRESET_TOP_WIDE` | `10` | Snap all 4 anchors to the top edge of the parent control. The left offset becomes relative to the top left corner, the top offset relative to the top  |
| `PRESET_RIGHT_WIDE` | `11` | Snap all 4 anchors to the right edge of the parent control. The right offset becomes relative to the right edge and the top offset relative to the top |
| `PRESET_BOTTOM_WIDE` | `12` | Snap all 4 anchors to the bottom edge of the parent control. The left offset becomes relative to the bottom left corner, the bottom offset relative to |
| `PRESET_VCENTER_WIDE` | `13` | Snap all 4 anchors to a vertical line that cuts the parent control in half. Use with set_anchors_preset. |
| `PRESET_HCENTER_WIDE` | `14` | Snap all 4 anchors to a horizontal line that cuts the parent control in half. Use with set_anchors_preset. |
| `PRESET_FULL_RECT` | `15` | Snap all 4 anchors to the respective corners of the parent control. Set all 4 offsets to 0 after you applied this preset and the Control will fit its  |

#### LayoutPresetMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `PRESET_MODE_MINSIZE` | `0` | The control will be resized to its minimum size. |
| `PRESET_MODE_KEEP_WIDTH` | `1` | The control's width will not change. |
| `PRESET_MODE_KEEP_HEIGHT` | `2` | The control's height will not change. |
| `PRESET_MODE_KEEP_SIZE` | `3` | The control's size will not change. |

#### SizeFlags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SIZE_SHRINK_BEGIN` | `0` | Tells the parent Container to align the node with its start, either the top or the left edge. It is mutually exclusive with SIZE_FILL and other shrink |
| `SIZE_FILL` | `1` | Tells the parent Container to expand the bounds of this node to fill all the available space without pushing any other node. It is mutually exclusive  |
| `SIZE_EXPAND` | `2` | Tells the parent Container to let this node take all the available space on the axis you flag. If multiple neighboring nodes are set to expand, they'l |
| `SIZE_EXPAND_FILL` | `3` | Sets the node's size flags to both fill and expand. See SIZE_FILL and SIZE_EXPAND for more information. |
| `SIZE_SHRINK_CENTER` | `4` | Tells the parent Container to center the node in the available space. It is mutually exclusive with SIZE_FILL and other shrink size flags, but can be  |
| `SIZE_SHRINK_END` | `8` | Tells the parent Container to align the node with its end, either the bottom or the right edge. It is mutually exclusive with SIZE_FILL and other shri |

#### MouseFilter
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `MOUSE_FILTER_STOP` | `0` | The control will receive mouse movement input events and mouse button input events if clicked on through _gui_input. And the control will receive the  |
| `MOUSE_FILTER_PASS` | `1` | The control will receive mouse movement input events and mouse button input events if clicked on through _gui_input. And the control will receive the  |
| `MOUSE_FILTER_IGNORE` | `2` | The control will not receive mouse movement input events and mouse button input events if clicked on through _gui_input. The control will also not rec |

#### GrowDirection
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `GROW_DIRECTION_BEGIN` | `0` | The control will grow to the left or top to make up if its minimum size is changed to be greater than its current size on the respective axis. |
| `GROW_DIRECTION_END` | `1` | The control will grow to the right or bottom to make up if its minimum size is changed to be greater than its current size on the respective axis. |
| `GROW_DIRECTION_BOTH` | `2` | The control will grow in both directions equally to make up if its minimum size is changed to be greater than its current size. |

#### Anchor
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `ANCHOR_BEGIN` | `0` | Snaps one of the 4 anchor's sides to the origin of the node's `Rect`, in the top left. Use it with one of the `anchor_*` member variables, like anchor |
| `ANCHOR_END` | `1` | Snaps one of the 4 anchor's sides to the end of the node's `Rect`, in the bottom right. Use it with one of the `anchor_*` member variables, like ancho |

#### LayoutDirection
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `LAYOUT_DIRECTION_INHERITED` | `0` | Automatic layout direction, determined from the parent control layout direction. |
| `LAYOUT_DIRECTION_LOCALE` | `1` | Automatic layout direction, determined from the current locale. |
| `LAYOUT_DIRECTION_LTR` | `2` | Left-to-right layout direction. |
| `LAYOUT_DIRECTION_RTL` | `3` | Right-to-left layout direction. |

#### TextDirection
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `TEXT_DIRECTION_INHERITED` | `3` | Text writing direction is the same as layout direction. |
| `TEXT_DIRECTION_AUTO` | `0` | Automatic text writing direction, determined from the current locale and text content. |
| `TEXT_DIRECTION_LTR` | `1` | Left-to-right text writing direction. |
| `TEXT_DIRECTION_RTL` | `2` | Right-to-left text writing direction. |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_RESIZED` | `40` | Sent when the node changes size. Use size to get the new size. |
| `NOTIFICATION_MOUSE_ENTER` | `41` | Sent when the mouse cursor enters the control's (or any child control's) visible area, that is not occluded behind other |
| `NOTIFICATION_MOUSE_EXIT` | `42` | Sent when the mouse cursor leaves the control's (and all child control's) visible area, that is not occluded behind othe |
| `NOTIFICATION_MOUSE_ENTER_SELF` | `60` | Experimental: The reason this notification is sent may change in the future. Sent when the mouse cursor enters the contr |
| `NOTIFICATION_MOUSE_EXIT_SELF` | `61` | Experimental: The reason this notification is sent may change in the future. Sent when the mouse cursor leaves the contr |
| `NOTIFICATION_FOCUS_ENTER` | `43` | Sent when the node grabs focus. |
| `NOTIFICATION_FOCUS_EXIT` | `44` | Sent when the node loses focus. |
| `NOTIFICATION_THEME_CHANGED` | `45` | Sent when the node needs to refresh its theme items. This happens in one of the following cases: - The theme property is |
| `NOTIFICATION_SCROLL_BEGIN` | `47` | Sent when this node is inside a ScrollContainer which has begun being scrolled when dragging the scrollable area *with a |
| `NOTIFICATION_SCROLL_END` | `48` | Sent when this node is inside a ScrollContainer which has stopped being scrolled when dragging the scrollable area *with |
| `NOTIFICATION_LAYOUT_DIRECTION_CHANGED` | `49` | Sent when control layout direction is changed. |

### 使用场景
构建 UI 界面，通过锚点和边距布局，管理焦点和主题。

### 示例代码
```gdscript
# 设置 UI 元素
var label = Label.new()
label.text = "Hello UI"
label.set_anchors_and_offsets_preset(Control.PRESET_CENTER)
add_child(label)

# 响应按钮点击
func _on_button_pressed():
    print("按钮被点击")
```

### 官方链接
[Control 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Control.html)

---

## Viewport

**继承链：** Node > Object

**描述：** 视口节点，用于渲染场景内容。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `audio_listener_enable_2d` | `bool` | ``false`` | - |
| `audio_listener_enable_3d` | `bool` | ``false`` | - |
| `canvas_cull_mask` | `int` | ``4294967295`` | - |
| `canvas_item_default_texture_filter` | `DefaultCanvasItemTextureFilter` | ``1`` | - |
| `canvas_item_default_texture_repeat` | `DefaultCanvasItemTextureRepeat` | ``0`` | - |
| `canvas_transform` | `Transform2D` | `-` | - |
| `debug_draw` | `DebugDraw` | ``0`` | - |
| `disable_3d` | `bool` | ``false`` | - |
| `fsr_sharpness` | `float` | ``0.2`` | - |
| `global_canvas_transform` | `Transform2D` | `-` | - |
| `gui_disable_input` | `bool` | ``false`` | - |
| `gui_embed_subwindows` | `bool` | ``false`` | - |
| `gui_snap_controls_to_pixels` | `bool` | ``true`` | - |
| `handle_input_locally` | `bool` | ``true`` | - |
| `mesh_lod_threshold` | `float` | ``1.0`` | - |
| `msaa_2d` | `MSAA` | ``0`` | - |
| `msaa_3d` | `MSAA` | ``0`` | - |
| `own_world_3d` | `bool` | ``false`` | - |
| `physics_object_picking` | `bool` | ``false`` | - |
| `physics_object_picking_first_only` | `bool` | ``false`` | - |
| `physics_object_picking_sort` | `bool` | ``false`` | - |
| `positional_shadow_atlas_16_bits` | `bool` | ``true`` | - |
| `positional_shadow_atlas_quad_0` | `PositionalShadowAtlasQuadrantSubdiv` | ``2`` | - |
| `positional_shadow_atlas_quad_1` | `PositionalShadowAtlasQuadrantSubdiv` | ``2`` | - |
| `positional_shadow_atlas_quad_2` | `PositionalShadowAtlasQuadrantSubdiv` | ``3`` | - |
| `positional_shadow_atlas_quad_3` | `PositionalShadowAtlasQuadrantSubdiv` | ``4`` | - |
| `positional_shadow_atlas_size` | `int` | ``2048`` | - |
| `scaling_3d_mode` | `Scaling3DMode` | ``0`` | - |
| `scaling_3d_scale` | `float` | ``1.0`` | - |
| `screen_space_aa` | `ScreenSpaceAA` | ``0`` | - |
| `sdf_oversize` | `SDFOversize` | ``1`` | - |
| `sdf_scale` | `SDFScale` | ``1`` | - |
| `snap_2d_transforms_to_pixel` | `bool` | ``false`` | - |
| `snap_2d_vertices_to_pixel` | `bool` | ``false`` | - |
| `texture_mipmap_bias` | `float` | ``0.0`` | - |
| `transparent_bg` | `bool` | ``false`` | - |
| `use_debanding` | `bool` | ``false`` | - |
| `use_hdr_2d` | `bool` | ``false`` | - |
| `use_occlusion_culling` | `bool` | ``false`` | - |
| `use_taa` | `bool` | ``false`` | - |
| `use_xr` | `bool` | ``false`` | - |
| `vrs_mode` | `VRSMode` | ``0`` | - |
| `vrs_texture` | `Texture2D` | `-` | - |
| `vrs_update_mode` | `VRSUpdateMode` | ``1`` | - |
| `world_2d` | `World2D` | `-` | - |
| `world_3d` | `World3D` | `-` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `find_world_2d` | `World2D` | `()` | - |
| `find_world_3d` | `World3D` | `()` | - |
| `get_camera_2d` | `Camera2D` | `()` | - |
| `get_camera_3d` | `Camera3D` | `()` | - |
| `get_canvas_cull_mask_bit` | `bool` | `layer: int` | - |
| `get_embedded_subwindows` | `Array\[Window\]` | `()` | - |
| `get_final_transform` | `Transform2D` | `()` | - |
| `get_mouse_position` | `Vector2` | `()` | - |
| `get_positional_shadow_atlas_quadrant_subdiv` | `PositionalShadowAtlasQuadrantSubdiv` | `quadrant: int` | - |
| `get_render_info` | `int` | `type: RenderInfoType, info: RenderInfo` | - |
| `get_screen_transform` | `Transform2D` | `()` | - |
| `get_texture` | `ViewportTexture` | `()` | - |
| `get_viewport_rid` | `RID` | `()` | - |
| `get_visible_rect` | `Rect2` | `()` | - |
| `gui_get_drag_data` | `Variant` | `()` | - |
| `gui_get_focus_owner` | `Control` | `()` | - |
| `gui_get_hovered_control` | `Control` | `()` | - |
| `gui_is_drag_successful` | `bool` | `()` | - |
| `gui_is_dragging` | `bool` | `()` | - |
| `gui_release_focus` | `void` | `()` | - |
| `is_input_handled` | `bool` | `()` | - |
| `push_input` | `void` | `event: InputEvent, in_local_coords: bool = false` | - |
| `push_text_input` | `void` | `text: String` | - |
| `push_unhandled_input` | `void` | `event: InputEvent, in_local_coords: bool = false` | - |
| `set_canvas_cull_mask_bit` | `void` | `layer: int, enable: bool` | - |
| `set_input_as_handled` | `void` | `()` | - |
| `set_positional_shadow_atlas_quadrant_subdiv` | `void` | `quadrant: int, subdiv: PositionalShadowAtlasQuadrantSubdiv` | - |
| `update_mouse_cursor_state` | `void` | `()` | - |
| `warp_mouse` | `void` | `position: Vector2` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `gui_focus_changed` | `node: Control` | Emitted when a Control node grabs keyboard focus. Note: A Control node losing focus doesn't cause this signal to be emitted. |
| `size_changed` | `-` | Emitted when the size of the viewport is changed, whether by resizing of window, or some other means. |

### 枚举
#### PositionalShadowAtlasQuadrantSubdiv
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SHADOW_ATLAS_QUADRANT_SUBDIV_DISABLED` | `0` | This quadrant will not be used. |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_1` | `1` | This quadrant will only be used by one shadow map. |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_4` | `2` | This quadrant will be split in 4 and used by up to 4 shadow maps. |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_16` | `3` | This quadrant will be split 16 ways and used by up to 16 shadow maps. |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_64` | `4` | This quadrant will be split 64 ways and used by up to 64 shadow maps. |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_256` | `5` | This quadrant will be split 256 ways and used by up to 256 shadow maps. Unless the positional_shadow_atlas_size is very high, the shadows in this quad |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_1024` | `6` | This quadrant will be split 1024 ways and used by up to 1024 shadow maps. Unless the positional_shadow_atlas_size is very high, the shadows in this qu |
| `SHADOW_ATLAS_QUADRANT_SUBDIV_MAX` | `7` | Represents the size of the PositionalShadowAtlasQuadrantSubdiv enum. |

#### Scaling3DMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SCALING_3D_MODE_BILINEAR` | `0` | Use bilinear scaling for the viewport's 3D buffer. The amount of scaling can be set using scaling_3d_scale. Values less than `1.0` will result in unde |
| `SCALING_3D_MODE_FSR` | `1` | Use AMD FidelityFX Super Resolution 1.0 upscaling for the viewport's 3D buffer. The amount of scaling can be set using scaling_3d_scale. Values less t |
| `SCALING_3D_MODE_FSR2` | `2` | Use AMD FidelityFX Super Resolution 2.2 upscaling for the viewport's 3D buffer. The amount of scaling can be set using scaling_3d_scale. Values less t |
| `SCALING_3D_MODE_MAX` | `3` | Represents the size of the Scaling3DMode enum. |

#### MSAA
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `MSAA_DISABLED` | `0` | Multisample antialiasing mode disabled. This is the default value, and is also the fastest setting. |
| `MSAA_2X` | `1` | Use 2× Multisample Antialiasing. This has a moderate performance cost. It helps reduce aliasing noticeably, but 4× MSAA still looks substantially bett |
| `MSAA_4X` | `2` | Use 4× Multisample Antialiasing. This has a significant performance cost, and is generally a good compromise between performance and quality. |
| `MSAA_8X` | `3` | Use 8× Multisample Antialiasing. This has a very high performance cost. The difference between 4× and 8× MSAA may not always be visible in real gamepl |
| `MSAA_MAX` | `4` | Represents the size of the MSAA enum. |

#### ScreenSpaceAA
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SCREEN_SPACE_AA_DISABLED` | `0` | Do not perform any antialiasing in the full screen post-process. |
| `SCREEN_SPACE_AA_FXAA` | `1` | Use fast approximate antialiasing. FXAA is a popular screen-space antialiasing method, which is fast but will make the image look blurry, especially a |
| `SCREEN_SPACE_AA_MAX` | `2` | Represents the size of the ScreenSpaceAA enum. |

#### RenderInfo
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `RENDER_INFO_OBJECTS_IN_FRAME` | `0` | Amount of objects in frame. |
| `RENDER_INFO_PRIMITIVES_IN_FRAME` | `1` | Amount of vertices in frame. |
| `RENDER_INFO_DRAW_CALLS_IN_FRAME` | `2` | Amount of draw calls in frame. |
| `RENDER_INFO_MAX` | `3` | Represents the size of the RenderInfo enum. |

#### RenderInfoType
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `RENDER_INFO_TYPE_VISIBLE` | `0` | Visible render pass (excluding shadows). |
| `RENDER_INFO_TYPE_SHADOW` | `1` | Shadow render pass. Objects will be rendered several times depending on the number of amounts of lights with shadows and the number of directional sha |
| `RENDER_INFO_TYPE_CANVAS` | `2` | Canvas item rendering. This includes all 2D rendering. |
| `RENDER_INFO_TYPE_MAX` | `3` | Represents the size of the RenderInfoType enum. |

#### DebugDraw
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `DEBUG_DRAW_DISABLED` | `0` | Objects are displayed normally. |
| `DEBUG_DRAW_UNSHADED` | `1` | Objects are displayed without light information. |
| `DEBUG_DRAW_LIGHTING` | `2` | Objects are displayed without textures and only with lighting information. |
| `DEBUG_DRAW_OVERDRAW` | `3` | Objects are displayed semi-transparent with additive blending so you can see where they are drawing over top of one another. A higher overdraw means y |
| `DEBUG_DRAW_WIREFRAME` | `4` | Objects are displayed as wireframe models. |
| `DEBUG_DRAW_NORMAL_BUFFER` | `5` | Objects are displayed without lighting information and their textures replaced by normal mapping. |
| `DEBUG_DRAW_VOXEL_GI_ALBEDO` | `6` | Objects are displayed with only the albedo value from VoxelGI s. |
| `DEBUG_DRAW_VOXEL_GI_LIGHTING` | `7` | Objects are displayed with only the lighting value from VoxelGI s. |
| `DEBUG_DRAW_VOXEL_GI_EMISSION` | `8` | Objects are displayed with only the emission color from VoxelGI s. |
| `DEBUG_DRAW_SHADOW_ATLAS` | `9` | Draws the shadow atlas that stores shadows from OmniLight3D s and SpotLight3D s in the upper left quadrant of the Viewport. |
| `DEBUG_DRAW_DIRECTIONAL_SHADOW_ATLAS` | `10` | Draws the shadow atlas that stores shadows from DirectionalLight3D s in the upper left quadrant of the Viewport. |
| `DEBUG_DRAW_SCENE_LUMINANCE` | `11` | Draws the scene luminance buffer (if available) in the upper left quadrant of the Viewport. |
| `DEBUG_DRAW_SSAO` | `12` | Draws the screen-space ambient occlusion texture instead of the scene so that you can clearly see how it is affecting objects. In order for this displ |
| `DEBUG_DRAW_SSIL` | `13` | Draws the screen-space indirect lighting texture instead of the scene so that you can clearly see how it is affecting objects. In order for this displ |
| `DEBUG_DRAW_PSSM_SPLITS` | `14` | Colors each PSSM split for the DirectionalLight3D s in the scene a different color so you can see where the splits are. In order, they will be colored |
| `DEBUG_DRAW_DECAL_ATLAS` | `15` | Draws the decal atlas used by Decal s and light projector textures in the upper left quadrant of the Viewport. |
| `DEBUG_DRAW_SDFGI` | `16` | Draws the cascades used to render signed distance field global illumination (SDFGI). Does nothing if the current environment's Environment.sdfgi_enabl |
| `DEBUG_DRAW_SDFGI_PROBES` | `17` | Draws the probes used for signed distance field global illumination (SDFGI). Does nothing if the current environment's Environment.sdfgi_enabled is `f |
| `DEBUG_DRAW_GI_BUFFER` | `18` | Draws the buffer used for global illumination (GI). |
| `DEBUG_DRAW_DISABLE_LOD` | `19` | Draws all of the objects at their highest polycount, without low level of detail (LOD). |
| `DEBUG_DRAW_CLUSTER_OMNI_LIGHTS` | `20` | Draws the cluster used by OmniLight3D nodes to optimize light rendering. |
| `DEBUG_DRAW_CLUSTER_SPOT_LIGHTS` | `21` | Draws the cluster used by SpotLight3D nodes to optimize light rendering. |
| `DEBUG_DRAW_CLUSTER_DECALS` | `22` | Draws the cluster used by Decal nodes to optimize decal rendering. |
| `DEBUG_DRAW_CLUSTER_REFLECTION_PROBES` | `23` | Draws the cluster used by ReflectionProbe nodes to optimize decal rendering. |
| `DEBUG_DRAW_OCCLUDERS` | `24` | Draws the buffer used for occlusion culling. |
| `DEBUG_DRAW_MOTION_VECTORS` | `25` | Draws vector lines over the viewport to indicate the movement of pixels between frames. |
| `DEBUG_DRAW_INTERNAL_BUFFER` | `26` | Draws the internal resolution buffer of the scene before post-processing is applied. |

#### DefaultCanvasItemTextureFilter
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_NEAREST` | `0` | The texture filter reads from the nearest pixel only. This makes the texture look pixelated from up close, and grainy from a distance (due to mipmaps  |
| `DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_LINEAR` | `1` | The texture filter blends between the nearest 4 pixels. This makes the texture look smooth from up close, and grainy from a distance (due to mipmaps n |
| `DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_LINEAR_WITH_MIPMAPS` | `2` | The texture filter blends between the nearest 4 pixels and between the nearest 2 mipmaps (or uses the nearest mipmap if ProjectSettings.rendering/text |
| `DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_NEAREST_WITH_MIPMAPS` | `3` | The texture filter reads from the nearest pixel and blends between the nearest 2 mipmaps (or uses the nearest mipmap if ProjectSettings.rendering/text |
| `DEFAULT_CANVAS_ITEM_TEXTURE_FILTER_MAX` | `4` | Represents the size of the DefaultCanvasItemTextureFilter enum. |

#### DefaultCanvasItemTextureRepeat
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_DISABLED` | `0` | Disables textures repeating. Instead, when reading UVs outside the 0-1 range, the value will be clamped to the edge of the texture, resulting in a str |
| `DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_ENABLED` | `1` | Enables the texture to repeat when UV coordinates are outside the 0-1 range. If using one of the linear filtering modes, this can result in artifacts  |
| `DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_MIRROR` | `2` | Flip the texture when repeating so that the edge lines up instead of abruptly changing. |
| `DEFAULT_CANVAS_ITEM_TEXTURE_REPEAT_MAX` | `3` | Represents the size of the DefaultCanvasItemTextureRepeat enum. |

#### SDFOversize
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SDF_OVERSIZE_100_PERCENT` | `0` | The signed distance field only covers the viewport's own rectangle. |
| `SDF_OVERSIZE_120_PERCENT` | `1` | The signed distance field is expanded to cover 20% of the viewport's size around the borders. |
| `SDF_OVERSIZE_150_PERCENT` | `2` | The signed distance field is expanded to cover 50% of the viewport's size around the borders. |
| `SDF_OVERSIZE_200_PERCENT` | `3` | The signed distance field is expanded to cover 100% (double) of the viewport's size around the borders. |
| `SDF_OVERSIZE_MAX` | `4` | Represents the size of the SDFOversize enum. |

#### SDFScale
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `SDF_SCALE_100_PERCENT` | `0` | The signed distance field is rendered at full resolution. |
| `SDF_SCALE_50_PERCENT` | `1` | The signed distance field is rendered at half the resolution of this viewport. |
| `SDF_SCALE_25_PERCENT` | `2` | The signed distance field is rendered at a quarter the resolution of this viewport. |
| `SDF_SCALE_MAX` | `3` | Represents the size of the SDFScale enum. |

#### VRSMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `VRS_DISABLED` | `0` | Variable Rate Shading is disabled. |
| `VRS_TEXTURE` | `1` | Variable Rate Shading uses a texture. Note, for stereoscopic use a texture atlas with a texture for each view. |
| `VRS_XR` | `2` | Variable Rate Shading's texture is supplied by the primary XRInterface. |
| `VRS_MAX` | `3` | Represents the size of the VRSMode enum. |

#### VRSUpdateMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `VRS_UPDATE_DISABLED` | `0` | The input texture for variable rate shading will not be processed. |
| `VRS_UPDATE_ONCE` | `1` | The input texture for variable rate shading will be processed once. |
| `VRS_UPDATE_ALWAYS` | `2` | The input texture for variable rate shading will be processed each frame. |
| `VRS_UPDATE_MAX` | `3` | Represents the size of the VRSUpdateMode enum. |

### 使用场景
创建独立渲染区域实现分屏或画中画。

### 官方链接
[Viewport 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Viewport.html)

---

## Window

**继承链：** Viewport > Node > Object

**描述：** 窗口节点，可创建独立窗口或嵌入式窗口。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `always_on_top` | `bool` | ``false`` | - |
| `auto_translate` | `bool` | ``true`` | - |
| `borderless` | `bool` | ``false`` | - |
| `content_scale_aspect` | `ContentScaleAspect` | ``0`` | - |
| `content_scale_factor` | `float` | ``1.0`` | - |
| `content_scale_mode` | `ContentScaleMode` | ``0`` | - |
| `content_scale_size` | `Vector2i` | ``Vector2i(0, 0)`` | - |
| `content_scale_stretch` | `ContentScaleStretch` | ``0`` | - |
| `current_screen` | `int` | `-` | - |
| `exclusive` | `bool` | ``false`` | - |
| `extend_to_title` | `bool` | ``false`` | - |
| `force_native` | `bool` | ``false`` | - |
| `initial_position` | `WindowInitialPosition` | ``0`` | - |
| `keep_title_visible` | `bool` | ``false`` | - |
| `max_size` | `Vector2i` | ``Vector2i(0, 0)`` | - |
| `min_size` | `Vector2i` | ``Vector2i(0, 0)`` | - |
| `mode` | `Mode` | ``0`` | - |
| `mouse_passthrough` | `bool` | ``false`` | - |
| `mouse_passthrough_polygon` | `PackedVector2Array` | ``PackedVector2Array()`` | - |
| `popup_window` | `bool` | ``false`` | - |
| `position` | `Vector2i` | ``Vector2i(0, 0)`` | - |
| `size` | `Vector2i` | ``Vector2i(100, 100)`` | - |
| `theme` | `Theme` | `-` | - |
| `theme_type_variation` | `StringName` | ``&""`` | - |
| `title` | `String` | ``""`` | - |
| `transient` | `bool` | ``false`` | - |
| `transient_to_focused` | `bool` | ``false`` | - |
| `transparent` | `bool` | ``false`` | - |
| `unfocusable` | `bool` | ``false`` | - |
| `unresizable` | `bool` | ``false`` | - |
| `visible` | `bool` | ``true`` | - |
| `wrap_controls` | `bool` | ``false`` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `_get_contents_minimum_size` | `Vector2` | `()` | - |
| `add_theme_color_override` | `void` | `name: StringName, color: Color` | - |
| `add_theme_constant_override` | `void` | `name: StringName, constant: int` | - |
| `add_theme_font_override` | `void` | `name: StringName, font: Font` | - |
| `add_theme_font_size_override` | `void` | `name: StringName, font_size: int` | - |
| `add_theme_icon_override` | `void` | `name: StringName, texture: Texture2D` | - |
| `add_theme_stylebox_override` | `void` | `name: StringName, stylebox: StyleBox` | - |
| `begin_bulk_theme_override` | `void` | `()` | - |
| `can_draw` | `bool` | `()` | - |
| `child_controls_changed` | `void` | `()` | - |
| `end_bulk_theme_override` | `void` | `()` | - |
| `get_contents_minimum_size` | `Vector2` | `()` | - |
| `get_flag` | `bool` | `flag: Flags` | - |
| `get_layout_direction` | `LayoutDirection` | `()` | - |
| `get_position_with_decorations` | `Vector2i` | `()` | - |
| `get_size_with_decorations` | `Vector2i` | `()` | - |
| `get_theme_color` | `Color` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_constant` | `int` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_default_base_scale` | `float` | `()` | - |
| `get_theme_default_font` | `Font` | `()` | - |
| `get_theme_default_font_size` | `int` | `()` | - |
| `get_theme_font` | `Font` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_font_size` | `int` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_icon` | `Texture2D` | `name: StringName, theme_type: StringName = &""` | - |
| `get_theme_stylebox` | `StyleBox` | `name: StringName, theme_type: StringName = &""` | - |
| `get_window_id` | `int` | `()` | - |
| `grab_focus` | `void` | `()` | - |
| `has_focus` | `bool` | `()` | - |
| `has_theme_color` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_color_override` | `bool` | `name: StringName` | - |
| `has_theme_constant` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_constant_override` | `bool` | `name: StringName` | - |
| `has_theme_font` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_font_override` | `bool` | `name: StringName` | - |
| `has_theme_font_size` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_font_size_override` | `bool` | `name: StringName` | - |
| `has_theme_icon` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_icon_override` | `bool` | `name: StringName` | - |
| `has_theme_stylebox` | `bool` | `name: StringName, theme_type: StringName = &""` | - |
| `has_theme_stylebox_override` | `bool` | `name: StringName` | - |
| `hide` | `void` | `()` | - |
| `is_embedded` | `bool` | `()` | - |
| `is_layout_rtl` | `bool` | `()` | - |
| `is_maximize_allowed` | `bool` | `()` | - |
| `is_using_font_oversampling` | `bool` | `()` | - |
| `move_to_center` | `void` | `()` | - |
| `move_to_foreground` | `void` | `()` | - |
| `popup` | `void` | `rect: Rect2i = Rect2i(0, 0, 0, 0)` | - |
| `popup_centered` | `void` | `minsize: Vector2i = Vector2i(0, 0)` | - |
| `popup_centered_clamped` | `void` | `minsize: Vector2i = Vector2i(0, 0), fallback_ratio: float = 0.75` | - |
| `popup_centered_ratio` | `void` | `ratio: float = 0.8` | - |
| `popup_exclusive` | `void` | `from_node: Node, rect: Rect2i = Rect2i(0, 0, 0, 0)` | - |
| `popup_exclusive_centered` | `void` | `from_node: Node, minsize: Vector2i = Vector2i(0, 0)` | - |
| `popup_exclusive_centered_clamped` | `void` | `from_node: Node, minsize: Vector2i = Vector2i(0, 0), fallback_ratio: float = 0.75` | - |
| `popup_exclusive_centered_ratio` | `void` | `from_node: Node, ratio: float = 0.8` | - |
| `popup_exclusive_on_parent` | `void` | `from_node: Node, parent_rect: Rect2i` | - |
| `popup_on_parent` | `void` | `parent_rect: Rect2i` | - |
| `remove_theme_color_override` | `void` | `name: StringName` | - |
| `remove_theme_constant_override` | `void` | `name: StringName` | - |
| `remove_theme_font_override` | `void` | `name: StringName` | - |
| `remove_theme_font_size_override` | `void` | `name: StringName` | - |
| `remove_theme_icon_override` | `void` | `name: StringName` | - |
| `remove_theme_stylebox_override` | `void` | `name: StringName` | - |
| `request_attention` | `void` | `()` | - |
| `reset_size` | `void` | `()` | - |
| `set_flag` | `void` | `flag: Flags, enabled: bool` | - |
| `set_ime_active` | `void` | `active: bool` | - |
| `set_ime_position` | `void` | `position: Vector2i` | - |
| `set_layout_direction` | `void` | `direction: LayoutDirection` | - |
| `set_unparent_when_invisible` | `void` | `unparent: bool` | - |
| `set_use_font_oversampling` | `void` | `enable: bool` | - |
| `show` | `void` | `()` | - |
| `title_color` | `Color` | `()` | - |
| `title_outline_modulate` | `Color` | `()` | - |
| `close_h_offset` | `int` | `()` | - |
| `close_v_offset` | `int` | `()` | - |
| `resize_margin` | `int` | `()` | - |
| `title_height` | `int` | `()` | - |
| `title_outline_size` | `int` | `()` | - |
| `title_font` | `Font` | `()` | - |
| `title_font_size` | `int` | `()` | - |
| `close` | `Texture2D` | `()` | - |
| `close_pressed` | `Texture2D` | `()` | - |
| `embedded_border` | `StyleBox` | `()` | - |
| `embedded_unfocused_border` | `StyleBox` | `()` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `about_to_popup` | `-` | Emitted right after popup call, before the Window appears or does anything. |
| `close_requested` | `-` | Emitted when the Window's close button is pressed or when popup_window is enabled and user clicks outside the window. This signal can be used to handle window closing, e.g. by connecting it to hide. |
| `dpi_changed` | `-` | Emitted when the Window's DPI changes as a result of OS-level changes (e.g. moving the window from a Retina display to a lower resolution one). Note: Only implemented on macOS. |
| `files_dropped` | `files: PackedStringArray` | Emitted when files are dragged from the OS file manager and dropped in the game window. The argument is a list of file paths. Note that this method only works with native windows, i.e. the main... |
| `focus_entered` | `-` | Emitted when the Window gains focus. |
| `focus_exited` | `-` | Emitted when the Window loses its focus. |
| `go_back_requested` | `-` | Emitted when a go back request is sent (e.g. pressing the "Back" button on Android), right after Node.NOTIFICATION_WM_GO_BACK_REQUEST. |
| `mouse_entered` | `-` | Emitted when the mouse cursor enters the Window's visible area, that is not occluded behind other Control s or windows, provided its Viewport.gui_disable_input is `false` and regardless if it's... |
| `mouse_exited` | `-` | Emitted when the mouse cursor leaves the Window's visible area, that is not occluded behind other Control s or windows, provided its Viewport.gui_disable_input is `false` and regardless if it's... |
| `theme_changed` | `-` | Emitted when the NOTIFICATION_THEME_CHANGED notification is sent. |
| `titlebar_changed` | `-` | Emitted when window title bar decorations are changed, e.g. macOS window enter/exit full screen mode, or extend-to-title flag is changed. |
| `visibility_changed` | `-` | Emitted when Window is made visible or disappears. |
| `window_input` | `event: InputEvent` | Emitted when the Window is currently focused and receives any input, passing the received event as an argument. The event's position, if present, is in the embedder's coordinate system. |

### 枚举
#### Mode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `MODE_WINDOWED` | `0` | Windowed mode, i.e. Window doesn't occupy the whole screen (unless set to the size of the screen). |
| `MODE_MINIMIZED` | `1` | Minimized window mode, i.e. Window is not visible and available on window manager's window list. Normally happens when the minimize button is pressed. |
| `MODE_MAXIMIZED` | `2` | Maximized window mode, i.e. Window will occupy whole screen area except task bar and still display its borders. Normally happens when the maximize but |
| `MODE_FULLSCREEN` | `3` | Full screen mode with full multi-window support. Full screen window covers the entire display area of a screen and has no decorations. The display's v |
| `MODE_EXCLUSIVE_FULLSCREEN` | `4` | A single window full screen mode. This mode has less overhead, but only one window can be open on a given screen at a time (opening a child window or  |

#### Flags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `FLAG_RESIZE_DISABLED` | `0` | The window can't be resized by dragging its resize grip. It's still possible to resize the window using size. This flag is ignored for full screen win |
| `FLAG_BORDERLESS` | `1` | The window do not have native title bar and other decorations. This flag is ignored for full-screen windows. Set with borderless. |
| `FLAG_ALWAYS_ON_TOP` | `2` | The window is floating on top of all other windows. This flag is ignored for full-screen windows. Set with always_on_top. |
| `FLAG_TRANSPARENT` | `3` | The window background can be transparent. Set with transparent. Note: This flag has no effect if either ProjectSettings.display/window/per_pixel_trans |
| `FLAG_NO_FOCUS` | `4` | The window can't be focused. No-focus window will ignore all input, except mouse clicks. Set with unfocusable. |
| `FLAG_POPUP` | `5` | Window is part of menu or OptionButton dropdown. This flag can't be changed when the window is visible. An active popup window will exclusively receiv |
| `FLAG_EXTEND_TO_TITLE` | `6` | Window content is expanded to the full size of the window. Unlike borderless window, the frame is left intact and can be used to resize the window, ti |
| `FLAG_MOUSE_PASSTHROUGH` | `7` | All mouse events are passed to the underlying window of the same application. Note: This flag has no effect in embedded windows. |
| `FLAG_MAX` | `8` | Max value of the Flags. |

#### ContentScaleMode
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CONTENT_SCALE_MODE_DISABLED` | `0` | The content will not be scaled to match the Window's size. |
| `CONTENT_SCALE_MODE_CANVAS_ITEMS` | `1` | The content will be rendered at the target size. This is more performance-expensive than CONTENT_SCALE_MODE_VIEWPORT, but provides better results. |
| `CONTENT_SCALE_MODE_VIEWPORT` | `2` | The content will be rendered at the base size and then scaled to the target size. More performant than CONTENT_SCALE_MODE_CANVAS_ITEMS, but results in |

#### ContentScaleAspect
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CONTENT_SCALE_ASPECT_IGNORE` | `0` | The aspect will be ignored. Scaling will simply stretch the content to fit the target size. |
| `CONTENT_SCALE_ASPECT_KEEP` | `1` | The content's aspect will be preserved. If the target size has different aspect from the base one, the image will be centered and black bars will appe |
| `CONTENT_SCALE_ASPECT_KEEP_WIDTH` | `2` | The content can be expanded vertically. Scaling horizontally will result in keeping the width ratio and then black bars on left and right sides. |
| `CONTENT_SCALE_ASPECT_KEEP_HEIGHT` | `3` | The content can be expanded horizontally. Scaling vertically will result in keeping the height ratio and then black bars on top and bottom sides. |
| `CONTENT_SCALE_ASPECT_EXPAND` | `4` | The content's aspect will be preserved. If the target size has different aspect from the base one, the content will stay in the top-left corner and ad |

#### ContentScaleStretch
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `CONTENT_SCALE_STRETCH_FRACTIONAL` | `0` | The content will be stretched according to a fractional factor. This fills all the space available in the window, but allows "pixel wobble" to occur d |
| `CONTENT_SCALE_STRETCH_INTEGER` | `1` | The content will be stretched only according to an integer factor, preserving sharp pixels. This may leave a black background visible on the window's  |

#### LayoutDirection
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `LAYOUT_DIRECTION_INHERITED` | `0` | Automatic layout direction, determined from the parent window layout direction. |
| `LAYOUT_DIRECTION_LOCALE` | `1` | Automatic layout direction, determined from the current locale. |
| `LAYOUT_DIRECTION_LTR` | `2` | Left-to-right layout direction. |
| `LAYOUT_DIRECTION_RTL` | `3` | Right-to-left layout direction. |

#### WindowInitialPosition
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `WINDOW_INITIAL_POSITION_ABSOLUTE` | `0` | Initial window position is determined by position. |
| `WINDOW_INITIAL_POSITION_CENTER_PRIMARY_SCREEN` | `1` | Initial window position is the center of the primary screen. |
| `WINDOW_INITIAL_POSITION_CENTER_MAIN_WINDOW_SCREEN` | `2` | Initial window position is the center of the main window screen. |
| `WINDOW_INITIAL_POSITION_CENTER_OTHER_SCREEN` | `3` | Initial window position is the center of current_screen screen. |
| `WINDOW_INITIAL_POSITION_CENTER_SCREEN_WITH_MOUSE_FOCUS` | `4` | Initial window position is the center of the screen containing the mouse pointer. |
| `WINDOW_INITIAL_POSITION_CENTER_SCREEN_WITH_KEYBOARD_FOCUS` | `5` | Initial window position is the center of the screen containing the window with the keyboard focus. |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_VISIBILITY_CHANGED` | `30` | Emitted when Window's visibility changes, right before visibility_changed. |
| `NOTIFICATION_THEME_CHANGED` | `32` | Sent when the node needs to refresh its theme items. This happens in one of the following cases: - The theme property is |

### 使用场景
创建弹出窗口、对话框、全屏模式。

### 官方链接
[Window 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Window.html)

---

## SceneTree

**继承链：** MainLoop > Object

**描述：** 场景树，管理主循环和场景切换。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `auto_accept_quit` | `bool` | ``true`` | - |
| `current_scene` | `Node` | `-` | - |
| `debug_collisions_hint` | `bool` | ``false`` | - |
| `debug_navigation_hint` | `bool` | ``false`` | - |
| `debug_paths_hint` | `bool` | ``false`` | - |
| `edited_scene_root` | `Node` | `-` | - |
| `multiplayer_poll` | `bool` | ``true`` | - |
| `paused` | `bool` | ``false`` | - |
| `physics_interpolation` | `bool` | ``false`` | - |
| `quit_on_go_back` | `bool` | ``true`` | - |
| `root` | `Window` | `-` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `call_group` | `void` | `group: StringName, method: StringName, ...` | - |
| `call_group_flags` | `void` | `flags: int, group: StringName, method: StringName, ...` | - |
| `change_scene_to_file` | `Error` | `path: String` | - |
| `change_scene_to_packed` | `Error` | `packed_scene: PackedScene` | - |
| `create_timer` | `SceneTreeTimer` | `time_sec: float, process_always: bool = true, process_in_physics: bool = false, ignore_time_scale: b` | - |
| `create_tween` | `Tween` | `()` | - |
| `get_first_node_in_group` | `Node` | `group: StringName` | - |
| `get_frame` | `int` | `()` | - |
| `get_multiplayer` | `MultiplayerAPI` | `for_path: NodePath = NodePath("")` | - |
| `get_node_count` | `int` | `()` | - |
| `get_node_count_in_group` | `int` | `group: StringName` | - |
| `get_nodes_in_group` | `Array\[Node\]` | `group: StringName` | - |
| `get_processed_tweens` | `Array\[Tween\]` | `()` | - |
| `has_group` | `bool` | `name: StringName` | - |
| `notify_group` | `void` | `group: StringName, notification: int` | - |
| `notify_group_flags` | `void` | `call_flags: int, group: StringName, notification: int` | - |
| `queue_delete` | `void` | `obj: Object` | - |
| `quit` | `void` | `exit_code: int = 0` | - |
| `reload_current_scene` | `Error` | `()` | - |
| `set_group` | `void` | `group: StringName, property: String, value: Variant` | - |
| `set_group_flags` | `void` | `call_flags: int, group: StringName, property: String, value: Variant` | - |
| `set_multiplayer` | `void` | `multiplayer: MultiplayerAPI, root_path: NodePath = NodePath("")` | - |
| `unload_current_scene` | `void` | `()` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `node_added` | `node: Node` | Emitted when the `node` enters this tree. |
| `node_configuration_warning_changed` | `node: Node` | Emitted when the `node`'s Node.update_configuration_warnings is called. Only emitted in the editor. |
| `node_removed` | `node: Node` | Emitted when the `node` exits this tree. |
| `node_renamed` | `node: Node` | Emitted when the `node`'s Node.name is changed. |
| `physics_frame` | `-` | Emitted immediately before Node._physics_process is called on every node in this tree. |
| `process_frame` | `-` | Emitted immediately before Node._process is called on every node in this tree. |
| `tree_changed` | `-` | Emitted any time the tree's hierarchy changes (nodes being moved, renamed, etc.). |
| `tree_process_mode_changed` | `-` | Emitted when the Node.process_mode of any node inside the tree is changed. Only emitted in the editor, to update the visibility of disabled nodes. |

### 枚举
#### GroupCallFlags
| 枚举值 | 数值 | 描述 |
|--------|------|------|
| `GROUP_CALL_DEFAULT` | `0` | Call nodes within a group with no special behavior (default). |
| `GROUP_CALL_REVERSE` | `1` | Call nodes within a group in reverse tree hierarchy order (all nested children are called before their respective parent nodes). |
| `GROUP_CALL_DEFERRED` | `2` | Call nodes within a group at the end of the current frame (can be either process or physics frame), similar to Object.call_deferred. |
| `GROUP_CALL_UNIQUE` | `4` | Call nodes within a group only once, even if the call is executed many times in the same frame. Must be combined with GROUP_CALL_DEFERRED to work. Not |

### 使用场景
管理场景加载切换和暂停。

### 示例代码
```gdscript
# 切换场景
get_tree().change_scene_to_file("res://level2.tscn")

# 暂停游戏
get_tree().paused = true

# 创建定时器
await get_tree().create_timer(2.0).timeout
print("2秒后执行")
```

### 官方链接
[SceneTree 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_SceneTree.html)

---

## MainLoop

**继承链：** Object

**描述：** 主循环基类，负责处理帧迭代。

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `_finalize` | `void` | `()` | - |
| `_initialize` | `void` | `()` | - |
| `_physics_process` | `bool` | `delta: float` | - |
| `_process` | `bool` | `delta: float` | - |

### 信号
| 信号名 | 参数 | 描述 |
|--------|------|------|
| `on_request_permissions_result` | `permission: String, granted: bool` | Emitted when a user responds to a permission request. |

### 常量
| 常量名 | 值 | 描述 |
|--------|-----|------|
| `NOTIFICATION_OS_MEMORY_WARNING` | `2009` | Notification received from the OS when the application is exceeding its allocated memory. Specific to the iOS platform. |
| `NOTIFICATION_TRANSLATION_CHANGED` | `2010` | Notification received when translations may have changed. Can be triggered by the user changing the locale. Can be used  |
| `NOTIFICATION_WM_ABOUT` | `2011` | Notification received from the OS when a request for "About" information is sent. Specific to the macOS platform. |
| `NOTIFICATION_CRASH` | `2012` | Notification received from Godot's crash handler when the engine is about to crash. Implemented on desktop platforms if  |
| `NOTIFICATION_OS_IME_UPDATE` | `2013` | Notification received from the OS when an update of the Input Method Engine occurs (e.g. change of IME cursor position o |
| `NOTIFICATION_APPLICATION_RESUMED` | `2014` | Notification received from the OS when the application is resumed. Specific to the Android and iOS platforms. |
| `NOTIFICATION_APPLICATION_PAUSED` | `2015` | Notification received from the OS when the application is paused. Specific to the Android and iOS platforms. Note: On iO |
| `NOTIFICATION_APPLICATION_FOCUS_IN` | `2016` | Notification received from the OS when the application is focused, i.e. when changing the focus from the OS desktop or a |
| `NOTIFICATION_APPLICATION_FOCUS_OUT` | `2017` | Notification received from the OS when the application is defocused, i.e. when changing the focus from any open window o |
| `NOTIFICATION_TEXT_SERVER_CHANGED` | `2018` | Notification received when text server is changed. |

### 使用场景
自定义游戏主循环（通常使用 SceneTree 即可）。

### 官方链接
[MainLoop 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_MainLoop.html)

---

## Engine

**继承链：** Object

**描述：** 引擎单例，提供版本信息、时间步长等核心功能。

### 属性
| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| `max_fps` | `int` | ``0`` | - |
| `max_physics_steps_per_frame` | `int` | ``8`` | - |
| `physics_jitter_fix` | `float` | ``0.5`` | - |
| `physics_ticks_per_second` | `int` | ``60`` | - |
| `print_error_messages` | `bool` | ``true`` | - |
| `time_scale` | `float` | ``1.0`` | - |

### 方法
| 方法名 | 返回类型 | 参数 | 描述 |
|--------|----------|------|------|
| `get_architecture_name` | `String` | `()` | - |
| `get_author_info` | `Dictionary` | `()` | - |
| `get_copyright_info` | `Array\[Dictionary\]` | `()` | - |
| `get_donor_info` | `Dictionary` | `()` | - |
| `get_frames_drawn` | `int` | `()` | - |
| `get_frames_per_second` | `float` | `()` | - |
| `get_license_info` | `Dictionary` | `()` | - |
| `get_license_text` | `String` | `()` | - |
| `get_main_loop` | `MainLoop` | `()` | - |
| `get_physics_frames` | `int` | `()` | - |
| `get_physics_interpolation_fraction` | `float` | `()` | - |
| `get_process_frames` | `int` | `()` | - |
| `get_script_language` | `ScriptLanguage` | `index: int` | - |
| `get_script_language_count` | `int` | `()` | - |
| `get_singleton` | `Object` | `name: StringName` | - |
| `get_singleton_list` | `PackedStringArray` | `()` | - |
| `get_version_info` | `Dictionary` | `()` | - |
| `get_write_movie_path` | `String` | `()` | - |
| `has_singleton` | `bool` | `name: StringName` | - |
| `is_editor_hint` | `bool` | `()` | - |
| `is_in_physics_frame` | `bool` | `()` | - |
| `register_script_language` | `Error` | `language: ScriptLanguage` | - |
| `register_singleton` | `void` | `name: StringName, instance: Object` | - |
| `unregister_script_language` | `Error` | `language: ScriptLanguage` | - |
| `unregister_singleton` | `void` | `name: StringName` | - |

### 使用场景
控制时间缩放、帧率限制、性能监控等。

### 示例代码
```gdscript
# 控制时间
Engine.time_scale = 2.0  # 2倍速
Engine.time_scale = 0.5  # 慢动作

# 性能监控
print("FPS: ", Engine.get_frames_per_second())

# 编辑器判断
if Engine.is_editor_hint():
    # 仅在编辑器中运行
    pass
```

### 官方链接
[Engine 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_Engine.html)

---


---



# 第二部分：节点类

> 涵盖 2D 节点、3D 节点、UI 节点、动画/音频节点等 86 个常用节点类的完整 API。

## 目录

### 2D节点

- [Sprite2D](#sprite2d)
- [AnimatedSprite2D](#animatedsprite2d)
- [Camera2D](#camera2d)
- [TileMapLayer](#tilemaplayer)
- [CollisionShape2D](#collisionshape2d)
- [CollisionObject2D](#collisionobject2d)
- [Area2D](#area2d)
- [StaticBody2D](#staticbody2d)
- [CharacterBody2D](#characterbody2d)
- [RigidBody2D](#rigidbody2d)
- [RayCast2D](#raycast2d)
- [Line2D](#line2d)
- [Polygon2D](#polygon2d)
- [Path2D](#path2d)
- [PathFollow2D](#pathfollow2d)
- [NavigationAgent2D](#navigationagent2d)
- [NavigationRegion2D](#navigationregion2d)
- [Light2D](#light2d)
- [PointLight2D](#pointlight2d)
- [GPUParticles2D](#gpuparticles2d)
- [CPUParticles2D](#cpuparticles2d)
- [Skeleton2D](#skeleton2d)
- [Bone2D](#bone2d)
- [Marker2D](#marker2d)

### 3D节点

- [Sprite3D](#sprite3d)
- [Camera3D](#camera3d)
- [MeshInstance3D](#meshinstance3d)
- [CollisionShape3D](#collisionshape3d)
- [CollisionObject3D](#collisionobject3d)
- [Area3D](#area3d)
- [StaticBody3D](#staticbody3d)
- [CharacterBody3D](#characterbody3d)
- [RigidBody3D](#rigidbody3d)
- [RayCast3D](#raycast3d)
- [DirectionalLight3D](#directionallight3d)
- [OmniLight3D](#omnilight3d)
- [SpotLight3D](#spotlight3d)
- [GPUParticles3D](#gpuparticles3d)
- [CPUParticles3D](#cpuparticles3d)
- [Skeleton3D](#skeleton3d)
- [GridMap](#gridmap)
- [NavigationAgent3D](#navigationagent3d)
- [NavigationRegion3D](#navigationregion3d)
- [CSGBox3D](#csgbox3d)
- [SoftBody3D](#softbody3d)
- [VehicleBody3D](#vehiclebody3d)

### UI节点

- [Label](#label)
- [Button](#button)
- [LineEdit](#lineedit)
- [TextEdit](#textedit)
- [RichTextLabel](#richtextlabel)
- [TextureRect](#texturerect)
- [TextureButton](#texturebutton)
- [ProgressBar](#progressbar)
- [HSlider](#hslider)
- [VSlider](#vslider)
- [SpinBox](#spinbox)
- [OptionButton](#optionbutton)
- [CheckBox](#checkbox)
- [CheckButton](#checkbutton)
- [ItemList](#itemlist)
- [Tree](#tree)
- [TabContainer](#tabcontainer)
- [ScrollContainer](#scrollcontainer)
- [HSplitContainer](#hsplitcontainer)
- [VSplitContainer](#vsplitcontainer)
- [MarginContainer](#margincontainer)
- [VBoxContainer](#vboxcontainer)
- [HBoxContainer](#hboxcontainer)
- [GridContainer](#gridcontainer)
- [CenterContainer](#centercontainer)
- [PanelContainer](#panelcontainer)
- [ColorPicker](#colorpicker)
- [Popup](#popup)
- [PopupMenu](#popupmenu)
- [FileDialog](#filedialog)
- [GraphEdit](#graphedit)
- [GraphNode](#graphnode)

### 动画/音频

- [AnimationPlayer](#animationplayer)
- [AnimationTree](#animationtree)
- [AnimationMixer](#animationmixer)
- [AudioStreamPlayer](#audiostreamplayer)
- [AudioStreamPlayer2D](#audiostreamplayer2d)
- [AudioStreamPlayer3D](#audiostreamplayer3d)
- [VideoStreamPlayer](#videostreamplayer)
- [Timer](#timer)

---

# 2D节点

---

## Sprite2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 用于显示 2D 纹理的通用精灵节点。可以在屏幕上显示 Texture2D 纹理，支持从精灵图集中选择区域，也支持精灵表动画（通过 hframes 和 vframes 设置帧数）。是 2D 游戏中最常用的图像显示节点。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| centered | bool | `true` | 是否居中 |
| flip_h | bool | `false` | 水平翻转 |
| flip_v | bool | `false` | 垂直翻转 |
| frame | int | `0` | 当前帧 |
| frame_coords | Vector2i | `Vector2i(0, 0)` | 帧坐标（列,行） |
| hframes | int | `1` | 水平帧数 |
| offset | Vector2 | `Vector2(0, 0)` | 偏移量 |
| region_enabled | bool | `false` | 是否启用区域裁剪 |
| region_filter_clip_enabled | bool | `false` | 裁剪边缘过滤 |
| region_rect | Rect2 | `Rect2(0, 0, 0, 0)` | 裁剪区域 |
| texture | Texture2D | `-` | 纹理资源 |
| vframes | int | `1` | 垂直帧数 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_rect | Rect2 | - |
| is_pixel_opaque | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| frame_changed | \ | 帧改变时触发 |
| texture_changed | \ | 纹理改变时触发 |

### 使用场景

- 显示 2D 图形：角色、道具、背景、UI 图标
- 精灵图集裁剪和翻转
- 简单的帧动画（通过 hframes/vframes）

### 示例代码

```gdscript
# Sprite2D 基本使用示例
var sprite = $Sprite2D
sprite.texture = load("res://icon.png")
sprite.flip_h = true
sprite.centered = true
```

### 官方链接

[Sprite2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_sprite2d.html)

---

## AnimatedSprite2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 用于播放精灵帧动画的 2D 节点。使用 SpriteFrames 资源来存储和管理动画帧序列，支持多个动画的切换、播放速度控制、循环设置等。适合需要帧动画的角色和道具。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| animation | StringName | `&"default"` | 当前动画名 |
| autoplay | String | `""` | 自动播放 |
| centered | bool | `true` | 是否居中 |
| flip_h | bool | `false` | 水平翻转 |
| flip_v | bool | `false` | 垂直翻转 |
| frame | int | `0` | 当前帧 |
| frame_progress | float | `0.0` | 当前帧进度 |
| offset | Vector2 | `Vector2(0, 0)` | 偏移量 |
| speed_scale | float | `1.0` | 速度缩放 |
| sprite_frames | SpriteFrames | `-` | 精灵帧资源 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_playing_speed | float | - |
| is_playing | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| animation_changed | \ | 动画切换时触发 |
| animation_finished | \ | 动画播放完成时触发 |
| animation_looped | \ | 动画循环播放时触发 |
| frame_changed | \ | 帧改变时触发 |
| sprite_frames_changed | \ | 精灵帧资源改变时触发 |

### 使用场景

- 播放角色帧动画：行走、跳跃、攻击、死亡
- 道具动画：闪烁的金币、转动的齿轮
- 使用 SpriteFrames 编辑器管理动画序列

### 示例代码

```gdscript
# AnimatedSprite2D 基本使用示例
var anim_sprite = $AnimatedSprite2D
anim_sprite.play("walk")
```

### 官方链接

[AnimatedSprite2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_animatedsprite2d.html)

---

## Camera2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 摄像机节点，用于控制 2D 视口的可见区域。支持平滑跟随、拖拽边距、缩放、旋转平滑、场景限制等功能。是 2D 游戏视角控制的核心节点。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| custom_viewport | Node | `-` | 自定义视口 |
| drag_bottom_margin | float | `0.2` | 下方拖拽边距 |
| drag_horizontal_enabled | bool | `false` | 启用水平拖拽边距 |
| drag_horizontal_offset | float | `0.0` | 该属性的配置项 |
| drag_left_margin | float | `0.2` | 左侧拖拽边距 |
| drag_right_margin | float | `0.2` | 右侧拖拽边距 |
| drag_top_margin | float | `0.2` | 上方拖拽边距 |
| drag_vertical_enabled | bool | `false` | 启用垂直拖拽边距 |
| drag_vertical_offset | float | `0.0` | 该属性的配置项 |
| editor_draw_drag_margin | bool | `false` | 编辑器中绘制拖拽边距 |
| editor_draw_limits | bool | `false` | 编辑器中绘制限制线 |
| editor_draw_screen | bool | `true` | 编辑器中绘制屏幕范围 |
| enabled | bool | `true` | 是否启用 |
| ignore_rotation | bool | `true` | 是否忽略旋转 |
| limit_bottom | int | `10000000` | 下边界限制 |
| limit_left | int | `-10000000` | 左边界限制 |
| limit_right | int | `10000000` | 右边界限制 |
| limit_smoothed | bool | `false` | 平滑限制过渡 |
| limit_top | int | `-10000000` | 上边界限制 |
| offset | Vector2 | `Vector2(0, 0)` | 偏移量 |
| position_smoothing_enabled | bool | `false` | 启用位置平滑跟随 |
| position_smoothing_speed | float | `5.0` | 位置平滑速度 |
| rotation_smoothing_enabled | bool | `false` | 启用旋转平滑 |
| rotation_smoothing_speed | float | `5.0` | 该属性的配置项 |
| zoom | Vector2 | `Vector2(1, 1)` | 缩放比例 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_drag_margin | float | - |
| get_limit | int | - |
| get_screen_center_position | Vector2 | - |
| get_target_position | Vector2 | - |
| is_current | bool | - |

### 使用场景

- 2D 游戏的摄像机跟随玩家
- 场景滚动和缩放控制
- 平滑过渡和死区设置

### 示例代码

```gdscript
# Camera2D 基本使用示例
var camera = $Camera2D
camera.zoom = Vector2(2, 2)
camera.position_smoothing_enabled = true
```

### 官方链接

[Camera2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_camera2d.html)

---

## TileMapLayer

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 瓦片地图层节点（Godot 4.x 新增，替代旧版 TileMap）。使用 TileSet 资源来绘制基于瓦片的地图，支持碰撞、导航、自定义数据层等功能。每个层独立管理，便于分层编辑。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| collision_enabled | bool | `true` | 是否启用碰撞 |
| enabled | bool | `true` | 是否启用 |
| navigation_enabled | bool | `true` | 是否启用导航 |
| rendering_quadrant_size | int | `16` | 渲染象限大小 |
| tile_map_data | PackedByteArray | `PackedByteArray()` | 瓦片地图数据 |
| tile_set | TileSet | `-` | 瓦片集资源 |
| use_kinematic_bodies | bool | `false` | 使用运动学刚体 |
| x_draw_order_reversed | bool | `false` | 反转 X 绘制顺序 |
| y_sort_origin | int | `0` | Y 排序原点 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| _use_tile_data_runtime_update | bool | - |
| get_cell_alternative_tile | int | - |
| get_cell_atlas_coords | Vector2i | - |
| get_cell_source_id | int | - |
| get_cell_tile_data | TileData | - |
| get_coords_for_body_rid | Vector2i | - |
| get_navigation_map | RID | - |
| get_neighbor_cell | Vector2i | - |
| get_pattern | TileMapPattern | - |
| get_used_rect | Rect2i | - |
| has_body_rid | bool | - |
| local_to_map | Vector2i | - |
| map_pattern | Vector2i | - |
| map_to_local | Vector2 | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| changed | \ | 内容改变时触发 |

### 使用场景

- 2D 关卡设计和地图绘制
- 地形、平台、墙壁等环境元素
- 碰撞层和导航层设置

### 示例代码

```gdscript
# TileMapLayer 基本使用示例
# TileMapLayer 使用示例
```

### 官方链接

[TileMapLayer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_tilemaplayer.html)

---

## CollisionShape2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 定义 2D 碰撞形状的节点。必须作为 CollisionObject2D 的子节点才能生效。支持矩形、圆形、胶囊形、凸多边形、线段等多种形状。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| debug_color | Color | `Color(0, 0, 0, 1)` | 该属性的配置项 |
| disabled | bool | `false` | 是否禁用 |
| one_way_collision | bool | `false` | 该属性的配置项 |
| one_way_collision_margin | float | `1.0` | 该属性的配置项 |
| shape | Shape2D | `-` | 碰撞形状 |

### 使用场景

为物理对象定义碰撞形状，如圆形、矩形、多边形。

### 示例代码

```gdscript
# CollisionShape2D 基本使用示例
# CollisionShape2D 使用示例
```

### 官方链接

[CollisionShape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_collisionshape2d.html)

---

## CollisionObject2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 碰撞对象的抽象基类。Area2D 和各类 PhysicsBody2D 都继承自此类。提供碰撞形状管理、碰撞层/掩码设置等基础功能。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| collision_layer | int | `1` | 碰撞层 |
| collision_mask | int | `1` | 碰撞掩码 |
| collision_priority | float | `1.0` | 碰撞优先级 |
| input_pickable | bool | `true` | 是否接收输入事件 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| create_shape_owner | int | - |
| get_collision_layer_value | bool | - |
| get_collision_mask_value | bool | - |
| get_rid | RID | - |
| get_shape_owner_one_way_collision_margin | float | - |
| get_shape_owners | PackedInt32Array | - |
| is_shape_owner_disabled | bool | - |
| is_shape_owner_one_way_collision_enabled | bool | - |
| shape_find_owner | int | - |
| shape_owner_get_owner | Object | - |
| shape_owner_get_shape | Shape2D | - |
| shape_owner_get_shape_count | int | - |
| shape_owner_get_shape_index | int | - |
| shape_owner_get_transform | Transform2D | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| input_event | \ viewport\: , event\: , shape_idx\: \ | 接收输入事件时触发 |
| mouse_entered | \ | 鼠标进入时触发 |
| mouse_exited | \ | 鼠标离开时触发 |
| mouse_shape_entered | \ shape_idx\: \ | - |
| mouse_shape_exited | \ shape_idx\: \ | - |

### 使用场景

作为 Area2D 和 PhysicsBody2D 的基类使用。

### 示例代码

```gdscript
# CollisionObject2D 基本使用示例
# CollisionObject2D 使用示例
```

### 官方链接

[CollisionObject2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_collisionobject2d.html)

---

## Area2D

**继承链：** CollisionObject2D > Node2D > CanvasItem > Node > Object
**描述：** 2D 区域节点，用于检测物体进出和重叠。不会产生物理碰撞响应（不阻挡物体），但可以检测其他物体的进入和离开。常用于触发器、拾取物品、检测区域等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| angular_damp | float | `1.0` | 角阻尼 |
| audio_bus_name | StringName | `&"Master"` | 该属性的配置项 |
| audio_bus_override | bool | `false` | 该属性的配置项 |
| gravity | float | `980.0` | 重力 |
| gravity_direction | Vector2 | `Vector2(0, 1)` | 重力方向 |
| gravity_point | bool | `false` | 该属性的配置项 |
| gravity_point_center | Vector2 | `Vector2(0, 1)` | 该属性的配置项 |
| gravity_point_unit_distance | float | `0.0` | 该属性的配置项 |
| linear_damp | float | `0.1` | 线性阻尼 |
| monitorable | bool | `true` | 可被其他区域监控 |
| monitoring | bool | `true` | 正在监控其他区域 |
| priority | int | `0` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| has_overlapping_areas | bool | - |
| has_overlapping_bodies | bool | - |
| overlaps_area | bool | - |
| overlaps_body | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| area_entered | \ area\: \ | 区域进入时触发 |
| area_exited | \ area\: \ | 区域离开时触发 |
| area_shape_entered | \ area_rid\: , area\: , area_shape_index\: , local_shape_index\: \ | - |
| area_shape_exited | \ area_rid\: , area\: , area_shape_index\: , local_shape_index\: \ | - |
| body_entered | \ body\: \ | 刚体进入区域时触发 |
| body_exited | \ body\: \ | 刚体离开区域时触发 |
| body_shape_entered | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |
| body_shape_exited | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |

### 使用场景

- 拾取物品（金币、道具、血瓶）
- 检测敌人进入攻击范围
- 触发剧情区域、检查点
- 伤害区域判定

### 示例代码

```gdscript
# Area2D 基本使用示例
extends Area2D

func _on_body_entered(body):
    print("物体进入: ", body.name)

func _on_body_exited(body):
    print("物体离开: ", body.name)
```

### 官方链接

[Area2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_area2d.html)

---

## StaticBody2D

**继承链：** PhysicsBody2D > CollisionObject2D > Node2D > CanvasItem > Node > Object
**描述：** 2D 静态刚体，不受物理力的影响，但可以被其他物体碰撞。适用于地面、墙壁、平台等不移动的碰撞物体。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| constant_angular_velocity | float | `0.0` | 该属性的配置项 |
| constant_linear_velocity | Vector2 | `Vector2(0, 0)` | 该属性的配置项 |
| physics_material_override | PhysicsMaterial | `-` | 物理材质覆盖 |

### 使用场景

静态环境：地面、墙壁、平台等不移动的碰撞物体。

### 示例代码

```gdscript
# StaticBody2D 基本使用示例
# StaticBody2D 使用示例
```

### 官方链接

[StaticBody2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_staticbody2d.html)

---

## CharacterBody2D

**继承链：** PhysicsBody2D > CollisionObject2D > Node2D > CanvasItem > Node > Object
**描述：** 2D 角色刚体，专为玩家控制的角色设计。不受物理引擎直接控制，通过代码完全控制移动。提供 move_and_slide() 和 move_and_collide() 方法。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| floor_block_on_wall | bool | `true` | 该属性的配置项 |
| floor_constant_speed | bool | `false` | 该属性的配置项 |
| floor_max_angle | float | `0.785398` | 该属性的配置项 |
| floor_snap_length | float | `1.0` | 该属性的配置项 |
| floor_stop_on_slope | bool | `true` | 该属性的配置项 |
| max_slides | int | `4` | 该属性的配置项 |
| platform_floor_layers | int | `4294967295` | 该属性的配置项 |
| platform_wall_layers | int | `0` | 该属性的配置项 |
| safe_margin | float | `0.08` | 该属性的配置项 |
| slide_on_ceiling | bool | `true` | 该属性的配置项 |
| up_direction | Vector2 | `Vector2(0, -1)` | 该属性的配置项 |
| velocity | Vector2 | `Vector2(0, 0)` | 该属性的配置项 |
| wall_min_slide_angle | float | `0.261799` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_floor_angle | float | - |
| get_floor_normal | Vector2 | - |
| get_last_motion | Vector2 | - |
| get_last_slide_collision | KinematicCollision2D | - |
| get_platform_velocity | Vector2 | - |
| get_position_delta | Vector2 | - |
| get_real_velocity | Vector2 | - |
| get_slide_collision | KinematicCollision2D | - |
| get_slide_collision_count | int | - |
| get_wall_normal | Vector2 | - |
| is_on_ceiling | bool | - |
| is_on_ceiling_only | bool | - |
| is_on_floor | bool | - |
| is_on_floor_only | bool | - |
| is_on_wall | bool | - |
| is_on_wall_only | bool | - |
| move_and_slide | bool | - |

### 使用场景

- 2D 平台游戏主角
- 自上而下 RPG 角色
- 任何需要完全代码控制移动的角色

### 示例代码

```gdscript
# CharacterBody2D 基本使用示例
extends CharacterBody2D

const SPEED = 300.0

func _physics_process(delta):
    var direction = Input.get_axis("ui_left", "ui_right")
    velocity.x = direction * SPEED
    move_and_slide()
```

### 官方链接

[CharacterBody2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_characterbody2d.html)

---

## RigidBody2D

**继承链：** PhysicsBody2D > CollisionObject2D > Node2D > CanvasItem > Node > Object
**描述：** 2D 物理刚体，完全受物理引擎控制。支持重力、力、冲量等物理操作。适合需要物理模拟的物体，如掉落的箱子、弹球、碎片等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| angular_damp | float | `0.0` | 角阻尼 |
| angular_velocity | float | `0.0` | 角速度 |
| can_sleep | bool | `true` | 允许自动休眠 |
| center_of_mass | Vector2 | `Vector2(0, 0)` | 质心模式 |
| constant_force | Vector2 | `Vector2(0, 0)` | 恒定力 |
| constant_torque | float | `0.0` | 恒定扭矩 |
| contact_monitor | bool | `false` | 接触监控 |
| custom_integrator | bool | `false` | 该属性的配置项 |
| freeze | bool | `false` | 冻结物理 |
| gravity_scale | float | `1.0` | 重力缩放 |
| inertia | float | `0.0` | 转动惯量 |
| linear_damp | float | `0.0` | 线性阻尼 |
| linear_velocity | Vector2 | `Vector2(0, 0)` | 线性速度 |
| lock_rotation | bool | `false` | 锁定旋转 |
| mass | float | `1.0` | 质量 |
| max_contacts_reported | int | `0` | 最大接触报告数 |
| physics_material_override | PhysicsMaterial | `-` | 物理材质覆盖 |
| sleeping | bool | `false` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_contact_count | int | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| body_entered | \ body\: \ | 刚体进入区域时触发 |
| body_exited | \ body\: \ | 刚体离开区域时触发 |
| body_shape_entered | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |
| body_shape_exited | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |
| sleeping_state_changed | \ | - |

### 使用场景

物理模拟物体：可推动的箱子、弹球、碎片。

### 示例代码

```gdscript
# RigidBody2D 基本使用示例
# RigidBody2D 使用示例
```

### 官方链接

[RigidBody2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_rigidbody2d.html)

---

## RayCast2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 射线投射节点，用于检测射线路径上的碰撞体。可以设置目标位置和排除的物体。常用于视线检测、射击命中判断、地面检测等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| collide_with_areas | bool | `false` | 是否与区域碰撞 |
| collide_with_bodies | bool | `true` | 是否与刚体碰撞 |
| collision_mask | int | `1` | 碰撞掩码 |
| enabled | bool | `true` | 是否启用 |
| exclude_parent | bool | `true` | 排除父对象 |
| hit_from_inside | bool | `false` | 该属性的配置项 |
| target_position | Vector2 | `Vector2(0, 50)` | 目标位置 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_collider | Object | - |
| get_collider_rid | RID | - |
| get_collider_shape | int | - |
| get_collision_mask_value | bool | - |
| get_collision_normal | Vector2 | - |
| get_collision_point | Vector2 | - |
| is_colliding | bool | - |

### 使用场景

射线检测：视线检测、射击命中判断、地面检测。

### 示例代码

```gdscript
# RayCast2D 基本使用示例
# RayCast2D 使用示例
```

### 官方链接

[RayCast2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_raycast2d.html)

---

## Line2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 线段绘制节点，用于绘制由多个点定义的多段线。支持宽度渐变、纹理贴图、曲线平滑等功能。适合绘制轨迹线、绳索效果等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| antialiased | bool | `false` | 抗锯齿 |
| closed | bool | `false` | 是否闭合 |
| default_color | Color | `Color(1, 1, 1, 1)` | 默认颜色 |
| gradient | Gradient | `-` | 渐变资源 |
| points | PackedVector2Array | `PackedVector2Array()` | 点数组 |
| round_precision | int | `8` | 圆角精度 |
| sharp_limit | float | `2.0` | 尖角限制 |
| texture | Texture2D | `-` | 纹理资源 |
| width | float | `10.0` | 宽度 |
| width_curve | Curve | `-` | 宽度曲线 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_point_count | int | - |
| get_point_position | Vector2 | - |

### 使用场景

绘制线条：绳索、轨迹线、连线效果。

### 示例代码

```gdscript
# Line2D 基本使用示例
# Line2D 使用示例
```

### 官方链接

[Line2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_line2d.html)

---

## Polygon2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 多边形绘制节点，用于绘制任意形状的多边形。支持纹理贴图、UV 映射、骨骼变形等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| antialiased | bool | `false` | 抗锯齿 |
| bones | Array | `[]` | 骨骼数据 |
| color | Color | `Color(1, 1, 1, 1)` | 颜色 |
| internal_vertex_count | int | `0` | 内部顶点数 |
| invert_border | float | `100.0` | 反转边框 |
| invert_enabled | bool | `false` | 启用反转 |
| offset | Vector2 | `Vector2(0, 0)` | 偏移量 |
| polygon | PackedVector2Array | `PackedVector2Array()` | 多边形顶点 |
| polygons | Array | `[]` | 多边形数组 |
| skeleton | NodePath | `NodePath("")` | 骨架路径 |
| texture | Texture2D | `-` | 纹理资源 |
| texture_offset | Vector2 | `Vector2(0, 0)` | 该属性的配置项 |
| texture_rotation | float | `0.0` | 该属性的配置项 |
| texture_scale | Vector2 | `Vector2(1, 1)` | 纹理缩放 |
| uv | PackedVector2Array | `PackedVector2Array()` | UV 坐标 |
| vertex_colors | PackedColorArray | `PackedColorArray()` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_bone_count | int | - |
| get_bone_path | NodePath | - |
| get_bone_weights | PackedFloat32Array | - |

### 使用场景

绘制形状：自定义 UI、地形轮廓。

### 示例代码

```gdscript
# Polygon2D 基本使用示例
# Polygon2D 使用示例
```

### 官方链接

[Polygon2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_polygon2d.html)

---

## Path2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 路径节点，定义一条由 Curve2D 资源描述的曲线路径。通常与 PathFollow2D 配合使用。

### 使用场景

定义移动路径：敌人巡逻路径、过场动画路径。

### 示例代码

```gdscript
# Path2D 基本使用示例
# Path2D 使用示例
```

### 官方链接

[Path2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_path2d.html)

---

## PathFollow2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 路径跟随节点，必须作为 Path2D 的子节点使用。通过 progress 属性控制在路径上的位置。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| cubic_interp | bool | `true` | 立方插值 |
| h_offset | float | `0.0` | 水平偏移 |
| loop | bool | `true` | 是否循环 |
| progress | float | `0.0` | 路径进度（像素） |
| progress_ratio | float | `0.0` | 路径进度比例（0-1） |
| rotates | bool | `true` | 是否跟随路径旋转 |
| v_offset | float | `0.0` | 垂直偏移 |

### 使用场景

沿路径移动：敌人沿预定路线移动。

### 示例代码

```gdscript
# PathFollow2D 基本使用示例
# PathFollow2D 使用示例
```

### 官方链接

[PathFollow2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_pathfollow2d.html)

---

## NavigationAgent2D

**继承链：** Node > Object
**描述：** 2D 导航代理节点，用于计算和跟随导航路径。自动处理路径规划和避障。适合 AI 角色的移动控制。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| avoidance_enabled | bool | `false` | 启用避障 |
| avoidance_layers | int | `1` | 避障层 |
| avoidance_mask | int | `1` | 避障掩码 |
| avoidance_priority | float | `1.0` | 避障优先级 |
| debug_enabled | bool | `false` | 启用调试可视化 |
| debug_path_custom_color | Color | `Color(1, 1, 1, 1)` | 自定义路径颜色 |
| debug_path_custom_line_width | float | `-1.0` | 该属性的配置项 |
| debug_path_custom_point_size | float | `4.0` | 该属性的配置项 |
| debug_use_custom | bool | `false` | 该属性的配置项 |
| max_neighbors | int | `10` | 最大邻居数 |
| max_speed | float | `100.0` | 最大移动速度 |
| navigation_layers | int | `1` | 导航层 |
| neighbor_distance | float | `500.0` | 邻居搜索距离 |
| path_desired_distance | float | `20.0` | 路径点期望距离 |
| path_max_distance | float | `100.0` | 路径最大距离 |
| radius | float | `10.0` | 半径 |
| simplify_epsilon | float | `0.0` | 该属性的配置项 |
| simplify_path | bool | `false` | 该属性的配置项 |
| target_desired_distance | float | `10.0` | 到达目标的期望距离 |
| target_position | Vector2 | `Vector2(0, 0)` | 目标位置 |
| time_horizon_agents | float | `1.0` | 该属性的配置项 |
| time_horizon_obstacles | float | `0.0` | 该属性的配置项 |
| velocity | Vector2 | `Vector2(0, 0)` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| distance_to_target | float | - |
| get_avoidance_layer_value | bool | - |
| get_avoidance_mask_value | bool | - |
| get_current_navigation_path | PackedVector2Array | - |
| get_current_navigation_path_index | int | - |
| get_current_navigation_result | NavigationPathQueryResult2D | - |
| get_final_position | Vector2 | - |
| get_navigation_layer_value | bool | - |
| get_navigation_map | RID | - |
| get_next_path_position | Vector2 | - |
| get_rid | RID | - |
| is_navigation_finished | bool | - |
| is_target_reachable | bool | - |
| is_target_reached | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| link_reached | \ details\: \ | 到达链接时触发 |
| navigation_finished | \ | 导航完成时触发 |
| path_changed | \ | 路径改变时触发 |
| target_reached | \ | 到达目标时触发 |
| velocity_computed | \ safe_velocity\: \ | 速度计算完成时触发 |
| waypoint_reached | \ details\: \ | 到达路径点时触发 |

### 使用场景

AI 寻路：敌人追踪玩家、NPC 移动。

### 示例代码

```gdscript
# NavigationAgent2D 基本使用示例
# NavigationAgent2D 使用示例
```

### 官方链接

[NavigationAgent2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationagent2d.html)

---

## NavigationRegion2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 导航区域节点，定义可导航的区域。使用 NavigationPolygon 资源来描述导航网格。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| enabled | bool | `true` | 是否启用 |
| enter_cost | float | `0.0` | 进入代价 |
| navigation_layers | int | `1` | 导航层 |
| navigation_polygon | NavigationPolygon | `-` | 该属性的配置项 |
| travel_cost | float | `1.0` | 通行代价 |
| use_edge_connections | bool | `true` | 使用边连接 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_navigation_layer_value | bool | - |
| get_navigation_map | RID | - |
| get_region_rid | RID | - |
| get_rid | RID | - |
| is_baking | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| bake_finished | \ | - |
| navigation_polygon_changed | \ | - |

### 使用场景

定义可导航区域：AI 可行走的区域。

### 示例代码

```gdscript
# NavigationRegion2D 基本使用示例
# NavigationRegion2D 使用示例
```

### 官方链接

[NavigationRegion2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationregion2d.html)

---

## Light2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 光照节点的基类。已弃用，请使用 PointLight2D。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| color | Color | `Color(1, 1, 1, 1)` | 颜色 |
| editor_only | bool | `false` | 该属性的配置项 |
| enabled | bool | `true` | 是否启用 |
| energy | float | `1.0` | 能量/亮度 |
| range_item_cull_mask | int | `1` | 该属性的配置项 |
| range_layer_max | int | `0` | 该属性的配置项 |
| range_layer_min | int | `0` | 该属性的配置项 |
| range_z_max | int | `1024` | 该属性的配置项 |
| range_z_min | int | `-1024` | 该属性的配置项 |
| shadow_color | Color | `Color(0, 0, 0, 0)` | 阴影颜色 |
| shadow_enabled | bool | `false` | 启用阴影 |
| shadow_filter_smooth | float | `0.0` | 该属性的配置项 |
| shadow_item_cull_mask | int | `1` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_height | float | - |

### 使用场景

2D 光照效果（已弃用，使用 PointLight2D）。

### 示例代码

```gdscript
# Light2D 基本使用示例
# Light2D 使用示例
```

### 官方链接

[Light2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_light2d.html)

---

## PointLight2D

**继承链：** Light2D > Node2D > CanvasItem > Node > Object
**描述：** 2D 点光源节点，从一个点向四周发射光线。支持纹理遮罩、颜色、能量、衰减等设置。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| height | float | `0.0` | 高度 |
| offset | Vector2 | `Vector2(0, 0)` | 偏移量 |
| texture | Texture2D | `-` | 纹理资源 |
| texture_scale | float | `1.0` | 纹理缩放 |

### 使用场景

2D 点光源：火把、灯光、发光效果。

### 示例代码

```gdscript
# PointLight2D 基本使用示例
# PointLight2D 使用示例
```

### 官方链接

[PointLight2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_pointlight2d.html)

---

## GPUParticles2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D GPU 粒子系统，利用 GPU 加速的高性能粒子发射器。使用 ParticleProcessMaterial 来配置粒子行为。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| amount | int | `8` | 数量 |
| amount_ratio | float | `1.0` | 该属性的配置项 |
| collision_base_size | float | `1.0` | 该属性的配置项 |
| emitting | bool | `true` | 是否发射中 |
| explosiveness | float | `0.0` | 爆发性 |
| fixed_fps | int | `30` | 固定帧率 |
| fract_delta | bool | `true` | 该属性的配置项 |
| interp_to_end | float | `0.0` | 插值到结束 |
| interpolate | bool | `true` | 该属性的配置项 |
| lifetime | float | `1.0` | 生命周期 |
| local_coords | bool | `false` | 使用局部坐标 |
| one_shot | bool | `false` | 单次触发 |
| preprocess | float | `0.0` | 预处理时间 |
| process_material | Material | `-` | 粒子处理材质 |
| randomness | float | `0.0` | 随机性 |
| speed_scale | float | `1.0` | 速度缩放 |
| sub_emitter | NodePath | `NodePath("")` | 该属性的配置项 |
| texture | Texture2D | `-` | 纹理资源 |
| trail_enabled | bool | `false` | 启用拖尾 |
| trail_lifetime | float | `0.3` | 拖尾生命周期 |
| trail_section_subdivisions | int | `4` | 拖尾段细分 |
| trail_sections | int | `8` | 拖尾段数 |
| visibility_rect | Rect2 | `Rect2(-100, -100, 200, 200)` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| capture_rect | Rect2 | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

高性能粒子效果：爆炸、火焰、烟雾、魔法效果。

### 示例代码

```gdscript
# GPUParticles2D 基本使用示例
var particles = $GPUParticles2D
particles.emitting = true
particles.amount = 100
```

### 官方链接

[GPUParticles2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_gpuparticles2d.html)

---

## CPUParticles2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D CPU 粒子系统，基于 CPU 计算的粒子发射器。兼容性更好。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| amount | int | `8` | 数量 |
| angle_curve | Curve | `-` | 该属性的配置项 |
| angle_max | float | `0.0` | 该属性的配置项 |
| angle_min | float | `0.0` | 该属性的配置项 |
| angular_velocity_curve | Curve | `-` | 该属性的配置项 |
| angular_velocity_max | float | `0.0` | 该属性的配置项 |
| angular_velocity_min | float | `0.0` | 该属性的配置项 |
| anim_offset_curve | Curve | `-` | 该属性的配置项 |
| anim_offset_max | float | `0.0` | 该属性的配置项 |
| anim_offset_min | float | `0.0` | 该属性的配置项 |
| anim_speed_curve | Curve | `-` | 该属性的配置项 |
| anim_speed_max | float | `0.0` | 该属性的配置项 |
| anim_speed_min | float | `0.0` | 该属性的配置项 |
| color | Color | `Color(1, 1, 1, 1)` | 颜色 |
| color_initial_ramp | Gradient | `-` | 该属性的配置项 |
| color_ramp | Gradient | `-` | 该属性的配置项 |
| damping_curve | Curve | `-` | 该属性的配置项 |
| damping_max | float | `0.0` | 该属性的配置项 |
| damping_min | float | `0.0` | 该属性的配置项 |
| direction | Vector2 | `Vector2(1, 0)` | 该属性的配置项 |
| emission_colors | PackedColorArray | `-` | 该属性的配置项 |
| emission_normals | PackedVector2Array | `-` | 该属性的配置项 |
| emission_points | PackedVector2Array | `-` | 该属性的配置项 |
| emission_rect_extents | Vector2 | `-` | 该属性的配置项 |
| emission_sphere_radius | float | `-` | 该属性的配置项 |
| emitting | bool | `true` | 是否发射中 |
| explosiveness | float | `0.0` | 爆发性 |
| fixed_fps | int | `0` | 固定帧率 |
| fract_delta | bool | `true` | 该属性的配置项 |
| gravity | Vector2 | `Vector2(0, 980)` | 重力 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_param_curve | Curve | - |
| get_param_max | float | - |
| get_param_min | float | - |
| get_particle_flag | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

兼容性粒子效果：在不支持 GPU 粒子的设备上使用。

### 示例代码

```gdscript
# CPUParticles2D 基本使用示例
# CPUParticles2D 使用示例
```

### 官方链接

[CPUParticles2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_cpuparticles2d.html)

---

## Skeleton2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 骨架节点，用于 2D 骨骼动画系统。管理一组 Bone2D 节点。

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_bone | Bone2D | - |
| get_bone_count | int | - |
| get_bone_local_pose_override | Transform2D | - |
| get_modification_stack | SkeletonModificationStack2D | - |
| get_skeleton | RID | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| bone_setup_changed | \ | - |

### 使用场景

2D 骨骼动画：角色骨骼绑定和动画。

### 示例代码

```gdscript
# Skeleton2D 基本使用示例
# Skeleton2D 使用示例
```

### 官方链接

[Skeleton2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_skeleton2d.html)

---

## Bone2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 骨骼节点，作为 Skeleton2D 骨架系统的一部分。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| rest | Transform2D | `Transform2D(0, 0, 0, 0, 0, 0)` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_autocalculate_length_and_angle | bool | - |
| get_bone_angle | float | - |
| get_index_in_skeleton | int | - |
| get_length | float | - |
| get_skeleton_rest | Transform2D | - |

### 使用场景

2D 骨骼系统中的骨骼节点。

### 示例代码

```gdscript
# Bone2D 基本使用示例
# Bone2D 使用示例
```

### 官方链接

[Bone2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_bone2d.html)

---

## Marker2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 标记点节点，用于在场景中标记特定位置或方向。不渲染任何内容。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| gizmo_extents | float | `10.0` | 该属性的配置项 |

### 使用场景

位置标记：生成点、连接点、参考点。

### 示例代码

```gdscript
# Marker2D 基本使用示例
# Marker2D 使用示例
```

### 官方链接

[Marker2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_marker2d.html)

---

# 3D节点

---

## Sprite3D

**继承链：** SpriteBase3D > GeometryInstance3D > VisualInstance3D > Node3D > Node > Object
**描述：** 用于在 3D 空间中显示 2D 纹理的精灵节点。支持广告牌模式。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| frame | int | `0` | 当前帧 |
| frame_coords | Vector2i | `Vector2i(0, 0)` | 帧坐标（列,行） |
| hframes | int | `1` | 水平帧数 |
| region_enabled | bool | `false` | 是否启用区域裁剪 |
| region_rect | Rect2 | `Rect2(0, 0, 0, 0)` | 裁剪区域 |
| texture | Texture2D | `-` | 纹理资源 |
| vframes | int | `1` | 垂直帧数 |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| frame_changed | \ | 帧改变时触发 |
| texture_changed | \ | 纹理改变时触发 |

### 使用场景

在 3D 场景中显示 2D 图像：血条、标签、广告牌。

### 示例代码

```gdscript
# Sprite3D 基本使用示例
# Sprite3D 使用示例
```

### 官方链接

[Sprite3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_sprite3d.html)

---

## Camera3D

**继承链：** Node3D > Node > Object
**描述：** 3D 摄像机节点，定义 3D 场景的观察视角。支持透视和正交投影。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| attributes | CameraAttributes | `-` | 摄像机属性 |
| compositor | Compositor | `-` | 该属性的配置项 |
| cull_mask | int | `1048575` | 该属性的配置项 |
| current | bool | `false` | 是否为当前摄像机 |
| environment | Environment | `-` | 环境资源 |
| far | float | `4000.0` | 远裁剪面 |
| fov | float | `75.0` | 视野角度 |
| frustum_offset | Vector2 | `Vector2(0, 0)` | 视锥偏移 |
| h_offset | float | `0.0` | 水平偏移 |
| near | float | `0.05` | 近裁剪面 |
| size | float | `1.0` | 大小 |
| v_offset | float | `0.0` | 垂直偏移 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_camera_projection | Projection | - |
| get_camera_rid | RID | - |
| get_camera_transform | Transform3D | - |
| get_cull_mask_value | bool | - |
| get_pyramid_shape_rid | RID | - |
| is_position_behind | bool | - |
| is_position_in_frustum | bool | - |
| project_local_ray_normal | Vector3 | - |
| project_position | Vector3 | - |
| project_ray_normal | Vector3 | - |
| project_ray_origin | Vector3 | - |
| unproject_position | Vector2 | - |

### 使用场景

3D 场景的视角控制：玩家视角、过场动画。

### 示例代码

```gdscript
# Camera3D 基本使用示例
var camera = $Camera3D
camera.fov = 75
camera.far = 1000
```

### 官方链接

[Camera3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_camera3d.html)

---

## MeshInstance3D

**继承链：** GeometryInstance3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D 网格实例节点，用于在场景中显示 3D 网格模型。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| mesh | Mesh | `-` | 网格资源 |
| skeleton | NodePath | `NodePath("..")` | 骨架路径 |
| skin | Skin | `-` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| bake_mesh_from_current_blend_shape_mix | ArrayMesh | - |
| find_blend_shape_by_name | int | - |
| get_active_material | Material | - |
| get_blend_shape_count | int | - |
| get_blend_shape_value | float | - |
| get_skin_reference | SkinReference | - |
| get_surface_override_material | Material | - |
| get_surface_override_material_count | int | - |

### 使用场景

显示 3D 模型：角色、建筑、道具等 3D 物体。

### 示例代码

```gdscript
# MeshInstance3D 基本使用示例
# MeshInstance3D 使用示例
```

### 官方链接

[MeshInstance3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_meshinstance3d.html)

---

## CollisionShape3D

**继承链：** Node3D > Node > Object
**描述：** 定义 3D 碰撞形状的节点。支持球体、盒体、胶囊体、凸包等多种形状。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| disabled | bool | `false` | 是否禁用 |
| shape | Shape3D | `-` | 碰撞形状 |

### 使用场景

3D 物理碰撞形状定义。

### 示例代码

```gdscript
# CollisionShape3D 基本使用示例
# CollisionShape3D 使用示例
```

### 官方链接

[CollisionShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_collisionshape3d.html)

---

## CollisionObject3D

**继承链：** Node3D > Node > Object
**描述：** 3D 碰撞对象的抽象基类。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| collision_layer | int | `1` | 碰撞层 |
| collision_mask | int | `1` | 碰撞掩码 |
| collision_priority | float | `1.0` | 碰撞优先级 |
| input_capture_on_drag | bool | `false` | 该属性的配置项 |
| input_ray_pickable | bool | `true` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| create_shape_owner | int | - |
| get_collision_layer_value | bool | - |
| get_collision_mask_value | bool | - |
| get_rid | RID | - |
| get_shape_owners | PackedInt32Array | - |
| is_shape_owner_disabled | bool | - |
| shape_find_owner | int | - |
| shape_owner_get_owner | Object | - |
| shape_owner_get_shape | Shape3D | - |
| shape_owner_get_shape_count | int | - |
| shape_owner_get_shape_index | int | - |
| shape_owner_get_transform | Transform3D | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| input_event | \ camera\: , event\: , event_position\: , normal\: , shape_idx\: \ | 接收输入事件时触发 |
| mouse_entered | \ | 鼠标进入时触发 |
| mouse_exited | \ | 鼠标离开时触发 |

### 使用场景

3D 碰撞对象的基类。

### 示例代码

```gdscript
# CollisionObject3D 基本使用示例
# CollisionObject3D 使用示例
```

### 官方链接

[CollisionObject3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_collisionobject3d.html)

---

## Area3D

**继承链：** CollisionObject3D > Node3D > Node > Object
**描述：** 3D 区域节点，用于检测物体进出和重叠。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| angular_damp | float | `0.1` | 角阻尼 |
| audio_bus_name | StringName | `&"Master"` | 该属性的配置项 |
| audio_bus_override | bool | `false` | 该属性的配置项 |
| gravity | float | `9.8` | 重力 |
| gravity_direction | Vector3 | `Vector3(0, -1, 0)` | 重力方向 |
| gravity_point | bool | `false` | 该属性的配置项 |
| gravity_point_center | Vector3 | `Vector3(0, -1, 0)` | 该属性的配置项 |
| gravity_point_unit_distance | float | `0.0` | 该属性的配置项 |
| linear_damp | float | `0.1` | 线性阻尼 |
| monitorable | bool | `true` | 可被其他区域监控 |
| monitoring | bool | `true` | 正在监控其他区域 |
| priority | int | `0` | 该属性的配置项 |
| reverb_bus_amount | float | `0.0` | 该属性的配置项 |
| reverb_bus_enabled | bool | `false` | 该属性的配置项 |
| reverb_bus_name | StringName | `&"Master"` | 该属性的配置项 |
| reverb_bus_uniformity | float | `0.0` | 该属性的配置项 |
| wind_attenuation_factor | float | `0.0` | 该属性的配置项 |
| wind_force_magnitude | float | `0.0` | 该属性的配置项 |
| wind_source_path | NodePath | `NodePath("")` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| has_overlapping_areas | bool | - |
| has_overlapping_bodies | bool | - |
| overlaps_area | bool | - |
| overlaps_body | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| area_entered | \ area\: \ | 区域进入时触发 |
| area_exited | \ area\: \ | 区域离开时触发 |
| area_shape_entered | \ area_rid\: , area\: , area_shape_index\: , local_shape_index\: \ | - |
| area_shape_exited | \ area_rid\: , area\: , area_shape_index\: , local_shape_index\: \ | - |
| body_entered | \ body\: \ | 刚体进入区域时触发 |
| body_exited | \ body\: \ | 刚体离开区域时触发 |
| body_shape_entered | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |
| body_shape_exited | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |

### 使用场景

3D 触发器：检测进入区域、伤害范围。

### 示例代码

```gdscript
# Area3D 基本使用示例
# Area3D 使用示例
```

### 官方链接

[Area3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_area3d.html)

---

## StaticBody3D

**继承链：** PhysicsBody3D > CollisionObject3D > Node3D > Node > Object
**描述：** 3D 静态刚体，不受物理力影响。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| constant_angular_velocity | Vector3 | `Vector3(0, 0, 0)` | 该属性的配置项 |
| constant_linear_velocity | Vector3 | `Vector3(0, 0, 0)` | 该属性的配置项 |
| physics_material_override | PhysicsMaterial | `-` | 物理材质覆盖 |

### 使用场景

3D 静态环境：墙壁、地面、建筑。

### 示例代码

```gdscript
# StaticBody3D 基本使用示例
# StaticBody3D 使用示例
```

### 官方链接

[StaticBody3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_staticbody3d.html)

---

## CharacterBody3D

**继承链：** PhysicsBody3D > CollisionObject3D > Node3D > Node > Object
**描述：** 3D 角色刚体，专为玩家控制的角色设计。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| floor_block_on_wall | bool | `true` | 该属性的配置项 |
| floor_constant_speed | bool | `false` | 该属性的配置项 |
| floor_max_angle | float | `0.785398` | 该属性的配置项 |
| floor_snap_length | float | `0.1` | 该属性的配置项 |
| floor_stop_on_slope | bool | `true` | 该属性的配置项 |
| max_slides | int | `6` | 该属性的配置项 |
| platform_floor_layers | int | `4294967295` | 该属性的配置项 |
| platform_wall_layers | int | `0` | 该属性的配置项 |
| safe_margin | float | `0.001` | 该属性的配置项 |
| slide_on_ceiling | bool | `true` | 该属性的配置项 |
| up_direction | Vector3 | `Vector3(0, 1, 0)` | 该属性的配置项 |
| velocity | Vector3 | `Vector3(0, 0, 0)` | 该属性的配置项 |
| wall_min_slide_angle | float | `0.261799` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_floor_angle | float | - |
| get_floor_normal | Vector3 | - |
| get_last_motion | Vector3 | - |
| get_last_slide_collision | KinematicCollision3D | - |
| get_platform_angular_velocity | Vector3 | - |
| get_platform_velocity | Vector3 | - |
| get_position_delta | Vector3 | - |
| get_real_velocity | Vector3 | - |
| get_slide_collision | KinematicCollision3D | - |
| get_slide_collision_count | int | - |
| get_wall_normal | Vector3 | - |
| is_on_ceiling | bool | - |
| is_on_ceiling_only | bool | - |
| is_on_floor | bool | - |
| is_on_floor_only | bool | - |
| is_on_wall | bool | - |
| is_on_wall_only | bool | - |
| move_and_slide | bool | - |

### 使用场景

3D 角色控制：第一人称或第三人称角色。

### 示例代码

```gdscript
# CharacterBody3D 基本使用示例
# CharacterBody3D 使用示例
```

### 官方链接

[CharacterBody3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_characterbody3d.html)

---

## RigidBody3D

**继承链：** PhysicsBody3D > CollisionObject3D > Node3D > Node > Object
**描述：** 3D 物理刚体，受物理引擎完全控制。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| angular_damp | float | `0.0` | 角阻尼 |
| angular_velocity | Vector3 | `Vector3(0, 0, 0)` | 角速度 |
| can_sleep | bool | `true` | 允许自动休眠 |
| center_of_mass | Vector3 | `Vector3(0, 0, 0)` | 质心模式 |
| constant_force | Vector3 | `Vector3(0, 0, 0)` | 恒定力 |
| constant_torque | Vector3 | `Vector3(0, 0, 0)` | 恒定扭矩 |
| contact_monitor | bool | `false` | 接触监控 |
| continuous_cd | bool | `false` | 连续碰撞检测 |
| custom_integrator | bool | `false` | 该属性的配置项 |
| freeze | bool | `false` | 冻结物理 |
| gravity_scale | float | `1.0` | 重力缩放 |
| inertia | Vector3 | `Vector3(0, 0, 0)` | 转动惯量 |
| linear_damp | float | `0.0` | 线性阻尼 |
| linear_velocity | Vector3 | `Vector3(0, 0, 0)` | 线性速度 |
| lock_rotation | bool | `false` | 锁定旋转 |
| mass | float | `1.0` | 质量 |
| max_contacts_reported | int | `0` | 最大接触报告数 |
| physics_material_override | PhysicsMaterial | `-` | 物理材质覆盖 |
| sleeping | bool | `false` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_contact_count | int | - |
| get_inverse_inertia_tensor | Basis | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| body_entered | \ body\: \ | 刚体进入区域时触发 |
| body_exited | \ body\: \ | 刚体离开区域时触发 |
| body_shape_entered | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |
| body_shape_exited | \ body_rid\: , body\: , body_shape_index\: , local_shape_index\: \ | - |
| sleeping_state_changed | \ | - |

### 使用场景

3D 物理物体：可推动的物体、掉落的物体。

### 示例代码

```gdscript
# RigidBody3D 基本使用示例
extends RigidBody3D

func _ready():
    apply_impulse(Vector3(0, 10, 0), Vector3.ZERO)
```

### 官方链接

[RigidBody3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_rigidbody3d.html)

---

## RayCast3D

**继承链：** Node3D > Node > Object
**描述：** 3D 射线投射节点，用于检测射线路径上的碰撞体。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| collide_with_areas | bool | `false` | 是否与区域碰撞 |
| collide_with_bodies | bool | `true` | 是否与刚体碰撞 |
| collision_mask | int | `1` | 碰撞掩码 |
| debug_shape_custom_color | Color | `Color(0, 0, 0, 1)` | 该属性的配置项 |
| debug_shape_thickness | int | `2` | 该属性的配置项 |
| enabled | bool | `true` | 是否启用 |
| exclude_parent | bool | `true` | 排除父对象 |
| hit_back_faces | bool | `true` | 该属性的配置项 |
| hit_from_inside | bool | `false` | 该属性的配置项 |
| target_position | Vector3 | `Vector3(0, -1, 0)` | 目标位置 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_collider | Object | - |
| get_collider_rid | RID | - |
| get_collider_shape | int | - |
| get_collision_face_index | int | - |
| get_collision_mask_value | bool | - |
| get_collision_normal | Vector3 | - |
| get_collision_point | Vector3 | - |
| is_colliding | bool | - |

### 使用场景

3D 射线检测：武器射击、交互检测。

### 示例代码

```gdscript
# RayCast3D 基本使用示例
# RayCast3D 使用示例
```

### 官方链接

[RayCast3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_raycast3d.html)

---

## DirectionalLight3D

**继承链：** Light3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D 平行光，模拟太阳光等远距离光源。光线平行照射，不会随距离衰减。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| directional_shadow_blend_splits | bool | `false` | 混合阴影分割 |
| directional_shadow_fade_start | float | `0.8` | 阴影淡出开始 |
| directional_shadow_max_distance | float | `100.0` | 方向光阴影最大距离 |
| directional_shadow_pancake_size | float | `20.0` | 阴影压扁大小 |
| directional_shadow_split_1 | float | `0.1` | 阴影分割1 |
| directional_shadow_split_2 | float | `0.2` | 阴影分割2 |
| directional_shadow_split_3 | float | `0.5` | 阴影分割3 |

### 使用场景

模拟太阳光：室外场景的主光源。

### 示例代码

```gdscript
# DirectionalLight3D 基本使用示例
# DirectionalLight3D 使用示例
```

### 官方链接

[DirectionalLight3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_directionallight3d.html)

---

## OmniLight3D

**继承链：** Light3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D 全向光源，从一个点向所有方向发射光线。类似灯泡效果。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| omni_attenuation | float | `1.0` | 全向光衰减 |
| omni_range | float | `5.0` | 全向光范围 |

### 使用场景

全向光源：灯泡、火把。

### 示例代码

```gdscript
# OmniLight3D 基本使用示例
# OmniLight3D 使用示例
```

### 官方链接

[OmniLight3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_omnilight3d.html)

---

## SpotLight3D

**继承链：** Light3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D 聚光灯，从一个点向特定方向发射锥形光线。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| spot_angle | float | `45.0` | 聚光灯角度（度） |
| spot_angle_attenuation | float | `1.0` | 角度衰减 |
| spot_attenuation | float | `1.0` | 聚光灯衰减 |
| spot_range | float | `5.0` | 聚光灯范围 |

### 使用场景

聚光灯：手电筒、舞台灯光。

### 示例代码

```gdscript
# SpotLight3D 基本使用示例
# SpotLight3D 使用示例
```

### 官方链接

[SpotLight3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_spotlight3d.html)

---

## GPUParticles3D

**继承链：** GeometryInstance3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D GPU 粒子系统。利用 GPU 加速。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| amount | int | `8` | 数量 |
| amount_ratio | float | `1.0` | 该属性的配置项 |
| collision_base_size | float | `0.01` | 该属性的配置项 |
| draw_pass_1 | Mesh | `-` | 该属性的配置项 |
| draw_pass_2 | Mesh | `-` | 该属性的配置项 |
| draw_pass_3 | Mesh | `-` | 该属性的配置项 |
| draw_pass_4 | Mesh | `-` | 该属性的配置项 |
| draw_passes | int | `1` | 该属性的配置项 |
| draw_skin | Skin | `-` | 该属性的配置项 |
| emitting | bool | `true` | 是否发射中 |
| explosiveness | float | `0.0` | 爆发性 |
| fixed_fps | int | `30` | 固定帧率 |
| fract_delta | bool | `true` | 该属性的配置项 |
| interp_to_end | float | `0.0` | 插值到结束 |
| interpolate | bool | `true` | 该属性的配置项 |
| lifetime | float | `1.0` | 生命周期 |
| local_coords | bool | `false` | 使用局部坐标 |
| one_shot | bool | `false` | 单次触发 |
| preprocess | float | `0.0` | 预处理时间 |
| process_material | Material | `-` | 粒子处理材质 |
| randomness | float | `0.0` | 随机性 |
| speed_scale | float | `1.0` | 速度缩放 |
| sub_emitter | NodePath | `NodePath("")` | 该属性的配置项 |
| trail_enabled | bool | `false` | 启用拖尾 |
| trail_lifetime | float | `0.3` | 拖尾生命周期 |
| visibility_aabb | AABB | `AABB(-4, -4, -4, 8, 8, 8)` | 可见性 AABB |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| capture_aabb | AABB | - |
| get_draw_pass_mesh | Mesh | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

3D 粒子效果：烟雾、火焰、魔法。

### 示例代码

```gdscript
# GPUParticles3D 基本使用示例
# GPUParticles3D 使用示例
```

### 官方链接

[GPUParticles3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_gpuparticles3d.html)

---

## CPUParticles3D

**继承链：** GeometryInstance3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D CPU 粒子系统。兼容性更好。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| amount | int | `8` | 数量 |
| angle_curve | Curve | `-` | 该属性的配置项 |
| angle_max | float | `0.0` | 该属性的配置项 |
| angle_min | float | `0.0` | 该属性的配置项 |
| angular_velocity_curve | Curve | `-` | 该属性的配置项 |
| angular_velocity_max | float | `0.0` | 该属性的配置项 |
| angular_velocity_min | float | `0.0` | 该属性的配置项 |
| anim_offset_curve | Curve | `-` | 该属性的配置项 |
| anim_offset_max | float | `0.0` | 该属性的配置项 |
| anim_offset_min | float | `0.0` | 该属性的配置项 |
| anim_speed_curve | Curve | `-` | 该属性的配置项 |
| anim_speed_max | float | `0.0` | 该属性的配置项 |
| anim_speed_min | float | `0.0` | 该属性的配置项 |
| color | Color | `Color(1, 1, 1, 1)` | 颜色 |
| color_initial_ramp | Gradient | `-` | 该属性的配置项 |
| color_ramp | Gradient | `-` | 该属性的配置项 |
| damping_curve | Curve | `-` | 该属性的配置项 |
| damping_max | float | `0.0` | 该属性的配置项 |
| damping_min | float | `0.0` | 该属性的配置项 |
| direction | Vector3 | `Vector3(1, 0, 0)` | 该属性的配置项 |
| emission_box_extents | Vector3 | `-` | 该属性的配置项 |
| emission_colors | PackedColorArray | `PackedColorArray()` | 该属性的配置项 |
| emission_normals | PackedVector3Array | `-` | 该属性的配置项 |
| emission_points | PackedVector3Array | `-` | 该属性的配置项 |
| emission_ring_axis | Vector3 | `-` | 该属性的配置项 |
| emission_ring_height | float | `-` | 该属性的配置项 |
| emission_ring_inner_radius | float | `-` | 该属性的配置项 |
| emission_ring_radius | float | `-` | 该属性的配置项 |
| emission_sphere_radius | float | `-` | 该属性的配置项 |
| emitting | bool | `true` | 是否发射中 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_param_curve | Curve | - |
| get_param_max | float | - |
| get_param_min | float | - |
| get_particle_flag | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

兼容性 3D 粒子效果。

### 示例代码

```gdscript
# CPUParticles3D 基本使用示例
# CPUParticles3D 使用示例
```

### 官方链接

[CPUParticles3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_cpuparticles3d.html)

---

## Skeleton3D

**继承链：** Node3D > Node > Object
**描述：** 3D 骨架节点，用于骨骼动画系统。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| animate_physical_bones | bool | `true` | 该属性的配置项 |
| motion_scale | float | `1.0` | 该属性的配置项 |
| show_rest_only | bool | `false` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| add_bone | int | - |
| create_skin_from_rest_transforms | Skin | - |
| find_bone | int | - |
| get_bone_children | PackedInt32Array | - |
| get_bone_count | int | - |
| get_bone_global_pose | Transform3D | - |
| get_bone_global_pose_no_override | Transform3D | - |
| get_bone_global_pose_override | Transform3D | - |
| get_bone_global_rest | Transform3D | - |
| get_bone_name | String | - |
| get_bone_parent | int | - |
| get_bone_pose | Transform3D | - |
| get_bone_pose_position | Vector3 | - |
| get_bone_pose_rotation | Quaternion | - |
| get_bone_pose_scale | Vector3 | - |
| get_bone_rest | Transform3D | - |
| get_concatenated_bone_names | StringName | - |
| get_parentless_bones | PackedInt32Array | - |
| get_version | int | - |
| is_bone_enabled | bool | - |
| register_skin | SkinReference | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| bone_enabled_changed | \ bone_idx\: \ | - |
| bone_list_changed | \ | - |
| pose_updated | \ | - |
| show_rest_only_changed | \ | - |
| skeleton_updated | \ | - |

### 使用场景

3D 角色骨骼动画。

### 示例代码

```gdscript
# Skeleton3D 基本使用示例
# Skeleton3D 使用示例
```

### 官方链接

[Skeleton3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_skeleton3d.html)

---

## GridMap

**继承链：** Node3D > Node > Object
**描述：** 3D 网格地图节点，类似于 3D 版本的 TileMap。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| bake_navigation | bool | `false` | 该属性的配置项 |
| cell_center_x | bool | `true` | 该属性的配置项 |
| cell_center_y | bool | `true` | 该属性的配置项 |
| cell_center_z | bool | `true` | 该属性的配置项 |
| cell_octant_size | int | `8` | 该属性的配置项 |
| cell_scale | float | `1.0` | 该属性的配置项 |
| cell_size | Vector3 | `Vector3(2, 2, 2)` | 该属性的配置项 |
| collision_layer | int | `1` | 碰撞层 |
| collision_mask | int | `1` | 碰撞掩码 |
| collision_priority | float | `1.0` | 碰撞优先级 |
| mesh_library | MeshLibrary | `-` | 该属性的配置项 |
| physics_material | PhysicsMaterial | `-` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_bake_mesh_instance | RID | - |
| get_bake_meshes | Array | - |
| get_basis_with_orthogonal_index | Basis | - |
| get_cell_item | int | - |
| get_cell_item_basis | Basis | - |
| get_cell_item_orientation | int | - |
| get_collision_layer_value | bool | - |
| get_collision_mask_value | bool | - |
| get_meshes | Array | - |
| get_navigation_map | RID | - |
| get_orthogonal_index_from_basis | int | - |
| local_to_map | Vector3i | - |
| map_to_local | Vector3 | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| cell_size_changed | \ cell_size\: \ | - |
| changed | \ | 内容改变时触发 |

### 使用场景

3D 体素风格关卡设计。

### 示例代码

```gdscript
# GridMap 基本使用示例
# GridMap 使用示例
```

### 官方链接

[GridMap 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_gridmap.html)

---

## NavigationAgent3D

**继承链：** Node > Object
**描述：** 3D 导航代理节点，用于计算和跟随 3D 导航路径。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| avoidance_enabled | bool | `false` | 启用避障 |
| avoidance_layers | int | `1` | 避障层 |
| avoidance_mask | int | `1` | 避障掩码 |
| avoidance_priority | float | `1.0` | 避障优先级 |
| debug_enabled | bool | `false` | 启用调试可视化 |
| debug_path_custom_color | Color | `Color(1, 1, 1, 1)` | 自定义路径颜色 |
| debug_path_custom_point_size | float | `4.0` | 该属性的配置项 |
| debug_use_custom | bool | `false` | 该属性的配置项 |
| height | float | `1.0` | 高度 |
| keep_y_velocity | bool | `true` | 该属性的配置项 |
| max_neighbors | int | `10` | 最大邻居数 |
| max_speed | float | `10.0` | 最大移动速度 |
| navigation_layers | int | `1` | 导航层 |
| neighbor_distance | float | `50.0` | 邻居搜索距离 |
| path_desired_distance | float | `1.0` | 路径点期望距离 |
| path_height_offset | float | `0.0` | 该属性的配置项 |
| path_max_distance | float | `5.0` | 路径最大距离 |
| radius | float | `0.5` | 半径 |
| simplify_epsilon | float | `0.0` | 该属性的配置项 |
| simplify_path | bool | `false` | 该属性的配置项 |
| target_desired_distance | float | `1.0` | 到达目标的期望距离 |
| target_position | Vector3 | `Vector3(0, 0, 0)` | 目标位置 |
| time_horizon_agents | float | `1.0` | 该属性的配置项 |
| time_horizon_obstacles | float | `0.0` | 该属性的配置项 |
| use_3d_avoidance | bool | `false` | 该属性的配置项 |
| velocity | Vector3 | `Vector3(0, 0, 0)` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| distance_to_target | float | - |
| get_avoidance_layer_value | bool | - |
| get_avoidance_mask_value | bool | - |
| get_current_navigation_path | PackedVector3Array | - |
| get_current_navigation_path_index | int | - |
| get_current_navigation_result | NavigationPathQueryResult3D | - |
| get_final_position | Vector3 | - |
| get_navigation_layer_value | bool | - |
| get_navigation_map | RID | - |
| get_next_path_position | Vector3 | - |
| get_rid | RID | - |
| is_navigation_finished | bool | - |
| is_target_reachable | bool | - |
| is_target_reached | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| link_reached | \ details\: \ | 到达链接时触发 |
| navigation_finished | \ | 导航完成时触发 |
| path_changed | \ | 路径改变时触发 |
| target_reached | \ | 到达目标时触发 |
| velocity_computed | \ safe_velocity\: \ | 速度计算完成时触发 |
| waypoint_reached | \ details\: \ | 到达路径点时触发 |

### 使用场景

3D AI 寻路。

### 示例代码

```gdscript
# NavigationAgent3D 基本使用示例
# NavigationAgent3D 使用示例
```

### 官方链接

[NavigationAgent3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationagent3d.html)

---

## NavigationRegion3D

**继承链：** Node3D > Node > Object
**描述：** 3D 导航区域节点，定义 3D 空间中的可导航区域。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| enabled | bool | `true` | 是否启用 |
| enter_cost | float | `0.0` | 进入代价 |
| navigation_layers | int | `1` | 导航层 |
| navigation_mesh | NavigationMesh | `-` | 导航网格资源 |
| travel_cost | float | `1.0` | 通行代价 |
| use_edge_connections | bool | `true` | 使用边连接 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_navigation_layer_value | bool | - |
| get_navigation_map | RID | - |
| get_region_rid | RID | - |
| get_rid | RID | - |
| is_baking | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| bake_finished | \ | - |
| navigation_mesh_changed | \ | - |

### 使用场景

3D 导航区域定义。

### 示例代码

```gdscript
# NavigationRegion3D 基本使用示例
# NavigationRegion3D 使用示例
```

### 官方链接

[NavigationRegion3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationregion3d.html)

---

## CSGBox3D

**继承链：** CSGPrimitive3D > CSGShape3D > GeometryInstance3D > VisualInstance3D > Node3D > Node > Object
**描述：** CSG 盒体节点。通过布尔运算组合基本几何体来构建复杂 3D 形状。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| material | Material | `-` | 该属性的配置项 |
| size | Vector3 | `Vector3(1, 1, 1)` | 大小 |

### 使用场景

快速原型设计：使用 CSG 构建 3D 几何体。

### 示例代码

```gdscript
# CSGBox3D 基本使用示例
# CSGBox3D 使用示例
```

### 官方链接

[CSGBox3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_csgbox3d.html)

---

## SoftBody3D

**继承链：** MeshInstance3D > GeometryInstance3D > VisualInstance3D > Node3D > Node > Object
**描述：** 3D 软体物理节点，模拟柔性物体的物理行为。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| collision_layer | int | `1` | 碰撞层 |
| collision_mask | int | `1` | 碰撞掩码 |
| damping_coefficient | float | `0.01` | 阻尼系数 |
| drag_coefficient | float | `0.0` | 阻力系数 |
| linear_stiffness | float | `0.5` | 线性刚度 |
| parent_collision_ignore | NodePath | `NodePath("")` | 该属性的配置项 |
| pressure_coefficient | float | `0.0` | 压力系数 |
| ray_pickable | bool | `true` | 射线可拾取 |
| simulation_precision | int | `5` | 模拟精度 |
| total_mass | float | `1.0` | 总质量 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_collision_layer_value | bool | - |
| get_collision_mask_value | bool | - |
| get_physics_rid | RID | - |
| get_point_transform | Vector3 | - |
| is_point_pinned | bool | - |

### 使用场景

软体模拟：布料、旗帜、柔软物体。

### 示例代码

```gdscript
# SoftBody3D 基本使用示例
# SoftBody3D 使用示例
```

### 官方链接

[SoftBody3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_softbody3d.html)

---

## VehicleBody3D

**继承链：** RigidBody3D > PhysicsBody3D > CollisionObject3D > Node3D > Node > Object
**描述：** 3D 车辆刚体节点，模拟车辆物理。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| brake | float | `0.0` | 制动力 |
| engine_force | float | `0.0` | 引擎力 |
| steering | float | `0.0` | 转向角度 |

### 使用场景

车辆模拟：赛车游戏。

### 示例代码

```gdscript
# VehicleBody3D 基本使用示例
# VehicleBody3D 使用示例
```

### 官方链接

[VehicleBody3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_vehiclebody3d.html)

---

# UI节点

---

## Label

**继承链：** Control > CanvasItem > Node > Object
**描述：** 用于显示纯文本的 UI 控件。支持对齐、自动换行、文本裁剪等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| clip_text | bool | `false` | 裁剪文本 |
| ellipsis_char | String | `"…"` | 省略号字符 |
| label_settings | LabelSettings | `-` | 标签设置 |
| language | String | `""` | 语言 |
| lines_skipped | int | `0` | 跳过行数 |
| max_lines_visible | int | `-1` | 最大可见行数 |
| structured_text_bidi_override_options | Array | `[]` | 该属性的配置项 |
| tab_stops | PackedFloat32Array | `PackedFloat32Array()` | 制表位 |
| text | String | `""` | 文本内容 |
| uppercase | bool | `false` | 大写显示 |
| visible_characters | int | `-1` | 可见字符数 |
| visible_ratio | float | `1.0` | 可见比例 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_character_bounds | Rect2 | - |
| get_line_count | int | - |
| get_line_height | int | - |
| get_total_character_count | int | - |
| get_visible_line_count | int | - |

### 使用场景

显示文本：分数、名称、提示信息。

### 示例代码

```gdscript
# Label 基本使用示例
var label = $Label
label.text = "Hello, Godot!"
label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
```

### 官方链接

[Label 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_label.html)

---

## Button

**继承链：** BaseButton > Control > CanvasItem > Node > Object
**描述：** 按钮 UI 控件，支持文本和图标。提供正常、悬停、按下、禁用等多种状态。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| clip_text | bool | `false` | 裁剪文本 |
| expand_icon | bool | `false` | 该属性的配置项 |
| flat | bool | `false` | 扁平样式 |
| icon | Texture2D | `-` | 图标 |
| language | String | `""` | 语言 |
| text | String | `""` | 文本内容 |

### 使用场景

可点击按钮：菜单按钮、确认按钮、操作按钮。

### 示例代码

```gdscript
# Button 基本使用示例
var button = $Button
button.text = "点击我"
button.pressed.connect(_on_button_pressed)

func _on_button_pressed():
    print("按钮被点击了")
```

### 官方链接

[Button 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_button.html)

---

## LineEdit

**继承链：** Control > CanvasItem > Node > Object
**描述：** 单行文本输入框控件。支持占位符、密码模式、最大长度限制等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| caret_blink | bool | `false` | 光标闪烁 |
| caret_blink_interval | float | `0.65` | 闪烁间隔 |
| caret_column | int | `0` | 该属性的配置项 |
| caret_force_displayed | bool | `false` | 强制显示光标 |
| caret_mid_grapheme | bool | `false` | 光标在字形中间 |
| clear_button_enabled | bool | `false` | 启用清除按钮 |
| context_menu_enabled | bool | `true` | 启用右键菜单 |
| deselect_on_focus_loss_enabled | bool | `true` | 该属性的配置项 |
| drag_and_drop_selection_enabled | bool | `true` | 该属性的配置项 |
| draw_control_chars | bool | `false` | 绘制控制字符 |
| editable | bool | `true` | 是否可编辑 |
| expand_to_text_length | bool | `false` | 扩展到文本长度 |
| flat | bool | `false` | 扁平样式 |
| language | String | `""` | 语言 |
| max_length | int | `0` | 最大长度 |
| middle_mouse_paste_enabled | bool | `true` | 启用中键粘贴 |
| placeholder_text | String | `""` | 占位符文本 |
| right_icon | Texture2D | `-` | 该属性的配置项 |
| secret | bool | `false` | 密码模式 |
| secret_character | String | `"•"` | 该属性的配置项 |
| select_all_on_focus | bool | `false` | 该属性的配置项 |
| selecting_enabled | bool | `true` | 启用选择 |
| shortcut_keys_enabled | bool | `true` | 启用快捷键 |
| structured_text_bidi_override_options | Array | `[]` | 该属性的配置项 |
| text | String | `""` | 文本内容 |
| virtual_keyboard_enabled | bool | `true` | 启用虚拟键盘 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_menu | PopupMenu | - |
| get_scroll_offset | float | - |
| get_selected_text | String | - |
| get_selection_from_column | int | - |
| get_selection_to_column | int | - |
| has_selection | bool | - |
| is_menu_visible | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| text_change_rejected | \ rejected_substring\: \ | 文本改变被拒绝时触发 |
| text_changed | \ new_text\: \ | 文本改变时触发 |
| text_submitted | \ new_text\: \ | 文本提交时触发（回车） |

### 使用场景

文本输入：用户名输入、搜索框。

### 示例代码

```gdscript
# LineEdit 基本使用示例
var line_edit = $LineEdit
line_edit.placeholder_text = "请输入..."
line_edit.text_changed.connect(_on_text_changed)

func _on_text_changed(new_text):
    print("输入: ", new_text)
```

### 官方链接

[LineEdit 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_lineedit.html)

---

## TextEdit

**继承链：** Control > CanvasItem > Node > Object
**描述：** 多行文本编辑控件。支持语法高亮、代码折叠、自动补全等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| caret_blink | bool | `false` | 光标闪烁 |
| caret_blink_interval | float | `0.65` | 闪烁间隔 |
| caret_draw_when_editable_disabled | bool | `false` | 该属性的配置项 |
| caret_mid_grapheme | bool | `false` | 光标在字形中间 |
| caret_move_on_right_click | bool | `true` | 该属性的配置项 |
| caret_multiple | bool | `true` | 该属性的配置项 |
| context_menu_enabled | bool | `true` | 启用右键菜单 |
| custom_word_separators | String | `""` | 该属性的配置项 |
| deselect_on_focus_loss_enabled | bool | `true` | 该属性的配置项 |
| drag_and_drop_selection_enabled | bool | `true` | 该属性的配置项 |
| draw_control_chars | bool | `false` | 绘制控制字符 |
| draw_spaces | bool | `false` | 绘制空格 |
| draw_tabs | bool | `false` | 绘制制表符 |
| editable | bool | `true` | 是否可编辑 |
| highlight_all_occurrences | bool | `false` | 高亮所有匹配 |
| highlight_current_line | bool | `false` | 高亮当前行 |
| indent_wrapped_lines | bool | `false` | 该属性的配置项 |
| language | String | `""` | 语言 |
| middle_mouse_paste_enabled | bool | `true` | 启用中键粘贴 |
| minimap_draw | bool | `false` | 该属性的配置项 |
| minimap_width | int | `80` | 小地图宽度 |
| placeholder_text | String | `""` | 占位符文本 |
| scroll_fit_content_height | bool | `false` | 该属性的配置项 |
| scroll_horizontal | int | `0` | 该属性的配置项 |
| scroll_past_end_of_file | bool | `false` | 该属性的配置项 |
| scroll_smooth | bool | `false` | 平滑滚动 |
| scroll_v_scroll_speed | float | `80.0` | 垂直滚动速度 |
| scroll_vertical | float | `0.0` | 该属性的配置项 |
| selecting_enabled | bool | `true` | 启用选择 |
| shortcut_keys_enabled | bool | `true` | 启用快捷键 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| add_caret | int | - |
| get_caret_column | int | - |
| get_caret_count | int | - |
| get_caret_draw_pos | Vector2 | - |
| get_caret_index_edit_order | PackedInt32Array | - |
| get_caret_line | int | - |
| get_caret_wrap_index | int | - |
| get_first_non_whitespace_column | int | - |
| get_first_visible_line | int | - |
| get_gutter_count | int | - |
| get_gutter_name | String | - |
| get_gutter_width | int | - |
| get_h_scroll_bar | HScrollBar | - |
| get_indent_level | int | - |
| get_last_full_visible_line | int | - |
| get_last_full_visible_line_wrap_index | int | - |
| get_last_unhidden_line | int | - |
| get_line | String | - |
| get_line_background_color | Color | - |
| get_line_column_at_pos | Vector2i | - |
| get_line_count | int | - |
| get_line_gutter_icon | Texture2D | - |
| get_line_gutter_item_color | Color | - |
| get_line_gutter_metadata | Variant | - |
| get_line_gutter_text | String | - |
| get_line_height | int | - |
| get_line_width | int | - |
| get_line_wrap_count | int | - |
| get_line_wrap_index_at_column | int | - |
| get_line_wrapped_text | PackedStringArray | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| caret_changed | \ | - |
| gutter_added | \ | - |
| gutter_clicked | \ line\: , gutter\: \ | - |
| gutter_removed | \ | - |
| lines_edited_from | \ from_line\: , to_line\: \ | - |
| text_changed | \ | 文本改变时触发 |
| text_set | \ | - |

### 使用场景

多行文本编辑：聊天框、代码编辑器。

### 示例代码

```gdscript
# TextEdit 基本使用示例
# TextEdit 使用示例
```

### 官方链接

[TextEdit 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_textedit.html)

---

## RichTextLabel

**继承链：** Control > CanvasItem > Node > Object
**描述：** 富文本标签控件，支持 BBCode 格式化。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| bbcode_enabled | bool | `false` | 启用 BBCode |
| context_menu_enabled | bool | `false` | 启用右键菜单 |
| custom_effects | Array | `[]` | 该属性的配置项 |
| deselect_on_focus_loss_enabled | bool | `true` | 该属性的配置项 |
| drag_and_drop_selection_enabled | bool | `true` | 该属性的配置项 |
| fit_content | bool | `false` | 该属性的配置项 |
| hint_underlined | bool | `true` | 该属性的配置项 |
| language | String | `""` | 语言 |
| meta_underlined | bool | `true` | 该属性的配置项 |
| progress_bar_delay | int | `1000` | 该属性的配置项 |
| scroll_active | bool | `true` | 该属性的配置项 |
| scroll_following | bool | `false` | 该属性的配置项 |
| selection_enabled | bool | `false` | 该属性的配置项 |
| shortcut_keys_enabled | bool | `true` | 启用快捷键 |
| structured_text_bidi_override_options | Array | `[]` | 该属性的配置项 |
| tab_size | int | `4` | 该属性的配置项 |
| text | String | `""` | 文本内容 |
| threaded | bool | `false` | 该属性的配置项 |
| visible_characters | int | `-1` | 可见字符数 |
| visible_ratio | float | `1.0` | 可见比例 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_character_line | int | - |
| get_character_paragraph | int | - |
| get_content_height | int | - |
| get_content_width | int | - |
| get_line_count | int | - |
| get_line_offset | float | - |
| get_menu | PopupMenu | - |
| get_paragraph_count | int | - |
| get_paragraph_offset | float | - |
| get_parsed_text | String | - |
| get_selected_text | String | - |
| get_selection_from | int | - |
| get_selection_to | int | - |
| get_total_character_count | int | - |
| get_v_scroll_bar | VScrollBar | - |
| get_visible_line_count | int | - |
| get_visible_paragraph_count | int | - |
| invalidate_paragraph | bool | - |
| is_menu_visible | bool | - |
| is_ready | bool | - |
| parse_expressions_for_values | Dictionary | - |
| remove_paragraph | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |
| meta_clicked | \ meta\: \ | - |
| meta_hover_ended | \ meta\: \ | - |
| meta_hover_started | \ meta\: \ | - |

### 使用场景

富文本显示：游戏内对话、帮助文本、格式化内容。

### 示例代码

```gdscript
# RichTextLabel 基本使用示例
# RichTextLabel 使用示例
```

### 官方链接

[RichTextLabel 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_richtextlabel.html)

---

## TextureRect

**继承链：** Control > CanvasItem > Node > Object
**描述：** 纹理显示控件，用于在 UI 中显示纹理图像。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| flip_h | bool | `false` | 水平翻转 |
| flip_v | bool | `false` | 垂直翻转 |
| texture | Texture2D | `-` | 纹理资源 |

### 使用场景

显示图像：UI 背景、图标、头像。

### 示例代码

```gdscript
# TextureRect 基本使用示例
# TextureRect 使用示例
```

### 官方链接

[TextureRect 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_texturerect.html)

---

## TextureButton

**继承链：** BaseButton > Control > CanvasItem > Node > Object
**描述：** 纹理按钮控件，使用自定义纹理作为按钮外观。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| flip_h | bool | `false` | 水平翻转 |
| flip_v | bool | `false` | 垂直翻转 |
| ignore_texture_size | bool | `false` | 忽略纹理大小 |
| texture_click_mask | BitMap | `-` | 点击遮罩 |
| texture_disabled | Texture2D | `-` | 禁用状态纹理 |
| texture_focused | Texture2D | `-` | 聚焦状态纹理 |
| texture_hover | Texture2D | `-` | 悬停状态纹理 |
| texture_normal | Texture2D | `-` | 正常状态纹理 |
| texture_pressed | Texture2D | `-` | 按下状态纹理 |

### 使用场景

图像按钮：自定义外观的按钮。

### 示例代码

```gdscript
# TextureButton 基本使用示例
# TextureButton 使用示例
```

### 官方链接

[TextureButton 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_texturebutton.html)

---

## ProgressBar

**继承链：** Range > Control > CanvasItem > Node > Object
**描述：** 进度条控件，用于显示操作进度。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| editor_preview_indeterminate | bool | `-` | 该属性的配置项 |
| fill_mode | int | `0` | 该属性的配置项 |
| indeterminate | bool | `false` | 该属性的配置项 |
| show_percentage | bool | `true` | 该属性的配置项 |

### 使用场景

进度显示：加载进度、血量条、经验值。

### 示例代码

```gdscript
# ProgressBar 基本使用示例
var progress_bar = $ProgressBar
progress_bar.value = 75
progress_bar.max_value = 100
```

### 官方链接

[ProgressBar 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_progressbar.html)

---

## HSlider

**继承链：** Slider > Range > Control > CanvasItem > Node > Object
**描述：** 水平滑块控件，用户可以拖动滑块选择数值。

### 使用场景

水平滑块：音量控制、亮度调节。

### 示例代码

```gdscript
# HSlider 基本使用示例
# HSlider 使用示例
```

### 官方链接

[HSlider 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_hslider.html)

---

## VSlider

**继承链：** Slider > Range > Control > CanvasItem > Node > Object
**描述：** 垂直滑块控件。

### 使用场景

垂直滑块：音量控制。

### 示例代码

```gdscript
# VSlider 基本使用示例
# VSlider 使用示例
```

### 官方链接

[VSlider 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_vslider.html)

---

## SpinBox

**继承链：** Range > Control > CanvasItem > Node > Object
**描述：** 数值输入框控件，带有上下调节按钮。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| custom_arrow_step | float | `0.0` | 该属性的配置项 |
| editable | bool | `true` | 是否可编辑 |
| prefix | String | `""` | 前缀 |
| select_all_on_focus | bool | `false` | 该属性的配置项 |
| suffix | String | `""` | 后缀 |
| update_on_text_changed | bool | `false` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_line_edit | LineEdit | - |

### 使用场景

数值输入：设置项调整。

### 示例代码

```gdscript
# SpinBox 基本使用示例
# SpinBox 使用示例
```

### 官方链接

[SpinBox 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_spinbox.html)

---

## OptionButton

**继承链：** Button > BaseButton > Control > CanvasItem > Node > Object
**描述：** 下拉选项按钮控件。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| allow_reselect | bool | `false` | 允许重新选择 |
| fit_to_longest_item | bool | `true` | 该属性的配置项 |
| item_count | int | `0` | 该属性的配置项 |
| selected | int | `-1` | 是否选中 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_item_icon | Texture2D | - |
| get_item_id | int | - |
| get_item_index | int | - |
| get_item_metadata | Variant | - |
| get_item_text | String | - |
| get_item_tooltip | String | - |
| get_popup | PopupMenu | - |
| get_selectable_item | int | - |
| get_selected_id | int | - |
| get_selected_metadata | Variant | - |
| has_selectable_items | bool | - |
| is_item_disabled | bool | - |
| is_item_separator | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| item_focused | \ index\: \ | - |
| item_selected | \ index\: \ | 项目被选中时触发 |

### 使用场景

下拉选择：分辨率选择、语言选择。

### 示例代码

```gdscript
# OptionButton 基本使用示例
# OptionButton 使用示例
```

### 官方链接

[OptionButton 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_optionbutton.html)

---

## CheckBox

**继承链：** Button > BaseButton > Control > CanvasItem > Node > Object
**描述：** 复选框控件，支持选中/未选中两种状态。

### 使用场景

多选项：设置项开关。

### 示例代码

```gdscript
# CheckBox 基本使用示例
# CheckBox 使用示例
```

### 官方链接

[CheckBox 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_checkbox.html)

---

## CheckButton

**继承链：** Button > BaseButton > Control > CanvasItem > Node > Object
**描述：** 切换按钮控件，外观类似开关。

### 使用场景

单个开关：启用/禁用选项。

### 示例代码

```gdscript
# CheckButton 基本使用示例
# CheckButton 使用示例
```

### 官方链接

[CheckButton 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_checkbutton.html)

---

## ItemList

**继承链：** Control > CanvasItem > Node > Object
**描述：** 项目列表控件，显示可选择的项目列表。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| allow_reselect | bool | `false` | 允许重新选择 |
| allow_rmb_select | bool | `false` | 该属性的配置项 |
| allow_search | bool | `true` | 允许搜索 |
| auto_height | bool | `false` | 自动高度 |
| fixed_column_width | int | `0` | 固定列宽 |
| fixed_icon_size | Vector2i | `Vector2i(0, 0)` | 固定图标大小 |
| icon_scale | float | `1.0` | 图标缩放 |
| item_count | int | `0` | 该属性的配置项 |
| max_columns | int | `1` | 最大列数 |
| max_text_lines | int | `1` | 最大文本行数 |
| same_column_width | bool | `false` | 相同列宽 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| add_icon_item | int | - |
| add_item | int | - |
| get_item_at_position | int | - |
| get_item_custom_bg_color | Color | - |
| get_item_custom_fg_color | Color | - |
| get_item_icon | Texture2D | - |
| get_item_icon_modulate | Color | - |
| get_item_icon_region | Rect2 | - |
| get_item_language | String | - |
| get_item_metadata | Variant | - |
| get_item_rect | Rect2 | - |
| get_item_text | String | - |
| get_item_tooltip | String | - |
| get_selected_items | PackedInt32Array | - |
| get_v_scroll_bar | VScrollBar | - |
| is_anything_selected | bool | - |
| is_item_disabled | bool | - |
| is_item_icon_transposed | bool | - |
| is_item_selectable | bool | - |
| is_item_tooltip_enabled | bool | - |
| is_selected | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| empty_clicked | \ at_position\: , mouse_button_index\: \ | - |
| item_activated | \ index\: \ | 项目被双击激活时触发 |
| item_clicked | \ index\: , at_position\: , mouse_button_index\: \ | - |
| item_selected | \ index\: \ | 项目被选中时触发 |
| multi_selected | \ index\: , selected\: \ | 多选时触发 |

### 使用场景

列表显示：物品栏、文件列表。

### 示例代码

```gdscript
# ItemList 基本使用示例
# ItemList 使用示例
```

### 官方链接

[ItemList 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_itemlist.html)

---

## Tree

**继承链：** Control > CanvasItem > Node > Object
**描述：** 树形列表控件，显示层级结构数据。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| allow_reselect | bool | `false` | 允许重新选择 |
| allow_rmb_select | bool | `false` | 该属性的配置项 |
| allow_search | bool | `true` | 允许搜索 |
| column_titles_visible | bool | `false` | 显示列标题 |
| columns | int | `1` | 列数 |
| drop_mode_flags | int | `0` | 拖放模式标志 |
| enable_recursive_folding | bool | `true` | 该属性的配置项 |
| hide_folding | bool | `false` | 该属性的配置项 |
| hide_root | bool | `false` | 该属性的配置项 |
| scroll_horizontal_enabled | bool | `true` | 启用水平滚动 |
| scroll_vertical_enabled | bool | `true` | 启用垂直滚动 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| create_item | TreeItem | - |
| edit_selected | bool | - |
| get_button_id_at_position | int | - |
| get_column_at_position | int | - |
| get_column_expand_ratio | int | - |
| get_column_title | String | - |
| get_column_title_language | String | - |
| get_column_width | int | - |
| get_custom_popup_rect | Rect2 | - |
| get_drop_section_at_position | int | - |
| get_edited | TreeItem | - |
| get_edited_column | int | - |
| get_item_area_rect | Rect2 | - |
| get_item_at_position | TreeItem | - |
| get_next_selected | TreeItem | - |
| get_pressed_button | int | - |
| get_root | TreeItem | - |
| get_scroll | Vector2 | - |
| get_selected | TreeItem | - |
| get_selected_column | int | - |
| is_column_clipping_content | bool | - |
| is_column_expanding | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| button_clicked | \ item\: , column\: , id\: , mouse_button_index\: \ | - |
| cell_selected | \ | - |
| check_propagated_to_item | \ item\: , column\: \ | - |
| column_title_clicked | \ column\: , mouse_button_index\: \ | - |
| custom_item_clicked | \ mouse_button_index\: \ | - |
| custom_popup_edited | \ arrow_clicked\: \ | - |
| empty_clicked | \ click_position\: , mouse_button_index\: \ | - |
| item_activated | \ | 项目被双击激活时触发 |
| item_collapsed | \ item\: \ | - |
| item_edited | \ | - |
| item_icon_double_clicked | \ | - |
| item_mouse_selected | \ mouse_position\: , mouse_button_index\: \ | - |
| item_selected | \ | 项目被选中时触发 |
| multi_selected | \ item\: , column\: , selected\: \ | 多选时触发 |
| nothing_selected | \ | 取消所有选择时触发 |

### 使用场景

树形结构：文件浏览器、技能树。

### 示例代码

```gdscript
# Tree 基本使用示例
# Tree 使用示例
```

### 官方链接

[Tree 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_tree.html)

---

## TabContainer

**继承链：** Container > Control > CanvasItem > Node > Object
**描述：** 标签页容器，管理多个标签页。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| all_tabs_in_front | bool | `false` | 该属性的配置项 |
| clip_tabs | bool | `true` | 该属性的配置项 |
| current_tab | int | `-1` | 该属性的配置项 |
| deselect_enabled | bool | `false` | 该属性的配置项 |
| drag_to_rearrange_enabled | bool | `false` | 该属性的配置项 |
| tabs_rearrange_group | int | `-1` | 该属性的配置项 |
| tabs_visible | bool | `true` | 该属性的配置项 |
| use_hidden_tabs_for_min_size | bool | `false` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_current_tab_control | Control | - |
| get_popup | Popup | - |
| get_previous_tab | int | - |
| get_tab_bar | TabBar | - |
| get_tab_button_icon | Texture2D | - |
| get_tab_control | Control | - |
| get_tab_count | int | - |
| get_tab_icon | Texture2D | - |
| get_tab_icon_max_width | int | - |
| get_tab_idx_at_point | int | - |
| get_tab_idx_from_control | int | - |
| get_tab_metadata | Variant | - |
| get_tab_title | String | - |
| get_tab_tooltip | String | - |
| is_tab_disabled | bool | - |
| is_tab_hidden | bool | - |
| select_next_available | bool | - |
| select_previous_available | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| active_tab_rearranged | \ idx_to\: \ | - |
| pre_popup_pressed | \ | - |
| tab_button_pressed | \ tab\: \ | - |
| tab_changed | \ tab\: \ | 标签页切换时触发 |
| tab_clicked | \ tab\: \ | 标签页被点击时触发 |
| tab_hovered | \ tab\: \ | 标签页被悬停时触发 |
| tab_selected | \ tab\: \ | 标签页选中时触发 |

### 使用场景

标签页：设置面板、背包分页。

### 示例代码

```gdscript
# TabContainer 基本使用示例
# TabContainer 使用示例
```

### 官方链接

[TabContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_tabcontainer.html)

---

## ScrollContainer

**继承链：** Container > Control > CanvasItem > Node > Object
**描述：** 滚动容器，为子控件提供滚动功能。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| follow_focus | bool | `false` | 跟随焦点 |
| scroll_deadzone | int | `0` | 滚动死区 |
| scroll_horizontal | int | `0` | 该属性的配置项 |
| scroll_horizontal_custom_step | float | `-1.0` | 该属性的配置项 |
| scroll_vertical | int | `0` | 该属性的配置项 |
| scroll_vertical_custom_step | float | `-1.0` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_h_scroll_bar | HScrollBar | - |
| get_v_scroll_bar | VScrollBar | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| scroll_ended | \ | 结束滚动时触发 |
| scroll_started | \ | 开始滚动时触发 |

### 使用场景

滚动区域：长列表、聊天记录。

### 示例代码

```gdscript
# ScrollContainer 基本使用示例
# ScrollContainer 使用示例
```

### 官方链接

[ScrollContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_scrollcontainer.html)

---

## HSplitContainer

**继承链：** SplitContainer > Container > Control > CanvasItem > Node > Object
**描述：** 水平分割容器。

### 使用场景

左右分栏：编辑器布局。

### 示例代码

```gdscript
# HSplitContainer 基本使用示例
# HSplitContainer 使用示例
```

### 官方链接

[HSplitContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_hsplitcontainer.html)

---

## VSplitContainer

**继承链：** SplitContainer > Container > Control > CanvasItem > Node > Object
**描述：** 垂直分割容器。

### 使用场景

上下分栏。

### 示例代码

```gdscript
# VSplitContainer 基本使用示例
# VSplitContainer 使用示例
```

### 官方链接

[VSplitContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_vsplitcontainer.html)

---

## MarginContainer

**继承链：** Container > Control > CanvasItem > Node > Object
**描述：** 边距容器，为子控件添加四周边距。

### 使用场景

添加间距：UI 布局边距。

### 示例代码

```gdscript
# MarginContainer 基本使用示例
# MarginContainer 使用示例
```

### 官方链接

[MarginContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_margincontainer.html)

---

## VBoxContainer

**继承链：** BoxContainer > Container > Control > CanvasItem > Node > Object
**描述：** 垂直盒式容器，子控件从上到下垂直排列。

### 使用场景

垂直排列：菜单列表。

### 示例代码

```gdscript
# VBoxContainer 基本使用示例
# VBoxContainer 使用示例
```

### 官方链接

[VBoxContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_vboxcontainer.html)

---

## HBoxContainer

**继承链：** BoxContainer > Container > Control > CanvasItem > Node > Object
**描述：** 水平盒式容器，子控件从左到右水平排列。

### 使用场景

水平排列：工具栏、按钮行。

### 示例代码

```gdscript
# HBoxContainer 基本使用示例
# HBoxContainer 使用示例
```

### 官方链接

[HBoxContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_hboxcontainer.html)

---

## GridContainer

**继承链：** Container > Control > CanvasItem > Node > Object
**描述：** 网格容器，子控件按网格排列。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| columns | int | `1` | 列数 |

### 使用场景

网格排列：物品格子、键盘布局。

### 示例代码

```gdscript
# GridContainer 基本使用示例
# GridContainer 使用示例
```

### 官方链接

[GridContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_gridcontainer.html)

---

## CenterContainer

**继承链：** Container > Control > CanvasItem > Node > Object
**描述：** 居中容器，使子控件居中显示。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| use_top_left | bool | `false` | 该属性的配置项 |

### 使用场景

居中对齐：弹窗内容居中。

### 示例代码

```gdscript
# CenterContainer 基本使用示例
# CenterContainer 使用示例
```

### 官方链接

[CenterContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_centercontainer.html)

---

## PanelContainer

**继承链：** Container > Control > CanvasItem > Node > Object
**描述：** 面板容器，提供带背景面板的容器。

### 使用场景

面板背景：对话框、信息面板。

### 示例代码

```gdscript
# PanelContainer 基本使用示例
# PanelContainer 使用示例
```

### 官方链接

[PanelContainer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_panelcontainer.html)

---

## ColorPicker

**继承链：** VBoxContainer > BoxContainer > Container > Control > CanvasItem > Node > Object
**描述：** 颜色选择器控件，支持 RGB、HSV 模式等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| can_add_swatches | bool | `true` | 该属性的配置项 |
| color | Color | `Color(1, 1, 1, 1)` | 颜色 |
| color_modes_visible | bool | `true` | 该属性的配置项 |
| deferred_mode | bool | `false` | 延迟模式 |
| edit_alpha | bool | `true` | 编辑透明度 |
| hex_visible | bool | `true` | 显示十六进制输入 |
| presets_visible | bool | `true` | 显示预设 |
| sampler_visible | bool | `true` | 该属性的配置项 |
| sliders_visible | bool | `true` | 显示滑块 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_presets | PackedColorArray | - |
| get_recent_presets | PackedColorArray | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| color_changed | \ color\: \ | 颜色改变时触发 |
| preset_added | \ color\: \ | - |
| preset_removed | \ color\: \ | - |

### 使用场景

颜色选择：自定义颜色设置。

### 示例代码

```gdscript
# ColorPicker 基本使用示例
# ColorPicker 使用示例
```

### 官方链接

[ColorPicker 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_colorpicker.html)

---

## Popup

**继承链：** Window > Viewport > Node > Object
**描述：** 弹出窗口控件。

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| popup_hide | \ | 弹出窗口隐藏时触发 |

### 使用场景

弹出窗口。

### 示例代码

```gdscript
# Popup 基本使用示例
# Popup 使用示例
```

### 官方链接

[Popup 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_popup.html)

---

## PopupMenu

**继承链：** Popup > Window > Viewport > Node > Object
**描述：** 弹出菜单控件，显示菜单项列表。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| allow_search | bool | `true` | 允许搜索 |
| hide_on_checkable_item_selection | bool | `true` | 勾选后隐藏 |
| hide_on_item_selection | bool | `true` | 选择后隐藏 |
| hide_on_state_item_selection | bool | `false` | 状态选择后隐藏 |
| item_count | int | `0` | 该属性的配置项 |
| prefer_native_menu | bool | `false` | 该属性的配置项 |
| submenu_popup_delay | float | `0.3` | 子菜单弹出延迟 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| activate_item_by_event | bool | - |
| get_focused_item | int | - |
| get_item_icon | Texture2D | - |
| get_item_icon_max_width | int | - |
| get_item_icon_modulate | Color | - |
| get_item_id | int | - |
| get_item_indent | int | - |
| get_item_index | int | - |
| get_item_language | String | - |
| get_item_metadata | Variant | - |
| get_item_multistate | int | - |
| get_item_multistate_max | int | - |
| get_item_shortcut | Shortcut | - |
| get_item_submenu | String | - |
| get_item_submenu_node | PopupMenu | - |
| get_item_text | String | - |
| get_item_tooltip | String | - |
| is_item_checkable | bool | - |
| is_item_checked | bool | - |
| is_item_disabled | bool | - |
| is_item_radio_checkable | bool | - |
| is_item_separator | bool | - |
| is_item_shortcut_disabled | bool | - |
| is_native_menu | bool | - |
| is_system_menu | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| id_focused | \ id\: \ | - |
| id_pressed | \ id\: \ | - |
| index_pressed | \ index\: \ | - |
| menu_changed | \ | - |

### 使用场景

右键菜单、上下文菜单。

### 示例代码

```gdscript
# PopupMenu 基本使用示例
# PopupMenu 使用示例
```

### 官方链接

[PopupMenu 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_popupmenu.html)

---

## FileDialog

**继承链：** ConfirmationDialog > AcceptDialog > Window > Viewport > Node > Object
**描述：** 文件对话框控件，用于选择文件或文件夹。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| current_dir | String | `-` | 当前目录 |
| current_file | String | `-` | 当前文件 |
| current_path | String | `-` | 当前路径 |
| filters | PackedStringArray | `PackedStringArray()` | 文件过滤器 |
| mode_overrides_title | bool | `true` | 该属性的配置项 |
| option_count | int | `0` | 该属性的配置项 |
| root_subfolder | String | `""` | 根子文件夹 |
| show_hidden_files | bool | `false` | 显示隐藏文件 |
| use_native_dialog | bool | `false` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_line_edit | LineEdit | - |
| get_option_default | int | - |
| get_option_name | String | - |
| get_option_values | PackedStringArray | - |
| get_selected_options | Dictionary | - |
| get_vbox | VBoxContainer | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| dir_selected | \ dir\: \ | 目录被选中时触发 |
| file_selected | \ path\: \ | 文件被选中时触发 |
| files_selected | \ paths\: \ | 多文件被选中时触发 |

### 使用场景

文件选择：保存/加载游戏。

### 示例代码

```gdscript
# FileDialog 基本使用示例
# FileDialog 使用示例
```

### 官方链接

[FileDialog 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_filedialog.html)

---

## GraphEdit

**继承链：** Control > CanvasItem > Node > Object
**描述：** 图形编辑器控件，用于节点图编辑。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| connection_lines_antialiased | bool | `true` | 该属性的配置项 |
| connection_lines_curvature | float | `0.5` | 连接线曲率 |
| connection_lines_thickness | float | `4.0` | 连接线粗细 |
| minimap_enabled | bool | `true` | 启用小地图 |
| minimap_opacity | float | `0.65` | 小地图透明度 |
| minimap_size | Vector2 | `Vector2(240, 160)` | 小地图大小 |
| right_disconnects | bool | `false` | 右键断开连接 |
| scroll_offset | Vector2 | `Vector2(0, 0)` | 滚动偏移 |
| show_arrange_button | bool | `true` | 显示排列按钮 |
| show_grid | bool | `true` | 显示网格 |
| show_grid_buttons | bool | `true` | 显示网格按钮 |
| show_menu | bool | `true` | 显示菜单 |
| show_minimap_button | bool | `true` | 显示小地图按钮 |
| show_zoom_buttons | bool | `true` | 显示缩放按钮 |
| show_zoom_label | bool | `false` | 显示缩放标签 |
| snapping_distance | int | `20` | 对齐距离 |
| snapping_enabled | bool | `true` | 启用对齐 |
| zoom | float | `1.0` | 缩放比例 |
| zoom_max | float | `2.0736` | 最大缩放 |
| zoom_min | float | `0.232568` | 最小缩放 |
| zoom_step | float | `1.2` | 缩放步长 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| _get_connection_line | PackedVector2Array | - |
| _is_in_input_hotzone | bool | - |
| _is_in_output_hotzone | bool | - |
| _is_node_hover_valid | bool | - |
| get_closest_connection_at_point | Dictionary | - |
| get_connection_line | PackedVector2Array | - |
| get_element_frame | GraphFrame | - |
| get_menu_hbox | HBoxContainer | - |
| is_node_connected | bool | - |
| is_valid_connection_type | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| begin_node_move | \ | - |
| connection_drag_ended | \ | - |
| connection_drag_started | \ from_node\: , from_port\: , is_output\: \ | - |
| connection_from_empty | \ to_node\: , to_port\: , release_position\: \ | - |
| connection_request | \ from_node\: , from_port\: , to_node\: , to_port\: \ | 请求连接时触发 |
| connection_to_empty | \ from_node\: , from_port\: , release_position\: \ | 连接到空位置时触发 |
| copy_nodes_request | \ | 请求复制节点时触发 |
| delete_nodes_request | \ nodes\: \[\]\ | - |
| disconnection_request | \ from_node\: , from_port\: , to_node\: , to_port\: \ | 请求断开连接时触发 |
| duplicate_nodes_request | \ | - |
| end_node_move | \ | - |
| frame_rect_changed | \ frame\: , new_rect\: \ | - |
| graph_elements_linked_to_frame_request | \ elements\: , frame\: \ | - |
| node_deselected | \ node\: \ | 节点取消选中时触发 |
| node_selected | \ node\: \ | 节点被选中时触发 |

### 使用场景

视觉脚本编辑器、节点图编辑。

### 示例代码

```gdscript
# GraphEdit 基本使用示例
# GraphEdit 使用示例
```

### 官方链接

[GraphEdit 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_graphedit.html)

---

## GraphNode

**继承链：** GraphElement > Container > Control > CanvasItem > Node > Object
**描述：** 图形节点控件，用于 GraphEdit 中的节点。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| ignore_invalid_connection_type | bool | `false` | 该属性的配置项 |
| title | String | `""` | 标题 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_input_port_color | Color | - |
| get_input_port_count | int | - |
| get_input_port_position | Vector2 | - |
| get_input_port_slot | int | - |
| get_input_port_type | int | - |
| get_output_port_color | Color | - |
| get_output_port_count | int | - |
| get_output_port_position | Vector2 | - |
| get_output_port_slot | int | - |
| get_output_port_type | int | - |
| get_slot_color_left | Color | - |
| get_slot_color_right | Color | - |
| get_slot_custom_icon_left | Texture2D | - |
| get_slot_custom_icon_right | Texture2D | - |
| get_slot_type_left | int | - |
| get_slot_type_right | int | - |
| get_titlebar_hbox | HBoxContainer | - |
| is_slot_draw_stylebox | bool | - |
| is_slot_enabled_left | bool | - |
| is_slot_enabled_right | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| slot_updated | \ slot_index\: \ | - |

### 使用场景

节点图中的节点。

### 示例代码

```gdscript
# GraphNode 基本使用示例
# GraphNode 使用示例
```

### 官方链接

[GraphNode 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_graphnode.html)

---

# 动画/音频

---

## AnimationPlayer

**继承链：** AnimationMixer > Node > Object
**描述：** 动画播放器节点，管理和播放关键帧动画。是 Godot 中最核心的动画节点。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| assigned_animation | String | `-` | 该属性的配置项 |
| autoplay | String | `""` | 自动播放 |
| current_animation | String | `""` | 该属性的配置项 |
| current_animation_length | float | `-` | 该属性的配置项 |
| current_animation_position | float | `-` | 该属性的配置项 |
| movie_quit_on_finish | bool | `false` | 完成后退出 |
| playback_auto_capture | bool | `true` | 该属性的配置项 |
| playback_auto_capture_duration | float | `-1.0` | 该属性的配置项 |
| playback_default_blend_time | float | `0.0` | 该属性的配置项 |
| speed_scale | float | `1.0` | 速度缩放 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| animation_get_next | StringName | - |
| get_blend_time | float | - |
| get_playing_speed | float | - |
| get_queue | PackedStringArray | - |
| get_root | NodePath | - |
| is_playing | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| animation_changed | \ old_name\: , new_name\: \ | 动画切换时触发 |
| current_animation_changed | \ name\: \ | - |

### 使用场景

播放动画：角色动画、UI 动画、过场动画。

### 示例代码

```gdscript
# AnimationPlayer 基本使用示例
var anim_player = $AnimationPlayer
anim_player.play("idle")

func play_attack():
    anim_player.play("attack")
```

### 官方链接

[AnimationPlayer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_animationplayer.html)

---

## AnimationTree

**继承链：** AnimationMixer > Node > Object
**描述：** 动画树节点，用于高级动画状态机和混合。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| advance_expression_base_node | NodePath | `NodePath(".")` | 该属性的配置项 |
| anim_player | NodePath | `NodePath("")` | 该属性的配置项 |
| tree_root | AnimationRootNode | `-` | 该属性的配置项 |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| animation_player_changed | \ | - |

### 使用场景

动画状态机：复杂角色动画混合和过渡。

### 示例代码

```gdscript
# AnimationTree 基本使用示例
# AnimationTree 使用示例
```

### 官方链接

[AnimationTree 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_animationtree.html)

---

## AnimationMixer

**继承链：** Node > Object
**描述：** 动画混合器节点，动画系统的基类。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| active | bool | `true` | 该属性的配置项 |
| audio_max_polyphony | int | `32` | 该属性的配置项 |
| deterministic | bool | `false` | 该属性的配置项 |
| reset_on_save | bool | `true` | 该属性的配置项 |
| root_motion_track | NodePath | `NodePath("")` | 该属性的配置项 |
| root_node | NodePath | `NodePath("..")` | 该属性的配置项 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| _post_process_key_value | Variant | - |
| find_animation | StringName | - |
| find_animation_library | StringName | - |
| get_animation | Animation | - |
| get_animation_library | AnimationLibrary | - |
| get_animation_list | PackedStringArray | - |
| get_root_motion_position | Vector3 | - |
| get_root_motion_position_accumulator | Vector3 | - |
| get_root_motion_rotation | Quaternion | - |
| get_root_motion_rotation_accumulator | Quaternion | - |
| get_root_motion_scale | Vector3 | - |
| get_root_motion_scale_accumulator | Vector3 | - |
| has_animation | bool | - |
| has_animation_library | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| animation_finished | \ anim_name\: \ | 动画播放完成时触发 |
| animation_libraries_updated | \ | - |
| animation_list_changed | \ | - |
| animation_started | \ anim_name\: \ | 动画开始播放时触发 |
| caches_cleared | \ | - |
| mixer_applied | \ | - |
| mixer_updated | \ | - |

### 使用场景

动画混合基础。

### 示例代码

```gdscript
# AnimationMixer 基本使用示例
# AnimationMixer 使用示例
```

### 官方链接

[AnimationMixer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_animationmixer.html)

---

## AudioStreamPlayer

**继承链：** Node > Object
**描述：** 音频播放器节点，用于播放非位置性音频。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| autoplay | bool | `false` | 自动播放 |
| bus | StringName | `&"Master"` | 音频总线 |
| max_polyphony | int | `1` | 该属性的配置项 |
| pitch_scale | float | `1.0` | 音调缩放 |
| playing | bool | `false` | 是否正在播放 |
| stream | AudioStream | `-` | 音频流 |
| stream_paused | bool | `false` | 暂停流 |
| volume_db | float | `0.0` | 音量（分贝） |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_playback_position | float | - |
| get_stream_playback | AudioStreamPlayback | - |
| has_stream_playback | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

播放背景音乐、UI 音效。

### 示例代码

```gdscript
# AudioStreamPlayer 基本使用示例
var audio = $AudioStreamPlayer
audio.stream = load("res://music.ogg")
audio.play()
```

### 官方链接

[AudioStreamPlayer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostreamplayer.html)

---

## AudioStreamPlayer2D

**继承链：** Node2D > CanvasItem > Node > Object
**描述：** 2D 音频播放器节点，带 2D 空间音频效果。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| area_mask | int | `1` | 区域掩码 |
| attenuation | float | `1.0` | 该属性的配置项 |
| autoplay | bool | `false` | 自动播放 |
| bus | StringName | `&"Master"` | 音频总线 |
| max_distance | float | `2000.0` | 最大距离 |
| max_polyphony | int | `1` | 该属性的配置项 |
| panning_strength | float | `1.0` | 该属性的配置项 |
| pitch_scale | float | `1.0` | 音调缩放 |
| playing | bool | `false` | 是否正在播放 |
| stream | AudioStream | `-` | 音频流 |
| stream_paused | bool | `false` | 暂停流 |
| volume_db | float | `0.0` | 音量（分贝） |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_playback_position | float | - |
| get_stream_playback | AudioStreamPlayback | - |
| has_stream_playback | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

2D 空间音效：2D 游戏中的环境音。

### 示例代码

```gdscript
# AudioStreamPlayer2D 基本使用示例
# AudioStreamPlayer2D 使用示例
```

### 官方链接

[AudioStreamPlayer2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostreamplayer2d.html)

---

## AudioStreamPlayer3D

**继承链：** Node3D > Node > Object
**描述：** 3D 音频播放器节点，带 3D 空间音频效果。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| area_mask | int | `1` | 区域掩码 |
| attenuation_filter_cutoff_hz | float | `5000.0` | 衰减过滤截止频率 |
| attenuation_filter_db | float | `-24.0` | 衰减过滤分贝 |
| autoplay | bool | `false` | 自动播放 |
| bus | StringName | `&"Master"` | 音频总线 |
| emission_angle_degrees | float | `45.0` | 发射角度（度） |
| emission_angle_enabled | bool | `false` | 启用发射角度 |
| emission_angle_filter_attenuation_db | float | `-12.0` | 该属性的配置项 |
| max_db | float | `3.0` | 最大音量 |
| max_distance | float | `0.0` | 最大距离 |
| max_polyphony | int | `1` | 该属性的配置项 |
| panning_strength | float | `1.0` | 该属性的配置项 |
| pitch_scale | float | `1.0` | 音调缩放 |
| playing | bool | `false` | 是否正在播放 |
| stream | AudioStream | `-` | 音频流 |
| stream_paused | bool | `false` | 暂停流 |
| unit_size | float | `10.0` | 该属性的配置项 |
| volume_db | float | `0.0` | 音量（分贝） |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_playback_position | float | - |
| get_stream_playback | AudioStreamPlayback | - |
| has_stream_playback | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

3D 空间音效：3D 游戏中的环境音、脚步声。

### 示例代码

```gdscript
# AudioStreamPlayer3D 基本使用示例
# AudioStreamPlayer3D 使用示例
```

### 官方链接

[AudioStreamPlayer3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostreamplayer3d.html)

---

## VideoStreamPlayer

**继承链：** Control > CanvasItem > Node > Object
**描述：** 视频播放器节点，用于播放视频流。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| audio_track | int | `0` | 音频轨道 |
| autoplay | bool | `false` | 自动播放 |
| buffering_msec | int | `500` | 缓冲毫秒 |
| bus | StringName | `&"Master"` | 音频总线 |
| expand | bool | `false` | 该属性的配置项 |
| loop | bool | `false` | 是否循环 |
| paused | bool | `false` | 该属性的配置项 |
| stream | VideoStream | `-` | 音频流 |
| stream_position | float | `-` | 流位置 |
| volume | float | `-` | 该属性的配置项 |
| volume_db | float | `0.0` | 音量（分贝） |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| get_stream_length | float | - |
| get_stream_name | String | - |
| get_video_texture | Texture2D | - |
| is_playing | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| finished | \ | - |

### 使用场景

播放视频：过场动画、背景视频。

### 示例代码

```gdscript
# VideoStreamPlayer 基本使用示例
# VideoStreamPlayer 使用示例
```

### 官方链接

[VideoStreamPlayer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_videostreamplayer.html)

---

## Timer

**继承链：** Node > Object
**描述：** 计时器节点，用于定时触发事件。支持单次/重复触发、暂停、自动开始等。

### 属性

| 属性名 | 类型 | 默认值 | 描述 |
|--------|------|--------|------|
| autostart | bool | `false` | 自动开始 |
| one_shot | bool | `false` | 单次触发 |
| paused | bool | `-` | 该属性的配置项 |
| time_left | float | `-` | 剩余时间 |
| wait_time | float | `1.0` | 等待时间 |

### 方法

| 方法名 | 返回类型 | 描述 |
|--------|----------|------|
| is_stopped | bool | - |

### 信号

| 信号名 | 参数 | 描述 |
|--------|------|------|
| timeout | \ | 计时器超时时触发 |

### 使用场景

定时器：延迟执行、计时、冷却时间。

### 示例代码

```gdscript
# Timer 基本使用示例
var timer = $Timer
timer.wait_time = 2.0
timer.one_shot = true
timer.timeout.connect(_on_timer_timeout)
timer.start()

func _on_timer_timeout():
    print("计时器触发")
```

### 官方链接

[Timer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_timer.html)

---



---



# 第三部分：资源与数据类型

> 涵盖核心资源类、音频/视频资源、输入事件、形状/碰撞资源、数学/基础类型和全局单例等 101 个类的完整 API。


## 目录

- [资源类 (Resource)](#资源类-Resource)
  - [Resource](#Resource)
  - [PackedScene](#PackedScene)
  - [Texture2D](#Texture2D)
  - [CompressedTexture2D](#CompressedTexture2D)
  - [ImageTexture](#ImageTexture)
  - [AtlasTexture](#AtlasTexture)
  - [Image](#Image)
  - [Material](#Material)
  - [StandardMaterial3D](#StandardMaterial3D)
  - [ShaderMaterial](#ShaderMaterial)
  - [CanvasItemMaterial](#CanvasItemMaterial)
  - [Mesh](#Mesh)
  - [ArrayMesh](#ArrayMesh)
  - [ImmediateMesh](#ImmediateMesh)
  - [Font](#Font)
  - [FontFile](#FontFile)
  - [SystemFont](#SystemFont)
  - [Theme](#Theme)
  - [StyleBox](#StyleBox)
  - [StyleBoxFlat](#StyleBoxFlat)
  - [StyleBoxTexture](#StyleBoxTexture)
  - [Curve](#Curve)
  - [Curve2D](#Curve2D)
  - [Curve3D](#Curve3D)
  - [Gradient](#Gradient)
  - [NavigationMesh](#NavigationMesh)
  - [NavigationPolygon](#NavigationPolygon)
  - [TileSet](#TileSet)
  - [TileSetAtlasSource](#TileSetAtlasSource)
  - [SpriteFrames](#SpriteFrames)
  - [Animation](#Animation)
  - [AnimationLibrary](#AnimationLibrary)
  - [PhysicsMaterial](#PhysicsMaterial)
  - [Environment](#Environment)
  - [Sky](#Sky)
  - [ProceduralSkyMaterial](#ProceduralSkyMaterial)
  - [LightmapGIData](#LightmapGIData)
  - [MultiMesh](#MultiMesh)
  - [Shortcut](#Shortcut)
  - [LabelSettings](#LabelSettings)
- [音频/视频资源 (Audio/Video)](#音频视频资源-AudioVideo)
  - [AudioStream](#AudioStream)
  - [AudioStreamMP3](#AudioStreamMP3)
  - [AudioStreamOggVorbis](#AudioStreamOggVorbis)
  - [AudioStreamWAV](#AudioStreamWAV)
  - [AudioEffect](#AudioEffect)
  - [AudioEffectReverb](#AudioEffectReverb)
  - [AudioEffectDelay](#AudioEffectDelay)
  - [AudioEffectCompressor](#AudioEffectCompressor)
  - [VideoStream](#VideoStream)
  - [VideoStreamTheora](#VideoStreamTheora)
- [输入事件 (Input Events)](#输入事件-Input-Events)
  - [InputEvent](#InputEvent)
  - [InputEventKey](#InputEventKey)
  - [InputEventMouseButton](#InputEventMouseButton)
  - [InputEventMouseMotion](#InputEventMouseMotion)
  - [InputEventJoypadButton](#InputEventJoypadButton)
  - [InputEventJoypadMotion](#InputEventJoypadMotion)
  - [InputEventAction](#InputEventAction)
  - [InputEventScreenTouch](#InputEventScreenTouch)
  - [InputEventScreenDrag](#InputEventScreenDrag)
- [形状/碰撞资源 (Shapes)](#形状碰撞资源-Shapes)
  - [Shape2D](#Shape2D)
  - [CircleShape2D](#CircleShape2D)
  - [RectangleShape2D](#RectangleShape2D)
  - [CapsuleShape2D](#CapsuleShape2D)
  - [ConvexPolygonShape2D](#ConvexPolygonShape2D)
  - [ConcavePolygonShape2D](#ConcavePolygonShape2D)
  - [Shape3D](#Shape3D)
  - [BoxShape3D](#BoxShape3D)
  - [SphereShape3D](#SphereShape3D)
  - [CapsuleShape3D](#CapsuleShape3D)
  - [CylinderShape3D](#CylinderShape3D)
  - [ConvexPolygonShape3D](#ConvexPolygonShape3D)
  - [ConcavePolygonShape3D](#ConcavePolygonShape3D)
  - [HeightMapShape3D](#HeightMapShape3D)
- [数学/基础类型 (Math Types)](#数学基础类型-Math-Types)
  - [Vector2](#Vector2)
  - [Vector3](#Vector3)
  - [Color](#Color)
  - [Transform2D](#Transform2D)
  - [Transform3D](#Transform3D)
  - [Basis](#Basis)
  - [Quaternion](#Quaternion)
  - [Rect2](#Rect2)
  - [Rect2i](#Rect2i)
  - [AABB](#AABB)
  - [Plane](#Plane)
  - [Projection](#Projection)
  - [StringName](#StringName)
  - [NodePath](#NodePath)
  - [RID](#RID)
- [全局单例 (Singletons)](#全局单例-Singletons)
  - [Input](#Input)
  - [OS](#OS)
  - [Time](#Time)
  - [DisplayServer](#DisplayServer)
  - [AudioServer](#AudioServer)
  - [RenderingServer](#RenderingServer)
  - [PhysicsServer2D](#PhysicsServer2D)
  - [PhysicsServer3D](#PhysicsServer3D)
  - [NavigationServer2D](#NavigationServer2D)
  - [NavigationServer3D](#NavigationServer3D)
  - [ResourceLoader](#ResourceLoader)
  - [ClassDB](#ClassDB)
  - [JSON](#JSON)

---

# 资源类 (Resource)

## Resource

**继承链：** RefCounted > Object
**描述：** Base class for serializable objects.

> Resource is the base class for all Godot-specific resource types, serving primarily as data containers. Since they inherit from RefCounted, resources are reference-counted and freed when no longer in use. They can also be nested within other resources, and saved on disk. PackedScene, one of the most common Object s in a Godot project, is also a resource, uniquely capable of storing and instantiating the Node s it contains as many times as desired. In GDScript, resources can loaded from disk by their resource_path using @GDScript.load or @GDScript.preload. The engine keeps a global cache of all

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `resource_local_to_scene` | `bool` | `false` |
| `resource_name` | `String` | `""` |
| `resource_path` | `String` | `""` |
| `resource_scene_unique_id` | `String` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `duplicate` | `Resource` | subresources: bool = false |
| `emit_changed` | `void` |  |
| `generate_scene_unique_id` | `String` |  |
| `get_local_scene` | `Node` |  |
| `get_rid` | `RID` |  |
| `setup_local_to_scene` | `void` |  |
| `take_over_path` | `void` | path: String |

### 信号
- `changed`
- `setup_local_to_scene_requested`

### 使用场景
所有可序列化数据的基类。自定义资源用于存储游戏数据，如角色属性、关卡配置等。通过@export暴露给编辑器。

### 示例代码
```gdscript
class_name CharacterData extends Resource
@export var health: int = 100
@export var speed: float = 200.0
@export var sprite: Texture2D

# 使用
var data = preload("res://data/hero.tres")
print(data.health)
```

### 官方链接
[Resource 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_resource.html)

---

## PackedScene

**继承链：** Resource > RefCounted > Object
**描述：** An abstraction of a serialized scene.

> A simplified interface to a scene file. Provides access to operations and checks that can be performed on the scene resource itself. Can be used to save a node to a file. When saving, the node as well as all the nodes it owns get saved (see Node.owner property). **Note:** The node doesn't need to own itself. **Example of loading a saved scene:**\ # Use load() instead of preload() if the path isn't known at compile-time. var scene = preload("res://scene.tscn").instantiate() # Add the node as a child of the node the script is attached to. add_child(scene) // C# has no preload, so you have to alw

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `_bundled` | `Dictionary` | `{ "conn_count": 0, "conns": PackedInt32Array(), "editable...` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `can_instantiate` | `bool` |  |
| `get_state` | `SceneState` |  |
| `instantiate` | `Node` | edit_state: GenEditState = 0 |
| `pack` | `Error` | path: Node |

### 使用场景
场景的序列化格式。用于在运行时动态实例化场景，如生成敌人、子弹、特效等。

### 示例代码
```gdscript
var bullet_scene = preload("res://bullet.tscn")

func shoot():
    var bullet = bullet_scene.instantiate()
    bullet.position = global_position
    get_parent().add_child(bullet)
```

### 官方链接
[PackedScene 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_packedscene.html)

---

## Texture2D

**继承链：** Texture > Resource > RefCounted > Object
**描述：** Texture for 2D and 3D.

> A texture works by registering an image in the video hardware, which then can be used in 3D models or 2D Sprite2D or GUI Control. Textures are often created by loading them from a file. See @GDScript.load. **Texture2D** is a base for other resources. It cannot be used directly. **Note:** The maximum texture size is 16384×16384 pixels due to graphics hardware limitations. Larger textures may fail to import.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `create_placeholder` | `Resource` |  |
| `draw` | `void` | canvas_item: RID, position: Vector2, modulate: Color = Color(1, 1, ... |
| `draw_rect` | `void` | canvas_item: RID, rect: Rect2, tile: bool, modulate: Color = Color(... |
| `draw_rect_region` | `void` | canvas_item: RID, rect: Rect2, src_rect: Rect2, modulate: Color = C... |
| `get_height` | `int` |  |
| `get_image` | `Image` |  |
| `get_size` | `Vector2` |  |
| `get_width` | `int` |  |
| `has_alpha` | `bool` |  |

### 使用场景
所有2D纹理的抽象基类。用于Sprite2D、TextureRect等控件的纹理设置。

### 示例代码
```gdscript
@export var texture: Texture2D
$Sprite2D.texture = texture
$TextureRect.texture = texture
```

### 官方链接
[Texture2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_texture2d.html)

---

## CompressedTexture2D

**继承链：** Texture2D > Texture > Resource > RefCounted > Object
**描述：** Texture with 2 dimensions, optionally compressed.

> A texture that is loaded from a .ctex file. This file format is internal to Godot; it is created by importing other image formats with the import system. **CompressedTexture2D** can use one of 4 compression methods (including a lack of any compression): - Lossless (WebP or PNG, uncompressed on the GPU) - Lossy (WebP, uncompressed on the GPU) - VRAM Compressed (compressed on the GPU) - VRAM Uncompressed (uncompressed on the GPU) - Basis Universal (compressed on the GPU. Lower file sizes than VRAM Compressed, but slower to compress and lower quality than VRAM Compressed) Only **VRAM Compressed**

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `load_path` | `String` | `""` |
| `resource_local_to_scene` | `bool` | `false (overrides Resource)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `load` | `Error` | path: String |

### 使用场景
从磁盘加载的压缩纹理。支持 .png、.jpg、.webp、.svg 等格式。内存占用更小。

### 示例代码
```gdscript
var tex = load("res://icon.png") as CompressedTexture2D
$Sprite2D.texture = tex
```

### 官方链接
[CompressedTexture2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_compressedtexture2d.html)

---

## ImageTexture

**继承链：** Texture2D > Texture > Resource > RefCounted > Object
**描述：** A Texture2D based on an Image.

> A Texture2D based on an Image. For an image to be displayed, an **ImageTexture** has to be created from it using the create_from_image method: :: var image = Image.load_from_file("res://icon.svg") var texture = ImageTexture.create_from_image(image) $Sprite2D.texture = texture This way, textures can be created at run-time by loading images both from within the editor and externally. **Warning:** Prefer to load imported textures with @GDScript.load over loading them from within the filesystem dynamically with Image.load, as it may not work in exported projects: :: var texture = load("res://icon.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `resource_local_to_scene` | `bool` | `false (overrides Resource)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `create_from_image` | `ImageTexture` | image: Image |
| `get_format` | `Format` |  |
| `set_image` | `void` | image: Image |
| `set_size_override` | `void` | size: Vector2i |
| `update` | `void` | image: Image |

### 使用场景
从Image创建的纹理。用于动态生成纹理，如程序化纹理、截图、运行时图像处理。

### 示例代码
```gdscript
var image = Image.create(256, 256, false, Image.FORMAT_RGBA8)
image.fill(Color.RED)
var texture = ImageTexture.create_from_image(image)
$Sprite2D.texture = texture
```

### 官方链接
[ImageTexture 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_imagetexture.html)

---

## AtlasTexture

**继承链：** Texture2D > Texture > Resource > RefCounted > Object
**描述：** A texture that crops out part of another Texture2D.

> Texture2D resource that draws only part of its atlas texture, as defined by the region. An additional margin can also be set, which is useful for small adjustments. Multiple **AtlasTexture** resources can be cropped from the same atlas. Packing many smaller textures into a singular large texture helps to optimize video memory costs and render calls. **Note:** **AtlasTexture** cannot be used in an AnimatedTexture, and may not tile properly in nodes such as TextureRect, when inside other **AtlasTexture** resources.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `atlas` | `Texture2D` | `` |
| `filter_clip` | `bool` | `false` |
| `margin` | `Rect2` | `Rect2(0, 0, 0, 0)` |
| `region` | `Rect2` | `Rect2(0, 0, 0, 0)` |
| `resource_local_to_scene` | `bool` | `false (overrides Resource)` |

### 使用场景
从图集（Atlas）中裁剪出的子纹理。用于减少Draw Call，优化2D渲染性能。

### 示例代码
```gdscript
var atlas_tex = AtlasTexture.new()
atlas_tex.atlas = load("res://sprite_sheet.png")
atlas_tex.region = Rect2(0, 0, 32, 32)
$Sprite2D.texture = atlas_tex
```

### 官方链接
[AtlasTexture 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_atlastexture.html)

---

## Image

**继承链：** Resource > RefCounted > Object
**描述：** Image datatype.

> Native image datatype. Contains image data which can be converted to an ImageTexture and provides commonly used *image processing* methods. The maximum width and height for an **Image** are MAX_WIDTH and MAX_HEIGHT. An **Image** cannot be assigned to a texture property of an object directly (such as Sprite2D.texture), and has to be converted manually to an ImageTexture first. **Note:** The maximum image size is 16384×16384 pixels due to graphics hardware limitations. Larger images may fail to import.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `data` | `Dictionary` | `{ "data": PackedByteArray(), "format": "Lum8", "height": ...` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `adjust_bcs` | `void` | brightness: float, contrast: float, saturation: float |
| `blend_rect` | `void` | src: Image, src_rect: Rect2i, dst: Vector2i |
| `blend_rect_mask` | `void` | src: Image, mask: Image, src_rect: Rect2i, dst: Vector2i |
| `blit_rect` | `void` | src: Image, src_rect: Rect2i, dst: Vector2i |
| `blit_rect_mask` | `void` | src: Image, mask: Image, src_rect: Rect2i, dst: Vector2i |
| `bump_map_to_normal_map` | `void` | bump_scale: float = 1.0 |
| `clear_mipmaps` | `void` |  |
| `compress` | `Error` | mode: CompressMode, source: CompressSource = 0, astc_format: ASTCFo... |
| `compress_from_channels` | `Error` | mode: CompressMode, channels: UsedChannels, astc_format: ASTCFormat... |
| `compute_image_metrics` | `Dictionary` | compared_image: Image, use_luma: bool |
| `convert` | `void` | format: Format |
| `copy_from` | `void` | src: Image |
| `create` | `Image` | width: int, height: int, use_mipmaps: bool, format: Format |
| `create_empty` | `Image` | width: int, height: int, use_mipmaps: bool, format: Format |
| `create_from_data` | `Image` | width: int, height: int, use_mipmaps: bool, format: Format, data: P... |
| `crop` | `void` | width: int, height: int |
| `decompress` | `Error` |  |
| `detect_alpha` | `AlphaMode` |  |
| `detect_used_channels` | `UsedChannels` | source: CompressSource = 0 |
| `fill` | `void` | color: Color |
| `fill_rect` | `void` | rect: Rect2i, color: Color |
| `fix_alpha_edges` | `void` |  |
| `flip_x` | `void` |  |
| `flip_y` | `void` |  |
| `generate_mipmaps` | `Error` | renormalize: bool = false |
| `get_data` | `PackedByteArray` |  |
| `get_data_size` | `int` |  |
| `get_format` | `Format` |  |
| `get_height` | `int` |  |
| `get_mipmap_count` | `int` |  |
| `get_mipmap_offset` | `int` | mipmap: int |
| `get_pixel` | `Color` | x: int, y: int |
| `get_pixelv` | `Color` | point: Vector2i |
| `get_region` | `Image` | region: Rect2i |
| `get_size` | `Vector2i` |  |
| `get_used_rect` | `Rect2i` |  |
| `get_width` | `int` |  |
| `has_mipmaps` | `bool` |  |
| `is_compressed` | `bool` |  |
| `is_empty` | `bool` |  |
| `is_invisible` | `bool` |  |
| `load` | `Error` | path: String |
| `load_bmp_from_buffer` | `Error` | buffer: PackedByteArray |
| `load_from_file` | `Image` | path: String |
| `load_jpg_from_buffer` | `Error` | buffer: PackedByteArray |
| `load_ktx_from_buffer` | `Error` | buffer: PackedByteArray |
| `load_png_from_buffer` | `Error` | buffer: PackedByteArray |
| `load_svg_from_buffer` | `Error` | buffer: PackedByteArray, scale: float = 1.0 |
| `load_svg_from_string` | `Error` | svg_str: String, scale: float = 1.0 |
| `load_tga_from_buffer` | `Error` | buffer: PackedByteArray |
| `load_webp_from_buffer` | `Error` | buffer: PackedByteArray |
| `normal_map_to_xy` | `void` |  |
| `premultiply_alpha` | `void` |  |
| `resize` | `void` | width: int, height: int, interpolation: Interpolation = 1 |
| `resize_to_po2` | `void` | square: bool = false, interpolation: Interpolation = 1 |
| `rgbe_to_srgb` | `Image` |  |
| `rotate_90` | `void` | direction: ClockDirection |
| `rotate_180` | `void` |  |
| `save_exr` | `Error` | path: String, grayscale: bool = false |
| `save_exr_to_buffer` | `PackedByteArray` | grayscale: bool = false |
| `save_jpg` | `Error` | path: String, quality: float = 0.75 |
| `save_jpg_to_buffer` | `PackedByteArray` | quality: float = 0.75 |
| `save_png` | `Error` | path: String |
| `save_png_to_buffer` | `PackedByteArray` |  |
| `save_webp` | `Error` | path: String, lossy: bool = false, quality: float = 0.75 |
| `save_webp_to_buffer` | `PackedByteArray` | lossy: bool = false, quality: float = 0.75 |
| `set_data` | `void` | width: int, height: int, use_mipmaps: bool, format: Format, data: P... |
| `set_pixel` | `void` | x: int, y: int, color: Color |
| `set_pixelv` | `void` | point: Vector2i, color: Color |
| `shrink_x2` | `void` |  |
| `srgb_to_linear` | `void` |  |

### 常量
| 名称 | 值 |
|------|-----|
| `MAX_WIDTH` | `16777216` |
| `MAX_HEIGHT` | `16777216` |

### 使用场景
CPU端的图像数据。用于程序化纹理生成、图像处理、像素级操作、截图等。

### 示例代码
```gdscript
var image = $SubViewport.get_texture().get_image()
image.resize(128, 128)
image.save_png("res://screenshot.png")
```

### 官方链接
[Image 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_image.html)

---

## Material

**继承链：** Resource > RefCounted > Object
**描述：** Virtual base class for applying visual properties to an object, such as color and roughness.

> **Material** is a base resource used for coloring and shading geometry. All materials inherit from it and almost all VisualInstance3D derived nodes carry a **Material**. A few flags and parameters are shared between all material types and are configured here. Importantly, you can inherit from **Material** to create your own custom material type in script or in GDExtension.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `next_pass` | `Material` | `` |
| `render_priority` | `int` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `create_placeholder` | `Resource` |  |
| `inspect_native_shader_code` | `void` |  |

### 常量
| 名称 | 值 |
|------|-----|
| `RENDER_PRIORITY_MAX` | `127` |
| `RENDER_PRIORITY_MIN` | `-128` |

### 使用场景
所有材质的基类。控制3D/2D对象的渲染外观，包括颜色、光照响应、透明度等。

### 示例代码
```gdscript
@export var material: Material
$MeshInstance3D.material_override = material
```

### 官方链接
[Material 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_material.html)

---

## StandardMaterial3D

**继承链：** BaseMaterial3D > Material > Resource > RefCounted > Object
**描述：** A PBR (Physically Based Rendering) material to be used on 3D objects.

> **StandardMaterial3D**'s properties are inherited from BaseMaterial3D. **StandardMaterial3D** uses separate textures for ambient occlusion, roughness and metallic maps. To use a single ORM map for all 3 textures, use an ORMMaterial3D instead.

### 使用场景
PBR物理渲染材质，支持反照率、金属度、粗糙度、法线贴图等。3D场景中最常用的材质。

### 示例代码
```gdscript
var mat = StandardMaterial3D.new()
mat.albedo_color = Color(0.2, 0.6, 1.0)
mat.metallic = 0.8
mat.roughness = 0.2
mat.normal_texture = load("res://normal.png")
$MeshInstance3D.material_override = mat
```

### 官方链接
[StandardMaterial3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_standardmaterial3d.html)

---

## ShaderMaterial

**继承链：** Material > Resource > RefCounted > Object
**描述：** A material defined by a custom Shader program and the values of its shader parameters.

> A material that uses a custom Shader program to render visual items (canvas items, meshes, skies, fog), or to process particles. Compared to other materials, **ShaderMaterial** gives deeper control over the generated shader code. For more information, see the shaders documentation index below. Multiple **ShaderMaterial** s can use the same shader and configure different values for the shader uniforms. **Note:** For performance reasons, the Resource.changed signal is only emitted when the Resource.resource_name changes. Only in editor, it is also emitted for shader changes.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `shader` | `Shader` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_shader_parameter` | `Variant` | param: StringName |
| `set_shader_parameter` | `void` | param: StringName, value: Variant |

### 使用场景
使用自定义着色器的材质。用于实现StandardMaterial3D无法实现的特殊视觉效果。

### 示例代码
```gdscript
var shader_mat = ShaderMaterial.new()
shader_mat.shader = load("res://my_shader.gdshader")
shader_mat.set_shader_parameter("color", Color.RED)
$MeshInstance3D.material_override = shader_mat
```

### 官方链接
[ShaderMaterial 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_shadermaterial.html)

---

## CanvasItemMaterial

**继承链：** Material > Resource > RefCounted > Object
**描述：** A material for CanvasItem s.

> **CanvasItemMaterial** s provide a means of modifying the textures associated with a CanvasItem. They specialize in describing blend and lighting behaviors for textures. Use a ShaderMaterial to more fully customize a material's interactions with a CanvasItem.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `blend_mode` | `BlendMode` | `0` |
| `light_mode` | `LightMode` | `0` |
| `particles_anim_h_frames` | `int` | `` |
| `particles_anim_loop` | `bool` | `` |
| `particles_anim_v_frames` | `int` | `` |
| `particles_animation` | `bool` | `false` |

### 使用场景
2D节点的材质。控制混合模式、光照模式等2D渲染行为。

### 示例代码
```gdscript
var mat = CanvasItemMaterial.new()
mat.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
mat.light_mode = CanvasItemMaterial.LIGHT_MODE_UNSHADED
$Sprite2D.material = mat
```

### 官方链接
[CanvasItemMaterial 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_canvasitemmaterial.html)

---

## Mesh

**继承链：** Resource > RefCounted > Object
**描述：** A Resource that contains vertex array-based geometry.

> Mesh is a type of Resource that contains vertex array-based geometry, divided in *surfaces*. Each surface contains a completely separate array and a material used to draw it. Design wise, a mesh with multiple surfaces is preferred to a single surface, because objects created in 3D editing software commonly contain multiple materials. The maximum number of surfaces per mesh is RenderingServer.MAX_MESH_SURFACES.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `lightmap_size_hint` | `Vector2i` | `Vector2i(0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `create_convex_shape` | `ConvexPolygonShape3D` | clean: bool = true, simplify: bool = false |
| `create_outline` | `Mesh` | margin: float |
| `create_placeholder` | `Resource` |  |
| `create_trimesh_shape` | `ConcavePolygonShape3D` |  |
| `generate_triangle_mesh` | `TriangleMesh` |  |
| `get_aabb` | `AABB` |  |
| `get_faces` | `PackedVector3Array` |  |
| `get_surface_count` | `int` |  |
| `surface_get_arrays` | `Array` | surf_idx: int |
| `surface_get_blend_shape_arrays` | `Array\[Array\]` | surf_idx: int |
| `surface_get_material` | `Material` | surf_idx: int |
| `surface_set_material` | `void` | surf_idx: int, material: Material |

### 使用场景
3D网格的抽象基类。用于MeshInstance3D显示3D几何体。

### 示例代码
```gdscript
@export var mesh_resource: Mesh
$MeshInstance3D.mesh = mesh_resource
```

### 官方链接
[Mesh 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_mesh.html)

---

## ArrayMesh

**继承链：** Mesh > Resource > RefCounted > Object
**描述：** Mesh type that provides utility for constructing a surface from arrays.

> The **ArrayMesh** is used to construct a Mesh by specifying the attributes as arrays. The most basic example is the creation of a single triangle: var vertices = PackedVector3Array() vertices.push_back(Vector3(0, 1, 0)) vertices.push_back(Vector3(1, 0, 0)) vertices.push_back(Vector3(0, 0, 1)) # Initialize the ArrayMesh. var arr_mesh = ArrayMesh.new() var arrays = [] arrays.resize(Mesh.ARRAY_MAX) arrays[Mesh.ARRAY_VERTEX] = vertices # Create the Mesh. arr_mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arrays) var m = MeshInstance3D.new() m.mesh = arr_mesh var vertices = new Vector3[] { 

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `blend_shape_mode` | `BlendShapeMode` | `1` |
| `custom_aabb` | `AABB` | `AABB(0, 0, 0, 0, 0, 0)` |
| `shadow_mesh` | `ArrayMesh` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_blend_shape` | `void` | name: StringName |
| `add_surface_from_arrays` | `void` |  |
| `clear_blend_shapes` | `void` |  |
| `clear_surfaces` | `void` |  |
| `get_blend_shape_count` | `int` |  |
| `get_blend_shape_name` | `StringName` | index: int |
| `lightmap_unwrap` | `Error` | transform: Transform3D, texel_size: float |
| `regen_normal_maps` | `void` |  |
| `set_blend_shape_name` | `void` | index: int, name: StringName |
| `surface_find_by_name` | `int` | name: String |
| `surface_get_array_index_len` | `int` | surf_idx: int |
| `surface_get_array_len` | `int` | surf_idx: int |
| `bitfield` | `` |  |
| `surface_get_name` | `String` | surf_idx: int |
| `surface_get_primitive_type` | `PrimitiveType` | surf_idx: int |
| `surface_set_name` | `void` | surf_idx: int, name: String |
| `surface_update_attribute_region` | `void` | surf_idx: int, offset: int, data: PackedByteArray |
| `surface_update_skin_region` | `void` | surf_idx: int, offset: int, data: PackedByteArray |
| `surface_update_vertex_region` | `void` | surf_idx: int, offset: int, data: PackedByteArray |

### 使用场景
通过数组数据动态构建的网格。用于程序化生成3D几何体（地形、粒子等）。

### 示例代码
```gdscript
var arr_mesh = ArrayMesh.new()
var arrays = []
arrays.resize(Mesh.ARRAY_MAX)
arrays[Mesh.ARRAY_VERTEX] = PackedVector3Array([Vector3(0,0,0), Vector3(1,0,0), Vector3(0,1,0)])
arr_mesh.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arrays)
$MeshInstance3D.mesh = arr_mesh
```

### 官方链接
[ArrayMesh 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_arraymesh.html)

---

## ImmediateMesh

**继承链：** Mesh > Resource > RefCounted > Object
**描述：** Mesh optimized for creating geometry manually.

> A mesh type optimized for creating geometry manually, similar to OpenGL 1.x immediate mode. Here's a sample on how to generate a triangular face: var mesh = ImmediateMesh.new() mesh.surface_begin(Mesh.PRIMITIVE_TRIANGLES) mesh.surface_add_vertex(Vector3.LEFT) mesh.surface_add_vertex(Vector3.FORWARD) mesh.surface_add_vertex(Vector3.ZERO) mesh.surface_end() var mesh = new ImmediateMesh(); mesh.SurfaceBegin(Mesh.PrimitiveType.Triangles); mesh.SurfaceAddVertex(Vector3.Left); mesh.SurfaceAddVertex(Vector3.Forward); mesh.SurfaceAddVertex(Vector3.Zero); mesh.SurfaceEnd(); **Note:** Generating complex

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `clear_surfaces` | `void` |  |
| `surface_add_vertex` | `void` | vertex: Vector3 |
| `surface_add_vertex_2d` | `void` | vertex: Vector2 |
| `surface_begin` | `void` | primitive: PrimitiveType, material: Material = null |
| `surface_end` | `void` |  |
| `surface_set_color` | `void` | color: Color |
| `surface_set_normal` | `void` | normal: Vector3 |
| `surface_set_tangent` | `void` | tangent: Plane |
| `surface_set_uv` | `void` | uv: Vector2 |
| `surface_set_uv2` | `void` | uv2: Vector2 |

### 使用场景
即时模式网格。通过代码逐步构建几何体，适合调试绘制或简单几何体。

### 示例代码
```gdscript
var imm = ImmediateMesh.new()
imm.surface_begin(Mesh.PRIMITIVE_LINES)
imm.surface_add_vertex(Vector3(0, 0, 0))
imm.surface_add_vertex(Vector3(1, 0, 0))
imm.surface_end()
$MeshInstance3D.mesh = imm
```

### 官方链接
[ImmediateMesh 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_immediatemesh.html)

---

## Font

**继承链：** Resource > RefCounted > Object
**描述：** Abstract base class for fonts and font variations.

> Abstract base class for different font types. It has methods for drawing text and font character introspection.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `fallbacks` | `Array\[Font\]` | `[]` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `draw_char` | `float` | canvas_item: RID, pos: Vector2, char: int, font_size: int, modulate... |
| `draw_char_outline` | `float` | canvas_item: RID, pos: Vector2, char: int, font_size: int, size: in... |
| `draw_multiline_string` | `void` |  |
| `draw_multiline_string_outline` | `void` |  |
| `draw_string` | `void` |  |
| `draw_string_outline` | `void` |  |
| `find_variation` | `RID` | variation_coordinates: Dictionary, face_index: int = 0, strength: f... |
| `get_ascent` | `float` | font_size: int = 16 |
| `get_char_size` | `Vector2` | char: int, font_size: int |
| `get_descent` | `float` | font_size: int = 16 |
| `get_face_count` | `int` |  |
| `get_font_name` | `String` |  |
| `get_font_stretch` | `int` |  |
| `bitfield` | `` |  |
| `get_font_style_name` | `String` |  |
| `get_font_weight` | `int` |  |
| `get_height` | `float` | font_size: int = 16 |
| `get_multiline_string_size` | `Vector2` |  |
| `get_opentype_features` | `Dictionary` |  |
| `get_ot_name_strings` | `Dictionary` |  |
| `get_rids` | `Array\[RID\]` |  |
| `get_spacing` | `int` | spacing: SpacingType |
| `get_string_size` | `Vector2` |  |
| `get_supported_chars` | `String` |  |
| `get_supported_feature_list` | `Dictionary` |  |
| `get_supported_variation_list` | `Dictionary` |  |
| `get_underline_position` | `float` | font_size: int = 16 |
| `get_underline_thickness` | `float` | font_size: int = 16 |
| `has_char` | `bool` | char: int |
| `is_language_supported` | `bool` | language: String |
| `is_script_supported` | `bool` | script: String |
| `set_cache_capacity` | `void` | single_line: int, multi_line: int |

### 使用场景
字体资源的抽象基类。用于Label、RichTextLabel等UI控件的文字渲染。

### 示例代码
```gdscript
@export var custom_font: Font
$Label.add_theme_font_override("font", custom_font)
```

### 官方链接
[Font 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_font.html)

---

## FontFile

**继承链：** Font > Resource > RefCounted > Object
**描述：** Holds font source data and prerendered glyph cache, imported from a dynamic or a bitmap font.

> **FontFile** contains a set of glyphs to represent Unicode characters imported from a font file, as well as a cache of rasterized glyphs, and a set of fallback Font s to use. Use FontVariation to access specific OpenType variation of the font, create simulated bold / slanted version, and draw lines of text. For more complex text processing, use FontVariation in conjunction with TextLine or TextParagraph. Supported font formats: - Dynamic font importer: TrueType (.ttf), TrueType collection (.ttc), OpenType (.otf), OpenType collection (.otc), WOFF (.woff), WOFF2 (.woff2), Type 1 (.pfb, .pfm). - 

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `allow_system_fallback` | `bool` | `true` |
| `antialiasing` | `FontAntialiasing` | `1` |
| `data` | `PackedByteArray` | `PackedByteArray()` |
| `disable_embedded_bitmaps` | `bool` | `true` |
| `fixed_size` | `int` | `0` |
| `fixed_size_scale_mode` | `FixedSizeScaleMode` | `0` |
| `font_name` | `String` | `""` |
| `font_stretch` | `int` | `100` |
| `bitfield` | `` | `\[FontStyle\]` |
| `font_weight` | `int` | `400` |
| `force_autohinter` | `bool` | `false` |
| `generate_mipmaps` | `bool` | `false` |
| `hinting` | `Hinting` | `1` |
| `msdf_pixel_range` | `int` | `16` |
| `msdf_size` | `int` | `48` |
| `multichannel_signed_distance_field` | `bool` | `false` |
| `opentype_feature_overrides` | `Dictionary` | `{}` |
| `oversampling` | `float` | `0.0` |
| `style_name` | `String` | `""` |
| `subpixel_positioning` | `SubpixelPositioning` | `1` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `clear_cache` | `void` |  |
| `clear_glyphs` | `void` | cache_index: int, size: Vector2i |
| `clear_kerning_map` | `void` | cache_index: int, size: int |
| `clear_size_cache` | `void` | cache_index: int |
| `clear_textures` | `void` | cache_index: int, size: Vector2i |
| `get_cache_ascent` | `float` | cache_index: int, size: int |
| `get_cache_count` | `int` |  |
| `get_cache_descent` | `float` | cache_index: int, size: int |
| `get_cache_scale` | `float` | cache_index: int, size: int |
| `get_cache_underline_position` | `float` | cache_index: int, size: int |
| `get_cache_underline_thickness` | `float` | cache_index: int, size: int |
| `get_char_from_glyph_index` | `int` | size: int, glyph_index: int |
| `get_embolden` | `float` | cache_index: int |
| `get_extra_baseline_offset` | `float` | cache_index: int |
| `get_extra_spacing` | `int` | cache_index: int, spacing: SpacingType |
| `get_face_index` | `int` | cache_index: int |
| `get_glyph_advance` | `Vector2` | cache_index: int, size: int, glyph: int |
| `get_glyph_index` | `int` | size: int, char: int, variation_selector: int |
| `get_glyph_list` | `PackedInt32Array` | cache_index: int, size: Vector2i |
| `get_glyph_offset` | `Vector2` | cache_index: int, size: Vector2i, glyph: int |
| `get_glyph_size` | `Vector2` | cache_index: int, size: Vector2i, glyph: int |
| `get_glyph_texture_idx` | `int` | cache_index: int, size: Vector2i, glyph: int |
| `get_glyph_uv_rect` | `Rect2` | cache_index: int, size: Vector2i, glyph: int |
| `get_kerning` | `Vector2` | cache_index: int, size: int, glyph_pair: Vector2i |
| `get_kerning_list` | `Array\[Vector2i\]` | cache_index: int, size: int |
| `get_language_support_override` | `bool` | language: String |
| `get_language_support_overrides` | `PackedStringArray` |  |
| `get_script_support_override` | `bool` | script: String |
| `get_script_support_overrides` | `PackedStringArray` |  |
| `get_size_cache_list` | `Array\[Vector2i\]` | cache_index: int |
| `get_texture_count` | `int` | cache_index: int, size: Vector2i |
| `get_texture_image` | `Image` | cache_index: int, size: Vector2i, texture_index: int |
| `get_texture_offsets` | `PackedInt32Array` | cache_index: int, size: Vector2i, texture_index: int |
| `get_transform` | `Transform2D` | cache_index: int |
| `get_variation_coordinates` | `Dictionary` | cache_index: int |
| `load_bitmap_font` | `Error` | path: String |
| `load_dynamic_font` | `Error` | path: String |
| `remove_cache` | `void` | cache_index: int |
| `remove_glyph` | `void` | cache_index: int, size: Vector2i, glyph: int |
| `remove_kerning` | `void` | cache_index: int, size: int, glyph_pair: Vector2i |
| `remove_language_support_override` | `void` | language: String |
| `remove_script_support_override` | `void` | script: String |
| `remove_size_cache` | `void` | cache_index: int, size: Vector2i |
| `remove_texture` | `void` | cache_index: int, size: Vector2i, texture_index: int |
| `render_glyph` | `void` | cache_index: int, size: Vector2i, index: int |
| `render_range` | `void` | cache_index: int, size: Vector2i, start: int, end: int |
| `set_cache_ascent` | `void` | cache_index: int, size: int, ascent: float |
| `set_cache_descent` | `void` | cache_index: int, size: int, descent: float |
| `set_cache_scale` | `void` | cache_index: int, size: int, scale: float |
| `set_cache_underline_position` | `void` | cache_index: int, size: int, underline_position: float |
| `set_cache_underline_thickness` | `void` | cache_index: int, size: int, underline_thickness: float |
| `set_embolden` | `void` | cache_index: int, strength: float |
| `set_extra_baseline_offset` | `void` | cache_index: int, baseline_offset: float |
| `set_extra_spacing` | `void` | cache_index: int, spacing: SpacingType, value: int |
| `set_face_index` | `void` | cache_index: int, face_index: int |
| `set_glyph_advance` | `void` | cache_index: int, size: int, glyph: int, advance: Vector2 |
| `set_glyph_offset` | `void` | cache_index: int, size: Vector2i, glyph: int, offset: Vector2 |
| `set_glyph_size` | `void` | cache_index: int, size: Vector2i, glyph: int, gl_size: Vector2 |
| `set_glyph_texture_idx` | `void` | cache_index: int, size: Vector2i, glyph: int, texture_idx: int |
| `set_glyph_uv_rect` | `void` | cache_index: int, size: Vector2i, glyph: int, uv_rect: Rect2 |
| `set_kerning` | `void` | cache_index: int, size: int, glyph_pair: Vector2i, kerning: Vector2 |
| `set_language_support_override` | `void` | language: String, supported: bool |
| `set_script_support_override` | `void` | script: String, supported: bool |
| `set_texture_image` | `void` | cache_index: int, size: Vector2i, texture_index: int, image: Image |
| `set_texture_offsets` | `void` | cache_index: int, size: Vector2i, texture_index: int, offset: Packe... |
| `set_transform` | `void` | cache_index: int, transform: Transform2D |
| `set_variation_coordinates` | `void` | cache_index: int, variation_coordinates: Dictionary |

### 使用场景
从文件加载的字体（TTF、OTF、WOFF等）。支持可变字体和OpenType特性。

### 示例代码
```gdscript
var font = load("res://fonts/my_font.ttf") as FontFile
font.fixed_size = 16
$Label.add_theme_font_override("font", font)
```

### 官方链接
[FontFile 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_fontfile.html)

---

## SystemFont

**继承链：** Font > Resource > RefCounted > Object
**描述：** A font loaded from a system font. Falls back to a default theme font if not implemented on the host OS.

> **SystemFont** loads a font from a system font with the first matching name from font_names. It will attempt to match font style, but it's not guaranteed. The returned font might be part of a font collection or be a variable font with OpenType "weight", "width" and/or "italic" features set. You can create FontVariation of the system font for precise control over its features. **Note:** This class is implemented on iOS, Linux, macOS and Windows, on other platforms it will fallback to default theme font.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `allow_system_fallback` | `bool` | `true` |
| `antialiasing` | `FontAntialiasing` | `1` |
| `disable_embedded_bitmaps` | `bool` | `true` |
| `font_italic` | `bool` | `false` |
| `font_names` | `PackedStringArray` | `PackedStringArray()` |
| `font_stretch` | `int` | `100` |
| `font_weight` | `int` | `400` |
| `force_autohinter` | `bool` | `false` |
| `generate_mipmaps` | `bool` | `false` |
| `hinting` | `Hinting` | `1` |
| `msdf_pixel_range` | `int` | `16` |
| `msdf_size` | `int` | `48` |
| `multichannel_signed_distance_field` | `bool` | `false` |
| `oversampling` | `float` | `0.0` |
| `subpixel_positioning` | `SubpixelPositioning` | `1` |

### 使用场景
使用系统安装的字体。可设置字体名称列表，自动匹配可用字体。

### 示例代码
```gdscript
var sys_font = SystemFont.new()
sys_font.font_names = PackedStringArray(["Arial", "Noto Sans CJK SC"])
$Label.add_theme_font_override("font", sys_font)
```

### 官方链接
[SystemFont 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_systemfont.html)

---

## Theme

**继承链：** Resource > RefCounted > Object
**描述：** A resource used for styling/skinning Control s and Window s.

> A resource used for styling/skinning Control and Window nodes. While individual controls can be styled using their local theme overrides (see Control.add_theme_color_override), theme resources allow you to store and apply the same settings across all controls sharing the same type (e.g. style all Button s the same). One theme resource can be used for the entire project, but you can also set a separate theme resource to a branch of control nodes. A theme resource assigned to a control applies to the control itself, as well as all of its direct and indirect children (as long as a chain of contro

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `default_base_scale` | `float` | `0.0` |
| `default_font` | `Font` | `` |
| `default_font_size` | `int` | `-1` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_type` | `void` | theme_type: StringName |
| `clear` | `void` |  |
| `clear_color` | `void` | name: StringName, theme_type: StringName |
| `clear_constant` | `void` | name: StringName, theme_type: StringName |
| `clear_font` | `void` | name: StringName, theme_type: StringName |
| `clear_font_size` | `void` | name: StringName, theme_type: StringName |
| `clear_icon` | `void` | name: StringName, theme_type: StringName |
| `clear_stylebox` | `void` | name: StringName, theme_type: StringName |
| `clear_theme_item` | `void` | data_type: DataType, name: StringName, theme_type: StringName |
| `clear_type_variation` | `void` | theme_type: StringName |
| `get_color` | `Color` | name: StringName, theme_type: StringName |
| `get_color_list` | `PackedStringArray` | theme_type: String |
| `get_color_type_list` | `PackedStringArray` |  |
| `get_constant` | `int` | name: StringName, theme_type: StringName |
| `get_constant_list` | `PackedStringArray` | theme_type: String |
| `get_constant_type_list` | `PackedStringArray` |  |
| `get_font` | `Font` | name: StringName, theme_type: StringName |
| `get_font_list` | `PackedStringArray` | theme_type: String |
| `get_font_size` | `int` | name: StringName, theme_type: StringName |
| `get_font_size_list` | `PackedStringArray` | theme_type: String |
| `get_font_size_type_list` | `PackedStringArray` |  |
| `get_font_type_list` | `PackedStringArray` |  |
| `get_icon` | `Texture2D` | name: StringName, theme_type: StringName |
| `get_icon_list` | `PackedStringArray` | theme_type: String |
| `get_icon_type_list` | `PackedStringArray` |  |
| `get_stylebox` | `StyleBox` | name: StringName, theme_type: StringName |
| `get_stylebox_list` | `PackedStringArray` | theme_type: String |
| `get_stylebox_type_list` | `PackedStringArray` |  |
| `get_theme_item` | `Variant` | data_type: DataType, name: StringName, theme_type: StringName |
| `get_theme_item_list` | `PackedStringArray` | data_type: DataType, theme_type: String |
| `get_theme_item_type_list` | `PackedStringArray` | data_type: DataType |
| `get_type_list` | `PackedStringArray` |  |
| `get_type_variation_base` | `StringName` | theme_type: StringName |
| `get_type_variation_list` | `PackedStringArray` | base_type: StringName |
| `has_color` | `bool` | name: StringName, theme_type: StringName |
| `has_constant` | `bool` | name: StringName, theme_type: StringName |
| `has_default_base_scale` | `bool` |  |
| `has_default_font` | `bool` |  |
| `has_default_font_size` | `bool` |  |
| `has_font` | `bool` | name: StringName, theme_type: StringName |
| `has_font_size` | `bool` | name: StringName, theme_type: StringName |
| `has_icon` | `bool` | name: StringName, theme_type: StringName |
| `has_stylebox` | `bool` | name: StringName, theme_type: StringName |
| `has_theme_item` | `bool` | data_type: DataType, name: StringName, theme_type: StringName |
| `is_type_variation` | `bool` | theme_type: StringName, base_type: StringName |
| `merge_with` | `void` | other: Theme |
| `remove_type` | `void` | theme_type: StringName |
| `rename_color` | `void` | old_name: StringName, name: StringName, theme_type: StringName |
| `rename_constant` | `void` | old_name: StringName, name: StringName, theme_type: StringName |
| `rename_font` | `void` | old_name: StringName, name: StringName, theme_type: StringName |
| `rename_font_size` | `void` | old_name: StringName, name: StringName, theme_type: StringName |
| `rename_icon` | `void` | old_name: StringName, name: StringName, theme_type: StringName |
| `rename_stylebox` | `void` | old_name: StringName, name: StringName, theme_type: StringName |
| `rename_theme_item` | `void` | data_type: DataType, old_name: StringName, name: StringName, theme_... |
| `set_color` | `void` | name: StringName, theme_type: StringName, color: Color |
| `set_constant` | `void` | name: StringName, theme_type: StringName, constant: int |
| `set_font` | `void` | name: StringName, theme_type: StringName, font: Font |
| `set_font_size` | `void` | name: StringName, theme_type: StringName, font_size: int |
| `set_icon` | `void` | name: StringName, theme_type: StringName, texture: Texture2D |
| `set_stylebox` | `void` | name: StringName, theme_type: StringName, texture: StyleBox |
| `set_theme_item` | `void` | data_type: DataType, name: StringName, theme_type: StringName, valu... |
| `set_type_variation` | `void` | theme_type: StringName, base_type: StringName |

### 使用场景
UI主题资源。统一控制控件的颜色、字体、样式等外观。可作用于整个场景树。

### 示例代码
```gdscript
var theme = Theme.new()
theme.set_color("font_color", "Label", Color.WHITE)
theme.set_font("font", "Label", custom_font)
$Control.theme = theme
```

### 官方链接
[Theme 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_theme.html)

---

## StyleBox

**继承链：** Resource > RefCounted > Object
**描述：** Abstract base class for defining stylized boxes for UI elements.

> **StyleBox** is an abstract base class for drawing stylized boxes for UI elements. It is used for panels, buttons, LineEdit backgrounds, Tree backgrounds, etc. and also for testing a transparency mask for pointer signals. If mask test fails on a **StyleBox** assigned as mask to a control, clicks and motion signals will go through it to the one below. **Note:** For control nodes that have *Theme Properties*, the focus **StyleBox** is displayed over the normal, hover or pressed **StyleBox**. This makes the focus **StyleBox** more reusable across different nodes.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `content_margin_bottom` | `float` | `-1.0` |
| `content_margin_left` | `float` | `-1.0` |
| `content_margin_right` | `float` | `-1.0` |
| `content_margin_top` | `float` | `-1.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `draw` | `void` | canvas_item: RID, rect: Rect2 |
| `get_content_margin` | `float` | margin: Side |
| `get_current_item_drawn` | `CanvasItem` |  |
| `get_margin` | `float` | margin: Side |
| `get_minimum_size` | `Vector2` |  |
| `get_offset` | `Vector2` |  |
| `set_content_margin` | `void` | margin: Side, offset: float |
| `set_content_margin_all` | `void` | offset: float |
| `test_mask` | `bool` | point: Vector2, rect: Rect2 |

### 使用场景
控件样式（边框、背景等）的抽象基类。用于Panel、Button等控件的外观。

### 示例代码
```gdscript
@export var panel_style: StyleBox
$Panel.add_theme_stylebox_override("panel", panel_style)
```

### 官方链接
[StyleBox 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_stylebox.html)

---

## StyleBoxFlat

**继承链：** StyleBox > Resource > RefCounted > Object
**描述：** A customizable StyleBox that doesn't use a texture.

> By configuring various properties of this style box, you can achieve many common looks without the need of a texture. This includes optionally rounded borders, antialiasing, shadows, and skew. Setting corner radius to high values is allowed. As soon as corners overlap, the stylebox will switch to a relative system. **Example:**\ height = 30 corner_radius_top_left = 50 corner_radius_bottom_left = 100 The relative system now would take the 1:2 ratio of the two left corners to calculate the actual corner width. Both corners added will **never** be more than the height. Result: corner_radius_top_l

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `anti_aliasing` | `bool` | `true` |
| `anti_aliasing_size` | `float` | `1.0` |
| `bg_color` | `Color` | `Color(0.6, 0.6, 0.6, 1)` |
| `border_blend` | `bool` | `false` |
| `border_color` | `Color` | `Color(0.8, 0.8, 0.8, 1)` |
| `border_width_bottom` | `int` | `0` |
| `border_width_left` | `int` | `0` |
| `border_width_right` | `int` | `0` |
| `border_width_top` | `int` | `0` |
| `corner_detail` | `int` | `8` |
| `corner_radius_bottom_left` | `int` | `0` |
| `corner_radius_bottom_right` | `int` | `0` |
| `corner_radius_top_left` | `int` | `0` |
| `corner_radius_top_right` | `int` | `0` |
| `draw_center` | `bool` | `true` |
| `expand_margin_bottom` | `float` | `0.0` |
| `expand_margin_left` | `float` | `0.0` |
| `expand_margin_right` | `float` | `0.0` |
| `expand_margin_top` | `float` | `0.0` |
| `shadow_color` | `Color` | `Color(0, 0, 0, 0.6)` |
| `shadow_offset` | `Vector2` | `Vector2(0, 0)` |
| `shadow_size` | `int` | `0` |
| `skew` | `Vector2` | `Vector2(0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_border_width` | `int` | margin: Side |
| `get_border_width_min` | `int` |  |
| `get_corner_radius` | `int` | corner: Corner |
| `get_expand_margin` | `float` | margin: Side |
| `set_border_width` | `void` | margin: Side, width: int |
| `set_border_width_all` | `void` | width: int |
| `set_corner_radius` | `void` | corner: Corner, radius: int |
| `set_corner_radius_all` | `void` | radius: int |
| `set_expand_margin` | `void` | margin: Side, size: float |
| `set_expand_margin_all` | `void` | size: float |

### 使用场景
纯色填充的样式框。可设置圆角、边框、阴影等。UI设计中最常用的样式。

### 示例代码
```gdscript
var style = StyleBoxFlat.new()
style.bg_color = Color(0.1, 0.1, 0.2, 0.9)
style.set_corner_radius_all(8)
style.set_border_width_all(2)
style.border_color = Color.CYAN
$Panel.add_theme_stylebox_override("panel", style)
```

### 官方链接
[StyleBoxFlat 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_styleboxflat.html)

---

## StyleBoxTexture

**继承链：** StyleBox > Resource > RefCounted > Object
**描述：** A texture-based nine-patch StyleBox.

> A texture-based nine-patch StyleBox, in a way similar to NinePatchRect. This stylebox performs a 3×3 scaling of a texture, where only the center cell is fully stretched. This makes it possible to design bordered styles regardless of the stylebox's size.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `axis_stretch_horizontal` | `AxisStretchMode` | `0` |
| `axis_stretch_vertical` | `AxisStretchMode` | `0` |
| `draw_center` | `bool` | `true` |
| `expand_margin_bottom` | `float` | `0.0` |
| `expand_margin_left` | `float` | `0.0` |
| `expand_margin_right` | `float` | `0.0` |
| `expand_margin_top` | `float` | `0.0` |
| `modulate_color` | `Color` | `Color(1, 1, 1, 1)` |
| `region_rect` | `Rect2` | `Rect2(0, 0, 0, 0)` |
| `texture` | `Texture2D` | `` |
| `texture_margin_bottom` | `float` | `0.0` |
| `texture_margin_left` | `float` | `0.0` |
| `texture_margin_right` | `float` | `0.0` |
| `texture_margin_top` | `float` | `0.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_expand_margin` | `float` | margin: Side |
| `get_texture_margin` | `float` | margin: Side |
| `set_expand_margin` | `void` | margin: Side, size: float |
| `set_expand_margin_all` | `void` | size: float |
| `set_texture_margin` | `void` | margin: Side, size: float |
| `set_texture_margin_all` | `void` | size: float |

### 使用场景
使用纹理的样式框。支持9切片拉伸，适合自定义UI皮肤。

### 示例代码
```gdscript
var style = StyleBoxTexture.new()
style.texture = load("res://ui/panel_bg.png")
style.texture_margin_left = 16
$Panel.add_theme_stylebox_override("panel", style)
```

### 官方链接
[StyleBoxTexture 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_styleboxtexture.html)

---

## Curve

**继承链：** Resource > RefCounted > Object
**描述：** A mathematical curve.

> This resource describes a mathematical curve by defining a set of points and tangents at each point. By default, it ranges between 0 and 1 on the Y axis and positions points relative to the 0.5 Y position. See also Gradient which is designed for color interpolation. See also Curve2D and Curve3D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `bake_resolution` | `int` | `100` |
| `max_value` | `float` | `1.0` |
| `min_value` | `float` | `0.0` |
| `point_count` | `int` | `0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_point` | `int` | position: Vector2, left_tangent: float = 0, right_tangent: float = ... |
| `bake` | `void` |  |
| `clean_dupes` | `void` |  |
| `clear_points` | `void` |  |
| `get_point_left_mode` | `TangentMode` | index: int |
| `get_point_left_tangent` | `float` | index: int |
| `get_point_position` | `Vector2` | index: int |
| `get_point_right_mode` | `TangentMode` | index: int |
| `get_point_right_tangent` | `float` | index: int |
| `remove_point` | `void` | index: int |
| `sample` | `float` | offset: float |
| `sample_baked` | `float` | offset: float |
| `set_point_left_mode` | `void` | index: int, mode: TangentMode |
| `set_point_left_tangent` | `void` | index: int, tangent: float |
| `set_point_offset` | `int` | index: int, offset: float |
| `set_point_right_mode` | `void` | index: int, mode: TangentMode |
| `set_point_right_tangent` | `void` | index: int, tangent: float |
| `set_point_value` | `void` | index: int, y: float |

### 信号
- `range_changed`

### 使用场景
1D曲线资源。用于动画编辑器、粒子系统、音频效果等需要值映射的场景。

### 示例代码
```gdscript
var curve = Curve.new()
curve.add_point(Vector2(0, 0))
curve.add_point(Vector2(0.5, 1))
curve.add_point(Vector2(1, 0))
var value = curve.sample(0.3)  # 0.3处的值
```

### 官方链接
[Curve 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_curve.html)

---

## Curve2D

**继承链：** Resource > RefCounted > Object
**描述：** Describes a Bézier curve in 2D space.

> This class describes a Bézier curve in 2D space. It is mainly used to give a shape to a Path2D, but can be manually sampled for other purposes. It keeps a cache of precalculated points along the curve, to speed up further calculations.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `bake_interval` | `float` | `5.0` |
| `point_count` | `int` | `0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_point` | `void` | position: Vector2, in: Vector2 = Vector2(0, 0), out: Vector2 = Vect... |
| `clear_points` | `void` |  |
| `get_baked_length` | `float` |  |
| `get_baked_points` | `PackedVector2Array` |  |
| `get_closest_offset` | `float` | to_point: Vector2 |
| `get_closest_point` | `Vector2` | to_point: Vector2 |
| `get_point_in` | `Vector2` | idx: int |
| `get_point_out` | `Vector2` | idx: int |
| `get_point_position` | `Vector2` | idx: int |
| `remove_point` | `void` | idx: int |
| `sample` | `Vector2` | idx: int, t: float |
| `sample_baked` | `Vector2` | offset: float = 0.0, cubic: bool = false |
| `sample_baked_with_rotation` | `Transform2D` | offset: float = 0.0, cubic: bool = false |
| `samplef` | `Vector2` | fofs: float |
| `set_point_in` | `void` | idx: int, position: Vector2 |
| `set_point_out` | `void` | idx: int, position: Vector2 |
| `set_point_position` | `void` | idx: int, position: Vector2 |
| `tessellate` | `PackedVector2Array` | max_stages: int = 5, tolerance_degrees: float = 4 |
| `tessellate_even_length` | `PackedVector2Array` | max_stages: int = 5, tolerance_length: float = 20.0 |

### 使用场景
2D贝塞尔曲线路径。用于Path2D/PathFollow2D实现路径动画。

### 示例代码
```gdscript
var curve = Curve2D.new()
curve.add_point(Vector2(0, 0), Vector2(-50, -50), Vector2(50, -50))
curve.add_point(Vector2(200, 100))
$Path2D.curve = curve
```

### 官方链接
[Curve2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_curve2d.html)

---

## Curve3D

**继承链：** Resource > RefCounted > Object
**描述：** Describes a Bézier curve in 3D space.

> This class describes a Bézier curve in 3D space. It is mainly used to give a shape to a Path3D, but can be manually sampled for other purposes. It keeps a cache of precalculated points along the curve, to speed up further calculations.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `bake_interval` | `float` | `0.2` |
| `point_count` | `int` | `0` |
| `up_vector_enabled` | `bool` | `true` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_point` | `void` | position: Vector3, in: Vector3 = Vector3(0, 0, 0), out: Vector3 = V... |
| `clear_points` | `void` |  |
| `get_baked_length` | `float` |  |
| `get_baked_points` | `PackedVector3Array` |  |
| `get_baked_tilts` | `PackedFloat32Array` |  |
| `get_baked_up_vectors` | `PackedVector3Array` |  |
| `get_closest_offset` | `float` | to_point: Vector3 |
| `get_closest_point` | `Vector3` | to_point: Vector3 |
| `get_point_in` | `Vector3` | idx: int |
| `get_point_out` | `Vector3` | idx: int |
| `get_point_position` | `Vector3` | idx: int |
| `get_point_tilt` | `float` | idx: int |
| `remove_point` | `void` | idx: int |
| `sample` | `Vector3` | idx: int, t: float |
| `sample_baked` | `Vector3` | offset: float = 0.0, cubic: bool = false |
| `sample_baked_up_vector` | `Vector3` | offset: float, apply_tilt: bool = false |
| `sample_baked_with_rotation` | `Transform3D` | offset: float = 0.0, cubic: bool = false, apply_tilt: bool = false |
| `samplef` | `Vector3` | fofs: float |
| `set_point_in` | `void` | idx: int, position: Vector3 |
| `set_point_out` | `void` | idx: int, position: Vector3 |
| `set_point_position` | `void` | idx: int, position: Vector3 |
| `set_point_tilt` | `void` | idx: int, tilt: float |
| `tessellate` | `PackedVector3Array` | max_stages: int = 5, tolerance_degrees: float = 4 |
| `tessellate_even_length` | `PackedVector3Array` | max_stages: int = 5, tolerance_length: float = 0.2 |

### 使用场景
3D贝塞尔曲线路径。用于Path3D/PathFollow3D实现3D路径动画、过场相机等。

### 示例代码
```gdscript
var curve = Curve3D.new()
curve.add_point(Vector3(0, 1, 0))
curve.add_point(Vector3(5, 1, -10))
curve.add_point(Vector3(10, 2, -20))
$Path3D.curve = curve
```

### 官方链接
[Curve3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_curve3d.html)

---

## Gradient

**继承链：** Resource > RefCounted > Object
**描述：** A color transition.

> This resource describes a color transition by defining a set of colored points and how to interpolate between them. See also Curve which supports more complex easing methods, but does not support colors.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `colors` | `PackedColorArray` | `PackedColorArray(0, 0, 0, 1, 1, 1, 1, 1)` |
| `interpolation_color_space` | `ColorSpace` | `0` |
| `interpolation_mode` | `InterpolationMode` | `0` |
| `offsets` | `PackedFloat32Array` | `PackedFloat32Array(0, 1)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_point` | `void` | offset: float, color: Color |
| `get_color` | `Color` | point: int |
| `get_offset` | `float` | point: int |
| `get_point_count` | `int` |  |
| `remove_point` | `void` | point: int |
| `reverse` | `void` |  |
| `sample` | `Color` | offset: float |
| `set_color` | `void` | point: int, color: Color |
| `set_offset` | `void` | point: int, offset: float |

### 使用场景
颜色渐变资源。用于粒子系统、进度条、天空、地形着色等。

### 示例代码
```gdscript
var gradient = Gradient.new()
gradient.set_color(0, Color.BLUE)
gradient.set_color(1, Color.RED)
gradient.add_point(0.5, Color.PURPLE)
$TextureRect.texture.gradient = gradient
```

### 官方链接
[Gradient 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_gradient.html)

---

## NavigationMesh

**继承链：** Resource > RefCounted > Object
**描述：** **Experimental:** This class may be changed or removed in future versions.

> A navigation mesh is a collection of polygons that define which areas of an environment are traversable to aid agents in pathfinding through complicated spaces.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `agent_height` | `float` | `1.5` |
| `agent_max_climb` | `float` | `0.25` |
| `agent_max_slope` | `float` | `45.0` |
| `agent_radius` | `float` | `0.5` |
| `border_size` | `float` | `0.0` |
| `cell_height` | `float` | `0.25` |
| `cell_size` | `float` | `0.25` |
| `detail_sample_distance` | `float` | `6.0` |
| `detail_sample_max_error` | `float` | `1.0` |
| `edge_max_error` | `float` | `1.3` |
| `edge_max_length` | `float` | `0.0` |
| `filter_baking_aabb` | `AABB` | `AABB(0, 0, 0, 0, 0, 0)` |
| `filter_baking_aabb_offset` | `Vector3` | `Vector3(0, 0, 0)` |
| `filter_ledge_spans` | `bool` | `false` |
| `filter_low_hanging_obstacles` | `bool` | `false` |
| `filter_walkable_low_height_spans` | `bool` | `false` |
| `geometry_collision_mask` | `int` | `4294967295` |
| `geometry_parsed_geometry_type` | `ParsedGeometryType` | `0` |
| `geometry_source_geometry_mode` | `SourceGeometryMode` | `0` |
| `geometry_source_group_name` | `StringName` | `&"navigation_mesh_source_group"` |
| `region_merge_size` | `float` | `20.0` |
| `region_min_size` | `float` | `2.0` |
| `sample_partition_type` | `SamplePartitionType` | `0` |
| `vertices_per_polygon` | `float` | `6.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_polygon` | `void` | polygon: PackedInt32Array |
| `clear` | `void` |  |
| `clear_polygons` | `void` |  |
| `create_from_mesh` | `void` | mesh: Mesh |
| `get_collision_mask_value` | `bool` | layer_number: int |
| `get_polygon` | `PackedInt32Array` | idx: int |
| `get_polygon_count` | `int` |  |
| `get_vertices` | `PackedVector3Array` |  |
| `set_collision_mask_value` | `void` | layer_number: int, value: bool |
| `set_vertices` | `void` | vertices: PackedVector3Array |

### 使用场景
3D导航网格。定义AI角色可行走的区域。用于NavigationRegion3D。

### 示例代码
```gdscript
var nav_mesh = NavigationMesh.new()
nav_mesh.agent_radius = 0.5
nav_mesh.agent_height = 2.0
$NavigationRegion3D.navigation_mesh = nav_mesh
$NavigationRegion3D.bake_navigation_mesh()
```

### 官方链接
[NavigationMesh 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationmesh.html)

---

## NavigationPolygon

**继承链：** Resource > RefCounted > Object
**描述：** **Experimental:** This class may be changed or removed in future versions.

> A navigation mesh can be created either by baking it with the help of the NavigationServer2D, or by adding vertices and convex polygon indices arrays manually. To bake a navigation mesh at least one outline needs to be added that defines the outer bounds of the baked area. var new_navigation_mesh = NavigationPolygon.new() var bounding_outline = PackedVector2Array([Vector2(0, 0), Vector2(0, 50), Vector2(50, 50), Vector2(50, 0)]) new_navigation_mesh.add_outline(bounding_outline) NavigationServer2D.bake_from_source_geometry_data(new_navigation_mesh, NavigationMeshSourceGeometryData2D.new()); $Nav

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `agent_radius` | `float` | `10.0` |
| `baking_rect` | `Rect2` | `Rect2(0, 0, 0, 0)` |
| `baking_rect_offset` | `Vector2` | `Vector2(0, 0)` |
| `border_size` | `float` | `0.0` |
| `cell_size` | `float` | `1.0` |
| `parsed_collision_mask` | `int` | `4294967295` |
| `parsed_geometry_type` | `ParsedGeometryType` | `2` |
| `source_geometry_group_name` | `StringName` | `&"navigation_polygon_source_geometry_group"` |
| `source_geometry_mode` | `SourceGeometryMode` | `0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_outline` | `void` | outline: PackedVector2Array |
| `add_outline_at_index` | `void` | outline: PackedVector2Array, index: int |
| `add_polygon` | `void` | polygon: PackedInt32Array |
| `clear` | `void` |  |
| `clear_outlines` | `void` |  |
| `clear_polygons` | `void` |  |
| `get_navigation_mesh` | `NavigationMesh` |  |
| `get_outline` | `PackedVector2Array` | idx: int |
| `get_outline_count` | `int` |  |
| `get_parsed_collision_mask_value` | `bool` | layer_number: int |
| `get_polygon` | `PackedInt32Array` | idx: int |
| `get_polygon_count` | `int` |  |
| `get_vertices` | `PackedVector2Array` |  |
| `make_polygons_from_outlines` | `void` |  |
| `remove_outline` | `void` | idx: int |
| `set_outline` | `void` | idx: int, outline: PackedVector2Array |
| `set_parsed_collision_mask_value` | `void` | layer_number: int, value: bool |
| `set_vertices` | `void` | vertices: PackedVector2Array |

### 使用场景
2D导航多边形。定义2D AI角色可行走的区域。用于NavigationRegion2D。

### 示例代码
```gdscript
var nav_poly = NavigationPolygon.new()
nav_poly.agent_radius = 16.0
nav_poly.add_outline(PackedVector2Array([Vector2(0,0), Vector2(200,0), Vector2(200,200), Vector2(0,200)]))
$NavigationRegion2D.navigation_polygon = nav_poly
```

### 官方链接
[NavigationPolygon 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationpolygon.html)

---

## TileSet

**继承链：** Resource > RefCounted > Object
**描述：** Tile library for tilemaps.

> A TileSet is a library of tiles for a TileMap. A TileSet handles a list of TileSetSource, each of them storing a set of tiles. Tiles can either be from a TileSetAtlasSource, which renders tiles out of a texture with support for physics, navigation, etc., or from a TileSetScenesCollectionSource, which exposes scene-based tiles. Tiles are referenced by using three IDs: their source ID, their atlas coordinates ID, and their alternative tile ID. A TileSet can be configured so that its tiles expose more or fewer properties. To do so, the TileSet resources use property layers, which you can add or r

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `tile_layout` | `TileLayout` | `0` |
| `tile_offset_axis` | `TileOffsetAxis` | `0` |
| `tile_shape` | `TileShape` | `0` |
| `tile_size` | `Vector2i` | `Vector2i(16, 16)` |
| `uv_clipping` | `bool` | `false` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_custom_data_layer` | `void` | to_position: int = -1 |
| `add_navigation_layer` | `void` | to_position: int = -1 |
| `add_occlusion_layer` | `void` | to_position: int = -1 |
| `add_pattern` | `int` | pattern: TileMapPattern, index: int = -1 |
| `add_physics_layer` | `void` | to_position: int = -1 |
| `add_source` | `int` | source: TileSetSource, atlas_source_id_override: int = -1 |
| `add_terrain` | `void` | terrain_set: int, to_position: int = -1 |
| `add_terrain_set` | `void` | to_position: int = -1 |
| `cleanup_invalid_tile_proxies` | `void` |  |
| `clear_tile_proxies` | `void` |  |
| `get_alternative_level_tile_proxy` | `Array` | source_from: int, coords_from: Vector2i, alternative_from: int |
| `get_coords_level_tile_proxy` | `Array` | source_from: int, coords_from: Vector2i |
| `get_custom_data_layer_by_name` | `int` | layer_name: String |
| `get_custom_data_layer_name` | `String` | layer_index: int |
| `get_custom_data_layer_type` | `Variant.Type` | layer_index: int |
| `get_custom_data_layers_count` | `int` |  |
| `get_navigation_layer_layer_value` | `bool` | layer_index: int, layer_number: int |
| `get_navigation_layer_layers` | `int` | layer_index: int |
| `get_navigation_layers_count` | `int` |  |
| `get_next_source_id` | `int` |  |
| `get_occlusion_layer_light_mask` | `int` | layer_index: int |
| `get_occlusion_layer_sdf_collision` | `bool` | layer_index: int |
| `get_occlusion_layers_count` | `int` |  |
| `get_pattern` | `TileMapPattern` | index: int = -1 |
| `get_patterns_count` | `int` |  |
| `get_physics_layer_collision_layer` | `int` | layer_index: int |
| `get_physics_layer_collision_mask` | `int` | layer_index: int |
| `get_physics_layer_physics_material` | `PhysicsMaterial` | layer_index: int |
| `get_physics_layers_count` | `int` |  |
| `get_source` | `TileSetSource` | source_id: int |
| `get_source_count` | `int` |  |
| `get_source_id` | `int` | index: int |
| `get_source_level_tile_proxy` | `int` | source_from: int |
| `get_terrain_color` | `Color` | terrain_set: int, terrain_index: int |
| `get_terrain_name` | `String` | terrain_set: int, terrain_index: int |
| `get_terrain_set_mode` | `TerrainMode` | terrain_set: int |
| `get_terrain_sets_count` | `int` |  |
| `get_terrains_count` | `int` | terrain_set: int |
| `has_alternative_level_tile_proxy` | `bool` | source_from: int, coords_from: Vector2i, alternative_from: int |
| `has_coords_level_tile_proxy` | `bool` | source_from: int, coords_from: Vector2i |
| `has_source` | `bool` | source_id: int |
| `has_source_level_tile_proxy` | `bool` | source_from: int |
| `map_tile_proxy` | `Array` | source_from: int, coords_from: Vector2i, alternative_from: int |
| `move_custom_data_layer` | `void` | layer_index: int, to_position: int |
| `move_navigation_layer` | `void` | layer_index: int, to_position: int |
| `move_occlusion_layer` | `void` | layer_index: int, to_position: int |
| `move_physics_layer` | `void` | layer_index: int, to_position: int |
| `move_terrain` | `void` | terrain_set: int, terrain_index: int, to_position: int |
| `move_terrain_set` | `void` | terrain_set: int, to_position: int |
| `remove_alternative_level_tile_proxy` | `void` | source_from: int, coords_from: Vector2i, alternative_from: int |
| `remove_coords_level_tile_proxy` | `void` | source_from: int, coords_from: Vector2i |
| `remove_custom_data_layer` | `void` | layer_index: int |
| `remove_navigation_layer` | `void` | layer_index: int |
| `remove_occlusion_layer` | `void` | layer_index: int |
| `remove_pattern` | `void` | index: int |
| `remove_physics_layer` | `void` | layer_index: int |
| `remove_source` | `void` | source_id: int |
| `remove_source_level_tile_proxy` | `void` | source_from: int |
| `remove_terrain` | `void` | terrain_set: int, terrain_index: int |
| `remove_terrain_set` | `void` | terrain_set: int |
| `set_alternative_level_tile_proxy` | `void` | source_from: int, coords_from: Vector2i, alternative_from: int, sou... |
| `set_coords_level_tile_proxy` | `void` | p_source_from: int, coords_from: Vector2i, source_to: int, coords_t... |
| `set_custom_data_layer_name` | `void` | layer_index: int, layer_name: String |
| `set_custom_data_layer_type` | `void` | layer_index: int, layer_type: Variant.Type |
| `set_navigation_layer_layer_value` | `void` | layer_index: int, layer_number: int, value: bool |
| `set_navigation_layer_layers` | `void` | layer_index: int, layers: int |
| `set_occlusion_layer_light_mask` | `void` | layer_index: int, light_mask: int |
| `set_occlusion_layer_sdf_collision` | `void` | layer_index: int, sdf_collision: bool |
| `set_physics_layer_collision_layer` | `void` | layer_index: int, layer: int |
| `set_physics_layer_collision_mask` | `void` | layer_index: int, mask: int |
| `set_physics_layer_physics_material` | `void` | layer_index: int, physics_material: PhysicsMaterial |
| `set_source_id` | `void` | source_id: int, new_source_id: int |
| `set_source_level_tile_proxy` | `void` | source_from: int, source_to: int |
| `set_terrain_color` | `void` | terrain_set: int, terrain_index: int, color: Color |
| `set_terrain_name` | `void` | terrain_set: int, terrain_index: int, name: String |
| `set_terrain_set_mode` | `void` | terrain_set: int, mode: TerrainMode |

### 使用场景
瓦片集资源。定义TileMapLayer使用的瓦片规则、物理碰撞、导航等。

### 示例代码
```gdscript
var tileset = TileSet.new()
tileset.tile_size = Vector2i(16, 16)
var source = TileSetAtlasSource.new()
source.texture = load("res://tileset.png")
tileset.add_source(source)
$TileMapLayer.tile_set = tileset
```

### 官方链接
[TileSet 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_tileset.html)

---

## TileSetAtlasSource

**继承链：** TileSetSource > Resource > RefCounted > Object
**描述：** Exposes a 2D atlas texture as a set of tiles for a TileSet resource.

> An atlas is a grid of tiles laid out on a texture. Each tile in the grid must be exposed using create_tile. Those tiles are then indexed using their coordinates in the grid. Each tile can also have a size in the grid coordinates, making it more or less cells in the atlas. Alternatives version of a tile can be created using create_alternative_tile, which are then indexed using an alternative ID. The main tile (the one in the grid), is accessed with an alternative ID equal to 0. Each tile alternate has a set of properties that is defined by the source's TileSet layers. Those properties are store

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `margins` | `Vector2i` | `Vector2i(0, 0)` |
| `separation` | `Vector2i` | `Vector2i(0, 0)` |
| `texture` | `Texture2D` | `` |
| `texture_region_size` | `Vector2i` | `Vector2i(16, 16)` |
| `use_texture_padding` | `bool` | `true` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `clear_tiles_outside_texture` | `void` |  |
| `create_alternative_tile` | `int` | atlas_coords: Vector2i, alternative_id_override: int = -1 |
| `create_tile` | `void` | atlas_coords: Vector2i, size: Vector2i = Vector2i(1, 1) |
| `get_atlas_grid_size` | `Vector2i` |  |
| `get_next_alternative_tile_id` | `int` | atlas_coords: Vector2i |
| `get_runtime_texture` | `Texture2D` |  |
| `get_runtime_tile_texture_region` | `Rect2i` | atlas_coords: Vector2i, frame: int |
| `get_tile_animation_columns` | `int` | atlas_coords: Vector2i |
| `get_tile_animation_frame_duration` | `float` | atlas_coords: Vector2i, frame_index: int |
| `get_tile_animation_frames_count` | `int` | atlas_coords: Vector2i |
| `get_tile_animation_mode` | `TileAnimationMode` | atlas_coords: Vector2i |
| `get_tile_animation_separation` | `Vector2i` | atlas_coords: Vector2i |
| `get_tile_animation_speed` | `float` | atlas_coords: Vector2i |
| `get_tile_animation_total_duration` | `float` | atlas_coords: Vector2i |
| `get_tile_at_coords` | `Vector2i` | atlas_coords: Vector2i |
| `get_tile_data` | `TileData` | atlas_coords: Vector2i, alternative_tile: int |
| `get_tile_size_in_atlas` | `Vector2i` | atlas_coords: Vector2i |
| `get_tile_texture_region` | `Rect2i` | atlas_coords: Vector2i, frame: int = 0 |
| `get_tiles_to_be_removed_on_change` | `PackedVector2Array` | texture: Texture2D, margins: Vector2i, separation: Vector2i, textur... |
| `has_room_for_tile` | `bool` | atlas_coords: Vector2i, size: Vector2i, animation_columns: int, ani... |
| `has_tiles_outside_texture` | `bool` |  |
| `move_tile_in_atlas` | `void` | atlas_coords: Vector2i, new_atlas_coords: Vector2i = Vector2i(-1, -... |
| `remove_alternative_tile` | `void` | atlas_coords: Vector2i, alternative_tile: int |
| `remove_tile` | `void` | atlas_coords: Vector2i |
| `set_alternative_tile_id` | `void` | atlas_coords: Vector2i, alternative_tile: int, new_id: int |
| `set_tile_animation_columns` | `void` | atlas_coords: Vector2i, frame_columns: int |
| `set_tile_animation_frame_duration` | `void` | atlas_coords: Vector2i, frame_index: int, duration: float |
| `set_tile_animation_frames_count` | `void` | atlas_coords: Vector2i, frames_count: int |
| `set_tile_animation_mode` | `void` | atlas_coords: Vector2i, mode: TileAnimationMode |
| `set_tile_animation_separation` | `void` | atlas_coords: Vector2i, separation: Vector2i |
| `set_tile_animation_speed` | `void` | atlas_coords: Vector2i, speed: float |

### 常量
| 名称 | 值 |
|------|-----|
| `TRANSFORM_FLIP_H` | `4096` |
| `TRANSFORM_FLIP_V` | `8192` |
| `TRANSFORM_TRANSPOSE` | `16384` |

### 使用场景
图集瓦片源。将一张大图切分为多个瓦片，用于TileSet。

### 示例代码
```gdscript
var atlas = TileSetAtlasSource.new()
atlas.texture = load("res://tiles.png")
atlas.texture_region_size = Vector2i(16, 16)
atlas.create_tile(Vector2i(0, 0))
atlas.create_tile(Vector2i(1, 0))
```

### 官方链接
[TileSetAtlasSource 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_tilesetatlassource.html)

---

## SpriteFrames

**继承链：** Resource > RefCounted > Object
**描述：** Sprite frame library for AnimatedSprite2D and AnimatedSprite3D.

> Sprite frame library for an AnimatedSprite2D or AnimatedSprite3D node. Contains frames and animation data for playback.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_animation` | `void` | anim: StringName |
| `add_frame` | `void` | anim: StringName, texture: Texture2D, duration: float = 1.0, at_pos... |
| `clear` | `void` | anim: StringName |
| `clear_all` | `void` |  |
| `get_animation_loop` | `bool` | anim: StringName |
| `get_animation_names` | `PackedStringArray` |  |
| `get_animation_speed` | `float` | anim: StringName |
| `get_frame_count` | `int` | anim: StringName |
| `get_frame_duration` | `float` | anim: StringName, idx: int |
| `get_frame_texture` | `Texture2D` | anim: StringName, idx: int |
| `has_animation` | `bool` | anim: StringName |
| `remove_animation` | `void` | anim: StringName |
| `remove_frame` | `void` | anim: StringName, idx: int |
| `rename_animation` | `void` | anim: StringName, newname: StringName |
| `set_animation_loop` | `void` | anim: StringName, loop: bool |
| `set_animation_speed` | `void` | anim: StringName, fps: float |
| `set_frame` | `void` | anim: StringName, idx: int, texture: Texture2D, duration: float = 1.0 |

### 使用场景
AnimatedSprite2D的帧动画资源。定义多组动画及其帧序列。

### 示例代码
```gdscript
var frames = SpriteFrames.new()
frames.add_animation("idle")
frames.set_animation_speed("idle", 8.0)
frames.add_frame("idle", load("res://idle_0.png"))
frames.add_frame("idle", load("res://idle_1.png"))
$AnimatedSprite2D.sprite_frames = frames
```

### 官方链接
[SpriteFrames 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_spriteframes.html)

---

## Animation

**继承链：** Resource > RefCounted > Object
**描述：** Holds data that can be used to animate anything in the engine.

> This resource holds data that can be used to animate anything in the engine. Animations are divided into tracks and each track must be linked to a node. The state of that node can be changed through time, by adding timed keys (events) to the track. # This creates an animation that makes the node "Enemy" move to the right by # 100 pixels in 2.0 seconds. var animation = Animation.new() var track_index = animation.add_track(Animation.TYPE_VALUE) animation.track_set_path(track_index, "Enemy:position:x") animation.track_insert_key(track_index, 0.0, 0) animation.track_insert_key(track_index, 2.0, 10

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `capture_included` | `bool` | `false` |
| `length` | `float` | `1.0` |
| `loop_mode` | `LoopMode` | `0` |
| `step` | `float` | `0.0333333` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_track` | `int` | type: TrackType, at_position: int = -1 |
| `animation_track_get_key_animation` | `StringName` | track_idx: int, key_idx: int |
| `animation_track_insert_key` | `int` | track_idx: int, time: float, animation: StringName |
| `animation_track_set_key_animation` | `void` | track_idx: int, key_idx: int, animation: StringName |
| `audio_track_get_key_end_offset` | `float` | track_idx: int, key_idx: int |
| `audio_track_get_key_start_offset` | `float` | track_idx: int, key_idx: int |
| `audio_track_get_key_stream` | `Resource` | track_idx: int, key_idx: int |
| `audio_track_insert_key` | `int` | track_idx: int, time: float, stream: Resource, start_offset: float ... |
| `audio_track_is_use_blend` | `bool` | track_idx: int |
| `audio_track_set_key_end_offset` | `void` | track_idx: int, key_idx: int, offset: float |
| `audio_track_set_key_start_offset` | `void` | track_idx: int, key_idx: int, offset: float |
| `audio_track_set_key_stream` | `void` | track_idx: int, key_idx: int, stream: Resource |
| `audio_track_set_use_blend` | `void` | track_idx: int, enable: bool |
| `bezier_track_get_key_in_handle` | `Vector2` | track_idx: int, key_idx: int |
| `bezier_track_get_key_out_handle` | `Vector2` | track_idx: int, key_idx: int |
| `bezier_track_get_key_value` | `float` | track_idx: int, key_idx: int |
| `bezier_track_insert_key` | `int` | track_idx: int, time: float, value: float, in_handle: Vector2 = Vec... |
| `bezier_track_interpolate` | `float` | track_idx: int, time: float |
| `bezier_track_set_key_in_handle` | `void` | track_idx: int, key_idx: int, in_handle: Vector2, balanced_value_ti... |
| `bezier_track_set_key_out_handle` | `void` | track_idx: int, key_idx: int, out_handle: Vector2, balanced_value_t... |
| `bezier_track_set_key_value` | `void` | track_idx: int, key_idx: int, value: float |
| `blend_shape_track_insert_key` | `int` | track_idx: int, time: float, amount: float |
| `blend_shape_track_interpolate` | `float` | track_idx: int, time_sec: float, backward: bool = false |
| `clear` | `void` |  |
| `compress` | `void` | page_size: int = 8192, fps: int = 120, split_tolerance: float = 4.0 |
| `copy_track` | `void` | track_idx: int, to_animation: Animation |
| `find_track` | `int` | path: NodePath, type: TrackType |
| `get_track_count` | `int` |  |
| `method_track_get_name` | `StringName` | track_idx: int, key_idx: int |
| `method_track_get_params` | `Array` | track_idx: int, key_idx: int |
| `position_track_insert_key` | `int` | track_idx: int, time: float, position: Vector3 |
| `position_track_interpolate` | `Vector3` | track_idx: int, time_sec: float, backward: bool = false |
| `remove_track` | `void` | track_idx: int |
| `rotation_track_insert_key` | `int` | track_idx: int, time: float, rotation: Quaternion |
| `rotation_track_interpolate` | `Quaternion` | track_idx: int, time_sec: float, backward: bool = false |
| `scale_track_insert_key` | `int` | track_idx: int, time: float, scale: Vector3 |
| `scale_track_interpolate` | `Vector3` | track_idx: int, time_sec: float, backward: bool = false |
| `track_find_key` | `int` | track_idx: int, time: float, find_mode: FindMode = 0, limit: bool =... |
| `track_get_interpolation_loop_wrap` | `bool` | track_idx: int |
| `track_get_interpolation_type` | `InterpolationType` | track_idx: int |
| `track_get_key_count` | `int` | track_idx: int |
| `track_get_key_time` | `float` | track_idx: int, key_idx: int |
| `track_get_key_transition` | `float` | track_idx: int, key_idx: int |
| `track_get_key_value` | `Variant` | track_idx: int, key_idx: int |
| `track_get_path` | `NodePath` | track_idx: int |
| `track_get_type` | `TrackType` | track_idx: int |
| `track_insert_key` | `int` | track_idx: int, time: float, key: Variant, transition: float = 1 |
| `track_is_compressed` | `bool` | track_idx: int |
| `track_is_enabled` | `bool` | track_idx: int |
| `track_is_imported` | `bool` | track_idx: int |
| `track_move_down` | `void` | track_idx: int |
| `track_move_to` | `void` | track_idx: int, to_idx: int |
| `track_move_up` | `void` | track_idx: int |
| `track_remove_key` | `void` | track_idx: int, key_idx: int |
| `track_remove_key_at_time` | `void` | track_idx: int, time: float |
| `track_set_enabled` | `void` | track_idx: int, enabled: bool |
| `track_set_imported` | `void` | track_idx: int, imported: bool |
| `track_set_interpolation_loop_wrap` | `void` | track_idx: int, interpolation: bool |
| `track_set_interpolation_type` | `void` | track_idx: int, interpolation: InterpolationType |
| `track_set_key_time` | `void` | track_idx: int, key_idx: int, time: float |
| `track_set_key_transition` | `void` | track_idx: int, key_idx: int, transition: float |
| `track_set_key_value` | `void` | track_idx: int, key: int, value: Variant |
| `track_set_path` | `void` | track_idx: int, path: NodePath |
| `track_swap` | `void` | track_idx: int, with_idx: int |
| `value_track_get_update_mode` | `UpdateMode` | track_idx: int |
| `value_track_interpolate` | `Variant` | track_idx: int, time_sec: float, backward: bool = false |
| `value_track_set_update_mode` | `void` | track_idx: int, mode: UpdateMode |

### 使用场景
动画资源。包含关键帧数据，用于AnimationPlayer/AnimationTree驱动属性变化。

### 示例代码
```gdscript
var anim = Animation.new()
var track = anim.add_track(Animation.TYPE_VALUE)
anim.track_set_path(track, "Sprite2D:position")
anim.track_insert_key(track, 0.0, Vector2(0, 0))
anim.track_insert_key(track, 1.0, Vector2(200, 0))
anim.length = 1.0
$AnimationPlayer.add_animation_library("", anim)
```

### 官方链接
[Animation 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_animation.html)

---

## AnimationLibrary

**继承链：** Resource > RefCounted > Object
**描述：** Container for Animation resources.

> An animation library stores a set of animations accessible through StringName keys, for use with AnimationPlayer nodes.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_animation` | `Error` | name: StringName, animation: Animation |
| `get_animation` | `Animation` | name: StringName |
| `get_animation_list` | `Array\[StringName\]` |  |
| `has_animation` | `bool` | name: StringName |
| `remove_animation` | `void` | name: StringName |
| `rename_animation` | `void` | name: StringName, newname: StringName |

### 信号
- `animation_added`
- `animation_changed`
- `animation_removed`
- `animation_renamed`

### 使用场景
动画库，管理一组命名的Animation资源。AnimationPlayer可包含多个动画库。

### 示例代码
```gdscript
var lib = AnimationLibrary.new()
lib.add_animation("walk", walk_anim)
lib.add_animation("run", run_anim)
$AnimationPlayer.add_animation_library("movement", lib)
$AnimationPlayer.play("movement/walk")
```

### 官方链接
[AnimationLibrary 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_animationlibrary.html)

---

## PhysicsMaterial

**继承链：** Resource > RefCounted > Object
**描述：** Holds physics-related properties of a surface, namely its roughness and bounciness.

> Holds physics-related properties of a surface, namely its roughness and bounciness. This class is used to apply these properties to a physics body.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `absorbent` | `bool` | `false` |
| `bounce` | `float` | `0.0` |
| `friction` | `float` | `1.0` |
| `rough` | `bool` | `false` |

### 使用场景
物理材质。控制刚体的摩擦力和弹性。用于RigidBody2D/3D。

### 示例代码
```gdscript
var phys_mat = PhysicsMaterial.new()
phys_mat.friction = 0.3
phys_mat.bounce = 0.8
$RigidBody3D.physics_material_override = phys_mat
```

### 官方链接
[PhysicsMaterial 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_physicsmaterial.html)

---

## Environment

**继承链：** Resource > RefCounted > Object
**描述：** Resource for environment nodes (like WorldEnvironment) that define multiple rendering options.

> Resource for environment nodes (like WorldEnvironment) that define multiple environment operations (such as background Sky or Color, ambient light, fog, depth-of-field...). These parameters affect the final render of the scene. The order of these operations is: - Depth of Field Blur - Glow - Tonemap (Auto Exposure) - Adjustments

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `adjustment_brightness` | `float` | `1.0` |
| `adjustment_color_correction` | `Texture` | `` |
| `adjustment_contrast` | `float` | `1.0` |
| `adjustment_enabled` | `bool` | `false` |
| `adjustment_saturation` | `float` | `1.0` |
| `ambient_light_color` | `Color` | `Color(0, 0, 0, 1)` |
| `ambient_light_energy` | `float` | `1.0` |
| `ambient_light_sky_contribution` | `float` | `1.0` |
| `ambient_light_source` | `AmbientSource` | `0` |
| `background_camera_feed_id` | `int` | `1` |
| `background_canvas_max_layer` | `int` | `0` |
| `background_color` | `Color` | `Color(0, 0, 0, 1)` |
| `background_energy_multiplier` | `float` | `1.0` |
| `background_intensity` | `float` | `30000.0` |
| `background_mode` | `BGMode` | `0` |
| `fog_aerial_perspective` | `float` | `0.0` |
| `fog_density` | `float` | `0.01` |
| `fog_depth_begin` | `float` | `10.0` |
| `fog_depth_curve` | `float` | `1.0` |
| `fog_depth_end` | `float` | `100.0` |
| `fog_enabled` | `bool` | `false` |
| `fog_height` | `float` | `0.0` |
| `fog_height_density` | `float` | `0.0` |
| `fog_light_color` | `Color` | `Color(0.518, 0.553, 0.608, 1)` |
| `fog_light_energy` | `float` | `1.0` |
| `fog_mode` | `FogMode` | `0` |
| `fog_sky_affect` | `float` | `1.0` |
| `fog_sun_scatter` | `float` | `0.0` |
| `glow_blend_mode` | `GlowBlendMode` | `2` |
| `glow_bloom` | `float` | `0.0` |
| `glow_enabled` | `bool` | `false` |
| `glow_hdr_luminance_cap` | `float` | `12.0` |
| `glow_hdr_scale` | `float` | `2.0` |
| `glow_hdr_threshold` | `float` | `1.0` |
| `glow_intensity` | `float` | `0.8` |
| `glow_levels/1` | `float` | `0.0` |
| `glow_levels/2` | `float` | `0.0` |
| `glow_levels/3` | `float` | `1.0` |
| `glow_levels/4` | `float` | `0.0` |
| `glow_levels/5` | `float` | `1.0` |
| `glow_levels/6` | `float` | `0.0` |
| `glow_levels/7` | `float` | `0.0` |
| `glow_map` | `Texture` | `` |
| `glow_map_strength` | `float` | `0.8` |
| `glow_mix` | `float` | `0.05` |
| `glow_normalized` | `bool` | `false` |
| `glow_strength` | `float` | `1.0` |
| `reflected_light_source` | `ReflectionSource` | `0` |
| `sdfgi_bounce_feedback` | `float` | `0.5` |
| `sdfgi_cascade0_distance` | `float` | `12.8` |
| `sdfgi_cascades` | `int` | `4` |
| `sdfgi_enabled` | `bool` | `false` |
| `sdfgi_energy` | `float` | `1.0` |
| `sdfgi_max_distance` | `float` | `204.8` |
| `sdfgi_min_cell_size` | `float` | `0.2` |
| `sdfgi_normal_bias` | `float` | `1.1` |
| `sdfgi_probe_bias` | `float` | `1.1` |
| `sdfgi_read_sky_light` | `bool` | `true` |
| `sdfgi_use_occlusion` | `bool` | `false` |
| `sdfgi_y_scale` | `SDFGIYScale` | `1` |
| `sky` | `Sky` | `` |
| `sky_custom_fov` | `float` | `0.0` |
| `sky_rotation` | `Vector3` | `Vector3(0, 0, 0)` |
| `ssao_ao_channel_affect` | `float` | `0.0` |
| `ssao_detail` | `float` | `0.5` |
| `ssao_enabled` | `bool` | `false` |
| `ssao_horizon` | `float` | `0.06` |
| `ssao_intensity` | `float` | `2.0` |
| `ssao_light_affect` | `float` | `0.0` |
| `ssao_power` | `float` | `1.5` |
| `ssao_radius` | `float` | `1.0` |
| `ssao_sharpness` | `float` | `0.98` |
| `ssil_enabled` | `bool` | `false` |
| `ssil_intensity` | `float` | `1.0` |
| `ssil_normal_rejection` | `float` | `1.0` |
| `ssil_radius` | `float` | `5.0` |
| `ssil_sharpness` | `float` | `0.98` |
| `ssr_depth_tolerance` | `float` | `0.2` |
| `ssr_enabled` | `bool` | `false` |
| `ssr_fade_in` | `float` | `0.15` |
| `ssr_fade_out` | `float` | `2.0` |
| `ssr_max_steps` | `int` | `64` |
| `tonemap_exposure` | `float` | `1.0` |
| `tonemap_mode` | `ToneMapper` | `0` |
| `tonemap_white` | `float` | `1.0` |
| `volumetric_fog_albedo` | `Color` | `Color(1, 1, 1, 1)` |
| `volumetric_fog_ambient_inject` | `float` | `0.0` |
| `volumetric_fog_anisotropy` | `float` | `0.2` |
| `volumetric_fog_density` | `float` | `0.05` |
| `volumetric_fog_detail_spread` | `float` | `2.0` |
| `volumetric_fog_emission` | `Color` | `Color(0, 0, 0, 1)` |
| `volumetric_fog_emission_energy` | `float` | `1.0` |
| `volumetric_fog_enabled` | `bool` | `false` |
| `volumetric_fog_gi_inject` | `float` | `1.0` |
| `volumetric_fog_length` | `float` | `64.0` |
| `volumetric_fog_sky_affect` | `float` | `1.0` |
| `volumetric_fog_temporal_reprojection_amount` | `float` | `0.9` |
| `volumetric_fog_temporal_reprojection_enabled` | `bool` | `true` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_glow_level` | `float` | idx: int |
| `set_glow_level` | `void` | idx: int, intensity: float |

### 使用场景
场景环境设置。控制天空、光照、雾效、色调映射、SSAO、Glow等后处理效果。

### 示例代码
```gdscript
var env = Environment.new()
env.background_mode = Environment.BG_SKY
env.ambient_light_source = Environment.AMBIENT_SOURCE_COLOR
env.ambient_light_color = Color(0.1, 0.1, 0.2)
env.glow_enabled = true
env.tonemap_mode = Environment.TONE_MAP_ACES
$Camera3D.environment = env
```

### 官方链接
[Environment 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_environment.html)

---

## Sky

**继承链：** Resource > RefCounted > Object
**描述：** Sky 类

> The **Sky** class uses a Material to render a 3D environment's background and the light it emits by updating the reflection/radiance cubemaps.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `process_mode` | `ProcessMode` | `0` |
| `radiance_size` | `RadianceSize` | `3` |
| `sky_material` | `Material` | `` |

### 使用场景
天空资源。用于Environment的天空背景。可以使用程序化天空或全景天空。

### 示例代码
```gdscript
var sky = Sky.new()
sky.sky_material = ProceduralSkyMaterial.new()
$WorldEnvironment.environment.sky = sky
```

### 官方链接
[Sky 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_sky.html)

---

## ProceduralSkyMaterial

**继承链：** Material > Resource > RefCounted > Object
**描述：** A material that defines a simple sky for a Sky resource.

> **ProceduralSkyMaterial** provides a way to create an effective background quickly by defining procedural parameters for the sun, the sky and the ground. The sky and ground are defined by a main color, a color at the horizon, and an easing curve to interpolate between them. Suns are described by a position in the sky, a color, and a max angle from the sun at which the easing curve ends. The max angle therefore defines the size of the sun in the sky. **ProceduralSkyMaterial** supports up to 4 suns, using the color, and energy, direction, and angular distance of the first four DirectionalLight3D

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `energy_multiplier` | `float` | `1.0` |
| `ground_bottom_color` | `Color` | `Color(0.2, 0.169, 0.133, 1)` |
| `ground_curve` | `float` | `0.02` |
| `ground_energy_multiplier` | `float` | `1.0` |
| `ground_horizon_color` | `Color` | `Color(0.6463, 0.6558, 0.6708, 1)` |
| `sky_cover` | `Texture2D` | `` |
| `sky_cover_modulate` | `Color` | `Color(1, 1, 1, 1)` |
| `sky_curve` | `float` | `0.15` |
| `sky_energy_multiplier` | `float` | `1.0` |
| `sky_horizon_color` | `Color` | `Color(0.6463, 0.6558, 0.6708, 1)` |
| `sky_top_color` | `Color` | `Color(0.385, 0.454, 0.55, 1)` |
| `sun_angle_max` | `float` | `30.0` |
| `sun_curve` | `float` | `0.15` |
| `use_debanding` | `bool` | `true` |

### 使用场景
程序化天空材质。通过参数生成天空、地平线和地面的颜色渐变。

### 示例代码
```gdscript
var sky_mat = ProceduralSkyMaterial.new()
sky_mat.sky_top_color = Color(0.2, 0.4, 0.8)
sky_mat.sky_horizon_color = Color(0.6, 0.7, 0.9)
sky_mat.ground_bottom_color = Color(0.1, 0.07, 0.05)
var sky = Sky.new()
sky.sky_material = sky_mat
```

### 官方链接
[ProceduralSkyMaterial 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_proceduralskymaterial.html)

---

## LightmapGIData

**继承链：** Resource > RefCounted > Object
**描述：** Contains baked lightmap and dynamic object probe data for LightmapGI.

> **LightmapGIData** contains baked lightmap and dynamic object probe data for LightmapGI. It is replaced every time lightmaps are baked in LightmapGI.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `light_texture` | `TextureLayered` | `` |
| `lightmap_textures` | `Array\[TextureLayered\]` | `[]` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_user` | `void` | path: NodePath, uv_scale: Rect2, slice_index: int, sub_instance: int |
| `clear_users` | `void` |  |
| `get_user_count` | `int` |  |
| `get_user_path` | `NodePath` | user_idx: int |
| `is_using_spherical_harmonics` | `bool` |  |
| `set_uses_spherical_harmonics` | `void` | uses_spherical_harmonics: bool |

### 使用场景
光照贴图烘焙数据。用于LightmapGI节点存储预计算的全局光照信息。

### 示例代码
```gdscript
# 在编辑器中使用: 选择LightmapGI节点 -> Bake Lightmap
# 程序化加载:
var gi_data = load("res://lightmap_data.res") as LightmapGIData
$LightmapGI.light_data = gi_data
```

### 官方链接
[LightmapGIData 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_lightmapgidata.html)

---

## MultiMesh

**继承链：** Resource > RefCounted > Object
**描述：** Provides high-performance drawing of a mesh multiple times using GPU instancing.

> MultiMesh provides low-level mesh instancing. Drawing thousands of MeshInstance3D nodes can be slow, since each object is submitted to the GPU then drawn individually. MultiMesh is much faster as it can draw thousands of instances with a single draw call, resulting in less API overhead. As a drawback, if the instances are too far away from each other, performance may be reduced as every single instance will always render (they are spatially indexed as one, for the whole object). Since instances may have any behavior, the AABB used for visibility must be provided by the user. **Note:** A MultiM

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `buffer` | `PackedFloat32Array` | `PackedFloat32Array()` |
| `color_array` | `PackedColorArray` | `` |
| `custom_aabb` | `AABB` | `AABB(0, 0, 0, 0, 0, 0)` |
| `custom_data_array` | `PackedColorArray` | `` |
| `instance_count` | `int` | `0` |
| `mesh` | `Mesh` | `` |
| `transform_2d_array` | `PackedVector2Array` | `` |
| `transform_array` | `PackedVector3Array` | `` |
| `transform_format` | `TransformFormat` | `0` |
| `use_colors` | `bool` | `false` |
| `use_custom_data` | `bool` | `false` |
| `visible_instance_count` | `int` | `-1` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_aabb` | `AABB` |  |
| `get_instance_color` | `Color` | instance: int |
| `get_instance_custom_data` | `Color` | instance: int |
| `get_instance_transform` | `Transform3D` | instance: int |
| `get_instance_transform_2d` | `Transform2D` | instance: int |
| `set_instance_color` | `void` | instance: int, color: Color |
| `set_instance_custom_data` | `void` | instance: int, custom_data: Color |
| `set_instance_transform` | `void` | instance: int, transform: Transform3D |
| `set_instance_transform_2d` | `void` | instance: int, transform: Transform2D |

### 使用场景
实例化渲染。高效绘制大量相同网格（草地、树木、粒子等），一次Draw Call。

### 示例代码
```gdscript
var multimesh = MultiMesh.new()
multimesh.instance_count = 1000
multimesh.mesh = grass_mesh
for i in 1000:
    var t = Transform3D()
    t.origin = Vector3(randf_range(-50, 50), 0, randf_range(-50, 50))
    multimesh.set_instance_transform(i, t)
$MultiMeshInstance3D.multimesh = multimesh
```

### 官方链接
[MultiMesh 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_multimesh.html)

---

## Shortcut

**继承链：** Resource > RefCounted > Object
**描述：** A shortcut for binding input.

> Shortcuts are commonly used for interacting with a Control element from an InputEvent (also known as hotkeys). One shortcut can contain multiple InputEvent's, allowing the possibility of triggering one action with multiple different inputs.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `events` | `Array` | `[]` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_as_text` | `String` |  |
| `has_valid_event` | `bool` |  |
| `matches_event` | `bool` | event: InputEvent |

### 使用场景
快捷键资源。封装InputEvent用于Button等控件的键盘快捷键。

### 示例代码
```gdscript
var shortcut = Shortcut.new()
var event = InputEventKey.new()
event.keycode = KEY_S
event.ctrl_pressed = true
shortcut.events = [event]
$Button.shortcut = shortcut
```

### 官方链接
[Shortcut 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_shortcut.html)

---

## LabelSettings

**继承链：** Resource > RefCounted > Object
**描述：** Provides common settings to customize the text in a Label.

> **LabelSettings** is a resource that provides common settings to customize the text in a Label. It will take priority over the properties defined in Control.theme. The resource can be shared between multiple labels and changed on the fly, so it's convenient and flexible way to setup text style.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `font` | `Font` | `` |
| `font_color` | `Color` | `Color(1, 1, 1, 1)` |
| `font_size` | `int` | `16` |
| `line_spacing` | `float` | `3.0` |
| `outline_color` | `Color` | `Color(1, 1, 1, 1)` |
| `outline_size` | `int` | `0` |
| `shadow_color` | `Color` | `Color(0, 0, 0, 0)` |
| `shadow_offset` | `Vector2` | `Vector2(1, 1)` |
| `shadow_size` | `int` | `1` |

### 使用场景
Label设置资源。可复用的字体、大小、颜色、阴影、描边等Label样式配置。

### 示例代码
```gdscript
var settings = LabelSettings.new()
settings.font_size = 24
settings.font_color = Color.WHITE
settings.shadow_color = Color(0, 0, 0, 0.5)
settings.shadow_offset = Vector2(2, 2)
settings.outline_size = 2
settings.outline_color = Color.BLACK
$Label.label_settings = settings
```

### 官方链接
[LabelSettings 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_labelsettings.html)

---

# 音频/视频资源 (Audio/Video)

## AudioStream

**继承链：** Resource > RefCounted > Object
**描述：** Base class for audio streams.

> Base class for audio streams. Audio streams are used for sound effects and music playback, and support WAV (via AudioStreamWAV) and Ogg (via AudioStreamOggVorbis) file formats.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `can_be_sampled` | `bool` |  |
| `generate_sample` | `AudioSample` |  |
| `get_length` | `float` |  |
| `instantiate_playback` | `AudioStreamPlayback` |  |
| `is_meta_stream` | `bool` |  |
| `is_monophonic` | `bool` |  |

### 信号
- `parameter_list_changed`

### 使用场景
音频流的抽象基类。用于AudioStreamPlayer等节点播放声音。

### 示例代码
```gdscript
@export var sound_effect: AudioStream
$AudioStreamPlayer.stream = sound_effect
$AudioStreamPlayer.play()
```

### 官方链接
[AudioStream 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostream.html)

---

## AudioStreamMP3

**继承链：** AudioStream > Resource > RefCounted > Object
**描述：** MP3 audio stream driver.

> MP3 audio stream driver. See data if you want to load an MP3 file at run-time.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `bar_beats` | `int` | `4` |
| `beat_count` | `int` | `0` |
| `bpm` | `float` | `0.0` |
| `data` | `PackedByteArray` | `PackedByteArray()` |
| `loop` | `bool` | `false` |
| `loop_offset` | `float` | `0.0` |

### 使用场景
MP3音频流。适合背景音乐，文件体积小。

### 示例代码
```gdscript
var music = load("res://music.mp3") as AudioStreamMP3
music.loop = true
$AudioStreamPlayer.stream = music
$AudioStreamPlayer.play()
```

### 官方链接
[AudioStreamMP3 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostreammp3.html)

---

## AudioStreamOggVorbis

**继承链：** AudioStream > Resource > RefCounted > Object
**描述：** A class representing an Ogg Vorbis audio stream.

> The AudioStreamOggVorbis class is a specialized AudioStream for handling Ogg Vorbis file formats. It offers functionality for loading and playing back Ogg Vorbis files, as well as managing looping and other playback properties. This class is part of the audio stream system, which also supports WAV files through the AudioStreamWAV class.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `bar_beats` | `int` | `4` |
| `beat_count` | `int` | `0` |
| `bpm` | `float` | `0.0` |
| `loop` | `bool` | `false` |
| `loop_offset` | `float` | `0.0` |
| `packet_sequence` | `OggPacketSequence` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `load_from_buffer` | `AudioStreamOggVorbis` | buffer: PackedByteArray |
| `load_from_file` | `AudioStreamOggVorbis` | path: String |

### 使用场景
Ogg Vorbis音频流。开源格式，适合背景音乐和音效。

### 示例代码
```gdscript
var music = load("res://music.ogg") as AudioStreamOggVorbis
music.loop = true
$AudioStreamPlayer.stream = music
$AudioStreamPlayer.play()
```

### 官方链接
[AudioStreamOggVorbis 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostreamoggvorbis.html)

---

## AudioStreamWAV

**继承链：** AudioStream > Resource > RefCounted > Object
**描述：** Stores audio data loaded from WAV files.

> AudioStreamWAV stores sound samples loaded from WAV files. To play the stored sound, use an AudioStreamPlayer (for non-positional audio) or AudioStreamPlayer2D/AudioStreamPlayer3D (for positional audio). The sound can be looped. This class can also be used to store dynamically-generated PCM audio data. See also AudioStreamGenerator for procedural audio generation.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `data` | `PackedByteArray` | `PackedByteArray()` |
| `format` | `Format` | `0` |
| `loop_begin` | `int` | `0` |
| `loop_end` | `int` | `0` |
| `loop_mode` | `LoopMode` | `0` |
| `mix_rate` | `int` | `44100` |
| `stereo` | `bool` | `false` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `save_to_wav` | `Error` | path: String |

### 使用场景
WAV音频流。无损格式，适合短音效（点击、爆炸等）。支持导入时压缩。

### 示例代码
```gdscript
var sfx = load("res://click.wav") as AudioStreamWAV
$AudioStreamPlayer.stream = sfx
$AudioStreamPlayer.play()
```

### 官方链接
[AudioStreamWAV 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audiostreamwav.html)

---

## AudioEffect

**继承链：** Resource > RefCounted > Object
**描述：** Base class for audio effect resources.

> The base Resource for every audio effect. In the editor, an audio effect can be added to the current bus layout through the Audio panel. At run-time, it is also possible to manipulate audio effects through AudioServer.add_bus_effect, AudioServer.remove_bus_effect, and AudioServer.get_bus_effect. When applied on a bus, an audio effect creates a corresponding AudioEffectInstance. The instance is directly responsible for manipulating the sound, based on the original audio effect's properties.

### 使用场景
音频效果的抽象基类。用于AudioServer添加音效处理。

### 示例代码
```gdscript
var reverb = AudioEffectReverb.new()
reverb.room_size = 0.8
AudioServer.add_bus_effect(0, reverb)
```

### 官方链接
[AudioEffect 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audioeffect.html)

---

## AudioEffectReverb

**继承链：** AudioEffect > Resource > RefCounted > Object
**描述：** Adds a reverberation audio effect to an Audio bus.

> Simulates the sound of acoustic environments such as rooms, concert halls, caverns, or an open spaces.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `damping` | `float` | `0.5` |
| `dry` | `float` | `1.0` |
| `hipass` | `float` | `0.0` |
| `predelay_feedback` | `float` | `0.4` |
| `predelay_msec` | `float` | `150.0` |
| `room_size` | `float` | `0.8` |
| `spread` | `float` | `1.0` |
| `wet` | `float` | `0.5` |

### 使用场景
混响效果。模拟不同空间的声学反射。用于室内/洞穴/大厅等场景。

### 示例代码
```gdscript
var reverb = AudioEffectReverb.new()
reverb.room_size = 0.7
reverb.damping = 0.5
reverb.wet = 0.3
AudioServer.add_bus_effect(AudioServer.get_bus_index("Master"), reverb)
```

### 官方链接
[AudioEffectReverb 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audioeffectreverb.html)

---

## AudioEffectDelay

**继承链：** AudioEffect > Resource > RefCounted > Object
**描述：** Adds a delay audio effect to an audio bus. Plays input signal back after a period of time.

> Plays input signal back after a period of time. The delayed signal may be played back multiple times to create the sound of a repeating, decaying echo. Delay effects range from a subtle echo effect to a pronounced blending of previous sounds with new sounds.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `dry` | `float` | `1.0` |
| `feedback_active` | `bool` | `false` |
| `feedback_delay_ms` | `float` | `340.0` |
| `feedback_level_db` | `float` | `-6.0` |
| `feedback_lowpass` | `float` | `16000.0` |
| `tap1_active` | `bool` | `true` |
| `tap1_delay_ms` | `float` | `250.0` |
| `tap1_level_db` | `float` | `-6.0` |
| `tap1_pan` | `float` | `0.2` |
| `tap2_active` | `bool` | `true` |
| `tap2_delay_ms` | `float` | `500.0` |
| `tap2_level_db` | `float` | `-12.0` |
| `tap2_pan` | `float` | `-0.4` |

### 使用场景
延迟/回声效果。用于创建回声、合唱等空间感音效。

### 示例代码
```gdscript
var delay = AudioEffectDelay.new()
delay.tap1_active = true
delay.tap1_delay_ms = 200.0
delay.tap1_level_db = -6.0
AudioServer.add_bus_effect(bus_idx, delay)
```

### 官方链接
[AudioEffectDelay 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audioeffectdelay.html)

---

## AudioEffectCompressor

**继承链：** AudioEffect > Resource > RefCounted > Object
**描述：** Adds a compressor audio effect to an audio bus.

> Dynamic range compressor reduces the level of the sound when the amplitude goes over a certain threshold in Decibels. One of the main uses of a compressor is to increase the dynamic range by clipping as little as possible (when sound goes over 0dB). Compressor has many uses in the mix: - In the Master bus to compress the whole output (although an AudioEffectLimiter is probably better). - In voice channels to ensure they sound as balanced as possible. - Sidechained. This can reduce the sound level sidechained with another audio bus for threshold detection. This technique is common in video game

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `attack_us` | `float` | `20.0` |
| `gain` | `float` | `0.0` |
| `mix` | `float` | `1.0` |
| `ratio` | `float` | `4.0` |
| `release_ms` | `float` | `250.0` |
| `sidechain` | `StringName` | `&""` |
| `threshold` | `float` | `0.0` |

### 使用场景
压缩器效果。控制音频动态范围，防止音量过大或过小。

### 示例代码
```gdscript
var comp = AudioEffectCompressor.new()
comp.threshold = -20.0
comp.ratio = 4.0
comp.attack_us = 20.0
comp.release_ms = 250.0
AudioServer.add_bus_effect(bus_idx, comp)
```

### 官方链接
[AudioEffectCompressor 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audioeffectcompressor.html)

---

## VideoStream

**继承链：** Resource > RefCounted > Object
**描述：** Base resource for video streams.

> Base resource type for all video streams. Classes that derive from **VideoStream** can all be used as resource types to play back videos in VideoStreamPlayer.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `file` | `String` | `""` |

### 使用场景
视频流的抽象基类。用于VideoStreamPlayer播放视频。

### 示例代码
```gdscript
@export var video: VideoStream
$VideoStreamPlayer.stream = video
$VideoStreamPlayer.play()
```

### 官方链接
[VideoStream 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_videostream.html)

---

## VideoStreamTheora

**继承链：** VideoStream > Resource > RefCounted > Object
**描述：** VideoStream resource for Ogg Theora videos.

> VideoStream resource handling the `Ogg Theora <https://www.theora.org/>`__ video format with .ogv extension. The Theora codec is decoded on the CPU. **Note:** While Ogg Theora videos can also have an .ogg extension, you will have to rename the extension to .ogv to use those videos within Godot.

### 使用场景
Theora OGV视频流。Godot原生支持的视频格式。

### 示例代码
```gdscript
var video = load("res://intro.ogv") as VideoStreamTheora
$VideoStreamPlayer.stream = video
$VideoStreamPlayer.play()
```

### 官方链接
[VideoStreamTheora 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_videostreamtheora.html)

---

# 输入事件 (Input Events)

## InputEvent

**继承链：** Resource > RefCounted > Object
**描述：** Abstract base class for input events.

> Abstract base class of all types of input events. See Node._input.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `device` | `int` | `0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `accumulate` | `bool` | with_event: InputEvent |
| `as_text` | `String` |  |
| `get_action_strength` | `float` | action: StringName, exact_match: bool = false |
| `is_action` | `bool` | action: StringName, exact_match: bool = false |
| `is_action_pressed` | `bool` | action: StringName, allow_echo: bool = false, exact_match: bool = f... |
| `is_action_released` | `bool` | action: StringName, exact_match: bool = false |
| `is_action_type` | `bool` |  |
| `is_canceled` | `bool` |  |
| `is_echo` | `bool` |  |
| `is_match` | `bool` | event: InputEvent, exact_match: bool = true |
| `is_pressed` | `bool` |  |
| `is_released` | `bool` |  |
| `xformed_by` | `InputEvent` | xform: Transform2D, local_ofs: Vector2 = Vector2(0, 0) |

### 常量
| 名称 | 值 |
|------|-----|
| `DEVICE_ID_EMULATION` | `-1` |

### 使用场景
所有输入事件的抽象基类。用于_node._input()/_unhandled_input()中处理输入。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event.is_action_pressed("ui_accept"):
        accept_event()
```

### 官方链接
[InputEvent 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputevent.html)

---

## InputEventKey

**继承链：** InputEventWithModifiers > InputEventFromWindow > InputEvent > Resource > RefCounted > Object
**描述：** Represents a key on a keyboard being pressed or released.

> An input event for keys on a keyboard. Supports key presses, key releases and echo events. It can also be received in Node._unhandled_key_input. **Note:** Events received from the keyboard usually have all properties set. Event mappings should have only one of the keycode, physical_keycode or unicode set. When events are compared, properties are checked in the following priority - keycode, physical_keycode and unicode. Events with the first matching value will be considered equal.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `echo` | `bool` | `false` |
| `key_label` | `Key` | `0` |
| `keycode` | `Key` | `0` |
| `location` | `KeyLocation` | `0` |
| `physical_keycode` | `Key` | `0` |
| `pressed` | `bool` | `false` |
| `unicode` | `int` | `0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `as_text_key_label` | `String` |  |
| `as_text_keycode` | `String` |  |
| `as_text_location` | `String` |  |
| `as_text_physical_keycode` | `String` |  |
| `get_key_label_with_modifiers` | `Key` |  |
| `get_keycode_with_modifiers` | `Key` |  |
| `get_physical_keycode_with_modifiers` | `Key` |  |

### 使用场景
键盘按键事件。包含按键码、修饰键状态等。用于键盘输入处理。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventKey and event.pressed:
        match event.keycode:
            KEY_SPACE: jump()
            KEY_ESCAPE: toggle_menu()

```

### 官方链接
[InputEventKey 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventkey.html)

---

## InputEventMouseButton

**继承链：** InputEventMouse > InputEventWithModifiers > InputEventFromWindow > InputEvent > Resource > RefCounted > Object
**描述：** Represents a mouse button being pressed or released.

> Stores information about mouse click events. See Node._input. **Note:** On Wear OS devices, rotary input is mapped to @GlobalScope.MOUSE_BUTTON_WHEEL_UP and @GlobalScope.MOUSE_BUTTON_WHEEL_DOWN. This can be changed to @GlobalScope.MOUSE_BUTTON_WHEEL_LEFT and @GlobalScope.MOUSE_BUTTON_WHEEL_RIGHT with the ProjectSettings.input_devices/pointing/android/rotary_input_scroll_axis setting.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `button_index` | `MouseButton` | `0` |
| `canceled` | `bool` | `false` |
| `double_click` | `bool` | `false` |
| `factor` | `float` | `1.0` |
| `pressed` | `bool` | `false` |

### 使用场景
鼠标按钮事件。包含按钮索引、位置、双击状态等。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventMouseButton:
        if event.button_index == MOUSE_BUTTON_LEFT and event.pressed:
            shoot(event.position)
        elif event.button_index == MOUSE_BUTTON_RIGHT:
            aim(event.position)
```

### 官方链接
[InputEventMouseButton 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventmousebutton.html)

---

## InputEventMouseMotion

**继承链：** InputEventMouse > InputEventWithModifiers > InputEventFromWindow > InputEvent > Resource > RefCounted > Object
**描述：** Represents a mouse or a pen movement.

> Stores information about a mouse or a pen motion. This includes relative position, absolute position, and velocity. See Node._input. **Note:** By default, this event is only emitted once per frame rendered at most. If you need more precise input reporting, set Input.use_accumulated_input to false to make events emitted as often as possible. If you use InputEventMouseMotion to draw lines, consider implementing `Bresenham's line algorithm <https://en.wikipedia.org/wiki/Bresenham%27s_line_algorithm>`__ as well to avoid visible gaps in lines if the user is moving the mouse quickly.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `pen_inverted` | `bool` | `false` |
| `pressure` | `float` | `0.0` |
| `relative` | `Vector2` | `Vector2(0, 0)` |
| `screen_relative` | `Vector2` | `Vector2(0, 0)` |
| `screen_velocity` | `Vector2` | `Vector2(0, 0)` |
| `tilt` | `Vector2` | `Vector2(0, 0)` |
| `velocity` | `Vector2` | `Vector2(0, 0)` |

### 使用场景
鼠标移动事件。包含位置、相对移动量、速度等。用于FPS相机旋转。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventMouseMotion:
        rotate_y(-event.relative.x * sensitivity)
        $Camera3D.rotate_x(-event.relative.y * sensitivity)
```

### 官方链接
[InputEventMouseMotion 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventmousemotion.html)

---

## InputEventJoypadButton

**继承链：** InputEvent > Resource > RefCounted > Object
**描述：** Represents a gamepad button being pressed or released.

> Input event type for gamepad buttons. For gamepad analog sticks and joysticks, see InputEventJoypadMotion.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `button_index` | `JoyButton` | `0` |
| `pressed` | `bool` | `false` |
| `pressure` | `float` | `0.0` |

### 使用场景
手柄按钮事件。包含按钮索引和压力值。用于手柄输入处理。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventJoypadButton and event.pressed:
        match event.button_index:
            JOY_BUTTON_A: jump()
            JOY_BUTTON_B: attack()
```

### 官方链接
[InputEventJoypadButton 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventjoypadbutton.html)

---

## InputEventJoypadMotion

**继承链：** InputEvent > Resource > RefCounted > Object
**描述：** Represents axis motions (such as joystick or analog triggers) from a gamepad.

> Stores information about joystick motions. One **InputEventJoypadMotion** represents one axis at a time. For gamepad buttons, see InputEventJoypadButton.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `axis` | `JoyAxis` | `0` |
| `axis_value` | `float` | `0.0` |

### 使用场景
手柄摇杆/扳机事件。包含轴索引和轴值（-1到1）。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventJoypadMotion:
        if event.axis == JOY_AXIS_LEFT_X:
            move_dir.x = event.axis_value
        elif event.axis == JOY_AXIS_LEFT_Y:
            move_dir.y = event.axis_value
```

### 官方链接
[InputEventJoypadMotion 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventjoypadmotion.html)

---

## InputEventAction

**继承链：** InputEvent > Resource > RefCounted > Object
**描述：** An input event type for actions.

> Contains a generic action which can be targeted from several types of inputs. Actions and their events can be set in the **Input Map** tab in **Project > Project Settings**, or with the InputMap class. **Note:** Unlike the other InputEvent subclasses which map to unique physical events, this virtual one is not emitted by the engine. This class is useful to emit actions manually with Input.parse_input_event, which are then received in Node._input. To check if a physical event matches an action from the Input Map, use InputEvent.is_action and InputEvent.is_action_pressed.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `action` | `StringName` | `&""` |
| `event_index` | `int` | `-1` |
| `pressed` | `bool` | `false` |
| `strength` | `float` | `1.0` |

### 使用场景
动作事件。触发已定义的输入动作。用于发送程序化输入。

### 示例代码
```gdscript
var event = InputEventAction.new()
event.action = &"jump"
event.pressed = true
Input.parse_input_event(event)
```

### 官方链接
[InputEventAction 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventaction.html)

---

## InputEventScreenTouch

**继承链：** InputEventFromWindow > InputEvent > Resource > RefCounted > Object
**描述：** Represents a screen touch event.

> Stores information about multi-touch press/release input events. Supports touch press, touch release and index for multi-touch count and order.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `canceled` | `bool` | `false` |
| `double_tap` | `bool` | `false` |
| `index` | `int` | `0` |
| `position` | `Vector2` | `Vector2(0, 0)` |
| `pressed` | `bool` | `false` |

### 使用场景
触摸屏触摸事件。包含触摸索引和位置。用于移动设备输入。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventScreenTouch:
        if event.pressed:
            on_touch_start(event.position, event.index)
        else:
            on_touch_end(event.index)
```

### 官方链接
[InputEventScreenTouch 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventscreentouch.html)

---

## InputEventScreenDrag

**继承链：** InputEventFromWindow > InputEvent > Resource > RefCounted > Object
**描述：** Represents a screen drag event.

> Stores information about screen drag events. See Node._input.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `index` | `int` | `0` |
| `pen_inverted` | `bool` | `false` |
| `position` | `Vector2` | `Vector2(0, 0)` |
| `pressure` | `float` | `0.0` |
| `relative` | `Vector2` | `Vector2(0, 0)` |
| `screen_relative` | `Vector2` | `Vector2(0, 0)` |
| `screen_velocity` | `Vector2` | `Vector2(0, 0)` |
| `tilt` | `Vector2` | `Vector2(0, 0)` |
| `velocity` | `Vector2` | `Vector2(0, 0)` |

### 使用场景
触摸屏拖拽事件。包含拖拽位置、相对移动量等。用于手势识别。

### 示例代码
```gdscript
func _input(event: InputEvent):
    if event is InputEventScreenDrag:
        handle_swipe(event.relative)
        camera_pan(event.relative)
```

### 官方链接
[InputEventScreenDrag 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_inputeventscreendrag.html)

---

# 形状/碰撞资源 (Shapes)

## Shape2D

**继承链：** Resource > RefCounted > Object
**描述：** Abstract base class for 2D shapes used for physics collision.

> Abstract base class for all 2D shapes, intended for use in physics. **Performance:** Primitive shapes, especially CircleShape2D, are fast to check collisions against. ConvexPolygonShape2D is slower, and ConcavePolygonShape2D is the slowest.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `custom_solver_bias` | `float` | `0.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `collide` | `bool` | local_xform: Transform2D, with_shape: Shape2D, shape_xform: Transfo... |
| `collide_and_get_contacts` | `PackedVector2Array` | local_xform: Transform2D, with_shape: Shape2D, shape_xform: Transfo... |
| `collide_with_motion` | `bool` | local_xform: Transform2D, local_motion: Vector2, with_shape: Shape2... |
| `collide_with_motion_and_get_contacts` | `PackedVector2Array` | local_xform: Transform2D, local_motion: Vector2, with_shape: Shape2... |
| `draw` | `void` | canvas_item: RID, color: Color |
| `get_rect` | `Rect2` |  |

### 使用场景
2D碰撞形状的抽象基类。用于CollisionShape2D定义碰撞区域。

### 示例代码
```gdscript
@export var collision_shape: Shape2D
$CollisionShape2D.shape = collision_shape
```

### 官方链接
[Shape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_shape2d.html)

---

## CircleShape2D

**继承链：** Shape2D > Resource > RefCounted > Object
**描述：** A 2D circle shape used for physics collision.

> A 2D circle shape, intended for use in physics. Usually used to provide a shape for a CollisionShape2D. **Performance:** **CircleShape2D** is fast to check collisions against. It is faster than RectangleShape2D and CapsuleShape2D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `radius` | `float` | `10.0` |

### 使用场景
圆形碰撞形状。用于圆形碰撞体、射线检测范围等。

### 示例代码
```gdscript
var circle = CircleShape2D.new()
circle.radius = 32.0
$CollisionShape2D.shape = circle
```

### 官方链接
[CircleShape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_circleshape2d.html)

---

## RectangleShape2D

**继承链：** Shape2D > Resource > RefCounted > Object
**描述：** A 2D rectangle shape used for physics collision.

> A 2D rectangle shape, intended for use in physics. Usually used to provide a shape for a CollisionShape2D. **Performance:** **RectangleShape2D** is fast to check collisions against. It is faster than CapsuleShape2D, but slower than CircleShape2D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `size` | `Vector2` | `Vector2(20, 20)` |

### 使用场景
矩形碰撞形状。用于方形碰撞体、墙壁、平台等。

### 示例代码
```gdscript
var rect = RectangleShape2D.new()
rect.size = Vector2(64, 32)
$CollisionShape2D.shape = rect
```

### 官方链接
[RectangleShape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_rectangleshape2d.html)

---

## CapsuleShape2D

**继承链：** Shape2D > Resource > RefCounted > Object
**描述：** A 2D capsule shape used for physics collision.

> A 2D capsule shape, intended for use in physics. Usually used to provide a shape for a CollisionShape2D. **Performance:** **CapsuleShape2D** is fast to check collisions against, but it is slower than RectangleShape2D and CircleShape2D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `height` | `float` | `30.0` |
| `radius` | `float` | `10.0` |

### 使用场景
胶囊碰撞形状。用于角色控制器、圆角矩形碰撞。

### 示例代码
```gdscript
var capsule = CapsuleShape2D.new()
capsule.radius = 16.0
capsule.height = 48.0
$CollisionShape2D.shape = capsule
```

### 官方链接
[CapsuleShape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_capsuleshape2d.html)

---

## ConvexPolygonShape2D

**继承链：** Shape2D > Resource > RefCounted > Object
**描述：** A 2D convex polygon shape used for physics collision.

> A 2D convex polygon shape, intended for use in physics. Used internally in CollisionPolygon2D when it's in CollisionPolygon2D.BUILD_SOLIDS mode. **ConvexPolygonShape2D** is *solid*, which means it detects collisions from objects that are fully inside it, unlike ConcavePolygonShape2D which is hollow. This makes it more suitable for both detection and physics. **Convex decomposition:** A concave polygon can be split up into several convex polygons. This allows dynamic physics bodies to have complex concave collisions (at a performance cost) and can be achieved by using several **ConvexPolygonSha

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `points` | `PackedVector2Array` | `PackedVector2Array()` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `set_point_cloud` | `void` | point_cloud: PackedVector2Array |

### 使用场景
凸多边形碰撞形状。用于不规则凸形碰撞体。最多8个顶点。

### 示例代码
```gdscript
var shape = ConvexPolygonShape2D.new()
shape.points = PackedVector2Array([Vector2(0,-32), Vector2(28,16), Vector2(-28,16)])
$CollisionShape2D.shape = shape
```

### 官方链接
[ConvexPolygonShape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_convexpolygonshape2d.html)

---

## ConcavePolygonShape2D

**继承链：** Shape2D > Resource > RefCounted > Object
**描述：** A 2D polyline shape used for physics collision.

> A 2D polyline shape, intended for use in physics. Used internally in CollisionPolygon2D when it's in CollisionPolygon2D.BUILD_SEGMENTS mode. Being just a collection of interconnected line segments, **ConcavePolygonShape2D** is the most freely configurable single 2D shape. It can be used to form polygons of any nature, or even shapes that don't enclose an area. However, **ConcavePolygonShape2D** is *hollow* even if the interconnected line segments do enclose an area, which often makes it unsuitable for physics or detection. **Note:** When used for collision, **ConcavePolygonShape2D** is intende

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `segments` | `PackedVector2Array` | `PackedVector2Array()` |

### 使用场景
凹多边形碰撞形状。适合复杂地形轮廓，但性能较低。主要用于静态物体。

### 示例代码
```gdscript
var shape = ConcavePolygonShape2D.new()
shape.segments = PackedVector2Array([...])
$CollisionShape2D.shape = shape
```

### 官方链接
[ConcavePolygonShape2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_concavepolygonshape2d.html)

---

## Shape3D

**继承链：** Resource > RefCounted > Object
**描述：** Abstract base class for 3D shapes used for physics collision.

> Abstract base class for all 3D shapes, intended for use in physics. **Performance:** Primitive shapes, especially SphereShape3D, are fast to check collisions against. ConvexPolygonShape3D and HeightMapShape3D are slower, and ConcavePolygonShape3D is the slowest.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `custom_solver_bias` | `float` | `0.0` |
| `margin` | `float` | `0.04` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_debug_mesh` | `ArrayMesh` |  |

### 使用场景
3D碰撞形状的抽象基类。用于CollisionShape3D定义碰撞体积。

### 示例代码
```gdscript
@export var shape_3d: Shape3D
$CollisionShape3D.shape = shape_3d
```

### 官方链接
[Shape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_shape3d.html)

---

## BoxShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D box shape used for physics collision.

> A 3D box shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. **Performance:** **BoxShape3D** is fast to check collisions against. It is faster than CapsuleShape3D and CylinderShape3D, but slower than SphereShape3D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `size` | `Vector3` | `Vector3(1, 1, 1)` |

### 使用场景
立方体碰撞形状。用于墙壁、地板、箱子等方形碰撞体。

### 示例代码
```gdscript
var box = BoxShape3D.new()
box.size = Vector3(2, 1, 2)
$CollisionShape3D.shape = box
```

### 官方链接
[BoxShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_boxshape3d.html)

---

## SphereShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D sphere shape used for physics collision.

> A 3D sphere shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. **Performance:** **SphereShape3D** is fast to check collisions against. It is faster than BoxShape3D, CapsuleShape3D, and CylinderShape3D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `radius` | `float` | `0.5` |

### 使用场景
球体碰撞形状。用于球形碰撞体、射线检测球等。

### 示例代码
```gdscript
var sphere = SphereShape3D.new()
sphere.radius = 0.5
$CollisionShape3D.shape = sphere
```

### 官方链接
[SphereShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_sphereshape3d.html)

---

## CapsuleShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D capsule shape used for physics collision.

> A 3D capsule shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. **Performance:** **CapsuleShape3D** is fast to check collisions against. It is faster than CylinderShape3D, but slower than SphereShape3D and BoxShape3D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `height` | `float` | `2.0` |
| `radius` | `float` | `0.5` |

### 使用场景
胶囊碰撞形状。3D角色控制器的标准选择，上下半球+中间圆柱。

### 示例代码
```gdscript
var capsule = CapsuleShape3D.new()
capsule.radius = 0.35
capsule.height = 1.8
$CollisionShape3D.shape = capsule
```

### 官方链接
[CapsuleShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_capsuleshape3d.html)

---

## CylinderShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D cylinder shape used for physics collision.

> A 3D cylinder shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. **Note:** There are several known bugs with cylinder collision shapes. Using CapsuleShape3D or BoxShape3D instead is recommended. **Performance:** **CylinderShape3D** is fast to check collisions against, but it is slower than CapsuleShape3D, BoxShape3D, and SphereShape3D.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `height` | `float` | `2.0` |
| `radius` | `float` | `0.5` |

### 使用场景
圆柱碰撞形状。用于柱状物体、圆形平台等。

### 示例代码
```gdscript
var cylinder = CylinderShape3D.new()
cylinder.radius = 0.5
cylinder.height = 2.0
$CollisionShape3D.shape = cylinder
```

### 官方链接
[CylinderShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_cylindershape3d.html)

---

## ConvexPolygonShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D convex polyhedron shape used for physics collision.

> A 3D convex polyhedron shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. **ConvexPolygonShape3D** is *solid*, which means it detects collisions from objects that are fully inside it, unlike ConcavePolygonShape3D which is hollow. This makes it more suitable for both detection and physics. **Convex decomposition:** A concave polyhedron can be split up into several convex polyhedra. This allows dynamic physics bodies to have complex concave collisions (at a performance cost) and can be achieved by using several **ConvexPolygonShape3D** nodes. To generate 

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `points` | `PackedVector3Array` | `PackedVector3Array()` |

### 使用场景
凸多边形碰撞形状3D。适合不规则凸形物体。用于静态和动态碰撞。

### 示例代码
```gdscript
var shape = ConvexPolygonShape3D.new()
shape.points = PackedVector3Array([...])
$CollisionShape3D.shape = shape
```

### 官方链接
[ConvexPolygonShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_convexpolygonshape3d.html)

---

## ConcavePolygonShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D trimesh shape used for physics collision.

> A 3D trimesh shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. Being just a collection of interconnected triangles, **ConcavePolygonShape3D** is the most freely configurable single 3D shape. It can be used to form polyhedra of any nature, or even shapes that don't enclose a volume. However, **ConcavePolygonShape3D** is *hollow* even if the interconnected triangles do enclose a volume, which often makes it unsuitable for physics or detection. **Note:** When used for collision, **ConcavePolygonShape3D** is intended to work with static CollisionShape3D no

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `backface_collision` | `bool` | `false` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_faces` | `PackedVector3Array` |  |
| `set_faces` | `void` | faces: PackedVector3Array |

### 使用场景
凹多边形碰撞形状3D。适合复杂静态环境（如导入的网格地形）。

### 示例代码
```gdscript
var shape = ConcavePolygonShape3D.new()
shape.set_faces(mesh.get_faces())
$CollisionShape3D.shape = shape
```

### 官方链接
[ConcavePolygonShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_concavepolygonshape3d.html)

---

## HeightMapShape3D

**继承链：** Shape3D > Resource > RefCounted > Object
**描述：** A 3D height map shape used for physics collision.

> A 3D heightmap shape, intended for use in physics. Usually used to provide a shape for a CollisionShape3D. This is useful for terrain, but it is limited as overhangs (such as caves) cannot be stored. Holes in a **HeightMapShape3D** are created by assigning very low values to points in the desired area. **Performance:** **HeightMapShape3D** is faster to check collisions against than ConcavePolygonShape3D, but it is significantly slower than primitive shapes like BoxShape3D. A heightmap collision shape can also be build by using an Image reference: var heightmap_texture: Texture = ResourceLoader

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `map_data` | `PackedFloat32Array` | `PackedFloat32Array(0, 0, 0, 0)` |
| `map_depth` | `int` | `2` |
| `map_width` | `int` | `2` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_max_height` | `float` |  |
| `get_min_height` | `float` |  |
| `update_map_data_from_image` | `void` | image: Image, height_min: float, height_max: float |

### 使用场景
高度图碰撞形状。用于地形碰撞，基于高度图数据生成。

### 示例代码
```gdscript
var hmap = HeightMapShape3D.new()
hmap.map_width = 64
hmap.map_depth = 64
hmap.map_data = PackedFloat32Array([...])  # 高度数据
$CollisionShape3D.shape = hmap
```

### 官方链接
[HeightMapShape3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_heightmapshape3d.html)

---

# 数学/基础类型 (Math Types)

## Vector2

**继承链：** ValueType
**描述：** 2D向量，包含 x 和 y 两个浮点数分量。用于表示2D空间中的位置、方向、大小等。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `x` | `float` | `0.0` |
| `y` | `float` | `0.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `length` | `float` |  |
| `length_squared` | `float` |  |
| `normalized` | `Vector2` |  |
| `is_normalized` | `bool` |  |
| `distance_to` | `float` | to: Vector2 |
| `distance_squared_to` | `float` | to: Vector2 |
| `angle` | `float` |  |
| `angle_to` | `float` | to: Vector2 |
| `angle_to_point` | `float` | to: Vector2 |
| `direction_to` | `Vector2` | to: Vector2 |
| `dot` | `float` | with: Vector2 |
| `cross` | `float` | with: Vector2 |
| `lerp` | `Vector2` | to: Vector2, weight: float |
| `slerp` | `Vector2` | to: Vector2, weight: float |
| `rotated` | `Vector2` | angle: float |
| `round` | `Vector2` |  |
| `floor` | `Vector2` |  |
| `ceil` | `Vector2` |  |
| `abs` | `Vector2` |  |
| `sign` | `Vector2` |  |
| `clamp` | `Vector2` | min: Vector2, max: Vector2 |
| `min` | `Vector2` | with: Vector2 |
| `max` | `Vector2` | with: Vector2 |
| `posmod` | `Vector2` | mod: float |
| `posmodv` | `Vector2` | modv: Vector2 |
| `slide` | `Vector2` | n: Vector2 |
| `bounce` | `Vector2` | n: Vector2 |
| `reflect` | `Vector2` | n: Vector2 |
| `is_equal_approx` | `bool` | to: Vector2 |
| `is_zero_approx` | `bool` |  |
| `is_finite` | `bool` |  |

### 常量
| 名称 | 值 |
|------|-----|
| `ZERO` | `Vector2(0, 0)` |
| `ONE` | `Vector2(1, 1)` |
| `INF` | `Vector2(inf, inf)` |
| `LEFT` | `Vector2(-1, 0)` |
| `RIGHT` | `Vector2(1, 0)` |
| `UP` | `Vector2(0, -1)` |
| `DOWN` | `Vector2(0, 1)` |

### 使用场景
用于2D游戏中的位置、方向、速度、缩放等。几乎所有2D逻辑都离不开Vector2。

### 示例代码
```gdscript
var position := Vector2(100, 200)
var direction := Vector2.RIGHT
var velocity := direction * 300.0
position += velocity * delta
```

### 官方链接
[Vector2 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_vector2.html)

---

## Vector3

**继承链：** ValueType
**描述：** 3D向量，包含 x、y、z 三个浮点数分量。用于表示3D空间中的位置、方向、大小等。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `x` | `float` | `0.0` |
| `y` | `float` | `0.0` |
| `z` | `float` | `0.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `length` | `float` |  |
| `length_squared` | `float` |  |
| `normalized` | `Vector3` |  |
| `is_normalized` | `bool` |  |
| `distance_to` | `float` | to: Vector3 |
| `distance_squared_to` | `float` | to: Vector3 |
| `angle_to` | `float` | to: Vector3 |
| `direction_to` | `Vector3` | to: Vector3 |
| `dot` | `float` | with: Vector3 |
| `cross` | `Vector3` | with: Vector3 |
| `lerp` | `Vector3` | to: Vector3, weight: float |
| `slerp` | `Vector3` | to: Vector3, weight: float |
| `rotated` | `Vector3` | axis: Vector3, angle: float |
| `round` | `Vector3` |  |
| `floor` | `Vector3` |  |
| `ceil` | `Vector3` |  |
| `abs` | `Vector3` |  |
| `sign` | `Vector3` |  |
| `clamp` | `Vector3` | min: Vector3, max: Vector3 |
| `min` | `Vector3` | with: Vector3 |
| `max` | `Vector3` | with: Vector3 |
| `slide` | `Vector3` | n: Vector3 |
| `bounce` | `Vector3` | n: Vector3 |
| `reflect` | `Vector3` | n: Vector3 |
| `inverse` | `Vector3` |  |
| `is_equal_approx` | `bool` | to: Vector3 |
| `is_zero_approx` | `bool` |  |
| `is_finite` | `bool` |  |

### 常量
| 名称 | 值 |
|------|-----|
| `ZERO` | `Vector3(0, 0, 0)` |
| `ONE` | `Vector3(1, 1, 1)` |
| `INF` | `Vector3(inf, inf, inf)` |
| `LEFT` | `Vector3(-1, 0, 0)` |
| `RIGHT` | `Vector3(1, 0, 0)` |
| `UP` | `Vector3(0, 1, 0)` |
| `DOWN` | `Vector3(0, -1, 0)` |
| `FORWARD` | `Vector3(0, 0, -1)` |
| `BACK` | `Vector3(0, 0, 1)` |
| `MODEL_LEFT` | `Vector3(1, 0, 0)` |
| `MODEL_RIGHT` | `Vector3(-1, 0, 0)` |
| `MODEL_TOP` | `Vector3(0, 1, 0)` |
| `MODEL_BOTTOM` | `Vector3(0, -1, 0)` |
| `MODEL_FRONT` | `Vector3(0, 0, 1)` |
| `MODEL_REAR` | `Vector3(0, 0, -1)` |

### 使用场景
用于3D游戏中的位置、方向、速度、缩放等。几乎所有3D逻辑都离不开Vector3。

### 示例代码
```gdscript
var position := Vector3(0, 1, 0)
var direction := Vector3.FORWARD
var velocity := direction * 5.0
position += velocity * delta
```

### 官方链接
[Vector3 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_vector3.html)

---

## Color

**继承链：** ValueType
**描述：** RGBA颜色值，每个分量为0.0到1.0之间的浮点数。支持多种颜色空间。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `r` | `float` | `0.0` |
| `g` | `float` | `0.0` |
| `b` | `float` | `0.0` |
| `a` | `float` | `1.0` |
| `h` | `float` | `0.0` |
| `s` | `float` | `0.0` |
| `v` | `float` | `0.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `lerp` | `Color` | to: Color, weight: float |
| `lightened` | `Color` | amount: float |
| `darkened` | `Color` | amount: float |
| `inverted` | `Color` |  |
| `blend` | `Color` | over: Color |
| `get_luminance` | `float` |  |
| `srgb_to_linear` | `Color` |  |
| `linear_to_srgb` | `Color` |  |
| `is_equal_approx` | `bool` | to: Color |
| `hex` | `Color` | hex: int |
| `html` | `Color` | rgba: String |
| `from_hsv` | `Color` | h: float, s: float, v: float, alpha: float = 1.0 |
| `from_ok_hsl` | `Color` | h: float, s: float, l: float, alpha: float = 1.0 |
| `to_html` | `String` | with_alpha: bool = true |

### 常量
| 名称 | 值 |
|------|-----|
| `ALICE_BLUE` | `Color(0.94, 0.97, 1, 1)` |
| `WHITE` | `Color(1, 1, 1, 1)` |
| `BLACK` | `Color(0, 0, 0, 1)` |
| `RED` | `Color(1, 0, 0, 1)` |
| `GREEN` | `Color(0, 1, 0, 1)` |
| `BLUE` | `Color(0, 0, 1, 1)` |
| `YELLOW` | `Color(1, 1, 0, 1)` |
| `CYAN` | `Color(0, 1, 1, 1)` |
| `MAGENTA` | `Color(1, 0, 1, 1)` |
| `TRANSPARENT` | `Color(0, 0, 0, 0)` |

### 使用场景
用于设置精灵、UI元素、光照、材质等的颜色。支持HEX、HSV、线性/sRGB等多种颜色空间。

### 示例代码
```gdscript
var red := Color.RED
var custom := Color(0.2, 0.8, 0.4, 1.0)
var from_hex := Color.hex(0xFF6600)
var lerped := red.lerp(custom, 0.5)
modulate = lerped
```

### 官方链接
[Color 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_color.html)

---

## Transform2D

**继承链：** ValueType
**描述：** 2D变换矩阵（3x2矩阵），包含旋转、缩放和平移信息。用于2D空间中的变换操作。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `x` | `Vector2` | `Vector2(1, 0)` |
| `y` | `Vector2` | `Vector2(0, 1)` |
| `origin` | `Vector2` | `Vector2(0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `inverse` | `Transform2D` |  |
| `affine_inverse` | `Transform2D` |  |
| `rotated` | `Transform2D` | angle: float |
| `rotated_local` | `Transform2D` | angle: float |
| `scaled` | `Transform2D` | scale: Vector2 |
| `scaled_local` | `Transform2D` | scale: Vector2 |
| `translated` | `Transform2D` | offset: Vector2 |
| `translated_local` | `Transform2D` | offset: Vector2 |
| `basis_xform` | `Vector2` | v: Vector2 |
| `basis_xform_inv` | `Vector2` | v: Vector2 |
| `interpolate_with` | `Transform2D` | xform: Transform2D, weight: float |
| `is_equal_approx` | `bool` | xform: Transform2D |
| `is_finite` | `bool` |  |
| `get_rotation` | `float` |  |
| `get_scale` | `Vector2` |  |
| `get_origin` | `Vector2` |  |
| `get_skew` | `float` |  |
| `looking_at` | `Transform2D` | target: Vector2 |

### 常量
| 名称 | 值 |
|------|-----|
| `IDENTITY` | `Transform2D(1, 0, 0, 1, 0, 0)` |
| `FLIP_X` | `Transform2D(-1, 0, 0, 1, 0, 0)` |
| `FLIP_Y` | `Transform2D(1, 0, 0, -1, 0, 0)` |

### 使用场景
Node2D的transform属性类型。用于组合旋转、缩放、平移变换，或变换点和向量。

### 示例代码
```gdscript
var t := Transform2D()
t = t.rotated(deg_to_rad(45))
t = t.scaled(Vector2(2, 2))
t = t.translated(Vector2(100, 0))
var pos := t * local_point
```

### 官方链接
[Transform2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_transform2d.html)

---

## Transform3D

**继承链：** ValueType
**描述：** 3D变换，包含一个 Basis（旋转/缩放）和一个 Vector3（平移/原点）。用于3D空间中的变换操作。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `basis` | `Basis` | `Basis()` |
| `origin` | `Vector3` | `Vector3(0, 0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `inverse` | `Transform3D` |  |
| `affine_inverse` | `Transform3D` |  |
| `rotated` | `Transform3D` | axis: Vector3, angle: float |
| `rotated_local` | `Transform3D` | axis: Vector3, angle: float |
| `scaled` | `Transform3D` | scale: Vector3 |
| `scaled_local` | `Transform3D` | scale: Vector3 |
| `translated` | `Transform3D` | offset: Vector3 |
| `translated_local` | `Transform3D` | offset: Vector3 |
| `looking_at` | `Transform3D` | target: Vector3, up: Vector3 = Vector3(0,1,0), use_model_front: bool = false |
| `interpolate_with` | `Transform3D` | xform: Transform3D, weight: float |
| `is_equal_approx` | `bool` | xform: Transform3D |
| `is_finite` | `bool` |  |

### 常量
| 名称 | 值 |
|------|-----|
| `IDENTITY` | `Transform3D(Basis(), Vector3())` |
| `FLIP_X` | `Transform3D(Basis(-1,0,0,0,1,0,0,0,1), Vector3())` |
| `FLIP_Y` | `Transform3D(Basis(1,0,0,0,-1,0,0,0,1), Vector3())` |
| `FLIP_Z` | `Transform3D(Basis(1,0,0,0,1,0,0,0,-1), Vector3())` |

### 使用场景
Node3D的global_transform属性类型。用于在3D空间中定位、旋转、缩放对象。

### 示例代码
```gdscript
var t := global_transform
t = t.rotated(Vector3.UP, deg_to_rad(90))
t = t.translated(Vector3(0, 0, -5))
global_transform = t
```

### 官方链接
[Transform3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_transform3d.html)

---

## Basis

**继承链：** ValueType
**描述：** 3x3矩阵，用于表示旋转和缩放。是Transform3D的一部分。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `x` | `Vector3` | `Vector3(1, 0, 0)` |
| `y` | `Vector3` | `Vector3(0, 1, 0)` |
| `z` | `Vector3` | `Vector3(0, 0, 1)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `inverse` | `Basis` |  |
| `transposed` | `Basis` |  |
| `orthonormalized` | `Basis` |  |
| `rotated` | `Basis` | axis: Vector3, angle: float |
| `scaled` | `Basis` | scale: Vector3 |
| `get_scale` | `Vector3` |  |
| `get_euler` | `Vector3` | order: int = 2 |
| `get_rotation_quaternion` | `Quaternion` |  |
| `slerp` | `Basis` | to: Basis, weight: float |
| `is_equal_approx` | `bool` | b: Basis |
| `is_finite` | `bool` |  |
| `looking_at` | `Basis` | target: Vector3, up: Vector3 = Vector3(0,1,0), use_model_front: bool = false |
| `from_euler` | `Basis` | euler: Vector3, order: int = 2 |

### 常量
| 名称 | 值 |
|------|-----|
| `IDENTITY` | `Basis(1,0,0,0,1,0,0,0,1)` |
| `FLIP_X` | `Basis(-1,0,0,0,1,0,0,0,1)` |
| `FLIP_Y` | `Basis(1,0,0,0,-1,0,0,0,1)` |
| `FLIP_Z` | `Basis(1,0,0,0,1,0,0,0,-1)` |

### 使用场景
表示3D旋转和缩放。用于构造旋转、获取欧拉角、四元数转换等。

### 示例代码
```gdscript
var basis := Basis(Vector3.UP, deg_to_rad(90))
var euler := basis.get_euler()
var scale := basis.get_scale()
rotation = euler
```

### 官方链接
[Basis 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_basis.html)

---

## Quaternion

**继承链：** ValueType
**描述：** 四元数，用于表示3D旋转。避免万向节锁问题，支持平滑插值。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `x` | `float` | `0.0` |
| `y` | `float` | `0.0` |
| `z` | `float` | `0.0` |
| `w` | `float` | `1.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `normalized` | `Quaternion` |  |
| `is_normalized` | `bool` |  |
| `inverse` | `Quaternion` |  |
| `log` | `Quaternion` |  |
| `exp` | `Quaternion` |  |
| `angle_to` | `float` | to: Quaternion |
| `dot` | `float` | with: Quaternion |
| `slerp` | `Quaternion` | to: Quaternion, weight: float |
| `slerpni` | `Quaternion` | to: Quaternion, weight: float |
| `cubic_slerp` | `Quaternion` | b: Quaternion, pre_a: Quaternion, post_b: Quaternion, weight: float |
| `get_euler` | `Vector3` | order: int = 2 |
| `length` | `float` |  |
| `length_squared` | `float` |  |
| `is_equal_approx` | `bool` | to: Quaternion |
| `is_finite` | `bool` |  |
| `from_euler` | `Quaternion` | euler: Vector3 |

### 常量
| 名称 | 值 |
|------|-----|
| `IDENTITY` | `Quaternion(0, 0, 0, 1)` |
| `ZERO` | `Quaternion(0, 0, 0, 0)` |

### 使用场景
用于平滑的3D旋转插值（slerp），避免万向节锁。常用于动画和物理。

### 示例代码
```gdscript
var q1 := Quaternion(Vector3.UP, 0.0)
var q2 := Quaternion(Vector3.UP, PI / 2)
var interpolated := q1.slerp(q2, 0.5)
rotation = interpolated.get_euler()
```

### 官方链接
[Quaternion 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_quaternion.html)

---

## Rect2

**继承链：** ValueType
**描述：** 2D矩形，由位置（position）和大小（size）定义。用于碰撞检测、UI布局等。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `position` | `Vector2` | `Vector2(0, 0)` |
| `size` | `Vector2` | `Vector2(0, 0)` |
| `end` | `Vector2` | `Vector2(0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `abs` | `Rect2` |  |
| `has_point` | `bool` | point: Vector2 |
| `has_area` | `bool` |  |
| `intersects` | `bool` | b: Rect2, include_borders: bool = false |
| `encloses` | `bool` | b: Rect2 |
| `intersection` | `Rect2` | b: Rect2 |
| `merge` | `Rect2` | b: Rect2 |
| `expand` | `Rect2` | to: Vector2 |
| `grow` | `Rect2` | amount: float |
| `grow_side` | `Rect2` | side: Side, amount: float |
| `grow_individual` | `Rect2` | left: float, top: float, right: float, bottom: float |
| `get_support` | `Vector2` | direction: Vector2 |
| `get_center` | `Vector2` |  |
| `is_equal_approx` | `bool` | rect: Rect2 |

### 使用场景
用于2D区域检测、绘制矩形、UI边界计算等。

### 示例代码
```gdscript
var rect := Rect2(10, 10, 100, 50)
if rect.has_point(mouse_pos):
    print("鼠标在矩形内")
var expanded := rect.grow(10)
draw_rect(rect, Color.RED)
```

### 官方链接
[Rect2 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_rect2.html)

---

## Rect2i

**继承链：** ValueType
**描述：** 使用整数的2D矩形。与Rect2类似但使用int分量，适用于像素级精确操作。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `position` | `Vector2i` | `Vector2i(0, 0)` |
| `size` | `Vector2i` | `Vector2i(0, 0)` |
| `end` | `Vector2i` | `Vector2i(0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `abs` | `Rect2i` |  |
| `has_point` | `bool` | point: Vector2i |
| `has_area` | `bool` |  |
| `intersects` | `bool` | b: Rect2i |
| `encloses` | `bool` | b: Rect2i |
| `intersection` | `Rect2i` | b: Rect2i |
| `merge` | `Rect2i` | b: Rect2i |
| `expand` | `Rect2i` | to: Vector2i |
| `grow` | `Rect2i` | amount: int |
| `grow_side` | `Rect2i` | side: Side, amount: int |
| `grow_individual` | `Rect2i` | left: int, top: int, right: int, bottom: int |
| `get_support` | `Vector2i` | direction: Vector2i |
| `get_center` | `Vector2i` |  |

### 使用场景
用于整数像素坐标场景，如SubViewport尺寸、纹理区域等。

### 示例代码
```gdscript
var rect := Rect2i(0, 0, 1920, 1080)
if rect.has_point(Vector2i(mouse_x, mouse_y)):
    print("在区域内")
```

### 官方链接
[Rect2i 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_rect2i.html)

---

## AABB

**继承链：** ValueType
**描述：** 3D轴对齐包围盒（Axis-Aligned Bounding Box），由位置和大小定义。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `position` | `Vector3` | `Vector3(0, 0, 0)` |
| `size` | `Vector3` | `Vector3(0, 0, 0)` |
| `end` | `Vector3` | `Vector3(0, 0, 0)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `abs` | `AABB` |  |
| `has_point` | `bool` | point: Vector3 |
| `has_area` | `bool` |  |
| `has_surface` | `bool` |  |
| `intersects` | `bool` | with: AABB |
| `encloses` | `bool` | with: AABB |
| `intersection` | `AABB` | with: AABB |
| `merge` | `AABB` | with: AABB |
| `expand` | `AABB` | to: Vector3 |
| `grow` | `AABB` | by: float |
| `get_support` | `Vector3` | direction: Vector3 |
| `get_longest_axis` | `Vector3` |  |
| `get_longest_axis_index` | `int` |  |
| `get_longest_axis_size` | `float` |  |
| `get_shortest_axis` | `Vector3` |  |
| `get_shortest_axis_index` | `int` |  |
| `get_shortest_axis_size` | `float` |  |
| `get_endpoint` | `Vector3` | index: int |
| `get_center` | `Vector3` |  |
| `intersects_plane` | `bool` | plane: Plane |
| `intersects_segment` | `Variant` | from: Vector3, to: Vector3 |
| `intersects_ray` | `Variant` | from: Vector3, dir: Vector3 |

### 使用场景
用于3D碰撞检测、可见性判断、空间分区等。MeshInstance3D的aabb属性即为此类型。

### 示例代码
```gdscript
var aabb := mesh_instance.aabb
if aabb.has_point(global_position):
    print("点在包围盒内")
var expanded := aabb.grow(2.0)
```

### 官方链接
[AABB 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_aabb.html)

---

## Plane

**继承链：** ValueType
**描述：** 3D平面，由法线向量和到原点的距离定义。方程为: normal.x * x + normal.y * y + normal.z * z = d。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `normal` | `Vector3` | `Vector3(0, 1, 0)` |
| `d` | `float` | `0.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `normalized` | `Plane` |  |
| `get_center` | `Vector3` |  |
| `is_equal_approx` | `bool` | to_plane: Plane |
| `is_finite` | `bool` |  |
| `is_point_over` | `bool` | point: Vector3 |
| `distance_to` | `float` | point: Vector3 |
| `has_point` | `bool` | point: Vector3, tolerance: float |
| `intersect_3` | `Variant` | b: Plane, c: Plane |
| `intersects_ray` | `Variant` | from: Vector3, dir: Vector3 |
| `intersects_segment` | `Variant` | from: Vector3, to: Vector3 |
| `project` | `Vector3` | point: Vector3 |

### 常量
| 名称 | 值 |
|------|-----|
| `PLANE_YZ` | `Plane(1, 0, 0, 0)` |
| `PLANE_XZ` | `Plane(0, 1, 0, 0)` |
| `PLANE_XY` | `Plane(0, 0, 1, 0)` |

### 使用场景
用于射线检测、平面碰撞、反射计算等3D几何操作。

### 示例代码
```gdscript
var ground_plane := Plane(Vector3.UP, 0)
if ground_plane.is_point_over(player_pos):
    print("玩家在地面上方")
var projected := ground_plane.project(some_point)
```

### 官方链接
[Plane 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_plane.html)

---

## Projection

**继承链：** ValueType
**描述：** 4x4投影矩阵，用于相机投影。主要用于设置Camera3D的投影参数。

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `x` | `Vector4` | `Vector4(1,0,0,0)` |
| `y` | `Vector4` | `Vector4(0,1,0,0)` |
| `z` | `Vector4` | `Vector4(0,0,1,0)` |
| `w` | `Vector4` | `Vector4(0,0,0,1)` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `perspective` | `Projection` | fovy: float, aspect: float, z_near: float, z_far: float |
| `orthogonal` | `Projection` | left: float, right: float, bottom: float, top: float, z_near: float, z_far: float |
| `frustum` | `Projection` | left: float, right: float, bottom: float, top: float, z_near: float, z_far: float |
| `fov_to_focal_length` | `float` | fov: float, length: float |
| `focal_length_to_fov` | `float` | focal_length: float, length: float |
| `get_z_near` | `float` |  |
| `get_z_far` | `float` |  |
| `get_aspect` | `float` |  |
| `get_fov` | `float` |  |
| `is_orthogonal` | `bool` |  |
| `inverse` | `Projection` |  |
| `get_projection_planes` | `Array` | transform: Transform3D |

### 常量
| 名称 | 值 |
|------|-----|
| `PLANE_NEAR` | `0` |
| `PLANE_FAR` | `1` |
| `PLANE_LEFT` | `2` |
| `PLANE_TOP` | `3` |
| `PLANE_RIGHT` | `4` |
| `PLANE_BOTTOM` | `5` |

### 使用场景
用于自定义相机投影矩阵、实现特殊渲染效果。

### 示例代码
```gdscript
var proj := Projection.perspective(
    70.0,  # FOV
    viewport_size.x / viewport_size.y,  # 宽高比
    0.05,  # 近裁剪面
    1000.0  # 远裁剪面
)
```

### 官方链接
[Projection 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_projection.html)

---

## StringName

**继承链：** ValueType
**描述：** 不可变字符串标识符，内部使用哈希表存储以实现快速比较。常用于节点路径和信号名。

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `length` | `int` |  |
| `substr` | `String` | from: int, len: int = -1 |
| `to_lower` | `String` |  |
| `to_upper` | `String` |  |
| `begins_with` | `bool` | text: String |
| `ends_with` | `bool` | text: String |
| `contains` | `bool` | what: String |
| `find` | `int` | what: String, from: int = 0 |
| `hash` | `int` |  |

### 使用场景
用于需要频繁字符串比较的场景，如节点查找、信号连接、输入动作名等。比普通String比较更快。

### 示例代码
```gdscript
var action := &"jump"  # StringName字面量
var signal_name := &"body_entered"
if Input.is_action_just_pressed(action):
    jump()
```

### 官方链接
[StringName 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_stringname.html)

---

## NodePath

**继承链：** ValueType
**描述：** 预先解析的场景树路径或属性路径。用于高效地获取节点或节点属性的引用。

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `is_absolute` | `bool` |  |
| `get_name_count` | `int` |  |
| `get_name` | `StringName` | index: int |
| `get_subname_count` | `int` |  |
| `get_subname` | `StringName` | index: int |
| `get_concatenated_names` | `StringName` |  |
| `get_concatenated_subnames` | `StringName` |  |
| `slice` | `NodePath` | begin: int, end: int = 2147483647 |
| `get_as_property_path` | `NodePath` |  |
| `is_empty` | `bool` |  |

### 使用场景
@export导出节点路径、get_node()的参数、动画轨道引用等。

### 示例代码
```gdscript
@export var target_path: NodePath
@onready var target := get_node(target_path)
# 或使用NodePath字面量
var path := ^"../Player/Sprite2D"
var node := get_node(path)
```

### 官方链接
[NodePath 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_nodepath.html)

---

## RID

**继承链：** ValueType
**描述：** 资源ID（Resource ID），用于引用服务器端（RenderingServer、PhysicsServer等）创建的资源。是轻量级的句柄。

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `is_valid` | `bool` |  |
| `get_id` | `int` |  |

### 使用场景
直接操作RenderingServer、PhysicsServer等底层API时使用。普通游戏开发中很少直接接触。

### 示例代码
```gdscript
var rid := RenderingServer.canvas_item_create()
RenderingServer.canvas_item_add_circle(rid, Vector2.ZERO, 50.0, Color.RED)
# 用完后释放
RenderingServer.free_rid(rid)
```

### 官方链接
[RID 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_rid.html)

---

# 全局单例 (Singletons)

## Input

**继承链：** Object
**描述：** A singleton for handling inputs.

> The **Input** singleton handles key presses, mouse buttons and movement, gamepads, and input actions. Actions and their events can be set in the **Input Map** tab in **Project > Project Settings**, or with the InputMap class. **Note:** **Input**'s methods reflect the global input state and are not affected by Control.accept_event or Viewport.set_input_as_handled, as those methods only deal with the way input is propagated in the SceneTree.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `emulate_mouse_from_touch` | `bool` | `` |
| `emulate_touch_from_mouse` | `bool` | `` |
| `mouse_mode` | `MouseMode` | `` |
| `use_accumulated_input` | `bool` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `action_press` | `void` | action: StringName, strength: float = 1.0 |
| `action_release` | `void` | action: StringName |
| `add_joy_mapping` | `void` | mapping: String, update_existing: bool = false |
| `flush_buffered_events` | `void` |  |
| `get_accelerometer` | `Vector3` |  |
| `get_action_raw_strength` | `float` | action: StringName, exact_match: bool = false |
| `get_action_strength` | `float` | action: StringName, exact_match: bool = false |
| `get_axis` | `float` | negative_action: StringName, positive_action: StringName |
| `get_connected_joypads` | `Array\[int\]` |  |
| `get_current_cursor_shape` | `CursorShape` |  |
| `get_gravity` | `Vector3` |  |
| `get_gyroscope` | `Vector3` |  |
| `get_joy_axis` | `float` | device: int, axis: JoyAxis |
| `get_joy_guid` | `String` | device: int |
| `get_joy_info` | `Dictionary` | device: int |
| `get_joy_name` | `String` | device: int |
| `get_joy_vibration_duration` | `float` | device: int |
| `get_joy_vibration_strength` | `Vector2` | device: int |
| `get_last_mouse_screen_velocity` | `Vector2` |  |
| `get_last_mouse_velocity` | `Vector2` |  |
| `get_magnetometer` | `Vector3` |  |
| `bitfield` | `` |  |
| `get_vector` | `Vector2` | negative_x: StringName, positive_x: StringName, negative_y: StringN... |
| `is_action_just_pressed` | `bool` | action: StringName, exact_match: bool = false |
| `is_action_just_released` | `bool` | action: StringName, exact_match: bool = false |
| `is_action_pressed` | `bool` | action: StringName, exact_match: bool = false |
| `is_anything_pressed` | `bool` |  |
| `is_joy_button_pressed` | `bool` | device: int, button: JoyButton |
| `is_joy_known` | `bool` | device: int |
| `is_key_label_pressed` | `bool` | keycode: Key |
| `is_key_pressed` | `bool` | keycode: Key |
| `is_mouse_button_pressed` | `bool` | button: MouseButton |
| `is_physical_key_pressed` | `bool` | keycode: Key |
| `parse_input_event` | `void` | event: InputEvent |
| `remove_joy_mapping` | `void` | guid: String |
| `set_accelerometer` | `void` | value: Vector3 |
| `set_custom_mouse_cursor` | `void` | image: Resource, shape: CursorShape = 0, hotspot: Vector2 = Vector2... |
| `set_default_cursor_shape` | `void` | shape: CursorShape = 0 |
| `set_gravity` | `void` | value: Vector3 |
| `set_gyroscope` | `void` | value: Vector3 |
| `set_magnetometer` | `void` | value: Vector3 |
| `should_ignore_device` | `bool` | vendor_id: int, product_id: int |
| `start_joy_vibration` | `void` | device: int, weak_magnitude: float, strong_magnitude: float, durati... |
| `stop_joy_vibration` | `void` | device: int |
| `vibrate_handheld` | `void` | duration_ms: int = 500, amplitude: float = -1.0 |
| `warp_mouse` | `void` | position: Vector2 |

### 信号
- `joy_connection_changed`

### 使用场景
输入管理单例。检测按键/手柄/触摸的实时状态，管理输入动作映射。

### 示例代码
```gdscript
func _process(delta):
    var dir = Input.get_vector("move_left", "move_right", "move_up", "move_down")
    velocity = dir * speed
    if Input.is_action_just_pressed("jump"):
        jump()
```

### 官方链接
[Input 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_input.html)

---

## OS

**继承链：** Object
**描述：** OS 类

> The **OS** class wraps the most common functionalities for communicating with the host operating system, such as the video driver, delays, environment variables, execution of binaries, command line, etc. **Note:** In Godot 4, **OS** functions related to window management, clipboard, and TTS were moved to the DisplayServer singleton (and the Window class). Functions related to time were removed and are only available in the Time class.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `delta_smoothing` | `bool` | `true` |
| `low_processor_usage_mode` | `bool` | `false` |
| `low_processor_usage_mode_sleep_usec` | `int` | `6900` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `alert` | `void` | text: String, title: String = "Alert!" |
| `close_midi_inputs` | `void` |  |
| `crash` | `void` | message: String |
| `create_instance` | `int` | arguments: PackedStringArray |
| `create_process` | `int` | path: String, arguments: PackedStringArray, open_console: bool = false |
| `delay_msec` | `void` | msec: int |
| `delay_usec` | `void` | usec: int |
| `execute` | `int` | path: String, arguments: PackedStringArray, output: Array = [], rea... |
| `execute_with_pipe` | `Dictionary` | path: String, arguments: PackedStringArray |
| `find_keycode_from_string` | `Key` | string: String |
| `get_cache_dir` | `String` |  |
| `get_cmdline_args` | `PackedStringArray` |  |
| `get_cmdline_user_args` | `PackedStringArray` |  |
| `get_config_dir` | `String` |  |
| `get_connected_midi_inputs` | `PackedStringArray` |  |
| `get_data_dir` | `String` |  |
| `get_distribution_name` | `String` |  |
| `get_entropy` | `PackedByteArray` | size: int |
| `get_environment` | `String` | variable: String |
| `get_executable_path` | `String` |  |
| `get_granted_permissions` | `PackedStringArray` |  |
| `get_keycode_string` | `String` | code: Key |
| `get_locale` | `String` |  |
| `get_locale_language` | `String` |  |
| `get_main_thread_id` | `int` |  |
| `get_memory_info` | `Dictionary` |  |
| `get_model_name` | `String` |  |
| `get_name` | `String` |  |
| `get_process_exit_code` | `int` | pid: int |
| `get_process_id` | `int` |  |
| `get_processor_count` | `int` |  |
| `get_processor_name` | `String` |  |
| `get_restart_on_exit_arguments` | `PackedStringArray` |  |
| `get_static_memory_peak_usage` | `int` |  |
| `get_static_memory_usage` | `int` |  |
| `get_system_ca_certificates` | `String` |  |
| `get_system_dir` | `String` | dir: SystemDir, shared_storage: bool = true |
| `get_system_font_path` | `String` | font_name: String, weight: int = 400, stretch: int = 100, italic: b... |
| `get_system_font_path_for_text` | `PackedStringArray` | font_name: String, text: String, locale: String = "", script: Strin... |
| `get_system_fonts` | `PackedStringArray` |  |
| `get_thread_caller_id` | `int` |  |
| `get_unique_id` | `String` |  |
| `get_user_data_dir` | `String` |  |
| `get_version` | `String` |  |
| `get_video_adapter_driver_info` | `PackedStringArray` |  |
| `has_environment` | `bool` | variable: String |
| `has_feature` | `bool` | tag_name: String |
| `is_debug_build` | `bool` |  |
| `is_keycode_unicode` | `bool` | code: int |
| `is_process_running` | `bool` | pid: int |
| `is_restart_on_exit_set` | `bool` |  |
| `is_sandboxed` | `bool` |  |
| `is_stdout_verbose` | `bool` |  |
| `is_userfs_persistent` | `bool` |  |
| `kill` | `Error` | pid: int |
| `move_to_trash` | `Error` | path: String |
| `open_midi_inputs` | `void` |  |
| `read_string_from_stdin` | `String` |  |
| `request_permission` | `bool` | name: String |
| `request_permissions` | `bool` |  |
| `revoke_granted_permissions` | `void` |  |
| `set_environment` | `void` | variable: String, value: String |
| `set_restart_on_exit` | `void` | restart: bool, arguments: PackedStringArray = PackedStringArray() |
| `set_thread_name` | `Error` | name: String |
| `set_use_file_access_save_and_swap` | `void` | enabled: bool |
| `shell_open` | `Error` | uri: String |
| `shell_show_in_file_manager` | `Error` | file_or_dir_path: String, open_folder: bool = true |
| `unset_environment` | `void` | variable: String |

### 使用场景
操作系统接口。获取系统信息、环境变量、时间戳、剪贴板等。

### 示例代码
```gdscript
var platform = OS.get_name()
var data_dir = OS.get_user_data_dir()
OS.shell_open("https://godotengine.org")
OS.alert("错误发生了！", "错误")
```

### 官方链接
[OS 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_os.html)

---

## Time

**继承链：** Object
**描述：** A singleton for working with time data.

> The Time singleton allows converting time between various formats and also getting time information from the system. This class conforms with as many of the ISO 8601 standards as possible. All dates follow the Proleptic Gregorian calendar. As such, the day before 1582-10-15 is 1582-10-14, not 1582-10-04. The year before 1 AD (aka 1 BC) is number 0, with the year before that (2 BC) being -1, etc. Conversion methods assume "the same timezone", and do not handle timezone conversions or DST automatically. Leap seconds are also not handled, they must be done manually if desired. Suffixes such as "Z

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_date_dict_from_system` | `Dictionary` | utc: bool = false |
| `get_date_dict_from_unix_time` | `Dictionary` | unix_time_val: int |
| `get_date_string_from_system` | `String` | utc: bool = false |
| `get_date_string_from_unix_time` | `String` | unix_time_val: int |
| `get_datetime_dict_from_datetime_string` | `Dictionary` | datetime: String, weekday: bool |
| `get_datetime_dict_from_system` | `Dictionary` | utc: bool = false |
| `get_datetime_dict_from_unix_time` | `Dictionary` | unix_time_val: int |
| `get_datetime_string_from_datetime_dict` | `String` | datetime: Dictionary, use_space: bool |
| `get_datetime_string_from_system` | `String` | utc: bool = false, use_space: bool = false |
| `get_datetime_string_from_unix_time` | `String` | unix_time_val: int, use_space: bool = false |
| `get_offset_string_from_offset_minutes` | `String` | offset_minutes: int |
| `get_ticks_msec` | `int` |  |
| `get_ticks_usec` | `int` |  |
| `get_time_dict_from_system` | `Dictionary` | utc: bool = false |
| `get_time_dict_from_unix_time` | `Dictionary` | unix_time_val: int |
| `get_time_string_from_system` | `String` | utc: bool = false |
| `get_time_string_from_unix_time` | `String` | unix_time_val: int |
| `get_time_zone_from_system` | `Dictionary` |  |
| `get_unix_time_from_datetime_dict` | `int` | datetime: Dictionary |
| `get_unix_time_from_datetime_string` | `int` | datetime: String |
| `get_unix_time_from_system` | `float` |  |

### 使用场景
时间工具。获取系统时间、日期，以及Unix时间戳转换。

### 示例代码
```gdscript
var now = Time.get_datetime_dict_from_system()
var unix = Time.get_unix_time_from_datetime_dict(now)
var formatted = Time.get_datetime_string_from_system()
print("当前时间: ", formatted)
```

### 官方链接
[Time 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_time.html)

---

## DisplayServer

**继承链：** Object
**描述：** A server interface for low-level window management.

> **DisplayServer** handles everything related to window management. It is separated from OS as a single operating system may support multiple display servers. **Headless mode:** Starting the engine with the --headless :doc:`command line argument <../tutorials/editor/command_line_tutorial>` disables all rendering and window management functions. Most functions from **DisplayServer** will return dummy values in this case.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `clipboard_get` | `String` |  |
| `clipboard_get_image` | `Image` |  |
| `clipboard_get_primary` | `String` |  |
| `clipboard_has` | `bool` |  |
| `clipboard_has_image` | `bool` |  |
| `clipboard_set` | `void` | clipboard: String |
| `clipboard_set_primary` | `void` | clipboard_primary: String |
| `create_status_indicator` | `int` | icon: Texture2D, tooltip: String, callback: Callable |
| `cursor_get_shape` | `CursorShape` |  |
| `cursor_set_custom_image` | `void` | cursor: Resource, shape: CursorShape = 0, hotspot: Vector2 = Vector... |
| `cursor_set_shape` | `void` | shape: CursorShape |
| `delete_status_indicator` | `void` | id: int |
| `dialog_input_text` | `Error` | title: String, description: String, existing_text: String, callback... |
| `dialog_show` | `Error` | title: String, description: String, buttons: PackedStringArray, cal... |
| `enable_for_stealing_focus` | `void` | process_id: int |
| `file_dialog_show` | `Error` | title: String, current_directory: String, filename: String, show_hi... |
| `file_dialog_with_options_show` | `Error` | title: String, current_directory: String, root: String, filename: S... |
| `force_process_and_drop_events` | `void` |  |
| `get_accent_color` | `Color` |  |
| `get_base_color` | `Color` |  |
| `get_display_cutouts` | `Array\[Rect2\]` |  |
| `get_display_safe_area` | `Rect2i` |  |
| `get_keyboard_focus_screen` | `int` |  |
| `get_name` | `String` |  |
| `get_primary_screen` | `int` |  |
| `get_screen_count` | `int` |  |
| `get_screen_from_rect` | `int` | rect: Rect2 |
| `get_swap_cancel_ok` | `bool` |  |
| `get_window_at_screen_position` | `int` | position: Vector2i |
| `get_window_list` | `PackedInt32Array` |  |
| `global_menu_add_check_item` | `int` | menu_root: String, label: String, callback: Callable = Callable(), ... |
| `global_menu_add_icon_check_item` | `int` | menu_root: String, icon: Texture2D, label: String, callback: Callab... |
| `global_menu_add_icon_item` | `int` | menu_root: String, icon: Texture2D, label: String, callback: Callab... |
| `global_menu_add_icon_radio_check_item` | `int` | menu_root: String, icon: Texture2D, label: String, callback: Callab... |
| `global_menu_add_item` | `int` | menu_root: String, label: String, callback: Callable = Callable(), ... |
| `global_menu_add_multistate_item` | `int` | menu_root: String, label: String, max_states: int, default_state: i... |
| `global_menu_add_radio_check_item` | `int` | menu_root: String, label: String, callback: Callable = Callable(), ... |
| `global_menu_add_separator` | `int` | menu_root: String, index: int = -1 |
| `global_menu_add_submenu_item` | `int` | menu_root: String, label: String, submenu: String, index: int = -1 |
| `global_menu_clear` | `void` | menu_root: String |
| `global_menu_get_item_accelerator` | `Key` | menu_root: String, idx: int |
| `global_menu_get_item_callback` | `Callable` | menu_root: String, idx: int |
| `global_menu_get_item_count` | `int` | menu_root: String |
| `global_menu_get_item_icon` | `Texture2D` | menu_root: String, idx: int |
| `global_menu_get_item_indentation_level` | `int` | menu_root: String, idx: int |
| `global_menu_get_item_index_from_tag` | `int` | menu_root: String, tag: Variant |
| `global_menu_get_item_index_from_text` | `int` | menu_root: String, text: String |
| `global_menu_get_item_key_callback` | `Callable` | menu_root: String, idx: int |
| `global_menu_get_item_max_states` | `int` | menu_root: String, idx: int |
| `global_menu_get_item_state` | `int` | menu_root: String, idx: int |
| `global_menu_get_item_submenu` | `String` | menu_root: String, idx: int |
| `global_menu_get_item_tag` | `Variant` | menu_root: String, idx: int |
| `global_menu_get_item_text` | `String` | menu_root: String, idx: int |
| `global_menu_get_item_tooltip` | `String` | menu_root: String, idx: int |
| `global_menu_get_system_menu_roots` | `Dictionary` |  |
| `global_menu_is_item_checkable` | `bool` | menu_root: String, idx: int |
| `global_menu_is_item_checked` | `bool` | menu_root: String, idx: int |
| `global_menu_is_item_disabled` | `bool` | menu_root: String, idx: int |
| `global_menu_is_item_hidden` | `bool` | menu_root: String, idx: int |
| `global_menu_is_item_radio_checkable` | `bool` | menu_root: String, idx: int |
| `global_menu_remove_item` | `void` | menu_root: String, idx: int |
| `global_menu_set_item_accelerator` | `void` | menu_root: String, idx: int, keycode: Key |
| `global_menu_set_item_callback` | `void` | menu_root: String, idx: int, callback: Callable |
| `global_menu_set_item_checkable` | `void` | menu_root: String, idx: int, checkable: bool |
| `global_menu_set_item_checked` | `void` | menu_root: String, idx: int, checked: bool |
| `global_menu_set_item_disabled` | `void` | menu_root: String, idx: int, disabled: bool |
| `global_menu_set_item_hidden` | `void` | menu_root: String, idx: int, hidden: bool |
| `global_menu_set_item_hover_callbacks` | `void` | menu_root: String, idx: int, callback: Callable |
| `global_menu_set_item_icon` | `void` | menu_root: String, idx: int, icon: Texture2D |
| `global_menu_set_item_indentation_level` | `void` | menu_root: String, idx: int, level: int |
| `global_menu_set_item_key_callback` | `void` | menu_root: String, idx: int, key_callback: Callable |
| `global_menu_set_item_max_states` | `void` | menu_root: String, idx: int, max_states: int |
| `global_menu_set_item_radio_checkable` | `void` | menu_root: String, idx: int, checkable: bool |
| `global_menu_set_item_state` | `void` | menu_root: String, idx: int, state: int |
| `global_menu_set_item_submenu` | `void` | menu_root: String, idx: int, submenu: String |
| `global_menu_set_item_tag` | `void` | menu_root: String, idx: int, tag: Variant |
| `global_menu_set_item_text` | `void` | menu_root: String, idx: int, text: String |
| `global_menu_set_item_tooltip` | `void` | menu_root: String, idx: int, tooltip: String |
| `global_menu_set_popup_callbacks` | `void` | menu_root: String, open_callback: Callable, close_callback: Callable |
| `has_additional_outputs` | `bool` |  |
| `has_feature` | `bool` | feature: Feature |
| `help_set_search_callbacks` | `void` | search_callback: Callable, action_callback: Callable |
| `ime_get_selection` | `Vector2i` |  |
| `ime_get_text` | `String` |  |
| `is_dark_mode` | `bool` |  |
| `is_dark_mode_supported` | `bool` |  |
| `is_touchscreen_available` | `bool` |  |
| `is_window_transparency_available` | `bool` |  |
| `keyboard_get_current_layout` | `int` |  |
| `keyboard_get_keycode_from_physical` | `Key` | keycode: Key |
| `keyboard_get_label_from_physical` | `Key` | keycode: Key |
| `keyboard_get_layout_count` | `int` |  |
| `keyboard_get_layout_language` | `String` | index: int |
| `keyboard_get_layout_name` | `String` | index: int |
| `keyboard_set_current_layout` | `void` | index: int |
| `bitfield` | `` |  |
| `mouse_get_mode` | `MouseMode` |  |
| `mouse_get_position` | `Vector2i` |  |
| `mouse_set_mode` | `void` | mouse_mode: MouseMode |
| `process_events` | `void` |  |
| `register_additional_output` | `void` | object: Object |
| `screen_get_dpi` | `int` | screen: int = -1 |
| `screen_get_image` | `Image` | screen: int = -1 |
| `screen_get_max_scale` | `float` |  |
| `screen_get_orientation` | `ScreenOrientation` | screen: int = -1 |
| `screen_get_pixel` | `Color` | position: Vector2i |
| `screen_get_position` | `Vector2i` | screen: int = -1 |
| `screen_get_refresh_rate` | `float` | screen: int = -1 |
| `screen_get_scale` | `float` | screen: int = -1 |
| `screen_get_size` | `Vector2i` | screen: int = -1 |
| `screen_get_usable_rect` | `Rect2i` | screen: int = -1 |
| `screen_is_kept_on` | `bool` |  |
| `screen_set_keep_on` | `void` | enable: bool |
| `screen_set_orientation` | `void` | orientation: ScreenOrientation, screen: int = -1 |
| `set_icon` | `void` | image: Image |
| `set_native_icon` | `void` | filename: String |
| `set_system_theme_change_callback` | `void` | callable: Callable |
| `status_indicator_get_rect` | `Rect2` | id: int |
| `status_indicator_set_callback` | `void` | id: int, callback: Callable |
| `status_indicator_set_icon` | `void` | id: int, icon: Texture2D |
| `status_indicator_set_menu` | `void` | id: int, menu_rid: RID |
| `status_indicator_set_tooltip` | `void` | id: int, tooltip: String |
| `tablet_get_current_driver` | `String` |  |
| `tablet_get_driver_count` | `int` |  |
| `tablet_get_driver_name` | `String` | idx: int |
| `tablet_set_current_driver` | `void` | name: String |
| `tts_get_voices` | `Array\[Dictionary\]` |  |
| `tts_get_voices_for_language` | `PackedStringArray` | language: String |
| `tts_is_paused` | `bool` |  |
| `tts_is_speaking` | `bool` |  |
| `tts_pause` | `void` |  |
| `tts_resume` | `void` |  |
| `tts_set_utterance_callback` | `void` | event: TTSUtteranceEvent, callable: Callable |
| `tts_speak` | `void` | text: String, voice: String, volume: int = 50, pitch: float = 1.0, ... |
| `tts_stop` | `void` |  |
| `unregister_additional_output` | `void` | object: Object |
| `virtual_keyboard_get_height` | `int` |  |
| `virtual_keyboard_hide` | `void` |  |
| `virtual_keyboard_show` | `void` | existing_text: String, position: Rect2 = Rect2(0, 0, 0, 0), type: V... |
| `warp_mouse` | `void` | position: Vector2i |
| `window_can_draw` | `bool` | window_id: int = 0 |
| `window_get_active_popup` | `int` |  |
| `window_get_attached_instance_id` | `int` | window_id: int = 0 |
| `window_get_current_screen` | `int` | window_id: int = 0 |
| `window_get_flag` | `bool` | flag: WindowFlags, window_id: int = 0 |
| `window_get_max_size` | `Vector2i` | window_id: int = 0 |
| `window_get_min_size` | `Vector2i` | window_id: int = 0 |
| `window_get_mode` | `WindowMode` | window_id: int = 0 |
| `window_get_native_handle` | `int` | handle_type: HandleType, window_id: int = 0 |
| `window_get_popup_safe_rect` | `Rect2i` | window: int |
| `window_get_position` | `Vector2i` | window_id: int = 0 |
| `window_get_position_with_decorations` | `Vector2i` | window_id: int = 0 |
| `window_get_safe_title_margins` | `Vector3i` | window_id: int = 0 |
| `window_get_size` | `Vector2i` | window_id: int = 0 |
| `window_get_size_with_decorations` | `Vector2i` | window_id: int = 0 |
| `window_get_title_size` | `Vector2i` | title: String, window_id: int = 0 |
| `window_get_vsync_mode` | `VSyncMode` | window_id: int = 0 |
| `window_is_focused` | `bool` | window_id: int = 0 |
| `window_is_maximize_allowed` | `bool` | window_id: int = 0 |
| `window_maximize_on_title_dbl_click` | `bool` |  |
| `window_minimize_on_title_dbl_click` | `bool` |  |
| `window_move_to_foreground` | `void` | window_id: int = 0 |
| `window_request_attention` | `void` | window_id: int = 0 |
| `window_set_current_screen` | `void` | screen: int, window_id: int = 0 |
| `window_set_drop_files_callback` | `void` | callback: Callable, window_id: int = 0 |
| `window_set_exclusive` | `void` | window_id: int, exclusive: bool |
| `window_set_flag` | `void` | flag: WindowFlags, enabled: bool, window_id: int = 0 |
| `window_set_ime_active` | `void` | active: bool, window_id: int = 0 |
| `window_set_ime_position` | `void` | position: Vector2i, window_id: int = 0 |
| `window_set_input_event_callback` | `void` | callback: Callable, window_id: int = 0 |
| `window_set_input_text_callback` | `void` | callback: Callable, window_id: int = 0 |
| `window_set_max_size` | `void` | max_size: Vector2i, window_id: int = 0 |
| `window_set_min_size` | `void` | min_size: Vector2i, window_id: int = 0 |
| `window_set_mode` | `void` | mode: WindowMode, window_id: int = 0 |
| `window_set_mouse_passthrough` | `void` | region: PackedVector2Array, window_id: int = 0 |
| `window_set_popup_safe_rect` | `void` | window: int, rect: Rect2i |
| `window_set_position` | `void` | position: Vector2i, window_id: int = 0 |
| `window_set_rect_changed_callback` | `void` | callback: Callable, window_id: int = 0 |
| `window_set_size` | `void` | size: Vector2i, window_id: int = 0 |
| `window_set_title` | `void` | title: String, window_id: int = 0 |
| `window_set_transient` | `void` | window_id: int, parent_window_id: int |
| `window_set_vsync_mode` | `void` | vsync_mode: VSyncMode, window_id: int = 0 |
| `window_set_window_buttons_offset` | `void` | offset: Vector2i, window_id: int = 0 |
| `window_set_window_event_callback` | `void` | callback: Callable, window_id: int = 0 |

### 常量
| 名称 | 值 |
|------|-----|
| `SCREEN_WITH_MOUSE_FOCUS` | `-4` |
| `SCREEN_WITH_KEYBOARD_FOCUS` | `-3` |
| `SCREEN_PRIMARY` | `-2` |
| `SCREEN_OF_MAIN_WINDOW` | `-1` |
| `MAIN_WINDOW_ID` | `0` |
| `INVALID_WINDOW_ID` | `-1` |
| `INVALID_INDICATOR_ID` | `-1` |

### 使用场景
显示服务器。管理窗口、屏幕、光标、IME输入等底层显示功能。

### 示例代码
```gdscript
DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_FULLSCREEN)
DisplayServer.window_set_title("我的游戏")
var screen_size = DisplayServer.screen_get_size()
```

### 官方链接
[DisplayServer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_displayserver.html)

---

## AudioServer

**继承链：** Object
**描述：** Server interface for low-level audio access.

> **AudioServer** is a low-level server interface for audio access. It is in charge of creating sample data (playable audio) as well as its playback via a voice interface.

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `bus_count` | `int` | `1` |
| `input_device` | `String` | `"Default"` |
| `output_device` | `String` | `"Default"` |
| `playback_speed_scale` | `float` | `1.0` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_bus` | `void` | at_position: int = -1 |
| `add_bus_effect` | `void` | bus_idx: int, effect: AudioEffect, at_position: int = -1 |
| `generate_bus_layout` | `AudioBusLayout` |  |
| `get_bus_channels` | `int` | bus_idx: int |
| `get_bus_effect` | `AudioEffect` | bus_idx: int, effect_idx: int |
| `get_bus_effect_count` | `int` | bus_idx: int |
| `get_bus_effect_instance` | `AudioEffectInstance` | bus_idx: int, effect_idx: int, channel: int = 0 |
| `get_bus_index` | `int` | bus_name: StringName |
| `get_bus_name` | `String` | bus_idx: int |
| `get_bus_peak_volume_left_db` | `float` | bus_idx: int, channel: int |
| `get_bus_peak_volume_right_db` | `float` | bus_idx: int, channel: int |
| `get_bus_send` | `StringName` | bus_idx: int |
| `get_bus_volume_db` | `float` | bus_idx: int |
| `get_input_device_list` | `PackedStringArray` |  |
| `get_mix_rate` | `float` |  |
| `get_output_device_list` | `PackedStringArray` |  |
| `get_output_latency` | `float` |  |
| `get_speaker_mode` | `SpeakerMode` |  |
| `get_time_since_last_mix` | `float` |  |
| `get_time_to_next_mix` | `float` |  |
| `is_bus_bypassing_effects` | `bool` | bus_idx: int |
| `is_bus_effect_enabled` | `bool` | bus_idx: int, effect_idx: int |
| `is_bus_mute` | `bool` | bus_idx: int |
| `is_bus_solo` | `bool` | bus_idx: int |
| `is_stream_registered_as_sample` | `bool` | stream: AudioStream |
| `lock` | `void` |  |
| `move_bus` | `void` | index: int, to_index: int |
| `register_stream_as_sample` | `void` | stream: AudioStream |
| `remove_bus` | `void` | index: int |
| `remove_bus_effect` | `void` | bus_idx: int, effect_idx: int |
| `set_bus_bypass_effects` | `void` | bus_idx: int, enable: bool |
| `set_bus_effect_enabled` | `void` | bus_idx: int, effect_idx: int, enabled: bool |
| `set_bus_layout` | `void` | bus_layout: AudioBusLayout |
| `set_bus_mute` | `void` | bus_idx: int, enable: bool |
| `set_bus_name` | `void` | bus_idx: int, name: String |
| `set_bus_send` | `void` | bus_idx: int, send: StringName |
| `set_bus_solo` | `void` | bus_idx: int, enable: bool |
| `set_bus_volume_db` | `void` | bus_idx: int, volume_db: float |
| `set_enable_tagging_used_audio_streams` | `void` | enable: bool |
| `swap_bus_effects` | `void` | bus_idx: int, effect_idx: int, by_effect_idx: int |
| `unlock` | `void` |  |

### 信号
- `bus_layout_changed`
- `bus_renamed`

### 使用场景
音频服务器。管理音频总线、音效、音量、声像等全局音频设置。

### 示例代码
```gdscript
var bus = AudioServer.get_bus_index("Music")
AudioServer.set_bus_volume_db(bus, -10.0)
AudioServer.set_bus_mute(bus, false)
var reverb = AudioEffectReverb.new()
AudioServer.add_bus_effect(bus, reverb)
```

### 官方链接
[AudioServer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_audioserver.html)

---

## RenderingServer

**继承链：** Object
**描述：** Server for anything visible.

> The rendering server is the API backend for everything visible. The whole scene system mounts on it to display. The rendering server is completely opaque: the internals are entirely implementation-specific and cannot be accessed. The rendering server can be used to bypass the scene/Node system entirely. This can improve performance in cases where the scene system is the bottleneck, but won't improve performance otherwise (for instance, if the GPU is already fully utilized). Resources are created using the *_create functions. These functions return RID s which are not references to the objects 

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `render_loop_enabled` | `bool` | `` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `bake_render_uv2` | `Array\[Image\]` | base: RID, material_overrides: Array\[RID\], image_size: Vector2i |
| `call_on_render_thread` | `void` | callable: Callable |
| `camera_attributes_create` | `RID` |  |
| `camera_attributes_set_auto_exposure` | `void` | camera_attributes: RID, enable: bool, min_sensitivity: float, max_s... |
| `camera_attributes_set_dof_blur` | `void` | camera_attributes: RID, far_enable: bool, far_distance: float, far_... |
| `camera_attributes_set_dof_blur_bokeh_shape` | `void` | shape: DOFBokehShape |
| `camera_attributes_set_dof_blur_quality` | `void` | quality: DOFBlurQuality, use_jitter: bool |
| `camera_attributes_set_exposure` | `void` | camera_attributes: RID, multiplier: float, normalization: float |
| `camera_create` | `RID` |  |
| `camera_set_camera_attributes` | `void` | camera: RID, effects: RID |
| `camera_set_compositor` | `void` | camera: RID, compositor: RID |
| `camera_set_cull_mask` | `void` | camera: RID, layers: int |
| `camera_set_environment` | `void` | camera: RID, env: RID |
| `camera_set_frustum` | `void` | camera: RID, size: float, offset: Vector2, z_near: float, z_far: float |
| `camera_set_orthogonal` | `void` | camera: RID, size: float, z_near: float, z_far: float |
| `camera_set_perspective` | `void` | camera: RID, fovy_degrees: float, z_near: float, z_far: float |
| `camera_set_transform` | `void` | camera: RID, transform: Transform3D |
| `camera_set_use_vertical_aspect` | `void` | camera: RID, enable: bool |
| `canvas_create` | `RID` |  |
| `canvas_item_add_animation_slice` | `void` | item: RID, animation_length: float, slice_begin: float, slice_end: ... |
| `canvas_item_add_circle` | `void` | item: RID, pos: Vector2, radius: float, color: Color, antialiased: ... |
| `canvas_item_add_clip_ignore` | `void` | item: RID, ignore: bool |
| `canvas_item_add_lcd_texture_rect_region` | `void` | item: RID, rect: Rect2, texture: RID, src_rect: Rect2, modulate: Color |
| `canvas_item_add_line` | `void` | item: RID, from: Vector2, to: Vector2, color: Color, width: float =... |
| `canvas_item_add_mesh` | `void` | item: RID, mesh: RID, transform: Transform2D = Transform2D(1, 0, 0,... |
| `canvas_item_add_msdf_texture_rect_region` | `void` | item: RID, rect: Rect2, texture: RID, src_rect: Rect2, modulate: Co... |
| `canvas_item_add_multiline` | `void` | item: RID, points: PackedVector2Array, colors: PackedColorArray, wi... |
| `canvas_item_add_multimesh` | `void` | item: RID, mesh: RID, texture: RID = RID() |
| `canvas_item_add_nine_patch` | `void` | item: RID, rect: Rect2, source: Rect2, texture: RID, topleft: Vecto... |
| `canvas_item_add_particles` | `void` | item: RID, particles: RID, texture: RID |
| `canvas_item_add_polygon` | `void` | item: RID, points: PackedVector2Array, colors: PackedColorArray, uv... |
| `canvas_item_add_polyline` | `void` | item: RID, points: PackedVector2Array, colors: PackedColorArray, wi... |
| `canvas_item_add_primitive` | `void` | item: RID, points: PackedVector2Array, colors: PackedColorArray, uv... |
| `canvas_item_add_rect` | `void` | item: RID, rect: Rect2, color: Color, antialiased: bool = false |
| `canvas_item_add_set_transform` | `void` | item: RID, transform: Transform2D |
| `canvas_item_add_texture_rect` | `void` | item: RID, rect: Rect2, texture: RID, tile: bool = false, modulate:... |
| `canvas_item_add_texture_rect_region` | `void` | item: RID, rect: Rect2, texture: RID, src_rect: Rect2, modulate: Co... |
| `canvas_item_add_triangle_array` | `void` | item: RID, indices: PackedInt32Array, points: PackedVector2Array, c... |
| `canvas_item_clear` | `void` | item: RID |
| `canvas_item_create` | `RID` |  |
| `canvas_item_reset_physics_interpolation` | `void` | item: RID |
| `canvas_item_set_canvas_group_mode` | `void` | item: RID, mode: CanvasGroupMode, clear_margin: float = 5.0, fit_em... |
| `canvas_item_set_clip` | `void` | item: RID, clip: bool |
| `canvas_item_set_copy_to_backbuffer` | `void` | item: RID, enabled: bool, rect: Rect2 |
| `canvas_item_set_custom_rect` | `void` | item: RID, use_custom_rect: bool, rect: Rect2 = Rect2(0, 0, 0, 0) |
| `canvas_item_set_default_texture_filter` | `void` | item: RID, filter: CanvasItemTextureFilter |
| `canvas_item_set_default_texture_repeat` | `void` | item: RID, repeat: CanvasItemTextureRepeat |
| `canvas_item_set_distance_field_mode` | `void` | item: RID, enabled: bool |
| `canvas_item_set_draw_behind_parent` | `void` | item: RID, enabled: bool |
| `canvas_item_set_draw_index` | `void` | item: RID, index: int |
| `canvas_item_set_interpolated` | `void` | item: RID, interpolated: bool |
| `canvas_item_set_light_mask` | `void` | item: RID, mask: int |
| `canvas_item_set_material` | `void` | item: RID, material: RID |
| `canvas_item_set_modulate` | `void` | item: RID, color: Color |
| `canvas_item_set_parent` | `void` | item: RID, parent: RID |
| `canvas_item_set_self_modulate` | `void` | item: RID, color: Color |
| `canvas_item_set_sort_children_by_y` | `void` | item: RID, enabled: bool |
| `canvas_item_set_transform` | `void` | item: RID, transform: Transform2D |
| `canvas_item_set_use_parent_material` | `void` | item: RID, enabled: bool |
| `canvas_item_set_visibility_layer` | `void` | item: RID, visibility_layer: int |
| `canvas_item_set_visibility_notifier` | `void` | item: RID, enable: bool, area: Rect2, enter_callable: Callable, exi... |
| `canvas_item_set_visible` | `void` | item: RID, visible: bool |
| `canvas_item_set_z_as_relative_to_parent` | `void` | item: RID, enabled: bool |
| `canvas_item_set_z_index` | `void` | item: RID, z_index: int |
| `canvas_item_transform_physics_interpolation` | `void` | item: RID, transform: Transform2D |
| `canvas_light_attach_to_canvas` | `void` | light: RID, canvas: RID |
| `canvas_light_create` | `RID` |  |
| `canvas_light_occluder_attach_to_canvas` | `void` | occluder: RID, canvas: RID |
| `canvas_light_occluder_create` | `RID` |  |
| `canvas_light_occluder_reset_physics_interpolation` | `void` | occluder: RID |
| `canvas_light_occluder_set_as_sdf_collision` | `void` | occluder: RID, enable: bool |
| `canvas_light_occluder_set_enabled` | `void` | occluder: RID, enabled: bool |
| `canvas_light_occluder_set_interpolated` | `void` | occluder: RID, interpolated: bool |
| `canvas_light_occluder_set_light_mask` | `void` | occluder: RID, mask: int |
| `canvas_light_occluder_set_polygon` | `void` | occluder: RID, polygon: RID |
| `canvas_light_occluder_set_transform` | `void` | occluder: RID, transform: Transform2D |
| `canvas_light_occluder_transform_physics_interpolation` | `void` | occluder: RID, transform: Transform2D |
| `canvas_light_reset_physics_interpolation` | `void` | light: RID |
| `canvas_light_set_blend_mode` | `void` | light: RID, mode: CanvasLightBlendMode |
| `canvas_light_set_color` | `void` | light: RID, color: Color |
| `canvas_light_set_enabled` | `void` | light: RID, enabled: bool |
| `canvas_light_set_energy` | `void` | light: RID, energy: float |
| `canvas_light_set_height` | `void` | light: RID, height: float |
| `canvas_light_set_interpolated` | `void` | light: RID, interpolated: bool |
| `canvas_light_set_item_cull_mask` | `void` | light: RID, mask: int |
| `canvas_light_set_item_shadow_cull_mask` | `void` | light: RID, mask: int |
| `canvas_light_set_layer_range` | `void` | light: RID, min_layer: int, max_layer: int |
| `canvas_light_set_mode` | `void` | light: RID, mode: CanvasLightMode |
| `canvas_light_set_shadow_color` | `void` | light: RID, color: Color |
| `canvas_light_set_shadow_enabled` | `void` | light: RID, enabled: bool |
| `canvas_light_set_shadow_filter` | `void` | light: RID, filter: CanvasLightShadowFilter |
| `canvas_light_set_shadow_smooth` | `void` | light: RID, smooth: float |
| `canvas_light_set_texture` | `void` | light: RID, texture: RID |
| `canvas_light_set_texture_offset` | `void` | light: RID, offset: Vector2 |
| `canvas_light_set_texture_scale` | `void` | light: RID, scale: float |
| `canvas_light_set_transform` | `void` | light: RID, transform: Transform2D |
| `canvas_light_set_z_range` | `void` | light: RID, min_z: int, max_z: int |
| `canvas_light_transform_physics_interpolation` | `void` | light: RID, transform: Transform2D |
| `canvas_occluder_polygon_create` | `RID` |  |
| `canvas_occluder_polygon_set_cull_mode` | `void` | occluder_polygon: RID, mode: CanvasOccluderPolygonCullMode |
| `canvas_occluder_polygon_set_shape` | `void` | occluder_polygon: RID, shape: PackedVector2Array, closed: bool |
| `canvas_set_disable_scale` | `void` | disable: bool |
| `canvas_set_item_mirroring` | `void` | canvas: RID, item: RID, mirroring: Vector2 |
| `canvas_set_item_repeat` | `void` | item: RID, repeat_size: Vector2, repeat_times: int |
| `canvas_set_modulate` | `void` | canvas: RID, color: Color |
| `canvas_set_shadow_texture_size` | `void` | size: int |
| `canvas_texture_create` | `RID` |  |
| `canvas_texture_set_channel` | `void` | canvas_texture: RID, channel: CanvasTextureChannel, texture: RID |
| `canvas_texture_set_shading_parameters` | `void` | canvas_texture: RID, base_color: Color, shininess: float |
| `canvas_texture_set_texture_filter` | `void` | canvas_texture: RID, filter: CanvasItemTextureFilter |
| `canvas_texture_set_texture_repeat` | `void` | canvas_texture: RID, repeat: CanvasItemTextureRepeat |
| `compositor_create` | `RID` |  |
| `compositor_effect_create` | `RID` |  |
| `compositor_effect_set_callback` | `void` | effect: RID, callback_type: CompositorEffectCallbackType, callback:... |
| `compositor_effect_set_enabled` | `void` | effect: RID, enabled: bool |
| `compositor_effect_set_flag` | `void` | effect: RID, flag: CompositorEffectFlags, set: bool |
| `compositor_set_compositor_effects` | `void` | compositor: RID, effects: Array\[RID\] |
| `create_local_rendering_device` | `RenderingDevice` |  |
| `debug_canvas_item_get_rect` | `Rect2` | item: RID |
| `decal_create` | `RID` |  |
| `decal_set_albedo_mix` | `void` | decal: RID, albedo_mix: float |
| `decal_set_cull_mask` | `void` | decal: RID, mask: int |
| `decal_set_distance_fade` | `void` | decal: RID, enabled: bool, begin: float, length: float |
| `decal_set_emission_energy` | `void` | decal: RID, energy: float |
| `decal_set_fade` | `void` | decal: RID, above: float, below: float |
| `decal_set_modulate` | `void` | decal: RID, color: Color |
| `decal_set_normal_fade` | `void` | decal: RID, fade: float |
| `decal_set_size` | `void` | decal: RID, size: Vector3 |
| `decal_set_texture` | `void` | decal: RID, type: DecalTexture, texture: RID |
| `decals_set_filter` | `void` | filter: DecalFilter |
| `directional_light_create` | `RID` |  |
| `directional_shadow_atlas_set_size` | `void` | size: int, is_16bits: bool |
| `directional_soft_shadow_filter_set_quality` | `void` | quality: ShadowQuality |
| `environment_bake_panorama` | `Image` | environment: RID, bake_irradiance: bool, size: Vector2i |
| `environment_create` | `RID` |  |
| `environment_glow_set_use_bicubic_upscale` | `void` | enable: bool |
| `environment_set_adjustment` | `void` | env: RID, enable: bool, brightness: float, contrast: float, saturat... |
| `environment_set_ambient_light` | `void` | env: RID, color: Color, ambient: EnvironmentAmbientSource = 0, ener... |
| `environment_set_background` | `void` | env: RID, bg: EnvironmentBG |
| `environment_set_bg_color` | `void` | env: RID, color: Color |
| `environment_set_bg_energy` | `void` | env: RID, multiplier: float, exposure_value: float |
| `environment_set_canvas_max_layer` | `void` | env: RID, max_layer: int |
| `environment_set_fog` | `void` | env: RID, enable: bool, light_color: Color, light_energy: float, su... |
| `environment_set_glow` | `void` | env: RID, enable: bool, levels: PackedFloat32Array, intensity: floa... |
| `environment_set_sdfgi` | `void` | env: RID, enable: bool, cascades: int, min_cell_size: float, y_scal... |
| `environment_set_sdfgi_frames_to_converge` | `void` | frames: EnvironmentSDFGIFramesToConverge |
| `environment_set_sdfgi_frames_to_update_light` | `void` | frames: EnvironmentSDFGIFramesToUpdateLight |
| `environment_set_sdfgi_ray_count` | `void` | ray_count: EnvironmentSDFGIRayCount |
| `environment_set_sky` | `void` | env: RID, sky: RID |
| `environment_set_sky_custom_fov` | `void` | env: RID, scale: float |
| `environment_set_sky_orientation` | `void` | env: RID, orientation: Basis |
| `environment_set_ssao` | `void` | env: RID, enable: bool, radius: float, intensity: float, power: flo... |
| `environment_set_ssao_quality` | `void` | quality: EnvironmentSSAOQuality, half_size: bool, adaptive_target: ... |
| `environment_set_ssil_quality` | `void` | quality: EnvironmentSSILQuality, half_size: bool, adaptive_target: ... |
| `environment_set_ssr` | `void` | env: RID, enable: bool, max_steps: int, fade_in: float, fade_out: f... |
| `environment_set_ssr_roughness_quality` | `void` | quality: EnvironmentSSRRoughnessQuality |
| `environment_set_tonemap` | `void` | env: RID, tone_mapper: EnvironmentToneMapper, exposure: float, whit... |
| `environment_set_volumetric_fog` | `void` | env: RID, enable: bool, density: float, albedo: Color, emission: Co... |
| `environment_set_volumetric_fog_filter_active` | `void` | active: bool |
| `environment_set_volumetric_fog_volume_size` | `void` | size: int, depth: int |
| `fog_volume_create` | `RID` |  |
| `fog_volume_set_material` | `void` | fog_volume: RID, material: RID |
| `fog_volume_set_shape` | `void` | fog_volume: RID, shape: FogVolumeShape |
| `fog_volume_set_size` | `void` | fog_volume: RID, size: Vector3 |
| `force_draw` | `void` | swap_buffers: bool = true, frame_step: float = 0.0 |
| `force_sync` | `void` |  |
| `free_rid` | `void` | rid: RID |
| `get_default_clear_color` | `Color` |  |
| `get_frame_setup_time_cpu` | `float` |  |
| `get_rendering_device` | `RenderingDevice` |  |
| `get_rendering_info` | `int` | info: RenderingInfo |
| `get_shader_parameter_list` | `Array\[Dictionary\]` | shader: RID |
| `get_test_cube` | `RID` |  |
| `get_test_texture` | `RID` |  |
| `get_video_adapter_api_version` | `String` |  |
| `get_video_adapter_name` | `String` |  |
| `get_video_adapter_type` | `DeviceType` |  |
| `get_video_adapter_vendor` | `String` |  |
| `get_white_texture` | `RID` |  |
| `gi_set_use_half_resolution` | `void` | half_resolution: bool |
| `global_shader_parameter_add` | `void` | name: StringName, type: GlobalShaderParameterType, default_value: V... |
| `global_shader_parameter_get` | `Variant` | name: StringName |
| `global_shader_parameter_get_list` | `Array\[StringName\]` |  |
| `global_shader_parameter_get_type` | `GlobalShaderParameterType` | name: StringName |
| `global_shader_parameter_remove` | `void` | name: StringName |
| `global_shader_parameter_set` | `void` | name: StringName, value: Variant |
| `global_shader_parameter_set_override` | `void` | name: StringName, value: Variant |
| `has_changed` | `bool` |  |
| `has_feature` | `bool` | feature: Features |
| `has_os_feature` | `bool` | feature: String |
| `instance_attach_object_instance_id` | `void` | instance: RID, id: int |
| `instance_attach_skeleton` | `void` | instance: RID, skeleton: RID |
| `instance_create` | `RID` |  |
| `instance_create2` | `RID` | base: RID, scenario: RID |
| `instance_geometry_get_shader_parameter` | `Variant` | instance: RID, parameter: StringName |
| `instance_geometry_get_shader_parameter_default_value` | `Variant` | instance: RID, parameter: StringName |
| `instance_geometry_get_shader_parameter_list` | `Array\[Dictionary\]` | instance: RID |
| `instance_geometry_set_cast_shadows_setting` | `void` | instance: RID, shadow_casting_setting: ShadowCastingSetting |
| `instance_geometry_set_flag` | `void` | instance: RID, flag: InstanceFlags, enabled: bool |
| `instance_geometry_set_lightmap` | `void` | instance: RID, lightmap: RID, lightmap_uv_scale: Rect2, lightmap_sl... |
| `instance_geometry_set_lod_bias` | `void` | instance: RID, lod_bias: float |
| `instance_geometry_set_material_overlay` | `void` | instance: RID, material: RID |
| `instance_geometry_set_material_override` | `void` | instance: RID, material: RID |
| `instance_geometry_set_shader_parameter` | `void` | instance: RID, parameter: StringName, value: Variant |
| `instance_geometry_set_transparency` | `void` | instance: RID, transparency: float |
| `instance_geometry_set_visibility_range` | `void` | instance: RID, min: float, max: float, min_margin: float, max_margi... |
| `instance_set_base` | `void` | instance: RID, base: RID |
| `instance_set_blend_shape_weight` | `void` | instance: RID, shape: int, weight: float |
| `instance_set_custom_aabb` | `void` | instance: RID, aabb: AABB |
| `instance_set_extra_visibility_margin` | `void` | instance: RID, margin: float |
| `instance_set_ignore_culling` | `void` | instance: RID, enabled: bool |
| `instance_set_layer_mask` | `void` | instance: RID, mask: int |
| `instance_set_pivot_data` | `void` | instance: RID, sorting_offset: float, use_aabb_center: bool |
| `instance_set_scenario` | `void` | instance: RID, scenario: RID |
| `instance_set_surface_override_material` | `void` | instance: RID, surface: int, material: RID |
| `instance_set_transform` | `void` | instance: RID, transform: Transform3D |
| `instance_set_visibility_parent` | `void` | instance: RID, parent: RID |
| `instance_set_visible` | `void` | instance: RID, visible: bool |
| `instances_cull_aabb` | `PackedInt64Array` | aabb: AABB, scenario: RID = RID() |
| `instances_cull_convex` | `PackedInt64Array` | convex: Array\[Plane\], scenario: RID = RID() |
| `instances_cull_ray` | `PackedInt64Array` | from: Vector3, to: Vector3, scenario: RID = RID() |
| `is_on_render_thread` | `bool` |  |
| `light_directional_set_blend_splits` | `void` | light: RID, enable: bool |
| `light_directional_set_shadow_mode` | `void` | light: RID, mode: LightDirectionalShadowMode |
| `light_directional_set_sky_mode` | `void` | light: RID, mode: LightDirectionalSkyMode |
| `light_omni_set_shadow_mode` | `void` | light: RID, mode: LightOmniShadowMode |
| `light_projectors_set_filter` | `void` | filter: LightProjectorFilter |
| `light_set_bake_mode` | `void` | light: RID, bake_mode: LightBakeMode |
| `light_set_color` | `void` | light: RID, color: Color |
| `light_set_cull_mask` | `void` | light: RID, mask: int |
| `light_set_distance_fade` | `void` | decal: RID, enabled: bool, begin: float, shadow: float, length: float |
| `light_set_max_sdfgi_cascade` | `void` | light: RID, cascade: int |
| `light_set_negative` | `void` | light: RID, enable: bool |
| `light_set_param` | `void` | light: RID, param: LightParam, value: float |
| `light_set_projector` | `void` | light: RID, texture: RID |
| `light_set_reverse_cull_face_mode` | `void` | light: RID, enabled: bool |
| `light_set_shadow` | `void` | light: RID, enabled: bool |
| `lightmap_create` | `RID` |  |
| `lightmap_get_probe_capture_bsp_tree` | `PackedInt32Array` | lightmap: RID |
| `lightmap_get_probe_capture_points` | `PackedVector3Array` | lightmap: RID |
| `lightmap_get_probe_capture_sh` | `PackedColorArray` | lightmap: RID |
| `lightmap_get_probe_capture_tetrahedra` | `PackedInt32Array` | lightmap: RID |
| `lightmap_set_baked_exposure_normalization` | `void` | lightmap: RID, baked_exposure: float |
| `lightmap_set_probe_bounds` | `void` | lightmap: RID, bounds: AABB |
| `lightmap_set_probe_capture_data` | `void` | lightmap: RID, points: PackedVector3Array, point_sh: PackedColorArr... |
| `lightmap_set_probe_capture_update_speed` | `void` | speed: float |
| `lightmap_set_probe_interior` | `void` | lightmap: RID, interior: bool |
| `lightmap_set_textures` | `void` | lightmap: RID, light: RID, uses_sh: bool |
| `make_sphere_mesh` | `RID` | latitudes: int, longitudes: int, radius: float |
| `material_create` | `RID` |  |
| `material_get_param` | `Variant` | material: RID, parameter: StringName |
| `material_set_next_pass` | `void` | material: RID, next_material: RID |
| `material_set_param` | `void` | material: RID, parameter: StringName, value: Variant |
| `material_set_render_priority` | `void` | material: RID, priority: int |
| `material_set_shader` | `void` | shader_material: RID, shader: RID |
| `mesh_add_surface` | `void` | mesh: RID, surface: Dictionary |
| `mesh_add_surface_from_arrays` | `void` |  |
| `mesh_clear` | `void` | mesh: RID |
| `mesh_create` | `RID` |  |
| `mesh_create_from_surfaces` | `RID` | surfaces: Array\[Dictionary\], blend_shape_count: int = 0 |
| `mesh_get_blend_shape_count` | `int` | mesh: RID |
| `mesh_get_blend_shape_mode` | `BlendShapeMode` | mesh: RID |
| `mesh_get_custom_aabb` | `AABB` | mesh: RID |
| `mesh_get_surface` | `Dictionary` | mesh: RID, surface: int |
| `mesh_get_surface_count` | `int` | mesh: RID |
| `mesh_set_blend_shape_mode` | `void` | mesh: RID, mode: BlendShapeMode |
| `mesh_set_custom_aabb` | `void` | mesh: RID, aabb: AABB |
| `mesh_set_shadow_mesh` | `void` | mesh: RID, shadow_mesh: RID |
| `mesh_surface_get_arrays` | `Array` | mesh: RID, surface: int |
| `mesh_surface_get_blend_shape_arrays` | `Array\[Array\]` | mesh: RID, surface: int |
| `mesh_surface_get_format_attribute_stride` | `int` |  |
| `mesh_surface_get_format_normal_tangent_stride` | `int` |  |
| `mesh_surface_get_format_offset` | `int` |  |
| `mesh_surface_get_format_skin_stride` | `int` |  |
| `mesh_surface_get_format_vertex_stride` | `int` |  |
| `mesh_surface_get_material` | `RID` | mesh: RID, surface: int |
| `mesh_surface_set_material` | `void` | mesh: RID, surface: int, material: RID |
| `mesh_surface_update_attribute_region` | `void` | mesh: RID, surface: int, offset: int, data: PackedByteArray |
| `mesh_surface_update_skin_region` | `void` | mesh: RID, surface: int, offset: int, data: PackedByteArray |
| `mesh_surface_update_vertex_region` | `void` | mesh: RID, surface: int, offset: int, data: PackedByteArray |
| `multimesh_allocate_data` | `void` | multimesh: RID, instances: int, transform_format: MultimeshTransfor... |
| `multimesh_create` | `RID` |  |
| `multimesh_get_aabb` | `AABB` | multimesh: RID |
| `multimesh_get_buffer` | `PackedFloat32Array` | multimesh: RID |
| `multimesh_get_custom_aabb` | `AABB` | multimesh: RID |
| `multimesh_get_instance_count` | `int` | multimesh: RID |
| `multimesh_get_mesh` | `RID` | multimesh: RID |
| `multimesh_get_visible_instances` | `int` | multimesh: RID |
| `multimesh_instance_get_color` | `Color` | multimesh: RID, index: int |
| `multimesh_instance_get_custom_data` | `Color` | multimesh: RID, index: int |
| `multimesh_instance_get_transform` | `Transform3D` | multimesh: RID, index: int |
| `multimesh_instance_get_transform_2d` | `Transform2D` | multimesh: RID, index: int |
| `multimesh_instance_set_color` | `void` | multimesh: RID, index: int, color: Color |
| `multimesh_instance_set_custom_data` | `void` | multimesh: RID, index: int, custom_data: Color |
| `multimesh_instance_set_transform` | `void` | multimesh: RID, index: int, transform: Transform3D |
| `multimesh_instance_set_transform_2d` | `void` | multimesh: RID, index: int, transform: Transform2D |
| `multimesh_set_buffer` | `void` | multimesh: RID, buffer: PackedFloat32Array |
| `multimesh_set_custom_aabb` | `void` | multimesh: RID, aabb: AABB |
| `multimesh_set_mesh` | `void` | multimesh: RID, mesh: RID |
| `multimesh_set_visible_instances` | `void` | multimesh: RID, visible: int |
| `occluder_create` | `RID` |  |
| `occluder_set_mesh` | `void` | occluder: RID, vertices: PackedVector3Array, indices: PackedInt32Array |
| `omni_light_create` | `RID` |  |
| `particles_collision_create` | `RID` |  |
| `particles_collision_height_field_update` | `void` | particles_collision: RID |
| `particles_collision_set_attractor_attenuation` | `void` | particles_collision: RID, curve: float |
| `particles_collision_set_attractor_directionality` | `void` | particles_collision: RID, amount: float |
| `particles_collision_set_attractor_strength` | `void` | particles_collision: RID, strength: float |
| `particles_collision_set_box_extents` | `void` | particles_collision: RID, extents: Vector3 |
| `particles_collision_set_collision_type` | `void` | particles_collision: RID, type: ParticlesCollisionType |
| `particles_collision_set_cull_mask` | `void` | particles_collision: RID, mask: int |
| `particles_collision_set_field_texture` | `void` | particles_collision: RID, texture: RID |
| `particles_collision_set_height_field_resolution` | `void` | particles_collision: RID, resolution: ParticlesCollisionHeightfield... |
| `particles_collision_set_sphere_radius` | `void` | particles_collision: RID, radius: float |
| `particles_create` | `RID` |  |
| `particles_emit` | `void` | particles: RID, transform: Transform3D, velocity: Vector3, color: C... |
| `particles_get_current_aabb` | `AABB` | particles: RID |
| `particles_get_emitting` | `bool` | particles: RID |
| `particles_is_inactive` | `bool` | particles: RID |
| `particles_request_process` | `void` | particles: RID |
| `particles_restart` | `void` | particles: RID |
| `particles_set_amount` | `void` | particles: RID, amount: int |
| `particles_set_amount_ratio` | `void` | particles: RID, ratio: float |
| `particles_set_collision_base_size` | `void` | particles: RID, size: float |
| `particles_set_custom_aabb` | `void` | particles: RID, aabb: AABB |
| `particles_set_draw_order` | `void` | particles: RID, order: ParticlesDrawOrder |
| `particles_set_draw_pass_mesh` | `void` | particles: RID, pass: int, mesh: RID |
| `particles_set_draw_passes` | `void` | particles: RID, count: int |
| `particles_set_emission_transform` | `void` | particles: RID, transform: Transform3D |
| `particles_set_emitter_velocity` | `void` | particles: RID, velocity: Vector3 |
| `particles_set_emitting` | `void` | particles: RID, emitting: bool |
| `particles_set_explosiveness_ratio` | `void` | particles: RID, ratio: float |
| `particles_set_fixed_fps` | `void` | particles: RID, fps: int |
| `particles_set_fractional_delta` | `void` | particles: RID, enable: bool |
| `particles_set_interp_to_end` | `void` | particles: RID, factor: float |
| `particles_set_interpolate` | `void` | particles: RID, enable: bool |
| `particles_set_lifetime` | `void` | particles: RID, lifetime: float |
| `particles_set_mode` | `void` | particles: RID, mode: ParticlesMode |
| `particles_set_one_shot` | `void` | particles: RID, one_shot: bool |
| `particles_set_pre_process_time` | `void` | particles: RID, time: float |
| `particles_set_process_material` | `void` | particles: RID, material: RID |
| `particles_set_randomness_ratio` | `void` | particles: RID, ratio: float |
| `particles_set_speed_scale` | `void` | particles: RID, scale: float |
| `particles_set_subemitter` | `void` | particles: RID, subemitter_particles: RID |
| `particles_set_trail_bind_poses` | `void` | particles: RID, bind_poses: Array\[Transform3D\] |
| `particles_set_trails` | `void` | particles: RID, enable: bool, length_sec: float |
| `particles_set_transform_align` | `void` | particles: RID, align: ParticlesTransformAlign |
| `particles_set_use_local_coordinates` | `void` | particles: RID, enable: bool |
| `positional_soft_shadow_filter_set_quality` | `void` | quality: ShadowQuality |
| `reflection_probe_create` | `RID` |  |
| `reflection_probe_set_ambient_color` | `void` | probe: RID, color: Color |
| `reflection_probe_set_ambient_energy` | `void` | probe: RID, energy: float |
| `reflection_probe_set_ambient_mode` | `void` | probe: RID, mode: ReflectionProbeAmbientMode |
| `reflection_probe_set_as_interior` | `void` | probe: RID, enable: bool |
| `reflection_probe_set_cull_mask` | `void` | probe: RID, layers: int |
| `reflection_probe_set_enable_box_projection` | `void` | probe: RID, enable: bool |
| `reflection_probe_set_enable_shadows` | `void` | probe: RID, enable: bool |
| `reflection_probe_set_intensity` | `void` | probe: RID, intensity: float |
| `reflection_probe_set_max_distance` | `void` | probe: RID, distance: float |
| `reflection_probe_set_mesh_lod_threshold` | `void` | probe: RID, pixels: float |
| `reflection_probe_set_origin_offset` | `void` | probe: RID, offset: Vector3 |
| `reflection_probe_set_reflection_mask` | `void` | probe: RID, layers: int |
| `reflection_probe_set_resolution` | `void` | probe: RID, resolution: int |
| `reflection_probe_set_size` | `void` | probe: RID, size: Vector3 |
| `reflection_probe_set_update_mode` | `void` | probe: RID, mode: ReflectionProbeUpdateMode |
| `request_frame_drawn_callback` | `void` | callable: Callable |
| `scenario_create` | `RID` |  |
| `scenario_set_camera_attributes` | `void` | scenario: RID, effects: RID |
| `scenario_set_compositor` | `void` | scenario: RID, compositor: RID |
| `scenario_set_environment` | `void` | scenario: RID, environment: RID |
| `scenario_set_fallback_environment` | `void` | scenario: RID, environment: RID |
| `screen_space_roughness_limiter_set_active` | `void` | enable: bool, amount: float, limit: float |
| `set_boot_image` | `void` | image: Image, color: Color, scale: bool, use_filter: bool = true |
| `set_debug_generate_wireframes` | `void` | generate: bool |
| `set_default_clear_color` | `void` | color: Color |
| `shader_create` | `RID` |  |
| `shader_get_code` | `String` | shader: RID |
| `shader_get_default_texture_parameter` | `RID` | shader: RID, name: StringName, index: int = 0 |
| `shader_get_parameter_default` | `Variant` | shader: RID, name: StringName |
| `shader_set_code` | `void` | shader: RID, code: String |
| `shader_set_default_texture_parameter` | `void` | shader: RID, name: StringName, texture: RID, index: int = 0 |
| `shader_set_path_hint` | `void` | shader: RID, path: String |
| `skeleton_allocate_data` | `void` | skeleton: RID, bones: int, is_2d_skeleton: bool = false |
| `skeleton_bone_get_transform` | `Transform3D` | skeleton: RID, bone: int |
| `skeleton_bone_get_transform_2d` | `Transform2D` | skeleton: RID, bone: int |
| `skeleton_bone_set_transform` | `void` | skeleton: RID, bone: int, transform: Transform3D |
| `skeleton_bone_set_transform_2d` | `void` | skeleton: RID, bone: int, transform: Transform2D |
| `skeleton_create` | `RID` |  |
| `skeleton_get_bone_count` | `int` | skeleton: RID |
| `skeleton_set_base_transform_2d` | `void` | skeleton: RID, base_transform: Transform2D |
| `sky_bake_panorama` | `Image` | sky: RID, energy: float, bake_irradiance: bool, size: Vector2i |
| `sky_create` | `RID` |  |
| `sky_set_material` | `void` | sky: RID, material: RID |
| `sky_set_mode` | `void` | sky: RID, mode: SkyMode |
| `sky_set_radiance_size` | `void` | sky: RID, radiance_size: int |
| `spot_light_create` | `RID` |  |
| `sub_surface_scattering_set_quality` | `void` | quality: SubSurfaceScatteringQuality |
| `sub_surface_scattering_set_scale` | `void` | scale: float, depth_scale: float |
| `texture_2d_create` | `RID` | image: Image |
| `texture_2d_get` | `Image` | texture: RID |
| `texture_2d_layer_get` | `Image` | texture: RID, layer: int |
| `texture_2d_layered_create` | `RID` | layers: Array\[Image\], layered_type: TextureLayeredType |
| `texture_2d_layered_placeholder_create` | `RID` | layered_type: TextureLayeredType |
| `texture_2d_placeholder_create` | `RID` |  |
| `texture_2d_update` | `void` | texture: RID, image: Image, layer: int |
| `texture_3d_create` | `RID` | format: Format, width: int, height: int, depth: int, mipmaps: bool,... |
| `texture_3d_get` | `Array\[Image\]` | texture: RID |
| `texture_3d_placeholder_create` | `RID` |  |
| `texture_3d_update` | `void` | texture: RID, data: Array\[Image\] |
| `texture_get_format` | `Format` | texture: RID |
| `texture_get_native_handle` | `int` | texture: RID, srgb: bool = false |
| `texture_get_path` | `String` | texture: RID |
| `texture_get_rd_texture` | `RID` | texture: RID, srgb: bool = false |
| `texture_proxy_create` | `RID` | base: RID |
| `texture_proxy_update` | `void` | texture: RID, proxy_to: RID |
| `texture_rd_create` | `RID` | rd_texture: RID, layer_type: TextureLayeredType = 0 |
| `texture_replace` | `void` | texture: RID, by_texture: RID |
| `texture_set_force_redraw_if_visible` | `void` | texture: RID, enable: bool |
| `texture_set_path` | `void` | texture: RID, path: String |
| `texture_set_size_override` | `void` | texture: RID, width: int, height: int |
| `viewport_attach_camera` | `void` | viewport: RID, camera: RID |
| `viewport_attach_canvas` | `void` | viewport: RID, canvas: RID |
| `viewport_attach_to_screen` | `void` | viewport: RID, rect: Rect2 = Rect2(0, 0, 0, 0), screen: int = 0 |
| `viewport_create` | `RID` |  |
| `viewport_get_measured_render_time_cpu` | `float` | viewport: RID |
| `viewport_get_measured_render_time_gpu` | `float` | viewport: RID |
| `viewport_get_render_info` | `int` | viewport: RID, type: ViewportRenderInfoType, info: ViewportRenderInfo |
| `viewport_get_render_target` | `RID` | viewport: RID |
| `viewport_get_texture` | `RID` | viewport: RID |
| `viewport_get_update_mode` | `ViewportUpdateMode` | viewport: RID |
| `viewport_remove_canvas` | `void` | viewport: RID, canvas: RID |
| `viewport_set_active` | `void` | viewport: RID, active: bool |
| `viewport_set_canvas_cull_mask` | `void` | viewport: RID, canvas_cull_mask: int |
| `viewport_set_canvas_stacking` | `void` | viewport: RID, canvas: RID, layer: int, sublayer: int |
| `viewport_set_canvas_transform` | `void` | viewport: RID, canvas: RID, offset: Transform2D |
| `viewport_set_clear_mode` | `void` | viewport: RID, clear_mode: ViewportClearMode |
| `viewport_set_debug_draw` | `void` | viewport: RID, draw: ViewportDebugDraw |
| `viewport_set_default_canvas_item_texture_filter` | `void` | viewport: RID, filter: CanvasItemTextureFilter |
| `viewport_set_default_canvas_item_texture_repeat` | `void` | viewport: RID, repeat: CanvasItemTextureRepeat |
| `viewport_set_disable_2d` | `void` | viewport: RID, disable: bool |
| `viewport_set_disable_3d` | `void` | viewport: RID, disable: bool |
| `viewport_set_environment_mode` | `void` | viewport: RID, mode: ViewportEnvironmentMode |
| `viewport_set_fsr_sharpness` | `void` | viewport: RID, sharpness: float |
| `viewport_set_global_canvas_transform` | `void` | viewport: RID, transform: Transform2D |
| `viewport_set_measure_render_time` | `void` | viewport: RID, enable: bool |
| `viewport_set_msaa_2d` | `void` | viewport: RID, msaa: ViewportMSAA |
| `viewport_set_msaa_3d` | `void` | viewport: RID, msaa: ViewportMSAA |
| `viewport_set_occlusion_culling_build_quality` | `void` | quality: ViewportOcclusionCullingBuildQuality |
| `viewport_set_occlusion_rays_per_thread` | `void` | rays_per_thread: int |
| `viewport_set_parent_viewport` | `void` | viewport: RID, parent_viewport: RID |
| `viewport_set_positional_shadow_atlas_quadrant_subdivision` | `void` | viewport: RID, quadrant: int, subdivision: int |
| `viewport_set_positional_shadow_atlas_size` | `void` | viewport: RID, size: int, use_16_bits: bool = false |
| `viewport_set_render_direct_to_screen` | `void` | viewport: RID, enabled: bool |
| `viewport_set_scaling_3d_mode` | `void` | viewport: RID, scaling_3d_mode: ViewportScaling3DMode |
| `viewport_set_scaling_3d_scale` | `void` | viewport: RID, scale: float |
| `viewport_set_scenario` | `void` | viewport: RID, scenario: RID |
| `viewport_set_screen_space_aa` | `void` | viewport: RID, mode: ViewportScreenSpaceAA |
| `viewport_set_sdf_oversize_and_scale` | `void` | viewport: RID, oversize: ViewportSDFOversize, scale: ViewportSDFScale |
| `viewport_set_size` | `void` | viewport: RID, width: int, height: int |
| `viewport_set_snap_2d_transforms_to_pixel` | `void` | viewport: RID, enabled: bool |
| `viewport_set_snap_2d_vertices_to_pixel` | `void` | viewport: RID, enabled: bool |
| `viewport_set_texture_mipmap_bias` | `void` | viewport: RID, mipmap_bias: float |
| `viewport_set_transparent_background` | `void` | viewport: RID, enabled: bool |
| `viewport_set_update_mode` | `void` | viewport: RID, update_mode: ViewportUpdateMode |
| `viewport_set_use_debanding` | `void` | viewport: RID, enable: bool |
| `viewport_set_use_hdr_2d` | `void` | viewport: RID, enabled: bool |
| `viewport_set_use_occlusion_culling` | `void` | viewport: RID, enable: bool |
| `viewport_set_use_taa` | `void` | viewport: RID, enable: bool |
| `viewport_set_use_xr` | `void` | viewport: RID, use_xr: bool |
| `viewport_set_vrs_mode` | `void` | viewport: RID, mode: ViewportVRSMode |
| `viewport_set_vrs_texture` | `void` | viewport: RID, texture: RID |
| `viewport_set_vrs_update_mode` | `void` | viewport: RID, mode: ViewportVRSUpdateMode |
| `visibility_notifier_create` | `RID` |  |
| `visibility_notifier_set_aabb` | `void` | notifier: RID, aabb: AABB |
| `visibility_notifier_set_callbacks` | `void` | notifier: RID, enter_callable: Callable, exit_callable: Callable |
| `voxel_gi_allocate_data` | `void` | voxel_gi: RID, to_cell_xform: Transform3D, aabb: AABB, octree_size:... |
| `voxel_gi_create` | `RID` |  |
| `voxel_gi_get_data_cells` | `PackedByteArray` | voxel_gi: RID |
| `voxel_gi_get_distance_field` | `PackedByteArray` | voxel_gi: RID |
| `voxel_gi_get_level_counts` | `PackedInt32Array` | voxel_gi: RID |
| `voxel_gi_get_octree_cells` | `PackedByteArray` | voxel_gi: RID |
| `voxel_gi_get_octree_size` | `Vector3i` | voxel_gi: RID |
| `voxel_gi_get_to_cell_xform` | `Transform3D` | voxel_gi: RID |
| `voxel_gi_set_baked_exposure_normalization` | `void` | voxel_gi: RID, baked_exposure: float |
| `voxel_gi_set_bias` | `void` | voxel_gi: RID, bias: float |
| `voxel_gi_set_dynamic_range` | `void` | voxel_gi: RID, range: float |
| `voxel_gi_set_energy` | `void` | voxel_gi: RID, energy: float |
| `voxel_gi_set_interior` | `void` | voxel_gi: RID, enable: bool |
| `voxel_gi_set_normal_bias` | `void` | voxel_gi: RID, bias: float |
| `voxel_gi_set_propagation` | `void` | voxel_gi: RID, amount: float |
| `voxel_gi_set_quality` | `void` | quality: VoxelGIQuality |
| `voxel_gi_set_use_two_bounces` | `void` | voxel_gi: RID, enable: bool |

### 信号
- `frame_post_draw`
- `frame_pre_draw`

### 常量
| 名称 | 值 |
|------|-----|
| `NO_INDEX_ARRAY` | `-1` |
| `ARRAY_WEIGHTS_SIZE` | `4` |
| `CANVAS_ITEM_Z_MIN` | `-4096` |
| `CANVAS_ITEM_Z_MAX` | `4096` |
| `MAX_GLOW_LEVELS` | `7` |
| `MAX_CURSORS` | `8` |
| `MAX_2D_DIRECTIONAL_LIGHTS` | `8` |
| `MAX_MESH_SURFACES` | `256` |
| `MATERIAL_RENDER_PRIORITY_MIN` | `-128` |
| `MATERIAL_RENDER_PRIORITY_MAX` | `127` |
| `ARRAY_CUSTOM_COUNT` | `4` |
| `PARTICLES_EMIT_FLAG_POSITION` | `1` |
| `PARTICLES_EMIT_FLAG_ROTATION_SCALE` | `2` |
| `PARTICLES_EMIT_FLAG_VELOCITY` | `4` |
| `PARTICLES_EMIT_FLAG_COLOR` | `8` |
| ... | 共 16 个常量 |

### 使用场景
渲染服务器。底层渲染API，直接操作渲染资源。普通开发中很少使用。

### 示例代码
```gdscript
# 底层API示例: 创建CanvasItem
var rid = RenderingServer.canvas_item_create()
RenderingServer.canvas_item_set_parent(rid, get_canvas_item())
RenderingServer.canvas_item_add_circle(rid, Vector2.ZERO, 50.0, Color.RED)
```

### 官方链接
[RenderingServer 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_renderingserver.html)

---

## PhysicsServer2D

**继承链：** Object
**描述：** A server interface for low-level 2D physics access.

> PhysicsServer2D is the server responsible for all 2D physics. It can directly create and manipulate all physics objects: - A *space* is a self-contained world for a physics simulation. It contains bodies, areas, and joints. Its state can be queried for collision and intersection information, and several parameters of the simulation can be modified. - A *shape* is a geometric shape such as a circle, a rectangle, a capsule, or a polygon. It can be used for collision detection by adding it to a body/area, possibly with an extra transformation relative to the body/area's origin. Bodies/areas can h

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `area_add_shape` | `void` | area: RID, shape: RID, transform: Transform2D = Transform2D(1, 0, 0... |
| `area_attach_canvas_instance_id` | `void` | area: RID, id: int |
| `area_attach_object_instance_id` | `void` | area: RID, id: int |
| `area_clear_shapes` | `void` | area: RID |
| `area_create` | `RID` |  |
| `area_get_canvas_instance_id` | `int` | area: RID |
| `area_get_collision_layer` | `int` | area: RID |
| `area_get_collision_mask` | `int` | area: RID |
| `area_get_object_instance_id` | `int` | area: RID |
| `area_get_param` | `Variant` | area: RID, param: AreaParameter |
| `area_get_shape` | `RID` | area: RID, shape_idx: int |
| `area_get_shape_count` | `int` | area: RID |
| `area_get_shape_transform` | `Transform2D` | area: RID, shape_idx: int |
| `area_get_space` | `RID` | area: RID |
| `area_get_transform` | `Transform2D` | area: RID |
| `area_remove_shape` | `void` | area: RID, shape_idx: int |
| `area_set_area_monitor_callback` | `void` | area: RID, callback: Callable |
| `area_set_collision_layer` | `void` | area: RID, layer: int |
| `area_set_collision_mask` | `void` | area: RID, mask: int |
| `area_set_monitor_callback` | `void` | area: RID, callback: Callable |
| `area_set_monitorable` | `void` | area: RID, monitorable: bool |
| `area_set_param` | `void` | area: RID, param: AreaParameter, value: Variant |
| `area_set_shape` | `void` | area: RID, shape_idx: int, shape: RID |
| `area_set_shape_disabled` | `void` | area: RID, shape_idx: int, disabled: bool |
| `area_set_shape_transform` | `void` | area: RID, shape_idx: int, transform: Transform2D |
| `area_set_space` | `void` | area: RID, space: RID |
| `area_set_transform` | `void` | area: RID, transform: Transform2D |
| `body_add_collision_exception` | `void` | body: RID, excepted_body: RID |
| `body_add_constant_central_force` | `void` | body: RID, force: Vector2 |
| `body_add_constant_force` | `void` | body: RID, force: Vector2, position: Vector2 = Vector2(0, 0) |
| `body_add_constant_torque` | `void` | body: RID, torque: float |
| `body_add_shape` | `void` | body: RID, shape: RID, transform: Transform2D = Transform2D(1, 0, 0... |
| `body_apply_central_force` | `void` | body: RID, force: Vector2 |
| `body_apply_central_impulse` | `void` | body: RID, impulse: Vector2 |
| `body_apply_force` | `void` | body: RID, force: Vector2, position: Vector2 = Vector2(0, 0) |
| `body_apply_impulse` | `void` | body: RID, impulse: Vector2, position: Vector2 = Vector2(0, 0) |
| `body_apply_torque` | `void` | body: RID, torque: float |
| `body_apply_torque_impulse` | `void` | body: RID, impulse: float |
| `body_attach_canvas_instance_id` | `void` | body: RID, id: int |
| `body_attach_object_instance_id` | `void` | body: RID, id: int |
| `body_clear_shapes` | `void` | body: RID |
| `body_create` | `RID` |  |
| `body_get_canvas_instance_id` | `int` | body: RID |
| `body_get_collision_layer` | `int` | body: RID |
| `body_get_collision_mask` | `int` | body: RID |
| `body_get_collision_priority` | `float` | body: RID |
| `body_get_constant_force` | `Vector2` | body: RID |
| `body_get_constant_torque` | `float` | body: RID |
| `body_get_continuous_collision_detection_mode` | `CCDMode` | body: RID |
| `body_get_direct_state` | `PhysicsDirectBodyState2D` | body: RID |
| `body_get_max_contacts_reported` | `int` | body: RID |
| `body_get_mode` | `BodyMode` | body: RID |
| `body_get_object_instance_id` | `int` | body: RID |
| `body_get_param` | `Variant` | body: RID, param: BodyParameter |
| `body_get_shape` | `RID` | body: RID, shape_idx: int |
| `body_get_shape_count` | `int` | body: RID |
| `body_get_shape_transform` | `Transform2D` | body: RID, shape_idx: int |
| `body_get_space` | `RID` | body: RID |
| `body_get_state` | `Variant` | body: RID, state: BodyState |
| `body_is_omitting_force_integration` | `bool` | body: RID |
| `body_remove_collision_exception` | `void` | body: RID, excepted_body: RID |
| `body_remove_shape` | `void` | body: RID, shape_idx: int |
| `body_reset_mass_properties` | `void` | body: RID |
| `body_set_axis_velocity` | `void` | body: RID, axis_velocity: Vector2 |
| `body_set_collision_layer` | `void` | body: RID, layer: int |
| `body_set_collision_mask` | `void` | body: RID, mask: int |
| `body_set_collision_priority` | `void` | body: RID, priority: float |
| `body_set_constant_force` | `void` | body: RID, force: Vector2 |
| `body_set_constant_torque` | `void` | body: RID, torque: float |
| `body_set_continuous_collision_detection_mode` | `void` | body: RID, mode: CCDMode |
| `body_set_force_integration_callback` | `void` | body: RID, callable: Callable, userdata: Variant = null |
| `body_set_max_contacts_reported` | `void` | body: RID, amount: int |
| `body_set_mode` | `void` | body: RID, mode: BodyMode |
| `body_set_omit_force_integration` | `void` | body: RID, enable: bool |
| `body_set_param` | `void` | body: RID, param: BodyParameter, value: Variant |
| `body_set_shape` | `void` | body: RID, shape_idx: int, shape: RID |
| `body_set_shape_as_one_way_collision` | `void` | body: RID, shape_idx: int, enable: bool, margin: float |
| `body_set_shape_disabled` | `void` | body: RID, shape_idx: int, disabled: bool |
| `body_set_shape_transform` | `void` | body: RID, shape_idx: int, transform: Transform2D |
| `body_set_space` | `void` | body: RID, space: RID |
| `body_set_state` | `void` | body: RID, state: BodyState, value: Variant |
| `body_set_state_sync_callback` | `void` | body: RID, callable: Callable |
| `body_test_motion` | `bool` | body: RID, parameters: PhysicsTestMotionParameters2D, result: Physi... |
| `capsule_shape_create` | `RID` |  |
| `circle_shape_create` | `RID` |  |
| `concave_polygon_shape_create` | `RID` |  |
| `convex_polygon_shape_create` | `RID` |  |
| `damped_spring_joint_get_param` | `float` | joint: RID, param: DampedSpringParam |
| `damped_spring_joint_set_param` | `void` | joint: RID, param: DampedSpringParam, value: float |
| `free_rid` | `void` | rid: RID |
| `get_process_info` | `int` | process_info: ProcessInfo |
| `joint_clear` | `void` | joint: RID |
| `joint_create` | `RID` |  |
| `joint_disable_collisions_between_bodies` | `void` | joint: RID, disable: bool |
| `joint_get_param` | `float` | joint: RID, param: JointParam |
| `joint_get_type` | `JointType` | joint: RID |
| `joint_is_disabled_collisions_between_bodies` | `bool` | joint: RID |
| `joint_make_damped_spring` | `void` | joint: RID, anchor_a: Vector2, anchor_b: Vector2, body_a: RID, body... |
| `joint_make_groove` | `void` | joint: RID, groove1_a: Vector2, groove2_a: Vector2, anchor_b: Vecto... |
| `joint_make_pin` | `void` | joint: RID, anchor: Vector2, body_a: RID, body_b: RID = RID() |
| `joint_set_param` | `void` | joint: RID, param: JointParam, value: float |
| `pin_joint_get_flag` | `bool` | joint: RID, flag: PinJointFlag |
| `pin_joint_get_param` | `float` | joint: RID, param: PinJointParam |
| `pin_joint_set_flag` | `void` | joint: RID, flag: PinJointFlag, enabled: bool |
| `pin_joint_set_param` | `void` | joint: RID, param: PinJointParam, value: float |
| `rectangle_shape_create` | `RID` |  |
| `segment_shape_create` | `RID` |  |
| `separation_ray_shape_create` | `RID` |  |
| `set_active` | `void` | active: bool |
| `shape_get_data` | `Variant` | shape: RID |
| `shape_get_type` | `ShapeType` | shape: RID |
| `shape_set_data` | `void` | shape: RID, data: Variant |
| `space_create` | `RID` |  |
| `space_get_direct_state` | `PhysicsDirectSpaceState2D` | space: RID |
| `space_get_param` | `float` | space: RID, param: SpaceParameter |
| `space_is_active` | `bool` | space: RID |
| `space_set_active` | `void` | space: RID, active: bool |
| `space_set_param` | `void` | space: RID, param: SpaceParameter, value: float |
| `world_boundary_shape_create` | `RID` |  |

### 使用场景
2D物理服务器。底层物理API，直接操作物理体、形状、空间等。

### 示例代码
```gdscript
# 通常通过节点间接使用，直接API较少需要
var space = PhysicsServer2D.space_create()
PhysicsServer2D.space_set_active(space, true)
```

### 官方链接
[PhysicsServer2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_physicsserver2d.html)

---

## PhysicsServer3D

**继承链：** Object
**描述：** A server interface for low-level 3D physics access.

> PhysicsServer3D is the server responsible for all 3D physics. It can directly create and manipulate all physics objects: - A *space* is a self-contained world for a physics simulation. It contains bodies, areas, and joints. Its state can be queried for collision and intersection information, and several parameters of the simulation can be modified. - A *shape* is a geometric shape such as a sphere, a box, a cylinder, or a polygon. It can be used for collision detection by adding it to a body/area, possibly with an extra transformation relative to the body/area's origin. Bodies/areas can have m

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `area_add_shape` | `void` | area: RID, shape: RID, transform: Transform3D = Transform3D(1, 0, 0... |
| `area_attach_object_instance_id` | `void` | area: RID, id: int |
| `area_clear_shapes` | `void` | area: RID |
| `area_create` | `RID` |  |
| `area_get_collision_layer` | `int` | area: RID |
| `area_get_collision_mask` | `int` | area: RID |
| `area_get_object_instance_id` | `int` | area: RID |
| `area_get_param` | `Variant` | area: RID, param: AreaParameter |
| `area_get_shape` | `RID` | area: RID, shape_idx: int |
| `area_get_shape_count` | `int` | area: RID |
| `area_get_shape_transform` | `Transform3D` | area: RID, shape_idx: int |
| `area_get_space` | `RID` | area: RID |
| `area_get_transform` | `Transform3D` | area: RID |
| `area_remove_shape` | `void` | area: RID, shape_idx: int |
| `area_set_area_monitor_callback` | `void` | area: RID, callback: Callable |
| `area_set_collision_layer` | `void` | area: RID, layer: int |
| `area_set_collision_mask` | `void` | area: RID, mask: int |
| `area_set_monitor_callback` | `void` | area: RID, callback: Callable |
| `area_set_monitorable` | `void` | area: RID, monitorable: bool |
| `area_set_param` | `void` | area: RID, param: AreaParameter, value: Variant |
| `area_set_ray_pickable` | `void` | area: RID, enable: bool |
| `area_set_shape` | `void` | area: RID, shape_idx: int, shape: RID |
| `area_set_shape_disabled` | `void` | area: RID, shape_idx: int, disabled: bool |
| `area_set_shape_transform` | `void` | area: RID, shape_idx: int, transform: Transform3D |
| `area_set_space` | `void` | area: RID, space: RID |
| `area_set_transform` | `void` | area: RID, transform: Transform3D |
| `body_add_collision_exception` | `void` | body: RID, excepted_body: RID |
| `body_add_constant_central_force` | `void` | body: RID, force: Vector3 |
| `body_add_constant_force` | `void` | body: RID, force: Vector3, position: Vector3 = Vector3(0, 0, 0) |
| `body_add_constant_torque` | `void` | body: RID, torque: Vector3 |
| `body_add_shape` | `void` | body: RID, shape: RID, transform: Transform3D = Transform3D(1, 0, 0... |
| `body_apply_central_force` | `void` | body: RID, force: Vector3 |
| `body_apply_central_impulse` | `void` | body: RID, impulse: Vector3 |
| `body_apply_force` | `void` | body: RID, force: Vector3, position: Vector3 = Vector3(0, 0, 0) |
| `body_apply_impulse` | `void` | body: RID, impulse: Vector3, position: Vector3 = Vector3(0, 0, 0) |
| `body_apply_torque` | `void` | body: RID, torque: Vector3 |
| `body_apply_torque_impulse` | `void` | body: RID, impulse: Vector3 |
| `body_attach_object_instance_id` | `void` | body: RID, id: int |
| `body_clear_shapes` | `void` | body: RID |
| `body_create` | `RID` |  |
| `body_get_collision_layer` | `int` | body: RID |
| `body_get_collision_mask` | `int` | body: RID |
| `body_get_collision_priority` | `float` | body: RID |
| `body_get_constant_force` | `Vector3` | body: RID |
| `body_get_constant_torque` | `Vector3` | body: RID |
| `body_get_direct_state` | `PhysicsDirectBodyState3D` | body: RID |
| `body_get_max_contacts_reported` | `int` | body: RID |
| `body_get_mode` | `BodyMode` | body: RID |
| `body_get_object_instance_id` | `int` | body: RID |
| `body_get_param` | `Variant` | body: RID, param: BodyParameter |
| `body_get_shape` | `RID` | body: RID, shape_idx: int |
| `body_get_shape_count` | `int` | body: RID |
| `body_get_shape_transform` | `Transform3D` | body: RID, shape_idx: int |
| `body_get_space` | `RID` | body: RID |
| `body_get_state` | `Variant` | body: RID, state: BodyState |
| `body_is_axis_locked` | `bool` | body: RID, axis: BodyAxis |
| `body_is_continuous_collision_detection_enabled` | `bool` | body: RID |
| `body_is_omitting_force_integration` | `bool` | body: RID |
| `body_remove_collision_exception` | `void` | body: RID, excepted_body: RID |
| `body_remove_shape` | `void` | body: RID, shape_idx: int |
| `body_reset_mass_properties` | `void` | body: RID |
| `body_set_axis_lock` | `void` | body: RID, axis: BodyAxis, lock: bool |
| `body_set_axis_velocity` | `void` | body: RID, axis_velocity: Vector3 |
| `body_set_collision_layer` | `void` | body: RID, layer: int |
| `body_set_collision_mask` | `void` | body: RID, mask: int |
| `body_set_collision_priority` | `void` | body: RID, priority: float |
| `body_set_constant_force` | `void` | body: RID, force: Vector3 |
| `body_set_constant_torque` | `void` | body: RID, torque: Vector3 |
| `body_set_enable_continuous_collision_detection` | `void` | body: RID, enable: bool |
| `body_set_force_integration_callback` | `void` | body: RID, callable: Callable, userdata: Variant = null |
| `body_set_max_contacts_reported` | `void` | body: RID, amount: int |
| `body_set_mode` | `void` | body: RID, mode: BodyMode |
| `body_set_omit_force_integration` | `void` | body: RID, enable: bool |
| `body_set_param` | `void` | body: RID, param: BodyParameter, value: Variant |
| `body_set_ray_pickable` | `void` | body: RID, enable: bool |
| `body_set_shape` | `void` | body: RID, shape_idx: int, shape: RID |
| `body_set_shape_disabled` | `void` | body: RID, shape_idx: int, disabled: bool |
| `body_set_shape_transform` | `void` | body: RID, shape_idx: int, transform: Transform3D |
| `body_set_space` | `void` | body: RID, space: RID |
| `body_set_state` | `void` | body: RID, state: BodyState, value: Variant |
| `body_set_state_sync_callback` | `void` | body: RID, callable: Callable |
| `body_test_motion` | `bool` | body: RID, parameters: PhysicsTestMotionParameters3D, result: Physi... |
| `box_shape_create` | `RID` |  |
| `capsule_shape_create` | `RID` |  |
| `concave_polygon_shape_create` | `RID` |  |
| `cone_twist_joint_get_param` | `float` | joint: RID, param: ConeTwistJointParam |
| `cone_twist_joint_set_param` | `void` | joint: RID, param: ConeTwistJointParam, value: float |
| `convex_polygon_shape_create` | `RID` |  |
| `custom_shape_create` | `RID` |  |
| `cylinder_shape_create` | `RID` |  |
| `free_rid` | `void` | rid: RID |
| `generic_6dof_joint_get_flag` | `bool` | joint: RID, axis: Vector3.Axis, flag: G6DOFJointAxisFlag |
| `generic_6dof_joint_get_param` | `float` | joint: RID, axis: Vector3.Axis, param: G6DOFJointAxisParam |
| `generic_6dof_joint_set_flag` | `void` | joint: RID, axis: Vector3.Axis, flag: G6DOFJointAxisFlag, enable: bool |
| `generic_6dof_joint_set_param` | `void` | joint: RID, axis: Vector3.Axis, param: G6DOFJointAxisParam, value: ... |
| `get_process_info` | `int` | process_info: ProcessInfo |
| `heightmap_shape_create` | `RID` |  |
| `hinge_joint_get_flag` | `bool` | joint: RID, flag: HingeJointFlag |
| `hinge_joint_get_param` | `float` | joint: RID, param: HingeJointParam |
| `hinge_joint_set_flag` | `void` | joint: RID, flag: HingeJointFlag, enabled: bool |
| `hinge_joint_set_param` | `void` | joint: RID, param: HingeJointParam, value: float |
| `joint_clear` | `void` | joint: RID |
| `joint_create` | `RID` |  |
| `joint_disable_collisions_between_bodies` | `void` | joint: RID, disable: bool |
| `joint_get_solver_priority` | `int` | joint: RID |
| `joint_get_type` | `JointType` | joint: RID |
| `joint_is_disabled_collisions_between_bodies` | `bool` | joint: RID |
| `joint_make_cone_twist` | `void` | joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, loc... |
| `joint_make_generic_6dof` | `void` | joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, loc... |
| `joint_make_hinge` | `void` | joint: RID, body_A: RID, hinge_A: Transform3D, body_B: RID, hinge_B... |
| `joint_make_pin` | `void` | joint: RID, body_A: RID, local_A: Vector3, body_B: RID, local_B: Ve... |
| `joint_make_slider` | `void` | joint: RID, body_A: RID, local_ref_A: Transform3D, body_B: RID, loc... |
| `joint_set_solver_priority` | `void` | joint: RID, priority: int |
| `pin_joint_get_local_a` | `Vector3` | joint: RID |
| `pin_joint_get_local_b` | `Vector3` | joint: RID |
| `pin_joint_get_param` | `float` | joint: RID, param: PinJointParam |
| `pin_joint_set_local_a` | `void` | joint: RID, local_A: Vector3 |
| `pin_joint_set_local_b` | `void` | joint: RID, local_B: Vector3 |
| `pin_joint_set_param` | `void` | joint: RID, param: PinJointParam, value: float |
| `separation_ray_shape_create` | `RID` |  |
| `set_active` | `void` | active: bool |
| `shape_get_data` | `Variant` | shape: RID |
| `shape_get_margin` | `float` | shape: RID |
| `shape_get_type` | `ShapeType` | shape: RID |
| `shape_set_data` | `void` | shape: RID, data: Variant |
| `shape_set_margin` | `void` | shape: RID, margin: float |
| `slider_joint_get_param` | `float` | joint: RID, param: SliderJointParam |
| `slider_joint_set_param` | `void` | joint: RID, param: SliderJointParam, value: float |
| `soft_body_add_collision_exception` | `void` | body: RID, body_b: RID |
| `soft_body_create` | `RID` |  |
| `soft_body_get_bounds` | `AABB` | body: RID |
| `soft_body_get_collision_layer` | `int` | body: RID |
| `soft_body_get_collision_mask` | `int` | body: RID |
| `soft_body_get_damping_coefficient` | `float` | body: RID |
| `soft_body_get_drag_coefficient` | `float` | body: RID |
| `soft_body_get_linear_stiffness` | `float` | body: RID |
| `soft_body_get_point_global_position` | `Vector3` | body: RID, point_index: int |
| `soft_body_get_pressure_coefficient` | `float` | body: RID |
| `soft_body_get_simulation_precision` | `int` | body: RID |
| `soft_body_get_space` | `RID` | body: RID |
| `soft_body_get_state` | `Variant` | body: RID, state: BodyState |
| `soft_body_get_total_mass` | `float` | body: RID |
| `soft_body_is_point_pinned` | `bool` | body: RID, point_index: int |
| `soft_body_move_point` | `void` | body: RID, point_index: int, global_position: Vector3 |
| `soft_body_pin_point` | `void` | body: RID, point_index: int, pin: bool |
| `soft_body_remove_all_pinned_points` | `void` | body: RID |
| `soft_body_remove_collision_exception` | `void` | body: RID, body_b: RID |
| `soft_body_set_collision_layer` | `void` | body: RID, layer: int |
| `soft_body_set_collision_mask` | `void` | body: RID, mask: int |
| `soft_body_set_damping_coefficient` | `void` | body: RID, damping_coefficient: float |
| `soft_body_set_drag_coefficient` | `void` | body: RID, drag_coefficient: float |
| `soft_body_set_linear_stiffness` | `void` | body: RID, stiffness: float |
| `soft_body_set_mesh` | `void` | body: RID, mesh: RID |
| `soft_body_set_pressure_coefficient` | `void` | body: RID, pressure_coefficient: float |
| `soft_body_set_ray_pickable` | `void` | body: RID, enable: bool |
| `soft_body_set_simulation_precision` | `void` | body: RID, simulation_precision: int |
| `soft_body_set_space` | `void` | body: RID, space: RID |
| `soft_body_set_state` | `void` | body: RID, state: BodyState, variant: Variant |
| `soft_body_set_total_mass` | `void` | body: RID, total_mass: float |
| `soft_body_set_transform` | `void` | body: RID, transform: Transform3D |
| `soft_body_update_rendering_server` | `void` | body: RID, rendering_server_handler: PhysicsServer3DRenderingServer... |
| `space_create` | `RID` |  |
| `space_get_direct_state` | `PhysicsDirectSpaceState3D` | space: RID |
| `space_get_param` | `float` | space: RID, param: SpaceParameter |
| `space_is_active` | `bool` | space: RID |
| `space_set_active` | `void` | space: RID, active: bool |
| `space_set_param` | `void` | space: RID, param: SpaceParameter, value: float |
| `sphere_shape_create` | `RID` |  |
| `world_boundary_shape_create` | `RID` |  |

### 使用场景
3D物理服务器。底层物理API，直接操作物理体、形状、关节等。

### 示例代码
```gdscript
# 通常通过节点间接使用
var body = PhysicsServer3D.body_create()
PhysicsServer3D.body_set_mode(body, PhysicsServer3D.BODY_MODE_RIGID)
```

### 官方链接
[PhysicsServer3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_physicsserver3d.html)

---

## NavigationServer2D

**继承链：** Object
**描述：** **Experimental:** This class may be changed or removed in future versions.

> NavigationServer2D is the server that handles navigation maps, regions and agents. It does not handle A\* navigation from AStar2D or AStarGrid2D. Maps are divided into regions, which are composed of navigation polygons. Together, they define the traversable areas in the 2D world. **Note:** Most **NavigationServer2D** changes take effect after the next physics frame and not immediately. This includes all changes made to maps, regions or agents by navigation-related nodes in the scene tree or made through scripts. For two regions to be connected to each other, they must share a similar edge. An 

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `agent_create` | `RID` |  |
| `agent_get_avoidance_enabled` | `bool` | agent: RID |
| `agent_get_avoidance_layers` | `int` | agent: RID |
| `agent_get_avoidance_mask` | `int` | agent: RID |
| `agent_get_avoidance_priority` | `float` | agent: RID |
| `agent_get_map` | `RID` | agent: RID |
| `agent_get_max_neighbors` | `int` | agent: RID |
| `agent_get_max_speed` | `float` | agent: RID |
| `agent_get_neighbor_distance` | `float` | agent: RID |
| `agent_get_paused` | `bool` | agent: RID |
| `agent_get_position` | `Vector2` | agent: RID |
| `agent_get_radius` | `float` | agent: RID |
| `agent_get_time_horizon_agents` | `float` | agent: RID |
| `agent_get_time_horizon_obstacles` | `float` | agent: RID |
| `agent_get_velocity` | `Vector2` | agent: RID |
| `agent_has_avoidance_callback` | `bool` | agent: RID |
| `agent_is_map_changed` | `bool` | agent: RID |
| `agent_set_avoidance_callback` | `void` | agent: RID, callback: Callable |
| `agent_set_avoidance_enabled` | `void` | agent: RID, enabled: bool |
| `agent_set_avoidance_layers` | `void` | agent: RID, layers: int |
| `agent_set_avoidance_mask` | `void` | agent: RID, mask: int |
| `agent_set_avoidance_priority` | `void` | agent: RID, priority: float |
| `agent_set_map` | `void` | agent: RID, map: RID |
| `agent_set_max_neighbors` | `void` | agent: RID, count: int |
| `agent_set_max_speed` | `void` | agent: RID, max_speed: float |
| `agent_set_neighbor_distance` | `void` | agent: RID, distance: float |
| `agent_set_paused` | `void` | agent: RID, paused: bool |
| `agent_set_position` | `void` | agent: RID, position: Vector2 |
| `agent_set_radius` | `void` | agent: RID, radius: float |
| `agent_set_time_horizon_agents` | `void` | agent: RID, time_horizon: float |
| `agent_set_time_horizon_obstacles` | `void` | agent: RID, time_horizon: float |
| `agent_set_velocity` | `void` | agent: RID, velocity: Vector2 |
| `agent_set_velocity_forced` | `void` | agent: RID, velocity: Vector2 |
| `bake_from_source_geometry_data` | `void` | navigation_polygon: NavigationPolygon, source_geometry_data: Naviga... |
| `bake_from_source_geometry_data_async` | `void` | navigation_polygon: NavigationPolygon, source_geometry_data: Naviga... |
| `free_rid` | `void` | rid: RID |
| `get_debug_enabled` | `bool` |  |
| `get_maps` | `Array\[RID\]` |  |
| `is_baking_navigation_polygon` | `bool` | navigation_polygon: NavigationPolygon |
| `link_create` | `RID` |  |
| `link_get_enabled` | `bool` | link: RID |
| `link_get_end_position` | `Vector2` | link: RID |
| `link_get_enter_cost` | `float` | link: RID |
| `link_get_map` | `RID` | link: RID |
| `link_get_navigation_layers` | `int` | link: RID |
| `link_get_owner_id` | `int` | link: RID |
| `link_get_start_position` | `Vector2` | link: RID |
| `link_get_travel_cost` | `float` | link: RID |
| `link_is_bidirectional` | `bool` | link: RID |
| `link_set_bidirectional` | `void` | link: RID, bidirectional: bool |
| `link_set_enabled` | `void` | link: RID, enabled: bool |
| `link_set_end_position` | `void` | link: RID, position: Vector2 |
| `link_set_enter_cost` | `void` | link: RID, enter_cost: float |
| `link_set_map` | `void` | link: RID, map: RID |
| `link_set_navigation_layers` | `void` | link: RID, navigation_layers: int |
| `link_set_owner_id` | `void` | link: RID, owner_id: int |
| `link_set_start_position` | `void` | link: RID, position: Vector2 |
| `link_set_travel_cost` | `void` | link: RID, travel_cost: float |
| `map_create` | `RID` |  |
| `map_force_update` | `void` | map: RID |
| `map_get_agents` | `Array\[RID\]` | map: RID |
| `map_get_cell_size` | `float` | map: RID |
| `map_get_closest_point` | `Vector2` | map: RID, to_point: Vector2 |
| `map_get_closest_point_owner` | `RID` | map: RID, to_point: Vector2 |
| `map_get_edge_connection_margin` | `float` | map: RID |
| `map_get_iteration_id` | `int` | map: RID |
| `map_get_link_connection_radius` | `float` | map: RID |
| `map_get_links` | `Array\[RID\]` | map: RID |
| `map_get_obstacles` | `Array\[RID\]` | map: RID |
| `map_get_path` | `PackedVector2Array` | map: RID, origin: Vector2, destination: Vector2, optimize: bool, na... |
| `map_get_random_point` | `Vector2` | map: RID, navigation_layers: int, uniformly: bool |
| `map_get_regions` | `Array\[RID\]` | map: RID |
| `map_get_use_edge_connections` | `bool` | map: RID |
| `map_is_active` | `bool` | map: RID |
| `map_set_active` | `void` | map: RID, active: bool |
| `map_set_cell_size` | `void` | map: RID, cell_size: float |
| `map_set_edge_connection_margin` | `void` | map: RID, margin: float |
| `map_set_link_connection_radius` | `void` | map: RID, radius: float |
| `map_set_use_edge_connections` | `void` | map: RID, enabled: bool |
| `obstacle_create` | `RID` |  |
| `obstacle_get_avoidance_enabled` | `bool` | obstacle: RID |
| `obstacle_get_avoidance_layers` | `int` | obstacle: RID |
| `obstacle_get_map` | `RID` | obstacle: RID |
| `obstacle_get_paused` | `bool` | obstacle: RID |
| `obstacle_get_position` | `Vector2` | obstacle: RID |
| `obstacle_get_radius` | `float` | obstacle: RID |
| `obstacle_get_velocity` | `Vector2` | obstacle: RID |
| `obstacle_get_vertices` | `PackedVector2Array` | obstacle: RID |
| `obstacle_set_avoidance_enabled` | `void` | obstacle: RID, enabled: bool |
| `obstacle_set_avoidance_layers` | `void` | obstacle: RID, layers: int |
| `obstacle_set_map` | `void` | obstacle: RID, map: RID |
| `obstacle_set_paused` | `void` | obstacle: RID, paused: bool |
| `obstacle_set_position` | `void` | obstacle: RID, position: Vector2 |
| `obstacle_set_radius` | `void` | obstacle: RID, radius: float |
| `obstacle_set_velocity` | `void` | obstacle: RID, velocity: Vector2 |
| `obstacle_set_vertices` | `void` | obstacle: RID, vertices: PackedVector2Array |
| `parse_source_geometry_data` | `void` | navigation_polygon: NavigationPolygon, source_geometry_data: Naviga... |
| `query_path` | `void` | parameters: NavigationPathQueryParameters2D, result: NavigationPath... |
| `region_create` | `RID` |  |
| `region_get_connection_pathway_end` | `Vector2` | region: RID, connection: int |
| `region_get_connection_pathway_start` | `Vector2` | region: RID, connection: int |
| `region_get_connections_count` | `int` | region: RID |
| `region_get_enabled` | `bool` | region: RID |
| `region_get_enter_cost` | `float` | region: RID |
| `region_get_map` | `RID` | region: RID |
| `region_get_navigation_layers` | `int` | region: RID |
| `region_get_owner_id` | `int` | region: RID |
| `region_get_random_point` | `Vector2` | region: RID, navigation_layers: int, uniformly: bool |
| `region_get_transform` | `Transform2D` | region: RID |
| `region_get_travel_cost` | `float` | region: RID |
| `region_get_use_edge_connections` | `bool` | region: RID |
| `region_owns_point` | `bool` | region: RID, point: Vector2 |
| `region_set_enabled` | `void` | region: RID, enabled: bool |
| `region_set_enter_cost` | `void` | region: RID, enter_cost: float |
| `region_set_map` | `void` | region: RID, map: RID |
| `region_set_navigation_layers` | `void` | region: RID, navigation_layers: int |
| `region_set_navigation_polygon` | `void` | region: RID, navigation_polygon: NavigationPolygon |
| `region_set_owner_id` | `void` | region: RID, owner_id: int |
| `region_set_transform` | `void` | region: RID, transform: Transform2D |
| `region_set_travel_cost` | `void` | region: RID, travel_cost: float |
| `region_set_use_edge_connections` | `void` | region: RID, enabled: bool |
| `set_debug_enabled` | `void` | enabled: bool |
| `simplify_path` | `PackedVector2Array` | path: PackedVector2Array, epsilon: float |
| `source_geometry_parser_create` | `RID` |  |
| `source_geometry_parser_set_callback` | `void` | parser: RID, callback: Callable |

### 信号
- `map_changed`
- `navigation_debug_changed`

### 使用场景
2D导航服务器。管理导航地图、路径查询、障碍物避让等。

### 示例代码
```gdscript
var map = NavigationServer2D.map_create()
NavigationServer2D.map_set_active(map, true)
var path = NavigationServer2D.map_get_path(map, start, end, true)
```

### 官方链接
[NavigationServer2D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationserver2d.html)

---

## NavigationServer3D

**继承链：** Object
**描述：** **Experimental:** This class may be changed or removed in future versions.

> NavigationServer3D is the server that handles navigation maps, regions and agents. It does not handle A\* navigation from AStar3D. Maps are divided into regions, which are composed of navigation meshes. Together, they define the navigable areas in the 3D world. **Note:** Most **NavigationServer3D** changes take effect after the next physics frame and not immediately. This includes all changes made to maps, regions or agents by navigation-related nodes in the scene tree or made through scripts. For two regions to be connected to each other, they must share a similar edge. An edge is considered 

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `agent_create` | `RID` |  |
| `agent_get_avoidance_enabled` | `bool` | agent: RID |
| `agent_get_avoidance_layers` | `int` | agent: RID |
| `agent_get_avoidance_mask` | `int` | agent: RID |
| `agent_get_avoidance_priority` | `float` | agent: RID |
| `agent_get_height` | `float` | agent: RID |
| `agent_get_map` | `RID` | agent: RID |
| `agent_get_max_neighbors` | `int` | agent: RID |
| `agent_get_max_speed` | `float` | agent: RID |
| `agent_get_neighbor_distance` | `float` | agent: RID |
| `agent_get_paused` | `bool` | agent: RID |
| `agent_get_position` | `Vector3` | agent: RID |
| `agent_get_radius` | `float` | agent: RID |
| `agent_get_time_horizon_agents` | `float` | agent: RID |
| `agent_get_time_horizon_obstacles` | `float` | agent: RID |
| `agent_get_use_3d_avoidance` | `bool` | agent: RID |
| `agent_get_velocity` | `Vector3` | agent: RID |
| `agent_has_avoidance_callback` | `bool` | agent: RID |
| `agent_is_map_changed` | `bool` | agent: RID |
| `agent_set_avoidance_callback` | `void` | agent: RID, callback: Callable |
| `agent_set_avoidance_enabled` | `void` | agent: RID, enabled: bool |
| `agent_set_avoidance_layers` | `void` | agent: RID, layers: int |
| `agent_set_avoidance_mask` | `void` | agent: RID, mask: int |
| `agent_set_avoidance_priority` | `void` | agent: RID, priority: float |
| `agent_set_height` | `void` | agent: RID, height: float |
| `agent_set_map` | `void` | agent: RID, map: RID |
| `agent_set_max_neighbors` | `void` | agent: RID, count: int |
| `agent_set_max_speed` | `void` | agent: RID, max_speed: float |
| `agent_set_neighbor_distance` | `void` | agent: RID, distance: float |
| `agent_set_paused` | `void` | agent: RID, paused: bool |
| `agent_set_position` | `void` | agent: RID, position: Vector3 |
| `agent_set_radius` | `void` | agent: RID, radius: float |
| `agent_set_time_horizon_agents` | `void` | agent: RID, time_horizon: float |
| `agent_set_time_horizon_obstacles` | `void` | agent: RID, time_horizon: float |
| `agent_set_use_3d_avoidance` | `void` | agent: RID, enabled: bool |
| `agent_set_velocity` | `void` | agent: RID, velocity: Vector3 |
| `agent_set_velocity_forced` | `void` | agent: RID, velocity: Vector3 |
| `bake_from_source_geometry_data` | `void` | navigation_mesh: NavigationMesh, source_geometry_data: NavigationMe... |
| `bake_from_source_geometry_data_async` | `void` | navigation_mesh: NavigationMesh, source_geometry_data: NavigationMe... |
| `free_rid` | `void` | rid: RID |
| `get_debug_enabled` | `bool` |  |
| `get_maps` | `Array\[RID\]` |  |
| `get_process_info` | `int` | process_info: ProcessInfo |
| `is_baking_navigation_mesh` | `bool` | navigation_mesh: NavigationMesh |
| `link_create` | `RID` |  |
| `link_get_enabled` | `bool` | link: RID |
| `link_get_end_position` | `Vector3` | link: RID |
| `link_get_enter_cost` | `float` | link: RID |
| `link_get_map` | `RID` | link: RID |
| `link_get_navigation_layers` | `int` | link: RID |
| `link_get_owner_id` | `int` | link: RID |
| `link_get_start_position` | `Vector3` | link: RID |
| `link_get_travel_cost` | `float` | link: RID |
| `link_is_bidirectional` | `bool` | link: RID |
| `link_set_bidirectional` | `void` | link: RID, bidirectional: bool |
| `link_set_enabled` | `void` | link: RID, enabled: bool |
| `link_set_end_position` | `void` | link: RID, position: Vector3 |
| `link_set_enter_cost` | `void` | link: RID, enter_cost: float |
| `link_set_map` | `void` | link: RID, map: RID |
| `link_set_navigation_layers` | `void` | link: RID, navigation_layers: int |
| `link_set_owner_id` | `void` | link: RID, owner_id: int |
| `link_set_start_position` | `void` | link: RID, position: Vector3 |
| `link_set_travel_cost` | `void` | link: RID, travel_cost: float |
| `map_create` | `RID` |  |
| `map_force_update` | `void` | map: RID |
| `map_get_agents` | `Array\[RID\]` | map: RID |
| `map_get_cell_height` | `float` | map: RID |
| `map_get_cell_size` | `float` | map: RID |
| `map_get_closest_point` | `Vector3` | map: RID, to_point: Vector3 |
| `map_get_closest_point_normal` | `Vector3` | map: RID, to_point: Vector3 |
| `map_get_closest_point_owner` | `RID` | map: RID, to_point: Vector3 |
| `map_get_closest_point_to_segment` | `Vector3` | map: RID, start: Vector3, end: Vector3, use_collision: bool = false |
| `map_get_edge_connection_margin` | `float` | map: RID |
| `map_get_iteration_id` | `int` | map: RID |
| `map_get_link_connection_radius` | `float` | map: RID |
| `map_get_links` | `Array\[RID\]` | map: RID |
| `map_get_merge_rasterizer_cell_scale` | `float` | map: RID |
| `map_get_obstacles` | `Array\[RID\]` | map: RID |
| `map_get_path` | `PackedVector3Array` | map: RID, origin: Vector3, destination: Vector3, optimize: bool, na... |
| `map_get_random_point` | `Vector3` | map: RID, navigation_layers: int, uniformly: bool |
| `map_get_regions` | `Array\[RID\]` | map: RID |
| `map_get_up` | `Vector3` | map: RID |
| `map_get_use_edge_connections` | `bool` | map: RID |
| `map_is_active` | `bool` | map: RID |
| `map_set_active` | `void` | map: RID, active: bool |
| `map_set_cell_height` | `void` | map: RID, cell_height: float |
| `map_set_cell_size` | `void` | map: RID, cell_size: float |
| `map_set_edge_connection_margin` | `void` | map: RID, margin: float |
| `map_set_link_connection_radius` | `void` | map: RID, radius: float |
| `map_set_merge_rasterizer_cell_scale` | `void` | map: RID, scale: float |
| `map_set_up` | `void` | map: RID, up: Vector3 |
| `map_set_use_edge_connections` | `void` | map: RID, enabled: bool |
| `obstacle_create` | `RID` |  |
| `obstacle_get_avoidance_enabled` | `bool` | obstacle: RID |
| `obstacle_get_avoidance_layers` | `int` | obstacle: RID |
| `obstacle_get_height` | `float` | obstacle: RID |
| `obstacle_get_map` | `RID` | obstacle: RID |
| `obstacle_get_paused` | `bool` | obstacle: RID |
| `obstacle_get_position` | `Vector3` | obstacle: RID |
| `obstacle_get_radius` | `float` | obstacle: RID |
| `obstacle_get_use_3d_avoidance` | `bool` | obstacle: RID |
| `obstacle_get_velocity` | `Vector3` | obstacle: RID |
| `obstacle_get_vertices` | `PackedVector3Array` | obstacle: RID |
| `obstacle_set_avoidance_enabled` | `void` | obstacle: RID, enabled: bool |
| `obstacle_set_avoidance_layers` | `void` | obstacle: RID, layers: int |
| `obstacle_set_height` | `void` | obstacle: RID, height: float |
| `obstacle_set_map` | `void` | obstacle: RID, map: RID |
| `obstacle_set_paused` | `void` | obstacle: RID, paused: bool |
| `obstacle_set_position` | `void` | obstacle: RID, position: Vector3 |
| `obstacle_set_radius` | `void` | obstacle: RID, radius: float |
| `obstacle_set_use_3d_avoidance` | `void` | obstacle: RID, enabled: bool |
| `obstacle_set_velocity` | `void` | obstacle: RID, velocity: Vector3 |
| `obstacle_set_vertices` | `void` | obstacle: RID, vertices: PackedVector3Array |
| `parse_source_geometry_data` | `void` | navigation_mesh: NavigationMesh, source_geometry_data: NavigationMe... |
| `query_path` | `void` | parameters: NavigationPathQueryParameters3D, result: NavigationPath... |
| `region_bake_navigation_mesh` | `void` | navigation_mesh: NavigationMesh, root_node: Node |
| `region_create` | `RID` |  |
| `region_get_connection_pathway_end` | `Vector3` | region: RID, connection: int |
| `region_get_connection_pathway_start` | `Vector3` | region: RID, connection: int |
| `region_get_connections_count` | `int` | region: RID |
| `region_get_enabled` | `bool` | region: RID |
| `region_get_enter_cost` | `float` | region: RID |
| `region_get_map` | `RID` | region: RID |
| `region_get_navigation_layers` | `int` | region: RID |
| `region_get_owner_id` | `int` | region: RID |
| `region_get_random_point` | `Vector3` | region: RID, navigation_layers: int, uniformly: bool |
| `region_get_transform` | `Transform3D` | region: RID |
| `region_get_travel_cost` | `float` | region: RID |
| `region_get_use_edge_connections` | `bool` | region: RID |
| `region_owns_point` | `bool` | region: RID, point: Vector3 |
| `region_set_enabled` | `void` | region: RID, enabled: bool |
| `region_set_enter_cost` | `void` | region: RID, enter_cost: float |
| `region_set_map` | `void` | region: RID, map: RID |
| `region_set_navigation_layers` | `void` | region: RID, navigation_layers: int |
| `region_set_navigation_mesh` | `void` | region: RID, navigation_mesh: NavigationMesh |
| `region_set_owner_id` | `void` | region: RID, owner_id: int |
| `region_set_transform` | `void` | region: RID, transform: Transform3D |
| `region_set_travel_cost` | `void` | region: RID, travel_cost: float |
| `region_set_use_edge_connections` | `void` | region: RID, enabled: bool |
| `set_active` | `void` | active: bool |
| `set_debug_enabled` | `void` | enabled: bool |
| `simplify_path` | `PackedVector3Array` | path: PackedVector3Array, epsilon: float |
| `source_geometry_parser_create` | `RID` |  |
| `source_geometry_parser_set_callback` | `void` | parser: RID, callback: Callable |

### 信号
- `avoidance_debug_changed`
- `map_changed`
- `navigation_debug_changed`

### 使用场景
3D导航服务器。管理3D导航地图、路径查询、区域等。

### 示例代码
```gdscript
var path = NavigationServer3D.map_get_path(
    get_world_3d().navigation_map,
    start_pos, end_pos, true
)
for point in path:
    print(point)
```

### 官方链接
[NavigationServer3D 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_navigationserver3d.html)

---

## ResourceLoader

**继承链：** Object
**描述：** A singleton for loading resource files.

> A singleton used to load resource files from the filesystem. It uses the many ResourceFormatLoader classes registered in the engine (either built-in or from a plugin) to load files into memory and convert them to a format that can be used by the engine. **Note:** You have to import the files into the engine first to load them using load. If you want to load Image s at run-time, you may use Image.load. If you want to import audio files, you can use the snippet described in AudioStreamMP3.data.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `add_resource_format_loader` | `void` | format_loader: ResourceFormatLoader, at_front: bool = false |
| `exists` | `bool` | path: String, type_hint: String = "" |
| `get_dependencies` | `PackedStringArray` | path: String |
| `get_recognized_extensions_for_type` | `PackedStringArray` | type: String |
| `get_resource_uid` | `int` | path: String |
| `has_cached` | `bool` | path: String |
| `load` | `Resource` | path: String, type_hint: String = "", cache_mode: CacheMode = 1 |
| `load_threaded_get` | `Resource` | path: String |
| `load_threaded_get_status` | `ThreadLoadStatus` | path: String, progress: Array = [] |
| `load_threaded_request` | `Error` | path: String, type_hint: String = "", use_sub_threads: bool = false... |
| `remove_resource_format_loader` | `void` | format_loader: ResourceFormatLoader |
| `set_abort_on_missing_resources` | `void` | abort: bool |

### 使用场景
资源加载器。管理资源的异步加载、缓存查询等。

### 示例代码
```gdscript
# 异步加载
ResourceLoader.load_threaded_request("res://big_scene.tscn")
func _process(_delta):
    var progress = []
    var status = ResourceLoader.load_threaded_get_status("res://big_scene.tscn", progress)
    if status == ResourceLoader.ThreadLoadStatus.THREAD_LOAD_LOADED:
        var scene = ResourceLoader.load_threaded_get("res://big_scene.tscn")
```

### 官方链接
[ResourceLoader 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_resourceloader.html)

---

## ClassDB

**继承链：** Object
**描述：** A class information repository.

> Provides access to metadata stored for every available class.

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `can_instantiate` | `bool` | class: StringName |
| `class_exists` | `bool` | class: StringName |
| `class_get_enum_constants` | `PackedStringArray` | class: StringName, enum: StringName, no_inheritance: bool = false |
| `class_get_enum_list` | `PackedStringArray` | class: StringName, no_inheritance: bool = false |
| `class_get_integer_constant` | `int` | class: StringName, name: StringName |
| `class_get_integer_constant_enum` | `StringName` | class: StringName, name: StringName, no_inheritance: bool = false |
| `class_get_integer_constant_list` | `PackedStringArray` | class: StringName, no_inheritance: bool = false |
| `class_get_method_argument_count` | `int` | class: StringName, method: StringName, no_inheritance: bool = false |
| `class_get_method_list` | `Array\[Dictionary\]` | class: StringName, no_inheritance: bool = false |
| `class_get_property` | `Variant` | object: Object, property: StringName |
| `class_get_property_default_value` | `Variant` | class: StringName, property: StringName |
| `class_get_property_list` | `Array\[Dictionary\]` | class: StringName, no_inheritance: bool = false |
| `class_get_signal` | `Dictionary` | class: StringName, signal: StringName |
| `class_get_signal_list` | `Array\[Dictionary\]` | class: StringName, no_inheritance: bool = false |
| `class_has_enum` | `bool` | class: StringName, name: StringName, no_inheritance: bool = false |
| `class_has_integer_constant` | `bool` | class: StringName, name: StringName |
| `class_has_method` | `bool` | class: StringName, method: StringName, no_inheritance: bool = false |
| `class_has_signal` | `bool` | class: StringName, signal: StringName |
| `class_set_property` | `Error` | object: Object, property: StringName, value: Variant |
| `get_class_list` | `PackedStringArray` |  |
| `get_inheriters_from_class` | `PackedStringArray` | class: StringName |
| `get_parent_class` | `StringName` | class: StringName |
| `instantiate` | `Variant` | class: StringName |
| `is_class_enabled` | `bool` | class: StringName |
| `is_class_enum_bitfield` | `bool` | class: StringName, enum: StringName, no_inheritance: bool = false |
| `is_parent_class` | `bool` | class: StringName, inherits: StringName |

### 信号
- `class_get_signal_list`

### 使用场景
类数据库。查询引擎所有类的信息，如属性、方法、信号等。用于反射。

### 示例代码
```gdscript
var classes = ClassDB.get_class_list()
print(ClassDB.class_exists(&"Node"))
var methods = ClassDB.class_get_method_list(&"Sprite2D")
var parent = ClassDB.get_parent_class(&"Sprite2D")  # -> CanvasItem
```

### 官方链接
[ClassDB 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_classdb.html)

---

## JSON

**继承链：** Resource > RefCounted > Object
**描述：** Helper class for creating and parsing JSON data.

> The **JSON** class enables all data types to be converted to and from a JSON string. This is useful for serializing data, e.g. to save to a file or send over the network. stringify is used to convert any data type into a JSON string. parse is used to convert any existing JSON data into a Variant that can be used within Godot. If successfully parsed, use data to retrieve the Variant, and use typeof to check if the Variant's type is what you expect. JSON Objects are converted into a Dictionary, but JSON data can be used to store Array s, numbers, String s and even just a boolean. **Example**\ ::

### 属性
| 属性名 | 类型 | 默认值 |
|--------|------|--------|
| `data` | `Variant` | `null` |

### 方法
| 方法名 | 返回类型 | 参数 |
|--------|----------|------|
| `get_error_line` | `int` |  |
| `get_error_message` | `String` |  |
| `get_parsed_text` | `String` |  |
| `parse` | `Error` | json_text: String, keep_text: bool = false |
| `parse_string` | `Variant` | json_string: String |
| `stringify` | `String` | data: Variant, indent: String = "", sort_keys: bool = true, full_pr... |

### 使用场景
JSON解析/序列化。用于数据存档、网络通信、配置文件等。

### 示例代码
```gdscript
# 序列化
var data = {"name": "Player", "level": 5, "items": ["sword", "shield"]}
var json_str = JSON.stringify(data, "  ")

# 反序列化
var json = JSON.new()
var error = json.parse(json_str)
if error == OK:
    var result = json.data
    print(result.name)
```

### 官方链接
[JSON 文档](https://docs.godotengine.org/zh-cn/4.x/classes/class_json.html)

---

---

> 本文档由 Godot 4.3 官方文档自动生成。如需最新信息，请参考 [Godot 官方文档](https://docs.godotengine.org/zh-cn/4.x/)。