import type { TmdbMoviesRawResponse, Movie } from './schemas/MoviesTypes';

/**
 * Transforms a TmdbMovie object into a supported Movie object by omitting the 'adult' and 'video' properties.
 * @param movie The raw TmdbMovie object.
 * @returns The supported Movie object.
 */

export const toSupportedMovie = (movie: TmdbMoviesRawResponse['results'][number]): Movie => {
  return {
    backdrop_path: movie.backdrop_path,
    genre_ids: movie.genre_ids,
    id: movie.id,
    original_language: movie.original_language,
    original_title: movie.original_title,
    overview: movie.overview,
    popularity: movie.popularity,
    poster_path: movie.poster_path,
    release_date: movie.release_date,
    title: movie.title,
    vote_average: movie.vote_average,
    vote_count: movie.vote_count
  };
};