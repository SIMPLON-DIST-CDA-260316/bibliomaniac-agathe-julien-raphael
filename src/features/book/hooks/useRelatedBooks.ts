import { useMemo } from 'react'

import {
  RELATED_SECTIONS,
  RELATED_SECTION_CAP,
} from '../config/relatedSections'
import type { Book } from '../model/book.types'
import type { RelatedSection } from '../model/relatedBooks.types'
import { MOCK_BOOKS_BY_ID } from '../mocks/books.mock'

export function useRelatedBooks(currentBook: Book): RelatedSection[] {
  return useMemo(() => {
    const allBooks = Object.values(MOCK_BOOKS_BY_ID)
    return RELATED_SECTIONS.flatMap((section) => {
      const matched = allBooks.filter(
        (b) => b.id !== currentBook.id && section.matches(b, currentBook),
      )
      if (matched.length === 0) return []
      return [
        {
          kind: section.kind,
          title: section.getTitle(currentBook),
          books: matched.slice(0, RELATED_SECTION_CAP),
          cardProps: section.cardProps,
        },
      ]
    })
  }, [currentBook])
}
