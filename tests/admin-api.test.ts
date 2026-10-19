import { afterEach, describe, expect, it, vi } from 'vitest';
import { request, requestPreview } from '../src/components/admin/api';
import { adminViewUrl, parseAdminView, parseEditorId, parsePageId, persistentViews } from '../src/components/admin/adminRoute';

afterEach(() => vi.unstubAllGlobals());
describe('后台统一请求客户端', () => {
  it('常用标签接入后台响应校验，保留名称与使用篇数并拒绝非法响应', async () => {
    const rows = [{ name: 'Maya', count: 2 }, { name: '银行账户', count: 1 }];
    vi.stubGlobal('fetch', vi.fn()
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: rows })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [] })))
      .mockResolvedValueOnce(new Response(JSON.stringify({ data: [{ name: 'Maya', count: -1 }] }))));
    expect(await request('/api/admin/tags')).toEqual(rows);
    expect(await request('/api/admin/tags')).toEqual([]);
    await expect(request('/api/admin/tags')).rejects.toThrow('响应数据格式有误');
  });
  it('后台页面路由写入 URL，刷新可恢复', () => {
    expect(parseAdminView('?view=footer')).toBe('footer');
    expect(parseAdminView('?view=integrations')).toBe('integrations');
    expect(parseAdminView('?view=editor')).toBe('editor');
    expect(parseAdminView('?view=unknown')).toBe('dashboard');
    expect(adminViewUrl('footer', 'http://localhost/admin')).toBe('/admin?view=footer');
    expect(adminViewUrl('dashboard', 'http://localhost/admin?view=footer')).toBe('/admin');
    expect(adminViewUrl('editor', 'http://localhost/admin?view=footer', 'article-1')).toBe('/admin?view=editor&post=article-1');
    for (const view of persistentViews) expect(parseAdminView(new URL(adminViewUrl(view), 'http://localhost').search)).toBe(view);
  });
  it('编辑文章的编号随 URL 恢复，退出编辑清除旧编号', () => {
    expect(parseEditorId('?view=editor&post=article-1')).toBe('article-1');
    expect(parseEditorId('?post=..%2Fapi')).toBe('');
    expect(adminViewUrl('posts', '/admin?view=editor&post=article-1')).toBe('/admin?view=posts');
    expect(adminViewUrl('editor', '/admin?view=editor&post=article-1')).toBe('/admin?view=editor');
  });
  it('页面编辑路由保留页面编号并清理文章编号', () => {
    expect(parsePageId('?view=page-editor&page=about-tools')).toBe('about-tools');
    expect(parsePageId('?page=../api')).toBe('');
    expect(adminViewUrl('page-editor', '/admin?view=editor&post=article-1', 'about-tools')).toBe('/admin?view=page-editor&page=about-tools');
  });
  it('首页预览仅用带 CSRF 的 POST，HTML 不走数据写入接口',async()=>{
    const fetchMock=vi.fn().mockResolvedValue(new Response('<html>预览</html>'));
    vi.stubGlobal('fetch',fetchMock);
    const controller=new AbortController();
    expect(await requestPreview({title:'未保存'},'test-csrf',controller.signal,'/admin/home-preview')).toBe('<html>预览</html>');
    expect(fetchMock).toHaveBeenCalledWith('/admin/home-preview',expect.objectContaining({method:'POST',credentials:'same-origin',signal:controller.signal,headers:expect.objectContaining({'X-CSRF-Token':'test-csrf'})}));
  });
  it('文章预览保留默认路由，错误返回明确提示',async()=>{
    const fetchMock=vi.fn().mockResolvedValue(new Response(JSON.stringify({error:{message:'登录已过期'}}),{status:401}));
    vi.stubGlobal('fetch',fetchMock);
    await expect(requestPreview({},'csrf',new AbortController().signal)).rejects.toThrow('登录已过期');
    expect(fetchMock.mock.calls[0][0]).toBe('/admin/preview');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('发送 CSRF 与幂等键，保留 DELETE 的版本请求体', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: { id: 'category-test' } })));
    vi.stubGlobal('fetch', fetchMock);
    expect(await request('/api/admin/categories/category-test', { method: 'DELETE', csrf: 'test-csrf', idempotent: true, body: { version: 2 } })).toEqual({ id: 'category-test' });
    const options = fetchMock.mock.calls[0][1];
    expect(options.headers['X-CSRF-Token']).toBe('test-csrf');
    expect(options.headers['Idempotency-Key']).toMatch(/^[a-f0-9-]{36}$/);
    expect(options.body).toBe('{"version":2}');
    expect(options.credentials).toBe('same-origin');
  });
  it('对 HTTP 错误保留服务端提示且不自动重试写入', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response(JSON.stringify({ error: { message: '版本已变化' } }), { status: 409 }));
    vi.stubGlobal('fetch', fetchMock);
    await expect(request('/api/admin/settings', { method: 'PUT', body: {} })).rejects.toThrow('版本已变化');
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
  it('拒绝错误响应体和非法会话字段', async () => {
    const fetchMock = vi.fn().mockResolvedValueOnce(new Response('not json')).mockResolvedValueOnce(new Response(JSON.stringify({ data: { csrf: null, username: 'admin' } })));
    vi.stubGlobal('fetch', fetchMock);
    await expect(request('/api/auth/session')).rejects.toThrow('服务器响应异常');
    await expect(request('/api/auth/session')).rejects.toThrow('响应数据格式有误');
  });
  it('查询参数不影响响应契约，删除标记不会被剥除', async () => {
    const category = { id: 'test', name: '测试', slug: 'test', description: '', icon: 'globe', version: 2, count: 0, deletedAt: '2026-10-19T00:00:00Z' };
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response(JSON.stringify({ data: [category] }))));
    expect(await request('/api/admin/categories?includeTrash=1')).toEqual([category]);
  });
  it('调用方取消信号会传给 fetch', async () => {
    const controller = new AbortController(); controller.abort();
    vi.stubGlobal('fetch', vi.fn().mockImplementation((_path, options) => {
      expect(options.signal.aborted).toBe(true);
      return Promise.reject(new DOMException('Aborted', 'AbortError'));
    }));
    await expect(request('/api/auth/session', { signal: controller.signal })).rejects.toMatchObject({ name: 'AbortError' });
  });
});
