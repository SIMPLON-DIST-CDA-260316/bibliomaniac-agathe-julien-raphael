import type { NavLink } from '../model/navigation.types'

export function filterLinksByAuth(
  links: NavLink[],
  isLoggedIn: boolean,
): NavLink[] {
  return isLoggedIn
    ? links.filter(({ requiresAuth }) => requiresAuth.includes(true))
    : links.filter(({ requiresAuth }) => requiresAuth.includes(false))
}
