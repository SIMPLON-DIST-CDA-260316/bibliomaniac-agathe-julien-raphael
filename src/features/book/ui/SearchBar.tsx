import { useState } from 'react'
import type { Book } from '../types/book'
import { Search } from 'lucide-react'
import { useBookSearch } from '../hooks/useBookSearch'
import { Popover, PopoverAnchor, PopoverContent } from '@/shared/ui/popover'
import { Link } from 'react-router'

interface SearchBarProps {
  books: Book[]
  placeholder?: string
}

export function SearchBar({ books, placeholder }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const isOpen = query.trim().length > 0
  const results = useBookSearch(books, query)
  return (
    <Popover
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) setQuery('')
      }}
    >
      <PopoverAnchor asChild>
        <div className="relative mb-4">
          <input
            type="text"
            placeholder={placeholder}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="border-primary/30 text-primary placeholder:text-muted-foreground focus:ring-accent w-full rounded-full border bg-white/80 py-2 pr-4 pl-12 shadow-sm focus:ring-2 focus:outline-none md:py-3 md:text-base xl:text-lg 2xl:text-xl"
          />
          <Search className="text-primary absolute top-1/2 left-4 h-5 w-5 -translate-y-1/2 xl:h-6 xl:w-6 2xl:h-7 2xl:w-7" />
        </div>
      </PopoverAnchor>
      <PopoverContent
        align="start"
        sideOffset={6}
        onOpenAutoFocus={(e) => e.preventDefault()}
        className="max-h-80 w-(--radix-popover-trigger-width) overflow-auto"
      >
        {results.length > 0 ? (
          <>
            <ul>
              {results.slice(0, 5).map((book) => (
                <li key={book.id}>
                  <Link
                    to={`/book/${book.id}`}
                    className="active:bg-muted block rounded px-2 py-2"
                  >
                    <p className="truncate text-sm font-medium">{book.title}</p>
                    <p className="text-muted-foreground truncate text-xs">
                      {book.author}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              to={`/library/search?q=${encodeURIComponent(query)}`}
              className="bg-primary text-primary-foreground block rounded border-t px-2 py-2 text-center text-sm font-medium"
            >
              Voir les résultats
            </Link>
          </>
        ) : (
          <p>Aucun résultat</p>
        )}
      </PopoverContent>
    </Popover>
  )
}
