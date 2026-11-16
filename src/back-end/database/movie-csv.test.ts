import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import { getMovieById } from './movie-repository';
import { importMoviesCsv, parseMoviesCsv } from './movie-csv';
import { initializeSchema } from './schema';

const CSV_HEADER =
  'id,title,original_title,original_language,overview,release_date,popularity,vote_average,vote_count,poster_path,backdrop_path,runtime,budget,revenue,genres,production_countries';

const createCsvRow = (
  id: string,
  title: string,
  originalLanguage: string,
  overview: string,
  popularity: string,
  voteAverage: string,
  voteCount: string,
): string =>
  [
    id,
    title,
    title,
    originalLanguage,
    overview,
    '2020-01-02',
    popularity,
    voteAverage,
    voteCount,
    '',
    '',
    '',
    '',
    '',
    '[]',
    '[]',
  ].join(',');

const createDatabase = (): DatabaseSync => {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
};

describe('movie CSV importer', () => {
  it('parses movie CSV data and maps runtime to the database field', () => {
    // Arrange
    const csv = `${CSV_HEADER}\n1,"Movie, One",Movie One,en,Overview,2020-01-02,10.5,7.2,100,/poster,/backdrop,120,1000,2000,"[1]","[]"`;

    // Act
    const movies = parseMoviesCsv(csv, '2026-11-16T00:00:00.000Z');

    // Assert
    expect(movies).toEqual([
      {
        id: 1,
        title: 'Movie, One',
        original_title: 'Movie One',
        original_language: 'en',
        overview: 'Overview',
        release_date: '2020-01-02',
        popularity: 10.5,
        vote_average: 7.2,
        vote_count: 100,
        poster_path: '/poster',
        backdrop_path: '/backdrop',
        runtime_minutes: 120,
        budget: 1000,
        revenue: 2000,
        collected_at: '2026-11-16T00:00:00.000Z',
      },
    ]);
  });

  it('imports new movies and updates existing movies from CSV data', () => {
    // Arrange
    const database = createDatabase();
    const initialCsv = `${CSV_HEADER}\n${createCsvRow('1', 'Original', 'en', 'Overview', '10', '7', '100')}`;
    const updatedCsv = `${CSV_HEADER}\n${createCsvRow('1', 'Updated', 'en', 'New overview', '20', '8', '200')}\n${createCsvRow('2', 'New movie', 'fr', 'Overview', '5', '6', '50')}`;

    try {
      // Act
      expect(
        importMoviesCsv(database, initialCsv, '2026-11-16T00:00:00.000Z'),
      ).toBe(1);
      expect(
        importMoviesCsv(database, updatedCsv, '2026-11-17T00:00:00.000Z'),
      ).toBe(2);

      // Assert
      expect(getMovieById(database, 1)).toMatchObject({
        id: 1,
        title: 'Updated',
        overview: 'New overview',
        popularity: 20,
        collected_at: '2026-11-17T00:00:00.000Z',
      });
      expect(getMovieById(database, 2)).toMatchObject({
        id: 2,
        title: 'New movie',
      });
    } finally {
      database.close();
    }
  });

  it('rejects invalid headers and movie values', () => {
    // Arrange
    const invalidHeader = 'id,title\n1,Movie';
    const invalidMovie = `${CSV_HEADER}\n${createCsvRow('0', 'Movie', 'en', 'Overview', '', '', '')}`;

    // Act and assert
    expect(() =>
      parseMoviesCsv(invalidHeader, '2026-11-16T00:00:00.000Z'),
    ).toThrow('Invalid movies CSV');
    expect(() =>
      parseMoviesCsv(invalidMovie, '2026-11-16T00:00:00.000Z'),
    ).toThrow('id on data row 2');
  });
});
