// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { Movie } from '../../../back-end/types/MoviesTypes';
import PopularMovieCard, { formatPopularity } from './PopularMovieCard';

afterEach(cleanup);

const movie = {
  id: 123,
  title: 'The Very Popular Adventure',
  release_date: '2024-05-10',
  popularity: 1036.49,
  poster_path: '/popular-poster.jpg',
} as Movie;

describe('PopularMovieCard', () => {
  it('renders the label, poster, title, year, and formatted popularity', () => {
    // Arrange: prepare a representative popular movie.

    // Act: render the nominal card state.
    render(<PopularMovieCard movie={movie} />);

    // Assert: the TMDB popularity is presented distinctly and with two decimals.
    expect(screen.getByText('Film le plus populaire')).toBeTruthy();
    expect(
      screen
        .getByRole('img', { name: `Affiche de ${movie.title}` })
        .getAttribute('src'),
    ).toBe('https://image.tmdb.org/t/p/w300/popular-poster.jpg');
    expect(
      screen.getByRole('heading', { level: 2, name: movie.title }),
    ).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('Popularité')).toBeTruthy();
    expect(screen.getByText('1 036,49')).toBeTruthy();
  });

  it('renders fallbacks for a missing poster and unknown popularity', () => {
    // Arrange: remove optional poster and popularity values.
    const incompleteMovie = {
      ...movie,
      poster_path: null,
      popularity: null,
    } as unknown as Movie;

    // Act: render the incomplete card state.
    render(<PopularMovieCard movie={incompleteMovie} />);

    // Assert: no poster image is rendered and the popularity is clearly unknown.
    expect(
      screen.queryByRole('img', { name: `Affiche de ${movie.title}` }),
    ).toBeNull();
    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
    expect(screen.getByText('Inconnue')).toBeTruthy();
  });

  it('renders loading and error states accessibly', () => {
    // Arrange and act: render each state separately.
    const { rerender } = render(<PopularMovieCard loading />);

    // Assert: loading is announced by its busy article.
    expect(screen.getByText('Chargement du film…')).toBeTruthy();

    // Arrange and act: replace loading with an error state.
    rerender(<PopularMovieCard error="Impossible de charger le film" />);

    // Assert: the error is exposed as an alert.
    expect(screen.getByRole('alert').textContent).toContain(
      'Impossible de charger le film',
    );
  });

  it('formats invalid popularity values as unknown', () => {
    // Arrange and act: call the formatter for a missing value.

    // Assert: unknown values never masquerade as ratings or vote counts.
    expect(formatPopularity(null)).toBe('Inconnue');
    expect(formatPopularity(Number.NaN)).toBe('Inconnue');
  });
});
