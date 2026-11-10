import type { DatabaseSync } from 'node:sqlite';
import type { Country } from '../types/CountriesTypes';

export function getCountryByCode(
  database: DatabaseSync,
  code: string,
): Country | undefined {
  return database
    .prepare('SELECT code, name FROM countries WHERE code = ?')
    .get(code) as Country | undefined;
}

export function getCountries(database: DatabaseSync): Country[] {
  return database
    .prepare('SELECT code, name FROM countries ORDER BY code ASC')
    .all() as Country[];
}

export function upsertCountries(
  database: DatabaseSync,
  countries: Iterable<Country>,
): void {
  database.exec('BEGIN TRANSACTION');
  try {
    const statement = database.prepare(`
      INSERT INTO countries (code, name)
      VALUES (?, ?)
      ON CONFLICT(code) DO UPDATE SET name = excluded.name
    `);

    for (const country of countries) {
      statement.run(country.code, country.name);
    }

    database.exec('COMMIT');
  } catch (error) {
    database.exec('ROLLBACK');
    throw error;
  }
}
