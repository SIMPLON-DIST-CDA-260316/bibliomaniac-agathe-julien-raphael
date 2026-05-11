import { useSampleBooksByShelf } from '@/features/book/hooks/useSampleBooksByShelf'
import {
  BOOK_SHELF_LABELS,
  BOOK_SHELF_ORDER,
} from '@/features/book/types/bookShelf'
import { BookSection } from '@/features/book/ui/BookSection'

export function UserLibraryPage() {
  const shelfBooks = useSampleBooksByShelf()
  return (
    <>
      <section className="mx-auto px-4 pt-4 pb-24">
        <h1 className="text-primary py-3 text-2xl font-bold">
          Ma Bibliothèque
        </h1>
        {BOOK_SHELF_ORDER.map((shelf) => (
          <BookSection
            key={shelf}
            title={BOOK_SHELF_LABELS[shelf]}
            link="#"
            books={shelfBooks[shelf]}
          />
        ))}
      </section>
    </>
  )
}
