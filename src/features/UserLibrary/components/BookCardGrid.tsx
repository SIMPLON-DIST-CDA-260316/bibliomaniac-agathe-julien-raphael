import type { Volume } from '../data/mockBooks'

type BookProps = {
  bookItem: Volume
}

export function BookCardGrid({ bookItem }: BookProps) {
  return (
    <>
      <div key={bookItem.id} className="flex rounded-lg w-30">
        <a href="/book/:id" className="group">
          <img
            src={bookItem.volumeInfo.imageLinks.thumbnail}
            alt={bookItem.volumeInfo.title}
            className="aspect-7/9 w-30 object-cover object-left group-hover:opacity-75 xl:aspect-7/8"
          />
          <h3 className="mt-2 text-sm font-medium">
            {bookItem.volumeInfo.title}
          </h3>
        </a>
      </div>
    </>
  )
}
