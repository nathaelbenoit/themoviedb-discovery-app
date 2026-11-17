import type { Meta, StoryObj } from '@storybook/react-vite';
import MovieDatabaseWidget from './MovieDatabaseWidget';

const meta = {
  title: 'Dashboard/MovieDatabaseWidget',
  component: MovieDatabaseWidget,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof MovieDatabaseWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Loading: Story = {
  args: {
    state: 'loading',
  },
};

export const WithMovies: Story = {
  args: {
    state: 'success',
    movieCount: 1248,
  },
};

export const Empty: Story = {
  args: {
    state: 'empty',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};
