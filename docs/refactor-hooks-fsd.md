# Refactor — Migration des hooks vers les segments FSD idiomatiques

> Status : appliqué sur la branche `chore/refactor-cleanup` (depuis `develop` @ `16285e9`)
> Auteur : Julien
> Date : 2026-05-13

## TL;DR

Suppression des dossiers `features/<slice>/hooks/` non-idiomatiques. Chaque hook est reclassé dans le segment FSD qui décrit **son intention** (`api/`, `model/`, `lib/`, `mocks/`) plutôt que sa nature technique (`hooks/`). Deduplications au passage : `mapOpenLibraryToBook`, base URL API, cache localStorage.

## Pourquoi ce refactor

### La règle FSD officielle

Le projet suit l'architecture **Feature-Sliced Design** (FSD). La doc officielle est explicite :

> « `components`, `hooks`, and `types` are bad segment names because they aren't that helpful when you're looking for code. »
> — [FSD · Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)

Les noms de segments doivent décrire **l'objectif** du code, pas sa nature technique. Un dossier `hooks/` ne dit rien — un hook peut être du fetch, du business, du pur calcul, du wrap d'UI.

Les segments standards sont :

| Segment | Rôle (citation doc) |
|---|---|
| `ui` | « everything related to UI display: UI components, date formatters, styles, etc. » |
| `api` | « backend interactions: request functions, data types, mappers, etc. » |
| `model` | « the data model: schemas, interfaces, stores, and business logic. » |
| `lib` | « library code that other modules on this slice need. » |
| `config` | « configuration files and feature flags. » |

→ Un hook React s'intègre dans le segment qui matche **son intention métier**, pas dans un sous-dossier `hooks/`.

### État avant refactor

```
features/book/
├── hooks/        ← non-idiomatique (8 hooks de natures hétérogènes)
│   ├── useBookDetail.ts            (data-fetch shape, futur API)
│   ├── useBookSearch.ts            (filter pur)
│   ├── useDiscoveryBooks.ts        (compose fetch + fallback)
│   ├── useOpenLibraryBooks.ts      (fetch + cache localStorage)
│   ├── useRelatedBooks.ts          (matching algorithm)
│   ├── useSampleBooks.ts           (wrapper useMemo sans valeur)
│   ├── useSampleBooksByShelf.ts    (fixture)
│   └── useSearchBooks.ts           (fetch async + state)
├── types/        ← non-idiomatique aussi
│   └── bookShelf.ts
└── ...

features/navigation/
├── hooks/        ← non-idiomatique
│   └── useFilteredLinks.ts         (filter pur)
└── types/        ← non-idiomatique
    └── navigation.ts
```

### Problèmes annexes constatés

