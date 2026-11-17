import './AverageRatingWidget.css';

export type AverageRatingWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

type AverageRatingWidgetProps = {
  state: AverageRatingWidgetState;
  /**
   * Simple catalogue average calculated upstream from all rated movies.
   * The widget only formats the supplied value and never calculates it.
   */
  averageRating?: number | null;
};

export default function AverageRatingWidget({
  state,
  averageRating,
}: AverageRatingWidgetProps) {
  const hasRating = state === 'success' && averageRating != null;

  return (
    <article
      className="average-rating-widget"
      aria-labelledby="average-rating-widget-title"
    >
      <p className="average-rating-widget__label">Widget</p>
      <h2 id="average-rating-widget-title">Note moyenne</h2>
      {state === 'loading' && (
        <p className="average-rating-widget__status" role="status">
          Chargement de la note moyenne...
        </p>
      )}
      {state === 'error' && (
        <p className="average-rating-widget__status" role="alert">
          Impossible de récupérer la note moyenne.
        </p>
      )}
      {state === 'empty' && (
        <p className="average-rating-widget__status">Aucune note disponible.</p>
      )}
      {hasRating && (
        <>
          <p className="average-rating-widget__value">
            {averageRating.toLocaleString('fr-FR', {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}{' '}
            / 10
          </p>
          <p className="average-rating-widget__type">Moyenne simple</p>
        </>
      )}
    </article>
  );
}
