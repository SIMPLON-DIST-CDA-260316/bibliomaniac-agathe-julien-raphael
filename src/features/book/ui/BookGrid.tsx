import type { Book } from '../types/book'
import { BookCard } from './BookCard'

interface BookGridProps {
  books: Book[]
  onBookClick?: (book: Book) => void
}

export function BookGrid({ books, onBookClick }: BookGridProps) {
  return (
    <div className="mx-auto grid max-w-full grid-cols-3 gap-3 sm:grid-cols-4 md:max-w-[90vw] lg:max-w-[95vw] lg:grid-cols-6">
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
