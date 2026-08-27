# 开发指南

如何运行、测试与修改本项目。英文版见 [Development](../en/development.md)。

## 环境要求

运行时与页面本身没有任何 npm 依赖——你只需要：

- **Python 3** 作为本地静态服务器（任何静态服务器均可，`npx serve` 也行）。以 Python 3.12.13 验证。
- **Node.js** 仅在需要跑 E2E 测试时使用。以 Node 22 验证。

## 命令

| 命令 | 用途 | 验证结果（2026-08-27） |
| --- | --- | --- |
| `python3 -m http.server 8000 --directory .` | 本地预览 <http://localhost:8000> | 可用 |
| 直接打开 `index.html`（不开服务器） | 磁盘直开预览 | 可用，赞赏二维码同样可用（Chromium 实测） |
| `python3 -m http.server 63647 --directory . &` | E2E 套件期望端口的开发服务器 | 可用 |
| `node test/e2e-donation.js` | 赞赏 E2E 套件（需依赖，见下） | **31 通过，0 失败**，零页面错误 |

仓库没有构建步骤，也没有 lint 配置（无可运行项；若引入 ESLint/Prettier，请把基线记录在此）。

### 运行 E2E 测试

套件的依赖仅用于开发（不会装进仓库）。需要 `playwright`、`pngjs`、`jsqr` 可被解析——装在任意位置并用 `NODE_PATH` 指向，或接受本地 `node_modules` 而 `npm i -D`：

```bash
python3 -m http.server 63647 --directory . &        # 套件固定期望此端口
NODE_PATH="<playwright 所在目录>:<pngjs/jsqr 所在目录>" node test/e2e-donation.js
```

Playwright 需与其缓存的浏览器匹配（上述运行使用 playwright 1.60.0 与本机缓存 Chromium）。

套件到底测什么（`test/e2e-donation.js`）：

- **桌面端、中文区域（20 项断言）：** 页脚入口文案；弹窗初始隐藏；首次打开前二维码库*未*加载；打开弹窗 → 标题 / 方式 / 提示；桌面端无跳转按钮；打开时懒加载二维码库；二维码深色印在浅底；支付宝与微信二维码均经 **jsQR 解码还原出确切支付串**；Esc 关闭并把焦点还给页脚入口；遮罩点击关闭；切换语言后弹窗文案全部重渲染；零页面错误。
- **移动端、iPhone UA、英文区域（11 项断言）：** 浏览器语言默认值；390px 无横向溢出；支付宝显示跳转链接且 `href` 为普通 `https` 地址；移动端二维码可解码；跳转失败后宽限期内换提示且二维码保持可见；微信无跳转链接；弹窗适配窄屏。

## 仓库结构

```
timestamp-tool/
├── index.html                  # 页面结构：语义化分区 + 赞赏弹窗标记
├── favicon.svg / favicon-*.png / apple-touch-icon-180.png   # 研报风 favicon 全套（紫底 tile + 航线剪影 + 黄方点）
├── css/
│   ├── fonts.css               # Spectral + IBM Plex Mono @font-face（5 字面）
│   ├── style.css               # 研报风格设计 tokens（同程紫黄）+ 响应式网格
│   └── donation.css            # 赞赏入口 / 弹窗 / 二维码卡片样式
├── fonts/                      # vendor 的 Spectral ×3 + IBM Plex Mono ×2（SIL OFL）及许可文本
├── js/
│   ├── i18n.js                 # 中英字典、检测、切换、持久化
│   ├── app.js                  # 实时时钟、转换、统计、剪贴板
│   └── donation.js             # 赞赏配置、弹窗、支付跳转、懒加载二维码
├── vendor/qrcode-generator/    # 锁定版本的二维码库（MIT，压缩后 21 KB）及其 LICENSE
├── test/e2e-donation.js        # Playwright E2E，含 jsQR 解码验证
├── docs/                       # 本文档体系（en/zh、img/）
├── CHANGELOG.md / CHANGELOG.zh.md
└── README.md / README.zh.md / README_FOR_AI.md
```

脚本在 `<body>` 末尾按此顺序加载：`i18n.js` → `app.js` → `donation.js`。

## 模块职责

- **`js/i18n.js`** —— 自包含 IIFE。持有 `zh` / `en` 字典，检测初始语言（localStorage `ts-lang` → 浏览器语言），对带 `data-i18n` / `data-i18n-placeholder` / `data-i18n-aria` 的元素应用翻译，暴露 `window.Lang`（`get` / `set` / `t` / `apply` / `onChange`）。字典值可为函数（用于复数单位）。
- **`js/app.js`** —— 消费 `window.Lang`。负责 250ms 时钟渲染、时间戳解析（`parseTs`）、纪元统计数学（`computeStats`、`isoWeek`）、相对时间格式化、剪贴板策略、共享结果面板。全部 UI 状态归结为 `state.viewMs`（正在展示的时刻）加 `state.unit`。
- **`js/donation.js`** —— 赞赏功能：`DONATION_CONFIG`（支付串）、带焦点圈定的弹窗开关、vendor 二维码库懒加载、按方式缓存的 SVG 二维码生成、手机端跳转软检测。见[功能设计文档](./features/runtime-qr-donation.md)。

**数据流（一行）：** 任意输入事件 → `setView(ms, source)` 更新 `state.viewMs` → `renderResults()` 重渲染六行 + 统计 → 每行可独立复制。时钟循环独立（每 250ms 一次 `renderNow`），只触碰 01 分区。

## 改代码时需保留的约定

- ES5 风格、无模块、无框架——`index.html` 必须保持从磁盘直接打开可用（不做打包器假设）。
- 所有资源引用保持**相对路径**（`css/…`、`js/…`、`vendor/…`），任何静态主机与任何子路径都无需改动即可工作。
- 修改 `index.html` 引用的文件时同步递增其 `?v=` 令牌——这是部署后的缓存新鲜度信号。
- 新增用户可见文案必须同时进入 `js/i18n.js` 的**两份**字典，并在标记中使用 `data-i18n*` 属性——禁止硬编码文本。
- 若改动赞赏文案或支付串，同步更新 `test/e2e-donation.js` 中的断言。

## 本地验证一次改动

1. 起服务（`python3 -m http.server 8000 --directory .`），在浏览器中点过你的改动。
2. 若触及赞赏功能，跑 E2E 套件（服务器在 63647 端口）。
3. 检查浏览器控制台干净——E2E 套件对任何页面错误都会判失败。
4. 部署形态（子路径）验证见[部署指南](./deployment.md)。
