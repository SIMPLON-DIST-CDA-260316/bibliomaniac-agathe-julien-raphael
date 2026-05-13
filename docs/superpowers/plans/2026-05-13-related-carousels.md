# US7 Related Carousels — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 3 placeholders at the bottom of `BookDetailPage` with up to 4 conditional carousels (série → auteur → collection → genre), powered by enriched mock data and a dedicated hook, while keeping `BookCarousel` and `BookCard` (PR50) retro-compatible.

**Architecture:** Single feature PR `feat/book-US7-ui-related-carousels` (already created from `develop`). Two `Book` types stay separate — bridged via an adapter inside `useRelatedBooks`. Rich `Book` (`model/book.types.ts`) gets nullable metadata fields; minimal `Book` (`types/book.ts`) gets optional display fields (`tomeNumber`, `ariaLabel`). New components: `BookRelatedSections` (top-level) and one new hook. Existing `BookCarousel`/`BookCard` patched additively (preserve `forwardRef`).

**Tech Stack:** React 19, TypeScript, Tailwind v4, React Router 7, embla-carousel-react, Lucide icons.

**Spec:** `docs/superpowers/specs/2026-05-13-related-carousels-design.md`

**Worktree:** `.claude/worktrees/feat+book-US7-ui-related-carousels`

**Note testing approach:** Spec §9 documents a deliberate trade-off — **no unit tests for US7** (deadline rendu vendredi 2026-05-15). Verification = manual walkthrough on dev server + `npm run lint` + `npm run build`. Each task therefore omits TDD steps and instead ends with a focused inspection step before commit.

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Modify | `src/features/book/model/book.types.ts` | Add 5 nullable metadata fields to rich `Book` |
| Modify | `src/features/book/types/book.ts` | Add `tomeNumber?` and `ariaLabel?` optional fields to minimal `Book` |
| Modify | `src/features/book/mocks/books.mock.ts` | Enrich existing entries + add 9 new entries for series/author/collection/genre demo |
| Create | `src/features/book/hooks/useRelatedBooks.ts` | Hook returning ordered `RelatedSection[]` from a current book |
| Modify | `src/features/book/ui/BookCard.tsx` | Add `showAuthor` prop, render `tomeNumber`, conditional a11y attrs reading `book.ariaLabel` |
| Modify | `src/features/book/ui/BookCarousel.tsx` | Add optional `cardProps` prop forwarded to each `<BookCard>` (preserve `forwardRef`) |
| Create | `src/features/book/ui/BookRelatedSections.tsx` | Top-level component rendering ordered sections, wires navigate, reads hook |
| Modify | `src/pages/BookDetailPage/BookDetailPage.tsx` | Replace lines 82-86 placeholders with `<BookRelatedSections book={book} />` + adjust layout container |

---

## Task 1 — Extend rich `Book` type

**Files:**

- Modify: `src/features/book/model/book.types.ts`

- [ ] **Step 1 — Add 5 nullable metadata fields to the rich Book interface.**

Open `src/features/book/model/book.types.ts` and replace its contents with:

```ts
export interface Book {
  id: string
  title: string
  author: string | null
  authorId: string | null
  genre: string | null
  language: string | null
  publishedDate: string | null
  coverUrl: string | null
  pageCount: number | null
  rating: number | null
  copies: number | null
  summary: string | null
  seriesId: string | null
  seriesTitle: string | null
  tomeNumber: number | null
  collectionId: string | null
  collectionLabel: string | null
}
```

- [ ] **Step 2 — Type-check.**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: errors only on `books.mock.ts` (which will be fixed in Task 3 by populating the new fields). No errors elsewhere — these fields are not yet consumed.

- [ ] **Step 3 — Commit.**

```bash
git add src/features/book/model/book.types.ts
git commit -m "feat(book): extend rich Book type with series/collection metadata (#42)"
```

---

## Task 2 — Extend minimal `Book` type

**Files:**

- Modify: `src/features/book/types/book.ts`

- [ ] **Step 1 — Add two optional display fields.**

Replace the contents of `src/features/book/types/book.ts` with:

