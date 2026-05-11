import { BookX } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'

import { BookCover } from '@/features/book/ui/BookCover'
import { BookMeta } from '@/features/book/ui/BookMeta'
import { BookSummary } from '@/features/book/ui/BookSummary'
import { BookmarkButton } from '@/features/book/ui/BookmarkButton'
import { StatBadge } from '@/features/book/ui/StatBadge'
import { useBookDetail } from '@/features/book/hooks/useBookDetail'
import { BackButton } from '@/shared/ui/back-button'
import { Button } from '@/shared/ui/button'
import { Skeleton } from '@/shared/ui/skeleton'

/**
 * Page route for `/book/:id`.
 *
 * Displays a book's full details when found, a loading placeholder
 * while data is in flight, or a not-found state when the id is
 * missing or unknown.
 */
export function BookDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: book, isLoading, error } = useBookDetail(id)

  if (isLoading) return <BookDetailLoadingState />
  // TODO: Distinguish network errors from not-found once the real API
  //       (Google Books) replaces the mock — different copy and a
  //       retry action belong on the network-error branch.
  if (error || !book) return <BookDetailNotFoundState />

  return (
    <div className="mx-auto max-w-md px-4">
      <div className="flex h-[calc(100svh-var(--navbar-height))] flex-col gap-5 py-6">
        <div className="relative h-[clamp(180px,35svh,360px)] shrink-0">
          <div className="absolute top-0 left-0 z-10">
            <BackButton />
          </div>
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
            publishedDate={book.publishedDate}
          />
          <BookmarkButton />
        </div>

        <div className="flex shrink-0 gap-3">
          {book.stats.map(({ label, value }) => (
            <StatBadge key={label} label={label} value={value} />
          ))}
        </div>

        <div className="min-h-0 flex-1">
          <BookSummary summary={book.summary} />
        </div>

        <Button className="h-12 w-full shrink-0 text-base" size="lg">
          Réserver ce livre
        </Button>
      </div>

      {/* TODO US7 (#16): replace placeholders with related-books carousel */}
      <div className="bg-primary/20 h-48 rounded-xl" />
      <div className="bg-accent/20 h-48 rounded-xl" />
      <div className="bg-primary/10 h-48 rounded-xl" />
    </div>
  )
}

function BookDetailLoadingState() {
  return (
    <div
      className="mx-auto max-w-md px-4"
      role="status"
      aria-label="Chargement du livre"
    >
      <div className="flex h-[calc(100svh-var(--navbar-height))] flex-col gap-5 py-6">
        <Skeleton className="mx-auto aspect-[2/3] h-[clamp(180px,35svh,360px)] shrink-0 rounded-xl" />

        <div className="flex shrink-0 items-start justify-between gap-2">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-1/3" />
          </div>
          <Skeleton className="size-6 rounded-sm" />
        </div>

        <div className="flex shrink-0 gap-3">
          <Skeleton className="h-14 flex-1 rounded-lg" />
          <Skeleton className="h-14 flex-1 rounded-lg" />
          <Skeleton className="h-14 flex-1 rounded-lg" />
        </div>

        <div className="min-h-0 flex-1 space-y-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-5/6" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        <Skeleton className="h-12 w-full shrink-0 rounded-md" />
      </div>
    </div>
  )
}

function BookDetailNotFoundState() {
  const navigate = useNavigate()

  return (
    <div className="mx-auto flex h-[calc(100svh-var(--navbar-height))] max-w-md flex-col items-center justify-center gap-4 px-4 text-center">
      <BookX className="text-muted-foreground size-12" aria-hidden />
      <h1 className="text-xl font-semibold">Livre introuvable</h1>
      <p className="text-muted-foreground text-sm">
        Cette fiche n&apos;existe pas ou n&apos;est plus disponible.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button variant="outline" onClick={() => void navigate(-1)}>
          Page précédente
        </Button>
        <Button asChild>
          <Link to="/">Retour à l&apos;accueil</Link>
        </Button>
      </div>
    </div>
  )
}
