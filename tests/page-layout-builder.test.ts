import { describe, expect, it } from 'vitest';
import { configuredCategorySlugs, pageLayoutInput, settingsInput, settingsUpdateInput } from '../src/lib/schema';
import { createBlock, createPageLayout, moveLayoutBlock, resolvePageLayout } from '../src/lib/page-layouts';
import { menuItems } from '../src/components/studio/router';

const brand={title:'布局测试',tagline:'',description:'',logo:'',socialFollowText:'关注',headerNav:[{label:'首页',href:'/'}],youtube:'',telegram:'',bilibili:'',twitter:'',notice:''};
describe('页面装修区块契约',()=>{
 it('所有一级和二级菜单都有真实图标组件',()=>{
  for(const item of menuItems){expect(item.meta.icon).toBeTruthy();if('children' in item)for(const child of item.children||[])expect(child.meta.icon).toBeTruthy();}
 });
 it('旧设置缺省不改变前台，旧客户端更新不会覆盖已有布局',()=>{
  const old=settingsInput.parse(brand);expect(old.pageLayouts).toEqual({});
  expect(resolvePageLayout(old,'article')).toBeUndefined();
  const {pageLayouts,...legacy}=old;
  const patch=settingsUpdateInput.parse({...legacy,version:1});
  expect(patch).not.toHaveProperty('pageLayouts');
  const {version,...fields}=patch;expect(version).toBe(1);
  expect(settingsInput.parse({...old,pageLayouts:{default:createPageLayout()},...fields}).pageLayouts.default).toBeDefined();
 });
 it('独立页面继承默认模板，自定义页不会影响别的页面',()=>{
  const s=settingsInput.parse({...brand,pageLayouts:{default:createPageLayout(),'page:one':createPageLayout('left')}});
  expect(resolvePageLayout(s,'page:two')?.sidebar).toBe('right');
  expect(resolvePageLayout(s,'page:one')?.sidebar).toBe('left');
  expect(resolvePageLayout(s,'about')).toBeUndefined();
 });
 it('组件可跨左右栏移动和排序，保留配置且不改原对象',()=>{
  const original=createPageLayout();original.right.push(createBlock('notice','notice-a'));
  const before=structuredClone(original);
  const moved=moveLayoutBlock(original,'notice-a','left');
  expect(moved.left[0]).toMatchObject({id:'notice-a',type:'notice'});
  expect(moved.right.some(b=>b.id==='notice-a')).toBe(false);
  const back=moveLayoutBlock(moved,'notice-a','right',moved.right[0].id);
  expect(back.right[0].id).toBe('notice-a');expect(original).toEqual(before);
 });
 it('正文不能移到侧栏、隐藏或删除，未知目标不会丢失数据',()=>{
  const layout=createPageLayout();const core=layout.main[0];
  expect(()=>moveLayoutBlock(layout,core.id,'left')).toThrow();
  expect(pageLayoutInput.safeParse({...layout,main:[]}).success).toBe(false);
  expect(pageLayoutInput.safeParse({...layout,main:[{...core,enabled:false}]}).success).toBe(false);
  expect(moveLayoutBlock(layout,'missing','right')).toEqual(layout);
 });
 it('重复标识、危险链接、外部图片、未知区块和异常区域被拒绝',()=>{
  const layout=createPageLayout();
  for(const bad of [
   {...layout,right:[createBlock('notice',layout.main[0].id)]},
   {...layout,right:[{...createBlock('button','bad'),href:'javascript:alert(1)'}]},
   {...layout,right:[{...createBlock('image','bad'),image:'https://evil.test/image.png'}]},
   {...layout,right:[{...createBlock('notice','bad'),type:'script'}]},
   {...layout,sidebar:'arbitrary'},
  ])expect(pageLayoutInput.safeParse(bad).success).toBe(false);
 });
 it('每栏容量有上限，拖动到满栏不能静默丢失组件',()=>{
  const layout=createPageLayout();layout.left=Array.from({length:8},(_,i)=>createBlock('notice',`left-${i}`));
  expect(()=>moveLayoutBlock(layout,layout.right[0].id,'left')).toThrow();
 });
 it('组件中的分类链接纳入现有关联检查，隐藏栏仍保留引用',()=>{
  const layout=createPageLayout('none');const button=createBlock('button','category-button');button.href='/category/custom-topic/';layout.left.push(button);
  const s=settingsInput.parse({...brand,pageLayouts:{default:layout}});
  expect(configuredCategorySlugs(s)).toContain('custom-topic');
 });
});
