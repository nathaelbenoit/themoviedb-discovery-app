import { parse } from 'csv-parse/sync';
import type { Country } from '../types/CountriesTypes';

const REQUIRED_HEADERS = ['code', 'name'] as const;

export function parseCountriesCsv(content: string): Country[] {
  let rows: string[][];
  try {
    rows = parse(content, {
      bom: true,
      skip_empty_lines: true,
      trim: true,
    }) as string[][];
  } catch (error) {
    throw new Error(`Invalid countries CSV: ${String(error)}`, {
      cause: error,
    });
  }

  if (rows.length === 0) {
    throw new Error('Invalid countries CSV: missing headers');
  }

  const headers = rows[0].map((header) => header.toLowerCase());
  if (
    headers.length !== REQUIRED_HEADERS.length ||
    new Set(headers).size !== REQUIRED_HEADERS.length ||
    !REQUIRED_HEADERS.every((header) => headers.includes(header))
  ) {
    throw new Error(
      'Invalid countries CSV: expected exactly code and name headers',
    );
  }

  const codeIndex = headers.indexOf('code');
  const nameIndex = headers.indexOf('name');
  const countries: Country[] = [];

  for (const [index, row] of rows.slice(1).entries()) {
    const code = row[codeIndex]?.trim();
    const name = row[nameIndex]?.trim();

    if (!code || !/^[A-Z]{2}$/.test(code)) {
      throw new Error(
        `Invalid countries CSV: code on data row ${index + 2} must contain exactly two uppercase letters`,
      );
    }
    if (!name) {
      throw new Error(
        `Invalid countries CSV: name on data row ${index + 2} must not be empty`,
      );
    }

    countries.push({ code, name });
  }

  return countries;
}
