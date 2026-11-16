// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import DashboardPage from './DashboardPage';

afterEach(cleanup);

describe('DashboardPage', () => {
  it('renders the movie dashboard with an explicit empty widget state', () => {
    // Arrange and act: render the dashboard before any widget is configured.
    render(<DashboardPage />);

    // Assert: the page remains available and explains that no widget is configured.
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Tableau de bord des films',
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: "Aucun widget n'est configuré",
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Les widgets du tableau de bord seront disponibles prochainement.',
      ),
    ).toBeTruthy();
  });
});
