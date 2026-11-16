import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import type { Country } from '../types/CountriesTypes';
import { initializeSchema } from './schema';
import {
  deleteUnusedCountries,
  getCountries,
  getCountryByCode,
  upsertCountries,
} from './country-repository';

const createDatabase = (): DatabaseSync => {
  const database = new DatabaseSync(':memory:');
  initializeSchema(database);
  return database;
};

describe('country repository', () => {
  it('finds an existing country and returns undefined for an unknown code', () => {
    const database = createDatabase();
    try {
      upsertCountries(database, [{ code: 'FR', name: 'France' }]);

      expect(getCountryByCode(database, 'FR')).toEqual({
        code: 'FR',
        name: 'France',
      });
      expect(getCountryByCode(database, 'US')).toBeUndefined();
    } finally {
      database.close();
    }
  });

  it('returns an empty list when no country is registered', () => {
    const database = createDatabase();
    try {
      expect(getCountries(database)).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('lists countries in ascending code order', () => {
    const database = createDatabase();
    try {
      upsertCountries(database, [
        { code: 'US', name: 'United States' },
        { code: 'FR', name: 'France' },
      ]);

      expect(getCountries(database)).toEqual([
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
      ]);
    } finally {
      database.close();
    }
  });

  it('inserts and updates countries without creating duplicates', () => {
    const database = createDatabase();
    try {
      upsertCountries(database, [{ code: 'FR', name: 'French Republic' }]);
      upsertCountries(database, [
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
      ]);

      expect(getCountries(database)).toEqual([
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
      ]);
    } finally {
      database.close();
    }
  });

  it('accepts arrays and other iterables, keeps the last repeated label, and ignores empty input', () => {
    const database = createDatabase();
    try {
      const countries = new Set<Country>([
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
      ]);
      upsertCountries(database, countries);
      upsertCountries(
        database,
        (function* () {
          yield { code: 'FR', name: 'French Republic' };
          yield { code: 'FR', name: 'France' };
        })(),
      );
      upsertCountries(database, []);

      expect(getCountries(database)).toEqual([
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
      ]);
    } finally {
      database.close();
    }
  });

  it('rolls back the transaction when a country cannot be inserted', () => {
    const database = createDatabase();
    try {
      expect(() =>
        upsertCountries(database, [
          { code: 'FR', name: 'France' },
          { code: 'US', name: null as unknown as string },
        ]),
      ).toThrow(/NOT NULL constraint failed/);

      expect(getCountries(database)).toEqual([]);
    } finally {
      database.close();
    }
  });

  it('deletes only countries without a production association', () => {
    const database = createDatabase();
    try {
      upsertCountries(database, [
        { code: 'FR', name: 'France' },
        { code: 'US', name: 'United States' },
      ]);
      database
        .prepare(
          `INSERT INTO movies
            (id, title, original_title, original_language, overview, collected_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(1, 'Movie', 'Movie', 'en', 'Overview', '2026-01-01');
      database
        .prepare(
          'INSERT INTO production_countries (movie_id, country_code) VALUES (?, ?)',
        )
        .run(1, 'FR');

      expect(deleteUnusedCountries(database)).toBe(1);
      expect(getCountries(database)).toEqual([{ code: 'FR', name: 'France' }]);
    } finally {
      database.close();
    }
  });

  it('rolls back when deleting unused countries fails', () => {
    const database = createDatabase();
    try {
      database.exec('DROP TABLE countries');

      expect(() => deleteUnusedCountries(database)).toThrow(
        /no such table: countries/,
      );
      expect(
        database
          .prepare("SELECT name FROM sqlite_master WHERE type = 'table'")
          .all()
          .map((row) => row.name),
      ).not.toContain('countries');
    } finally {
      database.close();
    }
  });
});
