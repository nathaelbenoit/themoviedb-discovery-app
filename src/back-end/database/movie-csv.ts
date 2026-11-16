import { parse } from 'csv-parse/sync';
import type { DatabaseSync } from 'node:sqlite';
import { upsertMovies } from './movie-repository.ts';
import type { StoredMovieInput } from '../types/MoviesTypes.ts';

const EXPECTED_HEADERS = [
  'id',
  'title',
  'original_title',
  'original_language',
  'overview',
  'release_date',
  'popularity',
  'vote_average',
  'vote_count',
  'poster_path',
  'backdrop_path',
  'runtime',
  'budget',
  'revenue',
  'genres',
  'production_countries',
] as const;

type CsvMovie = Record<(typeof EXPECTED_HEADERS)[number], string>;

function parseOptionalNumber(
  value: string,
  field: string,
  rowNumber: number,
): number | null {
  if (value.trim() === '') return null;

  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new Error(`Invalid movies CSV: ${field} on data row ${rowNumber}`);
  }

  return parsed;
}

function parseMovie(record: CsvMovie, index: number, collectedAt: string) {
  const rowNumber = index + 2;
  const id = Number(record.id);

  if (!/^\+?\d+$/.test(record.id) || !Number.isSafeInteger(id) || id <= 0) {
    throw new Error(`Invalid movies CSV: id on data row ${rowNumber}`);
  }

  for (const field of [
    'title',
    'original_title',
    'original_language',
  ] as const) {
    if (record[field].trim() === '') {
      throw new Error(`Invalid movies CSV: ${field} on data row ${rowNumber}`);
    }
  }

  const runtime = parseOptionalNumber(record.runtime, 'runtime', rowNumber);
  const budget = parseOptionalNumber(record.budget, 'budget', rowNumber);
  const revenue = parseOptionalNumber(record.revenue, 'revenue', rowNumber);

  if (
    (runtime !== null && (!Number.isInteger(runtime) || runtime <= 0)) ||
    (budget !== null && (!Number.isInteger(budget) || budget <= 0)) ||
    (revenue !== null && (!Number.isInteger(revenue) || revenue <= 0))
  ) {
    throw new Error(
      `Invalid movies CSV: financial or runtime value on data row ${rowNumber}`,
    );
  }

  return {
    id,
    title: record.title,
    original_title: record.original_title,
    original_language: record.original_language,
    overview: record.overview,
    release_date: record.release_date || null,
    popularity: parseOptionalNumber(record.popularity, 'popularity', rowNumber),
    vote_average: parseOptionalNumber(
      record.vote_average,
      'vote_average',
      rowNumber,
    ),
    vote_count: parseOptionalNumber(record.vote_count, 'vote_count', rowNumber),
    poster_path: record.poster_path || null,
    backdrop_path: record.backdrop_path || null,
    runtime_minutes: runtime,
    budget,
    revenue,
    collected_at: collectedAt,
  } satisfies StoredMovieInput;
}

export function parseMoviesCsv(
  contents: string,
  collectedAt: string,
): StoredMovieInput[] {
  try {
    const records = parse(contents, {
      bom: true,
      columns: (headers: string[]) => {
        const normalizedHeaders = headers.map((header) =>
          header.trim().toLowerCase(),
        );
        if (
          normalizedHeaders.length !== EXPECTED_HEADERS.length ||
          normalizedHeaders.some(
            (header, index) => header !== EXPECTED_HEADERS[index],
          )
        ) {
          throw new Error(
            `expected exactly these headers: ${EXPECTED_HEADERS.join(', ')}`,
          );
        }
        return normalizedHeaders;
      },
      skip_empty_lines: true,
    }) as CsvMovie[];

    return records.map((record, index) =>
      parseMovie(record, index, collectedAt),
    );
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.startsWith('Invalid movies CSV:')
    ) {
      throw error;
    }
    throw new Error(`Invalid movies CSV: ${String(error)}`, { cause: error });
  }
}

export function importMoviesCsv(
  database: DatabaseSync,
  contents: string,
  collectedAt = new Date().toISOString(),
): number {
  const movies = parseMoviesCsv(contents, collectedAt);
  upsertMovies(database, movies);
  return movies.length;
}
