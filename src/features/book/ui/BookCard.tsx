import type { KeyboardEvent } from 'react'
import type { Book } from '../model/book.types'

export interface BookCardProps {
  book: Book
  onClick?: () => void
  showAuthor?: boolean
  compactTitle?: boolean
}

export function BookCard({
  book,
  onClick,
  showAuthor = true,
  compactTitle = false,
}: BookCardProps) {
  const interactive = onClick != null

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!interactive) return
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      onClick?.()
    }
  }

  const displayTitle =
    compactTitle && book.tomeNumber != null
      ? `Tome ${book.tomeNumber}`
      : book.title

  const ariaLabel =
    showAuthor && book.author ? `${book.title} par ${book.author}` : book.title

  return (
    <div
      className={
        interactive
          ? 'group focus-visible:ring-primary flex cursor-pointer flex-col gap-3 focus:outline-none focus-visible:ring-2'
          : 'group flex flex-col gap-3'
      }
      onClick={onClick}
      role={interactive ? 'button' : undefined}
      tabIndex={interactive ? 0 : undefined}
      onKeyDown={interactive ? handleKeyDown : undefined}
      aria-label={interactive ? ariaLabel : undefined}
    >
      <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
        <img
          src={book.coverUrl ?? ''}
          alt={book.title}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
      </div>

      <div className="px-1 pb-2">
        <h3 className="group-hover:text-primary line-clamp-2 text-xs font-semibold transition-colors sm:text-sm md:line-clamp-none lg:text-base">
          {displayTitle}
        </h3>
        {showAuthor && book.author && (
          <p className="mt-1 line-clamp-1 text-[10px] text-gray-600 sm:text-xs md:line-clamp-none lg:text-sm">
            {book.author}
          </p>
        )}
      </div>
    </div>
  )
}