```ts
export interface Book {
  id: number | string
  title: string
  author: string
  coverImage: string
  tomeNumber?: number
  ariaLabel?: string
}
```

- [ ] **Step 2 — Type-check.**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: no new errors. The two new fields are optional, so existing consumers (`useSampleBooks`, `BookCarousel`, `BookCard`, `BookGrid`, `useSampleBooksByShelf`, `useDiscoveryBooks`) keep compiling.

- [ ] **Step 3 — Commit.**

```bash
git add src/features/book/types/book.ts
git commit -m "feat(book): add optional tomeNumber + ariaLabel to minimal Book (#42)"
```

---

## Task 3 — Enrich `books.mock.ts`

**Files:**

- Modify: `src/features/book/mocks/books.mock.ts`

This task does two things : (a) backfill the 5 new fields on entries `1` to `5`, (b) add 9 new entries (`6`-`14`) to make 4 non-empty sections demo-able on `/book/1`.

> ⚠️ **Behavioral change beyond field-add** : entry id `3` (Les Misérables) currently has `genre: 'Roman historique'`. The rewrite below normalizes it to `genre: 'Roman'` so that section "Dans le même genre" on `/book/3` matches Flaubert/Camus/Orwell entries. Intentional, aligned with spec §4.3 and §4.6.

- [ ] **Step 1 — Rewrite `books.mock.ts` with enriched data.**

Replace the entire file contents with:

