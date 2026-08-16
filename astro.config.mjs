// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import starlight from '@astrojs/starlight';
import starlightThemeNova from 'starlight-theme-nova';

// ============================================================
// 侧边栏：扫描 src/content/docs/ 一级文件夹自动生成分组
// （原始文档目录模式；label 渲染时去掉数字序号前缀，如 00.入站必读 → 入站必读）
// ============================================================

/** 文件夹名 → 显示名（去掉数字序号前缀，如 00.入站必读 → 入站必读） */
function folderLabel(name) {
	return name.replace(/^\d+[.\s-]*/, '');
}

/** 扫描一级文件夹生成 sidebar 分组（autogenerate 递归包含子目录） */
function autoSidebar() {
	const dir = path.join(process.cwd(), 'src/content/docs');
	if (!fs.existsSync(dir)) return [];

	return fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && !d.name.startsWith('.'))
		.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }))
		.map((d) => ({
			label: folderLabel(d.name),
			items: [{ autogenerate: { directory: d.name } }],
		}));
}

// https://astro.build/config
export default defineConfig({
	// 预取全部站内链接（配合 ClientRouter 使用：链接进入视口即预加载，手机无需悬停，提升切页速度）
	prefetch: {
		prefetchAll: true,
		defaultStrategy: 'viewport',
	},
	integrations: [
		{
			// 中文排版优化：盘古之白（中英文自动空格）+ 标点间距 客户端脚本
			name: 'zh-pangu',
			hooks: {
				'astro:config:setup': ({ injectScript }) => {
					injectScript(
						'page',
						`import ${JSON.stringify(new URL('./src/scripts/zh-optimize.ts', import.meta.url))}`,
					);
				},
			},
		},
		starlight({
			// 站点语言：中文（单语言站点需用 locales.root 设置 lang，否则 UI 文案固定为英文）
			locales: {
				root: {
					label: '简体中文',
					lang: 'zh-CN',
				},
			},
			// 从 git 提交历史生成每页「最后更新时间」（文章页头部元信息，PageTitle 组件展示）
			lastUpdated: true,
			plugins: [
				// Starlight Nova 主题
				starlightThemeNova({
					nav: [
						{ label: '首页', href: '/' },
						{ label: '使用指南', href: '/00入站必读/01使用指南/' },
					],
				}),
			],
			title: '情礼宝藏',
			// 侧边栏：全站目录树（label 已去数字前缀）
			sidebar: autoSidebar(),
			// 自定义组件覆盖：移动端导航布局（菜单左/标题居中/搜索+明暗右）
			components: {
				Header: './src/components/Header.astro',
				// 读取 frontmatter 的 contentWidth 控制正文宽度
				TwoColumnContent: './src/components/TwoColumnContent.astro',
				// 启用 View Transitions（页面平滑过渡 + 链接预取，提升切页流畅度）
				Head: './src/components/Head.astro',
				// 覆盖 Search：初始化改为 connectedCallback，兼容 View Transitions 切页
				Search: './src/components/Search.astro',
				// 覆盖 Footer：追加版权信息 + ICP 备案号
				Footer: './src/components/Footer.astro',
				// 覆盖 PageTitle：面包屑 + 描述 + 更新时间（文章页头部门户化）
				PageTitle: './src/components/PageTitle.astro',
			},
			// 站点 logo（顶部导航站点名前）
			logo: {
				src: './src/assets/logo.jpg',
				alt: '情礼宝藏',
			},
			// 浏览器标签页图标（PNG 兼容性更好）
			head: [
				{
					tag: 'link',
					attrs: { rel: 'icon', href: '/favicon.png', type: 'image/png' },
				},
			],
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/withastro/starlight' }],
			// 中文排版优化样式
			customCss: ['./src/styles/zh.css'],
		}),
	],
});
