import { Outlet, ScrollRestoration } from 'react-router'
import { useState } from 'react'

import Navbar from './Navbar.tsx'

export default function MainLayout() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  return (
    <div className="bg-background text-text min-h-screen pb-[var(--navbar-height)] md:pb-0">
      <ScrollRestoration />
      <Navbar isLoggedIn={isLoggedIn} />
      <main>
        <Outlet context={[isLoggedIn, setIsLoggedIn]} />
      </main>
    </div>
  )
}
