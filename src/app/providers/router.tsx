import { createBrowserRouter } from 'react-router'

import { Home } from '@/pages/Home'
import { BookDetailPage } from '@/pages/BookDetailPage'
import MainLayout from '@/app/layouts/MainLayout'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/search',
        element: <h1>Search</h1>,
      },
      {
        path: '/book/:id',
        element: <BookDetailPage />,
      },
      {
        path: '/library',
        element: <h1>Library</h1>,
      },
      {
        path: '/profile',
        element: <h1>Profile</h1>,
      },
    ],
  },
])
