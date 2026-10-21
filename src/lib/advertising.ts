import { z } from 'zod';

export const adPlacements = ['home', 'articleTop', 'articleBottom', 'sidebar'] as const;
export type AdPlacement = typeof adPlacements[number];
const publisher = z.string().trim().regex(/^(?:ca-pub-\d{16})?$/, '发布商 ID 格式应为 ca-pub- 加 16 位数字');
const slot = z.string().trim().regex(/^(?:\d{10})?$/, '广告位 ID 应为 10 位数字');
export const advertisingInput = z.object({
  enabled: z.boolean().default(false),
  clientId: publisher.default(''),
  slots: z.object({ home: slot.default(''), articleTop: slot.default(''), articleBottom: slot.default(''), sidebar: slot.default('') }).strict().prefault({}),
  consentReady: z.boolean().default(false),
  privacyContact: z.union([z.literal(''), z.email().max(180)]).default(''),
  privacyPolicy: z.string().max(20000).default(''),
}).strict().superRefine((value, ctx) => {
  if (value.enabled && !value.clientId) ctx.addIssue({ code: 'custom', path: ['clientId'], message: '启用广告前请填写发布商 ID' });
  if (value.enabled && !value.consentReady) ctx.addIssue({ code: 'custom', path: ['consentReady'], message: '启用广告前请确认已完成适用地区的 Google CMP 与隐私设置' });
});
export type Advertising = z.infer<typeof advertisingInput>;

export function adsAllowed(config: Advertising, request: Request, status = 200, preview = false): boolean {
  const url = new URL(request.url);
  return config.enabled && config.consentReady && /^ca-pub-\d{16}$/.test(config.clientId)
    && !preview && request.method === 'GET' && status >= 200 && status < 300
    && !/^\/(?:admin|api|privacy)(?:\/|$)/.test(url.pathname)
    && !url.searchParams.has('s') && !url.searchParams.has('tag');
}

export function adsTxtResponse(config: Advertising): Response {
  const id = publisher.safeParse(config.clientId);
  const present = id.success && id.data !== '';
  return new Response(present ? `google.com, ${id.data.slice(3)}, DIRECT, f08c47fec0942fa0\n` : '# No AdSense publisher configured.\n', {
    status: present ? 200 : 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'public, max-age=300' },
  });
}
