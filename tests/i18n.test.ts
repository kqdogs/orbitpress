import {afterEach,describe,expect,it,vi} from 'vitest';
import {readFileSync,readdirSync} from 'node:fs';
import {z} from 'zod';
import english from '../src/lib/i18n/en.json';
import {localeFromCookie,normalizeLocale,translate,translator} from '../src/lib/i18n';
import {changeLocale,currentLocale} from '../src/lib/i18n/client';
import {readBody} from '../src/lib/http';
import {localizedError} from '../src/lib/i18n/validation';
import {renderMarkdown} from '../src/lib/markdown';
import {headerNavigation} from '../src/lib/header-navigation';
import {footerNavigation} from '../src/lib/footer-settings';
import {layoutBlockCatalog,regionNames} from '../src/lib/page-layouts';
import {permalinkPresets} from '../src/lib/permalinks';
import {categoryIconGroups} from '../src/lib/category-icons';
import {importWarning} from '../src/lib/i18n/import-warning';

afterEach(()=>vi.unstubAllGlobals());
describe('language preference and request isolation',()=>{
 it('only accepts the two supported cookie values and ignores unrelated cookies',()=>{
  for(const input of [undefined,null,'','fr','en-US','EN','<script>','en%0a'])expect(normalizeLocale(input)).toBe('zh-CN');
  expect(localeFromCookie('session=secret; orbitpress_locale=en; another=zh-CN')).toBe('en');
  expect(localeFromCookie('x_orbitpress_locale=en; other=en')).toBe('zh-CN');
  expect(localeFromCookie('orbitpress_locale=zh-CN')).toBe('zh-CN');
 });
 it('keeps independent SSR translators and preserves unknown content and parameters',async()=>{
  const en=translator('en'),zh=translator('zh-CN');
  const results=await Promise.all(Array.from({length:30},async(_,i)=>(i%2?en:zh)('首页')));
  expect(results).toEqual(Array.from({length:30},(_,i)=>i%2?'Home':'首页'));
  expect(en('自定义的文章标题')).toBe('自定义的文章标题');
  for(const key of ['constructor','__proto__','toString'])expect(en(key)).toBe(key);
  expect(en('欢迎回来，{0}。从这里开始今天的创作。',['小明'])).toBe('Welcome back, 小明. Start creating here.');
  expect(en('搜索{0}')).toBe('Search {0}');
 });
 it('stores a path-wide preference and reloads without changing the current URL',()=>{
  const document={documentElement:{lang:'zh-CN'},cookie:''},reload=vi.fn();
  const location={protocol:'https:',href:'https://blog.test/manage?view=editor#/editor/post-1',reload};
  vi.stubGlobal('document',document);vi.stubGlobal('location',location);
  expect(currentLocale()).toBe('zh-CN');changeLocale('en');
  expect(document.cookie).toBe('orbitpress_locale=en; Path=/; Max-Age=31536000; SameSite=Lax; Secure');
  expect(reload).toHaveBeenCalledOnce();expect(location.href).toBe('https://blog.test/manage?view=editor#/editor/post-1');
  document.documentElement.lang='en';changeLocale('en');expect(reload).toHaveBeenCalledOnce();
 });
 it('uses a development-compatible cookie on HTTP',()=>{
  const document={documentElement:{lang:'en'},cookie:''};
  vi.stubGlobal('document',document);vi.stubGlobal('location',{protocol:'http:',reload:vi.fn()});
  changeLocale('zh-CN');expect(document.cookie).not.toContain('Secure');expect(document.cookie).toContain('orbitpress_locale=zh-CN');
 });
});
describe('localized controls preserve authored content',()=>{
 it('translates import notices without rewriting image names or unknown source text',()=>{
  expect(importWarning('“我的图片”未下载到本站（来源限制、大小或格式），请重试或手动上传。','en')).toBe('“我的图片” could not be downloaded (source restrictions, size or format). Retry or upload it manually.');
  expect(importWarning('来源站的原始说明','en')).toBe('来源站的原始说明');
 });
 it('localizes Markdown buttons and video fallback without translating content or code',()=>{
  const body='## 我的标题\n\n中文 English\n\n```python\nprint("首页")\n```\n\n:::youtube nd-Q0_XcCCk t=28\n\n:::bilibili BV1234567890\n';
  const en=renderMarkdown(body,{locale:'en'}),zh=renderMarkdown(body);
  expect(en.html).toContain('Copy code');expect(en.html).toContain('Open video on YouTube');expect(en.html).toContain('Bilibili video');
  expect(en.html).toContain('中文 English');expect(en.html).toContain('首页');expect(en.toc).toEqual(zh.toc);
  expect(zh.html).toContain('复制代码');expect(zh.html).not.toContain('Copy code');
  expect(renderMarkdown(body,{locale:'en'})).toEqual(en);
 });
 it('localizes built-in navigation only and never mutates custom labels',()=>{
  const settings={headerNav:[{label:'我的教程',href:'/tutorials/'}],footerNav:null};
  const original=structuredClone(settings);
  expect(headerNavigation(settings,'en')[0].label).toBe('Home');
  expect(headerNavigation(settings,'en')[1].label).toBe('我的教程');
  expect(footerNavigation(settings,'en').map(item=>item.label)).toEqual(['我的教程','About','Sitemap']);
  expect(headerNavigation({headerNav:[{label:'首页',href:'/'}]},'en')[0].label).toBe('首页');
  expect(settings).toEqual(original);
 });
 it('localizes validation using request cookies, with identical success payloads',async()=>{
  const schema=z.object({title:z.string().min(1)}).strict();
  const req=(locale:string,value:unknown)=>new Request('https://blog.test/api/test',{method:'POST',headers:{'Content-Type':'application/json',Cookie:`orbitpress_locale=${locale}`},body:JSON.stringify(value)});
  await expect(readBody(req('en',{title:''}),schema)).rejects.toThrow('Title is required');
  await expect(readBody(req('zh-CN',{title:''}),schema)).rejects.toThrow('标题不能为空');
  expect(await readBody(req('en',{title:'原文标题'}),schema)).toEqual({title:'原文标题'});
  const result=schema.safeParse({title:123});
  if(result.success)throw Error('invalid fixture');
  expect(localizedError(result.error,'en','Action failed')).toBe('Title has an invalid data type');
 });
});
describe('translation coverage and documentation',()=>{
 const dictionary:Record<string,string>=english;
 it('covers system messages used by UI translation calls and shared UI catalogs',()=>{
  const required=new Set<string>();
  const files=readdirSync('src',{recursive:true}).map(String).filter(name=>/\.(vue|astro|ts)$/.test(name)&&!name.startsWith('lib\\i18n')&&!name.startsWith('lib/i18n'));
  for(const file of files){
   const source=readFileSync('src/'+file,'utf8');
   for(const match of source.matchAll(/\bt\((['"])((?:\\.|(?!\1)[\s\S])*?)\1/g)){
    const key=match[2].replace(/\\n/g,'\n').replace(/\\'/g,"'").replace(/\\"/g,'"');
    if(/[\p{Script=Han}]/u.test(key))required.add(key);
   }
  }
  for(const item of layoutBlockCatalog){required.add(item.name);required.add(item.description);}
  for(const value of Object.values(regionNames))required.add(value);
  for(const item of permalinkPresets)required.add(item.label);
  for(const item of categoryIconGroups)required.add(item.title);
  expect([...required].filter(key=>!Object.hasOwn(dictionary,key))).toEqual([]);
 });
 it('retains parameters, URL tokens and complete English messages in every mapping',()=>{
  for(const [key,value] of Object.entries(dictionary)){
   expect(value.trim(),key).not.toBe('');expect(value,key).not.toMatch(/\p{Script=Han}/u);
   const tokens=(text:string)=>(text.match(/\{(?:\d+|year|title)\}|%[a-z_]+%/g)||[]).sort();
   expect(tokens(value),key).toEqual(tokens(key));
  }
  expect(translate('zh-CN','首页')).toBe('首页');
 });
 it('provides both READMEs with matching installation commands and language links',()=>{
  const zh=readFileSync('README.md','utf8'),en=readFileSync('README.en.md','utf8');
  expect(zh).toContain('(README.en.md)');expect(en).toContain('(README.md)');
  for(const command of ['npm ci','npm run setup:local','npm run db:migrate','npm run dev','npm run deploy:cli']){expect(zh).toContain(command);expect(en).toContain(command);}
  expect(en).toContain('deploy.workers.cloudflare.com/?url=');expect(en).toContain('THIRD_PARTY_NOTICES.md');
 });
 it('keeps public header actions in a dedicated right-side lane',()=>{
  const header=readFileSync('src/components/SiteHeader.astro','utf8');
  const css=readFileSync('src/styles/site.css','utf8');
  expect(header).toContain('class="nav-links"');expect(header).toContain('class="desktop-actions"');expect(header).toContain('<HeaderActions/>');
  expect(css).toContain('.nav-row{display:flex;align-items:center;justify-content:space-between');
  expect(css).toContain('.nav-links{display:flex;align-items:center');
  expect(readFileSync('src/components/LanguageSwitch.astro','utf8')).toContain('<details class="site-language"');
 });
});
