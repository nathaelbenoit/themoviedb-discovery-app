import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import type { MovieDetails } from '../../back-end/schemas/MoviesTypes';
import MovieDetailCard from '../components/MovieDetailCard';
import '../MovieDetailCard.css';

export default function MovieDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      return;
    }

    const controller = new AbortController();

    fetch(`/api/movies/${encodeURIComponent(id)}`, {
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error('Film introuvable');
        }

        return (await response.json()) as MovieDetails;
      })
      .then(setMovie)
      .catch((fetchError: Error) => {
        if (fetchError.name !== 'AbortError') {
          setError(fetchError.message);
        }
      });

    return () => controller.abort();
  }, [id]);

  if (!id) {
    return <main className="app-shell">Film introuvable</main>;
  }

  return (
    <main className="app-shell">
      <header className="movie-detail-header">
        <h1>Détails du film</h1>
        <Link className="movie-detail-back" to="/movies">
          ← Retour vers les films populaires
        </Link>
      </header>

      {error ? (
        <div className="status-message">
          <p>{error}</p>
        </div>
      ) : movie ? (
        <MovieDetailCard movie={movie} />
      ) : (
        <p className="status-message">Chargement du film...</p>
      )}
    </main>
  );
}
