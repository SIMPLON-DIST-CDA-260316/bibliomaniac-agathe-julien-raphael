import { NavLink } from 'react-router'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Search' },
  { to: '/library', label: 'Library' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  return (
    <nav className="border-border bg-background fixed right-0 bottom-0 left-0 z-30 h-[var(--navbar-height)] border-t md:static md:border-t-0 md:border-b">
      <ul className="flex h-full items-center justify-around px-4 md:justify-start md:gap-4">
        {links.map(({ to, label, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                `rounded px-3 py-1.5 text-sm transition-colors hover:bg-black/5 ${
                  isActive ? 'font-semibold underline' : ''
                }`
              }
            >
              {label}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
