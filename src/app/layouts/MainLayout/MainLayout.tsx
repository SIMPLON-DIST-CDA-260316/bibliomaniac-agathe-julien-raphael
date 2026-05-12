import { Outlet, ScrollRestoration } from 'react-router'

import Navbar from './Navbar.tsx'
import { useState } from 'react'

export default function MainLayout() {
  const [isLoggedIn] = useState(true) // TODO: Replace with actual authentication check

  return (
    <div className="bg-background text-text min-h-screen">
      <ScrollRestoration />
      <nav className="z-30">
        <Navbar isLoggedIn={isLoggedIn} />
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
