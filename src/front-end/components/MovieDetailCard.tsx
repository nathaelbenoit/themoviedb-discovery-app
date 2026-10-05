import type { MovieDetails } from '../../back-end/schemas/MoviesTypes';

type MovieDetailCardProps = {
  movie: MovieDetails;
};

const imageBaseUrl = 'https://image.tmdb.org/t/p/w500';

export default function MovieDetailCard({ movie }: MovieDetailCardProps) {
  const posterUrl = movie.poster_path
    ? `${imageBaseUrl}${movie.poster_path}`
    : null;
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Date inconnue';

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
            aria-label="Affiche indisponible"
          />
        )}
      </figure>

      <div className="movie-detail-copy">
        <p className="movie-detail-kicker">Film {releaseYear}</p>
        <h1>{movie.title}</h1>
        {movie.tagline ? (
          <p className="movie-detail-tagline">{movie.tagline}</p>
        ) : null}

        <dl className="movie-detail-meta">
          <div>
            <dt>Note</dt>
            <dd>{movie.vote_average.toFixed(1)} / 10</dd>
          </div>
          <div>
            <dt>Votes</dt>
            <dd>{movie.vote_count.toLocaleString('fr-FR')}</dd>
          </div>
          <div>
            <dt>Langue</dt>
            <dd>{movie.original_language.toUpperCase()}</dd>
          </div>
        </dl>

        {movie.genres.length > 0 ? (
          <ul className="movie-detail-genres" aria-label="Genres">
            {movie.genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>
        ) : null}

        <section className="movie-detail-section">
          <h2>Synopsis</h2>
          <p>{movie.overview || 'Aucun synopsis disponible.'}</p>
        </section>
      </div>
    </article>
  );
}
