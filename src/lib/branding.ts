import type { Settings } from './schema';
export const defaultLogo = '/images/yachin-mark.svg';
export const brandLogo = (settings: Pick<Settings, 'logo'>) => settings.logo || defaultLogo;
export function socialLinks(settings: Settings) {
  return [
    { icon: 'youtube', name: 'YouTube', href: settings.youtube },
    { icon: 'globe', name: '哔哩哔哩', href: settings.bilibili },
    { icon: 'globe', name: 'X', href: settings.twitter },
    { icon: 'telegram', name: 'Telegram', href: settings.telegram },
  ].filter(link => link.href);
}
