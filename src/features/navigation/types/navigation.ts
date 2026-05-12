import type { ComponentType, SVGProps } from 'react'

export interface NavLink {
  to: string
  label: string
  icon: ComponentType<SVGProps<SVGSVGElement>>
  end?: boolean
  requiresAuth: boolean[]
}
