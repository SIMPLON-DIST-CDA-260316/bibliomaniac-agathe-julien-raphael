import { useState } from 'react'

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
  if (coverUrl !== trackedCoverUrl) {
    setTrackedCoverUrl(coverUrl)
    setHasLoadError(false)
  }

  const showFallback = !coverUrl || hasLoadError

  return (
    <div className={cn('mx-auto overflow-hidden rounded-xl', className)}>
      {showFallback ? (
        <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
          Pas de couverture
        </div>
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
