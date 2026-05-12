import { Link } from 'react-router'

import { BookCarousel } from '@/features/book/ui/BookCarousel.tsx'
import type { Book } from '../types/book.ts'

interface BookSectionProps {
  title: string
  link: string
  books: Book[]
}

export function BookSection({ title, link, books }: BookSectionProps) {
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <h2 className="text-primary text-lg font-bold md:text-xl xl:text-2xl 2xl:text-3xl">
          {title}
        </h2>
        <Link
          to={link}
          className="text-accent text-sm font-medium hover:underline md:text-base xl:text-lg 2xl:text-xl"
        >
          Voir tout
        </Link>
      </div>
      <BookCarousel books={books} className="w-full" />
    </div>
  )
}
