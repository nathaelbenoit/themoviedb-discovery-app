import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_DATABASE_PATH = '/tmp/movies-default.sqlite';

const closeMock = vi.fn();
const getDatabaseMock = vi.fn(() => ({
  close: closeMock,
}));
const updateGenresMock = vi.fn(async () => 14);

vi.mock('./database/schema.ts', () => ({
  DEFAULT_DATABASE_PATH,
  getDatabase: getDatabaseMock,
}));

vi.mock('./database/genres.ts', () => ({
  updateGenres: updateGenresMock,
}));

vi.mock('./utils/config.ts', () => ({
  tmdbAccessToken: 'test-access-token',
}));

/**
 * Executes the backend CLI with the specified command-line arguments
 * @param args The command-line arguments to pass to the CLI
 */
async function runCliWithArgs(args: string[]): Promise<void> {
  const originalArgv = process.argv;
  process.argv = ['node', 'src/back-end/backend-cli.ts', ...args];
  try {
    await import('./backend-cli.ts');
  } finally {
    process.argv = originalArgv;
  }
}

describe('backend-cli.ts', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.resetModules();
  });

  describe('create-database', () => {
    it('uses the default database path when the subcommand has no path option', async () => {
      // Arrange: run the database command without an explicit path.
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        // Act: execute the CLI command.
        await runCliWithArgs(['create-database']);

        // Assert: use the configured default and close the database.
        expect(getDatabaseMock).toHaveBeenCalledWith(DEFAULT_DATABASE_PATH);
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          `Database available at ${resolve(DEFAULT_DATABASE_PATH)}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    it('uses the path passed in --path', async () => {
      // Arrange: provide a custom database path.
      const customDatabasePath = './data/custom-movies.sqlite';
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        // Act: execute the CLI command.
        await runCliWithArgs(['create-database', '--path', customDatabasePath]);

        // Assert: forward the custom path and close the database.
        expect(getDatabaseMock).toHaveBeenCalledWith(customDatabasePath);
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          `Database available at ${resolve(customDatabasePath)}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });
  });

  describe('update-genres', () => {
    it('updates genres with the default database path and language', async () => {
      // Arrange: run the genre command with its default options.
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        // Act: execute the CLI command.
        await runCliWithArgs(['update-genres']);

        // Assert: synchronize genres and close the database.
        expect(getDatabaseMock).toHaveBeenCalledWith(DEFAULT_DATABASE_PATH);
        expect(updateGenresMock).toHaveBeenCalledWith(
          expect.objectContaining({ close: closeMock }),
          'test-access-token',
          'fr-FR',
        );
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith('14 genres updated');
      } finally {
        logSpy.mockRestore();
      }
    });

    it('forwards custom database path and language to the genre update', async () => {
      // Arrange: provide custom CLI options.
      const customDatabasePath = './data/custom-movies.sqlite';
      const customLanguage = 'en-US';
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        // Act: execute the CLI command.
        await runCliWithArgs([
          'update-genres',
          '--path',
          customDatabasePath,
          '--language',
          customLanguage,
        ]);

        // Assert: forward both options to the synchronizer.
        expect(getDatabaseMock).toHaveBeenCalledWith(customDatabasePath);
        expect(updateGenresMock).toHaveBeenCalledWith(
          expect.objectContaining({ close: closeMock }),
          'test-access-token',
          customLanguage,
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    it('fails clearly when the TMDB access token is missing', async () => {
      // Arrange: replace the configuration with a missing token.
      vi.doMock('./utils/config.ts', () => ({
        tmdbAccessToken: undefined,
      }));

      // Act and Assert: reject the command before opening the database.
      await expect(runCliWithArgs(['update-genres'])).rejects.toThrow(
        'TMDB_ACCESS_TOKEN is not defined',
      );
      expect(getDatabaseMock).not.toHaveBeenCalled();
    });
  });
});
