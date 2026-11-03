import type { DatabaseSync } from 'node:sqlite';
import type { TmdbGenresResponse } from '../types/GenresTypes';

const TMDB_MOVIE_GENRES_URL = 'https://api.themoviedb.org/3/genre/movie/list';

/**
 * Downloads the movie genres from TMDB and stores their current names locally.
 */
export async function updateGenres(
  database: DatabaseSync,
  accessToken: string,
  language = 'fr-FR',
  fetchImplementation: typeof fetch = fetch,
): Promise<number> {
  const query = new URLSearchParams({ language });
  const response = await fetchImplementation(
    `${TMDB_MOVIE_GENRES_URL}?${query.toString()}`,
    {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json;charset=utf-8',
      },
    },
  );

  if (!response.ok) {
    throw new Error(
      `TMDB genres request failed with status ${response.status}`,
    );
  }

  const data: unknown = await response.json();
  if (
    !data ||
    typeof data !== 'object' ||
    !('genres' in data) ||
    !Array.isArray(data.genres) ||
    data.genres.some((genre) => !isGenre(genre))
  ) {
    throw new Error('TMDB genres response has an invalid format');
  }

  database.exec('BEGIN TRANSACTION;');
  try {
    const statement = database.prepare(`
      INSERT INTO genres (id, name)
      VALUES (?, ?)
      ON CONFLICT(id) DO UPDATE SET name = excluded.name
    `);

    for (const genre of data.genres) {
      statement.run(genre.id, genre.name);
    }

    database.exec('COMMIT;');
  } catch (error) {
    database.exec('ROLLBACK;');
    throw error;
  }

  return data.genres.length;
}

function isGenre(
  value: unknown,
): value is TmdbGenresResponse['genres'][number] {
  return (
    typeof value === 'object' &&
    value !== null &&
    'id' in value &&
    Number.isInteger(value.id) &&
    'name' in value &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  );
}