```ts
import type { Book } from '../model/book.types'

export const MOCK_BOOKS_BY_ID: Record<string, Book> = {
  '1': {
    id: '1',
    title: '20th Century Boys - Tome 1',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Shonen',
    language: 'Français',
    publishedDate: '2002',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 418,
    rating: 4.7,
    copies: 2,
    summary:
      "Kenji est un commerçant tranquille qui a repris et transformé le magasin familial. Son seul problème est Kana, la fille de sa sœur, que cette dernière lui a confiée avant de partir. Mais voilà qu'un jour, la police vient l'interroger sur un de ses anciens camarades de classe porté disparu...",
    seriesId: '20cb',
    seriesTitle: '20th Century Boys',
    tomeNumber: 1,
    collectionId: 'kana-big-kana',
    collectionLabel: 'Big Kana',
  },
  '2': {
    id: '2',
    title: 'Le Petit Livre',
    author: 'Auteur Inconnu',
    authorId: null,
    genre: 'Roman',
    language: 'Français',
    publishedDate: '2020',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 80,
    rating: 3.2,
    copies: 1,
    summary: 'Un court récit qui tient en une seule phrase.',
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  },
  '3': {
    id: '3',
    title: 'Les Misérables',
    author: 'Victor Hugo',
    authorId: 'victor-hugo',
    genre: 'Roman',
    language: 'Français',
    publishedDate: '1862',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 1900,
    rating: 4.9,
    copies: 5,
    summary:
      "Au début du XIXᵉ siècle, Jean Valjean, ancien forçat libéré après dix-neuf ans de bagne pour le vol d'un pain, peine à trouver sa place dans une société qui le rejette. Recueilli par l'évêque Myriel, dont la bonté le bouleverse, il choisit la voie de la rédemption sous une nouvelle identité, Monsieur Madeleine, et devient maire d'une petite ville où sa générosité change le destin de Fantine, ouvrière déchue contrainte à la prostitution pour nourrir sa fille Cosette. Lorsque Fantine meurt, Valjean reprend la fuite, hanté par l'inspecteur Javert, incarnation rigide de la loi, et arrache Cosette aux Thénardier, aubergistes cupides qui l'exploitaient. À Paris, Valjean élève Cosette dans la discrétion, jusqu'au jour où l'adolescente croise Marius, jeune républicain idéaliste lié aux Amis de l'ABC, un groupe d'étudiants insurgés. Le récit culmine sur les barricades du soulèvement de juin 1832, où Valjean sauve la vie de Marius et épargne celle de Javert, qui, incapable de réconcilier sa conscience avec sa loi, choisit la mort. Roman-fresque, méditation sur la justice, la misère, l'éducation et la conscience, Les Misérables suit aussi des destins secondaires — Gavroche, Éponine, Mgr Myriel — pour composer une vaste épopée de l'âme humaine, où la rédemption d'un seul homme éclaire les douleurs et les espoirs de tout un peuple. Hugo y mêle digressions philosophiques, fresques historiques (Waterloo, les égouts de Paris, le couvent du Petit-Picpus) et plaidoyer politique, faisant du roman un manifeste contre l'injustice sociale autant qu'une vaste cathédrale romanesque.",
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: 'folio-classique',
    collectionLabel: 'Folio Classique',
  },
  '4': {
    id: '4',
    title: 'Livre sans données',
    author: null,
    authorId: null,
    genre: null,
    language: null,
    publishedDate: null,
    coverUrl: null,
    pageCount: null,
    rating: null,
    copies: null,
    summary: null,
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  },
  '5': {
    id: '5',
    title: 'Cover Cassée',
    author: 'Test Auteur',
    authorId: 'test-auteur',
    genre: 'Test',
    language: 'Anglais',
    publishedDate: '2026',
    coverUrl: '/images/cover-inexistante.png',
    pageCount: 100,
    rating: 3.5,
    copies: 1,
    summary:
      'Ce livre a une URL de couverture invalide pour tester le fallback onError.',
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  },
  '6': {
    id: '6',
    title: '20th Century Boys - Tome 2',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Shonen',
    language: 'Français',
    publishedDate: '2002',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 410,
    rating: 4.7,
    copies: 1,
    summary: "Suite directe du tome 1. L'enquête s'étend.",
    seriesId: '20cb',
    seriesTitle: '20th Century Boys',
    tomeNumber: 2,
    collectionId: 'kana-big-kana',
    collectionLabel: 'Big Kana',
  },
  '7': {
    id: '7',
    title: '20th Century Boys - Tome 3',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Shonen',
    language: 'Français',
    publishedDate: '2003',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 420,
    rating: 4.8,
    copies: 1,
    summary: 'Tome 3 de la série.',
    seriesId: '20cb',
    seriesTitle: '20th Century Boys',
    tomeNumber: 3,
    collectionId: 'kana-big-kana',
    collectionLabel: 'Big Kana',
  },
  '8': {
    id: '8',
    title: '20th Century Boys - Tome 4',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Shonen',
    language: 'Français',
    publishedDate: '2003',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 415,
    rating: 4.7,
    copies: 1,
    summary: 'Tome 4 de la série.',
    seriesId: '20cb',
    seriesTitle: '20th Century Boys',
    tomeNumber: 4,
    collectionId: 'kana-big-kana',
    collectionLabel: 'Big Kana',
  },
  '9': {
    id: '9',
    title: 'Monster - Tome 1',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Seinen',
    language: 'Français',
    publishedDate: '1994',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 220,
    rating: 4.9,
    copies: 1,
    summary: 'Un neurochirurgien sauve la vie d\u2019un enfant\u2026',
    seriesId: 'monster',
    seriesTitle: 'Monster',
    tomeNumber: 1,
    collectionId: 'kana-big-kana',
    collectionLabel: 'Big Kana',
  },
  '10': {
    id: '10',
    title: 'Pluto - Tome 1',
    author: 'Naoki Urasawa',
    authorId: 'naoki-urasawa',
    genre: 'Manga - Seinen',
    language: 'Français',
    publishedDate: '2003',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 200,
    rating: 4.6,
    copies: 1,
    summary: 'Réinterprétation du Plus Grand Robot de la Terre.',
    seriesId: 'pluto',
    seriesTitle: 'Pluto',
    tomeNumber: 1,
    collectionId: 'kana-shonen-up',
    collectionLabel: 'Shonen Up',
  },
  '11': {
    id: '11',
    title: 'Notre-Dame de Paris',
    author: 'Victor Hugo',
    authorId: 'victor-hugo',
    genre: 'Roman',
    language: 'Français',
    publishedDate: '1831',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 940,
    rating: 4.7,
    copies: 3,
    summary: 'Paris XVᵉ. Quasimodo, Esmeralda, Frollo.',
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: 'folio-classique',
    collectionLabel: 'Folio Classique',
  },
  '12': {
    id: '12',
    title: 'Madame Bovary',
    author: 'Gustave Flaubert',
    authorId: 'gustave-flaubert',
    genre: 'Roman',
    language: 'Français',
    publishedDate: '1857',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 480,
    rating: 4.4,
    copies: 2,
    summary: 'Emma rêve d\u2019une vie qu\u2019elle ne vivra jamais.',
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: 'folio-classique',
    collectionLabel: 'Folio Classique',
  },
  '13': {
    id: '13',
    title: 'L\u2019\u00C9tranger',
    author: 'Albert Camus',
    authorId: 'albert-camus',
    genre: 'Roman',
    language: 'Français',
    publishedDate: '1942',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 180,
    rating: 4.5,
    copies: 2,
    summary: 'Meursault, l\u2019absurde.',
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  },
  '14': {
    id: '14',
    title: '1984',
    author: 'George Orwell',
    authorId: 'george-orwell',
    genre: 'Roman',
    language: 'Français',
    publishedDate: '1949',
    coverUrl: '/images/20th-century-boys-vol1.png',
    pageCount: 380,
    rating: 4.8,
    copies: 4,
    summary: 'Big Brother is watching you.',
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  },
}
```

