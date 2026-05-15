import { useSampleBooksByShelf } from '@/features/book/hooks/useSampleBooksByShelf'
import { SHELF_LABELS, slugToShelf } from '@/features/book/lib/shelf'
import { BookGrid } from '@/features/book/ui/BookGrid'
import { Navigate, useParams } from 'react-router'

export function UserShelfPage() {
  const { shelfSlug } = useParams<{ shelfSlug: string }>()
  const shelfBooks = useSampleBooksByShelf()
  const shelf = shelfSlug ? slugToShelf(shelfSlug) : undefined
  if (!shelf) return <Navigate to="/library" replace />
  return (
    <section className="px-4 pt-4 pb-24">
      <h1 className="text-primary py-3 text-2xl font-bold">
        {SHELF_LABELS[shelf]}
      </h1>
      <BookGrid books={shelfBooks[shelf]} />
    </section>
  )
}
