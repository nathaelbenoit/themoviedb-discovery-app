import './MovieDatabaseWidget.css';

export type MovieDatabaseWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

type MovieDatabaseWidgetProps = {
  state: MovieDatabaseWidgetState;
  movieCount?: number;
};

export default function MovieDatabaseWidget({
  state,
  movieCount = 0,
}: MovieDatabaseWidgetProps) {
  return (
    <article
      className="movie-database-widget"
      aria-labelledby="movie-database-widget-title"
    >
      <p className="movie-database-widget__label">Widget</p>
      <h2 id="movie-database-widget-title">Films en base</h2>
      {state === 'loading' && (
        <p className="movie-database-widget__status" role="status">
          Chargement du nombre de films...
        </p>
      )}
      {state === 'error' && (
        <p className="movie-database-widget__status" role="alert">
          Impossible de récupérer le nombre de films.
        </p>
      )}
      {state === 'empty' && (
        <p className="movie-database-widget__value">0 film disponible</p>
      )}
      {state === 'success' && (
        <p className="movie-database-widget__value">
          {movieCount.toLocaleString('fr-FR')}{' '}
          {movieCount > 1 ? 'films disponibles' : 'film disponible'}
        </p>
      )}
    </article>
  );
}
