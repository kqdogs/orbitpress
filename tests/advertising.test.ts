import { describe, expect, it } from 'vitest';
import { advertisingInput, adsAllowed, adsTxtResponse } from '../src/lib/advertising';
import { contentSecurityPolicy } from '../src/lib/content-security-policy';
import { adminPathInput, permalinkCustomInput, settingsInput, settingsUpdateInput, slugSchema } from '../src/lib/schema';

const clientId = 'ca-pub-1234567890123456'; // Synthetic; never requested from Google.
const active = () => advertisingInput.parse({ clientId, enabled: true, consentReady: true });
const brand = { title: 'Fixture', tagline: '', description: '', logo: '', socialFollowText: 'Follow', headerNav: [], youtube: '', telegram: '', bilibili: '', twitter: '', notice: '' };

describe('AdSense configuration and compatibility', () => {
  it('defaults to empty, disabled ads for old settings and preserves them on legacy updates', () => {
    const defaults = settingsInput.parse(brand);
    expect(defaults.advertising).toEqual({ enabled: false, clientId: '', slots: { home: '', articleTop: '', articleBottom: '', sidebar: '' }, consentReady: false, privacyContact: '', privacyPolicy: '' });
    const saved = { ...defaults, advertising: active() };
    const { advertising, ...oldClient } = saved;
    const { version, ...patch } = settingsUpdateInput.parse({ ...oldClient, version: 3, title: 'Updated' });
    expect(patch).not.toHaveProperty('advertising');
    expect(settingsInput.parse({ ...saved, ...patch }).advertising).toEqual(advertising);
    expect(version).toBe(3);
  });
  it('rejects missing identity/consent, injected code, unknown fields and malformed slots', () => {
    for (const input of [
      { enabled: true }, { enabled: true, clientId }, { enabled: true, consentReady: true },
      { clientId: '<script>alert(1)</script>' }, { clientId: clientId + '\n<script>' },
      { clientId: 'ca-pub-1234' }, { slots: { home: 'abc' } }, { slots: { articleTop: '12345678901' } },
      { script: 'alert(1)' }, { privacyContact: 'not-email' }, { privacyPolicy: 'x'.repeat(20001) },
    ]) expect(advertisingInput.safeParse(input).success, JSON.stringify(input).slice(0,100)).toBe(false);
    expect(advertisingInput.parse({ clientId: ` ${clientId} ` }).clientId).toBe(clientId);
    expect(active().slots.home).toBe('');
  });
  it('reserves privacy paths without blocking ordinary article URLs', () => {
    expect(slugSchema.safeParse('privacy').success).toBe(false);
    expect(adminPathInput.safeParse('/privacy').success).toBe(false);
    expect(permalinkCustomInput.safeParse('/privacy/%post_id%/').success).toBe(false);
    expect(permalinkCustomInput.safeParse('/ads.txt/%post_id%/').success).toBe(false);
    expect(permalinkCustomInput.safeParse('/%post_id%.html').success).toBe(true);
  });
});

describe('advertising request boundaries', () => {
  it('only permits opted-in public GET pages, never preview/search/error/management', () => {
    const request = (path = '/', method = 'GET') => new Request('https://site.test' + path, { method });
    for (const path of ['/', '/article/', '/?p=42', '/42.html']) expect(adsAllowed(active(), request(path))).toBe(true);
    for (const path of ['/admin', '/admin/preview', '/api/admin/settings', '/privacy', '/privacy/', '/?s=hello', '/?tag=test', '/?s=']) expect(adsAllowed(active(), request(path))).toBe(false);
    expect(adsAllowed(active(), request(), 200, true)).toBe(false);
    expect(adsAllowed(active(), request('/', 'POST'))).toBe(false);
    for (const code of [301, 400, 404, 500]) expect(adsAllowed(active(), request(), code)).toBe(false);
    expect(adsAllowed(advertisingInput.parse({ clientId }), request())).toBe(false);
    expect(adsAllowed({ ...active(), consentReady: false }, request())).toBe(false);
  });
  it('returns exact ads.txt for a configured publisher even while ads are off', async () => {
    const response = adsTxtResponse(advertisingInput.parse({ clientId }));
    expect(response.status).toBe(200);
    expect(await response.text()).toBe('google.com, pub-1234567890123456, DIRECT, f08c47fec0942fa0\n');
    expect(response.headers.get('Content-Type')).toBe('text/plain; charset=utf-8');
    expect(response.headers.get('Cache-Control')).toBe('public, max-age=300');
    const empty = adsTxtResponse(advertisingInput.parse({}));
    expect(empty.status).toBe(404);
    expect(await empty.text()).not.toContain('pub-');
  });
  it('expands only ad-related CSP directives while retaining navigation and framing restrictions', () => {
    const closed = contentSecurityPolicy(), enabled = contentSecurityPolicy(true);
    expect(closed).not.toContain('googlesyndication');
    for (const directive of ['script-src', 'img-src', 'connect-src', 'frame-src']) {
      expect(enabled.split(';').find(part => part.trim().startsWith(directive))).toContain('https://*.googlesyndication.com');
    }
    for (const policy of [closed, enabled]) {
      expect(policy).toContain("object-src 'none'");
      expect(policy).toContain("base-uri 'self'");
      expect(policy).toContain("form-action 'self'");
      expect(policy).toContain("frame-ancestors 'none'");
      expect(policy).not.toContain("'unsafe-eval'");
      expect(policy).not.toMatch(/(?:script|connect|frame)-src[^;]*\shttps:(?:\s|;)/);
    }
  });
});
