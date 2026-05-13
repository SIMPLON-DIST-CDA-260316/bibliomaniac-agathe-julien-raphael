import { useMemo } from 'react'

import type { Book } from '../model/book.types'
import { MOCK_BOOKS_BY_ID } from '../mocks/books.mock'

export type RelatedSectionKind = 'series' | 'author' | 'collection' | 'genre'

export interface RelatedSectionCardProps {
  showAuthor: boolean
  compactTitle?: boolean
}

export interface RelatedSection {
  kind: RelatedSectionKind
  title: string
  books: Book[]
  cardProps: RelatedSectionCardProps
}

interface SectionDescriptor {
  kind: RelatedSectionKind
  cardProps: RelatedSectionCardProps
  getTitle: (current: Book) => string
  matches: (candidate: Book, current: Book) => boolean
}

const SECTION_CAP = 20

const SECTIONS: SectionDescriptor[] = [
  {
    kind: 'series',
    cardProps: { showAuthor: true, compactTitle: true },
    getTitle: (current) =>
      current.seriesTitle
        ? `Dans la série ${current.seriesTitle}`
        : 'Dans la même série',
    matches: (candidate, current) =>
      current.seriesId != null && candidate.seriesId === current.seriesId,
  },
  {
    kind: 'author',
    cardProps: { showAuthor: false },
    getTitle: () => 'Du même auteur',
    matches: (candidate, current) =>
      current.authorId != null && candidate.authorId === current.authorId,
  },
  {
    kind: 'collection',
    cardProps: { showAuthor: true },
    getTitle: () => 'Dans la même collection',
    matches: (candidate, current) =>
      current.collectionId != null &&
      candidate.collectionId === current.collectionId,
  },
  {
    kind: 'genre',
    cardProps: { showAuthor: true },
    getTitle: () => 'Dans le même genre',
    matches: (candidate, current) =>
      current.genre != null && candidate.genre === current.genre,
  },
]

export function useRelatedBooks(currentBook: Book): RelatedSection[] {
  return useMemo(() => {
    const allBooks = Object.values(MOCK_BOOKS_BY_ID)
    return SECTIONS.flatMap((section) => {
      const matched = allBooks.filter(
        (b) => b.id !== currentBook.id && section.matches(b, currentBook),
      )
      if (matched.length === 0) return []
      return [
        {
          kind: section.kind,
          title: section.getTitle(currentBook),
          books: matched.slice(0, SECTION_CAP),
          cardProps: section.cardProps,
        },
      ]
    })
  }, [currentBook])
}
