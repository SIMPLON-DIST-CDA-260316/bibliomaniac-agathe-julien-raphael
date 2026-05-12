# BookCTA + Drawer UI Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Deliver issue #32 — a `BookCTA` React component that renders the 6 contextual variants on the book detail page, plus a confirmation Drawer that opens from the `available` variant. UI scope only — no fetch, no mutation, no navigation logic.

**Architecture:** Discriminated-union state (`BookCTAState`) drives a single switch in `BookCTA`; the Drawer is encapsulated inside the component and fires `onReserveConfirm` after the user validates. Four "in-progress" variants share a placeholder `onActiveStateClick` callback (to be split per-variant in future iterations, see spec). A DEV-only sandbox route (`/dev/book-cta`) lets us visually verify the seven samples (6 kinds + a J-2 alert variant of `borrowed`).

**Tech Stack:** React 19, TypeScript, Tailwind v4, shadcn/ui (Button + Drawer wrapper of `vaul`), `lucide-react`, `class-variance-authority`, `react-router` v7, Vite.

**Reference spec:** `docs/superpowers/specs/2026-05-12-book-cta-drawer-ui-design.md`

---

## Testing strategy

This project has **no test runner installed** (no vitest, no jest). Adding one is out of scope (#32 is a single UI feature — installing a test framework is a separate decision, not a quiet drift). Verification gates in this plan therefore rely on:

1. `npm run type-check` — TypeScript catches discriminated-union exhaustiveness and prop misuse
2. `npm run lint` — Prettier + ESLint
3. **Visual sandbox verification** in a browser at `/dev/book-cta` — the dev opens the sandbox, confirms each of the 7 samples renders correctly, and clicks through interactions (Drawer open/close, `onReserveConfirm` log on confirm, `onActiveStateClick` log on each nav variant).

After implementation, the dev runs `npm run validate` (lint + type-check) and starts `npm run dev` to verify the sandbox. The plan calls out these checkpoints explicitly.

---

## File structure

| Path | Action | Responsibility |
|------|--------|----------------|
| `src/index.css` | Modify | Add `--warning` / `--warning-foreground` tokens (light + dark) |
| `src/shared/ui/button.tsx` | Modify | Add `warning` variant to the CVA |
| `src/features/book/model/bookCta.types.ts` | Create | Discriminated union `BookCTAState` + `BOOK_CTA_ALERT_THRESHOLD_DAYS` |
| `src/features/book/ui/cta-drawers/BookReserveConfirmDrawer.tsx` | Create | Drawer content for the "Réserver" confirmation |
| `src/features/book/ui/BookCTA.tsx` | Create | Main component, switch on `state.kind`, owns Drawer state for `available` |
| `src/features/book/index.ts` | Modify | Re-export `BookCTA`, `BookCTAState`, `BookCTAKind`, `BOOK_CTA_ALERT_THRESHOLD_DAYS` |
| `src/pages/BookDetailPage/BookDetailPage.tsx` | Modify | Replace placeholder `<Button>Réserver ce livre</Button>` with `<BookCTA state={{ kind: 'available' }} ... />` |
| `src/pages/dev/BookCTASandbox.tsx` | Create | DEV-only sandbox page listing 7 samples |
| `src/app/providers/router.tsx` | Modify | Conditionally register `/dev/book-cta` when `import.meta.env.DEV` |

---

## Task 1: Add warning CSS tokens

**Files:**
- Modify: `src/index.css` (root `:root` block + `.dark` block + `@theme inline` block)

**Why:** The `borrowed` variant switches to a warning treatment when `daysLeft <= 3`. The existing theme has `destructive` (red) and `emphasis` (olive) but no neutral warning (amber/orange). Add the tokens before extending the Button CVA so we have something to reference.

- [ ] **Step 1 — Edit `src/index.css`**

In the `@theme inline` block, alongside the existing `--color-destructive` line, add:

```css
  --color-warning: var(--warning);
  --color-warning-foreground: var(--warning-foreground);
```

In the `:root` block, alongside the existing `--destructive` line, add:

```css
  --warning: oklch(0.72 0.16 60); /* warm amber */
  --warning-foreground: var(--bm-black);
```

In the `.dark` block, alongside the existing `--destructive` line, add:

```css
  --warning: oklch(0.78 0.16 70);
  --warning-foreground: oklch(0.145 0 0);
```

- [ ] **Step 2 — Type-check + dev server**

```bash
npm run type-check
```
Expected: passes (CSS changes don't affect TS).

```bash
npm run dev
```
Open `http://localhost:5173/book/9780140449266` (any book id). Confirm the page still renders normally — no regression from the CSS additions.

- [ ] **Step 3 — Commit**

```bash
git add src/index.css
git commit -m "feat(theme): add warning semantic color tokens"
```

---

## Task 2: Add `warning` variant to the Button CVA

**Files:**
- Modify: `src/shared/ui/button.tsx:8-42` (the `cva(...)` call)

**Why:** `BookCTA` uses `variant="warning"` for `borrowed` when `daysLeft <= BOOK_CTA_ALERT_THRESHOLD_DAYS`. The CVA must know that variant; otherwise the prop is a type error.

- [ ] **Step 1 — Edit `src/shared/ui/button.tsx`**

Inside the `variant: { ... }` block, after the `destructive: ...` line, add the `warning` variant:

```ts
        warning:
          'bg-warning/15 text-warning-foreground hover:bg-warning/25 focus-visible:border-warning/40 focus-visible:ring-warning/30 dark:bg-warning/20 dark:hover:bg-warning/30 dark:focus-visible:ring-warning/40',
```

Pattern note: this is **not** a 1:1 mirror of `destructive`. `destructive` uses the same color for both background tint and foreground text (red-on-red-tint stays readable). Amber-on-amber-tint would be illegible, so `warning` uses a dedicated `--warning-foreground` token (neutral black/dark) and slightly higher tint opacities (`/15` / `/25`) for visual weight on the cream background. The `dark:focus-visible:ring-warning/40` mirrors the equivalent line on `destructive` for ring-color parity in dark mode.

- [ ] **Step 2 — Type-check**

```bash
npm run type-check
```
Expected: passes. `Button` now accepts `variant="warning"` thanks to `VariantProps<typeof buttonVariants>`.

- [ ] **Step 3 — Commit**

```bash
git add src/shared/ui/button.tsx
git commit -m "feat(ui): add warning variant to Button CVA"
```

> Visual verification of the `warning` variant happens later in Task 9 via the sandbox's `borrowed (J-2, alert)` sample — no need for a throwaway probe here.

---

## Task 3: Create `BookCTAState` types + alert threshold constant

**Files:**
- Create: `src/features/book/model/bookCta.types.ts`

- [ ] **Step 1 — Create the file**

Path: `src/features/book/model/bookCta.types.ts`

```ts
/**
 * Resolved CTA state for a book — produced by the logic layer (#33),
 * consumed by the BookCTA UI component.
 *
 * Discriminated union: TypeScript enforces that `daysLeft` is only
 * provided (and required) when kind === 'borrowed'.
 */
export type BookCTAState =
  | { kind: 'available' }
  | { kind: 'unavailable' }
  | { kind: 'reserved' }
  | { kind: 'ready' }
  | { kind: 'borrowed'; daysLeft: number }
  | { kind: 'overdue' }

export type BookCTAKind = BookCTAState['kind']

/**
 * Threshold (in days) below which a 'borrowed' variant switches
 * to warning visual treatment. Pure UI concern.
 */
export const BOOK_CTA_ALERT_THRESHOLD_DAYS = 3
```

- [ ] **Step 2 — Type-check**

```bash
npm run type-check
```
Expected: passes.

- [ ] **Step 3 — Commit**

```bash
git add src/features/book/model/bookCta.types.ts
git commit -m "feat(book): add BookCTAState discriminated union + alert threshold"
```

---

## Task 4: Create the reservation confirmation Drawer

**Files:**
- Create: `src/features/book/ui/cta-drawers/BookReserveConfirmDrawer.tsx`

- [ ] **Step 1 — Create the file**

Path: `src/features/book/ui/cta-drawers/BookReserveConfirmDrawer.tsx`

```tsx
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { Button } from '@/shared/ui/button'

export interface BookReserveConfirmDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If provided, displayed in italics inside the confirmation question. */
  bookTitle?: string
  /** Called after the drawer closes itself, on user confirmation. */
  onConfirm: () => void
}

export function BookReserveConfirmDrawer({
  open,
  onOpenChange,
  bookTitle,
  onConfirm,
}: BookReserveConfirmDrawerProps) {
  function handleConfirm() {
    onOpenChange(false)
    onConfirm()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Réserver {bookTitle ? <em>{bookTitle}</em> : 'ce livre'} ?
          </DrawerTitle>
          <DrawerDescription>
            Tu seras notifié dès que le livre sera prêt à être retiré.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button size="lg" onClick={handleConfirm}>
            Confirmer la réservation
          </Button>
          <DrawerClose asChild>
            <Button size="lg" variant="outline">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
```

Notes:
- `handleConfirm` closes the drawer *before* invoking `onConfirm` (per spec — keeps the parent from having to manage closure).
- `DrawerClose asChild` wraps the Cancel button so vaul's overlay click / Escape / swipe-down also route through `onOpenChange(false)` without invoking confirm.

- [ ] **Step 2 — Type-check**

```bash
npm run type-check
```
Expected: passes.

- [ ] **Step 3 — Commit**

```bash
git add src/features/book/ui/cta-drawers/BookReserveConfirmDrawer.tsx
git commit -m "feat(book): add BookReserveConfirmDrawer"
```

---

## Task 5: Create the `BookCTA` component

**Files:**
- Create: `src/features/book/ui/BookCTA.tsx`

- [ ] **Step 1 — Create the file**

Path: `src/features/book/ui/BookCTA.tsx`

```tsx
import { useState } from 'react'
import {
  BookAlert,
  BookCheck,
  BookDashed,
  BookPlus,
  BookUp,
  ClockFading,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

import {
  BOOK_CTA_ALERT_THRESHOLD_DAYS,
  type BookCTAState,
} from '@/features/book/model/bookCta.types'
import { BookReserveConfirmDrawer } from '@/features/book/ui/cta-drawers/BookReserveConfirmDrawer'

// Local enum mirrors the variants declared in `src/shared/ui/button.tsx` CVA.
// Kept duplicated (instead of `VariantProps<typeof buttonVariants>`) to avoid
// coupling to the Button file. If new variants are added to the CVA, also
// reflect them here so the presentation table stays well-typed.
type ButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link'
  | 'warning'

interface VariantPresentation {
  label: string
  icon: LucideIcon
  variant: ButtonVariant
}

function presentationFor(state: BookCTAState): VariantPresentation {
  switch (state.kind) {
    case 'available':
      return { label: 'Réserver ce livre', icon: BookPlus, variant: 'default' }
    case 'unavailable':
      return { label: 'Indisponible', icon: BookDashed, variant: 'secondary' }
    case 'reserved':
      return { label: 'Réservé', icon: BookCheck, variant: 'secondary' }
    case 'ready':
      return { label: 'À retirer', icon: BookUp, variant: 'default' }
    case 'borrowed':
      return {
        label: `J-${state.daysLeft}`,
        icon: ClockFading,
        variant:
          state.daysLeft <= BOOK_CTA_ALERT_THRESHOLD_DAYS
            ? 'warning'
            : 'default',
      }
    case 'overdue':
      return {
        label: 'Retour en retard',
        icon: BookAlert,
        variant: 'destructive',
      }
  }
}

export interface BookCTAProps {
  state: BookCTAState
  /** Relayed to the confirmation Drawer when state.kind === 'available'. */
  bookTitle?: string
  /** Fired after user confirms inside the Drawer (state.kind === 'available'). */
  onReserveConfirm: () => void
  /** Fired on click of any "in-progress" variant: reserved, ready, borrowed, overdue. */
  onActiveStateClick?: () => void
  className?: string
}

export function BookCTA({
  state,
  bookTitle,
  onReserveConfirm,
  onActiveStateClick,
  className,
}: BookCTAProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const { label, icon: Icon, variant } = presentationFor(state)

  const isUnavailable = state.kind === 'unavailable'
  const isAvailable = state.kind === 'available'

  function handleClick() {
    if (isUnavailable) return
    if (isAvailable) {
      setDrawerOpen(true)
      return
    }
    // reserved | ready | borrowed | overdue
    // TODO US5 / US6 — replace with variant-specific drawer or navigation
    onActiveStateClick?.()
  }

  return (
    <>
      <Button
        type="button"
        variant={variant}
        size="lg"
        disabled={isUnavailable}
        onClick={handleClick}
        className={cn('h-12 w-full text-base', className)}
      >
        <Icon className="size-5" aria-hidden />
        {label}
      </Button>

      {isAvailable && (
        <BookReserveConfirmDrawer
          open={drawerOpen}
          onOpenChange={setDrawerOpen}
          bookTitle={bookTitle}
          onConfirm={onReserveConfirm}
        />
      )}
    </>
  )
}
```

Notes:
- The `switch` over `state.kind` has no `default`; TypeScript's exhaustiveness checking guarantees future kinds force a compile error here.
- The native `disabled` attribute is enough for assistive tech: the browser exposes the disabled state automatically, and the AC `aria-disabled` requirement is satisfied by the native attribute. A separate `aria-disabled` prop would be redundant.
- `Icon` is laid out by the `Button` CVA's `gap-1.5` flex spacing (size `lg`); no manual right-margin needed.
- `LucideIcon` type imported for the variant table; `as` casts avoided.

- [ ] **Step 2 — Type-check**

```bash
npm run type-check
```
Expected: passes.

- [ ] **Step 3 — Commit**

```bash
git add src/features/book/ui/BookCTA.tsx
git commit -m "feat(book): add BookCTA component with 6 variants"
```

---

## Task 6: Re-export shared types from the feature barrel

**Files:**
- Modify: `src/features/book/index.ts`

**Convention note:** Existing files in this codebase (e.g. `BookDetailPage`) import UI components via **deep paths** (`@/features/book/ui/BookCover`) even when the barrel exists. We keep that convention — only types/constants needed by sibling features (#33 will import `BookCTAState`) go through the barrel. The `BookCTA` component itself stays deep-pathed.

- [ ] **Step 1 — Edit the file**

Append these lines (no component re-export):

```ts
export type { BookCTAState, BookCTAKind } from './model/bookCta.types'
export { BOOK_CTA_ALERT_THRESHOLD_DAYS } from './model/bookCta.types'
```

- [ ] **Step 2 — Type-check**

```bash
npm run type-check
```
Expected: passes.

- [ ] **Step 3 — Commit**

```bash
git add src/features/book/index.ts
git commit -m "feat(book): re-export BookCTAState + alert threshold from barrel"
```

---

## Task 7: Integrate `BookCTA` into `BookDetailPage`

**Files:**
- Modify: `src/pages/BookDetailPage/BookDetailPage.tsx:11` (imports) + `:66-68` (CTA render site)

- [ ] **Step 1 — Edit imports**

At the top of the file, alongside the existing `Button` import (line 11), add:

```ts
import { BookCTA } from '@/features/book/ui/BookCTA'
```

You can leave the `Button` import in place — it is still used by `BookDetailNotFoundState` (lines 129-133).

- [ ] **Step 2 — Replace the placeholder at lines 66-68**

Before:

```tsx
        <Button className="h-12 w-full shrink-0 text-base" size="lg">
          Réserver ce livre
        </Button>
```

After:

```tsx
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
```

- [ ] **Step 3 — Visual verification**

```bash
npm run dev
```
Open `http://localhost:5173/book/9780140449266` (or any book id present in mocks). Confirm:
- The bottom CTA now shows the `BookPlus` icon + "Réserver ce livre"
- Clicking the CTA opens the bottom Drawer with the title in italics
- The Drawer's "Annuler" button closes it; clicking the overlay also closes it; pressing Escape closes it
- Clicking "Confirmer la réservation" closes the Drawer and logs `[BookCTA] reserve confirmed for ...` in the browser console

- [ ] **Step 4 — Type-check + lint**

```bash
npm run validate
```
Expected: passes.

- [ ] **Step 5 — Commit**

```bash
git add src/pages/BookDetailPage/BookDetailPage.tsx
git commit -m "feat(book-detail): wire BookCTA on the detail page (available variant)"
```

---

## Task 8: Create the sandbox page

**Files:**
- Create: `src/pages/dev/BookCTASandbox.tsx`

- [ ] **Step 1 — Create the file**

Path: `src/pages/dev/BookCTASandbox.tsx`

```tsx
import { BookCTA } from '@/features/book/ui/BookCTA'
import type { BookCTAState } from '@/features/book/model/bookCta.types'

const SAMPLES: { label: string; state: BookCTAState }[] = [
  { label: 'available', state: { kind: 'available' } },
  { label: 'unavailable', state: { kind: 'unavailable' } },
  { label: 'reserved', state: { kind: 'reserved' } },
  { label: 'ready', state: { kind: 'ready' } },
  { label: 'borrowed (J-7)', state: { kind: 'borrowed', daysLeft: 7 } },
  { label: 'borrowed (J-2, alert)', state: { kind: 'borrowed', daysLeft: 2 } },
  { label: 'overdue', state: { kind: 'overdue' } },
]

export function BookCTASandbox() {
  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-6">
      <header className="space-y-1">
        <h1 className="font-heading text-xl">BookCTA — variantes</h1>
        <p className="text-muted-foreground text-sm">
          Sandbox DEV only. Vérifie les 6 variantes + bascule alerte J-2.
        </p>
      </header>
      {SAMPLES.map(({ label, state }) => (
        <section key={label} className="space-y-2">
          <p className="text-muted-foreground text-sm">{label}</p>
          <BookCTA
            state={state}
            bookTitle="Le Comte de Monte-Cristo"
            onReserveConfirm={() => console.log('[sandbox] reserve confirmed')}
            onActiveStateClick={() =>
              console.log('[sandbox] active state click', state.kind)
            }
          />
        </section>
      ))}
    </main>
  )
}
```

- [ ] **Step 2 — Type-check**

```bash
npm run type-check
```
Expected: passes.

- [ ] **Step 3 — Commit**

```bash
git add src/pages/dev/BookCTASandbox.tsx
git commit -m "feat(dev): add BookCTA sandbox page"
```

---

## Task 9: Register the sandbox route (DEV only)

**Files:**
- Modify: `src/app/providers/router.tsx`

- [ ] **Step 1 — Edit imports**

At the top of the file, alongside the existing page imports, add:

```ts
import { BookCTASandbox } from '@/pages/dev/BookCTASandbox'
```

- [ ] **Step 2 — Add the conditional route**

Inside the `children: [...]` array, append this entry just before the closing `]` (after the `/register` route):

```ts
      ...(import.meta.env.DEV
        ? [
            {
              path: '/dev/book-cta',
              element: <BookCTASandbox />,
            },
          ]
        : []),
```

The spread keeps the production bundle clean of dev-only routes.

- [ ] **Step 3 — Visual verification**

```bash
npm run dev
```
Open `http://localhost:5173/dev/book-cta`. Confirm:
- 7 sections render, each with a label and a CTA
- `available` opens the Drawer
- `unavailable` button is disabled and has `aria-disabled="true"` (inspect via devtools)
- `reserved`, `ready`, `borrowed (J-7)`, `borrowed (J-2 alert)`, `overdue` each log `[sandbox] active state click <kind>` to the console
- The two `borrowed` samples render with different visual treatment (J-2 uses the warning amber, J-7 uses the default style)
- Each icon matches: `BookPlus`, `BookDashed`, `BookCheck`, `BookUp`, `ClockFading` (×2), `BookAlert`

Then, simulate a production build to confirm the route disappears:

```bash
npm run build
```
Confirm the build succeeds and **introduces no new warnings compared to a baseline build on `origin/develop`**. Pre-existing warnings unrelated to this work are not a blocker; only ones traceable to the new files matter. (The DEV-only spread ensures `/dev/book-cta` is absent from the prod bundle anyway.)

- [ ] **Step 4 — Type-check + lint**

```bash
npm run validate
```
Expected: passes.

- [ ] **Step 5 — Commit**

```bash
git add src/app/providers/router.tsx
git commit -m "feat(router): register /dev/book-cta sandbox route (DEV only)"
```

---

## Task 10: Final verification

- [ ] **Step 1 — Full validate**

```bash
npm run validate
```
Expected: passes (lint + type-check).

- [ ] **Step 2 — Manual smoke test**

```bash
npm run dev
```
Walk through:
1. `/book/<any-id>` — page renders; CTA shows `Réserver ce livre`; Drawer opens on click; confirm logs; cancel/Echap/overlay close the drawer without firing confirm.
2. `/dev/book-cta` — all 7 samples render; interactions log as expected; visual differences between `J-7` and `J-2` are obvious.
3. Resize to mobile width (DevTools 375px): Drawer slides up from bottom and fits within the viewport.

- [ ] **Step 3 — Confirm git log**

```bash
git log --oneline origin/develop..HEAD
```
Expected output: the 9 task commits below, plus the 3 pre-existing `docs(...)` commits that were created on this branch *before* execution starts (spec brainstorm output, spec revisions after reviewer, and this very implementation plan).

```
<sha> feat(router): register /dev/book-cta sandbox route (DEV only)
<sha> feat(dev): add BookCTA sandbox page
<sha> feat(book-detail): wire BookCTA on the detail page (available variant)
<sha> feat(book): re-export BookCTAState + alert threshold from barrel
<sha> feat(book): add BookCTA component with 6 variants
<sha> feat(book): add BookReserveConfirmDrawer
<sha> feat(book): add BookCTAState discriminated union + alert threshold
<sha> feat(ui): add warning variant to Button CVA
<sha> feat(theme): add warning semantic color tokens
<sha> docs(plan): implementation plan for #32 BookCTA + Drawer UI           ← pre-existing
<sha> docs(spec): fold reviewer recommendations into #32 spec               ← pre-existing
<sha> docs(spec): brainstorm output for #32 BookCTA + Drawer UI             ← pre-existing
```

- [ ] **Step 4 — Ready for PR**

The branch `feat/book-US2-ui-cta-drawer` is ready to push and open a PR closing #32. PR description should:
- link to issue #32 (closes #32)
- mention spec + plan paths
- include the bullet list of acceptance criteria from #32 (UI scope only)
- include a screenshot / GIF of the sandbox

---

## Verification matrix vs spec acceptance criteria

| Spec AC | Covered by |
|---------|------------|
| 6 visual variants of CTA | Task 5 (presentation table) + Task 9 (sandbox) |
| Drawer opens on `available` click | Task 5 + Task 7 + Task 9 |
| Drawer closes on Annuler / Echap / swipe / overlay | Task 4 (DrawerClose + vaul) + Task 7 verification |
| `aria-disabled` on `unavailable` | Task 5 (explicit prop) + Task 9 (devtools check) |
| Focus trap inside Drawer | Task 4 (vaul) — not manually re-implemented |
| CTA keyboard activable (Enter/Espace) | Task 5 (`Button` shadcn default) |
| Discriminated union shared with #33 | Task 3 + Task 6 (barrel re-export) |
| Alert threshold const | Task 3 |
| `cta-drawers/` scaffolding | Task 4 (single drawer + folder) |
| Sandbox 7 samples DEV-only | Task 8 + Task 9 |
| Integration in `BookDetailPage` | Task 7 |
| No drift into logic (#33) | All `TODO #33` callouts in Task 7 + comments in Task 5 |
