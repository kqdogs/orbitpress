import {localeCookie, normalizeLocale, translate, type Locale} from './index';

export function currentLocale(): Locale {
  return normalizeLocale(typeof document === 'undefined' ? undefined : document.documentElement.lang);
}

export const t = (key: string, values: readonly unknown[] = []) => translate(currentLocale(), key, values);

/** Store only an allowlisted preference. Reload preserves the current route and hash. */
export function changeLocale(locale: Locale) {
  if (locale === currentLocale()) return;
  document.cookie = `${localeCookie}=${normalizeLocale(locale)}; Path=/; Max-Age=31536000; SameSite=Lax${location.protocol === 'https:' ? '; Secure' : ''}`;
  location.reload();
}
