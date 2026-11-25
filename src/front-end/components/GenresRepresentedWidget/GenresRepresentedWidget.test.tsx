// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import GenresRepresentedWidget from './GenresRepresentedWidget';

afterEach(cleanup);

describe('GenresRepresentedWidget', () => {
  it('renders the label, subtitle and formatted genre count', () => {
    render(<GenresRepresentedWidget state="success" genreCount={19} />);

    expect(screen.getByText('Widget')).toBeTruthy();
    expect(screen.getByText('Genres représentés')).toBeTruthy();
    expect(screen.getByText('Diversité du catalogue')).toBeTruthy();
    expect(screen.getByText('19 genres')).toBeTruthy();
  });

  it('renders singular form for one genre', () => {
    render(<GenresRepresentedWidget state="success" genreCount={1} />);

    expect(screen.getByText('1 genre')).toBeTruthy();
  });

  it('renders zero as a valid value with singular form', () => {
    render(<GenresRepresentedWidget state="success" genreCount={0} />);

    expect(screen.getByText('0 genre')).toBeTruthy();
  });

  it('distinguishes between zero and missing value', () => {
    const { rerender } = render(
      <GenresRepresentedWidget state="success" genreCount={0} />,
    );

    expect(screen.getByText('0 genre')).toBeTruthy();

    rerender(<GenresRepresentedWidget state="empty" />);

    expect(screen.getByText('Aucune donnée disponible')).toBeTruthy();
    expect(screen.queryByText('0 genre')).toBeNull();
  });

  it('renders loading state accessibly', () => {
    render(<GenresRepresentedWidget state="loading" />);

    expect(screen.getByText('Chargement des genres…')).toBeTruthy();
    expect(screen.getByRole('status')).toBeTruthy();
  });

  it('renders error state accessibly', () => {
    render(<GenresRepresentedWidget state="error" />);

    expect(
      screen.getByText('Impossible de récupérer le nombre de genres.'),
    ).toBeTruthy();
    expect(screen.getByRole('alert')).toBeTruthy();
  });

  it('renders empty state when no data is available', () => {
    render(<GenresRepresentedWidget state="empty" />);

    expect(screen.getByText('Aucune donnée disponible')).toBeTruthy();
  });

  it('renders large genre counts correctly', () => {
    render(<GenresRepresentedWidget state="success" genreCount={1234} />);

    expect(screen.getByText('1 234 genres')).toBeTruthy();
  });

  it('has correct accessibility attributes', () => {
    render(<GenresRepresentedWidget state="success" genreCount={19} />);

    const widget = screen.getByRole('article');
    expect(widget.getAttribute('aria-labelledby')).toBe(
      'genres-represented-widget-title',
    );
    expect(screen.getByText('Genres représentés').id).toBe(
      'genres-represented-widget-title',
    );
  });
});
