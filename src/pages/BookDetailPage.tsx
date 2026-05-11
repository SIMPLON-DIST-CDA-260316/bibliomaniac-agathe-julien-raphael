import { useState } from 'react'
import { Bookmark } from 'lucide-react'
import { useParams } from 'react-router'

import { BookCover } from '@/features/book/ui/BookCover'
import { BookMeta } from '@/features/book/ui/BookMeta'
import { BookSummary } from '@/features/book/ui/BookSummary'
import { StatBadge } from '@/features/book/ui/StatBadge'
import { useBookDetail } from '@/features/book/hooks/useBookDetail'
import { BackButton } from '@/shared/ui/back-button'
import { Button } from '@/shared/ui/button'

export function BookDetailPage() {
  const { id = '' } = useParams<{ id: string }>()
  const book = useBookDetail(id)
  const [bookmarked, setBookmarked] = useState(false)

  return (
    <div className="mx-auto max-w-md px-4">
      {/* Hero section — viewport height */}
      <div className="flex h-[calc(100svh-var(--navbar-height))] flex-col gap-5 py-6">
        {/* Cover + BackButton overlay — flex-1 to fill remaining space */}
        <div className="relative min-h-0 flex-1">
          <div className="absolute top-0 left-0 z-10">
            <BackButton />
          </div>
          <BookCover
            coverUrl={book.coverUrl}
            title={book.title}
            className="h-full w-auto"
          />
        </div>

        {/* Title + Bookmark */}
        <div className="flex shrink-0 items-start justify-between gap-2">
          <BookMeta
            title={book.title}
            author={book.author}
            authorId={book.authorId}
            genre={book.genre}
            publishedDate={book.publishedDate}
          />
          <button
            type="button"
            className="text-foreground flex size-11 items-center justify-center"
            aria-label="Ajouter aux favoris"
            onClick={() => setBookmarked(!bookmarked)}
          >
            <Bookmark
              className="size-6"
              fill={bookmarked ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        {/* Stats */}
        <div className="flex shrink-0 gap-3">
          {book.stats.map(({ label, value }) => (
            <StatBadge key={label} label={label} value={value} />
          ))}
        </div>

        {/* Summary */}
        <div className="shrink-0">
          <BookSummary summary={book.summary} />
        </div>

        {/* CTA slot */}
        <Button className="h-12 w-full shrink-0 text-base" size="lg">
          Réserver ce livre
        </Button>
      </div>

      {/* Recommendation sections — below the fold (placeholders) */}
      <div className="bg-primary/20 h-48 rounded-xl" />
      <div className="bg-accent/20 h-48 rounded-xl" />
      <div className="bg-primary/10 h-48 rounded-xl" />
    </div>
  )
}
