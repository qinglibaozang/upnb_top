/**
 * 中文排版优化脚本（客户端运行时）
 * 盘古之白（Pangu.js v9.1.0，MIT License，https://github.com/vinta/pangu.js）
 * 核心规则内联实现：自动在中文与英文、数字、标点之间插入合理空格
 * 已按客户端场景精简：只处理纯文本节点，去掉 HTML 标签处理分支
 */
export function spacingText(text: string): string {
	if (
		typeof text !== 'string' ||
		text.length <= 1 ||
		(!ANY_CJK.test(text) && !ANY_FULLWIDTH_PUNCT.test(text))
	) {
		return text;
	}
	let newText = text;

	// 保护反引号内容（代码片段）
	const backtickManager = new PlaceholderReplacer('BACKTICK_CONTENT_', '\uE004', '\uE005');
	newText = newText.replace(/`([^`]+)`/g, (_match, content) => {
		return `\`${backtickManager.store(content)}\``;
	});

	newText = newText.replace(DOTS_CJK, '$1 $2');
	newText = newText.replace(CJK_PUNCTUATION, '$1$2 ');
	newText = newText.replace(PUNCTUATION_CJK, '$1 ');
	newText = newText.replace(CJK_TILDE, '$1$2 ');
	newText = newText.replace(CJK_TILDE_EQUALS, '$1 $2 ');
	newText = newText.replace(CJK_PERIOD, '$1$2 ');
	newText = newText.replace(AN_PERIOD_CJK, '$1$2 $3');
	newText = newText.replace(AN_COLON_CJK, '$1$2 $3');
	newText = newText.replace(FIX_CJK_COLON_ANS, '$1：$2');
	newText = newText.replace(CJK_QUOTE, '$1 $2');
	newText = newText.replace(QUOTE_CJK, '$1 $2');
	newText = newText.replace(FIX_QUOTE_ANY_QUOTE, '$1$2$3');
	newText = newText.replace(QUOTE_AN, '$1 $2');
	newText = newText.replace(CJK_QUOTE_AN, '$1$2 $3');
	newText = newText.replace(FIX_POSSESSIVE_SINGLE_QUOTE, "$1's");
	const singleQuoteCJKManager = new PlaceholderReplacer('SINGLE_QUOTE_CJK_PLACEHOLDER_', '\uE070', '\uE071');
	newText = newText.replace(SINGLE_QUOTE_PURE_CJK, (match) => singleQuoteCJKManager.store(match));
	newText = newText.replace(CJK_SINGLE_QUOTE_BUT_POSSESSIVE, '$1 $2');
	newText = newText.replace(SINGLE_QUOTE_CJK, '$1 $2');
	newText = singleQuoteCJKManager.restore(newText);
	if (newText.length >= 5) newText = newText.replace(HASH_ANS_CJK_HASH, '$1 $2$3$4 $5');
	newText = newText
		.split('\n')
		.map((line) => {
			if ((line.match(/\//g) || []).length <= 1) {
				line = line.replace(CJK_HASH, '$1 $2');
				line = line.replace(HASH_CJK, '$1 $3');
			} else {
				line = line.replace(CJK_FINAL_HASHTAG, '$1$2 $3');
			}
			return line;
		})
		.join('\n');

	// 保护复合词（如 state-of-the-art）
	const compoundWordManager = new PlaceholderReplacer('COMPOUND_WORD_PLACEHOLDER_', '\uE010', '\uE011');
	newText = newText.replace(
		/\b(?:[A-Za-z0-9]*[a-z][A-Za-z0-9]*-[A-Za-z0-9]+|[A-Za-z0-9]+-[A-Za-z0-9]*[a-z][A-Za-z0-9]*|[A-Za-z]+-[0-9]+|[A-Za-z]+[0-9]+-[A-Za-z0-9]+)(?:-[A-Za-z0-9]+)*\b/g,
		(match) => compoundWordManager.store(match),
	);
	newText = newText.replace(SINGLE_LETTER_GRADE_CJK, '$1$2 $3');
	newText = newText.replace(CJK_SIGN_DIGIT, '$1 $2$3');
	newText = newText.replace(CJK_HYPHEN_FLAG, '$1 $2$3');
	newText = newText.replace(AN_PLUS_CJK, '$1$2 $3');
	newText = newText.replace(CJK_OPERATOR_ANS, '$1 $2 $3');
	newText = newText.replace(ANS_OPERATOR_CJK, '$1 $2 $3');
	newText = newText.replace(CJK_LESS_THAN, '$1 $2 $3');
	newText = newText.replace(LESS_THAN_CJK, '$1 $2 $3');
	newText = newText.replace(CJK_GREATER_THAN, '$1 $2 $3');
	newText = newText.replace(GREATER_THAN_CJK, '$1 $2 $3');
	newText = newText.replace(CJK_UNIX_ABSOLUTE_FILE_PATH, '$1 $2');
	newText = newText.replace(CJK_UNIX_RELATIVE_FILE_PATH, '$1 $2');
	newText = newText.replace(CJK_WINDOWS_PATH, '$1 $2');
	newText = newText.replace(UNIX_ABSOLUTE_FILE_PATH_SLASH_CJK, '$1 $2');
	newText = newText.replace(UNIX_RELATIVE_FILE_PATH_SLASH_CJK, '$1 $2');
	newText = newText
		.split('\n')
		.map((line) => {
			if ((line.match(/\//g) || []).length !== 1) return line;
			line = line.replace(CJK_SLASH_CJK, '$1 $2 $3');
			line = line.replace(CJK_SLASH_ANS, '$1 $2 $3');
			line = line.replace(ANS_SLASH_CJK, '$1 $2 $3');
			return line;
		})
		.join('\n');
	newText = newText
		.split('\n')
		.map((line) => {
			if (!PIPE_CJK_CONTACT.test(line)) return line;
			return line.replace(PIPE_SEPARATOR, '$1 $2 ');
		})
		.join('\n');
	newText = newText
		.split('\n')
		.map((line) => {
			if (!PLUS_CJK_CONTACT.test(line)) return line;
			return line.replace(PLUS_SEPARATOR, ' + ');
		})
		.join('\n');
	newText = newText.replace(FIX_QUOTE_ANY_QUOTE, '$1$2$3');
	newText = compoundWordManager.restore(newText);
	newText = newText.replace(CJK_LEFT_BRACKET, '$1 $2');
	newText = newText.replace(RIGHT_BRACKET_CJK, '$1 $2');
	newText = newText.replace(ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET, '$1 $2$3$4');
	newText = newText.replace(LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK, '$1$2$3 $4');
	newText = newText.replace(ANS_CJK_RIGHT_QUOTE_ANY_RIGHT_QUOTE, '$1 $2$3$4');
	newText = newText.replace(AN_LEFT_BRACKET, '$1 $2');
	newText = newText.replace(RIGHT_BRACKET_AN, '$1 $2');
	newText = newText.replace(CJK_ANS, '$1 $2');
	newText = newText.replace(ANS_CJK, '$1 $2');
	newText = newText.replace(S_A, '$1 $2');
	newText = newText.replace(MIDDLE_DOT, '・');
	newText = fixBracketSpacing(newText);

	/* ── 扩展规则：全角标点与英文/数字之间加空格（中文混排标点规范） ── */
	newText = newText.replace(CJK_PUNCT_ANS, '$1 $2');
	newText = newText.replace(ANS_CJK_PUNCT, '$1 $2');
	newText = newText.replace(ANS_FULLWIDTH_LBRACKET, '$1 $2');
	newText = newText.replace(FULLWIDTH_RBRACKET_ANS, '$1 $2');

	newText = backtickManager.restore(newText);
	return newText;
}

/* ── 正则与字符集（源自 Pangu.js v9.1.0） ── */

const CJK_RADICALS_SUPPLEMENT = '\u2E80-\u2EFF';
const KANGXI_RADICALS = '\u2F00-\u2FDF';
const HIRAGANA = '\u3040-\u309F';
const KATAKANA_NO_MIDDLE_DOT = '\u30A0-\u30FA\u30FD-\u30FF';
const BOPOMOFO = '\u3100-\u312F';
const ENCLOSED_CJK_LETTERS_AND_MONTHS = '\u3200-\u32FF';
const CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A = '\u3400-\u4DBF';
const CJK_UNIFIED_IDEOGRAPHS = '\u4E00-\u9FFF';
const CJK_COMPATIBILITY_IDEOGRAPHS = '\uF900-\uFAFF';
const GREEK_AND_COPTIC = '\u0370-\u03FF';
const LATIN_1_SUPPLEMENT_AFTER_NBSP = '\u00A1-\u00FF';
const NUMBER_FORMS = '\u2150-\u218F';
const DINGBATS = '\u2700-\u27BF';

const CJK = `${CJK_RADICALS_SUPPLEMENT}${KANGXI_RADICALS}${HIRAGANA}${KATAKANA_NO_MIDDLE_DOT}${BOPOMOFO}${ENCLOSED_CJK_LETTERS_AND_MONTHS}${CJK_UNIFIED_IDEOGRAPHS_EXTENSION_A}${CJK_UNIFIED_IDEOGRAPHS}${CJK_COMPATIBILITY_IDEOGRAPHS}`;
const AN = 'A-Za-z0-9';
const A = 'A-Za-z';
const UPPER_AN = 'A-Z0-9';
const OPERATORS_BASE = '\\+\\*=&';
const OPERATORS_WITH_HYPHEN = `${OPERATORS_BASE}\\-`;
const OPERATORS_NO_PLUS = '\\*=&\\-';
const GRADE_OPERATORS = '\\+\\-\\*';
const QUOTES = '`"\u05D4';
const LEFT_BRACKETS_BASIC = '\\(\\[\\{';
const RIGHT_BRACKETS_BASIC = '\\)\\]\\}';
const LEFT_BRACKETS_EXTENDED = '\\(\\[\\{<>“';
const RIGHT_BRACKETS_EXTENDED = '\\)\\]\\}<>”';
const ANS_CJK_AFTER = `${A}${GREEK_AND_COPTIC}0-9@\\$%\\^&\\*\\-\\+\\\\=${LATIN_1_SUPPLEMENT_AFTER_NBSP}${NUMBER_FORMS}${DINGBATS}`;
const ANS_BEFORE_CJK = `${A}${GREEK_AND_COPTIC}0-9\\$%\\^&\\*\\-\\+\\\\=${LATIN_1_SUPPLEMENT_AFTER_NBSP}${NUMBER_FORMS}${DINGBATS}`;
const FILE_PATH_DIRS = 'home|root|usr|etc|var|opt|tmp|dev|mnt|proc|sys|bin|boot|lib|media|run|sbin|srv|node_modules|path|project|src|dist|test|tests|docs|templates|assets|public|static|config|scripts|tools|build|out|target|your|\\.claude|\\.git|\\.vscode';
const FILE_PATH_CHARS = '[A-Za-z0-9_\\-\\.@\\+\\*]+';
const UNIX_ABSOLUTE_FILE_PATH = new RegExp(`/(?:\\.?(?:${FILE_PATH_DIRS})|\\.(?:[A-Za-z0-9_\\-]+))(?:/${FILE_PATH_CHARS})*`);
const UNIX_RELATIVE_FILE_PATH = new RegExp(`(?:\\./)?(?:${FILE_PATH_DIRS})(?:/${FILE_PATH_CHARS})+`);
const WINDOWS_FILE_PATH = /[A-Z]:\\(?:[A-Za-z0-9_\-\. ]+\\?)+/;
const ANY_CJK = new RegExp(`[${CJK}]`);
const CJK_PUNCTUATION = new RegExp(`([${CJK}])([!;,\\?:]+)(?=[${CJK}${AN}])`, 'g');
const PUNCTUATION_CJK = new RegExp(`([!;,\\?]+)(?=[${CJK}])`, 'g');
const CJK_TILDE = new RegExp(`([${CJK}])(~+)(?!=)(?=[${CJK}${AN}])`, 'g');
const CJK_TILDE_EQUALS = new RegExp(`([${CJK}])(~=)`, 'g');
const CJK_PERIOD = new RegExp(`([${CJK}])(\\.)(?![${AN}\\./])(?=[${CJK}${AN}])`, 'g');
const AN_PERIOD_CJK = new RegExp(`([${AN}])(\\.)([${CJK}])`, 'g');
const AN_COLON_CJK = new RegExp(`([${AN}])(:)([${CJK}])`, 'g');
const DOTS_CJK = new RegExp(`([\\.]{2,}|\u2026)([${CJK}])`, 'g');
const FIX_CJK_COLON_ANS = new RegExp(`([${CJK}])\\:([${UPPER_AN}\\(\\)])`, 'g');
const CJK_QUOTE = new RegExp(`([${CJK}])([${QUOTES}])`, 'g');
const QUOTE_CJK = new RegExp(`([${QUOTES}])([${CJK}])`, 'g');
const FIX_QUOTE_ANY_QUOTE = new RegExp(`([${QUOTES}]+)[ ]*([\\s\\S]+?)[ ]*([${QUOTES}]+)`, 'g');
const QUOTE_AN = new RegExp(`([\u201d])([${AN}])`, 'g');
const CJK_QUOTE_AN = new RegExp(`([${CJK}])(")([${AN}])`, 'g');
const CJK_SINGLE_QUOTE_BUT_POSSESSIVE = new RegExp(`([${CJK}])('[^s])`, 'g');
const SINGLE_QUOTE_CJK = new RegExp(`(')([${CJK}])`, 'g');
const FIX_POSSESSIVE_SINGLE_QUOTE = new RegExp(`([${AN}${CJK}])( )('s)`, 'g');
const SINGLE_QUOTE_PURE_CJK = new RegExp(`(')([${CJK}]+)(')`, 'g');
const HASH_ANS_CJK_HASH = new RegExp(`([${CJK}])(#)([${CJK}]+)(#)([${CJK}])`, 'g');
const CJK_HASH = new RegExp(`([${CJK}])(#([^ \\u00a0]))`, 'g');
const HASH_CJK = new RegExp(`(([^ \\u00a0])#)([${CJK}])`, 'g');
const CJK_FINAL_HASHTAG = new RegExp(`([^/])([${CJK}])(#[A-Za-z0-9]+)$`);
const CJK_OPERATOR_ANS = new RegExp(`([${CJK}])([${OPERATORS_WITH_HYPHEN}])([${AN}])`, 'g');
const ANS_OPERATOR_CJK = new RegExp(`([${AN}])([${OPERATORS_NO_PLUS}])([${CJK}])`, 'g');
const CJK_SLASH_CJK = new RegExp(`([${CJK}])([/])([${CJK}])`, 'g');
const CJK_SLASH_ANS = new RegExp(`([${CJK}])([/])([${AN}])`, 'g');
const ANS_SLASH_CJK = new RegExp(`([${AN}])([/])([${CJK}])`, 'g');
const PIPE_CJK_CONTACT = new RegExp(`[${CJK}]\\||\\|[${CJK}]`);
const PIPE_SEPARATOR = /([^\s|])[ ]*(\|+)[ ]*(?=[^\s|])/g;
const PLUS_CJK_CONTACT = new RegExp(`[${CJK}]\\+|\\+[${CJK}]`);
const PLUS_SEPARATOR = /(?<=[^\s+])\+(?=[^\s+])/g;
const SINGLE_LETTER_GRADE_CJK = new RegExp(`\\b([${A}])([${GRADE_OPERATORS}])([${CJK}])`, 'g');
const CJK_SIGN_DIGIT = new RegExp(`([${CJK}])([\\+\\-])([0-9])`, 'g');
const CJK_HYPHEN_FLAG = new RegExp(`([${CJK}])(\\-)([a-z])\\b`, 'g');
const AN_PLUS_CJK = new RegExp(`([${AN}])(\\+)([${CJK}])`, 'g');
const CJK_LESS_THAN = new RegExp(`([${CJK}])(<)([${AN}])`, 'g');
const LESS_THAN_CJK = new RegExp(`([${AN}])(<)([${CJK}])`, 'g');
const CJK_GREATER_THAN = new RegExp(`([${CJK}])(>)([${AN}])`, 'g');
const GREATER_THAN_CJK = new RegExp(`([${AN}])(>)([${CJK}])`, 'g');
const CJK_LEFT_BRACKET = new RegExp(`([${CJK}])([${LEFT_BRACKETS_EXTENDED}])`, 'g');
const RIGHT_BRACKET_CJK = new RegExp(`([${RIGHT_BRACKETS_EXTENDED}])([${CJK}])`, 'g');
const ANS_CJK_LEFT_BRACKET_ANY_RIGHT_BRACKET = new RegExp(`([${AN}${CJK}])[ ]*([\u201c])([${AN}${CJK}\\-_ ]+)([\u201d])`, 'g');
const LEFT_BRACKET_ANY_RIGHT_BRACKET_ANS_CJK = new RegExp(`([\u201c])([${AN}${CJK}\\-_ ]+)([\u201d])[ ]*([${AN}${CJK}])`, 'g');
const ANS_CJK_RIGHT_QUOTE_ANY_RIGHT_QUOTE = new RegExp(`([${AN}${CJK}])[ ]*(?<![\u201c][^\u201c\u201d\n]*)([\u201d])[ ]*([${AN}${CJK}\\-_ ]+?)[ ]*([\u201d])`, 'g');
const AN_LEFT_BRACKET = new RegExp(`([${AN}])(?<!\\.[${AN}]*)([${LEFT_BRACKETS_BASIC}])`, 'g');
const RIGHT_BRACKET_AN = new RegExp(`([${RIGHT_BRACKETS_BASIC}])([${AN}])`, 'g');
const CJK_UNIX_ABSOLUTE_FILE_PATH = new RegExp(`([${CJK}])(${UNIX_ABSOLUTE_FILE_PATH.source})`, 'g');
const CJK_UNIX_RELATIVE_FILE_PATH = new RegExp(`([${CJK}])(${UNIX_RELATIVE_FILE_PATH.source})`, 'g');
const CJK_WINDOWS_PATH = new RegExp(`([${CJK}])(${WINDOWS_FILE_PATH.source})`, 'g');
const UNIX_ABSOLUTE_FILE_PATH_SLASH_CJK = new RegExp(`(${UNIX_ABSOLUTE_FILE_PATH.source}/)([${CJK}])`, 'g');
const UNIX_RELATIVE_FILE_PATH_SLASH_CJK = new RegExp(`(${UNIX_RELATIVE_FILE_PATH.source}/)([${CJK}])`, 'g');
const CJK_ANS = new RegExp(`([${CJK}])([${ANS_CJK_AFTER}])`, 'g');
const ANS_CJK = new RegExp(`([${ANS_BEFORE_CJK}])([${CJK}])`, 'g');
const S_A = new RegExp(`(%)([${A}])`, 'g');
const MIDDLE_DOT = /([ ]*)([\u00b7\u2022\u2027])([ ]*)/g;

/* ── 扩展：全角标点与英文/数字之间加空格 ──
   覆盖：顿号、逗号、句号、叹号、问号、分号、冒号、全角括号 */
const CJK_PUNCT = '，。！？；：、';
const FULLWIDTH_PUNCT_AND_BRACKETS = `${CJK_PUNCT}（）“”‘’「」『』`;
const ANY_FULLWIDTH_PUNCT = new RegExp(`[${FULLWIDTH_PUNCT_AND_BRACKETS}]`);
const CJK_PUNCT_ANS = new RegExp(`([${CJK_PUNCT}])([A-Za-z0-9])`, 'g'); // 全角标点后接英文/数字
const ANS_CJK_PUNCT = new RegExp(`([A-Za-z0-9])([${CJK_PUNCT}])`, 'g'); // 英文/数字后接全角标点
const ANS_FULLWIDTH_LBRACKET = new RegExp(`([A-Za-z0-9])([（])`, 'g'); // 英文/数字后接全角左括号
const FULLWIDTH_RBRACKET_ANS = new RegExp(`([）])([A-Za-z0-9])`, 'g'); // 全角右括号后接英文/数字

/* ── 扩展：全角标点与汉字之间的视觉间距（DOM 包裹 span，CSS 加 margin） ── */
const PUNCT_BODY = '，。！？；：、';
const PUNCT_LEFT = '（“‘「『'; // 左括号/左引号
const PUNCT_RIGHT = '）”’」』'; // 右括号/右引号
const ALL_PUNCT = `${PUNCT_BODY}${PUNCT_LEFT}${PUNCT_RIGHT}`;
const PUNCT_RE = new RegExp(`([${ALL_PUNCT}])`, 'g');
// 判断字符是否为 CJK 或全角标点（决定 margin 加在哪一侧）
const CJK_CHAR_RE = new RegExp(`[${CJK}${ALL_PUNCT}]`);

/* ── 占位符工具（保护不该被改动的片段） ── */

class PlaceholderReplacer {
	placeholder: string;
	startDelimiter: string;
	endDelimiter: string;
	pattern: RegExp;
	items: string[] = [];
	index = 0;

	constructor(placeholder: string, startDelimiter: string, endDelimiter: string) {
		this.placeholder = placeholder;
		this.startDelimiter = startDelimiter;
		this.endDelimiter = endDelimiter;
		const escapedStart = this.startDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		const escapedEnd = this.endDelimiter.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
		this.pattern = new RegExp(`${escapedStart}${this.placeholder}(\\d+)${escapedEnd}`, 'g');
	}

	store(item: string): string {
		this.items[this.index] = item;
		return `${this.startDelimiter}${this.placeholder}${this.index++}${this.endDelimiter}`;
	}

	restore(text: string): string {
		if (this.index === 0) return text;
		return text.replace(this.pattern, (_match, index) => this.items[parseInt(index, 10)] || '');
	}
}

const BRACKET_PATTERNS: { pattern: RegExp; open: string; close: string }[] = [
	{ pattern: /<([^<>]*)>/g, open: '<', close: '>' },
	{ pattern: /\(([^()]*)\)/g, open: '(', close: ')' },
	{ pattern: /\[([^\[\]]*)\]/g, open: '[', close: ']' },
	{ pattern: /\{([^{}]*)\}/g, open: '{', close: '}' },
];

function fixBracketSpacing(text: string): string {
	for (const { pattern, open, close } of BRACKET_PATTERNS) {
		text = text.replace(pattern, (_match, innerContent) => {
			if (!innerContent) return `${open}${close}`;
			const trimmedContent = innerContent.replace(/^ +| +$/g, '');
			return `${open}${trimmedContent}${close}`;
		});
	}
	return text;
}

/* ── DOM 应用 ── */

/** 把全角标点拆分为 token（纯函数，便于测试） */
export function splitPunctuation(
	text: string,
): Array<{ type: 'text' | 'punct'; value: string; l?: boolean; r?: boolean }> {
	PUNCT_RE.lastIndex = 0;
	if (!PUNCT_RE.test(text)) return [{ type: 'text', value: text }];
	const tokens: Array<{ type: 'text' | 'punct'; value: string; l?: boolean; r?: boolean }> = [];
	PUNCT_RE.lastIndex = 0;
	let last = 0;
	let m: RegExpExecArray | null;
	while ((m = PUNCT_RE.exec(text))) {
		if (m.index > last) tokens.push({ type: 'text', value: text.slice(last, m.index) });
		const ch = m[0];
		const prev = text[m.index - 1];
		const next = text[m.index + ch.length];
		// 只在贴 CJK/全角标点的一侧加 margin（贴英文/空格的一侧已有间距）
		tokens.push({
			type: 'punct',
			value: ch,
			l: !!prev && CJK_CHAR_RE.test(prev),
			r: !!next && CJK_CHAR_RE.test(next),
		});
		last = m.index + ch.length;
	}
	if (last < text.length) tokens.push({ type: 'text', value: text.slice(last) });
	return tokens;
}

/** 把文本节点中的全角标点包成 span.zh-punct（贴汉字侧加 margin 类） */
function wrapPunctuation(node: Text) {
	const text = node.textContent ?? '';
	PUNCT_RE.lastIndex = 0;
	if (!PUNCT_RE.test(text)) return;
	const tokens = splitPunctuation(text);
	const frag = document.createDocumentFragment();
	for (const t of tokens) {
		if (t.type === 'text') {
			frag.appendChild(document.createTextNode(t.value));
		} else {
			const span = document.createElement('span');
			span.className = `zh-punct${t.l ? ' zh-punct--l' : ''}${t.r ? ' zh-punct--r' : ''}`;
			span.textContent = t.value;
			frag.appendChild(span);
		}
	}
	node.replaceWith(frag);
}

function spacingNode(node: Node) {
	if (node.nodeType === Node.TEXT_NODE && node.textContent) {
		node.textContent = spacingText(node.textContent);
	}
}

function walk(root: HTMLElement) {
	const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
		acceptNode(node) {
			const parent = node.parentElement;
			// 跳过代码、预格式化、脚本等区域（代码中不应插入空格）
			if (parent && parent.closest('pre, code, kbd, samp, script, style, svg')) {
				return NodeFilter.FILTER_REJECT;
			}
			return NodeFilter.FILTER_ACCEPT;
		},
	});
	const nodes: Node[] = [];
	let node: Node | null;
	while ((node = walker.nextNode())) nodes.push(node);
	// 先做盘古空格，再包标点 span（replaceWith 会替换节点，逐个处理独立文本节点安全）
	nodes.forEach(spacingNode);
	nodes.forEach((n) => {
		if (n.nodeType === Node.TEXT_NODE) wrapPunctuation(n as Text);
	});
}

/**
 * 侧边栏分组标题去数字序号前缀（01.prompt → prompt）：
 * 一级分组 label 已在 astro.config.mjs 服务端去前缀，autogenerate 的嵌套子文件夹
 * （如 03.AI专区/01.prompt）由 starlight 自动用文件夹名渲染，序号这里统一清掉。
 * 放在 page-load 里执行：首次加载与 VT 切页后新 DOM 都被处理。
 */
function stripSidebarNumberPrefixes() {
	for (const el of document.querySelectorAll('.sidebar-content summary .group-label .large')) {
		const text = el.textContent ?? '';
		const cleaned = text.replace(/^\d+[.\s-]*/, '');
		if (cleaned !== text) el.textContent = cleaned;
	}
}

function init() {
	// 清理上次导航残留的 window/document 监听器（VT 切页时 window/document 不换，
	// 只有 body 内容被替换，避免监听器累积导致重复执行/内存泄漏）
	backTopCleanup?.();
	backTopCleanup = null;

	const targets = document.querySelectorAll('.sl-markdown-content');
	for (const el of targets) walk(el as HTMLElement);
	initBackTop();
	removeTocOverview();
	initMobileMenuKeep();
	stripSidebarNumberPrefixes();
}

let backTopCleanup: (() => void) | null = null;

/** 移动端：点击分类不关菜单（跳转后自动重新展开，便于继续选文章） */
function initMobileMenuKeep() {
	const isMobile = () => window.matchMedia('(max-width: 47.999rem)').matches;

	// 点击分类链接（sidebar-topics）→ 记录标记。
	// 监听器只注册一次（模块级标志），避免 VT 多次导航后重复注册累积。
	if (!menuListenerRegistered) {
		menuListenerRegistered = true;
		document.addEventListener(
			'click',
			(e) => {
				const target = e.target as HTMLElement;
				const link = target.closest?.('.starlight-sidebar-topics a') as HTMLAnchorElement | null;
				if (link && isMobile()) {
					sessionStorage.setItem('zh-expand-menu', '1');
				}
			},
			false,
		);
	}

	// 新页面加载：如有标记则自动展开移动菜单（文章链接不会设置标记，正常关闭）
	// 用 window load 确保 nova 菜单组件初始化完成，避免其初始化时重置 body 属性
	if (sessionStorage.getItem('zh-expand-menu') === '1') {
		sessionStorage.removeItem('zh-expand-menu');
		if (isMobile()) {
			const expand = () => document.body.setAttribute('data-mobile-menu-expanded', '');
			if (document.readyState === 'complete') {
				expand();
			} else {
				window.addEventListener('load', expand);
			}
		}
	}
}

let menuListenerRegistered = false;

/** 移除 TOC 中的「概述」项（直接删 DOM，不依赖 CSS 选择器兼容性） */
function removeTocOverview() {
	document
		.querySelectorAll('starlight-toc a[href="#_top"], mobile-starlight-toc a[href="#_top"]')
		.forEach((a) => a.closest('li')?.remove());
}

/** hero 标题逐字化：把「情礼宝藏」拆成 span.zh-char（配合 zh.css 逐字弹跳入场动画）
    在指定文档上执行：
    - 首次加载：模块顶层对当前 document 执行（模块脚本 defer，运行于 DOM 解析后、
      首帧绘制前），保证标题以拆字状态进入首帧，避免「完整标题一闪再拆字重演」的闪烁；
    - VT 导航：在 astro:before-swap 中对 newDocument 执行（换页前拆好），
      保证每次切回首页动画都会播放，同样无闪烁；
    只拆首页 hero（html[data-has-hero]），其余页面零开销 */
function splitHeroTitleIn(doc: Document) {
	const h1 = doc.querySelector<HTMLHeadingElement>('html[data-has-hero] .hero h1');
	if (!h1 || h1.querySelector('.zh-char')) return;
	const text = h1.textContent ?? '';
	if (!text) return;
	h1.textContent = '';
	for (const ch of text) {
		const span = doc.createElement('span');
		span.className = 'zh-char';
		span.textContent = ch;
		h1.appendChild(span);
	}
}

/** 回到顶部按钮：圆形进度环 + 阅读百分比，点击平滑回顶 */
function initBackTop() {
	const btn = document.createElement('button');
	btn.className = 'zh-back-top';
	btn.type = 'button';
	btn.setAttribute('aria-label', '回到顶部');
	btn.innerHTML =
		'<svg viewBox="0 0 36 36" aria-hidden="true">' +
		'<circle class="zh-bt-bg" cx="18" cy="18" r="16"></circle>' +
		'<circle class="zh-bt-fg" cx="18" cy="18" r="16"></circle>' +
		'</svg><span class="zh-bt-pct">0%</span>';
	document.body.appendChild(btn);

	const fg = btn.querySelector('.zh-bt-fg') as SVGCircleElement;
	const pct = btn.querySelector('.zh-bt-pct') as HTMLElement;
	const CIRC = 2 * Math.PI * 16;
	fg.style.strokeDasharray = String(CIRC);
	fg.style.strokeDashoffset = String(CIRC);

	let shown = false;
	const onScroll = () => {
		const max = document.documentElement.scrollHeight - window.innerHeight;
		const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
		fg.style.strokeDashoffset = String(CIRC * (1 - p));
		pct.textContent = Math.round(p * 100) + '%';
		if (window.scrollY > 300 && !shown) {
			btn.classList.add('show');
			shown = true;
		} else if (window.scrollY <= 300 && shown) {
			btn.classList.remove('show');
			shown = false;
		}
	};
	window.addEventListener('scroll', onScroll, { passive: true });
	onScroll();

	btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

	// 记录清理函数：VT 导航后按钮随 body 替换消失，但 window 监听器残留，
	// 下次 init 时先移除旧监听器，避免累积。
	backTopCleanup = () => {
		window.removeEventListener('scroll', onScroll);
	};
}

if (typeof document !== 'undefined') {
	// 首次加载：拆字在首帧前完成（见 splitHeroTitleIn 注释），不依赖事件
	splitHeroTitleIn(document);
	// VT 导航：换页前对新文档拆字（astro:before-swap 的 newDocument 为新页面文档），
	// 保证每次切回首页都播放逐字动画；非首页文档无 data-has-hero，直接跳过
	document.addEventListener('astro:before-swap', (e) => {
		const newDoc = e.newDocument;
		if (newDoc && typeof newDoc.querySelector === 'function') splitHeroTitleIn(newDoc);
	});
	// 用 astro:page-load 而非 DOMContentLoaded：
	// 启用 View Transitions 后，切页不会重新执行本脚本，但 astro:page-load 在
	// 首次加载和每次导航后都会触发，确保菜单/回到顶部/排版在切页后依然生效。
	document.addEventListener('astro:page-load', init);
}
