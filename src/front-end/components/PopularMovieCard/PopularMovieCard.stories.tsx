import type { Meta, StoryObj } from '@storybook/react-vite';
import type { Movie } from '../../../back-end/types/MoviesTypes';
import PopularMovieCard from './PopularMovieCard';

const movie = {
  id: 123,
  title: '1 036,49 : le film le plus populaire',
  release_date: '2024-05-10',
  popularity: 1036.49,
  poster_path: '/example-poster.jpg',
} as Movie;

const meta = {
  title: 'Components/PopularMovieCard',
  component: PopularMovieCard,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    movie: {
      description: 'Film présenté dans la carte.',
    },
    loading: {
      description: 'Affiche l’état de chargement.',
    },
    error: {
      description: 'Message présenté en cas d’erreur de chargement.',
    },
  },
} satisfies Meta<typeof PopularMovieCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { movie },
};

export const MissingPoster: Story = {
  args: {
    movie: { ...movie, poster_path: null } as unknown as Movie,
  },
};

export const UnknownPopularity: Story = {
  args: {
    movie: { ...movie, popularity: null } as unknown as Movie,
  },
};

export const Loading: Story = {
  args: { loading: true },
};

export const Error: Story = {
  args: { error: 'Impossible de charger le film le plus populaire.' },
};

export const LongTitle: Story = {
  args: {
    movie: {
      ...movie,
      title:
        'Le très long titre dune aventure exceptionnelle qui reste entièrement lisible dans la carte du tableau de bord',
    } as Movie,
  },
};
