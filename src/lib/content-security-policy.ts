const adSources = 'https://*.googlesyndication.com https://*.doubleclick.net https://*.google.com https://*.googleadservices.com https://*.googletagservices.com https://*.gstatic.com';

/** Middleware enables ad permissions only for configured public pages; management and previews retain the original policy. */
export function contentSecurityPolicy(advertising = false): string {
  const ads = advertising ? ` ${adSources}` : '';
  return `default-src 'self'; script-src 'self' 'unsafe-inline'${ads}; style-src 'self' 'unsafe-inline'; img-src 'self' data:${ads}; font-src 'self'; frame-src 'self' https://www.youtube.com https://www.youtube-nocookie.com https://player.bilibili.com${ads}; connect-src 'self' ws://127.0.0.1:*${ads}; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'none'`;
}
