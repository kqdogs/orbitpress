import {z} from 'zod';
import {postInput} from './schema';
export const importRequest=z.object({url:z.string().trim().max(2000)}).strict();
export const importResponse=z.object({
 article:postInput.omit({categoryId:true}),sourceUrl:z.url(),warnings:z.array(z.string()).max(30)
}).strict();
export type ImportedArticle=z.infer<typeof importResponse>;
export const discoverRequest=importRequest.extend({page:z.number().int().min(1).max(100).default(1)});
export const discoverResponse=z.object({items:z.array(z.object({url:z.url(),title:z.string().min(1).max(300)}).strict()).max(20),nextPage:z.number().int().min(2).max(100).nullable()}).strict();
export type DiscoveredArticles=z.infer<typeof discoverResponse>;
