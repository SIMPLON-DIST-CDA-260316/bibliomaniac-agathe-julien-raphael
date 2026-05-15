import type { Book } from '../model/book.types'
import type {
  RelatedSectionCardProps,
  RelatedSectionKind,
} from '../model/relatedBooks.types'

export interface SectionDescriptor {
  kind: RelatedSectionKind
  title: string
  cardProps: RelatedSectionCardProps
  buildQuery: (book: Book) => string | null
}

export const RELATED_SECTION_CAP = 20

function buildGenreSolrQuery(genre: string): string | null {
  const tokens = genre
    .split(/[-/,|]+/)
    .map((t) => t.trim())
    .filter(Boolean)
  if (tokens.length === 0) return null
  return tokens.map((t) => `subject:"${t}"`).join(' OR ')
}

export const RELATED_SECTIONS: SectionDescriptor[] = [
  {
    kind: 'author',
    title: 'Du même auteur',
    cardProps: { showAuthor: false },
    buildQuery: (book) => (book.author ? `author:"${book.author}"` : null),
  },
  {
    kind: 'genre',
    title: 'Dans le même genre',
    cardProps: { showAuthor: true },
    buildQuery: (book) => (book.genre ? buildGenreSolrQuery(book.genre) : null),
  },
]
