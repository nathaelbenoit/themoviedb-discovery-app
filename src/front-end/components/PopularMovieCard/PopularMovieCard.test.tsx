// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import PopularMovieCard, {
  formatPopularity,
  type PopularMovie,
} from './PopularMovieCard';

afterEach(cleanup);

const movie = {
  id: 123,
  title: 'The Very Popular Adventure',
  release_date: '2024-05-10',
  popularity: 1036.49,
  poster_path: '/popular-poster.jpg',
} satisfies PopularMovie;

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
    } satisfies PopularMovie;

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

  it('renders an explicit fallback when the poster fails to load', () => {
    // Arrange: render a movie with an existing poster URL.
    render(<PopularMovieCard movie={movie} />);

    // Act: simulate a network or image decoding failure.
    fireEvent.error(
      screen.getByRole('img', { name: `Affiche de ${movie.title}` }),
    );

    // Assert: the inaccessible poster is replaced by an explicit accessible fallback.
    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
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

  it('handles inaccessible TMDB posters', async () => {
    // Arrange: set up a movie with a broken poster URL.
    const brokenPosterMovie = {
      ...movie,
      poster_path: '/path-to-a-really-broken-image.jpg',
    } satisfies PopularMovie;
    render(<PopularMovieCard movie={brokenPosterMovie} />);

    // Assert: initially, the poster is visible but broken.
    const poster = screen.getByRole('img', {
      name: `Affiche de ${movie.title}`,
    });
    expect(poster).toBeTruthy();
    expect(poster.getAttribute('src')).toContain(
      '/path-to-a-really-broken-image.jpg',
    );

    // Act: simulate the poster failing to load.
    fireEvent.error(poster);

    // Assert: the component falls back to the unavailable poster image.
    const fallbackPoster = await screen.findByRole('img', {
      name: 'Affiche indisponible',
    });
    expect(fallbackPoster).toBeTruthy();
  });

  it('renders empty catalogue data and an unknown release year', () => {
    // Arrange and act: render without a movie, then with a titleless, yearless movie.
    const { rerender } = render(<PopularMovieCard />);

    // Assert: the empty catalogue state is explicit.
    expect(screen.getByText('Aucune donnée disponible')).toBeTruthy();

    rerender(
      <PopularMovieCard movie={{ ...movie, title: '', release_date: null }} />,
    );

    // Assert: the title and release year fallbacks remain readable.
    expect(screen.getByText('Titre inconnu')).toBeTruthy();
    expect(screen.getByText('Inconnue')).toBeTruthy();
  });
});
