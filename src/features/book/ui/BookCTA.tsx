import { useRef, useState } from 'react'
import {
  BookAlert,
  BookCheck,
  BookDashed,
  BookPlus,
  BookUp,
  ClockFading,
  type LucideIcon,
} from 'lucide-react'

import { Button } from '@/shared/ui/button'
import { cn } from '@/shared/lib/utils'

import type { BookCTAState } from '@/features/book/model/bookCta.types'
import { BookReserveConfirmDrawer } from '@/features/book/ui/cta-drawers/BookReserveConfirmDrawer'

/** Threshold (in days) below which a 'borrowed' variant switches to warning treatment. */
const ALERT_THRESHOLD_DAYS = 3

// Local enum mirrors the variants declared in `src/shared/ui/button.tsx` CVA.
// Kept duplicated (instead of `VariantProps<typeof buttonVariants>`) to avoid
// coupling to the Button file. If new variants are added to the CVA, also
// reflect them here so the presentation table stays well-typed.
type ButtonVariant =
  | 'default'
  | 'outline'
  | 'secondary'
  | 'ghost'
  | 'destructive'
  | 'link'
  | 'warning'
  | 'emphasis'

interface VariantPresentation {
  label: string
  icon: LucideIcon
  variant: ButtonVariant
  /** Extra Tailwind classes layered after the size classes. Used to add
   *  semantic affordances (dashed border for "unavailable", opacity dim, ...)
   *  without polluting the Button CVA. */
  extraClass?: string
}

function borrowedLabel(daysLeft: number): string {
  if (daysLeft <= 0) return 'À rendre aujourd’hui'
  if (daysLeft === 1) return 'À rendre demain'
  return `À rendre dans ${daysLeft} jours`
}

function presentationFor(state: BookCTAState): VariantPresentation {
  switch (state.kind) {
    case 'available':
      return { label: 'Réserver ce livre', icon: BookPlus, variant: 'default' }
    case 'unavailable':
      return {
        label: 'Indisponible',
        icon: BookDashed,
        variant: 'outline',
        extraClass: 'border-2 border-dashed opacity-70',
      }
    case 'reserved':
      return { label: 'Réservé', icon: BookCheck, variant: 'outline' }
    case 'ready':
      return { label: 'À retirer', icon: BookUp, variant: 'emphasis' }
    case 'borrowed': {
      const alert = state.daysLeft <= ALERT_THRESHOLD_DAYS
      return {
        label: borrowedLabel(state.daysLeft),
        icon: ClockFading,
        variant: alert ? 'warning' : 'outline',
        extraClass: alert ? 'border-2 border-warning' : undefined,
      }
    }
    case 'overdue':
      return {
        label: 'Retour en retard',
        icon: BookAlert,
        variant: 'destructive',
        extraClass: 'border-2 border-destructive text-foreground',
      }
  }
}

export interface BookCTAProps {
  state: BookCTAState
  /** Relayed to the confirmation Drawer when state.kind === 'available'. */
  bookTitle?: string
  /** Fired after user confirms inside the Drawer (state.kind === 'available'). */
  onReserveConfirm: () => void
  /** Fired on click of any "in-progress" variant: reserved, ready, borrowed, overdue. */
  onActiveStateClick?: () => void
  className?: string
}

export function BookCTA({
  state,
  bookTitle,
  onReserveConfirm,
  onActiveStateClick,
  className,
}: BookCTAProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const triggerRef = useRef<HTMLButtonElement>(null)
  const { label, icon: Icon, variant, extraClass } = presentationFor(state)

  const isUnavailable = state.kind === 'unavailable'
  const isAvailable = state.kind === 'available'

  function handleClick() {
    if (isUnavailable) return
    if (isAvailable) {
      setDrawerOpen(true)
      return
    }
    // reserved | ready | borrowed | overdue
    // TODO US5 / US6 — replace with variant-specific drawer or navigation
    onActiveStateClick?.()
  }

  function handleDrawerOpenChange(open: boolean) {
    setDrawerOpen(open)
    if (!open) {
      // Vaul restores focus on Escape but not on DrawerClose / pointer-out
      // closures. Route every close through the trigger so WAI-ARIA dialog
      // semantics hold (focus returns to the element that opened the dialog).
      requestAnimationFrame(() => triggerRef.current?.focus())
    }
  }

  return (
    <>
      <Button
        ref={triggerRef}
        type="button"
        variant={variant}
        size="lg"
        disabled={isUnavailable}
        onClick={handleClick}
        className={cn('h-12 w-full text-base', extraClass, className)}
      >
        <Icon className="size-5" aria-hidden />
        {label}
      </Button>

      {isAvailable && (
        <BookReserveConfirmDrawer
          open={drawerOpen}
          onOpenChange={handleDrawerOpenChange}
          bookTitle={bookTitle}
          onConfirm={onReserveConfirm}
        />
      )}
    </>
  )
}
