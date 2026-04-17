import { BookCardGrid } from '@/features/UserLibrary/components/BookCardGrid'
import { Bookshelf } from '@/features/UserLibrary/components/Bookshelf'
import {
  bookList,
  mockVolumesResponse,
} from '@/features/UserLibrary/data/mockBooks'

export function UserLibraryPage() {
//   const bookItems = mockVolumesResponse.items
  return (
    <>
      <h1 className="px-4 py-3 font-semibold">Ma Bibliothèque</h1>
      {/* <section className="grid grid-cols-3 gap-x-6 gap-y-10 px-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
        {bookItems.map((item) => (
          <BookCardGrid bookItem={item} />
        ))}
      </section> */}
      <section>
        {Object.entries(bookList).map((entry) => (
          <Bookshelf title={entry[0]} bookItemsList={entry[1]}/>
        ))}
      </section>
    </>
  )
}
