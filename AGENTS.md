## 开发

启动开发服务器时，请使用后台模式：

```
astro dev --background
```

通过 `astro dev stop`、`astro dev status` 和 `astro dev logs` 管理后台服务器。

## 文档

完整文档：https://docs.astro.build

处理相关任务前，请查阅以下指南：

- [添加页面、动态路由或中间件](https://docs.astro.build/en/guides/routing/)
- [使用 Astro 组件](https://docs.astro.build/en/basics/astro-components/)
- [使用 React、Vue、Svelte 或其他框架组件](https://docs.astro.build/en/guides/framework-components/)
- [添加或管理内容](https://docs.astro.build/en/guides/content-collections/)
- [添加样式或使用 Tailwind](https://docs.astro.build/en/guides/styling/)
- [支持多语言](https://docs.astro.build/en/guides/internationalization/)

## 项目规则（精炼版）

本仓库规则分两层：**方法型规则**（见下，已内联，长期稳定）+ **事实型规则**（见"按需读取"表，存于 `agents/`，随项目更新）。

> 注意：`agents/` 下的文件**不会被自动内联**（`@import` 语法不生效），涉及对应任务时**主动用 read 工具读取原文**，不得凭记忆猜测。

### 常用命令

| 命令 | 用途 |
|---|---|
| `pnpm dev` | 启动开发服务器（前台，配合 `astro dev --background` 后台模式） |
| `pnpm build` | 生产构建（提交前如改动代码，先构建验证） |
| `pnpm preview` | 预览生产构建产物 |
| `npx tsc --noEmit` | 类型检查 |

**已知约束**：pre-commit 钩子会运行 `tsc --noEmit`；项目存在与本次改动无关的既有类型错误（`astro.config.mjs` 隐式 any、node_modules 内 starlight 类型），提交时统一用 `--no-verify` 绕过（用户已确认，见 Git 规范）。

### 技术栈与版本策略

- **Astro + Starlight** + **pnpm** + **TypeScript**（严格模式）；Starlight 原生布局 + 自有 `zh.css` 设计系统（`starlight-sidebar-topics` 分类切换插件）。
- **版本策略：保持稳定，不追新**。以当前锁定版本为准（`package.json` / `pnpm-lock.yaml`）；升级必须经用户确认并说明理由与影响面。
- 中文排版：`src/styles/zh.css`（字号层级/字体栈）；`src/scripts/zh-optimize.ts`（盘古之白，`spacingText` 纯函数，`PlaceholderReplacer` 保护代码片段）。

### 代码风格

- TypeScript/JavaScript：严格模式、`@ts-check`、单引号、tab 缩进、中文注释解释"为什么"。
- 纯逻辑写成纯函数（参考 `src/scripts/zh-optimize.ts`），便于测试与复用。
- Astro 组件遵循 Starlight 现有模式（参考 `src/components/`），样式类优先放 `src/styles/zh.css` 而非内联。
- 新增脚本/工具：先检查 `src/scripts/` 是否已有可复用函数，不重复造轮子。

### 测试与验证

- 项目**无测试框架**（无 vitest/jest）。纯函数改动后可用 `node` 直接验证或临时断言。
- 改动行为后：类型检查 `npx tsc --noEmit` + 实际构建/预览验证，不依赖自动化测试套件。

### Git 规范

- 修改任何文件前，先 `git status` 检查工作区，不覆盖未提交改动；改动前先 `git diff` 了解现状。
- 不自动 `git commit` / `git push`——除非用户明确要求。
- 用户要求提交时：先 `git diff` 复核全部改动，确认无遗漏、无无关文件；提交信息用约定格式（`feat:` / `fix:` / `docs:` / `chore:` 前缀 + 中文描述），一次提交一个逻辑变更。
- 不删除用户未要求删除的文件；误建垃圾文件（如 Windows 的 `nul`）删除前向用户说明。
- 临时调试文件默认不提交：`.tmp-*` 前缀的一次性产物（诊断脚本如 `.tmp-diag*.mjs`、浏览器调试 profile 如 `.tmp-edge-profile*/`）一律不 `git add`，调试完成后删除；反复产生时把 `.tmp-*` 加入 `.gitignore` 防再出现。
- 提交统一使用 `git commit --no-verify`：pre-commit 钩子的 `tsc` 存在与改动无关的既有类型错误（`astro.config.mjs` 隐式 any、node_modules 内 starlight 类型），用户已确认**总是直接绕过**，无需再询问。

### 安全规范

- 绝不把 API 密钥、token、密码提交进 git；`.env` 文件已在 `.gitignore` 中，新建敏感配置一律放 `.env`。
- 新增文件前检查内容是否含敏感信息；扫描到疑似密钥（`sk-`、`api_key` 等）时立即停止并报告用户。
- 不执行破坏性命令（`git reset --hard`、强制删除、生产环境操作）——除非用户明确要求。
- 第三方脚本、外部命令：先说明将做什么再执行，不静默运行未知来源代码。

### 工作流程（澄清 → spec → 实现 → 验收）

**每次任务开始，必须先澄清需求，绝不跳过。** 提问只问决策不问事实（文件位置、函数签名等自行查证）；给选项 + 推荐默认；批量问（3–5 个一次）；每个问题必须影响计划。

按任务大小分级：

| 任务类型 | 例子 | 要求 |
|---|---|---|
| 小 | 改文案、加一篇内容页 | 复述 + 一句话方案，用户点头后动手 |
| 中 | 加组件、调整布局、改脚本 | 澄清 + 简短 spec（对话内确认） |
| 大 | 新功能、结构改造 | 完整 spec + 计划模式，批准后才实现 |

中/大任务 spec 四段式：目标 Goal、验收标准 Acceptance criteria（可勾选清单）、技术说明 Technical notes、不做 Out of scope。实现严格按已确认的 spec，不自行扩大范围；完成时对照验收标准逐条报告（✓/✗），说明改了什么、怎么验证、如何查看效果。

### 项目约定

- 包管理必须用 `pnpm`（pnpm workspace，根目录有 `pnpm-lock.yaml`）。**禁止 `npm install`**——会触发 arborist 崩溃 bug（`Link.matches` 空引用）。
- 新增依赖（`pnpm add`）前，必须先说明装什么、为什么装、影响面，经用户确认后执行；不擅自装包。
- 内容文件放 `src/content/docs/`，沿用现有分类目录（`00.入站必读`、`01.中小学资源`、`03.AI专区`、`index.mdx`）；站点内容默认中文。
- 注意：`README.md` 的项目结构图已过时（其中 `src/content.config.ts` 实际不存在），以 `src/content/` 实际目录为准，不被 README 误导。

### 变更日志（CHANGELOG.md）

- **每次提交时**：若本次改动包含"用户/维护者可见的变化"，必须在同一次提交中更新根目录 `CHANGELOG.md`（日志永不滞后）；纯内部改动（格式化、重命名未发布文件、注释）不记。
- 功能更改必须详细记录（写清功能、用法、影响）；格式：按日期倒序分组，`###` 分新增/变更/修复。细节见 `agents/变更日志.md`。

## 事实型规则（按需读取）

下表文件**不会被自动内联**，涉及对应任务时**主动 read 原文**：

| 文件 | 何时读 |
|---|---|
| `agents/项目结构.md` | 定位文件、了解目录布局时 |
| `agents/文件索引.md` | 接到任务先查"改什么 → 去哪" |
| `agents/数据结构.md` | **新增/修改页面数据结构（frontmatter、卡片、自定义页面）必须先读此文件再设计，并登记字段** |
| `agents/变更日志.md` | 需要 CHANGELOG 格式细节时 |
| `agents/工作流程.md` | 需要完整提问模板、任务分级、spec 细节时 |

## 边界（红线，必须遵守）

**任何编辑或创建文件之前，必须先澄清需求。禁止在需求未确认时猜测着开始写。**

| 层级 | 行为 |
|---|---|
| **Always（直接做）** | 读文件、跑命令查信息、构建/预览验证、改文案与内容页（先复述一句） |
| **Ask first（先问）** | 新增/修改组件、改布局样式、改脚本配置、删改内容、装依赖、提交 git |
| **Never（禁止）** | 不覆盖未提交改动；不提交密钥；不自动 commit/push；不执行破坏性命令（`git reset --hard`、强制删除）；不猜测需求直接写码 |

## 沟通规范

- 始终用中文交流（代码、命令、报错原文除外）。
- 新手友好：解释"为什么"而不只给"做什么"；用术语时解释；给出可直接复制运行的命令。
- 不确定就明说不确定，不糊弄。
