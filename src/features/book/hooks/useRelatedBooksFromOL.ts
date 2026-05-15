import { useEffect, useState } from 'react'

import type { Book } from '../model/book.types'
import type { RelatedSection } from '../model/relatedBooks.types'

interface OpenLibraryDoc {
  key: string
  title: string
  author_name?: string[]
  author_key?: string[]
  cover_i?: number
  first_publish_year?: number
  subject?: string[]
  language?: string[]
  number_of_pages_median?: number
  ratings_average?: number
}

interface SearchResponse {
  docs: OpenLibraryDoc[]
}

const PROXY_BASE = 'http://localhost:3001/books'
const SECTION_LIMIT = 20
const FETCH_LIMIT = 40

function mapDocToBook(doc: OpenLibraryDoc): Book | null {
  if (!doc.cover_i) return null
  return {
    id: doc.key,
    title: doc.title || 'Sans titre',
    author: doc.author_name?.[0] ?? null,
    authorId: doc.author_key?.[0] ?? null,
    genre: doc.subject?.[0] ?? null,
    language: doc.language?.[0] ?? null,
    publishedDate: doc.first_publish_year?.toString() ?? null,
    coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
    pageCount: doc.number_of_pages_median ?? null,
    rating: doc.ratings_average ?? null,
    copies: null,
    summary: null,
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  }
}

async function fetchOLSection(query: string): Promise<Book[]> {
  const params = new URLSearchParams({
    q: query,
    limit: FETCH_LIMIT.toString(),
  })
  const res = await fetch(`${PROXY_BASE}?${params.toString()}`)
  if (!res.ok) return []
  const data = (await res.json()) as SearchResponse
  return (data.docs || [])
    .map(mapDocToBook)
    .filter((b): b is Book => b !== null)
}

function buildGenreQuery(genre: string): string | null {
  const tokens = genre
    .split(/[-/,|]+/)
    .map((t) => t.trim())
    .filter(Boolean)
  if (tokens.length === 0) return null
  return tokens.map((t) => `subject:"${t}"`).join(' OR ')
}

export interface RelatedBooksFromOLResult {
  sections: RelatedSection[]
  isLoading: boolean
}

interface FetchedState {
  sections: RelatedSection[]
  bookId: string | null
}

export function useRelatedBooksFromOL(
  currentBook: Book,
): RelatedBooksFromOLResult {
  const [data, setData] = useState<FetchedState>({
    sections: [],
    bookId: null,
  })

  useEffect(() => {
    let cancelled = false

    const authorQuery = currentBook.author
      ? `author:"${currentBook.author}"`
      : null
    const genreQuery = currentBook.genre
      ? buildGenreQuery(currentBook.genre)
      : null

    void Promise.all([
      authorQuery ? fetchOLSection(authorQuery) : Promise.resolve([]),
      genreQuery ? fetchOLSection(genreQuery) : Promise.resolve([]),
    ]).then(([authorBooks, genreBooks]) => {
      if (cancelled) return

      const next: RelatedSection[] = []

      const authorFiltered = authorBooks
        .filter((b) => b.id !== currentBook.id)
        .slice(0, SECTION_LIMIT)
      if (authorFiltered.length > 0) {
        next.push({
          kind: 'author',
          title: 'Du même auteur',
          books: authorFiltered,
          cardProps: { showAuthor: false },
        })
      }

      const authorIds = new Set(authorFiltered.map((b) => b.id))
      const genreFiltered = genreBooks
        .filter((b) => b.id !== currentBook.id && !authorIds.has(b.id))
        .slice(0, SECTION_LIMIT)
      if (genreFiltered.length > 0) {
        next.push({
          kind: 'genre',
          title: 'Dans le même genre',
          books: genreFiltered,
          cardProps: { showAuthor: true },
        })
      }

      setData({ sections: next, bookId: currentBook.id })
    })

    return () => {
      cancelled = true
    }
  }, [currentBook.id, currentBook.author, currentBook.genre])

  const isLoading = data.bookId !== currentBook.id
  const sections = isLoading ? [] : data.sections

  return { sections, isLoading }
}
