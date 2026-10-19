import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { Miniflare, convertV4MiniflareOptions } from 'miniflare';
import { readFileSync } from 'node:fs';
import { handleApi } from '../src/lib/api-controller';
import { adminCredential, changeAdminPassword, hashPassword } from '../src/lib/password-service';
import { passwordChangeInput } from '../src/lib/password-service-input';
import { session, sha256, verifyPassword } from '../src/lib/security';

// 独立的临时D1；绝不读取.dev.vars、本地管理员密码或实际数据库。
describe('管理员修改密码（隔离D1）', () => {
  let mf: Miniflare, db: D1Database, env: Env;
  const origin = 'http://localhost', initial = 'original-fixture-password', next = 'updated-fixture-password';
  const payload = { currentPassword: initial, newPassword: next, confirmPassword: next };
  beforeAll(async () => {
    mf = new Miniflare(convertV4MiniflareOptions({ modules: true, script: 'export default {fetch(){return new Response("test")}}', compatibilityDate: '2026-10-18', d1Databases: ['DB'] }));
    db = await mf.getD1Database('DB') as unknown as D1Database;
    await db.exec(readFileSync('migrations/0001_initial.sql','utf8').replace(/\r?\n/g,' '));
    // 迁移前会话必须保持可用（默认凭据版本0）。
    await db.prepare('INSERT INTO sessions VALUES(?,?,?)').bind(await sha256('legacy'), 'legacy-csrf', Math.floor(Date.now()/1000)+3600).run();
    await db.exec(readFileSync('migrations/0007_admin_credentials.sql','utf8').replace(/^--.*$/mg,'').replace(/\r?\n/g,' '));
    env = { DB: db, ADMIN_USERNAME: 'fixture', ADMIN_PASSWORD_HASH: await hashPassword(initial) } as Env;
    expect((await session(new Request(origin, {headers:{cookie:'session=legacy'}}),db)).id).toBe('admin');
  }, 30000);
  afterAll(async () => { await mf?.dispose(); });
  beforeEach(async () => {
    await db.batch(['DELETE FROM admin_credentials','DELETE FROM sessions','DELETE FROM rate_limits','DELETE FROM audit'].map(sql=>db.prepare(sql)));
  });
  async function login(password=initial) {
    const response=await handleApi(new Request(origin+'/api/auth/login',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({username:'fixture',password})}),env,'auth/login');
    const result=await response.json() as {data:{csrf:string}};
    return {cookie: response.headers.get('set-cookie')!.split(';')[0], csrf:result.data.csrf};
  }
  async function change(auth: {cookie:string;csrf:string}, body: unknown=payload, headers: Record<string,string>={}) {
    return handleApi(new Request(origin+'/api/auth/password',{method:'POST',headers:{origin,'content-type':'application/json',cookie:auth.cookie,'x-csrf-token':auth.csrf,...headers},body:JSON.stringify(body)}),env,'auth/password');
  }
  it('随机盐摘要兼容，公开输入拒绝短密码、未知字段、同密码和不匹配', async () => {
    const a=await hashPassword(next),b=await hashPassword(next);
    expect(a).not.toBe(b); expect(await verifyPassword(next,a)).toBe(true);
    for(const bad of [{...payload,newPassword:'short'}, {...payload,confirmPassword:'different-password'}, {...payload,newPassword:initial,confirmPassword:initial}, {...payload,role:'admin'}, {...payload,newPassword:'a'.repeat(201)}]) expect(passwordChangeInput.safeParse(bad).success).toBe(false);
  });
  it('默认admin/123456能登录并改密，改密后原密码和会话失效', async () => {
    const defaults = { ...env, ADMIN_USERNAME: 'admin', ADMIN_PASSWORD_HASH: await hashPassword('123456') };
    const request = (password: string) => handleApi(new Request(origin+'/api/auth/login', {
      method: 'POST', headers: { origin, 'content-type': 'application/json' },
      body: JSON.stringify({ username: 'admin', password }),
    }), defaults, 'auth/login');
    const response = await request('123456');
    expect(response.status).toBe(200);
    const cookie = response.headers.get('set-cookie')!.split(';')[0];
    const result = await response.json() as { data: { csrf: string } };
    const changed = await handleApi(new Request(origin+'/api/auth/password', {
      method: 'POST', headers: { origin, 'content-type': 'application/json', cookie, 'x-csrf-token': result.data.csrf },
      body: JSON.stringify({ currentPassword: '123456', newPassword: next, confirmPassword: next }),
    }), defaults, 'auth/password');
    expect(changed.status).toBe(200);
    await expect(request('123456')).rejects.toMatchObject({ status: 401 });
    await expect(session(new Request(origin, { headers: { cookie } }), db)).rejects.toMatchObject({ status: 401 });
    expect((await request(next)).status).toBe(200);
  });
  it('无管理会话或仅API key不能修改', async () => {
    await expect(change({cookie:'',csrf:''})).rejects.toMatchObject({status:401});
    await expect(change({cookie:'',csrf:''},payload,{authorization:'Bearer rf_'+'a'.repeat(64)})).rejects.toMatchObject({status:401});
  });
  it('同源/CSRF/原密码/请求契约失败均不修改凭据与会话', async () => {
    const auth=await login();
    await expect(change(auth,payload,{origin:'https://evil.example'})).rejects.toMatchObject({status:403,code:'ORIGIN'});
    await expect(change(auth,payload,{'x-csrf-token':''})).rejects.toMatchObject({status:403,code:'CSRF'});
    await expect(change(auth,{...payload,currentPassword:'wrong'})).rejects.toMatchObject({status:403,code:'PASSWORD_INCORRECT'});
    await expect(change(auth,{...payload,confirmPassword:'mismatched-password'})).rejects.toMatchObject({status:400});
    expect((await adminCredential(db,env.ADMIN_PASSWORD_HASH)).version).toBe(0);
    expect((await session(new Request(origin,{headers:{cookie:auth.cookie}}),db)).id).toBe('admin');
  });
  it('改密清Cookie、使所有旧会话和旧密码失效；新密码可登录且无敏感响应/审计', async () => {
    const a=await login(),b=await login();
    const response=await change(a),text=await response.text();
    expect(text).toBe('{"data":{"ok":true}}'); expect(response.headers.get('set-cookie')).toContain('Max-Age=0');
    for(const auth of [a,b]) await expect(session(new Request(origin,{headers:{cookie:auth.cookie}}),db)).rejects.toMatchObject({status:401});
    await expect(login(initial)).rejects.toMatchObject({status:401});
    expect((await login(next)).csrf).toBeTruthy();
    const audit=await db.prepare('SELECT * FROM audit').all();
    expect(audit.results).toHaveLength(1); expect(JSON.stringify(audit.results)).not.toContain(next);
    expect(JSON.stringify(audit.results)).not.toContain(initial);
  });
  it('初始无DB凭据和已有DB凭据均只有一个并发修改能成功', async () => {
    for(const old of [initial,next]) {
      const body={currentPassword:old,newPassword:old+'-new',confirmPassword:old+'-new'};
      const attempts=await Promise.allSettled([changeAdminPassword(db,env.ADMIN_PASSWORD_HASH,body),changeAdminPassword(db,env.ADMIN_PASSWORD_HASH,body)]);
      expect(attempts.filter(r=>r.status==='fulfilled')).toHaveLength(1);
      if(old===initial) { // 为第二轮准备已有行。
        await db.prepare('UPDATE admin_credentials SET password_hash=? WHERE id=1').bind(await hashPassword(next)).run();
      }
    }
    expect((await adminCredential(db,env.ADMIN_PASSWORD_HASH)).version).toBe(2);
  });
  it('事务失败回滚摘要与会话，不会留下半次改密', async () => {
    const auth=await login();
    await db.exec("CREATE TRIGGER fixture_audit_failure BEFORE INSERT ON audit BEGIN SELECT RAISE(ABORT,'fixture'); END;");
    try {
      await expect(change(auth)).rejects.toThrow();
      expect((await adminCredential(db,env.ADMIN_PASSWORD_HASH)).version).toBe(0);
      expect((await session(new Request(origin,{headers:{cookie:auth.cookie}}),db)).id).toBe('admin');
    } finally { await db.exec('DROP TRIGGER fixture_audit_failure'); }
  });
  it('旧密码验证后发生改密，过期版本不能插入有效登录会话', async () => {
    // 在真实登录已验证原摘要、即将提交会话时插入一次并发改密。
    const racingDb = {
      prepare: db.prepare.bind(db),
      batch: async (statements: D1PreparedStatement[]) => {
        await changeAdminPassword(db,env.ADMIN_PASSWORD_HASH,payload);
        return db.batch(statements);
      },
    } as unknown as D1Database;
    await expect(handleApi(new Request(origin+'/api/auth/login', {method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify({username:'fixture',password:initial})}), {...env,DB:racingDb}, 'auth/login')).rejects.toMatchObject({status:409,code:'CREDENTIAL_CONFLICT'});
    expect((await db.prepare('SELECT count(*) AS count FROM sessions').first<{count:number}>())?.count).toBe(0);
    // 即使旧版本行残留，读取会话也会拒绝。
    await db.prepare('INSERT INTO sessions VALUES(?,?,?,?)').bind(await sha256('stale'),'csrf',9999999999,0).run();
    await expect(session(new Request(origin,{headers:{cookie:'session=stale'}}),db)).rejects.toMatchObject({status:401});
  });
  it('错误原密码尝试受账号级限流', async () => {
    const auth=await login();
    for(let i=0;i<5;i++) await expect(change(auth,{...payload,currentPassword:'wrong'})).rejects.toMatchObject({status:403});
    await expect(change(auth)).rejects.toMatchObject({status:429});
  });
});
