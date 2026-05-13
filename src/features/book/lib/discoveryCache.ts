import type { Book } from '../model/book.types'

interface CachedBooksData {
  data: Book[]
  timestamp: number
}

const CACHE_DURATION_MS = 1000 * 60 * 60 // 1 hour

function storageKey(category: string): string {
  return `discovery_${category}`
}

export function getCachedBooks(category: string): Book[] | null {
  if (typeof window === 'undefined') return null

  try {
    const cached = localStorage.getItem(storageKey(category))
    if (!cached) return null

    const parsed: unknown = JSON.parse(cached)

    if (
      typeof parsed === 'object' &&
      parsed !== null &&
      'data' in parsed &&
      'timestamp' in parsed
    ) {
      const { data, timestamp } = parsed as CachedBooksData

      if (Date.now() - timestamp > CACHE_DURATION_MS) {
        localStorage.removeItem(storageKey(category))
        return null
      }

      return Array.isArray(data) ? data : null
    }

    return null
  } catch {
    return null
  }
}

export function setCachedBooks(category: string, books: Book[]): void {
  if (typeof window === 'undefined') return

  try {
    const payload: CachedBooksData = {
      data: books,
      timestamp: Date.now(),
    }
    localStorage.setItem(storageKey(category), JSON.stringify(payload))
  } catch {
    // ignore storage errors (quota, private mode, etc.)
  }
}
