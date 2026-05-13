import { useNavigate } from 'react-router'

import type { Book } from '../model/book.types'
import { useRelatedBooks } from '../model/useRelatedBooks'
import { BookCarousel } from './BookCarousel'

interface BookRelatedSectionsProps {
  book: Book
}

export function BookRelatedSections({ book }: BookRelatedSectionsProps) {
  const navigate = useNavigate()
  const sections = useRelatedBooks(book)

  if (sections.length === 0) return null

  return (
    <div className="space-y-8 py-6">
      {sections.map((section) => (
        <section key={section.kind} aria-labelledby={`related-${section.kind}`}>
          <h2
            id={`related-${section.kind}`}
            className="mb-3 text-lg font-semibold"
          >
            {section.title}
          </h2>
          <BookCarousel
            books={section.books}
            onBookClick={(b) => void navigate(`/book/${b.id}`)}
            cardProps={section.cardProps}
          />
        </section>
      ))}
    </div>
  )
}
