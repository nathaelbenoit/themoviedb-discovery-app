import type { Movie } from "../../back-end/schemas/MoviesTypes"

type MovieItemProps = {
  movie: Movie
}

export default function MovieItem({ movie }: MovieItemProps) {
  return (
    <li>
      <h2>{movie.title}</h2>
      <p>{movie.overview}</p>
      <p>Release Date: {movie.release_date}</p>
      <p>Rating: {movie.vote_average}</p>
    </li>
  )
}