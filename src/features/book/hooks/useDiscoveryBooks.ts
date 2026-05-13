import { useMemo } from 'react'
import type { Book } from '../model/book.types'
import type { DiscoveryCategory } from '../lib/categories'
import { useSampleBooks } from './useSampleBooks'

export function useDiscoveryBooks(): Record<DiscoveryCategory, Book[]> {
  const books = useSampleBooks()

  return useMemo(
    () => ({
      borrowed: books,
      recommended_for_you: books,
      global_recommendations: books,
      new_releases: books,
    }),
    [books],
  )
}
