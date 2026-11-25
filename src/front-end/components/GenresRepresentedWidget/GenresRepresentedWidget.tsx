import './GenresRepresentedWidget.css';

/**
 * État du widget GenresRepresentedWidget.
 */
export type GenresRepresentedWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

/**
 * Props du widget GenresRepresentedWidget.
 * Le widget affiche le nombre de genres distincts fournis, sans compter les associations film-genre.
 */
export type GenresRepresentedWidgetProps = {
  /** État du widget. */
  state: GenresRepresentedWidgetState;
  /**
   * Nombre de genres distincts calculé en amont.
   * Le composant ne compte pas les associations film-genre, il affiche simplement la valeur fournie.
   * Une valeur zéro valide est distinguée d'une donnée inconnue.
   */
  genreCount?: number | null;
};

/**
 * Composant widget affichant le nombre de genres représentés dans le catalogue.
 *
 * Affiche :
 * - Libellé : "Genres représentés"
 * - Sous-libellé : "Diversité du catalogue"
 * - Nombre de genres distincts avec l'unité "genres"
 *
 * Distingue :
 * - Valeur zéro valide (0 genres) d'une donnée inconnue (null/undefined)
 *
 * États gérés :
 * - loading : chargement en cours
 * - success : affichage du nombre de genres
 * - empty : aucune donnée disponible (genreCount est null/undefined)
 * - error : erreur de chargement
 */
export default function GenresRepresentedWidget({
  state,
  genreCount,
}: GenresRepresentedWidgetProps) {
  const hasData = state === 'success' && genreCount != null;

  return (
    <article
      className="genres-represented-widget"
      aria-labelledby="genres-represented-widget-title"
    >
      <p className="genres-represented-widget__label">Widget</p>
      <h2 id="genres-represented-widget-title">Genres représentés</h2>
      <p className="genres-represented-widget__subtitle">
        Diversité du catalogue
      </p>

      {state === 'loading' && (
        <p className="genres-represented-widget__status" role="status">
          Chargement des genres…
        </p>
      )}

      {state === 'error' && (
        <p className="genres-represented-widget__status" role="alert">
          Impossible de récupérer le nombre de genres.
        </p>
      )}

      {state === 'empty' && (
        <p className="genres-represented-widget__value">
          Aucune donnée disponible
        </p>
      )}

      {hasData && (
        <p className="genres-represented-widget__value">
          {genreCount.toLocaleString('fr-FR')}{' '}
          {genreCount > 1 ? 'genres' : 'genre'}
        </p>
      )}
    </article>
  );
}
