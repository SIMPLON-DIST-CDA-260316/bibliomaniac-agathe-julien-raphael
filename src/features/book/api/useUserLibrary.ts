import type { Book } from '../model/book.types'
import { MOCK_USER_LIBRARY } from '../mocks/userLibrary.mock'

export interface UserLibraryResult {
  data: Book[]
  isLoading: boolean
  error: Error | null
}

/**
 * Retrieves the current user's library books. Currently backed by an
 * in-memory mock; the result shape mirrors a real data-fetching hook so
 * callers won't need to change when wired to the API.
 */
export function useUserLibrary(): UserLibraryResult {
  return {
    data: MOCK_USER_LIBRARY,
    isLoading: false,
    error: null,
  }
}
