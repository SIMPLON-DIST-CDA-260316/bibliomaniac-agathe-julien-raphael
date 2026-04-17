export interface BookStat {
  label: string
  value: number | null
}

export interface Book {
  id: string
  title: string
  author: string
  authorId: string
  genre: string | null
  publishedDate: string | null
  coverUrl: string | null
  pageCount: number | null
  rating: number | null
  copies: number | null
  summary: string | null
  stats: BookStat[]
}
