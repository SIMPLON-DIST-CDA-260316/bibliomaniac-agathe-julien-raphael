import { Navigate, useParams } from 'react-router'
import {
  BookGrid,
  SHELF_LABELS,
  slugToShelf,
  useUserShelves,
} from '@/features/book'

export function UserShelfPage() {
  const { shelfSlug } = useParams<{ shelfSlug: string }>()
  const { data: shelfBooks } = useUserShelves()
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
