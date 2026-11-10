import { parse } from 'csv-parse/sync';
import type { Genre } from '../types/GenresTypes.ts';

const EXPECTED_HEADERS = new Set(['id', 'name']);

/**
 * Parses and validates the genres CSV format.
 */
export function parseGenresCsv(contents: string): Genre[] {
  try {
    if (contents.replace(/^\uFEFF/, '').trim().length === 0) {
      throw new Error('CSV headers must be exactly id and name');
    }

    const records = parse(contents, {
      bom: true,
      columns: (headers: string[]) => {
        const normalizedHeaders = headers.map((header) => header.toLowerCase());

        if (
          normalizedHeaders.length !== EXPECTED_HEADERS.size ||
          normalizedHeaders.some((header) => !EXPECTED_HEADERS.has(header)) ||
          new Set(normalizedHeaders).size !== EXPECTED_HEADERS.size
        ) {
          throw new Error('CSV headers must be exactly id and name');
        }

        return normalizedHeaders;
      },
      skip_empty_lines: true,
    }) as Array<Record<string, string>>;

    return records.map((record, index) => {
      const rawId = record.id;
      const name = record.name;
      const id = Number(rawId);

      if (!/^\+?\d+$/.test(rawId) || !Number.isSafeInteger(id) || id <= 0) {
        throw new Error(`invalid id at CSV record ${index + 1}`);
      }

      if (name.trim().length === 0) {
        throw new Error(`name cannot be empty at CSV record ${index + 1}`);
      }

      return { id, name };
    });
  } catch (error) {
    throw new Error(`Invalid genres CSV: ${String(error)}`, { cause: error });
  }
}
