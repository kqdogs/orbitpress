import { z } from 'zod';
import {categoryIconValues} from './category-icons';
const reserved = new Set(['admin','api','media','images','videos','tutorials','category','about','search','tags','sitemap','robots']);
export const slugSchema = z.string().min(1).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).refine(v => !reserved.has(v),'该路径被系统保留');
export const coverSchema = z.string().max(240).refine(v=>v==='' || /^\/(?:media|images)\/[a-zA-Z0-9._-]+$/.test(v),'封面必须使用本站媒体路径');
export const articleHighlightsInput = z.array(z.string().trim().min(1).max(40)).max(6);
export const resourceUrl = z.string().trim().max(2000).refine(value => {
 try { const url=new URL(value); return url.protocol==='https:'&&!url.username&&!url.password&&!/[\u0000-\u0020\u007f\\]/.test(value); } catch { return false; }
}, '请填写不含登录凭据的 HTTPS 链接');
export const articleResourcesInput = z.object({
 title:z.string().trim().min(1).max(80),
 items:z.array(z.object({label:z.string().trim().min(1).max(100),url:resourceUrl,code:z.string().trim().max(100)}).strict()).max(12),
 descriptionUrl:z.union([z.literal(''),resourceUrl])
}).strict();
export const emptyArticleResources = {title:'本期视频提到的链接',items:[],descriptionUrl:''};
export const postInput = z.object({
 title:z.string().trim().min(1).max(180),slug:slugSchema,excerpt:z.string().max(500),body:z.string().max(100000),
 categoryId:z.string().max(80).default('').describe('分类ID；省略或空字符串表示不分配分类'),cover:coverSchema,videoId:z.string().regex(/^(?:[A-Za-z0-9_-]{11})?$/),
 featured:z.boolean(),tags:z.array(z.string().trim().min(1).max(30)).max(8),highlights:articleHighlightsInput.optional(),resources:articleResourcesInput.optional()
}).strict();
export const postUpdate = postInput.extend({version:z.number().int().positive()});
export const pageInput = z.object({
 title:z.string().trim().min(1).max(180),slug:slugSchema,excerpt:z.string().max(500),body:z.string().max(100000),menuLabel:z.string().trim().max(60)
}).strict();
export const pageUpdate = pageInput.extend({version:z.number().int().positive()});
export const contentPreviewInput = pageInput.pick({title:true,excerpt:true,body:true}).extend({title:z.string().trim().max(180),pageId:z.string().min(1).max(80).optional()}).strict();
export const versionInput = z.object({version:z.number().int().positive()}).strict();
export const categoryInput = z.object({name:z.string().trim().min(1).max(40),slug:slugSchema,description:z.string().max(300),icon:z.enum(categoryIconValues)}).strict();
export const scopes = ['content:read','content:write','content:publish'] as const;
export const keyInput = z.object({name:z.string().trim().min(1).max(60),scopes:z.array(z.enum(scopes)).min(1).max(3),days:z.number().int().min(1).max(365)}).strict();
const externalUrl = z.union([z.literal(''),z.url().max(300).refine(v=>v.startsWith('https://'),'仅允许 HTTPS')]);
export const siteAssetSchema = z.string().max(240).refine(v=>v==='' || /^\/(?:media|images)\/[a-zA-Z0-9._-]+$/.test(v),'标识图片必须使用本站媒体路径');
export const navigationHref = z.string().trim().min(1).max(180).refine(value => {
 if (/[\u0000-\u0020\u007f\\]/.test(value)) return false;
 if (value.startsWith('/') && !value.startsWith('//')) return true;
 try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password; } catch { return false; }
}, '导航仅支持本站路径（/ 开头）或 HTTPS 链接');
export const headerNavItem = z.object({label:z.string().trim().min(1).max(30),href:navigationHref,badge:z.string().trim().max(10).optional(),accent:z.boolean().optional()}).strict();
export const footerNavItem = headerNavItem.pick({label:true,href:true});
export const communityCardInput = z.object({
 enabled:z.boolean(),title:z.string().trim().min(1).max(120),description:z.string().max(180),
 icon:z.enum(['telegram',...categoryIconValues]),buttonLabel:z.string().trim().min(1).max(20),href:navigationHref
}).strict();
export const layoutBlockType = z.enum(['content','heading','markdown','image','button','notice','author','toc','categories','latest','search','links','divider','home-hero','home-promo','home-categories','home-videos','home-tutorials','home-notice']);
export const layoutBlockInput = z.object({
 id:z.string().regex(/^[a-z][a-z0-9-]{0,59}$/),type:layoutBlockType,
 title:z.string().trim().max(80).default(''),text:z.string().max(6000).default(''),
 href:navigationHref.default('/'),image:siteAssetSchema.default(''),alt:z.string().max(160).default(''),
 limit:z.number().int().min(1).max(8).default(5),level:z.union([z.literal(2),z.literal(3)]).default(2),
 links:z.array(z.object({label:z.string().trim().min(1).max(60),href:navigationHref}).strict()).max(8).default([]),
 enabled:z.boolean().default(true)
}).strict();
const layoutShape = z.object({
 sidebar:z.enum(['none','left','right','both']).default('right'),
 width:z.enum(['standard','wide']).default('standard'),
 main:z.array(layoutBlockInput).max(12),left:z.array(layoutBlockInput).max(8).default([]),right:z.array(layoutBlockInput).max(8).default([])
}).strict();
function validateLayout(layout:z.infer<typeof layoutShape>,ctx:z.RefinementCtx,home=false){
 const blocks=[...layout.main,...layout.left,...layout.right];
 if(home?blocks.some(block=>block.type==='content'):layout.main.filter(block=>block.type==='content').length!==1||layout.main.some(block=>block.type==='content'&&!block.enabled)||[...layout.left,...layout.right].some(block=>block.type==='content'))ctx.addIssue({code:'custom',message:home?'首页使用组件组合，不支持页面正文组件':'正文区必须保留一个可见的正文组件，侧栏不能包含正文'});
 if(new Set(blocks.map(block=>block.id)).size!==blocks.length)ctx.addIssue({code:'custom',message:'组件标识不能重复'});
}
export const pageLayoutInput = layoutShape.superRefine((layout,ctx)=>validateLayout(layout,ctx));
export const homeLayoutInput = layoutShape.superRefine((layout,ctx)=>validateLayout(layout,ctx,true));
export const pageLayoutsInput = z.record(z.string().regex(/^(?:home|article|about|default|page:[a-zA-Z0-9-]{1,80})$/),layoutShape)
 .superRefine((layouts,ctx)=>{for(const [key,layout] of Object.entries(layouts)){
  const result=(key==='home'?homeLayoutInput:pageLayoutInput).safeParse(layout);
  if(!result.success)for(const issue of result.error.issues)ctx.addIssue({...issue,path:[key,...issue.path]});
 }})
 .refine(value=>Object.keys(value).length<=100,'最多保存 100 个页面布局')
 .refine(value=>new TextEncoder().encode(JSON.stringify(value)).length<=48000,'页面布局总内容超过 48KB，请将长文放入页面正文');
