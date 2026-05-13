import { useMemo } from 'react'
import { useSearchParams } from 'react-router'
import { BookGrid, filterBooksByQuery, useUserLibrary } from '@/features/book'
import { BackButton } from '@/shared/ui/back-button'

export function UserLibrarySearchPage() {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const { data: books } = useUserLibrary()
  const results = useMemo(
    () => filterBooksByQuery(books, query),
    [books, query],
  )
  return (
    <section className="mx-auto px-4 pt-4 pb-24">
      <div className="flex items-center gap-3 py-3">
        <BackButton />
        <h1 className="text-primary text-2xl font-bold">
          Résultats pour « {query} »
        </h1>
      </div>
      {results.length > 0 ? (
        <BookGrid books={results} />
      ) : (
        <p>Aucun livre ne correspond à votre recherche.</p>
      )}
    </section>
  )
}
