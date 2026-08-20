// @ts-check
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

// https://astro.build/config
export default defineConfig({
	// 预取站内链接（配合 ClientRouter）：仅预取进入视口的链接（defaultStrategy: viewport），
	// 不 prefetchAll——全站预取会让首次访问后台下载所有页面，与渲染抢带宽
	prefetch: {
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
			title: '情礼宝藏', // 站点名称（顶栏标题 + 浏览器标签页）
			// 自定义组件覆盖：移动端导航布局（菜单左/标题居中/搜索+明暗右）
			components: {
				Header: './src/components/Header.astro',
				// 读取 frontmatter 的 contentWidth 控制正文宽度
				TwoColumnContent: './src/components/TwoColumnContent.astro',
				// 启用 View Transitions（页面平滑过渡 + 链接预取，提升切页流畅度）
				Head: './src/components/Head.astro',
				// 覆盖 Search：初始化改为 connectedCallback，兼容 View Transitions 切页
				Search: './src/components/Search.astro',
				// 覆盖 Footer：首页版权条 + 其他页面默认页脚
				Footer: './src/components/Footer.astro',
				// 覆盖 MobileMenuFooter：社交链接 + 语言选择（主题切换在顶栏）
				MobileMenuFooter: './src/components/MobileMenuFooter.astro',
				// 覆盖 PageTitle：面包屑 + 描述 + 更新时间（文章页头部门户化）
				PageTitle: './src/components/PageTitle.astro',
				// 覆盖 SkipLink：挂载移动端底部 dock
				SkipLink: './src/components/SkipLink.astro',
			},
			// 站点 logo（顶部导航站点名前）
			logo: {
				src: './src/assets/logo.webp',
				alt: '情礼宝藏',
			},
			// 浏览器标签页图标（PNG 兼容性更好）
			head: [
				{
					tag: 'link',
					attrs: { rel: 'icon', href: '/favicon.png', type: 'image/png' },
				},
			],
			// 顶栏社交图标（GitHub，指向本站仓库）
			social: [{ icon: 'github', label: 'GitHub', href: 'https://github.com/qinglibaozang/upnb_top' }],
			// 中文排版优化样式
			customCss: ['./src/styles/zh.css'],
		}),
	],
});
