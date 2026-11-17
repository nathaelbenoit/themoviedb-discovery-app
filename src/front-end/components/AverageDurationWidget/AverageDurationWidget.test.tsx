// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AverageDurationWidget from './AverageDurationWidget';

afterEach(cleanup);

describe('AverageDurationWidget', () => {
  it('renders the supplied average duration with its unit', () => {
    // Arrange: provide the calculated average duration from the catalogue.
    render(<AverageDurationWidget state="success" averageDuration={107} />);

    // Assert: the title, value and minute unit are visible.
    expect(screen.getByRole('heading', { name: 'Durée moyenne' })).toBeTruthy();
    expect(screen.getByText('107 min')).toBeTruthy();
  });

  it('does not turn a missing duration into zero', () => {
    // Arrange: render a catalogue without a valid duration.
    render(<AverageDurationWidget state="empty" />);

    // Assert: the empty state is explicit and no zero value is displayed.
    expect(screen.getByText('Aucune durée disponible.')).toBeTruthy();
    expect(screen.queryByText(/0 min/)).toBeNull();
  });

  it('renders loading and error states accessibly', () => {
    // Arrange, act and assert: transient states provide readable feedback.
    render(<AverageDurationWidget state="loading" />);
    expect(screen.getByRole('status').textContent).toBe(
      'Chargement de la durée moyenne...',
    );

    cleanup();
    render(<AverageDurationWidget state="error" />);
    expect(screen.getByRole('alert').textContent).toBe(
      'Impossible de récupérer la durée moyenne.',
    );
  });
});
