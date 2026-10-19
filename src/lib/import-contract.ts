import {z} from 'zod';
import {postInput} from './schema';
export const importRequest=z.object({url:z.string().trim().max(2000)}).strict();
export const importResponse=z.object({
 article:postInput.omit({categoryId:true}),sourceUrl:z.url(),warnings:z.array(z.string()).max(30)
}).strict();
export type ImportedArticle=z.infer<typeof importResponse>;
