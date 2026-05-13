import { useUserLibrary } from '@/features/book/api/useUserLibrary'
import { useUserShelves } from '@/features/book/api/useUserShelves'
import {
  SHELF_LABELS,
  SHELF_ORDER,
  shelfToSlug,
} from '@/features/book/lib/shelf'
import { BookSection } from '@/features/book/ui/BookSection'
import { SearchBar } from '@/features/book/ui/SearchBar'

export function UserLibraryPage() {
  const { data: shelfBooks } = useUserShelves()
  const { data: allBooks } = useUserLibrary()
  return (
    <>
      <section className="mx-auto px-4 pt-4 pb-24">
        <h1 className="text-primary py-3 text-2xl font-bold">
          Ma Bibliothèque
        </h1>
        <SearchBar
          books={allBooks}
          placeholder="Rechercher dans ma bibliothèque ..."
        />
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
