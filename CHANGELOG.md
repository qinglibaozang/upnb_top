# 更新日志

## 2026-08-16
### 新增
- hero 按钮复刻 DeepSeek Harness 官网胶囊：1px 渐变 hairline 描边（内容底 padding-box + 渐变描边 border-box 双渐变）+ 双层外发光 + 玻璃拟态（blur 10px）+ hover 光晕上浮；参数对齐官网 ds-btn-m（文字 15px / 行高 120% / padding 11×18px / 图标间距 6px / 图标 16px / 高度约 40px）
- hero 按钮主次区分：第一个「入站必读」实心品牌蓝底 + 白字 + 蓝光晕，第二个保持渐变描边玻璃胶囊（纯 CSS `:first-child`，零组件改动）
- hero 标题逐字弹跳入场动画（`zh-optimize.ts` 按字拆 `span.zh-char`，纯 CSS transform/opacity，`prefers-reduced-motion` 时完全禁用）
- 首页横排大卡片：参考官网「Cordis 内核 / 插件提供能力 / 配置层自由组合」三卡片并列横排 + 居中 + 英文 mono 标签（START HERE / RESOURCES / CREATORS）+ hover 渐变描边
- 提示框 aside 配色统一：note=品牌蓝 / tip=青 / caution=琥珀 / danger=红（低饱和语义色变量，替换 starlight 默认紫色 tip）
- 文章页 H1 品牌蓝渐变文字 + 底部 hairline 分隔线（仅文章页，首页 hero 不受影响）
- 全站焦点环统一：`:focus-visible` 品牌蓝 2px 轮廓（仅键盘导航触发；排除首页搜索框避免双重描边）
- 顶栏搜索框拉长至固定 400px（覆盖 starlight 自身 `max-width: 22rem` 封顶），首页（PC）时水平垂直居中于顶栏
- 侧边栏 VS Code 文件树化：文件夹/文件行内 SVG 图标（data URI，零网络请求）、隐藏折叠箭头、子级实线引导线（16px 对齐链：margin 1rem 线=图标中心 + 5px padding 补边框位）、选中项浅蓝底圆角块
- 侧边栏分组标题去数字序号：一级分组在 `astro.config.mjs` 服务端 `folderLabel()` 剥离，autogenerate 嵌套子文件夹由 `zh-optimize.ts` 新增 `stripSidebarNumberPrefixes()` 客户端剥离（astro:page-load，VT 兼容）
- 侧边栏自动生成：`starlight-sidebar-topics` 插件 + `autoTopics()` 扫描 `src/content/docs` 一级文件夹自动生成顶部分类切换（label 去数字前缀、图标循环分配、递归查找首篇文档生成落地页，支持多层级专题）
- 固定底栏（`Footer.astro` + `.zh-footer-bar`）：吸在视口底部不随文章上移，与顶部导航栏对称（同高 `--sl-nav-height` 3.5rem、毛玻璃 blur16 + 提饱和、hairline 上边框、向上投影、100vw 防滚动条变窄）；版权+备案居中、编辑链接钉右侧；回到顶部按钮上移至底栏上方；左栏层叠压至 0 防遮挡
- 测试专题样例：`04.测试专题/`（4 层嵌套 7 篇文章），用于验证多层级侧边栏与分类隔离
- 文章页描述元信息：10 篇文档 frontmatter 补充 `description` 字段（标题下方展示）
- TOC 按 vitepress.dev 官网复刻：左 1px 分隔线 + 1rem 内边距；当前项品牌蓝文字 + 2px 品牌蓝 mark 线（`li:has(>a[aria-current=true])::before`，按 `--depth` 变量回退对齐左分隔线，垂直居中当前行）

