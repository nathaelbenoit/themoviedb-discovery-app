#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { importMoviesCsv } from './database/movie-csv.ts';
import {
  deleteUnusedCountries,
  upsertCountries,
} from './database/country-repository.ts';
import {
  deleteUnusedGenres,
  upsertGenres,
} from './database/genre-repository.ts';
import { DEFAULT_DATABASE_PATH, getDatabase } from './database/schema.ts';
import { parseCountriesCsv } from './utils/countries-csv.ts';
import { parseGenresCsv } from './utils/genre-csv.ts';

/** Command-line interface for movie database operations. */
const program = new Command()
  .description('CLI for movie database operations')
  .option('-p, --path <path>', 'path to the SQLite database file');

const getPath = (command: Command, path?: string): string =>
  path ?? command.optsWithGlobals().path ?? DEFAULT_DATABASE_PATH;

function addCountries(csvPath: string, databasePath: string): void {
  const countries = parseCountriesCsv(readFileSync(csvPath, 'utf8'));
  const database = getDatabase(databasePath);
  try {
    upsertCountries(database, countries);
    console.log(
      `Imported ${countries.length} countries into ${resolve(databasePath)}`,
    );
  } finally {
    database.close();
  }
}

function cleanCountries(databasePath: string): void {
  const database = getDatabase(databasePath);
  try {
    const deletedCount = deleteUnusedCountries(database);
    console.log(
      `Deleted ${deletedCount} countries from ${resolve(databasePath)}`,
    );
  } finally {
    database.close();
  }
}

program
  .command('create-database')
  .description('Create and initialize the movies database schema')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(function ({ path }: { path?: string }) {
    const databasePath = getPath(this, path);
    const database = getDatabase(databasePath);
    database.close();
    console.log(`Database available at ${resolve(databasePath)}`);
  });

program
  .command('add-countries <csv-file>')
  .description('Import or update countries from a CSV file')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(function (csvFile: string, { path }: { path?: string }) {
    addCountries(csvFile, getPath(this, path));
  });

program
  .command('clean-countries')
  .description('Delete countries not associated with a movie')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(function ({ path }: { path?: string }) {
    cleanCountries(getPath(this, path));
  });

program
  .command('add-genres <csv-file>')
  .description('Import or update genres from a CSV file')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(function (csvFile: string, { path }: { path?: string }) {
    const genres = parseGenresCsv(readFileSync(csvFile, 'utf8'));
    const databasePath = getPath(this, path);
    const database = getDatabase(databasePath);
    try {
      upsertGenres(database, genres);
    } finally {
      database.close();
    }
    console.log(
      `Imported ${genres.length} genre(s) into ${resolve(databasePath)}`,
    );
  });

program
  .command('clean-genres')
  .description('Remove genres that are not associated with a movie')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(function ({ path }: { path?: string }) {
    const databasePath = getPath(this, path);
    const database = getDatabase(databasePath);
    let deletedCount: number;
    try {
      deletedCount = deleteUnusedGenres(database);
    } finally {
      database.close();
    }
    console.log(
      `Removed ${deletedCount} unused genre(s) from ${resolve(databasePath)}`,
    );
  });

program
  .command('add-movies <csv-file>')
  .description('Import or update movies from a CSV file')
  .option(
    '-p, --path <path>',
    'path to the SQLite database file',
    DEFAULT_DATABASE_PATH,
  )
  .action((csvFile: string, { path }: { path: string }) => {
    const database = getDatabase(path);
    try {
      const importedCount = importMoviesCsv(
        database,
        readFileSync(csvFile, 'utf8'),
      );
      console.log(`Imported ${importedCount} movie(s) into ${resolve(path)}`);
    } finally {
      database.close();
    }
  });

program.parse();
