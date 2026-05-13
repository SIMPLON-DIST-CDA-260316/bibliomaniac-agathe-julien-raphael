import { createBrowserRouter } from 'react-router'
import MainLayout from '@/app/layouts/MainLayout'
import Home from '@/pages/Home'
import { BookDetailPage } from '@/pages/BookDetailPage'
import Login from '@/pages/Login.tsx'
import Register from '@/pages/Register.tsx'
import { UserLibraryPage } from '@/pages/UserLibraryPage'
import { UserShelfPage } from '@/pages/UserShelfPage'
import { DiscoveryPage } from '@/pages/DiscoveryPage'
import { SearchPage } from '@/pages/SearchPage'
import Profile from '@/pages/Profile.tsx'
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
        element: <SearchPage />,
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
        element: <Profile />,
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
