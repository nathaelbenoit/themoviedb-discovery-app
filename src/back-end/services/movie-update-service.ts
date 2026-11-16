import type { DatabaseSync } from 'node:sqlite';
import {
  getMovies,
  replaceMovieAssociations,
  upsertMovies,
} from '../database/movie-repository.ts';
import { upsertCountries } from '../database/country-repository.ts';
import { upsertGenres } from '../database/genre-repository.ts';
import { tmdbAccessToken } from '../utils/config.ts';
import { DEFAULT_LANGUAGE } from '../utils/constants.ts';
import type { Country } from '../types/CountriesTypes.ts';
import type {
  StoredMovieInput,
  TmdbMovieDetails,
} from '../types/MoviesTypes.ts';
import type { Genre } from '../types/GenresTypes.ts';

export type MovieUpdateApi = {
  getMovieDetails(movieId: number): Promise<TmdbMovieDetails>;
};

export type MovieUpdateResult = {
  movies: number;
  genres: number;
  countries: number;
};

function positiveValue(value: number | null | undefined): number | null {
  return value && value > 0 ? value : null;
}

function toStoredMovie(
  details: TmdbMovieDetails,
  collectedAt: string,
): StoredMovieInput {
  return {
    id: details.id,
    title: details.title,
    original_title: details.original_title,
    original_language: details.original_language,
    overview: details.overview,
    release_date: details.release_date || null,
    popularity: details.popularity,
    vote_average: details.vote_average,
    vote_count: details.vote_count,
    poster_path: details.poster_path,
    backdrop_path: details.backdrop_path,
    runtime_minutes: positiveValue(details.runtime),
    budget: positiveValue(details.budget),
    revenue: positiveValue(details.revenue),
    collected_at: collectedAt,
  };
}

export function createTmdbMovieUpdateApi(
  fetchImplementation: typeof fetch = fetch,
): MovieUpdateApi {
  return {
    async getMovieDetails(movieId: number): Promise<TmdbMovieDetails> {
      const response = await fetchImplementation(
        `https://api.themoviedb.org/3/movie/${movieId}?language=${DEFAULT_LANGUAGE}`,
        {
          headers: {
            Authorization: `Bearer ${tmdbAccessToken}`,
            'Content-Type': 'application/json;charset=utf-8',
          },
        },
      );

      if (!response.ok) {
        throw new Error(
          `TMDB API request failed with status ${response.status}`,
        );
      }

      return (await response.json()) as TmdbMovieDetails;
    },
  };
}

export async function updateMovieDatabase(
  database: DatabaseSync,
  api: MovieUpdateApi = createTmdbMovieUpdateApi(),
  collectedAt = new Date().toISOString(),
): Promise<MovieUpdateResult> {
  const details = [];
  for (const movie of getMovies(database)) {
    details.push(await api.getMovieDetails(movie.id));
  }

  const genres = new Map<number, Genre>();
  const countries = new Map<string, Country>();
  for (const movie of details) {
    for (const genre of movie.genres) {
      genres.set(genre.id, genre);
    }
    for (const country of movie.production_countries ?? []) {
      countries.set(country.iso_3166_1, {
        code: country.iso_3166_1,
        name: country.name,
      });
    }
  }

  upsertGenres(database, genres.values());
  upsertCountries(database, countries.values());
  upsertMovies(
    database,
    details.map((movie) => toStoredMovie(movie, collectedAt)),
  );
  for (const movie of details) {
    replaceMovieAssociations(
      database,
      movie.id,
      movie.genres.map(({ id }) => id),
      (movie.production_countries ?? []).map(({ iso_3166_1 }) => iso_3166_1),
    );
  }

  return {
    movies: details.length,
    genres: genres.size,
    countries: countries.size,
  };
}
