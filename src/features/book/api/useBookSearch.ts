import { useCallback, useState } from 'react'
import type { Book } from '../model/book.types'
import { BOOK_API_BASE } from './client'
import {
  mapOpenLibraryToBook,
  type OpenLibraryResponse,
} from './mappers/openLibrary'

export function useBookSearch() {
  const [data, setData] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, limit: number = 50) => {
    if (!query.trim()) {
      setData([])
      setError(null)
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const params = new URLSearchParams({
        q: query,
        limit: (limit * 2).toString(),
      })

      const response = await fetch(`${BOOK_API_BASE}?${params}`)

      if (!response.ok) {
        setError(`Erreur lors de la recherche: ${response.statusText}`)
        setData([])
        return
      }

      const payload = (await response.json()) as OpenLibraryResponse

      const mappedBooks = (payload.docs || [])
        .map(mapOpenLibraryToBook)
        .filter((book): book is Book => book !== null)
        .slice(0, limit)

      setData(mappedBooks)

      if (mappedBooks.length === 0) {
        setError('Aucun livre trouvé pour cette recherche.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la recherche',
      )
      setData([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setData([])
    setError(null)
    setIsLoading(false)
  }, [])

  return { data, isLoading, error, search, reset }
}
