import { useMemo } from 'react'

import type { Book as RichBook } from '../model/book.types'
import type { Book as MinimalBook } from '../types/book'
import { MOCK_BOOKS_BY_ID } from '../mocks/books.mock'

export type RelatedSectionKind = 'series' | 'author' | 'collection' | 'genre'

export interface RelatedSection {
  kind: RelatedSectionKind
  title: string
  books: MinimalBook[]
  cardProps: { showAuthor: boolean }
}

const SECTION_TITLES: Record<RelatedSectionKind, string> = {
  series: 'Dans la même série',
  author: 'Du même auteur',
  collection: 'Dans la même collection',
  genre: 'Dans le même genre',
}

const SECTION_SHOW_AUTHOR: Record<RelatedSectionKind, boolean> = {
  series: true,
  author: false,
  collection: true,
  genre: true,
}

const SECTION_ORDER: RelatedSectionKind[] = [
  'series',
  'author',
  'collection',
  'genre',
]

const SECTION_CAP = 20

function buildAriaLabel(
  kind: RelatedSectionKind,
  title: string,
  author: string,
  tomeNumber: number | null,
): string {
  if (kind === 'series' && tomeNumber != null) {
    return `${title}, tome ${tomeNumber}, par ${author}`
  }
  if (kind === 'author') {
    return title
  }
  return `${title} par ${author}`
}

function toMinimal(rich: RichBook, kind: RelatedSectionKind): MinimalBook {
  const author = rich.author ?? ''
  const coverImage = rich.coverUrl ?? ''
  const minimal: MinimalBook = {
    id: rich.id,
    title: rich.title,
    author,
    coverImage,
  }
  if (kind === 'series' && rich.tomeNumber != null) {
    minimal.tomeNumber = rich.tomeNumber
  }
  minimal.ariaLabel = buildAriaLabel(kind, rich.title, author, rich.tomeNumber)
  return minimal
}

function matches(
  candidate: RichBook,
  current: RichBook,
  kind: RelatedSectionKind,
): boolean {
  switch (kind) {
    case 'series':
      return current.seriesId != null && candidate.seriesId === current.seriesId
    case 'author':
      return current.authorId != null && candidate.authorId === current.authorId
    case 'collection':
      return (
        current.collectionId != null &&
        candidate.collectionId === current.collectionId
      )
    case 'genre':
      return current.genre != null && candidate.genre === current.genre
  }
}

export function useRelatedBooks(currentBook: RichBook): RelatedSection[] {
  return useMemo(() => {
    const allBooks = Object.values(MOCK_BOOKS_BY_ID)
    const sections: RelatedSection[] = []

    for (const kind of SECTION_ORDER) {
      const matched = allBooks.filter(
        (b) => b.id !== currentBook.id && matches(b, currentBook, kind),
      )
      if (matched.length === 0) continue
      const capped = matched.slice(0, SECTION_CAP)
      sections.push({
        kind,
        title: SECTION_TITLES[kind],
        books: capped.map((b) => toMinimal(b, kind)),
        cardProps: { showAuthor: SECTION_SHOW_AUTHOR[kind] },
      })
    }

    return sections
  }, [currentBook])
}
