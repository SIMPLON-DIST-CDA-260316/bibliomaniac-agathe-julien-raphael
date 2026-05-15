import { useEffect, useState } from 'react'

import { MOCK_BOOKS_BY_ID } from '../mocks/books.mock'
import type { Book } from '@/features/book'

export interface BookDetailResult {
  data: Book | null
  isLoading: boolean
  error: Error | null
}

interface OpenLibraryWorkResponse {
  key: string
  title: string | null
  description: string | null
  subjects: string[]
  covers: number[]
  first_publish_date: string | null
  author_name: string | null
  author_key: string | null
}

const PROXY_BASE = 'http://localhost:3001/books'
const OL_ID_PATTERN = /^OL\w+W$/

function mapWorkToBook(work: OpenLibraryWorkResponse): Book {
  const coverId = work.covers?.[0]
  return {
    id: work.key,
    title: work.title || 'Sans titre',
    author: work.author_name,
    authorId: work.author_key,
    genre: work.subjects?.[0] ?? null,
    language: null,
    publishedDate: work.first_publish_date,
    coverUrl: coverId
      ? `https://covers.openlibrary.org/b/id/${coverId}-L.jpg`
      : null,
    pageCount: null,
    rating: null,
    copies: null,
    summary: work.description,
    seriesId: null,
    seriesTitle: null,
    tomeNumber: null,
    collectionId: null,
    collectionLabel: null,
  }
}

function resolveSync(id: string | undefined): BookDetailResult | null {
  if (!id) {
    return { data: null, isLoading: false, error: new Error('Missing book id') }
  }
  const mock = MOCK_BOOKS_BY_ID[id]
  if (mock) return { data: mock, isLoading: false, error: null }
  if (OL_ID_PATTERN.test(id)) return null
  return {
    data: null,
    isLoading: false,
    error: new Error(`Book ${id} not found`),
  }
}

interface FetchedEntry {
  id: string
  result: BookDetailResult
}

/**
 * Retrieves a book by id.
 *
 * Resolves mock ids synchronously; fetches Open Library work ids
 * (`OL...W`) via the proxy. Signature preserved across both paths.
 */
export function useBookDetail(id: string | undefined): BookDetailResult {
  const [fetched, setFetched] = useState<FetchedEntry | null>(null)

  useEffect(() => {
    if (!id || !OL_ID_PATTERN.test(id) || MOCK_BOOKS_BY_ID[id]) return

    let cancelled = false

    void fetch(`${PROXY_BASE}/${id}`)
      .then(async (res) => {
        if (!res.ok) throw new Error(`Book ${id} not found`)
        return (await res.json()) as OpenLibraryWorkResponse
      })
      .then((work) => {
        if (cancelled) return
        setFetched({
          id,
          result: {
            data: mapWorkToBook(work),
            isLoading: false,
            error: null,
          },
        })
      })
      .catch((err: Error) => {
        if (cancelled) return
        setFetched({
          id,
          result: { data: null, isLoading: false, error: err },
        })
      })

    return () => {
      cancelled = true
    }
  }, [id])

  const sync = resolveSync(id)
  if (sync) return sync
  if (fetched && fetched.id === id) return fetched.result
  return { data: null, isLoading: true, error: null }
}
