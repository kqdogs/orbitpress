export const MAX_TAGS = 8;
export const MAX_HIGHLIGHTS = 6;

/** Shared by form chips and generated suggestions; preserve the first spelling. */
export function uniqueTerms(values: string[], limit: number, maxLength = 30): string[] {
  const seen = new Set<string>();
  return values.map(value => value.trim()).filter(value => {
    const key = value.toLocaleLowerCase();
    if (!value || value.length > maxLength || seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, limit);
}

/** Only legacy rows without an explicit highlights value inherit excerpt phrases. */
export function legacyHighlights(excerpt: string): string[] {
  return uniqueTerms(excerpt.split(/\s*[·•]\s*/u), MAX_HIGHLIGHTS, 40);
}
export function articleHighlights(post: { highlights?: string[]; excerpt: string }): string[] {
  return post.highlights ?? legacyHighlights(post.excerpt);
}
export function tagHref(tag: string): string {
  return '/?tag=' + encodeURIComponent(tag);
}

const products = ['Apple Pay', 'Apple ID', 'ChatGPT', 'Claude', 'Gemini', 'OpenAI', 'Muse Wallet', 'MuseWallet', 'Maya', 'Revolut', 'YouTube', 'Bilibili', 'Cloudflare', 'WordPress', 'PayPal', 'Wise', 'eSIM', 'DITO', 'Roogoo', 'Markdown', '虚拟卡', '虚拟借记卡', '海外支付', '数字银行', '海外账户', '地址证明', '人工智能'];
const stopWords = new Set(['教程', '方法', '步骤', '内容', '文章', '我们', '你们', '他们', '可以', '以及', '这个', '那个', '如何', '申请', '注册', '开户', '支持', '使用', '进行', '需要', '通过', '相关', '准备', '开始', '完成', '常见', '问题', '最后', '检查', '第一步', '第二步', '详细', '介绍', 'the', 'and', 'for', 'with', 'this', 'that', 'from', 'your', 'have', 'into']);

/** Deterministic local extraction: no remote model, credentials or publication side effects. */
export function suggestArticleTags(article: {title: string; excerpt: string; body: string; category?: string}, existing: string[] = []): string[] {
  const plain = (article.title + '\n' + article.excerpt + '\n' + article.body.slice(0, 30000))
    .replace(/```[\s\S]*?```/g, ' ').replace(/https?:\/\/\S+/g, ' ').replace(/<[^>]*>/g, ' ');
  if (!plain.trim()) return [];
  const lower = plain.toLocaleLowerCase(), title = article.title.toLocaleLowerCase();
  const scores = new Map<string, {name: string; score: number}>();
  const add = (name: string, score: number) => {
    const value = name.trim(), key = value.toLocaleLowerCase();
    if (value.length < 2 || value.length > 30 || stopWords.has(key) || /^\d+$/.test(value)) return;
    const previous = scores.get(key);
    scores.set(key, {name: previous?.name || value, score: (previous?.score || 0) + score});
  };
  for (const term of existing) if (lower.includes(term.toLocaleLowerCase())) add(term, 12);
  for (const term of products) if (lower.includes(term.toLocaleLowerCase())) add(term, 10);
  if (article.category) add(article.category, 4);
  const segmenter = new Intl.Segmenter('zh-CN', {granularity: 'word'});
  for (const item of segmenter.segment(plain)) if (item.isWordLike) add(item.segment, title.includes(item.segment.toLocaleLowerCase()) ? 4 : 1);
  return uniqueTerms([...scores.values()].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'zh-CN')).map(item => item.name), MAX_TAGS);
}
