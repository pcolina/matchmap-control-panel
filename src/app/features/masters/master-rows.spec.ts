import { describe, expect, it } from 'vitest';
import { PROHIBITED_WORDS_QUERY } from './data/prohibited-words.query';
import { COUNTRIES_QUERY, CountryRecord } from './data/countries.query';
import { cityRows, countryRows, prohibitedWordRows, queryFor, rowsFor } from './master-rows';
import { ProhibitedWordRecord } from './data/prohibited-words.query';

const countries: CountryRecord[] = [
  {
    code: 'ES',
    name: 'Spain',
    cities: [
      { id: '1', name: 'Madrid', latitude: 40.4, longitude: -3.7 },
      { id: '2', name: 'Sevilla', latitude: 37.4, longitude: -6 },
    ],
  },
  {
    code: 'FR',
    name: 'France',
    cities: [{ id: '3', name: 'Paris', latitude: 48.9, longitude: 2.3 }],
  },
  { code: 'PT', name: 'Portugal', cities: [] },
];

const words: ProhibitedWordRecord[] = [
  { id: 'w1', word: 'ejemplo', category: 'HATE', language: 'es', active: true },
  { id: 'w2', word: 'sample', category: 'VIOLENCE', language: 'en', active: false },
];

describe('master rows', () => {
  it('counts the cities of each country', () => {
    expect(countryRows(countries)).toEqual([
      { code: 'ES', name: 'Spain', cityCount: 2 },
      { code: 'FR', name: 'France', cityCount: 1 },
      { code: 'PT', name: 'Portugal', cityCount: 0 },
    ]);
  });

  it('flattens the cities with the name of their country', () => {
    expect(cityRows(countries)).toEqual([
      { id: '1', country: 'Spain', city: 'Madrid', latitude: 40.4, longitude: -3.7 },
      { id: '2', country: 'Spain', city: 'Sevilla', latitude: 37.4, longitude: -6 },
      { id: '3', country: 'France', city: 'Paris', latitude: 48.9, longitude: 2.3 },
    ]);
  });

  it('maps each prohibited word with its category, language and active flag', () => {
    expect(prohibitedWordRows(words)).toEqual([
      { id: 'w1', word: 'ejemplo', category: 'HATE', language: 'es', active: true },
      { id: 'w2', word: 'sample', category: 'VIOLENCE', language: 'en', active: false },
    ]);
  });

  it('picks the rows of the selected master from its own data', () => {
    expect(rowsFor('countries', { countries })).toHaveLength(3);
    expect(rowsFor('cities', { countries })).toHaveLength(3);
    expect(rowsFor('prohibited-words', { prohibitedWords: words })).toHaveLength(2);
  });

  it('has no rows when the data belongs to another master', () => {
    expect(rowsFor('prohibited-words', { countries })).toEqual([]);
    expect(rowsFor('countries', { prohibitedWords: words })).toEqual([]);
  });

  it('runs the query of the selected master', () => {
    expect(queryFor('prohibited-words')).toBe(PROHIBITED_WORDS_QUERY);
    expect(queryFor('countries')).toBe(COUNTRIES_QUERY);
    expect(queryFor('cities')).toBe(COUNTRIES_QUERY);
  });
});
