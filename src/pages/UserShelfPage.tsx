import { useSampleBooksByShelf } from '@/features/book/hooks/useSampleBooksByShelf'
import {
  BOOK_SHELF_LABELS,
  BOOK_SHELF_ORDER,
  type BookShelf,
} from '@/features/book/types/bookShelf'
import { BookCarousel } from '@/features/book/ui/BookCarousel'
import { Navigate, useParams } from 'react-router'

export function UserShelfPage() {
  const { shelf } = useParams<{ shelf: BookShelf }>()
  const shelfBooks = useSampleBooksByShelf()
  if (!shelf || !BOOK_SHELF_ORDER.includes(shelf))
    return <Navigate to="/library" replace />
  return (
    <section className="px-4 pt-4">
      <h1 className="text-primary py-3 text-2xl font-bold">
        {BOOK_SHELF_LABELS[shelf]}
      </h1>
      <BookCarousel books={shelfBooks[shelf]} />
    </section>
  )
}
