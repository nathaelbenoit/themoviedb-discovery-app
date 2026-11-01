// @vitest-environment jsdom

import { act, cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router';
import type { MovieDetails } from '../../../back-end/types/MoviesTypes';
import MovieDetailPage from './MovieDetailPage';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

const movie = {
  id: 123,
  title: 'Example Movie',
  release_date: '2024-05-10',
  vote_average: 7.456,
  poster_path: '/example-poster.jpg',
  tagline: 'An example tagline',
  genres: [{ id: 1, name: 'Drama' }],
  overview: 'An example movie summary.',
} as MovieDetails;

describe('MovieDetailPage', () => {
  it('shows a loading state and then renders fetched movie details', async () => {
    // Arrange: hold the response pending so the loading state is observable.
    let resolveFetch!: (response: {
      json: () => Promise<MovieDetails>;
    }) => void;
    const fetchMock = vi.fn(
      () =>
        new Promise<{ json: () => Promise<MovieDetails> }>((resolve) => {
          resolveFetch = resolve;
        }),
    );
    vi.stubGlobal('fetch', fetchMock);
    vi.spyOn(console, 'log').mockImplementation(() => {});

    // Act: render the page at a route containing the movie ID.
    render(
      <MemoryRouter initialEntries={['/movies/123']}>
        <Routes>
          <Route path="/movies/:id" element={<MovieDetailPage />} />
        </Routes>
      </MemoryRouter>,
    );

    // Assert: the page initially displays its loading status.
    expect(screen.getByText('Loading...')).toBeTruthy();

    // Act: resolve the API response and wait for React to update.
    await act(async () => {
      resolveFetch({ json: async () => movie });
    });

    // Assert: the page requested the correct movie and displays its details.
    expect(fetchMock).toHaveBeenCalledWith('/api/movies/123');
    expect(
      screen.getByRole('heading', { level: 1, name: movie.title }),
    ).toBeTruthy();
    expect(screen.getByText(movie.tagline!)).toBeTruthy();
    expect(screen.getByText(movie.overview)).toBeTruthy();
    expect(
      screen
        .getByRole('link', {
          name: '← Retour vers les films populaires',
        })
        .getAttribute('href'),
    ).toBe('/movies');
    expect(screen.queryByText('Loading...')).toBeNull();
  });
});
