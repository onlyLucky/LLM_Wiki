# Godot 引擎架构

> 本文旨在介绍Godot引擎源代码的全局架构，并提供有关在 C++ 端扩展/修复引擎的实用建议。
>
> 来源：https://docs.godotengine.org/zh-cn/4.x/engine_details/architecture/index.html

---

## 目录

- [Godot 架构概览](#godot-架构概览)
- [常见的引擎方法和宏](#常见的引擎方法和宏)
- [核心类型](#核心类型)
- [Variant 类](#variant-类)
- [Object 类](#object-类)
- [继承类树](#继承类树)
- [内部渲染架构](#内部渲染架构)
- [2D 坐标系与 2D 变换](#2d-坐标系与-2d-变换)
- [单元测试](#单元测试)

---

## Godot 架构概览

下图描述了 Godot 架构中最重要的几个方面。其目的并非详尽无遗，只是为了提供一个高层次的主要组件及其相互关系的概览。

Godot 架构分为三层（从上到下：场景层、服务器层、驱动及平台接口层），Core 和 Main 在右侧单独列出，因为它们与所有层都有交互。

### 场景层

场景层是 Godot 架构的最高层级，它提供了场景系统，这是构建和结构化你的应用程序或游戏的主要方式。更多信息请参见 SceneTree 和 Node。

对应源代码：`/scene/*`

### 服务器层

服务器组件实现了 Godot 的大部分子系统（渲染、音频、物理等）。它们是单例对象，在引擎启动时进行初始化。

> 参考文章：[为什么 Godot 要使用服务器和 RID？](https://godotengine.org/article/why-does-godot-use-servers-and-rids)

对应源代码：`/servers/*`

### 驱动及平台接口层

这一层抽象了底层的平台特定细节，其中包括图形 API 的驱动程序、音频后端以及操作系统接口（所有特定于平台的 OS 和 DisplayServer 实现）。

对应源代码：`/drivers/*` 和 `/platform/*`

### 核心

引擎的核心包含了整个引擎使用的基础功能和数据结构，例如 Object 和 ClassDB、内存管理、容器、文件 I/O、Variant 以及其他实用工具。

对应源代码：`/core/*`

### 主要

主组件负责初始化和管理引擎的生命周期，包括启动、关闭和主循环。更多细节请参见 MainLoop。

对应源代码：`/main/*`

---

## 常见的引擎方法和宏

Godot的C++代码库使用了几十种自定义方法和宏, 这些方法和宏几乎在每个文件中都会用到。本页面向初学者, 但对那些编写自定义C++模块的人也很有用。

### 打印文本

```cpp
// Prints a message to standard output.
print_line("Message");

// Non-String arguments are automatically converted to String for printing.
// If passing several arguments, they will be concatenated together with a
// space between each argument.
print_line("There are", 123, "nodes");

// Prints a message to standard output, but only when the engine
// is started with the `--verbose` command line argument.
print_verbose("Message");

// Prints a rich-formatted message using BBCode to standard output.
// This supports a subset of BBCode tags supported by RichTextLabel
// and will also appear formatted in the editor Output panel.
// On Windows, this requires Windows 10 or later to work in the terminal.
print_line_rich("[b]Bold[/b], [color=red]Red text[/color]")

// Prints a formatted error or warning message with a trace.
ERR_PRINT("Message");
WARN_PRINT("Message");

// Prints an error or warning message only once per session.
// This can be used to avoid spamming the console output.
ERR_PRINT_ONCE("Message");
WARN_PRINT_ONCE("Message");
```

如果你需要在信息中添加占位符, 请使用下面描述的格式字符串。

### 格式化字符串

`vformat()` 函数返回一个格式化的 String。它的行为方式类似于C语言的 `sprintf()`:

```cpp
vformat("My name is %s.", "Godette");
vformat("%d bugs on the wall!", 1234);
vformat("Pi is approximately %f.", 3.1416);

// Converts the resulting String into a `const char *`.
// You may need to do this if passing the result as an argument
// to a method that expects a `const char *` instead of a String.
vformat("My name is %s.", "Godette").utf8().get_data();
```

在大多数情况下, 尽量使用 `vformat()` 而不是字符串连接, 因为这样可以使代码更易读。

### 将整数或浮点数转换为字符串

使用 `print_line()` 打印数字时不需要，但是其他情况下可能仍然需要进行手动转换。

```cpp
// Stores the string "42" using integer-to-string conversion.
String int_to_string = itos(42);

// Stores the string "123.45" using real-to-string conversion.
String real_to_string = rtos(123.45);
```

### 国际化字符串

Godot 的代码库中有两种国际化：

- `TTR()`：**编辑器（"工具"）的翻译**只会在编辑器中处理。如果用户在项目中使用了相同的文本，为这个文本提供翻译不会发生翻译。贡献引擎代码时，可本地化的字符串一般就使用这个宏。
- `RTR()`：如果在**运行时翻译**中提供了某个字符串的翻译，就会在项目中自动进行本地化。仅在编辑器中使用的代码不应该用这种翻译。

```cpp
// Returns the translated string that matches the user's locale settings.
// Translations are located in `editor/translations`.
// The localization template is generated automatically; don't modify it.
TTR("Exit the editor?");
```

要在可本地化字符串中插入占位符, 请将本地化宏包裹在 `vformat()` 的调用中:

```cpp
String file_path = "example.txt";
vformat(TTR("Couldn't open \"%s\" for reading."), file_path);
```

> **备注**：当同时使用 `vformat()` 和翻译宏时, 总是将翻译宏包裹在 `vformat()` 中, 而不是相反。否则, 字符串永远不会与翻译匹配, 因为当它传递给TranslationServer时, 它的占位符已经被替换了。

### 限制值

Godot提供了宏, 用于用下限(`MAX`), 上限(`MIN`)或两者都有(`CLAMP`)的值进行限定:

```cpp
int a = 3;
int b = 5;

MAX(b, 6); // 6
MIN(2, a); // 2
CLAMP(a, 10, 30); // 10
```

这适用于任何可以与其他值进行比较的类型(如 `int` 和 `float`)。

### 微型基准测试

如果你想对一段代码进行基准测试, 但不知道如何使用分析器, 可以使用这个代码段:

```cpp
uint64_t begin = Time::get_singleton()->get_ticks_usec();

// Your code here...

uint64_t end = Time::get_singleton()->get_ticks_usec();
print_line(vformat("Snippet took %d microseconds", end - begin));
```

这将打印从 `begin` 执行到 `end` 声明之间的花费时间。

> **备注**：如果还没有 `#include "core/os/time.h"` 就可能需要添加这一行。当打开一个pull request时, 如果之前没有这个代码, 请确保删除这个代码段以及include。

### 获取项目/编辑器设置

有四种宏可供选择：

```cpp
// Returns the specified project setting's value,
// defaulting to `false` if it doesn't exist.
GLOBAL_DEF("section/subsection/value", false);

// Returns the specified editor setting's value,
// defaulting to "Untitled" if it doesn't exist.
EDITOR_DEF("section/subsection/value", "Untitled");
```

如果在其他地方已经指定了默认值，就不要再指定了，以免重复：

```cpp
// Returns the value of the project setting.
GLOBAL_GET("section/subsection/value");
// Returns the value of the editor setting.
EDITOR_GET("section/subsection/value");
```

建议每个设置只使用一次 `GLOBAL_DEF`/`EDITOR_DEF` 并在引用它的所有其他位置使用 `GLOBAL_GET`/`EDITOR_GET`。

### 错误宏

Godot 提供了许多错误宏，可以更方便地报告错误。

> **警告**：错误宏中的条件和 GDScript 内置的 `assert()` 函数的**相反**。如果其中的条件计算结果为 `true` 而不是 `false`，就会认为出现了错误。

> **备注**：此处仅记录具有自定义消息的变体，因为新的贡献应该始终使用这些变体。确保提供的自定义消息包括足够的信息，让不了解 C++ 的人也可以诊断问题。如果某个方法拿到了无效的参数，则可以打印有问题的无效值以简化调试。

对于不需要显示可读性信息的内部错误检查，请删除宏名末尾的 `_MSG`，并且不要提供信息参数。

另外，总是尽量返回可处理的数据，这样引擎才能保持良好的运行。

```cpp
// Conditionally prints an error message and returns from the function.
// Use this in methods which don't return a value.
ERR_FAIL_COND_MSG(!mesh.is_valid(), vformat("Couldn't load mesh at: %s", path));

// Conditionally prints an error message and returns `0` from the function.
// Use this in methods which must return a value.
ERR_FAIL_COND_V_MSG(rect.x < 0 || rect.y < 0, 0,
		"Couldn't calculate the rectangle's area.");

// Prints an error message if `index` is < 0 or >= `SomeEnum::QUALITY_MAX`,
// then returns from the function.
ERR_FAIL_INDEX_MSG(index, SomeEnum::QUALITY_MAX,
		vformat("Invalid quality: %d. See SomeEnum for allowed values.", index));

// Prints an error message if `index` is < 0 >= `some_array.size()`,
// then returns `-1` from the function.
ERR_FAIL_INDEX_V_MSG(index, some_array.size(), -1,
		vformat("Item %d is out of bounds.", index));

// Unconditionally prints an error message and returns from the function.
// Only use this if you need to perform complex error checking.
if (!complex_error_checking_routine()) {
	ERR_FAIL_MSG("Couldn't reload the filesystem cache.");
}

// Unconditionally prints an error message and returns `false` from the function.
// Only use this if you need to perform complex error checking.
if (!complex_error_checking_routine()) {
	ERR_FAIL_V_MSG(false, "Couldn't parse the input arguments.");
}

// Crashes the engine. This should generally never be used
// except for testing crash handling code. Godot's philosophy
// is to never crash, both in the editor and in exported projects.
CRASH_NOW_MSG("Can't predict the future! Aborting.");
```

---

## 核心类型

Godot 具有构成其核心的丰富的类和模板集，并且所有内容都基于它们构建。

这份参考将试着按顺序列出它们，使之更容易被理解。

### 内存分配

Godot 有许多确保内存安全和跟踪内存使用情况的技巧。因此，不应使用常规的 C 和 C++ 库调用。取而代之的是几个替代方案。

Godot提供了一些宏可以用来处理C风格的内存分配:

```cpp
memalloc(size)
memrealloc(pointer)
memfree(pointer)
```

这些等效于C标准库中惯用的 `malloc()`、`realloc()`和`free()`。

这些宏可以用来处理C++风格的内存分配:

```cpp
memnew(Class)
memnew(Class(args))
memdelete(instance)

memnew_arr(Class, amount)
memdelete_arr(pointer_to_array)
```

这些分别等效于`new`、`delete`、`new[]`和`delete[]`。

`memnew`/`memdelete` 还利用了一些 C++ 的"魔法"来自动调用后初始化（post-init）和预释放（pre-release）函数。例如，这用于在对象刚创建后以及即将被删除前通知它们。

参考：`core/os/memory.h`

### 容器

Godot 提供了自己的容器，代码库中通常不使用 `std::string`、`std::vector` 等 STL 容器。详见 [为什么 Godot 不使用 STL（标准模板库）？](https://docs.godotengine.org/zh-cn/4.x/about/faq.html#doc-faq-why-not-stl)。

> :scroll: 图标表示该类型属于 Variant。这意味着它可以作为 API 的方法参数和返回值暴露给脚本。

| Godot 数据类型 | 最接近的 C++ STL 数据类型 | 注释 |
|---|---|---|
| String :scroll: | std::string | **请作为"默认"字符串类型使用。**String 使用 UTF-32 编码，字符大小固定，从而简化了处理过程。 |
| Vector | std::vector | **请作为"默认"动态数组类型使用。**采用写时复制（COW）机制。这意味着速度通常较慢，但可以几乎零成本地进行复制操作。不需要 COW、性能敏感时请改用 LocalVector。 |
| HashSet | std::unordered_set | **请作为"默认"集合类型使用。** |
| AHashMap | std::unordered_map | **请作为"默认"映射类型使用。**不保持插入顺序。请注意，指向映射内部的指针和迭代器在映射发生修改后均不稳定。如果需要支持这些功能，请改用 HashMap。 |
| StringName :scroll: | std::string | 采用了字符串驻留（string interning）技术，以实现快速的比较操作。推荐将其用于那些在引擎多个位置被频繁引用的静态字符串。 |
| LocalVector | std::vector | 语义上接近 std::vector，不使用写时复制（COW），因此比 Vector 快。不需要用到轻量复制时优先于 Vector 使用。 |
| Array :scroll: | std::vector | 值（Values）可以是任意的 Variant（变体）类型，不强制要求静态类型。采用共享引用计数机制，类似于 std::shared_ptr。底层内部使用的是 Vector<Variant>。 |
| TypedArray :scroll: | std::vector | 它是 Array 的子类，但对其中的元素有静态类型限制。注意不要把它和 Packed*Array 搞混了，Packed*Array 在内部实际上是一个 Vector。 |
| Packed*Array :scroll: | std::vector | 这是 Vector 的一个别名，比如 PackedColorArray = Vector<Color>。目前只有有限种类的打包数组类型可供选择（如果需要其他类型，请使用 TypedArray）。 |
| List | std::list | 链表类型。通常比其他数组/向量类型更慢。在新代码中建议优先使用其他类型，除非使用 List 能避免类型转换需求。 |
| FixedVector | std::array | 一种具有固定容量的向量（更类似于 boost::container::static_vector）。这种容器类型比其他类似向量的类型更高效，因为它不会进行任何堆内存分配。 |
| Span | std::span | 表示对于一段内存连续的数组的只读访问，并且无需复制任何数据。注意 Span 被设计为高性能 API：它不像其它 Godot 容器一样执行参数正确性检查。请小心使用。Span 可以基于大多数数组形式的容器进行创建（例如 vector.span()）。 |
| RBSet | std::set | 使用红黑树来实现更快的访问。 |
| VSet | std::flat_set | 采用了写时复制（COW）的语义。这意味着它在一般情况下速度会稍慢一些，但几乎可以零成本地进行复制。由于 VSet 的性能优势目前尚未得到证实，所以更推荐优先使用其他类型。 |
| HashMap | std::unordered_map | 一种防御性（稳健但速度较慢）的映射（map）类型。它会保留元素的插入顺序。在发生数据变动时，指向键和值的指针以及迭代器都能保持稳定。当你需要用到上述这些特性时，请使用这种映射类型；在其他情况下，请使用 AHashMap。 |
| RBMap | std::map | 一种使用红黑树来查找键的 Map 类型。由于 RBMap 的性能优势尚未得到证实，因此建议优先使用其他类型。 |
| Dictionary :scroll: | std::unordered_map | 键和值可以是任意的 Variant 类型，不强制要求静态类型。采用共享引用计数机制，类似于 std::shared_ptr。会保留元素的插入顺序。底层内部使用的是 HashMap<Variant>。 |
| TypedDictionary :scroll: | std::unordered_map | Dictionary 的子类，对键和值进行了静态类型约束。 |
| Pair | std::pair | 它用来存储单一的一对数据。另外也可以看看同一个文件里的 KeyValue，不过 KeyValue 里的键是只读的。 |

#### 重定位安全性

Godot 的容器（Containers）假设其内部元素是 trivially relocatable。

这意味着，如果你在里面存储的数据类型包含指向自身的指针，或者由于其他原因导致它不是 trivially relocatable，Godot 可能会崩溃。不过请注意，存储**指向**那些"非简单可重定位"对象（比如某些 Object 的子类）的指针，则是完全没有问题的，并且受到支持。

之所以要假设（某类型）具备平凡可重定位性，是因为这样我们就能利用一些重要的优化技术，比如直接通过 `memcpy` 或 `realloc` 来进行重定位。

### 多线程 / 并发

Godot 的所有容器（Containers）都不是线程安全的。如果你预计会有多个线程同时访问它们，就必须自行使用多线程保护机制。

| Godot 数据类型 | 最接近的 C++ STL 数据类型 | 注释 |
|---|---|---|
| Mutex | std::recursive_mutex | 递归互斥锁类型。请使用 `MutexLock lock(mutex)` 语法来对它进行加锁。 |
| BinaryMutex | std::mutex | 非递归互斥锁类型。请使用 `MutexLock lock(mutex)` 语法来对它进行加锁。 |
| RWLock | std::shared_mutex | 一种能识别"读/写"状态的互斥锁类型。请使用 `RWLockRead lock(mutex)` 或 `RWLockWrite lock(mutex)` 的语法来对它进行加锁。 |
| SafeBinaryMutex | std::mutex | 一种可以与 ConditionVariable 搭配使用的递归互斥锁类型。使用 `MutexLock lock(mutex)` 来对它进行加锁。 |
| ConditionVariable | std::condition_variable | 条件变量类型，需配合 SafeBinaryMutex 一起使用。 |
| Semaphore | std::counting_semaphore | 计数 semaphore 类型。 |
| SafeNumeric | std::atomic | 专为数字设计的、基于模板的原子类型。 |
| SafeFlag | std::atomic_bool | 布尔原子类型。 |
| SafeRefCount | std::atomic | 这是一种专为引用计数设计的原子类型。如果当前的引用计数已经是 0，它将拒绝再执行递增操作。 |

### 数学类型

在 `core/math` 目录中有一些线性代数相关的类型。

### 节点路径

这是一种特殊的数据类型，专门用来存储场景树中的路径，并以一种高度优化的方式来引用它们。

参考：`core/string/node_path.h`

### RID

RID 指的是资源 ID（Resource IDs）。服务器（Servers）使用它们来引用存储在内部的数据。RID 是"不透明"的，这意味着它们所引用的数据无法被直接访问。此外，RID 是独一无二的，即使它们引用的数据类型完全不同，也不会重复。

参考：`core/templates/rid.h`

---

## Variant 类

### 关于

Variant 即可变体，是 Godot 中最重要的数据类型。Variant 在 64 位平台上仅占 24 个字节（32 位平台上则为 20 个字节），几乎可以存储引擎中的所有数据类型。需要长期存在的信息很少会用 Variant 来存储，它的主要用途是数据的通讯、编辑、序列化等对数据进行移动的操作。

Variant 可以：

- 存储几乎所有数据类型。
- 针对若干 variant 执行操作（GDScript 使用 Variant 作为原子/原生数据类型）。
- 求哈希值，与其他可变体值进行快速比较。
- 用于在数据类型之间安全地转换。
- 用于抽象调用方法及其参数（Godot 通过 variant 导出所有函数）。
- 用于推迟调用或在线程之间交换数据。
- 被序列化为二进制并存储到磁盘, 或通过网络传输。
- 被序列化为文本, 并将其用于打印值和可编辑的设置。
- 用作导出的属性, 因此编辑器可以对其进行普通地编辑。
- 用于字典、数组、解析器等。

基本上, 由于有了Variant类, 编写Godot本身就容易得多, 因为它可以轻松完成C++不常见的高度动态的结构。

> **备注**：除了 Nil 和 Object 之外，Variant 中的所有类型都**不能**为 `null`，必须始终存储有效值。因此，Variant 中的这些类型被称为不可空类型。
>
> _Nil_ 是一种 Variant 类型，只能存储 `null` 值。因此，尽管 Nil 和 Object 以外的所有 Variant 类型均不可为空，Variant 仍然可以包含 `null` 值。

### 可变体类型列表

Variant 中可以使用这些类型：

| 类型 | 注意 |
|---|---|
| Nil（只能存储 null） | 可空的类型 |
| bool | |
| int | |
| float | |
| String | |
| Vector2 | |
| Vector2i | |
| Rect2 | 2D 版的 AABB |
| Rect2i | |
| Vector3 | |
| Vector3i | |
| Transform2D | |
| Vector4 | |
| Vector4i | |
| Plane | |
| Quaternion | |
| AABB | 3D 版的 Rect2 |
| Basis | |
| Transform3D | |
| Projection | |
| Color | |
| StringName | |
| NodePath | |
| RID | |
| Object | 可空的类型 |
| Callable | |
| Signal | |
| Dictionary | |
| Array | |
| PackedByteArray | |
| PackedInt32Array | |
| PackedInt64Array | |
| PackedFloat32Array | |
| PackedFloat64Array | |
| PackedStringArray | |
| PackedVector2Array | |
| PackedVector3Array | |
| PackedColorArray | |
| PackedVector4Array | |

### 容器：Array 和 Dictionary

Array 和 Dictionary 都是使用 Variant 来实现的。字典可以将任意数据类型的键与任意其他数据类型进行匹配。数组则只是简单地持有由 Variant 组成的序列。当然，Variant 本身也可以包含一个字典或数组，这让它的灵活性变得极高。

对容器的修改会同时改变所有指向它的引用。如果需要进行多线程访问，应当创建一个互斥锁（Mutex）来对它进行加锁保护。

参考：
- `core/variant/dictionary.h`
- `core/variant/array.h`

---

## Object 类

### 一般定义

Object 是几乎所有事物的基类。Godot 中的大多数类都直接或间接地继承自它。声明它们非常简单，只需要使用一个类似这样的宏：

```cpp
class CustomObject : public Object {
	GDCLASS(CustomObject, Object); // This is required to inherit from Object.
};
```

Object 自带了大量的内置功能，比如反射（reflection）和可编辑的属性（editable properties）：

```cpp
CustomObject *obj = memnew(CustomObject);
print_line("Object class: ", obj->get_class()); // print object class

OtherClass *obj2 = Object::cast_to<OtherClass>(obj); // Converting between classes, similar to dynamic_cast
```

参考：`core/object/object.h`

### 注册对象类

大多数 `Object` 的子类都是通过调用 `GDREGISTER_CLASS` 来注册的。

```cpp
GDREGISTER_CLASS(MyCustomClass)
```

这会将它作为一个公开的命名类注册到 `ClassDB` 中，从而允许该类被脚本、代码或反序列化过程实例化。需要注意的是，被注册为 `GDREGISTER_CLASS` 的类，应该做好随时被自动实例化或释放的准备，比如可能会被编辑器或者文档系统自动调用。

除了 `GDREGISTER_CLASS` 之外，还有几种其他的"私有化"模式：

```cpp
// Registers the class publicly, but prevents automatic instantiation through ClassDB.
GDREGISTER_VIRTUAL_CLASS(MyCustomClass);

// Registers the class publicly, but prevents all instantiation through ClassDB.
GDREGISTER_ABSTRACT_CLASS(MyCustomClass);

// Registers the class in ClassDB, but marks it as private,
// such that it is not visible to scripts or extensions.
GDREGISTER_INTERNAL_CLASS(MyCustomClass);

// Registers the class such that it is only available at runtime (but not in the editor).
GDREGISTER_RUNTIME_CLASS(MyCustomClass);
```

你也可以使用 `GDSOFTCLASS(MyCustomClass, SuperClass)` 来代替 `GDCLASS(MyCustomClass, SuperClass)`。通过这种方式定义的类，根本不会在 ClassDB 中进行注册。

### 注册绑定

派生自 Object 的类，可以重写一个名为 `static void _bind_methods()`。当该类被注册到引擎时，这个静态函数就会被调用，用来注册该类所有的对象方法、属性、常量等等。它只会被调用一次。

在 `_bind_methods` 里面, 注册函数是一个:

```cpp
ClassDB::bind_method(D_METHOD("methodname", "arg1name", "arg2name", "arg3name"), &MyCustomType::method);
```

参数的默认值可以在（参数列表的）末尾传入:

```cpp
ClassDB::bind_method(D_METHOD("methodname", "arg1name", "arg2name", "arg3name"), &MyCustomType::method, DEFVAL(-1), DEFVAL(-2));
```

默认值必须按照它们声明的顺序来提供，跳过那些必填的参数，然后只为可选的参数提供默认值。

`D_METHOD` 是一个宏，它将 "methodname" 转换为 StringName 以提高效率。

参考：`core/object/class_db.h`

### 常量

类通常有枚举, 例如:

```cpp
enum SomeMode {
   MODE_FIRST,
   MODE_SECOND
};
```

为了让这些枚举在绑定到方法时能够正常工作，必须将它们声明为可转换为 int 的类型。为此，引擎提供了一个宏:

```cpp
VARIANT_ENUM_CAST(MyClass::SomeMode); // now functions that take SomeMode can be bound.
```

常量也可以绑定在 `_bind_methods` 中:

```cpp
BIND_CONSTANT(MODE_FIRST);
BIND_CONSTANT(MODE_SECOND);
```

### 属性（设置/获取）

对象导出属性, 这些属性可用于:

- 序列化和反序列化对象。
- 为Object派生类创建可编辑值列表。

属性通常由 PropertyInfo() 类来定义:

```cpp
PropertyInfo(type, name, hint, hint_string, usage_flags)
```

例如：

```cpp
PropertyInfo(Variant::INT, "amount", PROPERTY_HINT_RANGE, "0,49,1", PROPERTY_USAGE_EDITOR)
```

这是一个名为 "amount" 的整数属性。它的提示类型被设定为范围，该范围从 0 到 49，步进为 1。

从 `_bind_methods()` 开始, 只要存在set/get函数, 就可以创建和绑定属性:

```cpp
ADD_PROPERTY(PropertyInfo(Variant::INT, "amount"), "set_amount", "get_amount")
```

### 使用 `_set`/`_get`/`_get_property_list` 绑定属性

当需要更大的灵活性时(即在上下文中添加或删除属性), 存在另一种创建属性的方法。

可以在 Object 派生类中重写以下函数:

```cpp
protected:
    void _get_property_list(List<PropertyInfo> *r_props) const;      // return list of properties
    bool _get(const StringName &p_property, Variant &r_value) const; // return true if property was found
    bool _set(const StringName &p_property, const Variant &p_value); // return true if property was found
```

### 信号

对象可以定义一组信号（类似于其他编程语言中的 Delegate/委托）。

```cpp
// This is the function signature:
//
// Error connect(const StringName &p_signal, const Callable &p_callable, uint32_t p_flags = 0)
//
// For example:
obj->connect("signal_name_here", callable_mp(this, &MyCustomType::method), CONNECT_DEFERRED);
```

`callable_mp` 是一个宏，用来创建一个指向成员函数的自定义可调用函数指针。

使用 `ADD_SIGNAL` 宏在 `_bind_methods` 中添加信号到类中:

```cpp
ADD_SIGNAL(MethodInfo("been_killed"))
```

### "对象所有权" 和 "类型转换"

对象都是在堆（heap）上分配内存的。它们主要有两种不同的所有权模型：

- 继承自 `RefCounted` 的对象，是采用引用计数来管理内存的。
- 所有其他对象，都采用手动内存管理。

当你拿到一个通过 `Object *` 传给你的对象，但不确定它到底是不是 `RefCounted` 时，如果你需要把它保存下来，你应该存储它的 `ObjectID` 而不是直接存指针。

当一个对象通过 Variant 传递给你时——尤其是在使用延迟回调的情况下——很有可能等到你的函数真正开始执行时，里面包含的 `Object *` 已经被释放掉了。因此，你应该使用 `get_validated_object`:

```cpp
void do_something(Variant p_variant) {
	Object *object = p_variant.get_validated_object();
	ERR_FAIL_NULL(object);
}
```

#### 手动内存管理

需要手动管理内存的对象，是通过 `memnew` 来创建，并使用 `memdelete` 来释放的：

```cpp
Node *node = memnew(Node);
// ...
memdelete(node);
node = nullptr;
```

当你存储那些并非由你独占所有权的对象时，你应该保存它的 `ObjectID`，而不是直接保存指针：

```cpp
Node *node = memnew(Node);
ObjectID node_id = node.get_instance_id();
// ...
Object *maybe_node = ObjectDB::get_instance(node_id);
ERR_FAIL_NULL(maybe_node); // The node may have been freed between calls.
```

#### RefCounted 内存管理

RefCounted 的子类采用引用计数语义来进行内存管理。

它们需要使用 `memnew` 来创建，并且应该保存在 `Ref` 实例中。当最后一个 `Ref` 实例被销毁时，该对象会自动自我销毁。

```cpp
class MyRefCounted: public RefCounted {
	GDCLASS(MyReference, RefCounted);
};

Ref<MyRefCounted> my_ref = memnew(MyRefCounted);
// ...
my_ref->get_class_name();
```

你永远不应该对 `RefCounted` 的子类调用 `memdelete`，因为该对象可能还有其他拥有者。

你也绝对不应该使用裸指针来存储 `RefCounted` 的子类。

参考：`core/object/ref_counted.h`

#### 动态转型

Godot在Object派生类之间提供动态转换:

```cpp
void some_func(Object *p_object) {
	Button *button = Object::cast_to<Button>(p_object);
}
```

如果类型转换失败，会返回 `nullptr`。它的工作机制和 C++ 标准的 `dynamic_cast` 一模一样，但区别在于它并没有使用 C++ RTTI。

### 通知

Godot 中的所有对象都有一个 `_notification` 方法，这让它们能够响应引擎底层可能与之相关的各种回调。

### 资源

Resource 类继承自 RefCounted，因此所有的资源都是基于引用计数的。资源可以选择性地包含一个路径，用来指向磁盘上的某个文件。

参考：`core/io/resource.h`

#### 资源加载

可以使用ResourceLoader API加载资源:

```cpp
Ref<Resource> res = ResourceLoader::load("res://someresource.res")
```

如果先前已加载对该资源的引用并且该引用在内存中, 则 ResourceLoader 将返回该引用。

参考：`core/io/resource_loader.h`

#### 资源保存

可以使用资源保存器API保存资源:

```cpp
ResourceSaver::save("res://someresource.res", instance)
```

该实例将会被保存，而那些拥有文件路径的子资源，会被保存为对该资源的引用。没有文件路径的子资源则会和当前保存的资源打包在一起。

参考：`core/io/resource_saver.h`

---

## 继承类树

Godot 的继承类树主要包含以下核心类的继承关系（以类图形式展示）：

- **Object** - 所有类的基类
- **RefCounted** - 引用计数管理的基类
- **Control** - 所有 GUI 控件的基类
- **Node2D** - 所有 2D 节点的基类
- **Node3D** - 所有 3D 节点的基类

源文件: [class_tree.zip](https://docs.godotengine.org/zh-cn/4.x/_downloads/dcf265d7579771eb14f8360a536a25a0/class_tree.zip)

---

## 内部渲染架构

这个页面是对 Godot 4 内部渲染器设计的高阶概述。不适用于旧版本的 Godot。

本页面旨在记录各项设计决策，以使其最契合 Godot 的设计哲学，同时也为新的渲染贡献者提供一个入门的起点。

> **备注**：如果你在理解这个页面上的概念时遇到了困难，建议先过一遍 [LearnOpenGL](https://learnopengl.com/) 等 OpenGL 教程。

想要高效地使用这些现代的底层 API（Vulkan、Direct3D 12、Metal），通常要求开发者具备对更高层 API（如 OpenGL、Direct3D 11）的中级理解。不过值得庆幸的是，贡献者极少需要直接与这些底层 API 打交道。Godot 的渲染器完全是基于 OpenGL 和 RenderingDevice 构建的，而 RenderingDevice 正是我们对 Vulkan、Direct3D 12 和 Metal 所做的一层抽象封装。

### 渲染方法

#### Forward+

这是一种前向渲染器，使用集群方法实现光照。

集群光照使用计算着色器将灯光按照 3D 视锥栅格进行分组。然后在渲染时，像素就能够查询影响某个栅格单元的有哪些灯光，仅对影响该像素的灯光进行光照计算。

这种方法能够大幅提升在桌面硬件上的渲染性能，但是在移动端会略为低效。

#### 移动端

这是一种前向渲染器，采用了传统的单次遍历（single-pass）光照处理方式。在引擎内部，它被称为 **Forward Mobile（移动端前向渲染）**。

针对移动平台设计，但是也能够在桌面平台运行。这种渲染方法针对移动 GPU 进行了优化。移动 GPU 的架构与桌面 GPU 有很大的区别，因为需要考虑电池使用、散热、读写数据时的总体带宽限制等约束。对计算着色器的支持也非常有限，甚至完全不支持。

与桌面 GPU 不同，移动 GPU 执行的是基于图块的渲染。整个图像不是作为整体渲染的，而是会细分为较小的图块，适合放置到移动 GPU 更快的内部存储中。

移动端渲染器的第一个重要改动是，它没有沿用桌面端渲染器（Forward+）所使用的 RGBA16-Float 纹理格式。除非启用了 HDR 2D 项目设置，否则它会使用 R10G10B10A2 UNORM 纹理格式。这一改动将所需的带宽减半。

第二个重要更改就是尽可能使用子阶段（sub-pass）。子阶段能够按照图块来执行渲染步骤，节省每个渲染阶段之间读写图块带来的开销。

在桌面平台上，使用子通道不会对性能产生任何影响。不过，得益于更低的复杂度和更少的带宽占用，这种渲染方法在简单场景中依然能比 Forward+ 表现得更好。

由于关注点在于低端设备，这种渲染方法并不提供 SDFGI、体积雾等高端渲染特性。

#### 兼容

这是一种传统的（非集群式）前向渲染器。在引擎内部，它被称为 **GL Compatibility（GL 兼容模式）**。它主要是为那些不支持 Vulkan 的老款显卡准备的，但在较新的硬件上也能非常高效地运行。

与"移动"渲染器类似，"兼容"渲染器在进行 3D 渲染时使用的也是 R10G10B10A2 UNORM 纹理。与移动渲染器不同的是，颜色都经过了色调映射，以 sRGB 格式存储，因此不支持 HDR。

鉴于其专注于低端设备，这种渲染方法并不提供高端的渲染功能。绝大多数后期处理效果都无法使用。

#### 为什么不使用延迟渲染？

向前渲染通常能够在性能和灵活性之间达到更好的平衡，尤其是在灯光使用了集群方法的情况下。延迟渲染虽然在某些情况下更快，但是灵活性较低、使用 MSAA 需要特殊处理。MSAA 能够为非写实画风的游戏带来很大提升，因此我们选择在 Godot 4 使用向前渲染。

未来可能会开发集群延迟渲染器。

### 渲染驱动

Godot 4 支持以下图形 API：

#### Vulkan

这是 Godot 4 的主要驱动，大部分开发集中在这个驱动上。

Vulkan 1.0 是必要的基准，Vulkan 1.1 和 1.2 的特性会有可用时使用。我们使用 volk 作为 Vulkan 加载器，使用 Vulkan Memory Allocator 进行内存管理。

使用 Vulkan 驱动时支持 Forward+ 和移动渲染方法。

#### Direct3D 12

与 Vulkan 类似，Direct3D 12 驱动仅支持现代平台，是针对 Windows 和 Xbox 设计的。

使用 Direct3D 12 时支持 Forward+ 和移动渲染方法。核心着色器与 Vulkan 渲染器共享。着色器是利用 Mesa NIR 技术，从 SPIR-V 转译为 DXIL 的。

**这款驱动目前仍处于实验阶段，仅在 Godot 4.3 及更高版本中可用**。

#### Metal

Godot 提供了一个原生的 Metal 驱动，它可以在所有 Apple Silicon 硬件上运行。与使用 MoltenVK 转译层相比，它的速度要快得多。

Forward+ 和 Mobile 这两种渲染方法都可以在 Metal 后端下使用。核心着色器是与 Vulkan 渲染器共享的。这些着色器会通过 SPIRV-Cross 工具，从 GLSL 语言转译为 MSL。

从 Godot 4.7 版本开始，只要条件允许，引擎现在会使用 Metal 4。

#### OpenGL

这个驱动使用 OpenGL ES 3.0，针对的是不支持 Vulkan 的旧有设备以及低端设备。桌面平台运行该驱动时使用的是 OpenGL 3.3 Core Profile。Web 导出使用的是 WebGL 2.0。

使用 OpenGL 驱动时只能使用兼容渲染方法。核心着色器与 Vulkan 渲染器完全不同。

#### 渲染驱动/方法总结

目前可用的渲染 API + 渲染方法组合如下：

- Vulkan + Forward+（在 macOS 和 iOS 系统上，可选择通过 MoltenVK 来运行）
- Vulkan + Mobile（在 macOS 和 iOS 系统上，可选择通过 MoltenVK 来运行）
- Direct3D 12 + Forward+
- Direct3D 12 + Mobile
- Metal + Forward+
- Metal + Mobile
- OpenGL + 兼容模式（在 Windows 和 macOS 系统上，还可以选择通过 ANGLE 来运行）

### RenderingDevice 抽象

为了让现代底层图形 API 的复杂性变得更易于掌控，Godot 使用了它自己的一套抽象层，也就是 RenderingDevice。

这意味着，在编写现代渲染方法的代码时，你其实并不需要直接调用 Vulkan、Direct3D 12 或 Metal 的原生 API。RenderingDevice 所提供的抽象层级，与 WebGPU 是相近的。

### 核心渲染类架构

Godot 中渲染类的结构包含了 RenderingDevice 这一抽象层。

### 核心着色器

虽然 Godot 项目中的着色器是使用一种受 GLSL 启发的自定义语言编写的，但核心着色器则是直接用 GLSL 编写的。

这些核心着色器在编译时会被嵌入到编辑器和导出模板的二进制文件中。因此，如果你想让你对这些 GLSL 着色器所做的任何修改生效，就需要重新编译编辑器或导出模板的二进制文件。

一些材质特性，比如高度映射、折射和近端淡出，并不属于核心着色器的一部分。它们是在默认的 BaseMaterial3D 中，使用 Godot 的着色器语言来实现的。

按照惯例，文件名中带有 `_inc` 的着色器文件，通常会被包含进其他的 GLSL 文件中。

> **警告**：核心材质着色器会被场景中的每一个材质所使用——无论是默认的 BaseMaterial3D 还是自定义的着色器。正因如此，这些着色器必须尽可能地保持简洁。

**核心 GLSL 材质着色器：**

- Forward+: `servers/rendering/renderer_rd/shaders/forward_clustered/scene_forward_clustered.glsl`
- Mobile: `servers/rendering/renderer_rd/shaders/forward_mobile/scene_forward_mobile.glsl`
- Compatibility: `drivers/gles3/shaders/scene.glsl`

### 2D 与 3D 渲染的拆分

2D 和 3D 会被分别渲染到独立的缓冲区中，这是因为 Godot 中的 2D 渲染是在 sRGB 色彩空间下的 LDR 中进行的，而 3D 渲染则使用的是线性空间下的 HDR。

2D 渲染使用的颜色格式是 RGB8（如果视口的透明属性被开启，则使用 RGBA8）。3D 渲染使用的是 24 位无符号归一化整数深度缓冲区。另外，2D 渲染不使用深度缓冲区。

### 2D 渲染技术

2D 光照渲染在单个阶段中进行，以便在场景中有大量光照时获得更高的性能。

所有渲染器都采用了 2D 批处理技术来提升性能。

在 2D 渲染中，你可以开启 MSAA 来实现线条和多边形抗锯齿。FXAA 对 2D 渲染是无效的。

如果用户自定义的着色器发出了请求，引擎就会自动在视口中生成一个代表所有 LightOccluder2D 节点的 2D 有向距离场。

### 3D 渲染技术

#### 反向 Z

Godot 的所有渲染器都采用了反向 Z（Reverse Z）技术。深度缓冲区是被反转的：其中 `1.0` 代表近裁剪面，而 `0.0` 代表远裁剪面。这能带来更好的精度，尤其是在处理长距离渲染时效果显著。

#### 分批和实例

在 Forward+ 渲染器中，引擎使用了 Vulkan 实例化技术，将相同的、不透明或经过 Alpha 测试的物体打包在一起进行渲染。Alpha 混合的物体永远不会被实例化。

#### 光照渲染

Forward+ 渲染器采用了聚类光照技术，可以随心所欲地添加任意数量的光源。

所有渲染方法都支持同时渲染最多 8 盏方向光。如果有多于一盏的方向光开启了阴影，那么阴影的质量会有所降低。

移动端渲染器采用单次遍历的光照渲染方式，每个网格资源最多只能受到 8 个点光源和 8 个聚光灯的影响。

兼容性渲染器采用了一种混合式的单次遍历 + 多次遍历光照处理方式。

不带阴影的光照开销远低于带阴影的光照。

#### 阴影贴图

Forward+ 和 Mobile 渲染器都采用了 PCF 技术来过滤阴影贴图，采用了沃格尔盘模式。Godot 还支持百分比渐进式软阴影（PCSS），仅限于 Forward+ 渲染器使用。

#### 时间抗锯齿

仅在 Forward+ 渲染器中可用。Godot 采用一套基于旧版 Spartan Engine TAA 的实现方法。FSR 2.2 也可以作为一种画面放大方案来使用。

#### 全局光照

VoxelGI 和 SDFGI 仅在 Forward+ 渲染器中可用。LightmapGI 的烘焙功能仅在 Forward+ 和 Mobile 渲染器下可用。

Godot 支持基于体积像素的全局光照 (VoxelGI)、带符号距离场全局光照 (SDFGI) 和光照贴图烘焙与渲染 (LightmapGI)。

#### 景深

Forward+ 和 Mobile 渲染器采用了不同的景深渲染方式。系统提供了方形、六边形和圆形三种散景形状。

#### 屏幕空间效果（SSAO、SSIL、SSR、SSS）

仅在 Forward+ 渲染器中可用。SSAO 采用的是衍生自英特尔 ASSAO 的实现方案。SSAO、SSIL 和 SSR 默认以一半的分辨率来进行计算。

#### 天空渲染

Godot 支持使用着色器来渲染天空背景。辐射图会根据天空着色器自动更新。

#### 体积雾

仅在 Forward+ 渲染器中可用。Godot 支持视锥体对齐体素的方法来进行体积雾渲染。

#### 遮挡剔除

Godot 4 支持遮挡剔除，通过使用 Embree 在 CPU 上光栅化一个低分辨率的缓冲区来实现。

这种基于CPU的方法的优势：
- 不需要手动设置
- 没有帧延迟
- 适用于所有渲染驱动程序和方法

#### 可见范围（LOD）

Godot支持手动创作的层次细节层次(HLOD)，距离由用户在检查器中指定。

#### 自动网格 LOD

ImporterMesh 类用于编辑器中的 3D 网格导入工作流。它的 `generate_lods()` 函数使用 meshoptimizer 库来处理生成。网格 LOD 会根据屏幕覆盖率的指标来自动选择。

---

## 2D 坐标系与 2D 变换

### 介绍

本文对可用的 2D 坐标系和内置的 2D 变换进行了详细介绍。

Transform2D（2D 变换）本质上是一种矩阵，专门用来把坐标从一个坐标系转换到另一个坐标系。

### Godot 2D 坐标系

Godot 2D 中的坐标系包括：

- **Item 坐标** - 这是 CanvasItem 的局部坐标系。
- **父 Item 坐标** - 这是父级 CanvasItem 的局部坐标系。
- **画布坐标** - 画布坐标也叫世界坐标。一个 Viewport 可以包含多个画布，不同画布所使用的坐标系可以不同。
- **视口坐标** - 这是 Viewport 的坐标系。
- **相机坐标** - 仅在内部使用，用于实现 3D 相机光线投射等功能。
- **嵌入器坐标 / 屏幕坐标** - 场景树中的各个 Viewport 不是嵌入在其他节点中，就是嵌入在操作系统的"窗口管理器"中。
- **绝对嵌入器坐标 / 绝对屏幕坐标** - 这种坐标系的原点是所嵌节点或操作系统的"窗口管理器"的左上角。

### 节点变换

此处涉及的节点都有一个或多个变换与之关联：

- **CanvasItem 变换** - Control 或 Node2D 节点的变换，包含位置、缩放、旋转等。
- **CanvasLayer 变换** - 会影响该 CanvasLayer 中的所有 CanvasItem。
- **CanvasLayer 视口跟随变换** - 一种自动计算出来的变换，用于实现伪 3D 效果。
- **视口画布变换** - 会影响该 Viewport 默认画布中的所有 CanvasItem。
- **视口全局画布变换** - 主要用于 Godot 的 CanvasItem 编辑器。
- **视口拉伸变换** - 主要用于视口的缩放或拉伸场景。
- **窗口变换** - 每个 Window 都包含了一个窗口变换，用于实现多分辨率适配。
- **窗口位置** - 描述的是它在嵌入器中的位置。
- **SubViewportContainer 收缩变换** - 声明它所包含的 SubViewport 是否使用相对于容器大小的整数级缩放。

---

## 单元测试

Godot 引擎允许直接用 C++ 编写单元测试。引擎集成了 doctest 单元测试框架，该框架允许在生产代码旁边编写测试套件和测试用例。测试在专用的 `tests/` 目录中，该目录位于引擎源代码的根目录中。

### 平台及目标支持

C++ 单元测试可以在 Linux、macOS 和 Windows 操作系统上运行。测试只能在启用编辑器 `tools` 的情况下运行，这意味着目前无法测试导出模板。

### 运行测试

在测试被实际运行之前，必须在启用 `tests` 构建选项的情况下编译引擎：

```bash
scons tests=yes
```

构建完成后，使用 `--test` 命令行选项运行测试：

```bash
./bin/<godot_binary> --test
```

> **备注**：如果你使用 `dev_mode=yes` SCons 选项，则测试会被自动编译。

### 筛选测试

可以使用 doctest 提供的各种过滤选项运行感兴趣的测试。支持通配符语法 `*`：

| 过滤选项 | Shorthand | Examples |
|---|---|---|
| --test-suite | -ts | -ts="*[GDScript]*" |
| --test-case | -tc | -tc="*[String]*" |
| --source-file | -sf | -sf="*test_color*" |

例如，要仅运行 String 单元测试：

```bash
./bin/<godot_binary> --test --test-case="*[String]*"
```

### 编写测试

测试套件代表 C++ 头文件，必须将其作为主测试入口点的一部分包含在 `tests/test_main.cpp` 中。所有头文件都以 `test_` 为前缀。

这是一个最小的工作测试套件：

```cpp
#ifndef TEST_STRING_H
#define TEST_STRING_H

#include "tests/test_macros.h"

namespace TestString {

TEST_CASE("[String] Hello World!") {
	String hello = "Hello World!";
	CHECK(hello == "Hello World!");
}

} // namespace TestString

#endif // TEST_STRING_H
```

> **备注**：你可以使用 `tests/` 目录下的 `create_test.py` 脚本快速生成新测试。

`tests/test_macros.h` 头文件封装了在 Godot 中编写 C++ 单元测试所需的一切。

### Subcases

在你对几个测试用例有相同的设置，只有细微变化的情况下，subcases 会很有帮助：

```cpp
TEST_CASE("[SceneTree][Node] Testing node operations with a very simple scene tree") {
	// ... common setup (e.g. creating a scene tree with a few nodes)

	SUBCASE("Move node to specific index") {
		// ... setup and checks for moving a node
	}

	SUBCASE("Remove node at specific index") {
		// ... setup and checks for removing a node
	}
}
```

### 断言

| 断言 | 描述 |
|---|---|
| REQUIRE | 检查条件是否成立。如果条件不成立则会立即让整个测试失败。 |
| REQUIRE_FALSE | 检查条件是否不成立。如果条件成立则会立即让整个测试失败。 |
| CHECK | 检查条件是否成立。会将测试表示为失败，但允许运行其他断言。 |
| CHECK_FALSE | 检查条件是否不成立。会将测试表示为失败，但允许运行其他断言。 |
| WARN | 检查条件是否成立。任何情况下都不会让测试失败，但是不成立时会记录一条警告。 |
| WARN_FALSE | 检查条件是否不成立。任何情况下都不会让测试失败，但是成立时会记录一条警告。 |

### 测试故障路径

为了检查故障路径确实可以安全执行而不会导致引擎崩溃，请在测试用例中使用 `ERR_PRINT_OFF` 和 `ERR_PRINT_ON` 宏来暂时禁用来自引擎的错误输出：

```cpp
TEST_CASE("[Color] Constructor methods") {
	ERR_PRINT_OFF;
	Color html_invalid = Color::html("invalid");
	ERR_PRINT_ON; // Don't forget to re-enable!
	CHECK_MESSAGE(html_invalid.is_equal_approx(Color()),
		"Invalid HTML notation should result in a Color with the default values.");
}
```

### 测试工具

测试工具是一种高级方法，允许你运行任意程序。可以通过在 `--test` 命令行选项后提供工具名称来运行这些工具：

```bash
./bin/<godot_binary> --test gdscript-tokenizer test.gd
./bin/<godot_binary> --test gdscript-parser test.gd
./bin/<godot_binary> --test gdscript-compiler test.gd
```

### GDScript 的集成测试

为 GDScript 编写集成测试的步骤：

1. 选择你想要编写的测试脚本类型，在 `modules/gdscript/tests/scripts` 目录下对应的子目录中新建 GDScript 脚本。
2. 编写 GDScript 代码。测试脚本必须包含一个名叫 `test()` 的函数，不带任何参数。
3. 生成 `*.out` 文件：

```bash
bin/<godot_binary> --gdscript-generate-tests modules/gdscript/tests/scripts
```

4. 运行 GDScript 测试：

```bash
./bin/<godot_binary> --test --test-suite="*GDScript*"
```

> **警告**：在提交拉取请求之前，请确保输出确实具有预期值。

---

*本文档内容抓取自 Godot 4.x 官方文档（简体中文版），最后更新日期：2026-08-26*
