# Book Detail UI — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement the book detail page layout with static/mocked data, following the mockup and FSD architecture.

**Architecture:** FSD layers — `entities/book/` for Book types and UI components, `shared/ui/` for reusable BackButton, `pages/BookDetailPage/` for page composition. All data is mocked in-page, no API calls.

**Tech Stack:** React 19, React Router 7, Tailwind CSS v4, shadcn/ui (Badge, Button), Lucide icons, Literata font, CVA

**Spec:** `docs/superpowers/specs/2026-04-17-book-detail-ui-design.md`

**Worktree:** `.claude/worktrees/feature/book-details/`

---

## File Structure

| Action | Path | Responsibility |
|--------|------|----------------|
| Create | `src/entities/book/model/types.ts` | Book interface |
| Create | `src/entities/book/ui/BookCover.tsx` | Cover image with placeholder fallback |
| Create | `src/entities/book/ui/BookMeta.tsx` | Title, author, genre display |
| Create | `src/entities/book/ui/StatBadgeGroup.tsx` | Row of 3 stat badges |
| Create | `src/entities/book/ui/BookSummary.tsx` | Truncated summary with "lire tout" toggle |
| Create | `src/entities/book/index.ts` | Barrel export for entities/book |
| Create | `src/shared/ui/back-button.tsx` | Reusable back navigation button |
| Create | `src/pages/BookDetailPage/BookDetailPage.tsx` | Page composition with mock data |
| Create | `src/pages/BookDetailPage/index.ts` | Barrel export |
| Modify | `src/index.css` | Add Literata font import + `--font-serif` token |
| Modify | `src/app/providers/router.tsx` | Wire BookDetailPage to `/book/:id` route |
| Delete | `src/pages/BookPage.tsx` | Replaced by BookDetailPage/ |

---

### Task 1: Design tokens — Literata font + serif token

**Files:**
- Modify: `src/index.css:1-10`

- [ ] **Step 1: Install Literata font**

Run: `npm install @fontsource-variable/literata`

- [ ] **Step 2: Add font import and serif token to index.css**

Add the import after the Geist import:
```css
@import "@fontsource-variable/literata";
```

Add the serif font token in `@theme inline`:
```css
--font-serif: 'Literata Variable', serif;
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Commit**

```bash
git add src/index.css package.json package-lock.json
git commit -m "feat(design-system): add Literata serif font and --font-serif token"
```

---

### Task 2: Book type interface

**Files:**
- Create: `src/entities/book/model/types.ts`

- [ ] **Step 1: Create the Book interface**

```ts
export interface Book {
  id: string
  title: string
  author: string
  genre: string | null
  coverUrl: string | null
  pageCount: number | null
  rating: number | null
  copies: number | null
  summary: string | null
}
```

- [ ] **Step 2: Create barrel export**

Create `src/entities/book/index.ts`:
```ts
export type { Book } from './model/types'
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds.

- [ ] **Step 4: Commit**

```bash
git add src/entities/book/
git commit -m "feat(entities): add Book type interface"
```

---

### Task 3: Install shadcn Badge component

**Files:**
- Create: `src/shared/ui/badge.tsx` (via shadcn CLI)

- [ ] **Step 1: Add Badge component via shadcn**

Run: `npx shadcn@latest add badge`

If the CLI asks questions, accept defaults. The component should land in `src/shared/ui/badge.tsx`.

- [ ] **Step 2: Verify the component was created**

Check that `src/shared/ui/badge.tsx` exists and exports `Badge` and `badgeVariants`.

- [ ] **Step 3: Verify build passes**

Run: `npm run build`

- [ ] **Step 4: Commit**

```bash
git add src/shared/ui/badge.tsx
git commit -m "feat(shared): add shadcn Badge component"
```

---

### Task 4: BackButton component

**Files:**
- Create: `src/shared/ui/back-button.tsx`

- [ ] **Step 1: Create BackButton component**

```tsx
import { ChevronLeft } from 'lucide-react'

import { Button } from '@/shared/ui/button'

export function BackButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-primary text-primary-foreground rounded-full hover:bg-primary/80"
      onClick={() => history.back()}
      aria-label="Retour"
    >
      <ChevronLeft className="size-5" />
    </Button>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/shared/ui/back-button.tsx
git commit -m "feat(shared): add BackButton component"
```

