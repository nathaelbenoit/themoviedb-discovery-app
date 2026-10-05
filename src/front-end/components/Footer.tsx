import '../styles/Footer.css';

declare const __APP_VERSION__: string;

const socialLinks = [
  {
    label: 'GitHub',
    href: 'https://github.com/nathaelbenoit/themoviedb-discovery-app',
  },
  {
    label: 'The Movie Database',
    href: 'https://www.themoviedb.org/',
  },
];

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__content">
        <p className="footer__copyright">
          © {new Date().getFullYear()} TMDB Discovery · Version{' '}
          {__APP_VERSION__}
        </p>
        <ul className="footer__links" aria-label="Réseaux et liens externes">
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer">
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
