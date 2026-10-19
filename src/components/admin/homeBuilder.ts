import type { Settings } from '../../lib/schema';
export type SectionId = Settings['homeSections'][number]['id'];
export const sectionNames: Record<SectionId,string> = {hero:'主视觉与新手引导',promo:'推荐横幅',categories:'分类导航',videos:'最新视频',tutorials:'图文教程',notice:'公告'};
/** Insert around a target; every section and enabled flag survives exactly once. */
export function reorderSections(sections: Settings['homeSections'], source: SectionId, target: SectionId, after=false): Settings['homeSections'] {
  const sorted=[...sections].sort((a,b)=>a.order-b.order);
  if(source===target) return sorted;
  const item=sorted.find(section=>section.id===source);
  if(!item||!sorted.some(section=>section.id===target)) return sorted;
  const rest=sorted.filter(section=>section.id!==source);
  rest.splice(rest.findIndex(section=>section.id===target)+(after?1:0),0,item);
  return rest.map((section,order)=>({...section,order}));
}
