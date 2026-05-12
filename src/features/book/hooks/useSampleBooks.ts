import { useMemo } from 'react'
import type { Book } from '../types/book.ts'

const SAMPLE_BOOKS: Book[] = [
  {
    id: 1,
    title: 'Le Seigneur des Anneaux',
    author: 'J.R.R. Tolkien',
    coverImage:
      'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=450&fit=crop',
  },
  {
    id: 2,
    title: 'Fondation',
    author: 'Isaac Asimov',
    coverImage:
      'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=450&fit=crop',
  },
  {
    id: 3,
    title: 'Dune',
    author: 'Frank Herbert',
    coverImage:
      'https://images.unsplash.com/photo-1507842217343-583b8a1a21bc?w=300&h=450&fit=crop',
  },
  {
    id: 4,
    title: 'Le Hobbit',
    author: 'J.R.R. Tolkien',
    coverImage:
      'https://images.unsplash.com/photo-1526243741027-444220a728bb?w=300&h=450&fit=crop',
  },
  {
    id: 5,
    title: 'Neuromancien',
    author: 'William Gibson',
    coverImage:
      'https://images.unsplash.com/photo-1533212467805-e5f3d5373cf5?w=300&h=450&fit=crop',
  },
  {
    id: 6,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 7,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 8,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 9,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 10,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 11,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 12,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 13,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 14,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 15,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 16,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 17,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 18,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 19,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
  {
    id: 20,
    title: 'Le Nom du Vent',
    author: 'Patrick Rothfuss',
    coverImage:
      'https://images.unsplash.com/photo-1543002588-d83cea6d0b06?w=300&h=450&fit=crop',
  },
]

export function useSampleBooks(): Book[] {
  return useMemo(() => SAMPLE_BOOKS, [])
}
