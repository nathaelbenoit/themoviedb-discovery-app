import type { Meta, StoryObj } from '@storybook/react-vite';
import AverageRatingWidget from './AverageRatingWidget';

const meta = {
  title: 'Dashboard/AverageRatingWidget',
  component: AverageRatingWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Le widget "Note moyenne" affiche une moyenne simple fournie par le catalogue, au format français sur 10. Il ne calcule pas de moyenne pondérée.',
      },
    },
  },
} satisfies Meta<typeof AverageRatingWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: {
    state: 'success',
    averageRating: 6.78,
  },
};

export const Loading: Story = {
  args: {
    state: 'loading',
  },
};

export const NoRatings: Story = {
  args: {
    state: 'empty',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};
