import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import type { Genre } from '../types/GenresTypes';
import { initializeSchema } from './schema';
import {
  deleteUnusedGenres,
  getGenreById,
  getGenres,
  upsertGenres,
} from './genre-repository';

const createDatabase = (): DatabaseSync => {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
};

describe('genre repository', () => {
  it('finds an existing genre and returns undefined for an unknown id', () => {
    const database = createDatabase();
    try {
      upsertGenres(database, [{ id: 18, name: 'Drame' }]);

      expect(getGenreById(database, 18)).toEqual({ id: 18, name: 'Drame' });
      expect(getGenreById(database, 35)).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('lists genres in ascending id order', () => {
    const database = createDatabase();
    try {
      upsertGenres(database, [
        { id: 35, name: 'Comédie' },
        { id: 18, name: 'Drame' },
      ]);

      expect(getGenres(database)).toEqual([
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);
    } finally {
      database.close();
    }
  });

  it('inserts and updates genres without creating duplicates', () => {
    const database = createDatabase();
    try {
      upsertGenres(database, [{ id: 18, name: 'Drama' }]);
      upsertGenres(database, [
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);

      expect(getGenres(database)).toEqual([
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);
    } finally {
      database.close();
    }
  });

  it('accepts arrays and other iterables, keeps the last repeated label, and ignores empty input', () => {
    const database = createDatabase();
    try {
      const genres = new Set<Genre>([
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);
      upsertGenres(database, genres);
      upsertGenres(
        database,
        (function* () {
          yield { id: 18, name: 'Drama' };
          yield { id: 18, name: 'Drame' };
        })(),
      );
      upsertGenres(database, []);

      expect(getGenres(database)).toEqual([
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);
    } finally {
      database.close();
    }
  });

  it('enforces the required genre name', () => {
    const database = createDatabase();
    try {
      expect(() =>
        upsertGenres(database, [{ id: 18, name: null as unknown as string }]),
      ).toThrow(/NOT NULL constraint failed/);
      expect(getGenres(database)).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('deletes only genres without a movie association', () => {
    const database = createDatabase();
    try {
      database
        .prepare(
          'INSERT INTO movies (id, title, original_title, original_language, overview, collected_at) VALUES (?, ?, ?, ?, ?, ?)',
        )
        .run(1, 'Movie', 'Movie', 'en', '', '2026-01-01');
      upsertGenres(database, [
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);
      database
        .prepare('INSERT INTO movie_genres (movie_id, genre_id) VALUES (?, ?)')
        .run(1, 18);

      expect(deleteUnusedGenres(database)).toBe(1);
      expect(getGenres(database)).toEqual([{ id: 18, name: 'Drame' }]);
    } finally {
      database.close();
    }
  });

  it('rolls back when deleting unused genres fails', () => {
    const database = createDatabase();
    try {
      database.exec('DROP TABLE movie_genres');

      expect(() => deleteUnusedGenres(database)).toThrow(/no such table/);
    } finally {
      database.close();
    }
  });
});
