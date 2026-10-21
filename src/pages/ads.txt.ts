import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { siteSettings } from '../lib/repository';
import { adsTxtResponse } from '../lib/advertising';

export const GET: APIRoute = async () => adsTxtResponse((await siteSettings(env.DB)).value.advertising);
