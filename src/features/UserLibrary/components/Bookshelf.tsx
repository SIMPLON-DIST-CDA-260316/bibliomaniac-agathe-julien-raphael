import type { VolumesResponse } from '../data/mockBooks'
import { BookCardGrid } from './BookCardGrid'

type BookProps = {
  title: string
  bookItemsList: VolumesResponse
}

export function Bookshelf({ title, bookItemsList }: BookProps) {
  const bookItems = bookItemsList.items
  return (
    <>
      <section className="flex flex-col">
        <h3>{title}</h3>
        <div className="flex gap-4 overflow-x-hidden">
          {bookItems.map((item) => (
            <div key={item.id} className="flex-none">
              <BookCardGrid bookItem={item} />
            </div>
          ))}
        </div>
      </section>
    </>
  )
}
