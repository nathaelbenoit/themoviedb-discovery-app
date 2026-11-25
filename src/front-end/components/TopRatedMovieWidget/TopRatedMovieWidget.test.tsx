// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TopRatedMovieWidget from './TopRatedMovieWidget';

afterEach(cleanup);

const movie = {
  title: 'The Shawshank Redemption',
  releaseYear: 1994,
  rating: 9.1,
  posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
};

describe('TopRatedMovieWidget', () => {
  it('renders the supplied movie details and accessible poster', () => {
    // Arrange: provide the best rated movie from the catalogue.
    render(<TopRatedMovieWidget state="success" movie={movie} />);

    // Assert: the card exposes its title, year, rating scale and poster.
    expect(
      screen.getByRole('heading', { name: 'Film le mieux noté' }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', { level: 3, name: movie.title }),
    ).toBeTruthy();
    expect(screen.getByText('1994 · 9,1 / 10')).toBeTruthy();
    expect(
      screen.getByRole('img', { name: `Affiche de ${movie.title}` }),
    ).toBeTruthy();
  });

  it('renders an explicit fallback for a missing or inaccessible poster', () => {
    // Arrange: render without a poster path.
    render(
      <TopRatedMovieWidget
        state="success"
        movie={{ ...movie, posterPath: null, releaseYear: null }}
      />,
    );

    // Assert: the fallback and unknown year remain accessible.
    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
    expect(screen.getByText('Année inconnue · 9,1 / 10')).toBeTruthy();

    cleanup();
    render(<TopRatedMovieWidget state="success" movie={movie} />);
    fireEvent.error(
      screen.getByRole('img', { name: `Affiche de ${movie.title}` }),
    );
    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
  });

  it('renders loading, empty and error states', () => {
    // Arrange, act and assert: unavailable states provide readable feedback.
    render(<TopRatedMovieWidget state="loading" />);
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du film le mieux noté...',
    );

    cleanup();
    render(<TopRatedMovieWidget state="empty" />);
    expect(screen.getByText('Aucun film noté disponible.')).toBeTruthy();

    cleanup();
    render(<TopRatedMovieWidget state="error" />);
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de récupérer le film le mieux noté.',
    );
  });
});
