import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import {mediaResponse} from '../../lib/media-response';
export const GET:APIRoute=({params,request})=>mediaResponse(env.MEDIA,params.id||'',request);
