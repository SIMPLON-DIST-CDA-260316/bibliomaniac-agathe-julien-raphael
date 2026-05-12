import type { Book } from '../types/book'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  onBookClick?: (book: Book) => void
}

export function BookGrid({ books, onBookClick }: BookGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
      {books.map((book) => (
        <BookCard
          key={book.id}
          book={book}
          onClick={() => onBookClick?.(book)}
        />
      ))}
    </div>
  )
}
