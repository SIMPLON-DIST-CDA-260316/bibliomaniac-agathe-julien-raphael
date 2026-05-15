import type { Book } from './book.types'

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
