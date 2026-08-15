# 更新日志

## 2026-08-15
### 修复
- 修复 View Transitions 导致的功能失效（切页后脚本不再执行）：移动端点击分类不关抽屉、回到顶部按钮、中文排版（盘古之白）、TOC 清理、搜索（Pagefind）全部恢复正常
- 根因：启用 View Transitions 后 Astro 不会在切页时重新执行页面脚本，原依赖 `DOMContentLoaded` 的初始化只在首次加载触发一次
- 修复方式：`zh-optimize.ts` 改用官方 `astro:page-load` 事件（首次加载 + 每次导航均触发），并为菜单监听器/回到顶部滚动监听器增加防重与清理；搜索组件复制到项目内覆盖，Pagefind 初始化从 `DOMContentLoaded` 改为 custom element 的 `connectedCallback`
- 移动端搜索按钮不再显示凹陷框（`zh.css` 搜索框内阴影改为仅桌面端 `min-width: 50rem` 生效），避免移动端出现突兀的线框感
- 搜索打开提速：页面加载即预取 Pagefind 搜索引擎本体（`pagefind.js`），避免按 Ctrl+K 后首次输入才现场下载索引导致长时间等待
- 移动端搜索图标缩小为 16px（与主题切换图标一致）：Starlight 原版按钮 font-size 为 `--sl-text-xl`(20px)，在自定义移动端顶栏中偏大
- 修复 PC 端 Ctrl+K 搜索"要刷新才出现"：Ctrl+K 监听器原在 constructor 里注册，View Transitions 切页时新 `<site-search>` 元素重复 upgrade 导致监听器累积（切页后多个监听器交替开/关，表现无反应）；改为模块级标志全局只注册一次，回调动态查找当前元素
- 修复 PC 端搜索框"刷新后才出现"的深层原因：Pagefind 初始化原用 `requestIdleCallback` 等浏览器空闲才执行，PC 上浏览器持续繁忙时初始化迟迟不完成，按 Ctrl+K 时对话框内搜索框为空；改为 `connectedCallback` 触发后**立即初始化**（PagefindUI 渲染在默认关闭的对话框内，不影响首屏）
- 修复 PC 端搜索按钮不显示 "Ctrl K" 组合键提示：快捷键 `<kbd>` 初始 `display:none`，原版用 `<script is:inline>` 在页面加载时显示一次；View Transitions 切页后新元素 kbd 回到隐藏态但脚本不重跑，提示消失，刷新才恢复；改为在 `connectedCallback` 中显示（首次加载 + 每次切页均生效），并保留原版 Apple 设备显示 ⌘ 的逻辑

### 新增
- 启用 Astro View Transitions（`src/components/Head.astro` 注入 ClientRouter）：页面切换平滑过渡 + 全站链接预取（`prefetchAll`），显著提升切页流畅度
- 预取策略改为 `viewport`：链接进入视口即预加载（手机无需悬停，修复移动端切页无预取导致卡顿的问题）
- 页脚新增版权信息（© 2026 情礼宝藏）与 ICP 备案号（吉ICP备2022006636号-1，链接工信部官网 beian.miit.gov.cn）：自定义 `src/components/Footer.astro` 在 Starlight 默认页脚（编辑链接/更新时间/分页）基础上追加

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
