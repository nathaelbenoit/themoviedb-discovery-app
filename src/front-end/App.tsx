import { useEffect, useState } from 'react';
import type { Movie } from '../back-end/schemas/MoviesTypes';
import MovieItem from './components/MovieItem';
import {
  DEFAULT_LANGUAGE,
  DEFAULT_PAGE,
  DEFAULT_REGION,
} from '../back-end/constants';
import './app.css';

export default function App() {
  // State to hold the fetched movies data, initialized to null
  const [movies, setMovies] = useState<Movie[] | null>(null);
  // read parameters from the URL query string
  const queryParams = new URLSearchParams(window.location.search);
  const language = queryParams.get('language') || DEFAULT_LANGUAGE;
  const page = queryParams.get('page') || DEFAULT_PAGE;
  const region = queryParams.get('region') || DEFAULT_REGION;

  // useEffect hook to fetch data from an API when the component mounts
  useEffect(() => {
    // fetch data from an API /api/movies/popular
    fetch(
      `/api/movies/popular?language=${language}&page=${page}&region=${region}`,
    )
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched movies data:', data); // Log the fetched data for debugging
        setMovies(data.results); // Update the state with the fetched movies data
      });
  }, [language, page, region]);

  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Films populaires</h1>
        <h2>
          Films tendances en France, d'après les données de{' '}
          <b>The Movie Database</b>
        </h2>
      </header>
      <section>
        {movies ? (
          <ul className="movie-grid">
            {movies.map((movie) => (
              <li key={movie.id}>
                <article>
                  <MovieItem movie={movie} />
                </article>
              </li>
            ))}
          </ul>
        ) : (
          <p className="status-message">Loading...</p>
        )}
      </section>
    </main>
  );
}
