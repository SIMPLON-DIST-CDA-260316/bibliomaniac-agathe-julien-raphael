import { Home, Library, Search, User } from 'lucide-react'

import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'

const links = [
  { to: '/', label: 'Accueil', icon: Home, end: true, loggedIn: [true, false] },
  { to: '/search', label: 'Recherche', icon: Search, loggedIn: [true, false] },
  { to: '/library', label: 'Bibliothèque', icon: Library, loggedIn: [true] },
  { to: '/profile', label: 'Profile', icon: User, loggedIn: [true] },
  { to: '/login', label: 'Se connecter', icon: User, loggedIn: [false] },
]

export default function Navbar({ isLoggedIn }: { isLoggedIn: boolean }) {
  return (
    <>
      {/* Desktop Navigation - Hidden on mobile */}
      <NavbarDesktop links={links} isLoggedIn={isLoggedIn} />

      {/* Mobile Navigation - Hidden on desktop */}
      <NavbarMobile links={links} isLoggedIn={isLoggedIn} />
    </>
  )
}
