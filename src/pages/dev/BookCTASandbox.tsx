import { BookCTA } from '@/features/book/ui/BookCTA'
import type { BookCTAState } from '@/features/book/model/bookCta.types'

const SAMPLES: { label: string; state: BookCTAState }[] = [
  { label: 'available', state: { kind: 'available' } },
  { label: 'unavailable', state: { kind: 'unavailable' } },
  { label: 'reserved', state: { kind: 'reserved' } },
  { label: 'ready', state: { kind: 'ready' } },
  { label: 'borrowed (J-7)', state: { kind: 'borrowed', daysLeft: 7 } },
  { label: 'borrowed (J-2, alert)', state: { kind: 'borrowed', daysLeft: 2 } },
  { label: 'overdue', state: { kind: 'overdue' } },
]

export function BookCTASandbox() {
  return (
    <main className="mx-auto max-w-md space-y-6 px-4 py-6">
      <header className="space-y-1">
        <h1 className="font-heading text-xl">BookCTA — variantes</h1>
        <p className="text-muted-foreground text-sm">
          Sandbox DEV only. Vérifie les 6 variantes + bascule alerte J-2.
        </p>
      </header>
      {SAMPLES.map(({ label, state }) => (
        <section key={label} className="space-y-2">
          <p className="text-muted-foreground text-sm">{label}</p>
          <BookCTA
            state={state}
            bookTitle="Le Comte de Monte-Cristo"
            onReserveConfirm={() => console.log('[sandbox] reserve confirmed')}
            onActiveStateClick={() =>
              console.log('[sandbox] active state click', state.kind)
            }
          />
        </section>
      ))}
    </main>
  )
}
