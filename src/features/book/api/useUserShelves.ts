import type { Book } from '../model/book.types'
import type { BookShelf } from '../model/bookShelf.types'
import { MOCK_USER_SHELVES } from '../mocks/userShelves.mock'

export interface UserShelvesResult {
  data: Record<BookShelf, Book[]>
  isLoading: boolean
  error: Error | null
}

/**
 * Retrieves the current user's books grouped by shelf. Currently backed
 * by an in-memory mock; the result shape mirrors a real data-fetching
 * hook so callers won't need to change when wired to the API.
 */
export function useUserShelves(): UserShelvesResult {
  return {
    data: MOCK_USER_SHELVES,
    isLoading: false,
    error: null,
  }
}
