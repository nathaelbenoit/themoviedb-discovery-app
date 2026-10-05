import { NavLink } from 'react-router';
import '../styles/NavBar.css';

export default function NavBar() {
  return (
    <nav className="navbar" aria-label="Navigation principale">
      <div className="navbar__content">
        <NavLink className="navbar__brand" to="/movies">
          TMDB DISCOVERY
        </NavLink>
        <ul className="navbar__links">
          <li>
            <NavLink
              className="navbar__link"
              to="/movies"
              aria-label="Films populaires"
            >
              Films populaires
            </NavLink>
          </li>
          <li>
            <NavLink className="navbar__link" to="/about">
              À propos
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}