---

### Task 5: BookCover component

**Files:**
- Create: `src/entities/book/ui/BookCover.tsx`

- [ ] **Step 1: Create BookCover component**

```tsx
import { cn } from '@/shared/lib/utils'

interface BookCoverProps {
  coverUrl: string | null
  title: string
  className?: string
}

export function BookCover({ coverUrl, title, className }: BookCoverProps) {
  return (
    <div className={cn('aspect-[2/3] w-full max-w-xs mx-auto overflow-hidden rounded-xl', className)}>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`Couverture de ${title}`}
          className="h-full w-full object-cover"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-muted text-muted-foreground">
          Pas de couverture
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/entities/book/ui/BookCover.tsx
git commit -m "feat(entities): add BookCover component"
```

---

### Task 6: BookMeta component

**Files:**
- Create: `src/entities/book/ui/BookMeta.tsx`

- [ ] **Step 1: Create BookMeta component**

```tsx
interface BookMetaProps {
  title: string
  author: string
  genre: string | null
}

export function BookMeta({ title, author, genre }: BookMetaProps) {
  return (
    <div className="space-y-0.5">
      <h1 className="font-serif text-xl font-bold">{title}</h1>
      <p className="text-sm text-foreground">{author}</p>
      {genre && (
        <p className="text-sm text-muted-foreground">{genre}</p>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/entities/book/ui/BookMeta.tsx
git commit -m "feat(entities): add BookMeta component"
```

---

### Task 7: StatBadgeGroup component

**Files:**
- Create: `src/entities/book/ui/StatBadgeGroup.tsx`

- [ ] **Step 1: Create StatBadgeGroup component**

Uses shadcn `Badge` with `variant="outline"`. Each badge shows a label on top and a value below, matching the mockup layout.

```tsx
import { Badge } from '@/shared/ui/badge'

interface StatBadgeGroupProps {
  copies: number | null
  pageCount: number | null
  rating: number | null
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <Badge variant="outline" className="flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-lg">
      <span className="text-xs font-normal text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </Badge>
  )
}

export function StatBadgeGroup({ copies, pageCount, rating }: StatBadgeGroupProps) {
  return (
    <div className="flex items-center justify-center gap-3">
      <StatBadge label="Exemplaire" value={copies != null ? String(copies) : '—'} />
      <StatBadge label="pages" value={pageCount != null ? String(pageCount) : '—'} />
      <StatBadge label="note" value={rating != null ? rating.toFixed(1).replace('.', ',') : '—'} />
    </div>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/entities/book/ui/StatBadgeGroup.tsx
git commit -m "feat(entities): add StatBadgeGroup component"
```

---

### Task 8: BookSummary component

**Files:**
- Create: `src/entities/book/ui/BookSummary.tsx`

- [ ] **Step 1: Create BookSummary component**

Texte tronqué avec `line-clamp-4`, bouton "lire tout" toggle un état `expanded`.

```tsx
import { useState } from 'react'

import { cn } from '@/shared/lib/utils'

interface BookSummaryProps {
  summary: string | null
}

export function BookSummary({ summary }: BookSummaryProps) {
  const [expanded, setExpanded] = useState(false)

  if (!summary) return null

  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold">Résumé</h2>
      <p className={cn('font-serif text-sm leading-relaxed text-muted-foreground', !expanded && 'line-clamp-4')}>
        {summary}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-sm font-medium text-primary underline-offset-2 hover:underline"
      >
        {expanded ? 'réduire' : 'lire tout'}
      </button>
    </section>
  )
}
```

- [ ] **Step 2: Verify build passes**

Run: `npm run build`

- [ ] **Step 3: Commit**

```bash
git add src/entities/book/ui/BookSummary.tsx
git commit -m "feat(entities): add BookSummary component with expand/collapse"
```

---

### Task 9: BookDetailPage — composition + mock data

**Files:**
- Create: `src/pages/BookDetailPage/BookDetailPage.tsx`
- Create: `src/pages/BookDetailPage/index.ts`
- Delete: `src/pages/BookPage.tsx`

