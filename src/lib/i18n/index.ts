import english from './en.json';

export const locales = ['zh-CN', 'en'] as const;
export type Locale = (typeof locales)[number];
export const localeCookie = 'orbitpress_locale';
export const localeNames: Record<Locale, string> = { 'zh-CN': '简体中文', en: 'English' };

export function normalizeLocale(value: string | null | undefined): Locale {
  return value === 'en' ? 'en' : 'zh-CN';
}

export function localeFromCookie(cookie: string): Locale {
  const value = cookie.split(';').map(part => part.trim()).find(part => part.startsWith(localeCookie + '='))?.slice(localeCookie.length + 1);
  return normalizeLocale(value);
}

/** Explicit locale keeps simultaneous SSR requests isolated. Content is never translated. */
export function translate(locale: Locale, key: string, values: readonly unknown[] = []): string {
  const dictionary: Readonly<Record<string, string>> = english;
  const message = locale === 'en' && Object.hasOwn(dictionary,key) ? dictionary[key] : key;
  return message.replace(/\{(\d+)\}/g, (token, index: string) => values[Number(index)] == null ? token : String(values[Number(index)]));
}

export const translator = (locale: Locale) => (key: string, values: readonly unknown[] = []) => translate(locale, key, values);
