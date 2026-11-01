import { Link } from 'react-router';
import './NotFoundPage.css';

export default function NotFoundPage() {
  return (
    <main className="app-shell not-found-page">
      <section className="not-found-content" aria-labelledby="not-found-title">
        <p className="not-found-code" aria-hidden="true">
          404
        </p>
        <p className="not-found-eyebrow">TMDB Discovery</p>
        <h1 id="not-found-title">Cette page est introuvable</h1>
        <p className="not-found-description">
          Le film ou la page que vous cherchez n'existe pas, ou a été déplacé.
        </p>
        <Link className="not-found-link" to="/movies">
          Retour aux films populaires
        </Link>
      </section>
    </main>
  );
}
