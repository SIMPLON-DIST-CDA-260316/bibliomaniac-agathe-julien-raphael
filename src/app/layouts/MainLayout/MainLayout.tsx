import { Outlet, ScrollRestoration } from 'react-router'

import Navbar from './Navbar.tsx'

export default function MainLayout() {
  return (
    <div className="bg-background text-text min-h-screen pb-[var(--navbar-height)] md:pb-0">
      <ScrollRestoration />
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
