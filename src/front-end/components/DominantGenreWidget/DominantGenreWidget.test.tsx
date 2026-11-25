// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DominantGenreWidget, { formatMovieCount } from './DominantGenreWidget';

afterEach(cleanup);

describe('DominantGenreWidget', () => {
  it('renders the label, genre name and movie count', () => {
    render(
      <DominantGenreWidget
        state="success"
        genreName="Drame"
        movieCount={322}
      />,
    );

    expect(screen.getByText('Widget')).toBeTruthy();
    expect(screen.getByText('Genre dominant')).toBeTruthy();
    expect(screen.getByText('Drame')).toBeTruthy();
    expect(screen.getByText('322 films')).toBeTruthy();
  });

  it('renders singular form for one film', () => {
    render(
      <DominantGenreWidget state="success" genreName="Drame" movieCount={1} />,
    );

    expect(screen.getByText('1 film')).toBeTruthy();
  });

  it('renders large movie counts correctly', () => {
    render(
      <DominantGenreWidget
        state="success"
        genreName="Drame"
        movieCount={12345}
      />,
    );

    expect(screen.getByText('12 345 films')).toBeTruthy();
  });

  it('handles long genre names with ellipsis', () => {
    const longGenreName = 'Science-Fiction et Fantastique Post-Apocalyptique';
    render(
      <DominantGenreWidget
        state="success"
        genreName={longGenreName}
        movieCount={322}
      />,
    );

    const genreElement = screen.getByText(/Science-Fiction/);
    expect(genreElement).toBeTruthy();
    expect(genreElement.getAttribute('title')).toBe(longGenreName);
  });

  it('renders loading state accessibly', () => {
    render(<DominantGenreWidget state="loading" />);

    expect(screen.getByText('Chargement du genre dominant…')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders error state accessibly', () => {
    render(<DominantGenreWidget state="error" />);

    expect(
      screen.getByText('Impossible de récupérer le genre dominant.'),
    ).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renders empty state when no genre is known', () => {
    render(<DominantGenreWidget state="empty" />);

    expect(screen.getByText('Aucun genre connu')).toBeTruthy();
  });

  it('does not render genre data in incomplete states', () => {
    render(<DominantGenreWidget state="empty" />);

    expect(screen.queryByText('Drame')).toBeNull();
    expect(screen.queryByText('322 films')).toBeNull();
  });

  it('formats movie count correctly', () => {
    expect(formatMovieCount(0)).toBe('0 film');
    expect(formatMovieCount(1)).toBe('1 film');
    expect(formatMovieCount(2)).toBe('2 films');
    expect(formatMovieCount(322)).toBe('322 films');
    expect(formatMovieCount(12345)).toBe('12 345 films');
    expect(formatMovieCount(null)).toBe('');
    expect(formatMovieCount(undefined)).toBe('');
  });
});
