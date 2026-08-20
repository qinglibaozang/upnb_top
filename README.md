# 情礼宝藏

优质学习资源汇总导航站，基于 [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) 构建。

## 这是什么

一个中文文档/资源导航站：内容按分类整理在 `src/content/docs/` 下，侧边栏导航根据文件夹自动生成。

## 快速开始

**环境要求**：Node.js 18+，包管理器 [pnpm](https://pnpm.io)（本项目使用 pnpm，勿用 npm）。

```bash
# 1. 安装依赖
pnpm install

# 2. 启动开发服务器（默认 http://localhost:4321）
pnpm dev

# 3. 生产构建（输出到 dist/）
pnpm build

# 4. 本地预览生产构建
pnpm preview
```

> 在 Windows 上也可用后台模式开发：`astro dev --background`，配合 `astro dev stop` / `astro dev status` / `astro dev logs` 管理。

## 如何部署

本项目是纯静态站（无服务端渲染），构建产物在 `dist/` 目录，可部署到任意静态托管：

- **GitHub Pages**：`pnpm build` 后将 `dist/` 内容推送到 `gh-pages` 分支，或配置 GitHub Actions
- **Vercel / Netlify**：导入仓库，构建命令 `pnpm build`，输出目录 `dist/`，无需额外配置
- **自有服务器**：`pnpm build` 后将 `dist/` 内容上传到 Web 根目录（如 Nginx 的 html 目录）

## 如何添加内容

内容文件放 `src/content/docs/`，支持 `.md` 和 `.mdx`，每个文件生成一个页面路由。

**新增一个分类**：在 `src/content/docs/` 下新建文件夹即可（如 `02.新分类/`），侧边栏自动生成，无需改配置。文件夹名前的数字序号控制分类排序。

**新增一篇文章**：在对应分类文件夹里新建 `.md` 文件，frontmatter 示例：

```markdown
---
title: 文章标题
description: 文章摘要（可选）
contentWidth: wide # 正文宽度：wide / full / 或 CSS 长度如 900px；删掉用默认
---
文章正文……
```

**首页**：`src/content/docs/index.mdx`，用 `template: splash` 落地页布局。

## 目录结构

```
public/                    # 静态资源（favicon、logo、images）
serve-preview.mjs          # 本地静态预览服务器（pnpm preview:local）
src/
├── assets/                # 站内图片（logo 等）
├── components/            # 自定义组件覆盖（Header、TwoColumnContent、Head、Search 等 8 个）
├── content.config.ts      # 内容集合 schema（contentWidth + jieba 搜索分词）
├── content/docs/          # 站点内容（按文件夹分类）
├── scripts/               # 客户端脚本（zh-optimize.ts 中文排版优化等）
├── styles/                # 样式（zh.css 中文排版体系、pagefind-ui.css 搜索样式）
└── vendor/                # 本地化第三方文件（pagefind-ui-core.mjs）
astro.config.mjs           # 站点配置
```

## 相关文档

- [Starlight 文档](https://starlight.astro.build)
- [Astro 文档](https://docs.astro.build)
