import './AverageDurationWidget.css';

export type AverageDurationWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

type AverageDurationWidgetProps = {
  state: AverageDurationWidgetState;
  averageDuration?: number | null;
};

export default function AverageDurationWidget({
  state,
  averageDuration,
}: AverageDurationWidgetProps) {
  const hasDuration = state === 'success' && averageDuration != null;

  return (
    <article
      className="average-duration-widget"
      aria-labelledby="average-duration-widget-title"
    >
      <p className="average-duration-widget__label">Widget</p>
      <h2 id="average-duration-widget-title">Durée moyenne</h2>
      {state === 'loading' && (
        <p className="average-duration-widget__status" role="status">
          Chargement de la durée moyenne...
        </p>
      )}
      {state === 'error' && (
        <p className="average-duration-widget__status" role="alert">
          Impossible de récupérer la durée moyenne.
        </p>
      )}
      {state === 'empty' && (
        <p className="average-duration-widget__status">
          Aucune durée disponible.
        </p>
      )}
      {hasDuration && (
        <p className="average-duration-widget__value">
          {averageDuration.toLocaleString('fr-FR')} min
        </p>
      )}
    </article>
  );
}
