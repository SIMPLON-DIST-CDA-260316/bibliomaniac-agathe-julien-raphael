import { useMemo } from 'react'
import type { Book } from '../model/book.types'

const SAMPLE_COVERS = [
  'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1507842217343-583b8a1a21bc?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1526243741027-444220a728bb?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1533212467805-e5f3d5373cf5?w=300&h=450&fit=crop',
  'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
]

const SAMPLE_DEFINITIONS: Array<{
  title: string
  author: string
  coverUrl: string
}> = [
  {
    title: 'Le Seigneur des Anneaux',
    author: 'J.R.R. Tolkien',
    coverUrl: SAMPLE_COVERS[0],
  },
  { title: 'Fondation', author: 'Isaac Asimov', coverUrl: SAMPLE_COVERS[1] },
  { title: 'Dune', author: 'Frank Herbert', coverUrl: SAMPLE_COVERS[2] },
  { title: 'Le Hobbit', author: 'J.R.R. Tolkien', coverUrl: SAMPLE_COVERS[3] },
  {
    title: 'Neuromancien',
    author: 'William Gibson',
    coverUrl: SAMPLE_COVERS[4],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
  {
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverUrl: SAMPLE_COVERS[5],
  },
]

const SAMPLE_BOOKS: Book[] = SAMPLE_DEFINITIONS.map((def, index) => ({
  id: String(index + 1),
  title: def.title,
  author: def.author,
  authorId: null,
  genre: null,
  language: null,
  publishedDate: null,
  coverUrl: def.coverUrl,
  pageCount: null,
  rating: null,
  copies: null,
  summary: null,
  seriesId: null,
  seriesTitle: null,
  tomeNumber: null,
  collectionId: null,
  collectionLabel: null,
}))

export function useSampleBooks(): Book[] {
  return useMemo(() => SAMPLE_BOOKS, [])
}
