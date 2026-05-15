import { toFrenchDecimal } from '@/shared/lib/format'

/** Formats a numeric stat with French decimal, "—" when missing. */
export function formatNumber(value: number | null): string {
  return value != null ? toFrenchDecimal(value) : '—'
}

/** Formats a book rating as "X / 5" — Bibliomaniac scale convention. */
export function formatRating(rating: number | null): string {
  return rating != null ? `${toFrenchDecimal(rating)} / 5` : '—'
}
