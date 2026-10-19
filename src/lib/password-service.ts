import type { z } from 'zod';
import { passwordChangeInput } from './password-service-input';
export { passwordChangeInput } from './password-service-input';
import { ApiError, now } from './http';
import { randomToken, verifyPassword } from './security';

export type Credential = { passwordHash: string; version: number };
export async function adminCredential(db: D1Database, initialHash: string): Promise<Credential> {
  return await db.prepare('SELECT password_hash AS passwordHash,version FROM admin_credentials WHERE id=1').first<Credential>() ?? { passwordHash: initialHash, version: 0 };
}
export async function hashPassword(password: string) {
  const salt = randomToken();
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({name:'PBKDF2',salt:new TextEncoder().encode(salt),iterations:100000,hash:'SHA-256'}, key, 256);
  return `${salt}:${Array.from(new Uint8Array(bits), b => b.toString(16).padStart(2,'0')).join('')}`;
}
export async function changeAdminPassword(db: D1Database, initialHash: string, input: z.infer<typeof passwordChangeInput>) {
  const credential = await adminCredential(db, initialHash);
  if (!await verifyPassword(input.currentPassword, credential.passwordHash)) throw new ApiError(403, 'PASSWORD_INCORRECT', '原密码不正确');
  const encoded = await hashPassword(input.newPassword);
  const operation = crypto.randomUUID(), timestamp = now();
  // D1 batch 为事务；CAS失败时后续语句不得删除会话或写审计。
  const results = await db.batch([
    db.prepare(`INSERT INTO admin_credentials(id,password_hash,version,updated_at,last_operation)
      SELECT 1,?,?,?,? WHERE ?=0 OR EXISTS(SELECT 1 FROM admin_credentials WHERE id=1 AND version=? AND password_hash=?)
      ON CONFLICT(id) DO UPDATE SET password_hash=excluded.password_hash,version=excluded.version,updated_at=excluded.updated_at,last_operation=excluded.last_operation
      WHERE admin_credentials.version=? AND admin_credentials.password_hash=? RETURNING version`)
      .bind(encoded, credential.version + 1, timestamp, operation, credential.version, credential.version, credential.passwordHash, credential.version, credential.passwordHash),
    db.prepare('DELETE FROM sessions WHERE EXISTS(SELECT 1 FROM admin_credentials WHERE id=1 AND last_operation=?)').bind(operation),
    db.prepare("INSERT INTO audit SELECT ?,'admin','account.password.change','admin',? FROM admin_credentials WHERE id=1 AND last_operation=?").bind(crypto.randomUUID(), timestamp, operation),
  ]);
  if (!results[0].results.length) throw new ApiError(409, 'CREDENTIAL_CONFLICT', '密码已被其他请求修改，请重新登录');
}
