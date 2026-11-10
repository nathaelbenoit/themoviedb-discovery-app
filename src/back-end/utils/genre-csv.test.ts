import { describe, expect, it } from 'vitest';
import { parseGenresCsv } from './genre-csv';

describe('parseGenresCsv', () => {
  it('parses supported CSV syntax and ignores empty lines', () => {
    expect(
      parseGenresCsv(
        '\uFEFFNAME,Id\r\n"Science, Fiction",878\r\n\r\n"Drama ""classic""",18\r\n',
      ),
    ).toEqual([
      { id: 878, name: 'Science, Fiction' },
      { id: 18, name: 'Drama "classic"' },
    ]);
  });

  it('accepts headers in any order without case sensitivity', () => {
    expect(parseGenresCsv('NAME,id\nComedy,35\n')).toEqual([
      { id: 35, name: 'Comedy' },
    ]);
  });

  it.each([
    ['wrong headers', 'genre_id,name\n1,Drama\n'],
    ['missing id', 'id,name\n,Drama\n'],
    ['negative id', 'id,name\n-1,Drama\n'],
    ['unsafe id', 'id,name\n9007199254740992,Drama\n'],
    ['empty name', 'id,name\n1,\n'],
    ['empty file', '\n\r\n'],
    ['malformed quotes', 'id,name\n1,"Drama\n'],
  ])('rejects %s', (_description, csv) => {
    expect(() => parseGenresCsv(csv)).toThrow('Invalid genres CSV');
  });
});
