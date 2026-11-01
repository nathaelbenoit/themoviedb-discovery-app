// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import NavBar from './NavBar';

afterEach(cleanup);

function renderNavBar(path: string) {
  return render(
    <MemoryRouter initialEntries={[path]}>
      <NavBar />
    </MemoryRouter>,
  );
}

describe('NavBar', () => {
  it('renders the navigation landmark, brand, and destination links', () => {
    // Arrange: render the navigation with the movies route selected.

    // Act
    renderNavBar('/movies');

    // Assert: the navigation, brand, destination URLs, and selected link are available to users.
    expect(
      screen.getByRole('navigation', { name: 'Main navigation' }),
    ).toBeTruthy();
    expect(screen.getByText('TMDB Discovery')).not.toBeNull();
    const moviesLink = screen.getByRole('link', { name: 'Films populaires' });
    const aboutLink = screen.getByRole('link', { name: 'À propos' });
    expect(moviesLink.getAttribute('href')).toBe('/movies');
    expect(aboutLink.getAttribute('href')).toBe('/about');
    expect(moviesLink.getAttribute('aria-current')).toBe('page');
    expect(aboutLink.getAttribute('aria-current')).toBeNull();
  });

  it('marks À propos active on the about route', () => {
    // Arrange: render the navigation on its about destination.

    // Act
    renderNavBar('/about');

    // Assert: À propos is the current page and Films populaires is not.
    expect(
      screen
        .getByRole('link', { name: 'Films populaires' })
        .getAttribute('aria-current'),
    ).toBeNull();
    expect(
      screen
        .getByRole('link', { name: 'À propos' })
        .getAttribute('aria-current'),
    ).toBe('page');
  });
});
