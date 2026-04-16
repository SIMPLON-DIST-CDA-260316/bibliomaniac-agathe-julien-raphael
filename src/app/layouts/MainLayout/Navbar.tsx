import { NavLink } from 'react-router'

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/search', label: 'Search' },
  { to: '/library', label: 'Library' },
  { to: '/profile', label: 'Profile' },
]

export default function Navbar() {
  return (
    <ul className="flex items-center gap-4 px-4 py-3">
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
  )
}