export type LayoutBlock = z.infer<typeof layoutBlockInput>;
export type PageLayout = z.infer<typeof pageLayoutInput>;
export type LayoutRegion = 'main'|'left'|'right';
export function navigationCategorySlug(href:string):string|null {
 if(!href.startsWith('/'))return null;
 try{return decodeURIComponent(new URL(href,'https://site.invalid').pathname).match(/^\/category\/([^/]+)\/?$/)?.[1]||null;}catch{return null;}
}
export const permalinkFormat = z.enum(['postname','post','category','day','month','numeric','plain','custom']);
const reservedPrefixes = new Set(['admin','api','media','images','videos','tutorials','category','about','sitemap.xml','robots.txt']);
export const permalinkCustomInput = z.string().trim().max(180).refine(value => {
 if(value==='/?p=%post_id%')return true;
 if (!value.startsWith('/') || value.startsWith('//') || /[\\?#\s]/.test(value)) return false;
 const tokens=value.match(/%[^%]+%/g)||[];
 const names=tokens.filter(token=>token==='%postname%').length,ids=tokens.filter(token=>token==='%post_id%').length;
 if((names!==1&&ids!==1)||names>1||ids>1 || tokens.some(token=>!['%postname%','%category%','%year%','%monthnum%','%day%','%post_id%'].includes(token)))return false;
 const literal=value.replace(/%[^%]+%/g,'entry');
 return /^\/(?:[a-z0-9_-]+\/)*[a-z0-9_.-]+\/?$/.test(literal) && !literal.split('/').some(segment=>segment==='.'||segment==='..') && !reservedPrefixes.has(literal.split('/')[1]);
}, '使用本站路径，须包含一次 %postname% 或 %post_id%；支持 %category%、%year%、%monthnum%、%day%，不可覆盖管理或系统路径');
export const homeSectionId = z.enum(['hero','promo','categories','videos','tutorials','notice']);
export const homeSection = z.object({id:homeSectionId,enabled:z.boolean(),order:z.number().int().min(0).max(20),title:z.string().trim().max(80),subtitle:z.string().trim().max(180)}).strict();
export const homeHero = z.object({eyebrow:z.string().trim().max(40),title:z.string().trim().max(100),description:z.string().trim().max(180)}).strict();
export const homeOptions = z.object({featuredPostId:z.string().max(80).default(''),columns:z.union([z.literal(2),z.literal(3),z.literal(4)]).default(4),videoLimit:z.number().int().min(1).max(12).default(8),tutorialLimit:z.number().int().min(1).max(12).default(3),categoryIds:z.array(z.string().min(1).max(80)).max(12).default([]),promoHref:navigationHref.default('/tutorials/'),steps:z.array(z.object({title:z.string().trim().min(1).max(60),description:z.string().max(120),href:navigationHref}).strict()).max(8).default([])}).strict();
const defaultHomeHero = { eyebrow:'最新视频 · 视频 + 图文', title:'', description:'视频讲解 + 图文步骤，跟着操作更轻松' };
const defaultHomeSections: Array<z.infer<typeof homeSection>> = [
  {id:'hero',enabled:true,order:0,title:'',subtitle:''},{id:'promo',enabled:true,order:1,title:'选卡不踩坑，一站了解全球虚拟卡',subtitle:'开卡费用、支持场景、使用体验，帮你找到适合自己的卡。'},
  {id:'categories',enabled:true,order:2,title:'按需求找教程',subtitle:'选你现在要办的事'},{id:'videos',enabled:true,order:3,title:'最新视频',subtitle:'视频讲解 + 图文步骤，跟着操作更轻松'},
  {id:'tutorials',enabled:true,order:4,title:'图文教程',subtitle:'一步一图，照着做就行'},{id:'notice',enabled:true,order:5,title:'',subtitle:''}
];
const articleDesign = z.object({
  showToc:z.boolean().default(true), showTags:z.boolean().default(true), showAuthor:z.boolean().default(true), showResources:z.boolean().default(true),
  bannerEyebrow:z.string().trim().max(40).default('详细图文教程'), resourcesTitle:z.string().trim().max(60).default('实用资源'), resourcesDescription:z.string().max(180).default('查看同一分类的更多教程，发现适合自己的工具。'),
  fontSize:z.number().int().min(14).max(18).default(15)
}).strict();
const aboutDesign = z.object({
  eyebrow:z.string().trim().max(40).default('ABOUT'), title:z.string().trim().min(1).max(80).default('关于'), lead:z.string().max(180).default(''), body:z.string().max(20000).default(''),
  layout:z.enum(['banner','simple']).default('banner'), showBackButton:z.boolean().default(false), buttonLabel:z.string().trim().min(1).max(40).default('返回首页'), buttonHref:navigationHref.default('/')
}).strict();
export const adminPathInput = z.string().regex(/^\/[a-z0-9]+(?:-[a-z0-9]+)*$/).max(80).refine(value=>value==='/admin'||!reserved.has(value.slice(1)), '该路径被系统保留');
export const settingsInput = z.object({
 adminPath:adminPathInput.default('/admin'),
 communityCard:communityCardInput.nullable().default(null),
 title:z.string().trim().min(1).max(80),tagline:z.string().max(120),description:z.string().max(300),logo:siteAssetSchema,socialFollowText:z.string().trim().min(1).max(80),headerNav:z.array(headerNavItem).max(12),footerCopyright:z.string().trim().max(300).default(''),footerNav:z.array(footerNavItem).max(12).nullable().default(null),youtube:externalUrl,telegram:externalUrl,bilibili:externalUrl,twitter:externalUrl,notice:z.string().max(180),
 permalinkFormats:z.array(permalinkFormat).min(1).max(8).refine(values=>new Set(values).size===values.length,'格式不能重复').default(['postname']),permalinkCustom:permalinkCustomInput.default('/%postname%/'),homeHero:homeHero.default(defaultHomeHero),homeSections:z.array(homeSection).length(6).refine(values=>new Set(values.map(value=>value.id)).size===6&&new Set(values.map(value=>value.order)).size===6,'六个区块及排序不能重复').default(defaultHomeSections),homeOptions:homeOptions.prefault({}),articleDesign:articleDesign.prefault({}),aboutDesign:aboutDesign.prefault({}),pageLayouts:pageLayoutsInput.default({})
}).strict();
// New optional settings stay absent on old clients instead of overwriting saved designs.
export const settingsUpdateInput = settingsInput.extend({communityCard:settingsInput.shape.communityCard.unwrap().optional(),adminPath:settingsInput.shape.adminPath.unwrap().optional(),version:z.number().int().positive(),footerCopyright:settingsInput.shape.footerCopyright.unwrap().optional(),footerNav:settingsInput.shape.footerNav.unwrap().optional(),permalinkFormats:settingsInput.shape.permalinkFormats.unwrap().optional(),permalinkCustom:settingsInput.shape.permalinkCustom.unwrap().optional(),homeHero:settingsInput.shape.homeHero.unwrap().optional(),homeSections:settingsInput.shape.homeSections.unwrap().optional(),homeOptions:settingsInput.shape.homeOptions.unwrap().optional(),articleDesign:settingsInput.shape.articleDesign.unwrap().optional(),aboutDesign:settingsInput.shape.aboutDesign.unwrap().optional(),pageLayouts:settingsInput.shape.pageLayouts.unwrap().optional()});
export const pagePreviewInput = z.object({page:z.enum(['home','article','about','page']),settings:settingsInput,postId:z.string().min(1).max(80).optional(),pageId:z.string().min(1).max(80).optional(),builder:z.boolean().default(false)}).strict();
export type PostInput = z.infer<typeof postInput>;
export type Post = PostInput & {id:string;status:'draft'|'published'|'trash';publishedAt:string|null;createdAt:string;updatedAt:string;version:number;categoryName?:string;categorySlug?:string};
export type PageInput = z.infer<typeof pageInput>;
export type Page = PageInput & {id:string;status:'draft'|'published'|'trash';publishedAt:string|null;createdAt:string;updatedAt:string;version:number};
export type Category = z.infer<typeof categoryInput> & {id:string;version:number;count:number;deletedAt:string|null};
export type Settings = z.infer<typeof settingsInput>;
export function configuredCategorySlugs(settings:Settings){
 const blocks=Object.values(settings.pageLayouts).flatMap(layout=>[...layout.main,...layout.left,...layout.right]);
 const links=[...settings.headerNav.map(item=>item.href),...(settings.footerNav||[]).map(item=>item.href),...(settings.communityCard?[settings.communityCard.href]:[]),settings.homeOptions.promoHref,...settings.homeOptions.steps.map(step=>step.href),...blocks.filter(block=>block.type==='button').map(block=>block.href),...blocks.filter(block=>block.type==='links').flatMap(block=>block.links.map(link=>link.href))];
 return [...new Set(links.map(navigationCategorySlug).filter((slug):slug is string=>!!slug))];
}

// Preview accepts unsaved content without requiring a publishing path or writing it.
export const articlePreviewInput = postInput.pick({title:true,excerpt:true,body:true,categoryId:true,cover:true,videoId:true,tags:true,highlights:true,resources:true}).extend({
 title:z.string().trim().max(180),categoryId:z.string().max(80),publishedAt:z.iso.datetime().nullable().optional()
}).strict();
