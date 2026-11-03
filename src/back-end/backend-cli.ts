#!/usr/bin/env node
import { Command } from 'commander';
import { resolve } from 'node:path';
import { DEFAULT_DATABASE_PATH, getDatabase } from './database/schema.ts';

/** Command-line interface for movie database operations. */
const program = new Command().description('CLI for movie database operations');

program
  .command('create-database')
  .description('Create and initialize the movies database schema')
  .option(
    '-p, --path <path>',
    'path to the SQLite database file',
    DEFAULT_DATABASE_PATH,
  )
  .action(({ path }: { path: string }) => {
    const database = getDatabase(path);
    database.close();
    console.log(`Database available at ${resolve(path)}`);
  });

program
  .command('update-genres')
  .description('Create and update movie genres from TMDB')
  .option(
    '-p, --path <path>',
    'path to the SQLite database file',
    DEFAULT_DATABASE_PATH,
  )
  .option('-l, --language <language>', 'language used by TMDB', 'fr-FR')
  .action(async ({ path, language }: { path: string; language: string }) => {
    const { tmdbAccessToken } = await import('./utils/config.ts');
    const { updateGenres } = await import('./database/genres.ts');
    if (!tmdbAccessToken) {
      throw new Error('TMDB_ACCESS_TOKEN is not defined');
    }
    const database = getDatabase(path);
    try {
      const genreCount = await updateGenres(
        database,
        tmdbAccessToken,
        language,
      );
      console.log(`${genreCount} genres updated`);
    } finally {
      database.close();
    }
  });

await program.parseAsync();
