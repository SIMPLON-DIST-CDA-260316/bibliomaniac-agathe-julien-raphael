import { RouterProvider } from 'react-router/dom'

import { router } from '@/app/providers/router.tsx'

export default function App() {
  return <RouterProvider router={router} />
}
