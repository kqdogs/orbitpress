import { afterEach, describe, expect, it } from 'vitest';
import { mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { verifyPassword } from '../src/lib/security';

const execute = promisify(execFile);
const folders: string[] = [];
afterEach(async () => { await Promise.all(folders.splice(0).map(path => rm(path, { recursive: true, force: true }))); });
async function setup(root: string) {
  return execute(process.execPath, [resolve('scripts/setup.mjs')], { cwd: root });
}
async function fixture() {
  const root = await mkdtemp(join(tmpdir(), 'orbitpress setup ')); folders.push(root); return root;
}
function vars(text: string) {
  return Object.fromEntries(text.trim().split(/\r?\n/).filter(Boolean).map(line => line.split('=')));
}
describe('本地初始化默认凭据（独立临时目录）', () => {
  it('admin/123456可验证；每个安装摘要及加密密钥独立；重跑不重置', async () => {
    const a = await fixture(), b = await fixture();
    const result = await setup(a); await setup(b);
    const before = await readFile(join(a, '.dev.vars'), 'utf8');
    const first = vars(before), second = vars(await readFile(join(b, '.dev.vars'), 'utf8'));
    expect(first.ADMIN_USERNAME).toBe('admin');
    expect(await verifyPassword('123456', first.ADMIN_PASSWORD_HASH)).toBe(true);
    expect(await verifyPassword('wrong-password', first.ADMIN_PASSWORD_HASH)).toBe(false);
    expect(first.ADMIN_PASSWORD_HASH).not.toBe(second.ADMIN_PASSWORD_HASH);
    expect(first.API_KEY_ENCRYPTION_KEY).toMatch(/^[a-f0-9]{64}$/);
    expect(first.API_KEY_ENCRYPTION_KEY).not.toBe(second.API_KEY_ENCRYPTION_KEY);
    expect(result.stdout + result.stderr).not.toContain('123456');
    expect(await readFile(join(a, 'local-admin.txt'), 'utf8')).toContain('/admin');
    await setup(a);
    expect(await readFile(join(a, '.dev.vars'), 'utf8')).toBe(before);
  });
  it('已有非默认账号保留；缺少加密密钥只补密钥', async () => {
    const root = await fixture();
    const original = 'ADMIN_USERNAME=owner\nADMIN_PASSWORD_HASH=existing-hash\n';
    await writeFile(join(root, '.dev.vars'), original);
    await setup(root);
    const updated = await readFile(join(root, '.dev.vars'), 'utf8');
    expect(updated.startsWith(original)).toBe(true);
    expect(vars(updated).API_KEY_ENCRYPTION_KEY).toMatch(/^[a-f0-9]{64}$/);
    await expect(readFile(join(root, 'local-admin.txt'))).rejects.toThrow();
    await setup(root);
    expect(await readFile(join(root, '.dev.vars'), 'utf8')).toBe(updated);
  });
});
