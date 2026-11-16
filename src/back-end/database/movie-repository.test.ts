import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import type { StoredMovieInput } from '../types/MoviesTypes';
import { initializeSchema } from './schema';
import { getMovieById, upsertMovies } from './movie-repository';

const createDatabase = (): DatabaseSync => {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
};

const movie: StoredMovieInput = {
  id: 1,
  title: 'Movie',
  original_title: 'Movie',
  original_language: 'en',
  overview: 'Overview',
  release_date: '2020-01-01',
  popularity: 1,
  vote_average: 7,
  vote_count: 1,
  poster_path: null,
  backdrop_path: null,
  runtime_minutes: null,
  budget: null,
  revenue: null,
  collected_at: '2026-11-16T00:00:00.000Z',
};

describe('movie repository', () => {
  it('rolls back all changes when a movie cannot be stored', () => {
    // Arrange
    const database = createDatabase();
    try {
      // Act and assert
      expect(() =>
        upsertMovies(database, [
          movie,
          { ...movie, id: 2, title: null as unknown as string },
        ]),
      ).toThrow(/NOT NULL constraint failed/);
      expect(getMovieById(database, movie.id)).toBeUndefined();
    } finally {
      database.close();
    }
  });
});
