# Issue #30 — UI Layout fiche livre (données statiques)

## Objectif

Intégrer le layout de la fiche livre à partir de la maquette, avec des données statiques/mockées. Phase UI uniquement — pas de fetch, pas d'états loading/error.

## Interface Book

```ts
interface Book {
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

## Arbre de composants

```
BookDetailPage
├── BackButton                        ← shared/ui/back-button
├── BookCover                         ← entities/book/ui/BookCover
├── BookmarkButton (slot statique)    ← Lucide Bookmark, non fonctionnel
├── BookMeta                          ← entities/book/ui/BookMeta (titre, auteur, genre)
├── StatBadgeGroup                    ← entities/book/ui/StatBadgeGroup
│   └── 3x Badge shadcn variant="outline" (Exemplaires, Pages, Note)
├── BookSummary                       ← entities/book/ui/BookSummary
│   └── texte tronqué line-clamp + "lire tout" (useState toggle)
└── CTAButton (slot statique)         ← shadcn Button "Réserver ce livre"
```

## Structure fichiers

```
src/
  pages/
    BookDetailPage/
      BookDetailPage.tsx
      index.ts
  entities/
    book/
      ui/
        BookCover.tsx
        BookMeta.tsx
        StatBadgeGroup.tsx
        BookSummary.tsx
      model/
        types.ts
      index.ts
  shared/
    ui/
      back-button.tsx
```

## Design system — tokens ajoutés

### Typographie

- **Literata Variable** (serif) : titres de livres, résumé
- **Geist Variable** (sans-serif) : UI, badges, boutons, labels
- Dépendance : `@fontsource-variable/literata`

### Tokens CSS

```css
--font-serif: 'Literata Variable', serif;
```

## Composants — détails

### BackButton (`shared/ui/back-button.tsx`)

- shadcn `Button` `variant="ghost"` `size="icon"`
- Icône `ChevronLeft` (Lucide)
- Fond sombre arrondi (bg-primary text-primary-foreground), positionné en overlay sur la cover
- `onClick={() => history.back()}`

### BookCover (`entities/book/ui/BookCover.tsx`)

- Ratio fixe `aspect-[2/3]`, coins arrondis `rounded-xl`
- `<img>` si `coverUrl` fourni, sinon placeholder fond `muted`
- Centré horizontalement

### BookmarkButton (slot)

- Icône `Bookmark` (Lucide), positionnée à droite du titre
- Statique, non fonctionnel — slot pour US3 (#13)

### BookMeta (`entities/book/ui/BookMeta.tsx`)

- Titre : `font-serif`, gras
- Auteur : taille réduite
- Genre : `text-muted-foreground`, taille réduite

### StatBadgeGroup (`entities/book/ui/StatBadgeGroup.tsx`)

- 3 badges en ligne (flex, gap)
- Chaque badge : shadcn `Badge` `variant="outline"`
- Structure : label (petit texte au-dessus) + value (plus gros, centré)
- Badges : Exemplaires, Pages, Note

### BookSummary (`entities/book/ui/BookSummary.tsx`)

- Heading "Résumé"
- Texte avec `line-clamp-4` par défaut
- Bouton "lire tout" qui toggle `expanded` state → retire le clamp
- Font serif (Literata) pour le texte

### CTAButton (slot)

- shadcn `Button` pleine largeur (`w-full`)
- Texte "Réserver ce livre"
- Statique, non fonctionnel — slot pour US2 (#10)

## Données mockées

```ts
const MOCK_BOOK: Book = {
  id: "1",
  title: "20th Century Boys - Tome 1",
  author: "Naoki Urasawa",
  genre: "Manga - Shonen",
  coverUrl: "https://m.media-amazon.com/images/I/91S+dOBGMGL._SL1500_.jpg",
  pageCount: 418,
  rating: 4.7,
  copies: 2,
  summary: "Kenji est un commerçant tranquille qui a repris et transformé le magasin familial. Son seul problème est Kana, la fille de sa sœur, que cette dernière lui a confiée avant de partir. Mais voilà qu'un jour, la police vient l'interroger sur un de ses anciens camarades de classe porté disparu..."
}
```

## Hors scope

- Fetch de données API (→ #31)
- États loading/error/empty (→ #31)
- Logique CTA réservation (→ #10)
- Logique bookmark (→ #13)
- Navigation globale (→ #9)
