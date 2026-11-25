// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import MovieDatabaseWidget from './MovieDatabaseWidget';

afterEach(cleanup);

describe('MovieDatabaseWidget', () => {
  it('renders the number of movies available in the database', () => {
    // Arrange: render the widget with a populated database state.
    render(<MovieDatabaseWidget state="success" movieCount={1248} />);

    // Assert: the widget exposes its title and formatted movie count.
    expect(screen.getByRole('heading', { name: 'Films en base' })).toBeTruthy();
    expect(screen.getByRole('article').textContent).toContain(
      '1 248 films disponibles',
    );

    // Assert: a single available movie uses the singular label.
    cleanup();
    render(<MovieDatabaseWidget state="success" movieCount={1} />);
    expect(screen.getByRole('article').textContent).toContain(
      '1 film disponible',
    );
  });

  it('renders each non-success state with an accessible status', () => {
    // Arrange, act and assert: each state communicates the current situation.
    const states = [
      ['loading', 'Chargement du nombre de films...'],
      ['empty', '0 film disponible'],
      ['error', 'Impossible de récupérer le nombre de films.'],
    ] as const;

    for (const [state, message] of states) {
      render(<MovieDatabaseWidget state={state} />);
      expect(screen.getByText(message)).toBeTruthy();
      cleanup();
    }
  });
});
