import './DominantGenreWidget.css';

/**
 * État du widget DominantGenreWidget.
 */
export type DominantGenreWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

/**
 * Props du widget DominantGenreWidget.
 * Le composant affiche le résultat fourni sans recompter les films multigenres.
 * Un nom de genre long reste lisible.
 */
export type DominantGenreWidgetProps = {
  /** État du widget. */
  state: DominantGenreWidgetState;
  /**
   * Nom du genre dominant calculé en amont.
   * Le composant ne recompte pas les films multigenres, il affiche simplement la valeur fournie.
   */
  genreName?: string | null;
  /**
   * Nombre de films associés à ce genre.
   * L'unité "films" est ajoutée automatiquement.
   */
  movieCount?: number | null;
};

/**
 * Formate le nombre de films avec l'unité appropriée.
 *
 * @param count - Nombre de films
 * @returns Nombre formaté avec l'unité "film" ou "films"
 */
export function formatMovieCount(count: number | null | undefined): string {
  if (typeof count !== 'number' || !Number.isFinite(count)) {
    return '';
  }
  const formattedCount = count
    .toLocaleString('fr-FR')
    .replace(/\u00a0|\u202f/g, ' ');
  return `${formattedCount} ${count > 1 ? 'films' : 'film'}`;
}

/**
 * Composant widget affichant le genre dominant et son effectif.
 *
 * Affiche :
 * - Libellé : "Genre dominant"
 * - Nom du genre fourni
 * - Nombre de films avec l'unité "films"
 *
 * Le composant ne recompte pas les films multigenres, il affiche simplement les valeurs fournies.
 * Un nom long reste lisible.
 *
 * États gérés :
 * - loading : chargement en cours
 * - success : affichage du genre et de son effectif
 * - empty : aucun genre connu
 * - error : erreur de chargement
 */
export default function DominantGenreWidget({
  state,
  genreName,
  movieCount,
}: DominantGenreWidgetProps) {
  const hasData =
    state === 'success' && genreName != null && movieCount != null;

  return (
    <article
      className="dominant-genre-widget"
      aria-labelledby="dominant-genre-widget-title"
    >
      <p className="dominant-genre-widget__label">Widget</p>
      <h2 id="dominant-genre-widget-title">Genre dominant</h2>

      {state === 'loading' && (
        <p className="dominant-genre-widget__status" role="status">
          Chargement du genre dominant…
        </p>
      )}

      {state === 'error' && (
        <p className="dominant-genre-widget__status" role="alert">
          Impossible de récupérer le genre dominant.
        </p>
      )}

      {state === 'empty' && (
        <p className="dominant-genre-widget__value">Aucun genre connu</p>
      )}

      {hasData && (
        <>
          <p className="dominant-genre-widget__genre-name" title={genreName}>
            {genreName}
          </p>
          <p className="dominant-genre-widget__value">
            {formatMovieCount(movieCount)}
          </p>
        </>
      )}
    </article>
  );
}