### 变更
- 移除首页 hero 下方大搜索框（含 `.zh-home-search` 整套样式），搜索入口统一为顶栏搜索框
- 字体体系统一 16px：正文 / 左栏链接与分组标题 / 右栏 TOC 标题与条目全部 16px；左右边栏行高统一 2（此前侧边栏 1.4、TOC 2.28571）
- 侧边栏选中态：常规字重 400（`--zh-fw-sidebar-active` var 间接引用，防 minifier 把 400 当冗余删除）+ 浅蓝底圆角块，不再使用左侧色条（原 ::before 色条规则移除）
- 面包屑导航彻底移除（组件代码与样式删除，不可恢复；此前为 display:none 保留）
- 首页 hero 下方「站点导航」标题删除
- 顶栏搜索容器改用自定义类 `zh-header-search`（Tailwind `md:max-w-*` 类未被 v4 扫描生成，改纯 CSS 确定控制）
- TOC 链接清除 starlight 原生 `--depth` 左内边距（`calc(1rem*var(--depth)+.5rem)`），「本页目录」标题与链接左对齐
- 侧边栏/暗主题图标改 CSS mask 方案：背景图 SVG 内 `stroke='currentColor'` 解析不到宿主颜色恒黑（暗主题不可见），改 `background-color:currentColor` + `mask`（mask 只取形状、颜色随主题）
- 页面「更新于」时间统一走 git 历史（`lastUpdated: true`）：16 篇文档 frontmatter 手写 `lastUpdated` 时间戳注释保留（不再参与构建）
- 首页社交图标指向本站仓库（此前为 Starlight 上游占位）；首页 3 处死链修正为真实路径
- 表格恢复 starlight 原生横向滚动（此前 `display:table` + `overflow:hidden` 导致宽表格无法左右滑）
- 移动端 TOC 当前项与桌面一致（品牌蓝），桌面/移动端 TOC 基础规则合并共用
- 代码清理（批次 A）：`book` 无效图标（starlight 无此图标，`<Icon>` 静默渲染空 svg）→ `laptop`；删除 Footer kudos 恒假分支、PageTitle `date` 恒失效回退、Header 无效 `route.currentLocale` 引用、zh.css 死变量与重复 dark 块、`.card:nth-child` 冗余选择器、全站无效 `permalink` 字段、未用 `sharp` 依赖、重复 `start` 脚本、死文件 `_yaml-check.js`
- 配置注释补全：`tsconfig.json` 每项加中文注释（含 `isolatedModules:false` 关闭原因）、`astro.config.mjs` 补 title/logo/social
- `Search.astro` pagefind 目录 URL 提取为模块级常量（两处共用）；`serve-preview.mjs` 优化（补 woff2/webp/avif MIME、路径安全检查）并入 `pnpm preview:local`，删除冗余 `start-dev.cmd`

### 修复
- 侧边栏「怎么还是粗体」：根因① starlight 默认 `.large`（顶层链接）`font-weight: 600`；根因② CSS minifier 把等于初始值的 `font-weight: 400`（含 `!important`）当冗余删除，删后回落 starlight 600——改用 `var(--zh-fw-sidebar-active)` 间接引用后稳定生效
- 侧边栏字号/行高「改太小、行距变大」：`.entry-link` 类从未命中真实 DOM（链接实际只有 `large` 类），修正选择器为 `.sidebar-content a.large`
- hero 按钮高度不一：两个按钮图标分别来自 LinkButtonIcon（`block size-5`）与 starlight Icon（内联 svg 基线空隙），统一 `svg { display:block; 1rem }` 后胶囊等高
- hero 内容不居中：nova 桌面端左对齐（`text-align:start`/`flex-start`），补 stack/copy/actions 三条居中覆盖
- TOC mark 线不显示：链接 `a` 有 `overflow:hidden`（ellipsis 必需）裁剪 `::before`，mark 线改挂到 `li` 上
- TOC 嵌套出现两层 mark 线：`:has(a)` 为后代匹配，h2 的 li 因内部 h3 的 a 是当前项而误匹配 → 改 `:has(>a)` 直接子级匹配
- 学科UP主 页面 title 重复 5 次（历史误编辑）→ 修正为「学科UP主」，并删除残留测试内容「123321」

## 2026-08-15
### 新增
- UI 改版「商务克制风」（参考华为云/腾讯云/阿里云文档站）：
  - 首页门户化：品牌渐变 hero（移除 Starlight 吉祥物图）+ hero 下方大号搜索框 + 分类卡片统一品牌蓝并 hover 上浮（`index.mdx` 结构调整 + `zh.css`）
  - 文章页头部：面包屑（分类 › 当前页）+ 标题下方描述与更新时间元信息行（新增 `src/components/PageTitle.astro` 覆盖）
  - 侧边栏分组标题小标签化、当前项改为浅蓝底 + 左侧品牌蓝色条；右栏 TOC 当前项浅蓝高亮、「本页目录」标题小标签化；顶栏毛玻璃增强（blur 16px + 提饱和）
- 全站色彩系统统一为单一商务蓝（修复改版前"分类选中红、文章选中蓝"的双 accent）：`--sl-color-accent/low/high` 与所有选中态/链接/按钮/进度环统一品牌蓝（`--zh-brand`）
- 文章页更新时间显示：开启 `lastUpdated: true`，并将 8 篇文章 frontmatter 的 `date` 字段迁移为 starlight 标准 `lastUpdated` 字段（原 `date` 被 starlight schema 丢弃、从未生效）

### 变更
- `src/components/Footer.astro` 移除更新时间（已上移到文章标题下），保留编辑链接/分页/版权备案

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
