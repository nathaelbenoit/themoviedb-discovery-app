import type { Meta, StoryObj } from '@storybook/react-vite';
import TopRatedMovieWidget from './TopRatedMovieWidget';

const meta = {
  title: 'Dashboard/TopRatedMovieWidget',
  component: TopRatedMovieWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Le widget "Film le mieux noté" affiche les informations du film fourni, sa note sur 10 et un remplacement explicite lorsque l’affiche est indisponible.',
      },
    },
  },
} satisfies Meta<typeof TopRatedMovieWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: {
    state: 'success',
    movie: {
      title: 'The Shawshank Redemption',
      releaseYear: 1994,
      rating: 9.1,
      posterPath: '/q6y0Go1tsGEsmtFryDOJo3dEmqu.jpg',
    },
  },
};

export const WithoutPoster: Story = {
  args: {
    state: 'success',
    movie: {
      title: 'A Film Without a Poster',
      releaseYear: null,
      rating: 9.1,
      posterPath: null,
    },
  },
};

export const Loading: Story = {
  args: {
    state: 'loading',
  },
};

export const NoRatedMovie: Story = {
  args: {
    state: 'empty',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};
