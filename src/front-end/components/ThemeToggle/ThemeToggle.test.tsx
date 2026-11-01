import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import ThemeToggle from './ThemeToggle';

describe('ThemeToggle', () => {
  it('renders a moon button in light mode and calls the toggle handler', () => {
    const onToggle = vi.fn();
    const button = ThemeToggle({ theme: 'light', onToggle });
    const markup = renderToStaticMarkup(button);

    expect(markup).toContain('aria-label="Activer le mode sombre"');
    expect(markup).toContain('aria-pressed="false"');
    expect(markup).toContain('M20.9 13A9 9 0 0 1 11 3.1');

    button.props.onClick();
    expect(onToggle).toHaveBeenCalledOnce();
  });

  it('renders a sun button in dark mode', () => {
    const markup = renderToStaticMarkup(
      <ThemeToggle theme="dark" onToggle={vi.fn()} />,
    );

    expect(markup).toContain('aria-label="Activer le mode clair"');
    expect(markup).toContain('aria-pressed="true"');
    expect(markup).toContain('<circle cx="12" cy="12" r="4"></circle>');
  });
});
