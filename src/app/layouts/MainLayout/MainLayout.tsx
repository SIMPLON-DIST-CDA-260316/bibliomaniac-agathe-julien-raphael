import { Outlet, ScrollRestoration } from 'react-router'

import Navbar from './Navbar.tsx'
import { useState } from 'react'

export default function MainLayout() {
  const [isLoggedIn] = useState(true) // TODO: Replace with actual authentication check

  return (
    <div className="bg-background text-text min-h-screen pb-[var(--navbar-height)] md:pb-0">
      <ScrollRestoration />
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
