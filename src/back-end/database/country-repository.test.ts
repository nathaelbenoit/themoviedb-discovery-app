import { DatabaseSync } from 'node:sqlite';
import { describe, expect, it } from 'vitest';
import type { Country } from '../types/CountriesTypes';
import { initializeSchema } from './schema';
import {
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
});
