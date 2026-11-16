import './DashboardPage.css';

export default function DashboardPage() {
  return (
    <main className="app-shell dashboard-page">
      <header className="app-header">
        <p className="dashboard-eyebrow">Films, genres et pays de production</p>
        <h1>Tableau de bord des films</h1>
        <p className="dashboard-intro">
          Retrouvez ici les principales informations sur les films de
          l&apos;application.
        </p>
      </header>

      <section
        className="dashboard-empty-state"
        aria-labelledby="dashboard-empty-state-title"
      >
        <p className="dashboard-section-label">Widgets</p>
        <h2 id="dashboard-empty-state-title">
          Aucun widget n&apos;est configuré
        </h2>
        <p>Les widgets du tableau de bord seront disponibles prochainement.</p>
      </section>
    </main>
  );
}
