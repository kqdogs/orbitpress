import { ApiError, epoch, now } from './http';
import { randomToken, sha256, constantTimeEqual, rateLimit, type Actor } from './security';
import { encryptApiKey, decryptApiKey } from './key-encryption';
import type { z } from 'zod';
import type { keyInput } from './schema';

export async function listApiKeys(db: D1Database) {
  const rows = await db.prepare(`SELECT k.id,k.name,k.scopes,k.created_at createdAt,k.expires_at expiresAt,k.revoked_at revokedAt,
    (s.key_id IS NOT NULL AND k.revoked_at IS NULL AND k.expires_at>?) canReveal
    FROM api_keys k LEFT JOIN api_key_secrets s ON s.key_id=k.id ORDER BY k.created_at DESC LIMIT 100`).bind(epoch()).all();
  return rows.results.map(({ canReveal, ...key }) => ({ ...key, canReveal: Boolean(canReveal) }));
}

export async function createApiKey(db: D1Database, actor: Actor, input: z.infer<typeof keyInput>, secret: string | undefined) {
  const token = `rf_${randomToken()}`, id = crypto.randomUUID(), timestamp = now();
  const encrypted = await encryptApiKey(token, id, secret);
  await db.batch([
    db.prepare('INSERT INTO api_keys(id,name,hash,scopes,created_at,expires_at) VALUES(?,?,?,?,?,?)').bind(id, input.name, await sha256(token), JSON.stringify([...new Set(input.scopes)]), timestamp, epoch() + input.days * 86400),
    db.prepare('INSERT INTO api_key_secrets(key_id,encrypted_token) VALUES(?,?)').bind(id, encrypted),
    db.prepare('INSERT INTO audit VALUES(?,?,?,?,?)').bind(crypto.randomUUID(), actor.id, 'key.create', id, timestamp),
  ]);
  return { id, token };
}

export async function revealApiKey(db: D1Database, actor: Actor, id: string, secret: string | undefined) {
  await rateLimit(db, `key-reveal:${actor.id}`, 30, 60);
  const row = await db.prepare(`SELECT k.hash,k.expires_at expiresAt,k.revoked_at revokedAt,s.encrypted_token encryptedToken
    FROM api_keys k LEFT JOIN api_key_secrets s ON s.key_id=k.id WHERE k.id=?`).bind(id).first<{ hash: string; expiresAt: number; revokedAt: string | null; encryptedToken: string | null }>();
  if (!row) throw new ApiError(404, 'NOT_FOUND', '密钥不存在');
  if (row.revokedAt || row.expiresAt <= epoch()) throw new ApiError(409, 'KEY_UNAVAILABLE', '密钥已撤销或过期');
  if (!row.encryptedToken) throw new ApiError(409, 'KEY_NOT_RECOVERABLE', '旧密钥仅保存哈希，无法还原；原密钥仍可继续使用');
  const token = await decryptApiKey(row.encryptedToken, id, secret);
  if (!constantTimeEqual(await sha256(token), row.hash)) throw new ApiError(503, 'KEY_DECRYPTION_FAILED', '密钥校验失败');
  // Recheck after decryption so a concurrent revocation prevents disclosure.
  const audit = await db.prepare(`INSERT INTO audit SELECT ?,?,?,?,? FROM api_keys k
    JOIN api_key_secrets s ON s.key_id=k.id WHERE k.id=? AND k.revoked_at IS NULL AND k.expires_at>? AND s.encrypted_token=? RETURNING id`)
    .bind(crypto.randomUUID(), actor.id, 'key.reveal', id, now(), id, epoch(), row.encryptedToken).first();
  if (!audit) throw new ApiError(409, 'KEY_UNAVAILABLE', '密钥状态已改变，请刷新');
  return { id, token };
}

export async function revokeApiKey(db: D1Database, actor: Actor, id: string) {
  if (!await db.prepare('SELECT id FROM api_keys WHERE id=?').bind(id).first()) throw new ApiError(404, 'NOT_FOUND', '密钥不存在');
  await db.batch([
    db.prepare('INSERT INTO audit SELECT ?,?,?,?,? FROM api_keys WHERE id=? AND revoked_at IS NULL').bind(crypto.randomUUID(), actor.id, 'key.revoke', id, now(), id),
    db.prepare('UPDATE api_keys SET revoked_at=? WHERE id=? AND revoked_at IS NULL').bind(now(), id),
    db.prepare('DELETE FROM api_key_secrets WHERE key_id=?').bind(id),
  ]);
  return { ok: true };
}
