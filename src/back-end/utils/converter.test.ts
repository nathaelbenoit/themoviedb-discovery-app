import { describe, expect, it } from 'vitest';
import { toSupportedMovie, toSupportedMovieDetails } from './converter';
import type { TmdbMovie, TmdbMovieDetails } from './types/MoviesTypes';

// Mock TMDB movie object for testing.
const mockTmdbMovie: TmdbMovie = {
  adult: false,
  backdrop_path: '/path/to/backdrop.jpg',
  genre_ids: [28, 12],
  id: 12345,
  original_language: 'en',
  original_title: 'Original Title',
  overview: 'This is an overview.',
  popularity: 123.45,
  poster_path: '/path/to/poster.jpg',
  release_date: '2023-01-01',
  title: 'Title',
  video: false,
  vote_average: 7.8,
  vote_count: 1234,
};

// Mock TMDB movie details object for testing.
const mockTmdbMovieDetails: TmdbMovieDetails = {
  adult: false,
  backdrop_path: '/path/to/backdrop.jpg',
  genres: [
    { id: 28, name: 'Action' },
    { id: 12, name: 'Adventure' },
  ],
  id: 12345,
  original_language: 'en',
  original_title: 'Original Title',
  overview: 'This is an overview.',
  popularity: 123.45,
  poster_path: '/path/to/poster.jpg',
  production_companies: [
    { id: 1, name: 'Company 1', logo_path: null, origin_country: 'US' },
  ],
  release_date: '2023-01-01',
  tagline: 'This is a tagline.',
  title: 'Title',
  video: false,
  vote_average: 7.8,
  vote_count: 1234,
};

describe('utils', () => {
  describe('toSupportedMovie', () => {
    it('should convert TMDB movies raw response to supported movie format', () => {
      // Arrange: Prepare the mock TMDB movies raw response.

      // Act: Convert the first movie in the raw response to the supported movie format.
      const result = toSupportedMovie(mockTmdbMovie);

      // Assert: Verify that the conversion result is defined and has the expected ID.
      expect(result).toBeDefined();
      expect(result.id).toBe(mockTmdbMovie.id);

      // Assert: Prepare the expected movie object by omitting the 'adult' and 'video' properties.
      const {
        adult: _adult, // Omit the 'adult' property from the expected movie object.
        video: _video, // Omit the 'video' property from the expected movie object.
        ...expectedMovie
      } = mockTmdbMovie;

      expect(result).toEqual(expectedMovie);
    });
  });

  describe('toSupportedMovieDetails', () => {
    it('should convert TMDB movie details raw response to supported movie details format', () => {
      // Arrange: Prepare the mock TMDB movie details raw response.

      // Act: Convert the mock TMDB movie details to the supported movie details format.
      const result = toSupportedMovieDetails(mockTmdbMovieDetails);

      // Assert: Verify that the conversion result is defined and has the expected ID.
      expect(result).toBeDefined();
      expect(result.id).toBe(mockTmdbMovieDetails.id);

      // Assert: Prepare the expected movie details object by omitting the 'adult' and 'video' properties.
      const {
        adult: _adult, // Omit the 'adult' property from the expected movie details object.
        video: _video, // Omit the 'video' property from the expected movie details object.
        production_companies: _production_companies, // Omit the 'production_companies' property from the expected movie details object.
        ...expectedMovieDetails
      } = mockTmdbMovieDetails;

      expect(result).toEqual(expectedMovieDetails);
    });
  });
});
