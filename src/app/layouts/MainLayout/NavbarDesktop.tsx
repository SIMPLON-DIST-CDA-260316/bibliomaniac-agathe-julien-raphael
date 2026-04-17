import { NavLink } from 'react-router'

export default function NavbarDesktop({
  links,
}: {
  links: { to: string; label: string; end?: boolean }[]
}) {
  return (
    <nav className="border-primary/20 hidden w-full border-b bg-[#FFEBD6] px-6 py-4 md:block">
      <div className="mx-auto flex max-w-7xl items-center justify-between">
        <div className="flex items-center">
          <h1 className="text-primary text-xl font-bold">BiblioManiac</h1>
        </div>
        <ul className="flex items-center gap-8">
          {links.map(({ to, label, end }) => (
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
