import type { Book } from '@/features/book/model/book.types.ts'
import { useRelatedBooks } from '../hooks/useRelatedBooks'
import { Skeleton } from '@/shared/ui/skeleton'
import { BookCarousel } from './BookCarousel'

interface BookRelatedSectionsProps {
  book: Book
}

export function BookRelatedSections({ book }: BookRelatedSectionsProps) {
  const { sections, isLoading } = useRelatedBooks(book)

  if (isLoading) return <BookRelatedSectionsLoading />

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
          <BookCarousel books={section.books} cardProps={section.cardProps} />
        </section>
      ))}
    </div>
  )
}

function BookRelatedSectionsLoading() {
  return (
    <div
      className="space-y-8 py-6"
      role="status"
      aria-label="Chargement des suggestions"
    >
      {[0, 1].map((i) => (
        <section key={i}>
          <Skeleton className="mb-3 h-6 w-48" />
          <div className="flex gap-4 overflow-hidden">
            {Array.from({ length: 6 }).map((_, j) => (
              <Skeleton
                key={j}
                className="aspect-[2/3] flex-[0_0_calc(33.333%-0.5rem)] rounded-lg sm:flex-[0_0_calc(20%-0.7rem)] lg:flex-[0_0_calc(11.111%-0.2rem)]"
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
