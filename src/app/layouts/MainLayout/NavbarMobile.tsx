import { NavLink } from 'react-router'
import {
  type NavLink as NavLinkType,
  useFilteredLinks,
} from '@/features/navigation/hooks/useFilteredLinks'

export default function NavbarMobile({
  links,
  isLoggedIn,
}: {
  links: NavLinkType[]
  isLoggedIn: boolean
}) {
  const filteredLinks = useFilteredLinks(links, isLoggedIn)

  return (
    <nav className="border-primary/20 fixed right-0 bottom-0 left-0 z-50 border-t bg-[#FFEBD6] px-2 py-2 md:hidden">
      <div className="mx-auto flex max-w-md items-center justify-around">
        {filteredLinks.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }: { isActive: boolean }) =>
              `group relative flex min-w-0 flex-1 flex-col items-center justify-center rounded-lg p-2 transition-all duration-200 ${
                isActive ? 'text-primary' : 'text-secondary hover:text-accent'
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
                  className={`mb-1 h-5 w-5 transition-transform duration-200 ${
                    isActive ? 'scale-110' : ''
                  }`}
                  strokeWidth={2.2}
                />
                <span className="truncate font-sans text-[10px] font-medium">
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