- [ ] **Step 1: Create BookDetailPage**

```tsx
import { Bookmark } from 'lucide-react'

import type { Book } from '@/entities/book'
import { BookCover } from '@/entities/book/ui/BookCover'
import { BookMeta } from '@/entities/book/ui/BookMeta'
import { BookSummary } from '@/entities/book/ui/BookSummary'
import { StatBadgeGroup } from '@/entities/book/ui/StatBadgeGroup'
import { BackButton } from '@/shared/ui/back-button'
import { Button } from '@/shared/ui/button'

const MOCK_BOOK: Book = {
  id: '1',
  title: '20th Century Boys - Tome 1',
  author: 'Naoki Urasawa',
  genre: 'Manga - Shonen',
  coverUrl: 'https://m.media-amazon.com/images/I/91S+dOBGMGL._SL1500_.jpg',
  pageCount: 418,
  rating: 4.7,
  copies: 2,
  summary:
    "Kenji est un commerçant tranquille qui a repris et transformé le magasin familial. Son seul problème est Kana, la fille de sa sœur, que cette dernière lui a confiée avant de partir. Mais voilà qu'un jour, la police vient l'interroger sur un de ses anciens camarades de classe porté disparu...",
}

export function BookDetailPage() {
  const book = MOCK_BOOK

  return (
    <div className="mx-auto flex max-w-md flex-col gap-5 px-4 pb-8">
      {/* Cover + BackButton overlay */}
      <div className="relative">
        <div className="absolute top-3 left-3 z-10">
          <BackButton />
        </div>
        <BookCover coverUrl={book.coverUrl} title={book.title} />
      </div>

      {/* Title + Bookmark */}
      <div className="flex items-start justify-between gap-2">
        <BookMeta title={book.title} author={book.author} genre={book.genre} />
        <button type="button" className="mt-1 text-foreground" aria-label="Ajouter aux favoris">
          <Bookmark className="size-5" />
        </button>
      </div>

      {/* Stats */}
      <StatBadgeGroup copies={book.copies} pageCount={book.pageCount} rating={book.rating} />

      {/* Summary */}
      <BookSummary summary={book.summary} />

      {/* CTA slot */}
      <Button className="w-full" size="lg">
        Réserver ce livre
      </Button>
    </div>
  )
}
```

- [ ] **Step 2: Create barrel export**

Create `src/pages/BookDetailPage/index.ts`:
```ts
export { BookDetailPage } from './BookDetailPage'
```

- [ ] **Step 3: Delete old BookPage.tsx**

```bash
rm src/pages/BookPage.tsx
```

- [ ] **Step 4: Verify build passes**

Run: `npm run build`

- [ ] **Step 5: Commit**

```bash
git add src/pages/BookDetailPage/ src/pages/BookPage.tsx
git commit -m "feat(pages): add BookDetailPage with mock data and layout"
```

---

### Task 10: Update barrel exports + route wiring

**Files:**
- Modify: `src/entities/book/index.ts`
- Modify: `src/app/providers/router.tsx`

- [ ] **Step 1: Update entities/book barrel export with UI components**

Update `src/entities/book/index.ts`:
```ts
export type { Book } from './model/types'
export { BookCover } from './ui/BookCover'
export { BookMeta } from './ui/BookMeta'
export { StatBadgeGroup } from './ui/StatBadgeGroup'
export { BookSummary } from './ui/BookSummary'
```

- [ ] **Step 2: Wire BookDetailPage in router**

Update `src/app/providers/router.tsx` — replace the `/book/:id` placeholder:

```tsx
import { BookDetailPage } from '@/pages/BookDetailPage'
```

Replace line 22:
```tsx
element: <BookDetailPage />,
```

- [ ] **Step 3: Verify build passes**

Run: `npm run build`
Expected: Build succeeds with no errors.

- [ ] **Step 4: Visual check**

Run: `npm run dev`
Navigate to `http://localhost:5173/book/1` and verify the layout matches the mockup.

- [ ] **Step 5: Commit**

```bash
git add src/entities/book/index.ts src/app/providers/router.tsx
git commit -m "feat: wire BookDetailPage route and update barrel exports"
```
