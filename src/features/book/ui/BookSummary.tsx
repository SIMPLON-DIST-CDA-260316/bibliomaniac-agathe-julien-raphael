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
  if (!summary) return null

  return (
    <section className="space-y-2">
      <h2 className="text-base font-semibold">Résumé</h2>
      <p className="text-muted-foreground line-clamp-4 text-sm leading-relaxed">
        {summary}
      </p>
      <Drawer>
        <DrawerTrigger className="text-primary text-sm font-medium underline-offset-2 hover:underline">
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
    </section>
  )
}
