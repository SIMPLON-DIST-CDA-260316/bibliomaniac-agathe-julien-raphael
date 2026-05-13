import { useMemo } from 'react'
import type { Book } from '../types/book'
import type { DiscoveryCategory } from '../lib/categories'
import { useSampleBooks } from './useSampleBooks'
import { useOpenLibraryBooks } from './useOpenLibraryBooks'

export function useDiscoveryBooks(): Record<DiscoveryCategory, Book[]> {
  const sampleBooks = useSampleBooks()
  const borrowedBooks = useOpenLibraryBooks('borrowed')
  const recommendedBooks = useOpenLibraryBooks('recommended_for_you')
  const globalBooks = useOpenLibraryBooks('global_recommendations')
  const newReleasesBooks = useOpenLibraryBooks('new_releases')

  return useMemo(
    () => ({
      borrowed: borrowedBooks.length > 0 ? borrowedBooks : sampleBooks,
      recommended_for_you:
        recommendedBooks.length > 0 ? recommendedBooks : sampleBooks,
      global_recommendations:
        globalBooks.length > 0 ? globalBooks : sampleBooks,
      new_releases:
        newReleasesBooks.length > 0 ? newReleasesBooks : sampleBooks,
    }),
    [
      borrowedBooks,
      recommendedBooks,
      globalBooks,
      newReleasesBooks,
      sampleBooks,
    ],
  )
}
