import { Link } from 'react-router'
import { BookCarousel } from '@/features/book/ui/BookCarousel.tsx'
import type { Book } from '../types/book.ts'
import shelfImage from '@/assets/wooden-img.png'
import { cn } from '@/shared/lib/utils.ts'

interface BookSectionProps {
  title: string
  link: string
  books: Book[]
  withWoodenShelf?: boolean
}

export function BookSection({
  title,
  link,
  books,
  withWoodenShelf = false,
}: BookSectionProps) {
  return (
    <div
      className={cn(
        'w-full overflow-hidden',
        withWoodenShelf && 'relative z-1 pb-5',
      )}
      style={
        withWoodenShelf
          ? {
              backgroundImage: `url(${shelfImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }
          : {}
      }
    >
      <div
        className={cn(
          'mb-2 flex items-center justify-between',
          withWoodenShelf && '-mt-1 px-8',
        )}
      >
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
      <BookCarousel
        books={books}
        className={cn('w-full', withWoodenShelf && 'mt-5')}
        withWoodenShelf={withWoodenShelf}
      />
    </div>
  )
}
