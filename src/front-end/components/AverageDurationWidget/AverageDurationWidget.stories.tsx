import type { Meta, StoryObj } from '@storybook/react-vite';
import AverageDurationWidget from './AverageDurationWidget';

const meta = {
  title: 'Dashboard/AverageDurationWidget',
  component: AverageDurationWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Le widget "Durée moyenne" affiche la durée moyenne des films en minutes et ses états de chargement, absence de données et erreur.',
      },
    },
  },
} satisfies Meta<typeof AverageDurationWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: {
    state: 'success',
    averageDuration: 107,
  },
};

export const Loading: Story = {
  args: {
    state: 'loading',
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
