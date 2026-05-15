import type { Book } from '../model/book.types'
import type {
  RelatedSectionCardProps,
  RelatedSectionKind,
} from '../model/relatedBooks.types'

interface SectionDescriptor {
  kind: RelatedSectionKind
  cardProps: RelatedSectionCardProps
  getTitle: (current: Book) => string
  matches: (candidate: Book, current: Book) => boolean
}

export const RELATED_SECTION_CAP = 20

export const RELATED_SECTIONS: SectionDescriptor[] = [
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
