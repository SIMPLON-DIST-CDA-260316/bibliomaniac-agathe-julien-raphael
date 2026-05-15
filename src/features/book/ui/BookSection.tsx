import { Link } from 'react-router'
import { BookCarousel } from '@/features/book/ui/BookCarousel.tsx'
import type { Book } from '../types/book.ts'
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
        withWoodenShelf &&
          'max-sm:relative max-sm:z-1 max-sm:bg-[url(@/assets/wooden-img.png)] max-sm:bg-cover max-sm:bg-center max-sm:bg-no-repeat max-sm:pb-5',
      )}
    >
      <div
        className={cn(
          'mb-2 flex items-center justify-between',
          withWoodenShelf && 'max-sm:-mt-1 max-sm:px-8',
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
        className={cn('w-full', withWoodenShelf && 'max-sm:mt-5')}
        withWoodenShelf={withWoodenShelf}
      />
    </div>
  )
}
