import { Navigate, useParams } from 'react-router'
import {
  DISCOVERY_LABELS,
  slugToDiscovery,
} from '@/features/book/lib/categories'
import { useDiscoveryBooks } from '@/features/book/hooks/useDiscoveryBooks'
import { BookGrid } from '@/features/book/ui/BookGrid'

export function DiscoveryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const discoveryBooks = useDiscoveryBooks()
  const category = categorySlug ? slugToDiscovery(categorySlug) : undefined

  if (!category) return <Navigate to="/" replace />

  return (
    <section className="px-4 pt-4 pb-24">
      <h1 className="text-primary py-3 text-2xl font-bold">
        {DISCOVERY_LABELS[category]}
      </h1>
      <BookGrid books={discoveryBooks[category]} />
    </section>
  )
}
