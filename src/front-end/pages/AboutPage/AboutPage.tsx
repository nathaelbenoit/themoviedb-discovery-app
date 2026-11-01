import './AboutPage.css';

export default function AboutPage() {
  return (
    <main className="app-shell about-page">
      <header className="about-hero">
        <p className="about-eyebrow">TMDB Discovery</p>
        <h1>À propos de l'application</h1>
        <p className="about-intro">
          Une application de découverte de films, pensée comme une expérience
          web claire, rapide et maintenable.
        </p>
      </header>

      <section className="about-story" aria-labelledby="about-story-title">
        <div>
          <p className="about-section-label">Le projet</p>
          <h2 id="about-story-title">Découvrir, comparer, choisir</h2>
        </div>
        <p>
          Cette application utilise l'API de <strong>T</strong>he{' '}
          <strong>M</strong>ovie <strong>D</strong>ata
          <strong>B</strong>ase pour rendre les films populaires faciles à
          explorer. Elle démontre la construction d'une application complète, du
          front-end à l'API.
        </p>
      </section>

      <section className="about-stack" aria-labelledby="about-stack-title">
        <div className="about-stack-heading">
          <p className="about-section-label">Fondations techniques</p>
          <h2 id="about-stack-title">Une stack volontairement simple</h2>
        </div>
        <ul>
          <li>
            <strong>TypeScript</strong>
            <span>Typage et fiabilité</span>
          </li>
          <li>
            <strong>React</strong>
            <span>Interface composable</span>
          </li>
          <li>
            <strong>Node.js + Express</strong>
            <span>API légère</span>
          </li>
          <li>
            <strong>Vite</strong>
            <span>Développement rapide</span>
          </li>
        </ul>
      </section>

      <section
        className="about-repository"
        aria-labelledby="about-repository-title"
      >
        <div>
          <p className="about-section-label">Code source</p>
          <h2 id="about-repository-title">Voir la réalisation du projet</h2>
        </div>
        <a
          href="https://github.com/alex1dregirard/themoviedb-discovery-app-demo-2026-2027"
          target="_blank"
          rel="noopener noreferrer"
        >
          Ouvrir le dépôt GitHub
        </a>
      </section>
    </main>
  );
}
