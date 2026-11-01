// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import Footer from './Footer';

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

describe('Footer', () => {
  it('renders the application name and version', () => {
    // Arrange: provide the version normally injected by the Vite build.
    const appVersion = '1.2.3';
    vi.stubGlobal('__APP_VERSION__', appVersion);

    // Act: render the footer.
    render(<Footer />);

    // Assert: the footer landmark displays the application name and version.
    const footer = screen.getByRole('contentinfo');

    expect(footer).toBeTruthy();
    expect(screen.getByText('TMDB Discovery')).toBeTruthy();
    expect(screen.getByText(`Version ${appVersion}`)).toBeTruthy();
  });
});
