import { createBrowserRouter } from 'react-router'
import Home from '@/pages/Home'
import { BookDetailPage } from '@/pages/BookDetailPage'
import MainLayout from '@/app/layouts/MainLayout'
import Login from '@/pages/Login.tsx'
import Register from '@/pages/Register.tsx'
import { UserLibraryPage } from '@/pages/UserLibraryPage'
import { UserShelfPage } from '@/pages/UserShelfPage'
import { DiscoveryPage } from '@/pages/DiscoveryPage'
import { BookCTASandbox } from '@/pages/dev/BookCTASandbox'
import { UserLibrarySearchPage } from '@/pages/UserLibrarySearchPage'

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
        element: <UserLibraryPage />,
      },
      {
        path: '/library/search',
        element: <UserLibrarySearchPage />,
      },
      {
        path: '/library/:shelfSlug',
        element: <UserShelfPage />,
      },
      {
        path: '/discover/:categorySlug',
        element: <DiscoveryPage />,
      },
      {
        path: '/profile',
        element: <h1>Profile</h1>,
      },
      {
        path: '/login',
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
      },
      ...(import.meta.env.DEV
        ? [
            {
              path: '/dev/book-cta',
              element: <BookCTASandbox />,
            },
          ]
        : []),
    ],
  },
])
