import { NavLink } from 'react-router'
import type { ElementType } from 'react'

export default function NavbarMobile({
  links,
}: {
  links: { to: string; label: string; icon: ElementType; end?: boolean }[]
}) {
  return (
    <nav className="border-primary/20 fixed right-0 bottom-0 left-0 z-50 border-t bg-[#FFEBD6] px-2 py-2 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {links.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }: { isActive: boolean }) =>
              `group relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-accent'
              }`
            }
          >
            {({ isActive }: { isActive: boolean }) => (
              <>
                <span
                  className={`absolute inset-0 -z-10 rounded-lg transition-all duration-200 ${
                    isActive ? 'bg-accent/10 border-accent border' : ''
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                  aria-hidden="true"
                />
                <Icon
                  className={`mb-1 h-7 w-7 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={2.2}
                />
                <span className="truncate text-xs font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
