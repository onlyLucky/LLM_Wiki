# C++ 语法使用入门

## 目录
1. [C++ 简介](#c-简介)
2. [开发环境搭建](#开发环境搭建)
3. [基础语法](#基础语法)
4. [函数](#函数)
5. [数组和字符串](#数组和字符串)
6. [指针基础](#指针基础)
7. [面向对象编程入门](#面向对象编程入门)
8. [现代 C++ 特性](#现代-c-特性)
9. [学习建议](#学习建议)

## C++ 简介

C++ 是一种通用的高级编程语言，由 Bjarne Stroustrup 于 1979 年在贝尔实验室开发。它是 C 语言的扩展，增加了面向对象编程、泛型编程等特性。

### C++ 的应用领域
- **系统开发**：操作系统、驱动程序
- **游戏开发**：Unreal Engine 等游戏引擎
- **高性能计算**：科学计算、金融交易系统
- **嵌入式系统**：物联网设备、控制系统
- **数据库系统**：MySQL、MongoDB 等

## 开发环境搭建

### 推荐开发工具

#### Windows 平台
- **Visual Studio 2022**（推荐）
  - 微软官方 IDE，功能强大
  - 下载地址：https://visualstudio.microsoft.com/
  - 选择社区版（免费）

- **Dev C++**
  - 轻量级 IDE，适合初学者
  - 体积小，安装简单
  - 默认使用 MinGW/GCC 编译器

- **CLion**
  - JetBrains 出品，跨平台
  - 支持 GCC、Clang、MSVC
  - 代码补全和智能提示优秀

#### macOS 平台
- **Xcode**（推荐）
  - Apple 官方开发工具
  - 在 App Store 免费下载
  - 默认使用 Clang 编译器

- **CLion**
  - 跨平台支持
  - 功能强大

#### Linux 平台
- **GCC + VS Code**（推荐）
  - GCC 是 Linux 下最常用的编译器
  - VS Code 是轻量级编辑器，插件丰富

- **CLion**
  - 跨平台支持

### 第一个 C++ 程序

```cpp
#include <iostream>
using namespace std;

int main() {
    cout << "Hello, World!" << endl;
    return 0;
}
```

**代码解释：**
- `#include <iostream>`：包含输入输出流头文件
- `using namespace std;`：使用标准命名空间
- `int main()`：主函数，程序入口
- `cout`：标准输出流
- `endl`：换行符

## 基础语法

### 变量与数据类型

C++ 是强类型语言，变量声明时必须指定类型：

```cpp
// 整型
int age = 18;
long long bigNumber = 1234567890LL;

// 浮点型
float price = 99.99f;
double pi = 3.14159265358979;

// 字符型
char grade = 'A';
wchar_t chinese = L'中';

// 布尔型
bool isPassed = true;

// 字符串
string name = "张三";

// 常量
const int MAX_SIZE = 100;
```

### 运算符

```cpp
// 算术运算符
int a = 10 + 5;    // 加法
int b = 10 - 5;    // 减法
int c = 10 * 5;    // 乘法
int d = 10 / 3;    // 整数除法，结果为 3
double e = 10.0 / 3.0;  // 浮点除法，结果为 3.333...
int f = 10 % 3;    // 取余，结果为 1

// 赋值运算符
int x = 10;
x += 5;    // 等价于 x = x + 5
x -= 3;    // 等价于 x = x - 3
x *= 2;    // 等价于 x = x * 2
x /= 4;    // 等价于 x = x / 4
x %= 3;    // 等价于 x = x % 3

// 比较运算符
bool result1 = (10 > 5);     // true
bool result2 = (10 < 5);     // false
bool result3 = (10 == 10);   // true
bool result4 = (10 != 5);    // true
bool result5 = (10 >= 10);   // true
bool result6 = (10 <= 5);    // false

// 逻辑运算符
bool logic1 = true && false;  // 与，结果为 false
bool logic2 = true || false;  // 或，结果为 true
bool logic3 = !true;          // 非，结果为 false
```

### 控制结构

#### 条件判断

```cpp
// if-else 语句
int score = 85;
if (score >= 90) {
    cout << "优秀" << endl;
} else if (score >= 80) {
    cout << "良好" << endl;
} else if (score >= 60) {
    cout << "及格" << endl;
} else {
    cout << "不及格" << endl;
}

// switch 语句
int day = 3;
switch (day) {
    case 1:
        cout << "星期一" << endl;
        break;
    case 2:
        cout << "星期二" << endl;
        break;
    case 3:
        cout << "星期三" << endl;
        break;
    default:
        cout << "其他" << endl;
        break;
}
```

#### 循环结构

```cpp
// for 循环
for (int i = 0; i < 10; i++) {
    cout << i << " ";
}
cout << endl;

// while 循环
int i = 0;
while (i < 10) {
    cout << i << " ";
    i++;
}
cout << endl;

// do-while 循环
int j = 0;
do {
    cout << j << " ";
    j++;
} while (j < 10);
cout << endl;

// 范围 for 循环（C++11）
vector<int> numbers = {1, 2, 3, 4, 5};
for (const auto& num : numbers) {
    cout << num << " ";
}
cout << endl;
```

## 函数

### 函数定义与调用

```cpp
// 函数声明
int add(int a, int b);
void printMessage(string message);
double calculateArea(double radius);

// 函数定义
int add(int a, int b) {
    return a + b;
}

void printMessage(string message) {
    cout << message << endl;
}

double calculateArea(double radius) {
    return 3.14159 * radius * radius;
}

// 函数调用
int main() {
    int result = add(3, 5);
    cout << "3 + 5 = " << result << endl;
    
    printMessage("Hello, C++!");
    
    double area = calculateArea(5.0);
    cout << "半径为5的圆面积：" << area << endl;
    
    return 0;
}
```

### 函数重载

```cpp
// 函数重载：同名函数，不同参数
int add(int a, int b) {
    return a + b;
}

double add(double a, double b) {
    return a + b;
}

int add(int a, int b, int c) {
    return a + b + c;
}
```

### 默认参数

```cpp
// 默认参数
void printInfo(string name, int age = 18, string city = "北京") {
    cout << "姓名：" << name << ", 年龄：" << age << ", 城市：" << city << endl;
}

// 调用
printInfo("张三");           // 使用默认参数
printInfo("李四", 25);       // 使用部分默认参数
printInfo("王五", 30, "上海"); // 不使用默认参数
```

## 数组和字符串

### 数组

```cpp
// 一维数组
int scores[5] = {90, 85, 78, 92, 88};
for (int i = 0; i < 5; i++) {
    cout << scores[i] << " ";
}
cout << endl;

// 二维数组
int matrix[3][3] = {
    {1, 2, 3},
    {4, 5, 6},
    {7, 8, 9}
};

for (int i = 0; i < 3; i++) {
    for (int j = 0; j < 3; j++) {
        cout << matrix[i][j] << " ";
    }
    cout << endl;
}
```

### 字符串

```cpp
#include <string>

// C++ 字符串类
string name = "张三";
string greeting = "你好，" + name;

cout << "姓名：" << name << endl;
cout << "姓名长度：" << name.length() << endl;
cout << "第一个字符：" << name[0] << endl;

// 字符串操作
string str = "Hello, World!";
cout << "长度：" << str.size() << endl;
cout << "子串：" << str.substr(0, 5) << endl;
cout << "查找：" << str.find("World") << endl;
```

## 指针基础

### 指针概念

```cpp
// 指针声明和使用
int num = 100;
int* ptr = &num;  // ptr 指向 num 的地址

cout << "num 的值：" << num << endl;
cout << "num 的地址：" << &num << endl;
cout << "ptr 存储的地址：" << ptr << endl;
cout << "ptr 指向的值：" << *ptr << endl;
```

### 动态内存分配

```cpp
// 使用 new 分配内存
int* arr = new int[5];
for (int i = 0; i < 5; i++) {
    arr[i] = i * 10;
}

for (int i = 0; i < 5; i++) {
    cout << arr[i] << " ";
}
cout << endl;

// 使用 delete 释放内存
delete[] arr;
arr = nullptr;  // 避免悬空指针
```

## 面向对象编程入门

### 类与对象

```cpp
#include <iostream>
#include <string>
using namespace std;

class Student {
private:
    string name;
    int age;
    double score;

public:
    // 构造函数
    Student(string n, int a, double s) : name(n), age(a), score(s) {}
    
    // 成员函数
    void display() {
        cout << "姓名：" << name << endl;
        cout << "年龄：" << age << endl;
        cout << "分数：" << score << endl;
    }
    
    // Getter 方法
    string getName() const { return name; }
    int getAge() const { return age; }
    double getScore() const { return score; }
    
    // Setter 方法
    void setName(string n) { name = n; }
    void setAge(int a) { age = a; }
    void setScore(double s) { score = s; }
};

int main() {
    // 创建对象
    Student stu("张三", 20, 95.5);
    stu.display();
    
    // 使用 setter 修改属性
    stu.setAge(21);
    cout << "修改后的年龄：" << stu.getAge() << endl;
    
    return 0;
}
```

### 封装特性

```cpp
class BankAccount {
private:
    string owner;
    double balance;

public:
    BankAccount(string o, double b) : owner(o), balance(b) {}
    
    // 存款
    void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            cout << "存款成功，余额：" << balance << endl;
        } else {
            cout << "存款金额必须大于0" << endl;
        }
    }
    
    // 取款
    bool withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            cout << "取款成功，余额：" << balance << endl;
            return true;
        } else {
            cout << "取款失败" << endl;
            return false;
        }
    }
    
    // 查询余额
    double getBalance() const {
        return balance;
    }
};
```

## 现代 C++ 特性

### 自动类型推导 (C++11)

```cpp
// auto 关键字
auto i = 42;          // int
auto d = 3.14;        // double
auto s = "Hello";     // const char*
auto v = vector<int>{1, 2, 3};  // vector<int>

// decltype 关键字
int x = 10;
decltype(x) y = 20;  // y 的类型与 x 相同
```

### 智能指针 (C++11)

```cpp
#include <memory>

// unique_ptr：独占所有权
auto ptr = make_unique<int>(42);
cout << *ptr << endl;

// shared_ptr：共享所有权
auto shared1 = make_shared<string>("Hello");
auto shared2 = shared1;  // 引用计数 +1

// weak_ptr：解决循环引用
weak_ptr<string> weak = shared1;
if (auto locked = weak.lock()) {
    cout << *locked << endl;
}
```

### Lambda 表达式 (C++11)

```cpp
#include <algorithm>
#include <vector>

vector<int> numbers = {5, 2, 8, 1, 9};

// 基本 lambda
sort(numbers.begin(), numbers.end(), 
     [](int a, int b) { return a < b; });

// 捕获外部变量
int threshold = 5;
auto count = count_if(numbers.begin(), numbers.end(),
    [threshold](int x) { return x > threshold; });

// 引用捕获
int sum = 0;
for_each(numbers.begin(), numbers.end(),
    [&sum](int x) { sum += x; });
```

### 移动语义 (C++11)

```cpp
class String {
private:
    char* data;
    size_t length;

public:
    // 移动构造函数
    String(String&& other) noexcept 
        : data(other.data), length(other.length) {
        other.data = nullptr;
        other.length = 0;
    }
    
    // 移动赋值运算符
    String& operator=(String&& other) noexcept {
        if (this != &other) {
            delete[] data;
            data = other.data;
            length = other.length;
            other.data = nullptr;
            other.length = 0;
        }
        return *this;
    }
};
```

### 基于范围的 for 循环 (C++11)

```cpp
vector<int> numbers = {1, 2, 3, 4, 5};

// 只读访问
for (const auto& num : numbers) {
    cout << num << " ";
}

// 修改元素
for (auto& num : numbers) {
    num *= 2;
}
```

### 结构化绑定 (C++17)

```cpp
// 用于 pair
map<string, int> scores = {{"Alice", 95}, {"Bob", 87}};
for (const auto& [name, score] : scores) {
    cout << name << ": " << score << endl;
}

// 用于 tuple
auto [age, name, height] = make_tuple(25, "Alice", 170.5);
```

### std::optional (C++17)

```cpp
#include <optional>

optional<int> findNumber(const vector<int>& vec, int target) {
    auto it = find(vec.begin(), vec.end(), target);
    if (it != vec.end()) {
        return *it;
    }
    return nullopt;
}

// 使用
auto result = findNumber({1, 2, 3, 4, 5}, 3);
if (result.has_value()) {
    cout << "Found: " << result.value() << endl;
}
```

## 学习建议

### 学习路线
- **基础阶段**（2-4 周）
  - 掌握变量、数据类型、控制结构
  - 理解函数、数组、字符串
  - 学习基本的输入输出

- **进阶阶段**（4-8 周）
  - 深入理解指针和内存管理
  - 掌握面向对象编程
  - 学习标准模板库（STL）

- **高级阶段**（持续学习）
  - 学习现代 C++ 特性
  - 理解模板和泛型编程
  - 掌握多线程和并发编程

### 实践建议
- **多写代码**：编程是实践性很强的技能
- **理解原理**：不要死记硬背语法，要理解背后的设计思想
- **循序渐进**：从简单程序开始，逐步增加复杂度
- **查阅文档**：学会使用官方文档和在线资源
- **参与社区**：加入技术社区，与他人交流学习心得

### 推荐学习资源
- **书籍**：
  - 《C++ Primer》（第 5 版）
  - 《Effective C++》
  - 《C++ 标准库》

- **在线资源**：
  - CppReference（https://cppreference.com/）
  - LearnCpp（https://www.learncpp.com/）
  - C++ Core Guidelines（https://isocpp.github.io/CppCoreGuidelines/）

## 总结

C++ 是一门强大而灵活的编程语言，虽然学习曲线较陡峭，但一旦掌握，就能开发出高性能的应用程序。从基础语法开始，逐步深入面向对象编程和现代 C++ 特性，坚持练习，你会发现编程的乐趣！

---

**最后更新**：2026年6月27日  
**作者**：SOLO AI 助手  
**版本**：1.0