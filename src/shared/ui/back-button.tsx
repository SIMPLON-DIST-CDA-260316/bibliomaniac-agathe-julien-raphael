import { ChevronLeft } from 'lucide-react'

import { Button } from '@/shared/ui/button'

export function BackButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-primary text-primary-foreground hover:bg-primary/80 size-11 rounded-full"
      onClick={() => history.back()}
      aria-label="Retour"
    >
      <ChevronLeft className="size-5" />
    </Button>
  )
}
