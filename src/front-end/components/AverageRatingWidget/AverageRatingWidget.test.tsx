// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AverageRatingWidget from './AverageRatingWidget';

afterEach(cleanup);

describe('AverageRatingWidget', () => {
  it('renders the supplied simple average with French formatting and its scale', () => {
    // Arrange: provide the simple average calculated for the whole catalogue.
    render(<AverageRatingWidget state="success" averageRating={6.78} />);

    // Assert: the value keeps two decimals, uses the French separator and / 10.
    expect(screen.getByRole('heading', { name: 'Note moyenne' })).toBeTruthy();
    expect(screen.getByText('6,78 / 10')).toBeTruthy();
    expect(screen.getByText('Moyenne simple')).toBeTruthy();
  });

  it('does not turn missing ratings into zero', () => {
    // Arrange: render a catalogue without any rated movie.
    render(<AverageRatingWidget state="empty" />);

    // Assert: missing data is explicit and distinct from a zero rating.
    expect(screen.getByText('Aucune note disponible.')).toBeTruthy();
    expect(screen.queryByText(/0,00 \/ 10/)).toBeNull();
  });

  it('renders loading and error states accessibly', () => {
    // Arrange, act and assert: transient states provide readable feedback.
    render(<AverageRatingWidget state="loading" />);
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement de la note moyenne...',
    );

    cleanup();
    render(<AverageRatingWidget state="error" />);
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de récupérer la note moyenne.',
    );
  });
});
