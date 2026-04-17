import * as React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/shared/lib/utils.ts'
import { Button } from '@/shared/ui/button.tsx'
import useEmblaCarousel from 'embla-carousel-react'
import type { Book } from '../types/book.ts'

interface BookCarouselProps {
  books: Book[]
  className?: string
  onBookClick?: (book: Book) => void
}

const BookCarousel = React.forwardRef<HTMLDivElement, BookCarouselProps>(
  ({ books, className, onBookClick }, ref) => {
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
          <div className="flex gap-4 pl-2 md:pl-4">
            {books.map((book) => (
              <div
                key={book.id}
                className="group flex-[0_0_calc(33.333%-0.5rem)] cursor-pointer sm:flex-[0_0_calc(20%-0.7rem)] lg:flex-[0_0_calc(11.111%-0.2rem)]"
                onClick={() => onBookClick?.(book)}
              >
                {/* Carte du livre */}
                <div className="flex flex-col gap-3">
                  {/* Image de couverture */}
                  <div className="relative aspect-2/3 overflow-hidden rounded-lg bg-gray-200">
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                  </div>

                  {/* Titre et auteur */}
                  <div className="px-1 pb-2">
                    <h3 className="group-hover:text-primary line-clamp-2 text-xs font-semibold transition-colors sm:text-sm md:line-clamp-none lg:text-base">
                      {book.title}
                    </h3>
                    <p className="mt-1 line-clamp-1 text-[10px] text-gray-600 sm:text-xs md:line-clamp-none lg:text-sm">
                      {book.author}
                    </p>
                  </div>
                </div>
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
