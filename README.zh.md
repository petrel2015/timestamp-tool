# 时间戳工具

[English](./README.md) | 简体中文

![license](https://img.shields.io/badge/license-MIT-56338A?style=flat-square)
![pure frontend](https://img.shields.io/badge/pure_frontend-no_build%2C_no_framework-111111?style=flat-square)
![dependencies](https://img.shields.io/badge/runtime_dependencies-0-111111?style=flat-square)
![i18n](https://img.shields.io/badge/i18n-%E4%B8%AD%E6%96%87_%2F_EN-111111?style=flat-square)
![site](https://img.shields.io/badge/site-GitHub_Pages-111111?style=flat-square)

一页式、中英双语的 Unix 时间戳转换工具，排版做成机构投研报告风格（同程紫黄主题）：实时时钟、时间戳 ⇄ 日期时间双向转换、以及自纪元起的天 / 周 / 月计数——所有答案一眼可得。

查一个时间戳，通常意味着把它贴进搜索框，再在铺满广告的结果页里费力辨认。这个工具在本地即时作答：粘贴时间戳（或选择日期），即可读到本地时间、UTC、ISO 8601、秒 / 毫秒两种 Unix 值、相对时间，以及该时刻自 1970-01-01 起的位置。全部计算在浏览器中完成——无网络请求、无埋点、无构建步骤。

> AI 助手与智能体：本项目的结构化、机器友好描述见 [README_FOR_AI.md](./README_FOR_AI.md)（仅英文）。

## 在线使用

**[打开在线工具 →](https://petrel2015.github.io/timestamp-tool/)**

也可以用 URL 预填转换器：<https://petrel2015.github.io/timestamp-tool/?ts=1760000000000>

![桌面端总览，中文界面](docs/img/overview-zh.webp)

![桌面端总览，英文界面](docs/img/overview-en.webp)

## 核心功能

### 实时当前时间

当前本地时间（250ms 节拍刷新）、星期、时区标签（如 `GMT+08:00 · Asia/Shanghai`），以及当前 Unix 秒 / 毫秒值——每一项都可一键复制，并附带与结果面板相同的纪元统计。

→ 分步说明：[使用指南 · 实时当前时间](docs/zh/usage.md#实时当前时间)

### 双向转换

**时间戳 → 日期时间** 接受负数（1970 年前），容忍空格 / 逗号 / 下划线分隔。**日期时间 → 时间戳** 使用原生选择器，附「采用当前时间」快捷键。编辑任意一侧，另一侧即时同步。

单位自动识别：不超过 11 位按**秒**，12–15 位按**毫秒**，16 位及以上按**微秒**；有歧义时可手动强制单位。完整规则与错误场景见[使用指南 · 时间戳转日期时间](docs/zh/usage.md#时间戳转日期时间)。

![通过 ?ts= 预填时间戳的转换器](docs/img/converter-ts-prefill-zh.webp)

### 统一结果面板

一个面板、六种可复制输出：本地时间、UTC 时间、ISO 8601、Unix 秒、Unix 毫秒、相对时间（“3 天后”、“2 个月前”）。→ [使用指南 · 结果面板](docs/zh/usage.md#结果面板)

### 纪元统计

自 1970-01-01 起的天 / 周 / 月计数、年内第几天、ISO 8601 周号——按本地日历日期计算，「当前时间」与转换结果各有一套。计数口径（1970-01-01 为第 1 天；第 1 周覆盖 1970-01-01 ～ 01-07）见[使用指南 · 纪元统计口径](docs/zh/usage.md#纪元统计口径)。

### 双语、响应式、零依赖

顶栏切换中文 / English；默认跟随浏览器语言并记住选择。手机单列堆叠，桌面双列网格。手写 CSS，零框架、零运行时依赖。

![390px 移动端布局](docs/img/mobile-zh.webp)

### 赞赏：运行时生成二维码

页脚低调入口（☕）打开弹窗，支付宝 / 微信支付二维码在**打开时由浏览器实时生成**——仓库不保存二维码图片，无后端、无第三方 API。设计文档：[运行时二维码赞赏](docs/zh/features/runtime-qr-donation.md)。

![赞赏弹窗与运行时生成的二维码](docs/img/donation-dialog-zh.webp)

## 快速开始

无需安装、无需构建：

```bash
git clone https://github.com/petrel2015/timestamp-tool.git
cd timestamp-tool
python3 -m http.server 8000
# 打开 http://localhost:8000
```

直接双击 `index.html` 从磁盘打开同样可用（已实测——即使从 `file://` 打开，赞赏二维码也能生成）。

## 文档

| 文档 | 内容 |
| --- | --- |
| [README.md](./README.md) | English main entry |
| [README_FOR_AI.md](./README_FOR_AI.md) | 面向 AI 助手的项目结构化描述（仅英文） |
| [CHANGELOG.zh.md](./CHANGELOG.zh.md) · [English](./CHANGELOG.md) | 版本历史 |
| [中文文档索引](./docs/zh/index.md) · [English index](./docs/en/index.md) | 双语全套文档页 |
| [使用指南](./docs/zh/usage.md) | 分步操作、输入规则、错误信息、边界行为 |
| [开发指南](./docs/zh/development.md) | 环境、命令、E2E 测试、模块职责 |
| [部署指南](./docs/zh/deployment.md) | GitHub Pages 配置与验证清单 |
| [故障排查](./docs/zh/troubleshooting.md) | 症状 → 原因 → 修复对照表 |
| [隐私说明](./docs/zh/privacy.md) | 存了什么、绝不做什么 |
| [常见问题](./docs/zh/faq.md) | 范围与边界类问题 |
| [运行时二维码赞赏](./docs/zh/features/runtime-qr-donation.md) | 赞赏功能设计文档 |

## 技术栈

| 层面 | 选择 |
| --- | --- |
| 结构 / 样式 | 语义化 HTML5，手写 CSS（grid、`clamp()` 流式字号） |
| 逻辑 | 原生 JavaScript（ES5 风格 IIFE），无框架、无构建 |
| 二维码 | [`qrcode-generator`](https://github.com/kazuhikoarase/qrcode-generator) v1.4.4（MIT），vendor 锁定（压缩后 21 KB），弹窗打开时懒加载 |
| 字体排印 | 本地 vendor 的 Spectral 衬线（3 字面）+ IBM Plex Mono（2 字面），均 SIL OFL，位于 `fonts/`；中文回退思源宋 / 宋体栈；所有数值等宽 + 表格数字 |
| 主题 | 研报风格 · 同程紫黄 —— 纯白纸面、紫黑墨阶，紫 `#56338A` 全页唯一彩色文字，黄 `#F6C343` 仅作底色强调（荧光笔 / 方点），红 `#B02418` 仅警示，发丝线分隔、胶囊 pill 按钮 |

## 架构概要

三个零依赖 IIFE 按序加载：`js/i18n.js`（暴露 `window.Lang`）、`js/app.js`（时钟、转换、统计、剪贴板）、`js/donation.js`（弹窗 + 运行时二维码）。统一的 `viewMs` 状态驱动共享结果面板；编辑任一输入侧都会重新同步另一侧。剪贴板使用异步 Clipboard API，带 `execCommand` 兜底与超时竞速，兼容嵌入式 webview。资源链接带 `?v=` 令牌，便于部署后核对缓存新鲜度。

完整模块图与数据流：[开发指南 · 模块职责](docs/zh/development.md#模块职责)。

## 兼容性与局限

- 日期选择器仅支持公元 1 年及以后；更早的日期只能通过时间戳输入到达（时间戳本身接受完整 ECMAScript 范围，约 ±273,790 年）。
- 时间选择器的秒位编辑依赖浏览器行为；该栏始终接受 `HH:MM`（秒默认为 0）。
- 天 / 周 / 月计数按本地日历；1970 年前的日期按设计显示非正计数。
- 没有时区选择器：结果始终是本地时间 + UTC。增加选择器是非目标。

## 参与贡献

欢迎 Issue 与 Pull Request。大于错别字修动的改动，请先开 Issue 商定方案。本地跑 E2E 测试时注意其依赖 63647 端口的开发服务器——见[开发指南](docs/zh/development.md#命令)。

## 版本历史

见 [CHANGELOG.zh.md](./CHANGELOG.zh.md)。仓库尚无 git tag；`1.0.0` 为已发布站点的首个汇总版本号。

## 许可

[MIT](LICENSE) © 2026 Yu Hong。vendor 二维码库由 Kazuhiko Arase 以 MIT 授权（[vendor/qrcode-generator/LICENSE](vendor/qrcode-generator/LICENSE)）；vendor 的 Spectral 与 IBM Plex Mono 字体以 SIL OFL 1.1 授权（[fonts/OFL-Spectral.txt](fonts/OFL-Spectral.txt)、[fonts/OFL-IBMPlexMono.txt](fonts/OFL-IBMPlexMono.txt)）。

---

## 请作者喝杯咖啡 ☕

如果这个小工具帮到了你，点击站点页脚的 **☕ 请作者喝杯咖啡** —— 弹窗中的支付宝 / 微信支付二维码由浏览器实时生成。设计细节：[运行时二维码赞赏](docs/zh/features/runtime-qr-donation.md)。
