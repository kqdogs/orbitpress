import type { Settings } from './schema';

export type CommunityCard = NonNullable<Settings['communityCard']>;
/** Preserve existing sites until their card is explicitly customized. */
export function resolveCommunityCard(settings: Settings): CommunityCard {
  return settings.communityCard ?? {
    enabled: Boolean(settings.telegram),
    title: settings.title + '交流群',
    description: settings.homeHero.description || '办卡开户遇到问题，进群一起交流',
    icon: 'telegram',
    buttonLabel: '加入',
    href: settings.telegram || '/about/',
  };
}
