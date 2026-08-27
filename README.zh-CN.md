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
├── index.html                  # 页面结构（语义化分区）
├── css/style.css               # 瑞士风格设计系统 + 响应式网格
├── js/i18n.js                  # 中英字典、语言检测、切换与持久化
├── js/app.js                   # 实时时钟、转换、统计、剪贴板
├── img/                        # 生成的收款二维码（SVG）
├── scripts/generate-donate-qr.mjs  # 重新生成二维码的脚本（仅开发用）
└── package.json                # 仅为上述脚本服务开发依赖
```

### 本地预览

```bash
python3 -m http.server 8000
# 打开 http://localhost:8000
```

无构建步骤；直接双击 `index.html` 也能使用。

### 重新生成收款二维码

```bash
npm install
npm run donate:qr
```

脚本把收款链接渲染为白底墨色 SVG（纠错级别 H），与站点纸色主题保持一致。

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
| 字体排印 | 系统 Helvetica 字体栈、等宽数字、值用等宽字体 |
| 主题 | 瑞士国际主义风格 —— 纸白 `#fafaf8`、墨色 `#111111`、单一红色强调 `#d52b1e`、细线网格 |

## 局限 ⚠️

- 日期选择器仅支持公元 1 年及以后；更早的日期只能通过时间戳输入到达（时间戳本身接受完整 ECMAScript 范围，约 ±27.5 万年）。
- 时间选择器的秒位编辑依赖浏览器行为；该栏始终接受 `HH:MM`（秒默认为 0）。
- 天 / 周 / 月计数按本地日历；1970 年前的日期按设计显示非正计数。

## 许可

[MIT](LICENSE) © 2026 Yu Hong

---

## 请我喝杯咖啡 ￥4.9 ☕

| Alipay 支付宝 | WeChat 微信 |
| :---: | :---: |
| <img src="img/alipay-qr.svg" width="200" alt="支付宝收款二维码"> | <img src="img/wechat-qr.svg" width="200" alt="微信收款二维码"> |
