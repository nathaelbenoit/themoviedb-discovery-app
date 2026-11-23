import type { Movie } from '../../../back-end/types/MoviesTypes';
import './PopularMovieCard.css';

export type PopularMovieCardProps = {
  /** Le film à mettre en avant. */
  movie?: Movie | null;
  /** Affiche un état de chargement. */
  loading?: boolean;
  /** Message d’erreur à présenter lorsque les données sont indisponibles. */
  error?: string | null;
};

export function formatPopularity(
  popularity: number | null | undefined,
): string {
  if (typeof popularity !== 'number' || !Number.isFinite(popularity)) {
    return 'Inconnue';
  }

  return popularity
    .toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\u00a0|\u202f/g, ' ');
}

export default function PopularMovieCard({
  movie = null,
  loading = false,
  error = null,
}: PopularMovieCardProps) {
  if (loading) {
    return (
      <article
        className="popular-movie-card popular-movie-card--state"
        aria-busy="true"
      >
        <p className="popular-movie-card__label">Film le plus populaire</p>
        <p className="popular-movie-card__message">Chargement du film…</p>
      </article>
    );
  }

  if (error) {
    return (
      <article
        className="popular-movie-card popular-movie-card--state"
        role="alert"
      >
        <p className="popular-movie-card__label">Film le plus populaire</p>
        <p className="popular-movie-card__message">{error}</p>
      </article>
    );
  }

  if (!movie) {
    return (
      <article className="popular-movie-card popular-movie-card--state">
        <p className="popular-movie-card__label">Film le plus populaire</p>
        <p className="popular-movie-card__message">Aucune donnée disponible</p>
      </article>
    );
  }

  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : null;
  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Inconnue';

  return (
    <article className="popular-movie-card">
      <p className="popular-movie-card__label">Film le plus populaire</p>
      <div className="popular-movie-card__content">
        {posterUrl ? (
          <img
            className="popular-movie-card__poster"
            src={posterUrl}
            alt={`Affiche de ${movie.title}`}
          />
        ) : (
          <div
            className="popular-movie-card__poster popular-movie-card__poster--placeholder"
            role="img"
            aria-label="Affiche indisponible"
          />
        )}
        <div className="popular-movie-card__copy">
          <h2 title={movie.title}>{movie.title || 'Titre inconnu'}</h2>
          <dl className="popular-movie-card__meta">
            <div>
              <dt>Année</dt>
              <dd>{releaseYear}</dd>
            </div>
            <div>
              <dt>Popularité</dt>
              <dd>{formatPopularity(movie.popularity)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
