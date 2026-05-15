import { useSampleBooksByShelf } from '@/features/book/hooks/useSampleBooksByShelf'
import { SHELF_LABELS, slugToShelf } from '@/features/book/lib/shelf'
import { BookGrid } from '@/features/book/ui/BookGrid'
import { BackButton } from '@/shared/ui/back-button'
import { Navigate, useParams } from 'react-router'

export function UserShelfPage() {
  const { shelfSlug } = useParams<{ shelfSlug: string }>()
  const shelfBooks = useSampleBooksByShelf()
  const shelf = shelfSlug ? slugToShelf(shelfSlug) : undefined
  if (!shelf) return <Navigate to="/library" replace />
  return (
    <section className="mx-auto flex w-full max-w-none flex-col gap-4 rounded-b-3xl px-4 pt-6 pb-6 shadow-none md:px-8 lg:px-24">
      <div className="flex items-center gap-3 pb-1 md:pb-2">
        <BackButton />
        <h1 className="text-primary py-3 text-2xl font-bold md:text-xl xl:text-2xl 2xl:text-3xl">
          {SHELF_LABELS[shelf]}
        </h1>
      </div>
      <BookGrid books={shelfBooks[shelf]} />
    </section>
  )
}
