export const MASTER_SLUGS = ['prohibited-words', 'countries', 'cities'] as const;

export type MasterSlug = (typeof MASTER_SLUGS)[number];

export const DEFAULT_MASTER: MasterSlug = 'prohibited-words';

export const MASTER_COLUMNS: Record<MasterSlug, readonly string[]> = {
  'prohibited-words': ['word', 'category', 'language', 'active'],
  countries: ['code', 'name', 'cityCount'],
  cities: ['country', 'city', 'latitude', 'longitude'],
};

export const isMasterSlug = (value: unknown): value is MasterSlug =>
  (MASTER_SLUGS as readonly unknown[]).includes(value);
