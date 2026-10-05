import { beforeEach, describe, expect, it } from 'vitest';
import type {
  TmdbMovieDetails,
  TmdbMoviesRawResponse,
} from './schemas/MoviesTypes';
import { toSupportedMovie, toSupportedMovieDetails } from './utils';

// Define raw TMDB fixtures used by the transformation tests
let rawMovie: TmdbMoviesRawResponse['results'][number];
let rawMovieDetails: TmdbMovieDetails;

describe('utility movie transformations', () => {
  // Reset fixtures before each test to ensure isolation
  beforeEach(() => {
    rawMovie = {
      adult: false,
      backdrop_path: '/backdrop.jpg',
      genre_ids: [18, 878],
      id: 123,
      original_language: 'en',
      original_title: 'Original title',
      overview: 'A movie overview.',
      popularity: 42.5,
      poster_path: '/poster.jpg',
      release_date: '2026-01-15',
      title: 'Movie title',
      video: true,
      vote_average: 8.4,
      vote_count: 1200,
    };

    rawMovieDetails = {
      ...rawMovie,
      genres: [
        { id: 18, name: 'Drama' },
        { id: 878, name: 'Science Fiction' },
      ],
      tagline: 'A memorable tagline.',
      production_companies: [
        {
          id: 1,
          logo_path: '/logo.jpg',
          name: 'Production company',
          origin_country: 'US',
        },
      ],
    };
  });

  describe('toSupportedMovie', () => {
    it('maps every supported movie property', () => {
      expect(toSupportedMovie(rawMovie)).toEqual({
        backdrop_path: '/backdrop.jpg',
        genre_ids: [18, 878],
        id: 123,
        original_language: 'en',
        original_title: 'Original title',
        overview: 'A movie overview.',
        popularity: 42.5,
        poster_path: '/poster.jpg',
        release_date: '2026-01-15',
        title: 'Movie title',
        vote_average: 8.4,
        vote_count: 1200,
      });
    });

    it('omits TMDB metadata that is not supported by the application', () => {
      const movie = toSupportedMovie(rawMovie);

      expect(movie).not.toHaveProperty('adult');
      expect(movie).not.toHaveProperty('video');
    });

    it('preserves nullable paths and empty values', () => {
      const movie = toSupportedMovie({
        ...rawMovie,
        backdrop_path: null,
        genre_ids: [],
        overview: '',
        poster_path: null,
        release_date: '',
      });

      expect(movie.backdrop_path).toBeNull();
      expect(movie.genre_ids).toEqual([]);
      expect(movie.overview).toBe('');
      expect(movie.poster_path).toBeNull();
      expect(movie.release_date).toBe('');
    });
  });

  describe('toSupportedMovieDetails', () => {
    it('maps every supported movie detail property', () => {
      expect(toSupportedMovieDetails(rawMovieDetails)).toEqual({
        backdrop_path: '/backdrop.jpg',
        genres: [
          { id: 18, name: 'Drama' },
          { id: 878, name: 'Science Fiction' },
        ],
        id: 123,
        original_language: 'en',
        original_title: 'Original title',
        overview: 'A movie overview.',
        popularity: 42.5,
        poster_path: '/poster.jpg',
        release_date: '2026-01-15',
        tagline: 'A memorable tagline.',
        title: 'Movie title',
        vote_average: 8.4,
        vote_count: 1200,
      });
    });

    it('omits unsupported TMDB metadata', () => {
      const movieDetails = toSupportedMovieDetails(rawMovieDetails);

      expect(movieDetails).not.toHaveProperty('adult');
      expect(movieDetails).not.toHaveProperty('video');
      expect(movieDetails).not.toHaveProperty('production_companies');
    });

    it('preserves a null tagline and an empty genre list', () => {
      const movieDetails = toSupportedMovieDetails({
        ...rawMovieDetails,
        genres: [],
        tagline: null,
      });

      expect(movieDetails.genres).toEqual([]);
      expect(movieDetails.tagline).toBeNull();
    });
  });
});
