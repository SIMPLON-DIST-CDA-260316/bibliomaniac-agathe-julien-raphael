import { useLayoutEffect, useRef, useState } from 'react'

import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/shared/ui/drawer'

interface BookSummaryProps {
  summary: string | null
}

export function BookSummary({ summary }: BookSummaryProps) {
  const truncatableTextRef = useRef<HTMLParagraphElement>(null)
  const [isTruncated, setIsTruncated] = useState(false)

  useLayoutEffect(() => {
    const el = truncatableTextRef.current
    if (!el) return

    const updateTruncation = () =>
      setIsTruncated(el.scrollHeight > el.clientHeight)
    updateTruncation()

    const ro = new ResizeObserver(updateTruncation)
    ro.observe(el)

    return () => ro.disconnect()
  }, [summary])

  if (!summary?.trim()) return null

  return (
    <section className="flex h-full min-h-0 flex-col gap-2">
      <h2 className="shrink-0 text-base font-semibold">Résumé</h2>
      <div className="relative min-h-0 flex-1">
        <p
          ref={truncatableTextRef}
          aria-hidden={isTruncated}
          className="text-muted-foreground h-full overflow-hidden text-sm leading-relaxed"
        >
          {summary}
        </p>
        {isTruncated && (
          <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t to-transparent" />
        )}
      </div>
      {isTruncated && (
        <Drawer>
          <DrawerTrigger className="text-primary shrink-0 self-start text-sm font-medium underline-offset-2 hover:underline">
            lire tout
          </DrawerTrigger>
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
      )}
    </section>
  )
}
