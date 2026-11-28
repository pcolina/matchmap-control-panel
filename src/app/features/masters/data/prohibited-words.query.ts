import { gql } from '@apollo/client/core';

export const PROHIBITED_WORDS_QUERY = gql`
  query ProhibitedWords {
    prohibitedWords {
      id
      word
      category
      language
      active
    }
  }
`;

export interface ProhibitedWordRecord {
  readonly id: string;
  readonly word: string;
  readonly category: string;
  readonly language: string;
  readonly active: boolean;
}

export interface ProhibitedWordsData {
  readonly prohibitedWords: readonly ProhibitedWordRecord[];
}
