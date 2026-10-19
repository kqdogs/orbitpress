import { describe, expect, it } from 'vitest';
import { decryptApiKey, encryptApiKey } from '../src/lib/key-encryption';

const secret = '0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef';
const token = 'rf_' + 'a'.repeat(64);

describe('API 密钥 AES-GCM 密文', () => {
  it('往返使用随机 IV，且同一明文不会产生相同密文', async () => {
    const first = await encryptApiKey(token, 'key-a', secret);
    const second = await encryptApiKey(token, 'key-a', secret);
    expect(first).not.toBe(second);
    expect(first).toMatch(/^v1\.[a-f0-9]{24}\.[a-f0-9]{166}$/);
    await expect(decryptApiKey(first, 'key-a', secret)).resolves.toBe(token);
  });

  it('错误密钥、错误 ID 和篡改密文均拒绝', async () => {
    const encrypted = await encryptApiKey(token, 'key-a', secret);
    await expect(decryptApiKey(encrypted, 'key-b', secret)).rejects.toMatchObject({ code: 'KEY_DECRYPTION_FAILED' });
    await expect(decryptApiKey(encrypted, 'key-a', secret.replace(/0/g, '1'))).rejects.toMatchObject({ code: 'KEY_DECRYPTION_FAILED' });
    const last = encrypted.slice(-1);
    await expect(decryptApiKey(`${encrypted.slice(0, -1)}${last === '0' ? '1' : '0'}`, 'key-a', secret)).rejects.toMatchObject({ code: 'KEY_DECRYPTION_FAILED' });
  });

  it('缺失或非法配置不会生成不可恢复密钥', async () => {
    await expect(encryptApiKey(token, 'key-a', undefined)).rejects.toMatchObject({ code: 'KEY_ENCRYPTION_CONFIG' });
    await expect(encryptApiKey(token, 'key-a', 'short')).rejects.toMatchObject({ code: 'KEY_ENCRYPTION_CONFIG' });
  });
});
