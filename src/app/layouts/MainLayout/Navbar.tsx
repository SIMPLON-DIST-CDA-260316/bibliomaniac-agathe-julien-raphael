import { Home, Library, User } from 'lucide-react'

import NavbarDesktop from './NavbarDesktop'
import NavbarMobile from './NavbarMobile'
import type { NavLink } from '@/features/navigation'

const links: NavLink[] = [
  {
    to: '/',
    label: 'Accueil',
    icon: Home,
    end: true,
    requiresAuth: [true, false],
  },
  {
    to: '/library',
    label: 'Bibliothèque',
    icon: Library,
    requiresAuth: [true],
  },
  { to: '/profile', label: 'Profile', icon: User, requiresAuth: [true] },
  { to: '/login', label: 'Se connecter', icon: User, requiresAuth: [false] },
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
