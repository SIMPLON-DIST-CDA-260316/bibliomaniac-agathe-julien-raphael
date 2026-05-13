import type { Book } from '../../model/book.types'

export interface OpenLibraryDoc {
  title: string
  author_name?: string[]
  first_publish_year?: number
  key: string
  cover_i?: number
  isbn?: string[]
}

export interface OpenLibraryResponse {
  docs: OpenLibraryDoc[]
}

export function mapOpenLibraryToBook(doc: OpenLibraryDoc): Book | null {
  if (!doc.cover_i) return null

  return {
    id: doc.key,
    title: doc.title || 'Sans titre',
    author: doc.author_name?.[0] || null,
    authorId: null,
    genre: null,
    language: null,
    publishedDate: doc.first_publish_year?.toString() || null,
    coverUrl: `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`,
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
