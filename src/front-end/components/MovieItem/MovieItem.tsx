import { Link } from 'react-router';
import type { Movie } from '../../../back-end/types/MoviesTypes';

type MovieItemProps = {
  movie: Movie;
};

/**
 * Component representing a single movie item card.
 * @param movie The props object containing the movie to display.
 * @returns The JSX element representing the movie item card.
 */
export default function MovieItem({ movie }: MovieItemProps) {
  // Extract the release year.
  const releaseYear = movie.release_date.slice(0, 4);

  // Construct the poster URL if available.
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w185${movie.poster_path}`
    : null;

  // Format the movie rating to one decimal place.
  const rating = movie.vote_average.toFixed(1);

  return (
    <Link to={`/movies/${movie.id}`} className="movie-card-link">
      <div className="movie-card">
        {posterUrl ? (
          <img
            className="movie-poster"
            src={posterUrl}
            alt={`Affiche de ${movie.title}`}
          />
        ) : (
          <div />
        )}
        <div className="movie-card__content">
          <h2>{movie.title}</h2>
          <p>
            {releaseYear} · Note {rating}
          </p>
        </div>
      </div>
    </Link>
  );
}
