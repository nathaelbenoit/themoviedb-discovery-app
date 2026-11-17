import './TopProductionCountryWidget.css';

export type TopProductionCountryWidgetState =
  | 'loading'
  | 'success'
  | 'empty'
  | 'error';

type TopProductionCountryWidgetProps = {
  state: TopProductionCountryWidgetState;
  countryName?: string | null;
  movieCount?: number | null;
};

export default function TopProductionCountryWidget({
  state,
  countryName,
  movieCount,
}: TopProductionCountryWidgetProps) {
  const hasCountry = state === 'success' && countryName && movieCount != null;

  return (
    <article
      className="top-production-country-widget"
      aria-labelledby="top-production-country-widget-title"
    >
      <p className="top-production-country-widget__label">Widget</p>
      <h2 id="top-production-country-widget-title">Pays le plus représenté</h2>
      {state === 'loading' && (
        <p className="top-production-country-widget__status" role="status">
          Chargement du pays le plus représenté...
        </p>
      )}
      {state === 'error' && (
        <p className="top-production-country-widget__status" role="alert">
          Impossible de récupérer le pays le plus représenté.
        </p>
      )}
      {state === 'empty' && (
        <p className="top-production-country-widget__status">
          Aucun pays connu.
        </p>
      )}
      {hasCountry && (
        <div className="top-production-country-widget__result">
          <p className="top-production-country-widget__country">
            {countryName}
          </p>
          <p className="top-production-country-widget__count">
            {movieCount.toLocaleString('fr-FR')} films
          </p>
        </div>
      )}
    </article>
  );
}
