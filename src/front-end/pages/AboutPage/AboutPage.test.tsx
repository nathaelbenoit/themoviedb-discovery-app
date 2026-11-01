// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import AboutPage from './AboutPage';

afterEach(cleanup);

describe('AboutPage', () => {
  it('renders the about page content and repository link', () => {
    // Arrange: render the page.
    render(<AboutPage />);

    // Act: retrieve the main content and external repository link.
    const main = screen.getByRole('main');
    const repositoryLink = screen.getByRole('link', {
      name: 'Ouvrir le dépôt GitHub',
    });

    // Assert: the page presents its project overview, stack, and repository.
    expect(main).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        level: 1,
        name: "À propos de l'application",
      }),
    ).toBeTruthy();
    expect(
      screen.getByRole('heading', {
        level: 2,
        name: 'Découvrir, comparer, choisir',
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        /Une application de découverte de films, pensée comme une expérience web claire, rapide et maintenable\./,
      ),
    ).toBeTruthy();

    expect(screen.getByText('TypeScript')).toBeTruthy();
    expect(screen.getByText('React')).toBeTruthy();
    expect(screen.getByText('Node.js + Express')).toBeTruthy();
    expect(screen.getByText('Vite')).toBeTruthy();

    expect(repositoryLink.getAttribute('href')).toBe(
      'https://github.com/alex1dregirard/themoviedb-discovery-app-demo-2026-2027',
    );
    expect(repositoryLink.getAttribute('target')).toBe('_blank');
    expect(repositoryLink.getAttribute('rel')).toBe('noopener noreferrer');
  });
});
