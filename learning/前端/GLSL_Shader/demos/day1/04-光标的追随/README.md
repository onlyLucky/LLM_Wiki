# Demo 04 · 光标的追随

对应讲义：`1.7 交互输入`（事件桥与三重惯性）

## 运行

```bash
npm run dev
# http://localhost:5174/demos/day1/04-光标的追随/index.html
```

## 关键点

- 三重惯性各司其职：光晕主体 lerp 0.08（`chrome.pointer.sx/sy` 现成的）、拖尾 lerp 0.03（JS 侧自维护 `u_tail`）、按压强度 lerp 0.12（`u_press`）——系数越小惯性越大，「跟不太上」才看得见层次
- isDown 是瞬时的，但收缩不该瞬跳：JS 侧把 0/1 目标滑成渐变的 `u_press`——任何状态都可以有惯性，不止位置
- 宽高比陷阱在距离计算时最明显：光晕在宽屏会变椭圆——把 `uv.x` 和 `mouse.x` 都乘 aspect 再算 `distance`
- 发光用加法不换乘法：`color += ROSE * glow` 在深底色上叠出光的层次；大面积糊红用中心白热点破

## 视觉规格

- 色板：底色 `#0B0E14`；主光晕玫红 `#FF4D6D`（exp 衰减，radius 12%），拖尾天青 `#4CC9F0`（radius ×1.6，强度 35%），中心白热核（radius/4，50%）
- 交互：移动丝滑跟随；按压半径 12%→7%、亮度 ×1.4，过渡 lerp 0.12
- 动效：无自主动画——画面唯一的引擎是鼠标（未使用 u_time）
- 细节：无 grain / 暗角（教学页保持素颜）；性能：单 draw call、DPR ≤ 2，预计 60fps

## 常见报错

| 报错 | 原因 |
|------|------|
| 光晕是椭圆的 | distance 前没做 aspect 修正：uv.x 与 mouse.x 要同时乘 |
| 光晕瞬移、没有跟随感 | 传了 nx/ny 瞬时坐标——用 sx/sy（chrome 已 lerp 0.08） |
| 按压时光晕闪跳 | isDown 直接当 uniform 传——JS 侧先 lerp 成 u_press |
| 光晕边缘有硬圈 | 用了 smoothstep 平肩——exp(-d/k) 的衰减更自然 |
