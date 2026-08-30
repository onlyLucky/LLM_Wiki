# Godot 最佳实践

> 来源：[Godot Engine 4.x 简体中文文档 - 最佳实践](https://docs.godotengine.org/zh-cn/4.x/tutorials/best_practices/index.html)

---

## 1. 前言

本系列是最佳实践的合集，可让你在使用 Godot 时更加高效。

在 Godot 中，你在项目代码结构和拆分场景方面有很大的自由度。不同的做法有不同的优缺点，如果使用引擎的时间不够长，是很难进行权衡的。

构造代码和解决特定编程问题的方法总是有很多的，这里不可能涵盖所有内容。

这就是为什么每篇文章都是从某个现实世界的问题开始的。我们会将每个问题分解为基本问题、提出解决方案、分析每种选择的利弊，并强调针对当前问题的最佳解决方案。

你应该从 **在 Godot 中应用面向对象原则** 开始阅读。里面解释了 Godot 的节点和场景与其他面向对象的编程语言中的类和对象的关联，可以帮助你理解本系列的其他内容。

> **备注：** Godot 中的最佳实践依赖于面向对象的设计原则。我们使用的是 **单一职责** 原则和 **封装** 等工具。

---

## 2. 在 Godot 中应用面向对象原则

Godot 引擎主要提供了两种创建可复用对象的方式：脚本和场景。严格来说，这两种方式都没有真的在底层定义类。

尽管如此，在许多使用 Godot 的最佳方法中，依然涉及将面向对象的编程原则应用到游戏的脚本和场景中。这就是为什么我们需要了解如何将它们视为类。

本指南简要介绍了脚本和场景在引擎核心中的工作方式，以帮助你了解它们在底层是如何工作的。

### 脚本在引擎中的工作原理

引擎提供了内置的类，如 `Node`。你可以使用脚本扩展这些类来创建派生类型。

这些脚本严格来说并不是类，而是一种资源，用来告知引擎在某一内置类的基础上执行一系列初始化。

Godot 的内部类可以将一个类的数据注册进一个名为 `ClassDB` 的数据库，该数据库让我们可以在运行时访问类的信息。`ClassDB` 包含有关类的信息，例如：

- 属性。
- 方法。
- 常量。
- 信号。

当对象在执行访问属性或调用方法等操作时，它就会检查 `ClassDB` 中对象和对象基类的记录，以确定对象是否支持该操作。

将 `Script` 附加到你的对象上，可以扩展 `ClassDB` 中该对象的方法、属性和信号。

> **备注：** 脚本即使没有使用 `extends` 关键字，也会隐式地继承引擎的基础 `RefCounted` 类。因此，你可以从代码中实例化不使用 `extends` 关键字的脚本。不过由于扩展的是 `RefCounted`，你是无法把它们附加到 `Node` 上的。

### 场景

场景的行为与类有很多相似之处，所以把场景看成一个类也是合理的。场景是可复用、可实例化、可继承的节点组。创建场景就类似于，有一个脚本去创建一些节点，并使用 `add_child()` 将它们添加为子节点。

我们经常为场景搭配一个带有脚本的根节点，并在脚本中使用这个场景下的节点。在这种情况下，脚本是通过使用命令式代码为场景添加行为来扩展场景的。

场景的内容有助于定义：

- 脚本可使用哪些节点。
- 它们是如何组织的。
- 它们是如何初始化的。
- 它们彼此之间有什么信号连接。

为什么这些对组织场景很重要？因为场景的实例 _都是_ 对象。因此，许多适用于书面代码的面向对象原则也适用于场景：单一职责、封装等。

场景 _就是对附着在根节点上的脚本的扩展_，所以你可以将其解释为类的一部分。

此系列最佳实践中所解释的大部分技术都建立在这一点上。

---

## 3. 场景组织

本文讨论与有效组织场景内容相关的主题。应该使用哪些节点？应该把它们放在哪里？它们应该如何互动？

### 如何有效地建立关系

当 Godot 用户开始制作自己的场景时，他们经常遇到以下问题：

他们创建了自己的第一个场景并填满内容，但随着应该把事情分解的烦人感觉开始积累，他们最终把场景的分支保存为单独的场景。可他们接着就注意到之前能够依赖的硬引用不能用了。在多个地方重用场景会出现问题，因为节点路径找不到目标，在编辑器中建立的信号连接也失效了。

要解决这些问题，必须实例化子场景，子场景不依赖于所处环境中的详细信息。子场景应该能够保证自身创建的时候，对如何使用它没有苛刻的要求。

在 **面向对象编程 (OOP)** 中，需要考虑的最重要事项之一，就是保持类的职责专注、功能单一，并与代码库的其他部分实现 **松散耦合**。这样做可以确保对象的规模小巧（便于维护），并提升其可重用性。

这些 OOP 最佳实践对场景结构和脚本使用的有 _很多_ 意义。

**应该尽可能设计没有依赖的场景。** 也就是说，创建的场景应该将其所需的一切保留在其内部。

如果场景必须与外部环境交互，经验丰富的开发人员会建议使用 **依赖注入**。该技术涉及使高级 API 提供低级 API 的依赖关系。为什么要这样呢？因为依赖于其外部环境的类可能会无意中触发 Bug 和意外行为。

要做到这一点，就必须暴露数据，然后依靠父级上下文对其进行初始化：

1. **连接信号。** 这样做极其安全，但只能用于"响应"行为，而不是启动行为。按照惯例，信号名称通常是过去式动词，如"entered""skill_activated""item_collected"（已进入、已激活技能、已收集道具）。

   ```gdscript
   # Parent
   $Child.signal_name.connect(method_on_the_object)
   # Child
   signal_name.emit() # Triggers parent-specified behavior.
   ```

2. **调用方法。** 用于启动行为。

   ```gdscript
   # Parent
   $Child.method_name = "do"
   # Child, assuming it has String property 'method_name' and method 'do'.
   call(method_name) # Call parent-specified method (which child must own).
   ```

3. **初始化 `Callable` 属性。** 比调用方法更安全，因为不需要拥有这个方法的所有权。用于启动行为。

   ```gdscript
   # Parent
   $Child.func_property = object_with_method.method_on_the_object
   # Child
   func_property.call() # Call parent-specified method (can come from anywhere).
   ```

4. **初始化 Node 或其他 Object 的引用。**

   ```gdscript
   # Parent
   $Child.target = self
   # Child
   print(target) # Use parent-specified node.
   ```

5. **初始化 NodePath。**

   ```gdscript
   # Parent
   $Child.target_path = ".."
   # Child
   get_node(target_path) # Use parent-specified NodePath.
   ```

这些选项隐藏了子节点的访问点。这反过来又使子节点与环境保持 **松耦合**（loosely coupled）。人们可以在另外一个上下文中重新使用它，而不需要对 API 做任何额外的改变。

> **备注：** 虽然上面的例子只说明了父子关系，但是同样的原则也适用于所有对象之间的关系。兄弟节点应该关心它们的层次结构，而先祖节点则负责协调它们的通信和引用。

```gdscript
# Parent
$Left.target = $Right.get_node("Receiver")

# Left
var target: Node
func execute():
    # Do something with 'target'.

# Right
func _init():
    var receiver = Receiver.new()
    add_child(receiver)
```

同样的原则也适用于维护对其他对象依赖关系的非节点对象。无论哪个对象拥有其他对象，都应该管理它们之间的关系。

> **警告：** 你应该倾向于将数据保存在内部（场景内部），尽管它对外部内容有一个依赖关系，甚至是一个松散耦合的依赖，仍然意味着节点将期望其环境中的某些内容为真。项目的设计理念应避免这种情况的发生。如果不这样做，代码的继承关系将迫使开发人员使用文档，以在微观尺度上跟踪对象关系；这就是所谓的开发地狱。通常情况下，编写依赖于外部文档才能安全使用的代码，是很容易出错的。

为了避免创建和维护此类文档，可以将依赖节点（上面的子级）转换为工具脚本，该脚本实现 `_get_configuration_warnings()`。从中返回的一个非空字符串紧缩数组（PackedStringArray）将使场景停靠面板生成警告图标，其中包含上述字符串作为节点的工具提示。这样，编辑器通过脚本代码自记录（self-document）场景，也就不需要在文档里记录一些与之重复的内容了。

这样的 **图形用户界面（GUI）** 能够更好地向项目用户传达有关节点的关键信息：它是否存在外部依赖？这些依赖是否已满足？其他程序员，尤其是设计师和文案人员，都需要消息中提供明确的指示，告诉他们该如何进行配置。

那么，为什么所有这些复杂的间接机制能奏效呢？因为场景在独立运行时表现最佳。如果无法独立运行，那么次优选择就是以匿名方式与其他场景协作（保持最小的硬性依赖，即松耦合）。当不可避免地需要修改某个类时，如果这些修改导致该类以不可预见的方式与其他场景交互，系统就会开始崩溃。所有这些间接设计的核心目的，就是避免陷入修改一个类就会对依赖它的其他类造成负面影响的困境。

脚本和场景作为引擎类的扩展，应该遵守 _所有_ 的 OOP 原则。例如...

- **SOLID:**
  - 单一职责原则
  - 对扩展开放，对修改关闭
  - 在使用父类的地方，都应该能够无缝替换成它的子类，而且程序不会出任何毛病
  - 接口隔离原则
  - 依赖倒置原则
- **DRY:** 不要重复自己
- **KISS:** 极简原则
- **YAGNI:** 别瞎操心未来

### 选择节点树结构

于是，一个开发者开始着手做游戏，却在广阔的可能性面前停了下来。他可能知道自己想做什么，想要什么样的系统，但是该把这些东西安置在 _哪里_ 呢？好吧，自己做的游戏当然自己说了算。构造节点树的方法有无数种。但对于没把握的人而言，这份有用的指南可以给他们一个不错的结构样本作为开始。

游戏总是应该具有一个"入口点"。在这里，你能找到所有事物的起点，并跟随着逻辑找到它们去向哪里。也就是说，入口点是程序中所有其他数据和逻辑的鸟瞰点。对于传统的应用程序而言，这一般是"main"函数；而在 Godot 中，它就是 Main 节点。

- "Main"节点（main.gd）

`main.gd` 脚本将作为你的游戏的主要控制器。

之后你便拥有了真正的游戏"世界"（2D 或 3D）。它可以是 Main 的子节点。另外，你的游戏需要一个主要 GUI，来管理项目所需的各种菜单和部件。

- "Main"节点（main.gd）
  - Node2D/Node3D "World"（game_world.gd）
  - Control "GUI"（gui.gd）

当变更关卡时，可以稍后换出"World"节点的子级。手动更换场景让用户完全控制他们的游戏世界如何过渡。

下一步是考虑项目需要什么样的游戏系统。如果有这么一个系统……

1. 跟踪所有的内部数据
2. 应该是全局可访问的
3. 应该是独立存在的

…接下来他该创建一个 **自动加载"单例"节点** 了。

> **备注：** 对于较小的游戏，一个更简单且更少控制的做法是使用一个"Game"单例，简单地调用 `SceneTree.change_scene_to_file()` 方法，用于置换出主场景的内容。这种结构多少保留了"World"作为主要游戏节点。

任一 GUI 也需要是一个单例；作为 "World" 的临时部分，或被手动添加到根节点作为其直接子节点。否则 GUI 节点也会在场景转换时自行删除。

如果你有需要修改其他系统数据的系统，应该将其定义为独立的脚本或场景，而不是自动加载单例（Autoloads）。欲了解更多信息，请参阅 **自动加载与普通节点**。

游戏中的每个子系统都应该在 SceneTree 中占有自己的一席之地。只有在节点确实是父节点中的元素时才应当使用父子关系。如果移除父节点的话，同时将这些子节点移除是否说得通？说不通的话，就应该在层级结构中单独列出，两者成为兄弟节点或者其他关系。

> **备注：** 某些情况下，我们 _仍然_ 会需要让这些单独的节点进行相对定位。此时可以使用 `RemoteTransform` / `RemoteTransform2D` 节点。它们可以让目标节点有条件地从 Remote* 节点继承选定的变换元素。

什么时候你该这样做？这个比较主观。当你必须精细管理，且一个节点必须在场景树上来回移动以保留自己时，就会出现两难的局面。例如……

- 添加一个"玩家"节点到一个"房间"节点。
- 需要改变房间了，所以必须删除当前房间节点。
- 在房间能被删除前，你必须保留玩家并/或将其移走。
  - 如果不关心内存，你可以……
    - 创建新的房间节点。
    - 将玩家节点移动到新的房间节点。
    - 删除旧房间。
  - 如果比较关注内存情况，那么就需要这样……
    - 将玩家节点移动到节点树的其他地方。
    - 删除房间节点。
    - 实例化并添加新的房间节点。
    - 重新添加玩家节点到新房间中。

问题在于这里的角色是一种"特殊情况"；开发者必须 _知道_ 需要以这种方式处理项目中的角色。因此，在团队中可靠地分享这些信息的唯一方法就是 _写文档_。然而，在文档中记录实现细节是很危险的，会成为一种维护负担，使代码可读性下降，不必要地膨胀项目的知识内容。

在拥有更多的资产的，更复杂的游戏中，将整个玩家节点保留在 SceneTree 中的其他地方会更好。这样的好处是：

1. 一致性更高。
2. 没有"特殊情况"，不必写入文档也不必进行维护。
3. 因为不需要考虑这些细节，所以也没有出错的机会。

相比之下，如果需要子节点 _不_ 继承父节点的变换，那么就有以下选项：

1. **声明式** 解决方案：在它们之间放置一个 `Node`。作为没有变换的节点，Node 不会将这些信息传递给其子节点。
2. **命令式** 解决方案：对 `CanvasItem` 或者 `Node3D` 节点使用 `top_level` 属性。这样就会让该节点忽略其继承的变换（transform）。

> **备注：** 如果构建的是网络游戏，请记住哪些节点和游戏系统与所有玩家相关，而哪些只与权威服务器相关。

场景组织的关键是用关系树而不是空间树来考虑 SceneTree。节点是否依赖于其父节点的存在？如果不是，那么它们可以自己在别的地方茁壮成长。如果它们是依赖性的，那么理所当然它们应该是父节点的子节点。

这是否意味着节点本身就是组件？并不是这样。Godot 的节点树形成的是聚合关系，不是组合关系。虽然依旧可以灵活地移动节点，但在默认情况下是没有进行移动的必要的。

---

## 4. 何时使用场景与脚本

我们已经介绍了场景和脚本的不同之处。脚本使用命令性代码定义引擎类扩展，而场景使用声明性代码。

因此，每个系统的能力有所不同。场景可以定义扩展类的初始化方式，但无法定义其实际行为。场景通常与脚本配合使用：场景负责声明节点的组合结构，而脚本则通过命令式代码添加具体行为。

### 匿名类型

单独使用脚本 _可以_ 完全定义场景的内容。从本质上讲，Godot 编辑器所做的，仅在其对象的 C++ 构造函数中。

但是，选择哪个来使用，可能是一个两难问题。创建脚本实例与创建引擎类相同，而处理场景需要更改 API：

```gdscript
const MyNode = preload("my_node.gd")
const MyScene = preload("my_scene.tscn")
var node = Node.new()
var my_node = MyNode.new() # Same method call.
var my_scene = MyScene.instantiate() # Different method call.
var my_inherited_scene = MyScene.instantiate(PackedScene.GEN_EDIT_STATE_MAIN) # Create scene inheriting from MyScene.
```

此外，由于引擎和脚本代码之间的速度差异，脚本的运行速度将比场景慢一些。节点越大和越复杂，将它构建为场景的理由就越多。

### 命名的类型

脚本可以在编辑器中被注册为一个新类型。这样做之后，在节点或资源创建对话框中，它就会被显示为一个新类型，并带有可选图标。这样，用户就可以更加便捷地使用脚本，而不是必须…

1. 了解他们想要使用的脚本的基本类型。
2. 创建一个该基本类型的实例。
3. 将脚本添加到节点。

通过注册一个脚本，该脚本类型将像系统中的其他节点和资源一样成为一个可以被创建的选项。创建对话框甚至还有一个搜索栏，可以按名称查找类型。

用于注册类型的系统有两种：

- **自定义类型**
  - 仅限编辑器。类型名称在运行时中不可访问。
  - 不支持继承的自定义类型。
  - 一个初始化工具。使用脚本创建节点。仅此而已。
  - 编辑器没有对该脚本的类型感知，或其与其他引擎类型或脚本的关系。
  - 允许用户定义一个图标。
  - 适用于所有脚本语言，因为它抽象处理脚本资源。
  - 设置使用 `EditorPlugin.add_custom_type`。

- **Script 类**
  - 编辑器和运行时均可访问。
  - 显示全部继承关系。
  - 使用脚本创建节点，但也可以从编辑器更改或扩展类型。
  - 编辑器知道脚本、脚本类和引擎 C++ 类之间的继承关系。
  - 允许用户定义一个图标。
  - 引擎开发人员必须手动添加对语言的支持（名称公开和运行时可访问性两者）。
  - 编辑器扫描项目文件夹，并为所有脚本语言注册任何公开的名称。为公开此信息，每种脚本语言都必须实现自己的支持。

有了这些功能，由于它赋予用户易用性，人们可能希望它们的类型是没有场景的脚本。那些正在开发的插件或创建供设计人员使用的内部工具，将以这种方式使事情变得更轻松。

不足之处在于，这也意味着很大程度上必须使用命令式编程。

### Script 与 PackedScene 的性能

在选择场景和脚本时，最后一个需要考虑的方面是执行速度。

随着对象内容的增加，脚本创建和初始化所需的内容也会大大增加。创建节点层次结构就说明了这一点。每个 Node 的逻辑可能有几百行代码。

下面的代码示例创建一个新的 `Node`，更改名称，分配脚本，将其未来的父级设置为其所有者，以便保存到磁盘中，最后将其添加为 `Main` 节点的子级：

```gdscript
# main.gd
extends Node

func _init():
    var child = Node.new()
    child.name = "Child"
    child.script = preload("child.gd")
    add_child(child)
    child.owner = self
```

这样的脚本代码比引擎端的 C++ 代码要慢很多。每条指令都要调用脚本 API，导致后端要进行多次"查找"，以找到要执行的逻辑。

场景有助于避免这个性能问题。`PackedScene`（场景包）是场景继承的基础类型，定义了使用序列化数据创建对象的资源。引擎可以在后端批量处理场景，并提供比脚本好得多的性能。

### 总结

最后，最好的方法是考虑以下几点：

- 如果希望创建一个基本工具，它将在几个不同的项目中重用，以及可能提供给不同技能水平的人使用（包括那些不认为自己是个程序员的用户），它很可能是一个脚本，有一个自定义名称/图标。
- 如果有人想创造一个特定于他们的游戏的概念，那么它应该是一个场景。场景比脚本更容易跟踪/编辑，并提供更多的安全性。
- 如果你想命名一个场景，那么你可以通过声明一个脚本类并给它一个场景作为常量来实现这一点。实际上，该脚本变成了一个命名空间：

```gdscript
# game.gd
class_name Game # extends RefCounted, so it won't show up in the node creation dialog.
extends RefCounted
const MyScene = preload("my_scene.tscn")

# main.gd
extends Node
func _ready():
    add_child(Game.MyScene.instantiate())
```

---

## 5. 自动加载与常规节点

Godot 提供了一个在项目根节点自动加载节点的功能，允许你在全局范围内访问它们，从而完成单例作用。当你在代码中使用 `SceneTree.change_scene_to_file` 更改场景时，这些自动加载的节点不会被释放。

在本指南中，你将学习到何时使用自动加载功能，以及避免使用该功能的方法。

### 切割音频问题

其他引擎可能鼓励使用创建管理类，单例将很多功能组织到一个全局可访问的对象中。由于节点树和信号，Godot 提供了许多避免全局状态的方法。

例如，假设我们正在构建一个平台游戏，并希望收集能够播放声音效果的硬币，那么就有一个节点 `AudioStreamPlayer`。如果在 `AudioStreamPlayer` 已经在播放声音时调用它，新的声音就会打断第一个声音。

一种解决方案是写一个全局的、自动加载的音效管理器类。它会生成一个 `AudioStreamPlayer` 的节点池，每当一个新的音效请求出现时，它就会在这个节点池中找到可用的节点来播放。我们不妨就把该类命名为 `Sound`，你可以通过 `Sound.play("coin_pickup.ogg")` 从你项目中的任何位置使用它。这在短期内解决了问题但是却造成了更多的麻烦：

1. **全局状态**：一个对象现在负责所有对象的数据。如果音效有错误，或没有一个可用的 `AudioStreamPlayer`，一切都会崩溃。
2. **全局访问**：意味着任何对象都可以从任何地方调用 `Sound.play(sound_path)`，便不容易找到错误的来源了。
3. **全局资源分配**：由于从一开始就存储了一个 `AudioStreamPlayer` 节点池，如果数量太少会遇到 bug，而数量太多则会占用更多的内存。

> **备注：** 全局访问的问题在于，任何地方的代码都可能将错误的数据传递给我们例子中的 `Sound` 自动加载。因此，为了修复这个 bug，你需要检索的区域涵盖了整个项目。

当你将代码保存在场景中时，音频可能仅涉及一个或两个脚本。

与之形成对比的是，每个场景在其内部，保留尽可能多的 `AudioStreamPlayer` 节点，所有这些问题都会消失：

1. 每个场景管理自己的状态信息。如果数据有问题，则只会在该场景中引起问题。
2. 每个场景只访问自己的节点。那么如果有一个 bug，很容易找到哪个节点有问题。
3. 每个场景只分配所需数量的资源。

### 管理共享功能或数据

使用自动加载的另一个原因可能是你希望在许多场景中重复使用相同的方法或数据。

对于函数，可以使用 GDScript 中的 `class_name` 关键字创建一种新的 `Node` 类型，为单个场景提供该功能。

当涉及到数据时，你可以：

1. 创建一个新类型的 `Resource` 来共享数据。
2. 将数据存储在每个节点可以访问的对象中，例如使用 `owner` 属性来访问场景的根节点。

### 何时应使用自动加载

GDScript 支持使用 `static func` 创建 `static`（静态）函数，与 `class_name` 结合使用时还可以创建辅助函数库，无需创建实例来调用这些函数。静态函数也有一些限制：不能引用成员变量、非静态（non-static）函数或 `self`。

从 Godot 4.1 开始，GDScript 还支持使用 `static var` 的 `static`（静态）变量，意味着你现在可以在类的实例之间共享变量，而无需创建单独的自动加载节点或脚本。

尽管如此，对于那些涵盖范围广泛的系统来说，使用自动加载的节点仍然可以简化你的代码。如果自动加载的节点管理自己的信息并且不侵入其他对象的数据，那么这就是一个创建处理广泛任务的系统（例如，任务或对话系统）的好方法。

> **备注：** 自动加载 _不_ 完全是一个单例。没有什么可以阻止你实例化自动加载的节点的副本。它只是一个使节点作为场景树的根的子节点自动加载的工具，而与游戏的节点结构或运行哪个场景无关。因此，你可以像这样，通过调用 `get_node("/root/Sound")` 来获取名为 `Sound` 的自动加载节点。

---

## 6. 何时以及如何避免为任何事情使用节点

虽然节点的创建成本很低，但是它们也有一定的局限性。一个项目可能有成千上万个节点，都各自在做事情。每个节点的行为越复杂，对项目性能增加的压力就越大。

Godot 为创建节点使用的 API 提供了更轻量级的对象。在设计如何构建项目的特性时，请务必将这些作为选项牢记在心。

**Object**

终极轻量级对象，原始的 Object 必须使用手动内存管理。尽管如此，创建自己的自定义数据结构——甚至是节点结构——也并不难，并且比 Node 类更轻量。

示例：参见 `Tree` 节点。它支持对具有任意行数和列数的内容表，进行高级定制。用来生成可视化的数据实际上是 `TreeItem` 对象的树。

优势：将 API 简化为较小范围的对象，有助于提高其可访问性、改善迭代时间。与其使用整个 Node 库，不如创建一组简略的 Object，节点可以从这些 Object 中生成和管理相应的子节点。

> **备注：** 处理它们时要小心。可以将 `Object` 存储到变量中，但是这些引用可能在没有警告的情况下失效。例如，如果对象的创建者决定删除它，这将在下一次访问时，触发错误状态。

**RefCounted**

只比 Object 稍微复杂一点。它们会记录对自己的引用，只有当对自己没有另外的引用存在时，才会删除加载的内存。在大多数需要在自定义类中存取数据的情况下，很有用。

示例：见 `FileAccess` 对象。它的功能就像普通 Object 一样，只是不需要人为删除。

优势：与 Object 相同。

**Resource**

只比 RefCounted 稍微复杂一点。它们天然具有将其对象属性序列化（即保存）到 Godot 资源文件，或从 Godot 资源文件中反序列化（即加载）的能力。

示例：脚本、`PackedScene`（用于场景文件），以及其他类型，比如 `AudioEffect` 类。每一个都可以保存和加载，因此它们均是从 `Resource` 继承而来的。

优势：关于 `Resource` 与传统数据存储方法相比的优势已经说了很多。然而，在使用 Resource 替代 Node 的情境下，Resource 的主要优点是与检查器的兼容性。虽然几乎和 Object/Reference 一样轻量，它们仍然可以在检查器中显示并导出属性。这使它们在易用性上，可以媲美使用子节点的方式，而且如果有人计划在其场景中包含许多这类 Resource/Node，它们还可以提高性能。

---

## 7. Godot 接口

脚本常常需要依赖其他对象来获取功能。这个过程分为两部分：

- 获取对可能具有这些功能的对象的引用。
- 从对象访问数据或逻辑。

接下来，本教程将介绍多种方法来完成这些操作。

### 获取对象引用

对所有 Object 来说，获得引用的最基础的方法，是通过另一个已获得引用的对象。

```gdscript
var obj = node.object # Property access.
var obj = node.get_object() # Method access.
```

同样的原则也适用于 RefCounted 对象。虽然用户经常以这种方式访问 Node 和 Resource，但还有其他方法可用。

除了访问属性和方法，也可以通过加载来获得 Resource。

```gdscript
# Load resource during scene load.
var preres = preload(path)
# Load resource when program reaches statement.
var res = load(path)

# Note that users load scenes and scripts, by convention, with PascalCase
# names (like typenames), often into constants.
const MyScene = preload("my_scene.tscn") # Static load
const MyScript = preload("my_script.gd")

# This type's value varies, i.e. it is a variable, so it uses snake_case.
@export var script_type: Script
```

请注意以下几点：

- 在一种语言中，有许多加载这些资源的方法。
- 在设计对象如何访问数据时，不要忘记，还可以将资源作为引用传递。
- 请记住，加载资源时只会获取引擎维护的缓存资源实例。如果要获取一个新对象，必须 _复制_ 一个现有引用，或者使用 `new()` 从头实例化一个对象。

节点同样也有另一种访问方式：场景树。

```gdscript
extends Node

# Slow.
func dynamic_lookup_with_dynamic_nodepath():
    print(get_node("Child"))

# Faster. GDScript only.
func dynamic_lookup_with_cached_nodepath():
    print($Child)

# Fastest. Doesn't break if node moves later.
@onready var child = $Child
func lookup_and_cache_for_future_access():
    print(child)

# Fastest. Doesn't break if node is moved in the Scene tree dock.
# Node must be selected in the inspector as it's an exported property.
@export var child: Node
func lookup_and_cache_for_future_access():
    print(child)

# Delegate reference assignment to an external source.
# Con: need to perform a validation check.
# Pro: node makes no requirements of its external structure.
var prop
func call_me_after_prop_is_initialized_by_parent():
    # Validate prop in one of three ways.
    if not prop:
        return

# Use an autoload.
func reference_a_global_autoloaded_variable():
    print(globals)
    print(globals.prop)
    print(globals.my_getter())
```

### 从对象访问数据或逻辑

Godot 的脚本 API 是鸭子类型（duck-typed）的。这意味着，当脚本执行某项操作时，Godot 不会通过 **类型** 来验证其是否支持该操作。相反，它会检查对象是否 **实现** 了这个被调用的方法。

例如，CanvasItem 类具有 `visible` 属性。暴露给脚本 API 的所有属性实际上都是与名称绑定的 setter 和 getter 对。如果有人尝试访问 `CanvasItem.visible`，那么 Godot 将按顺序执行以下检查：

1. 如果对象附加了脚本，它将尝试通过脚本设置属性。这使得脚本有机会通过覆盖属性的 setter 方法来覆盖在基础对象上定义的属性。
2. 如果脚本没有该属性，它会在 ClassDB 中针对 CanvasItem 类及其所有继承类型执行 HashMap 查找以查找"visible"属性。如果找到，它会调用绑定的 setter 或 getter。
3. 如果没有找到，它会进行显式检查，以查看用户是否要访问 "script" 或 "meta" 属性。
4. 如果没有，它将在 CanvasItem 及其继承的类型中检查 `_set`/`_get` 实现（取决于访问类型）。这些方法可以执行逻辑，从而给人一种对象具有属性的印象。`_get_property_list` 方法也是如此。

请注意，即使对于不合法的符号名称也会发生这种情况，例如以数字开头或包含斜杠（/）的名称。

因此，这个鸭子类型的系统可以在脚本、对象的类，或对象继承的任何类中定位属性，但仅限于扩展 Object 的对象。

Godot 提供了多种选项，来对这些访问执行运行时检查：

**方法检查：**

```gdscript
var child = get_child(0)

# Dynamic lookup.
child.call("set_visible", false)

# Symbol-based dynamic lookup.
child.set_visible(false)

# Dynamic lookup, checks for method existence first.
if child.has_method("set_visible"):
    child.set_visible(false)

# Cast check, followed by dynamic lookup.
if child is CanvasItem:
    child.set_visible(false)
    child.show_on_top = true

# Can also use object labels to imply an interface.
# 1. Use a name.
var quest = $Quest
print(quest.text)
quest.complete()

# 2. Use a group.
for a_child in get_children():
    if a_child.is_in_group("quest"):
        print(quest.text)
        quest.complete()
```

**将访问权限外包给 Callable：**

```gdscript
# child.gd
extends Node
var fn = null

func my_method():
    if fn:
        fn.call()

# parent.gd
extends Node

@onready var child = $Child

func _ready():
    child.fn = print_me
    child.my_method()

func print_me():
    print(name)
```

这些策略有助于 Godot 的灵活设计。通过它们，用户可以使用多种工具来满足他们的特定需求。

---

## 8. Godot 通知

Godot 中的每个对象都实现了 `_notification` 方法。其目的是允许对象响应可能与之相关的各种引擎级回调。例如，如果引擎告诉 CanvasItem 去"绘制"，则它将调用 `_notification(NOTIFICATION_DRAW)`。

在所有这些通知之中，有很多类似"绘制"这样经常需要在脚本中去覆盖的通知，多到 Godot 要提供专用函数的地步：

- `_ready()`: `NOTIFICATION_READY`
- `_enter_tree()`: `NOTIFICATION_ENTER_TREE`
- `_exit_tree()`: `NOTIFICATION_EXIT_TREE`
- `_process(delta)`: `NOTIFICATION_PROCESS`
- `_physics_process(delta)`: `NOTIFICATION_PHYSICS_PROCESS`
- `_draw()`: `NOTIFICATION_DRAW`

用户可能 _不会_ 意识到 Node 之外的类型也有通知，例如：

- `Object::NOTIFICATION_POSTINITIALIZE`：在对象初始化期间触发的回调。脚本无法访问。
- `Object::NOTIFICATION_PREDELETE`：在引擎删除 Object 之前触发的回调，即析构函数。

并且 Node 中 _确实_ 存在的许多回调没有任何专用的方法，但仍然非常有用。

- `Node::NOTIFICATION_PARENTED`：一个回调函数，每当你往某个节点里添加子节点时，它就会自动触发。
- `Node::NOTIFICATION_UNPARENTED`：一个回调函数，每当你从某个节点中移除子节点时，它就会自动触发。

通用的 `_notification()` 方法提供了对所有这些自定义通知的访问。

> **备注：** 文档中被标记为"virtual"的方法（即虚方法）可以被脚本覆盖重写。一个经典的例子是 Object 中的 `_init` 方法。虽然它没有等效的 `NOTIFICATION_*` 通知，但是引擎仍然会调用该方法。

### 对比 _process、_physics_process、*_input

当你需要用到与帧率挂钩的帧间隔时间（delta time）时，就应该使用 `_process()`。如果某些更新对象数据的代码需要尽可能频繁地刷新，那这里就是最合适的位置。像是一些周期性的逻辑判断和数据缓存，通常都会放在这里执行，但这最终还是取决于这些运算需要多久更新一次。如果它们不需要每一帧都跑一遍，那么改用计时器（Timer）的超时循环（timeout loop）会是另一个不错的选择。

```gdscript
# Allows for recurring operations that don't trigger script logic
# every frame (or even every fixed frame).
func _ready():
    var timer = Timer.new()
    timer.autostart = true
    timer.wait_time = 0.5
    add_child(timer)
    timer.timeout.connect(func():
        print("This block runs every 0.5 seconds")
    )
```

当你需要用到与帧率无关的帧间隔时间（delta time）时，就应该使用 `_physics_process()`。如果某些代码需要随着时间获得稳定的更新，而不管时间流逝的快慢如何，这里就是最合适的位置。周期性的运动学运算和物体变换操作，都应该放在这里执行。

虽然理论上你确实可以在这些回调函数里做输入检测，但为了获得最佳的性能，你应该尽量避免这样做。`_process()` 和 `_physics_process()` 只要一有机会就会触发（它们默认是不会"休息"的，每时每刻都在跑）。相比之下，`*_input()` 类的回调函数只会在引擎真正检测到有输入操作的那些帧里才会触发。

```gdscript
# Called every frame, even when the engine detects no input.
func _process(delta):
    if Input.is_action_just_pressed("ui_select"):
        print(delta)

# Called during every input event.
func _unhandled_input(event):
    match event.get_class():
        "InputEventKey":
            if Input.is_action_just_pressed("ui_accept"):
                print(get_process_delta_time())
```

### 对比 _init、初始化、导出

如果脚本初始化它自己的没有场景的节点子树，则该代码将会在 `_init()` 中执行。其他属性或独立于 SceneTree 的初始化也应在此处运行。

> **备注：** C# 中与 GDScript 的 `_init()` 方法等效的是构造函数。

`_init()` 在 `_enter_tree()` 或 `_ready()` 之前触发，但在脚本创建并初始化其属性之后。实例化场景时，属性值将按照以下顺序设置：

1. **初始值赋值：** 为属性赋初始值，未指定初始值时赋默认值。Setter 函数即便存在也不会使用。
2. **`_init()` 赋值：** 在 `_init()` 中通过各种赋值改变属性的取值，会触发 setter 函数。
3. **导出值赋值：** 如果在"检查器"中修改了导出属性的值，就会再次修改该属性的值，会触发 setter 函数。

```gdscript
# test is initialized to "one", without triggering the setter.
@export var test: String = "one":
    set(value):
        test = value + "!"

func _init():
    # Triggers the setter, changing test's value from "one" to "two!".
    test = "two"

    # If you set test to "three" from the Inspector, it would trigger
    # the setter, changing test's value from "two!" to "three!".
```

因此，选择实例化脚本还是实例化场景，对初始化和引擎调用 setter 的次数 _都_ 会产生影响。

### 对比 _ready、_enter_tree、NOTIFICATION_PARENTED

将场景实例化并首次添加到运行的场景树时，Godot 会沿着场景树从上至下实例化节点（调用 `_init()` 函数），再从根节点出发从上至下构建场景树。因此 `_enter_tree()` 是按照树的顺序从上至下一级一级调用的。场景树构建完成后，所有叶节点就会调用 `_ready`。一个节点的所有子节点都调用完该方法后，就会轮到该节点自己调用。此时就是逆着树的顺序从下至上一级一级调用的，最终到达根节点。

当实例化脚本或独立的场景时，节点不会在创建时被添加到 SceneTree 中，所以未触发 `_enter_tree` 回调。而只有 `_init` 调用发生。当场景被添加到 SceneTree 时，才会调用 `_enter_tree` 和 `_ready`。

如果你需要在节点被设为另一个节点的子节点时触发某些行为，而不管这个节点是属于主场景（活跃场景）的一部分还是其他情况，你都可以使用 PARENTED 通知。比如，下面这段代码演示了如何安全地将一个节点的方法连接到父节点的自定义信号上，而且绝对不会报错。这对于那些可能在运行时动态创建的数据型节点来说非常有用。

```gdscript
extends Node

var parent_cache

func connection_check():
    return parent_cache.has_user_signal("interacted_with")

func _notification(what):
    match what:
        NOTIFICATION_PARENTED:
            parent_cache = get_parent()
            if connection_check():
                parent_cache.interacted_with.connect(_on_parent_interacted_with)
        NOTIFICATION_UNPARENTED:
            if connection_check():
                parent_cache.interacted_with.disconnect(_on_parent_interacted_with)

func _on_parent_interacted_with():
    print("I'm reacting to my parent's interaction!")
```

---

## 9. 数据偏好

在面对问题 X 的时候，你有没有对应该使用数据结构 Y 还是 Z 产生过困惑？本文会涉及到与这些困境有关的各种主题。

> **备注：** 本文会提及"[某某]时间"的操作。这个术语来自于算法分析中的大 O 表示法。简而言之，它描述了最坏情况下的运行时长。
>
> "随着问题域的大小增加，算法的运行时长……"
> - 常量时间，`O(1)`："……不会增加。"
> - 对数时间，`O(log n)`："……会以较慢的速度增长。"
> - 线性时间，`O(n)`："……会以相同的速度增长。"

总的来说，开发人员希望尽可能避免进行线性时间操作。但是，如果保持线性时间运算的规模很小，并且如果不需要经常执行操作，则这是能够接受的。平衡这些需求，并为工作选择正确的算法/数据结构，是使程序员的技能有价值的一部分。

### 数组、字典、对象

Godot 把脚本 API 中的所有变量都存储在 `Variant` 中。Variant 可以存储兼容数据结构，例如 `Array`（数组）、`Dictionary`（字典）、`Object`（对象）。

**Array（数组）**

Godot 使用 `Vector<Variant>` 实现数组。引擎会将数组内容存储在一段连续的内存之中，也就是说，元素与元素之间是相邻的。

- **迭代：** 最快，非常适合循环。
- **插入、删除、移动：** 与位置相关，一般较慢。在 _末尾_ 添加、删除很快，在 _任意位置_ 添加、删除较慢，在 _开头_ 添加、删除最慢。
- **取值、设值：** 因为是 _按位置_ 存取的，所以最快。
- **查找：** 最慢。根据值获取索引，也就是位置。

**Dictionary（字典）**

Godot 使用 `HashMap<Variant, Variant, VariantHasher, StringLikeVariantComparator>` 实现 Dictionary。

- **迭代：** 快速。
- **插入、删除、移动：** 最快。
- **取值、设值：** 最快。和 _根据键_ 查找相同。
- **查找：** 最慢。标识值的键。

**Object（对象）**

对象任务的复杂性。每次执行这些多源查询时，它运行 _几个_ 迭代循环和哈希表查找。此外，查询是线性时间操作，依赖于对象的继承层次结构大小。

选择 Object 而不是 Array 或 Dictionary 的理由：

1. **控件：** 对象能够创建更复杂的结构。可以在数据上分层抽象，以确保外部 API 不会响应内部数据结构的更改。更重要的是，对象可以有信号，允许响应式行为。
2. **清晰：** 当涉及到脚本和引擎类为对象定义的数据时，对象是一个可靠的数据源。
3. **便利：** 如果已经有了类似的数据结构，之后从现有类扩展，可以使构建数据结构的任务变得容易得多。

### 枚举：整数还是字符串

大多数语言都提供了枚举类型，GDScript 也不例外。但与其他大多数语言不同的是，GDScript 的枚举允许开发者使用整数或字符串作为枚举值。

简单回答一下就是："你觉得哪个更舒服就选哪个。"

在技术层面上，整数比较（常量时间）比字符串比较（线性时间）更快，若想保持其他语言中使用枚举的习惯，则应使用整数来表示枚举值。

如果开发者使用枚举的主要目的是打印值，并希望将它们作为相关概念组合在一起，那么将枚举作为字符串使用是有意义的。

### AnimatedTexture vs. AnimatedSprite2D vs. AnimationPlayer vs. AnimationTree

在什么情况下应该使用 Godot 的各种动画类？

**AnimatedTexture** 是引擎绘制一个动画循环，而不是一个静态图像的纹理。用户可以进行如下操作：

1. 它在纹理的每个部分移动的速率（FPS）。
2. 纹理中包含的区域数（帧）。

好处是不涉及引擎部分额外的逻辑。坏处是用户几乎没有控制权。

**AnimatedSprite2D** 节点可以与 `SpriteFrames` 资源结合使用，使用户可以通过精灵表创建各种动画序列、在动画之间切换并控制它们的速度、区域偏移量和方向。这使得它们非常适合控制基于二维的帧动画。

**AnimationPlayer** 是你的必备工具，例如：

1. **剪纸动画：** 在运行时编辑精灵的变换。
2. **二维网格动画：** 为精灵的纹理划分一个区域，并将骨架绑定在上面。然后动画化其中的骨骼，使骨骼按照彼此之间的关系，成比例地拉伸和弯曲纹理。

**AnimationTree** 在为对象规划的动画之间，可能存在一个层次结构时使用效果很出色。可以在动画树文档中找到关于使用 AnimationTree 的深入指南。

---

## 10. 逻辑偏好

有没有想过应该用数据结构 Y 还是 Z，来处理问题 X？本文涵盖了与这些困境有关的各种主题。

### 先添加节点还是先修改属性？

运行时使用脚本初始化节点时，你可能需要对节点的名称、位置等属性进行修改。常见的纠结点在于，你应该什么时候去修改？

最佳实践是在节点加入场景树之前修改它的值。部分属性的 setter 代码会更新其他对应的值，这些代码可能会很慢！大多数情况下，这些代码不会对游戏的性能产生影响，但对于程序式生成之类的高负载场景下，就可能让游戏运行得极其缓慢。

综上，最佳的做法就是先为节点设置初始值，然后再把它添加到场景树中。有值在被加入场景树之前 _不能_ 被设置的例外情况，比如设置世界坐标的时候。

### 加载还是预加载

在 GDScript 中，存在全局 `preload` 方法。它尽可能早地加载资源，以便提前进行"加载"操作，并避免在执行性能敏感的代码时加载资源。

其对应的 `load` 方法只有在执行 load 语句时才会加载资源。也就是说，它将立即加载资源。所以，在敏感进程中加载资源会造成速度减慢。`load()` 函数是可以被 _所有_ 脚本语言访问的 `ResourceLoader.load(path)` 的别名。

```gdscript
# my_buildings.gd
extends Node

# This value is a constant, so it spawns when the Script object loads.
const BuildingScn = preload("res://building.tscn")

# The script preloads the value, but because this is a property rather
# than a constant, the object won't copy the preloaded PackedScene
# resource into the property until the script instantiates with .new().
@export var a_building : PackedScene = preload("office.tscn")

# Successfully loads and only when one instantiates the script!
var office_scn = load("res://office.tscn")
```

预加载允许脚本在加载脚本时处理所有加载。预加载虽然很有用，但有时候开发者则并不采用。为了区分这些情况，我们可以考虑以下几点：

- 如果无法确定何时可以加载脚本，那么预加载资源（尤其是场景或脚本）则有可能会导致非预料的多余加载。
- 如果其他东西可以代替该值（例如场景导出的初始化），则预加载该值没有任何意义。
- 如果只希望"导入"另一个类资源（脚本或者场景），那么最好的解决方法就是使用预加载常量。
- 如果脚本需要大量依赖关系，又不想消耗太多内存，则可以在运行环境变化时动态地加载或卸载各种依赖关系。

### 大型关卡：静态还是动态

如果正在创建一个大型关卡，哪种情况是最合适的？是将关卡创建为一个静态空间，还是分阶段加载关卡，并根据需要调整世界的内容？

答案很简单，"当性能需要的时候"。与这两种选择有关的困境是一种古老的编程选择：优化内存还是速度？

最简单的方法是使用静态关卡，它可以一次加载所有内容。但是，这取决于项目，这可能会消耗大量内存。浪费用户的运行内存会导致程序运行缓慢，或者计算机在同一时间尝试做的所有其他事情都会崩溃。

无论如何，应该将较大的场景分解为较小的场景（以利于资产重用）。然后，开发人员可以设计一个节点，该节点实时管理资源和节点的创建/加载和删除/卸载。具有大型多样环境或程序生成的元素的游戏，通常会实行这些策略，以避免浪费内存。

另一方面，编一个动态系统则更加复杂，这会使用更多的编程逻辑，并借此增加出错和 bug 的机会。如果不够小心的话，编出的系统技术债务可能会像吹气球一样增加。

因此，最好的选择是…

- 在小型游戏中使用静态关卡。
- 在开发中型/大型游戏时，如果有时间/资源，可以去创建一个可以对节点和资源的管理进行编码的库或插件。若长期对其进行打磨以提高可用性和稳定性，那么它可能会演变成跨项目的可靠工具。
- 对于一款中/大型游戏，可采用动态逻辑，因为你拥有编程技能，却没有时间或资源去完善代码（毕竟要完成游戏），后续可能进行重构，将代码外移到插件中。

---

## 11. 项目组织

### 介绍

由于 Godot 对项目结构或文件系统的使用没有限制，因此学习引擎时组织文件似乎很有挑战性。本教程提出了一个工作流程，应该是一个很好的起点。我们还将介绍在 Godot 中使用版本控制。

### 组织

Godot 本质上是基于场景的，并按原样使用文件系统，而没有元数据或资产数据库。

与其他引擎不同，场景本身包含许多资源，因此文件系统中的文件数量要少得多。

考虑到这一点，最常见的方法是将资产编组得尽可能接近场景；当项目变大时，它使其更易于维护。

举例来说，人们通常可以将基本资产（例如精灵图像、3D 模型网格、材质和音乐等）放入一个文件夹中。然后，它们可以使用一个单独的文件夹来存储使用它们的构建关卡。

```
/project.godot
/docs/.gdignore # See "Ignoring specific folders" below
/docs/learning.html
/models/town/house/house.dae
/models/town/house/window.png
/models/town/house/door.png
/characters/player/cubio.dae
/characters/player/cubio.png
/characters/enemies/goblin/goblin.dae
/characters/enemies/goblin/goblin.png
/characters/npcs/suzanne/suzanne.dae
/characters/npcs/suzanne/suzanne.png
/levels/riverdale/riverdale.scn
```

### 风格指南

为了项目之间的一致性，我们建议遵循以下规范：

- 使用 **snake_case** 风格为文件夹和文件命名（除了 C# 脚本）。这避免了在 Windows 上导出项目时可能出现的大小写敏感问题。C# 脚本是这个规则的一个例外，因为按照惯例是用类名来对它们命名，而类名应该是 PascalCase 风格。
- 使用 **PascalCase** 风格对节点进行命名，这与内置的节点大小写风格一致。
- 通常，将第三方资源放在顶级的 `addons/` 文件夹中，即使它们不是编辑器插件。这样更加容易跟踪哪些文件是第三方文件。当然这个规则也有一些例外：如果你要使用第三方游戏资源创建角色，将这些资源和角色场景及脚本放在同一文件夹下会更好。

### 导入

3.0 版之前的 Godot 版本从项目外的文件执行导入过程。尽管这在大型项目中很有用，但它给大多数开发人员带来了组织麻烦。

因此，资产现在将从项目文件夹中被透明地导入。有关 Godot 中导入功能的更多详细信息，请参阅导入流程。

#### 忽略具体文件夹

为防止 Godot 导入特定文件夹中的文件，请在文件夹中创建一个名为 `.gdignore` 的空文件（以 `.` 号开头）。这对于加快初始项目导入非常有用。

> **备注：** 要在 Windows 上创建文件名以点开头的文件，请在文件名的前后都写一个点（`.gdignore.`）。确认之后 Windows 会自动移除末尾的点。

一旦文件夹被忽略，其中资源就不能再使用 `load()` 和 `preload()` 方法加载。被忽略文件夹会从文件系统栏目中隐藏，从而减少混乱。

请注意 `.gdignore` 文件的内容会被忽略，因此该文件应当为空。它不像 `.gitignore` 文件一样支持模式匹配。

### 大小写敏感

Windows 和最近版本的 macOS 默认使用不区分大小写的文件系统，而 Linux 发行版默认使用区分大小写的文件系统。由于 Godot 的 PCK 虚拟文件系统区分大小写，因此在导出项目后可能会导致问题。为了避免这种情况，建议对项目中的所有文件都使用 `snake_case` 蛇形命名法（一般使用小写）。

在 Windows 10 上，为了进一步避免与大小写敏感相关的错误，你还可以让项目文件夹区分大小写。启用 Windows 的 Linux 子系统特性后，在 PowerShell 窗口中运行以下命令：

```powershell
# To enable case-sensitivity:
fsutil file setcasesensitiveinfo <path to project folder> enable

# To disable case-sensitivity:
fsutil file setcasesensitiveinfo <path to project folder> disable
```

---

> 本文档基于 Godot Engine 4.x 简体中文文档整理。
> 版权所有 2014-present Juan Linietsky, Ariel Manzur and the Godot community (CC BY 3.0)。
