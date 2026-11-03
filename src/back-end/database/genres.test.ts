import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it, vi } from 'vitest';
import { initializeSchema } from './schema';
import { updateGenres } from './genres';

const createResponse = (body: unknown, status = 200): Response =>
  new Response(JSON.stringify(body), { status });

describe('updateGenres', () => {
  it('creates new genres and updates existing names from TMDB', async () => {
    const database = new DatabaseSync(':memory:');
    initializeSchema(database);
    database
      .prepare('INSERT INTO genres (id, name) VALUES (?, ?)')
      .run(18, 'Old name');
    const fetchMock = vi.fn(async () =>
      createResponse({
        genres: [
          { id: 18, name: 'Drame' },
          { id: 35, name: 'Comédie' },
        ],
      }),
    );

    try {
      await expect(
        updateGenres(database, 'token', 'fr-FR', fetchMock),
      ).resolves.toBe(2);
      expect(fetchMock).toHaveBeenCalledWith(
        'https://api.themoviedb.org/3/genre/movie/list?language=fr-FR',
        expect.objectContaining({
          headers: expect.objectContaining({
            Authorization: 'Bearer token',
          }),
        }),
      );
      expect(
        database.prepare('SELECT * FROM genres ORDER BY id').all(),
      ).toEqual([
        { id: 18, name: 'Drame' },
        { id: 35, name: 'Comédie' },
      ]);
    } finally {
      database.close();
    }
  });

  it('does not change the database when TMDB returns an error', async () => {
    const database = new DatabaseSync(':memory:');
    initializeSchema(database);
    const fetchMock = vi.fn(async () => createResponse({}, 401));

    try {
      await expect(
        updateGenres(database, 'token', 'fr-FR', fetchMock),
      ).rejects.toThrow('TMDB genres request failed with status 401');
      expect(database.prepare('SELECT * FROM genres').all()).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('rejects malformed TMDB responses', async () => {
    // Arrange: TMDB returns a genre without its required name.
    const database = new DatabaseSync(':memory:');
    initializeSchema(database);
    const fetchMock = vi.fn(async () =>
      createResponse({ genres: [{ id: 18 }] }),
    );

    try {
      // Act and Assert: reject the malformed payload before opening a transaction.
      await expect(
        updateGenres(database, 'token', 'fr-FR', fetchMock),
      ).rejects.toThrow('TMDB genres response has an invalid format');
    } finally {
      database.close();
    }
  });

  it('rolls back all genre changes when a database write fails', async () => {
    // Arrange: force SQLite to reject one genre during the transaction.
    const database = new DatabaseSync(':memory:');
    initializeSchema(database);
    database.exec(`
      CREATE TRIGGER reject_genre_insert
      BEFORE INSERT ON genres
      WHEN NEW.id = 35
      BEGIN
        SELECT RAISE(ABORT, 'genre insert rejected');
      END;
    `);
    const fetchMock = vi.fn(async () =>
      createResponse({
        genres: [
          { id: 18, name: 'Drame' },
          { id: 35, name: 'Comédie' },
        ],
      }),
    );

    try {
      // Act and Assert: propagate the database error and keep the table unchanged.
      await expect(
        updateGenres(database, 'token', 'fr-FR', fetchMock),
      ).rejects.toThrow('genre insert rejected');
      expect(database.prepare('SELECT * FROM genres').all()).toEqual([]);
    } finally {
      database.close();
    }
  });
});
