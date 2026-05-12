import { useLayoutEffect, useRef, useState } from 'react'
import { ChevronDown } from 'lucide-react'

import { Button } from '@/shared/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'

// Reserved even when the button is hidden: keeps `maxLines` stable across
// truncation toggles and prevents the button from overflowing the container.
const BUTTON_RESERVED_HEIGHT = 32

interface BookSummaryProps {
  /** When null or empty/whitespace, the section is not rendered. */
  summary: string | null
}

/**
 * Displays a book summary with dynamic line clamping.
 *
 * Measures the available height to compute the maximum number of
 * lines, appends a native ellipsis on overflow, and reveals the full
 * text in a bottom Drawer via the "Lire la suite" affordance.
 */
export function BookSummary({ summary }: BookSummaryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const truncatableTextRef = useRef<HTMLParagraphElement>(null)
  const [maxLines, setMaxLines] = useState(0)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const truncatableTextEl = truncatableTextRef.current
    const containerEl = containerRef.current
    if (!truncatableTextEl || !containerEl) return

    const measureTruncation = () => {
      const lineHeight = parseFloat(
        getComputedStyle(truncatableTextEl).lineHeight,
      )
      if (!lineHeight) return
      const available = containerEl.clientHeight - BUTTON_RESERVED_HEIGHT
      const lines = Math.max(1, Math.floor(available / lineHeight))
      setMaxLines(lines)
      // +1px tolerance: subpixel rounding otherwise flags truncation when
      // the text fits exactly within the clamp.
      setIsTruncated(truncatableTextEl.scrollHeight > lines * lineHeight + 1)
    }
    measureTruncation()

    // Observe the container, not the paragraph: line-clamp shrinks the
    // paragraph's height, which would re-trigger the observer in a loop.
    const ro = new ResizeObserver(measureTruncation)
    ro.observe(containerEl)

    return () => ro.disconnect()
  }, [summary])

  if (!summary?.trim()) return <BookSummaryEmptyState />

  return (
    <section className="flex h-full min-h-0 flex-col">
      <h2 className="mb-2 shrink-0 text-base font-semibold">Résumé</h2>
      <Drawer>
        <div ref={containerRef} className="flex min-h-0 flex-1 flex-col">
          <p
            ref={truncatableTextRef}
            // Hidden from AT when truncated — the Drawer is the canonical
            // full text source and avoids duplicate reading.
            aria-hidden={isTruncated}
            style={{
              display: '-webkit-box',
              WebkitLineClamp: maxLines || 1,
              WebkitBoxOrient: 'vertical',
            }}
            className="text-muted-foreground overflow-hidden text-sm leading-relaxed"
          >
            {summary}
          </p>
          {isTruncated && (
            <DrawerTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary -ml-2 h-auto shrink-0 gap-1.5 self-start py-1"
              >
                Lire la suite
                <ChevronDown className="size-4" aria-hidden />
              </Button>
            </DrawerTrigger>
          )}
        </div>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Résumé</DrawerTitle>
          </DrawerHeader>
          <div className="overflow-y-auto px-4 pb-6">
            <p className="text-muted-foreground text-sm leading-relaxed">
              {summary}
            </p>
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

function BookSummaryEmptyState() {
  return (
    <section className="flex h-full min-h-0 flex-col">
      <h2 className="mb-2 shrink-0 text-base font-semibold">Résumé</h2>
      <p className="text-muted-foreground text-sm italic">
        Pas de résumé disponible.
      </p>
    </section>
  )
}
