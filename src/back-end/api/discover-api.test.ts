import type { Express, Request, RequestHandler, Response } from 'express';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE,
  DEFAULT_REGION,
} from '../utils/constants';
import { registerDiscoverApi } from './discover-api';
import type { TmdbMoviesRawResponse } from '../types/MoviesTypes';

const { toSupportedMovieMock } = vi.hoisted(() => ({
  toSupportedMovieMock: vi.fn(),
}));

vi.mock('../utils/converter', () => ({
  toSupportedMovie: toSupportedMovieMock,
}));

vi.mock('../utils/config', () => ({
  tmdbAccessToken: 'test-access-token',
}));

type RouteHandler = (
  req: Request,
  res: Response,
  next: (error?: unknown) => void,
) => void | Promise<void>;

const handlers = new Map<string, RequestHandler>();
const app = {
  get: (path: string, handler: RequestHandler) => handlers.set(path, handler),
} as unknown as Express;

function getHandler(): RouteHandler {
  const handler = handlers.get('/api/discover/movies');
  if (!handler) throw new Error('Discover route is not registered');
  return handler as RouteHandler;
}

function createResponse() {
  const response = { json: vi.fn(), status: vi.fn() };
  response.status.mockReturnValue(response);
  return response as unknown as Response & {
    json: ReturnType<typeof vi.fn>;
    status: ReturnType<typeof vi.fn>;
  };
}

function tmdbResponse(data: unknown, ok = true, status = 200) {
  return {
    ok,
    status,
    json: vi.fn().mockResolvedValue(data),
  } as unknown as Response;
}

describe('discover API', () => {
  beforeEach(() => {
    handlers.clear();
    registerDiscoverApi(app);
    toSupportedMovieMock.mockReset();
    vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('passes the year and default options to TMDB and converts movies', async () => {
    const rawMovie = { id: 1 };
    const rawData = {
      page: 1,
      results: [rawMovie],
      total_pages: 2,
      total_results: 1,
    } as unknown as TmdbMoviesRawResponse;
    const supportedMovie = { id: 1, title: 'Movie' };
    const fetchMock = vi.fn().mockResolvedValue(tmdbResponse(rawData));
    vi.stubGlobal('fetch', fetchMock);
    toSupportedMovieMock.mockReturnValue(supportedMovie);
    const response = createResponse();

    await getHandler()(
      {
        query: { year: '2020', language: '', page: '', region: '' },
      } as unknown as Request,
      response,
      vi.fn(),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      `https://api.themoviedb.org/3/discover/movie?language=${DEFAULT_LANGUAGE}&page=${DEFAULT_PAGE}&region=${DEFAULT_REGION}&primary_release_year=2020`,
      expect.objectContaining({
        headers: {
          Authorization: 'Bearer test-access-token',
          'Content-Type': 'application/json;charset=utf-8',
        },
      }),
    );
    expect(toSupportedMovieMock.mock.calls[0]?.[0]).toBe(rawMovie);
    expect(response.json).toHaveBeenCalledWith({
      page: 1,
      results: [supportedMovie],
      total_pages: 2,
      total_results: 1,
    });
  });

  it('passes non-empty custom options to TMDB', async () => {
    const rawData = {
      page: 2,
      results: [],
      total_pages: 4,
      total_results: 0,
    } as unknown as TmdbMoviesRawResponse;
    const fetchMock = vi.fn().mockResolvedValue(tmdbResponse(rawData));
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await getHandler()(
      {
        query: {
          year: '2020',
          language: 'en-US',
          page: '2',
          region: 'US',
        },
      } as unknown as Request,
      response,
      vi.fn(),
    );

    expect(fetchMock).toHaveBeenCalledWith(
      'https://api.themoviedb.org/3/discover/movie?language=en-US&page=2&region=US&primary_release_year=2020',
      expect.anything(),
    );
    expect(response.json).toHaveBeenCalledWith({
      page: 2,
      results: [],
      total_pages: 4,
      total_results: 0,
    });
  });

  it.each([
    undefined,
    '',
    '999',
    '10000',
    '20a0',
    ['2020', '2021'],
    { value: '2020' },
  ])('rejects invalid year %s without calling TMDB', async (year) => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const response = createResponse();

    await getHandler()(
      { query: { year } } as unknown as Request,
      response,
      vi.fn(),
    );

    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({
      error:
        'The year query parameter must be a four-digit year between 1000 and 9999',
    });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it.each(['http', 'network', 'json'])(
    'returns a 500 and logs %s failures',
    async (failure) => {
      const fetchMock = vi.fn();
      if (failure === 'http') {
        fetchMock.mockResolvedValue(tmdbResponse({}, false, 503));
      } else if (failure === 'network') {
        fetchMock.mockRejectedValue(new Error('Network error'));
      } else {
        fetchMock.mockResolvedValue({
          ok: true,
          status: 200,
          json: vi.fn().mockRejectedValue(new Error('Invalid JSON')),
        });
      }
      vi.stubGlobal('fetch', fetchMock);
      const response = createResponse();
      const errorSpy = vi.spyOn(console, 'error');

      await getHandler()(
        { query: { year: '2020' } } as unknown as Request,
        response,
        vi.fn(),
      );

      expect(response.status).toHaveBeenCalledWith(500);
      expect(response.json).toHaveBeenCalledWith({
        error: 'Failed to discover movies',
      });
      expect(errorSpy).toHaveBeenCalled();
    },
  );
});
