import type { Meta, StoryObj } from '@storybook/react-vite';
import TopRatedGenreWidget from './TopRatedGenreWidget';

const meta = {
  title: 'Dashboard/TopRatedGenreWidget',
  component: TopRatedGenreWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord affichant le genre ayant la meilleure note moyenne. Cette valeur est explicitement une moyenne simple, distincte de la note pondérée. Un genre sans notes valides n’est pas affiché comme noté zéro. Un nom long reste lisible.',
      },
    },
  },
  argTypes: {
    state: {
      description: 'État du widget (loading, success, empty, error).',
      table: {
        type: { summary: '"loading" | "success" | "empty" | "error"' },
        defaultValue: { summary: '"loading"' },
      },
    },
    genreName: {
      description:
        'Nom du genre avec la meilleure note moyenne. Un nom long reste lisible.',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
    averageRating: {
      description:
        'Note moyenne du genre, calculée en amont. C’est une moyenne simple (arithmétique), distincte de la note pondérée. Affichée avec deux décimales et l’échelle / 10.',
      table: {
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
} satisfies Meta<typeof TopRatedGenreWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * État nominal avec Animation et 7,41 / 10 comme spécifié dans le ticket DASHBOARD-23.
 */
export const Nominal: Story = {
  args: {
    state: 'success',
    genreName: 'Animation',
    averageRating: 7.41,
  },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche "Meilleure note", le nom du genre (Animation) et sa note moyenne (7,41 / 10) avec deux décimales. La mention "Moyenne simple" indique explicitement que c’est une moyenne arithmétique.',
      },
    },
  },
};

/**
 * Genre sans note valide : état vide.
 */
export const NoRating: Story = {
  args: {
    state: 'empty',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affiche "Aucun genre noté" lorsque aucun genre n’a de notes valides. Un genre sans notes valides n’est pas affiché comme noté zéro.',
      },
    },
  },
};

/**
 * Genre avec un nom long qui reste lisible.
 */
export const LongGenreName: Story = {
  args: {
    state: 'success',
    genreName: 'Science-Fiction et Fantastique',
    averageRating: 8.25,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Un nom de genre long reste lisible avec un titre (tooltip) pour voir le nom complet.',
      },
    },
  },
};

/**
 * Indique qu’une récupération de données est en cours.
 */
export const Loading: Story = {
  args: {
    state: 'loading',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Indique qu’une récupération de données est en cours avec un état accessible role="status".',
      },
    },
  },
};

/**
 * Présente une erreur lisible dans un conteneur role="alert".
 */
export const Error: Story = {
  args: {
    state: 'error',
  },
  parameters: {
    docs: {
      description: {
        story: 'Présente une erreur lisible dans un conteneur role="alert".',
      },
    },
  },
};
