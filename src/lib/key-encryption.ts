import { ApiError } from './http';

const encoder = new TextEncoder();
const toHex = (bytes: Uint8Array) => Array.from(bytes, value => value.toString(16).padStart(2, '0')).join('');
const fromHex = (value: string) => Uint8Array.from(value.match(/../g) || [], byte => parseInt(byte, 16));

async function encryptionKey(secret: string | undefined) {
  if (!secret || !/^[a-f0-9]{64}$/i.test(secret)) throw new ApiError(503, 'KEY_ENCRYPTION_CONFIG', '密钥加密配置缺失或无效，请运行本地初始化并重启服务');
  return crypto.subtle.importKey('raw', fromHex(secret), 'AES-GCM', false, ['encrypt', 'decrypt']);
}

export async function encryptApiKey(token: string, id: string, secret: string | undefined) {
  const key = await encryptionKey(secret);
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv, additionalData: encoder.encode(`api-key:v1:${id}`), tagLength: 128 }, key, encoder.encode(token));
  return `v1.${toHex(iv)}.${toHex(new Uint8Array(ciphertext))}`;
}

export async function decryptApiKey(encrypted: string, id: string, secret: string | undefined) {
  const key = await encryptionKey(secret);
  try {
    const match = /^v1\.([a-f0-9]{24})\.([a-f0-9]{166})$/.exec(encrypted);
    if (!match) throw new Error('Invalid envelope');
    const bytes = await crypto.subtle.decrypt({ name: 'AES-GCM', iv: fromHex(match[1]), additionalData: encoder.encode(`api-key:v1:${id}`), tagLength: 128 }, key, fromHex(match[2]));
    const token = new TextDecoder().decode(bytes);
    if (!/^rf_[a-f0-9]{64}$/.test(token)) throw new Error('Invalid token');
    return token;
  } catch {
    throw new ApiError(503, 'KEY_DECRYPTION_FAILED', '无法读取密钥，请检查原加密配置是否保留');
  }
}
