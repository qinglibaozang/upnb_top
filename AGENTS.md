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

## 规则文件索引（@import 自动加载）

@agents/常用命令.md
@agents/项目结构.md
@agents/代码风格.md
@agents/测试.md
@agents/Git规范.md
@agents/安全规范.md
@agents/工作流程.md
@agents/技术栈.md
@agents/项目约定.md
@agents/文件索引.md
@agents/数据结构.md

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
