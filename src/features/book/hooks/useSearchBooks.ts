import { useCallback, useState } from 'react'
import type { Book } from '@/features/book'
import { API_BASE } from '@/shared/lib/api.ts'

interface OpenLibraryBook {
  title: string
  author_name?: string[]
  first_publish_year?: number
  key: string
  cover_i?: number
  isbn?: string[]
}

interface SearchResponse {
  docs: OpenLibraryBook[]
}

function mapOpenLibraryToBook(book: OpenLibraryBook): Book | null {
  // Filtrer les livres sans couverture
  if (!book.cover_i) {
    return null
  }

  const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`

  return {
    id: book.key.replace('/works/', ''),
    title: book.title || 'Sans titre',
    author: book.author_name?.[0] || null,
    authorId: null,
    genre: null,
    language: null,
    publishedDate: book.first_publish_year?.toString() || null,
    coverUrl,
    pageCount: null,
    rating: null,
    copies: null,
    summary: null,
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  }
}

export function useSearchBooks() {
  const [books, setBooks] = useState<Book[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const search = useCallback(async (query: string, limit: number = 50) => {
    if (!query.trim()) {
      setBooks([])
      setError(null)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Construire la requête pour Open Library
      // Supporte recherche par titre, auteur ou ISBN
      const params = new URLSearchParams({
        q: query,
        limit: (limit * 2).toString(), // Demander 2x pour compenser le filtrage
      })

      const response = await fetch(`${API_BASE}/api/books?${params}`)

      if (!response.ok) {
        setError(`Erreur lors de la recherche: ${response.statusText}`)
        setBooks([])
        return
      }

      const data = (await response.json()) as SearchResponse

      // Mapper et filtrer les livres avec couverture
      const mappedBooks = (data.docs || [])
        .map(mapOpenLibraryToBook)
        .filter((book): book is Book => book !== null)
        .slice(0, limit)

      setBooks(mappedBooks)

      if (mappedBooks.length === 0) {
        setError('Aucun livre trouvé pour cette recherche.')
      }
    } catch (err) {
      console.error('Search error:', err)
      setError(
        err instanceof Error ? err.message : 'Erreur lors de la recherche',
      )
      setBooks([])
    } finally {
      setLoading(false)
    }
  }, [])

  const reset = useCallback(() => {
    setBooks([])
    setError(null)
    setLoading(false)
  }, [])

  return { books, loading, error, search, reset }
}
