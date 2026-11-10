import type { Express, Request, Response } from 'express';
import { tmdbAccessToken } from '../utils/config';
import { toSupportedMovie } from '../utils/converter';
import { createMovieQueryParams } from '../utils/movie-query-params';
import type {
  MoviesApiResponse,
  TmdbMoviesRawResponse,
} from '../types/MoviesTypes';

function getYear(query: Request['query']): string | undefined {
  const { year } = query;
  return typeof year === 'string' &&
    /^\d{4}$/.test(year) &&
    Number(year) >= 1000 &&
    Number(year) <= 9999
    ? year
    : undefined;
}

function createDiscoverQueryParams(query: Request['query']): URLSearchParams {
  const queryParams = createMovieQueryParams(query);
  const year = getYear(query);
  queryParams.set('primary_release_year', year as string);
  return queryParams;
}

export function registerDiscoverApi(app: Express): void {
  app.get(
    '/api/discover/movies',
    async (req: Request, res: Response): Promise<void> => {
      const year = getYear(req.query);
      if (!year) {
        res.status(400).json({
          error:
            'The year query parameter must be a four-digit year between 1000 and 9999',
        });
        return;
      }

      try {
        const queryParams = createDiscoverQueryParams(req.query);
        const response = await fetch(
          `https://api.themoviedb.org/3/discover/movie?${queryParams.toString()}`,
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

        const rawData = (await response.json()) as TmdbMoviesRawResponse;
        const data: MoviesApiResponse = {
          page: rawData.page,
          results: rawData.results.map(toSupportedMovie),
          total_pages: rawData.total_pages,
          total_results: rawData.total_results,
        };

        res.json(data);
      } catch (error) {
        console.error('Error discovering movies:', error);
        res.status(500).json({ error: 'Failed to discover movies' });
      }
    },
  );
}
