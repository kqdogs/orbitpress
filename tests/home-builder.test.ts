import { describe, expect, it } from 'vitest';
import { reorderSections } from '../src/components/admin/homeBuilder';
import { settingsInput } from '../src/lib/schema';
const base={title:'测试',tagline:'',description:'',logo:'',socialFollowText:'关注',headerNav:[{label:'首页',href:'/'}],youtube:'',telegram:'',bilibili:'',twitter:'',notice:''};
describe('首页拖拽排序契约',()=>{
 it('从末尾移到开头，保留禁用区块、文案且不修改输入',()=>{
  const value=settingsInput.parse(base);value.homeSections[5].enabled=false;value.homeSections[5].title='隐藏公告';
  const snapshot=structuredClone(value.homeSections);
  const moved=reorderSections(value.homeSections,'notice','hero');
  expect(moved.map(s=>s.id)).toEqual(['notice','hero','promo','categories','videos','tutorials']);
  expect(moved[0]).toMatchObject({title:'隐藏公告',enabled:false});
  expect(settingsInput.safeParse({...value,homeSections:moved}).success).toBe(true);
  expect(value.homeSections).toEqual(snapshot);
 });
 it('向后跨区块插入保持所有区块，往返拖动能恢复原顺序',()=>{
  const value=settingsInput.parse(base),sections=value.homeSections;
  const moved=reorderSections([...sections].reverse(),'hero','videos',true);
  expect(moved.map(s=>s.id)).toEqual(['promo','categories','videos','hero','tutorials','notice']);
  expect(reorderSections(moved,'hero','promo')).toEqual(sections);
 });
 it('同一区块拖放不会修改其配置',()=>{
  const {homeSections}=settingsInput.parse(base);
  expect(reorderSections(homeSections,'hero','hero')).toEqual(homeSections);
 });
});
