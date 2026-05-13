import { BookX } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'

import { BookDetail, BookRelatedSections, useBookDetail } from '@/features/book'
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
  // TODO #47: branch UI per typed error (not-found, network, 5xx, auth,
  //           rate-limit, parse) when the real API replaces the mock.
  if (error || !book) return <BookDetailNotFoundState />

  return (
    <>
      <div className="mx-auto max-w-md px-4">
        <BookDetail
          book={book}
          leadingSlot={<BackButton />}
          onReserveConfirm={() => {
            // TODO #33 — wire to reservation mutation
            console.log('[BookCTA] reserve confirmed for', book.id)
          }}
          onActiveStateClick={() => {
            // TODO #33 — wire to navigation
            console.log('[BookCTA] active state click', book.id)
          }}
        />
      </div>

      <div className="mx-auto max-w-screen-xl px-4">
        <BookRelatedSections book={book} />
      </div>
    </>
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
