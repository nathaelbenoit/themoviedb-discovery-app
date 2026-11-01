// TypeScript
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { dotenvConfigMock } = vi.hoisted(() => ({
  dotenvConfigMock: vi.fn(),
}));

vi.mock('dotenv', () => ({
  default: { config: dotenvConfigMock },
}));

describe('config', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.stubEnv('TMDB_ACCESS_TOKEN', undefined);
    dotenvConfigMock.mockClear();
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('loads dotenv and exports the TMDB access token', async () => {
    // Arrange
    vi.stubEnv('TMDB_ACCESS_TOKEN', 'test-access-token');

    // Act
    const config = await import('./config');

    // Assert
    expect(dotenvConfigMock).toHaveBeenCalledOnce();
    expect(config.tmdbAccessToken).toBe('test-access-token');
  });

  it('throws when the TMDB access token is missing', async () => {
    // Arrange
    // TMDB_ACCESS_TOKEN is unset in beforeEach.

    // Act & Assert
    await expect(import('./config')).rejects.toThrow(
      'TMDB_ACCESS_TOKEN is not defined in the environment variables.',
    );
    expect(dotenvConfigMock).toHaveBeenCalledOnce();
  });
});
