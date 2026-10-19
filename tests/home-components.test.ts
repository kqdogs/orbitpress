import {describe,expect,it} from 'vitest';
import {homeLayoutInput,pageLayoutsInput,settingsInput,settingsUpdateInput} from '../src/lib/schema';
import {createBlock,createHomeLayout,initialPageLayout,layoutBlockCatalog,moveLayoutBlock} from '../src/lib/page-layouts';
const base={title:'测试',tagline:'',description:'',logo:'',socialFollowText:'关注',headerNav:[{label:'首页',href:'/'}],youtube:'',telegram:'',bilibili:'',twitter:'',notice:''};
describe('首页与通用装修组件契约',()=>{
 it('六个旧区块转成组件，保留顺序显隐和文案且不改原设置',()=>{
  const settings=settingsInput.parse(base);settings.homeSections[5].enabled=false;settings.homeSections[5].title='旧公告';settings.homeSections[0].subtitle='旧说明';
  settings.homeSections[0].order=5;settings.homeSections[5].order=0;
  const before=structuredClone(settings),layout=createHomeLayout(settings);
  expect(layout.main.map(b=>b.type)).toEqual(['home-notice','home-promo','home-categories','home-videos','home-tutorials','home-hero']);
  expect(layout.main[0]).toMatchObject({title:'旧公告',enabled:false});expect(layout.main[5].text).toBe('旧说明');
  expect(layout.sidebar).toBe('none');expect(settings).toEqual(before);
 });
 it('首页使用相同组件库，首页组件也能放到正文模板',()=>{
  const types=layoutBlockCatalog.map(item=>item.type);
  for(const type of ['hero','promo','categories','videos','tutorials','notice'])expect(types).toContain(`home-${type}`);
  const settings=settingsInput.parse(base),layout=initialPageLayout(settings,'article');layout.main.push(createBlock('home-videos','video-widget'));
  expect(pageLayoutsInput.safeParse({article:layout}).success).toBe(true);
 });
 it('首页可跨区移动、移除全部组件，正文模板约束仍保持',()=>{
  const settings=settingsInput.parse(base),layout=createHomeLayout(settings);
  const moved=moveLayoutBlock(layout,'home-videos','left');expect(moved.left[0].type).toBe('home-videos');
  expect(layout.left).toEqual([]);expect(moved.main.some(b=>b.id==='home-videos')).toBe(false);
  expect(pageLayoutsInput.safeParse({home:{...layout,main:[]}}).success).toBe(true);
  expect(pageLayoutsInput.safeParse({default:{...layout,main:[]}}).success).toBe(false);
  expect(homeLayoutInput.safeParse({...layout,main:[createBlock('content','page-content')]}).success).toBe(false);
 });
 it('已保存首页布局优先于旧配置，旧客户端省略布局不会清空',()=>{
  const settings=settingsInput.parse(base);settings.pageLayouts.home={...createHomeLayout(settings),main:[createBlock('notice','custom-notice')]};
  expect(initialPageLayout(settings,'home').main.map(b=>b.id)).toEqual(['custom-notice']);
  const {pageLayouts,...legacy}=settings;expect(settingsUpdateInput.parse({...legacy,version:1})).not.toHaveProperty('pageLayouts');
  const reset={...settings,pageLayouts:{}};expect(initialPageLayout(reset,'home').main).toHaveLength(6);
 });
 it('首页仍拒绝重复组件标识、危险链接及满栏移动',()=>{
  const layout=createHomeLayout(settingsInput.parse(base));
  expect(pageLayoutsInput.safeParse({home:{...layout,left:[layout.main[0]]}}).success).toBe(false);
  expect(pageLayoutsInput.safeParse({home:{...layout,left:[{...createBlock('button','unsafe'),href:'javascript:alert(1)'}]}}).success).toBe(false);
  layout.left=Array.from({length:8},(_,i)=>createBlock('notice',`left-${i}`));
  expect(()=>moveLayoutBlock(layout,'home-videos','left')).toThrow();
 });
});
