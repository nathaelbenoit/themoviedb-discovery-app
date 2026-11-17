import type { Meta, StoryObj } from '@storybook/react-vite';
import TopProductionCountryWidget from './TopProductionCountryWidget';

const meta = {
  title: 'Dashboard/TopProductionCountryWidget',
  component: TopProductionCountryWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Le widget "Pays le plus représenté" affiche le pays et l’effectif calculés par le catalogue. Les associations multiples sont dédupliquées en amont du composant.',
      },
    },
  },
} satisfies Meta<typeof TopProductionCountryWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: {
    state: 'success',
    countryName: 'United States of America',
    movieCount: 725,
  },
};

export const LongCountryName: Story = {
  args: {
    state: 'success',
    countryName: 'United Kingdom of Great Britain and Northern Ireland',
    movieCount: 142,
  },
};

export const Loading: Story = {
  args: {
    state: 'loading',
  },
};

export const NoKnownCountry: Story = {
  args: {
    state: 'empty',
  },
};

export const Error: Story = {
  args: {
    state: 'error',
  },
};
