import { DatabaseSync } from 'node:sqlite';
import { dirname, resolve } from 'node:path';
import { mkdirSync } from 'node:fs';

// Default path for the movies database
export const DEFAULT_DATABASE_PATH = resolve('data/movies.sqlite');

/**
 * Creates and initializes the database schema for movies, genres, and countries
 * if it does not already exist else returns the existing schema.
 * @param databasePath The path to the SQLite database file.
 * @returns A `DatabaseSync` instance connected to the specified database.
 */
export function getDatabase(
  databasePath = DEFAULT_DATABASE_PATH,
  force = false,
): DatabaseSync {
  // Create the directory for the database file if it doesn't exist
  mkdirSync(dirname(databasePath), { recursive: true });

  // Initialize the database connection
  const database = new DatabaseSync(databasePath);

  // Before initializing the schema, enable foreign key constraints to ensure referential integrity
  database.exec('PRAGMA foreign_keys = ON;');

  // Begin a transaction to initialize the schema
  database.exec('BEGIN TRANSACTION;');
  try {
    if (force) {
      database.exec(`
        DROP TABLE IF EXISTS movie_genres;
        DROP TABLE IF EXISTS production_countries;
        DROP TABLE IF EXISTS movies;
        DROP TABLE IF EXISTS genres;
        DROP TABLE IF EXISTS countries;
      `);
    }
    initializeSchema(database);
    database.exec('COMMIT;');
    // Schema initialized successfully, commit the transaction
  } catch (error) {
    // An error occurred while initializing the schema, rollback the transaction
    database.exec('ROLLBACK;');
    throw error;
  }

  return database;
}

/**
 * Initializes the database schema.
 * @param database The SQLite database to initialize.
 */
export function initializeSchema(database: DatabaseSync): void {
  initializeMoviesSchema(database);
  initializeGenresSchema(database);
  initializeCountriesSchema(database);
}

/**
 * Initializes the movies table schema.
 * @param database The SQLite database to initialize.
 */
function initializeMoviesSchema(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS movies (
      ## The unique identifier for the movie
      id INTEGER PRIMARY KEY,
      ## The title of the movie
      title TEXT NOT NULL,
      ## The original title of the movie
      original_title TEXT NOT NULL,
      ## The original language of the movie
      original_language TEXT NOT NULL,
      ## The overview or synopsis of the movie
      overview TEXT NOT NULL,
      ## The release date of the movie as TEXT in the format 'YYYY-MM-DD', sqlite does not have a dedicated DATE type
      release_date TEXT,
      ## The year of the movie's release, generated from the release_date
      release_year INTEGER GENERATED ALWAYS AS (CAST(strftime('%Y', release_date) AS INTEGER)) STORED,
      ## The popularity score of the movie
      popularity REAL,
      ## The average vote score of the movie
      vote_average REAL,
      ## The total number of votes the movie has received
      vote_count INTEGER,
      ## The path to the movie's poster image
      poster_path TEXT,
      ## The path to the movie's backdrop image
      backdrop_path TEXT,
      ## The runtime of the movie in minutes
      runtime_minutes INTEGER CHECK(runtime_minutes IS NULL OR runtime_minutes > 0),
      ## The budget of the movie
      budget INTEGER CHECK(budget IS NULL OR budget > 0),
      ## The revenue of the movie
      revenue INTEGER CHECK(revenue IS NULL OR revenue > 0),
      ## The timestamp when the movie data was collected
      collected_at TEXT NOT NULL
    );
    ## Create an index on the release_year column for faster queries by release year
    CREATE INDEX IF NOT EXISTS movies_release_year ON movies(release_year);
  `);
}

/**
 * Initializes the genres table schema.
 * @param database The SQLite database to initialize.
 */
export function initializeGenresSchema(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS genres (
      ## The unique identifier for the genre
      id INTEGER PRIMARY KEY,
      ## The name of the genre
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS movie_genres (
      ## The ID of the movie
      movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
      ## The ID of the genre
      genre_id INTEGER NOT NULL REFERENCES genres(id),
      ## The combination of movie_id and genre_id must be unique
      PRIMARY KEY (movie_id, genre_id)
    );
    ## Create an index on the genre_id column for faster queries by genre
    CREATE INDEX IF NOT EXISTS movie_genres_genre_id ON movie_genres(genre_id);
  `);
}

/**
 * Initializes the countries table schema.
 * @param database The SQLite database to initialize.
 */
function initializeCountriesSchema(database: DatabaseSync): void {
  database.exec(`
    CREATE TABLE IF NOT EXISTS countries (
      ## The unique code for the country
      code TEXT PRIMARY KEY,
      ## The name of the country
      name TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS production_countries (
      ## The ID of the movie
      movie_id INTEGER NOT NULL REFERENCES movies(id) ON DELETE CASCADE,
      ## The code of the country
      country_code TEXT NOT NULL REFERENCES countries(code),
      ## The combination of movie_id and country_code must be unique
      PRIMARY KEY (movie_id, country_code)
    );
    ## Create an index on the country_code column for faster queries by country
    CREATE INDEX IF NOT EXISTS production_countries_country_code ON production_countries(country_code);
  `);
}
