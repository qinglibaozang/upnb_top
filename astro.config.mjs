// @ts-check
import { defineConfig } from 'astro/config';
import fs from 'node:fs';
import path from 'node:path';
import starlight from '@astrojs/starlight';
import starlightSidebarTopics from 'starlight-sidebar-topics';
import starlightThemeNova from 'starlight-theme-nova';

// ============================================================
// 自动生成 sidebar-topics：扫描 src/content/docs/ 下的文件夹，
// 每个文件夹自动成为一个分类（新增文件夹零配置，无需改这里）
// ============================================================

// 分类图标池（按文件夹排序循环分配，可自行增删）
const TOPIC_ICONS = [
	'rocket',
	'open-book',
	'star',
	'book',
	'document',
	'setting',
	'pencil',
	'link',
	'cloud-download',
	'mobile-android',
	'list-format',
	'code-branch',
];

/** 文件名 → URL slug（与 Astro 规则一致：去扩展名、去点、转小写） */
function fileSlug(name) {
	return name.replace(/\.(md|mdx)$/i, '').replace(/\./g, '').toLowerCase();
}

/** 文件夹名 → 文件夹 slug */
function folderSlug(name) {
	return name.replace(/\./g, '').toLowerCase();
}

/** 文件夹名 → 显示名（去掉数字序号前缀，如 01.K12学习资源 → K12学习资源） */
function folderLabel(name) {
	return name.replace(/^\d+[.\s-]*/, '');
}

/** 扫描目录自动生成 topics 配置 */
function autoTopics() {
	const dir = path.join(process.cwd(), 'src/content/docs');
	if (!fs.existsSync(dir)) return [];

	const folders = fs
		.readdirSync(dir, { withFileTypes: true })
		.filter((d) => d.isDirectory() && !d.name.startsWith('.'))
		.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));

	return folders
		.map((folder, i) => {
			const files = fs
				.readdirSync(path.join(dir, folder.name))
				.filter((f) => /\.(md|mdx)$/i.test(f))
				.sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

			// 空文件夹不生成分类（避免无效链接）
			if (files.length === 0) return null;

			const first = files[0];
			return {
				label: folderLabel(folder.name),
				icon: TOPIC_ICONS[i % TOPIC_ICONS.length],
				link: `/${folderSlug(folder.name)}/${fileSlug(first)}/`,
				items: [{ autogenerate: { directory: folder.name } }],
			};
		})
		.filter(Boolean);
}

// ============================================================

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
			plugins: [
				// 侧边栏顶部分类切换（自动生成，新增文件夹零配置）
				// exclude 兑底：未归入任何分类的页面不报错，走默认侧边栏
				starlightSidebarTopics(autoTopics(), { exclude: ['**'] }),
				// Starlight Nova 主题
				starlightThemeNova({
					nav: [
						{ label: '首页', href: '/' },
						{ label: '使用指南', href: '/00入站必读/01使用指南/' },
					],
				}),
			],
			title: '情礼宝藏',
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
