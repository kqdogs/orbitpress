import { layoutBlockInput, pageLayoutInput, homeLayoutInput, type LayoutBlock, type LayoutRegion, type PageLayout, type Settings } from './schema';

export const layoutBlockCatalog: {type:LayoutBlock['type'];name:string;description:string}[] = [
 {type:'home-hero',name:'主视觉与新手引导',description:'推荐文章、新手步骤与交流群'},
 {type:'home-promo',name:'推荐横幅',description:'首页推荐入口与引导文案'},
 {type:'home-categories',name:'分类导航',description:'首页样式的分类卡片'},
 {type:'home-videos',name:'最新视频',description:'首页样式的视频卡片列表'},
 {type:'home-tutorials',name:'图文教程',description:'首页样式的图文教程卡片'},
 {type:'home-notice',name:'站点公告',description:'首页样式的公告横条'},
 {type:'heading',name:'标题',description:'正文中的二级或三级标题'},
 {type:'markdown',name:'Markdown 文本',description:'文字、列表、表格或视频嵌入'},
 {type:'image',name:'图片',description:'站点媒体库图片与说明'},
 {type:'button',name:'按钮',description:'引导读者访问指定链接'},
 {type:'notice',name:'提示公告',description:'醒目的提示与说明'},
 {type:'author',name:'作者介绍',description:'站点标识、名称和介绍'},
 {type:'toc',name:'正文目录',description:'自动读取正文的标题'},
 {type:'categories',name:'分类目录',description:'分类与文章数量'},
 {type:'latest',name:'最新文章',description:'自动展示最近发布的内容'},
 {type:'search',name:'站内搜索',description:'搜索本站文章'},
 {type:'links',name:'快捷链接',description:'一组可编辑的常用链接'},
 {type:'divider',name:'分隔线',description:'区分内容区域'},
 {type:'ad',name:'Google 广告',description:'使用广告设置中的组件广告位，预览不请求广告'},
];
export const regionNames:Record<LayoutRegion,string>={main:'正文区域',left:'左侧栏',right:'右侧栏'};
export function blockName(block:LayoutBlock){return block.title||(block.type==='content'?'页面正文':layoutBlockCatalog.find(item=>item.type===block.type)?.name)||'组件';}
export function createBlock(type:LayoutBlock['type'],id:string):LayoutBlock {
 const title=layoutBlockCatalog.find(item=>item.type===type)?.name||'';
 return layoutBlockInput.parse({id,type,title:type==='content'?'':title,
  text:type==='notice'?'这里填写你的提示内容。':type==='markdown'?'在这里添加文字、列表或视频。':'',
  href:'/tutorials/',links:type==='links'?[{label:'浏览教程',href:'/tutorials/'},{label:'关于本站',href:'/about/'}]:[]});
}
export function createPageLayout(sidebar:PageLayout['sidebar']='right'):PageLayout {
 return pageLayoutInput.parse({sidebar,main:[createBlock('content','page-content')],left:[],right:[createBlock('author','site-author'),createBlock('latest','latest-posts'),createBlock('search','site-search')]});
}
/** Adapt legacy homepage settings without mutating or writing them. */
export function createHomeLayout(settings:Pick<Settings,'homeSections'>):PageLayout {
 return homeLayoutInput.parse({sidebar:'none',main:[...settings.homeSections].sort((a,b)=>a.order-b.order).map(section=>({
  ...createBlock(`home-${section.id}`,`home-${section.id}`),title:section.title,text:section.subtitle,enabled:section.enabled,
 })),left:[],right:[]});
}
export function initialPageLayout(settings:Settings,key:string):PageLayout {
 return resolvePageLayout(settings,key)||(key==='home'?createHomeLayout(settings):createPageLayout());
}
export function resolvePageLayout(settings:Pick<Settings,'pageLayouts'>,key:string):PageLayout|undefined {
 return settings.pageLayouts[key]||(key.startsWith('page:')?settings.pageLayouts.default:undefined);
}
/** A pure move keeps hidden blocks and never mutates the caller's draft. */
export function moveLayoutBlock(layout:PageLayout,id:string,region:LayoutRegion,targetId?:string,after=false):PageLayout {
 const next=JSON.parse(JSON.stringify(layout)) as PageLayout,areas:LayoutRegion[]=['main','left','right'];
 const source=areas.find(area=>next[area].some(block=>block.id===id));
 if(!source||targetId===id)return next;
 const block=next[source].find(item=>item.id===id)!;
 if(block.type==='content'&&region!=='main')throw new Error('页面正文只能放在正文区域');
 if(source!==region&&next[region].length>=(region==='main'?12:8))throw new Error('该区域的组件数量已达上限');
 if(targetId&&!next[region].some(item=>item.id===targetId))return next;
 next[source]=next[source].filter(item=>item.id!==id);
 const index=targetId?next[region].findIndex(item=>item.id===targetId)+(after?1:0):next[region].length;
 next[region].splice(index,0,block);
 return next;
}
