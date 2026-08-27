[English](README.md) | [中文](README.zh-CN.md)

# 时间戳工具

![pure frontend](https://img.shields.io/badge/pure_frontend-no_build%2C_no_framework-111111?style=flat-square)
![license](https://img.shields.io/badge/license-MIT-D52B1E?style=flat-square)
![site](https://img.shields.io/badge/site-GitHub_Pages-111111?style=flat-square)

一页式 Unix 时间戳转换工具，排版做成瑞士风技术规格单：实时时钟、时间戳 ⇄ 日期时间双向转换、以及自 1970-01-01 起的天 / 周 / 月计数。全部计算在浏览器本地完成——无网络请求、无埋点。

**在线使用：** <https://petrel2015.github.io/timestamp-tool/>

> 💡 **核心目标** —— 一眼得到答案：粘贴时间戳（或选择日期），即可读到本地时间、UTC、ISO 8601、秒 / 毫秒两种 Unix 值、相对时间，以及该时刻在纪元中的位置。

## 功能

| 分类 | 说明 |
| --- | --- |
| 实时当前时间 | 每秒刷新的本地时间、星期、时区（如 `GMT+08:00 · Asia/Shanghai`），以及当前 Unix 秒 / 毫秒值，一键复制 |
| 时间戳 → 日期 | 支持负数（1970 年前），容忍空格 / 逗号 / 下划线分隔；单位可自动识别，也可强制按秒 / 毫秒解析 |
| 日期 → 时间戳 | 原生日期 + 时间（含秒）选择器，「采用当前时间」快捷键，结果即时输出 |
| 统一结果面板 | 本地时间、UTC 时间、ISO 8601、Unix 秒、Unix 毫秒、相对时间，全部可复制 |
| 纪元统计 | 自 1970-01-01 起第几天 / 第几周 / 第几个月，另附年内第几天与 ISO 周号 |
| 赞赏 | 页脚低调入口 ☕，弹窗内支付宝 / 微信支付二维码由浏览器在打开时实时生成；手机端优先尝试支付宝跳转，失败即回退二维码 |
| 中英双语 | 顶栏切换中文 / English；默认跟随浏览器语言，选择会被记住 |
| 响应式 | 手机单列堆叠，平板与桌面双列网格 |

## 口径约定

- **天 / 周 / 月计数** —— 1970-01-01 为第 1 天；第 1 周覆盖 1970-01-01 ～ 01-07；第 1 个月为 1970 年 1 月。均按本地日历日期计算。
- **单位自动识别** —— 不超过 11 位按秒，12–15 位按毫秒，16 位及以上按微秒；有歧义时可手动强制单位。

## URL 参数

用 `?ts=` 预填转换器（自动识别规则相同）：

```
https://petrel2015.github.io/timestamp-tool/?ts=1760000000000
```

## 开发

### 项目结构

```
timestamp-tool/
├── index.html                  # 页面结构（语义化分区 + 赞赏弹窗）
├── css/style.css               # 瑞士风格设计系统 + 响应式网格
├── css/donation.css            # 赞赏入口 / 弹窗 / 二维码卡片样式
├── js/i18n.js                  # 中英字典、语言检测、切换与持久化
├── js/app.js                   # 实时时钟、转换、统计、剪贴板
├── js/donation.js              # 赞赏配置、弹窗、支付跳转、懒加载二维码
├── vendor/qrcode-generator/    # 锁定版本的二维码库（MIT，已压缩）—— 懒加载
└── test/e2e-donation.js        # Playwright E2E，含 jsQR 解码验证
```

### 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

无构建步骤；直接双击 `index.html` 也能使用。

### 测试

```bash
python3 -m http.server 63647 &   # E2E 依赖此端口
npm i -D playwright pngjs jsqr   # 仅测试用的开发依赖（或用 NODE_PATH 指向已有副本）
node test/e2e-donation.js        # 桌面 + iPhone UA 流程，jsQR 解码二维码
```

### 赞赏功能实现说明

- 页脚入口打开弹窗；支付二维码由 `js/donation.js` 中 `DONATION_CONFIG` 的收款链接在**运行时实时生成**——仓库不保存任何二维码图片。
- 二维码库（`qrcode-generator` v1.4.4，MIT）锁定版本 vendor 进仓库，**仅在弹窗首次打开时懒加载**；以行内 SVG 渲染（纠错级别 M、4 模块静区、白底墨点），按支付方式缓存。
- 桌面端不尝试唤起支付 App。手机端支付宝提供普通 `https` 链接（由支付宝官方页面自行处理唤起）；微信因 `wxp://` 在浏览器中不可靠而直接展示二维码。通过 `visibilitychange` / `pagehide` / `blur` 软检测：未发生跳转时仅切换提示文案，二维码全程可见，没有死胡同。

### 架构说明

- 两个脚本均为零依赖 IIFE；`i18n.js` 暴露 `window.Lang`，`app.js` 消费它并在语言切换时整体重渲染。
- 统一的 `viewMs` 状态驱动共享结果面板；无论编辑哪一侧（时间戳输入或日期选择器），另一侧都会同步。
- 剪贴板使用异步 Clipboard API，带 `execCommand` 兜底与超时竞速，兼容嵌入式 webview。
- 资源链接带 `?v=` 版本令牌，便于部署后核对缓存新鲜度。

## 技术栈

| 层面 | 选择 |
| --- | --- |
| 结构 / 样式 | 语义化 HTML5，手写 CSS（grid、`clamp()` 流式字号） |
| 逻辑 | 原生 JavaScript（ES5 风格 IIFE），无框架、无构建 |
| 二维码 | `qrcode-generator` v1.4.4（MIT），vendor 压缩版，弹窗打开时懒加载 |
| 字体排印 | 系统 Helvetica 字体栈、等宽数字、值用等宽字体 |
| 主题 | 瑞士国际主义风格 —— 纸白 `#fafaf8`、墨色 `#111111`、单一红色强调 `#d52b1e`、细线网格 |

## 局限 ⚠️

- 日期选择器仅支持公元 1 年及以后；更早的日期只能通过时间戳输入到达（时间戳本身接受完整 ECMAScript 范围，约 ±27.5 万年）。
- 时间选择器的秒位编辑依赖浏览器行为；该栏始终接受 `HH:MM`（秒默认为 0）。
- 天 / 周 / 月计数按本地日历；1970 年前的日期按设计显示非正计数。

## 许可

[MIT](LICENSE) © 2026 Yu Hong

---

## 请作者喝杯咖啡 ☕

如果这个小工具帮到了你，点击站点页脚的 **☕ 请作者喝杯咖啡** —— 弹窗中的支付宝 / 微信支付二维码由浏览器实时生成。
