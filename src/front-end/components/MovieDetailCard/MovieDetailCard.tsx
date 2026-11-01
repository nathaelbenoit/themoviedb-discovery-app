import type { MovieDetails } from '../../../back-end/types/MoviesTypes';
import './MovieDetailCard.css';

export default function MovieDetailCard({ movie }: { movie: MovieDetails }) {
  const releaseYear = movie.release_date.slice(0, 4);
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : null;
  const rating = movie.vote_average.toFixed(1);

  return (
    <article className="movie-detail-card">
      <figure className="movie-detail-hero-container">
        {posterUrl ? (
          <img
            className="movie-detail-hero"
            src={posterUrl}
            alt={`Affiche de ${movie.title}`}
          />
        ) : (
          <div
            className="movie-detail-hero movie-detail-hero-placeholder"
            aria-hidden="true"
          />
        )}
      </figure>
      <div className="movie-detail-copy">
        <header>
          <p className="movie-detail-kicker">Détails du film</p>
          <h1>{movie.title}</h1>
          {movie.tagline && (
            <p className="movie-detail-tagline">{movie.tagline}</p>
          )}
        </header>
        <dl className="movie-detail-meta">
          <div>
            <dt>Année de sortie</dt>
            <dd>{releaseYear}</dd>
          </div>
          <div>
            <dt>Note</dt>
            <dd>{rating}</dd>
          </div>
        </dl>
        {movie.genres.length > 0 && (
          <section className="movie-detail-section">
            <h2>Genres</h2>
            <ul className="movie-detail-genres">
              {movie.genres.map((genre) => (
                <li key={genre.id}>{genre.name}</li>
              ))}
            </ul>
          </section>
        )}
        <section className="movie-detail-section">
          <h2>Résumé</h2>
          <p>{movie.overview}</p>
        </section>
      </div>
    </article>
  );
}
