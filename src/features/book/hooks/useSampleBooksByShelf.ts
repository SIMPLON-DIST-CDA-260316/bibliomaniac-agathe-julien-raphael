import { useMemo } from 'react'

import { type Book } from '../types/book'
import { type BookShelf } from '../types/bookShelf'
import { useSampleBooks } from './useSampleBooks'

export function useSampleBooksByShelf(): Record<BookShelf, Book[]> {
  const books = useSampleBooks()

  return useMemo(
    () => ({
      favorites: books,
      borrowed: books,
      toRead: books,
      readingNow: books,
      haveRead: books,
      reviewed: books,
      recentlyViewed: books,
    }),
    [books],
  )
}
