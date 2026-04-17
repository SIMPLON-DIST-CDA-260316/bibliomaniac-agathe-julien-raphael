import { cn } from '@/shared/lib/utils'

interface BookCoverProps {
  coverUrl: string | null
  title: string
  className?: string
}

export function BookCover({ coverUrl, title, className }: BookCoverProps) {
  return (
    <div className={cn('mx-auto overflow-hidden rounded-xl', className)}>
      {coverUrl ? (
        <img
          src={coverUrl}
          alt={`Couverture de ${title}`}
          className="mx-auto h-full object-contain"
        />
      ) : (
        <div className="bg-muted text-muted-foreground flex h-full w-full items-center justify-center">
          Pas de couverture
        </div>
      )}
    </div>
  )
}
