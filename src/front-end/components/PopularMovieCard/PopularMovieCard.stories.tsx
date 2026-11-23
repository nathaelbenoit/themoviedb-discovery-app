import type { Meta, StoryObj } from '@storybook/react-vite';
import type { PopularMovie } from './PopularMovieCard';
import PopularMovieCard from './PopularMovieCard';

const movie: PopularMovie = {
  id: 123,
  title: '1 036,49 : le film le plus populaire',
  release_date: '2024-05-10',
  popularity: 1036.49,
  poster_path: '/example-poster.jpg',
};

const meta = {
  title: 'Dashboard/PopularMovieCard',
  component: PopularMovieCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Widget du tableau de bord présentant le film ayant la popularité la plus élevée, son affiche, son année de sortie et sa valeur TMDB formatée. Les états de chargement, d’erreur, de donnée absente et d’affiche indisponible sont également documentés.',
      },
    },
  },
  argTypes: {
    movie: {
      description:
        'Objet Movie présenté dans le widget. Fournit le titre, l’année, la popularité et le chemin de l’affiche.',
      table: {
        type: { summary: 'PopularMovie | null' },
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
} satisfies Meta<typeof PopularMovieCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nominal: Story = {
  args: { movie },
  parameters: {
    docs: {
      description: {
        story:
          'État nominal : affiche complète, titre lisible, année de sortie et popularité TMDB formatée avec deux décimales.',
      },
    },
  },
};

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

export const UnknownPopularity: Story = {
  args: {
    movie: { ...movie, popularity: null },
  },
  parameters: {
    docs: {
      description: {
        story:
          'Présente la valeur « Inconnue » sans la confondre avec une note ou un nombre de votes.',
      },
    },
  },
};

export const Empty: Story = {
  args: { movie: null },
  parameters: {
    docs: {
      description: {
        story:
          'État vide lorsque le catalogue ne fournit aucun film à mettre en avant.',
      },
    },
  },
};

export const Loading: Story = {
  args: { loading: true },
  parameters: {
    docs: {
      description: {
        story:
          'Indique qu’une récupération de données est en cours avec un état accessible role="status".',
      },
    },
  },
};

export const Error: Story = {
  args: { error: 'Impossible de charger le film le plus populaire.' },
  parameters: {
    docs: {
      description: {
        story:
          'Présente une erreur lisible dans un conteneur role="alert" afin qu’elle soit annoncée aux technologies d’assistance.',
      },
    },
  },
};

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
          'Vérifie le comportement visuel lorsque le titre dépasse plusieurs lignes : ellipsage contrôlé et absence de débordement.',
      },
    },
  },
};
