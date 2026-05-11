import type { Book } from '../model/book.types'

const MOCK_BOOK: Book = {
  id: '1',
  title: '20th Century Boys - Tome 1',
  author: 'Naoki Urasawa',
  authorId: 'naoki-urasawa',
  genre: 'Manga - Shonen',
  publishedDate: '2002',
  coverUrl: '/images/20th-century-boys-vol1.png',
  pageCount: 418,
  rating: 4.7,
  copies: 2,
  stats: [
    { label: 'Exemplaires', value: 2 },
    { label: 'Pages', value: 418 },
    { label: 'Note', value: 4.7 },
  ],
  summary:
    "Kenji est un commerçant tranquille qui a repris et transformé le magasin familial. Son seul problème est Kana, la fille de sa sœur, que cette dernière lui a confiée avant de partir. Mais voilà qu'un jour, la police vient l'interroger sur un de ses anciens camarades de classe porté disparu...",
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function useBookDetail(_id: string): Book {
  return MOCK_BOOK
}
