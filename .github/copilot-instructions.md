# Instructions pour GitHub Copilot

## Conventions de commit

- Utiliser la convention de commit "Conventional Commits".
- Types autorisés : feat, fix, docs, style, refactor, test, chore.
- Format : `<type>: <message en anglais>`.
- Exemple : "feat: add new feature to the application"
- Le message de commit doit être rédigé en anglais et ne pas faire plus de 100 caractères dans le titre.

## Utilisation de GitHub Copilot

- GitHub Copilot doit être utilisé pour générer du code en respectant les conventions de commit ci-dessus.
- Toujours vérifier et ajuster le code généré par Copilot avant de le valider.
- Ne pas accepter aveuglément les suggestions de Copilot, surtout pour les parties critiques de l'application.
- Utiliser Copilot comme un assistant pour accélérer le développement, mais toujours appliquer son jugement et ses connaissances pour garantir la qualité et la sécurité du code.

## Tests unitaires frontend

- Écrire les tests des composants React dans un fichier colocaté nommé `NomDuComposant.test.tsx`.
- Utiliser Vitest et React Testing Library (`render`, `screen`) pour vérifier le comportement rendu par le composant.
- Ajouter `// @vitest-environment jsdom` en tête des tests frontend qui nécessitent le DOM.
- Regrouper les cas avec `describe` et `it`, et nommer les tests selon le comportement observé.
- Pour un scénario nominal simple, regrouper dans un seul `it` le rendu et les vérifications de ses principales sorties attendues ; ne pas créer un test distinct pour chaque assertion. Créer plusieurs tests lorsque les comportements ou scénarios vérifiés sont réellement distincts.
- Utiliser des mocks et des stubs pour isoler les composants et contrôler les dépendances externes si nécessaire.
- Ajouter des commentaires explicatifs pour chaque test afin de clarifier l'objectif et le comportement attendu.
- Utiliser le pattern Arrange-Act-Assert (AAA) pour structurer les tests de manière claire et cohérente.
- Nettoyer le DOM après chaque test avec `afterEach(cleanup)`.
- Utiliser des requêtes accessibles de `screen` (`getByRole`, `getByText`) et vérifier le contenu, les attributs et les interactions visibles par l'utilisateur plutôt que les détails internes du composant.
- Envelopper avec `MemoryRouter` les composants qui utilisent le routage. Définir une fonction de rendu locale lorsqu'elle simplifie la configuration ou permet de tester différentes routes.
- Préparer des données de test représentatives et réutilisables, avec les types du projet lorsque c'est pertinent.
- Vérifier les tests avec `npm test`.
