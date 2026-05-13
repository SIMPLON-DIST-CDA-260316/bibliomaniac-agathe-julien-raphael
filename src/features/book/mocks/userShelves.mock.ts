import type { Book } from '../model/book.types'
import type { BookShelf } from '../model/bookShelf.types'
import { MOCK_USER_LIBRARY } from './userLibrary.mock'

export const MOCK_USER_SHELVES: Record<BookShelf, Book[]> = {
  favorites: MOCK_USER_LIBRARY,
  borrowed: MOCK_USER_LIBRARY,
  toRead: MOCK_USER_LIBRARY,
  readingNow: MOCK_USER_LIBRARY,
  haveRead: MOCK_USER_LIBRARY,
  reviewed: MOCK_USER_LIBRARY,
  recentlyViewed: MOCK_USER_LIBRARY,
}
