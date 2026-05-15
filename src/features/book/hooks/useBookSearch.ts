import { useMemo } from 'react'
import type { Book } from '@/features/book/model/book.types.ts'

export function useBookSearch(books: Book[], query: string): Book[] {
  return useMemo(() => {
    const cleanQuery = query.trim().toLowerCase()
    if (!cleanQuery) return []
    return books.filter((book) => book.title.toLowerCase().includes(cleanQuery))
  }, [books, query])
}
