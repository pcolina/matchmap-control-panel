import { gql } from '@apollo/client/core';

export const COUNTRIES_QUERY = gql`
  query Countries {
    countries {
      code
      name
      cities {
        id
        name
        latitude
        longitude
      }
    }
  }
`;

export interface CityRecord {
  readonly id: string;
  readonly name: string;
  readonly latitude: number;
  readonly longitude: number;
}

export interface CountryRecord {
  readonly code: string;
  readonly name: string;
  readonly cities: readonly CityRecord[];
}

export interface CountriesData {
  readonly countries: readonly CountryRecord[];
}
