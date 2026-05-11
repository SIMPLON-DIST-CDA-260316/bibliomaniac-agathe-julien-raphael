import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router'

import { Button } from '@/shared/ui/button'

export function BackButton() {
  const navigate = useNavigate()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="bg-primary text-primary-foreground hover:bg-primary/80 size-11 rounded-full"
      onClick={() => void navigate(-1)}
      aria-label="Retour"
    >
      <ChevronLeft className="size-5" />
    </Button>
  )
}
