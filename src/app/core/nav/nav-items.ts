export type Profile = 'superadmin';

export interface NavItem {
  readonly labelKey: string;
  readonly route: string;
  readonly icon: string;
  readonly allowedProfiles: readonly Profile[];
}

const ALL_PROFILES: readonly Profile[] = ['superadmin'];

export const NAV_ITEMS: readonly NavItem[] = [
  { labelKey: 'nav.home', route: 'home', icon: 'tablerHome', allowedProfiles: ALL_PROFILES },
  {
    labelKey: 'nav.masters',
    route: 'masters',
    icon: 'tablerDatabase',
    allowedProfiles: ALL_PROFILES,
  },
  {
    labelKey: 'nav.statistics',
    route: 'statistics',
    icon: 'tablerChartBar',
    allowedProfiles: ALL_PROFILES,
  },
  { labelKey: 'nav.users', route: 'users', icon: 'tablerUsers', allowedProfiles: ALL_PROFILES },
  {
    labelKey: 'nav.profiles',
    route: 'profiles',
    icon: 'tablerShield',
    allowedProfiles: ALL_PROFILES,
  },
  {
    labelKey: 'nav.marketing',
    route: 'marketing',
    icon: 'tablerSpeakerphone',
    allowedProfiles: ALL_PROFILES,
  },
  {
    labelKey: 'nav.benefits',
    route: 'benefits',
    icon: 'tablerCoin',
    allowedProfiles: ALL_PROFILES,
  },
  {
    labelKey: 'nav.settings',
    route: 'settings',
    icon: 'tablerSettings',
    allowedProfiles: ALL_PROFILES,
  },
];

export const visibleItems = (items: readonly NavItem[], profile: Profile): readonly NavItem[] =>
  items.filter((item) => item.allowedProfiles.includes(profile));
