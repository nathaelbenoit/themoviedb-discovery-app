import { describe, expect, it } from 'vitest';
import { DEFAULT_LANGUAGE, DEFAULT_PAGE, DEFAULT_REGION } from './constants';
import { createMovieQueryParams } from './movie-query-params';

describe('createMovieQueryParams', () => {
  it('creates URLSearchParams with default values if not provided', () => {
    const query = {};
    const queryParams = createMovieQueryParams(query);
    expect(queryParams.get('language')).toBe(DEFAULT_LANGUAGE);
    expect(queryParams.get('page')).toBe(`${DEFAULT_PAGE}`);
    expect(queryParams.get('region')).toBe(DEFAULT_REGION);
  });

  it('creates URLSearchParams with provided query parameters', () => {
    const query = { language: 'fr-FR', page: '3', region: 'CA' };
    const queryParams = createMovieQueryParams(query);
    expect(queryParams.get('language')).toBe('fr-FR');
    expect(queryParams.get('page')).toBe('3');
    expect(queryParams.get('region')).toBe('CA');
  });
});
