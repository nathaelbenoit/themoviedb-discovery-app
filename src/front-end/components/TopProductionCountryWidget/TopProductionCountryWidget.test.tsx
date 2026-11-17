// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import TopProductionCountryWidget from './TopProductionCountryWidget';

afterEach(cleanup);

describe('TopProductionCountryWidget', () => {
  it('renders the supplied country and movie count', () => {
    // Arrange: provide the already aggregated top country result.
    render(
      <TopProductionCountryWidget
        state="success"
        countryName="United States of America"
        movieCount={725}
      />,
    );

    // Assert: the widget displays the country, count and films unit.
    expect(
      screen.getByRole('heading', { name: 'Pays le plus représenté' }),
    ).toBeTruthy();
    expect(screen.getByText('United States of America')).toBeTruthy();
    expect(screen.getByText('725 films')).toBeTruthy();
  });

  it('keeps a long country name readable', () => {
    // Arrange: render a country name that exceeds a typical card width.
    render(
      <TopProductionCountryWidget
        state="success"
        countryName="United Kingdom of Great Britain and Northern Ireland"
        movieCount={142}
      />,
    );

    // Assert: the complete supplied country name remains visible.
    expect(
      screen.getByText('United Kingdom of Great Britain and Northern Ireland'),
    ).toBeTruthy();
  });

  it('renders loading, empty and error states', () => {
    // Arrange, act and assert: each unavailable state communicates its status.
    render(<TopProductionCountryWidget state="loading" />);
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement du pays le plus représenté...',
    );

    cleanup();
    render(<TopProductionCountryWidget state="empty" />);
    expect(screen.getByText('Aucun pays connu.')).toBeTruthy();

    cleanup();
    render(<TopProductionCountryWidget state="error" />);
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de récupérer le pays le plus représenté.',
    );
  });
});
