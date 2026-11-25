// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import LeastProfitableMovieCard, {
  formatROI,
  type LeastProfitableMovie,
} from './LeastProfitableMovieCard';

afterEach(cleanup);

const movie: LeastProfitableMovie = {
  id: 123,
  title: 'The Least Profitable Movie',
  release_date: '2024-05-10',
  poster_path: '/least-profitable-poster.jpg',
  roi: -100,
};

describe('LeastProfitableMovieCard', () => {
  it('renders the label, poster, title, year, and negative ROI with percentage', () => {
    render(<LeastProfitableMovieCard movie={movie} />);

    expect(screen.getByText('Film le moins rentable')).toBeTruthy();
    expect(
      screen
        .getByRole('img', { name: `Affiche de ${movie.title}` })
        .getAttribute('src'),
    ).toBe('https://image.tmdb.org/t/p/w300/least-profitable-poster.jpg');
    expect(
      screen.getByRole('heading', { level: 2, name: movie.title }),
    ).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('ROI')).toBeTruthy();
    expect(screen.getByText('-100,00 %')).toBeTruthy();
  });

  it('renders zero ROI correctly', () => {
    const movieWithZeroROI: LeastProfitableMovie = {
      ...movie,
      roi: 0,
    };

    render(<LeastProfitableMovieCard movie={movieWithZeroROI} />);

    expect(screen.getByText('0,00 %')).toBeTruthy();
  });

  it('renders fallbacks for a missing poster and unknown ROI', () => {
    const incompleteMovie: LeastProfitableMovie = {
      ...movie,
      poster_path: null,
      roi: null,
    };

    render(<LeastProfitableMovieCard movie={incompleteMovie} />);

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
    render(<LeastProfitableMovieCard movie={movie} />);

    fireEvent.error(
      screen.getByRole('img', { name: `Affiche de ${movie.title}` }),
    );

    expect(
      screen.getByRole('img', { name: 'Affiche indisponible' }),
    ).toBeTruthy();
  });

  it('renders loading and error states accessibly', () => {
    const { rerender } = render(<LeastProfitableMovieCard loading />);

    expect(screen.getByText('Chargement du film…')).toBeTruthy();

    rerender(
      <LeastProfitableMovieCard error="Impossible de charger le film" />,
    );

    expect(screen.getByRole('alert').textContent).toContain(
      'Impossible de charger le film',
    );
  });

  it('formats invalid ROI values as unknown', () => {
    expect(formatROI(null)).toBe('Inconnue');
    expect(formatROI(undefined)).toBe('Inconnue');
    expect(formatROI(Number.NaN)).toBe('Inconnue');
    expect(formatROI(Number.POSITIVE_INFINITY)).toBe('Inconnue');
  });

  it('formats negative ROI with sign preserved', () => {
    expect(formatROI(-100)).toBe('-100,00 %');
    expect(formatROI(-50.5)).toBe('-50,50 %');
    expect(formatROI(-1234.56)).toBe('-1 234,56 %');
  });

  it('formats positive ROI correctly', () => {
    expect(formatROI(100)).toBe('100,00 %');
    expect(formatROI(50.5)).toBe('50,50 %');
  });

  it('handles inaccessible TMDB posters', async () => {
    const brokenPosterMovie: LeastProfitableMovie = {
      ...movie,
      poster_path: '/path-to-a-broken-image.jpg',
    };
    render(<LeastProfitableMovieCard movie={brokenPosterMovie} />);

    const poster = screen.getByRole('img', {
      name: `Affiche de ${movie.title}`,
    });
    expect(poster).toBeTruthy();

    fireEvent.error(poster);

    const fallbackPoster = await screen.findByRole('img', {
      name: 'Affiche indisponible',
    });
    expect(fallbackPoster).toBeTruthy();
  });

  it('renders empty catalogue data and an unknown release year', () => {
    const { rerender } = render(<LeastProfitableMovieCard />);

    expect(screen.getByText('Aucune donnée disponible')).toBeTruthy();

    rerender(
      <LeastProfitableMovieCard
        movie={{ ...movie, title: '', release_date: null, roi: null }}
      />,
    );

    expect(screen.getByText('Titre inconnu')).toBeTruthy();
    expect(screen.getAllByText('Inconnue')).toHaveLength(2);
    expect(screen.getByText('ROI')).toBeTruthy();
  });

  it('does not present null or missing ROI as zero', () => {
    const movieWithNullROI: LeastProfitableMovie = {
      ...movie,
      roi: null,
    };

    render(<LeastProfitableMovieCard movie={movieWithNullROI} />);

    expect(screen.getByText('Inconnue')).toBeTruthy();
    expect(screen.queryByText('0,00 %')).toBeNull();
    expect(screen.queryByText('0 %')).toBeNull();
  });

  it('distinguishes between negative ROI, zero and null values', () => {
    const { rerender } = render(
      <LeastProfitableMovieCard movie={{ ...movie, roi: -100 }} />,
    );
    expect(screen.getByText('-100,00 %')).toBeTruthy();

    rerender(<LeastProfitableMovieCard movie={{ ...movie, roi: 0 }} />);
    expect(screen.getByText('0,00 %')).toBeTruthy();

    rerender(<LeastProfitableMovieCard movie={{ ...movie, roi: null }} />);
    expect(screen.getByText('Inconnue')).toBeTruthy();
  });
});
