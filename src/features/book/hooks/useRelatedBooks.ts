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

function sectionTitle(kind: RelatedSectionKind, currentBook: RichBook): string {
  switch (kind) {
    case 'series':
      return currentBook.seriesTitle
        ? `Dans la série ${currentBook.seriesTitle}`
        : 'Dans la même série'
    case 'author':
      return 'Du même auteur'
    case 'collection':
      return 'Dans la même collection'
    case 'genre':
      return 'Dans le même genre'
  }
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
  richTitle: string,
  author: string,
): string {
  if (kind === 'author') {
    return richTitle
  }
  return author ? `${richTitle} par ${author}` : richTitle
}

function toMinimal(rich: RichBook, kind: RelatedSectionKind): MinimalBook {
  const author = rich.author ?? ''
  const coverImage = rich.coverUrl ?? ''
  const displayTitle =
    kind === 'series' && rich.tomeNumber != null
      ? `Tome ${rich.tomeNumber}`
      : rich.title
  return {
    id: rich.id,
    title: displayTitle,
    author,
    coverImage,
    ariaLabel: buildAriaLabel(kind, rich.title, author),
  }
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
        title: sectionTitle(kind, currentBook),
        books: capped.map((b) => toMinimal(b, kind)),
        cardProps: { showAuthor: SECTION_SHOW_AUTHOR[kind] },
      })
    }

    return sections
  }, [currentBook])
}
