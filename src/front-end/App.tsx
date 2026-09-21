import { useEffect, useState } from "react"
import type { Movie } from "../back-end/schemas/MoviesTypes"

export default function App() {
  // State to hold the fetched movies data, initialized to null
  const [movies, setMovies] = useState<Movie[] | null>(null)

  // useEffect hook to fetch data from an API when the component mounts
  useEffect(() => {
    // fetch data from an API /api/movies/popular
    fetch('/api/movies/popular')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched movies data:', data) // Log the fetched data for debugging
        setMovies(data.results) // Update the state with the fetched movies data
      })
  }, [])

  return (
    <div>
      <h1>Popular Movies</h1>
      {movies ? (
        <ul>
          {movies.map((movie) => (
            <li key={movie.id}>
              <h2>{movie.title}</h2>
              <p>{movie.overview}</p>
              <p>Release Date: {movie.release_date}</p>
              <p>Rating: {movie.vote_average}</p>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
    )
  }
