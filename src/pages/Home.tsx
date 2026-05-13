import { useState } from 'react'
import { Search } from 'lucide-react'
import { useNavigate, useOutletContext } from 'react-router'
import { BookSection } from '@/features/book/ui/BookSection.tsx'
import { useDiscoveryBooks } from '@/features/book/model/useDiscoveryBooks'
import { discoveryToSlug } from '@/features/book/lib/categories'

export default function Home() {
  const { data: discoveryBooks } = useDiscoveryBooks()
  const [isLoggedIn] = useOutletContext<[boolean, (value: boolean) => void]>()
  const [searchQuery, setSearchQuery] = useState('')
  const navigate = useNavigate()

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (searchQuery.trim().length > 0) {
      void navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
    }
  }

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
  }

  return (
    <main className="bg-background flex min-h-screen flex-col items-center px-0 pb-24 sm:pb-0">
      <section className="mx-auto flex w-full max-w-none flex-col gap-4 rounded-b-3xl px-4 pt-8 pb-6 shadow-none md:px-8 lg:px-24">
        {/* Header et recherche */}
        <div>
          <span className="text-primary mb-1 text-2xl font-bold md:text-3xl xl:text-4xl 2xl:text-5xl">
            Bonjour {isLoggedIn && localStorage.getItem('username')}
          </span>
          <p className="text-muted-foreground mb-4 text-base md:text-lg xl:text-xl 2xl:text-2xl">
            Qu'allez vous lire aujourd'hui
          </p>

          <form onSubmit={handleSearchSubmit} className="relative mb-2">
            <input
              type="text"
              placeholder="Rechercher un livre, auteur ou ISBN…"
              value={searchQuery}
              onChange={handleSearchChange}
              className="border-primary/30 text-primary placeholder:text-muted-foreground focus:ring-accent w-full rounded-full border bg-white/80 py-2 pr-4 pl-12 shadow-sm focus:ring-2 focus:outline-none md:py-3 md:text-base xl:text-lg 2xl:text-xl"
            />
            <button
              type="submit"
              className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer"
              aria-label="Rechercher"
            >
              <Search className="text-primary h-5 w-5 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7" />
            </button>
          </form>
        </div>

        {/* Catégories */}
        {isLoggedIn ? (
          <div className="flex flex-col gap-4">
            <BookSection
              title="Empruntés"
              link={`/discover/${discoveryToSlug('borrowed')}`}
              books={discoveryBooks.borrowed}
            />
            <BookSection
              title="Recommandés pour vous"
              link={`/discover/${discoveryToSlug('recommended_for_you')}`}
              books={discoveryBooks.recommended_for_you}
            />
          </div>
        ) : (
          <BookSection
            title="Recommandations globales"
            link={`/discover/${discoveryToSlug('global_recommendations')}`}
            books={discoveryBooks.global_recommendations}
          />
        )}
        <BookSection
          title="Nouveautés"
          link={`/discover/${discoveryToSlug('new_releases')}`}
          books={discoveryBooks.new_releases}
        />
      </section>
    </main>
  )
}
