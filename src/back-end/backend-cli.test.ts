import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_DATABASE_PATH = '/tmp/movies-default.sqlite';

const closeMock = vi.fn();
const importMoviesCsvMock = vi.fn(() => 2);
const readFileSyncMock = vi.fn(() => 'movies csv');
const getDatabaseMock = vi.fn(() => ({
  close: closeMock,
}));

vi.mock('node:fs', () => ({
  readFileSync: readFileSyncMock,
}));

vi.mock('./database/schema.ts', () => ({
  DEFAULT_DATABASE_PATH,
  getDatabase: getDatabaseMock,
}));

vi.mock('./database/movie-csv.ts', () => ({
  importMoviesCsv: importMoviesCsvMock,
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
    importMoviesCsvMock.mockReturnValue(2);
    readFileSyncMock.mockReturnValue('movies csv');
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

  describe('add-movies', () => {
    it('imports movies from the CSV file and closes the database', async () => {
      // Arrange
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      try {
        // Act
        await runCliWithArgs([
          'add-movies',
          './data/movies.csv',
          '--path',
          './data/custom-movies.sqlite',
        ]);

        // Assert
        expect(readFileSyncMock).toHaveBeenCalledWith(
          './data/movies.csv',
          'utf8',
        );
        expect(getDatabaseMock).toHaveBeenCalledWith(
          './data/custom-movies.sqlite',
        );
        expect(importMoviesCsvMock).toHaveBeenCalledWith(
          expect.objectContaining({ close: closeMock }),
          'movies csv',
        );
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          `Imported 2 movie(s) into ${resolve('./data/custom-movies.sqlite')}`,
        );
      } finally {
        logSpy.mockRestore();
      }
    });
  });
});