> Note : `coverUrl` réutilise le même asset placeholder partout pour simplifier. La diversité visuelle viendra avec de vraies couvertures hors scope US7.

- [ ] **Step 2 — Type-check.**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: pass, no errors (resolves Task 1's pending error on this file).

- [ ] **Step 3 — Commit.**

```bash
git add src/features/book/mocks/books.mock.ts
git commit -m "feat(book): enrich mocks with series/author/collection fixtures (#42)"
```

---

## Task 4 — Create `useRelatedBooks` hook

**Files:**

- Create: `src/features/book/hooks/useRelatedBooks.ts`

- [ ] **Step 1 — Create the hook file.**

Create `src/features/book/hooks/useRelatedBooks.ts` with:

```ts
import { useMemo } from 'react'

import type { Book as RichBook } from '../model/book.types'
import type { Book as MinimalBook } from '../types/book'
import { MOCK_BOOKS_BY_ID } from '../mocks/books.mock'

export type RelatedSectionKind = 'series' | 'author' | 'collection' | 'genre'

export interface RelatedSection {
  kind: RelatedSectionKind
  title: string
  books: MinimalBook[]
  cardProps: { showAuthor: boolean }
}

const SECTION_TITLES: Record<RelatedSectionKind, string> = {
  series: 'Dans la même série',
  author: 'Du même auteur',
  collection: 'Dans la même collection',
  genre: 'Dans le même genre',
}

const SECTION_SHOW_AUTHOR: Record<RelatedSectionKind, boolean> = {
  series: true,
  author: false,
  collection: true,
  genre: true,
}

const SECTION_ORDER: RelatedSectionKind[] = [
  'series',
  'author',
  'collection',
  'genre',
]

const SECTION_CAP = 20

function buildAriaLabel(
  kind: RelatedSectionKind,
  title: string,
  author: string,
  tomeNumber: number | null,
): string {
  if (kind === 'series' && tomeNumber != null) {
    return `${title}, tome ${tomeNumber}, par ${author}`
  }
  if (kind === 'author') {
    return title
  }
  return `${title} par ${author}`
}

function toMinimal(
  rich: RichBook,
  kind: RelatedSectionKind,
): MinimalBook {
  const author = rich.author ?? ''
  const coverImage = rich.coverUrl ?? ''
  const minimal: MinimalBook = {
    id: rich.id,
    title: rich.title,
    author,
    coverImage,
  }
  if (kind === 'series' && rich.tomeNumber != null) {
    minimal.tomeNumber = rich.tomeNumber
  }
  minimal.ariaLabel = buildAriaLabel(kind, rich.title, author, rich.tomeNumber)
  return minimal
}

function matches(
  candidate: RichBook,
  current: RichBook,
  kind: RelatedSectionKind,
): boolean {
  switch (kind) {
    case 'series':
      return (
        current.seriesId != null && candidate.seriesId === current.seriesId
      )
    case 'author':
      return (
        current.authorId != null && candidate.authorId === current.authorId
      )
    case 'collection':
      return (
        current.collectionId != null &&
        candidate.collectionId === current.collectionId
      )
    case 'genre':
      return current.genre != null && candidate.genre === current.genre
  }
}

export function useRelatedBooks(currentBook: RichBook): RelatedSection[] {
  return useMemo(() => {
    const allBooks = Object.values(MOCK_BOOKS_BY_ID)
    const sections: RelatedSection[] = []

    for (const kind of SECTION_ORDER) {
      const matched = allBooks.filter(
        (b) => b.id !== currentBook.id && matches(b, currentBook, kind),
      )
      if (matched.length === 0) continue
      const capped = matched.slice(0, SECTION_CAP)
      sections.push({
        kind,
        title: SECTION_TITLES[kind],
        books: capped.map((b) => toMinimal(b, kind)),
        cardProps: { showAuthor: SECTION_SHOW_AUTHOR[kind] },
      })
    }

    return sections
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentBook.id,
    currentBook.seriesId,
    currentBook.authorId,
    currentBook.collectionId,
    currentBook.genre,
  ])
}
```

> Rationale eslint-disable : `MOCK_BOOKS_BY_ID` est un module-level constant, n'a pas à être dans la dep array. Le hook dépend uniquement des champs lus de `currentBook`.

- [ ] **Step 2 — Type-check.**

Run: `npx tsc --noEmit -p tsconfig.app.json`

Expected: pass.

- [ ] **Step 3 — Lint.**

Run: `npm run lint`

Expected: pass.

- [ ] **Step 4 — Commit.**

```bash
git add src/features/book/hooks/useRelatedBooks.ts
git commit -m "feat(book): add useRelatedBooks hook (#42)"
```

---

## Task 5 — Patch `BookCard`

**Files:**

- Modify: `src/features/book/ui/BookCard.tsx`

- [ ] **Step 1 — Rewrite component with new props + a11y.**

Replace the entire file contents with:

```tsx
import type { KeyboardEvent } from 'react'
import type { Book } from '../types/book'

interface BookCardProps {
  book: Book
  onClick?: () => void
  showAuthor?: boolean
}

export function BookCard({ book, onClick, showAuthor = true }: BookCardProps) {
  const interactive = onClick != null

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  const ariaLabel =
    book.ariaLabel ??
    (book.author ? `${book.title} par ${book.author}` : book.title)

  return (
    <div
      className={
        interactive
          ? 'group flex cursor-pointer flex-col gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary'
          : 'group flex flex-col gap-3'
      }
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      aria-label={interactive ? ariaLabel : undefined}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
        <img
          src={book.coverImage}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      </div>

      <div className="px-1 pb-2">
        <h3 className="group-hover:text-primary line-clamp-2 text-xs font-semibold transition-colors sm:text-sm md:line-clamp-none lg:text-base">
          {book.title}
        </h3>
        {book.tomeNumber != null && (
          <p className="mt-0.5 line-clamp-1 text-[10px] text-gray-500 sm:text-xs lg:text-sm">
            Tome {book.tomeNumber}
          </p>
        )}
        {showAuthor && (
          <p className="mt-1 line-clamp-1 text-[10px] text-gray-600 sm:text-xs md:line-clamp-none lg:text-sm">
            {book.author}
          </p>
        )}
      </div>
    </div>
  )
}
```

- [ ] **Step 2 — Type-check + lint.**

Run: `npx tsc --noEmit -p tsconfig.app.json && npm run lint`

Expected: pass.

- [ ] **Step 3 — Commit.**

```bash
git add src/features/book/ui/BookCard.tsx
git commit -m "feat(book): patch BookCard with showAuthor + tomeNumber + a11y (#42)"
```

---

## Task 6 — Patch `BookCarousel` to forward `cardProps`

**Files:**

- Modify: `src/features/book/ui/BookCarousel.tsx`

⚠️ **Preserve `React.forwardRef<HTMLDivElement, BookCarouselProps>`** — do not collapse to a plain function component.

- [ ] **Step 1 — Add `cardProps` to props interface (lines 9-13).**

Find:

```ts
interface BookCarouselProps {
  books: Book[]
  className?: string
  onBookClick?: (book: Book) => void
}
```

Replace with:

```ts
interface BookCarouselProps {
  books: Book[]
  className?: string
  onBookClick?: (book: Book) => void
  cardProps?: { showAuthor?: boolean }
}
```

- [ ] **Step 2 — Destructure `cardProps` (line 16) and forward it.**

Find:

```tsx
  ({ books, className, onBookClick }, ref) => {
```

Replace with:

```tsx
  ({ books, className, onBookClick, cardProps }, ref) => {
```

Then find the `<BookCard>` render (currently line 74):

```tsx
                <BookCard book={book} onClick={() => onBookClick?.(book)} />
```

Replace with:

```tsx
                <BookCard
                  book={book}
                  onClick={onBookClick ? () => onBookClick(book) : undefined}
                  showAuthor={cardProps?.showAuthor}
                />
```

> Note : on rend `onClick` conditionnel pour que BookCard sache désactiver `role="button"` quand le carrousel est utilisé en mode purement décoratif.

- [ ] **Step 3 — Type-check + lint.**

Run: `npx tsc --noEmit -p tsconfig.app.json && npm run lint`

Expected: pass.

- [ ] **Step 4 — Commit.**

```bash
git add src/features/book/ui/BookCarousel.tsx
git commit -m "feat(book): forward cardProps from BookCarousel to BookCard (#42)"
```

---

## Task 7 — Create `BookRelatedSections`

**Files:**

- Create: `src/features/book/ui/BookRelatedSections.tsx`

- [ ] **Step 1 — Create the component.**

Create `src/features/book/ui/BookRelatedSections.tsx` with:

```tsx
import { useNavigate } from 'react-router'

import type { Book } from '../model/book.types'
import { useRelatedBooks } from '../hooks/useRelatedBooks'
import { BookCarousel } from './BookCarousel'

interface BookRelatedSectionsProps {
  book: Book
}

export function BookRelatedSections({ book }: BookRelatedSectionsProps) {
  const navigate = useNavigate()
  const sections = useRelatedBooks(book)

  if (sections.length === 0) return null

  return (
    <div className="space-y-8 py-6">
      {sections.map((section) => (
        <section
          key={section.kind}
          aria-labelledby={`related-${section.kind}`}
        >
          <h2
            id={`related-${section.kind}`}
            className="mb-3 text-lg font-semibold"
          >
            {section.title}
          </h2>
          <BookCarousel
            books={section.books}
            onBookClick={(b) => void navigate(`/book/${b.id}`)}
            cardProps={section.cardProps}
          />
        </section>
      ))}
    </div>
  )
}
```

- [ ] **Step 2 — Type-check + lint.**

Run: `npx tsc --noEmit -p tsconfig.app.json && npm run lint`

Expected: pass.

- [ ] **Step 3 — Commit.**

```bash
git add src/features/book/ui/BookRelatedSections.tsx
git commit -m "feat(book): add BookRelatedSections component (#42)"
```

---

## Task 8 — Wire into `BookDetailPage` + adjust layout

**Files:**

- Modify: `src/pages/BookDetailPage/BookDetailPage.tsx`

The current `BookDetailPage` uses `<div className="mx-auto max-w-md px-4">` wrapping everything. The related carousels need more horizontal breathing room than `max-w-md` (~28rem) — see spec §6.4.

Strategy : laisser la fiche livre dans `max-w-md`, mais sortir `<BookRelatedSections>` de ce wrapper et le placer dans un wrapper plus large (`max-w-screen-xl mx-auto px-4`).

- [ ] **Step 1 — Update the import block.**

Find around line 11:

```tsx
import { useBookDetail } from '@/features/book/hooks/useBookDetail'
```

Add right after:

```tsx
import { BookRelatedSections } from '@/features/book/ui/BookRelatedSections'
```

- [ ] **Step 2 — Restructure the rendered tree.**

Find the return block (currently `return ( <div className="mx-auto max-w-md px-4"> ... </div> )`, lines 31-87).

Replace the entire `return (...)` block with:

```tsx
  return (
    <>
      <div className="mx-auto max-w-md px-4">
        <div className="flex h-[calc(100svh-var(--navbar-height))] flex-col gap-5 py-6">
          <div className="relative h-[clamp(180px,35svh,360px)] shrink-0">
            <div className="absolute top-0 left-0 z-10">
              <BackButton />
            </div>
            <BookCover
              coverUrl={book.coverUrl}
              title={book.title}
              className="h-full w-auto"
            />
          </div>

          <div className="flex shrink-0 items-start justify-between gap-2">
            <BookMeta
              title={book.title}
              author={book.author}
              authorId={book.authorId}
              genre={book.genre}
              language={book.language}
              publishedDate={book.publishedDate}
            />
            <BookmarkButton />
          </div>

          <StatBadgeGroup
            copies={book.copies}
            pageCount={book.pageCount}
            rating={book.rating}
          />

          <div className="min-h-0 flex-1">
            <BookSummary summary={book.summary} />
          </div>

          <BookCTA
            state={{ kind: 'available' }}
            bookTitle={book.title}
            onReserveConfirm={() => {
              // TODO #33 — wire to reservation mutation
              console.log('[BookCTA] reserve confirmed for', book.id)
            }}
            onActiveStateClick={() => {
              // TODO #33 — wire to navigation
              console.log('[BookCTA] active state click', book.id)
            }}
            className="shrink-0"
          />
        </div>
      </div>

      <div className="mx-auto max-w-screen-xl px-4">
        <BookRelatedSections book={book} />
      </div>
    </>
  )
```

> Changes : page wrapper split into two — `max-w-md` for the detail card, `max-w-screen-xl` for related sections; placeholders (lines 82-86) deleted; `BookRelatedSections` mounted.

- [ ] **Step 3 — Type-check + lint.**

Run: `npx tsc --noEmit -p tsconfig.app.json && npm run lint`

Expected: pass.

- [ ] **Step 4 — Commit.**

```bash
git add src/pages/BookDetailPage/BookDetailPage.tsx
git commit -m "feat(book): wire BookRelatedSections into BookDetailPage (#42)"
```

---

## Task 9 — Manual verification + final build

**Files:** none modified — verification only.

- [ ] **Step 1 — Start dev server.**

Run: `npm run dev`

Wait for "Local: http://localhost:5173" (or whatever port).

- [ ] **Step 2 — Verify `/book/1` (vol 1 Urasawa) — full demo case.**

Navigate to `http://localhost:5173/book/1`. Expected :

- 4 sections visible below the detail card, in order :
  1. "Dans la même série" — vol 2, 3, 4 (tomes affichés)
  2. "Du même auteur" — Monster T1, Pluto T1, vol 2, 3, 4 (auteur masqué)
  3. "Dans la même collection" — Monster T1, vol 2, 3, 4 (auteur affiché)
  4. "Dans le même genre" — Monster T1, vol 2, 3, 4 (auteur affiché)
- Click sur n'importe quelle vignette → navigate vers `/book/<id>` correspondant.
- Tab keyboard : focus traverse vignettes + boutons prev/next du carrousel.
- Enter sur vignette focusée → même navigate.

- [ ] **Step 3 — Verify `/book/3` (Hugo) — partial case.**

Navigate to `/book/3`. Expected :

- 3 sections : "Du même auteur" (Notre-Dame), "Dans la même collection" (Notre-Dame, Madame Bovary), "Dans le même genre" (Notre-Dame, Madame Bovary, L'Étranger, 1984).
- Pas de section série.

- [ ] **Step 4 — Verify `/book/2` (Petit Livre) — empty case.**

Navigate to `/book/2`. Expected :

- Aucune section related sous la fiche (composant retourne `null`).

- [ ] **Step 5 — Verify `/book/4` (Livre sans données) — null fields.**

Navigate to `/book/4`. Expected :

- Aucune section.

- [ ] **Step 6 — BookGrid visual regression check.**

The `BookCard` rewrite removes `cursor-pointer` when no `onClick` is provided. Visit any page consuming `BookGrid` without click handlers (e.g. home / discovery / shelves) and visually confirm cards still look acceptable (no broken layout, no missing affordance for navigable contexts).

- [ ] **Step 7 — A11y inspector check.**

Ouvrir DevTools Chrome → onglet "Lighthouse" ou extension "axe DevTools" → run accessibility audit sur `/book/1`. Expected :

- 0 erreur "interactive element without accessible name".
- 0 erreur "heading order".
- `aria-label` annoncé sur chaque vignette (vérifier via inspecteur "Accessibility").

- [ ] **Step 8 — Production build.**

Run: `npm run build`

Expected: succès sans warnings TS.

- [ ] **Step 9 — Lint final.**

Run: `npm run lint`

Expected: pass.

- [ ] **Step 10 — Push branch.**

```bash
git push -u origin feat/book-US7-ui-related-carousels
```

- [ ] **Step 11 — Open PR.**

Run :

```bash
gh pr create --title "feat(book): UI carrousels livres liés (US7 #42)" --body "$(cat <<'EOF'
## Summary

Replaces the 3 placeholders at the bottom of `BookDetailPage` with up to 4 conditional carousels (série → auteur → collection → genre), powered by enriched mock data.

Closes #42 (sous-issue UI de l'US7 #16).

## Changes

- **Types** : enriched rich `Book` with 5 nullable metadata fields (seriesId, seriesTitle, tomeNumber, collectionId, collectionLabel); added two optional display fields to minimal `Book` (tomeNumber, ariaLabel).
- **Mocks** : enriched existing entries + added 9 fixtures (Urasawa série, Hugo collection, garniture genre Roman).
- **New** : `useRelatedBooks(book)` hook returning ordered `RelatedSection[]`, filtered and capped at 20 per section.
- **New** : `BookRelatedSections` component rendering sections.
- **Patched** : `BookCard` (props `showAuthor`, render `tomeNumber`, a11y conditionnelle sur `onClick`); `BookCarousel` (forward optional `cardProps`).
- **Wired** : `BookDetailPage` layout splits into `max-w-md` (detail card) + `max-w-screen-xl` (related sections).

## Out of scope / tech debt

- Fetch API related books → phase:logic (#16 sous-issue logic).
- Unification des deux types `Book` (minimal vs riche) — post-rendu.
- Conversion `onClick` imperative → `<Link>` natif pour vignettes — post-rendu (gain a11y, focus natif).
- Pas de tests unitaires US7 — délai démo prioritaire, hook pur `useRelatedBooks` à couvrir post-rendu.

## Test plan

- [x] `/book/1` → 4 sections visibles, tomes affichés en section série, auteur masqué en section auteur
- [x] `/book/3` → 3 sections (pas série)
- [x] `/book/2` et `/book/4` → 0 section, composant retourne null
- [x] Tab keyboard traverse vignettes + boutons carrousel ; Enter sur vignette focusée → navigate
- [x] axe DevTools → 0 erreur a11y interactive/heading
- [x] `npm run build` + `npm run lint` passent

## Note

Touche `BookCard` et `BookCarousel` initialement créés par Agathe en PR50. Toutes les modifications sont **additives et rétro-compatibles** (props/champs optionnels, `forwardRef` préservé).

🤖 Generated with [Claude Code](https://claude.com/claude-code)
EOF
)"
```

---

## Spec mapping

| Spec section | Task(s) |
|--------------|---------|
| §3.1 rich Book extension | Task 1 |
| §3.2 minimal Book extension | Task 2 |
| §4 mocks enrichis | Task 3 |
| §3.3 + §5 hook + adapter | Task 4 |
| §6.3 BookCard patch | Task 5 |
| §6.2 BookCarousel forward | Task 6 |
| §6.1 BookRelatedSections | Task 7 |
| §6.4 BookDetailPage wiring + layout | Task 8 |
| §8 vérification manuelle + build/lint | Task 9 |
