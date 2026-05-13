// ── Types
export type { Book } from './model/book.types'
export type { BookShelf, BookShelfSlug } from './model/bookShelf.types'
export type { BookCTAState, BookCTAKind } from './model/bookCta.types'
export type { DiscoveryCategory } from './lib/categories'

// ── UI composites (high-level only)
export { BookDetail } from './ui/BookDetail'
export { BookRelatedSections } from './ui/BookRelatedSections'
export { BookGrid } from './ui/BookGrid'
export { BookSection } from './ui/BookSection'
export { SearchBar } from './ui/SearchBar'
export { BookCTA } from './ui/BookCTA'

// ── Hooks (data-fetching + business)
export { useBookDetail } from './api/useBookDetail'
export { useBookSearch } from './api/useBookSearch'
export { useUserLibrary } from './api/useUserLibrary'
export { useUserShelves } from './api/useUserShelves'
export { useDiscoveryBooks } from './model/useDiscoveryBooks'

// ── Pure utilities consumed by pages
export { filterBooksByQuery } from './lib/filterBooksByQuery'
export {
  DISCOVERY_LABELS,
  DISCOVERY_ORDER,
  discoveryToSlug,
  slugToDiscovery,
} from './lib/categories'
export {
  SHELF_LABELS,
  SHELF_ORDER,
  shelfToSlug,
  slugToShelf,
} from './lib/shelf'
