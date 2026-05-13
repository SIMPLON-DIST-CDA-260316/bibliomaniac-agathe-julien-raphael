import { useMemo } from 'react'
import type { Book } from './book.types'
import type { DiscoveryCategory } from '../lib/categories'
import { MOCK_USER_LIBRARY } from '../mocks/userLibrary.mock'
import { useDiscoveryCategoryBooks } from '../api/useDiscoveryCategoryBooks'

export interface DiscoveryBooksResult {
  data: Record<DiscoveryCategory, Book[]>
  isLoading: boolean
  error: Error | null
}

export function useDiscoveryBooks(): DiscoveryBooksResult {
  const borrowed = useDiscoveryCategoryBooks('borrowed')
  const recommended = useDiscoveryCategoryBooks('recommended_for_you')
  const global = useDiscoveryCategoryBooks('global_recommendations')
  const newReleases = useDiscoveryCategoryBooks('new_releases')

  return useMemo(() => {
    const withFallback = (books: Book[]) =>
      books.length > 0 ? books : MOCK_USER_LIBRARY

    return {
      data: {
        borrowed: withFallback(borrowed.data),
        recommended_for_you: withFallback(recommended.data),
        global_recommendations: withFallback(global.data),
        new_releases: withFallback(newReleases.data),
      },
      isLoading:
        borrowed.isLoading ||
        recommended.isLoading ||
        global.isLoading ||
        newReleases.isLoading,
      error:
        borrowed.error ??
        recommended.error ??
        global.error ??
        newReleases.error,
    }
  }, [borrowed, recommended, global, newReleases])
}
