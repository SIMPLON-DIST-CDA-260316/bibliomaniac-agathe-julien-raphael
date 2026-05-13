# Issue #42 — UI Carrousels livres liés (série, auteur, collection, genre)

> Spec rédigée le 2026-05-13. Sous-issue UI de l'US7 (#16). Cible : rendu pédagogique vendredi 2026-05-15.

## 1. Périmètre

PR unique `feat/book-US7-ui-related-carousels` (basée sur `develop`) qui livre :

- Remplace 3 placeholders fin de `BookDetailPage` par 4 carrousels conditionnels ordonnés `série → auteur → collection → genre`.
- Réutilise `BookCarousel` (PR50) et étend `BookCard` + type minimal `Book` (PR50) avec props/champs **optionnels** (rétro-compatible).
- Étend type riche `Book` (`src/features/book/model/book.types.ts`) + mocks (`books.mock.ts`) avec métadonnées série/collection/tome.
- Ajoute composant `BookRelatedSections` et hook `useRelatedBooks`.

Hors scope :

- Fetch API livres liés → `phase:logic` (#16 sous-issue logic).
- États loading/error → `phase:logic`.
- Tests unitaires (dette consciente, voir §9).
- Unification des deux types `Book` (dette pré-existante notée).

## 2. Décisions de design retenues

| Décision | Choix | Rationale court |
|---|---|---|
| Type Book divergent (minimal vs riche) | bridger via adapter dans hook | éviter migration 6 fichiers fraîchement mergés (PR50) |
| Métadonnées série/collection | enrichir mocks rich Book + filtrage réel par hook | démo crédible vs hardcode décoratif |
| BookCard variants | props granulaires (`showAuthor`, `tomeNumber`) | composant agnostique au vocabulaire métier |
| Forme hook | array ordonné déjà filtré `RelatedSection[]` | l'ordre est règle métier, pas décision consumer |
| `tomeNumber` | champ optionnel sur minimal Book | flat, BookCarousel signature inchangée |
| Composant racine sections | `BookRelatedSections` (pluriel, top-level) | une seule responsabilité hors `BookDetailPage` |
| Click vignette | `navigate()` imperative (option A) | dette `<Link>` notée pour post-rendu |
| Dedup inter-sections | aucune (un livre peut apparaître dans 2 sections) | choix utilisateur |
| Filtrage du livre courant | systématique dans toutes les sections | UX évidente |
| Cap par section | 20 livres | protège contre futurs mocks volumineux |
| A11y BookCard | patch `role="button"` + `tabIndex={0}` + `onKeyDown` conditionnels sur présence de `onClick` | patch minimal cohérent avec navigate imperative |

## 3. Data model

### 3.1 Type riche (`src/features/book/model/book.types.ts`)

Ajout de 5 champs nullable rétro-compatibles :

```ts
export interface Book {
  // champs existants…
  seriesId: string | null
  seriesTitle: string | null
  tomeNumber: number | null
  collectionId: string | null
  collectionLabel: string | null
}
```

### 3.2 Type minimal (`src/features/book/types/book.ts`)

Ajout d'un champ optionnel pour l'affichage tome :

```ts
export interface Book {
  id: number | string
  title: string
  author: string
  coverImage: string
  tomeNumber?: number  // nouveau, optionnel
}
```

**Rationale séparation** :

- `seriesId`/`collectionId`/`seriesTitle`/`collectionLabel` = métadonnées de filtrage. Vivent côté rich Book (hook). Pas exposées au composant de présentation.
- `tomeNumber` = donnée d'affichage. Vit aussi côté minimal Book pour que BookCard la lise sans surcharge de signature.

### 3.3 Adapter rich → minimal

Privé dans `useRelatedBooks.ts`. Mappe :

```
RichBook { id, title, author, coverUrl, tomeNumber, … }
  → MinimalBook { id, title, author, coverImage, tomeNumber? }
```

- `author` rich (`string | null`) → fallback `''` côté minimal si null (à confirmer impl).
- `coverUrl` rich (`string | null`) → fallback placeholder côté minimal si null.
- `tomeNumber` mappé uniquement pour kind `series` (omis sinon).

## 4. Mocks enrichis (`books.mock.ts`)

Cible : ~12-15 entrées totales avec métadonnées suffisantes pour démontrer 4 sections non vides sur au moins un livre de référence (vol 1 Urasawa).

### 4.1 Série Urasawa "20th Century Boys"

4 tomes, même `seriesId='20cb'`, `seriesTitle='20th Century Boys'`, `authorId='naoki-urasawa'`, `collectionId='kana-big-kana'`, `collectionLabel='Big Kana'`, `genre='Manga - Shonen'` :

- id `1` (existant — enrichir avec `seriesId`, `tomeNumber=1`, `collectionId`)
- id `6` vol 2 (nouveau, `tomeNumber=2`)
- id `7` vol 3 (nouveau, `tomeNumber=3`)
- id `8` vol 4 (nouveau, `tomeNumber=4`)

### 4.2 Autres œuvres Urasawa

`authorId='naoki-urasawa'`, autres séries :

- id `9` "Monster - Tome 1" (`seriesId='monster'`, `tomeNumber=1`, même collection `kana-big-kana`)
- id `10` "Pluto - Tome 1" (`seriesId='pluto'`, `tomeNumber=1`, collection différente)

### 4.3 Garniture Hugo + collection éditeur

- id `3` "Les Misérables" (existant — enrichir `collectionId='folio-classique'`)
- id `11` "Notre-Dame de Paris" (`authorId='victor-hugo'`, `collectionId='folio-classique'`)
- id `12` "Madame Bovary" (Flaubert, `collectionId='folio-classique'`, `genre='Roman'`)

### 4.4 Garniture genre Roman

- id `13` titre divers, `genre='Roman'`, auteur/série différents
- id `14` idem

### 4.5 Corner cases existants gardés

- id `2` (Petit Livre, `authorId: null`, pas de série/collection/genre) → déclenche zéro section
- id `4` (Livre sans données) → idem
- id `5` (Cover Cassée) → utile pour fallback dans carrousel

### 4.6 Cibles de démo

| Livre courant | Sections attendues non vides |
|---|---|
| id `1` (vol 1) | série (vol 2-4) + auteur (Monster, Pluto, vol 2-4) + collection (Monster, vol 2-4, Hugo, Flaubert) + genre (Monster, vol 2-4, garniture mangas) |
| id `3` (Hugo) | auteur (Notre-Dame) + collection (Flaubert, Notre-Dame) + genre (Flaubert, garniture roman) |
| id `2` (Petit Livre) | aucune |

## 5. Hook `useRelatedBooks`

**Emplacement** : `src/features/book/hooks/useRelatedBooks.ts`

**Signature** :

```ts
type RelatedSection = {
  kind: 'series' | 'author' | 'collection' | 'genre'
  title: string
  books: MinimalBook[]
  cardProps: { showAuthor: boolean }
}

function useRelatedBooks(currentBook: RichBook): RelatedSection[]
```

**Logique** :

1. Lit `MOCK_BOOKS_BY_ID` (rich Book[]).
2. Exclut `currentBook.id`.
3. Pour chaque kind dans ordre `[series, author, collection, genre]` :
   - skip si critère null sur `currentBook` (ex: `currentBook.seriesId === null` → pas de section série)
   - filtre par champ correspondant (`b.seriesId === currentBook.seriesId`, etc.)
   - cap à 20 résultats
   - skip si tableau vide après filtrage
   - mappe rich → minimal (inclut `tomeNumber` pour kind `series` uniquement)
4. Retourne `RelatedSection[]` ordonné + filtré.

**Pas de déduplication inter-sections.**

**Titres et cardProps** :

| kind | title | showAuthor |
|---|---|---|
| `series` | "Dans la même série" | `true` |
| `author` | "Du même auteur" | `false` |
| `collection` | "Dans la même collection" | `true` |
| `genre` | "Dans le même genre" | `true` |

**Mémoïsation** : `useMemo` keyé sur `currentBook.id` pour stabilité de référence.

**Pas de side effects** : hook pur de transformation, pas d'effet ni fetch.

## 6. Composants

### 6.1 Nouveau : `BookRelatedSections`

`src/features/book/ui/BookRelatedSections.tsx`.

```tsx
interface Props { book: RichBook }

export function BookRelatedSections({ book }: Props) {
  const navigate = useNavigate()
  const sections = useRelatedBooks(book)
  if (sections.length === 0) return null

  return (
    <div className="space-y-8 py-6">
      {sections.map((s) => (
        <section key={s.kind} aria-labelledby={`related-${s.kind}`}>
          <h2 id={`related-${s.kind}`} className="mb-3 text-lg font-semibold">
            {s.title}
          </h2>
          <BookCarousel
            books={s.books}
            onBookClick={(b) => navigate(`/book/${b.id}`)}
            cardProps={s.cardProps}
          />
        </section>
      ))}
    </div>
  )
}
```

### 6.2 Modif : `BookCarousel`

Ajout prop optionnelle :

```ts
interface BookCarouselProps {
  books: Book[]
  className?: string
  onBookClick?: (book: Book) => void
  cardProps?: { showAuthor?: boolean }  // nouveau
}
```

Forward `cardProps` à chaque `<BookCard>` rendu. Rétro-compatible (`cardProps` undefined → BookCard utilise ses defaults).

### 6.3 Modif : `BookCard`

Props ajoutées :

```ts
interface BookCardProps {
  book: Book                  // minimal Book, inclut tomeNumber optionnel
  onClick?: () => void
  showAuthor?: boolean        // default true
  ariaLabel?: string          // override sinon construit depuis title/author
}
```

Comportements :

- Si `book.tomeNumber !== undefined` → rend `<p>Tome {n}</p>` sous le titre.
- Si `showAuthor === false` → cache `<p>{author}</p>`.
- A11y conditionnel sur présence de `onClick` :
  - présent → ajoute `role="button"`, `tabIndex={0}`, `onKeyDown` (Enter/Space → `onClick()`), `aria-label`
  - absent → aucun attribut interactif (BookGrid sans onClick reste non-tabable)
- `aria-label` construit dans `BookRelatedSections` au mapping :
  - série : `\`${title}, tome ${n}, par ${author}\``
  - auteur : `${title}`
  - collection / genre : `\`${title} par ${author}\``

### 6.4 Modif : `BookDetailPage`

Remplace lignes 82-86 (placeholders) par :

```tsx
<BookRelatedSections book={book} />
```

**Layout** : container actuel `mx-auto max-w-md px-4` va serrer les carrousels (~28rem). Décision finale au moment de l'implémentation :

- soit isoler `<BookRelatedSections>` hors du wrapper `max-w-md` (le mettre après la fermeture de ce conteneur, dans un nouveau wrapper `max-w-screen-xl mx-auto`)
- soit accepter le confinement à `max-w-md` pour version mobile-first et ajuster en CSS responsive ensuite

À vérifier en dev server avant de figer.

## 7. Accessibilité

Exigences issue : carrousel navigable au clavier + `aria-label` sur chaque vignette.

- **Navigation clavier** :
  - Boutons prev/next (`ChevronLeft`/`Right`) sont déjà `<button>` shadcn (Tab focusable, Enter/Space natifs) ✅
  - Vignettes : patch BookCard décrit §6.3
  - `Tab` traverse : prev → vignettes visibles → next
- **`aria-label` vignette** : construit par `BookRelatedSections`, transmis à `BookCard` via prop.
- **Sémantique sections** : `<section aria-labelledby="related-{kind}">` + `<h2 id="related-{kind}">`.
- **Hiérarchie heading** : `<h2>` pour sections related, en supposant `<h1>` titre livre quelque part dans `BookMeta` (à vérifier).
- **Focus management** : navigation `navigate('/book/:id')` remonte BookDetailPage, pas de focus restoration custom (out of scope post-US2).

## 8. Vérification

Pas de tests unitaires (voir §9 dette consciente).

### 8.1 Vérification manuelle (à passer obligatoirement avant PR)

`npm run dev` puis :

- `/book/1` (vol 1 Urasawa) : 4 sections visibles, vignettes correctes, tomes affichés dans section série.
- `/book/2` (Petit Livre) : aucune section (composant retourne `null`).
- `/book/3` (Hugo) : sections auteur + collection + genre, pas série.
- `/book/4` (sans données) : aucune section.
- Tab keyboard : on doit pouvoir traverser nav → cover → meta → CTA → vignettes section 1 → boutons prev/next section 1 → section 2 → etc.
- Enter sur vignette focused → navigate vers fiche cible.
- Inspecteur a11y Chrome (Lighthouse ou axe DevTools) : labels annoncés correctement, pas d'erreur landmark/heading.

### 8.2 Build et lint

- `npm run build`
- `npm run lint`

## 9. Dette technique notée

À mentionner dans description PR (sections "Out of scope" / "Tech debt") :

1. **Unification des deux types `Book`** (minimal `types/book.ts` vs riche `model/book.types.ts`) — post-rendu.
2. **Conversion `onClick` imperative → `<Link>` natif** pour vignettes — post-rendu, gain a11y (lien sémantique, focus natif, ouvrir nouvel onglet).
3. **Pas de tests unitaires US7** — délai démo prioritaire. Hook `useRelatedBooks` reste pur, à couvrir dans une PR de consolidation post-rendu.
4. **Fetch API related books** — issue #16 sous-tâche `phase:logic`, hors scope UI.

## 10. Dépendances et risques

**Aucune dépendance externe nouvelle**. `embla-carousel-react`, `lucide-react`, `react-router` déjà installés (PR50).

**Risques identifiés** :

- Layout `max-w-md` BookDetailPage va trop serrer carrousels → décision finale à l'implémentation.
- Mocks enrichis touchent fichier partagé (`books.mock.ts`) → si autre PR en cours modifie ce fichier, merge conflict.
- `BookCard` et `BookCarousel` modifiés = touche territoire PR50 (auteure Agathe) → mention dans description PR par courtoisie + ré-itération des rétro-compatibilités (champs/props optionnels).

## 11. Ordre d'implémentation suggéré

Pour le plan d'implémentation détaillé (`writing-plans` skill) :

1. Étendre types Book (riche + minimal).
2. Enrichir `books.mock.ts`.
3. Écrire `useRelatedBooks`.
4. Patcher `BookCard` (props granulaires + a11y conditionnelle).
5. Patcher `BookCarousel` (forward `cardProps`).
6. Créer `BookRelatedSections`.
7. Brancher dans `BookDetailPage`.
8. Vérification manuelle + build/lint.
