import { formatNumber, formatRating } from '../lib/formatBookStat'
import { StatBadge } from './StatBadge'

interface StatBadgeGroupProps {
  copies: number | null
  pageCount: number | null
  rating: number | null
}

export function StatBadgeGroup({
  copies,
  pageCount,
  rating,
}: StatBadgeGroupProps) {
  return (
    <div className="flex shrink-0 gap-3">
      <StatBadge label="Exemplaires" value={formatNumber(copies)} />
      <StatBadge label="Pages" value={formatNumber(pageCount)} />
      <StatBadge label="Note" value={formatRating(rating)} />
    </div>
  )
}
