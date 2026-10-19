import {describe,it,expect} from 'vitest';
import {articleHighlights,legacyHighlights,suggestArticleTags,tagHref,uniqueTerms} from '../src/lib/article-metadata';
import {postInput,postUpdate,articlePreviewInput} from '../src/lib/schema';
import {toPost} from '../src/lib/repository';
const input={title:'Maya 数字银行开户教程',slug:'test-maya',excerpt:'免费开户 · 附赠地址证明',body:'## Apple Pay 与海外支付\n\n绑定 Apple Pay，管理 Maya 账户。',categoryId:'banking',cover:'',videoId:'',featured:false,tags:['Maya']};
describe('文章标签与黄色亮点',()=>{
 it('缺省兼容旧写入，显式空数组可清空，预览与保存共享字段校验',()=>{
  expect(postInput.parse(input)).not.toHaveProperty('highlights');
  expect(postUpdate.parse({...input,version:1,highlights:[]}).highlights).toEqual([]);
  const {slug,featured,...preview}=input;
  expect(articlePreviewInput.parse({...preview,highlights:['免费开户']}).highlights).toEqual(['免费开户']);
  for(const highlights of [null,'bad',[''],['x'.repeat(41)],Array(7).fill('too many')])expect(postInput.safeParse({...input,highlights}).success).toBe(false);
 });
 it('历史NULL亮点兼容摘要分段，显式清空不重新出现，读取不污染原摘要',()=>{
  expect(legacyHighlights(input.excerpt)).toEqual(['免费开户','附赠地址证明']);
  expect(articleHighlights(input)).toEqual(['免费开户','附赠地址证明']);
  expect(articleHighlights({...input,highlights:[]})).toEqual([]);
  const row={title:input.title,excerpt:input.excerpt,tags:'[]',highlights:null};
  expect(toPost(row).highlights).toEqual(['免费开户','附赠地址证明']);
  expect(toPost({...row,highlights:'[]'}).highlights).toEqual([]);
  expect(toPost({...row,highlights:'["自定义亮点"]'}).highlights).toEqual(['自定义亮点']);
  expect(row.excerpt).toBe(input.excerpt);
  expect(legacyHighlights('长'.repeat(100))).toEqual([]);
 });
 it('本地自动提取品牌和内容词，保留手工标签，不制造空文通用标签',()=>{
  const generated=suggestArticleTags({...input,category:'银行账户'},['Maya','手动标签']);
  expect(generated).toContain('Maya');expect(generated).toContain('Apple Pay');
  expect(generated).not.toContain('手动标签');
  expect(generated.length).toBeLessThanOrEqual(8);expect(generated).not.toContain('教程');
  expect(uniqueTerms(['手动标签',...generated],8)[0]).toBe('手动标签');
  expect(suggestArticleTags({title:'',excerpt:'',body:'',category:'银行账户'})).toEqual([]);
 });
 it('忽略代码块、远程地址和HTML属性，输出有界且去重',()=>{
  const generated=suggestArticleTags({title:'ChatGPT 写作流程',excerpt:'',body:'```html\n<script onload="SecretToken">MaliciousWord</script>\n```\nhttps://secret.example.com/HiddenToken\n## 中文写作'});
  expect(generated).toContain('ChatGPT');
  expect(generated.join(',')).not.toMatch(/SecretToken|MaliciousWord|HiddenToken/);
  expect(uniqueTerms([' AI ','ai','',...Array(10).fill('Maya')],8)).toEqual(['AI','Maya']);
  expect(uniqueTerms(['x'.repeat(31),'正常标签'],8)).toEqual(['正常标签']);
 });
 it('标签链接正确编码中文与特殊字符，避免把标签当作宽泛全文查询',()=>{
  const url=new URL(tagHref('Apple Pay & 支付'),'https://blog.test');
  expect(url.searchParams.get('tag')).toBe('Apple Pay & 支付');expect(url.searchParams.has('s')).toBe(false);
 });
});
