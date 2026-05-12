import type { ComponentType, SVGProps } from 'react'
import { useMemo } from 'react'

export interface NavLink {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  end?: boolean
  requiresAuth: boolean[]
}

export function useFilteredLinks(links: NavLink[], isLoggedIn: boolean) {
  return useMemo(() => {
    return isLoggedIn
      ? links.filter(({ requiresAuth }) => requiresAuth.includes(true))
      : links.filter(({ requiresAuth }) => requiresAuth.includes(false))
  }, [links, isLoggedIn])
}
