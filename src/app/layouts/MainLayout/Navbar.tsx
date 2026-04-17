import { Home, Library, Search, User } from 'lucide-react'

import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'

const links = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/search', label: 'Search', icon: Search },
  { to: '/library', label: 'Library', icon: Library },
  { to: '/profile', label: 'Profile', icon: User },
]

export default function Navbar() {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <NavbarDesktop links={links} />

      {/* Mobile Navigation - Hidden on desktop */}
      <NavbarMobile links={links} />
    </>
  )
}
