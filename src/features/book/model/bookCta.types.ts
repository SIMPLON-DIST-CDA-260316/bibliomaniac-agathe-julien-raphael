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
