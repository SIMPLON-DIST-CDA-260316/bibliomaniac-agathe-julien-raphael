import { createBrowserRouter } from 'react-router'

import Home from '@/pages/Home.tsx'
import MainLayout from '@/app/layouts/MainLayout'
import Login from '@/pages/Login.tsx'
import Register from '@/pages/Register.tsx'
import { UserLibraryPage } from '@/pages/UserLibraryPage'
import { UserShelfPage } from '@/pages/UserShelfPage'

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
        element: <h1>Book Details</h1>,
      },
      {
        path: '/library',
        element: <UserLibraryPage />,
      },
      {
        path: '/library/:shelf',
        element: <UserShelfPage />,
      },
      {
        path: '/profile',
        element: <h1>Profile</h1>,
      },
      {
        path: '/login',
<<<<<<< add-login-register-page
        element: <Login />,
      },
      {
        path: 'register',
        element: <Register />,
=======
        element: <h1>Login</h1>,
      },
      {
        path: '/register',
        element: <h1>Register</h1>,
>>>>>>> develop
      },
    ],
  },
])
