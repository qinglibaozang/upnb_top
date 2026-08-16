// 本地预览服务器（供 build 后查看产物，运行：pnpm preview:local 或 node serve-preview.mjs）
// 与 astro preview 的区别：强制 Cache-Control: no-store —— 浏览器不缓存任何文件，
// 每次 build 后刷新即看到最新产物（astro preview 无缓存头时浏览器会启发式缓存，
// 导致改样式后刷新仍看到旧版本——此前多次"没变化"的根源）
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
const root = path.resolve('dist');
// MIME 类型表：woff2 是字体（@font-face 需正确 MIME 才能渲染）、webp/avif 是现代图片格式
const types = {
	'.html': 'text/html; charset=utf-8',
	'.css': 'text/css',
	'.js': 'text/javascript',
	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.svg': 'image/svg+xml',
	'.json': 'application/json',
	'.ico': 'image/x-icon',
	'.webp': 'image/webp',
	'.avif': 'image/avif',
	'.woff2': 'font/woff2',
};
http.createServer((req, res) => {
	let p = decodeURIComponent(new URL(req.url, 'http://x').pathname);
	if (p.endsWith('/')) p += 'index.html';
	const f = path.join(root, p);
	// 路径安全：带分隔符前缀检查，避免 dist2 之类前缀目录被误命中
	if (f.startsWith(root + path.sep) && fs.existsSync(f) && fs.statSync(f).isFile()) {
		// no-store：预览服务器每次返回最新产物，杜绝浏览器缓存旧 CSS
		res.writeHead(200, {
			'Content-Type': types[path.extname(f)] ?? 'application/octet-stream',
			'Cache-Control': 'no-store',
		});
		fs.createReadStream(f).pipe(res);
	} else {
		res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
		res.end('404 Not Found: ' + p);
	}
}).listen(4321, '127.0.0.1', () => console.log('preview on http://127.0.0.1:4321'));
