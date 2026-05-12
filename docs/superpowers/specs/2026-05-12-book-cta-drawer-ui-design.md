# Issue #32 — UI Composant bouton CTA + Drawer de confirmation

## Objectif

Intégrer les composants visuels du CTA contextuel sur la fiche livre (6 variantes) ainsi que le Drawer de confirmation associé à l'action "Réserver". Phase UI uniquement — la résolution de la variante depuis l'état serveur, le flow de réservation, la navigation et le login différé sont couverts par la sous-issue Logic #33.

Issue parente : US2 — Agir sur un livre via le CTA contextuel (#10).

## Périmètre

### À faire

- Composant `BookCTA` couvrant les 6 variantes visuelles
- Drawer de confirmation `BookReserveConfirmDrawer` ouvert depuis la variante `available`
- Type discriminé `BookCTAState` (source de vérité partagée avec #33)
- Constante `BOOK_CTA_ALERT_THRESHOLD_DAYS` (seuil visuel de bascule warning sur `borrowed`)
- Intégration dans `BookDetailPage` (remplace le placeholder statique `<Button>Réserver ce livre</Button>`)
- Route sandbox `/dev/book-cta` (DEV only) listant les 6 variantes
- Accessibilité : `aria-disabled` sur `unavailable`, focus trap / Échap / swipe-down gérés par vaul (Drawer shadcn déjà installé)

### Hors scope

- Fetch de l'état utilisateur/livre (→ #33)
- Résolution dynamique de la variante depuis 3 domaines (stock / réservation / emprunt) (→ #33)
- Mutation de création de réservation côté back (→ #33)
- Navigation effective vers détail réservation/emprunt (→ #33)
- Login différé et reprise d'action post-login (→ #33)
- Drawers spécifiques pour les 4 variantes "en cours" (reserved, ready, borrowed, overdue) — scaffolding du dossier prêt, contenu futur
- Subscribe notification sur `unavailable` (→ US6 #15)
- Sélecteur calendrier dans le Drawer (→ US5 #38)
- Calcul de `daysLeft` depuis `returnDueDate` (→ #33)

## Types

`src/features/book/model/bookCta.types.ts`

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
 * to warning visual treatment. Pure UI concern, kept out of #33.
 */
export const BOOK_CTA_ALERT_THRESHOLD_DAYS = 3
```

Re-export depuis `src/features/book/index.ts` :

```ts
export type { BookCTAState, BookCTAKind } from './model/bookCta.types'
export { BOOK_CTA_ALERT_THRESHOLD_DAYS } from './model/bookCta.types'
export { BookCTA } from './ui/BookCTA'
```

## Tableau de présentation des variantes

| `kind`        | Libellé bouton                     | Icône Lucide  | Variant `Button`                       | Interactif | Action UI (#32)              |
|---------------|------------------------------------|---------------|----------------------------------------|------------|------------------------------|
| `available`   | "Réserver ce livre"                | `BookPlus`    | `default`                              | oui        | Ouvre `BookReserveConfirmDrawer` |
| `unavailable` | "Indisponible"                     | `BookDashed`  | `secondary` + `disabled` + `aria-disabled` | non    | aucune                       |
| `reserved`    | "Réservé"                          | `BookCheck`   | `secondary`                            | oui        | `onActiveStateClick()`       |
| `ready`       | "À retirer"                        | `BookUp`      | `default` (accent)                     | oui        | `onActiveStateClick()`       |
| `borrowed`    | `J-${daysLeft}`                    | `ClockFading` | `default` ou `warning` si `daysLeft <= BOOK_CTA_ALERT_THRESHOLD_DAYS` | oui | `onActiveStateClick()` |
| `overdue`     | "Retour en retard"                 | `BookAlert`   | `destructive`                          | oui        | `onActiveStateClick()`       |

Notes :

- Les variants `warning` / `destructive` doivent exister dans `shared/ui/button.tsx` (CVA). Si absents, ajout au CVA + tokens CSS sémantiques (`--warning`, `--warning-foreground`).
- Libellé `borrowed` court (`J-${daysLeft}`) pour tenir sur mobile ; pas de suffixe "avant retour" dans le bouton.

## API composant

### `BookCTA`

```ts
interface BookCTAProps {
  state: BookCTAState
  bookTitle?: string                    // relayé au Drawer ; fallback "ce livre"
  onReserveConfirm: () => void          // fired après confirmation du Drawer
  onActiveStateClick?: () => void       // fired sur clic d'une variante "en cours"
  className?: string
}
```

### `BookReserveConfirmDrawer`

```ts
interface BookReserveConfirmDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  bookTitle?: string
  onConfirm: () => void
}
```

### Rationale API

- **Drawer interne au composant** : `BookCTA` encapsule le state `open` du Drawer pour la variante `available`. Le parent passe deux callbacks d'intention (`onReserveConfirm`, `onActiveStateClick`) et n'a pas à connaître l'existence du Drawer.
- **Union discriminée** : ajouter ou modifier une variante force TypeScript à signaler tous les sites de consommation à mettre à jour. Sécurité d'extension.
- **Séparation `onReserveConfirm` vs `onActiveStateClick`** : `onReserveConfirm` matérialise l'intention métier (validée par l'utilisateur). `onActiveStateClick` est un placeholder unique pour les 4 variantes "en cours" qui partageront, en #32, le même comportement (à terme : navigation distincte par variante, ou drawer dédié — voir section "Future-proof").

## Future-proof — drawers par variante

L'analyse des actions futures montre que chaque variante interactive aura probablement son propre drawer (date dispo + annulation pour `reserved` ; progress bar 3j pour `ready` ; progress bar de prêt + renouveler pour `borrowed` ; warning frais pour `overdue`). Discipline structurelle adoptée maintenant pour éviter le drift :

1. Chaque drawer futur sera un composant séparé dans `src/features/book/ui/cta-drawers/`. Le dossier est créé dès #32 avec `BookReserveConfirmDrawer.tsx` comme seul fichier.
2. `BookCTA` reste léger : switch sur `state.kind` qui dérive la présentation (label/icône/variant) d'un tableau de mapping et la behavior (drawer interne pour `available`, callback pour le reste).
3. Quand une variante "en cours" recevra son drawer, l'API évoluera : remplacement de `onActiveStateClick` par des props spécifiques (`onReservedClick`, `onReadyClick`,...) ou pattern slot/render-prop. La discriminated union force TS à valider la migration.
4. Commentaires `// TODO US5/US6 — variant-specific drawer` posés sur les 4 variantes nav pour signaler les points d'extension.

## Arborescence

```
src/
  features/
    book/
      model/
        book.types.ts                       ← existant
        bookCta.types.ts                    ← NEW
      ui/
        BookCTA.tsx                         ← NEW
        cta-drawers/
          BookReserveConfirmDrawer.tsx      ← NEW
      index.ts                              ← MAJ (export BookCTA + types)
  pages/
    BookDetailPage/
      BookDetailPage.tsx                    ← MAJ (substitue le placeholder)
    dev/
      BookCTASandbox.tsx                    ← NEW (DEV only)
  app/
    providers/
      router.tsx                            ← MAJ (route `/dev/book-cta` conditionnelle)
```

## Intégration `BookDetailPage`

Remplace les lignes 66-68 de `src/pages/BookDetailPage/BookDetailPage.tsx` :

```tsx
// avant
<Button className="h-12 w-full shrink-0 text-base" size="lg">
  Réserver ce livre
</Button>

// après
<BookCTA
  state={{ kind: 'available' }}            /* hardcodé en #32 ; résolu par #33 */
  bookTitle={book.title}
  onReserveConfirm={() => {}}              /* branché par #33 sur la mutation */
  onActiveStateClick={() => {}}            /* branché par #33 sur la navigation */
  className="shrink-0"
/>
```

## Sandbox `/dev/book-cta`

Page non-linkée, montée derrière `import.meta.env.DEV`. Affiche les 6 variantes (et la variante `borrowed` en deux échantillons : `daysLeft: 7` normal + `daysLeft: 2` alert) avec leur libellé descriptif. Handlers branchés sur `console.log` pour vérifier visuellement les interactions.

```tsx
const SAMPLES: { label: string; state: BookCTAState }[] = [
  { label: 'available',           state: { kind: 'available' } },
  { label: 'unavailable',         state: { kind: 'unavailable' } },
  { label: 'reserved',            state: { kind: 'reserved' } },
  { label: 'ready',               state: { kind: 'ready' } },
  { label: 'borrowed (J-7)',      state: { kind: 'borrowed', daysLeft: 7 } },
  { label: 'borrowed (J-2 alert)', state: { kind: 'borrowed', daysLeft: 2 } },
  { label: 'overdue',             state: { kind: 'overdue' } },
]
```

Route :

```ts
// src/app/providers/router.tsx
...(import.meta.env.DEV ? [{
  path: '/dev/book-cta',
  element: <BookCTASandbox />,
}] : []),
```

## Accessibilité

- `unavailable` : `disabled` + `aria-disabled="true"` (communiqué aux technologies d'assistance ; AC #10).
- Drawer : focus trap, fermeture clavier (Échap), swipe-down et clic-outside fournis nativement par vaul (`shared/ui/drawer.tsx` déjà en place).
- CTA activable au clavier : composant `Button` shadcn — comportement clavier par défaut (Enter/Espace) conservé.

## Décisions tranchées (récap brainstorming)

| Sujet | Choix | Raison |
|---|---|---|
| Nommage | `BookCTA` | Couvre les 6 variantes ; `BookOrderButton` trop restrictif |
| FSD location | `features/book/ui/` | Cohérent avec composants existants ; migrer vers `widgets/` ou `features/reservation/` si la feature grossit (US5, multi-hooks logic) |
| API props | Discriminated union `state` | Type-safe ; force la cohérence ; partagée avec #33 |
| Contenu Drawer | Option B (rappel titre + 2 boutons) | Confirmation explicite, pas d'info inventée |
| Seuil J-N alerte | UI applique const interne | Règle d'affichage, pas règle métier ; basculer en flag logic si seuil devient configurable |
| Handlers + Drawer | Drawer interne + 2 callbacks (`onReserveConfirm`, `onActiveStateClick`) | Composant autonome ; parent branche 2 props |
| Sandbox | Route `/dev/book-cta` DEV only | Storybook non installé ; alternative légère pour vérifier les 6 états |
| Future drawers | Dossier `cta-drawers/` + commentaires `TODO` | Discipline structurelle sans drift de scope |

## Dépendances vers le code existant

- `src/shared/ui/button.tsx` — composant Button shadcn ; éventuel ajout de variants `warning`/`destructive` au CVA
- `src/shared/ui/drawer.tsx` — wrapper shadcn de vaul
- `src/shared/lib/utils.ts` — helper `cn`
- `lucide-react` — icônes (`BookPlus`, `BookDashed`, `BookCheck`, `BookUp`, `ClockFading`, `BookAlert`)
- `src/features/book/model/book.types.ts` — type `Book` (champ `title` consommé pour `bookTitle`)
- `src/pages/BookDetailPage/BookDetailPage.tsx` — site d'intégration
- `src/app/providers/router.tsx` — déclaration de la route sandbox

## Risques & points à vérifier

- **Variants `warning`/`destructive` absents du CVA `button.tsx`** : à confirmer en début d'implémentation ; ajout des tokens CSS et des cas CVA si besoin.
- **Libellé `J-${daysLeft}` court** : pas d'unité ; lisibilité à valider visuellement dans la sandbox.
- **`bookTitle` mis en italique dans le Drawer** : choix typographique cohérent avec la convention serif Literata du projet ; à confirmer dans la sandbox.
- **Pas de tooltip / aria-description** pour les variantes nav : on suppose le libellé suffisant. À ré-évaluer si tests utilisateurs montrent confusion.
