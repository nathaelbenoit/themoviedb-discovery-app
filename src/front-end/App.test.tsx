// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import App from './App';

afterEach(() => {
  cleanup();
  localStorage.clear();
  delete document.documentElement.dataset.theme;
});

vi.mock('./components/Footer/Footer', () => ({
  default: () => <footer>Footer</footer>,
}));
vi.mock('./components/NavBar/NavBar', () => ({
  default: ({
    theme,
    onToggleTheme,
  }: {
    theme: 'light' | 'dark';
    onToggleTheme: () => void;
  }) => (
    <nav>
      <button onClick={onToggleTheme}>Toggle {theme}</button>
    </nav>
  ),
}));
vi.mock('./pages/AboutPage/AboutPage', () => ({
  default: () => <div>About page</div>,
}));
vi.mock('./pages/MovieDetailPage/MovieDetailPage', () => ({
  default: () => <div>Movie detail page</div>,
}));
vi.mock('./pages/MoviesListPage/MoviesListPage', () => ({
  default: () => <div>Movies list page</div>,
}));
vi.mock('./pages/NotFoundPage/NotFoundPage', () => ({
  default: () => <div>Not found page</div>,
}));

describe('App', () => {
  it('redirects the root route to the movies page', () => {
    // Arrange and act
    render(
      <MemoryRouter initialEntries={['/']}>
        <App />
      </MemoryRouter>,
    );

    // Assert: the root route navigates to the movies page.
    expect(screen.getByText('Movies list page')).toBeTruthy();
  });

  it('maps each application route to its corresponding page', () => {
    // Arrange
    const expectedRoutes = [
      { path: '/movies', page: 'Movies list page' },
      { path: '/movies/123', page: 'Movie detail page' },
      { path: '/about', page: 'About page' },
      { path: '/missing', page: 'Not found page' },
    ];

    // Act and assert: each URL displays its configured page.
    for (const { path, page } of expectedRoutes) {
      const { unmount } = render(
        <MemoryRouter initialEntries={[path]}>
          <App />
        </MemoryRouter>,
      );

      expect(screen.getByText(page)).toBeTruthy();
      unmount();
    }
  });

  it('renders the navigation and footer around the route outlet', () => {
    // Arrange and act
    render(
      <MemoryRouter initialEntries={['/movies']}>
        <App />
      </MemoryRouter>,
    );

    // Assert: shared navigation and footer surround the selected page.
    expect(screen.getByRole('button', { name: 'Toggle light' })).toBeTruthy();
    expect(screen.getByText('Movies list page')).toBeTruthy();
    expect(screen.getByText('Footer')).toBeTruthy();
  });

  it('restores a saved theme and toggles between light and dark', () => {
    // Arrange
    localStorage.setItem('theme', 'dark');

    // Act
    render(
      <MemoryRouter initialEntries={['/movies']}>
        <App />
      </MemoryRouter>,
    );

    // Assert: the saved theme is applied and the toggle changes it both ways.
    const darkToggle = screen.getByRole('button', { name: 'Toggle dark' });
    expect(document.documentElement.dataset.theme).toBe('dark');

    fireEvent.click(darkToggle);
    expect(screen.getByRole('button', { name: 'Toggle light' })).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe('light');

    fireEvent.click(screen.getByRole('button', { name: 'Toggle light' }));
    expect(screen.getByRole('button', { name: 'Toggle dark' })).toBeTruthy();
    expect(document.documentElement.dataset.theme).toBe('dark');
  });
});
