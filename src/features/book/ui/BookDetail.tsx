import type { ReactNode } from 'react'
import type { Book } from '../model/book.types'
import { BookCover } from './BookCover'
import { BookCTA } from './BookCTA'
import { BookMeta } from './BookMeta'
import { BookSummary } from './BookSummary'
import { BookmarkButton } from './BookmarkButton'
import { StatBadgeGroup } from './StatBadgeGroup'

interface BookDetailProps {
  book: Book
  leadingSlot?: ReactNode
  onReserveConfirm: () => void
  onActiveStateClick?: () => void
}

export function BookDetail({
  book,
  leadingSlot,
  onReserveConfirm,
  onActiveStateClick,
}: BookDetailProps) {
  return (
    <div className="flex h-[calc(100svh-var(--navbar-height))] flex-col gap-5 py-6">
      <div className="relative h-[clamp(180px,35svh,360px)] shrink-0">
        {leadingSlot && (
          <div className="absolute top-0 left-0 z-10">{leadingSlot}</div>
        )}
        <BookCover
          coverUrl={book.coverUrl}
          title={book.title}
          className="h-full w-auto"
        />
      </div>

      <div className="flex shrink-0 items-start justify-between gap-2">
        <BookMeta
          title={book.title}
          author={book.author}
          authorId={book.authorId}
          genre={book.genre}
          language={book.language}
          publishedDate={book.publishedDate}
        />
        <BookmarkButton />
      </div>

      <StatBadgeGroup
        copies={book.copies}
        pageCount={book.pageCount}
        rating={book.rating}
      />

      <div className="min-h-0 flex-1">
        <BookSummary summary={book.summary} />
      </div>

      <BookCTA
        state={{ kind: 'available' }}
        bookTitle={book.title}
        onReserveConfirm={onReserveConfirm}
        onActiveStateClick={onActiveStateClick}
        className="shrink-0"
      />
    </div>
  )
}
