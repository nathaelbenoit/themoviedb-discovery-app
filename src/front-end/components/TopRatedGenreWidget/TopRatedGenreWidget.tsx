import './TopRatedGenreWidget.css';

/**
 * État du widget TopRatedGenreWidget.
 */
export type TopRatedGenreWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

/**
 * Props du widget TopRatedGenreWidget.
 * Le widget affiche le genre ayant la meilleure note moyenne.
 * Cette valeur est une moyenne simple, distincte de la note pondérée.
 */
export type TopRatedGenreWidgetProps = {
  /** État du widget. */
  state: TopRatedGenreWidgetState;
  /**
   * Nom du genre avec la meilleure note.
   * Un genre sans notes valides n'est pas affiché comme noté zéro.
   */
  genreName?: string | null;
  /**
   * Note moyenne du genre, calculée en amont.
   * C'est une moyenne simple (arithmétique), distincte de la note pondérée.
   * Affichée avec deux décimales et l'échelle / 10.
   */
  averageRating?: number | null;
};

/**
 * Formate la note moyenne avec deux décimales et l'échelle / 10.
 *
 * @param rating - Note moyenne (ex: 7.41)
 * @returns Note formatée avec deux décimales et " / 10", ou chaîne vide si invalide
 */
export function formatRating(rating: number | null | undefined): string {
  if (typeof rating !== 'number' || !Number.isFinite(rating)) {
    return '';
  }
  const formattedRating = rating
    .toLocaleString('fr-FR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
    .replace(/\u00a0|\u202f/g, ' ');
  return `${formattedRating} / 10`;
}

/**
 * Composant widget affichant le genre ayant la meilleure note moyenne.
 *
 * Affiche :
 * - Libellé : "Meilleure note"
 * - Nom du genre fourni
 * - Note moyenne avec deux décimales et l'échelle / 10
 *
 * Cette valeur est explicitement une moyenne simple, distincte de la note pondérée.
 * Un genre sans notes valides n'est pas affiché comme noté zéro.
 * Un nom long reste lisible.
 *
 * États gérés :
 * - loading : chargement en cours
 * - success : affichage du genre et de sa note
 * - empty : aucun genre avec notes valides
 * - error : erreur de chargement
 */
export default function TopRatedGenreWidget({
  state,
  genreName,
  averageRating,
}: TopRatedGenreWidgetProps) {
  const hasData =
    state === 'success' && genreName != null && averageRating != null;

  return (
    <article
      className="top-rated-genre-widget"
      aria-labelledby="top-rated-genre-widget-title"
    >
      <p className="top-rated-genre-widget__label">Widget</p>
      <h2 id="top-rated-genre-widget-title">Meilleure note</h2>

      {state === 'loading' && (
        <p className="top-rated-genre-widget__status" role="status">
          Chargement de la meilleure note…
        </p>
      )}

      {state === 'error' && (
        <p className="top-rated-genre-widget__status" role="alert">
          Impossible de récupérer la meilleure note.
        </p>
      )}

      {state === 'empty' && (
        <p className="top-rated-genre-widget__value">Aucun genre noté</p>
      )}

      {hasData && (
        <>
          <p className="top-rated-genre-widget__genre-name" title={genreName}>
            {genreName}
          </p>
          <p className="top-rated-genre-widget__value">
            {formatRating(averageRating)}
            <span className="top-rated-genre-widget__rating-type">
              {' - Moyenne simple'}
            </span>
          </p>
        </>
      )}
    </article>
  );
}
