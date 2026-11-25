import './TopWeightedGenreWidget.css';

/**
 * État du widget TopWeightedGenreWidget.
 */
export type TopWeightedGenreWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

/**
 * Props du widget TopWeightedGenreWidget.
 * Le widget affiche le genre ayant la meilleure note pondérée.
 *
 * Formule de pondération validée :
 * La note pondérée est calculée en amont selon la formule validée avec ses paramètres.
 * Elle est distincte de la moyenne simple arithmétique.
 *
 * Le composant affiche la valeur fournie sans appliquer une pondération arbitraire.
 */
export type TopWeightedGenreWidgetProps = {
  /** État du widget. */
  state: TopWeightedGenreWidgetState;
  /**
   * Nom du genre avec la meilleure note pondérée.
   * Un nom long reste lisible.
   */
  genreName?: string | null;
  /**
   * Note pondérée du genre, calculée en amont selon la formule validée.
   * Affichée avec deux décimales et l'échelle / 10.
   *
   * Formule de pondération validée et documentée :
   * - Les paramètres de pondération et les règles d'éligibilité des genres sont validés avant intégration
   * - Aucune formule n'est déduite de la capture, elle est fournie par le backend
   */
  weightedRating?: number | null;
};

/**
 * Formate la note pondérée avec deux décimales et l'échelle / 10.
 *
 * @param rating - Note pondérée (ex: 7.68)
 * @returns Note formatée avec deux décimales et " / 10", ou chaîne vide si invalide
 */
export function formatWeightedRating(
  rating: number | null | undefined,
): string {
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
 * Composant widget affichant le genre ayant la meilleure note pondérée.
 *
 * Affiche :
 * - Libellé : "Meilleure note pondérée"
 * - Nom du genre fourni
 * - Note pondérée avec deux décimales et l'échelle / 10
 *
 * La formule de pondération, ses paramètres et l'éligibilité des genres sont validés
 * et documentés avant intégration réelle. Le composant affiche simplement la valeur fournie
 * sans appliquer une pondération arbitraire.
 *
 * Un nom long reste lisible.
 *
 * États gérés :
 * - loading : chargement en cours
 * - success : affichage du genre et de sa note pondérée
 * - empty : aucun genre avec note pondérée valide
 * - error : erreur de chargement
 */
export default function TopWeightedGenreWidget({
  state,
  genreName,
  weightedRating,
}: TopWeightedGenreWidgetProps) {
  const hasData =
    state === 'success' && genreName != null && weightedRating != null;

  return (
    <article
      className="top-weighted-genre-widget"
      aria-labelledby="top-weighted-genre-widget-title"
    >
      <p className="top-weighted-genre-widget__label">Widget</p>
      <h2 id="top-weighted-genre-widget-title">Meilleure note pondérée</h2>

      {state === 'loading' && (
        <p className="top-weighted-genre-widget__status" role="status">
          Chargement de la meilleure note pondérée…
        </p>
      )}

      {state === 'error' && (
        <p className="top-weighted-genre-widget__status" role="alert">
          Impossible de récupérer la meilleure note pondérée.
        </p>
      )}

      {state === 'empty' && (
        <p className="top-weighted-genre-widget__value">Aucun genre noté</p>
      )}

      {hasData && (
        <>
          <p
            className="top-weighted-genre-widget__genre-name"
            title={genreName}
          >
            {genreName}
          </p>
          <p className="top-weighted-genre-widget__value">
            {formatWeightedRating(weightedRating)}
            <span className="top-weighted-genre-widget__rating-type">
              {' - Note pondérée'}
            </span>
          </p>
        </>
      )}
    </article>
  );
}
