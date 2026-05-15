import { useMemo } from 'react'

import { type Book } from '../model/book.types'
import { type BookShelf } from '../types/bookShelf'
import { useOpenLibraryBooks } from './useOpenLibraryBooks'

export function useSampleBooksByShelf(): Record<BookShelf, Book[]> {
  const borrowedBooks = useOpenLibraryBooks('borrowed')
  const favoritesBooks = useOpenLibraryBooks('favorites')
  const readingNowBooks = useOpenLibraryBooks('reading_now')
  const haveReadBooks = useOpenLibraryBooks('have_read')
  const reviewedBooks = useOpenLibraryBooks('reviewed')
  const recentlyViewedBook = useOpenLibraryBooks('recently_viewed')
  const toReadBooks = useOpenLibraryBooks('to_read')

  return useMemo(
    () => ({
      favorites: favoritesBooks,
      borrowed: borrowedBooks,
      toRead: toReadBooks,
      readingNow: readingNowBooks,
      haveRead: haveReadBooks,
      reviewed: reviewedBooks,
      recentlyViewed: recentlyViewedBook,
    }),
    [
      favoritesBooks,
      borrowedBooks,
      toReadBooks,
      readingNowBooks,
      haveReadBooks,
      reviewedBooks,
      recentlyViewedBook,
    ],
  )
}
