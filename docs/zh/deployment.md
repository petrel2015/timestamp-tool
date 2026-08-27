# 部署指南

站点如何发布、如何验证一次部署。英文版见 [Deployment](../en/deployment.md)。

## 当前部署方式

站点由 **GitHub Pages** 伺服于 <https://petrel2015.github.io/timestamp-tool/>：

- **来源：** `main` 分支、仓库根目录（经 GitHub Pages API 核实：`build_type: legacy`、`source: main /`）。推送到 `main` 即触发站点重建。
- **HTTPS：** 在 Pages 层强制开启（未配置自定义域名）。

没有构建流水线——仓库里的内容*就是*被伺服的内容。

## 为什么任何静态主机都可用

`index.html` 中的资源引用全部是**相对路径**（`css/style.css?v=2`、`js/app.js?v=2`、`vendor/qrcode-generator/qrcode.min.js`），代码也不检查 `location`。因此页面可以工作于：

- 仓库子路径（`/timestamp-tool/`，即 GitHub Pages 的形态）；
- 任何其他静态主机的域名根（Netlify、Vercel 静态、nginx、Caddy、内网文件共享）；
- 或从磁盘直接双击打开（`file://`，已实测）。

不存在也不需要任何 `basePath` 配置。

## 发布一次更新

1. 提交到 `main` 并推送。若改动了 `css/`、`js/`、`vendor/` 下的文件，请在同一次提交中递增 `index.html` 里对应的 `?v=` 令牌——这是本项目的缓存新鲜度约定。
2. GitHub Pages 自动重建（通常一两分钟）。

## 部署后验证清单

每次部署后过一遍（以下各项均于 2026-08-27 在当前站点验证过）：

- [ ] `curl -sI https://petrel2015.github.io/timestamp-tool/` → `200`
- [ ] `curl -sI https://petrel2015.github.io/timestamp-tool/js/app.js?v=2` → `200`（其余你改过的资源同理）
- [ ] 浏览器打开页面：时钟走动、时区标签渲染。
- [ ] 粘贴已知时间戳（如 `1760000000` → `2025-10-09`，本地具体时刻取决于你的时区），核对六行结果。
- [ ] 打开赞赏弹窗：二维码（懒加载脚本）在一秒内出现。
- [ ] 浏览器控制台无错误。

## 自定义域名说明

当前未配置自定义域名。若日后在 GitHub Pages 设置中添加：

- DNS 与 HTTPS 由 GitHub 侧配置；保持 **Enforce HTTPS** 开启。
- 本项目无需任何改动——资源为相对路径，应用内没有硬编码源。`?ts=` 参数与全部功能继续可用。
