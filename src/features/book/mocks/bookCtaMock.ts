import type { Book } from '../model/book.types'
import type { BookCTAState } from '../model/bookCta.types'

/**
 * Per-book mock overrides for the CTA state on the detail page.
 *
 * Showcases every variant of `BookCTAState` while real backend wiring
 * (#33) is still pending. Ids absent from the map fall back to
 * `{ kind: 'available' }`.
 */
const MOCK_CTA_BY_ID: Record<string, BookCTAState> = {
  '1': { kind: 'reserved' },
  '3': { kind: 'borrowed', daysLeft: 5 },
  '4': { kind: 'unavailable' },
  '6': { kind: 'borrowed', daysLeft: 2 },
  '9': { kind: 'ready' },
  '11': { kind: 'overdue' },
}

export function resolveBookCtaState(book: Book): BookCTAState {
  if (book.copies === 0) return { kind: 'unavailable' }
  return MOCK_CTA_BY_ID[book.id] ?? { kind: 'available' }
}