1. **Doublon `mapOpenLibraryToBook`** : défini deux fois (à l'identique fonctionnellement) dans `useOpenLibraryBooks` et `useSearchBooks`.
2. **Endpoint hardcodé `http://localhost:3001/books`** : répété dans les deux mêmes hooks.
3. **`useSampleBooks` = wrapper inutile** : `useMemo(() => SAMPLE_BOOKS, [])` — la const est déjà stable, le `useMemo` n'apporte rien.
4. **Imports orphelins** : `useBookSearch.ts` et `SearchBar.tsx` importent `../types/book` — fichier supprimé en PR US7 (`16285e9`). TypeScript silent (résolution chelou), mais ESLint l'aurait flag.

## Mapping avant → après

### `features/book/`

| Avant | Après | Justification segment |
|---|---|---|
| `hooks/useBookDetail.ts` | `api/useBookDetail.ts` | Shape `{data,isLoading,error}` = data-fetching, futur appel API réel |
| `hooks/useOpenLibraryBooks.ts` | `api/useDiscoveryCategoryBooks.ts` | Fetch + cache + mapper pour UNE catégorie de discovery. Renommé : "OpenLibrary" décrivait la source (transitoire), pas le purpose. Mapper extrait dans `api/mappers/openLibrary.ts` (boundary, nom de source légitime) ; cache dans `lib/discoveryCache.ts` ; URL base dans `api/client.ts` ; le type interne `OpenLibraryCategory` (duplication) supprimé, le hook utilise `DiscoveryCategory` de `lib/categories.ts` |
| `hooks/useSearchBooks.ts` | `api/useBookSearch.ts` | Fetch async distant. Renommé entity-first pour cohérence avec `useBookDetail`, `useUserLibrary`, etc. (l'ancien `useBookSearch` filter local a disparu en devenant `filterBooksByQuery`) |
| `hooks/useBookSearch.ts` | `lib/filterBooksByQuery.ts` | Pure function `(books, query) => Book[]`. Plus un hook : juste un filter (operation cheap, le `useMemo` côté callers est optionnel) |
| `hooks/useRelatedBooks.ts` | `model/useRelatedBooks.ts` | Logique métier (matching par genre / collection / série) |
| `hooks/useDiscoveryBooks.ts` | `model/useDiscoveryBooks.ts` | Logique de composition : fetch + fallback mock |
| `hooks/useSampleBooks.ts` | **supprimé** + `mocks/userLibrary.mock.ts` (`MOCK_USER_LIBRARY`) + `api/useUserLibrary.ts` (hook async-shaped) | Avant : `useMemo(() => CONST, [])` no-op. Refactor en deux : la fixture dans `mocks/`, et un vrai hook async-shaped `useUserLibrary() → {data, isLoading, error}` pour swap mock→fetch transparent à terme |
| `hooks/useSampleBooksByShelf.ts` | **supprimé** + `mocks/userShelves.mock.ts` (`MOCK_USER_SHELVES`) + `api/useUserShelves.ts` (hook async-shaped) | Idem : fixture séparée du hook ; hook expose `{data, isLoading, error}` |
| `types/bookShelf.ts` | `model/bookShelf.types.ts` | `types/` viole la même règle FSD |

### `features/navigation/`

| Avant | Après | Justification |
|---|---|---|
| `hooks/useFilteredLinks.ts` | `lib/filterLinksByAuth.ts` | Pure function. Suffixe `ByAuth` explicite le critère (cohérent avec `filterBooksByQuery`) |
| `types/navigation.ts` | `model/navigation.types.ts` | Cohérence FSD (move bonus) |

### Nouveaux fichiers utilitaires

| Fichier | Rôle |
|---|---|
| `features/book/api/client.ts` | Constante `BOOK_API_BASE` (URL backend) |
| `features/book/api/mappers/openLibrary.ts` | Mapper `OpenLibraryDoc → Book` dédupliqué |
| `features/book/lib/discoveryCache.ts` | Cache localStorage des résultats discovery (get/set, TTL 1h, prefix `discovery_*`) |

## Décisions et trade-offs explicites

### Pattern : anti-corruption layer pour les sources externes (`api/mappers/`)

Le fichier `features/book/api/mappers/openLibrary.ts` n'est pas un détail d'implémentation : il matérialise un **pattern d'architecture** qui doit être respecté pour toute future source externe.

#### Rôle

Il isole le format **externe** (OpenLibrary, demain Google Books / ISBN-DB / votre backend prod) du modèle **interne** (`Book`). Trois exports :

- `OpenLibraryDoc` — décrit le shape **brut** côté OpenLibrary (`author_name`, `first_publish_year`, `cover_i`, snake_case, champs optionnels au pluriel). C'est leur schéma, pas le nôtre.
- `OpenLibraryResponse` — l'enveloppe HTTP retournée par leur endpoint.
- `mapOpenLibraryToBook(doc) → Book | null` — la conversion :
  1. **Filtre** : pas de `cover_i` → `null` (règle métier UI : pas de livre sans couverture).
  2. **Renomme / remap** : `author_name[0] → author`, `first_publish_year → publishedDate`, `cover_i → coverUrl` (construction de l'URL CDN), `key → id`.
  3. **Comble en `null`** tous les champs `Book` qu'OpenLibrary ne fournit pas (`genre`, `language`, `pageCount`, `rating`, `copies`, `summary`, `series*`, `collection*`).

#### Pourquoi à ce niveau (au boundary, pas dans les hooks ni le modèle)

```
Source externe (OpenLibrary)
         ↓  ← format snake_case, champs optionnels, conventions externes
[api/mappers/openLibrary.ts]   ── unique endroit qui « parle leur langage »
         ↓  ← maintenant on parle Book
[api/use<Xxx>.ts]              ── fetch + state, n'ouvre jamais un Doc
         ↓
Book (model/book.types.ts)     ── modèle stable, indépendant des sources
         ↓
ui/, model/business, pages     ── ignorent qu'OpenLibrary existe
```

Cite la doc FSD :
> `api` — backend interactions: request functions, data types, **mappers**, etc.

#### Avant le refactor (pourquoi on a fait ça)

`mapOpenLibraryToBook` était **dupliqué** dans `useOpenLibraryBooks` et `useSearchBooks`, avec une interface `OpenLibraryBook` redéfinie deux fois **et subtilement différente** entre les deux (un `isbn?: string[]` ajouté côté search, jamais consommé). Risque de divergence silencieuse au moindre changement de schéma OpenLibrary.

#### Garanties du pattern

- **Une seule source de vérité** sur le format d'une source externe → un seul fichier à modifier si OpenLibrary change son API.
- **Le code métier (`model/`, `ui/`, pages) ignore l'existence des sources externes** → ils n'importent jamais `OpenLibraryDoc`. Si on remplace OpenLibrary par autre chose, le métier ne bouge pas d'une ligne.
- **`OpenLibrary` apparaît dans le code uniquement à ce boundary** — le seul endroit où ce nom est légitime. Partout ailleurs (hooks, cache, types métier), les noms sont source-agnostic (`useDiscoveryCategoryBooks`, `discoveryCache`, `DiscoveryCategory`).

#### Règle pour une nouvelle source externe

Demain on ajoute Google Books pour récupérer les résumés ?

1. Créer `features/book/api/mappers/googleBooks.ts` avec :
   - Une interface `GoogleBooksVolume` (leur shape)
   - Une interface `GoogleBooksResponse` (leur enveloppe)
   - Une fonction `mapGoogleBooksToBook(volume) → Book | null`
2. Le nouveau hook (`api/useBookSummary.ts` ou similaire) importe **uniquement** ce mapper.
3. Aucun autre fichier ne change. Le modèle `Book` ne bouge pas. Les composants n'apprennent rien sur Google Books.

Quand 3+ sources externes coexistent, extraire ce pattern dans `docs/patterns/external-sources-mappers.md`. YAGNI pour l'instant.

### Séparation données factices / hooks data-fetching (`mocks/` vs `api/`)

Les anciens hooks `useSampleBooks` et `useSampleBooksByShelf` mélangeaient **deux préoccupations** :
1. La **donnée factice** : un `Book[]` (resp. `Record<BookShelf, Book[]>`) statique pour développer sans backend.
2. Le **contrat de récupération** : le hook que les composants appellent pour obtenir la donnée.

Le code original (`useMemo(() => CONST, [])`) ne tenait ni l'un ni l'autre proprement : useMemo sans intérêt (const top-level déjà stable), et shape `Book[]` synchrone qui **ne survit pas** au passage au fetch réel (où il faut au minimum `isLoading`).

Le refactor sépare :
- `mocks/sampleBooks.ts` et `mocks/sampleBooksByShelf.ts` portent uniquement la fixture.
- `api/useUserLibrary.ts` et `api/useUserShelves.ts` exposent le **contrat data-fetching** avec shape async `{books, isLoading, error}` (resp. `{shelves, ...}`). Aujourd'hui le hook renvoie `isLoading: false / error: null` constants ; demain le hook fait un vrai fetch — **sans modification des composants consommateurs**. C'est le pattern boundary-swap appliqué à `useBookDetail`, étendu au domaine user library.

Mettre `SAMPLE_BOOKS_BY_SHELF` dans `model/` aurait confondu business logic et données factices ; le mettre dans `api/` aurait fait croire que la fixture _est_ l'API. La fixture vit dans `mocks/`, le hook qui sera un jour l'API vit dans `api/`.

### Pourquoi `lib/` (slice) plutôt que `shared/lib/` pour le cache

Le cache localStorage n'a qu'un seul consommateur (`useOpenLibraryBooks`). YAGNI : on garde le cache dans `features/book/lib/` ; on promeut vers `shared/lib/` quand un 2ᵉ consommateur apparaît.

### Pourquoi `filterBooksByQuery` n'est plus un hook

Une fonction pure `(books, query) => Book[]` filtrant via `String.includes` est cheap. Le `useMemo` du caller est optionnel et localisable au cas par cas. Convertir en fonction pure simplifie : pas de règle des hooks, pas de fake-hook noise dans la stack, utilisable hors composant React.

### Contrat de hook unifié `{ data, isLoading, error }`

Tous les hooks data-fetching exposent désormais le même shape :

```ts
interface QueryResult<T> {
  data: T
  isLoading: boolean
  error: Error | null
}
```

Hooks alignés : `useBookDetail`, `useUserLibrary`, `useUserShelves`, `useOpenLibraryBooks`, `useDiscoveryBooks`, `useSearchBooks` (ce dernier expose en plus `search` + `reset` pour piloter l'appel impératif).

Pourquoi `data` plutôt que `books` / `shelves` :
- Convention canonique TanStack Query / SWR. Si vous adoptez l'une ou l'autre plus tard, **les composants n'ont rien à toucher** côté destructuration : `useQuery` retourne déjà `{ data, isLoading, error, ... }`.
- Pas de couplage du shape au nom du domaine. Si demain `useUserLibrary` renvoie autre chose qu'un `Book[]` (paginated, grouped), le nom `data` reste valide ; `books` aurait dû être renommé.
- Côté caller, on rename à la destructuration quand on a besoin de clarté locale : `const { data: books } = useUserLibrary()`.

Hooks consommant ce contrat sans encore afficher loading/error (`UserLibraryPage`, `Home`, `DiscoveryPage`, etc.) : c'est volontaire. Le shape est en place ; brancher loading/error visuel = ticket UI séparé, à faire quand le backend réel arrive.

### Hors scope

- Le concept duplication `BookShelf` (Agathe, PR51) vs `BookShelfCategory` (Raphaël, PR52) — traité dans un refactor séparé.
- Promotion du cache vers `shared/lib/cache/` — attend un 2ᵉ consommateur.
- Migration vers TanStack Query / SWR — le shape `{data,isLoading,error}` du `useBookDetail` est déjà compatible.

## Validation post-refactor

```bash
npm run type-check    # tsc --noEmit, doit passer
npm run lint          # prettier + eslint, doit passer
npm run build         # vite build
```

## Pour les nouveaux contributeurs

**Règle de placement d'un nouveau hook :**

1. Le hook **fait du fetch backend** ou expose une API distante ? → `features/<slice>/api/`
2. Le hook contient de la **logique métier** (calculs, règles, transformations spécifiques au domaine) ? → `features/<slice>/model/`
3. Le hook est un **utilitaire pur** (filter, formatter, helper) ? → préférer une fonction pure dans `features/<slice>/lib/`
4. Le hook gère **l'état d'un composant UI** (ouvert/fermé, focus, etc.) ? → colocaliser dans `features/<slice>/ui/` ou `shared/ui/`
5. **Jamais** de dossier `hooks/` ou `types/` dans une slice.

Pour les types :
- Types liés au modèle de données → `model/<entity>.types.ts`
- Types liés à l'UI (props d'un composant) → colocalisés avec le composant

## Sources

- [FSD · Slices and segments](https://feature-sliced.design/docs/reference/slices-segments)
- [FSD · Overview](https://feature-sliced.design/docs/get-started/overview)
- [FSD · Tutorial](https://feature-sliced.design/docs/get-started/tutorial)
