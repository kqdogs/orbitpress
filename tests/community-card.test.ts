import {describe,it,expect} from 'vitest';
import {settingsInput,settingsUpdateInput,configuredCategorySlugs} from '../src/lib/schema';
import {resolveCommunityCard} from '../src/lib/community-card';
const brand={title:'YaChin科技生活',tagline:'连接世界',description:'介绍',logo:'',socialFollowText:'关注',headerNav:[{label:'首页',href:'/'}],youtube:'',telegram:'https://t.me/example',bilibili:'',twitter:'',notice:''};
const card={enabled:true,title:'自定义交流群',description:'自定义说明',icon:'ep:ChatDotRound' as const,buttonLabel:'立即加入',href:'/about/'};
describe('首页交流群卡片配置',()=>{
 it('未配置社交地址时不显示默认交流群',()=>expect(resolveCommunityCard(settingsInput.parse({...brand,telegram:''})).enabled).toBe(false));
 it('旧站点继承原卡片，独立设置不受站点名称和Telegram修改影响',()=>{
  const settings=settingsInput.parse(brand);
  expect(settings.communityCard).toBeNull();
  expect(resolveCommunityCard(settings)).toMatchObject({title:brand.title+'交流群',href:brand.telegram,icon:'telegram',buttonLabel:'加入',description:settings.homeHero.description});
  expect(resolveCommunityCard(settingsInput.parse({...brand,title:'另一个站点',telegram:'',communityCard:card}))).toEqual(card);
 });
 it('旧PUT省略卡片保留自定义，显式null恢复继承，false和空说明不回退',()=>{
  const current=settingsInput.parse({...brand,communityCard:card});
  const {communityCard,...old}=settingsInput.parse(brand);
  const {version,...patch}=settingsUpdateInput.parse({...old,version:1});
  expect(patch).not.toHaveProperty('communityCard');
  expect(resolveCommunityCard(settingsInput.parse({...current,...patch}))).toEqual(card);
  expect(settingsUpdateInput.parse({...old,version,communityCard:null}).communityCard).toBeNull();
  expect(resolveCommunityCard(settingsInput.parse({...brand,communityCard:{...card,enabled:false,description:''}}))).toMatchObject({enabled:false,description:''});
 });
 it('拒绝危险链接、未知图标、缺少必填项和超长字段',()=>{
  for(const patch of [{href:'javascript:alert(1)'},{href:'//evil.test'},{href:'https://user:pass@evil.test'},{icon:'unknown'},{title:' '},{title:'字'.repeat(121)},{description:'字'.repeat(181)},{buttonLabel:''},{buttonLabel:'字'.repeat(21)},{extra:true}])expect(settingsInput.safeParse({...brand,communityCard:{...card,...patch}}).success).toBe(false);
  expect(settingsInput.safeParse({...brand,communityCard:{}}).success).toBe(false);
 });
 it('卡片分类链接纳入原有分类删除与重命名引用保护',()=>{
  expect(configuredCategorySlugs(settingsInput.parse({...brand,communityCard:{...card,href:'/category/banking/'}}))).toContain('banking');
 });
});
