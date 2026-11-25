import { useState } from 'react';
import './TopRatedMovieWidget.css';

export type TopRatedMovieWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

export type TopRatedMovie = {
  title: string;
  releaseYear: number | null;
  rating: number;
  posterPath: string | null;
};

type TopRatedMovieWidgetProps = {
  state: TopRatedMovieWidgetState;
  movie?: TopRatedMovie | null;
};

export default function TopRatedMovieWidget({
  state,
  movie,
}: TopRatedMovieWidgetProps) {
  const [posterFailed, setPosterFailed] = useState(false);
  const hasMovie = state === 'success' && movie != null;
  const posterUrl =
    hasMovie && movie.posterPath
      ? `https://image.tmdb.org/t/p/w300${movie.posterPath}`
      : null;
  const showPoster = posterUrl != null && !posterFailed;

  return (
    <article
      className="top-rated-movie-widget"
      aria-labelledby="top-rated-movie-widget-title"
    >
      <p className="top-rated-movie-widget__label">Widget</p>
      <h2 id="top-rated-movie-widget-title">Film le mieux noté</h2>
      {state === 'loading' && (
        <p className="top-rated-movie-widget__status" role="status">
          Chargement du film le mieux noté...
        </p>
      )}
      {state === 'error' && (
        <p className="top-rated-movie-widget__status" role="alert">
          Impossible de récupérer le film le mieux noté.
        </p>
      )}
      {state === 'empty' && (
        <p className="top-rated-movie-widget__status">
          Aucun film noté disponible.
        </p>
      )}
      {hasMovie && (
        <div className="top-rated-movie-widget__movie">
          {showPoster ? (
            <img
              className="top-rated-movie-widget__poster"
              src={posterUrl}
              alt={`Affiche de ${movie.title}`}
              onError={() => setPosterFailed(true)}
            />
          ) : (
            <div
              className="top-rated-movie-widget__poster top-rated-movie-widget__poster--placeholder"
              role="img"
              aria-label="Affiche indisponible"
            >
              Affiche indisponible
            </div>
          )}
          <div className="top-rated-movie-widget__details">
            <h3>{movie.title}</h3>
            <p>
              {movie.releaseYear ?? 'Année inconnue'} ·{' '}
              {movie.rating.toLocaleString('fr-FR', {
                minimumFractionDigits: 1,
                maximumFractionDigits: 1,
              })}{' '}
              / 10
            </p>
          </div>
        </div>
      )}
    </article>
  );
}
