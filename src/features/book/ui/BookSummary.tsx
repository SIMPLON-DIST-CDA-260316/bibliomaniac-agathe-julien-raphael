import { useState } from 'react'

import { cn } from '@/shared/lib/utils'

interface BookSummaryProps {
  summary: string | null
}

export function BookSummary({ summary }: BookSummaryProps) {
  const [expanded, setExpanded] = useState(false)

  if (!summary) return null

  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold">Résumé</h2>
      <p
        className={cn(
          'text-muted-foreground text-sm leading-relaxed',
          !expanded && 'line-clamp-4',
        )}
      >
        {summary}
      </p>
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        className="text-primary text-sm font-medium underline-offset-2 hover:underline"
      >
        {expanded ? 'réduire' : 'lire tout'}
      </button>
    </section>
  )
}
