import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/ui/drawer'
import { Button } from '@/shared/ui/button'

export interface BookReserveConfirmDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  /** If provided, displayed in italics inside the confirmation question. */
  bookTitle?: string
  /** Called after the drawer closes itself, on user confirmation. */
  onConfirm: () => void
}

export function BookReserveConfirmDrawer({
  open,
  onOpenChange,
  bookTitle,
  onConfirm,
}: BookReserveConfirmDrawerProps) {
  function handleConfirm() {
    onOpenChange(false)
    onConfirm()
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>
            Réserver {bookTitle ? <em>{bookTitle}</em> : 'ce livre'} ?
          </DrawerTitle>
          <DrawerDescription>
            Tu seras notifié dès que le livre sera prêt à être retiré.
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <Button size="lg" onClick={handleConfirm}>
            Confirmer la réservation
          </Button>
          <DrawerClose asChild>
            <Button size="lg" variant="outline">
              Annuler
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  )
}
