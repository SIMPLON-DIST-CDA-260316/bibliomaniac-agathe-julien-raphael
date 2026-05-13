import type { Book } from '../model/book.types'

export function filterBooksByQuery(books: Book[], query: string): Book[] {
  const cleanQuery = query.trim().toLowerCase()
  if (!cleanQuery) return []
  return books.filter((book) => book.title.toLowerCase().includes(cleanQuery))
}
