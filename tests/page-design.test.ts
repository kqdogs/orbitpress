import { describe, expect, it } from 'vitest';
import { pagePreviewInput, settingsInput, settingsUpdateInput } from '../src/lib/schema';
import { renderMarkdown } from '../src/lib/markdown';
import { siteSettings } from '../src/lib/repository';

const brand = { title:'YaChin科技生活',tagline:'连接世界',description:'自己的站点介绍',logo:'',socialFollowText:'关注',headerNav:[{label:'首页',href:'/'}],youtube:'',telegram:'',bilibili:'',twitter:'',notice:'' };
describe('页面装修契约', () => {
  it('旧数据获得完整、互相独立的页面默认配置', () => {
    const first = settingsInput.parse(brand), second = settingsInput.parse(brand);
    expect(first.articleDesign).toMatchObject({showToc:true,showTags:true,showAuthor:true,showResources:true,fontSize:15});
    expect(first.aboutDesign).toMatchObject({layout:'banner',title:'关于',showBackButton:false});
    first.articleDesign.showToc=false;
    expect(second.articleDesign.showToc).toBe(true);
  });
  it('旧客户端省略新字段时不会将它们填成默认值覆盖已有装修', () => {
    const {articleDesign,aboutDesign,...oldClient}=settingsInput.parse(brand);
    const patch=settingsUpdateInput.parse({...oldClient,version:2});
    expect(patch).not.toHaveProperty('articleDesign'); expect(patch).not.toHaveProperty('aboutDesign');
    const current=settingsInput.parse({...brand,articleDesign:{showAuthor:false},aboutDesign:{title:'关于 YaChin'}});
    const {version,...fields}=patch;
    const merged=settingsInput.parse({...current,...fields});
    expect(version).toBe(2);expect(merged.articleDesign.showAuthor).toBe(false);expect(merged.aboutDesign.title).toBe('关于 YaChin');
  });
  it('显式 false、空说明和空正文可保存，null 和未知字段被拒绝', () => {
    const parsed=settingsInput.parse({...brand,articleDesign:{showResources:false,resourcesDescription:''},aboutDesign:{body:'',lead:''}});
    expect(parsed.articleDesign.showResources).toBe(false);expect(parsed.aboutDesign.body).toBe('');
    expect(settingsInput.safeParse({...brand,articleDesign:null}).success).toBe(false);
    expect(settingsInput.safeParse({...brand,aboutDesign:{unsafe:true}}).success).toBe(false);
  });
  it.each([13,19,15.5])('字号边界拒绝 %s', fontSize => {
    expect(settingsInput.safeParse({...brand,articleDesign:{fontSize}}).success).toBe(false);
  });
  it('关于页拒绝空标题、超长正文、危险按钮链接和未知布局', () => {
    for(const aboutDesign of [{title:'  '},{body:'中'.repeat(20001)},{buttonHref:'javascript:alert(1)'},{buttonHref:'//evil.test/'},{layout:'arbitrary'}]) {
      expect(settingsInput.safeParse({...brand,aboutDesign}).success).toBe(false);
    }
  });
  it('预览只接受页面、完整设置和可选文章ID，不接受正文写入或任意URL', () => {
    const settings=settingsInput.parse(brand);
    expect(pagePreviewInput.parse({page:'about',settings}).page).toBe('about');
    expect(pagePreviewInput.parse({page:'article',settings,postId:'sample'}).postId).toBe('sample');
    for(const patch of [{page:'admin'},{postId:''},{draft:{body:'覆盖正文'}},{url:'https://evil.test/'}]) {
      expect(pagePreviewInput.safeParse({page:'article',settings,...patch}).success).toBe(false);
    }
  });
  it('关于页 Markdown 复用正文清洗，保留排版并去掉活动内容', () => {
    const {html}=renderMarkdown('## 关于我\n\n正文\n<script>alert(1)</script>\n<a href="javascript:alert(1)" onclick="alert(1)">链接</a>');
    expect(html).toContain('关于我');expect(html).toContain('<h2');expect(html).not.toMatch(/<script|onclick|javascript:/i);
  });
  it('旧站点读取时继承用户品牌且不触发数据库写入', async () => {
    const db={prepare:(sql:string)=>{
      expect(sql).toBe('SELECT value,version FROM settings WHERE id=1');
      return {first:async()=>({value:JSON.stringify(brand),version:5})};
    }} as unknown as D1Database;
    const result=await siteSettings(db);
    expect(result.value.title).toBe('YaChin科技生活');
    expect(result.value.aboutDesign).toMatchObject({lead:'连接世界',body:'自己的站点介绍'});
    expect(result.version).toBe(5);
  });
});
