import { useEffect, useState } from 'react'
import type { Book } from '../model/book.types'
import type { DiscoveryCategory } from '../lib/categories'
import { BOOK_API_BASE } from './client'
import {
  mapOpenLibraryToBook,
  type OpenLibraryResponse,
} from './mappers/openLibrary'
import { getCachedBooks, setCachedBooks } from '../lib/discoveryCache'

const CATEGORY_QUERIES: Record<
  DiscoveryCategory,
  { query: string; limit: number }
> = {
  borrowed: { query: 'science fiction', limit: 50 },
  recommended_for_you: { query: 'fantasy', limit: 50 },
  global_recommendations: { query: 'bestsellers', limit: 50 },
  new_releases: { query: 'recently published', limit: 50 },
}

export interface DiscoveryCategoryBooksResult {
  data: Book[]
  isLoading: boolean
  error: Error | null
}

export function useDiscoveryCategoryBooks(
  category: DiscoveryCategory,
): DiscoveryCategoryBooksResult {
  const cached = getCachedBooks(category)
  const [data, setData] = useState<Book[]>(() => cached ?? [])
  const [isLoading, setIsLoading] = useState<boolean>(() => cached === null)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    if (getCachedBooks(category)) {
      setIsLoading(false)
      return
    }

    let cancelled = false

    const fetchBooks = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const { query, limit } = CATEGORY_QUERIES[category]

        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
        })

        const response = await fetch(`${BOOK_API_BASE}?${params}`)

        if (!response.ok) {
          throw new Error(`API Error: ${response.statusText}`)
        }

        const payload = (await response.json()) as OpenLibraryResponse

        const mappedBooks = (payload.docs || [])
          .map(mapOpenLibraryToBook)
          .filter((book): book is Book => book !== null)
          .slice(0, 20)

        if (cancelled) return

        setCachedBooks(category, mappedBooks)
        setData(mappedBooks)
      } catch (err) {
        if (cancelled) return
        const wrapped =
          err instanceof Error ? err : new Error('Error fetching books')
        console.error('Error fetching books:', wrapped)
        setError(wrapped)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    void fetchBooks()

    return () => {
      cancelled = true
    }
  }, [category])

  return { data, isLoading, error }
}
