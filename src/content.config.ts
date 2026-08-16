import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';
import { Jieba } from '@node-rs/jieba';

// ── jieba 中文分词（构建/开发时 Node 原生，Windows x64 有预编译）──
// 用途：给每篇文档生成中文分词关键词，页面注入后 Pagefind 将其索引为独立词。
// 背景：Pagefind 对中文按 Unicode 分段，连续汉字整串成一个索引词
// （如「学习资源」→ 一个词），查询短词「学习」不命中；jieba 切词后
// 索引/查询两端一致，短词与组合词都能召回。
const jieba = new Jieba();

// markdown 正文 → 纯文本（供分词）：剥掉代码块/行内代码/图片/链接/标记符号
function mdToPlainText(md: string): string {
	return md
		.replace(/```[\s\S]*?```/g, ' ') // 代码块
		.replace(/`[^`]*`/g, ' ') // 行内代码
		.replace(/!\[[^\]]*\]\([^)]*\)/g, ' ') // 图片
		.replace(/\[([^\]]*)\]\([^)]*\)/g, '$1') // 链接：保留显示文字
		.replace(/[#>*_~\-|`]/g, ' ') // 标题/列表/强调等标记符号
		.replace(/\s+/g, ' ')
		.trim();
}

// 值得作为搜索词的保留条件：含中文，或含字母/数字（过滤纯标点/碎片）
function keepWord(w: string): boolean {
	return /[\u4e00-\u9fa5]/.test(w) || /[A-Za-z0-9]/.test(w);
}

const baseDocsLoader = docsLoader();

export const collections = {
	docs: defineCollection({
		// 包装 starlight docsLoader：加载完成后逐篇做 jieba 分词，
		// 追加 searchKeywords（schema 里声明为可选数组，默认 []）。
		// ⚠ 必须用对象形式（{ name, load }）：函数形式会被 astro 的
		// simpleLoader 当作「返回数据数组」调用且不传 context（undefined）
		loader: {
			name: 'starlight-docs-loader-jieba',
			load: async (context) => {
				await baseDocsLoader.load(context);
				for (const [, entry] of context.store.entries()) {
					const data = entry.data as Record<string, unknown>;
					const title = String(data.title ?? '');
					const description = String(data.description ?? '');
					const body = typeof entry.body === 'string' ? entry.body : '';
					const words = jieba.cut(mdToPlainText(`${title} ${description} ${body}`), true);
					const searchKeywords = words.filter(keepWord);
					// ⚠ 必须剔除 digest：scopedStore.set 对相同 digest 的写入直接跳过
					// （去重），{...entry} 保留的 digest 与 glob 写入时一致 → 写入被拒
					const { digest: _digest, ...rest } = entry;
					context.store.set({ ...rest, data: { ...data, searchKeywords } });
				}
			},
		},
		schema: docsSchema({
			extend: z.object({
				// 页面级正文宽度控制：CSS 长度（如 60rem / 900px / 75%）或预设关键字
				contentWidth: z.string().optional(),
				// jieba 中文分词关键词（构建时自动生成，供搜索索引；非手写字段）
				searchKeywords: z.array(z.string()).default([]),
			}),
		}),
	}),
};
