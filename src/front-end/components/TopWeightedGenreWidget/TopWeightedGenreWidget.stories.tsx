import type { Meta, StoryObj } from '@storybook/react-vite';
import TopWeightedGenreWidget from './TopWeightedGenreWidget';

const meta = {
  title: 'Dashboard/TopWeightedGenreWidget',
  component: TopWeightedGenreWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord affichant le genre ayant la meilleure note pondérée.\n\n' +
          '**Formule de pondération validée :**\n' +
          'La formule de pondération, ses paramètres et l’éligibilité des genres sont validés et documentés avant intégration réelle.\n' +
          '- Aucune formule n’est déduite de la capture\n' +
          '- Le backend fournit la note pondérée déjà calculée\n' +
          '- Le composant affiche simplement la valeur fournie sans appliquer de pondération\n\n' +
          'Un nom long reste lisible.',
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
        'Nom du genre avec la meilleure note pondérée. Un nom long reste lisible.',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
    weightedRating: {
      description:
        'Note pondérée du genre, calculée en amont selon la formule validée. Affichée avec deux décimales et l’échelle / 10.',
      table: {
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
} satisfies Meta<typeof TopWeightedGenreWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * État nominal avec Animation et 7,68 / 10 comme spécifié dans le ticket DASHBOARD-24.
 */
export const Nominal: Story = {
  args: {
    state: 'success',
    genreName: 'Animation',
    weightedRating: 7.68,
  },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche "Meilleure note pondérée", le nom du genre (Animation) et sa note pondérée (7,68 / 10) avec deux décimales. La mention "Note pondérée" indique le type de note.',
      },
    },
  },
};

/**
 * Aucun genre avec note pondérée valide : état vide.
 */
export const NoRating: Story = {
  args: {
    state: 'empty',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affiche "Aucun genre noté" lorsque aucun genre n’a de note pondérée valide.',
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
    weightedRating: 8.25,
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
