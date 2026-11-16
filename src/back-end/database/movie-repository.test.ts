import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import type { StoredMovieInput } from '../types/MoviesTypes';
import { initializeSchema } from './schema';
import {
  getMovieById,
  getMovies,
  replaceMovieAssociations,
  upsertMovies,
} from './movie-repository';

const createDatabase = (): DatabaseSync => {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
};

const createMovie = (
  overrides: Partial<StoredMovieInput> = {},
): StoredMovieInput => ({
  id: 640146,
  title: 'Ant-Man',
  original_title: 'Ant-Man',
  original_language: 'en',
  overview: 'A superhero film.',
  release_date: '2023-02-15',
  popularity: 9272.643,
  vote_average: 6.5,
  vote_count: 1856,
  poster_path: '/poster.jpg',
  backdrop_path: '/backdrop.jpg',
  runtime_minutes: 125,
  budget: 200000000,
  revenue: 476071180,
  collected_at: '2026-11-16T00:00:00.000Z',
  ...overrides,
});

describe('movie repository', () => {
  it('finds an inserted movie and returns undefined for an unknown id', () => {
    // Arrange
    const database = createDatabase();
    try {
      const movie = createMovie();

      // Act
      upsertMovies(database, [movie]);

      // Assert
      expect(getMovieById(database, movie.id)).toEqual({
        ...movie,
        release_year: 2023,
      });
      expect(getMovieById(database, 999999)).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('lists movies in ascending id order', () => {
    // Arrange
    const database = createDatabase();
    try {
      upsertMovies(database, [
        createMovie({ id: 2, title: 'Second movie' }),
        createMovie({ id: 1, title: 'First movie' }),
      ]);

      // Assert
      expect(getMovies(database).map(({ id }) => id)).toEqual([1, 2]);
    } finally {
      database.close();
    }
  });

  it('inserts and updates movies without creating duplicates', () => {
    // Arrange
    const database = createDatabase();
    try {
      const movie = createMovie();
      upsertMovies(database, [movie]);

      // Act
      upsertMovies(database, [
        createMovie({ title: 'Updated Ant-Man', vote_average: 7.1 }),
        createMovie({ id: 502356, title: 'The Super Mario Bros. Movie' }),
      ]);

      // Assert
      expect(getMovies(database)).toHaveLength(2);
      expect(getMovieById(database, movie.id)).toMatchObject({
        id: movie.id,
        title: 'Updated Ant-Man',
        vote_average: 7.1,
      });
    } finally {
      database.close();
    }
  });

  it('rolls back all movie changes when an upsert fails', () => {
    // Arrange
    const database = createDatabase();
    try {
      const movie = createMovie();

      // Act and assert
      expect(() =>
        upsertMovies(database, [
          movie,
          createMovie({ id: 502356, title: null as unknown as string }),
        ]),
      ).toThrow(/NOT NULL constraint failed/);
      expect(getMovies(database)).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('replaces movie genre and production country associations', () => {
    const database = createDatabase();
    try {
      upsertMovies(database, [createMovie()]);
      database
        .prepare('INSERT INTO genres (id, name) VALUES (?, ?)')
        .run(18, 'Drama');
      database
        .prepare('INSERT INTO countries (code, name) VALUES (?, ?)')
        .run('FR', 'France');

      replaceMovieAssociations(database, 640146, [18], ['FR']);
      replaceMovieAssociations(database, 640146, [], []);

      expect(database.prepare('SELECT * FROM movie_genres').all()).toEqual([]);
      expect(
        database.prepare('SELECT * FROM production_countries').all(),
      ).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('rolls back association changes when an association is invalid', () => {
    const database = createDatabase();
    try {
      upsertMovies(database, [createMovie()]);

      expect(() =>
        replaceMovieAssociations(database, 640146, [999], []),
      ).toThrow(/FOREIGN KEY constraint failed/);
      expect(database.prepare('SELECT * FROM movie_genres').all()).toEqual([]);
    } finally {
      database.close();
    }
  });
});
