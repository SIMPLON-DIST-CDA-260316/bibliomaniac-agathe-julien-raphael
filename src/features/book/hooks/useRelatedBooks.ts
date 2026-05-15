import { useEffect, useState } from 'react'

import {
  RELATED_SECTION_CAP,
  RELATED_SECTIONS,
} from '../config/relatedSections'
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
const FETCH_LIMIT = 40

function mapDocToBook(doc: OpenLibraryDoc): Book | null {
  if (!doc.cover_i) return null
  return {
    id: doc.key.replace('/works/', ''),
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

export interface RelatedBooksResult {
  sections: RelatedSection[]
  isLoading: boolean
}

interface FetchedState {
  sections: RelatedSection[]
  bookId: string | null
}

export function useRelatedBooks(currentBook: Book): RelatedBooksResult {
  const [data, setData] = useState<FetchedState>({
    sections: [],
    bookId: null,
  })

  useEffect(() => {
    let cancelled = false

    const queries = RELATED_SECTIONS.map((s) => s.buildQuery(currentBook))

    void Promise.all(
      queries.map((q) => (q ? fetchOLSection(q) : Promise.resolve([]))),
    ).then((results) => {
      if (cancelled) return

      const seen = new Set<string>([currentBook.id])
      const next: RelatedSection[] = []

      RELATED_SECTIONS.forEach((descriptor, i) => {
        const books = results[i]
          .filter((b) => !seen.has(b.id))
          .slice(0, RELATED_SECTION_CAP)
        if (books.length === 0) return
        books.forEach((b) => seen.add(b.id))
        next.push({
          kind: descriptor.kind,
          title: descriptor.title,
          books,
          cardProps: descriptor.cardProps,
        })
      })

      setData({ sections: next, bookId: currentBook.id })
    })

    return () => {
      cancelled = true
    }
  }, [currentBook])

  const isLoading = data.bookId !== currentBook.id
  const sections = isLoading ? [] : data.sections

  return { sections, isLoading }
}
