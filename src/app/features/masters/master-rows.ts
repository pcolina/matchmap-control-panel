import type { DocumentNode } from '@apollo/client/core';
import { COUNTRIES_QUERY, CountryRecord } from './data/countries.query';
import { PROHIBITED_WORDS_QUERY, ProhibitedWordRecord } from './data/prohibited-words.query';
import { MasterSlug } from './masters.model';

export type MasterRow = Record<string, string | number | boolean>;

export type MasterSource =
  | { readonly countries: readonly CountryRecord[] }
  | { readonly prohibitedWords: readonly ProhibitedWordRecord[] };

export const countryRows = (countries: readonly CountryRecord[]): MasterRow[] =>
  countries.map((country) => ({
    code: country.code,
    name: country.name,
    cityCount: country.cities.length,
  }));

export const cityRows = (countries: readonly CountryRecord[]): MasterRow[] =>
  countries.flatMap((country) =>
    country.cities.map((city) => ({
      id: city.id,
      country: country.name,
      city: city.name,
      latitude: city.latitude,
      longitude: city.longitude,
    })),
  );

export const prohibitedWordRows = (words: readonly ProhibitedWordRecord[]): MasterRow[] =>
  words.map((word) => ({
    id: word.id,
    word: word.word,
    category: word.category,
    language: word.language,
    active: word.active,
  }));

export const queryFor = (master: MasterSlug): DocumentNode =>
  master === 'prohibited-words' ? PROHIBITED_WORDS_QUERY : COUNTRIES_QUERY;

export const rowsFor = (master: MasterSlug, source: MasterSource): MasterRow[] => {
  switch (master) {
    case 'countries':
      return 'countries' in source ? countryRows(source.countries) : [];
    case 'cities':
      return 'countries' in source ? cityRows(source.countries) : [];
    case 'prohibited-words':
      return 'prohibitedWords' in source ? prohibitedWordRows(source.prohibitedWords) : [];
  }
};
