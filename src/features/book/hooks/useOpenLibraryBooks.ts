import { useEffect, useState } from 'react'
import type { Book } from '@/features/book'

interface OpenLibraryBook {
  title: string
  author_name?: string[]
  first_publish_year?: number
  key: string
  cover_i?: number
}

interface OpenLibraryResponse {
  docs: OpenLibraryBook[]
}

interface CachedBooksData {
  data: Book[]
  timestamp: number
}

const CATEGORIES = {
  borrowed: { query: 'science fiction', limit: 50 },
  recommended_for_you: { query: 'fantasy', limit: 50 },
  global_recommendations: { query: 'bestsellers', limit: 50 },
  new_releases: { query: 'recently published', limit: 50 },
}

function mapOpenLibraryToBook(book: OpenLibraryBook): Book | null {
  // ✅ Filtrer les livres sans couverture
  if (!book.cover_i) {
    return null
  }

  const coverUrl = `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`

  return {
    id: book.key,
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

const CACHE_DURATION = 1000 * 60 * 60 // 1 heure

function getCachedBooks(category: string): Book[] | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(`books_${category}`)
    if (!cached) return null

    const parsed: unknown = JSON.parse(cached)

    // ✅ Type guard pour vérifier la structure
    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'data' in parsed &&
      'timestamp' in parsed
    ) {
      const { data, timestamp } = parsed as CachedBooksData

      if (Date.now() - timestamp > CACHE_DURATION) {
        localStorage.removeItem(`books_${category}`)
        return null
      }

      return Array.isArray(data) ? data : null
    }

    return null
  } catch {
    return null
  }
}

function setCachedBooks(category: string, books: Book[]): void {
  if (typeof window === 'undefined') return

  try {
    const data: CachedBooksData = {
      data: books,
      timestamp: Date.now(),
    }
    localStorage.setItem(`books_${category}`, JSON.stringify(data))
  } catch {
    // Silently ignore localStorage errors
  }
}

export function useOpenLibraryBooks(category: keyof typeof CATEGORIES): Book[] {
  const [books, setBooks] = useState<Book[]>(
    () => getCachedBooks(category) ?? [],
  )

  useEffect(() => {
    if (getCachedBooks(category)) return

    const fetchBooks = async () => {
      try {
        const { query, limit } = CATEGORIES[category]

        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
        })

        const response = await fetch(`http://localhost:3001/books?${params}`)

        if (!response.ok) {
          console.error(`API Error: ${response.statusText}`)
          return
        }

        const data = (await response.json()) as OpenLibraryResponse

        const mappedBooks = (data.docs || [])
          .map(mapOpenLibraryToBook)
          .filter((book): book is Book => book !== null)
          .slice(0, 20)

        setCachedBooks(category, mappedBooks)
        setBooks(mappedBooks)

        console.log(
          `✅ Loaded ${mappedBooks.length} books for ${category} (requested ${limit})`,
        )
      } catch (err) {
        console.error('Error fetching books:', err)
      }
    }

    void fetchBooks()
  }, [category])

  return books
}
