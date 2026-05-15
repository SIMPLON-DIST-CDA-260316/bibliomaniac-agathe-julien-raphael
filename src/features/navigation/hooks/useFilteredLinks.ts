import { useMemo } from 'react'
import type { NavLink } from '../types/navigation'

export function useFilteredLinks(links: NavLink[], isLoggedIn: boolean) {
  return useMemo(() => {
    return isLoggedIn
      ? links.filter(({ requiresAuth }) => requiresAuth.includes(true))
      : links.filter(({ requiresAuth }) => requiresAuth.includes(false))
  }, [links, isLoggedIn])
}
