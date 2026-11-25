// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TopRatedGenreWidget, { formatRating } from './TopRatedGenreWidget';

afterEach(cleanup);

describe('TopRatedGenreWidget', () => {
  it('renders the label, genre name and formatted rating', () => {
    render(
      <TopRatedGenreWidget
        state="success"
        genreName="Animation"
        averageRating={7.41}
      />,
    );

    expect(screen.getByText('Widget')).toBeTruthy();
    expect(screen.getByText('Meilleure note')).toBeTruthy();
    expect(screen.getByText('Animation')).toBeTruthy();
    expect(screen.getByText('7,41 / 10')).toBeTruthy();
    expect(screen.getByText(/Moyenne simple/)).toBeTruthy();
  });

  it('renders rating with exactly two decimal places', () => {
    render(
      <TopRatedGenreWidget
        state="success"
        genreName="Drame"
        averageRating={8.5}
      />,
    );

    expect(screen.getByText('8,50 / 10')).toBeTruthy();
  });

  it('renders large ratings correctly', () => {
    render(
      <TopRatedGenreWidget
        state="success"
        genreName="Drame"
        averageRating={9.99}
      />,
    );

    expect(screen.getByText('9,99 / 10')).toBeTruthy();
  });

  it('handles long genre names with ellipsis', () => {
    const longGenreName = 'Science-Fiction et Fantastique';
    render(
      <TopRatedGenreWidget
        state="success"
        genreName={longGenreName}
        averageRating={7.41}
      />,
    );

    const genreElement = screen.getByText(/Science-Fiction/);
    expect(genreElement).toBeTruthy();
    expect(genreElement.getAttribute('title')).toBe(longGenreName);
  });

  it('renders loading state accessibly', () => {
    render(<TopRatedGenreWidget state="loading" />);

    expect(screen.getByText('Chargement de la meilleure note…')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders error state accessibly', () => {
    render(<TopRatedGenreWidget state="error" />);

    expect(
      screen.getByText('Impossible de récupérer la meilleure note.'),
    ).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renders empty state when no genre is rated', () => {
    render(<TopRatedGenreWidget state="empty" />);

    expect(screen.getByText('Aucun genre noté')).toBeTruthy();
  });

  it('does not render genre data in incomplete states', () => {
    render(<TopRatedGenreWidget state="empty" />);

    expect(screen.queryByText('Animation')).toBeNull();
    expect(screen.queryByText('7,41 / 10')).toBeNull();
  });

  it('formats rating correctly', () => {
    expect(formatRating(7.41)).toBe('7,41 / 10');
    expect(formatRating(8.5)).toBe('8,50 / 10');
    expect(formatRating(9.99)).toBe('9,99 / 10');
    expect(formatRating(10)).toBe('10,00 / 10');
    expect(formatRating(0)).toBe('0,00 / 10');
    expect(formatRating(null)).toBe('');
    expect(formatRating(undefined)).toBe('');
  });

  it('distinguishes between valid zero rating and no rating', () => {
    const { rerender } = render(
      <TopRatedGenreWidget
        state="success"
        genreName="Horror"
        averageRating={0}
      />,
    );
    expect(screen.getByText('0,00 / 10')).toBeTruthy();

    rerender(<TopRatedGenreWidget state="empty" />);
    expect(screen.getByText('Aucun genre noté')).toBeTruthy();
    expect(screen.queryByText('0,00 / 10')).toBeNull();
  });
});
