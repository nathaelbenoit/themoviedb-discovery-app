import { writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const DEFAULT_DATABASE_PATH = '/tmp/movies-default.sqlite';

const closeMock = vi.fn();
const getDatabaseMock = vi.fn(() => ({
  close: closeMock,
}));
const upsertCountriesMock = vi.fn();
const deleteUnusedCountriesMock = vi.fn(() => 2);

vi.mock('./database/schema.ts', () => ({
  DEFAULT_DATABASE_PATH,
  getDatabase: getDatabaseMock,
}));

vi.mock('./database/country-repository.ts', () => ({
  upsertCountries: upsertCountriesMock,
  deleteUnusedCountries: deleteUnusedCountriesMock,
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

    it('imports countries from a CSV and closes the database', async () => {
      const csvPath = join(tmpdir(), `countries-${Date.now()}.csv`);
      writeFileSync(csvPath, 'code,name\nFR,France\n');
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      try {
        await runCliWithArgs(['add-countries', csvPath]);

        expect(upsertCountriesMock).toHaveBeenCalledWith(
          expect.objectContaining({ close: closeMock }),
          [{ code: 'FR', name: 'France' }],
        );
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('Imported 1 countries'),
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    it('cleans unused countries and reports the deleted count', async () => {
      const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

      try {
        await runCliWithArgs(['clean-countries']);

        expect(deleteUnusedCountriesMock).toHaveBeenCalledWith(
          expect.objectContaining({ close: closeMock }),
        );
        expect(closeMock).toHaveBeenCalledOnce();
        expect(logSpy).toHaveBeenCalledWith(
          expect.stringContaining('Deleted 2 countries'),
        );
      } finally {
        logSpy.mockRestore();
      }
    });

    it('validates the CSV before opening the database', async () => {
      const csvPath = join(tmpdir(), `invalid-countries-${Date.now()}.csv`);
      writeFileSync(csvPath, 'code,name\nfr,France\n');

      await expect(runCliWithArgs(['add-countries', csvPath])).rejects.toThrow(
        'code on data row 2',
      );
      expect(getDatabaseMock).not.toHaveBeenCalled();
    });
  });
});
