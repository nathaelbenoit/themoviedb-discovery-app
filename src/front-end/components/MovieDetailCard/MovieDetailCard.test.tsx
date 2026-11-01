// @vitest-environment jsdom

import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import type { MovieDetails } from '../../../back-end/types/MoviesTypes';
import MovieDetailCard from './MovieDetailCard';

afterEach(cleanup);

const movie = {
  id: 123,
  title: 'Example Movie',
  release_date: '2024-05-10',
  vote_average: 7.456,
  poster_path: '/example-poster.jpg',
  tagline: 'An example tagline',
  genres: [
    { id: 1, name: 'Drama' },
    { id: 2, name: 'Mystery' },
  ],
  overview: 'An example movie summary.',
} as MovieDetails;

describe('MovieDetailCard', () => {
  it('renders the movie details when poster, tagline, and genres are available', () => {
    // Arrange
    const expectedPosterUrl =
      'https://image.tmdb.org/t/p/w300/example-poster.jpg';

    // Act
    render(<MovieDetailCard movie={movie} />);

    // Assert: the card presents the movie's image and descriptive details.
    expect(
      screen
        .getByRole('img', { name: `Affiche de ${movie.title}` })
        .getAttribute('src'),
    ).toBe(expectedPosterUrl);
    expect(
      screen.getByRole('heading', { level: 1, name: movie.title }),
    ).toBeTruthy();
    expect(screen.getByText(movie.tagline!)).toBeTruthy();
    expect(screen.getByText('2024')).toBeTruthy();
    expect(screen.getByText('7.5')).toBeTruthy();
    expect(screen.getByText('Drama')).toBeTruthy();
    expect(screen.getByText('Mystery')).toBeTruthy();
    expect(screen.getByText(movie.overview)).toBeTruthy();
  });

  it('renders the poster and genre fallbacks when optional details are unavailable', () => {
    // Arrange
    const movieWithoutOptionalDetails = {
      ...movie,
      poster_path: null,
      tagline: '',
      genres: [],
    } as MovieDetails;

    // Act
    render(<MovieDetailCard movie={movieWithoutOptionalDetails} />);

    // Assert: no image or optional content is shown, but the summary remains.
    expect(
      screen.queryByRole('img', {
        name: `Affiche de ${movieWithoutOptionalDetails.title}`,
      }),
    ).toBeNull();
    expect(screen.queryByText(movie.tagline!)).toBeNull();
    expect(screen.queryByText('Drama')).toBeNull();
    expect(screen.getByText(movieWithoutOptionalDetails.overview)).toBeTruthy();
  });
});
