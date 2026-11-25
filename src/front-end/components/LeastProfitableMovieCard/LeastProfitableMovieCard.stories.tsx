import type { Meta, StoryObj } from '@storybook/react-vite';
import type { LeastProfitableMovie } from './LeastProfitableMovieCard';
import LeastProfitableMovieCard from './LeastProfitableMovieCard';

/**
 * Film de test avec ROI négatif de -100 % comme spécifié dans le ticket DASHBOARD-20
 */
const movie: LeastProfitableMovie = {
  id: 123,
  title: 'Le film avec le ROI le plus bas',
  release_date: '2024-05-10',
  poster_path: '/example-poster.jpg',
  roi: -100,
};

const meta = {
  title: 'Dashboard/LeastProfitableMovieCard',
  component: LeastProfitableMovieCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord présentant le film ayant le plus faible retour sur investissement (ROI), son affiche, son année de sortie et sa valeur ROI formatée en pourcentage avec deux décimales. Le signe négatif est conservé. Les états de chargement, d’erreur, de donnée absente et d’affiche indisponible sont également documentés.\n\n' +
          '**Règle de ROI validée (identique au widget le plus rentable) :**\n' +
          'ROI (%) = ((revenue - budget) / budget) * 100\n\n' +
          '**Règles d’éligibilité :**\n' +
          '- Le film doit avoir un budget > 0\n' +
          '- Le film doit avoir un revenue >= 0\n' +
          '- Une valeur inconnue n’est pas présentée comme zéro\n' +
          '- Le signe négatif est conservé',
      },
    },
  },
  argTypes: {
    movie: {
      description:
        'Objet LeastProfitableMovie présenté dans le widget. Fournit le titre, l’année, le ROI et le chemin de l’affiche. Le ROI est déjà calculé selon la formule validée.',
      table: {
        type: { summary: 'LeastProfitableMovie | null' },
        defaultValue: { summary: 'null' },
      },
    },
    loading: {
      description:
        'Active l’état de chargement accessible avec l’attribut aria-busy.',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: 'false' },
      },
    },
    error: {
      description:
        'Message présenté dans un conteneur role="alert" lorsque les données ne peuvent pas être chargées.',
      table: {
        type: { summary: 'string | null' },
        defaultValue: { summary: 'null' },
      },
    },
  },
} satisfies Meta<typeof LeastProfitableMovieCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * État nominal avec ROI négatif de -100 % comme spécifié dans le ticket.
 */
export const Nominal: Story = {
  args: { movie },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche complète, titre lisible, année de sortie et ROI négatif de -100 % formaté avec deux décimales. Le signe négatif est conservé.',
      },
    },
  },
};

/**
 * ROI à zéro (valeur nulle valide, différente de null).
 */
export const ZeroROI: Story = {
  args: {
    movie: { ...movie, roi: 0 },
  },
  parameters: {
    docs: {
      description: {
        story:
          'ROI à 0,00 %. Distingue une valeur nulle valide (0) d’une valeur inconnue (null).',
      },
    },
  },
};

/**
 * Valeur inconnue pour le ROI.
 */
export const UnknownROI: Story = {
  args: {
    movie: { ...movie, roi: null },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Présente la valeur « Inconnue » pour le ROI sans la confondre avec zéro.',
      },
    },
  },
};

/**
 * Affiche un remplacement accessible lorsqu’aucun chemin d’affiche n’est fourni.
 */
export const MissingPoster: Story = {
  args: {
    movie: { ...movie, poster_path: null },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Affiche un remplacement accessible lorsqu’aucun chemin d’affiche n’est fourni.',
      },
    },
  },
};

/**
 * État vide lorsque le catalogue ne fournit aucun film éligible.
 */
export const Empty: Story = {
  args: { movie: null },
  parameters: {
    docs: {
      description: {
        story:
          'État vide lorsque le catalogue ne fournit aucun film éligible à afficher.',
      },
    },
  },
};

/**
 * Indique qu’une récupération de données est en cours.
 */
export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          'Indique qu’une récupération de données est en cours avec un état accessible.',
      },
    },
  },
};

/**
 * Présente une erreur lisible dans un conteneur role="alert".
 */
export const Error: Story = {
  args: { error: 'Impossible de charger le film le moins rentable.' },
  parameters: {
    docs: {
      description: {
        story: 'Présente une erreur lisible dans un conteneur role="alert".',
      },
    },
  },
};
