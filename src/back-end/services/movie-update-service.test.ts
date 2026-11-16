import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it, vi } from 'vitest';
import { initializeSchema } from '../database/schema';
import { upsertMovies } from '../database/movie-repository';
import type { StoredMovieInput, TmdbMovieDetails } from '../types/MoviesTypes';
import {
  createTmdbMovieUpdateApi,
  updateMovieDatabase,
} from './movie-update-service';

const createDatabase = (): DatabaseSync => {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
};

const createMovie = (id: number): StoredMovieInput => ({
  id,
  title: `Movie ${id}`,
  original_title: `Movie ${id}`,
  original_language: 'en',
  overview: 'Overview',
  release_date: '2020-01-01',
  popularity: 1,
  vote_average: 7,
  vote_count: 10,
  poster_path: null,
  backdrop_path: null,
  runtime_minutes: null,
  budget: null,
  revenue: null,
  collected_at: '2026-01-01T00:00:00.000Z',
});

const createDetails = (
  id: number,
  overrides: Partial<TmdbMovieDetails> = {},
): TmdbMovieDetails => ({
  adult: false,
  backdrop_path: '/backdrop.jpg',
  id,
  original_language: 'en',
  original_title: `Movie ${id}`,
  overview: 'Updated overview',
  popularity: 10,
  poster_path: '/poster.jpg',
  release_date: '2021-02-02',
  title: `Updated movie ${id}`,
  video: false,
  vote_average: 8,
  vote_count: 100,
  genres: [{ id: 18, name: 'Drama' }],
  tagline: null,
  production_companies: [],
  runtime: 120,
  budget: 1000,
  revenue: 2000,
  production_countries: [{ iso_3166_1: 'FR', name: 'France' }],
  ...overrides,
});

describe('movie update service', () => {
  it('updates movies and their genre and country associations', async () => {
    // Arrange
    const database = createDatabase();
    try {
      upsertMovies(database, [createMovie(1), createMovie(2)]);
      const api = {
        getMovieDetails: vi
          .fn()
          .mockResolvedValueOnce(createDetails(1))
          .mockResolvedValueOnce(
            createDetails(2, {
              genres: [{ id: 35, name: 'Comedy' }],
              production_countries: undefined,
              runtime: 0,
              budget: undefined,
              revenue: null,
            }),
          ),
      };

      // Act
      const result = await updateMovieDatabase(
        database,
        api,
        '2026-11-16T00:00:00.000Z',
      );

      // Assert
      expect(result).toEqual({ movies: 2, genres: 2, countries: 1 });
      expect(api.getMovieDetails).toHaveBeenNthCalledWith(1, 1);
      expect(api.getMovieDetails).toHaveBeenNthCalledWith(2, 2);
      expect(
        database.prepare('SELECT title, budget FROM movies').all(),
      ).toEqual([
        { title: 'Updated movie 1', budget: 1000 },
        { title: 'Updated movie 2', budget: null },
      ]);
      expect(database.prepare('SELECT id, name FROM genres').all()).toEqual([
        { id: 18, name: 'Drama' },
        { id: 35, name: 'Comedy' },
      ]);
      expect(
        database
          .prepare('SELECT movie_id, country_code FROM production_countries')
          .all(),
      ).toEqual([{ movie_id: 1, country_code: 'FR' }]);
    } finally {
      database.close();
    }
  });

  it('returns empty counts when the database has no movies', async () => {
    // Arrange
    const database = createDatabase();
    try {
      // Act
      const result = await updateMovieDatabase(database, {
        getMovieDetails: vi.fn(),
      });

      // Assert
      expect(result).toEqual({ movies: 0, genres: 0, countries: 0 });
    } finally {
      database.close();
    }
  });

  it('fetches movie details with the TMDB authorization header', async () => {
    // Arrange
    const details = createDetails(42);
    const fetchImplementation = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(details),
    });
    const api = createTmdbMovieUpdateApi(fetchImplementation);

    // Act
    const result = await api.getMovieDetails(42);

    // Assert
    expect(result).toBe(details);
    expect(fetchImplementation).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/movie/42?language=fr-FR',
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: expect.stringMatching(/^Bearer .+/),
        }),
      }),
    );
  });

  it('reports TMDB failures when fetching movie details', async () => {
    // Arrange
    const api = createTmdbMovieUpdateApi(
      vi.fn().mockResolvedValue({ ok: false, status: 503 }),
    );

    // Act and assert
    await expect(api.getMovieDetails(42)).rejects.toThrow(
      'TMDB API request failed with status 503',
    );
  });
});
