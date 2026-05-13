# Refactor — Mise en conformité FSD du projet

> **Branche** : `chore/refactor-cleanup` (depuis `develop` @ `16285e9`)
> **Auteur** : Julien
> **Date** : 2026-05-13
> **Pour qui** : Agathe, Raphaël (et toute personne qui arrive sur la branche)

## Comment lire ce document

Cette branche **ne change rien au comportement de l'app**. Aucune feature ajoutée, aucun bug fixé, le rendu visuel est strictement identique. Tout le diff est de la **réorganisation** : déplacer, renommer, dédupliquer pour aligner le code sur l'architecture Feature-Sliced Design (FSD).

Le volume est gros (8 commits, ~50 fichiers touchés, +700 / -750 lignes nettes) parce qu'on a touché à la structure et au nommage de presque tous les éléments des slices `book` et `navigation`, plus la couche `app/`.

**Si tu lis ce doc avant de plonger dans la branche, tu retrouveras tes repères beaucoup plus vite.**

Trois angles d'entrée selon ce que tu cherches :

| Tu cherches… | Va voir |
|---|---|
| Un hook que tu connaissais sous un autre nom | [Table de correspondance avant/après](#correspondance-avantaprès-des-fichiers-renommés) |
| La règle FSD derrière une décision | [Les 5 axes du refactor](#les-5-axes-du-refactor) |
| Comment placer un nouveau hook / type / composant | [Règles pour les prochains commits](#règles-pour-les-prochains-commits) |

## TL;DR

| Avant | Après | Pourquoi |
|---|---|---|
| Dossiers `features/<slice>/hooks/` et `types/` | Tout reclassé dans `api/`, `model/`, `lib/`, `mocks/` | La doc FSD officielle nomme explicitement `hooks` et `types` comme « bad segment names » |
| 2 hooks dupliquaient `mapOpenLibraryToBook` | Mapper dédupliqué dans `api/mappers/openLibrary.ts` | Source de vérité unique au boundary externe |
| Hooks avec shapes hétérogènes (`Book[]`, `{books, loading}`, `{shelves, ...}`) | Contrat unifié `{ data, isLoading, error }` | Aligne sur TanStack Query/SWR → migration future zéro friction |
| Page `BookDetailPage` assemblait 6 atomes UI (`BookCover`, `BookCTA`, etc.) | Composite `BookDetail` exposé, atomes internes | Encapsulation : la slice expose ses composites, pas ses building blocks |
| Pages important `@/features/book/ui/Foo`, `@/features/book/api/Bar`, etc. | Tout passe par `@/features/book` (public API minimaliste) | Règle FSD du public API |
| `src/index.css` à la racine, `src/app/providers/router.tsx` | `src/app/styles/index.css`, `src/app/routes/router.tsx` | Segments FSD canoniques pour la couche app |
| Rien n'enforçait les règles d'import FSD | `eslint-plugin-fsd-lint` actif avec 6 règles | Les futurs PR sont vérifiés mécaniquement |

## Vue d'ensemble — les 8 commits de la branche

```
2ca12c0  refactor(app): split CSS and router into FSD segments (styles, routes)
a77a7fb  chore: auto-fix import ordering and ignore CSS in no-relative-imports
41910cf  refactor: define minimalist FSD public APIs and migrate call sites
ed8e9af  refactor(book): introduce BookDetail composite widget
f3cf604  chore: add eslint-plugin-fsd-lint and wire FSD import rules
b425a4b  docs(book): add FSD hooks refactor reference   (ancien nom de ce doc)
7a4d711  refactor(book,navigation): migrate hooks and types to FSD segments
c31c7f8  chore(book): add API/lib primitives for refactor
```

Chaque commit passe `tsc`, `eslint` et `vite build`. Les commits sont **atomiques par intent** : tu peux lire un commit à la fois pour comprendre une intention isolée.

## Pourquoi FSD — rappel court

Citation officielle ([FSD · Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)) :

> *« `components`, `hooks`, and `types` are bad segment names because they aren't that helpful when you're looking for code. »*

Les segments FSD doivent décrire **l'objectif** du code, pas sa nature technique. Un dossier `hooks/` ne dit rien parce qu'un hook peut être :

- du data-fetching (→ `api/`)
- de la business logic (→ `model/`)
- une pure helper function (→ `lib/`)
- juste un state d'UI (→ colocalisé dans `ui/`)

Les segments standards FSD sont :

| Segment | Rôle (citation doc) |
|---|---|
| `ui` | UI display: composants, formatters d'affichage, styles |
| `api` | backend interactions: request functions, data types, **mappers** |
| `model` | data model: schémas, interfaces, stores, **business logic** |
| `lib` | library code (helpers internes à la slice) |
| `config` | configuration files and feature flags |

Plus deux conventions de fait que ce refactor utilise :

| Segment | Rôle |
|---|---|
| `mocks` | Fixtures statiques pour développer sans backend |
| `routes` | Configuration de routeur (couche `app/` uniquement) |

## Correspondance avant/après des fichiers renommés

### `features/book/`

| Avant | Après | Type de changement |
|---|---|---|
| `hooks/useBookDetail.ts` | `api/useBookDetail.ts` | déplacement |
| `hooks/useBookSearch.ts` (filter local pur) | `lib/filterBooksByQuery.ts` (fonction pure) | déplacement + rename + dehookification |
| `hooks/useSearchBooks.ts` (fetch distant) | `api/useBookSearch.ts` | déplacement + rename (entity-first) |
| `hooks/useOpenLibraryBooks.ts` | `api/useDiscoveryCategoryBooks.ts` | déplacement + rename (source-agnostic) |
| `hooks/useRelatedBooks.ts` | `model/useRelatedBooks.ts` | déplacement |
| `hooks/useDiscoveryBooks.ts` | `model/useDiscoveryBooks.ts` | déplacement |
| `hooks/useSampleBooks.ts` (wrapper inutile) | `mocks/userLibrary.mock.ts` (data `MOCK_USER_LIBRARY`) + `api/useUserLibrary.ts` (hook async-shaped) | split en deux |
| `hooks/useSampleBooksByShelf.ts` | `mocks/userShelves.mock.ts` (`MOCK_USER_SHELVES`) + `api/useUserShelves.ts` | split en deux |
| `types/bookShelf.ts` | `model/bookShelf.types.ts` | déplacement |

**Nouveaux fichiers utilitaires** :
- `api/client.ts` — constante `BOOK_API_BASE`
- `api/mappers/openLibrary.ts` — mapper dédupliqué (cf. [Axe 2](#axe-2--anti-corruption-layer-pour-les-sources-externes))
- `lib/discoveryCache.ts` — cache localStorage (TTL 1h)
- `ui/BookDetail.tsx` — composite (cf. [Axe 4](#axe-4--composite-bookdetail--public-api-minimaliste))

### `features/navigation/`

| Avant | Après |
|---|---|
| `hooks/useFilteredLinks.ts` (`useMemo` + filter) | `lib/filterLinksByAuth.ts` (fonction pure) |
| `types/navigation.ts` | `model/navigation.types.ts` |

### `src/` (couche app)

| Avant | Après |
|---|---|
| `src/index.css` | `src/app/styles/index.css` |
| `src/app/providers/router.tsx` | `src/app/routes/router.tsx` |

**Pas déplacé** : `src/main.tsx` reste à la racine (cf. [décision explicite](#1--src-maintsx-reste-à-la-racine)).

## Les 5 axes du refactor

### Axe 1 — Hooks et types reclassés dans des segments FSD idiomatiques

Tous les `hooks/` et `types/` ont disparu. Chaque hook est désormais dans le segment qui matche son intention :

```
features/book/
├── api/                            ← data-fetching (futur ou présent)
│   ├── client.ts                       (BOOK_API_BASE)
│   ├── mappers/openLibrary.ts          (boundary externe)
│   ├── useBookDetail.ts                (mock today, fetch demain)
│   ├── useBookSearch.ts                (recherche distante + state)
│   ├── useDiscoveryCategoryBooks.ts    (fetch une catégorie de feed)
│   ├── useUserLibrary.ts               (mock today)
│   └── useUserShelves.ts               (mock today)
├── model/                          ← business logic + types
│   ├── book.types.ts
│   ├── bookCta.types.ts
│   ├── bookShelf.types.ts
│   ├── relatedBooks.types.ts
│   ├── useDiscoveryBooks.ts            (composition feed + fallback)
│   └── useRelatedBooks.ts              (matching par series/collection/genre)
├── lib/                            ← pure helpers internes
│   ├── categories.ts
│   ├── discoveryCache.ts
│   ├── filterBooksByQuery.ts
│   ├── formatBookStat.ts
│   └── shelf.ts
├── mocks/                          ← fixtures dev sans backend
│   ├── books.mock.ts                   (MOCK_BOOKS_BY_ID)
│   ├── userLibrary.mock.ts             (MOCK_USER_LIBRARY)
│   └── userShelves.mock.ts             (MOCK_USER_SHELVES)
├── ui/                             ← composants (atomes internes + composites publics)
├── config/                         ← feature flags / sections config
└── index.ts                        ← public API (cf. Axe 4)
```

#### Pourquoi `useBookSearch` est devenu une **fonction pure** (`filterBooksByQuery`)

L'ancien `useBookSearch` faisait `useMemo(() => books.filter(...), [books, query])`. Une operation cheap (substring), pas de side-effect, pas de state. Le `useMemo` est un détail de performance du caller, pas une responsabilité du hook. Le convertir en fonction pure simplifie : plus de règle des hooks, plus de fake-hook noise, utilisable hors composant React. Les callers appliquent `useMemo` eux-mêmes quand c'est pertinent.

#### Pourquoi `useSampleBooks` a été **supprimé** et remplacé par deux objets distincts

`useSampleBooks` faisait `useMemo(() => SAMPLE_BOOKS, [])` autour d'une constante top-level. La constante est déjà stable par construction → `useMemo` no-op. Le hook ne fait rien.

Le refactor distingue deux préoccupations qui étaient mélangées :

1. **La fixture statique** : `MOCK_USER_LIBRARY` dans `mocks/userLibrary.mock.ts`. C'est juste de la donnée factice.
2. **Le contrat data-fetching** : `useUserLibrary()` dans `api/`, qui retourne `{ data, isLoading, error }`. Aujourd'hui il enveloppe la fixture avec `isLoading: false, error: null` ; demain il fera un vrai fetch — et les composants consommateurs **n'auront rien à changer**.

C'est le pattern « boundary-swap » : on figure dès aujourd'hui le contrat asynchrone réel, même quand la data est synchrone.

#### Pourquoi `useOpenLibraryBooks` est devenu `useDiscoveryCategoryBooks`

L'ancien nom couplait le hook à sa source externe transitoire. Quand le backend prod remplacera OpenLibrary, le nom mentira. Le nouveau nom décrit le **purpose** (fetch les livres d'une catégorie de discovery feed), source-agnostic. Au passage, le type `OpenLibraryCategory` dupliquait `DiscoveryCategory` (mêmes valeurs) — duplication supprimée.

### Axe 2 — Anti-corruption layer pour les sources externes

Le fichier `features/book/api/mappers/openLibrary.ts` matérialise un **pattern d'architecture** important. Il isole le format **externe** (OpenLibrary, demain Google Books / ISBN-DB / votre backend prod) du modèle **interne** (`Book`).

Trois exports :

- `OpenLibraryDoc` — décrit le shape **brut** côté OpenLibrary (`author_name`, `first_publish_year`, `cover_i`, snake_case, champs optionnels). C'est leur schéma, pas le nôtre.
- `OpenLibraryResponse` — l'enveloppe HTTP retournée par leur endpoint.
- `mapOpenLibraryToBook(doc) → Book | null` — la conversion :
  1. **Filtre** : pas de `cover_i` → retourne `null` (règle métier UI : pas de livre sans couverture).
  2. **Renomme / remap** : `author_name[0] → author`, `first_publish_year → publishedDate`, `cover_i → coverUrl` (construction URL CDN), `key → id`.
  3. **Comble en `null`** tous les champs `Book` qu'OpenLibrary ne fournit pas (`genre`, `language`, `pageCount`, `rating`, `copies`, `summary`, `series*`, `collection*`).

#### Pourquoi à ce niveau (au boundary, pas dans les hooks ni le modèle)

```
Source externe (OpenLibrary)
         ↓  format snake_case, conventions externes
[api/mappers/openLibrary.ts]   ← unique endroit qui « parle leur langage »
         ↓  maintenant on parle Book
[api/use<Xxx>.ts]              ← fetch + state, n'ouvre jamais un Doc externe
         ↓
Book (model/book.types.ts)     ← modèle stable
         ↓
ui/, model/business, pages     ← ignorent qu'OpenLibrary existe
```

Cite la doc FSD : *« `api` — backend interactions: request functions, data types, **mappers**, etc. »*

#### Avant le refactor

`mapOpenLibraryToBook` était **dupliqué** dans `useOpenLibraryBooks` et `useSearchBooks`, avec l'interface `OpenLibraryBook` redéfinie deux fois **et subtilement différente** (un `isbn?: string[]` en plus côté search, jamais consommé). Risque de divergence silencieuse au moindre changement de schéma OpenLibrary.

#### Règle pour une nouvelle source externe

Demain on ajoute Google Books pour les résumés ?

1. Créer `features/book/api/mappers/googleBooks.ts` avec :
   - Une interface `GoogleBooksVolume` (leur shape)
   - Une interface `GoogleBooksResponse`
   - Une fonction `mapGoogleBooksToBook(volume) → Book | null`
2. Le nouveau hook (`api/useBookSummary.ts` ou similaire) importe **uniquement** ce mapper.
3. **Aucun autre fichier ne change.** Le modèle `Book` reste figé, les composants n'apprennent rien sur Google Books.

Le mapper est **le seul endroit** du projet où nommer la source externe est légitime — partout ailleurs (hooks, cache, types métier), les noms sont source-agnostic.

### Axe 3 — Couche `app/` segmentée

La couche `app/` (sommet de la hiérarchie FSD) accueille tout ce qui est **transversal** : routes, providers, styles globaux, point d'entrée. Elle se découpe en **segments** (pas en slices).

Structure adoptée :

```
src/app/
├── App.tsx              ← composant racine, assemble RouterProvider + router
├── routes/
│   └── router.tsx           (createBrowserRouter([...]))
├── styles/
│   └── index.css            (Tailwind layers + theme tokens + resets)
└── layouts/
    └── MainLayout/
        ├── MainLayout.tsx
        ├── Navbar.tsx
        ├── NavbarDesktop.tsx
        ├── NavbarMobile.tsx
        └── index.ts
```

Et **`src/main.tsx` reste à la racine** (décision explicite documentée plus bas).

### Axe 4 — Composite `BookDetail` + Public API minimaliste

Le principe FSD du **public API** : chaque slice expose un `index.ts` racine qui est le **seul point d'entrée** légitime depuis l'extérieur. Tout import direct vers un fichier interne de la slice (`@/features/book/ui/BookCover` par exemple) est interdit.

Stratégie adoptée : **minimaliste**. La slice n'expose que des composants haut-niveau, des hooks, des types et les utilities consommées par les pages. Les atomes UI restent privés.

#### `features/book` expose (15 items)

```ts
// Types
export type { Book } from './model/book.types'
export type { BookShelf, BookShelfSlug } from './model/bookShelf.types'
export type { BookCTAState, BookCTAKind } from './model/bookCta.types'
export type { DiscoveryCategory } from './lib/categories'

// UI composites (high-level only)
export { BookDetail } from './ui/BookDetail'
export { BookRelatedSections } from './ui/BookRelatedSections'
export { BookGrid } from './ui/BookGrid'
export { BookSection } from './ui/BookSection'
export { SearchBar } from './ui/SearchBar'
export { BookCTA } from './ui/BookCTA'

// Hooks
export { useBookDetail } from './api/useBookDetail'
export { useBookSearch } from './api/useBookSearch'
export { useUserLibrary } from './api/useUserLibrary'
export { useUserShelves } from './api/useUserShelves'
export { useDiscoveryBooks } from './model/useDiscoveryBooks'

// Pure utilities consommées par pages
export { filterBooksByQuery } from './lib/filterBooksByQuery'
export { DISCOVERY_LABELS, DISCOVERY_ORDER, discoveryToSlug, slugToDiscovery } from './lib/categories'
export { SHELF_LABELS, SHELF_ORDER, shelfToSlug, slugToShelf } from './lib/shelf'
```

#### Internes (NON exposés)

- **Atomes UI** : `BookCover`, `BookMeta`, `BookSummary`, `BookmarkButton`, `StatBadgeGroup`, `StatBadge`, `BookCard`, `BookCarousel` → consommés uniquement à travers les composites publics (`BookDetail`, `BookSection`, etc.).
- **Hooks internes** : `useRelatedBooks`, `useDiscoveryCategoryBooks` → consommés par `BookRelatedSections` et `useDiscoveryBooks`.
- **Boundary externe** : `OpenLibraryDoc`, `mapOpenLibraryToBook`, `BOOK_API_BASE`, `discoveryCache` → personne en dehors d'`api/` ne doit y toucher.
- **Fixtures** : `MOCK_USER_LIBRARY`, `MOCK_USER_SHELVES`, `MOCK_BOOKS_BY_ID` → les hooks les exposent au travers du contrat data-fetching.

#### Pourquoi le composite `BookDetail` a été créé

Avant le refactor, `BookDetailPage` assemblait elle-même 6 composants atomiques (`BookCover`, `BookCTA`, `BookMeta`, `BookSummary`, `BookmarkButton`, `StatBadgeGroup`) avec un layout précis (flex column, viewport-aware height). C'est de la **composition UI métier** — ça n'appartient pas à la page (qui ne devrait s'occuper que du routing + des états error/loading), mais à la slice `book`.

Le composite `BookDetail` encapsule ce layout. La page consomme simplement :

```tsx
<BookDetail
  book={book}
  leadingSlot={<BackButton />}
  onReserveConfirm={...}
  onActiveStateClick={...}
/>
```

Les états `BookDetailLoadingState` et `BookDetailNotFoundState` restent dans `BookDetailPage.tsx` — ce sont des préoccupations de page (routing-aware), pas de la slice.

#### `features/navigation` expose

```ts
export type { NavLink } from './model/navigation.types'
export { filterLinksByAuth } from './lib/filterLinksByAuth'
```

#### Contrat unifié des hooks data-fetching

Tous les hooks data-fetching exposent désormais le même shape (convention TanStack Query / SWR) :

```ts
interface QueryResult<T> {
  data: T
  isLoading: boolean
  error: Error | null
}
```

Hooks alignés : `useBookDetail`, `useUserLibrary`, `useUserShelves`, `useDiscoveryCategoryBooks`, `useDiscoveryBooks`, `useBookSearch` (ce dernier expose en plus `search` + `reset` pour piloter l'appel impératif).

Côté caller, on rename à la destructuration quand on a besoin de clarté locale :

```tsx
const { data: books } = useUserLibrary()
const { data: discoveryBooks } = useDiscoveryBooks()
```

Pourquoi `data` (générique) plutôt que `books` / `shelves` (domaine) :

- Convention canonique TanStack Query / SWR. Si on adopte l'une de ces libs plus tard, **les composants n'ont rien à toucher** côté destructuration : `useQuery` retourne déjà `{ data, isLoading, error, ... }`.
- Le shape n'est pas couplé au nom du domaine. Si demain `useUserLibrary` renvoie autre chose qu'un `Book[]` (paginé, groupé), le nom `data` reste valide.

Les pages consomment aujourd'hui `data` mais ignorent souvent `isLoading` / `error` (mock = `false` / `null` constants). Le shape est en place, brancher loading/error visuel = ticket UI séparé pour quand le backend réel arrive.

### Axe 5 — ESLint plugin pour enforcer les règles FSD

`eslint-plugin-fsd-lint@1.2.1` est installé et configuré dans `eslint.config.js`. Six règles actives :

| Règle | Sévérité | Ce qu'elle bloque |
|---|---|---|
| `fsd/forbidden-imports` | error | Import qui viole la direction des layers (ex : `entities` importe `features`) |
| `fsd/no-cross-slice-dependency` | error | Import direct d'une slice depuis une autre slice du même layer |
| `fsd/no-public-api-sidestep` | error | Import direct vers un sous-fichier d'une slice (`@/features/book/ui/Foo`) au lieu du `index.ts` |
| `fsd/no-relative-imports` | error (avec `allowSameSlice: true` + `ignoreImportPatterns: ['\\.css$']`) | Import relatif cross-slice |
| `fsd/no-ui-in-business-logic` | error | Composants UI importés dans `model/` ou `api/` |
| `fsd/ordered-imports` | warning (auto-fix) | Ordre des imports (externes avant internes, par layer) |

#### Quand un PR échoue

Husky/lint-staged exécute `eslint --fix` sur les fichiers stagés. Si une règle FSD est violée :

```
🚨 Direct import from '@/features/book/ui/Foo' is not allowed.
   Use the public API (index file) instead.
```

→ Corrige en passant par `@/features/book`. Si tu te retrouves à devoir exposer `Foo` dans le `index.ts` parce qu'une page en a besoin, **pause** : c'est probablement le signe qu'il manque un composite haut-niveau. Ouvre une discussion plutôt que d'éroder le public API.

#### Pourquoi pas le plugin officiel `@feature-sliced/eslint-config` ?

Il s'appuie sur le format legacy `.eslintrc` ; le projet utilise déjà ESLint 9 en flat config. `eslint-plugin-fsd-lint` est compatible flat config et plus simple à brancher.

#### Pourquoi pas `steiger` (linter standalone FSD) ?

Outil séparé du pipeline ESLint, status beta, breaking changes récents (v0.5.0 a cassé le config). Le plugin ESLint suffit au besoin actuel et s'intègre déjà avec husky/lint-staged.

## Patterns adoptés (réutilisables)

### Pattern : anti-corruption layer

Cf. [Axe 2](#axe-2--anti-corruption-layer-pour-les-sources-externes). Une source externe ne contamine que `api/mappers/<source>.ts`.

### Pattern : boundary-swap pour les hooks data-fetching

Un hook qui consomme une fixture aujourd'hui doit déjà exposer la shape `{ data, isLoading, error }`. Le jour où on branche un vrai fetch, **les consumers ne bougent pas**. Si la shape n'est pas asynchrone (`Book[]` direct), le swap futur cassera tous les composants.

### Pattern : public API minimaliste

Une slice expose UNIQUEMENT :
- des **composites** (composants haut-niveau qui assemblent les atomes)
- des **hooks** au contrat clair
- des **types** stables
- des **pure utilities** utilisées par les consommateurs externes

Les atomes UI, les mappers, les caches, les fixtures, les hooks internes → restent privés. Si tu as besoin d'un atome depuis l'extérieur, c'est probablement le signe qu'il manque un composite.

### Pattern : naming

- **Hooks** : entity-first (`useBookDetail`, `useUserLibrary`), pas verb-first (`useFetchBookDetail`).
- **Fonctions pures de filtre** : verb-first avec critère explicite (`filterBooksByQuery`, `filterLinksByAuth`).
- **Mocks** : préfixe `MOCK_*` en SCREAMING_CASE (`MOCK_USER_LIBRARY`, `MOCK_BOOKS_BY_ID`). Fichiers en `*.mock.ts`.
- **Mappers** : `map<Source>To<Target>` (`mapOpenLibraryToBook`).
- **Types de modèle** : `<entity>.types.ts` (pas `<entity>.ts` ni `types/<entity>.ts`).

## Règles pour les prochains commits

### Où placer un nouveau hook

1. Le hook **fait du fetch backend** ou expose un résultat compatible TanStack ? → `features/<slice>/api/`
2. Le hook contient de la **logique métier** (calculs, règles, transformations spécifiques au domaine) ? → `features/<slice>/model/`
3. Le hook est en réalité un **utilitaire pur** (filter, formatter, helper sans state ni effect) ? → préfère une **fonction pure** dans `features/<slice>/lib/`
4. Le hook gère l'**état d'un composant UI** (open/close, focus, hover, etc.) ? → colocalise dans `features/<slice>/ui/` ou `shared/ui/`
5. **Jamais** de dossier `hooks/` dans une slice.

### Où placer un nouveau type

- Type lié au modèle de données → `features/<slice>/model/<entity>.types.ts`
- Type lié à l'UI (props d'un composant) → colocalisé dans le fichier du composant
- **Jamais** de dossier `types/` dans une slice.

### Où placer un nouveau composant

- Atomique, propre à la slice → `features/<slice>/ui/` (interne)
- Composite haut-niveau, consommé par des pages → `features/<slice>/ui/` + **exporté dans `index.ts`**
- Composant transversal (Button, Card, Skeleton…) → `shared/ui/`
- Layout d'app (Navbar, MainLayout) → `app/layouts/` (cf. doc FSD page-layouts qui autorise explicitement ce pattern)

### Comment importer

```ts
// ✅ Bon — intra-slice relatif
import type { Book } from '../model/book.types'

// ✅ Bon — cross-slice via public API
import { BookGrid, useUserLibrary } from '@/features/book'

// ❌ Mauvais — direct vers un fichier interne
import { BookCover } from '@/features/book/ui/BookCover'
```

## Décisions explicites (FAQ)

### 1. `src/main.tsx` reste à la racine

La doc FSD mentionne un segment `entrypoint` dans `app/`. Pourquoi ne pas avoir bougé `main.tsx` dans `src/app/entrypoint/main.tsx` ?

- **Convention Vite** : `index.html` référence `/src/main.tsx`. Vite + l'écrasante majorité des projets FSD+React+Vite gardent ce fichier à la racine.
- **Discoverabilité** : `src/main.tsx` est l'endroit où un nouveau contributeur s'attend à trouver le bootstrap. L'enterrer dans `src/app/entrypoint/` ajoute une indirection sans gain.
- **Communauté** : consensus pragma. *« main.tsx file typically remains in the src/ directory root »* — [FSD Tutorial](https://feature-sliced.design/docs/get-started/tutorial).

### 2. `app/routes/` plutôt que `app/providers/`

L'ancien fichier `app/providers/router.tsx` ne contenait **aucun Provider React** — juste un `createBrowserRouter([...])` qui exporte un objet `router`. Le wrap `<RouterProvider router={router}>` vit dans `App.tsx`.

Distinction sémantique appliquée :

| Segment | Contenu | Exemple |
|---|---|---|
| `routes/` | Config inerte de routes (data) | `createBrowserRouter([...])` |
| `providers/` | Wrappers React Context (composants) | `<ThemeProvider>`, `<QueryClientProvider>`, `<AuthProvider>` |

Conséquence : quand le premier vrai Provider arrivera (ex. `<ThemeProvider>`), on recréera `src/app/providers/`. Les deux segments coexisteront. **Un seul segment `providers/` pour TOUS les providers React**, pas un segment dédié par provider.

### 3. `src/app/layouts/MainLayout/` n'a pas bougé

Le guide officiel [FSD · Page layouts](https://feature-sliced.design/docs/guides/examples/page-layout) liste explicitement *« Move to `app/layouts` — Store the layout at the App layer and compose widgets there »* comme un des patterns autorisés pour les layouts qui composent des widgets. Notre `MainLayout` est exactement dans ce cas.

Refacto candidat (hors scope de ce branch) : extraire `Navbar` dans `widgets/navbar/` quand un 2ᵉ layout en aura besoin. Pour l'instant, colocation OK.

### 4. Cache localStorage dans `features/book/lib/` plutôt que `shared/lib/cache/`

YAGNI. Un seul consommateur (`useDiscoveryCategoryBooks`). Quand un 2ᵉ consommateur apparaîtra, on promeut vers `shared/lib/cache/` avec une API générique.

### 5. `useDiscoveryBooks` utilise `MOCK_USER_LIBRARY` comme fallback

Sémantique légèrement leaky : `MOCK_USER_LIBRARY` est la *bibliothèque utilisateur*, pas un *fallback discovery*. Le contenu est identique (mêmes 6 mocks Tolkien/Asimov/etc.) donc on tolère. Quand on aura un dataset de discovery fallback distinct, on créera `MOCK_DISCOVERY_FALLBACK`.

### 6. `fsd/no-global-store-imports` désactivée

Le projet n'a pas de store global (pas de Redux/Zustand/etc.). Règle réactivable le jour où un store entre.

## Anti-patterns à éviter

| Anti-pattern | Pourquoi | Correctif |
|---|---|---|
| Créer un dossier `hooks/` ou `types/` dans une slice | Bad segment names selon FSD | Place le hook dans `api/`/`model/`/`lib/` selon son intent ; place le type dans `model/<entity>.types.ts` |
| Hook qui wrap une constante avec `useMemo(() => CONST, [])` | No-op (la const est déjà stable) | Expose la const directement, ou si le hook prépare un swap futur fetch, donne-lui dès aujourd'hui la shape async |
| Import direct `@/features/<slice>/ui/<Foo>` depuis une page | Viole le public API | Passe par `@/features/<slice>`, expose `Foo` dans `index.ts` si besoin (mais préfère un composite) |
| Dupliquer un mapper externe entre deux hooks | Divergence silencieuse au moindre changement de schéma | Centralise dans `api/mappers/<source>.ts` |
| Nommer un hook d'après sa source (`useOpenLibraryBooks`) | Couplage à une implémentation transitoire | Nomme d'après son purpose (`useDiscoveryCategoryBooks`) |
| Retourner `Book[]` direct depuis un hook data-fetching | Shape ne survit pas au swap mock → fetch | Retourne `{ data, isLoading, error }` dès le départ |

## Sources

- [FSD · Layers](https://feature-sliced.design/docs/reference/layers)
- [FSD · Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)
- [FSD · Public API](https://feature-sliced.design/docs/reference/public-api)
- [FSD · Page layouts](https://feature-sliced.design/docs/guides/examples/page-layout)
- [FSD · Tutorial](https://feature-sliced.design/docs/get-started/tutorial)
- [FSD · Overview](https://feature-sliced.design/docs/get-started/overview)
- [Article — The Perfect Folder Structure for Scalable Frontend](https://feature-sliced.design/blog/frontend-folder-structure)
- [eslint-plugin-fsd-lint](https://github.com/effozen/eslint-plugin-fsd-lint)
