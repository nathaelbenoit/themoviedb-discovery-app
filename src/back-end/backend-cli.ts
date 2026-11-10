#!/usr/bin/env node
import { Command } from 'commander';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  deleteUnusedCountries,
  upsertCountries,
} from './database/country-repository.ts';
import { DEFAULT_DATABASE_PATH, getDatabase } from './database/schema.ts';
import { parseCountriesCsv } from './utils/countries-csv.ts';

/** Command-line interface for movie database operations. */
const program = new Command().description('CLI for movie database operations');
program.option('-p, --path <path>', 'path to the SQLite database file');

function getDatabasePath(path: string | undefined, command: Command): string {
  return path ?? command.parent?.opts().path ?? DEFAULT_DATABASE_PATH;
}

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
  .action(({ path }: { path?: string }, command: Command) => {
    const databasePath = getDatabasePath(path, command);
    const database = getDatabase(databasePath);
    database.close();
    console.log(`Database available at ${resolve(databasePath)}`);
  });

program
  .command('add-countries')
  .description('Import or update countries from a CSV file')
  .argument('<csv-file>', 'path to the countries CSV file')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action((csvPath: string, { path }: { path?: string }, command: Command) => {
    addCountries(csvPath, getDatabasePath(path, command));
  });

program
  .command('clean-countries')
  .description('Delete countries not associated with a movie')
  .option('-p, --path <path>', 'path to the SQLite database file')
  .action(({ path }: { path?: string }, command: Command) => {
    cleanCountries(getDatabasePath(path, command));
  });

program.parse();
