import type { Book } from '../types/book'

interface BookCardProps {
  book: Book
  onClick?: () => void
  coverOnly?: boolean
}

export function BookCard({ book, coverOnly = false, onClick }: BookCardProps) {
  return (
    <div className="group flex cursor-pointer flex-col gap-3" onClick={onClick}>
      {/* Image de couverture */}
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
        <img
          src={book.coverImage}
          // alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {/* Overlay au survol */}
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      </div>

      {/* Titre et auteur  */}
      {!coverOnly ? (
        <div className="px-1 pb-2">
          <h3 className="group-hover:text-primary line-clamp-2 text-xs font-semibold transition-colors sm:text-sm md:line-clamp-none lg:text-base">
            {book.title}
          </h3>
          <p className="mt-1 line-clamp-1 text-[10px] text-gray-600 sm:text-xs md:line-clamp-none lg:text-sm">
            {book.author}
          </p>
        </div>
      ) : null}
    </div>
  )
}
