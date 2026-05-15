import { useState } from 'react'
import { Bookmark } from 'lucide-react'

/**
 * Toggleable bookmark indicator.
 *
 * Local-only state for now; will be wired to user library data
 * when US3 (#13) lands.
 */
export function BookmarkButton() {
  const [isBookmarked, setIsBookmarked] = useState(false)

  return (
    <button
      type="button"
      className="text-foreground flex size-11 items-center justify-center"
      aria-label={isBookmarked ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      aria-pressed={isBookmarked}
      onClick={() => setIsBookmarked((v) => !v)}
    >
      <Bookmark
        className="size-6"
        fill={isBookmarked ? 'currentColor' : 'none'}
      />
    </button>
  )
}
