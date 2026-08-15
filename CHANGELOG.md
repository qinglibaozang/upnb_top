# 更新日志

## 2026-08-15
### 修复
- 修复 View Transitions 导致的功能失效（切页后脚本不再执行）：移动端点击分类不关抽屉、回到顶部按钮、中文排版（盘古之白）、TOC 清理、搜索（Pagefind）全部恢复正常
- 根因：启用 View Transitions 后 Astro 不会在切页时重新执行页面脚本，原依赖 `DOMContentLoaded` 的初始化只在首次加载触发一次
- 修复方式：`zh-optimize.ts` 改用官方 `astro:page-load` 事件（首次加载 + 每次导航均触发），并为菜单监听器/回到顶部滚动监听器增加防重与清理；搜索组件复制到项目内覆盖，Pagefind 初始化从 `DOMContentLoaded` 改为 custom element 的 `connectedCallback`

### 新增
- 启用 Astro View Transitions（`src/components/Head.astro` 注入 ClientRouter）：页面切换平滑过渡 + 全站链接预取（`prefetchAll`），显著提升切页流畅度
- 预取策略改为 `viewport`：链接进入视口即预加载（手机无需悬停，修复移动端切页无预取导致卡顿的问题）

### 变更
- AGENTS.md 规则体系适配 DSH：方法型规则（命令/风格/Git/安全/流程/约定）精炼内联，事实型规则（项目结构/文件索引/数据结构等）改为按需读取 `agents/` 原文（`@import` 在 DSH 下不自动内联）

## 2026-08-14
### 新增
- AGENTS.md 规则体系：拆分为 11 个主题规则文件（常用命令/项目结构/代码风格/测试/Git/安全/工作流/技术栈/项目约定/文件索引/数据结构），AI 协作按"先澄清需求 → spec 验收标准 → 批准后动手"流程执行
- 数据结构规范文档（agents/数据结构.md）：统一 frontmatter 字段约定，为链接卡片、自定义页面预留登记框架
- 变更日志规范（agents/变更日志.md）：提交涉及可见变化时自动同步更新本文件

### 变更
- README 重写为中文实用指南：补充快速开始、部署方案（GitHub Pages/Vercel/Netlify/自有服务器）、内容添加方法
- tsconfig.json 修复 TS5104（isolatedModules 与 verbatimModuleSyntax 冲突）
- package.json 添加 typescript devDependency
- 删除误建垃圾文件 `nul`

### 修复
- 无
