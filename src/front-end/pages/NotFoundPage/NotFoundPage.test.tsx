// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { MemoryRouter } from 'react-router';
import NotFoundPage from './NotFoundPage';

afterEach(cleanup);

describe('NotFoundPage', () => {
  it('renders the not-found message and a link back to popular movies', () => {
    // Arrange: render the page within a router because it contains a Link.
    render(
      <MemoryRouter>
        <NotFoundPage />
      </MemoryRouter>,
    );

    // Act: retrieve the page landmark, heading, description, and navigation link.
    const main = screen.getByRole('main');
    const heading = screen.getByRole('heading', {
      level: 1,
      name: 'Cette page est introuvable',
    });
    const description = screen.getByText(
      "Le film ou la page que vous cherchez n'existe pas, ou a été déplacé.",
    );
    const returnLink = screen.getByRole('link', {
      name: 'Retour aux films populaires',
    });

    // Assert: the page explains the error and provides the expected destination.
    expect(main).toBeTruthy();
    expect(heading).toBeTruthy();
    expect(screen.getByText('TMDB Discovery')).toBeTruthy();
    expect(description).toBeTruthy();
    expect(returnLink.getAttribute('href')).toBe('/movies');
  });
});
