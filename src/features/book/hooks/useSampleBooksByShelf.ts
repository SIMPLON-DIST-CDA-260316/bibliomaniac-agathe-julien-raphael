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
      to_read: books,
      reading_now: books,
      have_read: books,
      reviewed: books,
      recently_viewed: books,
    }),
    [books],
  )
}
