import { formatFloat } from '@/shared/lib/format'

interface StatBadgeProps {
  label: string
  value: number | null
}

export function StatBadge({ label, value }: StatBadgeProps) {
  return (
    <div className="flex flex-1 flex-col items-center gap-0.5 rounded-lg bg-[var(--bm-olive)] py-1.5 text-white">
      <span className="text-sm italic opacity-80">{label}</span>
      <span className="text-lg">
        {value != null ? formatFloat(value) : '—'}
      </span>
    </div>
  )
}
