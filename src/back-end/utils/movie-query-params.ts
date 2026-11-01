import type { Request } from 'express';
import { DEFAULT_LANGUAGE, DEFAULT_PAGE, DEFAULT_REGION } from './constants';

/**
 * Creates a URLSearchParams for the movie query parameters (language, page, region) with default values if not provided.
 * @param query - The query parameters from the Express request.
 * @returns A URLSearchParams object containing the language, page, and region parameters.
 */
export function createMovieQueryParams(
  query: Request['query'],
): URLSearchParams {
  const { language, page, region } = query;
  const queryParams = new URLSearchParams();

  queryParams.append('language', (language as string) || DEFAULT_LANGUAGE);
  queryParams.append('page', (page as string) || String(DEFAULT_PAGE));
  queryParams.append('region', (region as string) || DEFAULT_REGION);

  return queryParams;
}
