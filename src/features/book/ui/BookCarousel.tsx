import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils.ts'
import { Button } from '@/shared/ui/button.tsx'
import useEmblaCarousel from 'embla-carousel-react'
import type { Book } from '../types/book.ts'
import { BookCard } from './BookCard.tsx'

interface BookCarouselProps {
  books: Book[]
  className?: string
  onBookClick?: (book: Book) => void
  withWoodenShelf?: boolean
}

const BookCarousel = React.forwardRef<HTMLDivElement, BookCarouselProps>(
  ({ books, className, onBookClick, withWoodenShelf = false }, ref) => {
    const [emblaRef, emblaApi] = useEmblaCarousel({
      align: 'start',
      loop: false,
      breakpoints: {
        '(max-width: 639px)': { dragFree: false, slidesToScroll: 3 },
        '(min-width: 640px) and (max-width: 1023px)': { slidesToScroll: 5 },
        '(min-width: 1024px)': { slidesToScroll: 9 },
      },
    })

    const [canScrollPrev, setCanScrollPrev] = React.useState(false)
    const [canScrollNext, setCanScrollNext] = React.useState(false)

    const onSelect = React.useCallback(() => {
      if (!emblaApi) return
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }, [emblaApi])

    React.useEffect(() => {
      if (!emblaApi) return
      onSelect()
      emblaApi.on('select', onSelect)
      emblaApi.on('reInit', onSelect)

      return () => {
        emblaApi.off('select', onSelect)
        emblaApi.off('reInit', onSelect)
      }
    }, [emblaApi, onSelect])

    const scrollPrev = React.useCallback(
      () => emblaApi?.scrollPrev(),
      [emblaApi],
    )
    const scrollNext = React.useCallback(
      () => emblaApi?.scrollNext(),
      [emblaApi],
    )

    return (
      <div
        ref={ref}
        className={cn(
          'relative w-full',
          'mx-auto max-w-full md:max-w-[90vw] lg:max-w-[95vw]',
          className,
        )}
      >
        <div className="overflow-hidden" ref={emblaRef}>
          <div
            className={cn(
              'flex gap-4 pl-2 md:pl-4',
              withWoodenShelf && 'gap-8 pl-13',
            )}
          >
            {books.map((book) => (
              <div
                key={book.id}
                className={cn(
                  'flex-[0_0_calc(33.333%-0.5rem)] sm:flex-[0_0_calc(20%-0.7rem)] lg:flex-[0_0_calc(11.111%-0.2rem)]',
                  withWoodenShelf && 'flex-[0_0_calc(19.333%-0.5rem)]',
                )}
              >
                {/* Carte du livre */}
                <BookCard
                  book={book}
                  coverOnly={withWoodenShelf}
                  onClick={() => onBookClick?.(book)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Boutons de navigation */}
        {books.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-1/3 left-2 z-10 -translate-y-1/5 bg-white/80 shadow-lg hover:bg-white focus:outline-none active:outline-none',
                !canScrollPrev && 'cursor-not-allowed opacity-50',
              )}
              onClick={scrollPrev}
              disabled={!canScrollPrev}
              aria-label="Livre précédent"
            >
              <ChevronLeft className="size-5" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className={cn(
                'absolute top-1/3 right-2 z-10 -translate-y-1/5 bg-white/80 shadow-lg hover:bg-white focus:outline-none active:outline-none',
                !canScrollNext && 'cursor-not-allowed opacity-50',
              )}
              onClick={scrollNext}
              disabled={!canScrollNext}
              aria-label="Livre suivant"
            >
              <ChevronRight className="size-5" />
            </Button>
          </>
        )}
      </div>
    )
  },
)

BookCarousel.displayName = 'BookCarousel'

export { BookCarousel }
