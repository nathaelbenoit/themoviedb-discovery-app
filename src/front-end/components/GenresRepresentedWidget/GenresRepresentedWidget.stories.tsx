import type { Meta, StoryObj } from '@storybook/react-vite';
import GenresRepresentedWidget from './GenresRepresentedWidget';

const meta = {
  title: 'Dashboard/GenresRepresentedWidget',
  component: GenresRepresentedWidget,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord affichant le nombre de genres distincts représentés dans le catalogue. Le composant ne compte pas les associations film-genre, il affiche simplement la valeur fournie. Une valeur zéro valide est distinguée d’une donnée inconnue.',
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
    genreCount: {
      description:
        'Nombre de genres distincts à afficher. Le composant ne compte pas les associations film-genre, il utilise la valeur fournie.',
      table: {
        type: { summary: 'number | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
} satisfies Meta<typeof GenresRepresentedWidget>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * État nominal avec 19 genres comme spécifié dans le ticket DASHBOARD-21.
 */
export const Nominal: Story = {
  args: {
    state: 'success',
    genreCount: 19,
  },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche le libellé "Genres représentés", le sous-libellé "Diversité du catalogue" et le nombre de genres distincts (19) avec l’unité "genres".',
      },
    },
  },
};

/**
 * Zéro genre : valeur valide distinguée d’une donnée inconnue.
 */
export const ZeroGenres: Story = {
  args: {
    state: 'success',
    genreCount: 0,
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affiche 0 genre. Une valeur zéro valide est distinguée d’une donnée inconnue (état empty).',
      },
    },
  },
};

/**
 * État vide : aucune donnée disponible (genreCount est null/undefined).
 */
export const Empty: Story = {
  args: {
    state: 'empty',
  },
  parameters: {
    docs: {
      description: {
        story:
          'État vide lorsque aucune donnée n’est disponible. Différent de zéro genre.',
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
