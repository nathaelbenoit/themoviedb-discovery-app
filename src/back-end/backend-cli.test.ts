import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_DATABASE_PATH = '/tmp/movies-default.sqlite';

const closeMock = vi.fn();
const getDatabaseMock = vi.fn(() => ({
  close: closeMock,
}));
const upsertGenresMock = vi.fn();
const deleteUnusedGenresMock = vi.fn(() => 3);

vi.mock('./database/schema.ts', () => ({
  DEFAULT_DATABASE_PATH,
  getDatabase: getDatabaseMock,
}));
vi.mock('./database/genre-repository.ts', () => ({
  deleteUnusedGenres: deleteUnusedGenresMock,
  upsertGenres: upsertGenresMock,
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
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await runCliWithArgs(['create-database']);

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
      const customDatabasePath = './data/custom-movies.sqlite';
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
      try {
        await runCliWithArgs(['create-database', '--path', customDatabasePath]);

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

  it('imports genres into the selected database and closes the connection', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const customDatabasePath = './data/custom-movies.sqlite';
    try {
      await runCliWithArgs([
        '--path',
        customDatabasePath,
        'add-genres',
        './data/genres.csv',
      ]);

      expect(getDatabaseMock).toHaveBeenCalledWith(customDatabasePath);
      expect(upsertGenresMock).toHaveBeenCalledWith(
        expect.anything(),
        expect.arrayContaining([{ id: 28, name: 'Action' }]),
      );
      expect(closeMock).toHaveBeenCalledOnce();
      expect(logSpy).toHaveBeenCalledWith(
        `Imported 19 genre(s) into ${resolve(customDatabasePath)}`,
      );
    } finally {
      logSpy.mockRestore();
    }
  });

  it('cleans unused genres in the selected database and reports the count', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const customDatabasePath = './data/custom-movies.sqlite';
    try {
      await runCliWithArgs(['clean-genres', '--path', customDatabasePath]);

      expect(getDatabaseMock).toHaveBeenCalledWith(customDatabasePath);
      expect(deleteUnusedGenresMock).toHaveBeenCalledOnce();
      expect(closeMock).toHaveBeenCalledOnce();
      expect(logSpy).toHaveBeenCalledWith(
        `Removed 3 unused genre(s) from ${resolve(customDatabasePath)}`,
      );
    } finally {
      logSpy.mockRestore();
    }
  });
});
