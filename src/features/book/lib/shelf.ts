import type { BookShelf, BookShelfSlug } from '../model/bookShelf.types'

export const SHELF_LABELS: Record<BookShelf, string> = {
  readingNow: 'En cours',
  borrowed: 'Empruntés',
  toRead: 'Envies',
  favorites: 'Favoris',
  haveRead: 'Terminés',
  reviewed: 'Critiqués',
  recentlyViewed: 'Consultés récemment',
}

const SHELF_SLUGS = {
  readingNow: 'en-cours',
  borrowed: 'empruntes',
  toRead: 'envies',
  favorites: 'favoris',
  haveRead: 'termines',
  reviewed: 'critiques',
  recentlyViewed: 'consultes-recemment',
} as const satisfies Record<BookShelf, BookShelfSlug>

export const SHELF_ORDER = Object.keys(SHELF_SLUGS) as BookShelf[]

export const shelfToSlug = (shelf: BookShelf): BookShelfSlug =>
  SHELF_SLUGS[shelf]

export function slugToShelf(slug: string): BookShelf | undefined {
  return SHELF_ORDER.find((s) => SHELF_SLUGS[s] === slug)
}
