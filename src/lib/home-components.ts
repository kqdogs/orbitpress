import type { Category, LayoutBlock, Post, Settings } from './schema';
import { categories, featuredPost, getPost, listPosts, videoCount } from './repository';

export interface HomeComponentData {categories:Category[];hero:Post|null;videos:Post[];totalVideos:number;tutorials:Post[]}
export interface HomeComponentProps {settings:Settings;block:LayoutBlock;data:HomeComponentData}

/** Share homepage data across all instances; do not query once per block. */
export async function loadHomeComponentData(db:D1Database,settings:Settings,types:Set<string>):Promise<HomeComponentData>{
 const config=settings.homeOptions,needsHero=types.has('home-hero'),needsVideos=types.has('home-videos');
 const [cats,videos,totalVideos,selected,tutorials,latest]=await Promise.all([
  types.has('home-categories')?categories(db):Promise.resolve([] as Category[]),
  needsHero||needsVideos?listPosts(db,{kind:'video',limit:config.videoLimit}).then(result=>result.items):Promise.resolve([] as Post[]),
  needsVideos?videoCount(db):Promise.resolve(0),
  needsHero?(config.featuredPostId?getPost(db,config.featuredPostId,false,true):featuredPost(db)):Promise.resolve(null),
  types.has('home-tutorials')?listPosts(db,{kind:'text',limit:config.tutorialLimit}).then(result=>result.items):Promise.resolve([] as Post[]),
  needsHero?listPosts(db,{limit:1}).then(result=>result.items[0]||null):Promise.resolve(null),
 ]);
 const order=['virtual-cards','banking','esim-phones','brokerage','apple-us-id','ai-tools'];
 const visibleCats=config.categoryIds.length?config.categoryIds.map(id=>cats.find(cat=>cat.id===id)):order.map(slug=>cats.find(cat=>cat.slug===slug));
 return {categories:visibleCats.filter((cat):cat is Category=>!!cat),hero:selected||videos[0]||latest,videos,totalVideos,tutorials};
}
