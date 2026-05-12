export type BookShelf =
  | 'favorites'
  | 'borrowed'
  | 'to_read'
  | 'reading_now'
  | 'have_read'
  | 'reviewed'
  | 'recently_viewed'

export const BOOK_SHELF_LABELS: Record<BookShelf, string> = {
  favorites: 'Favoris',
  borrowed: 'Empruntés',
  to_read: 'Envies',
  reading_now: 'En cours',
  have_read: 'Terminé',
  reviewed: 'Critiqués',
  recently_viewed: 'Consultés récemment',
}

export const BOOK_SHELF_ORDER: BookShelf[] = [
  'reading_now',
  'borrowed',
  'to_read',
  'favorites',
  'have_read',
  'reviewed',
  'recently_viewed',
]
