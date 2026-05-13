import type { Book } from '../model/book.types'
import { MOCK_BOOKS_BY_ID } from '../mocks/books.mock'

export interface BookDetailResult {
  data: Book | null
  isLoading: boolean
  error: Error | null
}

/**
 * Retrieves a book by id. Currently backed by an in-memory mock; the result
 * shape mirrors a real data-fetching hook so callers won't need to change
 * when wired to the API.
 */
export function useBookDetail(id: string | undefined): BookDetailResult {
  if (!id) {
    return {
      data: null,
      isLoading: false,
      error: new Error('Missing book id'),
    }
  }
  const data = MOCK_BOOKS_BY_ID[id] ?? null
  return {
    data,
    isLoading: false,
    error: data ? null : new Error(`Book ${id} not found`),
  }
}
