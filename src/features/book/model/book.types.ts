export interface Book {
  id: string
  title: string
  author: string | null
  authorId: string | null
  genre: string | null
  language: string | null
  publishedDate: string | null
  coverUrl: string | null
  pageCount: number | null
  rating: number | null
  copies: number | null
  summary: string | null
  seriesId: string | null
  seriesTitle: string | null
  tomeNumber: number | null
  collectionId: string | null
  collectionLabel: string | null
}
