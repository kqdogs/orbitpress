import {describe,expect,it} from 'vitest';
import {parseArticle} from '../src/lib/article-import';
import {renderMarkdown} from '../src/lib/markdown';

const url='https://rinfinity.net/heading-test/';
const cover='https://rinfinity.net/wp-content/uploads/2026/10/cover.png';
const source=`<meta property="og:image" content="${cover}"><h1 class="site--title">来源站名</h1><div class="post post-single"><div class="post-header"><h1>菲律宾 DITO eSIM申请教程｜10元长期保号｜大陆身份可申请｜菲律宾第三大运营商</h1><div class="tags"><a href="/tag/dito/">DITO</a><a href="/tag/esim/">eSIM</a><a href="/tag/phone/">菲律宾手机号</a></div><a rel="category tag" href="/category/example/">不要作为标签</a></div><div class="entry-content"><p><img src="${cover}" alt="重复封面"></p><h2>准备工作</h2><p>这是足够长的测试文章正文，正文步骤图片应保留，封面不应该重复显示。</p><img src="/wp-content/uploads/2026/10/step.png" alt="步骤一"></div></div><div class="tags"><a href="/tag/unrelated/">无关推荐标签</a></div>`;

describe('文章采集的标题、亮点与封面展示',()=>{
 it('将源站显示标题与三个黄色亮点分开，并采集不带rel的正文区域标签',()=>{
  const {article}=parseArticle(source,url);
  expect(article.title).toBe('菲律宾 DITO eSIM申请教程');
  expect(article.highlights).toEqual(['10元长期保号','大陆身份可申请','菲律宾第三大运营商']);
  expect(article.tags).toEqual(['DITO','eSIM','菲律宾手机号']);
 });
 it('封面仍在下载队列，采集正文不再插入重复封面，保留步骤图',()=>{
  const parsed=parseArticle(source,url);
  expect([...parsed.pictures.keys()]).toEqual([cover,'https://rinfinity.net/wp-content/uploads/2026/10/step.png']);
  expect(parsed.article.body).not.toContain('ORBITPRESS_IMAGE_0');
  expect(parsed.article.body).toContain('ORBITPRESS_IMAGE_1');
 });
 it('文章渲染可隐藏旧正文中封面，但保留其他图片；页面默认渲染不受影响',()=>{
  const media='/media/import-'+'a'.repeat(64)+'.png';
  const body=`![重复封面](${media})\n\n## 操作步骤\n\n![步骤图](/media/01234567-abcd-abcd-abcd-0123456789ab.png)`;
  const article=renderMarkdown(body,{omitImage:media});
  expect(article.html).not.toContain(media);expect(article.html).toContain('01234567-abcd-abcd-abcd-0123456789ab.png');
  expect(article.toc).toEqual([{id:'section-1',text:'操作步骤',level:2}]);
  expect(renderMarkdown(body).html).toContain(media);
  expect(renderMarkdown(body,{omitImage:''}).html).toContain(media);
 });
});
