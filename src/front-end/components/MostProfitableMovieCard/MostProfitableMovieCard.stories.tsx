import type { Meta, StoryObj } from '@storybook/react-vite';
import type { MostProfitableMovie } from './MostProfitableMovieCard';
import MostProfitableMovieCard from './MostProfitableMovieCard';

/**
 * Film de test avec ROI de 69 667,36 % comme spécifié dans le ticket DASHBOARD-19
 */
const movie: MostProfitableMovie = {
  id: 123,
  title: '69 667,36 % : le film le plus rentable',
  release_date: '2024-05-10',
  poster_path: '/example-poster.jpg',
  roi: 69667.36,
};

const meta = {
  title: 'Dashboard/MostProfitableMovieCard',
  component: MostProfitableMovieCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord présentant le film ayant le meilleur retour sur investissement (ROI), son affiche, son année de sortie et sa valeur ROI formatée en pourcentage avec deux décimales. Les états de chargement, d’erreur, de donnée absente et d’affiche indisponible sont également documentés.\n\n' +
          '**Règle de ROI validée :**\n' +
          'ROI (%) = ((revenue - budget) / budget) * 100\n\n' +
          '**Règles d’éligibilité :**\n' +
          '- Le film doit avoir un budget > 0\n' +
          '- Le film doit avoir un revenue >= 0\n' +
          '- Une valeur inconnue n’est pas présentée comme zéro',
      },
    },
  },
  argTypes: {
    movie: {
      description:
        'Objet MostProfitableMovie présenté dans le widget. Fournit le titre, l’année, le ROI et le chemin de l’affiche. Le ROI est déjà calculé selon la formule validée.',
      table: {
        type: { summary: 'MostProfitableMovie | null' },
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
} satisfies Meta<typeof MostProfitableMovieCard>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * État nominal : affiche complète, titre lisible, année de sortie et ROI formaté avec deux décimales.
 * Exemple avec le ROI de 69 667,36 % comme spécifié dans le ticket.
 */
export const Nominal: Story = {
  args: { movie },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche complète, titre lisible, année de sortie et ROI formaté avec deux décimales. Utilise l’exemple de 69 667,36 % ROI du ticket DASHBOARD-19.',
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
          'Affiche un remplacement accessible lorsqu’aucun chemin d’affiche n’est fourni. Le placeholder indique clairement "Affiche indisponible".',
      },
    },
  },
};

/**
 * Présente la valeur « Inconnue » pour le ROI sans la confondre avec zéro.
 */
export const UnknownROI: Story = {
  args: {
    movie: { ...movie, roi: null },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Présente la valeur « Inconnue » pour le ROI sans la confondre avec une valeur de zéro. Conforme au critère : "une valeur inconnue n’est pas présentée comme zéro".',
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
          'État vide lorsque le catalogue ne fournit aucun film éligible à afficher. Affiche "Aucune donnée disponible".',
      },
    },
  },
};

/**
 * Indique qu’une récupération de données est en cours avec un état accessible.
 */
export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          'Indique qu’une récupération de données est en cours avec un état accessible role="status". Utilise l’attribut aria-busy pour les technologies d’assistance.',
      },
    },
  },
};

/**
 * Présente une erreur lisible dans un conteneur role="alert".
 */
export const Error: Story = {
  args: { error: 'Impossible de charger le film le plus rentable.' },
  parameters: {
    docs: {
      description: {
        story:
          'Présente une erreur lisible dans un conteneur role="alert" afin qu’elle soit annoncée aux technologies d’assistance. Exemple avec un message d’erreur clair.',
      },
    },
  },
};

/**
 * Vérifie le comportement visuel lorsque le titre dépasse plusieurs lignes.
 */
export const LongTitle: Story = {
  args: {
    movie: {
      ...movie,
      title:
        'Le très long titre dune aventure exceptionnelle qui reste entièrement lisible dans la carte du tableau de bord',
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Vérifie le comportement visuel lorsque le titre dépasse plusieurs lignes : ellipsage contrôlé et absence de débordement. Le titre est tronqué avec 3 lignes maximum.',
      },
    },
  },
};
