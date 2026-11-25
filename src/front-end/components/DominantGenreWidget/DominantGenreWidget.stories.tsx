import type { Meta, StoryObj } from '@storybook/react-vite';
import DominantGenreWidget from './DominantGenreWidget';

const meta = {
  title: 'Dashboard/DominantGenreWidget',
  component: DominantGenreWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord affichant le genre le plus présent et son effectif. Le composant affiche le résultat fourni sans recompter les films multigenres. Un nom long reste lisible.',
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
        'Nom du genre dominant à afficher. Le composant ne recompte pas les films multigenres, il utilise la valeur fournie.',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
    movieCount: {
      description:
        'Nombre de films associés à ce genre. L’unité "films" est ajoutée automatiquement.',
      table: {
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
} satisfies Meta<typeof DominantGenreWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * État nominal avec Drame et 322 films comme spécifié dans le ticket DASHBOARD-22.
 */
export const Nominal: Story = {
  args: {
    state: 'success',
    genreName: 'Drame',
    movieCount: 322,
  },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche "Genre dominant", le nom du genre (Drame) et son effectif (322 films).',
      },
    },
  },
};

/**
 * Aucun genre connu : état vide.
 */
export const NoGenre: Story = {
  args: {
    state: 'empty',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affiche "Aucun genre connu" lorsque aucun genre n’est disponible.',
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
    genreName: 'Science-Fiction et Fantastique Post-Apocalyptique',
    movieCount: 156,
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
