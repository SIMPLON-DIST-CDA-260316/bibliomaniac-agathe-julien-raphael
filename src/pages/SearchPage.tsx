import { useSearchParams } from 'react-router'
import { useSearchBooks } from '@/features/book/hooks/useSearchBooks'
import { BookGrid } from '@/features/book/ui/BookGrid'
import { Spinner } from '@/shared/ui/spinner.tsx'
import { BackButton } from '@/shared/ui/back-button.tsx'
import { useEffect } from 'react'

export function SearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const { books, loading, error, search } = useSearchBooks()

  useEffect(() => {
    if (query) {
      void search(query)
    }
  }, [query, search])

  return (
    <section className="px-4 pt-4 pb-24">
      <BackButton />

      <h1 className="text-primary py-3 text-2xl font-bold">
        Résultats de recherche
      </h1>

      {query && (
        <p className="text-muted-foreground mb-4">
          Résultats pour :{' '}
          <span className="text-primary font-semibold">"{query}"</span>
        </p>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <Spinner />
        </div>
      )}

      {error && (
        <div className="rounded-lg bg-red-50 p-4 text-red-700">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {books.length > 0 && !loading && (
        <div>
          <p className="text-muted-foreground mb-4">
            {books.length} livre(s) trouvé(s)
          </p>
          <BookGrid books={books} />
        </div>
      )}

      {books.length === 0 && !loading && !error && query && (
        <p className="text-muted-foreground py-8 text-center">
          Aucun livre trouvé pour "{query}". Essayez une autre recherche.
        </p>
      )}
    </section>
  )
}
