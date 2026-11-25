// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MostProfitableMovieCard, {
  formatROI,
  type MostProfitableMovie,
} from './MostProfitableMovieCard';

afterEach(cleanup);

/**
 * Film de test avec ROI de 69 667,36 % comme spécifié dans le ticket
 */
const movie = {
  id: 123,
  title: 'The Most Profitable Movie',
  release_date: '2024-05-10',
  poster_path: '/profitable-poster.jpg',
  roi: 69667.36,
} satisfies MostProfitableMovie;

describe('MostProfitableMovieCard', () => {
  it('renders the label, poster, title, year, and formatted ROI with percentage', () => {
    // Arrange: prepare a representative profitable movie with the example ROI from ticket

    // Act: render the nominal card state
    render(<MostProfitableMovieCard movie={movie} />);

    // Assert: the label, poster, title, year and ROI are presented correctly
    expect(screen.getByText('Film le plus rentable')).toBeTruthy();
    expect(
      screen
        .getByRole('img', { name: `Affiche de ${movie.title}` })
        .getAttribute('src'),
    ).toBe('https://image.tmdb.org/t/p/w300/profitable-poster.jpg');
    expect(
      screen.getByRole('heading', { level: 2, name: movie.title }),
    ).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('ROI')).toBeTruthy();
    // ROI de 69 667,36 % formaté avec deux décimales
    expect(screen.getByText('69 667,36 %')).toBeTruthy();
  });

  it('renders fallbacks for a missing poster and unknown ROI', () => {
    // Arrange: remove optional poster and roi values
    const incompleteMovie = {
      ...movie,
      poster_path: null,
      roi: null,
    } satisfies MostProfitableMovie;

    // Act: render the incomplete card state
    render(<MostProfitableMovieCard movie={incompleteMovie} />);

    // Assert: no poster image is rendered and the ROI is clearly unknown
    expect(
      screen.queryByRole('img', { name: `Affiche de ${movie.title}` }),
    ).toBeNull();
    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
    expect(screen.getByText('Inconnue')).toBeTruthy();
    expect(screen.getByText('ROI')).toBeTruthy();
  });

  it('renders an explicit fallback when the poster fails to load', () => {
    // Arrange: render a movie with an existing poster URL
    render(<MostProfitableMovieCard movie={movie} />);

    // Act: simulate a network or image decoding failure
    fireEvent.error(
      screen.getByRole('img', { name: `Affiche de ${movie.title}` }),
    );

    // Assert: the inaccessible poster is replaced by an explicit accessible fallback
    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
  });

  it('renders loading and error states accessibly', () => {
    // Arrange and act: render each state separately
    const { rerender } = render(<MostProfitableMovieCard loading />);

    // Assert: loading is announced by its busy article
    expect(screen.getByText('Chargement du film…')).toBeTruthy();

    // Arrange and act: replace loading with an error state
    rerender(<MostProfitableMovieCard error="Impossible de charger le film" />);

    // Assert: the error is exposed as an alert
    expect(screen.getByRole('alert').textContent).toContain(
      'Impossible de charger le film',
    );
  });

  it('formats invalid ROI values as unknown', () => {
    // Arrange and act: call the formatter for a missing value

    // Assert: unknown values never masquerade as zero or valid percentages
    expect(formatROI(null)).toBe('Inconnue');
    expect(formatROI(undefined)).toBe('Inconnue');
    expect(formatROI(Number.NaN)).toBe('Inconnue');
    expect(formatROI(Number.POSITIVE_INFINITY)).toBe('Inconnue');
  });

  it('formats ROI with exactly two decimal places and percentage symbol', () => {
    // Arrange and act: test various ROI values

    // Assert: all values are formatted with exactly two decimal places and % symbol
    expect(formatROI(0)).toBe('0,00 %');
    expect(formatROI(100)).toBe('100,00 %');
    expect(formatROI(123.4)).toBe('123,40 %');
    expect(formatROI(69667.36)).toBe('69 667,36 %');
    expect(formatROI(123456.789)).toBe('123 456,79 %');
  });

  it('handles inaccessible TMDB posters', async () => {
    // Arrange: set up a movie with a broken poster URL
    const brokenPosterMovie = {
      ...movie,
      poster_path: '/path-to-a-really-broken-image.jpg',
    } satisfies MostProfitableMovie;
    render(<MostProfitableMovieCard movie={brokenPosterMovie} />);

    // Assert: initially, the poster is visible but broken
    const poster = screen.getByRole('img', {
      name: `Affiche de ${movie.title}`,
    });
    expect(poster).toBeTruthy();
    expect(poster.getAttribute('src')).toContain(
      '/path-to-a-really-broken-image.jpg',
    );

    // Act: simulate the poster failing to load
    fireEvent.error(poster);

    // Assert: the component falls back to the unavailable poster image
    const fallbackPoster = await screen.findByRole('img', {
      name: 'Affiche indisponible',
    });
    expect(fallbackPoster).toBeTruthy();
  });

  it('renders empty catalogue data and an unknown release year', () => {
    // Arrange and act: render without a movie, then with a titleless, yearless movie
    const { rerender } = render(<MostProfitableMovieCard />);

    // Assert: the empty catalogue state is explicit
    expect(screen.getByText('Aucune donnée disponible')).toBeTruthy();

    rerender(
      <MostProfitableMovieCard
        movie={{ ...movie, title: '', release_date: null, roi: null }}
      />,
    );

    // Assert: the title and release year fallbacks remain readable
    expect(screen.getByText('Titre inconnu')).toBeTruthy();
    // There are two "Inconnue" values: one for year, one for ROI
    expect(screen.getAllByText('Inconnue')).toHaveLength(2);
    expect(screen.getByText('ROI')).toBeTruthy();
  });

  it('does not present null or missing ROI as zero', () => {
    // Arrange: movie with null ROI
    const movieWithNullROI = {
      ...movie,
      roi: null,
    } satisfies MostProfitableMovie;

    // Act: render the card
    render(<MostProfitableMovieCard movie={movieWithNullROI} />);

    // Assert: ROI is shown as "Inconnue", not as "0,00 %"
    expect(screen.getByText('Inconnue')).toBeTruthy();
    expect(screen.queryByText('0,00 %')).toBeNull();
    expect(screen.queryByText('0 %')).toBeNull();
  });
});
