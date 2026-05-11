import { useState } from 'react'
import { ImageOff } from 'lucide-react'

import { cn } from '@/shared/lib/utils'

interface BookCoverProps {
  coverUrl: string | null
  title: string
  className?: string
}

export function BookCover({ coverUrl, title, className }: BookCoverProps) {
  const [hasLoadError, setHasLoadError] = useState(false)
  const [trackedCoverUrl, setTrackedCoverUrl] = useState(coverUrl)

  // Reset error state when navigating to a different book — React's
  // recommended "adjust state on prop change" pattern, no useEffect.
  // https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes
  if (coverUrl !== trackedCoverUrl) {
    setTrackedCoverUrl(coverUrl)
    setHasLoadError(false)
  }

  const showFallback = !coverUrl || hasLoadError

  return (
    <div className={cn('mx-auto overflow-hidden rounded-xl', className)}>
      {showFallback ? (
        <BookCoverFallback />
      ) : (
        <img
          src={coverUrl}
          alt={`Couverture de ${title}`}
          onError={() => setHasLoadError(true)}
          className="mx-auto h-full object-contain"
        />
      )}
    </div>
  )
}

function BookCoverFallback() {
  return (
    <div className="bg-accent/15 text-muted-foreground mx-auto flex aspect-[2/3] h-full flex-col items-center justify-center gap-2 rounded-xl">
      <ImageOff className="size-8" aria-hidden />
      <span className="text-sm">Pas de couverture</span>
    </div>
  )
}
