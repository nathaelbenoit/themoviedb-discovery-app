// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TopWeightedGenreWidget, {
  formatWeightedRating,
} from './TopWeightedGenreWidget';

afterEach(cleanup);

describe('TopWeightedGenreWidget', () => {
  it('renders the label, genre name and formatted weighted rating', () => {
    render(
      <TopWeightedGenreWidget
        state="success"
        genreName="Animation"
        weightedRating={7.68}
      />,
    );

    expect(screen.getByText('Widget')).toBeTruthy();
    expect(screen.getByText('Meilleure note pondérée')).toBeTruthy();
    expect(screen.getByText('Animation')).toBeTruthy();
    expect(screen.getByText('7,68 / 10')).toBeTruthy();
    expect(screen.getByText(/Note pondérée/)).toBeTruthy();
  });

  it('renders rating with exactly two decimal places', () => {
    render(
      <TopWeightedGenreWidget
        state="success"
        genreName="Drame"
        weightedRating={8.5}
      />,
    );

    expect(screen.getByText('8,50 / 10')).toBeTruthy();
  });

  it('renders large ratings correctly', () => {
    render(
      <TopWeightedGenreWidget
        state="success"
        genreName="Drame"
        weightedRating={9.99}
      />,
    );

    expect(screen.getByText('9,99 / 10')).toBeTruthy();
  });

  it('handles long genre names with ellipsis', () => {
    const longGenreName = 'Science-Fiction et Fantastique';
    render(
      <TopWeightedGenreWidget
        state="success"
        genreName={longGenreName}
        weightedRating={7.68}
      />,
    );

    const genreElement = screen.getByText(/Science-Fiction/);
    expect(genreElement).toBeTruthy();
    expect(genreElement.getAttribute('title')).toBe(longGenreName);
  });

  it('renders loading state accessibly', () => {
    render(<TopWeightedGenreWidget state="loading" />);

    expect(
      screen.getByText('Chargement de la meilleure note pondérée…'),
    ).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders error state accessibly', () => {
    render(<TopWeightedGenreWidget state="error" />);

    expect(
      screen.getByText('Impossible de récupérer la meilleure note pondérée.'),
    ).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renders empty state when no genre is rated', () => {
    render(<TopWeightedGenreWidget state="empty" />);

    expect(screen.getByText('Aucun genre noté')).toBeTruthy();
  });

  it('does not render genre data in incomplete states', () => {
    render(<TopWeightedGenreWidget state="empty" />);

    expect(screen.queryByText('Animation')).toBeNull();
    expect(screen.queryByText('7,68 / 10')).toBeNull();
  });

  it('formats weighted rating correctly', () => {
    expect(formatWeightedRating(7.68)).toBe('7,68 / 10');
    expect(formatWeightedRating(8.5)).toBe('8,50 / 10');
    expect(formatWeightedRating(9.99)).toBe('9,99 / 10');
    expect(formatWeightedRating(10)).toBe('10,00 / 10');
    expect(formatWeightedRating(0)).toBe('0,00 / 10');
    expect(formatWeightedRating(null)).toBe('');
    expect(formatWeightedRating(undefined)).toBe('');
  });

  it('distinguishes between valid data and empty state', () => {
    const { rerender } = render(
      <TopWeightedGenreWidget
        state="success"
        genreName="Animation"
        weightedRating={7.68}
      />,
    );
    expect(screen.getByText('7,68 / 10')).toBeTruthy();

    rerender(<TopWeightedGenreWidget state="empty" />);
    expect(screen.getByText('Aucun genre noté')).toBeTruthy();
    expect(screen.queryByText('7,68 / 10')).toBeNull();
  });
});
