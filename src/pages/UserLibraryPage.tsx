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
      <section className="mx-auto flex w-full max-w-none flex-col rounded-b-3xl pt-8 pb-6 shadow-none sm:gap-4 sm:px-4 sm:pb-24 md:px-8 lg:px-24">
        <h1 className="text-primary px-4 pb-4 text-2xl font-bold sm:px-0 md:text-3xl xl:text-4xl 2xl:text-5xl">
          Ma Bibliothèque
        </h1>

        {SHELF_ORDER.map((shelf) => (
          <BookSection
            key={shelf}
            title={SHELF_LABELS[shelf]}
            link={`/library/${shelfToSlug(shelf)}`}
            books={shelfBooks[shelf]}
            withWoodenShelf
          />
        ))}
      </section>
    </>
  )
}
