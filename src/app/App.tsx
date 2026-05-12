import { RouterProvider } from 'react-router/dom'

import { router } from './providers/router.tsx'

export default function App() {
  return <RouterProvider router={router} />
}
