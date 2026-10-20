import { z } from 'zod';
import { categoryInput, pageInput, postInput, settingsInput } from '../../lib/schema';
import {importResponse} from '../../lib/import-contract';

export class RequestError extends Error {
  constructor(message: string, public status: number) { super(message); }
}
type Options = { method?: string; body?: unknown; csrf?: string; signal?: AbortSignal; idempotent?: boolean };
const envelope = z.object({ data: z.unknown().optional(), error: z.object({ message: z.string().optional() }).optional() });
const postResponse = postInput.extend({ id: z.string(), status: z.enum(['draft', 'published', 'trash']), publishedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(), version: z.number().int().positive(), categoryName: z.string().optional(), categorySlug: z.string().optional() });
const pageResponse = pageInput.extend({ id: z.string(), status: z.enum(['draft', 'published', 'trash']), publishedAt: z.string().nullable(), createdAt: z.string(), updatedAt: z.string(), version: z.number().int().positive() });
const categoryResponse = categoryInput.extend({ id: z.string(), version: z.number().int().positive(), count: z.number(), deletedAt: z.string().nullable() });
const sessionResponse = z.object({ csrf: z.string().min(1), username: z.string() });
const mediaResponse = z.object({ id: z.string(), name: z.string(), mime: z.string(), size: z.number(), createdAt: z.string() });
const keyResponse = z.object({ id: z.string(), name: z.string(), scopes: z.string(), createdAt: z.string(), expiresAt: z.number(), revokedAt: z.string().nullable(), canReveal: z.boolean().default(false) });
const auditResponse = z.object({ id: z.string(), actor: z.string(), action: z.string(), resourceId: z.string(), createdAt: z.string() });
function responseSchema(path: string, method: string) {
  const pathname = path.split('?')[0];
  if (pathname === '/api/auth/session' || pathname === '/api/auth/login') return sessionResponse;
  if (pathname === '/api/auth/logout' || pathname === '/api/auth/password') return z.object({ ok: z.boolean() });
  const [, , , resource, id, action] = pathname.split('/');
  if ((resource === 'posts' || resource === 'pages') && method === 'DELETE') return z.object({ok:z.literal(true),id:z.string()});
  if (resource === 'posts') return method === 'GET' && !id ? z.object({ items: z.array(postResponse), nextCursor: z.string().nullable() }) : postResponse;
  if (resource === 'pages') return method === 'GET' && !id ? z.array(pageResponse) : pageResponse;
  if (resource === 'categories' && action === 'purge') return z.object({ok:z.literal(true),id:z.string()});
  if (resource === 'categories') return method === 'GET' ? z.array(categoryResponse) : z.object({ id: z.string() });
  if (resource === 'tags' && method === 'GET' && !id) return z.array(z.object({ name: z.string().min(1).max(30), count: z.number().int().positive() })).max(100);
  if (resource === 'settings') return z.object({ value: settingsInput, version: z.number().int().positive() });
  if (resource === 'imports' && method === 'POST') return importResponse;
  if (resource === 'media') return method === 'GET' ? z.array(mediaResponse) : z.object({ id: z.string(), url: z.string() });
  if (resource === 'keys') return method === 'GET' ? z.array(keyResponse) : action === 'revoke' ? z.object({ ok: z.boolean() }) : z.object({ id: z.string(), token: z.string() });
  if (resource === 'audit') return z.array(auditResponse);
  throw new Error('未注册的后台响应契约');
}

/** Bounded requests, CSRF, cancellation and no implicit write retries. */
export async function request<T>(path: string, options: Options = {}): Promise<T> {
  const controller = new AbortController();
  const abort = () => controller.abort();
  options.signal?.addEventListener('abort', abort, { once: true });
  if (options.signal?.aborted) controller.abort();
  const timer = setTimeout(abort, 30000);
  const headers: Record<string, string> = {};
  if (options.body !== undefined && !(options.body instanceof FormData)) headers['Content-Type'] = 'application/json';
  if (options.csrf) headers['X-CSRF-Token'] = options.csrf;
  if (options.idempotent) headers['Idempotency-Key'] = crypto.randomUUID();
  try {
    const response = await fetch(path, {
      method: options.method || 'GET', headers, credentials: 'same-origin', signal: controller.signal,
      body: options.body === undefined ? undefined : options.body instanceof FormData ? options.body : JSON.stringify(options.body),
    });
    const result = envelope.safeParse(await response.json().catch(() => null));
    if (!result.success) throw new RequestError('服务器响应异常，请稍后重试', response.status);
    if (!response.ok) throw new RequestError(result.data.error?.message || '操作失败', response.status);
    const data = responseSchema(path, options.method || 'GET').safeParse(result.data.data);
    if (!data.success) throw new RequestError('响应数据格式有误，请刷新重试', response.status);
    return data.data as T;
  } catch (error) {
    if (controller.signal.aborted && !options.signal?.aborted) throw new Error('请求超时，请刷新确认结果后再操作');
    throw error;
  } finally { clearTimeout(timer); options.signal?.removeEventListener('abort', abort); }
}

export async function requestPreview(body: unknown, csrf: string, signal: AbortSignal, path: '/admin/preview' | '/admin/home-preview' | '/admin/page-preview' | '/admin/content-preview' = '/admin/preview') {
  const response = await fetch(path, { method: 'POST', credentials: 'same-origin', signal,
    headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrf }, body: JSON.stringify(body) });
  if (!response.ok) {
    const result = envelope.safeParse(await response.json().catch(() => null));
    throw new RequestError(result.success ? result.data.error?.message || '预览生成失败' : '预览生成失败', response.status);
  }
  return response.text();
}
