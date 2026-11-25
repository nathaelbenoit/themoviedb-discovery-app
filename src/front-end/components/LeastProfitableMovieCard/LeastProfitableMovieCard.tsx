import { useState } from 'react';
import type { Movie } from '../../../back-end/types/MoviesTypes';
import './LeastProfitableMovieCard.css';

/**
 * Film avec son ROI (Retour sur Investissement) déjà calculé.
 * Le ROI est fourni en pourcentage et doit être calculé en amont selon la règle validée :
 * ROI (%) = ((revenue - budget) / budget) * 100
 *
 * Règles d'éligibilité documentées (identiques au widget le plus rentable) :
 * - Le film doit avoir un budget > 0
 * - Le film doit avoir un revenue >= 0
 * - Le ROI est calculé uniquement pour les films éligibles
 * - Une valeur inconnu ou non éligible n'est pas présentée comme zéro
 * - Le signe négatif est conservé pour les ROI négatifs
 */
export type LeastProfitableMovie = Pick<
  Movie,
  'id' | 'title' | 'release_date' | 'poster_path'
> & {
  title?: string | null;
  release_date?: string | null;
  poster_path?: string | null;
  /** ROI en pourcentage, déjà calculé. Peut être négatif. Ex: -100 pour -100 % */
  roi: number | null;
};

/**
 * Contrat des propriétés du composant LeastProfitableMovieCard.
 */
export type LeastProfitableMovieCardProps = {
  /** Le film à mettre en avant avec son ROI. */
  movie?: LeastProfitableMovie | null;
  /** Affiche un état de chargement. */
  loading?: boolean;
  /** Message d'erreur à présenter lorsque les données sont indisponibles. */
  error?: string | null;
};

/**
 * Formate le ROI en pourcentage avec deux décimales.
 * Affiche "Inconnue" si la valeur n'est pas un nombre valide.
 * Conserve le signe négatif pour les ROI négatifs.
 *
 * @param roi - ROI en pourcentage (ex: -100 pour -100 %, 0 pour 0 %)
 * @returns ROI formaté avec deux décimales et symbole %, ou "Inconnue"
 */
export function formatROI(roi: number | null | undefined): string {
  if (typeof roi !== 'number' || !Number.isFinite(roi)) {
    return 'Inconnue';
  }

  const formattedValue = roi
    .toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\u00a0|\u202f/g, ' ');

  return `${formattedValue} %`;
}

/**
 * Composant de carte affichant le film le moins rentable.
 *
 * Affiche :
 * - Libellé : "Film le moins rentable"
 * - Affiche du film
 * - Titre du film
 * - Année de sortie
 * - ROI en pourcentage avec deux décimales (signe négatif conservé)
 *
 * États gérés :
 * - Chargement
 * - Erreur
 * - Aucune donnée disponible
 * - Affiche indisponible
 */
export default function LeastProfitableMovieCard({
  movie = null,
  loading = false,
  error = null,
}: LeastProfitableMovieCardProps) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null);
  const posterUrl = movie?.poster_path
    ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
    : null;

  if (loading) {
    return (
      <article
        className="least-profitable-movie-card least-profitable-movie-card--state"
        aria-busy="true"
      >
        <p className="least-profitable-movie-card__label">
          Film le moins rentable
        </p>
        <p className="least-profitable-movie-card__message" role="status">
          Chargement du film…
        </p>
      </article>
    );
  }

  if (error) {
    return (
      <article
        className="least-profitable-movie-card least-profitable-movie-card--state"
        role="alert"
      >
        <p className="least-profitable-movie-card__label">
          Film le moins rentable
        </p>
        <p className="least-profitable-movie-card__message">{error}</p>
      </article>
    );
  }

  if (!movie) {
    return (
      <article className="least-profitable-movie-card least-profitable-movie-card--state">
        <p className="least-profitable-movie-card__label">
          Film le moins rentable
        </p>
        <p className="least-profitable-movie-card__message">
          Aucune donnée disponible
        </p>
      </article>
    );
  }

  const releaseYear = movie.release_date
    ? movie.release_date.slice(0, 4)
    : 'Inconnue';
  const posterFailed = posterUrl != null && failedPosterUrl === posterUrl;
  const showPoster = posterUrl != null && !posterFailed;

  return (
    <article className="least-profitable-movie-card">
      <p className="least-profitable-movie-card__label">
        Film le moins rentable
      </p>
      <div className="least-profitable-movie-card__content">
        {showPoster ? (
          <img
            className="least-profitable-movie-card__poster"
            src={posterUrl}
            alt={`Affiche de ${movie.title}`}
            onError={() => setFailedPosterUrl(posterUrl)}
          />
        ) : (
          <div
            className="least-profitable-movie-card__poster least-profitable-movie-card__poster--placeholder"
            role="img"
            aria-label="Affiche indisponible"
          >
            Affiche indisponible
          </div>
        )}
        <div className="least-profitable-movie-card__copy">
          <h2 title={movie.title}>{movie.title || 'Titre inconnu'}</h2>
          <dl className="least-profitable-movie-card__meta">
            <div>
              <dt>Année</dt>
              <dd>{releaseYear}</dd>
            </div>
            <div>
              <dt>ROI</dt>
              <dd>{formatROI(movie.roi)}</dd>
            </div>
          </dl>
        </div>
      </div>
    </article>
  );
}
