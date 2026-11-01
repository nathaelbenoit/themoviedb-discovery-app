import './Footer.css';

declare const __APP_VERSION__: string;

export default function Footer() {
  return (
    <footer className="app-footer">
      <p>TMDB Discovery</p>
      <p>Version {__APP_VERSION__}</p>
    </footer>
  );
}
