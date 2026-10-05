import '../AboutPage.css';

const technologies = [
  { name: 'TypeScript', description: 'Typage et fiabilité' },
  { name: 'React', description: 'Interface composable' },
  { name: 'Node.js + Express', description: 'API légère' },
  { name: 'Vite', description: 'Développement rapide' },
];

export default function AboutPage() {
  return (
    <main className="about-page">
      <header className="about-hero">
        <p className="about-eyebrow">TMDB DISCOVERY</p>
        <h1>À propos de l&apos;application</h1>
        <p className="about-intro">
          Une application de découverte de films, pensée comme une expérience
          web claire, rapide et maintenable.
        </p>
      </header>

      <section className="about-section about-section--project">
        <div className="about-section__heading">
          <p className="about-eyebrow">LE PROJET</p>
          <h2>Découvrir, comparer, choisir</h2>
        </div>
        <p>
          Cette application utilise l&apos;API de <b>T</b>he <b>M</b>ovie{' '}
          <b>D</b>ata<b>B</b>ase pour rendre les films populaires faciles à
          explorer. Elle démontre la construction d&apos;une application
          complète, du front-end à l&apos;API.
        </p>
      </section>

      <section className="about-section about-section--stack">
        <div className="about-section__heading">
          <p className="about-eyebrow">FONDATIONS TECHNIQUES</p>
          <h2>Une stack volontairement simple</h2>
        </div>
        <ul className="technology-grid">
          {technologies.map((technology) => (
            <li className="technology-card" key={technology.name}>
              <h3>{technology.name}</h3>
              <p>{technology.description}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="about-source">
        <div>
          <p className="about-eyebrow">CODE SOURCE</p>
          <h2>Un projet ouvert à l&apos;exploration</h2>
          <p>
            Consultez le code et découvrez comment l&apos;application est
            construite.
          </p>
        </div>
        <a
          className="about-source__link"
          href="https://github.com/nathaelbenoit/themoviedb-discovery-app"
          target="_blank"
          rel="noreferrer"
        >
          Voir sur GitHub <span aria-hidden="true">↗</span>
        </a>
      </section>
    </main>
  );
}
