import { Navigate, useParams } from 'react-router'
import {
  BookGrid,
  DISCOVERY_LABELS,
  slugToDiscovery,
  useDiscoveryBooks,
} from '@/features/book'

export function DiscoveryPage() {
  const { categorySlug } = useParams<{ categorySlug: string }>()
  const { data: discoveryBooks } = useDiscoveryBooks()
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
