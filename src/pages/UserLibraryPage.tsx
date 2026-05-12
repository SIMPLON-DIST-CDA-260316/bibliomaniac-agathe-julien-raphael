import { useSampleBooksByShelf } from '@/features/book/hooks/useSampleBooksByShelf'
import {
  SHELF_LABELS,
  SHELF_ORDER,
  shelfToSlug,
} from '@/features/book/lib/shelf'
import { BookSection } from '@/features/book/ui/BookSection'

export function UserLibraryPage() {
  const shelfBooks = useSampleBooksByShelf()
  return (
    <>
      <section className="mx-auto px-4 pt-4 pb-24">
        <h1 className="text-primary py-3 text-2xl font-bold">
          Ma Bibliothèque
        </h1>
        {SHELF_ORDER.map((shelf) => (
          <BookSection
            key={shelf}
            title={SHELF_LABELS[shelf]}
            link={`/library/${shelfToSlug(shelf)}`}
            books={shelfBooks[shelf]}
          />
        ))}
      </section>
    </>
  )
}
