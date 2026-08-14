import { defineCollection, z } from 'astro:content';
import { docsLoader } from '@astrojs/starlight/loaders';
import { docsSchema } from '@astrojs/starlight/schema';

export const collections = {
	docs: defineCollection({
		loader: docsLoader(),
		schema: docsSchema({
			extend: z.object({
				// 页面级正文宽度控制：CSS 长度（如 60rem / 900px / 75%）或预设关键字
				contentWidth: z.string().optional(),
			}),
		}),
	}),
};
