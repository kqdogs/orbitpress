import {describe,it,expect} from 'vitest';
import * as icons from '@element-plus/icons-vue';
import svg from '../src/lib/element-icon-svg.json';
import {previewViewport} from '../src/lib/preview-viewport';
import {footerCopyright,footerNavigation} from '../src/lib/footer-settings';
import {canonicalPostLocation} from '../src/lib/permalinks';
import {categoryIconValues,elementCategoryIcon} from '../src/lib/category-icons';
import {categoryInput,configuredCategorySlugs,settingsInput,settingsUpdateInput} from '../src/lib/schema';
const brand={title:'我的站点',tagline:'',description:'',logo:'',socialFollowText:'关注',headerNav:[{label:'自定义首页',href:'/'},{label:'分类',href:'/category/tools/'}],youtube:'',telegram:'',bilibili:'',twitter:'',notice:''};
const post={id:'post-1',slug:'hello',categorySlug:'tools',publishedAt:'2026-10-19',createdAt:'2026-10-18'};
describe('预览视口与页脚设置',()=>{
 it.each([240,640,980,1800])('桌面画布%s保持1440视口，不被后台面板触发移动断点',available=>{
  const view=previewViewport(available,720);expect(view.width).toBe(1440);expect(view.width*view.scale).toBeLessThanOrEqual(available);expect(view.height*view.scale).toBeGreaterThanOrEqual(720);expect(view.scale).toBeLessThanOrEqual(1);
 });
 it('手机画布使用390视口，窄屏缩放，尚未测量时保持有限数值',()=>{
  expect(previewViewport(600,620,true)).toMatchObject({width:390,height:620,scale:1,left:105});
  expect(previewViewport(300,620,true).width).toBe(390);expect(Number.isFinite(previewViewport(0,0).height)).toBe(true);
 });
 it('旧设置保留原版权和导航，显式空数组隐藏导航，null恢复默认',()=>{
  const settings=settingsInput.parse(brand);expect(footerCopyright(settings,2027)).toBe('© 2027 我的站点');
  expect(footerNavigation(settings).map(i=>i.label)).toEqual(['自定义首页','关于','站点地图']);
  expect(footerNavigation({...settings,footerNav:[]})).toEqual([]);
  expect(footerNavigation({...settings,footerNav:null})).toEqual(footerNavigation(settings));
 });
 it('版权占位符与页脚链接独立于页头，引用分类也受保护',()=>{
  const settings=settingsInput.parse({...brand,footerCopyright:'© 2020–{year} {title} 版权所有',footerNav:[{label:'底部教程',href:'/category/footer-topic/'}]});
  expect(footerCopyright(settings,2026)).toBe('© 2020–2026 我的站点 版权所有');
  expect(footerNavigation(settings)).toEqual(settings.footerNav);expect(configuredCategorySlugs(settings)).toContain('footer-topic');
  const {footerCopyright:copy,footerNav:nav,...legacy}=settings;
  const patch=settingsUpdateInput.parse({...legacy,version:1});expect(patch).not.toHaveProperty('footerCopyright');expect(patch).not.toHaveProperty('footerNav');
  const {version,...fields}=patch;
  expect(settingsInput.parse({...settings,...fields}).footerNav).toEqual(nav);
 });
 it('页脚拒绝脚本链接、空标签、超长版权和超量导航',()=>{
  for(const footerNav of [[{label:'危险',href:'javascript:alert(1)'}],[{label:'',href:'/'}],Array.from({length:13},()=>({label:'链接',href:'/'}))])expect(settingsInput.safeParse({...brand,footerNav}).success).toBe(false);
  expect(settingsInput.safeParse({...brand,footerCopyright:'a'.repeat(301)}).success).toBe(false);
 });
});
describe('文章固定链接的主地址跳转',()=>{
 const settings=settingsInput.parse({...brand,permalinkFormats:['custom','postname','plain'],permalinkCustom:'/%post_id%.html'});
 it('兼容文章地址跳转新的主地址，保留多值查询并去除旧p参数',()=>{
  expect(canonicalPostLocation(new URL('https://blog.test/hello/?tag=a&tag=b'),post,settings)).toBe('/post-1.html?tag=a&tag=b');
  expect(canonicalPostLocation(new URL('https://blog.test/?p=post-1&utm_source=share'),post,settings)).toBe('/post-1.html?utm_source=share');
 });
 it('主地址不重复跳转，切换朴素主地址也能闭环',()=>{
  expect(canonicalPostLocation(new URL('https://blog.test/post-1.html?utm_source=share'),post,settings)).toBeNull();
  const plain={...settings,permalinkFormats:['plain','custom'] as typeof settings.permalinkFormats};
  expect(canonicalPostLocation(new URL('https://blog.test/post-1.html'),post,plain)).toBe('/?p=post-1');
  expect(canonicalPostLocation(new URL('https://blog.test/?p=post-1'),post,plain)).toBeNull();
 });
});
describe('分类图标库契约',()=>{
 it('支持实际安装的293个图标与8个旧值，未知及原型名称不进入组件解析',()=>{
  for(const name of Object.keys(icons))expect(categoryIconValues).toContain(`ep:${name}`);
  expect(categoryIconValues.length).toBe(Object.keys(icons).length+8);
  expect(Object.keys(svg).sort()).toEqual(Object.keys(icons).sort());
  for(const markup of Object.values(svg)){expect(markup).toContain('<path');expect(markup).not.toMatch(/<script|\bon\w+=|javascript:/i);}
  for(const icon of ['card','globe','ep:VideoCamera','ep:StarFilled'])expect(categoryInput.parse({name:'测试',slug:'test-cat',description:'',icon}).icon).toBe(icon);
  for(const name of ['ep:Missing','constructor','__proto__','<svg onload=alert(1)>']){expect(categoryInput.safeParse({name:'测试',slug:'test-cat',description:'',icon:name}).success).toBe(false);expect(elementCategoryIcon(name)).toBeNull();}
 });
});
