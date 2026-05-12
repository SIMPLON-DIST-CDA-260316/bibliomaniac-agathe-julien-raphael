import { NavLink } from 'react-router'
import { useFilteredLinks } from '@/features/navigation/hooks/useFilteredLinks'
import type { NavLink as NavLinkType } from '@/features/navigation/types/navigation'

export default function NavbarDesktop({
  links,
  isLoggedIn,
}: {
  links: NavLinkType[]
  isLoggedIn: boolean
}) {
  const filteredLinks = useFilteredLinks(links, isLoggedIn)

  return (
    <nav className="border-primary/20 hidden w-full border-b bg-[#FFEBD6] px-6 py-4 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <span className="text-primary text-xl font-bold">BiblioManiac</span>
        </div>
        <ul className="flex items-center gap-8">
          {filteredLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink
                to={to}
                end={end}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? 'text-primary underline underline-offset-4'
                      : 'text-secondary hover:text-accent'
                  }`
                }
              >
                {label}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
